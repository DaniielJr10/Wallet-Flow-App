(function(){
  function esperarAuth(){ try{ const auth=(typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null; if(!auth){ window.deudasBoot.start(); return; } if(auth.currentUser){ window.deudasBoot.start(); } else { const unsub=auth.onAuthStateChanged(()=>{ unsub&&unsub(); window.deudasBoot.start(); }); } }catch(e){ console.warn('Auth no disponible Deudas',e); window.deudasBoot.start(); } }
  document.addEventListener('DOMContentLoaded', esperarAuth);
})();
