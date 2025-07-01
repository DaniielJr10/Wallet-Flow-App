// Lógica del formulario de ingreso avanzado

function initFormularioIngreso() {
  // Elementos del formulario
  const modal = document.getElementById('modalAgregarIngreso');
  const form = document.getElementById('formAgregarIngreso');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const nextStepBtn = document.querySelector('.next-step-btn');
  const prevStepBtn = document.querySelector('.prev-step-btn');
  const checkRecurrente = document.getElementById('addCheckRecurrenteIngreso');
  const frecuenciaOptions = document.getElementById('addFrecuenciaOptionsIngreso');
  const checkCuenta = document.getElementById('addCheckCuentaIngreso');
  const cuentaOptions = document.getElementById('addCuentaAsociadaOptionsIngreso');
  const cancelarBtn = document.getElementById('cancelarIngreso');

  // Paso siguiente
  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }
  // Paso anterior
  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', function () {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }
  // Mostrar/ocultar frecuencia
  if (checkRecurrente) {
    checkRecurrente.addEventListener('change', function () {
      frecuenciaOptions.classList.toggle('visible', checkRecurrente.checked);
    });
  }
  // Mostrar/ocultar cuenta asociada
  if (checkCuenta) {
    checkCuenta.addEventListener('change', function () {
      cuentaOptions.classList.toggle('visible', checkCuenta.checked);
    });
  }
  // Cancelar y cerrar modal
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', function () {
      cerrarModalIngreso();
    });
  }
  // Cerrar modal con Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('d-none')) {
      cerrarModalIngreso();
    }
  });
  // Cerrar modal al hacer clic fuera del contenido
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        cerrarModalIngreso();
      }
    });
  }
  // Envío del formulario
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const datos = {
        categoria: document.getElementById('addCategoriaIngreso').value,
        metodo: document.getElementById('addMetodoIngreso').value,
        monto: document.getElementById('addMontoIngreso').value,
        fecha: document.getElementById('addFechaIngreso').value,
        descripcion: document.getElementById('addDescripcionIngreso').value,
        esRecurrente: checkRecurrente.checked,
        frecuencia: document.getElementById('addFrecuenciaIngreso').value,
        tieneCuenta: checkCuenta.checked,
        cuenta: document.getElementById('addCuentaAsociadaIngreso').value
      };
      console.log('Ingreso agregado:', datos);
      // Aquí puedes mostrar un mensaje de éxito si lo deseas
      cerrarModalIngreso();
    });
  }
  // Función para cerrar y limpiar el modal
  function cerrarModalIngreso() {
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
