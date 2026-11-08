import { esc, url } from './components.js';

// Layers express engineering scope, not proficiency.
// Capabilities are grounded in the CV, project sources, and the owner's account.
export const skillLayers = [
  { id: 'foundations', number: '01', title: 'Foundations' },
  { id: 'systems', number: '02', title: 'Systems & applications' },
  { id: 'delivery', number: '03', title: 'Production & delivery' }
];

const cards = [
  {
    id: 'software', domain: 'software', layer: 'foundations',
    title: 'Software & product design',
    concepts: 'System design · Software architecture · Product management',
    tools: [['python', 'Python']],
    methods: [
      ['Engineering foundations', ['Algorithm design', 'Modular design', 'System design', 'Software architecture']],
      ['Product & requirements', ['Product management', 'Requirements analysis', 'Product scoping', 'User stories']]
    ]
  },
  {
    id: 'ml', domain: 'ai', layer: 'foundations',
    title: 'Machine learning & deep learning',
    concepts: 'Machine learning · Deep learning · Feature engineering',
    tools: [['pytorch', 'PyTorch'], ['scikitlearn', 'scikit-learn']],
    supportingTools: [['numpy', 'NumPy'], ['pandas', 'pandas'], [null, 'Matplotlib']],
    methods: [
      ['Learning foundations', ['Machine learning', 'Deep learning', 'Neural networks', 'Feature engineering']],
      ['Data & language', ['Data preparation', 'Data analysis', 'Tokenization']]
    ]
  },
  {
    id: 'fullstack', domain: 'software', layer: 'systems',
    title: 'Full-stack development',
    concepts: 'Frontend development · Backend development · API design',
    tools: [['react', 'React'], ['typescript', 'TypeScript'], ['nextjs', 'Next.js'], ['fastapi', 'FastAPI'], ['postgresql', 'PostgreSQL']],
    supportingTools: [['redis', 'Redis'], [null, 'Pydantic'], [null, 'SQLite'], [null, 'SQLAlchemy'], [null, 'Alembic'], [null, 'Vite'], [null, 'Tailwind CSS'], [null, 'React Router']],
    mobileTools: [[null, 'Kotlin'], [null, 'Jetpack Compose']],
    methods: [
      ['Applications', ['Full-stack development', 'Frontend development', 'Backend development', 'Async I/O']],
      ['APIs & transport', ['Typed APIs & schemas', 'REST', 'gRPC', 'WebSockets', 'Server-sent events (SSE)']],
      ['Authentication', ['OAuth2/OpenID Connect', 'JWT', 'Session management']],
      ['Interfaces & data', ['Responsive interfaces', 'RTL & localization', 'Database migrations', 'Caching & cache invalidation']]
    ]
  },
  {
    id: 'ai-systems', domain: 'ai', layer: 'systems',
    title: 'Foundation-model systems',
    concepts: 'Agents & workflows · Retrieval & RAG · Fine-tuning · Structured outputs',
    tools: [['openai', 'OpenAI Agents SDK'], ['huggingface', 'Hugging Face Transformers'], ['langgraph', 'LangGraph'], ['milvus', 'Milvus']],
    supportingTools: [[null, 'LanceDB'], [null, 'PEFT'], [null, 'TRL'], [null, 'n8n'], [null, 'Chainlit']],
    methods: [
      ['Agents & workflows', ['Tool use', 'Planning', 'Multi-agent systems', 'Agent memory', 'Workflow orchestration', 'Structured outputs & validation', 'ReAct', 'Reflexion']],
      ['Retrieval & RAG', ['Document parsing', 'Chunking', 'Sparse & dense retrieval', 'Hybrid search', 'BM25', 'Reranking']],
      ['Foundation-model fine-tuning', ['Parameter-efficient fine-tuning', 'LoRA', 'QLoRA', 'Prefix-tuning']]
    ]
  },
  {
    id: 'delivery', domain: 'software', layer: 'delivery',
    title: 'Software delivery & quality',
    concepts: 'Automated testing · CI/CD · Code review',
    tools: [['docker', 'Docker'], ['git', 'Git']],
    supportingTools: [[null, 'pytest'], [null, 'Playwright'], [null, 'Vitest'], [null, 'uv'], [null, 'pip-tools'], [null, 'Docker Compose'], [null, 'Ruff'], [null, 'mypy']],
    methods: [
      ['Quality', ['Automated testing (pytest)', 'Code review', 'Technical documentation']],
      ['Delivery', ['Packaging (uv, pip-tools)', 'Containerization', 'CI/CD']],
      ['Reliability', ['Async concurrency & backpressure', 'Timeouts & retries', 'Background jobs', 'Resilient error handling']]
    ]
  },
  {
    id: 'model-ops', domain: 'ai', layer: 'delivery',
    title: 'Model serving & evaluation',
    concepts: 'Model serving · Evaluation · Observability',
    tools: [['vllm', 'vLLM'], ['langfuse', 'Langfuse']],
    methods: [
      ['Inference', ['Foundation-model serving', 'Model serving (vLLM)', 'Service integration']],
      ['Evaluation', ['Retrieval evaluation', 'LLM-as-judge']],
      ['Observability', ['Metrics', 'Logs', 'Traces']]
    ]
  }
];

function technologyMark([filename, name]) {
  return `<span class="cv-skill-tool">${filename ? `<span class="cv-tool-logo cv-tool-logo-${filename}"><img src="${url(`/images/technologies/${filename}.svg`)}" alt="" width="28" height="28" loading="lazy"></span>` : ''}<span>${esc(name)}</span></span>`;
}

const terms = values => `<ul class="cv-skill-terms">${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;

function skillCard(card) {
  return `<details class="cv-skill-card" id="cv-skill-${card.id}" data-cv-appendix data-domain="${card.domain}" data-layer="${card.layer}">
    <summary>
      <span class="cv-skill-card-kicker">${card.domain === 'software' ? 'Software' : 'AI / ML'}</span>
      <span class="cv-skill-title">${esc(card.title)}</span>
      <span class="cv-skill-disclosure" aria-hidden="true">+</span>
      <span class="cv-skill-concepts"><span class="cv-skill-label">Concepts &amp; methods</span><span class="cv-skill-concept-list">${esc(card.concepts)}</span></span>
      <span class="cv-skill-tools-wrap"><span class="cv-skill-label">Tools &amp; frameworks</span><span class="cv-skill-tools">${card.tools.map(technologyMark).join('')}</span></span>
      <span class="sr-only">Open for the full toolkit and methods</span>
    </summary>
    <div class="cv-skill-content"><dl class="cv-skill-methods">${card.methods.map(([label, values]) => `<div><dt>${esc(label)}</dt><dd>${terms(values)}</dd></div>`).join('')}${card.supportingTools ? `<div class="cv-skill-additional-tools"><dt>More tools &amp; frameworks</dt><dd><div class="cv-skill-tools cv-supporting-tools">${card.supportingTools.map(technologyMark).join('')}</div></dd></div>` : ''}${card.mobileTools ? `<div><dt>Mobile development · Android</dt><dd><div class="cv-skill-tools">${card.mobileTools.map(technologyMark).join('')}</div></dd></div>` : ''}</dl></div>
  </details>`;
}

export function renderSkills() {
  return `<section class="cv-toolkit" id="cv-skills" aria-labelledby="cv-toolkit-title" data-skill-layout="layers" data-skill-logos="brand" data-skill-lead="ai">
    <header class="cv-skills-heading"><h2 id="cv-toolkit-title">Technical Skills Map</h2><div class="cv-skills-intro"><p class="cv-skills-statement">I design, architect, deliver, and deploy AI applications for research and industry.</p><p class="cv-skills-context">With agentic coding tools such as Codex in my workflow, I place greater emphasis on engineering concepts and practical experience than on individual frameworks; those listed here reflect technologies I have used in projects.</p></div></header>
    <div class="cv-skills-presentation">
      <div class="cv-skills-map" id="cv-skills-map" data-skills-map>
        <div class="cv-skills-domain-heads"><span></span><strong data-domain="ai">AI / ML engineering</strong><strong data-domain="software">Software engineering</strong></div>
        ${skillLayers.map(layer => `<section class="cv-skill-layer" data-layer="${layer.id}" aria-labelledby="cv-layer-${layer.id}"><header class="cv-skill-layer-heading"><span class="cv-skill-layer-number">${layer.number}</span><h3 id="cv-layer-${layer.id}">${esc(layer.title)}</h3></header><div class="cv-skill-cards">${cards.filter(card => card.layer === layer.id).sort((a, b) => Number(b.domain === 'ai') - Number(a.domain === 'ai')).map(skillCard).join('')}</div></section>`).join('')}
      </div>
    </div>
  </section>`;
}
