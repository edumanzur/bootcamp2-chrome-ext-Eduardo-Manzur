# Focus - Extensão de Produtividade

Focus é uma extensão para Google Chrome que ajuda você a **manter o foco bloqueando sites de distração**.  
Feita como projeto de aprendizado usando **Manifest V3**.

---

## ⚡ Funcionalidades

- Adicionar e remover sites da lista de bloqueio pelo **popup**
- Iniciar e parar o **modo foco**
- Lista de sites salva automaticamente com `chrome.storage`
- Bloqueio de sites via **content script** e **background service worker**

---

## 📁 Estrutura do projeto

Focus/
├─ src/
│ ├─ popup/ ← Popup (HTML, JS, CSS)
│ ├─ content/ ← Script que roda nas páginas
│ ├─ background/ ← Service worker
│ ├─ assets/ ← Imagens e recursos
│ └─ styles/ ← CSS global
├─ icons/ ← Ícones da extensão
├─ docs/ ← Documentação ou demo
├─ manifest.json ← Configuração da extensão
├─ README.md

yaml
Copiar código

---

## 🚀 Como usar

1. Abra o Chrome e vá para `chrome://extensions/`  
2. Ative o **Modo do desenvolvedor**  
3. Clique em **Carregar sem compactação** e selecione a pasta `Focus/`  
4. Clique no ícone da extensão para abrir o popup  
5. Adicione sites e clique em **Iniciar Foco** para bloquear os sites listados  

---

## 🎨 Estilo do popup

- Layout limpo e responsivo  
- Botões azuis com efeito hover  
- Lista de sites com botão de remoção vermelho  
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
