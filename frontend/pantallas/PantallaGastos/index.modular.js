// Bootstrap modular de la pantalla Gastos
// Se encarga de orquestar la carga inicial usando los módulos separados.
// Mantiene compatibilidad mínima con eventos inline antiguos (limpiarFiltros).
(function(){
  function start(){
    try {
      if(window.__gastosBooted){ return; }
      window.__gastosBooted = true;
      if(window.gastosFilters && window.gastosFilters.initFiltros){ window.gastosFilters.initFiltros(); }
      if(window.gastosActions && window.gastosActions.initAcciones){ window.gastosActions.initAcciones(); }
      if(window.gastosService && window.gastosService.cargarGastos){ window.gastosService.cargarGastos(); }
      // Compatibilidad: función global limpiarFiltros usada en HTML (onclick)
      if(!window.limpiarFiltros){
        window.limpiarFiltros = function(){
          const b=document.getElementById('buscarGasto');
          const c=document.getElementById('filtroCategoria');
          const m=document.getElementById('filtroMes');
          if(b) b.value=''; if(c) c.value=''; if(m) m.value='';
          if(window.gastosFilters && window.gastosFilters.aplicarFiltros){ window.gastosFilters.aplicarFiltros(); }
        };
      }
      console.debug('[GASTOS] Bootstrap iniciado');
    } catch(err){
      console.error('[GASTOS] Error durante bootstrap', err);
      if(window.gastosMessages && window.gastosMessages.mostrarMensaje){ window.gastosMessages.mostrarMensaje('Error inicializando Gastos','error'); }
    }
  }
  window.gastosBoot={ start };
})();