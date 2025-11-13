// Boot modular Deudas
(function(){
  function start(){ window.deudasFilters.init(); window.deudasActions.initAcciones(); window.deudasService.cargarDeudas(); }
  window.deudasBoot={ start };
})();
