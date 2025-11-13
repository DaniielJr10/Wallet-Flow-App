// Seguridad y eliminación de cuenta
(function(){
  function changePassword(){
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(!currentPassword || !newPassword || !confirmPassword){ window.configMessages.showToast('Por favor, completa todos los campos','error'); return; }
    if(newPassword !== confirmPassword){ window.configMessages.showToast('Las contraseñas no coinciden','error'); return; }
    if(newPassword.length < 6){ window.configMessages.showToast('La contraseña debe tener al menos 6 caracteres','error'); return; }
    document.getElementById('currentPassword').value='';
    document.getElementById('newPassword').value='';
    document.getElementById('confirmPassword').value='';
    window.configMessages.showToast('✓ Contraseña actualizada exitosamente','success');
  }
  function validateDeleteInput(){
    const input = document.getElementById('confirmDeleteInput');
    const btn = document.getElementById('btnDeleteAccount');
    if(input && btn){ btn.disabled = input.value !== 'ELIMINAR'; }
  }
  function openDeleteModal(){ const m = document.getElementById('deleteAccountModal'); if(m) m.classList.add('active'); }
  function confirmDeleteAccount(){
    if(!confirm('⚠️ ADVERTENCIA FINAL ⚠️\n\nEsta acción es IRREVERSIBLE. Todos tus datos serán eliminados permanentemente.\n\n¿Estás absolutamente seguro?')) return;
    localStorage.clear();
    window.configMessages.showToast('Cuenta eliminada. Redirigiendo...','success');
    setTimeout(()=> window.location.href='../../login/inicio de sesion/inicio.html',2000);
  }
  function cancelDeleteAccount(){
    const m = document.getElementById('deleteAccountModal'); if(m) m.classList.remove('active');
    const input = document.getElementById('confirmDeleteInput'); if(input) input.value='';
  }
  window.configSecurity = { changePassword, validateDeleteInput, openDeleteModal, confirmDeleteAccount, cancelDeleteAccount };
})();
