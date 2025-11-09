// Funcionalidad para cerrar sesión con confirmación
document.addEventListener('DOMContentLoaded', function () {
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Mostrar confirmación con alert
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmar) {
        // Limpiar datos de usuario
        localStorage.removeItem('walletflow_user_data');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Cerrar sesión en Firebase si está disponible
        if (window.firebaseAuth) {
          window.firebaseAuth.cerrarSesion();
        }
        
        // Redirigir al inicio de sesión
        window.location.href = '../../login/inicio de sesion/inicio.html';
      }
    });
  }
});
