// Boot de pantalla Herramientas
(function(){
  function start(){
    window.herramientasActions.attachLogout();
  }
  document.addEventListener('DOMContentLoaded', start);
  window.herramientasBoot = { start };
})();
