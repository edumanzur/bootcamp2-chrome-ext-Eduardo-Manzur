# 🎯 Focus - Extensão de Produtividade Chrome (MV3)

[![CI](https://github.com/edumanzur/Focus/actions/workflows/ci.yml/badge.svg)](https://github.com/edumanzur/Focus/actions/workflows/ci.yml)

Focus é uma extensão para Google Chrome que ajuda você a **manter o foco bloqueando sites de distração**.  
Desenvolvida com **Manifest V3** e inclui containerização com Docker e testes E2E com Playwright.

---

## ⚡ Funcionalidades

- ✅ Adicionar e remover sites da lista de bloqueio pelo **popup**
- ✅ Iniciar e parar o **modo foco**
- ✅ Lista de sites salva automaticamente com `chrome.storage`
- ✅ Bloqueio de sites via **content script** e **background service worker**
- 🐳 **Containerização completa** com Docker Compose
- 🧪 **Testes E2E automatizados** com Playwright
- 🚀 **CI/CD** com GitHub Actions

---

## 📁 Estrutura do Projeto

```
Focus/
├─ src/
│  ├─ popup/           # Interface do popup (HTML, JS, CSS)
│  ├─ content/         # Content script injetado nas páginas
│  ├─ background/      # Service worker (MV3)
│  ├─ assets/          # Imagens e recursos
│  └─ styles/          # Estilos globais
├─ icons/              # Ícones da extensão (16, 32, 48, 128)
├─ tests/              # Testes E2E com Playwright
│  ├─ extension.spec.ts
│  └─ playwright.config.ts
├─ scripts/            # Scripts de build
│  └─ build-extension.mjs
├─ .github/
│  └─ workflows/
│     └─ ci.yml        # Pipeline CI/CD
├─ dist/               # Build da extensão (gerado)
├─ Dockerfile          # Imagem Docker para testes
├─ docker-compose.yml  # Orquestração dos containers
├─ manifest.json       # Configuração da extensão MV3
├─ package.json        # Dependências e scripts
└─ README.md
```

---

## 🚀 Como Usar a Extensão

### 1️⃣ Instalação Manual no Chrome

1. Clone o repositório:
   ```bash
   git clone https://github.com/edumanzur/Focus.git
   cd Focus
   ```

2. Instale as dependências e faça o build:
   ```bash
   npm install
   npm run build
   ```

3. Abra o Chrome e vá para `chrome://extensions/`

4. Ative o **Modo do desenvolvedor** (canto superior direito)

5. Clique em **Carregar sem compactação** e selecione a pasta `dist/`

6. A extensão estará disponível na barra de ferramentas! 🎉

### 2️⃣ Como Usar

1. Clique no ícone da extensão para abrir o popup
2. Adicione sites que deseja bloquear (ex: `facebook.com`, `youtube.com`)
3. Clique em **Iniciar Foco** para ativar o bloqueio
4. Para desativar, clique em **Parar Foco**

---

## 🐳 Desenvolvimento com Docker

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### Build e Testes com Docker Compose

```bash
# Build da imagem Docker
docker compose build

# Executar testes E2E no container
docker compose run --rm e2e

# (Opcional) Executar com volume montado para ver relatórios
docker compose run --rm e2e npm run test:e2e
```

### Build Manual com Docker

```bash
# Build da imagem
docker build -t focus-extension:latest .

# Executar testes
docker run --rm focus-extension:latest

# Extrair o ZIP da extensão
docker run --rm -v ${PWD}/output:/output focus-extension:latest \
  sh -c "cp dist/extension.zip /output/"
```

---

## 🧪 Testes E2E com Playwright

### Executar Testes Localmente

```bash
# Instalar dependências (primeira vez)
npm install

# Instalar navegadores do Playwright
npx playwright install --with-deps chromium

# Build da extensão
npm run build

# Executar testes
npm test

# Apenas testes E2E (sem rebuild)
npm run test:e2e

# Ver relatório interativo
npx playwright show-report
```

### Estrutura dos Testes

Os testes verificam:
- ✅ Carregamento correto da extensão
- ✅ Injeção do content script
- ✅ Navegação básica sem erros
- ✅ Compatibilidade com múltiplas páginas

---

## 🔧 Scripts Disponíveis

```json
{
  "build": "node scripts/build-extension.mjs",      // Gera dist/ e extension.zip
  "test:e2e": "playwright test --reporter=list,html", // Roda testes E2E
  "test": "npm run build && npm run test:e2e",        // Build + Testes
  "ci": "npm ci && npm run test"                      // Pipeline completa
}
```

---

## 🚀 CI/CD com GitHub Actions

### Pipeline Automatizada

A cada push ou pull request para `main`, o GitHub Actions:

1. ✅ Instala dependências e Playwright
2. ✅ Faz build da extensão
3. ✅ Executa testes E2E
4. ✅ Publica artefatos:
   - `playwright-report` (relatório HTML dos testes)
   - `extension-zip` (pacote `.zip` pronto para distribuição)
   - `extension-dist` (pasta `dist/` completa)

### Ver Resultados do CI

- Acesse a aba **Actions** no repositório
- Clique na última execução do workflow **CI - Focus Extension**
- Baixe os artefatos na seção **Artifacts**

### Badge de Status

[![CI](https://github.com/edumanzur/Focus/actions/workflows/ci.yml/badge.svg)](https://github.com/edumanzur/Focus/actions/workflows/ci.yml)

---

## 📦 Build da Extensão

O script `scripts/build-extension.mjs`:

1. Remove a pasta `dist/` anterior
2. Copia `manifest.json`, `src/`, e `icons/` para `dist/`
3. Gera `dist/extension.zip` com o conteúdo empacotado
4. Exibe o tamanho do arquivo final

**Resultado**: Extensão pronta para carregar no Chrome ou distribuir!

---

## 🎨 Tecnologias Utilizadas

- **Chrome Extensions Manifest V3** - API moderna de extensões
- **Playwright** - Framework de testes E2E
- **Docker & Docker Compose** - Containerização
- **GitHub Actions** - CI/CD automatizado
- **Node.js 20** - Runtime JavaScript
- **Archiver** - Geração de arquivos ZIP

---

## 📝 Entrega Intermediária - Bootcamp

### ✅ Checklist de Entregas

- [x] Dockerfile baseado em `mcr.microsoft.com/playwright`
- [x] docker-compose.yml configurado
- [x] Script de build gerando `dist/` e `extension.zip`
- [x] Testes E2E com Playwright carregando extensão
- [x] GitHub Actions workflow funcional
- [x] Artefatos publicados (relatório + ZIP)
- [x] Documentação completa no README

### 📊 Como Entregar

1. **Link do repositório**: https://github.com/edumanzur/Focus
2. **Link do workflow**: Vá para Actions → última execução verde
3. **Relatório Playwright**: Baixar artefato `playwright-report` do CI

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍🏫 Créditos

Projeto desenvolvido para o **Bootcamp II** sob orientação do **Prof. Romes**.

> ⚡ "Automatize tudo que puder e trate sua extensão como software de produção." - Sgt. Romes

---

## 🔗 Links Úteis

- [Documentação Chrome Extensions MV3](https://developer.chrome.com/docs/extensions/mv3/)
- [Playwright Documentation](https://playwright.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)  
- Scroll automático para listas longas  

---

## 📌 Observações

- O bloqueio de sites funciona enquanto o **modo foco** estiver ativo  
- É uma versão inicial para aprendizado e prática com Chrome Extensions API  
- Pode ser expandida com recursos como temporizador, notificações e sincronização avançada  

---

## 🖼️ Ícones e assets

- Ícones em diferentes tamanhos: 16px, 32px, 48px e 128px  
- Imagem de referência em `src/assets/focus.jpg`

---

## GitHub Pages
https://edumanzur.github.io/bootcamp2-chrome-ext-Eduardo-Manzur/
