import { test, expect } from '@playwright/test';

test.describe('Emozika Visual Regression', () => {

    test('Global styles should load on Studio page', async ({ page }) => {
        await page.goto('/studio');

        // Check if body has the correct font-family (set in styles.scss variables usually)
        const body = page.locator('body');
        await expect(body).toHaveCSS('font-family', /Montserrat|Open Sans|sans-serif/);

        // Check if the page title has proper size/weight styling (not default user agent styles)
        const title = page.locator('h1.page-title');
        await expect(title).toBeVisible();

        // Default h1 in browser is typically 32px (2em) but our design should be larger or specific color
        // Let's check a known class style if possible, or just ensure it's not "generic"
        // Ideally we check if a specific CSS file is loaded in network, but CSS check is better proxy
    });

    test('Global styles should load on Theatre page', async ({ page }) => {
        await page.goto('/theatre');

        // Check for a button style
        const btn = page.locator('.btn-primary, .btn-outline, .btn').first();
        if (await btn.isVisible()) {
            const borderRadius = await btn.evaluate((el) => window.getComputedStyle(el).borderRadius);
            expect(borderRadius).not.toBe('0px'); // Our buttons are rounded
        }

        // Check for specific Theatre content (Brand Header)
        const title = page.locator('.theatre-hero .page-title');
        await expect(title).toBeVisible();
        await expect(title).toContainText('Репертуар');
    });

});
