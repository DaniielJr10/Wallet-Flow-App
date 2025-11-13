(function(){
  function exportar(){
    const { state }=window.gastosState; if(!state.gastosFiltrados.length){ window.gastosMessages.mostrarMensaje('Sin datos para exportar','error'); return; }
    const datos=state.gastosFiltrados.map(g=>({ 'Descripción':g.descripcion, 'Monto':g.monto, 'Categoría':g.categoria, 'Método':g.metodo, 'Fecha':g.fecha, 'Cuenta':g.cuenta, 'Recurrente': g.esRecurrente?'Sí':'No', 'Frecuencia': g.frecuencia||'' }));
    const csv=window.wfUtils.csv.toCSV(datos); window.wfUtils.csv.download(csv,'gastos.csv'); window.gastosMessages.mostrarMensaje('CSV exportado','success');
  }
  function initAcciones(){ const btn=document.getElementById('btnExportar'); if(btn) btn.addEventListener('click', exportar); const btnAgregar=document.getElementById('btnAgregarGasto'); if(btnAgregar) btnAgregar.addEventListener('click', ()=> abrirModalAgregar()); }
  function abrirModalAgregar(){ const modal=document.getElementById('modalAgregarGasto'); if(modal){ modal.classList.remove('d-none'); const hoy=new Date().toISOString().split('T')[0]; const fecha=document.getElementById('addFechaGasto'); if(fecha) fecha.value=hoy; window.gastosFormInit.initFormulario(); } }
  window.gastosActions={ initAcciones };
})();