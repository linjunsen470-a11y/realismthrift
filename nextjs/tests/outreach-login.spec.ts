import { expect, test } from '@playwright/test';

test('header verification requires an operator session', async ({ page }) => {
  await page.goto('/outreach/header-test');
  await expect(page).toHaveURL(/\/outreach\/connect$/);
  await expect(page.getByRole('button', { name: 'Sign in as operator' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Approve and send this test' })).toHaveCount(0);
});

test('operator login form preserves its same-origin CSRF header', async ({ page }) => {
  let origin: string | undefined;
  await page.route('**/api/outreach/google', async route => {
    origin = route.request().headers().origin;
    await route.fulfill({ contentType: 'text/html', body: '<p>Login form submitted</p>' });
  });
  const response = await page.goto('/outreach/connect');
  expect(response?.headers()['referrer-policy']).toBe('same-origin');
  expect(response?.headers()['content-security-policy']).toContain("form-action 'self' https://accounts.google.com https://tjbeeackrjpojejxhnzq.supabase.co");
  const siteOrigin = new URL(page.url()).origin;
  await page.getByRole('button', { name: 'Sign in as operator' }).click();
  await expect(page.getByText('Login form submitted')).toBeVisible();
  expect(origin).toBe(siteOrigin);
});
