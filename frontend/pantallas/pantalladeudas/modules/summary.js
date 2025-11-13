(function(){
  function actualizarResumen(deudas){
    const total=deudas.reduce((acc,d)=> acc+parseFloat(d.monto||0),0);
    const pendiente=deudas.filter(d=>d.estado==='pendiente').reduce((s,d)=> s+parseFloat(d.monto||0),0);
    const pagadas=deudas.filter(d=>d.estado==='pagada').reduce((s,d)=> s+parseFloat(d.monto||0),0);
    const totalEl=document.getElementById('totalDeuda'); if(totalEl) totalEl.textContent='$'+window.deudasMessages.monto(total);
    const pendEl=document.getElementById('deudaPendiente'); if(pendEl) pendEl.textContent='$'+window.deudasMessages.monto(pendiente);
    const pagEl=document.getElementById('deudasPagadas'); if(pagEl) pagEl.textContent='$'+window.deudasMessages.monto(pagadas);
    const progressBar=document.getElementById('debtProgressBar'); const progressText=document.getElementById('debtProgressText');
    if(progressBar && progressText){ const pct= total>0? (pagadas/total)*100:0; progressBar.style.width=pct.toFixed(2)+'%'; progressBar.setAttribute('aria-valuenow',pct.toFixed(2)); progressText.textContent=pct.toFixed(2)+'% Pagado'; }
  }
  window.deudasSummary={ actualizarResumen };
})();
