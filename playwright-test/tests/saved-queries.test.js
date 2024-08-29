const { test, expect } = require('@playwright/test');

test.describe('Saved Queries Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5122/saved-queries.html'); // Replace with actual URL
  });

  test('page layout and elements', async ({ page }) => {
    // Check main elements
    await expect(page.locator('#app-side-nav')).toBeVisible();
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('#app-footer')).toBeVisible();
    await expect(page.locator('#app-footer')).toHaveText('2024 © SigLens');

    // Check search input and button
    await expect(page.locator('#sq-filter-input')).toBeVisible();
    await expect(page.locator('#search-query-btn')).toBeVisible();

    // Check grid headers
    const headers = ['Query Name', 'Description', 'QueryLanguage', 'Delete'];
    for (const header of headers) {
      await expect(page.locator(`.ag-header-cell-text:has-text("${header}")`)).toBeVisible();
    }
  });

  // test('search functionality', async ({ page }) => {
  //   await page.fill('#sq-filter-input', 'a');
  //   await page.click('#search-query-btn');
    
  //   // Check if the grid updates with filtered results
  //   await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(2);
  //   await expect(page.locator('.ag-center-cols-container .ag-row:first-child .query-link')).toHaveText('111');
  // });

  // test('delete confirmation dialog', async ({ page }) => {
  //   // Click delete button for the first row
  //   await page.click('.ag-center-cols-container .ag-row:first-child #delbutton');

  //   // Check if confirmation dialog appears
  //   await expect(page.locator('.popupContent')).toBeVisible();
  //   await expect(page.locator('.popupContent h3')).toHaveText('Confirmation');
  //   await expect(page.locator('.popupContent p')).toHaveText('Are you sure you want to delete this dashboard?');

  //   // Check cancel button functionality
  //   await page.click('#cancel-btn');
  //   await expect(page.locator('.popupContent')).not.toBeVisible();
  // });

  // test('query link navigation', async ({ page }) => {
  //   const firstQueryLink = page.locator('.ag-center-cols-container .ag-row:first-child .query-link');
  //   const href = await firstQueryLink.getAttribute('href');
    
  //   // Check if the link has the correct format
  //   expect(href).toMatch(/^(index\.html\?searchText=|metrics-explorer\.html)/);

  //   // You might want to add a test for actual navigation, but that would require mocking or setting up the target page
  // });
});