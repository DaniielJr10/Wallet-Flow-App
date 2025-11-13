(function(){
  function attachLogout(){
    const btn = document.getElementById('cerrarSesionBtn');
    if(!btn) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      if(!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;
      localStorage.removeItem('walletflow_user_data');
      localStorage.removeItem('walletflow_remembered_user');
      if(window.firebaseAuth && typeof window.firebaseAuth.cerrarSesion === 'function'){
        window.firebaseAuth.cerrarSesion();
      }
      window.location.href='../../login/inicio de sesion/inicio.html';
    });
  }

  window.herramientasActions = { attachLogout };
})();
