(function(){
  function initAcciones(){ const addBtn=document.getElementById('btnAgregarDeudaPage'); if(addBtn) addBtn.addEventListener('click', e=>{ e.preventDefault(); window.deudasForm.abrirModalAgregar(); }); }
  window.deudasActions={ initAcciones };
})();
