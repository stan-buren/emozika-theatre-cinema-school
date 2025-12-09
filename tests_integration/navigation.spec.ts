import { test, expect } from '@playwright/test';

test.describe('Emozika Website Structure', () => {

    test('Homepage (Hub) loads and has key sections', async ({ page }) => {
        await page.goto('/');

        // Check title
        await expect(page).toHaveTitle(/Эмоцика|Театр/i);

        // Check Hub Hero - scoped to main to avoid Dev Toolbar
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.locator('.hub-card--studio')).toBeVisible();
    });

    test('Navigate to Studio page', async ({ page }) => {
        await page.goto('/');
        await page.locator('.hub-card--studio').click();

        await expect(page).toHaveURL(/.*studio/);

        // Check for "Студия" heading - usually h1 or h2 
        await expect(page.locator('main')).toContainText(/Студия/i);
    });

    test('Navigate to Cinema page', async ({ page }) => {
        await page.goto('/');
        await page.locator('.hub-card--cinema').click();
        await page.waitForLoadState('domcontentloaded');

        await expect(page).toHaveURL(/.*cinema/);

        // Check for text presence matching new Cinema/index.astro (Content Polish)
        await expect(page.locator('body')).toContainText('ЭТО НЕ КРУЖОК');
        await expect(page.locator('body')).toContainText('ЭТО ПРОДАКШН');

        // Check for specific styling class presence (verifying SCSS loaded)
        await expect(page.locator('.cinema-hero')).toBeVisible();
    });

    test('Navigate to Theatre page', async ({ page }) => {
        await page.goto('/');
        await page.locator('.hub-card--theatre').click();
        await page.waitForLoadState('domcontentloaded');

        await expect(page).toHaveURL(/.*theatre/);

        // Check for H1 "Репертуар" (Velvet Mode)
        await expect(page.locator('h1.page-title')).toBeVisible();
        await expect(page.locator('h1.page-title')).toContainText(/Репертуар/i);
    });

    test('Navigation Menu works', async ({ page }) => {
        await page.goto('/cinema');
        await page.waitForLoadState('domcontentloaded');

        // Check Header Links
        const header = page.locator('.site-header');

        await header.getByRole('link', { name: 'Студия' }).click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*studio/);

        await header.getByRole('link', { name: 'Киношкола' }).click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*cinema/);

        // Use exact match for Theatre link
        await header.getByRole('link', { name: 'Театр', exact: true }).click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*theatre/);
    });

});
