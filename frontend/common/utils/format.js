(function(){
  function monto(value){
    return parseFloat(value||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function fecha(f){
    if(!f) return '-';
    try { return new Date(f+'T00:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}); } catch(e){ return f; }
  }
  function truncar(texto, limite){ if(!texto) return ''; return texto.length<=limite? texto: texto.substring(0,limite)+'...'; }
  window.wfUtils = window.wfUtils || {}; window.wfUtils.format = { monto, fecha, truncar };
})();