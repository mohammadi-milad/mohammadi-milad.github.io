import { cvVisual } from './cv-visuals.js';
import { esc, url, icon, badge, date, range, list, external } from './components.js';

const cvPDF = () => url('/documents/milad-mohammadi-cv.pdf');
const categoryNames = { research: 'Research', education: 'Education', industry: 'Industry', teaching: 'Teaching', projects: 'Projects', service: 'Service', awards: 'Awards' };
const categoryOrder = Object.keys(categoryNames);
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const paragraph = text => text ? `<p>${esc(text)}</p>` : '';
const links = values => values.filter(Boolean).length ? `<div class="cv-entry-links">${values.filter(Boolean).map(({ href, label }) => external(href, esc(label))).join('')}</div>` : '';
const projectMatch = (entries, item) => entries.find(entry => (item.url && entry.code === item.url) || (entry.shortTitle && item.name.toLowerCase().startsWith(entry.shortTitle.toLowerCase())));
const publicLinks = (item, projects = []) => {
  const result = (item.links || []).filter(link => link.url).map(link => ({ href: link.url, label: link.name }));
  if (item.url) result.unshift({ href: item.url, label: item.name === 'IntRest' ? 'IntRest website' : item.organization?.startsWith('TEDx') ? 'TED profile' : 'Public source' });
  const local = projects.filter(project => (item.links || []).some(link => link.url === project.code));
  local.forEach(project => result.push({ href: url(project.route), label: `${project.shortTitle || project.title} · overview` }));
  return result;
};

const chapterNotes = { '2026': 'Research into practice', '2025': 'Publishing, building, teaching', '2024': 'Two labs. A wider perspective.', '2023': 'A new academic chapter', '2019': 'Learning through teaching', '2018': 'The foundations', undated: 'Projects without a specified date' };
const entryStories = {
  'cv-psycidra': ['From a conversation to structured clinical evidence.', 'A dual-agent framework for psychiatric interviewing and diagnostic reasoning.', true],
  'cv-schemagraphsql': ['Finding the right path through a database.', 'Graph algorithms for efficient schema linking in Text-to-SQL.', true],
  'cv-emotion-recognition-through-contrast': ['Reading emotion across languages.', 'Role-play and contrastive judging for multilingual emotion recognition.', true],
  'cv-permedcqa': ['Evaluating AI in the language people use.', 'Persian medical question answering and rubric-based evaluation.', false],
  'cv-masters': ['Where language agents meet cognitive psychology.', 'An interdisciplinary thesis, graded Excellent.', true],
  'cv-bachelors': ['The foundations in computer engineering.', 'University of Isfahan · IT major.', true],
  'cv-intrest': ['Taking language agents into daily life.', 'Leading AI services from architecture to production integration.', true],
  'cv-adan-ai': ['Making agentic systems work in production.', 'Banking assistants, Persian document retrieval, and evaluation.', true],
  'cv-cognitive-psychology-lab': ['A bridge between two disciplines.', 'Initiated a research track on language models for digital mental health.', true],
  'cv-nlp-lab': ['Research as a collaborative practice.', 'Language-agent research and mentoring incoming M.Sc. students.', false],
  'cv-national-rank': ['A new chapter at the University of Tehran.', 'Ranked first among 4,696 candidates in the national master’s exam.', true],
  'cv-tedx': ['Creating a place for ideas to meet.', 'Founded TEDxUniversityOfIsfahan.', true],
  'cv-text-to-insight': ['From a question to an analysis.', 'A team-built course prototype connecting SQL, Python, plots, and reports.', true],
  'cv-medyar': ['From a conversation to an appointment.', 'A ReAct-style prototype for specialty matching and appointment booking.', false],
  'cv-teaching-large-language-models-2025-3': ['Teaching agents by building them.', 'From prompt-router baselines to ReAct agents, with a hands-on LangGraph workshop.', true],
  'cv-teaching-natural-language-processing-2026-1': ['From teaching to leading a teaching team.', 'Co-chief TA for graduate natural language processing.', true],
  'cv-teaching-artificial-intelligence-digital-transformation-2025-4': ['Making AI accessible across disciplines.', 'Two large-venue lectures for more than 500 students.', false]
};
function detailEntry(entry, index) {
  const story = entryStories[entry.id];
  const featured = !!story?.[2];
  const plainBody = entry.body.replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[entity]));
  const search = [entry.title, entry.subtitle, entry.kicker, entry.dateLabel, entry.search || '', plainBody].join(' ').replace(/\s+/g, ' ');
  const visual = cvVisual(entry.id).replace(/<figure class="([^"]+)">/, '<span class="$1 cv-preview">').replace('<figcaption>', '<span class="cv-visual-caption">').replace('</figcaption>', '</span>').replace('</figure>', '</span>');
  return `<details class="cv-entry${featured ? ' cv-entry-featured' : ''}" id="${entry.id}" data-cv-entry data-featured="${featured}" data-side="${index % 2 ? 'right' : 'left'}" data-category="${entry.category}" data-date="${esc(entry.date || '')}" data-year="${esc(entry.date?.slice(0, 4) || 'undated')}" data-search="${esc(search.toLocaleLowerCase())}" style="view-transition-name:${entry.id}">
    <summary class="cv-summary">
      <span class="cv-date">${esc(entry.dateLabel)}</span>
      <span class="cv-summary-main"><span class="cv-kicker"><span class="cv-category-dot" aria-hidden="true"></span>${esc(categoryNames[entry.category])}${entry.kicker ? ` <span aria-hidden="true">/</span> ${esc(entry.kicker)}` : ''}</span><strong class="cv-entry-title">${esc(entry.title)}</strong><span class="cv-entry-subtitle">${esc(entry.subtitle)}</span>${story ? `<span class="cv-entry-deck">${esc(story[1])}</span>` : ''}</span>
      ${visual}<span class="cv-disclosure"><span class="cv-disclosure-label"><span class="cv-closed-label">Explore</span><span class="cv-open-label">Close</span></span><span class="cv-expand" aria-hidden="true">+</span><span class="sr-only">Details</span></span>
    </summary>
    <div class="cv-entry-body">${story ? `<p class="cv-detail-lead">${esc(story[0])}</p>` : ''}${entry.body}<a class="cv-entry-permalink" href="#${entry.id}" aria-label="Link to ${esc(entry.title)}">Link to this entry <span aria-hidden="true">↗</span></a></div>
  </details>`;
}

function researchContext(id) {
  const notes = {
    psycidra: [
      ['Approach', 'An interviewer gathers evidence through conversation; a second agent weighs supporting, contradicting, and missing evidence for expert review.'],
      ['Evaluation', '81 held-out simulated profiles and a separate feasibility study with 101 adult volunteers. These studies assess different outcomes.'],
      ['Scope', 'First-author M.Sc. thesis research. A preprint and feasibility study; clinical benefit has not been established.']
    ],
    schemagraphsql: [
      ['Approach', 'Represent database tables and their relationships as a graph. Language-model guidance selects endpoints; pathfinding recovers relevant join paths.'],
      ['Evaluation', 'Experiments on BIRD development and Spider 2.0 Lite. The method needs no task-specific fine-tuning; coverage and input cost remain a tradeoff.'],
      ['Contribution', 'Second author of this collaborative work, published in Findings of EACL 2026.']
    ],
    'emotion-recognition-through-contrast': [
      ['Approach', 'Role-play rewriting creates emotional variants of an utterance. Contrastive judging compares those variants with the original, without task-specific training.'],
      ['Finding', 'Results were around the shared-task baseline, with substantial variation across languages. Rewriting can introduce or erase emotional cues.'],
      ['Contribution', 'Co-first author, with equal contribution explicitly recorded in the paper.']
    ],
    permedcqa: [
      ['Benchmark', '68,138 Persian consumer medical question–answer pairs, with an evaluation rubric checked against expert annotations.'],
      ['Contribution', 'Second author. The benchmark examines answer quality in Persian; it does not establish clinical effectiveness.']
    ]
  };
  return notes[id] ? `<dl class="cv-research-notes">${notes[id].map(([label, text]) => `<div><dt>${label}</dt><dd>${text}</dd></div>`).join('')}</dl>` : '';
}

function buildEntries(profile, researchEntries, projectEntries) {
  const entries = [];
  for (const [index, item] of profile.publications.entries()) {
    const research = researchEntries.find(entry => entry.paper === item.url || entry.title === item.name);
    const statusLabel = item.status?.toLowerCase().includes('under review') ? 'Under review' : item.status;
    const id = research?.shortTitle ? slug(research.shortTitle) : ['psycidra', 'schemagraphsql', 'emotion-recognition'][index] || slug(item.name);
    const title = research?.shortTitle || item.name.split(':')[0];
    entries.push({
      id: `cv-${id}`, category: 'research', date: item.releaseDate,
      dateLabel: date(item.releaseDate), title,
      kicker: item.role || 'Publication',
      subtitle: `${item.publisher}${statusLabel ? ` · ${statusLabel}` : ''}`,
      search: research?.tags?.join(' '),
      body: `<div class="cv-detail-section"><h3>${esc(item.name)}</h3>${researchContext(id) || paragraph(research?.description)}<p class="cv-authors">${esc(item.summary)}</p>${item.status ? paragraph(item.status) : ''}</div>${links([{ href: item.url, label: item.publisher.includes('arXiv') ? 'Read preprint' : 'Publisher record' }, ...(research ? [{ href: url(research.route), label: 'Research overview' }] : []), ...(research?.code ? [{ href: research.code, label: 'Code & materials' }] : [])])}`
    });
  }
  for (const [index, item] of profile.research.entries()) {
    entries.push({
      id: `cv-${index === 0 ? 'nlp-lab' : 'cognitive-psychology-lab'}`, category: 'research', date: item.startDate,
      dateLabel: range(item.startDate, item.endDate), title: item.name.replace(', University of Tehran', ''),
      kicker: item.position, subtitle: `University of Tehran · ${item.advisor.name}`,
      body: `${paragraph(item.summary)}${list(item.highlights)}${links([{ href: item.advisor.url, label: item.advisor.name }, { href: url(index === 0 ? '/research/' : '/research/psycidra/'), label: index === 0 ? 'Related research' : 'PsyCIDRA · research overview' }])}`
    });
  }
  for (const [index, item] of profile.education.entries()) {
    entries.push({
      id: `cv-${index === 0 ? 'masters' : 'bachelors'}`, category: 'education', date: item.endDate,
      dateLabel: range(item.startDate, item.endDate), title: `${item.studyType} · ${item.area}`,
      kicker: index === 0 ? 'Completed · Thesis: Excellent' : 'Completed',
      subtitle: `${item.institution} · ${item.score}`,
      body: `<div class="cv-evidence"><strong>${esc(item.score)}</strong><span>${index === 0 ? 'Thesis graded Excellent, the highest qualitative grade.' : 'Major GPA, on a 20-point scale.'}</span></div>${list(item.courses)}${links([...(index === 0 ? [{ href: url('/research/psycidra/'), label: 'Thesis research · PsyCIDRA' }] : [])])}`
    });
  }
  for (const item of profile.work) {
    entries.push({
      id: `cv-${slug(item.name)}`, category: 'industry', date: item.startDate,
      dateLabel: range(item.startDate, item.endDate), title: item.position,
      kicker: item.endDate ? 'Previous role' : 'Current role', subtitle: `${item.name} · ${item.location}`,
      body: `${paragraph(item.summary)}${list(item.highlights)}${item.name === 'Adan AI' ? '<p class="cv-note">Retrieval improvement measured on a human-annotated evaluation set.</p>' : ''}${links([...publicLinks(item)])}`
    });
  }
  for (const [index, item] of profile.teaching.entries()) {
    const semester = item.startDate.length > 4 ? `${Number(item.startDate.slice(5, 7)) < 7 ? 'Spring' : 'Fall'} ${item.startDate.slice(0, 4)}` : range(item.startDate, item.endDate);
    const materials = publicLinks(item, projectEntries);
    entries.push({
      id: `cv-teaching-${slug(item.name)}-${item.startDate.slice(0, 4)}-${index + 1}`, category: 'teaching', date: item.startDate,
      dateLabel: semester, title: item.name,
      kicker: item.position, subtitle: item.institution,
      search: item.instructors?.join(' '),
      body: `${paragraph(item.summary)}${item.links?.some(link => link.name === 'YouTube') ? `<a class="cv-recording" href="${esc(item.links.find(link => link.name === 'YouTube').url)}"><span class="cv-recording-play" aria-hidden="true">▷</span><span><strong>Watch the workshop</strong><span>${esc(item.name)} · University of Tehran</span></span><span aria-hidden="true">↗</span></a>` : ''}${item.instructors?.length ? `<p class="cv-note">Course instructor${item.instructors.length > 1 ? 's' : ''}: ${esc(item.instructors.join(' · '))}</p>` : ''}${list(item.highlights)}${links([...materials, ...(materials.some(link => link.href.includes('youtube.com')) ? [] : item.institution.includes('Tehran') ? [{ href: 'https://www.youtube.com/playlist?list=PLgUTlLy0Wg50do4_MiLyLP0GoDhcCb9uX', label: 'Selected workshop recordings' }] : [])])}`
    });
  }
  for (const item of profile.projects) {
    const project = projectMatch(projectEntries, item);
    entries.push({
      id: `cv-${item.name.startsWith('MedYar') ? 'medyar' : 'text-to-insight'}`, category: 'projects', date: item.startDate || '',
      dateLabel: item.startDate ? range(item.startDate, item.endDate) : 'Project', title: item.name,
      kicker: 'Selected project', subtitle: item.description,
      body: `${paragraph(item.summary)}${list(item.highlights)}<div class="tag-list">${(item.keywords || []).map(badge).join('')}</div>${links([...(item.url ? [{ href: item.url, label: 'Source code' }] : []), ...(project ? [{ href: url(project.route), label: 'Project overview' }] : [])])}`
    });
  }
  for (const [index, item] of profile.volunteer.entries()) {
    entries.push({
      id: `cv-${index === 0 ? 'acm' : 'tedx'}`, category: 'service', date: item.startDate,
      dateLabel: item.dateLabel || range(item.startDate, item.endDate), title: item.organization,
      kicker: item.position, subtitle: item.location,
      body: `${paragraph(item.summary)}${list(item.highlights)}${links([...publicLinks(item)])}`
    });
  }
  for (const item of profile.awards) {
    entries.push({
      id: 'cv-national-rank', category: 'awards', date: item.date.slice(0, 4),
      dateLabel: item.date.slice(0, 4), title: '1st nationwide',
      kicker: 'National entrance examination', subtitle: 'IT Engineering master’s entrance exam · Iran',
      body: `${paragraph(item.title)}<div class="cv-evidence"><strong>1 / 4,696</strong><span>Candidates in the 2023 IT Engineering master’s entrance examination.</span></div>${paragraph(item.summary)}`
    });
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date) || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.title.localeCompare(b.title));
}

export function renderCV(profile, researchEntries = [], projectEntries = []) {
  const entries = buildEntries(profile, researchEntries, projectEntries);
  const years = [...new Set(entries.map(entry => entry.date.slice(0, 4) || 'undated'))];
  const categories = categoryOrder.filter(category => entries.some(entry => entry.category === category));
  const featuredCount = entries.filter(entry => entryStories[entry.id]?.[2]).length;
  return `<header class="cv-heading">
      <div class="cv-heading-top"><p class="cv-eyebrow">Curriculum vitae <span aria-hidden="true">/</span> Milad Mohammadi</p><a class="cv-download" href="${cvPDF()}" download="Milad-Mohammadi-CV.pdf">${icon('download')} Download CV <span>PDF</span></a></div>
      <div class="cv-heading-grid"><div><h1>People, language <em>&amp; AI.</em></h1><p class="cv-introduction">I study how language agents can understand people—and build the systems to put those ideas into practice.</p></div><aside class="cv-heading-note"><span class="cv-note-rule" aria-hidden="true"></span><p>M.Sc., University of Tehran<br>Language agents × human behavior</p><a href="${url('/phd/')}"><span class="cv-status-dot" aria-hidden="true"></span> Seeking a PhD position ${icon('arrow')}</a></aside></div>
      <div class="cv-credentials" aria-label="Academic highlights"><a href="#cv-masters"><strong>19.14<span>/20</span></strong><span>M.Sc. GPA · thesis Excellent</span></a><a href="#cv-national-rank"><strong>1<span>/4,696</span></strong><span>National master’s entrance rank</span></a><a href="#cv-psycidra"><strong>Research <em>in context</em></strong><span>NLP · cognitive psychology · engineering</span></a></div>
    </header>
    <section class="cv-workspace" data-cv data-view="timeline" data-scope="highlights" aria-labelledby="cv-explorer-title">
      <div class="cv-explorer-heading"><div><h2 id="cv-explorer-title">One journey. Two perspectives.</h2></div><p data-cv-view-note>Follow the journey, most recent first.</p></div>
      <div class="cv-control-deck" data-cv-controls hidden>
        <div class="cv-toolbar">
          <div class="cv-view-switch" role="group" aria-label="CV view"><button type="button" data-cv-view="timeline" aria-pressed="true">${icon('timeline')} Timeline</button><button type="button" data-cv-view="theme" aria-pressed="false">${icon('grid')} By theme</button></div>
          <div class="cv-scope-switch" role="group" aria-label="Level of detail"><button type="button" data-cv-scope="highlights" aria-pressed="true">Key moments <span>${featuredCount}</span></button><button type="button" data-cv-scope="all" aria-pressed="false">Complete CV <span>${entries.length}</span></button></div>
          <div class="cv-search">${icon('search')}<label class="sr-only" for="cv-search">Search all CV entries</label><input type="search" id="cv-search" data-cv-search placeholder="Find a topic or experience" autocomplete="off" aria-controls="cv-groups"></div>
        </div>
        <div class="cv-filters" role="group" aria-label="Filter CV by theme"><button type="button" class="cv-filter" data-cv-filter="all" aria-pressed="true">All <span class="cv-filter-count" data-count>${entries.length}</span></button>${categories.map(category => `<button type="button" class="cv-filter" data-cv-filter="${category}" aria-pressed="false"><span class="cv-category-dot" data-category="${category}" aria-hidden="true"></span>${esc(categoryNames[category])} <span class="cv-filter-count" data-count>${entries.filter(entry => entry.category === category).length}</span></button>`).join('')}</div>
      </div>
      <div class="cv-actions"><p class="cv-results" data-cv-results role="status" aria-live="polite" aria-atomic="true">${entries.length} entries</p><div data-cv-controls hidden><button type="button" data-cv-expand>Expand all</button><span aria-hidden="true">/</span><button type="button" data-cv-collapse>Collapse all</button></div></div>
      <p class="cv-date-key">Roles by start date · degrees by completion · papers by publication</p>
      <noscript><p class="cv-note">The complete timeline is below. Open any entry to explore its details.</p></noscript>
      <div class="cv-groups" id="cv-groups" data-cv-groups>${years.map(year => `<section class="cv-group" data-cv-group="${esc(year)}" aria-labelledby="cv-group-${esc(year)}"><header class="cv-group-header"><h2 class="cv-group-heading" id="cv-group-${esc(year)}">${year === 'undated' ? 'Selected projects' : year}</h2><p class="cv-group-note">${chapterNotes[year] || ''}</p></header><div class="cv-entries">${entries.filter(entry => (entry.date.slice(0, 4) || 'undated') === year).map(detailEntry).join('')}</div></section>`).join('')}</div>
      <div class="cv-timeline-end"><span aria-hidden="true">◦</span><p>Built on curiosity. Still unfolding.</p><a href="${url('/phd/')}">The questions I want to explore next ${icon('arrow')}</a></div>
      <div class="cv-empty" data-cv-empty hidden><h3>No entries found.</h3><p>Try another topic or clear the current filters.</p><button type="button" class="button button-secondary" data-cv-reset>Reset search & filters</button></div>
    </section>
    <details class="cv-appendix"><summary><span><span class="cv-eyebrow">Methods & tools</span><strong id="cv-toolkit-title">The toolkit behind the work</strong></span><span class="cv-appendix-plus" aria-hidden="true">+</span></summary><div class="cv-skills">${profile.skills.map(skill => `<div class="cv-skill-group"><h3>${esc(skill.name)}</h3><p>${skill.keywords.map(esc).join(' · ')}</p></div>`).join('')}</div></details>
    <section class="cv-support-grid" aria-label="Languages, English proficiency, and academic references"><div class="cv-support-card"><h2>Languages</h2><dl>${profile.languages.map(language => `<div><dt>${esc(language.language)}</dt><dd>${esc(language.fluency)}</dd></div>`).join('')}</dl><h3>TOEFL iBT</h3><p><strong>5.5/6</strong> overall <span class="cv-note">· CEFR C1</span></p><p>ETS comparable score: <strong>110/120</strong></p><dl class="cv-score-list"><div><dt>Reading</dt><dd>6.0/6</dd></div><div><dt>Listening</dt><dd>6.0/6</dd></div><div><dt>Writing</dt><dd>5.5/6</dd></div><div><dt>Speaking</dt><dd>5.0/6</dd></div></dl><p class="cv-note">Test center · 25 July 2026</p></div><div class="cv-support-card"><h2>Academic references</h2>${profile.references.map(reference => `<div class="cv-reference"><h3>${esc(reference.name)}</h3><p>${esc(reference.position)}, ${esc(reference.institution)}<br>${esc(reference.department)}</p><a href="mailto:${esc(reference.email)}">${esc(reference.email)}</a></div>`).join('')}<p class="cv-note">Last updated ${date(profile.meta.lastModified, true)} · ${external(cvPDF(), 'Academic CV')}</p></div></section>`;
}
