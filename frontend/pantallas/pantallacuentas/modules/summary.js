(function(){
  function actualizarResumen(cuentas){
    const total=cuentas.reduce((s,c)=> s+(parseFloat(c.saldo)||0),0);
    const principal= cuentas.find(c=> c.esPrincipal);
    const totalEl=document.getElementById('totalCuentasSaldo'); if(totalEl) totalEl.textContent='$'+window.cuentasMessages.monto(total);
    const principalEl=document.getElementById('cuentaPrincipalNombre'); if(principalEl) principalEl.textContent= principal? principal.nombre+' ($'+window.cuentasMessages.monto(principal.saldo||0)+')':'Sin principal';
    const conteoEl=document.getElementById('totalCuentasConteo'); if(conteoEl) conteoEl.textContent=cuentas.length;
  }
  window.cuentasSummary={ actualizarResumen };
})();
