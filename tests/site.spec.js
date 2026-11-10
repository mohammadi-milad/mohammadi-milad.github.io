import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { site } from '../src/config.js';

const screenshotDirectory = 'artifacts/qa';

async function routes(request) {
  const response = await request.get('/site-manifest.json');
  expect(response.ok()).toBeTruthy();
  return (await response.json()).routes;
}

async function loaded(page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toBeVisible();
}

for (const colorScheme of ['light', 'dark']) {
  for (const width of [1440, 768, 390, 320]) {
    test(`all routes remain readable at ${width}px in ${colorScheme} mode`, async ({ page, request }) => {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ colorScheme });
      const errors = [];
      const externalRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => {
        if (!new URL(request.url()).hostname.match(/^(localhost|127\.0\.0\.1)$/)) externalRequests.push(request.url());
      });
      for (const route of await routes(request)) {
        const response = await page.goto(route);
        expect(response.status(), route).toBe(200);
        await loaded(page);
        const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
        expect(dimensions.content, `${route} horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.width + 1);
        await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
        await expect.poll(
          () => page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src)),
          { message: `${route} image loading` }
        ).toEqual([]);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('#appearance')).toHaveValue('system');
        if ([1440, 390].includes(width) && ['/', '/cv/', '/phd/', '/research/', '/research/psycidra/', '/blog/', '/blog/a-place-for-unfinished-thoughts/'].includes(route)) {
          await fs.mkdir(screenshotDirectory, { recursive: true });
          const name = route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-|-$/g, '');
          await page.screenshot({ path: `${screenshotDirectory}/${name}-${width}-${colorScheme}.png`, fullPage: true });
          if (route === '/cv/') await page.screenshot({ path: `${screenshotDirectory}/cv-overview-${width}-${colorScheme}.png` });
        }
      }
      expect(errors).toEqual([]);
      expect(externalRequests, 'All assets should be self-hosted').toEqual([]);
    });
  }

  test(`all routes pass automated WCAG AA checks in ${colorScheme} mode`, async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ colorScheme });
    for (const route of await routes(request)) {
      await page.goto(route);
      await loaded(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations, `${route}: ${JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([]);
    }
  });
}

test('appearance follows the device, persists a choice, and restores system preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const theme = page.locator('#appearance');
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await expect(theme).toHaveValue('system');
  const dark = await background();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect.poll(background).not.toBe(dark);
  const light = await background();
  await theme.selectOption('dark');
  await expect.poll(background).toBe(dark);
  await page.goto('/research/');
  await expect(theme).toHaveValue('dark');
  expect(await background()).toBe(dark);
  await theme.selectOption('system');
  await expect.poll(background).toBe(light);
  await page.reload();
  await expect(theme).toHaveValue('system');
});

test('the reading layout shares one type family and a restrained heading scale', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of await routes(request)) {
    await page.goto(route);
    await loaded(page);
    const typography = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('body, #primary-nav a, h1, h2, main p, button, input, select')];
      const families = [...new Set(elements.map(element => getComputedStyle(element).fontFamily))];
      const headings = [...document.querySelectorAll('h1')].map(element => parseFloat(getComputedStyle(element).fontSize));
      return { families, headings };
    });
    expect(typography.families, `${route}: prose, navigation, headings, and controls should share a type family`).toHaveLength(1);
    const maximumHeadingSize = 34;
    for (const size of typography.headings) expect(size, `${route}: preserve the intended editorial or reading scale`).toBeLessThanOrEqual(maximumHeadingSize);
  }
});

test('the reading font loads locally and includes its redistribution license', async ({ page, request, baseURL }) => {
  const fontResponses = [];
  page.on('response', response => {
    if (new URL(response.url()).pathname.endsWith('.woff2')) fontResponses.push({ url: response.url(), status: response.status() });
  });
  await page.goto('/');
  await loaded(page);
  const font = await page.evaluate(() => {
    const normalize = family => family.replaceAll('"', '').replaceAll("'", '').trim();
    const family = normalize(getComputedStyle(document.body).fontFamily.split(',')[0]);
    const faces = [...document.fonts].filter(face => normalize(face.family) === family);
    return { family, loaded: faces.some(face => face.status === 'loaded'), usable: document.fonts.check(`17px "${family}"`) };
  });
  expect(font.loaded, `${font.family} should load as a webfont rather than fall back silently`).toBe(true);
  expect(font.usable).toBe(true);
  expect(fontResponses.length, 'A local WOFF2 font should be fetched').toBeGreaterThan(0);
  for (const response of fontResponses) {
    expect(response.status).toBe(200);
    expect(new URL(response.url).origin).toBe(new URL(baseURL).origin);
  }
  const files = await fs.readdir('public/fonts');
  const licenses = files.filter(file => /(?:OFL|LICEN[CS]E)/i.test(file));
  expect(licenses.length, 'Redistributed fonts need their license in the shipped assets').toBeGreaterThan(0);
  for (const license of licenses) {
    const response = await request.get(`/fonts/${license}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toMatch(/SIL OPEN FONT LICENSE/i);
  }
});

test('mobile navigation opens, closes, and supports keyboard dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Navigation menu' });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).not.toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Blog', exact: true })).toHaveCount(site.blog.enabled ? 1 : 0);
  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await navigation.getByRole('link', { name: 'CV', exact: true }).click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(navigation).not.toBeVisible();
  await expect(page.locator('#primary-nav a[href="/cv/"]')).toHaveAttribute('aria-current', 'page');
});

test('CV opens with the complete record organized by theme and only essential controls', async ({ page }) => {
  await page.goto('/cv/');
  const workspace = page.locator('[data-cv]');
  const entries = page.locator('[data-cv-entry]');
  const removedProjects = page.locator('#cv-text-to-insight, #cv-medyar, [data-cv-entry][data-category=projects], [data-cv-group=projects]');
  await expect(workspace).toHaveAttribute('data-view', 'theme');
  await expect(removedProjects).toHaveCount(0);
  await expect(entries).toHaveCount(23);
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
  await expect(entries.locator('.cv-theme-tag')).toHaveCount(23);
  await expect(page.locator('.cv-theme-tag:visible')).toHaveCount(0);
  await expect(page.locator('[data-cv-group="education"] #cv-masters')).toBeVisible();
  await expect(page.locator('#cv-masters .cv-date')).toHaveText('Sept 2023 – Sept 2026');
  await expect(page.locator('#cv-permedcqa')).toBeVisible();
  await expect(page.locator('[data-cv-group="publications"] [data-cv-entry]')).toHaveCount(4);
  await expect(page.locator('[data-cv-group="research"] [data-cv-entry]')).toHaveCount(2);
  await expect(page.locator('#cv-group-publications')).toHaveText('Publications');
  await expect(page.locator('#cv-group-research')).toHaveText('Research roles');
  await expect(page.locator('#cv-group-service')).toHaveText('Volunteering service');
  for (const id of ['cv-psycidra', 'cv-permedcqa']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('data-category', 'publications');
  }
  await expect(page.locator('#cv-psycidra summary')).toContainText(/under review/i);
  await expect(page.locator('#cv-permedcqa')).not.toContainText(/under review/i);
  for (const id of ['cv-acm', 'cv-tedx']) {
    const logo = page.locator(`#${id} summary img`);
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', new RegExp(id.slice(3), 'i'));
  }
  await expect(page.locator('[data-cv-search], [data-cv-filter], [data-cv-scope], [data-cv-results]')).toHaveCount(0);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.getByText(/Showing \d+ of \d+ entries/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Expand all', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Collapse all', exact: true })).toBeVisible();
  await expect(page.locator('[data-cv-opportunity]')).not.toBeVisible();

  await page.locator('[data-cv-view="timeline"]').click();
  await expect(workspace).toHaveAttribute('data-view', 'timeline');
  await expect(removedProjects).toHaveCount(0);
  await expect(page.locator('[data-cv-opportunity]')).toBeVisible();
  await expect(page.locator('[data-cv-opportunity]')).toContainText(/PhD/);
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
  await expect(page.locator('[data-cv-entry] .cv-theme-tag:visible')).toHaveCount(23);
  const themeLabels = {
    '#cv-psycidra': 'Publication',
    '#cv-masters': 'Education',
    '#cv-tedx-kish': 'Award',
    '#cv-nlp-lab': 'Research role',
    '#cv-intrest': 'Industry',
    '#cv-teaching-natural-language-processing-2026-1': 'Teaching',
    '#cv-tedx': 'Volunteering'
  };
  for (const [selector, label] of Object.entries(themeLabels)) {
    await expect(page.locator(`${selector} .cv-theme-tag`)).toContainText(label);
  }
  await expect(page.locator('.cv-theme-tag:is(a, button, [role="button"], [role="link"]), .cv-theme-tag a, .cv-theme-tag button')).toHaveCount(0);
  const opportunityBeforeEntries = await page.evaluate(() => {
    const opportunity = document.querySelector('[data-cv-opportunity]');
    const entries = [...document.querySelectorAll('[data-cv-entry]')];
    return entries.every(entry => Boolean(opportunity.compareDocumentPosition(entry) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(opportunityBeforeEntries, 'PhD availability precedes the timeline’s newest chapter').toBe(true);
});

test('theme chapters retain their reading order, numbering, and introductions after view switches', async ({ page }) => {
  await page.goto('/cv/');
  const order = ['education', 'publications', 'awards', 'research', 'industry', 'teaching', 'service'];
  const introductions = {
    industry: 'Alongside my master’s, I worked part-time as an AI Engineer.',
    teaching: 'I volunteered as a teaching assistant to gain experience and pursue my passion for teaching.',
    service: 'Volunteering during high school and my bachelor’s shaped my soft skills, especially leadership.'
  };
  const checkResearchContext = async () => {
    await expect(page.locator('[data-cv-entry][data-category="research"]')).toHaveCount(2);
    await expect.poll(() => page.locator('[data-cv-entry][data-category="research"]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(['cv-nlp-lab', 'cv-cognitive-psychology-lab']);
    for (const id of ['cv-nlp-lab', 'cv-cognitive-psychology-lab']) {
      await expect(page.locator(`#${id} .cv-entry-body`)).toContainText('as part of my master’s thesis');
      const body = page.locator(`#${id} .cv-entry-body`);
      await expect(body.locator('.cv-lab-supervisor')).toContainText('Lab Supervisor:');
      await expect(body.locator('a')).toHaveCount(1);
      await expect(body.locator('.cv-lab-supervisor a')).toHaveAttribute('href', /scholar\.google\.com\/citations\?user=/);
      await expect(body.locator('.cv-lab-supervisor a')).toHaveText(id === 'cv-nlp-lab' ? 'Prof. Heshaam Faili' : 'Prof. Hadi Moradi');
    }
  };
  const checkTheme = async () => {
    await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
    await expect(page.locator('.cv-theme-tag:visible')).toHaveCount(0);
    expect(await page.locator('[data-cv-group]').evaluateAll(nodes => nodes.map(node => node.dataset.cvGroup))).toEqual(order);
    await expect(page.locator('.cv-chapter-number')).toHaveText(['01', '02', '03', '04', '05', '06', '07']);
    await expect(page.locator('.cv-group-intro')).toHaveCount(3);
    for (const category of order.slice(0, 4)) await expect(page.locator(`[data-cv-group="${category}"] .cv-group-intro`)).toHaveCount(0);
    for (const [category, intro] of Object.entries(introductions)) await expect(page.locator(`[data-cv-group="${category}"] .cv-group-intro`)).toHaveText(intro);
    await checkResearchContext();
  };
  await checkTheme();
  await page.locator('[data-cv-view="timeline"]').click();
  await expect(page.locator('.cv-group-intro')).toHaveCount(0);
  await expect(page.locator('.cv-chapter-number')).toHaveText(['01', '02', '03']);
  await expect(page.locator('[data-cv-entry] .cv-theme-tag:visible')).toHaveCount(23);
  await checkResearchContext();
  await page.locator('[data-cv-view="theme"]').click();
  await checkTheme();
});

test('the complete CV includes school, the youth award, and the corrected TEDx role in both views', async ({ page }) => {
  await page.goto('/cv/');
  for (const view of ['theme', 'timeline', 'theme']) {
    await page.locator(`[data-cv-view="${view}"]`).click();
    const school = page.locator('#cv-high-school');
    await expect(school).toBeVisible();
    await expect(school.locator('.cv-entry-title')).toHaveText('Secondary Education');
    await expect(school.locator('.cv-entry-subtitle')).toHaveText('SAMPAD (سمپاد) · Grade 19.63/20');
    await expect(school.locator('.cv-date')).toHaveText(/2011\s*–\s*2018/);
    await school.locator('summary').click();
    await expect(school.getByText('National Organization for Development of Exceptional Talents (NODET)')).toBeVisible();
    await expect(school.getByText('Lower and upper secondary education · Diploma in Mathematics and Physics')).toBeVisible();
    await school.locator('summary').click();
    const schoolLogo = school.locator('summary img');
    await expect(schoolLogo).toBeVisible();
    await expect(schoolLogo).toHaveAttribute('src', /\/images\/organizations\/sampad\.(?:svg|png)$/);
    await expect.poll(() => schoolLogo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    const award = page.locator('#cv-tedx-kish');
    await expect(award).toBeVisible();
    await expect(award).toContainText('TEDxKish Prize 2015');
    await expect(award).toContainText('TEDxKish Youth Innovator Award');
    await expect(award.locator('.cv-date')).toHaveText('May 2015');
    const tedx = page.locator('#cv-tedx');
    await expect(tedx.locator('.cv-entry-title')).toHaveText('TEDx Organizer');
    await expect(tedx).toContainText('TED Conferences');
    await expect(tedx.locator('.cv-date')).toHaveText(/Feb 2015\s*–\s*Dec 2020/);
    await expect(tedx).toContainText('TEDxYouth@SAMPADYazd 2016');
    await expect(tedx).toContainText('TEDxUniversityOfIsfahan 2019');
    await expect(tedx.locator('a[href="https://www.ted.com/profiles/11425273/about"]')).toHaveCount(1);
    expect(await page.locator('[data-cv-entry]').evaluateAll(nodes => new Set(nodes.map(node => node.id)).size)).toBe(23);
    await expect(page.locator('a[href*="/edit/forms/"]')).toHaveCount(0);
  }
  await expect(page.locator('[data-cv-group="education"] #cv-high-school')).toBeVisible();
  await expect(page.locator('[data-cv-group="awards"] #cv-tedx-kish')).toBeVisible();
  await expect(page.locator('[data-cv-group="service"] #cv-tedx')).toBeVisible();
});

test('the timeline shows academic chapters and master’s year stages from newest to oldest', async ({ page }) => {
  await page.goto('/cv/');
  await page.locator('[data-cv-view="timeline"]').click();
  expect(await page.locator('[data-cv-group]').evaluateAll(nodes => nodes.map(node => node.dataset.cvGroup))).toEqual(['masters', 'bachelors', 'before-bachelors']);
  await expect(page.locator('.cv-chapter-number')).toHaveText(['01', '02', '03']);
  expect(await page.locator('[data-cv-stage]').evaluateAll(nodes => nodes.map(node => node.dataset.cvStage))).toEqual(['year-three', 'year-two', 'year-one']);
  await expect(page.locator('[data-cv-stage="thesis"], #cv-stage-thesis')).toHaveCount(0);
  for (const id of ['cv-high-school', 'cv-tedx', 'cv-tedx-kish']) await expect(page.locator(`[data-cv-group="before-bachelors"] #${id}`)).toBeVisible();
  for (const id of ['cv-bachelors', 'cv-acm', 'cv-teaching-undergraduate-computer-engineering-courses-2019-8']) await expect(page.locator(`[data-cv-group="bachelors"] #${id}`)).toBeVisible();
  await expect(page.locator('[data-cv-transition] #cv-national-rank')).toBeVisible();
  await expect(page.locator('[data-cv-group="masters"] #cv-masters')).toBeVisible();
  const placements = {
    'year-one': ['cv-nlp-lab', 'cv-cognitive-psychology-lab', 'cv-adan-ai'],
    'year-two': ['cv-permedcqa', 'cv-emotion-recognition-through-contrast'],
    'year-three': ['cv-psycidra', 'cv-schemagraphsql', 'cv-intrest', 'cv-teaching-natural-language-processing-2025-2', 'cv-teaching-natural-language-processing-2026-1']
  };
  for (const [stage, ids] of Object.entries(placements)) {
    for (const id of ids) await expect(page.locator(`[data-cv-stage="${stage}"] #${id}`)).toBeVisible();
  }
  const finalYearOrder = await page.locator('[data-cv-stage="year-three"] [data-cv-entry]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(finalYearOrder[0], 'PsyCIDRA is the newest record within Year three').toBe('cv-psycidra');
  for (const id of ['cv-intrest', 'cv-teaching-natural-language-processing-2026-1']) {
    expect(finalYearOrder.indexOf(id), `${id} begins in February and follows the newer March SchemaGraphSQL publication`).toBeGreaterThan(finalYearOrder.indexOf('cv-schemagraphsql'));
  }
  await expect(page.locator('#cv-psycidra .cv-date')).toHaveText(/Oct 2026/);
  await expect(page.locator('[data-cv-stage="year-three"] #cv-psycidra .cv-theme-tag')).toContainText('Publication');
  const readingOrder = await page.evaluate(() => {
    const selectors = ['[data-cv-opportunity]', '#cv-masters', '[data-cv-stage="year-three"]', '[data-cv-stage="year-two"]', '[data-cv-stage="year-one"]', '[data-cv-transition]', '[data-cv-group="bachelors"]', '[data-cv-group="before-bachelors"]'];
    return selectors.map(selector => document.querySelector(selector)).every((node, index, nodes) => node && (!index || Boolean(nodes[index - 1].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)));
  });
  expect(readingOrder, 'The next opportunity, master’s overview and stages, exam bridge, bachelor’s, and school read newest first').toBe(true);
  for (const stage of ['year-three', 'year-two', 'year-one']) {
    const order = await page.locator(`[data-cv-stage="${stage}"] [data-cv-entry]`).evaluateAll(nodes => nodes.map(node => Number(node.dataset.timelineOrder)));
    expect(order, `${stage} records read newest first`).toEqual([...order].sort((a, b) => b - a));
  }
  expect(await page.locator('[data-cv-group="bachelors"] [data-cv-entry]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(['cv-acm', 'cv-teaching-undergraduate-computer-engineering-courses-2019-8', 'cv-bachelors']);
  expect(await page.locator('[data-cv-group="before-bachelors"] [data-cv-entry]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(['cv-tedx-kish', 'cv-tedx', 'cv-high-school']);
  await expect(page.locator('[data-cv-group="before-bachelors"] .cv-group-header .cv-chapter-period')).toHaveCount(0);
  await expect(page.locator('#cv-high-school .cv-date')).toHaveText('2011 – 2018');
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
  expect((await page.locator('.cv-group-heading').allTextContents()).some(text => /^\d{4}$/.test(text.trim()))).toBe(false);
});

test('TEDx remains a single entry in its original chapter and preserves its disclosure across views', async ({ page }) => {
  await page.goto('/cv/');
  const tedx = page.locator('#cv-tedx');
  const original = await tedx.elementHandle();
  await page.locator('#cv-psycidra summary').click();
  await page.locator('[data-cv-view="timeline"]').click();
  await expect(page.locator('[data-cv-group="before-bachelors"] #cv-tedx')).toBeVisible();
  await expect(page.locator('[data-cv-continuation]')).toHaveCount(0);
  await expect(page.locator('[data-cv-group="bachelors"] #cv-tedx, [data-cv-group="bachelors"] a[href="#cv-tedx"]')).toHaveCount(0);
  await expect(page.locator('[data-cv-group="bachelors"]')).not.toContainText('TEDx');
  await tedx.locator('summary').click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'timeline');
  await expect(tedx).toHaveAttribute('open', '');
  await expect(tedx.locator('summary')).toBeFocused();
  await expect(tedx.locator('summary')).toBeInViewport();
  for (const view of ['theme', 'timeline', 'theme']) {
    await page.locator(`[data-cv-view="${view}"]`).click();
    await expect(tedx).toHaveAttribute('open', '');
    await expect(page.locator('#cv-psycidra')).toHaveAttribute('open', '');
    expect(await original.evaluate(node => node.isConnected && node === document.querySelector('#cv-tedx'))).toBe(true);
    await expect(page.locator('#cv-tedx[data-cv-entry]')).toHaveCount(1);
    await expect(page.locator('[data-cv-entry]')).toHaveCount(23);
    const group = view === 'timeline' ? 'before-bachelors' : 'service';
    await expect(page.locator(`[data-cv-group="${group}"] #cv-tedx`)).toBeVisible();
  }
  await expect(page.locator('[data-cv-continuation]')).toHaveCount(0);
});

for (const colorScheme of ['light', 'dark']) {
  test(`chapter timeline stays readable and accessible in ${colorScheme} mode`, async ({ page }) => {
    await fs.mkdir(screenshotDirectory, { recursive: true });
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto('/cv/');
      await loaded(page);
      await page.locator('[data-cv-view="timeline"]').click();
      await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
      if (width === 1440) {
        const palette = () => page.locator('[data-cv-entry] .cv-theme-tag').evaluateAll(tags => tags.map(tag => {
          const style = getComputedStyle(tag);
          return { category: tag.closest('[data-cv-entry]').dataset.category, color: style.color, background: style.backgroundColor };
        }));
        const systemPalette = await palette();
        const categoryColors = new Map();
        for (const tag of systemPalette) {
          if (categoryColors.has(tag.category)) expect(tag.color, `${tag.category} tags keep one color`).toBe(categoryColors.get(tag.category));
          else categoryColors.set(tag.category, tag.color);
          expect(['transparent', 'rgba(0, 0, 0, 0)']).not.toContain(tag.background);
        }
        expect(categoryColors.size).toBe(7);
        expect(new Set(categoryColors.values()).size, 'Each theme has its own muted color').toBe(7);
        const oppositeScheme = colorScheme === 'light' ? 'dark' : 'light';
        await page.emulateMedia({ colorScheme: oppositeScheme });
        await expect.poll(palette).not.toEqual(systemPalette);
        await page.locator('#appearance').selectOption(colorScheme);
        await expect.poll(palette, { message: 'An explicit appearance overrides the opposite device palette' }).toEqual(systemPalette);
        await page.emulateMedia({ colorScheme });
        await page.locator('#appearance').selectOption('system');
        await expect.poll(palette).toEqual(systemPalette);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Timeline overflow at ${width}px in ${colorScheme}`).toBe(true);
      for (const heading of await page.locator('.cv-group-heading').all()) {
        expect(await heading.evaluate(node => node.scrollWidth <= node.clientWidth + 1), `Chapter title fits at ${width}px`).toBe(true);
      }
      if ([1440, 390].includes(width)) await page.screenshot({ path: `${screenshotDirectory}/cv-chapter-timeline-${width}-${colorScheme}.png`, fullPage: true });
      if (width === 1440) {
        await page.locator('[data-cv-group="masters"] .cv-group-heading').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.screenshot({ path: `${screenshotDirectory}/cv-chapter-timeline-preview${colorScheme === 'dark' ? '-dark' : ''}.png` });
        if (colorScheme === 'light') {
          await page.locator('[data-cv-group="bachelors"] .cv-group-heading').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
          await page.screenshot({ path: `${screenshotDirectory}/cv-chapter-timeline-early-chapters.png` });
        }
      }
      if ([1440, 320].includes(width)) {
        const results = await new AxeBuilder({ page }).include('[data-cv]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        expect(results.violations, `Timeline at ${width}px in ${colorScheme}`).toEqual([]);
      }
    }
  });
}

test('the future PhD row opens within Education and preserves its state through CV controls', async ({ page }) => {
  await page.goto('/cv/');
  const future = page.locator('#cv-phd-future');
  await expect(future).toHaveAttribute('data-cv-future', '');
  await expect(future).not.toHaveAttribute('data-cv-entry');
  await expect(page.locator('[data-cv-group="education"] .cv-entry').first()).toHaveAttribute('id', 'cv-phd-future');
  await expect(future.locator('.cv-entry-title')).toHaveText('Looking for a PhD position');
  await expect(future.locator('.cv-date')).toHaveText('Start in 2027');
  await expect(future.locator('summary')).toContainText('?');
  await expect(future).not.toHaveAttribute('open', '');
  await future.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(future).toHaveAttribute('open', '');
  await expect(future.locator('.cv-entry-body')).toBeVisible();
  await expect(future.locator('.cv-entry-body a[href="/phd/"]')).toBeVisible();
  await page.locator('[data-cv-view="timeline"]').click();
  await expect(future).not.toBeVisible();
  await page.locator('[data-cv-view="theme"]').click();
  await expect(future).toBeVisible();
  await expect(future).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();
  await expect(future).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  await expect(future).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(future).toHaveAttribute('open', '');
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(future).not.toHaveAttribute('open', '');
  await page.locator('[data-cv-view="timeline"]').click();
  await page.evaluate(() => { location.hash = 'cv-phd-future'; });
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(future).toHaveAttribute('open', '');
  await expect(future.locator('summary')).toBeInViewport();
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
});

test('CV summaries remain compact in both views and reveal publication text on expansion', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/cv/');
    await loaded(page);
    for (const view of ['theme', 'timeline']) {
      await page.locator(`[data-cv-view="${view}"]`).click();
      await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', view);
      const summaries = page.locator('[data-cv-entry] > summary, [data-cv-future]:visible > summary');
      const rows = await summaries.evaluateAll(nodes => nodes.map(node => ({ id: node.parentElement.id, height: node.getBoundingClientRect().height })));
      for (const row of rows) expect(row.height, `${view} ${row.id} at ${width}px`).toBeLessThanOrEqual(width > 700 ? 110 : 170);
      await expect(summaries.locator('figure, .cv-preview')).toHaveCount(0);
      await expect(page.locator('[data-cv-entry][open]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  await page.locator('#cv-psycidra summary').click();
  await expect(page.locator('#cv-psycidra .cv-entry-body')).toBeVisible();
  await expect(page.locator('[data-category="publications"] .cv-entry-body .cv-visual')).toHaveCount(0);
});

test('expanded publications show full titles, authors, descriptions, and personal contributions', async ({ page }) => {
  await page.goto('/cv/');
  const papers = [
    {
      id: 'cv-psycidra',
      title: 'From Dialogue to Diagnostic Hypotheses: Evaluating LLM Agents for Psychiatric Assessment',
      authors: 'Milad Mohammadi, Fatemeh Akrami Shamsabadi, Zahra Mohseni, Amirhossein Safdarian, Malekfarhad Malek, Hadi Moradi, and Hesham Faili',
      overview: /evaluates interview quality and diagnostic hypotheses/,
      contribution: 'I conceived the research idea, developed the framework, led the project, coordinated the team, and wrote the paper.'
    },
    {
      id: 'cv-schemagraphsql',
      title: 'SchemaGraphSQL: Efficient Schema Linking with Pathfinding Graph Algorithms for Text-to-SQL on Large-Scale Databases',
      authors: 'AmirHossein Safdarian, Milad Mohammadi, Ehsan Jahanbakhsh Bashirloo, Mona Shahamat Naderi, and Heshaam Faili',
      overview: /SchemaGraphSQL combines language-model guidance with graph pathfinding/,
      contribution: 'I conducted the ablation study and contributed to writing the paper.'
    },
    {
      id: 'cv-emotion-recognition-through-contrast',
      title: 'UT-NLP at SemEval-2025 Task 11: Evaluating Zero-Shot Capability of GPT-4o mini on Emotion Recognition via Role-Play and Contrastive Judging',
      authors: 'Amirhossein Safdarian*, Milad Mohammadi*, and Heshaam Faili · * Equal contribution',
      overview: /multilingual emotion recognition with GPT-4o mini/,
      contribution: 'I developed the idea, implemented the approach, and drafted the report.'
    },
    {
      id: 'cv-permedcqa',
      title: 'PerMedCQA: Benchmarking Large Language Models on Medical Consumer Question Answering in Persian Language',
      authors: 'Naghmeh Jamali, Milad Mohammadi, Danial Baledi, Zahra Rezvani, and Hesham Faili',
      overview: /68,138 Persian consumer medical question–answer pairs/,
      contribution: 'I contributed to development and ran the experiments.'
    }
  ];
  for (const paper of papers) {
    const entry = page.locator(`#${paper.id}`);
    await entry.locator(':scope > summary').click();
    const body = entry.locator('.cv-entry-body');
    await expect(body).toBeVisible();
    await expect(body.locator('h3')).toHaveText(paper.title);
    await expect(body.locator('.cv-authors')).toHaveText(paper.authors);
    await expect(body.locator('.cv-authors strong')).toHaveCount(1);
    await expect(body.locator('.cv-authors strong')).toHaveText('Milad Mohammadi');
    await expect(body).toContainText(paper.overview);
    await expect(body).toContainText(`My contribution: ${paper.contribution}`);
    await expect(body.locator('figure, svg, .cv-visual, .cv-research-notes')).toHaveCount(0);
  }
  await expect(page.getByRole('link', { name: 'Selected workshop recordings', exact: true })).toHaveCount(0);
});

for (const width of [1440, 390]) {
  for (const [degree, label, count] of [['masters', 'M.Sc.', 1], ['bachelors', 'B.Sc.', 2]]) {
    test(`${label} English transcript opens in a same-page dialog at ${width}px and restores focus on dismissal`, async ({ page, context }) => {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/cv/');
      const initialURL = page.url();
      const initialPages = context.pages().length;
      const popups = [];
      page.on('popup', popup => popups.push(popup.url()));
      const entry = page.locator(`#cv-${degree}`);
      await entry.locator(':scope > summary').click();
      const transcript = entry.locator('[data-cv-transcript]');
      const trigger = transcript.locator(':scope > summary');
      const viewer = page.getByRole('dialog', { name: `${label} transcript · English`, exact: true });
      const previousOverflow = await page.evaluate(() => document.documentElement.style.overflow);
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      await expect(trigger).toHaveAttribute('aria-controls', 'cv-transcript-viewer');
      await expect(trigger).toContainText('View English transcript');
      if (degree === 'bachelors') await expect(trigger).toContainText('Unofficial translation');
      const thumbnailWidth = (await trigger.locator('img').boundingBox()).width;

      for (const dismissal of ['close button', 'Escape', 'backdrop']) {
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(viewer).toBeVisible();
        await expect(viewer).toHaveAttribute('open', '');
        expect(await viewer.evaluate(dialog => dialog.matches(':modal'))).toBe(true);
        await expect(viewer.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
        await expect(viewer.locator('figure img')).toHaveCount(count);
        for (let index = 1; index <= count; index++) {
          const image = viewer.getByRole('img', { name: `${label} English transcript, page ${index} of ${count}`, exact: true });
          await expect(image).toBeVisible();
          await expect(image).toHaveAttribute('src', new RegExp(`/images/transcripts/${degree}-english-${index}\\.jpg$`));
          await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
        }
        expect((await viewer.locator('figure img').first().boundingBox()).width).toBeGreaterThan(thumbnailWidth);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
        expect(page.url()).toBe(initialURL);
        expect(context.pages()).toHaveLength(initialPages);
        expect(popups).toEqual([]);
        if (dismissal === 'close button') await viewer.getByRole('button', { name: 'Close', exact: true }).click();
        else if (dismissal === 'Escape') await page.keyboard.press('Escape');
        else await page.mouse.click(1, 1);
        await expect(viewer).not.toBeVisible();
        await expect(trigger).toBeFocused();
        expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe(previousOverflow);
        await expect(page.locator('#cv-transcript-viewer [data-transcript-content] img')).toHaveCount(0);
      }
    });
  }
}

test('English transcript images remain available inline without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/cv/');
    const initialURL = page.url();
    for (const [degree, label, count] of [['masters', 'M.Sc.', 1], ['bachelors', 'B.Sc.', 2]]) {
      const entry = page.locator(`#cv-${degree}`);
      await entry.locator(':scope > summary').click();
      const transcript = entry.locator('[data-cv-transcript]');
      await transcript.locator(':scope > summary').click();
      await expect(transcript).toHaveAttribute('open', '');
      await expect(transcript.locator('.cv-transcript-pages img')).toHaveCount(count);
      for (let index = 1; index <= count; index++) {
        const image = transcript.getByRole('img', { name: `${label} English transcript, page ${index} of ${count}`, exact: true });
        await expect(image).toBeVisible();
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
      }
      expect(page.url()).toBe(initialURL);
      expect(context.pages()).toHaveLength(1);
      await expect(page.locator('#cv-transcript-viewer')).not.toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('CV disclosures support the keyboard and keep reading context through rapid view changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/cv/');
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const entry = page.locator('#cv-psycidra');
  const summary = entry.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(entry).toHaveAttribute('open', '');
  await expect.poll(() => entry.evaluate(node => node.style.height)).toBe('');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Space');
  await expect(entry).not.toHaveAttribute('open', '');
  await expect(entry.locator('.cv-entry-body')).not.toBeVisible();
  await expect.poll(() => entry.evaluate(node => node.style.overflow)).toBe('');
  await page.keyboard.press('Enter');
  await expect(entry).toHaveAttribute('open', '');

  // Dispatch faster than a transition can finish, leaving focus in the reading entry.
  await page.evaluate(() => {
    for (const view of ['theme', 'timeline', 'theme', 'timeline', 'theme']) {
      document.querySelector(`[data-cv-view="${view}"]`).click();
    }
  });
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(page.locator('[data-cv-group="publications"] #cv-psycidra')).toBeVisible();
  await expect(entry).toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await expect.poll(() => entry.evaluate(node => node.style.height)).toBe('');
  expect(errors).toEqual([]);
});

test('CV preserves expanded entries through reorganization, bulk controls, and direct links', async ({ page }) => {
  await page.goto('/cv/');
  const entry = page.locator('#cv-psycidra');
  await entry.locator('summary').click();
  await expect(entry).toHaveAttribute('open', '');
  await page.locator('[data-cv-view="timeline"]').click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'timeline');
  await expect(entry).toHaveAttribute('open', '');
  await expect(page.locator('[data-cv-view="timeline"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-cv-view="timeline"]')).toBeFocused();
  await expect(page.locator('[data-cv-view="theme"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  expect(await page.locator('[data-cv-entry]').evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  await page.locator('[data-cv-view="theme"]').click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  expect(await page.locator('[data-cv-entry]').evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  await expect(page.locator('#cv-phd-future')).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();
  expect(await page.locator('[data-cv-entry]').evaluateAll(nodes => nodes.every(node => !node.open))).toBe(true);
  await page.goto('/cv/#cv-intrest');
  await expect(page.locator('#cv-intrest')).toHaveAttribute('open', '');
  await expect(page.locator('#cv-intrest summary')).toBeInViewport();
});

test('the compact CV opening has one PDF download and highlights navigate to their evidence', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/cv/');
  await loaded(page);
  await fs.mkdir(screenshotDirectory, { recursive: true });
  await page.screenshot({ path: `${screenshotDirectory}/cv-overview-1440-light.png` });
  const heading = page.locator('.cv-heading');
  await expect(heading.getByRole('heading', { level: 1, name: 'Curriculum vitae', exact: true })).toBeVisible();
  const readingNote = heading.locator('.cv-reading-note');
  await expect(readingNote).toHaveText('I prepared this page as an in-depth, detailed CV that can be viewed by theme or as a timeline. For a compact, conventional 2-page CV, please view the PDF version.');
  await expect(readingNote.locator('strong')).toHaveText(['by theme', 'as a timeline']);
  await expect(readingNote.locator('a')).toHaveCount(0);
  await expect(heading.locator('.cv-heading-top, .cv-edition, .cv-introduction, .cv-pdf-note, .cv-document-symbol')).toHaveCount(0);
  await expect(heading).not.toContainText('I’m an AI researcher and engineer working on language agents');
  await expect(heading).not.toContainText('Open an entry for the full story');
  await expect(heading).not.toContainText('Compact 2-page CV');
  await expect(heading).not.toContainText('The conventional CV format.');
  await expect(page.locator('.cv-highlights > a')).toHaveCount(4);
  await expect(heading.locator('a[href$="/documents/milad-mohammadi-cv.pdf"]')).toHaveCount(1);
  const publicationHighlight = page.locator('.cv-highlights [data-cv-jump="publications"]');
  await expect(publicationHighlight.locator('strong')).toHaveText('4 papers');
  await expect(publicationHighlight).toContainText('2 published');
  await expect(publicationHighlight).toContainText('2 preprints (under review)');
  await expect(publicationHighlight).not.toContainText(/EACL|SemEval/i);
  const industryHighlight = page.locator('.cv-highlights [data-cv-jump="industry"]');
  await expect(industryHighlight).toContainText(/3\+\s*years/i);
  await expect(industryHighlight).toContainText(/Senior AI Engineer/i);
  await expect(industryHighlight).not.toContainText(/Adan|IntRest/);
  const downloadPDF = heading.locator('a.cv-download');
  await expect(downloadPDF).toHaveCount(1);
  await expect(downloadPDF).toHaveAccessibleName('Download compact CV as PDF');
  await expect(downloadPDF.locator('.cv-pdf-icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(downloadPDF.locator('.cv-pdf-icon svg')).toHaveCount(1);
  await expect(downloadPDF.locator('.cv-download-copy strong')).toHaveText('Download PDF');
  await expect(downloadPDF.locator('.cv-download-copy > span')).toHaveText('Compact, conventional CV');
  await expect(downloadPDF).toHaveAttribute('download', /.+/);
  const href = await downloadPDF.getAttribute('href');
  expect((await (await request.get(href)).body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.locator('.cv-highlights a[href="#cv-masters"]').click();
  await expect(page.locator('#cv-masters')).toHaveAttribute('open', '');
  await expect(page.locator('#cv-masters > summary')).toBeFocused();
  await page.locator('[data-cv-view="timeline"]').click();
  await page.locator('.cv-highlights [data-cv-jump="publications"]').click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(page.locator('#cv-group-publications')).toBeFocused();
  await expect(page.locator('#cv-group-publications')).toBeInViewport();
  await page.locator('.cv-highlights [data-cv-jump="industry"]').click();
  await expect(page.locator('#cv-group-industry')).toBeFocused();
  await expect(page.locator('#cv-group-industry')).toBeInViewport();
});

test('skills show both engineering disciplines from foundations to delivery and retain the full toolkit', async ({ page }) => {
  const profile = JSON.parse(await fs.readFile('src/data/profile.json', 'utf8'));
  const normalize = text => text.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  await page.goto('/cv/');
  const toolkit = page.locator('#cv-skills');
  const cards = toolkit.locator('.cv-skill-card[data-cv-appendix]');
  await expect(cards).toHaveCount(6);
  for (const heading of ['Foundations', 'Systems & applications', 'Production & delivery']) await expect(toolkit.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  await expect(toolkit.locator('.cv-skills-domain-heads strong')).toHaveText(['AI / ML engineering', 'Software engineering']);
  await expect(toolkit.locator('#cv-skills-options, [data-skills-customize]')).toHaveCount(0);
  const titles = ['Machine learning & deep learning', 'Software & product design', 'Foundation-model systems', 'Full-stack development', 'Model serving & evaluation', 'Software delivery & quality'];
  for (const [index, title] of titles.entries()) await expect(cards.nth(index).locator('summary')).toContainText(title);
  for (const layer of ['foundations', 'systems', 'delivery']) {
    await expect(toolkit.locator(`.cv-skill-layer[data-layer="${layer}"] .cv-skill-card`)).toHaveCount(2);
    await expect(toolkit.locator(`.cv-skill-layer[data-layer="${layer}"] .cv-skill-card[data-domain="software"]`)).toHaveCount(1);
    await expect(toolkit.locator(`.cv-skill-layer[data-layer="${layer}"] .cv-skill-card[data-domain="ai"]`)).toHaveCount(1);
  }
  await expect(cards.locator('summary .cv-skill-concepts .cv-skill-label')).toHaveText(Array(6).fill('Concepts & methods'));
  await expect(cards.locator('summary .cv-skill-tools-wrap > .cv-skill-label')).toHaveText(Array(6).fill('Tools & frameworks'));
  expect(await cards.evaluateAll(nodes => nodes.every(node => node.tagName === 'DETAILS' && !node.open))).toBe(true);
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  expect(await cards.evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  const skills = normalize(await toolkit.innerText());
  for (const keyword of profile.skills.flatMap(group => group.keywords)) expect(skills, `The reorganized toolkit should preserve ${keyword}`).toContain(normalize(keyword));
  expect(skills).toContain('langgraph');
  await page.locator('[data-cv-view="timeline"]').click();
  expect(await cards.evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();
  expect(await cards.evaluateAll(nodes => nodes.every(node => !node.open))).toBe(true);
  await cards.first().locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(cards.first()).toHaveAttribute('open', '');
  await expect(cards.first().locator('.cv-skill-content')).toBeVisible();
  await expect(cards.first().locator('summary')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(cards.first()).not.toHaveAttribute('open', '');
});

test('the finalized skills map ignores retired display settings and keeps its native disclosures', async ({ page }) => {
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.goto('/cv/');
  await page.evaluate(() => localStorage.setItem('cv-skills-design-v1', JSON.stringify({ layout: 'stacks', copy: 'narrative', detail: 'expanded', logos: 'text', lead: 'software', open: ['cv-skill-software'] })));
  await page.goto('/cv/?skills-layout=stacks&skills-copy=narrative&skills-detail=expanded&skills-logos=text&skills-lead=software&skills-open=software#cv-skills');
  const toolkit = page.locator('#cv-skills');
  await expect(toolkit.getByRole('heading', { name: 'Technical Skills Map', exact: true })).toBeVisible();
  await expect(toolkit.locator('#cv-skills-options, [data-skills-customize], [data-skills-setting], [data-skills-preset]')).toHaveCount(0);
  await expect(toolkit.getByText('Display options', { exact: true })).toHaveCount(0);
  await expect(toolkit.locator('.cv-skills-domain-heads strong')).toHaveText(['AI / ML engineering', 'Software engineering']);
  await expect(toolkit.locator('.cv-skill-card')).toHaveCount(6);
  await expect(toolkit.locator('.cv-skill-card[open]')).toHaveCount(0);
  const introduction = await toolkit.locator('.cv-skills-intro').innerText();
  expect(introduction.split(/[.!?](?:\s|$)/).filter(sentence => sentence.trim())).toHaveLength(2);
  for (const term of [/agentic coding/i, /Codex/, /research/i, /industry/i, /design/i, /architect/i, /deliver/i, /deploy/i]) expect(introduction).toMatch(term);
  await page.locator('#cv-skill-ai-systems summary').click();
  await expect(page.locator('#cv-skill-ai-systems')).toHaveAttribute('open', '');
  await page.locator('[data-cv-view="timeline"]').click();
  await expect(page.locator('#cv-skill-ai-systems')).toHaveAttribute('open', '');
  await expect(page.locator('#cv-skill-ai-systems .cv-skill-content')).toBeVisible();
  expect(requests.some(address => /\/cv-skills-client\.js(?:[?#]|$)/.test(address))).toBe(false);
  expect(errors).toEqual([]);
});

test('the final AI-first skills map aligns closed cards and keeps the overview minimal', async ({ page }) => {
  await fs.mkdir(screenshotDirectory, { recursive: true });
  for (const width of [1440, 768, 640, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/cv/#cv-skills');
    await loaded(page);
    const toolkit = page.locator('#cv-skills');
    await expect(toolkit.locator('#cv-skills-options, [data-skills-customize]')).toHaveCount(0);
    await expect(toolkit.locator('.cv-skill-layer-heading h3')).toHaveText(['Foundations', 'Systems & applications', 'Production & delivery']);
    await expect(toolkit.locator('.cv-skill-layer-heading p, .cv-skill-description, .cv-skill-evidence')).toHaveCount(0);
    await expect(toolkit.locator('.cv-skill-card[open]')).toHaveCount(0);
    if (width > 560) await expect(toolkit.locator('.cv-skill-card-kicker:visible')).toHaveCount(0);
    const labels = await toolkit.locator('.cv-skill-layer-heading').evaluateAll(headings => headings.map(heading => ({ rail: heading.getBoundingClientRect().toJSON(), number: heading.querySelector('.cv-skill-layer-number').getBoundingClientRect().toJSON(), title: heading.querySelector('h3').getBoundingClientRect().toJSON(), cardsHeight: heading.parentElement.querySelector('.cv-skill-cards').getBoundingClientRect().height })));
    for (const label of labels) {
      expect(label.title.top + 1, `Layer heading below its number at ${width}px`).toBeGreaterThanOrEqual(label.number.bottom);
      if (width > 700) {
        expect(label.rail.width, `Compact vertical layer rail at ${width}px`).toBeLessThanOrEqual(40);
        expect(label.rail.height, `Layer rail fits its cards at ${width}px`).toBeLessThanOrEqual(label.cardsHeight + 1);
      } else expect(Math.abs(label.number.left - label.title.left), `Stacked layer label alignment at ${width}px`).toBeLessThanOrEqual(1);
    }
    const rows = await toolkit.locator('.cv-skill-layer').evaluateAll(layers => layers.map(layer => [...layer.querySelectorAll('.cv-skill-card')].map(card => {
      const rect = card.getBoundingClientRect();
      const position = selector => card.querySelector(selector).getBoundingClientRect().top;
      return { id: card.id, domain: card.dataset.domain, top: rect.top, bottom: rect.bottom, title: position('.cv-skill-title'), concepts: position('.cv-skill-concepts'), tools: position('.cv-skill-tools-wrap') };
    })));
    for (const row of rows) {
      expect(row.map(card => card.domain)).toEqual(['ai', 'software']);
      if (width > 560) for (const edge of ['top', 'bottom', 'title', 'concepts', 'tools']) {
        expect(Math.abs(row[0][edge] - row[1][edge]), `${row[0].id} / ${row[1].id} ${edge} alignment at ${width}px`).toBeLessThanOrEqual(1);
      }
    }
    const overflow = await toolkit.locator('.cv-skill-card').evaluateAll(cards => cards.flatMap(card => {
      const bounds = card.getBoundingClientRect();
      return [...card.querySelectorAll('summary .cv-skill-title, summary .cv-skill-concepts, summary .cv-skill-tools-wrap, summary .cv-skill-tool')].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.bottom > bounds.bottom + 1 || element.scrollWidth > element.clientWidth + 1;
      }).map(element => `${card.id}: ${element.className}`);
    }));
    expect(overflow, `Card contents at ${width}px`).toEqual([]);
    const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width + 1);
    const tools = toolkit.locator('summary .cv-skill-tool');
    expect(await tools.count()).toBeGreaterThan(0);
    await expect(tools.locator('.cv-tool-logo img')).toHaveCount(await tools.count());
    await expect(page.locator('#cv-skill-model-ops summary img[src$="/vllm.svg"]')).toHaveCount(1);
    await expect(page.locator('#cv-skill-ai-systems summary .cv-skill-tool')).toHaveCount(4);
    await expect(page.locator('#cv-skill-ai-systems summary img[src$="/langgraph.svg"]')).toHaveCount(1);
    await expect(page.locator('#cv-skill-ai-systems summary img[src$="/milvus.svg"]')).toHaveCount(1);
    // Fit the section to verify lazy local marks and capture the selected design.
    const sectionHeight = Math.ceil((await toolkit.boundingBox()).height);
    await page.setViewportSize({ width, height: Math.max(960, sectionHeight + 100) });
    await toolkit.scrollIntoViewIfNeeded();
    await expect.poll(() => tools.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src))).toEqual([]);
    if ([1440, 390].includes(width)) await toolkit.screenshot({ path: `${screenshotDirectory}/cv-skills-final-${width}-light.png` });
  }
});

test('the technical skills map stays readable and accessible at desktop, tablet and mobile sizes', async ({ page }) => {
  test.setTimeout(120_000);
  await fs.mkdir(screenshotDirectory, { recursive: true });
  for (const colorScheme of ['light', 'dark']) {
    for (const width of [1440, 768, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ colorScheme });
      await page.goto('/cv/');
      await loaded(page);
      const toolkit = page.locator('#cv-skills');
      for (const expanded of [false, true]) {
        await page.getByRole('button', { name: expanded ? 'Expand all' : 'Collapse all', exact: true }).click();
        // Fit the section so its local marks load before checking/capturing.
        const sectionHeight = Math.ceil((await toolkit.boundingBox()).height);
        await page.setViewportSize({ width, height: Math.max(960, sectionHeight + 100) });
        await toolkit.scrollIntoViewIfNeeded();
        const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
        const scenario = `${expanded ? 'expanded' : 'overview'} at ${width}px in ${colorScheme}`;
        expect(dimensions.content, `Technical Skills Map ${scenario}`).toBeLessThanOrEqual(dimensions.width + 1);
        await expect.poll(() => toolkit.locator('img:visible').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src))).toEqual([]);
        if ((width === 1440 && !expanded) || (width === 390 && expanded)) await toolkit.screenshot({ path: `${screenshotDirectory}/technical-skills-map-${expanded ? 'expanded' : 'overview'}-${width}-${colorScheme}.png` });
        const results = await new AxeBuilder({ page }).include('#cv-skills').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        expect(results.violations, `Technical Skills Map ${scenario}`).toEqual([]);
        await page.setViewportSize({ width, height: 960 });
      }
    }
  }
});

test('TOEFL report distinguishes test-day and MyBest scores with the verified section labels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/cv/');
  await loaded(page);
  // Values checked against the report’s visual tables. The PDF text layer swaps
  // Writing and Speaking, so it must not silently become the score source.
  const scores = {
    'test-day': { overall: '5.5', comparable: '110', cefr: 'C1', sections: { Reading: '6.0', Listening: '6.0', Writing: '5.5', Speaking: '5.0' } },
    mybest: { overall: '6.0', comparable: '118', cefr: 'C2', sections: { Reading: '6.0', Listening: '6.0', Writing: '5.5', Speaking: '5.5' } }
  };
  await expect(page.locator('[data-toefl-panel]')).toHaveCount(2);
  for (const [type, expected] of Object.entries(scores)) {
    const panel = page.locator(`[data-toefl-panel="${type}"]`);
    await expect(panel.locator('.cv-total-score strong')).toHaveText(expected.overall);
    await expect(panel.locator('.cv-score-comparable strong')).toHaveText(expected.comparable);
    await expect(panel.locator('.cv-cefr')).toHaveText(`CEFR ${expected.cefr}`);
    await expect(panel.locator('[data-toefl-section]')).toHaveCount(4);
    await expect(panel.locator('.cv-toefl-panel-heading time')).toHaveAttribute('datetime', '2026-07-25');
    for (const [section, value] of Object.entries(expected.sections)) {
      const result = panel.locator(`[data-toefl-section="${section}"]`);
      await expect(result.locator('dt')).toHaveText(section);
      await expect(result.locator('[data-toefl-value]')).toHaveText(value);

    }
  }
  await expect(page.locator('[data-toefl-panel="test-day"] h3')).toHaveText('Test-day scores');
  await expect(page.locator('[data-toefl-panel="mybest"] h3')).toContainText('MyBest');
  await expect(page.locator('.cv-score-footnote')).toContainText(/highest section scores across valid tests/i);
  const dateNote = page.locator('.cv-score-date-note');
  await expect(dateNote).toContainText('Speaking');
  await expect(dateNote).toContainText(/other sections|Reading.*Listening.*Writing/i);
  await expect(dateNote.locator('time')).toHaveCount(2);
  await expect(dateNote.locator('time[datetime="2026-07-19"]')).toHaveCount(1);
  await expect(dateNote.locator('time[datetime="2026-07-25"]')).toHaveCount(1);
  await fs.mkdir(screenshotDirectory, { recursive: true });
  await page.locator('.cv-toefl-report').screenshot({ path: `${screenshotDirectory}/cv-toefl-report-1440-light.png` });
});

test('language and reference details remain complete in the compact ending', async ({ page }) => {
  const profile = JSON.parse(await fs.readFile('src/data/profile.json', 'utf8'));
  await page.goto('/cv/');
  const languages = page.locator('#cv-languages');
  for (const language of profile.languages) {
    await expect(languages).toContainText(language.language);
    await expect(languages).toContainText(language.fluency);
  }
  const references = page.locator('#cv-references');
  for (const reference of profile.references) {
    const card = references.locator('.cv-academic-reference').filter({ has: page.getByRole('heading', { name: reference.name, exact: true }) });
    await expect(card).toContainText(reference.position);
    await expect(card).toContainText(`${reference.institution} · ${reference.department}`);
    if (reference.relationship) await expect(card).toContainText(reference.relationship);
    await expect(card.locator(`a[href="mailto:${reference.email}"]`)).toBeVisible();
    await expect(card.getByRole('link', { name: `Google Scholar — ${reference.name}`, exact: true })).toHaveAttribute('href', reference.scholar);
    if (reference.universityPage) await expect(card.getByRole('link', { name: `University page — ${reference.name}`, exact: true })).toHaveAttribute('href', reference.universityPage);
    if (reference.personalPage) await expect(card.getByRole('link', { name: `Personal page — ${reference.name}`, exact: true })).toHaveAttribute('href', reference.personalPage);
  }
  await expect(references.locator('a[href$=".pdf"]')).toHaveCount(0);
});

test('the compact CV ending stays readable and accessible across screen sizes', async ({ page }) => {
  await fs.mkdir(screenshotDirectory, { recursive: true });
  for (const colorScheme of ['light', 'dark']) {
    for (const width of [1440, 768, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ colorScheme });
      await page.goto('/cv/');
      await loaded(page);
      const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
      expect(dimensions.content, `CV ending at ${width}px in ${colorScheme}`).toBeLessThanOrEqual(dimensions.width + 1);
      for (const selector of ['#cv-languages', '#cv-references']) {
        await expect(page.locator(selector)).toBeVisible();
        const brokenImages = await page.locator(selector).locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
        expect(brokenImages).toEqual([]);
      }
      const results = await new AxeBuilder({ page }).include('#cv-languages').include('#cv-references').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations, `CV ending at ${width}px in ${colorScheme}`).toEqual([]);
      if ([1440, 390].includes(width)) {
        for (const [name, selector] of [['languages', '#cv-languages'], ['references', '#cv-references']]) {
          const section = page.locator(selector);
          const sectionHeight = Math.ceil((await section.boundingBox()).height);
          await page.setViewportSize({ width, height: Math.max(960, sectionHeight + 100) });
          await section.screenshot({ path: `${screenshotDirectory}/cv-${name}-compact-${width}-${colorScheme}.png` });
          await page.setViewportSize({ width, height: 960 });
        }
      }
    }
  }
});

test('printing expands the complete CV and restores the reader’s view and disclosures', async ({ page }) => {
  await page.goto('/cv/');
  await page.locator('[data-cv-view="timeline"]').click();
  await page.locator('#cv-masters > summary').click();
  await expect(page.locator('#cv-masters')).toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#cv-masters').evaluate(node => node.style.height)).toBe('');
  const beforePrint = await page.locator('details').evaluateAll(nodes => nodes.map(node => node.open));
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  expect(await page.locator('[data-cv-entry], [data-cv-future], [data-cv-appendix]').evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  await expect(page.locator('#cv-skills-options, [data-skills-customize]')).toHaveCount(0);
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(23);
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  expect(await page.locator('details').evaluateAll(nodes => nodes.map(node => node.open))).toEqual(beforePrint);
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'timeline');
});

test('CV works with reduced motion and without native view transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv/');
  const total = await page.locator('[data-cv-entry]').count();
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(total);
  const summary = page.locator('#cv-psycidra summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cv-psycidra')).toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#cv-psycidra').evaluate(node => node.getAnimations().length)).toBe(0);
  await page.locator('[data-cv-view="theme"]').click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(total);
  await expect(page.locator('#cv-psycidra')).toHaveAttribute('open', '');
  await expect(page.locator('[data-cv-view="theme"]')).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => { document.startViewTransition = undefined; });
  await page.getByRole('button', { name: 'Timeline', exact: true }).click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'timeline');
  await expect(page.locator('[data-cv-entry]:visible').first()).toBeVisible();
});

test('all content, mobile navigation, and expandable CV remain available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/cv/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.locator('[data-cv-controls]').first()).not.toBeVisible();
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(await page.locator('[data-cv-entry]').count());
  await expect(page.locator('#cv-permedcqa')).toBeVisible();
  const future = page.locator('#cv-phd-future');
  await expect(future).toBeVisible();
  await future.locator('summary').click();
  await expect(future).toHaveAttribute('open', '');
  await expect(future.locator('.cv-entry-body a[href="/phd/"]')).toBeVisible();
  const first = page.locator('[data-cv-entry]').first();
  await first.locator(':scope > summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('.cv-entry-body')).toBeVisible();
  const skill = page.locator('#cv-skills .cv-skill-card').first();
  await expect(page.locator('#cv-skills .cv-skill-card')).toHaveCount(6);
  await expect(page.locator('#cv-skills .cv-skill-layer')).toHaveCount(3);
  await expect(page.locator('#cv-skills-options, [data-skills-customize]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Technical Skills Map', exact: true })).toBeVisible();
  await expect(skill).toBeVisible();
  await skill.locator('summary').click();
  await expect(skill).toHaveAttribute('open', '');
  await expect(skill.locator('.cv-skill-content')).toBeVisible();
  await context.close();
});

test('publication list, blog availability, minimal paper pages, and PDF download are usable', async ({ page, request }) => {
  await page.goto('/research/');
  await expect(page.getByRole('heading', { name: 'Publication', exact: true })).toBeVisible();
  await expect(page.locator('.publication-index-heading').getByRole('link', { name: 'Google Scholar' })).toHaveAttribute('href', 'https://scholar.google.com/citations?user=RltQFhwAAAAJ');
  const publications = page.getByRole('region', { name: 'Publications', exact: true });
  await expect(publications.locator('.research-list')).toHaveCount(1);
  await expect(publications.locator('.research-row')).toHaveCount(4);
  await expect(publications.locator('.research-row h3')).toHaveText([
    /From Dialogue to Diagnostic Hypotheses/, /SchemaGraphSQL/, /SemEval-2025/, /PerMedCQA/
  ]);
  await expect(page.locator('main h2')).toHaveCount(0);
  await expect(publications.locator('.publication-venue')).toContainText([
    /Preprint/, /Findings of EACL/, /SemEval/, /Preprint/
  ]);
  await expect(page.locator('.publication-note, .research-description')).toHaveCount(0);
  const filters = publications.getByRole('group', { name: 'Filter publications' });
  for (const [label, titles] of [
    ['Published', [/SchemaGraphSQL/, /SemEval-2025/]],
    ['Preprints', [/From Dialogue to Diagnostic Hypotheses/, /PerMedCQA/]],
    ['All', [/From Dialogue to Diagnostic Hypotheses/, /SchemaGraphSQL/, /SemEval-2025/, /PerMedCQA/]]
  ]) {
    const button = filters.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(publications.locator('[data-collection-item]:visible h3')).toHaveText(titles);
  }
  expect(await publications.evaluate(node => getComputedStyle(node).borderTopWidth)).toBe('0px');
  await page.getByRole('link', { name: 'Milad Mohammadi, home' }).click();
  await expect(page.locator('.home-research .research-feature')).toHaveCount(2);
  await expect(page.locator('.research-feature-sketch svg')).toHaveCount(2);
  const featuredPaper = page.locator('.research-feature').first();
  await expect(featuredPaper.getByRole('heading', { level: 3 })).toHaveAccessibleName('From Dialogue to Diagnostic Hypotheses: Evaluating LLM Agents for Psychiatric Assessment');
  await expect(featuredPaper.getByRole('link', { name: 'Paper', exact: true })).toHaveAttribute('href', 'https://arxiv.org/abs/2610.07473v2');
  await expect(page.locator('.research-feature h3').nth(1)).toContainText('SchemaGraphSQL');
  await expect(page.locator('.research-feature').first().locator('.research-feature-meta')).toContainText('Under review');
  await page.getByRole('link', { name: 'All publications', exact: false }).click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Blog', exact: true })).toHaveCount(site.blog.enabled ? 1 : 0);
  if (site.blog.enabled) {
    await page.goto('/projects/');
    await expect(page).toHaveURL(/\/blog\/$/);
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
    await expect(page.locator('.blog-post')).toHaveCount(1);
    await expect(page.locator('.blog-post time')).toHaveAttribute('datetime', '2026-11-07');
    await expect(page.getByText('Projects & ideas', { exact: true })).toHaveCount(0);
    await page.getByRole('link', { name: 'A place for unfinished thoughts', exact: true }).click();
    await expect(page.getByText('Sample post', { exact: true })).toBeVisible();
    const blogContents = page.getByRole('navigation', { name: 'Contents', exact: true });
    await blogContents.getByRole('link', { name: 'Beyond the technical world', exact: true }).click();
    await expect(page).toHaveURL(/#beyond-the-technical-world$/);
    await expect(page.getByRole('heading', { name: 'Beyond the technical world', exact: true })).toBeInViewport();
    await page.getByRole('link', { name: '← All posts', exact: true }).click();
    await expect(page).toHaveURL(/\/blog\/$/);
  } else {
    await expect(page.locator('a[href*="/blog/"]')).toHaveCount(0);
    for (const route of ['/projects/', '/ideas/']) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/cv\/$/);
    }
    for (const route of ['/blog/', '/blog/a-place-for-unfinished-thoughts/']) {
      const response = await request.get(route);
      expect(response.status(), `${route}: disabled blog is not published`).toBe(404);
      expect(await response.text()).not.toContain('A place for unfinished thoughts');
    }
    expect(await routes(request)).not.toEqual(expect.arrayContaining([expect.stringMatching(/^\/blog\//)]));
    for (const route of ['/sitemap.xml', '/feed.xml']) {
      const response = await request.get(route);
      expect(response.ok()).toBeTruthy();
      expect(await response.text(), `${route}: disabled blog is not advertised`).not.toContain('/blog/');
    }
  }
  for (const slug of ['psycidra', 'schemagraphsql', 'emotion-recognition', 'permedcqa']) {
    await page.goto(`/research/${slug}/`);
    const paper = page.locator('main article');
    const author = paper.locator('.article-authors strong.self-author');
    await expect(author).toHaveText('Milad Mohammadi');
    expect(await author.evaluate(element => Number(getComputedStyle(element).fontWeight)), `${slug}: owner name is bold`).toBeGreaterThanOrEqual(600);
    await expect(paper.locator('.entry-meta')).toBeVisible();
    await expect(paper.locator('.entry-meta > span')).toHaveCount(3);
    await expect(paper.getByRole('link', { name: 'Paper', exact: true })).toHaveAttribute('href', /^https:\/\/(arxiv\.org|aclanthology\.org)\//);
    const code = paper.getByRole('link', { name: 'Code & materials', exact: true });
    if (['psycidra', 'emotion-recognition'].includes(slug)) await expect(code).toHaveAttribute('href', /^https:\/\/github\.com\//);
    else await expect(code).toHaveCount(0);
    await expect(paper.getByRole('heading', { level: 2 })).toHaveText(['Abstract']);
    await expect(paper.locator('figure')).toHaveCount(1);
    await expect(paper.locator('figure figcaption')).toBeVisible();
    expect((await paper.locator('figure figcaption').innerText()).trim().length, `${slug}: figure caption`).toBeGreaterThan(30);
    const figure = paper.locator('figure img');
    await expect(figure).toHaveCount(1);
    expect((await figure.getAttribute('alt')).trim().length, `${slug}: descriptive figure alternative`).toBeGreaterThan(20);
    const source = await figure.getAttribute('src');
    expect(new URL(source, page.url()).origin, `${slug}: self-hosted figure`).toBe(new URL(page.url()).origin);
    await expect.poll(() => figure.evaluate(image => image.complete && image.naturalWidth > 0), { message: `${slug}: figure loaded` }).toBe(true);
    await expect(paper.locator('.page-intro, .article-toc, .article-navigation, .findings-chart, .process-figure, pre, [data-copy-link]')).toHaveCount(0);
    await expect(paper.getByRole('heading', { name: /citation|results|findings/i })).toHaveCount(0);
  }
  const pdf = await request.get('/documents/milad-mohammadi-cv.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const legacyPDF = await request.get('/assets/pdf/MiladMohammadi_CV.pdf');
  expect(legacyPDF.status()).toBe(200);
  const missing = await request.get('/definitely-missing-route/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Return home');
});

test('expanded CV and mobile navigation pass automated WCAG AA checks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.goto('/cv/');
    await page.getByRole('button', { name: 'Expand all', exact: true }).click();
    await page.locator('[data-cv-view="theme"]').click();
    await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
    await page.getByRole('button', { name: 'Navigation menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations, colorScheme).toEqual([]);
    await fs.mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: `${screenshotDirectory}/cv-expanded-theme-390-${colorScheme}.png`, fullPage: true });
  }
});
