/**
 * Gastos.js (Bootstrap)
 * Archivo reducido que delega toda la lógica a ./modules/*.js
 */
(function(){
  function start(){
    window.gastosService?.cargarGastos();
    window.gastosActions?.initAcciones();
    window.gastosFilters?.initFiltros();
  }
  window.gastosBoot={ start };
  window.eliminarGasto = id => window.gastosService?.eliminarGasto(id);
  window.mostrarFormularioAgregar = () => {
      const btn=document.getElementById('btnAgregarGasto'); 
      if(btn){ btn.click(); } 
      else { window.gastosActions?.initAcciones(); document.getElementById('btnAgregarGasto')?.click(); } 
  };
    document.addEventListener('DOMContentLoaded', ()=>{ if(!window.__gastosBooted){ window.__gastosBooted=true; start(); } }); 
})();
  // Archivo Gastos.js migrado.
  // Toda la lógica ahora vive en los módulos dentro de /modules y el bootstrap en index.modular.js.
  // Este stub evita usos accidentales y guía a los desarrolladores.
  (function(){
    console.warn('[GASTOS] Gastos.js está deprecado. Usa modules/* y index.modular.js');
  })();

// Nueva lógica debe ir en módulos, no aquí.
// (Contenido antiguo eliminado)