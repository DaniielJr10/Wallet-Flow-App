// Perfil usuario (bienvenida y dropdown)
(function(){
  function configurarPerfilUsuario(){
    const str = localStorage.getItem('walletflow_user_data');
    if(!str) return;
    try {
      const data = JSON.parse(str);
      const nombreBienvenida = document.getElementById('nombreUsuario');
      if(nombreBienvenida){ nombreBienvenida.textContent = data.nombreCompleto || data.nombre || nombreBienvenida.textContent; }
      const nombrePerfil = document.getElementById('nombreUsuarioPerfil');
      if(nombrePerfil){ nombrePerfil.textContent = data.nombreCompleto || data.nombre || nombrePerfil.textContent; }
      const emailPerfil = document.getElementById('emailUsuarioPerfil');
      if(emailPerfil && data.email){ emailPerfil.textContent = data.email; }
    }catch(e){ console.log('Error perfil usuario', e); }
  }
  window.principalProfile = { configurarPerfilUsuario };
})();
