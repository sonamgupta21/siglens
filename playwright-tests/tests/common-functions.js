const { expect } = require('@playwright/test');

async function testThemeToggle(page) {
    const themeBtn = page.locator('#theme-btn');
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    await themeBtn.click();
    expect(await html.getAttribute('data-theme')).not.toBe(initialTheme);
    await themeBtn.click();
    expect(await html.getAttribute('data-theme')).toBe(initialTheme);
}

async function testDateTimePicker(page) {
    // Check the date picker
    const datePickerBtn = page.locator('#date-picker-btn');
    await expect(datePickerBtn).toBeVisible();
    await datePickerBtn.click();
    await expect(page.locator('.daterangepicker')).toBeVisible();

    // Check custom date range inputs
    await expect(page.locator('#date-start')).toBeVisible();
    await expect(page.locator('#time-start')).toBeVisible();
    await expect(page.locator('#date-end')).toBeVisible();
    await expect(page.locator('#time-end')).toBeVisible();
    // Apply custom date range
    await expect(page.locator('#customrange-btn')).toBeVisible();

    // Predefined date range inputs
    await page.click('#date-picker-btn');
    await datePickerBtn.click();
    await expect(page.locator('.daterangepicker')).toBeVisible();
    const timeRangeOption = page.locator('#now-24h');
    await timeRangeOption.click();
    await expect(timeRangeOption).toHaveClass(/active/);
    const datePickerButtonText = page.locator('#date-picker-btn span');
    await expect(datePickerButtonText).toHaveText('Last 24 Hrs');
}

async function createAlert(page, alertType, dataSourceOption, queryLanguageOption = null, query = null) {
    try {
        console.log('Navigating to the alerts page...');
        await page.goto('http://localhost:5122/all-alerts.html');
        await page.click('#new-alert-rule');

        console.log('Waiting for alert page to load...');
        await page.waitForSelector('#alert-rule-name', { state: 'visible' });

        console.log('Filling out the alert form...');
        await page.fill('#alert-rule-name', `Test Alert ${Date.now()}`);

        console.log('Selecting data source:', dataSourceOption);
        await page.click('#alert-data-source');
        await page.click(`#data-source-options #${dataSourceOption}`);

        console.log('Setting time range to "Last 30 minutes"...');
        await page.click('#date-picker-btn');
        await page.click('#now-90d');

        if (queryLanguageOption) {
            console.log('Selecting query language:', queryLanguageOption);
            await page.click('#logs-language-btn');
            await page.click(`#logs-language-options #${queryLanguageOption}`);
        }

        if (query) {
            console.log('Entering query for Logs...');
            await page.click('#tab-title2'); // Switch to Code tab
            await page.fill('#filter-input', query);
            await page.click('#run-filter-btn'); // Run search
        } else {
            console.log('Selecting metric...');
            await page.click('#select-metric-input');
            await page.waitForSelector('.metrics-ui-widget .ui-menu-item');
            await page.click('.metrics-ui-widget .ui-menu-item:first-child');

            const inputValue = await page.inputValue('#select-metric-input');
            console.log('Metric input value:', inputValue);
            expect(inputValue).not.toBe('');
        }

        console.log('Setting alert condition...');
        await page.click('#alert-condition');
        await page.click('.alert-condition-options #option-0'); // Select "Is above"
        await page.fill('#threshold-value', '100');

        console.log('Setting evaluation interval...');
        await page.fill('#evaluate-every', '5');
        await page.fill('#evaluate-for', '10');

        console.log('Opening contact points dropdown...');
        await page.click('#contact-points-dropdown');

        console.log('Adding new contact point...');
        await page.click('.contact-points-options li:nth-child(1)'); // Select the "Add New" option

        console.log('Waiting for the contact form popup to appear...');
        await page.waitForSelector('#add-new-contact-popup', { state: 'visible' });

        console.log('Filling out contact form...');
        await page.fill('#contact-name', 'Test Contact');
        await page.click('#contact-types');
        await page.click('.contact-options #option-0'); // Select "Slack"

        console.log('Filling out Slack details...');
        await page.fill('#slack-channel-id', 'test-channel-id');
        await page.fill('#slack-token', 'xoxb-your-slack-token');

        console.log('Saving contact point...');
        await page.click('#save-contact-btn');

        console.log('Filling out notification message...');
        await page.fill('#notification-msg', 'This is a test alert notification.');

        console.log('Adding custom label...');
        await page.click('.add-label-container');
        await page.fill('.label-container #label-key', 'TestLabel');
        await page.fill('.label-container #label-value', 'TestValue');

        console.log('Saving the alert...');
        await page.click('#save-alert-btn');

        console.log('Waiting for navigation to the all-alerts page...');
        await Promise.race([page.waitForNavigation({ url: /all-alerts\.html$/, timeout: 60000 })]);

        console.log('Verifying navigation to all-alerts page...');
        expect(page.url()).toContain('all-alerts.html');
        console.log('Alert created successfully!');
    } catch (error) {
        console.error('Error during createAlert execution:', error);
        throw error; // Re-throw the error after logging it
    }
}

module.exports = {
    testDateTimePicker,
    testThemeToggle,
    createAlert,
};
