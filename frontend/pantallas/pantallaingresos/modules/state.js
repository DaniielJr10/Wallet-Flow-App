(function(){
  const state = {
    ingresosOriginales: [],
    ingresosFiltrados: [],
    paginaActual: 1,
    registrosPorPagina: 10
  };
  function setIngresosOriginales(arr){ state.ingresosOriginales = Array.isArray(arr)? arr: []; }
  function setIngresosFiltrados(arr){ state.ingresosFiltrados = Array.isArray(arr)? arr: []; }
  function setPaginaActual(p){ state.paginaActual = p; }
  function resetFiltros(){ state.ingresosFiltrados = [...state.ingresosOriginales]; state.paginaActual = 1; }
  window.ingresosState = { state, setIngresosOriginales, setIngresosFiltrados, setPaginaActual, resetFiltros };
})();