(function(){
  async function cargarInversiones(){
    const { setInversionesOriginales,setInversionesFiltradas }=window.inversionesState; let datos=[];
    try{ if(!window.walletDB) throw new Error('DB no disponible'); const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser); if(!authed) throw new Error('Inicia sesión para ver inversiones'); datos=await window.walletDB.listInvestments(); }
    catch(e){ console.error('Error cargando inversiones',e); window.inversionesMessages.mostrar(e.message||'Error cargando','error'); }
    setInversionesOriginales(datos); setInversionesFiltradas([...datos]); window.inversionesSummary.actualizarResumen(datos); window.inversionesTable.renderTabla();
  }
  async function agregarInversion(data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addInvestment(data); await cargarInversiones(); window.inversionesMessages.mostrar('Inversión agregada','success'); } catch(e){ console.error(e); window.inversionesMessages.mostrar(e.message||'Error agregando','error'); } }
  async function actualizarInversion(id,data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateInvestment(id,data); await cargarInversiones(); window.inversionesMessages.mostrar('Inversión actualizada','success'); } catch(e){ console.error(e); window.inversionesMessages.mostrar(e.message||'Error actualizando','error'); } }
  async function eliminarInversion(id){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteInvestment(id); await cargarInversiones(); window.inversionesMessages.mostrar('Inversión eliminada','success'); } catch(e){ console.error(e); window.inversionesMessages.mostrar(e.message||'Error eliminando','error'); } }
  window.inversionesService={ cargarInversiones,agregarInversion,actualizarInversion,eliminarInversion };
})();
