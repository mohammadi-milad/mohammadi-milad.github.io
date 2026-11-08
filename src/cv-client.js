/** Keep one set of semantic entries; reorganize it without losing open state. */
import { cvSections as categories, cvChapters } from './cv-sections.js';

function initializeCV(root) {
  if (root.dataset.cvReady) return;
  root.dataset.cvReady = 'true';
  const entries = [...root.querySelectorAll('[data-cv-entry]')].sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  const future = root.querySelector('[data-cv-future]');
  const experienceDisclosures = [...entries, future];
  const groups = root.querySelector('[data-cv-groups]');
  const opportunity = root.querySelector('[data-cv-opportunity]');
  const viewButtons = [...root.querySelectorAll('[data-cv-view]')];
  const status = root.querySelector('[data-cv-view-status]');
  const appendices = [...document.querySelectorAll('[data-cv-appendix]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const disclosureAnimations = new Map();
  const movementAnimations = new Set();
  let view = root.dataset.view || 'theme';
  let printState;
  root.querySelectorAll('[data-cv-controls]').forEach(control => { control.hidden = false; });

  function finishDisclosure(entry) {
    const running = disclosureAnimations.get(entry);
    if (!running) return;
    disclosureAnimations.delete(entry);
    running.animation.cancel();
    entry.open = running.open;
    entry.style.removeProperty('height');
    entry.style.removeProperty('overflow');
  }

  function setDisclosure(entry, open, animate = true) {
    const startHeight = entry.getBoundingClientRect().height;
    finishDisclosure(entry);
    if (!animate || motion.matches || !Element.prototype.animate) {
      entry.open = open;
      return;
    }
    if (entry.open === open) return;
    entry.open = open;
    const endHeight = entry.getBoundingClientRect().height;
    entry.open = true;
    entry.style.height = `${startHeight}px`;
    entry.style.overflow = 'hidden';
    const animation = entry.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
      duration: 220, easing: 'cubic-bezier(.22,.68,.22,1)', fill: 'forwards'
    });
    const running = { animation, open };
    disclosureAnimations.set(entry, running);
    animation.finished.then(() => {
      if (disclosureAnimations.get(entry) === running) finishDisclosure(entry);
    }).catch(() => {});
  }

  function cancelMovement() {
    movementAnimations.forEach(animation => animation.cancel());
    movementAnimations.clear();
  }

  function makeGroup(key, title, number, period, transition = false) {
    const section = document.createElement('section');
    section.className = transition ? 'cv-transition' : 'cv-group';
    if (transition) section.dataset.cvTransition = '';
    else section.dataset.cvGroup = key;
    const header = document.createElement('header');
    header.className = 'cv-group-header';
    if (number) {
      const label = document.createElement('span');
      label.className = 'cv-chapter-number';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = String(number).padStart(2, '0');
      header.append(label);
    }
    const heading = document.createElement('h2');
    heading.className = 'cv-group-heading';
    // Degree entries already use cv-masters and cv-bachelors as their IDs.
    heading.id = `cv-group-${key}`;
    heading.textContent = title;
    section.setAttribute('aria-labelledby', heading.id);
    header.append(heading);
    if (period) {
      const dates = document.createElement('p');
      dates.className = 'cv-chapter-period';
      dates.textContent = period;
      header.append(dates);
    }
    const container = document.createElement('div');
    container.className = 'cv-entries';
    section.append(header, container);
    return { section, container };
  }

  function timelineGroups() {
    const fragment = document.createDocumentFragment();
    const chronological = [...entries].sort((a, b) => Number(b.dataset.timelineOrder) - Number(a.dataset.timelineOrder));
    cvChapters.forEach((chapter, index) => {
      const { section, container } = makeGroup(chapter.id, chapter.title, index + 1, chapter.period);
      const members = chronological.filter(entry => entry.dataset.chapter === chapter.id);
      if (chapter.stages) {
        members.filter(entry => entry.dataset.stage === 'degree').forEach(entry => container.append(entry));
        chapter.stages.forEach(stage => {
          const stageEntries = members.filter(entry => entry.dataset.stage === stage.id);
          if (!stageEntries.length) return;
          const group = document.createElement('section');
          group.className = 'cv-timeline-stage';
          group.dataset.cvStage = stage.id;
          const header = document.createElement('header');
          header.className = 'cv-stage-header';
          const heading = document.createElement('h3');
          heading.id = `cv-stage-${stage.id}`;
          heading.textContent = stage.title;
          group.setAttribute('aria-labelledby', heading.id);
          header.append(heading);
          if (stage.period) {
            const period = document.createElement('p');
            period.textContent = stage.period;
            header.append(period);
          }
          group.append(header, ...stageEntries);
          container.append(group);
        });
      } else {
        members.forEach(entry => container.append(entry));
      }
      fragment.append(section);
      if (chapter.id === 'masters') {
        const bridge = makeGroup('transition', 'Into graduate study', null, '2023', true);
        chronological.filter(entry => entry.dataset.chapter === 'transition').forEach(entry => bridge.container.append(entry));
        fragment.append(bridge.section);
      }
    });
    return fragment;
  }

  function update(animate = false) {
    cancelMovement();
    experienceDisclosures.forEach(finishDisclosure);
    const active = document.activeElement;
    const restoreFocus = groups.contains(active);
    const previous = animate && !motion.matches ? new Map(entries.map(entry => [entry, entry.getBoundingClientRect()])) : null;
    // Keep the prospective degree separate from the dated historical record.
    future.hidden = view !== 'theme';
    if (future.hidden) root.append(future);
    const fragment = document.createDocumentFragment();
    if (view === 'timeline') {
      fragment.append(timelineGroups());
    } else {
      const themeKeys = Object.keys(categories).filter(key => entries.some(entry => entry.dataset.category === key));
      for (const [index, key] of themeKeys.entries()) {
        const { section, container } = makeGroup(key, categories[key].title, index + 1);
        if (categories[key].intro) {
          const intro = document.createElement('p');
          intro.className = 'cv-group-intro';
          intro.textContent = categories[key].intro;
          container.append(intro);
        }
        if (key === 'education') container.append(future);
        const members = entries.filter(entry => entry.dataset.category === key);
        members.forEach(entry => container.append(entry));
        if (!members.length) continue;
        fragment.append(section);
      }
    }
    groups.replaceChildren(fragment);
    root.dataset.view = view;
    opportunity.hidden = view !== 'timeline';
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cvView === view)));
    if (animate) status.textContent = view === 'theme' ? 'CV arranged by theme.' : 'CV arranged in academic chapters, newest first.';
    if (restoreFocus && active.isConnected && !active.closest('[hidden]')) active.focus({ preventScroll: true });
    if (previous && Element.prototype.animate) {
      for (const entry of entries) {
        const before = previous.get(entry);
        const after = entry.getBoundingClientRect();
        // Animate only on-screen rows; long-distance travel makes a CV harder to read.
        if (after.bottom < 0 || after.top > innerHeight || Math.abs(before.top - after.top) > innerHeight) continue;
        const animation = entry.animate([
          { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)`, opacity: .6 },
          { transform: 'none', opacity: 1 }
        ], { duration: 300, easing: 'cubic-bezier(.22,.68,.22,1)' });
        movementAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => movementAnimations.delete(animation));
      }
    }
  }

  experienceDisclosures.forEach(entry => entry.querySelector('summary').addEventListener('click', event => {
    if (event.target.closest('a, button, input, select, textarea')) return;
    event.preventDefault();
    setDisclosure(entry, !(disclosureAnimations.get(entry)?.open ?? entry.open));
  }));
  viewButtons.forEach(button => button.addEventListener('click', () => {
    if (view === button.dataset.cvView) return;
    view = button.dataset.cvView;
    update(true);
  }));
  root.querySelector('[data-cv-expand]').addEventListener('click', () => [...experienceDisclosures, ...appendices].forEach(entry => setDisclosure(entry, true, false)));
  root.querySelector('[data-cv-collapse]').addEventListener('click', () => [...experienceDisclosures, ...appendices].forEach(entry => setDisclosure(entry, false, false)));

  function reveal(id, focus = false) {
    const target = experienceDisclosures.find(entry => entry.id === id);
    if (target) {
      cancelMovement();
      if (target === future && view !== 'theme') { view = 'theme'; update(); }
      setDisclosure(target, true, false);
      if (focus) target.querySelector('summary').focus({ preventScroll: true });
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' }));
      return;
    }
    const category = id.replace(/^cv-group-/, '');
    if (!categories[category]) return;
    if (view !== 'theme') { view = 'theme'; update(); }
    const heading = document.getElementById(id);
    if (!heading) return;
    if (focus) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    heading.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
  }
  document.querySelectorAll('a[href^="#cv-"]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute('href').slice(1);
    if (!experienceDisclosures.some(entry => entry.id === id) && !categories[id.replace(/^cv-group-/, '')]) return;
    event.preventDefault();
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    reveal(id, true);
  }));
  function revealHash() {
    try { reveal(decodeURIComponent(location.hash.slice(1))); } catch { /* Ignore malformed URL fragments. */ }
  }
  addEventListener('hashchange', revealHash);
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    cancelMovement();
    experienceDisclosures.forEach(finishDisclosure);
  });
  addEventListener('beforeprint', () => {
    if (printState) return;
    cancelMovement();
    experienceDisclosures.forEach(finishDisclosure);
    const disclosures = [...experienceDisclosures, ...appendices];
    printState = new Map(disclosures.map(entry => [entry, entry.open]));
    disclosures.forEach(entry => { entry.open = true; });
  });
  addEventListener('afterprint', () => {
    if (!printState) return;
    printState.forEach((open, entry) => { entry.open = open; });
    printState = null;
  });
  revealHash();
}

document.querySelectorAll('[data-cv]').forEach(initializeCV);
