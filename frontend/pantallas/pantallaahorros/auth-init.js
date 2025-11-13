(function(){
  function esperarAuth(){ try{ const auth=(typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null; if(!auth){ window.ahorrosBoot.start(); return; } if(auth.currentUser){ window.ahorrosBoot.start(); } else { const unsub=auth.onAuthStateChanged(()=>{ unsub&&unsub(); window.ahorrosBoot.start(); }); } }catch(e){ console.warn('Auth no disponible Ahorros',e); window.ahorrosBoot.start(); } }
  document.addEventListener('DOMContentLoaded', esperarAuth);
})();
