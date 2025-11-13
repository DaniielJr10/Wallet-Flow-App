(function(){
  function mostrar(m,t){ window.wfUtils.messages.show(m, t==='error'?'danger':t); }
  function monto(v){ return window.wfUtils.format.monto(v); }
  function fecha(f){ return window.wfUtils.format.fecha(f); }
  function truncar(t,l){ return window.wfUtils.format.truncar(t,l); }
  window.ahorrosMessages={ mostrar,monto,fecha,truncar };
})();
