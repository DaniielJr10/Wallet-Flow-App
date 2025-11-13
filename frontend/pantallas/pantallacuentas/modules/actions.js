(function(){ function initAcciones(){ const add=document.getElementById('btnAgregarCuentaPage'); if(add) add.addEventListener('click',e=>{ e.preventDefault(); window.cuentasForm.abrirModalAgregar(); }); window.addEventListener('cuenta:guardada', async ()=>{ await window.cuentasService.cargarCuentas(); }); }
  window.cuentasActions={ initAcciones };
})();
