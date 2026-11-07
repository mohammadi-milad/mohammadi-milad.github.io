import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'site-manifest.json'), 'utf8'));
const walk = async dir => (await Promise.all((await fs.readdir(dir, {withFileTypes:true})).map(async entry => entry.isDirectory() ? walk(path.join(dir,entry.name)) : path.join(dir,entry.name)))).flat();
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const errors = [];
const documents = new Map();
const decode = value => value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
for (const file of htmlFiles) {
  const html = await fs.readFile(file,'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${path.relative(root,file)}: duplicate IDs`);
  if (/\b(?:undefined|NaN)\b/.test(html)) errors.push(`${file}: unresolved output`);
  if (!html.includes('http-equiv="refresh"')) {
    if ([...html.matchAll(/<h1(?:\s|>)/g)].length !== 1) errors.push(`${file}: expected one h1`);
    if (!html.includes('name="description"')) errors.push(`${file}: missing description`);
  }
  documents.set(file, {html,ids});
}
let checked = 0;
for (const [file,{html}] of documents) {
  const route = path.relative(root,file).split(path.sep).join('/');
  const currentURL = new URL(`${manifest.base}/${route}`, 'http://static.local');
  for (const [,attribute,raw] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    const href = decode(raw);
    if (/^(?:https?:|mailto:|data:|tel:)/i.test(href)) continue;
    if (!href) { errors.push(`${route}: empty ${attribute}`); continue; }
    const targetURL = new URL(href,currentURL);
    let targetPath = decodeURIComponent(targetURL.pathname);
    if (manifest.base && !targetPath.startsWith(`${manifest.base}/`)) { errors.push(`${route}: path escaped base ${href}`); continue; }
    targetPath = targetPath.slice(manifest.base.length);
    let target = path.join(root,targetPath);
    try {
      if ((await fs.stat(target)).isDirectory()) target = path.join(target,'index.html');
      await fs.access(target);
      if (targetURL.hash && documents.has(target) && !documents.get(target).ids.includes(decodeURIComponent(targetURL.hash.slice(1)))) errors.push(`${route}: missing anchor ${href}`);
    } catch { errors.push(`${route}: missing local file ${href}`); }
    checked++;
  }
}
for (const name of ['sitemap.xml','robots.txt','feed.xml','.nojekyll','documents/milad-mohammadi-cv.pdf']) {
  try { await fs.access(path.join(root,name)); } catch { errors.push(`Missing ${name}`); }
}
if(errors.length){ console.error(errors.join('\n'));process.exit(1); }
console.log(`Checked ${htmlFiles.length} HTML files and ${checked} internal links/assets. No broken paths, anchors, duplicate IDs, or unresolved output.`);
