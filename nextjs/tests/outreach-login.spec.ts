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

test('ChatGPT consent reuses the existing operator login and preserves the request', async ({ page }) => {
  let submitted: URLSearchParams | undefined;
  let origin: string | undefined;
  await page.route('**/api/outreach/google', async route => {
    origin = route.request().headers().origin;
    submitted = new URLSearchParams(route.request().postData() || '');
    await route.fulfill({ contentType: 'text/html', body: '<p>Shared login submitted</p>' });
  });
  const response = await page.goto('/oauth/consent?authorization_id=smoke-request');
  expect(response?.headers()['referrer-policy']).toBe('same-origin');
  // Next dev uses no-cache; production dynamic pages use private/no-store.
  expect(response?.headers()['cache-control']).toMatch(/no-store|no-cache/);
  expect(response?.headers()['content-security-policy']).toContain('https://chatgpt.com');
  const siteOrigin = new URL(page.url()).origin;
  await page.getByRole('button', { name: 'Sign in with Google' }).click();
  await expect(page.getByText('Shared login submitted')).toBeVisible();
  expect(origin).toBe(siteOrigin);
  expect(submitted?.get('authorization_id')).toBe('smoke-request');
  expect(submitted?.get('action')).toBe('login');
});

test('old consent links open the single canonical page', async ({ page }) => {
  await page.goto('/outreach/authorize?authorization_id=smoke-request');
  await expect(page).toHaveURL(/\/oauth\/consent\?authorization_id=smoke-request$/);
  await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
});
