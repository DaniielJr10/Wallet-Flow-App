(function(){
  function mostrarMensaje(mensaje,tipo){ window.wfUtils.messages.show(mensaje, tipo==='error'?'danger':tipo); }
  function monto(v){ return window.wfUtils.format.monto(v); }
  function fecha(f){ return window.wfUtils.format.fecha(f); }
  function truncar(t,l){ return window.wfUtils.format.truncar(t,l); }
  window.gastosMessages={ mostrarMensaje,monto,fecha,truncar };
})();