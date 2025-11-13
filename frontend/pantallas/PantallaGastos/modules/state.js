(function(){
  const state={ gastosOriginales:[], gastosFiltrados:[], paginaActual:1, registrosPorPagina:10 };
  function setGastosOriginales(arr){ state.gastosOriginales=Array.isArray(arr)?arr:[]; }
  function setGastosFiltrados(arr){ state.gastosFiltrados=Array.isArray(arr)?arr:[]; }
  function setPaginaActual(p){ state.paginaActual=p; }
  function reset(){ state.gastosFiltrados=[...state.gastosOriginales]; state.paginaActual=1; }
  window.gastosState={ state,setGastosOriginales,setGastosFiltrados,setPaginaActual,reset };
})();