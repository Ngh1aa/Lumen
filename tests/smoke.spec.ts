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

test('curated exhibition exposes all six chapters, reflection prompts and exit actions', async ({ page }) => {
  await page.goto('/#/exhibition');
  await expect(page.getByRole('heading', { name: /Signals from a quiet machine/i })).toBeVisible();
  await expect(page.locator('.journey-chapter')).toHaveCount(6);
  await expect(page.locator('#threshold')).toBeVisible();

  await page.locator('.journey-rail button').filter({ hasText: 'Noise' }).click();
  await expect(page.locator('#noise')).toBeInViewport();
  await expect(page.locator('#noise .chapter-question')).toBeVisible();

  await page.locator('#signal').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /Save this journey/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Explore by mood/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Continue drifting from here/i })).toBeVisible();
  await expect(page.locator('.journey-credits')).toContainText('prototype content');
  await expect(seriousAxeViolations(page)).resolves.toEqual([]);
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
  await expect(page.getByText(/Wikimedia Commons/i)).toBeVisible();
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

test('curated journey media renders', async ({ page }) => {
  await page.goto('/#/exhibition');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.journey img'));
    return images.length >= 7 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
});
