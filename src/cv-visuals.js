/** Small, source-grounded figures for the interactive CV. */
const rule = 'var(--line)';
const ink = 'var(--muted)';
const accent = 'var(--green)';
const paper = 'var(--bg)';

const frame = (id, title, drawing, caption) => `<figure class="cv-visual cv-visual-${id}">
  <svg viewBox="0 0 360 126" role="img" aria-labelledby="cv-visual-title-${id}" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <title id="cv-visual-title-${id}">${title}</title>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">${drawing}</g>
  </svg>
  <figcaption>${caption}</figcaption>
</figure>`;

const label = (x, y, text, color = ink, size = 14, anchor = 'middle') => `<text x="${x}" y="${y}" fill="${color}" stroke="none" text-anchor="${anchor}" font-family="inherit" font-size="${size}">${text}</text>`;
const arrow = (x1, x2, y) => `<path d="M${x1} ${y}H${x2}m-5-4 5 4-5 4" stroke="${ink}" stroke-width="1.25"/>`;

export function cvVisual(id) {
  if (id === 'cv-psycidra') {
    return frame('psycidra', 'PsyCIDRA separates interviewing, collected evidence, and diagnostic reasoning.', `
      <g stroke="${rule}" stroke-width="1.2">
        <rect x="7" y="15" width="101" height="75" rx="4"/>
        <rect x="251" y="15" width="101" height="75" rx="4"/>
      </g>
      <g stroke="${accent}" stroke-width="1.4">
        <path d="M28 32h44a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H42l-8 7v-7h-6a4 4 0 0 1-4-4V36a4 4 0 0 1 4-4Z"/>
        <path d="M52 64h35m-25 7h25M34 40h32m-32 7h21"/>
        <rect x="160" y="29" width="40" height="48" rx="2"/>
        <path d="M168 40h24m-24 9h24m-24 9h15m-15 9h20"/>
        <path d="m267 36 4 4 7-9m-11 22 4 4 7-9m-11 22 4 4 7-9M286 36h47m-47 17h35m-35 17h43"/>
      </g>
      ${arrow(117, 150, 53)}${arrow(210, 242, 53)}
      ${label(58, 113, 'Interview')}${label(180, 113, 'Evidence')}${label(302, 113, 'Reasoning')}
    `, 'Conceptual architecture · two agents, distinct responsibilities.');
  }

  if (id === 'cv-schemagraphsql') {
    return frame('schemagraphsql', 'A highlighted path connects relevant tables within a larger schema graph.', `
      <g stroke="${rule}" stroke-width="1.2">
        <path d="M50 34h113m29 0h113M50 83h113m29 0h113M37 47v23m140-23v23m141-23v23M50 34l113 49m29 0 113-49"/>
        <rect x="24" y="21" width="26" height="26" rx="3"/>
        <rect x="164" y="21" width="26" height="26" rx="3"/>
        <rect x="304" y="21" width="26" height="26" rx="3"/>
        <rect x="24" y="70" width="26" height="26" rx="3"/>
        <rect x="164" y="70" width="26" height="26" rx="3"/>
        <rect x="304" y="70" width="26" height="26" rx="3"/>
      </g>
      <path d="M50 34h114m13 13v23m13 13h114" stroke="${accent}" stroke-width="2"/>
      <g stroke="${accent}" stroke-width="1.5" fill="${paper}">
        <rect x="24" y="21" width="26" height="26" rx="3"/>
        <rect x="164" y="21" width="26" height="26" rx="3"/>
        <rect x="164" y="70" width="26" height="26" rx="3"/>
        <rect x="304" y="70" width="26" height="26" rx="3"/>
      </g>
      <g stroke="${ink}" stroke-width="1"><path d="M30 29h14m-14 5h14m-14 5h8m122-10h14m-14 5h14m-14 5h8m122-10h14m-14 5h14m-14 5h8M30 78h14m-14 5h14m-14 5h8m122-10h14m-14 5h14m-14 5h8m122-10h14m-14 5h14m-14 5h8"/></g>
      <circle cx="108" cy="34" r="3" fill="${accent}"/><circle cx="248" cy="83" r="3" fill="${accent}"/>
      ${label(177, 119, 'Find the path. Keep the relevant tables.')}
    `, 'Conceptual schema · language-model guidance meets graph search.');
  }

  if (id === 'cv-emotion-recognition' || id === 'cv-emotion-recognition-through-contrast') {
    return frame('emotion-recognition', 'Role-play rewrites create variants of a text, then contrastive judging compares them with the original.', `
      <g stroke="${rule}" stroke-width="1.2">
        <rect x="9" y="35" width="75" height="39" rx="3"/>
        <rect x="141" y="12" width="75" height="30" rx="3"/>
        <rect x="141" y="64" width="75" height="30" rx="3"/>
        <path d="M85 54h23m0 0V27h32m-32 27v25h32m76-52h22v52h-22"/>
      </g>
      <g stroke="${accent}" stroke-width="1.4">
        <path d="M23 47h47m-47 8h47m-47 8h28M154 22h48m-48 9h31M154 75h48m-48 9h39"/>
        <circle cx="301" cy="54" r="27"/>
        <path d="M287 49h28m-28 9h28m-14-21v33"/>
      </g>
      ${arrow(238, 269, 54)}
      ${label(47, 116, 'Original text')}${label(179, 116, 'Role-play')}${label(301, 116, 'Compare')}
    `, 'Conceptual pipeline · emotion recognition through contrast.');
  }

  if (id === 'cv-adan-ai') {
    return frame('adan-ai', 'Reported Persian PDF pipeline outcomes: 50 percent lower processing costs and an 8 percentage point retrieval accuracy improvement.', `
      <path d="M180 13v91" stroke="${rule}"/>
      ${label(86, 56, '−50%', accent, 35)}
      ${label(86, 87, 'Processing cost', ink, 14)}
      ${label(273, 56, '+8 pp', accent, 35)}
      ${label(273, 87, 'Retrieval accuracy', ink, 14)}
    `, 'Reported pipeline outcomes · retrieval measured on a human-annotated evaluation set.');
  }

  if (id === 'cv-intrest') {
    return frame('intrest', 'IntRest AI services span architecture, language-agent workflows, and production integration.', `
      <g stroke="${rule}" stroke-width="1.2">
        <rect x="14" y="22" width="74" height="64" rx="3"/>
        <rect x="136" y="22" width="87" height="64" rx="3"/>
        <rect x="273" y="22" width="74" height="64" rx="3"/>
      </g>
      <g stroke="${accent}" stroke-width="1.4">
        <rect x="39" y="34" width="24" height="12" rx="2"/>
        <path d="M51 46v10m-18 0h36M33 56v7m36-7v7"/>
        <rect x="24" y="63" width="18" height="10" rx="2"/><rect x="60" y="63" width="18" height="10" rx="2"/>
        <circle cx="156" cy="54" r="7"/><circle cx="180" cy="40" r="7"/><circle cx="204" cy="54" r="7"/><circle cx="180" cy="68" r="7"/>
        <path d="m162 50 11-6m14 0 11 6m0 8-11 6m-14 0-11-6"/>
        <path d="M288 38h44v32h-44zM288 46h44m-31 10 5 5 12-11"/>
      </g>
      ${arrow(97, 127, 54)}${arrow(233, 263, 54)}
      ${label(51, 113, 'Architecture')}${label(180, 113, 'Workflows')}${label(310, 113, 'Integration')}
    `, 'Scope of work · from AI architecture to production integration.');
  }

  return '';
}
