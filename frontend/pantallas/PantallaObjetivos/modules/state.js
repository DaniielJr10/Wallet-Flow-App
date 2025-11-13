(function(){
  const state={ objetivosOriginales:[], objetivosFiltrados:[] };
  function setObjetivosOriginales(arr){ state.objetivosOriginales=Array.isArray(arr)?arr:[]; }
  function setObjetivosFiltrados(arr){ state.objetivosFiltrados=Array.isArray(arr)?arr:[]; }
  function reset(){ state.objetivosFiltrados=[...state.objetivosOriginales]; }
  window.objetivosState={ state,setObjetivosOriginales,setObjetivosFiltrados,reset };
})();
