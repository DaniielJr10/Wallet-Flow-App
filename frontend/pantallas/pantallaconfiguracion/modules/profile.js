// Perfil de usuario
(function(){
  function loadUserProfile(){
    const str = localStorage.getItem('walletflow_user_data');
    if(!str) return; 
    try {
      const data = JSON.parse(str);
      const nameInput = document.getElementById('profileName');
      const emailInput = document.getElementById('profileEmail');
      const phoneInput = document.getElementById('profilePhone');
      if(nameInput && data.nombre) nameInput.value = data.nombre;
      if(emailInput && data.email) emailInput.value = data.email;
      if(phoneInput && data.telefono) phoneInput.value = data.telefono;
      if(data.profilePhoto){
        const photoElement = document.getElementById('profilePhotoDisplay');
        if(photoElement){ photoElement.innerHTML = `<img src="${data.profilePhoto}" alt="Foto de perfil">`; }
      }
    }catch(e){ console.log('Error al cargar usuario', e); }
  }
  function saveProfile(){
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    if(!name || !email){ window.configMessages.showToast('Por favor, completa el nombre y el correo','error'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){ window.configMessages.showToast('Por favor, ingresa un correo válido','error'); return; }
    let data = {}; const str = localStorage.getItem('walletflow_user_data');
    if(str){ try { data = JSON.parse(str); }catch(e){ console.log(e); } }
    data.nombre = name; data.email = email; data.telefono = phone;
    localStorage.setItem('walletflow_user_data', JSON.stringify(data));
    window.configMessages.showToast('✓ Perfil actualizado exitosamente','success');
    setTimeout(()=> window.configModals.close('perfil'),1500);
  }
  function changeProfilePhoto(){ document.getElementById('photoInput').click(); }
  function handlePhotoChange(ev){
    const file = ev.target.files[0]; if(!file) return;
    if(!file.type.startsWith('image/')){ window.configMessages.showToast('Selecciona una imagen válida','error'); return; }
    if(file.size > 2*1024*1024){ window.configMessages.showToast('La imagen es muy grande. Máximo 2MB','error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const photoData = e.target.result;
      const el = document.getElementById('profilePhotoDisplay');
      if(el) el.innerHTML = `<img src="${photoData}" alt="Foto de perfil">`;
      let data={}; const str = localStorage.getItem('walletflow_user_data'); if(str){ try{ data=JSON.parse(str);}catch(err){}}
      data.profilePhoto = photoData;
      localStorage.setItem('walletflow_user_data', JSON.stringify(data));
      window.configMessages.showToast('✓ Foto actualizada exitosamente','success');
    };
    reader.readAsDataURL(file);
  }
  window.configProfile = { loadUserProfile, saveProfile, changeProfilePhoto, handlePhotoChange };
})();
