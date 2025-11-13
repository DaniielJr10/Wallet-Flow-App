(function(){
  function esperarAuthYInicializar(){
    try{
      const auth=(typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null;
      if(!auth){ window.ingresosBoot.start(); return; }
      if(auth.currentUser){ window.ingresosBoot.start(); }
      else {
        const unsub=auth.onAuthStateChanged(user=>{ if(unsub) unsub(); window.ingresosBoot.start(); });
      }
    }catch(e){ console.warn('Auth no disponible, iniciando modular', e); window.ingresosBoot.start(); }
  }
  document.addEventListener('DOMContentLoaded', esperarAuthYInicializar);
})();