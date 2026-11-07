import { defineConfig } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL || 'http://localhost:4321';
const channel = process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? undefined : 'chrome');

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
  reporter: 'list',
  outputDir: 'artifacts/test-results',
  use: { baseURL, browserName: 'chromium', channel, trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
