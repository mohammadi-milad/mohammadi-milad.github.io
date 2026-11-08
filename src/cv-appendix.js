import { esc, url, date, icon, profileIcon } from './components.js';

// A presentation of the skills in profile.json. Specializations are peers;
// engineering practice supports all of them. These are not proficiency levels.
// LangGraph is also evidenced in the Adan AI work and teaching entries.
const skillBands = [
  {
    id: 'foundations', title: 'Foundations', note: 'The shared base',
    cards: [
      {
        id: 'software', title: 'Software engineering',
        description: 'Reusable Python code, tested and packaged.',
        tools: [['python', 'Python']],
        methods: [
          ['Design & testing', ['Modular design', 'Automated testing (pytest)']],
          ['Tooling', ['Packaging (uv, pip-tools)']]
        ]
      },
      {
        id: 'ml', title: 'Machine learning & data',
        description: 'From data preparation to model training and analysis.',
        tools: [['pytorch', 'PyTorch'], ['scikitlearn', 'scikit-learn']],
        methods: [
          ['Data & analysis', ['NumPy', 'pandas', 'Matplotlib']],
          ['Methods', ['Feature engineering']]
        ]
      }
    ]
  },
  {
    id: 'applied', title: 'Applied AI', note: 'Areas of specialization',
    cards: [
      {
        id: 'agents', title: 'Language agents',
        description: 'Agents that plan, use tools and work together.',
        tools: [['openai', 'OpenAI Agents SDK']],
        supportingTools: [['langgraph', 'LangGraph']],
        methods: [
          ['Agent design', ['Tool use', 'Planning']],
          ['Coordination', ['Multi-agent systems', 'Agent memory']]
        ]
      },
      {
        id: 'retrieval', title: 'Retrieval & RAG',
        description: 'Turning documents into searchable knowledge.',
        tools: [['milvus', 'Milvus'], [null, 'LanceDB']],
        methods: [
          ['Document pipelines', ['Document parsing', 'Chunking']],
          ['Search quality', ['Hybrid search', 'Reranking']]
        ]
      },
      {
        id: 'adaptation', title: 'Model adaptation',
        description: 'Adapting language models to specific tasks.',
        tools: [['huggingface', 'Hugging Face Transformers']],
        methods: [
          ['Efficient fine-tuning', [{ name: 'PEFT', children: ['LoRA', 'QLoRA'] }]],
          ['Training & text', ['TRL', 'Tokenization']]
        ]
      }
    ]
  },
  {
    id: 'practice', title: 'Engineering practice', note: 'Across the stack',
    cards: [
      {
        id: 'backend', title: 'Backend & integration',
        description: 'Connecting AI to data, services and users.',
        tools: [['fastapi', 'FastAPI'], ['postgresql', 'PostgreSQL']],
        methods: [
          ['Services & data', ['Pydantic', 'Async I/O', 'SQLite']],
          ['Interfaces', ['REST', 'gRPC', 'WebSockets']],
          ['Authentication', ['OAuth2/OpenID Connect', 'JWT']]
        ]
      },
      {
        id: 'evaluation', title: 'Evaluation & observability',
        description: 'Measuring quality and understanding behavior.',
        tools: [['langfuse', 'Langfuse']],
        methods: [
          ['Evaluation', ['Retrieval evaluation', 'LLM-as-judge']],
          ['Observability', ['Metrics', 'Logs', 'Traces']]
        ]
      },
      {
        id: 'delivery', title: 'Deployment & delivery',
        description: 'Taking AI systems from requirements to production.',
        tools: [['docker', 'Docker']],
        methods: [
          ['Deployment', ['Model serving (vLLM)', 'Docker Compose', 'CI/CD']],
          ['Engineering', ['Requirements analysis', 'Software architecture', 'Code review', 'Technical documentation']]
        ]
      }
    ]
  }
];

function technologyMark([filename, name]) {
  return `<span class="cv-skill-tool">${filename ? `<span class="cv-tool-logo cv-tool-logo-${filename}"><img src="${url(`/images/technologies/${filename}.svg`)}" alt="" width="28" height="28"></span>` : ''}<span>${esc(name)}</span></span>`;
}

function skillTerms(terms) {
  return `<ul class="cv-skill-terms">${terms.map(term => `<li>${typeof term === 'string' ? esc(term) : `${esc(term.name)}${skillTerms(term.children)}`}</li>`).join('')}</ul>`;
}

function skillCard(card) {
  return `<details class="cv-skill-card" id="cv-skill-${card.id}" data-cv-appendix>
    <summary>
      <span class="cv-skill-title">${esc(card.title)}</span><span class="cv-skill-disclosure" aria-hidden="true">+</span>
      <span class="cv-skill-description">${esc(card.description)}</span>
      <span class="cv-skill-tools">${card.tools.map(technologyMark).join('')}</span>
      <span class="sr-only">Tools and methods</span>
    </summary>
    <div class="cv-skill-content">${card.supportingTools ? `<div class="cv-skill-tools cv-supporting-tools">${card.supportingTools.map(technologyMark).join('')}</div>` : ''}<dl class="cv-skill-methods">${card.methods.map(([label, terms]) => `<div><dt>${esc(label)}</dt><dd>${skillTerms(terms)}</dd></div>`).join('')}</dl></div>
  </details>`;
}

function renderSkills() {
  return `<section class="cv-toolkit" id="cv-skills" aria-labelledby="cv-toolkit-title">
    <header class="cv-appendix-heading cv-toolkit-heading"><h2 id="cv-toolkit-title">Skills & tools</h2><p>Python and machine learning underpin my work in language agents, retrieval and model adaptation. Engineering and evaluation connect that work to production.</p></header>
    <div class="cv-skill-map">${skillBands.map(band => `<section class="cv-skill-band cv-skill-band-${band.id}" aria-labelledby="cv-skill-band-${band.id}">
      <header class="cv-skill-band-heading"><span class="cv-skill-band-symbol" aria-hidden="true"><i></i><i></i><i></i></span><h3 id="cv-skill-band-${band.id}">${esc(band.title)}</h3><p>${esc(band.note)}</p></header>
      <div class="cv-skill-cards">${band.cards.map(skillCard).join('')}</div>
    </section>`).join('')}</div>
  </section>`;
}

// Transcribed from the VISUAL score tables on page 1 of the July 25, 2026
// ETS report. Its embedded accessibility text incorrectly swaps the Writing
// and Speaking labels. Never derive section labels from that text layer.
// Only score data is included here; the private report is not published.
const toeflReport = {
  date: '2026-07-25',
  testDay: {
    overall: '5.5', comparable: 110, cefr: 'C1',
    sections: [
      { name: 'Reading', score: '6.0' },
      { name: 'Listening', score: '6.0' },
      { name: 'Writing', score: '5.5' },
      { name: 'Speaking', score: '5.0' }
    ]
  },
  myBest: {
    overall: '6.0', comparable: 118, cefr: 'C2',
    sections: [
      { name: 'Reading', score: '6.0', date: '2026-07-25' },
      { name: 'Listening', score: '6.0', date: '2026-07-25' },
      { name: 'Writing', score: '5.5', date: '2026-07-25' },
      { name: 'Speaking', score: '5.5', date: '2026-07-19' }
    ]
  }
};

function scoreDate(value, short = false) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' });
}

function sectionIcon(name) {
  const paths = {
    Reading: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 3v18m3-13h6m-6 4h6m-6 4h4"/>',
    Listening: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 13h4v8H5a1 1 0 0 1-1-1zm16 0h-4v8h3a1 1 0 0 0 1-1-1z"/>',
    Writing: '<path d="m4 16 12-12a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L8 20l-5 1zm10-10 4 4M4 16l4 4"/>',
    Speaking: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2m-6 8v4m-4 0h8"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function scorePanel(scores, isBest = false) {
  const key = isBest ? 'mybest' : 'test-day';
  const progress = Number(scores.overall) / 6 * 100;
  return `<section class="cv-toefl-panel cv-toefl-${key}" data-toefl-panel="${key}" aria-labelledby="cv-toefl-${key}-title">
    <header class="cv-toefl-panel-heading"><h3 id="cv-toefl-${key}-title">${isBest ? 'MyBest<sup>®</sup> scores' : 'Test-day scores'}</h3><p>${isBest ? 'As of ' : ''}<time datetime="${toeflReport.date}">${scoreDate(toeflReport.date, true)}</time></p></header>
    <div class="cv-toefl-results">
      <div class="cv-toefl-overall"><div class="cv-overall-gauge"><svg viewBox="0 0 180 106" aria-hidden="true" focusable="false"><path class="cv-gauge-track" d="M16 92 A74 74 0 0 1 164 92" fill="none" stroke-width="12"/><path class="cv-gauge-value" d="M16 92 A74 74 0 0 1 164 92" pathLength="100" fill="none" stroke-width="12" stroke-dasharray="${progress} 100"/></svg><div class="cv-overall-readout"><div class="cv-total-score"><strong>${scores.overall}</strong><span>/6</span></div><span class="cv-overall-label">Overall</span></div></div><div class="cv-score-context"><p class="cv-score-comparable"><strong>${scores.comparable}</strong><span>/120 comparable</span></p><span class="cv-cefr">CEFR ${scores.cefr}</span></div></div>
      <dl class="cv-toefl-section-scores">${scores.sections.map(section => `<div data-toefl-section="${section.name}"><dt>${sectionIcon(section.name)}${section.name}</dt><dd><strong><span data-toefl-value>${section.score}</span><span>/6</span></strong></dd></div>`).join('')}</dl>
    </div>
  </section>`;
}

function renderLanguages(profile) {
  // Group shared MyBest dates once rather than repeating them in every score cell.
  const dateGroups = new Map();
  for (const section of toeflReport.myBest.sections) {
    if (!dateGroups.has(section.date)) dateGroups.set(section.date, []);
    dateGroups.get(section.date).push(section);
  }
  const scoreDates = [...dateGroups].sort((a, b) => a[1].length - b[1].length).map(([value, sections]) => `${sections.length === 1 ? esc(sections[0].name) : sections.length === 3 ? 'Other sections' : sections.map(section => esc(section.name)).join(', ')}: <time datetime="${value}">${scoreDate(value, true)}</time>`).join(' <span aria-hidden="true">·</span> ');
  return `<section class="cv-language-section cv-closing-section" id="cv-languages" aria-labelledby="cv-language-title">
    <header class="cv-closing-heading"><h2 id="cv-language-title">Languages</h2><dl class="cv-spoken-languages">${profile.languages.map(language => `<div><dt>${esc(language.language)}</dt><dd>${esc(language.fluency)}</dd></div>`).join('')}</dl></header>
    <div class="cv-toefl-report"><div class="cv-toefl-report-heading"><strong>TOEFL iBT (Test Center)</strong><span>1–6 scale</span></div><div class="cv-toefl-panels">${scorePanel(toeflReport.testDay)}${scorePanel(toeflReport.myBest, true)}</div><div class="cv-toefl-notes"><p class="cv-score-footnote">MyBest: highest section scores across valid tests. <a href="https://www.ets.org/toefl/institutions/ibt/score-scale-update.html">About the ETS scale <span aria-hidden="true">↗</span></a></p><p class="cv-score-date-note">${scoreDates}</p></div></div>
  </section>`;
}

function renderReferences(profile) {
  return `<section class="cv-ref-section cv-closing-section" id="cv-references" aria-labelledby="cv-references-title">
    <header class="cv-closing-heading"><h2 id="cv-references-title">Academic references</h2></header>
    <div class="cv-reference-content"><div class="cv-reference-grid">${profile.references.map(reference => `<div class="cv-academic-reference"><h3>${esc(reference.name)}</h3><p>${esc(reference.position)}${reference.relationship ? ` · ${esc(reference.relationship)}` : ''}</p><p class="cv-reference-affiliation">${esc(reference.institution)} · ${esc(reference.department)}</p><a href="mailto:${esc(reference.email)}">${icon('mail')}${esc(reference.email)}</a><div class="cv-reference-profiles"><a class="profile-link" href="${esc(reference.scholar)}" aria-label="Google Scholar — ${esc(reference.name)}" title="Google Scholar">${profileIcon('scholar')}</a>${reference.universityPage ? `<a class="profile-link" href="${esc(reference.universityPage)}" aria-label="University page — ${esc(reference.name)}" title="University page"><img src="${url('/images/organizations/university-of-tehran.png')}" alt="" width="20" height="20"></a>` : ''}${reference.personalPage ? `<a class="profile-link" href="${esc(reference.personalPage)}" aria-label="Personal page — ${esc(reference.name)}" title="Personal page">${icon('globe')}</a>` : ''}</div></div>`).join('')}</div></div>
  </section>`;
}

export function renderCVAppendix(profile) {
  return `${renderSkills()}${renderLanguages(profile)}${renderReferences(profile)}<p class="cv-last-updated">Last updated ${date(profile.meta.lastModified, true)}</p>`;
}
