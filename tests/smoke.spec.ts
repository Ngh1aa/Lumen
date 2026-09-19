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
