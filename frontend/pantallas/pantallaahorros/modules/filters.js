(function(){
  function aplicarFiltros(){
    const { state,setAhorrosFiltrados,setPaginaActual }=window.ahorrosState;
    const q=(document.getElementById('buscarAhorro')?.value||'').toLowerCase().trim();
    const cat=document.getElementById('filtroCategoriaAhorro')?.value||'';
    const mes=document.getElementById('filtroMesAhorro')?.value||'';
    const filtrados=state.ahorrosOriginales.filter(a=>{
      const categoria=a.objetivo||a.categoria||''; const fecha=a.fechaLimite||a.fecha||'';
      if(cat && categoria!==cat) return false;
      if(mes){ const m=fecha.substring(5,7); if(m!==mes) return false; }
      if(q){ const texto=((a.descripcion||'')+' '+categoria).toLowerCase(); if(!texto.includes(q)) return false; }
      return true;
    });
    setAhorrosFiltrados(filtrados); setPaginaActual(1); window.ahorrosTable.renderTabla(); window.ahorrosSummary.actualizarResumen(filtrados);
  }
  function initFiltros(){ ['buscarAhorro','filtroCategoriaAhorro','filtroMesAhorro'].forEach(id=>{ const el=document.getElementById(id); if(!el) return; const evt=id==='buscarAhorro'?'input':'change'; el.addEventListener(evt, aplicarFiltros); }); const limpiar=document.getElementById('btnLimpiarAhorros'); if(limpiar){ limpiar.addEventListener('click',()=>{ const b=document.getElementById('buscarAhorro'); const c=document.getElementById('filtroCategoriaAhorro'); const m=document.getElementById('filtroMesAhorro'); if(b) b.value=''; if(c) c.value=''; if(m) m.value=''; aplicarFiltros(); }); }
  }
  window.ahorrosFilters={ initFiltros,aplicarFiltros };
})();
