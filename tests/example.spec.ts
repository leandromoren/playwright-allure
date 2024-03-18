import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.beforeEach(async () => {
  await allure.suite('Playwright Dev Pages');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const BASE_URL = 'https://dogapi.dog/api/v2';
const REQREST = 'https://reqres.in';;

test.describe('API testing from "dogapi"', () => {

  test('01 - Get status 200 & validate json attributes /breeds', async ({ request }) => {
    const rq = await request.get(`${BASE_URL}/breeds`);
    const one_or_two_digits = /[0-9]{1,2}/;

    const json = await rq.json();

    // Recorro los atributos del json que devuelve la api
    for (const attr of json['data']) {
      const description         = attr['attributes']['description'];
      const female_weight_max   = attr['attributes']['female_weight']['max'];
      const female_weight_min   = attr['attributes']['female_weight']['min'];
      const male_weight_max     = attr['attributes']['male_weight']['max'];
      const male_weight_min     = attr['attributes']['male_weight']['min'];
      const hypoallergenic      = attr['attributes']['hypoallergenic'];
      const life_max            = attr['attributes']['life']['max'];
      const life_min            = attr['attributes']['life']['min'];
      const name                = attr['attributes']['name'];
      const id                  = attr['id'];
      const relationships_id    = attr['relationships']['group']['data']['id'];
      const relationships_type  = attr['relationships']['group']['data']['type'];
      const type                = attr['type'];

      // Atributos del json
      expect(description).toBeTruthy();
      expect(String(female_weight_max)).toMatch(one_or_two_digits);
      expect(String(female_weight_min)).toMatch(one_or_two_digits);;
      expect(String(male_weight_max)).toMatch(one_or_two_digits);;
      expect(String(male_weight_min)).toMatch(one_or_two_digits);;
      expect(hypoallergenic === true || hypoallergenic === false).toBeTruthy();
      expect(String(life_max)).toMatch(one_or_two_digits);;
      expect(String(life_min)).toMatch(one_or_two_digits);;
      expect(name).toBeTruthy();
      expect(id).toBeTruthy();
      expect(relationships_id).toBeTruthy();
      expect(relationships_type).toBeTruthy();
      expect(type).toBeTruthy();
    };

    expect(rq.ok()).toBeTruthy();
    expect(rq.status()).toBe(200);
    expect(Object.keys(json).length).toBeGreaterThan(0); // Verifica que el json no este vacio
    expect(rq.statusText()).toMatch(/OK/);
    expect(json.data.length).toBeGreaterThan(0);
    console.log("--------------")
    console.log('El status es: ' + rq.status());
  });

  test('02 - Get status 200 /facts', async ({ request }) => {
    const rq = await request.get(`${BASE_URL}/facts`);
    const json = await rq.json();

    for (const facts of json['data']) {
      const id          = facts['id'];
      const type        = facts['type'];
      const attributes  = facts['attributes'];

      expect(id).toBeTruthy();
      expect(type).toBeTruthy();
      expect(attributes).toBeTruthy();
    };

    expect(rq.status()).toBe(200);
    expect(rq.statusText()).toMatch(/OK/);
    expect(json.data.length).toBeGreaterThan(0);
  });

  const USER = {
    username: 'test',
    password: 'test',
  };

  test('03 - Get status 200 /groups', async ({ request }) => {
    const rq = await request.get(`${BASE_URL}/groups`);
    const json = await rq.json();

    for(const groups of json['data']) {
      const id            = groups['id'];
      const type          = groups['type'];
      const attributes    = groups['attributes'];
      const relationships = groups['relationships'];

      expect(id).toBeTruthy();
      expect(type).toBeTruthy();
      expect(attributes).toBeTruthy();
      expect(relationships).toBeTruthy();
      expect(json.data.length).toBeGreaterThan(0);
    }

    expect(rq.status()).toBe(200);
    expect(rq.statusText()).toMatch(/OK/);
  });

  test('04 - Go to page', async ({ page }) => {
    await page.goto('/api/v2');
    expect(page.url()).toContain('https://dogapi.dog/api/v2')
    expect(page.url()).toMatch('https://dogapi.dog/api/v2')
  });

  test('05 - API TESTING REQRES', async ({ request }) => {
    const rq = await request.get(`${REQREST}/api/users?page=2`);
    const json = await rq.json();

    expect(json.data.length).toBeGreaterThan(0);
    expect(rq.status()).toBe(200);
    expect(rq.ok()).toBeTruthy();
  });

  test('06 - Create new User ReqRes', async ({ request }) => {
    const newUser = {
      name: 'Luffy',
      job: 'Pirate',
    }
    const rq = await request.post(`${REQREST}/api/users`, {data: newUser});
    expect(rq.ok()).toBeTruthy();
    const json = await rq.json();
    expect(json.name).toBe('Luffy');
    expect(rq.status()).toBe(201);
  });

  test('07 - Update User ReqRes', async ({ request }) => {
    const updateUser = {
      name: 'Monkey D. Luffy',
      job: 'Pirate King',
    }
    const rq = await request.put(`${REQREST}/api/users/2`, {data: updateUser});
    expect(rq.ok()).toBeTruthy();
    const json = await rq.json();
    expect(json.name).toBe('Monkey D. Luffy');
    expect(rq.status()).toBe(200);
  });

  test('08 - Delete User ReqRes', async ({ request }) => {
    const rq = await request.delete(`${REQREST}/api/users/2`);
    expect(rq.ok()).toBeTruthy();
    expect(rq.status()).toBe(204);
  });

  const testData = [
    {
      name: 'Luffy',
      job: 'Pirate',
    },
    {
      name: 'Zoro',
      job: 'Pirate',
    },
    {
      name: 'Sanji',
      job: 'Pirate',
    },
    {
      name: 'Nami',
      job: 'Pirate',
    },
    {
      name: 'Chopper',
      job: 'Pirate',
    }
  ];

  testData.forEach((data) => {
    test(`09 - Create new User with name ${data.name}`, async ({ request }) => {
      const response = await request.post(`${REQREST}/api/users`, { data });
      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.name).toBe(data.name);
      expect(response.status()).toBe(201);
    })
  })
});
