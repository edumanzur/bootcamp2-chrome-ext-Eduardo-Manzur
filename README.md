# 🎯 Focus PWA - Aplicação Web Progressiva de Produtividade

[![CI/CD Pipeline](https://github.com/edumanzur/bootcamp2-chrome-ext-Eduardo-Manzur/actions/workflows/ci.yml/badge.svg)](https://github.com/edumanzur/bootcamp2-chrome-ext-Eduardo-Manzur/actions/workflows/ci.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://edumanzur.github.io/bootcamp2-chrome-ext-Eduardo-Manzur/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-45ba4b.svg)](https://playwright.dev/)

**Focus PWA** é uma aplicação web progressiva completa que ajuda você a **manter o foco e aumentar a produtividade** através de gerenciamento de tempo e monitoramento de sessões.

🌐 **[Acesse o PWA ao vivo](https://edumanzur.github.io/bootcamp2-chrome-ext-Eduardo-Manzur/)**

---

## 🚀 Sobre o Projeto

Este projeto foi desenvolvido para o **Bootcamp II** e representa a evolução de uma extensão Chrome para uma **arquitetura full-stack moderna**:

- 📱 **PWA instalável** com suporte offline completo
- 🖥️ **Backend REST API** próprio em Node.js
- 🐳 **Containerização** com Docker e Docker Compose
- 🧪 **23 testes E2E** automatizados com Playwright
- 🚀 **CI/CD** com GitHub Actions (6 jobs)
- 📊 **Lighthouse CI** para garantir qualidade PWA

---

## ✨ Funcionalidades

### 🎯 Produtividade
- ✅ **Timer de alta precisão** (formato HH:MM:SS com atualização em tempo real)
- ✅ **Gerenciamento de sites** (adicionar/remover sites de distração)
- ✅ **Sessões de foco** (iniciar/parar com controle de tempo)
- ✅ **Detector de saída** (monitora quando você sai do PWA)
- ✅ **Sistema de auto-reporte** (registre acessos a sites manualmente)
- ✅ **Histórico persistente** (últimos 20 acessos com timestamps)
- ✅ **Estatísticas em tempo real** (tempo total, sites bloqueados, sessões)
- ✅ **Resumo de sessão** (4 métricas + mensagens motivacionais)

### 📱 PWA Features
- ✅ **Instalável** em desktop e mobile
- ✅ **Funciona offline** (Service Worker com cache inteligente)
- ✅ **Notificações visuais** com animações suaves
- ✅ **Responsivo** (design adaptável para todos os dispositivos)
- ✅ **Performance otimizada** (Lighthouse score > 90)

### 🔧 Tecnologia
- ✅ **Backend API REST** (8 endpoints completos)
- ✅ **Persistência** (localStorage + API)
- ✅ **CORS configurado** para cross-origin
- ✅ **Health checks** em containers Docker
- ✅ **Deploy automatizado** via GitHub Actions

---

## 📁 Arquitetura do Projeto

```
Focus/
├── apps/
│   ├── api/                    # 🖥️ Backend Node.js + Express
│   │   ├── Dockerfile          # Container multi-stage
│   │   ├── index.js            # 8 endpoints REST API
│   │   └── package.json        # Dependências API
│   └── web/                    # 📱 Frontend PWA (Vite)
│       ├── Dockerfile          # Build Vite → Nginx
│       ├── public/
│       │   ├── manifest.webmanifest  # PWA manifest
│       │   ├── service-worker.js     # Cache + offline
│       │   ├── offline.html          # Página offline
│       │   └── icons/               # Ícones PWA
│       ├── src/
│       │   ├── main.js         # Lógica principal (572 linhas)
│       │   └── styles/
│       │       └── main.css    # Estilos completos (620+ linhas)
│       ├── index.html          # UI principal (382 linhas)
│       ├── nginx.conf          # Config Nginx
│       └── package.json        # Dependências Web
├── .github/
│   └── workflows/
│       └── ci.yml              # 🚀 Pipeline CI/CD (6 jobs)
├── tests/
│   ├── pwa.spec.ts             # 🧪 23 testes E2E Playwright
│   └── playwright.config.ts    # Config testes
├── docker-compose.yml          # 🐳 Orquestração serviços
├── start.bat                   # ⚡ Launcher Windows
├── stop.bat                    # 🛑 Cleanup processos
├── lighthouserc.json           # 📊 Config Lighthouse CI
└── README.md
```

---

## 🚀 Início Rápido

### 🌐 Opção 1: Usar PWA Online (Recomendado)

1. **Acesse**: https://edumanzur.github.io/bootcamp2-chrome-ext-Eduardo-Manzur/
2. **Instale**: Clique no ícone de instalação na barra de endereços
3. **Use**: Aplicação instalada funciona offline! 🎉

### 💻 Opção 2: Executar Localmente (Windows)

**Pré-requisitos**: Node.js 20+ instalado

```bash
# 1. Clone o repositório
git clone https://github.com/edumanzur/bootcamp2-chrome-ext-Eduardo-Manzur.git
cd bootcamp2-chrome-ext-Eduardo-Manzur

# 2. Instale dependências (API + Web + Playwright)
cd apps/api
npm install
cd ../web
npm install
cd ../..
npm install

# 3. Inicie os servidores (abre 2 janelas CMD)
start.bat
```

O script `start.bat` automaticamente:
- ✅ Mata processos Node.js antigos
- ✅ Limpa cache do Vite
- ✅ Inicia API na porta 3000
- ✅ Inicia PWA na porta 8080
- ✅ Abre navegador em http://localhost:8080

**Para parar os servidores**:
```bash
stop.bat
```

### 🐳 Opção 3: Docker Compose

**Pré-requisitos**: Docker e Docker Compose instalados

```bash
# Build e inicie os containers
docker-compose up -d

# API disponível em: http://localhost:3000
# PWA disponível em: http://localhost:8080

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

---

## 📖 Como Usar

### 1️⃣ Gerenciar Sites Bloqueados

1. Digite um site no campo de entrada (ex: `youtube.com`, `facebook.com`)
2. Clique em **Adicionar Site** ou pressione Enter
3. O site aparecerá na lista abaixo
4. Para remover, clique no botão **Remover** ao lado do site

### 2️⃣ Iniciar Sessão de Foco

1. Clique em **Iniciar Foco** (botão verde)
2. O timer começará a contar em tempo real (HH:MM:SS)
3. O sistema monitorará se você sair do PWA
4. Você pode reportar acessos a sites usando o botão amarelo

### 3️⃣ Auto-Reportar Acessos

1. Durante uma sessão, clique em **⚠️ Reportar Acesso a Site**
2. Selecione o site acessado no dropdown
3. Clique em **Confirmar**
4. O acesso será registrado no histórico com timestamp

### 4️⃣ Visualizar Estatísticas

- **Estatísticas gerais**: Tempo total, sites bloqueados, sessões hoje
- **Histórico de acessos**: Últimos 20 acessos com data/hora
- **Resumo de sessão**: Ao parar o foco, veja métricas completas

---

## 🛠️ Stack Tecnológica

### Frontend (PWA)
- **Vite 5.4.21** - Build tool ultrarrápida
- **Vanilla JavaScript ES6+** - Sem frameworks, máximo desempenho
- **CSS3** - Animações, grid, flexbox, variáveis CSS
- **Service Worker** - Cache First + Network First strategies
- **Web Manifest** - Instalabilidade e ícones
- **LocalStorage API** - Persistência client-side

### Backend (API)
- **Node.js 20 LTS** - Runtime JavaScript
- **Express 4.18.2** - Framework REST minimalista
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **In-memory storage** - Rápido para MVP

### DevOps
- **Docker** - Containerização com multi-stage builds
- **Docker Compose 3.8** - Orquestração de serviços
- **Nginx Alpine** - Servidor web leve para PWA
- **GitHub Actions** - CI/CD automatizado
- **GitHub Pages** - Hospedagem gratuita

### Testes
- **Playwright 1.46.0** - E2E testing framework
- **Chromium** - Navegador para testes
- **HTML/JSON/List reporters** - Múltiplos formatos de relatório

---

## 🧪 Executar Testes

### Testes E2E com Playwright (23 testes)

```bash
# Instalar Playwright (primeira vez)
npm install
npx playwright install --with-deps chromium

# Executar todos os testes
npx playwright test

# Executar testes em modo UI (interativo)
npx playwright test --ui

# Executar testes específicos
npx playwright test tests/pwa.spec.ts

# Ver relatório HTML
npx playwright show-report
```

### Cobertura de Testes

✅ **PWA Features** (17 testes):
- Carregamento da página
- Manifest configurado
- Service Worker registrado
- Adicionar/remover sites
- Iniciar/parar sessão
- Estatísticas
- Responsividade mobile
- Lighthouse PWA criteria

✅ **API Integration** (6 testes):
- Health check
- GET/POST/DELETE endpoints
- CRUD de sites
- Controle de sessões
- Estatísticas da API

---

## 🐳 Docker

### Dockerfiles Multi-Stage

**API** (`apps/api/Dockerfile`):
- Base: `node:20-alpine`
- Otimizações: `npm ci --omit=dev`
- Segurança: Usuário não-root
- Health check configurado

**Web** (`apps/web/Dockerfile`):
- Stage 1: Build com Vite
- Stage 2: Nginx Alpine servindo arquivos estáticos
- Tamanho final: ~25MB
- Health check com wget

### Docker Compose

```yaml
services:
  api:      # Backend REST API
    ports: 3000:3000
    healthcheck: ✅
  
  web:      # Frontend PWA
    ports: 8080:80
    depends_on: api (healthy)
    healthcheck: ✅
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions - 6 Jobs Automatizados

1. **build-and-test** 🏗️
   - Instala dependências (API + Web)
   - Executa testes unitários
   - Build do PWA
   - Upload de artifacts

2. **e2e-tests** 🧪
   - Inicia serviços com Docker Compose
   - Executa 23 testes Playwright
   - Gera relatórios HTML/JSON
   - Upload de screenshots/vídeos

3. **lighthouse** 📊
   - Testes de performance
   - PWA score validation
   - Acessibilidade
   - Best practices

4. **deploy-pages** 🌐
   - Build otimizado para produção
   - Deploy no GitHub Pages
   - URL pública configurada

5. **docker-build** 🐳
   - Build de imagens Docker
   - Validação de Dockerfiles
   - Push para registry (opcional)

6. **summary** 📋
   - Consolidação de resultados
   - Status de todos os jobs
   - Notificações

### Triggers

- ✅ Push para branch `main`
- ✅ Pull Requests
- ✅ Manual dispatch (workflow_dispatch)

### Artifacts Gerados

- 📊 Relatórios Playwright (HTML + screenshots)
- 📦 Build do PWA (`web-dist`)
- 🐳 Imagens Docker
- 📈 Relatórios Lighthouse

---

## 📊 Endpoints da API

Base URL (local): `http://localhost:3000/api`  
Base URL (produção): Configurável via `VITE_API_URL`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check da API |
| GET | `/sites` | Listar todos os sites bloqueados |
| POST | `/sites` | Adicionar novo site |
| DELETE | `/sites/:site` | Remover site específico |
| POST | `/focus/start` | Iniciar sessão de foco |
| POST | `/focus/stop` | Parar sessão de foco |
| GET | `/stats` | Obter estatísticas gerais |
| GET | `/sessions` | Histórico de sessões |
| POST | `/reset` | Resetar dados (apenas testes) |

**Exemplo de uso**:

```javascript
// Adicionar site
fetch('http://localhost:3000/api/sites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ site: 'twitter.com' })
});

// Iniciar sessão
fetch('http://localhost:3000/api/focus/start', {
  method: 'POST'
});
```

---

## 🎨 Features Extras Implementadas

### 1. Timer de Alta Precisão ⏱️
- Formato HH:MM:SS com atualização em tempo real
- `setInterval` de 1 segundo para máxima precisão
- Exibição em múltiplos locais (card + resumo)

### 2. Detector de Saída PWA 🚪
- Monitora `document.hidden` API
- Interval de verificação a cada 5 segundos
- Avisos visuais com animação slide-in
- Contagem de tentativas de saída

### 3. Sistema de Auto-Reporte 📝
- Modal com dropdown de sites
- Seleção fácil e rápida
- Confirmação/cancelamento
- Feedback visual de sucesso

### 4. Histórico Persistente 📚
- LocalStorage para persistência
- Últimos 20 acessos exibidos
- Timestamps formatados (DD/MM/YYYY HH:MM)
- Badges de estatísticas (total + sessão)
- Botão de limpar histórico com confirmação

### 5. Resumo de Sessão Aprimorado 📈
- 4 métricas principais:
  - ⏱️ Tempo total de foco
  - 📋 Sites bloqueados
  - 🚪 Tentativas de saída
  - 🔴 Sites acessados (reportados)
- Mensagens motivacionais contextuais
- Feedback visual com cores e ícones

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra** um Pull Request

### Diretrizes

- Escreva testes para novas funcionalidades
- Mantenha o código documentado
- Siga o estilo de código existente
- Atualize o README se necessário

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores e Colaboradores

**Desenvolvedores:**  
- **Eduardo Manzur** - [@edumanzur](https://github.com/edumanzur)
- **Guilherme Viera** - [@GUILHERME-LA](https://github.com/GUILHERME-LA)
- **Guilherme Rocha** - [@GuidaGaita](https://github.com/GuidaGaita)
- **Gabriel Becker** - [@BudaBecker](https://github.com/BudaBecker)
- **Mateus Omaki** - [@MasayoshiRen](https://github.com/MasayoshiRen)
- **Marcos Morais**

---

## 🎓 Orientação Acadêmica

**Prof. Romes**  
Bootcamp II - Desenvolvimento Web Avançado

---

## 🏆 Conquistas do Projeto

- ✅ **100% dos requisitos** do Bootcamp II atendidos
- ✅ **PWA completo** instalável e offline-first
- ✅ **Backend próprio** com 8 endpoints REST
- ✅ **23 testes E2E** automatizados
- ✅ **CI/CD robusto** com 6 jobs
- ✅ **Lighthouse score** > 90 em todas métricas
- ✅ **Docker ready** com multi-stage builds
- ✅ **GitHub Pages** deploy automatizado

---

## 🔗 Links Úteis

### Documentação
- 📘 [PWA Documentation](https://web.dev/progressive-web-apps/)
- 📗 [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- 📙 [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- 📕 [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Ferramentas
- 🧪 [Playwright Documentation](https://playwright.dev/)
- 🐳 [Docker Documentation](https://docs.docker.com/)
- 🚀 [GitHub Actions Documentation](https://docs.github.com/actions)
- 📊 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Projeto
- 🌐 **PWA ao vivo**: https://edumanzur.github.io/bootcamp2-chrome-ext-Eduardo-Manzur/
- 💻 **Repositório**: https://github.com/edumanzur/bootcamp2-chrome-ext-Eduardo-Manzur
- 🚀 **CI/CD Status**: [GitHub Actions](https://github.com/edumanzur/bootcamp2-chrome-ext-Eduardo-Manzur/actions)

