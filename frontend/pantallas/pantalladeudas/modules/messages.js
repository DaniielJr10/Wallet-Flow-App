(function(){
  function mostrar(mensaje,tipo){ window.wfUtils?.messages?.show(mensaje, tipo==='error'?'danger':tipo); }
  function monto(v){ return window.wfUtils.format.monto(v); }
  function fecha(f){ return window.wfUtils.format.fecha(f); }
  window.deudasMessages={ mostrar,monto,fecha };
})();
