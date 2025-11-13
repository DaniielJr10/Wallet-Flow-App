(function(){
  async function cargarObjetivos(){
    const { setObjetivosOriginales,setObjetivosFiltrados }=window.objetivosState; let datos=[];
    try{ if(!window.walletDB) throw new Error('DB no disponible'); const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser); if(!authed) throw new Error('Inicia sesión para ver objetivos'); datos=await window.walletDB.listGoals(); }
    catch(e){ console.error('Error cargando objetivos',e); window.objetivosMessages.mostrar(e.message||'Error cargando','error'); }
    setObjetivosOriginales(datos); setObjetivosFiltrados([...datos]); window.objetivosSummary.actualizarResumen(datos); window.objetivosTable.render();
  }
  async function agregarObjetivo(data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addGoal(data); await cargarObjetivos(); window.objetivosMessages.mostrar('Objetivo creado','success'); } catch(e){ console.error(e); window.objetivosMessages.mostrar(e.message||'Error creando','error'); } }
  async function actualizarObjetivo(id,data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateGoal(id,data); await cargarObjetivos(); window.objetivosMessages.mostrar('Objetivo actualizado','success'); } catch(e){ console.error(e); window.objetivosMessages.mostrar(e.message||'Error actualizando','error'); } }
  async function eliminarObjetivo(id){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteGoal(id); await cargarObjetivos(); window.objetivosMessages.mostrar('Objetivo eliminado','success'); } catch(e){ console.error(e); window.objetivosMessages.mostrar(e.message||'Error eliminando','error'); } }
  window.objetivosService={ cargarObjetivos,agregarObjetivo,actualizarObjetivo,eliminarObjetivo };
})();
