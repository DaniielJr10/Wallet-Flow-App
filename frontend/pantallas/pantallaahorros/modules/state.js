(function(){
  const state={ ahorrosOriginales:[], ahorrosFiltrados:[], paginaActual:1, registrosPorPagina:15 };
  function setAhorrosOriginales(arr){ state.ahorrosOriginales=Array.isArray(arr)?arr:[]; }
  function setAhorrosFiltrados(arr){ state.ahorrosFiltrados=Array.isArray(arr)?arr:[]; }
  function setPaginaActual(p){ state.paginaActual=p; }
  function reset(){ state.ahorrosFiltrados=[...state.ahorrosOriginales]; state.paginaActual=1; }
  window.ahorrosState={ state,setAhorrosOriginales,setAhorrosFiltrados,setPaginaActual,reset };
})();
