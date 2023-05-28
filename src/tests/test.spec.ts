import test, { expect } from 'fixtures';

test.describe.serial('App', () => {
  test('Test CI', async () => {
    await expect(2 + 2).toEqual(5);
  });
});
