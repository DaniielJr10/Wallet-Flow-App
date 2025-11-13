(function(){
  async function cargarIngresosDesdeDB(){
    const { setIngresosOriginales, setIngresosFiltrados } = window.ingresosState;
    let datos=[];
    try{
      if(!window.walletDB) throw new Error('Servicio no disponible');
      const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser);
      if(!authed) throw new Error('Inicia sesión para ver ingresos');
      if (typeof window.walletDB.listIncomes !== 'function'){
        console.warn('walletDB.listIncomes no disponible - usando lista vacía');
        datos = [];
      } else {
        datos= await window.walletDB.listIncomes();
      }
    }catch(e){ console.error('Error cargando ingresos', e); window.ingresosMessages.mostrarMensaje(e.message||'Error cargando','danger'); }
    setIngresosOriginales(datos); setIngresosFiltrados([...datos]);
    window.ingresosSummary.actualizarResumenes(datos);
    window.ingresosTable.renderTablaConPaginacion();
  }
  async function agregarIngreso(data){
    try{ if(!window.walletDB) throw new Error('DB no disponible'); await window.walletDB.addIncome(data); await cargarIngresosDesdeDB(); window.ingresosMessages.mostrarMensaje('Ingreso agregado','success'); }
    catch(e){ console.error(e); window.ingresosMessages.mostrarMensaje(e.message||'Error agregando','danger'); }
  }
  window.ingresosService = { cargarIngresosDesdeDB, agregarIngreso };
})();