(function(){
  function actualizarResumen(ahorros){
    const total=ahorros.reduce((s,a)=> s + (Number(a.montoActual!==undefined? a.montoActual: a.monto)||0),0);
    const count=ahorros.length; const promedio=count? total/ Math.max(1,count):0;
    const mayor=ahorros.slice().sort((a,b)=> (Number(b.montoActual!==undefined? b.montoActual: b.monto)||0) - (Number(a.montoActual!==undefined? a.montoActual: a.monto)||0))[0];
    const totalEl=document.getElementById('totalAhorros'); if(totalEl) totalEl.textContent='$'+window.ahorrosMessages.monto(total);
    const conteoEl=document.getElementById('conteoAhorros'); if(conteoEl) conteoEl.textContent=count;
    const promEl=document.getElementById('promAhorros'); if(promEl) promEl.textContent='$'+window.ahorrosMessages.monto(promedio);
    const metaEl=document.getElementById('metaPrincipal'); if(metaEl) metaEl.textContent= mayor? (mayor.objetivo||mayor.categoria)+' - $'+window.ahorrosMessages.monto(mayor.montoActual!==undefined? mayor.montoActual: mayor.monto): 'Sin datos';
    const mostrando=document.getElementById('mostrandoCuenta'); if(mostrando){ mostrando.textContent=`${window.ahorrosState.state.ahorrosFiltrados.length} de ${ahorros.length}`; }
  }
  window.ahorrosSummary={ actualizarResumen };
})();
