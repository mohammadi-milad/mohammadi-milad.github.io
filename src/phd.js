import { site } from './config.js';
import { esc, url, icon } from './components.js';
import { phdContent } from './phd-content.js';

const paragraphs = items => items.map(text => `<p>${esc(text)}</p>`).join('\n');
const number = index => String(index + 1).padStart(2, '0');
const sketch = drawing => `<svg viewBox="0 0 112 72" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawing}</svg>`;

const themeSketches = {
  'modeling-and-simulation': `<path class="phd-sketch-rule" d="M29 18 16 38l19 15 24-17-30-18 6 35M59 36l22-20 16 25-16 15-22-20 38 5m-16-25v40"/>
    <circle cx="29" cy="18" r="5"/><circle cx="16" cy="38" r="4"/><circle cx="35" cy="53" r="5"/><circle cx="59" cy="36" r="6"/>
    <circle cx="81" cy="16" r="4"/><circle cx="97" cy="41" r="5"/><circle cx="81" cy="56" r="4"/>`,
  'human-ai-interaction': `<path d="M58 14H20a6 6 0 0 0-6 6v15a6 6 0 0 0 6 6h4v9l11-9h15m-26-17h25m-25 8h17"/>
    <path d="M58 30h34a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-4v9l-11-9H58a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6Z"/>
    <path class="phd-sketch-rule" d="M62 41h25m-25 7h17M66 12h16m-4-4 4 4-4 4M44 59H28m4-4-4 4 4 4"/>`,
  'clinical-ai': `<path d="M25 12h28l9 9v38H25zM53 12v9h9M35 29h16m-16 8h16m-16 8h10"/>
    <path class="phd-sketch-rule" d="M62 36h11l11-13m-11 13 11 13"/><circle cx="89" cy="18" r="7"/><circle cx="89" cy="54" r="7"/>
    <path d="m86 18 2 2 4-4m-5 38h4"/>`,
  'efficient-models': `<rect x="36" y="7" width="40" height="58" rx="6"/><path d="M49 13h14M52 59h8"/>
    <rect x="46" y="31" width="20" height="15" rx="2"/><path d="M51 31v-4a5 5 0 0 1 10 0v4m-5 6v3"/>
    <path class="phd-sketch-rule" d="M27 20h-9v32h9m58-32h9v32h-9M13 36h5m76 0h5"/>`,
  'learning-agents': `<path d="M86 30a31 25 0 0 0-59-3m-2-9 2 9 9-2m-10 17a31 25 0 0 0 59 3m2 9-2-9-9 2"/>
    <ellipse cx="56" cy="29" rx="12" ry="4"/><path d="M44 29v14c0 5 24 5 24 0V29m-24 7c0 5 24 5 24 0"/>`,
  'human-diversity': `<circle cx="50" cy="36" r="23"/><ellipse cx="50" cy="36" rx="11" ry="23"/><path d="M27 36h46M32 23c10 5 26 5 36 0M32 49c10-5 26-5 36 0"/>
    <path class="phd-sketch-rule" d="M76 14h21v17h-7l-5 5v-5h-5M81 20h11m-9 5h7M24 45H13v16h6l5 5v-5h7v-4"/>`
};

function researchFocus(focus) {
  return `<div class="phd-focus">
    <div class="phd-focus-copy">
      <p class="phd-focus-label">Primary research focus</p>
      <h3>${esc(focus.title)}</h3>
      <div class="phd-focus-description">${paragraphs(focus.paragraphs)}</div>
    </div>
    <figure class="phd-focus-figure">
      <figcaption class="sr-only">How the two fields inform each other</figcaption>
      <div class="phd-flow phd-flow-to-people"><span>Study people and design for them</span>${icon('arrow')}</div>
      <div class="phd-focus-fields">
        <div class="phd-focus-field phd-focus-models">
          ${sketch(`<path class="phd-sketch-rule" d="M22 20 55 13l33 9-33 14-33-16M22 52l33-16 33 14-33 9-33-7M55 13l33 37m-33 9 33-37"/>
            <circle cx="22" cy="20" r="5"/><circle cx="22" cy="52" r="5"/><circle cx="55" cy="13" r="5"/><circle cx="55" cy="36" r="6"/><circle cx="55" cy="59" r="5"/><circle cx="88" cy="22" r="5"/><circle cx="88" cy="50" r="5"/>`)}
          <strong>Foundation models</strong>
          <span>Language · vision</span>
        </div>
        <div class="phd-focus-field phd-focus-people">
          ${sketch(`<path d="M45 61V49a21 21 0 1 1 30-19l5 9h-8v8a4 4 0 0 1-4 4h-8v10"/>
            <path class="phd-sketch-rule" d="m41 26 11-7 11 7-11 11-11-11m11-7v18M24 23h7m-7 10h5m-1 10h6"/>
            <circle cx="41" cy="26" r="3"/><circle cx="52" cy="19" r="3"/><circle cx="63" cy="26" r="3"/><circle cx="52" cy="37" r="3"/>`)}
          <strong>Psychology &amp; human sciences</strong>
          <span>Cognition · behavior</span>
        </div>
      </div>
      <div class="phd-flow phd-flow-to-models"><span>Human insights guide model design</span>${icon('arrow')}</div>
    </figure>
  </div>`;
}

function researchMap(themes) {
  return `<nav class="phd-map" aria-label="Explore my research interests">
    <ol role="list">${themes.map((theme, index) => `<li><a href="#${esc(theme.id)}"><span class="phd-index-number">${number(index)}</span><span>${esc(theme.shortTitle)}</span>${icon('arrow')}</a></li>`).join('')}</ol>
  </nav>`;
}

function researchTheme(theme, index) {
  return `<section class="phd-theme" id="${esc(theme.id)}" aria-labelledby="${esc(theme.id)}-title">
    <div class="phd-theme-plate" aria-hidden="true">
      <span class="phd-theme-number">${number(index)}</span>
      ${sketch(themeSketches[theme.id])}
    </div>
    <h4 id="${esc(theme.id)}-title">${esc(theme.title)}</h4>
    <div class="phd-theme-content">
      <p class="phd-theme-overview">${esc(theme.overview)}</p>
      <details class="phd-topics">
        <summary><span>Research topics<span class="sr-only"> in ${esc(theme.title)}</span></span><span class="phd-topic-count" aria-hidden="true">${theme.subjects.length}</span><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4"/></svg></summary>
        <div class="phd-subjects">${theme.subjects.map(subject => `<section class="phd-subject"><h5>${esc(subject.title)}</h5><p>${esc(subject.description)}</p></section>`).join('\n')}</div>
      </details>
    </div>
  </section>`;
}

export function renderPhD() {
  const { researchIntro, focus, directionsIntro, themes, motivation, readiness } = phdContent;
  return `<div class="phd-page">
    <header class="page-heading phd-heading">
      <h1>I’m looking for a PhD position</h1>
      <p class="page-intro">A little about the questions I’d like to explore, why I want to do a PhD, and what I would bring to it.</p>
      <nav class="phd-page-nav" aria-label="On this page"><a href="#research-directions">Research interests</a><a href="#why-a-phd">Why a PhD?</a><a href="#phd-background">Why I think I’m ready</a></nav>
    </header>

    <section class="section-block phd-interests" id="research-directions" aria-labelledby="research-interests">
      <h2 id="research-interests">Research interests</h2>
      <p class="phd-research-intro">${esc(researchIntro)}</p>
      ${researchFocus(focus)}
      <section class="phd-directions" aria-labelledby="phd-directions-title">
        <h3 id="phd-directions-title">Research directions</h3>
        <p class="phd-directions-intro">${esc(directionsIntro)}</p>
        ${researchMap(themes)}
        <div class="phd-themes">${themes.map(researchTheme).join('\n')}</div>
      </section>
    </section>

    <section class="section-block phd-note" id="why-a-phd" aria-labelledby="phd-motivation">
      <h2 id="phd-motivation">${esc(motivation.title)}</h2>
      <div class="phd-note-prose">${paragraphs(motivation.paragraphs)}</div>
    </section>

    <section class="section-block phd-note" id="phd-background" aria-labelledby="phd-readiness">
      <h2 id="phd-readiness">${esc(readiness.title)}</h2>
      <div class="phd-note-prose">${paragraphs(readiness.paragraphs).replace('study on psychiatric assessment', `<a href="${url('/research/psycidra/')}">study on psychiatric assessment</a>`)}</div>
      <p class="inline-links phd-background-links"><a href="${url('/cv/')}">My CV ${icon('arrow')}</a><a href="${url('/research/')}">Publications ${icon('arrow')}</a></p>
    </section>

    <section class="section-block phd-contact" aria-labelledby="phd-contact">
      <h2 id="phd-contact">Let’s talk</h2>
      <p>If you’re looking for a PhD student and think we might be a good fit, I’d love to hear from you. If you know a supervisor or program that could suit my interests, I’d really appreciate an introduction or a pointer in the right direction. I’m also happy to talk about research collaborations or simply exchange ideas.</p>
      <p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
    </section>
  </div>`;
}
