import './cv-client.js';
document.documentElement.classList.add('js');
const appearance = document.querySelector('#appearance');
try { appearance.value = localStorage.getItem('appearance') || 'system'; } catch {}
appearance?.addEventListener('change', () => {
  const value = appearance.value;
  if (value === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = value;
  try { localStorage.setItem('appearance', value); } catch {}
});
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const closeMenu = () => { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); };
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
const media = window.matchMedia('(min-width: 901px)');
media.addEventListener('change', closeMenu);
for (const collection of document.querySelectorAll('[data-collection]')) {
  const buttons = [...collection.querySelectorAll('[data-filter]')];
  const items = [...collection.querySelectorAll('[data-collection-item]')];
  const apply = (filter) => {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    let count = 0;
    items.forEach(item => { item.hidden = filter !== 'all' && !item.dataset.tags.split('|').includes(filter); if (!item.hidden) count++; });
    const status = collection.querySelector('[data-collection-count]');
    if (status) status.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
    const empty = collection.querySelector('[data-collection-empty]');
    if (empty) empty.hidden = count !== 0;
  };
  buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
  collection.querySelector('[data-reset-collection]')?.addEventListener('click', () => { apply('all'); buttons[0].focus(); });
}
for (const copy of document.querySelectorAll('[data-copy-link]')) {
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); copy.textContent = 'Link copied ✓'; }
    catch { copy.textContent = 'Copy the address from your browser'; }
    setTimeout(() => { copy.textContent = 'Copy page link'; }, 2800);
  });
}
// Track the article section without changing scroll or keyboard focus.
const toc = document.querySelector('.article-toc');
if (toc && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      toc.querySelectorAll('a').forEach(a => {
        if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-10% 0px -65% 0px' });
  document.querySelectorAll('.prose h2[id]').forEach(h => observer.observe(h));
}
