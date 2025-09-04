// Substitui o conteúdo da página por aviso se o site estiver bloqueado

function blockPage(site) {
  document.documentElement.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; font-family: Arial, sans-serif;">
      <h1 style="color:#f44336;">Site Bloqueado</h1>
      <p>O site <strong>${site}</strong> está bloqueado pelo Focus.</p>
    </div>
  `;
}

// Verifica se deve bloquear
chrome.storage.sync.get(["blockedSites", "focusActive"], (data) => {
  const url = window.location.hostname;
  if (data.focusActive && data.blockedSites) {
    const match = data.blockedSites.some(site => url.includes(site));
    if (match) {
      blockPage(url);
    }
  }
});
