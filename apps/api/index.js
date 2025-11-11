import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados em memória (substituir por DB real em produção)
let blockedSites = ['facebook.com', 'twitter.com', 'youtube.com'];
let focusActive = false;
let sessions = [];
let stats = {
  totalSessions: 0,
  totalHours: 0,
  sessionsToday: 0
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===== ROTAS =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Focus API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Listar sites bloqueados
app.get('/api/sites', (req, res) => {
  res.json({ 
    sites: blockedSites,
    count: blockedSites.length
  });
});

// Adicionar site bloqueado
app.post('/api/sites', (req, res) => {
  const { site } = req.body;
  
  if (!site || typeof site !== 'string') {
    return res.status(400).json({ 
      error: 'Site inválido',
      message: 'O campo "site" é obrigatório e deve ser uma string'
    });
  }
  
  const cleanSite = site.trim().toLowerCase();
  
  // Validação básica de domínio
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(cleanSite)) {
    return res.status(400).json({ 
      error: 'Domínio inválido',
      message: 'Por favor, forneça um domínio válido (ex: facebook.com)'
    });
  }
  
  if (blockedSites.includes(cleanSite)) {
    return res.status(409).json({ 
      error: 'Site já bloqueado',
      message: `O site "${cleanSite}" já está na lista`
    });
  }
  
  blockedSites.push(cleanSite);
  console.log(`✅ Site adicionado: ${cleanSite}`);
  
  res.status(201).json({ 
    success: true,
    site: cleanSite,
    totalSites: blockedSites.length
  });
});

// Remover site bloqueado
app.delete('/api/sites/:site', (req, res) => {
  const { site } = req.params;
  const initialLength = blockedSites.length;
  
  blockedSites = blockedSites.filter(s => s !== site);
  
  if (blockedSites.length === initialLength) {
    return res.status(404).json({ 
      error: 'Site não encontrado',
      message: `O site "${site}" não está na lista de bloqueados`
    });
  }
  
  console.log(`🗑️ Site removido: ${site}`);
  
  res.json({ 
    success: true,
    site,
    remainingSites: blockedSites.length
  });
});

// Verificar se site está bloqueado
app.get('/api/sites/:site/check', (req, res) => {
  const { site } = req.params;
  const isBlocked = blockedSites.includes(site);
  
  res.json({ 
    site,
    blocked: isBlocked,
    focusActive
  });
});

// Iniciar sessão de foco
app.post('/api/focus/start', (req, res) => {
  if (focusActive) {
    return res.status(400).json({ 
      error: 'Foco já ativo',
      message: 'Uma sessão de foco já está em andamento'
    });
  }
  
  focusActive = true;
  const session = {
    id: Date.now(),
    startTime: new Date().toISOString(),
    endTime: null,
    blockedSites: [...blockedSites]
  };
  
  sessions.push(session);
  stats.totalSessions++;
  stats.sessionsToday++;
  
  console.log('🎯 Sessão de foco iniciada:', session.id);
  
  res.json({ 
    success: true,
    message: 'Sessão de foco iniciada',
    session: {
      id: session.id,
      startTime: session.startTime
    },
    blockedSites: blockedSites.length
  });
});

// Parar sessão de foco
app.post('/api/focus/stop', (req, res) => {
  if (!focusActive) {
    return res.status(400).json({ 
      error: 'Foco não ativo',
      message: 'Nenhuma sessão de foco está em andamento'
    });
  }
  
  focusActive = false;
  const currentSession = sessions[sessions.length - 1];
  
  if (currentSession && !currentSession.endTime) {
    currentSession.endTime = new Date().toISOString();
    const duration = (new Date(currentSession.endTime) - new Date(currentSession.startTime)) / 1000 / 60 / 60; // horas
    stats.totalHours += duration;
    
    console.log('⏸️ Sessão de foco finalizada:', currentSession.id);
    
    res.json({ 
      success: true,
      message: 'Sessão de foco finalizada',
      session: {
        id: currentSession.id,
        startTime: currentSession.startTime,
        endTime: currentSession.endTime,
        duration: `${duration.toFixed(2)}h`
      }
    });
  } else {
    res.json({ 
      success: true,
      message: 'Foco parado'
    });
  }
});

// Status do foco
app.get('/api/focus/status', (req, res) => {
  let currentSession = null;
  
  if (focusActive && sessions.length > 0) {
    const session = sessions[sessions.length - 1];
    if (!session.endTime) {
      const duration = (Date.now() - new Date(session.startTime)) / 1000 / 60; // minutos
      currentSession = {
        id: session.id,
        startTime: session.startTime,
        duration: `${Math.floor(duration)} min`
      };
    }
  }
  
  res.json({ 
    focusActive,
    currentSession,
    blockedSites: blockedSites.length
  });
});

// Estatísticas
app.get('/api/stats', (req, res) => {
  res.json({ 
    totalSessions: stats.totalSessions,
    totalHours: Math.round(stats.totalHours * 10) / 10,
    sessionsToday: stats.sessionsToday,
    blockedSitesCount: blockedSites.length,
    focusActive
  });
});

// Histórico de sessões
app.get('/api/sessions', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const recentSessions = sessions.slice(-limit).reverse();
  
  res.json({ 
    sessions: recentSessions,
    total: sessions.length
  });
});

// Reset (apenas para desenvolvimento/testes)
app.post('/api/reset', (req, res) => {
  blockedSites = ['facebook.com', 'twitter.com', 'youtube.com'];
  focusActive = false;
  sessions = [];
  stats = {
    totalSessions: 0,
    totalHours: 0,
    sessionsToday: 0
  };
  
  console.log('🔄 Dados resetados');
  
  res.json({ 
    success: true,
    message: 'Dados resetados com sucesso'
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Rota ${req.method} ${req.path} não encontrada`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/sites',
      'POST /api/sites',
      'DELETE /api/sites/:site',
      'GET /api/sites/:site/check',
      'POST /api/focus/start',
      'POST /api/focus/stop',
      'GET /api/focus/status',
      'GET /api/stats',
      'GET /api/sessions'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     🚀 Focus API Server Running       ║
║                                       ║
║  Port: ${PORT}                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Time: ${new Date().toLocaleString('pt-BR')}    ║
║                                       ║
║  Endpoints:                           ║
║  • GET  /api/health                   ║
║  • GET  /api/sites                    ║
║  • POST /api/sites                    ║
║  • GET  /api/stats                    ║
║  • POST /api/focus/start              ║
║  • POST /api/focus/stop               ║
║                                       ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

export default app;
