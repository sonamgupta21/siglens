const { test, expect } = require('@playwright/test');

test.describe('Logs Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5122/index.html');
  });

  test('verify logs page buttons', async ({ page }) => {
    const indexButton = page.locator('.index-container');
    const datePickerBtn = page.locator('#date-picker-btn');
    // const searchButton = page.locator('#query-builder-btn');

    // await expect(datePickerBtn).toHaveText('Last 15 Mins');
    // await datePickerBtn.click();
    // await expect(page.locator('#daterangepicker')).toBeVisible();
    // await datePickerBtn.click();
  });

  test('should switch between Builder and Code tabs', async ({ page }) => {
    await expect(page.locator('#tabs-1')).toBeVisible();
    await expect(page.locator('#tabs-2')).not.toBeVisible();

    await page.click('#tab-title2');
    await expect(page.locator('#tabs-1')).not.toBeVisible();
    await expect(page.locator('#tabs-2')).toBeVisible();

    await page.click('#tab-title1');
    await expect(page.locator('#tabs-1')).toBeVisible();
    await expect(page.locator('#tabs-2')).not.toBeVisible();
  });

  test('should open and close settings', async ({ page }) => {
    await expect(page.locator('#setting-container')).not.toBeVisible();
    await page.click('#logs-settings');
    await expect(page.locator('#setting-container')).toBeVisible();
    await page.click('#logs-settings');
    await expect(page.locator('#setting-container')).not.toBeVisible();
  });

  test('should change query language', async ({ page }) => {
    await page.click('#logs-settings');
    await page.click('#query-language-btn');
    await page.click('#option-1');
    await expect(page.locator('#query-language-btn span')).toHaveText('SQL');
  });

  test('should change query mode', async ({ page }) => {
    await page.click('#logs-settings');
    await page.click('#query-mode-btn');
    await page.click('#mode-option-2');
    await expect(page.locator('#query-mode-btn span')).toHaveText('Code');
  });
});