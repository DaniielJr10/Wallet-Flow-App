(function(){ // Sin filtros por ahora
  function aplicar(){ const { state,setCuentasFiltradas }=window.cuentasState; setCuentasFiltradas([...state.cuentasOriginales]); window.cuentasGrid.render(); window.cuentasSummary.actualizarResumen(state.cuentasOriginales); }
  function init(){ aplicar(); }
  window.cuentasFilters={ init,aplicar };
})();
