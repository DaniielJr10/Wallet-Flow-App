(function(){
  function initAcciones(){ const add=document.getElementById('btnAgregarObjetivoPage'); if(add) add.addEventListener('click', e=>{ e.preventDefault(); window.objetivosForm.abrirModalAgregar(); }); const params=new URLSearchParams(window.location.search); if(params.get('openForm')==='true') window.objetivosForm.abrirModalAgregar(); }
  window.objetivosActions={ initAcciones };
})();
