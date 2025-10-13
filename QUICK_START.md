# 🚀 Quick Start Guide

## 🪟 Windows Users - Escolha Seu Caminho

### Opção A: Docker (Recomendado - Mais Simples!)
```bash
# Build e test tudo de uma vez
docker compose build
docker compose run --rm e2e

# A extensão estará em dist/ após o container rodar
```

### Opção B: CMD (Sem PowerShell)
```cmd
# Use os scripts batch fornecidos
build.bat    # Faz o build
test.bat     # Roda os testes

# Ou comandos npm diretos
npm install
npm run build
npm test
```

### Opção C: PowerShell (com Bypass)
```powershell
# Bypass temporário da política de execução
powershell -ExecutionPolicy Bypass -Command "npm install"
powershell -ExecutionPolicy Bypass -Command "npm run build"
powershell -ExecutionPolicy Bypass -Command "npm test"
```

---

## 🐧 Linux/Mac Users

```bash
# Instalação e build
npm install
npm run build

# Testes
npm test

# Com Docker
docker compose build
docker compose run --rm e2e
```

---

## 📦 Carregar no Chrome

Após fazer o build:

1. Abra Chrome → `chrome://extensions/`
2. Ative **Modo do desenvolvedor**
3. **Carregar sem compactação** → Selecione pasta `dist/`
4. Pronto! 🎉

---

## 🧪 Ver Relatório dos Testes

```bash
npx playwright show-report
```

Abre em: http://localhost:9323

---

## 📚 Mais Informações

- **README.md** - Documentação completa
- **WINDOWS_SETUP.md** - Guia detalhado para Windows
- **.github/workflows/ci.yml** - Pipeline de CI/CD

---

## 🆘 Precisa de Ajuda?

**Problema com PowerShell?** → Leia `WINDOWS_SETUP.md`

**Testes falhando?** → Use Docker ou verifique se Chromium foi instalado:
```bash
npx playwright install chromium
```

**Build não gera arquivos?** → Verifique se `node_modules/` existe:
```bash
npm install
```

---

## ✅ Checklist Rápido

- [ ] Node.js 20+ instalado
- [ ] `npm install` executado
- [ ] `npm run build` criou pasta `dist/`
- [ ] Arquivo `dist/extension.zip` existe
- [ ] Chromium instalado (`npx playwright install chromium`)
- [ ] Testes passam (`npm test`)
- [ ] Extensão carrega no Chrome

---

## 🎯 Próximos Passos

1. ✅ Fazer build local
2. ✅ Testar extensão no Chrome
3. ✅ Rodar testes E2E
4. ✅ Fazer push para GitHub
5. ✅ Verificar CI no GitHub Actions
6. ✅ Baixar artefatos do CI

---

**Dica**: Se estiver com pressa, use Docker! É o caminho mais rápido e confiável. 🐳
