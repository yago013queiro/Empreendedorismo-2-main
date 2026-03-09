async function askGroq(prompt) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Erro da IA:", data.error);
      return `❌ ${data.error || "Erro ao conectar à IA"}`;
    }
    
    return data.text || "❌ Sem resposta da IA.";
  } catch (error) {
    console.error("Erro ao chamar /api/ask:", error);
    return "❌ Erro de conexão com o servidor.";
  }
}

async function checkIAStatus() {
  try {
    const r = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "teste" })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

window.askClaude = askGroq;
window.askGroq = askGroq;
window.checkIAStatus = checkIAStatus;


(function(){
  function getStoredFont() {
    const v = localStorage.getItem('site-font-size');
    return v ? parseInt(v, 10) : null;
  }

  function applyFontSize(px) {
    if (!px) return;
    document.documentElement.style.fontSize = px + 'px';
  }

  function getCurrentFont() {
    const val = getComputedStyle(document.documentElement).fontSize || '16px';
    return parseInt(val.replace('px',''), 10);
  }

  function changeFont(delta){
    const current = getCurrentFont();
    let next = current + delta;
    if (next < 12) next = 12;
    if (next > 28) next = 28;
    applyFontSize(next);
    localStorage.setItem('site-font-size', String(next));
  }

  function applyStoredTheme(){
    const t = localStorage.getItem('site-theme');
    if (t === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }

  function toggleTheme(){
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    
    const stored = getStoredFont();
    if (stored) applyFontSize(stored);
    applyStoredTheme();

    
    const inc = document.getElementById('inc-font');
    const dec = document.getElementById('dec-font');
    const toggle = document.getElementById('toggle-theme');

    if (inc) inc.addEventListener('click', ()=>changeFont(1));
    if (dec) dec.addEventListener('click', ()=>changeFont(-1));
    if (toggle) toggle.addEventListener('click', toggleTheme);
  });
})();