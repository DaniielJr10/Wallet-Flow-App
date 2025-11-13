// Boot principal modular de ingresos
(function(){
  function start(){
    // Inicializar filtros, formulario y acciones
    window.ingresosFilters.initFiltros();
    window.ingresosFormInit.initFormularioIngreso();
    window.ingresosActions.initAccionesTabla();
    // Cargar datos
    window.ingresosService.cargarIngresosDesdeDB();
    // Botón agregar
    const btnAgregar=document.getElementById('btnAgregarIngreso');
    if(btnAgregar){ btnAgregar.addEventListener('click', ()=>{
      const modal=document.getElementById('modalAgregarIngreso');
      if(modal){ modal.classList.remove('d-none'); const fechaHoy=new Date().toISOString().split('T')[0]; const fechaInput=document.getElementById('addFechaIngreso'); if(fechaInput) fechaInput.value=fechaHoy; }
    }); }
    // Exponer render
    window.renderIngresos = ()=> window.ingresosService.cargarIngresosDesdeDB();
  }
  window.ingresosBoot = { start };
})();