import { defineConfig, devices } from '@playwright/test';

// PW_PORT lets local runs avoid a port that another project already holds; CI keeps 4173.
const port = Number(process.env.PW_PORT || 4173);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:' + port,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port ' + port + ' --strictPort',
    url: 'http://127.0.0.1:' + port,
    reuseExistingServer: !process.env.CI,
  },
});
