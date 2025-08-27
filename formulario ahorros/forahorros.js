// =============================
// Lógica del formulario de ahorro avanzado
// =============================

// Inicializa el formulario de ahorro y sus eventos
function initFormularioAhorro() {
  // Elementos principales del formulario
  const modal = document.getElementById('modalAgregarAhorro');
  const form = document.getElementById('formAgregarAhorro');
  const cancelarBtn = document.getElementById('cancelarAhorro');

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
        descripcion: document.getElementById('addDescripcionAhorro').value
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
    }
  }
}
