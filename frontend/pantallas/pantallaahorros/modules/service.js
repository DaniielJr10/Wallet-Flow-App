(function(){
  async function cargarAhorros(){
    const { setAhorrosOriginales,setAhorrosFiltrados }=window.ahorrosState; let datos=[];
    try{ if(!window.walletDB) throw new Error('DB no disponible'); const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser); if(!authed) throw new Error('Inicia sesión para ver ahorros'); datos=await window.walletDB.listSavings(); }
    catch(e){ console.error('Error cargando ahorros',e); window.ahorrosMessages.mostrar(e.message||'Error cargando','error'); }
    setAhorrosOriginales(datos); setAhorrosFiltrados([...datos]); window.ahorrosSummary.actualizarResumen(datos); window.ahorrosTable.renderTabla();
  }
  async function agregarAhorro(data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addSaving(data); await cargarAhorros(); window.ahorrosMessages.mostrar('Ahorro agregado','success'); } catch(e){ console.error(e); window.ahorrosMessages.mostrar(e.message||'Error agregando','error'); } }
  async function actualizarAhorro(id,data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateSaving(id,data); await cargarAhorros(); window.ahorrosMessages.mostrar('Ahorro actualizado','success'); } catch(e){ console.error(e); window.ahorrosMessages.mostrar(e.message||'Error actualizando','error'); } }
  async function eliminarAhorro(id){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteSaving(id); await cargarAhorros(); window.ahorrosMessages.mostrar('Ahorro eliminado','success'); } catch(e){ console.error(e); window.ahorrosMessages.mostrar(e.message||'Error eliminando','error'); } }
  window.ahorrosService={ cargarAhorros,agregarAhorro,actualizarAhorro,eliminarAhorro };
})();
