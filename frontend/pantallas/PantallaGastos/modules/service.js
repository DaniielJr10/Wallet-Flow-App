(function(){
  async function cargarGastos(){
    const { setGastosOriginales,setGastosFiltrados }=window.gastosState;
    let datos=[];
    try{
      if(!window.walletDB) throw new Error('DB no disponible');
      const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser);
      if(!authed) throw new Error('Inicia sesión para ver gastos');
      datos=await window.walletDB.listExpenses();
    }catch(e){ console.error('Error cargando gastos',e); window.gastosMessages.mostrarMensaje(e.message||'Error cargando','error'); }
    setGastosOriginales(datos); setGastosFiltrados([...datos]);
    window.gastosSummary.actualizarResumenes(datos);
    window.gastosTable.renderTabla();
  }
  async function agregarGasto(data){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addExpense(data); await cargarGastos(); window.gastosMessages.mostrarMensaje('Gasto agregado','success'); }
    catch(e){ console.error(e); window.gastosMessages.mostrarMensaje(e.message||'Error agregando','error'); }
  }
  async function actualizarGasto(id,data){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateExpense(id,data); await cargarGastos(); window.gastosMessages.mostrarMensaje('Gasto actualizado','success'); }
    catch(e){ console.error(e); window.gastosMessages.mostrarMensaje(e.message||'Error actualizando','error'); }
  }
  async function eliminarGasto(id){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteExpense(id); await cargarGastos(); window.gastosMessages.mostrarMensaje('Gasto eliminado','success'); }
    catch(e){ console.error(e); window.gastosMessages.mostrarMensaje(e.message||'Error eliminando','error'); }
  }
  window.gastosService={ cargarGastos,agregarGasto,actualizarGasto,eliminarGasto };
})();