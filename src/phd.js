import { site } from './config.js';
import { esc, url, icon } from './components.js';
import { phdContent } from './phd-content.js';

const paragraphs = items => items.map(text => `<p>${esc(text)}</p>`).join('\n');
const number = index => String(index + 1).padStart(2, '0');

function researchMap(themes) {
  return `<nav class="phd-map" aria-label="Explore my research interests">
    <ol>${themes.map((theme, index) => `<li><a href="#${esc(theme.id)}"><span aria-hidden="true">${number(index)}</span><span>${esc(theme.shortTitle)}</span>${icon('arrow')}</a></li>`).join('')}</ol>
  </nav>`;
}

function researchTheme(theme, index) {
  return `<section class="phd-theme" id="${esc(theme.id)}" aria-labelledby="${esc(theme.id)}-title">
    <div class="phd-theme-number" aria-hidden="true">${number(index)}</div>
    <div class="phd-theme-content">
      <h3 id="${esc(theme.id)}-title">${esc(theme.title)}</h3>
      <p class="phd-theme-overview">${esc(theme.overview)}</p>
      <details class="phd-topics">
        <summary><span class="phd-topics-closed">Explore topics</span><span class="phd-topics-open">Close topics</span><span class="sr-only"> in ${esc(theme.title)}</span><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4"/></svg></summary>
        <div class="phd-subjects">${theme.subjects.map(subject => `<section class="phd-subject"><h4>${esc(subject.title)}</h4><p>${esc(subject.description)}</p></section>`).join('\n')}</div>
      </details>
    </div>
  </section>`;
}

export function renderPhD() {
  const { intro, themes, motivation, readiness } = phdContent;
  return `<div class="phd-page">
    <header class="page-heading phd-heading">
      <h1>I’m looking for a PhD position</h1>
      <p class="page-intro">A little about the questions I’d like to explore, why I want to do a PhD, and what I would bring to it.</p>
      <nav class="phd-page-nav" aria-label="On this page"><a href="#research-directions">Research interests</a><a href="#why-a-phd">Why a PhD?</a><a href="#phd-background">Why I think I’m ready</a></nav>
    </header>

    <section class="section-block phd-interests" id="research-directions" aria-labelledby="research-interests">
      <h2 id="research-interests">Research interests</h2>
      <div class="phd-intro">${paragraphs(intro)}</div>
      ${researchMap(themes)}
      <div class="phd-themes">${themes.map(researchTheme).join('\n')}</div>
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
