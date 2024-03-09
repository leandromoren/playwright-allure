import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { PlaywrightDevPage } from '../pageObject/playwright-dev-page';

test.beforeEach(async () => {
  await allure.suite('Playwright Dev Pages');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const FACTS = '/facts';
const USERS = '/users';

test.describe('Table of contents & Page Object Model article', () => {
  test('01 - getting started should contain table of contents', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
    await playwrightDev.getStarted();
    await expect(playwrightDev.tocList).toHaveText([
      `How to install Playwright`,
      `What's Installed`,
      `How to run the example test`,
      `How to open the HTML test report`,
      `Write tests using web first assertions, page fixtures and locators`,
      `Run single test, multiple tests, headed mode`,
      `Generate tests with Codegen`,
      `See a trace of your tests`
    ]);
  });

  test('02 - should show Page Object Model article', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
    await playwrightDev.pageObjectModel();
    await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
  });
});

test.describe('API TEST', () => {
  /*
    Revisar que devuelve false porque no tengo el api token definido en config.ts
  */
  test('01 - Report bug issue', async ({ request }) => {
    // const newIssue = await request.post(`${FACTS}`, {
    //   data: {
    //     title: '[BUG] report 1',
    //     body: 'BUG description'
    //   }
    // });
    //expect(newIssue.ok()).toBeTruthy();

    const issues = await request.get(`${FACTS}`);
    expect(issues.ok()).toBeTruthy();
    expect(issues.status()).toBe(200);
    expect(await issues.json()).toContainEqual(expect.objectContaining({
      type: 'cat',
      _id: '58e008780aac31001185ed05',
      __v: 0
    }));
    //console.log(newIssue);
    console.log("--------------")
    console.log('El status es: ' + issues.status());
  });
});