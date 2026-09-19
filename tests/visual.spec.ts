import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const routes = [
  { name: 'portal', hash: '#/' },
  { name: 'drift', hash: '#/drift' },
  { name: 'grid', hash: '#/grid' },
  { name: 'color', hash: '#/color' },
  { name: 'saved-empty', hash: '#/saved' },
];

async function settleVisuals(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager';
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
}

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 1100 },
  { name: 'desktop-1024', width: 1024, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

test.describe('visual evidence', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`${route.name} @ ${viewport.name}`, async ({ page }) => {
        fs.mkdirSync(`visual-evidence/${viewport.name}`, { recursive: true });
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/' + route.hash);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('main')).toBeVisible();
        await settleVisuals(page);
        await page.screenshot({
          path: `visual-evidence/${viewport.name}/${route.name}.png`,
          fullPage: true,
        });
      });
    }
  }

  test('detail and atlas @ desktop', async ({ page }) => {
    fs.mkdirSync('visual-evidence/desktop-1440', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/drift');
    await page.waitForLoadState('networkidle');

    const firstArtwork = page.locator('.drift-art').first();
    await expect(firstArtwork).toBeVisible();
    await firstArtwork.click();
    await expect(page.locator('.detail')).toBeVisible();
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/desktop-1440/detail.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: /Open relationship Atlas/i }).click();
    await expect(page.locator('.atlas')).toBeVisible();
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/desktop-1440/atlas.png',
      fullPage: true,
    });
  });

  test('detail and atlas @ mobile', async ({ page }) => {
    fs.mkdirSync('visual-evidence/mobile-390', { recursive: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/drift');
    await page.waitForLoadState('networkidle');

    const firstArtwork = page.locator('.drift-art').first();
    await expect(firstArtwork).toBeVisible();
    await firstArtwork.click();
    await expect(page.locator('.detail')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/mobile-390/detail.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: /Open relationship Atlas/i }).click();
    await expect(page.locator('.atlas')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/mobile-390/atlas.png',
      fullPage: true,
    });
  });

  test('saved populated @ desktop', async ({ page }) => {
    fs.mkdirSync('visual-evidence/desktop-1440', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/drift');
    await page.locator('.drift-art').first().click();
    await page.getByRole('button', { name: 'Save +' }).click();
    await page.goto('/#/saved');
    await expect(page.locator('.saved-grid article')).toHaveCount(1);
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/desktop-1440/saved-populated.png',
      fullPage: true,
    });
  });

  test('reduced-motion portal', async ({ page }) => {
    fs.mkdirSync('visual-evidence/reduced-motion', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/');
    await expect(page.locator('.portal')).toBeVisible();
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/reduced-motion/portal.png',
      fullPage: true,
    });
  });
});
