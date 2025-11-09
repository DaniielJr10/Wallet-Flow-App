// Variables globales
let refreshCallback = null;
let editIndex = null; // null => modo crear; number => modo editar

// Función de inicialización para el modal
function initFormularioObjetivo(callback, objetivoAEditar = null, indexEdicion = null) {
  refreshCallback = callback;
  editIndex = (typeof indexEdicion === 'number') ? indexEdicion : null;
  
  // Establecer fecha actual como predeterminada
  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaCreacionField = document.getElementById('crearFechaCreacion');
  if (fechaCreacionField) {
    fechaCreacionField.value = fechaHoy;
  }
  
  // Configurar eventos
  configurarEventosFormulario();

  // Si hay objetivo para editar, precargar datos y ajustar UI
  if (objetivoAEditar) {
    precargarParaEdicion(objetivoAEditar);
  } else {
    ajustarUiModoCrear();
  }
  
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

  try {
    let objetivos = JSON.parse(localStorage.getItem('objetivos') || '[]');

    if (editIndex !== null) {
      // Actualizar objetivo existente
      const anterior = objetivos[editIndex];
      if (!anterior) throw new Error('Objetivo a editar no encontrado');
      const actualizado = {
        ...anterior,
        titulo,
        descripcion,
        fechaCreacion: formatearFecha(fechaCreacion),
        fechaLimite: formatearFecha(fechaLimite),
        estado,
        // Mantener progreso e ids si existen
        progreso: typeof anterior.progreso === 'number' ? anterior.progreso : 0,
        fechaCreacionISO: fechaCreacion,
        fechaLimiteISO: fechaLimite,
        updatedAt: new Date().toISOString()
      };
      objetivos[editIndex] = actualizado;
      localStorage.setItem('objetivos', JSON.stringify(objetivos));
      mostrarNotificacion('🖊️ Objetivo actualizado correctamente', 'success');
    } else {
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
      objetivos.push(nuevoObjetivo);
      localStorage.setItem('objetivos', JSON.stringify(objetivos));
      mostrarNotificacion('🎯 Objetivo creado exitosamente', 'success');
    }

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarObjetivo'));
    if (modal) {
      modal.hide();
    }
    
    // Limpiar formulario y restablecer modo
    limpiarFormulario();
    editIndex = null;
    
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

function desformatearFechaDDMMYYYYaISO(ddmmyyyy) {
  if (!ddmmyyyy) return '';
  const partes = ddmmyyyy.split('/');
  if (partes.length !== 3) return '';
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

function precargarParaEdicion(obj) {
  // Cambiar títulos y textos del modal
  const tituloModal = document.getElementById('modalAgregarObjetivoLabel');
  if (tituloModal) tituloModal.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Objetivo';
  const btnSubmit = document.querySelector('button[type="submit"][form="formCrear"]');
  if (btnSubmit) btnSubmit.innerHTML = '<i class="bi bi-check-circle me-1"></i>Guardar Cambios';

  // Precargar campos
  const titulo = document.getElementById('crearTitulo');
  const descripcion = document.getElementById('crearDescripcion');
  const fechaCreacion = document.getElementById('crearFechaCreacion');
  const fechaLimite = document.getElementById('crearFechaLimite');
  const estado = document.getElementById('crearEstado');

  if (titulo) titulo.value = obj.titulo || '';
  if (descripcion) descripcion.value = obj.descripcion || '';
  if (estado) estado.value = obj.estado || '';

  // Manejar fechas: preferir ISO guardado
  const fechaCreacionISO = obj.fechaCreacionISO || desformatearFechaDDMMYYYYaISO(obj.fechaCreacion);
  const fechaLimiteISO = obj.fechaLimiteISO || desformatearFechaDDMMYYYYaISO(obj.fechaLimite);
  if (fechaCreacion && fechaCreacionISO) fechaCreacion.value = fechaCreacionISO;
  if (fechaLimite && fechaLimiteISO) fechaLimite.value = fechaLimiteISO;
}

function ajustarUiModoCrear() {
  const tituloModal = document.getElementById('modalAgregarObjetivoLabel');
  if (tituloModal) tituloModal.innerHTML = '<i class="bi bi-bullseye me-2"></i>Crear Nuevo Objetivo';
  const btnSubmit = document.querySelector('button[type="submit"][form="formCrear"]');
  if (btnSubmit) btnSubmit.innerHTML = '<i class="bi bi-check-circle me-1"></i>Guardar Objetivo';
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
}