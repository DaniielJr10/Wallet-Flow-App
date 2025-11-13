(function(){
  function initFiltros(){
    const buscarInput=document.getElementById('buscarIngreso');
    const filtroCategoria=document.getElementById('filtroCategoria');
    const filtroMes=document.getElementById('filtroMes');
    const limpiar=document.getElementById('limpiarFiltros');
    if(buscarInput) buscarInput.addEventListener('input', aplicarFiltros);
    if(filtroCategoria) filtroCategoria.addEventListener('change', aplicarFiltros);
    if(filtroMes) filtroMes.addEventListener('change', aplicarFiltros);
    if(limpiar) limpiar.addEventListener('click',()=>{ buscarInput.value=''; filtroCategoria.value=''; filtroMes.value=''; aplicarFiltros(); });
  }
  function aplicarFiltros(){
    const texto=(document.getElementById('buscarIngreso').value||'').toLowerCase();
    const categoria=document.getElementById('filtroCategoria').value;
    const mes=document.getElementById('filtroMes').value;
    const { state, setIngresosFiltrados, setPaginaActual } = window.ingresosState;
    const filtrados = state.ingresosOriginales.filter(ing=>{
      const coincideTexto=!texto || (ing.descripcion||'').toLowerCase().includes(texto) || (ing.categoria||'').toLowerCase().includes(texto) || (ing.metodo||'').toLowerCase().includes(texto);
      const coincideCategoria=!categoria || ing.categoria===categoria;
      let coincideMes=true;
      if(mes){ const f=ing.fecha||''; const m=f.length>=7? f.substring(5,7):''; coincideMes=m===mes; }
      return coincideTexto && coincideCategoria && coincideMes;
    });
    setIngresosFiltrados(filtrados); setPaginaActual(1);
    window.ingresosTable.renderTablaConPaginacion();
  }
  window.ingresosFilters = { initFiltros, aplicarFiltros };
})();