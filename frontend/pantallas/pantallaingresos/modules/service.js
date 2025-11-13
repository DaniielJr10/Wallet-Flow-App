(function(){
  async function cargarIngresosDesdeDB(){
    const { setIngresosOriginales, setIngresosFiltrados } = window.ingresosState;
    let datos=[]; try{
      if(!window.walletDB) throw new Error('Servicio no disponible');
      const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser);
      if(!authed) throw new Error('Inicia sesión para ver ingresos');
      datos= await window.walletDB.listIncomes();
    }catch(e){ console.error('Error cargando ingresos', e); window.ingresosMessages.mostrarMensaje(e.message||'Error cargando','danger'); }
    setIngresosOriginales(datos); setIngresosFiltrados([...datos]);
    window.ingresosSummary.actualizarResumenes(datos);
    window.ingresosTable.renderTablaConPaginacion();
  }
  window.ingresosService = { cargarIngresosDesdeDB };
})();