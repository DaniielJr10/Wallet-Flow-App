// Cierre de sesión
(function(){
  function cerrarSesion(){
    if(!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;
    document.body.style.opacity='0.7';
    document.body.style.transition='opacity 0.3s ease';
    setTimeout(()=>{
      localStorage.removeItem('walletflow_current_user');
      localStorage.removeItem('walletflow_remembered_user');
      window.location.href='../../login/inicio de sesion/inicio.html';
    },300);
  }
  window.principalLogout = { cerrarSesion };
})();
