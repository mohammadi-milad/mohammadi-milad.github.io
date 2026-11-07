/** A progressively enhanced CV: the same entries, viewed through different lenses. */
const categoryLabels = { research: 'Research', education: 'Education', industry: 'Industry', teaching: 'Teaching', projects: 'Projects', service: 'Service', awards: 'Awards' };
const categoryNotes = {
  research: 'Language, reasoning & human behavior',
  education: 'The academic foundations',
  industry: 'Agents beyond the lab',
  teaching: 'Making ideas teachable',
  projects: 'Questions made tangible',
  service: 'Building a community',
  awards: 'Academic distinction'
};
const yearNotes = {
  2026: 'Research into practice',
  2025: 'Publishing, building, teaching',
  2024: 'Two labs. A wider perspective.',
  2023: 'A new academic chapter',
  2019: 'Learning through teaching',
  2018: 'The foundations',
  undated: 'Projects without a specified date'
};

function initializeCV(root) {
  if (root.dataset.cvReady) return;
  root.dataset.cvReady = 'true';
  const entries = [...root.querySelectorAll('[data-cv-entry]')];
  const groups = root.querySelector('[data-cv-groups]');
  const search = root.querySelector('[data-cv-search]');
  const results = root.querySelector('[data-cv-results]');
  const empty = root.querySelector('[data-cv-empty]');
  const viewNote = root.querySelector('[data-cv-view-note]');
  const filterButtons = [...root.querySelectorAll('[data-cv-filter]')];
  const viewButtons = [...root.querySelectorAll('[data-cv-view]')];
  const scopeButtons = [...root.querySelectorAll('[data-cv-scope]')];
  const expandButton = root.querySelector('[data-cv-expand]');
  const collapseButton = root.querySelector('[data-cv-collapse]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const categories = Object.keys(categoryLabels);
  const entryOrder = new Map(entries.map((entry, index) => [entry, index]));
  const movementAnimations = new Set();
  const disclosureAnimations = new Map();
  let view = root.dataset.view || 'timeline';
  let scope = scopeButtons.length ? 'highlights' : 'all';
  let filter = 'all';
  let query = '';
  let transition = null;
  let revision = 0;
  let searchTimer;
  let printState;
  const appendices = [...document.querySelectorAll('.cv-appendix')];

  root.querySelectorAll('[data-cv-controls]').forEach(control => { control.hidden = false; });

  function matchesQuery(entry) {
    return query.split(/\s+/).filter(Boolean).every(word => (entry.dataset.search || '').includes(word));
  }

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
    if (entry.open === open && !entry.style.height) return;
    // Measure the natural endpoint before fixing the box for the animation.
    entry.open = open;
    const endHeight = entry.getBoundingClientRect().height;
    entry.open = true;
    entry.style.height = `${startHeight}px`;
    entry.style.overflow = 'hidden';
    const animation = entry.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
      duration: 290,
      easing: 'cubic-bezier(.22,.68,.22,1)',
      fill: 'forwards'
    });
    const running = { animation, open };
    disclosureAnimations.set(entry, running);
    animation.finished.then(() => {
      if (disclosureAnimations.get(entry) === running) finishDisclosure(entry);
    }).catch(() => {});
  }

  function update() {
    // Moving live nodes retains the expanded state and every entry's identity.
    entries.forEach(finishDisclosure);
    const active = document.activeElement;
    const restoreFocus = groups.contains(active);
    const visible = entries.filter(entry => matchesQuery(entry)
      && (filter === 'all' || entry.dataset.category === filter)
      && (scope === 'all' || query || filter !== 'all' || entry.dataset.featured === 'true'));
    const visibleSet = new Set(visible);
    entries.forEach(entry => { entry.hidden = !visibleSet.has(entry); });
    const keys = view === 'theme'
      ? categories.filter(category => entries.some(entry => entry.dataset.category === category))
      : [...new Set(entries.map(entry => entry.dataset.year))];
    const fragment = document.createDocumentFragment();
    for (const key of keys) {
      const section = document.createElement('section');
      section.className = 'cv-group';
      section.dataset.cvGroup = key;
      const header = document.createElement('header');
      header.className = 'cv-group-header';
      const heading = document.createElement('h2');
      heading.className = 'cv-group-heading';
      heading.id = `cv-group-${key}`;
      heading.textContent = view === 'theme' ? categoryLabels[key] : key === 'undated' ? 'Selected projects' : key;
      section.setAttribute('aria-labelledby', heading.id);
      const note = document.createElement('p');
      note.className = 'cv-group-note';
      note.textContent = (view === 'theme' ? categoryNotes[key] : yearNotes[key]) || '';
      const count = document.createElement('span');
      count.className = 'cv-group-count';
      const container = document.createElement('div');
      container.className = 'cv-entries';
      const members = entries.filter(entry => view === 'theme' ? entry.dataset.category === key : entry.dataset.year === key)
        .sort((a, b) => entryOrder.get(a) - entryOrder.get(b));
      let visibleIndex = 0;
      members.forEach(entry => {
        if (visibleSet.has(entry)) {
          entry.dataset.side = visibleIndex % 2 === 0 ? 'left' : 'right';
          visibleIndex += 1;
        }
        container.append(entry);
      });
      count.textContent = `${visibleIndex} ${visibleIndex === 1 ? 'entry' : 'entries'}`;
      section.hidden = visibleIndex === 0;
      header.append(heading, note, count);
      section.append(header, container);
      fragment.append(section);
    }
    groups.replaceChildren(fragment);
    root.dataset.view = view;
    root.dataset.scope = scope;
    empty.hidden = visible.length > 0;
    results.textContent = `Showing ${visible.length} of ${entries.length} entries${query ? ' · search results' : ''}`;
    if (viewNote) viewNote.textContent = view === 'timeline' ? 'Follow the journey, most recent first.' : 'Explore the work through seven themes.';
    filterButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.cvFilter === filter));
      const count = button.querySelector('[data-count]');
      if (count) count.textContent = entries.filter(entry => matchesQuery(entry) && (button.dataset.cvFilter === 'all' || entry.dataset.category === button.dataset.cvFilter)).length;
    });
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cvView === view)));
    scopeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cvScope === scope)));
    expandButton.disabled = visible.length === 0;
    collapseButton.disabled = visible.length === 0;
    if (restoreFocus && active.isConnected && !active.closest('[hidden]')) active.focus({ preventScroll: true });
  }

  function cancelMovement() {
    revision += 1;
    movementAnimations.forEach(animation => animation.cancel());
    movementAnimations.clear();
    if (transition) {
      transition.skipTransition();
      transition = null;
    }
  }

  function animateUpdate() {
    cancelMovement();
    const ticket = revision;
    if (motion.matches) {
      update();
      return Promise.resolve();
    }
    if (document.startViewTransition) {
      const current = document.startViewTransition(() => {
        if (ticket === revision) update();
      });
      transition = current;
      current.ready.catch(() => {});
      current.finished.catch(() => {}).finally(() => { if (transition === current) transition = null; });
      return current.updateCallbackDone.catch(() => {});
    }
    const previous = new Map(entries.filter(entry => !entry.hidden).map(entry => [entry, entry.getBoundingClientRect()]));
    update();
    if (Element.prototype.animate) {
      for (const entry of entries.filter(entry => !entry.hidden)) {
        const before = previous.get(entry);
        const after = entry.getBoundingClientRect();
        const frames = before
          ? [{ transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` }, { transform: 'none' }]
          : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
        if (before && before.top === after.top && before.left === after.left) continue;
        const animation = entry.animate(frames, { duration: 480, easing: 'cubic-bezier(.22,.68,.22,1)' });
        movementAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => movementAnimations.delete(animation));
      }
    }
    return Promise.resolve();
  }

  entries.forEach(entry => entry.querySelector('summary').addEventListener('click', event => {
    // Keyboard activation of a native summary also produces a click.
    if (event.target.closest('a, button, input, select, textarea')) return;
    event.preventDefault();
    const open = disclosureAnimations.get(entry)?.open ?? entry.open;
    setDisclosure(entry, !open);
  }));
  viewButtons.forEach(button => button.addEventListener('click', () => {
    if (view === button.dataset.cvView) return;
    view = button.dataset.cvView;
    animateUpdate();
  }));
  scopeButtons.forEach(button => button.addEventListener('click', () => {
    if (scope === button.dataset.cvScope && !query && filter === 'all') return;
    scope = button.dataset.cvScope;
    if (scope === 'highlights') {
      clearTimeout(searchTimer);
      query = '';
      filter = 'all';
      search.value = '';
    }
    animateUpdate();
  }));
  filterButtons.forEach(button => button.addEventListener('click', () => {
    if (filter === button.dataset.cvFilter && scope === 'all') return;
    filter = button.dataset.cvFilter;
    scope = 'all';
    animateUpdate();
  }));
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = search.value.trim().toLocaleLowerCase();
      scope = 'all';
      // Searching stays immediate; spatial motion is reserved for reorganization.
      cancelMovement();
      update();
    }, 100);
  });
  expandButton.addEventListener('click', () => entries.filter(entry => !entry.hidden).forEach(entry => setDisclosure(entry, true, false)));
  collapseButton.addEventListener('click', () => entries.filter(entry => !entry.hidden).forEach(entry => setDisclosure(entry, false, false)));
  root.querySelector('[data-cv-reset]').addEventListener('click', () => {
    clearTimeout(searchTimer);
    query = '';
    filter = 'all';
    scope = 'all';
    search.value = '';
    animateUpdate();
    search.focus();
  });

  document.querySelectorAll('[data-cv-jump]').forEach(link => link.addEventListener('click', async event => {
    const category = link.dataset.cvJump;
    if (!categories.includes(category)) return;
    event.preventDefault();
    clearTimeout(searchTimer);
    view = 'theme';
    scope = 'all';
    filter = 'all';
    query = '';
    search.value = '';
    await animateUpdate();
    const heading = document.getElementById(`cv-group-${category}`);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
  }));

  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = entries.find(entry => entry.id === id);
    if (!target) return;
    clearTimeout(searchTimer);
    cancelMovement();
    query = '';
    filter = 'all';
    scope = 'all';
    search.value = '';
    update();
    setDisclosure(target, true, false);
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' }));
  }
  addEventListener('hashchange', revealHash);
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    cancelMovement();
    entries.forEach(finishDisclosure);
    update();
  });
  addEventListener('beforeprint', () => {
    if (printState) return;
    cancelMovement();
    entries.forEach(finishDisclosure);
    printState = { scope, filter, query, open: new Map([...entries, ...appendices].map(entry => [entry, entry.open])) };
    scope = 'all';
    filter = 'all';
    query = '';
    update();
    [...entries, ...appendices].forEach(entry => { entry.open = true; });
  });
  addEventListener('afterprint', () => {
    if (!printState) return;
    ({ scope, filter, query } = printState);
    update();
    printState.open.forEach((open, entry) => { entry.open = open; });
    printState = null;
  });

  update();
  revealHash();
}

document.querySelectorAll('[data-cv]').forEach(initializeCV);
