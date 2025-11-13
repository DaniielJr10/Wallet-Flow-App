// Lógica del formulario de ahorro

// Inicializa el formulario de ahorro y sus eventos

function initFormularioAhorro(opciones = {}) {
  const { modo = 'crear', datos = null, indice = null, onSave = null } = opciones;

  // Elementos principales del formulario
  const modal = document.getElementById('modalAgregarAhorro');
  const form = document.getElementById('formAgregarAhorro');
  const cancelarBtn = document.getElementById('cancelarAhorro');
  const titulo = document.querySelector('#formAgregarAhorro h2');
  const btnGuardar = document.getElementById('guardarAhorro');

  // Mostrar modal
  if (modal) modal.classList.remove('d-none');

  // Ajustar textos según modo
  if (titulo) titulo.textContent = (modo === 'editar') ? 'Editar Ahorro' : 'Registrar Ahorro';
  if (btnGuardar) btnGuardar.textContent = (modo === 'editar') ? 'Guardar cambios' : 'Guardar ahorro';

  // Precargar campos si estamos editando
  if (modo === 'editar' && datos) {
    setValue('addCategoriaAhorro', datos.categoria || '');
    setValue('addMetodoAhorro', datos.metodo || '');
    setValue('addMontoAhorro', datos.monto !== undefined && datos.monto !== null ? String(datos.monto) : '');
    setValue('addFechaAhorro', datos.fecha || '');
    setValue('addDescripcionAhorro', datos.descripcion || '');
  }

  // Evento: cancelar y cerrar el modal
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', function () {
      cerrarModalAhorro();
    });
  }


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('d-none')) {
      cerrarModalAhorro();
    }
  });


  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        cerrarModalAhorro();
      }
    });
  }

 
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Recolecta los datos del formulario (tal cual del input)
      const datosFormulario = {
        categoria: getValue('addCategoriaAhorro'),
        metodo: getValue('addMetodoAhorro'),
        monto: getValue('addMontoAhorro'),
        fecha: getValue('addFechaAhorro'),
        descripcion: getValue('addDescripcionAhorro')
      };

      let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
      if (modo === 'editar' && indice !== null && indice >= 0 && indice < ahorros.length) {
        ahorros[indice] = { ...ahorros[indice], ...datosFormulario };
      } else {
        ahorros.push(datosFormulario);
      }
      localStorage.setItem('ahorros', JSON.stringify(ahorros));

      // Cerrar modal y limpiar
      cerrarModalAhorro();
      if (typeof onSave === 'function') onSave();
      
      try { alert(modo === 'editar' ? '¡Ahorro actualizado!' : '¡Ahorro guardado exitosamente!'); } catch (_) {}
    }, { once: true });
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  // Función para cerrar y limpiar el modal de ahorro
  function cerrarModalAhorro() {
    if (modal) modal.classList.add('d-none');
    if (form) form.reset();
  }

  // Exponer cierre si se necesita desde fuera
  if (typeof window !== 'undefined') {
    window.cerrarModalAhorro = cerrarModalAhorro;
  }
}

// Exponer init globalmente
if (typeof window !== 'undefined') {
  window.initFormularioAhorro = initFormularioAhorro;
}
