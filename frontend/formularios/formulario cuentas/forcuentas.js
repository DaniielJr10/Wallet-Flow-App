// Inicializar el formulario de cuentas
function initFormularioCuenta() {

  const modal = document.getElementById('modalAgregarCuenta');
  const form = document.getElementById('formAgregarCuenta');
  const cancelarBtn = document.getElementById('cancelarCuenta');

 
  function mostrarModal() {
    modal.classList.remove('d-none'); // Mostrar el modal
  }

  // Cerrar y limpiar el modal
  function cerrarModal() {
    modal.classList.add('d-none'); // Ocultar el modal
    form.reset(); // Limpiar los campos del formulario
  }

 
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', cerrarModal);
  }


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.classList.contains('d-none')) {
      cerrarModal();
    }
  });


  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      cerrarModal();
    }
  });

  // Evento para manejar el envío del formulario
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener los datos del formulario
      const datosCuenta = {
        nombre: document.getElementById('nombreCuenta').value,
        tipo: document.getElementById('tipoCuenta').value,
        numero: document.getElementById('numeroCuenta').value,
        saldoInicial: parseFloat(document.getElementById('saldoInicial').value),
        esPrincipal: document.getElementById('cuentaPrincipal').checked
      };

     
      let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
      cuentas.push(datosCuenta);
      localStorage.setItem('cuentas', JSON.stringify(cuentas));

      // Mostrar mensaje de éxito
      alert('¡Cuenta guardada exitosamente!');

      // Cerrar y limpiar el modal
      cerrarModal();
      // Notificar a la página que se guardó una cuenta para permitir refrescar listas
      try {
        window.dispatchEvent(new CustomEvent('cuenta:guardada', { detail: datosCuenta }));
      } catch (e) {
        console.warn('No se pudo despachar el evento cuenta:guardada', e);
      }
    });
  }
}

// Inicializar el formulario al cargar la página
document.addEventListener('DOMContentLoaded', initFormularioCuenta);