/** Enhance inline transcript disclosures with a same-page image viewer. */
export function initializeTranscriptViewer(documentRoot = document) {
  const viewer = documentRoot.querySelector('#cv-transcript-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const title = viewer.querySelector('#cv-transcript-title');
  const content = viewer.querySelector('[data-transcript-content]');
  const close = viewer.querySelector('[data-transcript-close]');
  let trigger;
  let previousOverflow;

  documentRoot.querySelectorAll('[data-cv-transcript]').forEach(transcript => {
    const summary = transcript.querySelector('summary');
    summary.setAttribute('aria-haspopup', 'dialog');
    summary.setAttribute('aria-controls', viewer.id);
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (viewer.open) return;
      trigger = summary;
      title.textContent = transcript.dataset.transcriptTitle;
      const pages = transcript.querySelector('.cv-transcript-pages').cloneNode(true);
      pages.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      content.replaceChildren(pages);
      previousOverflow = documentRoot.documentElement.style.overflow;
      viewer.showModal();
      documentRoot.documentElement.style.overflow = 'hidden';
      viewer.scrollTop = 0;
      close.focus({ preventScroll: true });
    });
  });

  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    documentRoot.documentElement.style.overflow = previousOverflow;
    content.replaceChildren();
    trigger?.focus({ preventScroll: true });
  });
  documentRoot.defaultView?.addEventListener('beforeprint', () => {
    if (viewer.open) viewer.close();
  });
}

initializeTranscriptViewer();
