/* =====================================================================
  PANTALLA DE GASTOS - WALLET FLOW
  Archivo: Gastos.js
  Responsabilidad: Manejo de la lógica de la vista de gastos (CRUD local,
  filtros simples, métricas y UI básica). Sin dependencias externas.
  Persistencia: localStorage clave 'gastos'
  ===================================================================== */

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
  inicializarApp();
});

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====
function inicializarApp() {
  // Render inicial de datos y métricas
  renderGastos();
  calcularResumen();
  // Configuración de listeners de UI
  configurarEventos();
  configurarFiltros();
  // (Gráficos removidos según requerimiento)
  inicializarTooltips();
}

// Inicializa tooltips Bootstrap (para botón +)
function inicializarTooltips(){
  if (typeof bootstrap === 'undefined') return; // Bootstrap no cargado
  const triggers = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  triggers.forEach(el => new bootstrap.Tooltip(el));
}

// ===== CONFIGURACIÓN DE EVENTOS =====
function configurarEventos() {
  // ===== Botones de creación =====
  const fab = document.getElementById('fabNuevoGasto');
  if (fab) fab.addEventListener('click', mostrarFormularioAgregar);
  // (Botones de encabezado removidos: exportar / nuevo gasto)
  
  // Evento para cerrar sesión
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (confirmar) {
        // Limpiar datos de sesión si es necesario
        localStorage.removeItem('usuarioActual');
        // Redirigir a la página de inicio de sesión
        window.location.href = '../inicio de sesion/inicio.html';
      }
    });
  }
}

// ===== CONFIGURACIÓN DE FILTROS =====
function configurarFiltros() {
  // Obtiene referencias a controles simplificados
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroMetodo = document.getElementById('filtroMetodo');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');
  const filtroTexto = document.getElementById('buscadorGlobal');
  const btnLimpiar = document.getElementById('btnLimpiarFiltros');

  [filtroCategoria, filtroMetodo, filtroFechaInicio, filtroFechaFin].forEach(filtro => {
    if (filtro) filtro.addEventListener('change', aplicarFiltros);
  });
  if (filtroTexto) filtroTexto.addEventListener('input', aplicarFiltros);
  if (btnLimpiar) btnLimpiar.addEventListener('click', () => {
    [filtroCategoria, filtroMetodo, filtroFechaInicio, filtroFechaFin, filtroTexto].forEach(el => { if (el) el.value = ''; });
    aplicarFiltros();
  });
}

// ===== FUNCIÓN PARA APLICAR FILTROS =====
function aplicarFiltros() {
  // Lee valores activos de filtros
  const categoria = document.getElementById('filtroCategoria').value;
  const metodo = document.getElementById('filtroMetodo').value;
  const fechaInicio = document.getElementById('filtroFechaInicio').value;
  const fechaFin = document.getElementById('filtroFechaFin').value;
  const texto = (document.getElementById('buscadorGlobal')?.value || '').trim().toLowerCase();

  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  // Aplicar filtros
  if (categoria) {
    gastos = gastos.filter(gasto => gasto.categoria === categoria);
  }
  if (metodo) {
    gastos = gastos.filter(gasto => gasto.metodo === metodo);
  }
  if (fechaInicio) {
    gastos = gastos.filter(gasto => gasto.fecha >= fechaInicio);
  }
  if (fechaFin) {
    gastos = gastos.filter(gasto => gasto.fecha <= fechaFin);
  }
  if (texto) {
    gastos = gastos.filter(gasto => (gasto.descripcion || '').toLowerCase().includes(texto));
  }

  renderGastosFiltrados(gastos);
}

// ===== FUNCIÓN PARA RENDERIZAR GASTOS =====
function renderGastos() {
  // Pinta la tabla completa sin filtros y actualiza contador
  const tabla = document.getElementById('tablaGastos').querySelector('tbody');
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  tabla.innerHTML = '';
  
  const estadoTabla = document.getElementById('estadoTabla');
  if (estadoTabla) estadoTabla.textContent = gastos.length + ' registros';
  if (gastos.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-inbox me-2"></i>No hay gastos registrados
        </td>
      </tr>
    `;
    return;
  }
  
  gastos.forEach((gasto, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <span class="categoria-badge">${gasto.categoria}</span>
      </td>
      <td>
        <span class="metodo-pago">${gasto.metodo}</span>
      </td>
      <td>
        <span class="monto-destacado">$${formatearMonto(gasto.monto)}</span>
      </td>
      <td>
        <span class="fecha-formato">${formatearFecha(gasto.fecha)}</span>
      </td>
      <td>
        <span class="descripcion-texto">${gasto.descripcion || 'Sin descripción'}</span>
      </td>
      <td>
        <span class="badge ${gasto.esRecurrente ? 'badge-si' : 'badge-no'}">
          ${gasto.esRecurrente ? 'Sí' : 'No'}
        </span>
      </td>
      <td>
        <span class="frecuencia-texto">${gasto.frecuencia || '-'}</span>
      </td>
      <td>
        <span class="cuenta-texto">${gasto.cuenta || '-'}</span>
      </td>
      <td>
        <div class="botones-accion">
          <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${index}" title="Editar gasto">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}" title="Eliminar gasto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Configurar eventos de botones
  configurarEventosBotones();
}

// ===== FUNCIÓN PARA RENDERIZAR GASTOS FILTRADOS =====
function renderGastosFiltrados(gastosFiltrados) {
  // Pinta tabla usando un subconjunto filtrado
  const tabla = document.getElementById('tablaGastos').querySelector('tbody');
  tabla.innerHTML = '';
  
  const estadoTabla = document.getElementById('estadoTabla');
  if (estadoTabla) estadoTabla.textContent = gastosFiltrados.length + ' registros filtrados';
  if (gastosFiltrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-search me-2"></i>No se encontraron gastos con los filtros aplicados
        </td>
      </tr>
    `;
    return;
  }
  
  gastosFiltrados.forEach((gasto, index) => {
    // Encontrar el índice real del gasto en el array completo
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const indiceReal = gastos.findIndex(g => 
      g.categoria === gasto.categoria && 
      g.monto === gasto.monto && 
      g.fecha === gasto.fecha && 
      g.descripcion === gasto.descripcion
    );
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <span class="categoria-badge">${gasto.categoria}</span>
      </td>
      <td>
        <span class="metodo-pago">${gasto.metodo}</span>
      </td>
      <td>
        <span class="monto-destacado">$${formatearMonto(gasto.monto)}</span>
      </td>
      <td>
        <span class="fecha-formato">${formatearFecha(gasto.fecha)}</span>
      </td>
      <td>
        <span class="descripcion-texto">${gasto.descripcion || 'Sin descripción'}</span>
      </td>
      <td>
        <span class="badge ${gasto.esRecurrente ? 'badge-si' : 'badge-no'}">
          ${gasto.esRecurrente ? 'Sí' : 'No'}
        </span>
      </td>
      <td>
        <span class="frecuencia-texto">${gasto.frecuencia || '-'}</span>
      </td>
      <td>
        <span class="cuenta-texto">${gasto.cuenta || '-'}</span>
      </td>
      <td>
        <div class="botones-accion">
          <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${indiceReal}" title="Editar gasto">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${indiceReal}" title="Eliminar gasto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Configurar eventos de botones
  configurarEventosBotones();
}

// ===== CONFIGURACIÓN DE EVENTOS DE BOTONES =====
function configurarEventosBotones() {
  // Enlaza eventos dinámicos de cada fila (editar/eliminar)
  // Botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      eliminarGasto(idx);
    });
  });

  // Botones de editar
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      editarGasto(idx);
    });
  });
}

// ===== FUNCIÓN PARA ELIMINAR GASTO =====
function eliminarGasto(idx) {
  // Borra un gasto por índice y recalcula métricas
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este gasto?\n\nEsta acción no se puede deshacer.');
  if (confirmacion) {
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.splice(idx, 1);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    renderGastos();
    calcularResumen();
    mostrarMensaje('¡Gasto eliminado exitosamente!', 'success');
  }
}

// ===== FUNCIÓN PARA MOSTRAR FORMULARIO AGREGAR =====
function mostrarFormularioAgregar() {
  // Lanza formulario modal vacío para crear gasto
  const formHtml = crearFormularioHTML('Agregar Nuevo Gasto', {});
  mostrarModal(formHtml, guardarNuevoGasto);
}

// ===== FUNCIÓN PARA EDITAR GASTO =====
function editarGasto(idx) {
  // Abre formulario precargado para editar gasto existente
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  const gasto = gastos[idx];
  
  const formHtml = crearFormularioHTML('Editar Gasto', gasto);
  mostrarModal(formHtml, (formData) => actualizarGasto(idx, formData));
}

// ===== FUNCIÓN PARA CREAR HTML DEL FORMULARIO =====
function crearFormularioHTML(titulo, gasto) {
  // Genera markup del formulario (uso reutilizable agregar/editar)
  return `
    <form id="formGasto" class="form-gasto">
      <h5 class="form-titulo">
        <i class="bi bi-${titulo.includes('Agregar') ? 'plus-circle' : 'pencil-square'} me-2"></i>${titulo}
      </h5>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-tag me-2"></i>Categoría
          </label>
          <select class="form-select" name="categoria" required>
            <option value="">Seleccionar categoría...</option>
            <option value="Alimentación" ${gasto.categoria === 'Alimentación' ? 'selected' : ''}>Alimentación</option>
            <option value="Transporte" ${gasto.categoria === 'Transporte' ? 'selected' : ''}>Transporte</option>
            <option value="Entretenimiento" ${gasto.categoria === 'Entretenimiento' ? 'selected' : ''}>Entretenimiento</option>
            <option value="Servicios" ${gasto.categoria === 'Servicios' ? 'selected' : ''}>Servicios</option>
            <option value="Salud" ${gasto.categoria === 'Salud' ? 'selected' : ''}>Salud</option>
            <option value="Educación" ${gasto.categoria === 'Educación' ? 'selected' : ''}>Educación</option>
            <option value="Compras" ${gasto.categoria === 'Compras' ? 'selected' : ''}>Compras</option>
            <option value="Otros" ${gasto.categoria === 'Otros' ? 'selected' : ''}>Otros</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-credit-card me-2"></i>Método de Pago
          </label>
          <select class="form-select" name="metodo" required>
            <option value="">Seleccionar método...</option>
            <option value="Efectivo" ${gasto.metodo === 'Efectivo' ? 'selected' : ''}>Efectivo</option>
            <option value="Tarjeta de Débito" ${gasto.metodo === 'Tarjeta de Débito' ? 'selected' : ''}>Tarjeta de Débito</option>
            <option value="Tarjeta de Crédito" ${gasto.metodo === 'Tarjeta de Crédito' ? 'selected' : ''}>Tarjeta de Crédito</option>
            <option value="Transferencia" ${gasto.metodo === 'Transferencia' ? 'selected' : ''}>Transferencia</option>
          </select>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-currency-dollar me-2"></i>Monto
          </label>
          <input class="form-control" name="monto" type="number" min="0.01" step="0.01" 
                 value="${gasto.monto || ''}" placeholder="0.00" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-calendar me-2"></i>Fecha
          </label>
          <input class="form-control" name="fecha" type="date" 
                 value="${gasto.fecha || new Date().toISOString().split('T')[0]}" required>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">
          <i class="bi bi-file-text me-2"></i>Descripción
        </label>
        <textarea class="form-control" name="descripcion" rows="2" 
                  placeholder="Descripción del gasto">${gasto.descripcion || ''}</textarea>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-repeat me-2"></i>¿Es Recurrente?
          </label>
          <select class="form-select" name="esRecurrente">
            <option value="false" ${!gasto.esRecurrente ? 'selected' : ''}>No</option>
            <option value="true" ${gasto.esRecurrente ? 'selected' : ''}>Sí</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-clock me-2"></i>Frecuencia
          </label>
          <select class="form-select" name="frecuencia">
            <option value="">No aplica</option>
            <option value="Semanal" ${gasto.frecuencia === 'Semanal' ? 'selected' : ''}>Semanal</option>
            <option value="Quincenal" ${gasto.frecuencia === 'Quincenal' ? 'selected' : ''}>Quincenal</option>
            <option value="Mensual" ${gasto.frecuencia === 'Mensual' ? 'selected' : ''}>Mensual</option>
            <option value="Anual" ${gasto.frecuencia === 'Anual' ? 'selected' : ''}>Anual</option>
          </select>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">
          <i class="bi bi-bank me-2"></i>Cuenta Asociada
        </label>
        <input class="form-control" name="cuenta" value="${gasto.cuenta || ''}" 
               placeholder="Cuenta desde donde se realizó el gasto">
      </div>
      
      <div class="form-buttons">
        <button type="submit" class="btn btn-success">
          <i class="bi bi-check-circle me-2"></i>${titulo.includes('Agregar') ? 'Agregar Gasto' : 'Guardar Cambios'}
        </button>
        <button type="button" class="btn btn-secondary" id="cancelarForm">
          <i class="bi bi-x-circle me-2"></i>Cancelar
        </button>
      </div>
    </form>
  `;
}

// ===== FUNCIÓN PARA MOSTRAR MODAL =====
function mostrarModal(contenidoHTML, funcionGuardar) {
  // Crea contenedor modal simple (sin Bootstrap) e inserta contenido
  const modal = document.createElement('div');
  modal.id = 'modalGasto';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
    justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease;
  `;
  modal.innerHTML = contenidoHTML;
  document.body.appendChild(modal);

  // Evento para cancelar
  document.getElementById('cancelarForm').onclick = function () {
    cerrarModal(modal);
  };

  // Evento para guardar
  document.getElementById('formGasto').onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Validación
    if (!validarFormulario(formData)) {
      return;
    }
    
    funcionGuardar(formData);
    cerrarModal(modal);
  };

  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      cerrarModal(modal);
    }
  });
}

// ===== FUNCIÓN PARA CERRAR MODAL =====
function cerrarModal(modal) {
  // Animación y retirada del modal del DOM
  modal.style.animation = 'fadeOut 0.3s ease';
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 300);
}

// ===== FUNCIÓN PARA VALIDAR FORMULARIO =====
function validarFormulario(formData) {
  // Validaciones mínimas de campos obligatorios / valores coherentes
  const monto = parseFloat(formData.get('monto'));
  const categoria = formData.get('categoria');
  const metodo = formData.get('metodo');
  const fecha = formData.get('fecha');
  
  if (!categoria) {
    mostrarMensaje('Por favor selecciona una categoría', 'error');
    return false;
  }
  
  if (!metodo) {
    mostrarMensaje('Por favor selecciona un método de pago', 'error');
    return false;
  }
  
  if (monto <= 0) {
    mostrarMensaje('El monto debe ser mayor a 0', 'error');
    return false;
  }
  
  if (!fecha) {
    mostrarMensaje('Por favor selecciona una fecha', 'error');
    return false;
  }
  
  return true;
}

// ===== FUNCIÓN PARA GUARDAR NUEVO GASTO =====
function guardarNuevoGasto(formData) {
  // Inserta nuevo objeto gasto en localStorage
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  const nuevoGasto = {
    categoria: formData.get('categoria'),
    metodo: formData.get('metodo'),
    monto: parseFloat(formData.get('monto')),
    fecha: formData.get('fecha'),
    descripcion: formData.get('descripcion').trim(),
    esRecurrente: formData.get('esRecurrente') === 'true',
    frecuencia: formData.get('frecuencia'),
    cuenta: formData.get('cuenta').trim(),
    fechaCreacion: new Date().toISOString()
  };
  
  gastos.push(nuevoGasto);
  localStorage.setItem('gastos', JSON.stringify(gastos));
  
  renderGastos();
  calcularResumen();
  mostrarMensaje('¡Gasto agregado exitosamente!', 'success');
}

// ===== FUNCIÓN PARA ACTUALIZAR GASTO =====
function actualizarGasto(idx, formData) {
  // Sustituye datos de un gasto existente por índice
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  gastos[idx] = {
    ...gastos[idx],
    categoria: formData.get('categoria'),
    metodo: formData.get('metodo'),
    monto: parseFloat(formData.get('monto')),
    fecha: formData.get('fecha'),
    descripcion: formData.get('descripcion').trim(),
    esRecurrente: formData.get('esRecurrente') === 'true',
    frecuencia: formData.get('frecuencia'),
    cuenta: formData.get('cuenta').trim(),
    fechaModificacion: new Date().toISOString()
  };
  
  localStorage.setItem('gastos', JSON.stringify(gastos));
  
  renderGastos();
  calcularResumen();
  mostrarMensaje('¡Gasto actualizado exitosamente!', 'success');
}

// ===== FUNCIÓN PARA CALCULAR RESUMEN =====
function calcularResumen() {
  // Recalcula KPIs mostrados en tarjetas (total, categoría principal, etc.)
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  // Calcular total de gastos
  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
  const totalGastosEl = document.getElementById('totalGastos');
  if (totalGastosEl) totalGastosEl.textContent = `$${formatearMonto(totalGastos)}`;
  
  // Encontrar categoría principal
  const categorias = {};
  gastos.forEach(gasto => {
    categorias[gasto.categoria] = (categorias[gasto.categoria] || 0) + gasto.monto;
  });
  
  let categoriaPrincipal = '-';
  let mayorMonto = 0;
  for (const [categoria, monto] of Object.entries(categorias)) {
    if (monto > mayorMonto) {
      mayorMonto = monto;
      categoriaPrincipal = categoria;
    }
  }
  const catPrincipalEl = document.getElementById('categoriaPrincipal');
  if (catPrincipalEl) catPrincipalEl.textContent = categoriaPrincipal;
  const porcentajeCat = document.getElementById('porcentajeCategoria');
  if (porcentajeCat && mayorMonto>0 && totalGastos>0) porcentajeCat.textContent = ((mayorMonto/totalGastos)*100).toFixed(1)+"% del total";

  // Recurrentes
  const recurrentes = gastos.filter(g=>g.esRecurrente);
  const totalRecurrentes = recurrentes.reduce((acc,g)=>acc+g.monto,0);
  const totalRecurrentesEl = document.getElementById('totalRecurrentes');
  if (totalRecurrentesEl) totalRecurrentesEl.textContent = recurrentes.length;
  const porcentajeRecurrentes = document.getElementById('porcentajeRecurrentes');
  if (porcentajeRecurrentes && totalGastos>0) porcentajeRecurrentes.textContent = (totalRecurrentes/totalGastos*100).toFixed(1)+"% del monto";

  // (Promedio diario removido por requerimiento)
  
  // Comparación con mes anterior (simulada)
  const mesAnterior = Math.random() * totalGastos; // Simulación
  const diferencia = totalGastos - mesAnterior;
  const comparacionElement = document.getElementById('comparacion');
  if (comparacionElement){
    if (diferencia > 0) {
      comparacionElement.textContent = `+$${formatearMonto(Math.abs(diferencia))} vs mes anterior`;
      comparacionElement.classList.remove('text-success','text-muted');
      comparacionElement.classList.add('text-danger');
    } else if (diferencia < 0) {
      comparacionElement.textContent = `-$${formatearMonto(Math.abs(diferencia))} vs mes anterior`;
      comparacionElement.classList.remove('text-danger','text-muted');
      comparacionElement.classList.add('text-success');
    } else {
      comparacionElement.textContent = 'Sin cambios vs mes anterior';
      comparacionElement.classList.remove('text-danger','text-success');
      comparacionElement.classList.add('text-muted');
    }
  }
}

// ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
function mostrarMensaje(mensaje, tipo) {
  // Mensajes flotantes temporales (éxito / error)
  const alerta = document.createElement('div');
  alerta.className = `alerta-personalizada alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-contenido">
      <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
      ${mensaje}
    </div>
  `;
  
  // Estilos para la alerta
  const bgColor = tipo === 'success' ? 
    'linear-gradient(135deg, #27ae60, #229954)' : 
    'linear-gradient(135deg, #e74c3c, #c0392b)';
    
  alerta.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 11000;
    padding: 1rem 1.5rem; border-radius: 10px; color: white;
    font-weight: 500; animation: slideInRight 0.3s ease;
    background: ${bgColor};
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(alerta);
  
  setTimeout(() => {
    alerta.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(alerta)) {
        document.body.removeChild(alerta);
      }
    }, 300);
  }, 3000);
}

// ===== FUNCIONES AUXILIARES PARA FORMATO =====
function formatearMonto(monto) {
  // Devuelve monto con formato local (2 decimales)
  return parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatearFecha(fecha) {
  // Formatea fecha ISO (yyyy-mm-dd) a dd mes yyyy local
  const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
}

/* (Lógica de gráficos removida) */