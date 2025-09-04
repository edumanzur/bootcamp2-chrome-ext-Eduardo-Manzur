// Elementos do popup
const siteInput = document.getElementById("siteInput");
const addSiteBtn = document.getElementById("addSiteBtn");
const blockedList = document.getElementById("blockedList");
const startFocusBtn = document.getElementById("startFocusBtn");
const stopFocusBtn = document.getElementById("stopFocusBtn");

// Lista de sites bloqueados (vai ser carregada do storage)
let blockedSites = [];

// Função para atualizar a lista no popup
function renderList() {
  blockedList.innerHTML = "";
  blockedSites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;

    // Botão remover
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", () => {
      blockedSites.splice(index, 1);
      saveBlockedSites();
      renderList();
    });

    li.appendChild(removeBtn);
    blockedList.appendChild(li);
  });
}

// Salvar lista no chrome.storage
function saveBlockedSites() {
  chrome.storage.sync.set({ blockedSites }, () => {
    console.log("Sites salvos:", blockedSites);
  });
}

// Carregar lista do chrome.storage
function loadBlockedSites() {
  chrome.storage.sync.get("blockedSites", (data) => {
    blockedSites = data.blockedSites || [];
    renderList();
  });
}

// Adicionar site à lista
addSiteBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();
  if (site && !blockedSites.includes(site)) {
    blockedSites.push(site);
    saveBlockedSites();
    renderList();
    siteInput.value = "";
  }
});

// Iniciar foco
startFocusBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startFocus" });
});

// Parar foco
stopFocusBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopFocus" });
});

// Inicializar
loadBlockedSites();
