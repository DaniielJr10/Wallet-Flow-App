(function(){ // No filtros definidos aún; placeholder
  function aplicar(){ const { state,setObjetivosFiltrados }=window.objetivosState; setObjetivosFiltrados([...state.objetivosOriginales]); window.objetivosTable.render(); window.objetivosSummary.actualizarResumen(state.objetivosOriginales); }
  function init(){ aplicar(); }
  window.objetivosFilters={ init,aplicar };
})();
