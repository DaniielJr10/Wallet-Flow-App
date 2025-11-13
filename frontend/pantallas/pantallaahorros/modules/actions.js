(function(){
  function exportar(){ const { state }=window.ahorrosState; if(!state.ahorrosFiltrados.length){ window.ahorrosMessages.mostrar('Sin datos para exportar','error'); return; }
    const datos=state.ahorrosFiltrados.map(a=>({ Categoria:a.objetivo||a.categoria||'', Fecha:a.fechaLimite||a.fecha||'', Metodo:a.cuenta||a.metodo||'', Monto:(a.montoActual!==undefined? a.montoActual: a.monto)||0, Descripcion:a.descripcion||'' }));
    const csv=window.wfUtils.csv.toCSV(datos); window.wfUtils.csv.download(csv,'ahorros.csv'); window.ahorrosMessages.mostrar('CSV exportado','success'); }
  function initAcciones(){ const add=document.getElementById('btnAgregarAhorro'); if(add) add.addEventListener('click',()=> window.ahorrosForm.abrirModalAhorro()); const exp=document.getElementById('exportAhorros'); if(exp) exp.addEventListener('click', exportar); }
  window.ahorrosActions={ initAcciones };
})();
