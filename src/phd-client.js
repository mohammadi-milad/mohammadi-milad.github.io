const interests = document.querySelector('.phd-themes');

if (interests) {
  const disclosures = [...interests.querySelectorAll('details')];
  let printState;

  const openLinkedTheme = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const theme = target?.closest('.phd-theme');
    if (theme) theme.querySelector('details').open = true;
  };

  // Native links retain their normal URL, focus, and no-JavaScript behavior.
  document.querySelector('.phd-map')?.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.getElementById(link.hash.slice(1))?.querySelector('details')?.setAttribute('open', '');
  });
  window.addEventListener('hashchange', openLinkedTheme);
  openLinkedTheme();

  window.addEventListener('beforeprint', () => {
    if (printState) return;
    printState = disclosures.map(details => details.open);
    disclosures.forEach(details => { details.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!printState) return;
    disclosures.forEach((details, index) => { details.open = printState[index]; });
    printState = undefined;
  });
}
