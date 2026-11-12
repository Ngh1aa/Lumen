import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))
    .map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target.join(' ')) }));
}

const savedCount = (page: Page) => page.locator('.site-header .saved-count b');

test.describe('multi-view museum', () => {
  test.use({ reducedMotion: 'reduce' });

  test('collection filter, then detail, then save survives reload', async ({ page }) => {
    await page.goto('/#/collection');
    await expect(page.getByRole('heading', { name: /Browse the collection/i })).toBeVisible();
    await expect(page.locator('.collection-count')).toHaveText('Showing all 20 works');

    await page.getByLabel('Artist').selectOption('Vincent van Gogh');
    await expect(page).toHaveURL(/#\/collection\?artist=Vincent\+van\+Gogh/);
    await expect(page.locator('.collection-count')).toHaveText('Showing 7 of 20 works');

    await page.getByLabel('Search the collection').fill('night');
    await expect(page.locator('.collection-count')).toHaveText('Showing 2 of 20 works');
    await expect(page).toHaveURL(/q=night/);

    await page.getByLabel('Sort').selectOption('title');
    await expect(page.locator('.grid-card strong').first()).toHaveText('Café Terrace at Night');

    await page.getByRole('button', { name: 'List', exact: true }).click();
    await expect(page.locator('.collection-list li')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'List', exact: true })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('link', { name: /The Starry Night/ }).click();
    await expect(page).toHaveURL(/#\/artwork\/van-gogh-starry-night$/);
    await expect(page.getByRole('heading', { level: 1, name: 'The Starry Night' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'The Starry Night' })).toBeFocused();
    await expect(page).toHaveTitle(/The Starry Night, Vincent van Gogh/);

    const save = page.locator('.detail-toolbar').getByRole('button', { name: 'Save +' });
    await save.click();
    await expect(page.locator('.detail-toolbar').getByRole('button', { name: 'Saved ✓' })).toHaveAttribute('aria-pressed', 'true');
    await expect(savedCount(page)).toHaveText('01');

    await page.reload();
    await expect(savedCount(page)).toHaveText('01');
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lumen-saved'))).toContain('van-gogh-starry-night');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('lumen-saved'))).toBeNull();

    // Back to the collection keeps the filters that were active.
    await page.locator('.detail-back').click();
    await expect(page).toHaveURL(/artwork|collection/);
    await expect(page.locator('.collection-count')).toHaveText('Showing 2 of 20 works');

    await page.getByRole('button', { name: 'Reset filters' }).first().click();
    await expect(page.locator('.collection-count')).toHaveText('Showing all 20 works');
  });

  test('collection empty state and reset', async ({ page }) => {
    await page.goto('/#/collection?q=nothing-matches-this');
    await expect(page.getByRole('heading', { name: 'No works match.' })).toBeVisible();
    await page.locator('.collection-empty').getByRole('button', { name: 'Reset filters' }).click();
    await expect(page.locator('.grid-card')).toHaveCount(20);
  });

  test('create, rename and delete a set', async ({ page }) => {
    await page.goto('/#/artwork/van-gogh-irises');
    await page.getByRole('button', { name: /Add to set: Irises/ }).click();
    await page.getByLabel('New set').fill('Night colors');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.locator('.set-picker-status')).toHaveText('Created Night colors');
    await expect(page.getByRole('checkbox', { name: /Night colors/ })).toBeChecked();
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(savedCount(page)).toHaveText('01');

    // Second work joins the set from My collection's "Add from saved" list.
    await page.goto('/#/artwork/van-gogh-cypresses');
    await page.locator('.detail-toolbar').getByRole('button', { name: 'Save +' }).click();

    await page.locator('.site-header .saved-count').click();
    await expect(page).toHaveURL(/#\/my-collection$/);
    await page.locator('.my-sets').getByRole('link', { name: /Night colors/ }).click();
    await expect(page).toHaveURL(/#\/my-collection\/night-colors-/);
    await expect(page.getByRole('heading', { name: 'Night colors' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Cypresses to Night colors' }).click();
    await expect(page.locator('.my-grid article')).toHaveCount(2);

    // Rename with validation.
    await page.getByRole('button', { name: 'Rename set' }).click();
    const nameField = page.getByLabel('Set name', { exact: true });
    await nameField.fill('');
    await page.getByRole('button', { name: 'Save name' }).click();
    await expect(page.getByRole('alert')).toHaveText('Give the set a name.');
    await nameField.fill('Blue hours');
    await page.getByRole('button', { name: 'Save name' }).click();
    await expect(page.getByRole('heading', { name: 'Blue hours' })).toBeVisible();
    await expect(page.locator('.my-sets')).toContainText('Blue hours');

    // Remove one work from the set.
    await page.locator('.my-grid article').first().getByRole('button', { name: 'Remove from set' }).click();
    await expect(page.locator('.my-grid article')).toHaveCount(1);

    const setUrl = page.url();
    // Delete: cancel first, then confirm.
    await page.getByRole('button', { name: 'Delete set' }).click();
    const dialog = page.getByRole('alertdialog', { name: /Delete set “Blue hours”/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Blue hours' })).toBeVisible();

    await page.getByRole('button', { name: 'Delete set' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Delete set' }).click();
    await expect(page).toHaveURL(/#\/my-collection$/);
    await expect(page.locator('.my-notice')).toContainText('deleted');
    await expect(page.locator('.my-sets')).not.toContainText('Blue hours');
    await expect(page.locator('.my-grid article')).toHaveCount(2);

    // The deleted set's old URL shows a recoverable state instead of a blank page.
    await page.goto(setUrl);
    await expect(page.getByRole('heading', { name: /This set no longer exists/ })).toBeVisible();
  });

  test('exhibition walk-through in order', async ({ page }) => {
    await page.goto('/#/exhibitions');
    await page.getByRole('link', { name: /Between Blue and Yellow/ }).click();
    await expect(page).toHaveURL(/#\/exhibition\/blue-and-yellow$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Between Blue and Yellow' })).toBeVisible();
    await expect(page.locator('.exhibition-stops li')).toHaveCount(6);

    await page.getByRole('link', { name: /Begin walk-through/ }).click();
    await expect(page).toHaveURL(/#\/exhibition\/blue-and-yellow\/1$/);
    await expect(page.locator('.walk-count')).toHaveText('Stop 01 of 06');
    await expect(page.getByRole('heading', { level: 1, name: 'The Starry Night' })).toBeVisible();

    await page.getByRole('link', { name: 'Next stop →' }).click();
    await expect(page.locator('.walk-count')).toHaveText('Stop 02 of 06');

    await page.locator('body').press('ArrowRight');
    await expect(page.locator('.walk-count')).toHaveText('Stop 03 of 06');
    await expect(page.getByRole('heading', { level: 1, name: 'Café Terrace at Night' })).toBeVisible();

    await page.getByRole('link', { name: 'Stop 6: Both at once' }).click();
    await expect(page.locator('.walk-count')).toHaveText('Stop 06 of 06');
    await expect(page.getByRole('heading', { name: 'You walked 6 works.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Next stop →' })).toHaveCount(0);

    await page.locator('.walk-end').getByRole('button', { name: 'Save as set' }).click();
    await expect(page.locator('.walk-end')).toContainText('Saved as the set Between Blue and Yellow with 6 works');
    await expect(savedCount(page)).toHaveText('06');

    // Stop changes replace history, so Back returns to the exhibition overview.
    await page.goBack();
    await expect(page).toHaveURL(/#\/exhibition\/blue-and-yellow$/);

    await page.goto('/#/exhibition/blue-and-yellow/99');
    await expect(page.getByRole('heading', { name: /This room is closed/ })).toBeVisible();
  });

  test('deep link, back and forward with focus and scroll management', async ({ page }) => {
    await page.goto('/#/artwork/van-gogh-irises');
    await expect(page.getByRole('heading', { level: 1, name: 'Irises' })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 900));
    await page.locator('.detail-pager').getByRole('link', { name: /Previous/ }).click();
    await expect(page).toHaveURL(/#\/artwork\/van-gogh-cypresses$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cypresses' })).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);

    await page.goBack();
    await expect(page).toHaveURL(/#\/artwork\/van-gogh-irises$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Irises' })).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);

    await page.goForward();
    await expect(page.getByRole('heading', { level: 1, name: 'Cypresses' })).toBeVisible();

    // Filter state is deep-linkable.
    await page.goto('/#/collection?artist=Timeastor&view=list&sort=title');
    await expect(page.getByLabel('Artist')).toHaveValue('Timeastor');
    await expect(page.locator('.collection-list li')).toHaveCount(13);
    await expect(page.locator('.collection-list strong').first()).toHaveText('Athelem Sa Yion');

    // Primary nav uses real links with aria-current.
    await page.locator('.site-header nav').getByRole('link', { name: 'Exhibitions' }).click();
    await expect(page.locator('.site-header nav').getByRole('link', { name: 'Exhibitions' })).toHaveAttribute('aria-current', 'page');
    await page.goBack();
    await expect(page.locator('.collection-list li')).toHaveCount(13);

    // Unknown objects have a dedicated not-found state.
    await page.goto('/#/artwork/does-not-exist');
    await expect(page.getByRole('heading', { name: /No object at this number/ })).toBeVisible();
    await page.getByRole('link', { name: 'Browse collection' }).click();
    await expect(page.locator('.grid-card')).toHaveCount(20);
  });

  test('reset demo data clears session data after confirmation', async ({ page }) => {
    await page.goto('/#/exhibition/signals');
    await page.getByRole('button', { name: 'Save as set' }).click();
    await expect(savedCount(page)).toHaveText('08');

    await page.locator('.site-footer').getByRole('button', { name: 'Reset demo data' }).click();
    const dialog = page.getByRole('alertdialog', { name: 'Reset demo data?' });
    await expect(dialog).toContainText('8 saved works, 1 set');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(savedCount(page)).toHaveText('08');

    await page.locator('.site-footer').getByRole('button', { name: 'Reset demo data' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Reset demo data' }).click();
    await expect(page.locator('.app-toast')).toContainText('Demo data reset');
    await expect(savedCount(page)).toHaveText('00');
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lumen-sets'))).toBe('[]');

    await page.goto('/#/my-collection');
    await expect(page.getByRole('heading', { name: /Nothing here yet/ })).toBeVisible();
    await expect(page.locator('.my-sets li')).toHaveCount(1);
  });

  test('axe finds no serious issues on the new views', async ({ page }) => {
    await page.goto('/#/collection');
    await expect(page.locator('.grid-card')).toHaveCount(20);
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/collection?view=list&artist=Vincent+van+Gogh');
    await expect(page.locator('.collection-list li')).toHaveCount(7);
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/artwork/van-gogh-starry-night');
    await page.getByRole('button', { name: /Add to set: The Starry Night/ }).click();
    expect(await seriousAxeViolations(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Zoom image' }).click();
    await expect(page.locator('.zoom-viewport')).toBeFocused();
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await expect(page.locator('.zoom-controls')).toContainText('250%');
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/exhibition/after-everyone-left');
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/exhibition/after-everyone-left/5');
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/exhibition/vincent/4');
    await expect(page.getByRole('heading', { level: 1, name: 'The Starry Night' })).toBeVisible();
    expect(await seriousAxeViolations(page)).toEqual([]);

    await page.goto('/#/my-collection');
    expect(await seriousAxeViolations(page)).toEqual([]);
    await page.getByLabel('New set name').fill('Quiet rooms');
    await page.getByRole('button', { name: 'Create set' }).click();
    await expect(page.getByRole('heading', { name: 'Quiet rooms' })).toBeVisible();
    expect(await seriousAxeViolations(page)).toEqual([]);
    await page.getByRole('button', { name: 'Delete set' }).click();
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('every view loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    for (const hash of [
      '#/', '#/collection', '#/collection?view=list', '#/artwork/abstract-0008', '#/artwork/van-gogh-bedroom', '#/artwork/nope',
      '#/exhibitions', '#/exhibition/vincent', '#/exhibition/signals', '#/exhibition/signals/4', '#/my-collection',
      '#/drift', '#/color', '#/mood', '#/atlas/van-gogh-irises', '#/about', '#/nowhere',
    ]) {
      await page.goto('/' + hash);
      await expect(page.locator('main h1').first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
});
