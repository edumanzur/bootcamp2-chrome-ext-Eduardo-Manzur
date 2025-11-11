// Import CSS
import './styles/main.css';

// Configuração da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Estado da aplicação
let focusActive = false;
let blockedSites = [];
let deferredPrompt = null;
let sessionStartTime = null;
let timerInterval = null;
let currentSessionSeconds = 0;
let siteVisitAttempts = [];
let reportedAccesses = JSON.parse(localStorage.getItem('reportedAccesses') || '[]');
let sessionReportedCount = 0;

// Elementos do DOM
const elements = {
  siteInput: document.getElementById('siteInput'),
  addSiteBtn: document.getElementById('addSiteBtn'),
  blockedList: document.getElementById('blockedList'),
  startFocusBtn: document.getElementById('startFocusBtn'),
  stopFocusBtn: document.getElementById('stopFocusBtn'),
  reportAccessBtn: document.getElementById('reportAccessBtn'),
  focusStatus: document.getElementById('focusStatus'),
  statusIndicator: document.getElementById('statusIndicator'),
  emptyMessage: document.getElementById('emptyMessage'),
  totalSites: document.getElementById('totalSites'),
  sessionsToday: document.getElementById('sessionsToday'),
  totalTime: document.getElementById('totalTime'),
  onlineStatus: document.getElementById('onlineStatus'),
  installPrompt: document.getElementById('installPrompt'),
  installBtn: document.getElementById('installBtn'),
  // Modal elements
  reportModal: document.getElementById('reportModal'),
  siteSelectReport: document.getElementById('siteSelectReport'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelReportBtn: document.getElementById('cancelReportBtn'),
  confirmReportBtn: document.getElementById('confirmReportBtn'),
  // History elements
  accessHistorySection: document.getElementById('accessHistorySection'),
  accessHistoryList: document.getElementById('accessHistoryList'),
  totalAccessCount: document.getElementById('totalAccessCount'),
  sessionAccessCount: document.getElementById('sessionAccessCount'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registrado:', registration.scope);
      
      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Nova versão disponível!');
            if (confirm('Nova versão disponível! Atualizar?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
    }
  });
}

// ===== PWA INSTALL PROMPT =====
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  elements.installPrompt.style.display = 'block';
  console.log('📲 PWA pode ser instalado');
});

elements.installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`👤 Resultado da instalação: ${outcome}`);
  
  deferredPrompt = null;
  elements.installPrompt.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalado com sucesso!');
  deferredPrompt = null;
});

// ===== API FUNCTIONS =====
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    // Fallback para localStorage em caso de erro
    return handleOfflineMode(endpoint, method, body);
  }
}

function handleOfflineMode(endpoint, method, body) {
  console.log('🔌 Modo offline - usando localStorage');
  
  if (endpoint === '/api/sites' && method === 'GET') {
    const sites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
    return { sites };
  }
  
  if (endpoint === '/api/sites' && method === 'POST') {
    const sites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
    if (!sites.includes(body.site)) {
      sites.push(body.site);
      localStorage.setItem('blockedSites', JSON.stringify(sites));
    }
    return { success: true, site: body.site };
  }
  
  if (endpoint.startsWith('/api/sites/') && method === 'DELETE') {
    const site = endpoint.split('/').pop();
    let sites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
    sites = sites.filter(s => s !== site);
    localStorage.setItem('blockedSites', JSON.stringify(sites));
    return { success: true };
  }
  
  return { error: 'Offline' };
}

// ===== LOAD SITES =====
async function loadSites() {
  try {
    const data = await apiRequest('/api/sites');
    blockedSites = data.sites || [];
    updateSitesList();
    updateStats();
  } catch (error) {
    console.error('Erro ao carregar sites:', error);
  }
}

// ===== UPDATE SITES LIST =====
function updateSitesList() {
  elements.blockedList.innerHTML = '';
  
  if (blockedSites.length === 0) {
    elements.emptyMessage.style.display = 'block';
    return;
  }
  
  elements.emptyMessage.style.display = 'none';
  
  blockedSites.forEach(site => {
    const li = document.createElement('li');
    
    const siteName = document.createElement('span');
    siteName.className = 'site-name';
    siteName.textContent = site;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger';
    removeBtn.textContent = '🗑️ Remover';
    removeBtn.onclick = () => removeSite(site);
    
    li.appendChild(siteName);
    li.appendChild(removeBtn);
    elements.blockedList.appendChild(li);
  });
}

// ===== ADD SITE =====
elements.addSiteBtn.addEventListener('click', async () => {
  const site = elements.siteInput.value.trim();
  
  if (!site) {
    alert('Por favor, digite um site válido');
    return;
  }
  
  // Validação básica de domínio
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(site)) {
    alert('Por favor, digite um domínio válido (ex: facebook.com)');
    return;
  }
  
  if (blockedSites.includes(site)) {
    alert('Este site já está na lista!');
    return;
  }
  
  try {
    await apiRequest('/api/sites', 'POST', { site });
    elements.siteInput.value = '';
    await loadSites();
    console.log('✅ Site adicionado:', site);
  } catch (error) {
    console.error('Erro ao adicionar site:', error);
  }
});

// Enter key para adicionar site
elements.siteInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    elements.addSiteBtn.click();
  }
});

// ===== REMOVE SITE =====
async function removeSite(site) {
  if (!confirm(`Remover "${site}" da lista?`)) return;
  
  try {
    await apiRequest(`/api/sites/${site}`, 'DELETE');
    await loadSites();
    console.log('✅ Site removido:', site);
  } catch (error) {
    console.error('Erro ao remover site:', error);
  }
}

// ===== FOCUS CONTROLS =====
elements.startFocusBtn.addEventListener('click', async () => {
  try {
    await apiRequest('/api/focus/start', 'POST');
    focusActive = true;
    sessionStartTime = Date.now();
    currentSessionSeconds = 0;
    siteVisitAttempts = [];
    sessionReportedCount = 0; // Resetar contador de acessos da sessão
    startTimer();
    startSiteMonitor();
    updateFocusUI();
    updateAccessHistory(); // Atualizar display do contador
    console.log('🎯 Foco iniciado!');
  } catch (error) {
    console.error('Erro ao iniciar foco:', error);
  }
});

elements.stopFocusBtn.addEventListener('click', async () => {
  try {
    await apiRequest('/api/focus/stop', 'POST');
    focusActive = false;
    stopTimer();
    stopSiteMonitor();
    updateFocusUI();
    await updateStats();
    console.log('⏸️ Foco parado!');
    
    // Mostrar resumo da sessão
    showSessionSummary();
  } catch (error) {
    console.error('Erro ao parar foco:', error);
  }
});

// ===== TIMER FUNCTIONS =====
function startTimer() {
  stopTimer(); // Limpar timer anterior se existir
  
  timerInterval = setInterval(() => {
    currentSessionSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const hours = Math.floor(currentSessionSeconds / 3600);
  const minutes = Math.floor((currentSessionSeconds % 3600) / 60);
  const seconds = currentSessionSeconds % 60;
  
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  elements.totalTime.textContent = timeString;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ===== SITE MONITOR =====
let siteMonitorInterval = null;

function startSiteMonitor() {
  stopSiteMonitor();
  
  // Monitorar mudanças de foco da janela e histórico
  window.addEventListener('focus', checkCurrentSite);
  document.addEventListener('visibilitychange', checkCurrentSite);
  
  // Verificar periodicamente (a cada 5 segundos)
  siteMonitorInterval = setInterval(checkCurrentSite, 5000);
}

function stopSiteMonitor() {
  window.removeEventListener('focus', checkCurrentSite);
  document.removeEventListener('visibilitychange', checkCurrentSite);
  
  if (siteMonitorInterval) {
    clearInterval(siteMonitorInterval);
    siteMonitorInterval = null;
  }
}

function checkCurrentSite() {
  if (!focusActive || blockedSites.length === 0) return;
  
  // Em um PWA, não podemos acessar outras abas, mas podemos detectar
  // se o usuário saiu do PWA (perdeu foco)
  if (document.hidden) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`⚠️ ${timestamp} - Você saiu do Focus PWA. Evite acessar sites bloqueados!`);
    
    // Adicionar ao histórico de tentativas (assumindo que saiu para ver sites bloqueados)
    siteVisitAttempts.push({
      timestamp: new Date(),
      action: 'Saiu do Focus PWA',
      note: 'Possível acesso a sites bloqueados'
    });
    
    // Mostrar notificação visual
    showWarning('⚠️ Você saiu do Focus! Mantenha o foco!');
  }
}

function showWarning(message) {
  // Criar notificação temporária
  const warning = document.createElement('div');
  warning.className = 'alert alert-warning';
  warning.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; animation: slideIn 0.3s;';
  warning.textContent = message;
  
  document.body.appendChild(warning);
  
  setTimeout(() => {
    warning.style.animation = 'slideOut 0.3s';
    setTimeout(() => warning.remove(), 300);
  }, 3000);
}

function showSessionSummary() {
  const totalTime = formatTime(currentSessionSeconds);
  const attempts = siteVisitAttempts.length;
  const reported = sessionReportedCount;
  
  let message = `📊 Sessão Finalizada!\n\n`;
  message += `⏱️ Tempo: ${totalTime}\n`;
  message += `🎯 Sites bloqueados: ${blockedSites.length}\n`;
  message += `⚠️ Saídas do app: ${attempts}\n`;
  message += `🔴 Sites acessados (reportados): ${reported}\n\n`;
  
  if (attempts === 0 && reported === 0) {
    message += `🏆 PERFEITO! Você manteve o foco total!`;
  } else if (reported === 0) {
    message += `✅ Sem acessos reportados! Continue assim!`;
  } else {
    message += `💪 Você reportou ${reported} acesso(s). Continue melhorando!`;
  }
  
  alert(message);
}

function updateFocusUI() {
  if (focusActive) {
    elements.focusStatus.textContent = 'Ativo';
    elements.statusIndicator.classList.add('active');
    elements.startFocusBtn.disabled = true;
    elements.stopFocusBtn.disabled = false;
    elements.reportAccessBtn.disabled = false; // Habilitar reporte durante sessão
  } else {
    elements.focusStatus.textContent = 'Parado';
    elements.statusIndicator.classList.remove('active');
    elements.startFocusBtn.disabled = false;
    elements.stopFocusBtn.disabled = true;
    elements.reportAccessBtn.disabled = false; // Sempre permitir reporte (mesmo fora de sessão)
  }
}

// ===== UPDATE STATS =====
async function updateStats() {
  elements.totalSites.textContent = blockedSites.length;
  
  try {
    const stats = await apiRequest('/api/stats');
    elements.sessionsToday.textContent = stats.sessionsToday || 0;
    elements.totalTime.textContent = `${stats.totalHours || 0}h`;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

// ===== ONLINE/OFFLINE STATUS =====
function updateOnlineStatus() {
  if (navigator.onLine) {
    elements.onlineStatus.textContent = '🟢 Online';
    elements.onlineStatus.style.color = '#4CAF50';
  } else {
    elements.onlineStatus.textContent = '🔴 Offline';
    elements.onlineStatus.style.color = '#f44336';
  }
}

window.addEventListener('online', () => {
  updateOnlineStatus();
  loadSites(); // Recarregar dados quando voltar online
});

window.addEventListener('offline', updateOnlineStatus);

// ===== REPORT ACCESS FUNCTIONALITY =====
// Abrir modal de reporte
elements.reportAccessBtn.addEventListener('click', () => {
  if (blockedSites.length === 0) {
    alert('Adicione sites bloqueados primeiro!');
    return;
  }
  
  // Preencher select com sites bloqueados
  elements.siteSelectReport.innerHTML = '<option value="">Selecione um site...</option>';
  blockedSites.forEach(site => {
    const option = document.createElement('option');
    option.value = site;
    option.textContent = site;
    elements.siteSelectReport.appendChild(option);
  });
  
  elements.reportModal.style.display = 'flex';
});

// Fechar modal
elements.closeModalBtn.addEventListener('click', closeReportModal);
elements.cancelReportBtn.addEventListener('click', closeReportModal);

function closeReportModal() {
  elements.reportModal.style.display = 'none';
  elements.siteSelectReport.value = '';
}

// Confirmar reporte
elements.confirmReportBtn.addEventListener('click', () => {
  const site = elements.siteSelectReport.value;
  
  if (!site) {
    alert('Por favor, selecione um site!');
    return;
  }
  
  reportSiteAccess(site);
  closeReportModal();
});

// Fechar modal ao clicar fora
elements.reportModal.addEventListener('click', (e) => {
  if (e.target === elements.reportModal) {
    closeReportModal();
  }
});

function reportSiteAccess(site) {
  const access = {
    site,
    timestamp: new Date().toISOString(),
    sessionActive: focusActive,
    sessionTime: focusActive ? formatTime(currentSessionSeconds) : null
  };
  
  reportedAccesses.push(access);
  localStorage.setItem('reportedAccesses', JSON.stringify(reportedAccesses));
  
  if (focusActive) {
    sessionReportedCount++;
  }
  
  updateAccessHistory();
  
  // Mostrar notificação
  showWarning(`✅ Acesso a ${site} registrado!`);
}

function updateAccessHistory() {
  elements.totalAccessCount.textContent = reportedAccesses.length;
  elements.sessionAccessCount.textContent = sessionReportedCount;
  
  if (reportedAccesses.length === 0) {
    elements.accessHistorySection.style.display = 'none';
    return;
  }
  
  elements.accessHistorySection.style.display = 'block';
  elements.accessHistoryList.innerHTML = '';
  
  // Mostrar os últimos 20 acessos (mais recentes primeiro)
  const recentAccesses = [...reportedAccesses].reverse().slice(0, 20);
  
  recentAccesses.forEach(access => {
    const li = document.createElement('li');
    li.className = 'access-item';
    
    const date = new Date(access.timestamp);
    const timeString = date.toLocaleTimeString('pt-BR');
    const dateString = date.toLocaleDateString('pt-BR');
    
    li.innerHTML = `
      <div class="access-info">
        <span class="access-site">🔴 ${access.site}</span>
        <span class="access-time">${dateString} às ${timeString}</span>
        ${access.sessionActive ? `<span class="access-time">Durante sessão de foco (${access.sessionTime})</span>` : ''}
      </div>
      <span class="access-badge">ACESSADO</span>
    `;
    
    elements.accessHistoryList.appendChild(li);
  });
}

// Limpar histórico
elements.clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todo o histórico de acessos?')) {
    reportedAccesses = [];
    localStorage.removeItem('reportedAccesses');
    updateAccessHistory();
    showWarning('🗑️ Histórico limpo!');
  }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Focus PWA iniciado!');
  loadSites();
  updateOnlineStatus();
  updateFocusUI();
  updateAccessHistory(); // Carregar histórico salvo
  
  // Verificar parâmetros da URL (shortcuts)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'start') {
    elements.startFocusBtn.click();
  }
});

// Atualizar stats periodicamente
setInterval(updateStats, 30000); // A cada 30 segundos
