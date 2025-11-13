// Boot modular Ahorros
(function(){
  function start(){ window.ahorrosFilters.initFiltros(); window.ahorrosActions.initAcciones(); window.ahorrosService.cargarAhorros(); }
  window.ahorrosBoot={ start };
})();
