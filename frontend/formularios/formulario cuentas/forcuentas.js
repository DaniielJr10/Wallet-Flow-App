// Inicializar el formulario de cuentas
function initFormularioCuenta(callbackRender) {
  // Elementos del formulario y modal
  const modal = document.getElementById('modalAgregarCuenta');
  const form = document.getElementById('formAgregarCuenta');
  const cancelarBtn = document.getElementById('cancelarCuenta');

  // Mostrar el modal (puedes llamar esta función cuando sea necesario)
  function mostrarModal() {
    modal.classList.remove('d-none'); // Mostrar el modal
  }

  // Cerrar y limpiar el modal
  function cerrarModal() {
    modal.classList.add('d-none'); // Ocultar el modal
    form.reset(); // Limpiar los campos del formulario
  }

  // Evento para cerrar el modal al hacer clic en "Cancelar"
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', cerrarModal);
  }

  // Evento para cerrar el modal al presionar la tecla Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.classList.contains('d-none')) {
      cerrarModal();
    }
  });

  // Evento para cerrar el modal al hacer clic fuera del contenido
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      cerrarModal();
    }
  });

  // Evento para manejar el envío del formulario
  if (form) {
    if (form.dataset.inited === '1') return;
    form.dataset.inited = '1';
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

      // Obtener los datos del formulario
      const datosCuenta = {
        nombre: document.getElementById('nombreCuenta').value,
        tipo: document.getElementById('tipoCuenta').value,
        numero: document.getElementById('numeroCuenta').value,
        saldo: parseFloat(document.getElementById('saldoInicial').value) || 0,
        esPrincipal: document.getElementById('cuentaPrincipal').checked,
        moneda: 'COP'
      };

      try{
        // Preferir service
        if(window.cuentasService && typeof window.cuentasService.agregarCuenta === 'function'){
          await window.cuentasService.agregarCuenta(datosCuenta);
        } else {
          // Encolar en pending_cuentas
          const key = 'pending_cuentas';
          const q = JSON.parse(localStorage.getItem(key)||'[]');
          datosCuenta.id = datosCuenta.id || ('local_'+Date.now());
          q.push(datosCuenta);
          localStorage.setItem(key, JSON.stringify(q));
          // Also persist to visible local list
          const visible = JSON.parse(localStorage.getItem('cuentas')||'[]'); visible.push(datosCuenta); localStorage.setItem('cuentas', JSON.stringify(visible));
        }

        // Cerrar y limpiar el modal
        cerrarModal();

        // Notificar otras pantallas (via callback o localStorage)
        if(typeof callbackRender === 'function'){
          try{ callbackRender(); }catch(_){ }
        } else {
          try{ localStorage.setItem('wallet_notify_cuentas', JSON.stringify({ts: Date.now()})); }catch(e){ console.warn('notify failed', e); }
        }

        // Mensaje visual
        try{ alert('¡Cuenta guardada exitosamente!'); }catch(_){ }
      }catch(e){ console.error('Error guardando cuenta en formulario', e); alert('Error al guardar cuenta'); }
    });
  }
}

// Inicializar el formulario al cargar la página
document.addEventListener('DOMContentLoaded', initFormularioCuenta);