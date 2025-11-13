(function(){
  function show(msg,type){
    const alerta=document.createElement('div');
    alerta.className=`alerta-personalizada alerta-${type}`;
    alerta.innerHTML=`<div class="alerta-contenido"><i class="bi bi-${type==='success'?'check-circle':'exclamation-triangle'} me-2"></i>${msg}</div>`;
      alerta.style.cssText=`position:fixed;top:20px;right:20px;z-index:11000;padding:1rem 1.5rem;border-radius:10px;color:#fff;font-weight:500;animation:slideInRight .3s ease;background:${type==='success'?'linear-gradient(135deg,#2ecc71,#27ae60)':'linear-gradient(135deg,#e74c3c,#c0392b)'};box-shadow:0 4px 15px rgba(0,0,0,.2);`;
    document.body.appendChild(alerta);
    setTimeout(()=>{ alerta.style.animation='slideOutRight .3s ease'; setTimeout(()=> alerta.remove(),300); },3000);
  }
  window.wfUtils = window.wfUtils || {}; window.wfUtils.messages = { show };
})();