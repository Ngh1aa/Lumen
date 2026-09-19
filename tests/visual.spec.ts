import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const routes = [
  { name: 'portal', hash: '#/' },
  { name: 'drift', hash: '#/drift' },
  { name: 'grid', hash: '#/grid' },
  { name: 'color', hash: '#/color' },
  { name: 'mood', hash: '#/mood' },
  { name: 'saved-empty', hash: '#/collection' },
  { name: 'about', hash: '#/about' },
];

async function settleVisuals(page: import('@playwright/test').Page) {
  const onboarding = page.locator('.onboarding-hint');
  if (await onboarding.isVisible().catch(() => false)) {
    await onboarding.getByRole('button', { name: 'Got it' }).click();
  }
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
      test(route.name + ' @ ' + viewport.name, async ({ page }) => {
        fs.mkdirSync('visual-evidence/' + viewport.name, { recursive: true });
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/' + route.hash);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('main')).toBeVisible();
        await settleVisuals(page);
        await page.screenshot({
          path: 'visual-evidence/' + viewport.name + '/' + route.name + '.png',
          fullPage: true,
        });
      });
    }
  }

  test('quick preview @ desktop and mobile', async ({ page }) => {
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 1100 },
      { name: 'mobile-390', width: 390, height: 844 },
    ]) {
      fs.mkdirSync('visual-evidence/' + viewport.name, { recursive: true });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#/drift');
      await page.waitForLoadState('networkidle');
      await settleVisuals(page);
      await page.locator('.drift-art').first().click();
      await expect(page.locator('.quick-preview')).toBeVisible();
      await page.screenshot({
        path: 'visual-evidence/' + viewport.name + '/quick-preview.png',
        fullPage: true,
      });
    }
  });

  test('detail and atlas @ desktop', async ({ page }) => {
    fs.mkdirSync('visual-evidence/desktop-1440', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/artwork/abstract-0008');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.detail')).toBeVisible();
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/desktop-1440/detail.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: /Show connections/i }).click();
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
    await page.goto('/#/artwork/abstract-0008');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.detail')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/mobile-390/detail.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: /Show connections/i }).click();
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
    await page.waitForLoadState('networkidle');
    await settleVisuals(page);
    await page.locator('.drift-art').first().click();
    await page.getByRole('button', { name: 'Save +' }).click();
    await page.getByRole('button', { name: /Close quick preview/i }).click();
    await page.goto('/#/collection');
    await expect(page.locator('.saved-grid article')).toHaveCount(1);
    await settleVisuals(page);
    await page.screenshot({
      path: 'visual-evidence/desktop-1440/saved-populated.png',
      fullPage: true,
    });
  });

  test('curated exhibition @ desktop and mobile', async ({ page }) => {
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 1100 },
      { name: 'mobile-390', width: 390, height: 844 },
    ]) {
      fs.mkdirSync('visual-evidence/' + viewport.name, { recursive: true });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#/exhibition');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.vincent-experience')).toBeVisible();
      await settleVisuals(page);
      await page.screenshot({
        path: 'visual-evidence/' + viewport.name + '/exhibition.png',
        fullPage: true,
      });
    }
  });

  test('VINCENT deep interaction rooms @ desktop', async ({ page }) => {
    fs.mkdirSync('visual-evidence/desktop-1440', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/exhibition');

    await page.locator('.vincent-room-links button').filter({ hasText: 'Brush' }).click();
    await expect(page.locator('#brush')).toBeInViewport();
    await page.locator('#brush').screenshot({
      path: 'visual-evidence/desktop-1440/vincent-brush.png',
    });

    await page.locator('.vincent-room-links button').filter({ hasText: 'Places' }).click();
    await expect(page.locator('#places')).toBeInViewport();
    await page.locator('#places').screenshot({
      path: 'visual-evidence/desktop-1440/vincent-places.png',
    });

    await page.locator('.vincent-room-links button').filter({ hasText: 'Letters' }).click();
    await expect(page.locator('#letters')).toBeInViewport();
    await page.locator('#letters').screenshot({
      path: 'visual-evidence/desktop-1440/vincent-letters.png',
    });

    await page.locator('.vincent-room-links button').filter({ hasText: 'Vincent' }).click();
    await expect(page.locator('#vincent')).toBeInViewport();
    await page.locator('#vincent').screenshot({
      path: 'visual-evidence/desktop-1440/vincent-music.png',
    });
  });


  test('VINCENT thread navigator @ desktop and mobile', async ({ page }) => {
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 1100 },
      { name: 'mobile-390', width: 390, height: 844 },
    ]) {
      fs.mkdirSync('visual-evidence/' + viewport.name, { recursive: true });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#/exhibition');
      await page.getByRole('button', { name: /Open thread navigator/i }).click();
      await page.locator('.vincent-thread-tabs button').filter({ hasText: 'Saint-Rémy' }).click();
      await expect(page.locator('.vincent-thread-drawer')).toBeVisible();
      await page.screenshot({
        path: 'visual-evidence/' + viewport.name + '/vincent-thread-navigator.png',
        fullPage: true,
      });
      await page.getByRole('button', { name: /Close thread navigator/i }).first().click();
      await expect(page.locator('.vincent-thread-drawer')).toHaveCount(0);
    }
  });

  test('accessibility settings and high-contrast evidence', async ({ page }) => {
    fs.mkdirSync('visual-evidence/accessibility', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/#/about');
    await page.getByRole('button', { name: /Open accessibility settings/i }).click();
    await expect(page.locator('.access-panel')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/accessibility/settings.png',
      fullPage: true,
    });
    await page.locator('.setting-row').filter({ hasText: 'Higher contrast' }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).toHaveAttribute('data-contrast', 'high');
    await page.screenshot({
      path: 'visual-evidence/accessibility/about-high-contrast.png',
      fullPage: true,
    });
  });

  test('onboarding and 404 states', async ({ page }) => {
    fs.mkdirSync('visual-evidence/states', { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1100 });

    await page.goto('/#/drift');
    await expect(page.locator('.onboarding-hint')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/states/onboarding.png',
      fullPage: true,
    });

    await page.goto('/#/missing-thread');
    await expect(page.locator('.not-found')).toBeVisible();
    await page.screenshot({
      path: 'visual-evidence/states/404.png',
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
