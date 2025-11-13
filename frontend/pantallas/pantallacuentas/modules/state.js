(function(){
  const state={ cuentasOriginales:[], cuentasFiltradas:[] };
  function setCuentasOriginales(arr){ state.cuentasOriginales=Array.isArray(arr)?arr:[]; }
  function setCuentasFiltradas(arr){ state.cuentasFiltradas=Array.isArray(arr)?arr:[]; }
  function reset(){ state.cuentasFiltradas=[...state.cuentasOriginales]; }
  window.cuentasState={ state,setCuentasOriginales,setCuentasFiltradas,reset };
})();
