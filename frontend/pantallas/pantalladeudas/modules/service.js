(function(){
  async function cargarDeudas(){
    const { setDeudasOriginales,setDeudasFiltradas }=window.deudasState;
    let datos=[];
    try{
      if(!window.walletDB) throw new Error('DB no disponible');
      const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser);
      if(!authed) throw new Error('Inicia sesión para ver deudas');
      if (typeof window.walletDB.listDebts !== 'function') {
        console.warn('walletDB.listDebts no disponible - usando lista vacía');
        datos = [];
      } else {
        datos=await window.walletDB.listDebts();
      }
    }catch(e){ console.error('Error cargando deudas',e); window.deudasMessages.mostrar(e.message||'Error cargando','error'); }
    setDeudasOriginales(datos); setDeudasFiltradas([...datos]);
    window.deudasSummary.actualizarResumen(datos);
    window.deudasTable.renderTabla();
  }
  async function agregarDeuda(data){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addDebt(data); await cargarDeudas(); window.deudasMessages.mostrar('Deuda agregada','success'); }
    catch(e){ console.error(e); window.deudasMessages.mostrar(e.message||'Error agregando','error'); }
  }
  async function actualizarDeuda(id,data){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateDebt(id,data); await cargarDeudas(); window.deudasMessages.mostrar('Deuda actualizada','success'); }
    catch(e){ console.error(e); window.deudasMessages.mostrar(e.message||'Error actualizando','error'); }
  }
  async function eliminarDeuda(id){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteDebt(id); await cargarDeudas(); window.deudasMessages.mostrar('Deuda eliminada','success'); }
    catch(e){ console.error(e); window.deudasMessages.mostrar(e.message||'Error eliminando','error'); }
  }
  window.deudasService={ cargarDeudas,agregarDeuda,actualizarDeuda,eliminarDeuda };
})();
