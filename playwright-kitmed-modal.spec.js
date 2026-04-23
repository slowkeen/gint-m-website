const { test, expect } = require('@playwright/test');
test('kit-med testimonial modal opens', async ({ page }) => {
  await page.goto('http://127.0.0.1:8125/projects/project.html?slug=kit-med', { waitUntil: 'networkidle' });
  await expect(page.locator('#project-client-logo')).toBeVisible();
  await expect(page.locator('#project-client-read-more')).toBeVisible();
  await page.click('#project-client-read-more');
  await expect(page.locator('#project-client-review-modal')).not.toHaveAttribute('hidden', '');
  await expect(page.locator('#project-client-review-copy')).not.toBeEmpty();
});
