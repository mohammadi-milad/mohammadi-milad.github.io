import { renderCVAppendix } from './cv-appendix.js';
import { cvSections } from './cv-sections.js';
import { esc, url, icon, badge, date, range, list, external, authorLine } from './components.js';

const cvPDF = () => url('/documents/milad-mohammadi-cv.pdf');
const categoryNames = Object.fromEntries(Object.entries(cvSections).map(([key, section]) => [key, section.title]));
const categoryOrder = Object.keys(categoryNames);
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const paragraph = text => text ? `<p>${esc(text)}</p>` : '';
const links = values => values.filter(Boolean).length ? `<div class="cv-entry-links">${values.filter(Boolean).map(({ href, label }) => external(href, esc(label))).join('')}</div>` : '';
const projectMatch = (entries, item) => entries.find(entry => (item.url && entry.code === item.url) || (entry.shortTitle && item.name.toLowerCase().startsWith(entry.shortTitle.toLowerCase())));
const publicLinks = (item, projects = []) => {
  const result = (item.links || []).filter(link => link.url).map(link => ({ href: link.url, label: link.name }));
  if (item.url) result.unshift({ href: item.url, label: item.name === 'IntRest' ? 'IntRest website' : item.id === 'tedx' ? 'TED profile' : 'Public source' });
  const local = projects.filter(project => (item.links || []).some(link => link.url === project.code));
  local.forEach(project => result.push({ href: url(project.route), label: `${project.shortTitle || project.title} · overview` }));
  return result;
};

const entrySymbols = {
  education: '<path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7m4-2v9"/>',
  research: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
  projects: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
  industry: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18m-12 0v3h6v-3"/>',
  awards: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8m-4-9 1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L8 8h3z"/>',
  service: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>'
};
function entryMark(entry) {
  const identity = [entry.title, entry.subtitle].join(' ');
  const organization = entry.id === 'cv-high-school' ? 'sampad.svg' : entry.id === 'cv-acm' ? 'acm.svg' : entry.id === 'cv-tedx' ? 'tedx.png' : /University of Tehran/.test(identity) ? 'university-of-tehran.png' : /University of Isfahan/.test(identity) ? 'university-of-isfahan.png' : entry.id === 'cv-intrest' ? 'intrest.svg' : entry.id === 'cv-adan-ai' ? 'adan-ai.png' : null;
  return organization
    ? `<span class="cv-entry-mark cv-organization${entry.id === 'cv-tedx' ? ' cv-organization-wide' : ''}"><img src="${url(`/images/organizations/${organization}`)}" alt="" width="32" height="32"></span>`
    : `<span class="cv-entry-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${entrySymbols[entry.category] || entrySymbols.research}</svg></span>`;
}
function detailEntry(entry, index) {
  return `<details class="cv-entry" id="${entry.id}" data-cv-entry data-order="${index}" data-theme-order="${entry.themeOrder ?? index}" data-category="${entry.category}" data-date="${esc(entry.date || '')}" data-chapter="${entry.chapter}" data-stage="${entry.stage}" data-timeline-order="${entry.timelineOrder}">
    <summary class="cv-summary">
      ${entryMark(entry)}
      <span class="cv-summary-main"><strong class="cv-entry-title">${esc(entry.title)}</strong><span class="cv-entry-subtitle">${esc(entry.subtitle)}</span></span>
      <span class="cv-entry-meta"><span class="cv-date">${esc(entry.dateLabel)}</span><span class="cv-theme-tag"><span class="sr-only">Theme: </span>${esc(cvSections[entry.category].label || categoryNames[entry.category])}</span></span>
      <span class="cv-expand" aria-hidden="true">+</span>
    </summary>
    <div class="cv-entry-body">${entry.category === 'publications' ? '' : `<p class="cv-detail-role">${esc(categoryNames[entry.category])}${entry.kicker ? ` <span aria-hidden="true">/</span> ${esc(entry.kicker)}` : ''}</p>`}${entry.body}</div>
  </details>`;
}

function futureEducation() {
  return `<details class="cv-entry" id="cv-phd-future" data-cv-future data-category="education">
    <summary class="cv-summary">
      <span class="cv-entry-mark cv-organization cv-future-mark" aria-hidden="true">?</span>
      <span class="cv-summary-main"><strong class="cv-entry-title">Looking for a PhD position</strong><span class="cv-entry-subtitle">Next academic chapter</span></span>
      <span class="cv-entry-meta"><span class="cv-date">Start in 2027</span></span><span class="cv-expand" aria-hidden="true">+</span>
    </summary>
    <div class="cv-entry-body"><p>I’m seeking a PhD position in AI starting in 2027.</p><a class="cv-future-link" href="${url('/phd/')}">Research interests &amp; PhD plans ${icon('arrow')}</a></div>
  </details>`;
}

function publicationContext(id) {
  const notes = {
    psycidra: {
      overview: 'The study evaluates interview quality and diagnostic hypotheses using PsyCPG-simulated patients and 101 interviews with human participants. PsyCIDRA uses separate agents to conduct interviews and analyze transcripts, identifying supporting, conflicting, and missing evidence for expert review.',
      contribution: 'I conceived the research idea, developed the framework, led the project, coordinated the team, and wrote the paper.'
    },
    schemagraphsql: {
      overview: 'SchemaGraphSQL combines language-model guidance with graph pathfinding to identify the tables and join paths needed to answer natural-language database questions. It represents database schemas as graphs and extracts relevant sub-schemas without task-specific fine-tuning, with experiments on BIRD and Spider 2.0 Lite.',
      contribution: 'I conducted the ablation study and contributed to writing the paper.'
    },
    'emotion-recognition-through-contrast': {
      overview: 'This paper investigates multilingual emotion recognition with GPT-4o mini through a two-stage prompting approach. Role-play rewriting creates emotional variants of an utterance, and contrastive judging compares those variants with the original to predict emotion labels or intensity without task-specific training.',
      contribution: 'I developed the idea, implemented the approach, and drafted the report.'
    },
    permedcqa: {
      overview: 'PerMedCQA introduces a benchmark of 68,138 Persian consumer medical question–answer pairs for evaluating language-model responses. The work also introduces MedJudge, a rubric-based evaluation framework assessed against expert human annotations.',
      contribution: 'I contributed to development and ran the experiments.'
    }
  };
  const note = notes[id];
  return note ? `${paragraph(note.overview)}<p><strong>My contribution:</strong> ${esc(note.contribution)}</p>` : '';
}

function transcriptPreview(id) {
  if (!['masters', 'bachelors'].includes(id)) return '';
  const masters = id === 'masters';
  const name = masters ? 'M.Sc.' : 'B.Sc.';
  const pages = masters ? 1 : 2;
  const title = `${name} transcript · English`;
  return `<details class="cv-transcript" data-cv-transcript data-transcript-title="${esc(title)}">
    <summary class="cv-transcript-trigger"><img src="${url(`/images/transcripts/${id}-english-1-thumb.jpg`)}" alt="" width="360" height="${masters ? 389 : 509}" loading="lazy"><span><strong>View English transcript</strong><span>${name} · ${pages} ${pages === 1 ? 'page' : 'pages'}${masters ? '' : ' · Unofficial translation'}</span></span><span class="cv-transcript-expand" aria-hidden="true">⤢</span></summary>
    <div class="cv-transcript-pages">${Array.from({ length: pages }, (_, index) => `<figure><img src="${url(`/images/transcripts/${id}-english-${index + 1}.jpg`)}" alt="${name} English transcript, page ${index + 1} of ${pages}" width="1343" height="${masters ? 1450 : index === 0 ? 1900 : 1020}" loading="lazy"><figcaption>Page ${index + 1} of ${pages}</figcaption></figure>`).join('')}<p class="cv-note">Personal identifiers hidden in this public preview.</p></div>
  </details>`;
}

function transcriptViewer() {
  return `<dialog class="cv-transcript-viewer" id="cv-transcript-viewer" aria-labelledby="cv-transcript-title"><header class="cv-transcript-toolbar"><h2 id="cv-transcript-title">English transcript</h2><button type="button" data-transcript-close autofocus>Close <span aria-hidden="true">×</span></button></header><div class="cv-transcript-content" data-transcript-content></div></dialog>`;
}

function buildEntries(profile, researchEntries, projectEntries) {
  const entries = [];
  for (const [index, item] of profile.publications.entries()) {
    const research = researchEntries.find(entry => entry.paper === item.url || entry.title === item.name);
    const id = research?.cvId || (research?.shortTitle ? slug(research.shortTitle) : ['psycidra', 'schemagraphsql', 'emotion-recognition'][index] || slug(item.name));
    const title = research?.shortTitle || research?.title || item.name.split(':')[0];
    entries.push({
      id: `cv-${id}`, category: 'publications', date: item.releaseDate,
      dateLabel: date(item.releaseDate), title,
      kicker: item.role || 'Publication',
      subtitle: `${item.publisher.includes('EACL') ? 'Findings of EACL 2026' : item.publisher.includes('arXiv') ? 'Preprint' : item.publisher}${item.status?.includes('under review') ? ' · under review' : ''} · ${item.role?.replace(' · equal contribution', '') || 'Publication'}`,
      search: research?.tags?.join(' '),
      body: `<div class="cv-detail-section"><h3>${esc(item.name)}</h3><p class="cv-authors">${authorLine(research?.authors || item.summary)}</p>${publicationContext(id) || paragraph(research?.description)}</div>${links([{ href: item.url, label: item.publisher.includes('arXiv') ? 'Read preprint' : 'Publisher record' }, ...(research ? [{ href: url(research.route), label: 'Research overview' }] : []), ...(research?.code ? [{ href: research.code, label: 'Code & materials' }] : [])])}`
    });
  }
  for (const item of profile.research) {
    const nlp = item.name.startsWith('NLP Lab');
    entries.push({
      id: `cv-${nlp ? 'nlp-lab' : 'cognitive-psychology-lab'}`, category: 'research', date: item.startDate, themeOrder: nlp ? 0 : 1,
      dateLabel: range(item.startDate, item.endDate), title: item.name.replace(', University of Tehran', ''),
      kicker: item.position, subtitle: `University of Tehran · ${item.position}`,
      body: `${paragraph(item.summary)}${list(item.highlights)}<p class="cv-lab-supervisor">Lab Supervisor: ${external(item.advisor.url, esc(item.advisor.name))}</p>`
    });
  }
  for (const item of profile.education) {
    const masters = item.id === 'masters';
    entries.push({
      id: `cv-${item.id}`, category: 'education', date: item.endDate, timelineDate: item.startDate,
      dateLabel: range(item.startDate, item.endDate), title: [item.studyType, item.area].filter(Boolean).join(' · '),
      kicker: masters ? 'Completed · Thesis: Excellent' : 'Completed',
      subtitle: `${item.institution} · ${item.score}${masters ? ' · Thesis: Excellent' : ''}`,
      body: `${paragraph(item.officialName)}${paragraph(item.summary)}<p class="cv-academic-score"><strong>${esc(item.score)}</strong>${masters ? ' · Thesis graded Excellent, the highest qualitative grade.' : ''}</p>${list(masters ? item.courses.filter(course => !course.startsWith('Thesis grade:')) : item.courses)}${transcriptPreview(item.id)}${links([...(masters ? [{ href: url('/research/psycidra/'), label: 'Thesis research on psychiatric assessment' }] : [])])}`
    });
  }
  for (const item of profile.work) {
    entries.push({
      id: `cv-${slug(item.name)}`, category: 'industry', date: item.startDate,
      dateLabel: range(item.startDate, item.endDate), title: item.position,
      kicker: item.endDate ? 'Previous role' : 'Current role', subtitle: `${item.name} · ${item.location}`,
      body: `${paragraph(item.summary)}${list(item.highlights)}${links(publicLinks(item))}`
    });
  }
  for (const [index, item] of profile.teaching.entries()) {
    const semester = item.startDate.length > 4 ? `${Number(item.startDate.slice(5, 7)) < 7 ? 'Spring' : 'Fall'} ${item.startDate.slice(0, 4)}` : range(item.startDate, item.endDate);
    const materials = publicLinks(item, projectEntries);
    entries.push({
      id: `cv-teaching-${slug(item.name)}-${item.startDate.slice(0, 4)}-${index + 1}`, category: 'teaching', date: item.startDate,
      dateLabel: semester, title: item.name,
      kicker: item.position, subtitle: `${item.institution} · ${item.position}`,
      search: item.instructors?.join(' '),
      body: `${paragraph(item.summary)}${item.links?.some(link => link.name === 'YouTube') ? `<a class="cv-recording" href="${esc(item.links.find(link => link.name === 'YouTube').url)}"><span class="cv-recording-play" aria-hidden="true">▷</span><span><strong>Watch the workshop</strong><span>${esc(item.name)} · University of Tehran</span></span><span aria-hidden="true">↗</span></a>` : ''}${item.instructors?.length ? `<p class="cv-note">Course instructor${item.instructors.length > 1 ? 's' : ''}: ${esc(item.instructors.join(' · '))}</p>` : ''}${list(item.highlights)}${links(materials)}`
    });
  }
  for (const item of profile.projects.filter(project => project.showInCV !== false)) {
    const project = projectMatch(projectEntries, item);
    entries.push({
      id: `cv-${item.name.startsWith('MedYar') ? 'medyar' : 'text-to-insight'}`, category: 'projects', date: item.startDate || '',
      dateLabel: item.dateLabel || (item.startDate ? range(item.startDate, item.endDate) : 'Project'), title: item.name,
      kicker: 'Selected project', subtitle: item.name.startsWith('MedYar') ? 'Specialty matching & appointment booking' : 'Natural-language data analysis',
      body: `${paragraph(item.description)}${paragraph(item.summary)}${list(item.highlights)}<div class="tag-list">${(item.keywords || []).map(badge).join('')}</div>${links([...(item.url ? [{ href: item.url, label: 'Source code' }] : []), ...(project ? [{ href: url(project.route), label: 'Project overview' }] : [])])}`
    });
  }
  for (const item of profile.volunteer) {
    const tedx = item.id === 'tedx';
    entries.push({
      id: `cv-${item.id}`, category: 'service', date: item.startDate,
      dateLabel: item.dateLabel || range(item.startDate, item.endDate), title: tedx ? item.position : item.organization,
      kicker: item.position, subtitle: tedx ? item.organization : [item.position, item.location].filter(Boolean).join(' · '),
      body: `${item.cause ? `<p class="cv-note">${esc(item.cause)}</p>` : ''}${paragraph(item.summary)}${list(item.highlights)}${links(publicLinks(item))}`
    });
  }
  for (const item of profile.awards) {
    const rank = item.id === 'national-rank';
    const distinction = item.id === 'tedx-kish' ? 'Youth Innovator Award' : 'Award';
    entries.push({
      id: `cv-${item.id}`, category: 'awards', date: item.date,
      dateLabel: date(item.date), title: rank ? '1st nationwide' : item.title,
      kicker: rank ? 'National entrance examination' : distinction, subtitle: rank ? 'IT Engineering master’s entrance exam · Iran' : `${item.awarder} · ${distinction}`,
      body: `${rank ? `${paragraph(item.title)}<div class="cv-evidence"><strong>1 / 4,696</strong><span>Candidates in the 2023 IT Engineering master’s entrance examination.</span></div>` : `<p class="cv-note">Issued by ${esc(item.awarder)} · ${esc(date(item.date, true))}</p>`}${paragraph(item.summary)}`
    });
  }
  // Seasonal project dates retain their supplied precision. The numeric key is
  // only for reading order, not an asserted month or day for those projects.
  const chronology = entry => {
    const value = entry.timelineDate || entry.date;
    const season = value.length === 4 ? /^(Spring|Summer) /.exec(entry.dateLabel)?.[1] : null;
    return Number(value.slice(0, 4)) * 10000 + (season ? { Spring: 4, Summer: 8 }[season] * 100 : Number(value.slice(5, 7) || 0) * 100 + Number(value.slice(8, 10) || 0));
  };
  [...entries].sort((a, b) => chronology(a) - chronology(b) || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || (a.category === 'research' ? b.themeOrder - a.themeOrder : 0)).forEach((entry, index) => {
    const value = entry.timelineDate || entry.date;
    entry.timelineOrder = index;
    entry.chapter = entry.id === 'cv-national-rank' ? 'transition' : value < '2018-09' ? 'before-bachelors' : value < '2023-09' ? 'bachelors' : 'masters';
    entry.stage = entry.category === 'education' ? 'degree' : value < '2024-09' ? 'year-one' : value < '2025-09' ? 'year-two' : 'year-three';
  });
  return entries.sort((a, b) => b.date.localeCompare(a.date) || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.title.localeCompare(b.title));
}

export function renderCV(profile, researchEntries = [], projectEntries = []) {
  const entries = buildEntries(profile, researchEntries, projectEntries);
  const categories = categoryOrder.filter(category => entries.some(entry => entry.category === category));
  const entryOrder = new Map(entries.map((entry, index) => [entry, index]));
  const published = profile.publications.filter(item => !item.status?.toLowerCase().includes('preprint')).length;
  return `<header class="cv-heading">
      <div class="cv-opening">
        <div><h1>Curriculum vitae</h1><p class="cv-reading-note">I prepared this page as an in-depth, detailed CV that can be viewed <strong>by theme</strong> or <strong>as a timeline</strong>. For a compact, conventional 2-page CV, please view the PDF version.</p></div>
        <a class="cv-download" href="${cvPDF()}" download="Milad-Mohammadi-CV.pdf" aria-label="Download compact CV as PDF"><span class="cv-pdf-icon" aria-hidden="true"><svg viewBox="0 0 44 52" fill="none"><path d="M8 1h20l11 11v39H8z" fill="var(--bg)" stroke="var(--outline)" stroke-width="1.2"/><path d="M28 1v12h11M15 20h17M15 25h12" stroke="var(--outline)" stroke-width="1.2"/><rect x="1" y="31" width="34" height="16" rx="2" fill="#B63732"/><text x="18" y="42.5" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing=".7">PDF</text></svg></span><span class="cv-download-copy"><strong>Download PDF</strong><span>Compact, conventional CV</span></span>${icon('download')}</a>
      </div>
      <div class="cv-highlights" aria-label="CV highlights">
        <a href="#cv-masters"><span class="cv-highlight-label">M.Sc. graduate</span><strong>19.14<span>/20 GPA</span></strong><span>University of Tehran</span><span>Thesis graded <b>Excellent</b></span></a>
        <a href="#cv-national-rank"><span class="cv-highlight-label">National entrance rank</span><strong>1st<span> of 4,696</span></strong><span>Ranked first nationwide</span><span class="cv-highlight-detail">IT Engineering · M.Sc. exam</span></a>
        <a href="#cv-group-publications" data-cv-jump="publications"><span class="cv-highlight-label">Research output</span><strong>${profile.publications.length}<span> papers</span></strong><span>${published} published</span><span>${profile.publications.length - published} preprints (under review)</span></a>
        <a href="#cv-group-industry" data-cv-jump="industry"><span class="cv-highlight-label">Industry experience</span><strong>3+<span> years</span></strong><span>Now <b>Senior AI Engineer</b></span></a>
      </div>
    </header>
    <section class="cv-workspace" data-cv data-view="theme" aria-label="CV experience">
      <div class="cv-control-deck" data-cv-controls hidden>
        <div class="cv-view-switch" role="group" aria-label="CV view"><button type="button" data-cv-view="theme" aria-pressed="true" aria-controls="cv-groups">${icon('grid')} Theme</button><button type="button" data-cv-view="timeline" aria-pressed="false" aria-controls="cv-groups">${icon('timeline')} Timeline</button></div>
        <div class="cv-actions"><button type="button" data-cv-expand>Expand all</button><span aria-hidden="true">/</span><button type="button" data-cv-collapse>Collapse all</button></div>
      </div>
      <p class="sr-only" data-cv-view-status role="status" aria-live="polite"></p>
      <div class="cv-opportunity" data-cv-opportunity hidden><div class="cv-next-label">Next chapter<span class="cv-status-dot" aria-hidden="true"></span></div><div><h2>Looking for a PhD position</h2><p>Language agents · human behavior modeling · human–AI interaction</p></div><a href="${url('/phd/')}">Research interests ${icon('arrow')}</a></div>
      <div class="cv-groups" id="cv-groups" data-cv-groups>${categories.map((category, index) => `<section class="cv-group" data-cv-group="${category}" aria-labelledby="cv-group-${category}"><header class="cv-group-header"><span class="cv-chapter-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h2 class="cv-group-heading" id="cv-group-${category}">${categoryNames[category]}</h2></header><div class="cv-entries">${cvSections[category].intro ? `<p class="cv-group-intro">${esc(cvSections[category].intro)}</p>` : ''}${category === 'education' ? futureEducation() : ''}${entries.filter(entry => entry.category === category).sort((a, b) => (a.themeOrder ?? entryOrder.get(a)) - (b.themeOrder ?? entryOrder.get(b))).map(entry => detailEntry(entry, entryOrder.get(entry))).join('')}</div></section>`).join('')}</div>
    </section>
    ${transcriptViewer()}
    ${renderCVAppendix(profile)}`;
}
