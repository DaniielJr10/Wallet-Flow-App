// Inicializar el formulario de cuentas
function initFormularioCuenta() {
  // Elementos del formulario y modal
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
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

      // Obtener los datos del formulario
      const datosCuenta = {
        nombre: document.getElementById('nombreCuenta').value,
        tipo: document.getElementById('tipoCuenta').value,
        numero: document.getElementById('numeroCuenta').value,
        saldoInicial: parseFloat(document.getElementById('saldoInicial').value),
        esPrincipal: document.getElementById('cuentaPrincipal').checked
      };

      try {
        if (window.cuentasService && typeof window.cuentasService.agregarCuenta === 'function') {
          await window.cuentasService.agregarCuenta(datosCuenta);
        } else if (window.walletDB && typeof window.walletDB.addAccount === 'function') {
          await window.walletDB.addAccount(datosCuenta);
        } else {
          throw new Error('Servicio de cuentas no disponible');
        }

        // Cerrar y limpiar el modal
        cerrarModal();

        // Notificar otras pantallas (vía callback opcional)
        if (typeof callbackRender === 'function') {
          try { callbackRender(); } catch (_) {}
        }

        // Mensaje de éxito
        alert('¡Cuenta guardada exitosamente!');
      } catch (e) {
        console.error('Error guardando cuenta en formulario', e);
        alert('Error al guardar cuenta');
      }
    });
  }
}

// Inicializar el formulario al cargar la página
document.addEventListener('DOMContentLoaded', initFormularioCuenta);