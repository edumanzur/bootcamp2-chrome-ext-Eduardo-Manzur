# 🪟 Guia de Setup para Windows

Este guia ajuda a configurar o ambiente de desenvolvimento no Windows.

## ⚡ Solução Rápida - Política de Execução do PowerShell

Se você receber o erro: *"a execução de scripts foi desabilitada neste sistema"*

### Opção 1: Usar CMD ao invés de PowerShell

Abra o **Prompt de Comando (CMD)** ao invés do PowerShell e execute:

```cmd
npm install
npm run build
npm test
```

### Opção 2: Liberar Execução no PowerShell (Usuário Atual)

Abra o PowerShell **como Administrador** e execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois, feche e reabra o PowerShell normalmente e teste:

```powershell
npm run build
```

### Opção 3: Executar com Bypass Temporário

Em qualquer PowerShell (não precisa ser admin):

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

## 🐳 Usar Docker (Recomendado - Funciona Sempre!)

Se você tem Docker Desktop instalado, não precisa configurar nada localmente:

```bash
# Build e testes tudo dentro do container
docker compose build
docker compose run --rm e2e

# Isso funciona independente da política de execução!
```

## 📦 Instalação Completa

### Pré-requisitos

1. **Node.js 20+**: https://nodejs.org/
2. **Docker Desktop** (opcional): https://www.docker.com/products/docker-desktop/
3. **Git**: https://git-scm.com/

### Passos de Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/edumanzur/Focus.git
cd Focus
```

#### 2. Instale dependências

**Via CMD:**
```cmd
npm install
```

**Via PowerShell (com bypass):**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

#### 3. Build da extensão

**Via CMD:**
```cmd
npm run build
```

**Via PowerShell (com bypass):**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

#### 4. Verifique o build

Você deve ver:
- ✅ Pasta `dist/` criada
- ✅ Arquivo `dist/extension.zip` gerado

```cmd
dir dist
```

## 🧪 Executar Testes

### Com Playwright Local

**Primeira vez** - Instalar navegadores:

```cmd
npx playwright install chromium
```

**Executar testes:**

```cmd
npm test
```

ou

```powershell
powershell -ExecutionPolicy Bypass -Command "npm test"
```

### Com Docker (Mais Simples!)

```bash
docker compose run --rm e2e
```

## 🌐 Carregar Extensão no Chrome

1. Abra Chrome e vá para: `chrome://extensions/`
2. Ative **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `dist/` (dentro de Focus)
5. Pronto! 🎉

## 🔍 Visualizar Relatório dos Testes

Após executar os testes, veja o relatório:

```cmd
npx playwright show-report
```

Isso abre um servidor local em http://localhost:9323 com o relatório interativo.

## ❓ Problemas Comuns

### "npm não é reconhecido"

Node.js não está no PATH. Reinstale o Node.js e marque a opção para adicionar ao PATH.

### "docker não é reconhecido"

Docker Desktop não está instalado ou não está no PATH. Instale: https://www.docker.com/products/docker-desktop/

### "Cannot find module 'archiver'"

Execute novamente:
```cmd
npm install
```

### Testes falham com "Timeout"

Chromium pode demorar para iniciar. Tente aumentar o timeout em `playwright.config.ts` ou use Docker.

## 🎯 Comandos Úteis

```bash
# Ver estrutura de arquivos
tree /F

# Limpar build anterior
rmdir /S /Q dist

# Rebuild completo
npm run build

# Testes com relatório detalhado
npm run test:e2e -- --reporter=html

# Ver logs do Docker
docker compose logs e2e
```

## 🚀 Dicas de Produtividade

1. **Use Windows Terminal** (melhor que CMD/PowerShell padrão)
2. **Configure Git Bash** como terminal padrão no VS Code
3. **Use Docker** para evitar problemas de ambiente
4. **Ative WSL2** para melhor performance do Docker

## 📚 Links Úteis

- [PowerShell Execution Policies](https://learn.microsoft.com/pt-br/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [Node.js no Windows](https://nodejs.org/en/download/)
- [Docker Desktop para Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)

---

💡 **Dica Final**: Se você está tendo muitos problemas com PowerShell, simplesmente use **Docker** para tudo. É a forma mais confiável e portável!
