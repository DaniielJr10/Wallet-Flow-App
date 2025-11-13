(function(){
  function aplicarFiltros(){
    const { state,setGastosFiltrados,setPaginaActual }=window.gastosState;
    const texto=(document.getElementById('buscarGasto')?.value||'').toLowerCase().trim();
    const categoria=document.getElementById('filtroCategoria')?.value||'';
    const mes=document.getElementById('filtroMes')?.value||''; // MM
    const filtrados=state.gastosOriginales.filter(g=>{
      const coincideTexto=!texto || (g.descripcion||'').toLowerCase().includes(texto) || (g.categoria||'').toLowerCase().includes(texto) || (g.metodo||'').toLowerCase().includes(texto) || (g.cuenta||'').toLowerCase().includes(texto);
      const coincideCategoria=!categoria || (g.categoria||'')===categoria;
      let coincideMes=true; if(mes){ const f=g.fecha||''; const m=f.length>=7? f.substring(5,7):''; coincideMes=m===mes; }
      return coincideTexto && coincideCategoria && coincideMes;
    });
    setGastosFiltrados(filtrados); setPaginaActual(1); window.gastosTable.renderTabla(); window.gastosSummary.actualizarResumenes(filtrados);
  }
  function initFiltros(){
    ['buscarGasto','filtroCategoria','filtroMes'].forEach(id=>{ const el=document.getElementById(id); if(!el) return; const evt= id==='buscarGasto'? 'input':'change'; el.addEventListener(evt, aplicarFiltros); });
    const limpiarBtn=document.getElementById('btnLimpiarFiltros'); if(limpiarBtn){ limpiarBtn.addEventListener('click', e=>{ e.preventDefault(); const b=document.getElementById('buscarGasto'); const c=document.getElementById('filtroCategoria'); const m=document.getElementById('filtroMes'); if(b) b.value=''; if(c) c.value=''; if(m) m.value=''; aplicarFiltros(); }); }
  }
  window.gastosFilters={ initFiltros,aplicarFiltros };
})();