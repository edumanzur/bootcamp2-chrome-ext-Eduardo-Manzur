import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8080';
const API_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('Focus PWA - Testes E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Resetar dados da API antes de cada teste
    try {
      await fetch(`${API_URL}/api/reset`, { method: 'POST' });
    } catch (error) {
      console.warn('API reset failed:', error);
    }
    
    await page.goto(BASE_URL);
  });

  test('Página carrega corretamente', async ({ page }) => {
    await expect(page).toHaveTitle(/Focus/);
    await expect(page.locator('h1')).toContainText('Focus PWA');
    
    // Verificar elementos principais
    await expect(page.locator('[data-testid="focus-status"]')).toBeVisible();
    await expect(page.locator('#startFocusBtn')).toBeVisible();
    await expect(page.locator('#stopFocusBtn')).toBeVisible();
  });

  test('PWA manifest está configurado', async ({ page, request }) => {
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', './manifest.webmanifest');
    
    // Verificar se o manifest pode ser carregado via API request
    const response = await request.get(`${BASE_URL}/manifest.webmanifest`);
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display', 'standalone');
  });

  test('Service Worker é registrado', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Aguardar registro do service worker
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      
      const registration = await navigator.serviceWorker.ready;
      return registration.active !== null;
    });
    
    expect(swRegistered).toBeTruthy();
  });

  test('API está acessível e retorna dados', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Aguardar elemento que indica sucesso da API
    const apiStatus = page.locator('[data-testid="api-ok"]');
    await expect(apiStatus).toBeVisible({ timeout: 5000 });
    
    // Verificar se sites foram carregados
    const totalSites = await apiStatus.textContent();
    expect(parseInt(totalSites || '0')).toBeGreaterThanOrEqual(0);
  });

  test('Adicionar site bloqueado', async ({ page }) => {
    const testSite = 'instagram.com';
    
    // Preencher input
    await page.fill('#siteInput', testSite);
    
    // Clicar no botão adicionar
    await page.click('#addSiteBtn');
    
    // Aguardar site aparecer na lista
    await expect(page.locator('#blockedList')).toContainText(testSite);
    
    // Verificar contador atualizado
    const totalSites = await page.locator('#totalSites').textContent();
    expect(parseInt(totalSites || '0')).toBeGreaterThan(0);
  });

  test('Remover site bloqueado', async ({ page }) => {
    const testSite = 'reddit.com';
    
    // Adicionar site primeiro
    await page.fill('#siteInput', testSite);
    await page.click('#addSiteBtn');
    await expect(page.locator('#blockedList')).toContainText(testSite);
    
    // Remover site
    const removeBtn = page.locator(`#blockedList li:has-text("${testSite}") button:has-text("Remover")`);
    
    // Interceptar confirmação
    page.on('dialog', dialog => dialog.accept());
    await removeBtn.click();
    
    // Verificar que foi removido
    await expect(page.locator('#blockedList')).not.toContainText(testSite, { timeout: 3000 });
  });

  test('Validação de domínio inválido', async ({ page }) => {
    const invalidSite = 'not-a-valid-domain';
    
    await page.fill('#siteInput', invalidSite);
    
    // Interceptar alert
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });
    
    await page.click('#addSiteBtn');
    
    // Aguardar alert
    await page.waitForTimeout(500);
    expect(alertMessage).toContain('válido');
  });

  test('Iniciar e parar sessão de foco', async ({ page }) => {
    // Status inicial: Parado
    await expect(page.locator('#focusStatus')).toContainText('Parado');
    
    // Botão start deve estar habilitado, stop desabilitado
    await expect(page.locator('#startFocusBtn')).toBeEnabled();
    await expect(page.locator('#stopFocusBtn')).toBeDisabled();
    
    // Iniciar foco
    await page.click('#startFocusBtn');
    await page.waitForTimeout(500);
    
    // Status deve mudar para Ativo
    await expect(page.locator('#focusStatus')).toContainText('Ativo');
    
    // Botões devem inverter estado
    await expect(page.locator('#startFocusBtn')).toBeDisabled();
    await expect(page.locator('#stopFocusBtn')).toBeEnabled();
    
    // Indicador deve estar ativo
    await expect(page.locator('.status-indicator')).toHaveClass(/active/);
    
    // Parar foco
    await page.click('#stopFocusBtn');
    await page.waitForTimeout(500);
    
    // Status volta para Parado
    await expect(page.locator('#focusStatus')).toContainText('Parado');
    await expect(page.locator('#startFocusBtn')).toBeEnabled();
  });

  test('Estatísticas são exibidas', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Verificar elementos de estatísticas
    await expect(page.locator('#totalSites')).toBeVisible();
    await expect(page.locator('#sessionsToday')).toBeVisible();
    await expect(page.locator('#totalTime')).toBeVisible();
    
    // Valores devem ser números
    const totalSites = await page.locator('#totalSites').textContent();
    const sessionsToday = await page.locator('#sessionsToday').textContent();
    const totalTime = await page.locator('#totalTime').textContent();
    
    expect(totalSites).toMatch(/^\d+$/);
    expect(sessionsToday).toMatch(/^\d+$/);
    expect(totalTime).toMatch(/^\d+h$/);
  });

  test('Status online/offline é exibido', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const onlineStatus = page.locator('#onlineStatus');
    await expect(onlineStatus).toBeVisible();
    
    // Deve mostrar status online
    await expect(onlineStatus).toContainText('Online');
  });

  test('Lista vazia mostra mensagem apropriada', async ({ page, request }) => {
    // Usar API para resetar e garantir lista vazia
    await request.post(`${API_URL}/api/reset`);
    
    // Limpar localStorage e recarregar página
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verificar mensagem de lista vazia
    const emptyMessage = page.locator('#emptyMessage');
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
    await expect(emptyMessage).toContainText('Nenhum site');
  });

  test('Adicionar site via Enter key', async ({ page }) => {
    const testSite = 'linkedin.com';
    
    await page.fill('#siteInput', testSite);
    await page.press('#siteInput', 'Enter');
    
    // Verificar se foi adicionado
    await expect(page.locator('#blockedList')).toContainText(testSite);
  });

  test('Ícones PWA estão acessíveis', async ({ page }) => {
    const icons = [
      '/icons/focus16.png',
      '/icons/focus32.png',
      '/icons/icon-192.png'
    ];
    
    for (const icon of icons) {
      const response = await page.request.get(`${BASE_URL}${icon}`);
      expect(response.status()).toBe(200);
    }
  });

  test('Theme color meta tag está presente', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#4CAF50');
  });

  test('Responsividade - Mobile', async ({ page }) => {
    // Simular viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Verificar que elementos ainda são visíveis e acessíveis
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#startFocusBtn')).toBeVisible();
    await expect(page.locator('#siteInput')).toBeVisible();
  });

  test('Lighthouse - PWA criteria', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Verificar critérios básicos de PWA
    const checks = await page.evaluate(() => {
      return {
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasThemeColor: !!document.querySelector('meta[name="theme-color"]'),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost'
      };
    });
    
    expect(checks.hasManifest).toBeTruthy();
    expect(checks.hasThemeColor).toBeTruthy();
    expect(checks.hasViewport).toBeTruthy();
    expect(checks.hasServiceWorker).toBeTruthy();
  });

});

test.describe('API Integration Tests', () => {
  
  test('API health check', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('message');
  });

  test('GET /api/sites retorna lista', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/sites`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('sites');
    expect(Array.isArray(data.sites)).toBeTruthy();
  });

  test('POST /api/sites adiciona site', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/sites`, {
      data: { site: 'test.com' }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('site', 'test.com');
  });

  test('GET /api/stats retorna estatísticas', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/stats`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('totalSessions');
    expect(data).toHaveProperty('totalHours');
    expect(data).toHaveProperty('blockedSitesCount');
  });

});
