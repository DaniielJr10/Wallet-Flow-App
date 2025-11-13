// Boot modular Gastos
(function(){
  function start(){
    window.gastosFilters.initFiltros();
    window.gastosActions.initAcciones();
    window.gastosService.cargarGastos();
  }
  window.gastosBoot={ start };
})();