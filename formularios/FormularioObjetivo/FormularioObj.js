// Variables globales
let refreshCallback = null;

// Función de inicialización para el modal
function initFormularioObjetivo(callback) {
  refreshCallback = callback;
  
  // Establecer fecha actual como predeterminada
  const fechaHoy = new Date().toISOString().split('T')[0];
  document.getElementById('crearFechaCreacion').value = fechaHoy;
  
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

  // Crear el nuevo objetivo
  const nuevoObjetivo = {
    id: Date.now(), // ID único basado en timestamp
    titulo: titulo,
    descripcion: descripcion,
    fechaCreacion: formatearFecha(fechaCreacion),
    fechaLimite: formatearFecha(fechaLimite),
    estado: estado,
    progreso: "0",
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
    
    // Ejecutar callback para refrescar la pantalla principal
    if (refreshCallback && typeof refreshCallback === 'function') {
      setTimeout(refreshCallback, 300);
    }
    
    console.log('Objetivo guardado:', nuevoObjetivo);
    
  } catch (error) {
    console.error('Error al guardar el objetivo:', error);
    mostrarNotificacion('Error al guardar el objetivo', 'danger');
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
  document.getElementById('crearFechaCreacion').value = fechaHoy;
  
  mostrarNotificacion('Formulario limpiado', 'info');
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const partes = fechaStr.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Función para mostrar notificaciones (debe existir en el contexto padre)
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Verificar si existe la función en el contexto padre
  if (window.parent && typeof window.parent.mostrarNotificacion === 'function') {
    window.parent.mostrarNotificacion(mensaje, tipo);
    return;
  }
  
  // Función de respaldo simple
  console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
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
}