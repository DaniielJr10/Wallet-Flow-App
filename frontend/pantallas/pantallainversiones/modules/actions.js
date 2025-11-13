(function(){ function initAcciones(){ const add=document.getElementById('btnAgregarInversionPage'); if(add) add.addEventListener('click',()=> window.inversionesForm.abrirModalAgregar()); const params=new URLSearchParams(window.location.search); if(params.get('openForm')==='true') window.inversionesForm.abrirModalAgregar(); }
  window.inversionesActions={ initAcciones };
})();
