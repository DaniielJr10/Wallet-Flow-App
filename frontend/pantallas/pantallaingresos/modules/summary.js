(function(){
  function actualizarResumenes(ingresos){
    const total = ingresos.reduce((acc,i)=> acc + parseFloat(i.monto||0),0);
    const categorias={}; ingresos.forEach(i=>{ const c=i.categoria||'Sin categoría'; categorias[c]=(categorias[c]||0)+parseFloat(i.monto||0); });
    const categoriaPrincipal = Object.keys(categorias).reduce((a,b)=> categorias[a]>categorias[b]? a: b, 'Sin datos');
    const hoy=new Date(); const hace3=new Date(hoy.getFullYear(), hoy.getMonth()-3, 1);
    const recientes=ingresos.filter(i=>{ const f=new Date(i.fecha); return f>=hace3; });
    const totalRecientes=recientes.reduce((acc,i)=> acc + parseFloat(i.monto||0),0); const promedio= totalRecientes/3;
    const tE=document.querySelector('.total-amount'); const cE=document.querySelector('.ingreso-principal'); const pE=document.querySelector('.promedio-amount'); const cnt=document.querySelector('.total-count');
    if(tE) tE.textContent='$'+window.ingresosMessages.formatearMonto(total);
    if(cE) cE.textContent=categoriaPrincipal;
    if(pE) pE.textContent='$'+window.ingresosMessages.formatearMonto(promedio);
    if(cnt) cnt.textContent=ingresos.length;
  }
  window.ingresosSummary = { actualizarResumenes };
})();