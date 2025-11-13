(function(){ // No filtros UI aún; placeholder para futuras extensiones
  function aplicar(){ const { state,setInversionesFiltradas }=window.inversionesState; setInversionesFiltradas([...state.inversionesOriginales]); window.inversionesTable.renderTabla(); window.inversionesSummary.actualizarResumen(state.inversionesOriginales); }
  function init(){ aplicar(); }
  window.inversionesFilters={ init,aplicar };
})();
