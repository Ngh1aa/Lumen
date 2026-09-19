import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seriousAxeViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
}

test('flagship journey moves from Portal to Drift, preview, Detail and Atlas', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/LUMEN/);
  await expect(page.getByRole('heading', { name: /DON'T SEARCH/i })).toBeVisible();

  await page.getByRole('button', { name: /Start drifting/i }).click();
  await expect(page.getByRole('heading', { name: /Follow what catches/i })).toBeVisible();
  await expect(page.getByText(/Cool tones · 2000s/i)).toBeVisible();

  await page.locator('.drift-art').first().click();
  await expect(page.locator('.quick-preview')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open full object/i })).toBeVisible();

  await page.getByRole('button', { name: /Open full object/i }).click();
  await expect(page.locator('.detail')).toBeVisible();
  await expect(page.getByRole('button', { name: /Show connections/i })).toBeVisible();
  await expect(page.locator('.detail-threads')).toBeVisible();

  await page.getByRole('button', { name: /Show connections/i }).click();
  await expect(page.getByRole('heading', { name: /Follow the reason/i })).toBeVisible();
  await expect(page.locator('.atlas-filter-bar button')).toHaveCount(5);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('Drift controls pause, speed and keyboard traversal remain usable', async ({ page }) => {
  await page.goto('/#/drift');
  await expect(page.locator('.drift-art')).toHaveCount(13);

  const first = page.locator('.drift-art').first();
  const second = page.locator('.drift-art').nth(1);
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();

  await page.getByRole('button', { name: 'Pause drift' }).click();
  await expect(page.locator('.drift-section')).toHaveClass(/is-paused/);
  await page.getByRole('button', { name: 'Fast' }).click();
  await expect(page.locator('.drift-section')).toHaveAttribute('data-speed', 'fast');
});

test('mobile core pages do not introduce horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['/#/drift', '/#/grid', '/#/color', '/#/mood', '/#/collection', '/#/about', '/#/exhibition']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, route + ' should fit the mobile viewport').toBe(false);
  }
});

test('public-domain artwork imagery renders in the browser', async ({ page }) => {
  await page.goto('/#/drift');
  await expect(page.locator('.drift-art')).toHaveCount(13);
  await page.evaluate(() => {
    document.querySelectorAll<HTMLImageElement>('.drift-image-wrap img').forEach((image) => {
      image.loading = 'eager';
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.drift-image-wrap img'));
    return images.length === 13 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
  await page.evaluate(() => window.scrollTo(0, 0));
});

test('Grid provides a predictable collection recovery path', async ({ page }) => {
  await page.goto('/#/grid');
  await expect(page.getByRole('heading', { name: /Prefer order/i })).toBeVisible();
  await expect(page.locator('.grid-card')).toHaveCount(13);

  await page.getByRole('button', { name: /Warm/ }).click();
  const warmCount = await page.locator('.grid-card').count();
  expect(warmCount).toBeGreaterThan(0);
  expect(warmCount).toBeLessThan(13);

  await page.getByRole('button', { name: /^All/ }).click();
  await expect(page.locator('.grid-card')).toHaveCount(13);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('Color discovery supports one or two labelled colors', async ({ page }) => {
  await page.goto('/#/color');
  await expect(page.getByRole('heading', { name: /Start with a color/i })).toBeVisible();

  const swatches = page.locator('.chromatic-rail button');
  await expect(swatches).toHaveCount(13);

  await swatches.nth(0).click();
  await swatches.nth(1).click();
  await expect(page.locator('.chromatic-rail button[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('.color-selection-note')).toContainText('Intersection');

  await swatches.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.chromatic-rail button[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('.chromatic-ranked button')).toHaveCount(6);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('saved collection covers empty, populated, naming, notes and thread view', async ({ page }) => {
  await page.goto('/#/collection');
  await expect(page.getByRole('heading', { name: /Saved by drifting/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Nothing here yet/i })).toBeVisible();

  await page.goto('/#/drift');
  await page.locator('.drift-art').first().click();
  await page.getByRole('button', { name: 'Save +' }).click();
  await page.getByRole('button', { name: /Close quick preview/i }).click();

  await page.goto('/#/collection');
  await expect(page.locator('.saved-grid article')).toHaveCount(1);

  const nameInput = page.getByLabel('Collection name');
  await nameInput.fill('Quiet signals');
  await expect(nameInput).toHaveValue('Quiet signals');

  await page.getByRole('button', { name: 'Thread' }).click();
  await expect(page.locator('.saved-grid')).toHaveClass(/saved-grid--thread/);

  const note = page.getByPlaceholder('Why did this stay with you?');
  await note.fill('The color felt like a held note.');
  await expect(note).toHaveValue('The color felt like a held note.');

  await expect(page.getByRole('button', { name: 'Share as link' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export as image' })).toBeEnabled();
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('Mood discovery exposes nine editorial paths and explicit rationale', async ({ page }) => {
  await page.goto('/#/mood');
  await expect(page.getByRole('heading', { name: /Start with a feeling/i })).toBeVisible();

  const moodButtons = page.locator('.mood-cloud button');
  await expect(moodButtons).toHaveCount(9);
  await moodButtons.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(moodButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.mood-statement')).toContainText('Restless');
  await expect(page.locator('.mood-results article')).toHaveCount(6);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('VINCENT super project exposes nine sensory rooms and rights-safe music controls', async ({ page }) => {
  await page.goto('/#/exhibition');
  await expect(page.getByRole('heading', { name: /VINCENT The Painted Night/i })).toBeVisible();
  await expect(page.locator('.vincent-room')).toHaveCount(9);
  await expect(page.locator('#threshold')).toBeVisible();

  const rail = page.locator('.vincent-room-links button');
  await expect(rail).toHaveCount(9);
  await rail.filter({ hasText: 'Brush' }).click();
  await expect(page.locator('#brush')).toBeInViewport();
  const zoom = page.getByLabel('Brush detail zoom');
  await expect(zoom).toHaveValue('1.7');
  await page.getByRole('button', { name: /Zoom in brush detail/i }).click();
  await expect(zoom).toHaveValue('2.2');

  await rail.filter({ hasText: 'Places' }).click();
  await expect(page.locator('#places')).toBeInViewport();
  await expect(page.locator('.vincent-place-stops button')).toHaveCount(5);
  await page.locator('.vincent-place-stops button').filter({ hasText: 'Saint-Rémy' }).click();
  await expect(page.locator('.vincent-place-reading')).toContainText('Saint-Rémy');

  await rail.filter({ hasText: 'Letters' }).click();
  await expect(page.locator('#letters')).toBeInViewport();
  await expect(page.locator('.letter-node')).toHaveCount(4);
  await page.locator('.letter-node').filter({ hasText: 'HARVEST' }).click();
  await expect(page.locator('.vincent-letter-reading')).toContainText('21 Jun 1888');
  await expect(page.getByRole('link', { name: /Open scholarly letter record/i })).toBeVisible();

  await rail.filter({ hasText: 'Vincent' }).click();
  await expect(page.locator('#vincent')).toBeInViewport();
  await expect(page.getByRole('link', { name: /official song story/i })).toBeVisible();

  const sound = page.getByRole('button', { name: /Sound off/i });
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await sound.click();
  await expect(page.getByRole('button', { name: /Sound on/i })).toHaveAttribute('aria-pressed', 'true');

  await rail.filter({ hasText: 'Afterlight' }).click();
  await expect(page.getByRole('button', { name: /Return to Drift/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Explore by Color/i })).toBeVisible();
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});


test('VINCENT cultural threads connect artwork, place and letter and persist saves', async ({ page }) => {
  await page.goto('/#/exhibition');

  await page.getByRole('button', { name: /Open thread navigator/i }).click();
  const drawer = page.locator('.vincent-thread-drawer');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('heading', { name: /Arles \/ Night \/ Interior/i })).toBeVisible();

  const saintRemy = drawer.getByRole('button', { name: /Saint-Rémy \/ Field \/ Cypress/i });
  await saintRemy.click();
  await expect(drawer.getByRole('heading', { name: /Saint-Rémy \/ Field \/ Cypress/i })).toBeVisible();
  await expect(drawer.locator('.vincent-thread-artworks a')).toHaveCount(3);
  await expect(drawer).toContainText('Wheatfield and cypresses');

  await drawer.getByRole('button', { name: /Save this thread/i }).click();
  await expect(drawer.getByRole('status')).toContainText('Saved to this browser');
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('lumen-vincent-threads'))).toContain('saint-remy-field');

  await drawer.getByRole('button', { name: /Enter place room/i }).click();
  await expect(page.locator('#places')).toBeInViewport();
  await expect(page.locator('.vincent-place-reading')).toContainText('Saint-Rémy');

  await page.getByRole('button', { name: /Open thread navigator/i }).click();
  await page.locator('.vincent-thread-tabs button').filter({ hasText: 'Saint-Rémy' }).click();
  await page.locator('.vincent-thread-drawer').getByRole('button', { name: /Enter letter room/i }).click();
  await expect(page.locator('#letters')).toBeInViewport();
  await expect(page.locator('.vincent-letter-reading')).toContainText('28 Sep 1889');
  await expect(page.locator('.vincent-letter-reading')).toContainText('CYPRESSES');

  await page.getByRole('button', { name: /Open thread navigator/i }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.vincent-thread-drawer')).toHaveCount(0);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});



test('VINCENT Thread Atlas filters verified cultural threads without inventing links', async ({ page }) => {
  await page.goto('/#/exhibition');

  await page.getByRole('button', { name: /Open Vincent thread atlas/i }).click();
  const atlas = page.locator('.vincent-atlas-layer');
  await expect(atlas).toBeVisible();
  await expect(atlas.getByRole('heading', { name: 'Thread Atlas' })).toBeVisible();
  await expect(atlas.locator('.vincent-atlas-thread')).toHaveCount(2);

  const time1889 = atlas.locator('.vincent-atlas-filter').filter({ hasText: 'Time' }).getByRole('button', { name: '1889' });
  await time1889.click();
  await expect(time1889).toHaveAttribute('aria-pressed', 'true');
  await expect(atlas.locator('.vincent-atlas-thread')).toHaveCount(1);
  await expect(atlas).toContainText('Saint-Rémy / Field / Cypress');

  const arles = atlas.locator('.vincent-atlas-filter').filter({ hasText: 'Place' }).getByRole('button', { name: 'Arles' });
  await arles.click();
  await expect(atlas.locator('.vincent-atlas-thread')).toHaveCount(0);
  await expect(atlas.getByRole('status')).toContainText('No connection matches');

  await atlas.locator('.vincent-atlas-filter').filter({ hasText: 'Time' }).getByRole('button', { name: 'All' }).click();
  await expect(atlas.locator('.vincent-atlas-thread')).toHaveCount(1);
  await expect(atlas).toContainText('Arles / Night / Interior');

  await atlas.getByRole('button', { name: /Save \+/i }).click();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('lumen-vincent-threads'))).toContain('arles-night');

  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.locator('.vincent-atlas-layer')).toHaveCount(0);
});

test('Artwork Detail exposes technical provenance, zoom and three continuation threads', async ({ page }) => {
  await page.goto('/#/artwork/abstract-0008');
  await expect(page.locator('.detail')).toBeVisible();
  await expect(page.locator('.detail-tags span')).toHaveCount(4);
  await expect(page.locator('.thread-list button')).toHaveCount(3);
  await expect(page.getByText(/Public domain/i)).toBeVisible();

  await page.getByRole('button', { name: 'Zoom image' }).click();
  await expect(page.locator('.detail-art-stage')).toHaveClass(/is-zoomed/);
});

test('Atlas relationship filters, recenter and trace are keyboard-accessible', async ({ page }) => {
  await page.goto('/#/atlas/abstract-0008');
  await expect(page.locator('.atlas-list li')).toHaveCount(4);

  const theme = page.getByRole('button', { name: 'Theme', exact: true });
  await theme.click();
  await expect(theme).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.atlas-list li')).toHaveCount(3);

  await page.getByRole('button', { name: /Trace this path/i }).click();
  await expect(page.getByRole('status')).toContainText('Path saved');

  await page.locator('.atlas-list li button').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.atlas')).toBeVisible();
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('About explains method, sources and accessibility without fake validation claims', async ({ page }) => {
  await page.goto('/#/about');
  await expect(page.getByRole('heading', { name: /A museum for weak intent/i })).toBeVisible();
  await expect(page.locator('.about-sources')).toContainText('Wikimedia Commons');
  await expect(page.getByText(/WCAG 2.2 AA/i)).toBeVisible();
  await expect(page.locator('.method-grid article')).toHaveCount(4);
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
});

test('accessibility settings persist reduced motion and higher contrast', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: /Open accessibility settings/i }).click();
  await expect(page.getByRole('heading', { name: /Adjust the room/i })).toBeVisible();

  const motion = page.locator('.setting-row').filter({ hasText: 'Reduced motion' });
  const contrast = page.locator('.setting-row').filter({ hasText: 'Higher contrast' });
  await motion.click();
  await contrast.click();

  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'high');
  await page.keyboard.press('Escape');
  await expect(page.locator('.access-panel')).toHaveCount(0);
});

test('unknown routes resolve to a useful 404 recovery state', async ({ page }) => {
  await page.goto('/#/this-thread-does-not-exist');
  await expect(page.getByRole('heading', { name: /This path faded out/i })).toBeVisible();
  await page.getByRole('button', { name: /Start drifting/i }).click();
  await expect(page.getByRole('heading', { name: /Follow what catches/i })).toBeVisible();
});

test('VINCENT exhibition media renders', async ({ page }) => {
  await page.goto('/#/exhibition');
  await page.evaluate(() => {
    document.querySelectorAll<HTMLImageElement>('.vincent-experience img').forEach((image) => { image.loading = 'eager'; });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.vincent-experience img'));
    return images.length >= 8 && images.every((image) => image.complete && image.naturalWidth > 0);
  }, undefined, { timeout: 30000 });
});
