// Lógica del formulario de cuenta bancaria

function initFormularioCuenta() {
    // Elementos del formulario
    const modal = document.getElementById('modalAgregarCuenta');
    const form = document.getElementById('formAgregarCuenta');
    const step1 = document.getElementById('cuentaStep1');
    const step2 = document.getElementById('cuentaStep2');
    const nextStepBtn = modal.querySelector('.next-step-btn');
    const prevStepBtn = modal.querySelector('.prev-step-btn');
    const checkPrincipal = document.getElementById('cuentaPrincipal');
    const cancelarBtn = document.getElementById('cancelarCuenta');
  
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
  
    // Cancelar y cerrar modal
    if (cancelarBtn) {
      cancelarBtn.addEventListener('click', function () {
        cerrarModalCuenta();
      });
    }
  
    // Cerrar modal con Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal && !modal.classList.contains('d-none')) {
        cerrarModalCuenta();
      }
    });
  
    // Cerrar modal al hacer clic fuera del contenido
    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          cerrarModalCuenta();
        }
      });
    }
  
    // Envío del formulario
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const datosCuenta = {
          nombre: document.getElementById('nombreCuenta').value,
          banco: document.getElementById('bancoCuenta').value,
          tipo: document.getElementById('tipoCuenta').value,
          numero: document.getElementById('numeroCuenta').value,
          moneda: document.getElementById('monedaCuenta').value,
          saldoInicial: parseFloat(document.getElementById('saldoInicial').value),
          descripcion: document.getElementById('descripcionCuenta').value,
          esPrincipal: checkPrincipal.checked
        };
  
        // Guardar en localStorage
        let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
        cuentas.push(datosCuenta);
        localStorage.setItem('cuentas', JSON.stringify(cuentas));
  
        // Mensaje de éxito (opcional)
        alert('¡Cuenta guardada exitosamente!');
        cerrarModalCuenta();
      });
    }
  
    // Función para cerrar y limpiar el modal
    function cerrarModalCuenta() {
      modal.classList.add('d-none');
      if (form) {
        form.reset();
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
      }
    }
  }
  