(function(){
  function calcularProgreso(o){ if(o.progreso!==undefined) return o.progreso; if(o.montoObjetivo){ return Math.round(((o.montoActual||0)/(o.montoObjetivo||1))*100); } return 0; }
  function normalizarEstado(e){ if(e==='en_progreso') return 'Pendiente'; if(e==='completado') return 'Completado'; return e||'Pendiente'; }
  function actualizarResumen(objetivos){
    const total=objetivos.length;
    const completados=objetivos.filter(o=> normalizarEstado(o.estado)==='Completado').length;
    const pendientes=objetivos.filter(o=> normalizarEstado(o.estado)==='Pendiente').length;
    const progresoPromedio= total? Math.round(objetivos.reduce((s,o)=> s+calcularProgreso(o),0)/total):0;
    const totEl=document.getElementById('totalObjetivos'); if(totEl) totEl.textContent=total;
    const compEl=document.getElementById('objetivosCompletados'); if(compEl) compEl.textContent=completados;
    const pendEl=document.getElementById('objetivosPendientes'); if(pendEl) pendEl.textContent=pendientes;
    const promEl=document.getElementById('progresoPromedio'); if(promEl) promEl.textContent=progresoPromedio+'%';
  }
  window.objetivosSummary={ actualizarResumen };
})();
