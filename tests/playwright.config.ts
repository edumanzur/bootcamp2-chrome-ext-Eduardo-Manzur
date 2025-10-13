import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(process.cwd(), 'dist');

export default defineConfig({
  testDir: './tests',
  timeout: 30000, // 30 segundos por teste
  fullyParallel: false, // Testes em série para estabilidade com extensões
  forbidOnly: !!process.env.CI, // Evita .only no CI
  retries: process.env.CI ? 2 : 0, // Retry no CI
  workers: 1, // Apenas 1 worker para extensões
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
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
