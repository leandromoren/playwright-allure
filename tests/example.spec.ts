import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('https://playwright.dev/');
})

test('has title', async ({ page }) => {
  // allure.suite me permite asignarle un nombre al caso en la suite de allure
  await allure.suite("allure suite name 'has title'");
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await allure.suite("allure suite name 'get started link'");
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

