import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { PlaywrightDevPage } from '../pageObject/playwright-dev-page';

test.beforeEach(async () => {
  await allure.suite('Playwright Dev Pages');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const BREEDS = '/breeds';
const GET_FACTS = '/facts';
const GET_GROUPS = '/groups';

test.describe('Table of contents & Page Object Model article', () => {
  test.skip('01 - getting started should contain table of contents', async ({ page }) => {
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

  test.skip('02 - should show Page Object Model article', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
    await playwrightDev.pageObjectModel();
    await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
  });

  test('03 - Get status 200 /breeds', async ({ request }) => {
    const rq = await request.get(`https://dogapi.dog/api/v2${BREEDS}`);

    const json = await rq.json();

    // Recorro los atributos del json que devuelve la api
    for (const breed of json['data']) {
      const description = breed['attributes']['description'];
      const female_weight_max = breed['attributes']['female_weight']['max'];
      const female_weight_min = breed['attributes']['female_weight']['min'];
      const male_weight_max = breed['attributes']['male_weight']['max'];
      const male_weight_min = breed['attributes']['male_weight']['min'];
      const hypoallergenic = breed['attributes']['hypoallergenic'];
      const life_max = breed['attributes']['life']['max'];
      const life_min = breed['attributes']['life']['min'];
      const name = breed['attributes']['name'];
      const id = breed['id'];
      const relationships_id = breed['relationships']['group']['data']['id'];
      const relationships_type = breed['relationships']['group']['data']['type'];
      const type = breed['type'];

      // Atributos del json
      expect(description).toBeTruthy();
      expect(female_weight_max).toBeTruthy();
      expect(female_weight_min).toBeTruthy();
      expect(male_weight_max).toBeTruthy();
      expect(male_weight_min).toBeTruthy();
      expect(hypoallergenic).toBeFalsy();
      expect(life_max).toBeTruthy();
      expect(life_min).toBeTruthy();
      expect(name).toBeTruthy();
      expect(id).toBeTruthy();
      expect(relationships_id).toBeTruthy();
      expect(relationships_type).toBeTruthy();
      expect(type).toBeTruthy();
    };

    expect(rq.ok()).toBeTruthy();
    expect(rq.status()).toBe(200);
    console.log("--------------")
    console.log('El status es: ' + rq.status());
  });

  test.skip('04 - Get status 200 /facts', async ({ request }) => {

  })
});
