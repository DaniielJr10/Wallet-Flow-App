// Listeners y flujo principal
(function(){
  function bindToolOpeners(){
    document.querySelectorAll('.btn-open-tool[data-tool-target]').forEach(btn=>{
      btn.addEventListener('click', ()=> window.configModals.open(btn.getAttribute('data-tool-target')));
    });
  }
  function bindModalClosers(){
    document.querySelectorAll('.close-modal-btn[data-close], .tool-modal-footer [data-close]').forEach(btn=>{
      btn.addEventListener('click', ()=> window.configModals.close(btn.getAttribute('data-close')));
    });
  }
  function bindProfile(){
    const save = document.getElementById('btnSaveProfile');
    if(save) save.addEventListener('click', window.configProfile.saveProfile);
    const changePhoto = document.getElementById('btnChangePhoto');
    if(changePhoto) changePhoto.addEventListener('click', window.configProfile.changeProfilePhoto);
    const photoInput = document.getElementById('photoInput');
    if(photoInput) photoInput.addEventListener('change', window.configProfile.handlePhotoChange);
  }
  function bindNotifications(){
    const save = document.getElementById('btnSaveNotifications');
    if(save) save.addEventListener('click', window.configNotifications.saveNotifications);
  }
  function bindSecurity(){
    const changePwd = document.getElementById('btnChangePassword');
    if(changePwd) changePwd.addEventListener('click', window.configSecurity.changePassword);
    const deleteAccountBtn = document.getElementById('btnDeleteAccount');
    if(deleteAccountBtn) deleteAccountBtn.addEventListener('click', window.configSecurity.openDeleteModal);
    const confirmDelete = document.getElementById('btnConfirmDelete');
    if(confirmDelete) confirmDelete.addEventListener('click', window.configSecurity.confirmDeleteAccount);
    const cancelDelete = document.getElementById('btnCancelDelete');
    if(cancelDelete) cancelDelete.addEventListener('click', window.configSecurity.cancelDeleteAccount);
    const confirmInput = document.getElementById('confirmDeleteInput');
    if(confirmInput) confirmInput.addEventListener('input', window.configSecurity.validateDeleteInput);
    // Click fuera de modal de eliminación
    const deleteModal = document.getElementById('deleteAccountModal');
    if(deleteModal){ deleteModal.addEventListener('click', e=>{ if(e.target===deleteModal) window.configSecurity.cancelDeleteAccount(); }); }
  }
  function bindLogout(){
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if(cerrarSesionBtn){
      cerrarSesionBtn.addEventListener('click', e=>{
        e.preventDefault();
        if(!confirm('¿Estás seguro de que quieres cerrar sesión?')) return;
        localStorage.removeItem('walletflow_user_data');
        window.location.href='../../login/inicio de sesion/inicio.html';
      });
    }
  }
  function applyDeepLink(){
    const hash = window.location.hash.replace('#','');
    if(hash){ const valid = ['perfil','notificaciones','privacidad','acerca']; if(valid.includes(hash)) setTimeout(()=> window.configModals.open(hash),100); }
  }
  function attachCoreListeners(){
    bindToolOpeners();
    bindModalClosers();
    bindProfile();
    bindNotifications();
    bindSecurity();
    bindLogout();
    applyDeepLink();
  }
  window.configActions = { attachCoreListeners };
  // Re-bind after componentes dinámicos cargados
  document.addEventListener('config-components-loaded', attachCoreListeners);
})();
