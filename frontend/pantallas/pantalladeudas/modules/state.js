(function(){
  const state={ deudasOriginales:[], deudasFiltradas:[] };
  function setDeudasOriginales(arr){ state.deudasOriginales=Array.isArray(arr)?arr:[]; }
  function setDeudasFiltradas(arr){ state.deudasFiltradas=Array.isArray(arr)?arr:[]; }
  function reset(){ state.deudasFiltradas=[...state.deudasOriginales]; }
  window.deudasState={ state,setDeudasOriginales,setDeudasFiltradas,reset };
})();
