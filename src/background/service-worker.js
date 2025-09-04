// Funções para ativar/desativar foco
function startFocus() {
  chrome.storage.sync.set({ focusActive: true }, () => {
    console.log("Modo Foco iniciado");
  });

  // Injeta content script em todas as abas existentes
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["src/content/content.js"]
        }).catch(err => console.log(err));
      }
    });
  });
}

function stopFocus() {
  chrome.storage.sync.set({ focusActive: false }, () => {
    console.log("Modo Foco parado");
  });
}

// Conexão persistente com o popup
chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.action === "startFocus") startFocus();
    if (msg.action === "stopFocus") stopFocus();
  });
});

// Monitora atualizações de aba (URL mudando ou aba nova)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
      chrome.storage.sync.get(["blockedSites", "focusActive"], (data) => {
        if (data.focusActive && data.blockedSites) {
          const match = data.blockedSites.some(site => tab.url.includes(site));
          if (match) {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ["src/content/content.js"]
            }).catch(err => console.log(err));
          }
        }
      });
    }
  }
});
