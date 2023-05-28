import test, { expect } from 'fixtures';

test.describe.serial('App', () => {
  test('Test CI', async ({ page }) => {
    await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });
    console.log(page.url());
    await expect(2 + 2).toEqual(4);
  });
});
