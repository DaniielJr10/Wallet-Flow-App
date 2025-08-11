// Funcionalidad para cerrar sesión con confirmación
document.addEventListener('DOMContentLoaded', function () {
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Mostrar confirmación con alert
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmar) {
        // Si confirma, limpiar datos de sesión y redirigir
        localStorage.removeItem('walletflow_current_user');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Redirigir al inicio de sesión
        window.location.href = '../inicio de sesion/inicio.html';
      }
      // Si no confirma, no hace nada
    });
  }
});
