/*
  principal.js (LEGACY)
  Esta pantalla fue migrada a una arquitectura modular en `modules/`.
  El HTML ya no carga este archivo (queda comentado para rollback rápido).
  Puedes mantener este stub para evitar ejecuciones duplicadas si alguien lo reactiva.
*/
(function(){
  function safeStart(){ if(window.principalBoot) window.principalBoot.start(); }
  if(document.readyState !== 'loading') safeStart();
  else document.addEventListener('DOMContentLoaded', safeStart);
})();

