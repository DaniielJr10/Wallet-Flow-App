// ===============================================
// SISTEMA DE GESTIÓN DE GASTOS - WALLET FLOW
// ===============================================
// Archivo: Gastos.js
// Propósito: Manejo completo de la funcionalidad de gastos
// Incluye: Renderizado, formateo, edición, eliminación y estadísticas
// Dependencias: Bootstrap 5, Bootstrap Icons, LocalStorage
// Autor: Equipo Wallet Flow
// Fecha: 2024
// ===============================================

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
// Ejecuta todas las funciones necesarias cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  // Función principal que inicializa el renderizado de gastos
  renderGastos();
  
  // Configurar el botón de cerrar sesión
  configurarCierreSesion();
  
  // Actualizar estadísticas al cargar la página
  actualizarEstadisticas();

  // ===== FUNCIÓN PRINCIPAL: RENDERIZADO DE GASTOS =====
  // Propósito: Mostrar todos los gastos almacenados en una tabla interactiva
  // Funcionalidades: Carga de datos, formateo, acciones (editar/eliminar)
  function renderGastos() {
    // Obtener referencia a la tabla donde se mostrarán los gastos
    const tabla = document.getElementById('tablaGastos').querySelector('tbody');
    
    // Cargar gastos desde LocalStorage o crear array vacío si no existen
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    
    // Limpiar contenido previo de la tabla
    tabla.innerHTML = '';
    
    // === MANEJO DE ESTADO VACÍO ===
    // Si no hay gastos registrados, mostrar mensaje informativo
    if (gastos.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-5">
            <div class="tabla-vacia">
              <i class="bi bi-receipt-cutoff text-muted" style="font-size: 4rem;"></i>
              <p class="text-muted mb-3" style="font-size: 1.2rem;">No hay gastos registrados</p>
              <p class="text-muted">Comienza agregando tu primer gasto para llevar control de tus finanzas</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }
    
    // === RENDERIZADO DE GASTOS ===
    // Iterar sobre cada gasto y crear una fila en la tabla
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
          <span class="monto-destacado text-danger">$${formatearMonto(gasto.monto)}</span>
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

    // ===== CONFIGURAR EVENTOS DE BOTONES =====
    // === CONFIGURACIÓN DE EVENTOS PARA BOTONES DE ACCIÓN ===
    
    // == Eventos para botones de eliminar ==
    // Configura confirmación y animación para la eliminación de gastos
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        
        // Confirmación de seguridad antes de eliminar
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este gasto?\n\nEsta acción no se puede deshacer.');
        
        if (confirmacion) {
          // == Animación de eliminación ==
          const fila = this.closest('tr');
          fila.style.transition = 'all 0.3s ease';
          fila.style.opacity = '0';
          fila.style.transform = 'translateX(-100px)';
          
          // Ejecutar eliminación después de la animación
          setTimeout(() => {
            gastos.splice(idx, 1);
            localStorage.setItem('gastos', JSON.stringify(gastos));
            renderGastos(); // Re-renderizar la tabla
            mostrarMensaje('¡Gasto eliminado exitosamente!', 'success');
            actualizarResumenGastos(); // Actualizar estadísticas
          }, 300);
        }
      });
    });

    // == Eventos para botones de editar ==
    // Configura la funcionalidad de edición de gastos
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        editarGasto(idx); // Llamar función de edición
      });
    });

    // Actualizar estadísticas después de renderizar la tabla
    actualizarResumenGastos();
  }

  // ===============================================
  // SECCIÓN: FUNCIONES AUXILIARES Y UTILIDADES
  // ===============================================
  
  // ===== FUNCIÓN: FORMATEO DE MONTOS =====
  // Propósito: Formatear números como moneda colombiana
  // Entrada: número (monto)
  // Salida: string formateado con separadores de miles y decimales
  function formatearMonto(monto) {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
  }

  // ===== FUNCIÓN: FORMATEO DE FECHAS =====
  // Propósito: Convertir fecha ISO a formato legible en español
  // Entrada: string de fecha (YYYY-MM-DD)
  // Salida: string formateado (DD/MM/YYYY)
  function formatearFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // ===== FUNCIÓN: SISTEMA DE MENSAJES =====
  // Propósito: Mostrar notificaciones al usuario
  // Parámetros: mensaje (texto), tipo (success, error, info)
  function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto cerrar después de 3 segundos
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 3000);
    
    // Cerrar al hacer clic en el botón
    alert.querySelector('.btn-close').addEventListener('click', () => {
      alert.remove();
    });
  }

  function actualizarResumenGastos() {
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    
    // Calcular totales
    const totalGastos = gastos.reduce((total, gasto) => total + parseFloat(gasto.monto), 0);
    const totalEstesMes = gastos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      const fechaActual = new Date();
      return fechaGasto.getMonth() === fechaActual.getMonth() && 
             fechaGasto.getFullYear() === fechaActual.getFullYear();
    }).reduce((total, gasto) => total + parseFloat(gasto.monto), 0);
    
    const gastosRecurrentes = gastos.filter(gasto => gasto.esRecurrente).length;
    const totalCategorias = [...new Set(gastos.map(gasto => gasto.categoria))].length;

    // Actualizar elementos del DOM
    const totalGastosElement = document.getElementById('totalGastos');
    const gastosMesElement = document.getElementById('gastosMes');
    const gastosRecurrentesElement = document.getElementById('gastosRecurrentes');
    const categoriasElement = document.getElementById('totalCategorias');

    if (totalGastosElement) totalGastosElement.textContent = `$${formatearMonto(totalGastos)}`;
    if (gastosMesElement) gastosMesElement.textContent = `$${formatearMonto(totalEstesMes)}`;
    if (gastosRecurrentesElement) gastosRecurrentesElement.textContent = gastosRecurrentes;
    if (categoriasElement) categoriasElement.textContent = totalCategorias;
  }

  function editarGasto(idx) {
    alert('Función de edición en desarrollo');
  }

  // ===== INICIALIZACIÓN =====
  
  // Actualizar resumen al cargar la página
  actualizarResumenGastos();
  
  // Configurar navegación activa
  const enlaceActual = document.querySelector('a[href*="Gastos.html"]');
  if (enlaceActual) {
    enlaceActual.classList.add('active');
  }
});

// ===== ESTILOS PARA BADGES Y ELEMENTOS =====
const estilosFormulario = `
  .badge-si {
    background: #27ae60;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  /* == Estilos para badges de respuesta negativa == */
  .badge-no {
    background: #95a5a6;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  /* == Estilos para badges de categoría == */
  .categoria-badge {
    background: #f8f9fa;
    color: #e74c3c;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-weight: 500;
    border: 1px solid rgba(231, 76, 60, 0.2);
  }
  
  /* == Estilos para método de pago == */
  .metodo-pago {
    color: #2c3e50;
    font-weight: 500;
  }
  
  /* == Estilos para monto destacado == */
  .monto-destacado {
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  /* == Estilos para formato de fecha == */
  .fecha-formato {
    color: #7f8c8d;
    font-family: monospace;
  }
  
  /* == Estilos para descripción == */
  .descripcion-texto {
    color: #2c3e50;
    font-style: italic;
  }
  
  /* == Estilos para texto informativo == */
  .frecuencia-texto, .cuenta-texto {
    color: #7f8c8d;
  }
  
  /* == Estilos para contenedor de botones == */
  .botones-accion {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
  }
`;

// ===== INYECCIÓN DE ESTILOS DINÁMICOS =====
// Crear e inyectar hoja de estilos en el documento
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosFormulario;
document.head.appendChild(styleSheet);

// ===============================================
// FIN DEL ARCHIVO GASTOS.JS
// ===============================================
// Este archivo contiene toda la lógica necesaria para:
// - Renderizar y mostrar gastos en tabla interactiva
// - Formatear montos y fechas correctamente
// - Manejar eliminación con confirmación y animaciones
// - Calcular y mostrar estadísticas financieras
// - Proporcionar sistema de mensajes para el usuario
// - Estilos dinámicos para elementos generados por JS
// 
// Mantenimiento: Todas las funciones están documentadas
// para facilitar futuras modificaciones y debugging
// ===============================================
document.head.appendChild(styleSheet);

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function configurarEventListeners() {
    // Botón cerrar sesión
    document.getElementById('cerrarSesionBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('walletflow_current_user');
            window.location.href = '../inicio de sesion/inicio.html';
        }
    });

    // Checkbox recurrente
    document.getElementById('recurrente')?.addEventListener('change', function() {
        const frecuenciaSelect = document.getElementById('frecuencia');
        frecuenciaSelect.disabled = !this.checked;
        if (!this.checked) {
            frecuenciaSelect.value = '';
        }
    });

    // Fecha por defecto
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }
}

// ===== FUNCIONES DE UTILIDAD =====
function formatearFecha(fecha) {
    if (!fecha) return '';
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}

function formatearMonto(monto) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(monto);
}

function obtenerIconoCategoria(categoria) {
    const iconos = {
        'Alimentación': '🍽️',
        'Transporte': '🚗',
        'Servicios': '🏠',
        'Entretenimiento': '🎮',
        'Salud': '💊',
        'Educación': '📚',
        'Ropa': '👕',
        'Otros': '📦'
    };
    return iconos[categoria] || '📦';
}

function obtenerIconoMetodo(metodo) {
    const iconos = {
        'Efectivo': '💵',
        'Tarjeta de Crédito': '💳',
        'Tarjeta de Débito': '💳',
        'Transferencia': '🏦'
    };
    return iconos[metodo] || '💳';
}

// ===== GESTIÓN CRUD DE GASTOS =====

// Agregar nuevo gasto desde el modal
function agregarGasto() {
    const form = document.getElementById('formAgregarGasto');
    
    if (!validarFormulario(form)) {
        return;
    }

    const datosGasto = {
        categoria: document.getElementById('categoria').value,
        metodo: document.getElementById('metodo').value,
        monto: parseFloat(document.getElementById('monto').value),
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion').value,
        esRecurrente: document.getElementById('recurrente').checked,
        frecuencia: document.getElementById('frecuencia').value,
        cuenta: document.getElementById('cuenta').value
    };

    crearGasto(datosGasto);
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarGasto'));
    modal.hide();
    form.reset();
    
    // Restablecer fecha actual
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('frecuencia').disabled = true;
}

// Crear nuevo gasto
function crearGasto(datosGasto) {
    const nuevoGasto = {
        id: Date.now(),
        categoria: datosGasto.categoria,
        metodo: datosGasto.metodo,
        monto: datosGasto.monto,
        fecha: datosGasto.fecha,
        descripcion: datosGasto.descripcion || '',
        esRecurrente: datosGasto.esRecurrente || false,
        frecuencia: datosGasto.frecuencia || '',
        cuenta: datosGasto.cuenta || '',
        fechaCreacion: new Date().toISOString()
    };
    
    gastos.push(nuevoGasto);
    guardarEnLocalStorage();
    mostrarGastos();
    actualizarResumen();
    
    // Mostrar notificación de éxito
    mostrarNotificacion('Gasto agregado exitosamente', 'success');
}

// Eliminar gasto
function eliminarGasto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
        gastos = gastos.filter(g => g.id !== id);
        guardarEnLocalStorage();
        mostrarGastos();
        actualizarResumen();
        mostrarNotificacion('Gasto eliminado exitosamente', 'success');
    }
}

// Editar gasto (funcionalidad básica)
function editarGasto(id) {
    const gasto = gastos.find(g => g.id === id);
    if (gasto) {
        // Llenar el modal con los datos del gasto
        document.getElementById('categoria').value = gasto.categoria;
        document.getElementById('metodo').value = gasto.metodo;
        document.getElementById('monto').value = gasto.monto;
        document.getElementById('fecha').value = gasto.fecha;
        document.getElementById('descripcion').value = gasto.descripcion;
        document.getElementById('recurrente').checked = gasto.esRecurrente;
        document.getElementById('frecuencia').value = gasto.frecuencia;
        document.getElementById('cuenta').value = gasto.cuenta;
        
        // Habilitar/deshabilitar frecuencia
        document.getElementById('frecuencia').disabled = !gasto.esRecurrente;
        
        gastoEnEdicion = id;
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalAgregarGasto'));
        modal.show();
        
        // Cambiar título del modal
        document.getElementById('modalAgregarGastoLabel').innerHTML = 
            '<i class="bi bi-pencil-square me-2"></i>Editar Gasto';
    }
}

// Actualizar gasto existente
function actualizarGasto(id, datosActualizados) {
    const index = gastos.findIndex(g => g.id === id);
    if (index !== -1) {
        gastos[index] = {
            ...gastos[index],
            categoria: datosActualizados.categoria,
            metodo: datosActualizados.metodo,
            monto: datosActualizados.monto,
            fecha: datosActualizados.fecha,
            descripcion: datosActualizados.descripcion || '',
            esRecurrente: datosActualizados.esRecurrente || false,
            frecuencia: datosActualizados.frecuencia || '',
            cuenta: datosActualizados.cuenta || '',
            fechaModificacion: new Date().toISOString()
        };
        
        guardarEnLocalStorage();
        mostrarGastos();
        actualizarResumen();
        mostrarNotificacion('Gasto actualizado exitosamente', 'success');
    }
}

// Eliminar gasto
function eliminarGasto(id) {
    const index = gastos.findIndex(g => g.id === id);
    if (index !== -1) {
        gastos.splice(index, 1);
        guardarEnLocalStorage();
        mostrarGastos();
        actualizarResumen();
        actualizarGrafico();
        
        mostrarNotificacion('Gasto eliminado exitosamente', 'success');
    }
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

// ===== FUNCIONES DE INTERFAZ =====

// Mostrar gastos en la tabla
function mostrarGastos() {
    const tbody = document.querySelector('#tablaGastos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (gastos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-muted);">
                    <i class="bi bi-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No hay gastos registrados. ¡Agrega tu primer gasto!
                </td>
            </tr>
        `;
        return;
    }
    
    gastos.forEach(gasto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="date-badge">${formatearFecha(gasto.fecha)}</span></td>
            <td>
                <div class="expense-info">
                    <span class="expense-title">${gasto.descripcion || 'Sin descripción'}</span>
                    <span class="expense-subtitle">ID: ${gasto.id}</span>
                </div>
            </td>
            <td><span class="category-badge ${gasto.categoria}">${obtenerIconoCategoria(gasto.categoria)} ${capitalizar(gasto.categoria)}</span></td>
            <td><span class="amount-cell">${formatearMonto(gasto.monto)}</span></td>
            <td><span class="method-badge">${obtenerIconoMetodo(gasto.metodo)} ${capitalizar(gasto.metodo.replace('_', ' '))}</span></td>
            <td><span class="recurring-badge ${gasto.esRecurrente ? 'yes' : 'no'}">${gasto.esRecurrente ? 'Sí' : 'No'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action edit" onclick="abrirModalEditar(${gasto.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action delete" onclick="confirmarEliminarGasto(${gasto.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    actualizarPaginacionInfo();
}

// Actualizar resumen de estadísticas
function actualizarResumen() {
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const promedioMensual = gastos.length > 0 ? totalGastos / gastos.length : 0;
    
    // Calcular mayor categoría
    const categorias = {};
    gastos.forEach(g => {
        categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
    });
    
    const mayorCategoria = Object.keys(categorias).reduce((a, b) => 
        categorias[a] > categorias[b] ? a : b, 'Ninguna'
    );
    
    // Actualizar elementos del DOM
    const totalElement = document.getElementById('totalGastos');
    const promedioElement = document.getElementById('promedioDiario');
    const mayorCategoriaElement = document.getElementById('mayorCategoria');
    
    if (totalElement) totalElement.textContent = formatearMonto(totalGastos);
    if (promedioElement) promedioElement.textContent = formatearMonto(promedioMensual);
    if (mayorCategoriaElement) mayorCategoriaElement.textContent = capitalizar(mayorCategoria);
}

// Actualizar gráfico
function actualizarGrafico() {
    const categorias = {};
    gastos.forEach(g => {
        categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
    });
    
    if (typeof grafico !== 'undefined') {
        grafico.data.labels = Object.keys(categorias).map(c => capitalizar(c));
        grafico.data.datasets[0].data = Object.values(categorias);
        grafico.update();
    }
}

// ===== FUNCIONES DEL MODAL =====

// Mostrar modal para agregar
function mostrarModalAgregar() {
    gastoEnEdicion = null;
    limpiarFormulario();
    document.querySelector('.modal-title h2').textContent = 'Nuevo Gasto';
    document.getElementById('modalEdicion').style.display = 'flex';
    document.getElementById('progress-step1').classList.add('active');
    document.getElementById('progress-step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('editFecha').value = fechaHoyISO();
}

// Abrir modal para editar
function abrirModalEditar(id) {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;
    
    gastoEnEdicion = id;
    document.querySelector('.modal-title h2').textContent = 'Editar Gasto';
    
    // Pre-llenar formulario con datos existentes
    document.getElementById('editCategoria').value = gasto.categoria;
    document.getElementById('editMetodo').value = gasto.metodo;
    document.getElementById('editMonto').value = gasto.monto;
    document.getElementById('editFecha').value = gasto.fecha;
    document.getElementById('editDescripcion').value = gasto.descripcion;
    
    // Configurar checkbox de gasto recurrente
    document.getElementById('checkRecurrente').checked = gasto.esRecurrente;
    if (gasto.esRecurrente) {
        document.getElementById('frecuencia').value = gasto.frecuencia;
        document.getElementById('frecuenciaOptions').style.display = 'block';
    }
    
    // Configurar checkbox de cuenta asociada
    document.getElementById('checkCuenta').checked = gasto.tieneCuenta;
    if (gasto.tieneCuenta) {
        document.getElementById('cuentaAsociada').value = gasto.cuenta;
        document.getElementById('cuentaAsociadaOptions').style.display = 'block';
    }
    
    // Mostrar modal
    document.getElementById('modalEdicion').style.display = 'flex';
    document.getElementById('progress-step1').classList.add('active');
    document.getElementById('progress-step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalEdicion').style.display = 'none';
    gastoEnEdicion = null;
    limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formEditar').reset();
    document.getElementById('frecuenciaOptions').style.display = 'none';
    document.getElementById('cuentaAsociadaOptions').style.display = 'none';
    document.getElementById('editFecha').value = fechaHoyISO();
}

// ===== FUNCIONES DE NAVEGACIÓN DEL MODAL =====
function siguientePaso() {
    // Validar paso 1
    const categoria = document.getElementById('editCategoria').value;
    const metodo = document.getElementById('editMetodo').value;
    const monto = document.getElementById('editMonto').value;
    const fecha = document.getElementById('editFecha').value;
    
    if (!categoria || !metodo || !monto || !fecha) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (parseFloat(monto) <= 0) {
        mostrarNotificacion('El monto debe ser mayor a 0', 'error');
        return;
    }
    
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('progress-step1').classList.remove('active');
    document.getElementById('progress-step2').classList.add('active');
}

function pasoAnterior() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('progress-step2').classList.remove('active');
    document.getElementById('progress-step1').classList.add('active');
}

// ===== FUNCIONES DE VALIDACIÓN Y ENVÍO =====
function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const datosGasto = {
        categoria: document.getElementById('editCategoria').value,
        metodo: document.getElementById('editMetodo').value,
        monto: document.getElementById('editMonto').value,
        fecha: document.getElementById('editFecha').value,
        descripcion: document.getElementById('editDescripcion').value,
        esRecurrente: document.getElementById('checkRecurrente').checked,
        frecuencia: document.getElementById('frecuencia').value,
        tieneCuenta: document.getElementById('checkCuenta').checked,
        cuenta: document.getElementById('cuentaAsociada').value
    };
    
    if (gastoEnEdicion) {
        actualizarGasto(gastoEnEdicion, datosGasto);
    } else {
        crearGasto(datosGasto);
    }
    
    cerrarModal();
}

// ===== FUNCIONES DE ELIMINACIÓN =====
function confirmarEliminarGasto(id) {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;
    
    if (confirm(`¿Estás seguro de eliminar el gasto "${gasto.descripcion || 'Sin descripción'}" por ${formatearMonto(gasto.monto)}?`)) {
        eliminarGasto(id);
    }
}

// ===== FUNCIONES DE TOGGLE =====
function toggleFrecuencia() {
    const checkbox = document.getElementById('checkRecurrente');
    const options = document.getElementById('frecuenciaOptions');
    if (checkbox.checked) {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
        document.getElementById('frecuencia').value = '';
    }
}

function toggleCuenta() {
    const checkbox = document.getElementById('checkCuenta');
    const options = document.getElementById('cuentaAsociadaOptions');
    if (checkbox.checked) {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
        document.getElementById('cuentaAsociada').value = '';
    }
}

// ===== FUNCIONES DE NOTIFICACIÓN =====
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${tipo === 'success' ? 'var(--success-color)' : tipo === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

// ===== FUNCIONES DE PAGINACIÓN =====
function actualizarPaginacionInfo() {
    const paginacionInfo = document.querySelector('.pagination-info');
    if (paginacionInfo) {
        paginacionInfo.textContent = `Mostrando 1-${gastos.length} de ${gastos.length} gastos`;
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Crear datos de ejemplo si no existen gastos
    if (gastos.length === 0) {
        const gastosEjemplo = [
            {
                id: Date.now() + 1,
                categoria: 'alimentacion',
                metodo: 'tarjeta_credito',
                monto: 45000,
                fecha: '2025-01-15',
                descripcion: 'Supermercado XYZ',
                esRecurrente: false,
                frecuencia: '',
                tieneCuenta: true,
                cuenta: 'bancolombia',
                fechaCreacion: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                categoria: 'transporte',
                metodo: 'efectivo',
                monto: 85000,
                fecha: '2025-01-14',
                descripcion: 'Gasolina',
                esRecurrente: true,
                frecuencia: 'semanal',
                tieneCuenta: false,
                cuenta: '',
                fechaCreacion: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                categoria: 'entretenimiento',
                metodo: 'tarjeta_debito',
                monto: 32900,
                fecha: '2025-01-13',
                descripcion: 'Netflix',
                esRecurrente: true,
                frecuencia: 'mensual',
                tieneCuenta: true,
                cuenta: 'davivienda',
                fechaCreacion: new Date().toISOString()
            }
        ];
        
        gastos = gastosEjemplo;
        guardarEnLocalStorage();
    }
    
    // Cargar gastos al inicio
    mostrarGastos();
    actualizarResumen();
    
    // Event listeners del formulario
    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', manejarEnvioFormulario);
    }
    
    // Event listeners para toggles
    const checkRecurrente = document.getElementById('checkRecurrente');
    const checkCuenta = document.getElementById('checkCuenta');
    
    if (checkRecurrente) {
        checkRecurrente.addEventListener('change', toggleFrecuencia);
    }
    
    if (checkCuenta) {
        checkCuenta.addEventListener('change', toggleCuenta);
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Cerrar modal al hacer click fuera
    const modalOverlay = document.getElementById('modalEdicion');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    }
});

// Agregar estilos para notificaciones
const styleSheet = document.createElement('style');
// ===== NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-' + tipo + ' alert-dismissible fade show position-fixed';
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = mensaje + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(function() {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, 3000);
}
