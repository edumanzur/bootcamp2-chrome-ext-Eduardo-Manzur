const siteInput = document.getElementById("siteInput");
const addSiteBtn = document.getElementById("addSiteBtn");
const blockedList = document.getElementById("blockedList");
const startFocusBtn = document.getElementById("startFocusBtn");
const stopFocusBtn = document.getElementById("stopFocusBtn");

// Conexão persistente com o service worker
const port = chrome.runtime.connect({ name: "popup-connection" });

// Atualiza a lista de sites no popup
function updateList() {
  chrome.storage.sync.get(["blockedSites"], (data) => {
    blockedList.innerHTML = "";
    if (data.blockedSites) {
      data.blockedSites.forEach(site => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "5px";

        li.textContent = site;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", () => removeSite(site));

        li.appendChild(removeBtn);
        blockedList.appendChild(li);
      });
    }
  });
}

// Adicionar site
addSiteBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();
  if (!site) return;

  chrome.storage.sync.get(["blockedSites"], (data) => {
    const list = data.blockedSites || [];
    if (!list.includes(site)) {
      list.push(site);
      chrome.storage.sync.set({ blockedSites: list }, updateList);
      siteInput.value = "";
    }
  });
});

// Remover site
function removeSite(site) {
  chrome.storage.sync.get(["blockedSites"], (data) => {
    let list = data.blockedSites || [];
    list = list.filter(s => s !== site);
    chrome.storage.sync.set({ blockedSites: list }, updateList);
  });
}

// Start / Stop Focus
startFocusBtn.addEventListener("click", () => {
  port.postMessage({ action: "startFocus" });
});

stopFocusBtn.addEventListener("click", () => {
  port.postMessage({ action: "stopFocus" });
});

// Inicializa lista ao abrir popup
updateList();
