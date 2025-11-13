// Boot principal
(function(){
  function start(){
    window.principalState.cacheDom();
    window.principalProfile.configurarPerfilUsuario();
    window.principalActions.bind();
    window.principalAnimations.animateFloatingButton();
    window.principalAuthInit.initAuth();
  }
  document.addEventListener('DOMContentLoaded', start);
  window.principalBoot = { start };
})();
