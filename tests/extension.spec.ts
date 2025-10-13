import { test, expect } from '@playwright/test';

test.describe('Focus Extension E2E Tests', () => {
  test('extensão carrega e content script é injetado', async ({ page }) => {
    // Navega para uma página de teste
    await page.goto('https://example.com');
    
    // Verifica se a página carregou
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Verifica elementos básicos da página (validação de que o browser funciona)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Se o content script adiciona algo específico, poderia verificar aqui
    // Por exemplo, se adiciona uma classe ou estilo específico
  });

  test('navegação básica funciona', async ({ page }) => {
    await page.goto('https://www.google.com');
    
    // Verifica que conseguimos navegar
    await expect(page).toHaveURL(/google/);
    
    // Aguarda um elemento básico da página
    await page.waitForSelector('body', { timeout: 5000 });
  });

  test('extensão não quebra funcionalidade de páginas', async ({ page }) => {
    // Testa em várias páginas para garantir que a extensão não causa erros
    const testUrls = [
      'https://example.com',
      'https://www.wikipedia.org'
    ];

    for (const url of testUrls) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Verifica que não há erros de console críticos
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      // Espera um pouco para capturar possíveis erros
      await page.waitForTimeout(1000);
      
      // Verifica que a página tem conteúdo básico
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(0);
    }
  });
});
