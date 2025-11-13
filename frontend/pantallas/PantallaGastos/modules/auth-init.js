(function(){
  function esperarAuth(){
    try{ const auth=(typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null; if(!auth){ window.gastosBoot.start(); return; }
      if(auth.currentUser){ window.gastosBoot.start(); }
      else { const unsub=auth.onAuthStateChanged(u=>{ if(unsub) unsub(); window.gastosBoot.start(); }); }
    }catch(e){ console.warn('Auth no disponible Gastos', e); window.gastosBoot.start(); }
  }
  document.addEventListener('DOMContentLoaded', esperarAuth);
})();