(function(){
  function abrirModalAgregar(){ const m=document.getElementById('modalAgregar'); if(m) m.style.display='flex'; }
  function cerrarAgregar(){ const m=document.getElementById('modalAgregar'); if(m) m.style.display='none'; }
  function abrirModalEditar(){ const m=document.getElementById('modalEdicion'); if(m) m.style.display='flex'; }
  function cerrarEditar(){ const m=document.getElementById('modalEdicion'); if(m) m.style.display='none'; }
  window.objetivosForm={ abrirModalAgregar,cerrarAgregar,abrirModalEditar,cerrarEditar };
})();
