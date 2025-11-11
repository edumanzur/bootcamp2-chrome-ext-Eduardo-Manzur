import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(process.cwd(), 'dist');

export default defineConfig({
  testDir: './tests',
  timeout: 30000, // 30 segundos por teste
  fullyParallel: true, // Testes em paralelo
  forbidOnly: !!process.env.CI, // Evita .only no CI
  retries: process.env.CI ? 2 : 0, // Retry no CI
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }]
  ],
  
  webServer: process.env.CI ? undefined : [
    {
      command: 'cd apps/api && npm start',
      port: 3000,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd apps/web && npm run dev',
      port: 8080,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled'
          ]
        }
      }
    }
  ]
});
