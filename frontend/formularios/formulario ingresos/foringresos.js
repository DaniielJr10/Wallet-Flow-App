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

  if (!modal || !form) {
    return;
  }

  // Evita re-registrar eventos si el modal ya fue inicializado
  if (modal.dataset.initialized === 'true') {
    return;
  }
  modal.dataset.initialized = 'true';

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

  const handleEscape = function (event) {
    if (event.key === 'Escape' && !modal.classList.contains('d-none')) {
      cerrarModalIngreso();
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      cerrarModalIngreso();
    }
  });

  const handleSubmit = function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Formulario enviado'); // Debug
    
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
    
    console.log('Datos a guardar:', datos); // Debug
    
    // Guardar en localStorage
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    ingresos.push(datos);
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
    
    console.log('Ingreso guardado en localStorage'); // Debug
    
    // Cerrar modal inmediatamente
    cerrarModalIngreso();
    
    // Mostrar mensaje de éxito después de cerrar
    setTimeout(() => {
      mostrarMensajeExito();
    }, 100);
  };

  form.addEventListener('submit', handleSubmit);

  // Función para mostrar mensaje de éxito
  function mostrarMensajeExito() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-exito-ingreso';
    mensaje.innerHTML = `
      <div class="mensaje-icono">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="23" fill="#27ae60" stroke="#fff" stroke-width="2"/>
          <path d="M15 25 L22 32 L35 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>¡Ingreso Guardado!</h3>
      <p>Tu ingreso se ha registrado exitosamente</p>
    `;
    
    // Estilos inline para el mensaje
    mensaje.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 9999;
      text-align: center;
      animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    // Agregar animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes popIn {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      .mensaje-exito-ingreso h3 {
        color: #27ae60;
        margin: 15px 0 10px 0;
        font-size: 24px;
      }
      .mensaje-exito-ingreso p {
        color: #7f8c8d;
        margin: 0;
        font-size: 16px;
      }
      .mensaje-icono {
        display: inline-block;
        animation: checkmark 0.5s ease 0.2s;
      }
      @keyframes checkmark {
        0% {
          transform: scale(0) rotate(0deg);
        }
        50% {
          transform: scale(1.2) rotate(10deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
      mensaje.style.animation = 'popIn 0.3s reverse';
      setTimeout(() => {
        mensaje.remove();
        style.remove();
      }, 300);
    }, 1200);
  }

  // Función para cerrar y limpiar el modal
  function cerrarModalIngreso() {
    console.log('Cerrando modal...'); // Debug
    modal.classList.add('d-none');
    form.reset();
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    if (frecuenciaOptions) frecuenciaOptions.classList.remove('visible');
    if (cuentaOptions) cuentaOptions.classList.remove('visible');
    
    // Si hay una función renderIngresos global, llamarla para actualizar la tabla
    if (typeof renderIngresos === 'function') {
      renderIngresos();
    }
    console.log('Modal cerrado'); // Debug
  }
}