(function(){
  function mostrar(m,t){ window.wfUtils.messages.show(m, t==='error'?'danger':t); }
  function monto(v){ return window.wfUtils.format.monto(v); }
  window.cuentasMessages={ mostrar,monto };
})();
