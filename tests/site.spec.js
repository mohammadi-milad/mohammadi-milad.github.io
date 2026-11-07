import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const screenshotDirectory = 'artifacts/qa';

async function routes(request) {
  const response = await request.get('/site-manifest.json');
  expect(response.ok()).toBeTruthy();
  return (await response.json()).routes;
}

async function loaded(page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1')).toBeVisible();
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
        const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
        expect(brokenImages, `${route} image loading`).toEqual([]);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('#appearance')).toHaveValue('system');
        if ([1440, 390].includes(width) && ['/', '/cv/', '/phd/', '/research/', '/research/psycidra/', '/blog/', '/blog/a-place-for-unfinished-thoughts/'].includes(route)) {
          await fs.mkdir(screenshotDirectory, { recursive: true });
          const name = route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-|-$/g, '');
          await page.screenshot({ path: `${screenshotDirectory}/${name}-${width}-${colorScheme}.png`, fullPage: true });
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

test('the reading layout shares one type family with a distinct CV editorial heading', async ({ page, request }) => {
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
    const maximumHeadingSize = route === '/cv/' ? 54 : 34;
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
  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await navigation.getByRole('link', { name: 'CV', exact: true }).click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(navigation).not.toBeVisible();
  await expect(page.locator('#primary-nav a[href="/cv/"]')).toHaveAttribute('aria-current', 'page');
});

test('CV key moments offer an overview while complete view and search expose the full record', async ({ page }) => {
  await page.goto('/cv/');
  const workspace = page.locator('[data-cv]');
  const entries = page.locator('[data-cv-entry]');
  const visibleEntries = page.locator('[data-cv-entry]:visible');
  const total = await entries.count();
  await expect(workspace).toHaveAttribute('data-scope', 'highlights');
  const highlighted = await visibleEntries.count();
  expect(highlighted).toBeGreaterThan(0);
  expect(highlighted).toBeLessThan(total);
  await expect(page.locator('#cv-permedcqa')).not.toBeVisible();
  await expect(page.locator('[data-cv-group="2026"] #cv-masters')).toBeVisible();
  await expect(page.locator('#cv-masters .cv-date')).toHaveText('Sept 2023 – Sept 2026');

  await page.getByRole('button', { name: /^Complete CV/ }).click();
  await expect(workspace).toHaveAttribute('data-scope', 'all');
  await expect(visibleEntries).toHaveCount(total);
  await page.getByRole('button', { name: /^Key moments/ }).click();
  await expect(visibleEntries).toHaveCount(highlighted);
  await page.getByRole('searchbox', { name: 'Search all CV entries' }).fill('PerMedCQA');
  await expect(workspace).toHaveAttribute('data-scope', 'all');
  await expect(page.locator('#cv-permedcqa')).toBeVisible();
  await expect(visibleEntries).toHaveCount(1);
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
  await expect(page.locator('[data-cv-group="research"] #cv-psycidra')).toBeVisible();
  await expect(entry).toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await expect.poll(() => entry.evaluate(node => node.style.height)).toBe('');
  expect(errors).toEqual([]);
});

test('CV preserves expanded entries through animated reorganization and supports search and filters', async ({ page }) => {
  await page.goto('/cv/');
  const entries = page.locator('[data-cv-entry]');
  const first = entries.first();
  const firstId = await first.getAttribute('id');
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'By theme', exact: true }).click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(page.locator(`#${firstId}`)).toHaveAttribute('open', '');
  await expect(page.getByRole('button', { name: 'By theme', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'By theme', exact: true })).toBeFocused();
  expect(await page.locator('.skip-link').evaluate(link => link.matches(':focus'))).toBe(false);
  await page.locator('[data-cv-filter="industry"]').click();
  await expect.poll(() => page.locator('[data-cv-entry]:visible').count()).toBe(2);
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  expect(await page.locator('[data-cv-entry]:visible').evaluateAll(nodes => nodes.every(node => node.open))).toBe(true);
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();
  expect(await page.locator('[data-cv-entry]:visible').evaluateAll(nodes => nodes.every(node => !node.open))).toBe(true);
  await page.locator('[data-cv-filter="all"]').click();
  await page.getByRole('searchbox', { name: 'Search all CV entries' }).fill('PsyCIDRA');
  await expect.poll(() => page.locator('[data-cv-entry]:visible').count()).toBeGreaterThan(0);
  await expect.poll(() => page.locator('[data-cv-entry]:visible').count()).toBeLessThan(await entries.count());
  await page.getByRole('searchbox', { name: 'Search all CV entries' }).fill('a-query-with-no-matching-experience');
  await expect(page.locator('[data-cv-empty]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Expand all', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset search & filters', exact: true }).click();
  await expect(page.locator('[data-cv-empty]')).not.toBeVisible();
  await expect.poll(() => page.locator('[data-cv-entry]:visible').count()).toBe(await entries.count());
  await page.getByRole('button', { name: 'Timeline', exact: true }).click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'timeline');
  await page.goto('/cv/#cv-intrest');
  await expect(page.locator('#cv-intrest')).toHaveAttribute('open', '');
});

test('CV works with reduced motion and without native view transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv/');
  const total = await page.locator('[data-cv-entry]').count();
  await page.getByRole('button', { name: /^Complete CV/ }).click();
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(total);
  const summary = page.locator('#cv-psycidra summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cv-psycidra')).toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#cv-psycidra').evaluate(node => node.getAnimations().length)).toBe(0);
  await page.getByRole('button', { name: 'By theme', exact: true }).click();
  await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(total);
  await expect(page.locator('#cv-psycidra')).toHaveAttribute('open', '');
  await expect(page.getByRole('button', { name: 'By theme', exact: true })).toBeFocused();
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
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.locator('[data-cv-controls]').first()).not.toBeVisible();
  await expect(page.locator('[data-cv-entry]:visible')).toHaveCount(await page.locator('[data-cv-entry]').count());
  await expect(page.locator('#cv-permedcqa')).toBeVisible();
  const first = page.locator('[data-cv-entry]').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('.cv-entry-body')).toBeVisible();
  await context.close();
});

test('research filters, blog navigation, article contents, and PDF download are usable', async ({ page, request }) => {
  await page.goto('/research/');
  const firstFilter = page.locator('[data-filter]').nth(1);
  const filter = await firstFilter.getAttribute('data-filter');
  await firstFilter.click();
  expect(await page.locator('[data-collection-item]:visible').evaluateAll((nodes, selected) => nodes.every(node => node.dataset.tags.split('|').includes(selected)), filter)).toBe(true);
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
  await page.goto('/research/psycidra/');
  const tocLinks = await page.getByRole('navigation', { name: 'Article contents' }).locator('a').evaluateAll(nodes => nodes.map(node => node.hash));
  expect(tocLinks.length).toBeGreaterThan(2);
  for (const hash of tocLinks) await expect(page.locator(hash)).toHaveCount(1);
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
    await page.getByRole('button', { name: 'By theme', exact: true }).click();
    await expect(page.locator('[data-cv]')).toHaveAttribute('data-view', 'theme');
    await page.getByRole('button', { name: 'Navigation menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations, colorScheme).toEqual([]);
    await fs.mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: `${screenshotDirectory}/cv-expanded-theme-390-${colorScheme}.png`, fullPage: true });
  }
});
