import { site } from './config.js';
export const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const url = (route = '/') => `${site.base}${route}`;
export const arrow = '<span aria-hidden="true">↗</span>';
export const icon = (name) => {
  const paths = { globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>', arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>', timeline: '<path d="M6 3v18m4-16h10m-10 7h10m-10 7h10"/><circle cx="6" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="19" r="2"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>' };
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</svg>`;
};
export const mark = `<svg class="monogram" aria-hidden="true" viewBox="0 0 42 42" fill="none"><path d="M7 31V11l14 15 14-15v20M14 31V17m14 14V17" stroke="currentColor" stroke-width="1.7"/><path d="M4 36h34" stroke="var(--gold)"/></svg>`;
export const button = (label, href, secondary = false, extra = '') => `<a class="button ${secondary ? 'button-secondary' : ''}" href="${href}" ${extra}>${label}</a>`;
export const badge = text => `<span class="badge">${esc(text)}</span>`;
export const date = (str, long = false) => str ? new Date(`${str.slice(0,10)}${str.length === 4 ? '-01-01' : str.length === 7 ? '-01' : ''}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', ...(str.length > 4 ? { month: long ? 'long' : 'short' } : {}), timeZone: 'UTC' }) : 'Present';
export const range = (a, b) => a === b ? date(a) : `${date(a)} – ${date(b)}`;
export const list = items => items?.length ? `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
export const authorLine = (names = '') => esc(names).replace(/\bMilad Mohammadi\b/g, '<strong class="self-author">Milad Mohammadi</strong>');
export const external = (href, label) => `<a href="${esc(href)}">${label}</a>`;
export function diagram(type = 'agent', small = false) {
  const configurations = {
    psycidra: { labels: ['Interview', 'Evidence', 'Reasoning'], caption: 'Two agents. One structured conversation.' },
    schema: { labels: ['Question', 'Schema graph', 'SQL'], caption: 'Find the relevant path through a database.' },
    emotion: { labels: ['Text', 'Role-play', 'Contrast'], caption: 'Emotion recognition through task decomposition.' },
    medical: { labels: ['Questions', 'Responses', 'Evaluation'], caption: 'Evaluating language models in Persian.' },
    retrieval: { labels: ['Documents', 'Index', 'Retrieve'], caption: 'Make retrieval visible, one component at a time.' },
    agent: { labels: ['Question', 'Tools', 'Response'], caption: 'From language to an executable workflow.' }
  };
  const d = configurations[type] || configurations.agent;
  if (small) return `<div class="mini-diagram mini-${esc(type)}" aria-hidden="true"><span></span><i></i><span></span><i></i><span></span></div>`;
  return `<figure class="process-figure"><div class="process-diagram">${d.labels.map((l, i) => `${i ? '<span class="process-arrow" aria-hidden="true">→</span>' : ''}<div><strong>${esc(l)}</strong></div>`).join('')}</div><figcaption>${d.caption} <span>Conceptual overview</span></figcaption></figure>`;
}
export function profileIcon(name) {
  const symbols = {
    scholar: '<path d="M12 0 0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0Z"/><circle cx="12" cy="17" r="7"/>',
    github: '<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/>',
    linkedin: '<rect x="2" y="2" width="20" height="20" rx="2"/><g fill="var(--bg)"><circle cx="7" cy="7" r="1.5"/><path d="M5.7 10h2.6v9H5.7Zm4.8 0H13v1.2c.5-.9 1.4-1.5 2.8-1.5 2.6 0 3.5 1.6 3.5 4.2V19h-2.6v-4.6c0-1.3-.2-2.3-1.6-2.3S13 13.2 13 14.4V19h-2.5Z"/></g>'
  };
  return `<svg class="profile-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${symbols[name]}</svg>`;
}
export function contact(showCopyright = false) {
  const profiles = [['scholar', 'Google Scholar'], ['github', 'GitHub'], ['linkedin', 'LinkedIn']];
  return `<div class="footer-contact" id="contact">${showCopyright ? '<small class="footer-copyright">© 2026 Milad Mohammadi, All Rights Reserved</small>' : ''}<nav class="footer-profiles" aria-label="Contact and profiles"><a class="profile-link" href="mailto:${site.email}" aria-label="Email Milad Mohammadi" title="${esc(site.email)}">${icon('mail')}</a>${profiles.map(([key, label]) => `<a class="profile-link" href="${esc(site.links[key])}" aria-label="${label}" title="${label}">${profileIcon(key)}</a>`).join('')}</nav></div>`;
}
export function layout({ title, description = site.description, route = '/', body, article = false, image = '/images/milad-mohammadi.jpg', noindex = false, schema }) {
  const nav = [['/', 'Home'], ['/research/', 'Publication'], ['/cv/', 'CV'], ...(site.blog.enabled ? [['/blog/', 'Blog']] : []), ['/phd/', site.phd.open ? 'I’m looking for a PhD position' : 'PhD research']];
  const active = path => path === '/' ? route === '/' : route.startsWith(path);
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — Language agents & human behavior`;
  const canonical = `${site.origin}${url(route)}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}">${noindex ? '<meta name="robots" content="noindex">' : ''}<link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.origin}${url(image)}"><meta name="twitter:card" content="summary"><link rel="icon" href="${url('/favicon.svg?v=echo-mm')}" type="image/svg+xml"><link rel="alternate" type="application/rss+xml" title="Milad Mohammadi — research and writing" href="${url('/feed.xml')}"><script>try{const t=localStorage.getItem('appearance');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script><link rel="preload" href="${url('/fonts/source-sans-3-latin-normal.woff2')}" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${url('/site.css')}">${route === '/cv/' ? `<link rel="stylesheet" href="${url('/cv.css')}">` : ''}<script type="module" src="${url('/site.js')}"></script>${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : ''}</head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell header-shell"><header class="site-header"><a class="brand" href="${url('/')}" aria-label="Milad Mohammadi, home">Milad Mohammadi</a><button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">${icon('menu')}<span class="sr-only">Navigation menu</span></button><nav id="primary-nav" class="primary-nav" aria-label="Main navigation">${nav.map(([href,label]) => `<a href="${url(href)}"${href === '/phd/' ? ' class="nav-phd"' : ''} ${active(href) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="theme-control">${icon('sun')}<label class="sr-only" for="appearance">Color theme</label><select id="appearance"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></div></header></div><div class="site-shell${route === '/' ? ' home-shell' : route === '/cv/' ? ' cv-shell' : ''}"><main id="main" tabindex="-1">${body}</main>${route === '/404.html' ? '' : `<footer class="site-footer">${contact(route === '/')}</footer>`}</div></body></html>`;
}
export const pageHeading = (_eyebrow, title, intro, extra = '') => `<header class="page-heading"><h1>${title}</h1>${intro ? `<p class="page-intro">${intro}</p>` : ''}${extra}</header>`;
export function researchRow(entry) {
  const status = String(entry.status || entry.kind || '');
  const statusYear = status.match(/\b((?:19|20)\d{2})\s*$/)?.[1];
  const year = statusYear || entry.date?.slice(0, 4) || '';
  const venue = statusYear ? status.slice(0, status.lastIndexOf(statusYear)).replace(/[\s·,–-]+$/, '') : status;
  return `<article class="research-row">
    <div class="publication-heading">
      <h3><a href="${url(entry.route)}">${esc(entry.title)}</a></h3>
      <p class="publication-venue"><span>${esc(venue)}</span>${year ? `<span class="publication-year">${esc(year)}</span>` : ''}</p>
    </div>
    ${entry.authors ? `<p class="research-authors">${authorLine(entry.authors)}</p>` : ''}
    <div class="research-links"><a href="${url(entry.route)}">Overview <span aria-hidden="true">→</span></a>${entry.paper ? external(entry.paper, 'Paper') : ''}${entry.code ? external(entry.code, 'Code') : ''}</div>
  </article>`;
}

function researchSketch(type) {
  if (type === 'psycidra') return `<svg viewBox="0 0 400 144" fill="none" aria-hidden="true" focusable="false">
    <g class="sketch-rule" stroke-width="1.2">
      <rect x="25" y="29" width="112" height="73" rx="4"/>
      <rect x="263" y="29" width="112" height="73" rx="4"/>
      <path d="M137 66h39m48 0h39m-6-5 6 5-6 5"/>
      <rect x="181" y="45" width="38" height="43" rx="2"/>
      <path d="M189 56h22m-22 8h22m-22 8h14"/>
    </g>
    <g class="sketch-accent" stroke-width="1.5">
      <path d="M42 44h57a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H55l-9 7v-7h-4a5 5 0 0 1-5-5V49a5 5 0 0 1 5-5Z"/>
      <path d="M79 78h35m-35 7h25M278 49l4 4 7-8m-11 22 4 4 7-8m8-13h28m-28 18h40m-59 17h44"/>
    </g>
    <g class="sketch-label" text-anchor="middle"><text x="81" y="123">Interview agent</text><text x="200" y="110">Evidence</text><text x="319" y="123">Diagnostic agent</text></g>
  </svg>`;
  return `<svg viewBox="0 0 400 144" fill="none" aria-hidden="true" focusable="false">
    <g class="sketch-rule" stroke-width="1.2">
      <path d="M105 38h69m52 0h69M105 106h69m52 0h69M79 51v42m121-42v42m121-42v42M105 38l69 68m52 0 69-68"/>
      <rect x="53" y="25" width="52" height="26" rx="3"/><rect x="174" y="25" width="52" height="26" rx="3"/>
      <rect x="295" y="25" width="52" height="26" rx="3"/><rect x="53" y="93" width="52" height="26" rx="3"/>
      <rect x="174" y="93" width="52" height="26" rx="3"/><rect x="295" y="93" width="52" height="26" rx="3"/>
    </g>
    <path class="sketch-accent" stroke-width="2" d="M105 38h69m26 13v42m26 13h69"/>
    <g class="sketch-selected" stroke-width="1.5"><rect x="53" y="25" width="52" height="26" rx="3"/><rect x="174" y="25" width="52" height="26" rx="3"/><rect x="174" y="93" width="52" height="26" rx="3"/><rect x="295" y="93" width="52" height="26" rx="3"/></g>
    <g class="sketch-table" stroke-width="1.2"><path d="M65 35h28m-28 6h19m102-6h28m-28 6h19m102-6h28m-28 6h19M65 103h28m-28 6h19m102-6h28m-28 6h19m102-6h28m-28 6h19"/></g>
    <circle class="sketch-dot" cx="139" cy="38" r="3"/><circle class="sketch-dot" cx="200" cy="72" r="3"/><circle class="sketch-dot" cx="260" cy="106" r="3"/>
  </svg>`;
}

export function featuredResearch(entry) {
  const title = entry.shortTitle || entry.title;
  const subtitle = entry.title.startsWith(`${title}:`) ? entry.title.slice(title.length + 1).trim() : '';
  return `<article class="research-feature">
    <div class="research-feature-sketch">${researchSketch(entry.diagram)}</div>
    <p class="research-feature-meta"><span>${esc(entry.status || entry.kind)}</span>${entry.role ? `<span>${esc(entry.role)}</span>` : ''}</p>
    <h3><a href="${url(entry.route)}">${esc(title)} <span aria-hidden="true">↗</span></a></h3>
    ${subtitle ? `<p class="research-feature-title">${esc(subtitle)}</p>` : ''}
    <p class="research-feature-description">${esc(entry.description)}</p>
    <div class="research-links"><a href="${url(entry.route)}">Read overview <span aria-hidden="true">→</span></a>${entry.paper ? external(entry.paper, 'Paper') : ''}${entry.code ? external(entry.code, 'Code') : ''}</div>
  </article>`;
}
