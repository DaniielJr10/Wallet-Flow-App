// Variables globales
let refreshCallback = null;

// Función de inicialización para el modal
function initFormularioObjetivo(callback) {
  refreshCallback = callback;
  
  // Establecer fecha actual como predeterminada
  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaCreacionField = document.getElementById('crearFechaCreacion');
  if (fechaCreacionField) {
    fechaCreacionField.value = fechaHoy;
  }
  
  // Configurar eventos
  configurarEventosFormulario();
  
  console.log('Formulario de objetivo inicializado');
}

function configurarEventosFormulario() {
  const form = document.getElementById('formCrear');
  if (form) {
    form.addEventListener('submit', manejarSubmitFormulario);
  }
}

function manejarSubmitFormulario(e) {
  e.preventDefault();
  
  const titulo = document.getElementById("crearTitulo").value.trim();
  const descripcion = document.getElementById("crearDescripcion").value.trim();
  const fechaCreacion = document.getElementById("crearFechaCreacion").value;
  const fechaLimite = document.getElementById("crearFechaLimite").value;
  const estado = document.getElementById("crearEstado").value;

  // Validar campos
  if (!titulo || !descripcion || !fechaCreacion || !fechaLimite || !estado) {
    mostrarNotificacion('Por favor completa todos los campos', 'warning');
    return;
  }

  // Deshabilitar botón temporalmente
  const submitBtn = document.querySelector('button[type="submit"][form="formCrear"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }

  // Crear el nuevo objetivo
  const nuevoObjetivo = {
    id: Date.now(),
    titulo: titulo,
    descripcion: descripcion,
    fechaCreacion: formatearFecha(fechaCreacion),
    fechaLimite: formatearFecha(fechaLimite),
    estado: estado,
    progreso: 0,
    fechaCreacionISO: fechaCreacion,
    fechaLimiteISO: fechaLimite,
    createdAt: new Date().toISOString()
  };

  try {
    // Guardar en localStorage
    let objetivos = JSON.parse(localStorage.getItem('objetivos') || '[]');
    objetivos.push(nuevoObjetivo);
    localStorage.setItem('objetivos', JSON.stringify(objetivos));

    // Mostrar notificación de éxito
    mostrarNotificacion('🎯 Objetivo creado exitosamente', 'success');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarObjetivo'));
    if (modal) {
      modal.hide();
    }
    
    // Limpiar formulario
    limpiarFormulario();
    
    // Ejecutar callback para refrescar la pantalla
    if (refreshCallback && typeof refreshCallback === 'function') {
      setTimeout(refreshCallback, 300);
    }
    
  } catch (error) {
    console.error('Error al guardar el objetivo:', error);
    mostrarNotificacion('Error al guardar el objetivo', 'danger');
  }
  
  // Rehabilitar botón
  if (submitBtn) {
    setTimeout(() => {
      submitBtn.disabled = false;
    }, 1000);
  }
}

function limpiarFormulario() {
  const campos = ['crearTitulo', 'crearDescripcion', 'crearFechaCreacion', 'crearFechaLimite', 'crearEstado'];
  
  campos.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.value = '';
    }
  });
  
  // Restablecer fecha actual
  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaCreacionField = document.getElementById('crearFechaCreacion');
  if (fechaCreacionField) {
    fechaCreacionField.value = fechaHoy;
  }
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const partes = fechaStr.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
  `;
  notification.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Función legacy para compatibilidad
function volverAtras() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarObjetivo'));
  if (modal) {
    modal.hide();
  }
}

// Exponer función globalmente para que pueda ser llamada desde principal.js
if (typeof window !== 'undefined') {
  window.initFormularioObjetivo = initFormularioObjetivo;
  window.eliminarDuplicadosObjetivos = eliminarDuplicados; // Para usar desde consola si es necesario
}