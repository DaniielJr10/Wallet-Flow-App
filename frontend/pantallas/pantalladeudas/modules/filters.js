(function(){
  function aplicar(){ const { state,setDeudasFiltradas }=window.deudasState; // sin filtros por ahora
    setDeudasFiltradas([...state.deudasOriginales]); window.deudasTable.renderTabla(); window.deudasSummary.actualizarResumen(state.deudasOriginales); }
  function init(){ aplicar(); }
  window.deudasFilters={ init,aplicar };
})();
