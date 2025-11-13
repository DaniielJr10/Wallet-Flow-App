(function(){
  const state={ inversionesOriginales:[], inversionesFiltradas:[], paginaActual:1, registrosPorPagina:10 };
  function setInversionesOriginales(arr){ state.inversionesOriginales=Array.isArray(arr)?arr:[]; }
  function setInversionesFiltradas(arr){ state.inversionesFiltradas=Array.isArray(arr)?arr:[]; }
  function setPaginaActual(p){ state.paginaActual=p; }
  function reset(){ state.inversionesFiltradas=[...state.inversionesOriginales]; state.paginaActual=1; }
  window.inversionesState={ state,setInversionesOriginales,setInversionesFiltradas,setPaginaActual,reset };
})();
