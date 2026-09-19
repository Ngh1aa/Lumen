import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('flagship journey is navigable and has no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/LUMEN/);
  await expect(page.getByRole('heading', { name: /DON'T SEARCH/i })).toBeVisible();

  await page.getByRole('button', { name: /Enter collection/i }).click();
  await expect(page.getByRole('heading', { name: /Follow what catches/i })).toBeVisible();

  const firstArtwork = page.locator('.drift-art').first();
  await firstArtwork.click();
  await expect(page.locator('.detail')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open relationship Atlas/i })).toBeVisible();

  await page.getByRole('button', { name: /Open relationship Atlas/i }).click();
  await expect(page.getByRole('heading', { name: /Why this work/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('mobile core pages do not introduce horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/drift');
  await expect(page.locator('.drift-section')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});


test('public-domain artwork imagery renders in the browser', async ({ page }) => {
  await page.goto('/#/drift');
  await expect(page.locator('.drift-art').first()).toBeVisible();
  await page.evaluate(() => {
    document.querySelectorAll<HTMLImageElement>('.drift-image-wrap img').forEach((image) => {
      image.loading = 'eager';
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.drift-image-wrap img'));
    return images.length >= 7 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
  await page.evaluate(() => window.scrollTo(0, 0));
});


test('discovery modes are keyboard-usable and axe-clean', async ({ page }) => {
  await page.goto('/#/grid');
  await expect(page.getByRole('heading', { name: /See the whole collection/i })).toBeVisible();
  await expect(page.locator('.grid-card')).toHaveCount(8);

  await page.getByRole('button', { name: 'Color' }).first().click();
  await expect(page.getByRole('heading', { name: /Browse the spectrum/i })).toBeVisible();

  const swatches = page.locator('.chromatic-rail button');
  await expect(swatches).toHaveCount(8);
  await swatches.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(swatches.nth(2)).toHaveAttribute('aria-pressed', 'true');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('saved collection covers empty and populated states', async ({ page }) => {
  await page.goto('/#/saved');
  await expect(page.getByRole('heading', { name: /Saved objects/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Nothing held yet/i })).toBeVisible();

  await page.goto('/#/drift');
  await page.locator('.drift-art').first().click();
  await page.getByRole('button', { name: 'Save +' }).click();
  await page.goto('/#/saved');

  await expect(page.locator('.saved-grid article')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('new discovery routes do not overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['/#/grid', '/#/color', '/#/saved']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  }
});


test('mood discovery supports keyboard selection and clear non-color labels', async ({ page }) => {
  await page.goto('/#/mood');
  await expect(page.getByRole('heading', { name: /Choose a feeling/i })).toBeVisible();

  const moodButtons = page.locator('.mood-selector button');
  await expect(moodButtons).toHaveCount(5);
  await moodButtons.nth(3).focus();
  await page.keyboard.press('Enter');
  await expect(moodButtons.nth(3)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.mood-statement')).toContainText('Restless');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('curated journey exposes chapters, source-safe storytelling and exit actions', async ({ page }) => {
  await page.goto('/#/journey');
  await expect(page.getByRole('heading', { name: /Signals from a quiet machine/i })).toBeVisible();
  await expect(page.locator('.journey-chapter')).toHaveCount(5);
  await expect(page.locator('#signal')).toBeVisible();

  await page.locator('.journey-rail button').filter({ hasText: 'Contrast' }).click();
  await expect(page.locator('#contrast')).toBeInViewport();

  await page.locator('#afterimage').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /Explore by mood/i })).toBeVisible();
  await expect(page.locator('.journey-credits')).toContainText('prototype content');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('mood and journey remain within mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['/#/mood', '/#/journey']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  }
});

test('curated journey media renders', async ({ page }) => {
  await page.goto('/#/journey');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.journey img'));
    return images.length >= 6 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
});
