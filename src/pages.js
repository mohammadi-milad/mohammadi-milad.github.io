import { site } from './config.js';
import { esc, url, date, pageHeading, researchRow, featuredResearch, diagram, authorLine, icon } from './components.js';

const link = (href, label, attributes = '') => `<a href="${esc(href)}" ${attributes}>${esc(label)}</a>`;
const cvPDF = () => url('/documents/milad-mohammadi-cv.pdf');

export function home(profile, research) {
  return `
    <header class="home-intro">
      <div class="home-about">
        <div class="home-identity">
          <h1>${esc(site.name)}</h1>
          <p class="home-subtitle">AI researcher <span aria-hidden="true">·</span> Senior AI Engineer</p>
        </div>
        <p class="home-research-summary">${esc(profile.positioning.researchSummary)}</p>
        <p class="home-background">I completed my M.Sc. at the University of Tehran, working across natural language processing and computational cognitive psychology.</p>
        ${site.phd.open ? `<p class="home-availability">I am currently ${link(url('/phd/'), 'seeking a PhD position')} in language agents and human behavior modeling.</p>` : ''}
      </div>
      <aside class="home-portrait" aria-label="Portrait and CV">
        <div class="portrait-frame">
          <div class="portrait-mat">
            <img src="${url('/images/milad-mohammadi.jpg')}" width="800" height="799"
                 alt="Milad Mohammadi" fetchpriority="high">
          </div>
        </div>
        <a class="portrait-download" href="${cvPDF()}" download="Milad-Mohammadi-CV.pdf" aria-label="Download CV (PDF)">${icon('download')} <span>Download CV</span> <span class="cv-filetype" aria-hidden="true">PDF</span></a>
      </aside>
    </header>

    <section class="section-block home-research" aria-labelledby="home-publications">
      <div class="section-heading">
        <h2 id="home-publications">Publications</h2>
        <a href="${url('/research/')}">All publications <span aria-hidden="true">→</span></a>
      </div>
      <div class="featured-research-grid">
        ${research.filter(entry => entry.featured).map(entry => featuredResearch({ ...entry, status: entry.homeStatus || entry.status })).join('\n')}
      </div>
    </section>

  `;
}

export function phd(profile) {
  return `
    ${pageHeading('', 'PhD opportunities', profile.positioning.phdIntro)}

    <section class="section-block" id="research-directions" aria-labelledby="research-interests">
      <h2 id="research-interests">Research interests</h2>
      <p>${esc(profile.positioning.researchSummary)}</p>
      <div class="research-directions">
        ${profile.positioning.interests.map(interest => `
          <section>
            <h3>${esc(interest.title)}</h3>
            <p>${esc(interest.description)}</p>
          </section>
        `).join('\n')}
      </div>
    </section>

    <section class="section-block" aria-labelledby="phd-background">
      <h2 id="phd-background">Background</h2>
      <p>I completed my M.Sc. in IT Engineering at the University of Tehran in September 2026, with a GPA of 19.14/20 and a thesis graded Excellent. I worked with the NLP Lab and the Computational Cognitive Psychology Lab on language agents and digital mental health.</p>
      <p>My research includes ${link(url('/research/psycidra/'), 'PsyCIDRA')} (first-author preprint), ${link(url('/research/schemagraphsql/'), 'SchemaGraphSQL')} (second author, Findings of EACL 2026), and ${link(url('/research/emotion-recognition/'), 'multilingual emotion recognition')} (co-first author, SemEval 2025). Alongside research, I have experience in production AI engineering and graduate teaching.</p>
      <p>In 2023, I ranked first among 4,696 candidates in Iran's IT Engineering master's entrance examination. My English qualification is TOEFL iBT 5.5/6, with an ETS comparable score of 110/120 (CEFR C1).</p>
      <p class="inline-links">
        ${link(url('/cv/'), 'Interactive CV')}
        ${link(cvPDF(), 'Academic CV PDF', 'download')}
        ${link(site.links.scholar, 'Google Scholar')}
      </p>
    </section>

    <section class="section-block" aria-labelledby="phd-contact">
      <h2 id="phd-contact">Contact</h2>
      <p>I would welcome a conversation with prospective supervisors whose work overlaps with these interests.</p>
      <p>${link(`mailto:${site.email}?subject=PhD%20research%20opportunity`, site.email)}</p>
    </section>
  `;
}

export function researchIndex(profile, research) {
  return `
    <header class="page-heading publication-index-heading">
      <h1>Publication</h1>
      <a href="${esc(site.links.scholar)}">Google Scholar <span aria-hidden="true">↗</span></a>
    </header>
    <section class="collection" data-collection aria-label="Publications">
      <div class="filter-bar js-only" role="group" aria-label="Filter publications">
        <button class="filter-chip" data-filter="all" aria-pressed="true">All</button>
        <button class="filter-chip" data-filter="published" aria-pressed="false">Published</button>
        <button class="filter-chip" data-filter="preprints" aria-pressed="false">Preprints</button>
      </div>
      <div class="research-list">
        ${research.map(entry => `
          <div data-collection-item data-tags="${entry.kind === 'Research preprint' ? 'preprints' : 'published'}">
            ${researchRow(entry)}
          </div>
        `).join('\n')}
      </div>
      <p class="sr-only" data-collection-count aria-live="polite"></p>
    </section>
  `;
}

const writingDate = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function blogIndex(posts) {
  return `
    <div class="blog-index">
      <header class="blog-intro">
        <h1>Blog</h1>
        <p>Here I write about ideas, questions, and things on my mind—about AI and technology, but also life and the world beyond them.</p>
      </header>
      <section class="blog-posts" aria-label="Blog posts">
        ${posts.map(entry => `
          <article class="blog-post">
            <h2>${link(url(entry.route), entry.title)}</h2>
            <time datetime="${esc(entry.date)}">${writingDate(entry.date)}</time>
            <p>${esc(entry.description)}</p>
          </article>
        `).join('\n') || '<p class="muted">New writing will appear here soon.</p>'}
      </section>
    </div>
  `;
}

export function blogArticle(entry) {
  return `
    <article class="blog-article">
      <header class="blog-article-heading">
        <a class="back-link" href="${url('/blog/')}">← Blog</a>
        <h1>${esc(entry.title)}</h1>
        <p class="blog-date"><time datetime="${esc(entry.date)}">${writingDate(entry.date)}</time>${entry.sample ? '<span aria-hidden="true"> · </span><span>Sample post</span>' : ''}</p>
      </header>
      <div class="blog-article-layout">
        ${entry.toc.length ? `<aside class="article-toc blog-toc">
          <p id="contents-label">Contents</p>
          <nav aria-labelledby="contents-label">
            <ol>${entry.toc.map(heading => `<li><a href="#${heading.id}">${esc(heading.text)}</a></li>`).join('')}</ol>
          </nav>
        </aside>` : ''}
        <div class="prose blog-prose">${entry.html}</div>
      </div>
      <nav class="blog-article-end" aria-label="Post navigation">
        <a href="${url('/blog/')}">← All posts</a>
        <a href="#main">Back to top ↑</a>
      </nav>
    </article>
  `;
}

function appendToSection(html, heading, addition) {
  if (!addition) return html;
  if (!heading) return html + addition;
  const start = html.indexOf(`id="${heading.id}"`);
  if (start < 0) return html + addition;
  const end = html.indexOf('<h2 ', start + 1);
  return end < 0 ? html + addition : html.slice(0, end) + addition + html.slice(end);
}

export function article(entry) {
  if (entry.collection === 'research') {
    const figure = entry.mainFigure;
    return `
      <article class="article-page publication-page">
        <header class="article-heading">
          <a class="back-link" href="${url('/research/')}">← Publication</a>
          <h1>${esc(entry.title)}</h1>
          ${entry.authors ? `<p class="article-authors">${authorLine(entry.authors)}</p>` : ''}
          <p class="entry-meta">
            <span>${esc(entry.status || entry.kind)}</span>
            ${entry.role ? `<span>${esc(entry.role)}</span>` : ''}
            ${entry.date ? `<span>${date(entry.date, true)}</span>` : ''}
          </p>
          <div class="page-actions inline-links">
            ${entry.paper ? link(entry.paper, 'Paper') : ''}
            ${entry.code ? link(entry.code, 'Code & materials') : ''}
          </div>
        </header>
        <div class="prose publication-abstract">${entry.html}</div>
        <figure class="publication-figure">
          <a href="${url(figure.src)}" aria-label="View full-size research figure">
            <img src="${url(figure.src)}" width="${figure.width}" height="${figure.height}" alt="${esc(figure.alt)}">
          </a>
          <figcaption>${esc(figure.caption)}</figcaption>
        </figure>
      </article>
    `;
  }
  const back = ['CV', '/cv/'];
  const methodSection = entry.toc.find(h => /approach|workflow|project structure|documents to ranked|benchmark/i.test(h.text));
  let body = entry.html;
  if (entry.collection !== 'ideas') body = appendToSection(body, methodSection, diagram(entry.diagram));

  return `
    <article class="article-page">
      <header class="article-heading">
        <a class="back-link" href="${url(back[1])}">← ${back[0]}</a>
        <h1>${esc(entry.title)}</h1>
        ${entry.authors ? `<p class="article-authors">${authorLine(entry.authors)}</p>` : ''}
        <p class="entry-meta">
          <span>${esc(entry.status || entry.kind)}</span>
          ${entry.role ? `<span>${esc(entry.role)}</span>` : ''}
          ${entry.date ? `<span>${date(entry.date, true)}</span>` : ''}
        </p>
        <p class="page-intro">${esc(entry.description)}</p>
        <div class="page-actions inline-links">
          ${entry.paper ? link(entry.paper, 'Paper') : ''}
          ${entry.code ? link(entry.code, 'Code & materials') : ''}
          <button class="text-button js-only" data-copy-link>Copy page link</button>
        </div>
      </header>

      <div class="article-layout">
        <aside class="article-toc">
          <p>Contents</p>
          <nav aria-label="Article contents">
            ${entry.toc.map(heading => `<a href="#${heading.id}">${esc(heading.text)}</a>`).join('\n')}
          </nav>
          <a class="back-to-top" href="#main">Back to top ↑</a>
        </aside>
        <div class="prose">${body}</div>
      </div>

      <div class="article-navigation">
        <a href="${url(back[1])}">← Back to CV</a>
      </div>
    </article>
  `;
}

export function colophon() {
  return `
    ${pageHeading('', 'About this site', 'A personal website for research, teaching, and engineering.')}
    <div class="prose colophon-prose">
      <h2>Design</h2>
      <p>The site uses Source Sans 3 throughout, with a restrained forest-green palette inspired by Loki. A consistent reading column, clear publication metadata, and a small amount of gold give the pages their structure. Figures and charts sit alongside the methods and findings they explain.</p>

      <p>Source Sans 3 is an open-source typeface by Adobe, distributed under the <a href="${url('/fonts/source-sans-3-OFL.txt')}">SIL Open Font License</a>. Its normal and italic fonts are hosted with the site. Code examples use the system monospace font.</p>

      <p>The SAMPAD emblem is by <a href="https://commons.wikimedia.org/wiki/User:Oganesson007">Ali Zifan</a>, from <a href="https://commons.wikimedia.org/wiki/File:Sampad.svg">Wikimedia Commons</a>, under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Its shape and color are unchanged.</p>

      <h2>Implementation</h2>
      <p>This is a custom static website made with semantic HTML, CSS, and JavaScript, for GitHub Pages. Every page is generated as a complete HTML document. Research and project write-ups are authored in Markdown; the interactive CV is generated from structured data.</p>

      <h2>Appearance and accessibility</h2>
      <p>The site follows your system's light or dark appearance. An optional choice in the header is saved in your browser. Motion respects the reduced-motion setting on your device, and the content remains available without JavaScript.</p>

      <h2>Privacy and sources</h2>
      <p>There are no analytics, advertising trackers, or third-party font requests. External links lead to services with their own privacy policies. Research overviews link to primary sources; the original papers are the authoritative record.</p>
      <p>Profile and CV last reviewed: <time datetime="${site.updated}">6 November 2026</time>.</p>
    </div>
  `;
}
