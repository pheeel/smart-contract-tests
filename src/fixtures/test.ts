// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { initialSetup } from '@synthetixio/synpress/commands/metamask';
import { prepareMetamask } from '@synthetixio/synpress/helpers';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import { test as baseTest, chromium, BrowserContext } from '@playwright/test';
import { DeployCollectionForm, EventsList, MintNftForm } from 'components';
import { Helpers } from 'utils';

type TestFixtures = {
  // Components
  deployCollectionForm: DeployCollectionForm;
  eventsList: EventsList;
  mintNftForm: MintNftForm;

  // Context
  context: BrowserContext;
  metamask: typeof metamask;
  metamaskSetup: boolean;

  // Utils
  helpers: Helpers;
};

const test = baseTest.extend<TestFixtures>({
  metamaskSetup: true,
  context: async ({ metamaskSetup }, use) => {
    if (metamaskSetup) {
      // required for synpress
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      global.expect = expect;
      // download metamask
      const metamaskPath = await prepareMetamask(
        process.env.METAMASK_VERSION || '10.25.0',
      );
      // prepare browser args
      const browserArgs = [
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        '--remote-debugging-port=9222',
      ];
      if (process.env.CI) {
        browserArgs.push('--disable-gpu');
      }
      if (process.env.HEADLESS_MODE) {
        browserArgs.push('--headless=new');
      }
      // launch browser
      const context = await chromium.launchPersistentContext('', {
        headless: false,
        args: browserArgs,
      });
      // wait for metamask
      await context.pages()[0].waitForTimeout(3000);
      // setup metamask
      await initialSetup(chromium, {
        secretWordsOrPrivateKey: 'machine plastic wood coin dose put police coast door poverty fatal until',
        password: '12345678',
        enableAdvancedSettings: true,
      });
      await use(context);
      await context.close();
    } else {
      // use default browser context
      const context = await chromium.launchPersistentContext('');
      // delete the blank page
      await context.pages()[0].close();
      await use(context);
      await context.close();
    }
  },

  metamask: async ({}: never, use: (arg0: never) => never) => {
    await use(metamask);
  },

  deployCollectionForm: async ({ page }, use) => {
    await use(new DeployCollectionForm(page));
  },

  eventsList: async ({ page }, use) => {
    await use(new EventsList(page));
  },

  mintNftForm: async ({ page }, use) => {
    await use(new MintNftForm(page));
  },

  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },

  helpers: async ({ page }, use) => {
    await use(new Helpers(page));
  },
});

export default test;
export const { expect } = test;
