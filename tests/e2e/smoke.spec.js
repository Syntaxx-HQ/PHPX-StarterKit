const { test, expect } = require('@playwright/test');

// Smoke test: the starter renders and the counter updates via the fiber engine
// (surgical re-render — the old runtime wiped innerHTML on every state change).
test('renders and the counter increments', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Click to increment')).toBeVisible({ timeout: 30000 });

    const btn = page.getByRole('button', { name: /Count:/ });
    await expect(btn).toContainText('Count: 0');
    await btn.click();
    await expect(btn).toContainText('Count: 1');
    await btn.click();
    await expect(btn).toContainText('Count: 2');
});
