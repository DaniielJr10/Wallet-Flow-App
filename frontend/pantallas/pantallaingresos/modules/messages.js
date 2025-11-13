(function(){
  function mostrarMensaje(mensaje, tipo){
    window.wfUtils.messages.show(mensaje, tipo);
  }
  function formatearMonto(monto){ return window.wfUtils.format.monto(monto); }
  function formatearFecha(f){ return window.wfUtils.format.fecha(f); }
  window.ingresosMessages = { mostrarMensaje, formatearMonto, formatearFecha };
})();