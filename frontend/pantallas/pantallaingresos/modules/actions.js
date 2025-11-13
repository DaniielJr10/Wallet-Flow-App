(function(){
  function initAccionesTabla(){
    const exportarBtn=document.getElementById('exportarDatos');
    const selectAllBtn=document.getElementById('selectAll');
    const seleccionarTodoBtn=document.getElementById('seleccionarTodo');
    const eliminarSeleccionadosBtn=document.getElementById('eliminarSeleccionados');
    if(exportarBtn) exportarBtn.addEventListener('click', exportarDatos);
    if(selectAllBtn) selectAllBtn.addEventListener('change', function(){
      const cbs=document.querySelectorAll('tbody input[type="checkbox"]'); cbs.forEach(cb=> cb.checked=this.checked);
    });
    if(seleccionarTodoBtn) seleccionarTodoBtn.addEventListener('click', function(e){ e.preventDefault(); const selectAll=document.getElementById('selectAll'); if(selectAll){ selectAll.checked=true; selectAll.dispatchEvent(new Event('change')); }});
    if(eliminarSeleccionadosBtn) eliminarSeleccionadosBtn.addEventListener('click', function(e){ e.preventDefault(); eliminarSeleccionados(); });
  }
  function exportarDatos(){
    const { state } = window.ingresosState; const datos=state.ingresosFiltrados.map(ingreso=>({
      'Categoría': ingreso.categoria,
      'Método': ingreso.metodo,
      'Monto': ingreso.monto,
      'Fecha': ingreso.fecha,
      'Descripción': ingreso.descripcion,
      'Recurrente': ingreso.esRecurrente? 'Sí':'No',
      'Frecuencia': ingreso.frecuencia||'-',
      'Cuenta': ingreso.cuenta||'-'
    }));
    if(!datos.length){ window.ingresosMessages.mostrarMensaje('Sin datos para exportar','danger'); return; }
    const csv=window.wfUtils.csv.toCSV(datos);
    window.wfUtils.csv.download(csv,'ingresos.csv');
    window.ingresosMessages.mostrarMensaje('Exportado CSV','success');
  }
  async function eliminarSeleccionados(){
    const checkboxes=document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const indices=Array.from(checkboxes).map(cb=> parseInt(cb.dataset.index));
    if(!indices.length){ window.ingresosMessages.mostrarMensaje('No hay seleccionados','danger'); return; }
    if(!confirm(`¿Eliminar ${indices.length} ingreso(s)?`)) return;
    const { state } = window.ingresosState;
    try{
      if(!window.walletDB) throw new Error('DB no disponible');
      for(const idx of indices){ const item=state.ingresosOriginales[idx]; if(item?.id) await window.walletDB.deleteIncome(item.id); }
      await window.ingresosService.cargarIngresosDesdeDB();
      window.ingresosMessages.mostrarMensaje(`${indices.length} eliminado(s)`,'success');
    }catch(e){ console.error(e); window.ingresosMessages.mostrarMensaje('Error eliminando','danger'); }
  }
  window.ingresosActions = { initAccionesTabla, exportarDatos, eliminarSeleccionados };
})();