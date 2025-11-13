(function(){
  function actualizarResumen(invs){
    const totalInvertido=invs.reduce((s,i)=> s+ (parseFloat(i.monto)||0),0);
    const rendimientoTotal=invs.reduce((s,i)=> s+ (parseFloat(i.rendimientoEsperado)||0),0);
    const activas=invs.filter(i=> !i.fechaFin || new Date(i.fechaFin)>new Date()).length;
    const promedio=invs.length? rendimientoTotal/invs.length:0;
    const totalEl=document.getElementById('totalInvertido'); if(totalEl) totalEl.textContent='$'+window.inversionesMessages.monto(totalInvertido);
    const numEl=document.getElementById('numeroInversiones'); if(numEl) numEl.textContent=invs.length;
    const actEl=document.getElementById('inversionesActivas'); if(actEl) actEl.textContent=activas;
    const promEl=document.getElementById('rendimientoPromedio'); if(promEl) promEl.textContent= (promedio.toFixed(1))+'%';
  }
  window.inversionesSummary={ actualizarResumen };
})();
