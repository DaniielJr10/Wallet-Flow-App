(function(){
  async function cargarCuentas(){
    const { setCuentasOriginales,setCuentasFiltradas }=window.cuentasState; let datos=[];
    try{ if(!window.walletDB) throw new Error('DB no disponible'); const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser); if(!authed) throw new Error('Inicia sesión para ver cuentas'); datos=await window.walletDB.listAccounts(); }
    catch(e){ console.error('Error cargando cuentas',e); window.cuentasMessages.mostrar(e.message||'Error cargando','error'); }
    setCuentasOriginales(datos); setCuentasFiltradas([...datos]); window.cuentasSummary.actualizarResumen(datos); window.cuentasGrid.render();
  }
  async function agregarCuenta(data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addAccount(data); await cargarCuentas(); window.cuentasMessages.mostrar('Cuenta agregada','success'); } catch(e){ console.error(e); window.cuentasMessages.mostrar(e.message||'Error agregando','error'); } }
  async function actualizarCuenta(id,data){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.updateAccount(id,data); await cargarCuentas(); window.cuentasMessages.mostrar('Cuenta actualizada','success'); } catch(e){ console.error(e); window.cuentasMessages.mostrar(e.message||'Error actualizando','error'); } }
  async function eliminarCuenta(id){ try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.deleteAccount(id); await cargarCuentas(); window.cuentasMessages.mostrar('Cuenta eliminada','success'); } catch(e){ console.error(e); window.cuentasMessages.mostrar(e.message||'Error eliminando','error'); } }
  window.cuentasService={ cargarCuentas,agregarCuenta,actualizarCuenta,eliminarCuenta };
})();
