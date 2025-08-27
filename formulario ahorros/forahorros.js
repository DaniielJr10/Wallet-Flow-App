// =============================
// Lógica del formulario de ahorro avanzado
// =============================

// Inicializa el formulario de ahorro y sus eventos
function initFormularioAhorro() {
  // Elementos principales del formulario
  const modal = document.getElementById('modalAgregarAhorro');
  const form = document.getElementById('formAgregarAhorro');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const nextStepBtn = document.querySelector('.next-step-btn');
  const prevStepBtn = document.querySelector('.prev-step-btn');
  const checkRecurrente = document.getElementById('addCheckRecurrenteAhorro');
  const frecuenciaOptions = document.getElementById('addFrecuenciaOptionsAhorro');
  const checkCuenta = document.getElementById('addCheckCuentaAhorro');
  const cuentaOptions = document.getElementById('addCuentaAsociadaOptionsAhorro');
  const cancelarBtn = document.getElementById('cancelarAhorro');

  // Evento: pasar al siguiente paso del formulario
  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  // Evento: regresar al paso anterior
  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', function () {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  // Evento: mostrar/ocultar opciones de frecuencia si es recurrente
  if (checkRecurrente) {
    checkRecurrente.addEventListener('change', function () {
      frecuenciaOptions.classList.toggle('visible', checkRecurrente.checked);
    });
  }

  // Evento: mostrar/ocultar opciones de cuenta asociada
  if (checkCuenta) {
    checkCuenta.addEventListener('change', function () {
      cuentaOptions.classList.toggle('visible', checkCuenta.checked);
    });
  }

  // Evento: cancelar y cerrar el modal
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', function () {
      cerrarModalAhorro();
    });
  }

  // Evento: cerrar modal con la tecla Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('d-none')) {
      cerrarModalAhorro();
    }
  });

  // Evento: cerrar modal al hacer clic fuera del contenido
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        cerrarModalAhorro();
      }
    });
  }

  // Evento: envío del formulario y guardado en localStorage
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Recolecta los datos del formulario
      const datos = {
        categoria: document.getElementById('addCategoriaAhorro').value,
        metodo: document.getElementById('addMetodoAhorro').value,
        monto: document.getElementById('addMontoAhorro').value,
        fecha: document.getElementById('addFechaAhorro').value,
        descripcion: document.getElementById('addDescripcionAhorro').value,
        esRecurrente: checkRecurrente.checked,
        frecuencia: document.getElementById('addFrecuenciaAhorro').value,
        tieneCuenta: checkCuenta.checked,
        cuenta: document.getElementById('addCuentaAsociadaAhorro').value
      };
      // Guarda el ahorro en localStorage
      let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
      ahorros.push(datos);
      localStorage.setItem('ahorros', JSON.stringify(ahorros));
      // Mensaje de éxito
      alert('¡Ahorro guardado exitosamente!');
      cerrarModalAhorro();
    });
  }

  // Función para cerrar y limpiar el modal de ahorro
  function cerrarModalAhorro() {
    modal.classList.add('d-none');
    if (form) {
      form.reset();
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      frecuenciaOptions.classList.remove('visible');
      cuentaOptions.classList.remove('visible');
    }
  }
}
