import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { site } from '../src/config.js';
import { layout, esc, url, pageHeading, button } from '../src/components.js';
import { home, phd, researchIndex, blogIndex, blogArticle, article, colophon } from '../src/pages.js';
import { renderCV } from '../src/cv.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const finalDist = path.join(root, 'dist');
const dist = await fs.mkdtemp(path.join(root, '.dist-build-'));
const profile = JSON.parse(await fs.readFile(path.join(root, 'src/data/profile.json'), 'utf8'));
const entries = {};
for (const collection of ['research', 'projects', 'blog']) {
  entries[collection] = [];
  const files = (await fs.readdir(path.join(root, 'content', collection)).catch(error => { if (error.code === 'ENOENT') return []; throw error; })).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  for (const file of files) {
    const { data, content } = matter(await fs.readFile(path.join(root, 'content', collection, file), 'utf8'));
    if (data.draft) continue;
    if (!data.title || !data.description) throw new Error(`${file}: title and description are required`);
    if (collection === 'blog' && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date)) throw new Error(`${file}: blog posts require a valid quoted YYYY-MM-DD date`);
    const slug = file.slice(0, -3);
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid content filename: ${file}`);
    const toc = [], ids = new Map();
    const renderer = new marked.Renderer();
    renderer.heading = function ({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = text.replace(/<[^>]*>/g, '');
      const initial = plain.toLowerCase().replace(/&[^;]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      const n = (ids.get(initial) || 0) + 1; ids.set(initial, n);
      const id = n > 1 ? `${initial}-${n}` : initial;
      if (depth === 2) toc.push({ id, text: plain });
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };
    let html = marked.parse(content, { renderer, gfm: true }).replace(/<pre>/g, '<pre tabindex="0" aria-label="Code block">');
    html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.base}/`);
    const prefix = `/${collection}/`;
    entries[collection].push({ ...data, date: data.date ? String(data.date) : '', slug, collection, route: `${prefix}${slug}/`, html, toc });
  }
  entries[collection].sort((a,b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));
}
// Keep teaching resources first in the workshop collection, independent of undated prototypes.
entries.projects.sort((a,b) => Number(b.kind === 'Teaching project') - Number(a.kind === 'Teaching project') || a.title.localeCompare(b.title));
await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.cp(path.join(root, 'public'), dist, { recursive: true });
for (const filename of ['site.css', 'cv.css', 'cv-appendix.css', 'cv-skills.css', 'site.js', 'cv-client.js', 'cv-sections.js', 'cv-transcripts.js']) await fs.copyFile(path.join(root, 'src', filename), path.join(dist, filename));
const routes = [];
async function writePage(route, title, description, body, options = {}) {
  const filename = route.endsWith('.html') ? route : `${route}index.html`;
  const target = path.join(dist, filename);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, layout({ title, description, route, body, ...options }));
  if (!options.noindex) routes.push(route);
}
await writePage('/', null, site.description, home(profile, entries.research), { schema: { '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: site.origin, email: `mailto:${site.email}`, jobTitle: 'AI Researcher and Senior AI Engineer', alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'University of Tehran' }, { '@type': 'CollegeOrUniversity', name: 'University of Isfahan' }], sameAs: [site.links.scholar, site.links.github, site.links.linkedin] } });
await writePage('/phd/', 'PhD opportunities', 'Seeking PhD opportunities in language agents, human behavior modeling, behavioral simulation, and human–AI interaction.', phd(profile));
await writePage('/research/', 'Publication', 'Published papers and preprints by Milad Mohammadi.', researchIndex(profile, entries.research));
await writePage('/cv/', 'Interactive CV', 'Explore Milad Mohammadi’s academic CV by timeline or theme, with expandable research, education, engineering, and teaching experience.', renderCV(profile, entries.research, entries.projects));
await writePage('/blog/', 'Blog', 'Ideas, questions, and notes on AI, technology, life, and the world beyond them.', blogIndex(entries.blog));
await writePage('/colophon/', 'About this site', 'Design, accessibility, privacy, and how this personal website is built.', colophon());
for (const entry of Object.values(entries).flat()) await writePage(entry.route, entry.shortTitle || entry.title, entry.description, entry.collection === 'blog' ? blogArticle(entry) : article(entry), { article: true, schema: { '@context': 'https://schema.org', '@type': entry.collection === 'research' ? 'ScholarlyArticle' : 'Article', headline: entry.title, description: entry.description, ...(entry.date ? { datePublished: entry.date } : {}), url: `${site.origin}${url(entry.route)}`, ...(entry.paper ? { sameAs: entry.paper } : {}) } });
await writePage('/404.html', 'Page not found', 'This page could not be found.', pageHeading('404 / An uncharted branch', 'This path ends here.', 'The page may have moved, or the address may be incomplete.', `<div class="page-actions">${button('Return home →', url('/'))}${button('All publications →', url('/research/'), true)}</div>`), { noindex: true });
for (const [old, next] of [['/publications/', '/research/'], ['/about/', '/'], ['/projects/', '/blog/'], ['/ideas/', '/blog/'], ['/repositories/', '/cv/']]) {
  const file = path.join(dist, old, 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved — Milad Mohammadi</title><link rel="canonical" href="${site.origin}${url(next)}"><meta http-equiv="refresh" content="0;url=${url(next)}"></head><body><p>This page has moved to <a href="${url(next)}">${url(next)}</a>.</p></body></html>`);
}
await fs.mkdir(path.join(dist, 'assets/pdf'), { recursive: true });
await fs.copyFile(path.join(dist, 'documents/milad-mohammadi-cv.pdf'), path.join(dist, 'assets/pdf/MiladMohammadi_CV.pdf'));
await fs.writeFile(path.join(dist, '.nojekyll'), '');
await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${site.origin}${url(route)}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}${url('/sitemap.xml')}\n`);
const feedItems = Object.values(entries).flat().filter(e => e.date).sort((a,b) => b.date.localeCompare(a.date));
await fs.writeFile(path.join(dist, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Milad Mohammadi — research and writing</title><link>${site.origin}${url('/')}</link><description>${esc(site.description)}</description><language>en</language>${feedItems.map(e => `<item><title>${esc(e.title)}</title><link>${site.origin}${url(e.route)}</link><guid>${site.origin}${url(e.route)}</guid><description>${esc(e.description)}</description><pubDate>${new Date(e.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`);
await fs.writeFile(path.join(dist, 'site-manifest.json'), JSON.stringify({ routes, base: site.base, entries: Object.values(entries).flat().map(({ route, title }) => ({ route, title })) }, null, 2));
// Assemble in a separate directory so preview requests always see a complete build.
const previous = path.join(root, `.dist-previous-${process.pid}`);
await fs.rename(finalDist, previous).catch(error => { if (error.code !== 'ENOENT') throw error; });
try {
  await fs.rename(dist, finalDist);
} catch (error) {
  await fs.rename(previous, finalDist).catch(() => {});
  throw error;
}
await fs.rm(previous, { recursive: true, force: true });
console.log(`Built ${routes.length} static pages + 404 and legacy redirects in dist/`);
