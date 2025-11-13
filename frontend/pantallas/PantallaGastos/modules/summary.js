(function(){
  function actualizarResumenes(gastos){
    const total=gastos.reduce((acc,g)=> acc+parseFloat(g.monto||0),0);
    const categorias={}; gastos.forEach(g=>{ const c=g.categoria||'Sin categoría'; categorias[c]=(categorias[c]||0)+parseFloat(g.monto||0); });
    const categoriaPrincipal= Object.keys(categorias).length? Object.keys(categorias).reduce((a,b)=> categorias[a]>categorias[b]? a:b): 'Sin datos';
    // Promedio últimos 3 meses (simplificado: usar todos /3)
    const promedio= total/3;
    const totalEl=document.getElementById('totalGastos'); if(totalEl) totalEl.textContent='$'+window.gastosMessages.monto(total);
    const catEl=document.getElementById('categoriaPrincipal'); if(catEl) catEl.textContent=categoriaPrincipal;
    const promEl=document.getElementById('promedioGastos'); if(promEl) promEl.textContent='$'+window.gastosMessages.monto(promedio);
    const countEl=document.getElementById('conteoGastos'); if(countEl) countEl.textContent=gastos.length;
  }
  window.gastosSummary={ actualizarResumenes };
})();