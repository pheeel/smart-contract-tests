import { PlaywrightTestConfig } from '@playwright/test';
import { config } from 'dotenv';

config();
const browser = process.env.BROWSER;
const maxWorkers = process.env.MAX_WORKERS;
const retries = process.env.RETRIES;

const viewport = {
  width: 1366,
  height: 768,
};

const baseURL = 'http://localhost:3000/'

const defaultGenerals: PlaywrightTestConfig = {
  workers: Number(maxWorkers),
  retries: Number(retries),
  timeout: 500000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  testDir: 'src/tests',
  testMatch: ['**/src/tests/**/**.spec.ts'],
};

const runMode = {
  ...defaultGenerals,
  use: {
    devtools: true,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    baseURL,
    actionTimeout: 1000 * 10,
    browserName: browser,
    headless: true,
    viewport,
    locale: 'en-GB',
    ignoreHTTPSErrors: false,
    expect: {
      toHaveScreenshot: { maxDiffPixels: 100 },
    },
    launchOptions: {
      slowMo: 20,
    },
  },
};

export default runMode;

