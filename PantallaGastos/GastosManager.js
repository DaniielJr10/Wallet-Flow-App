// ===== GESTIÓN DE GASTOS - CRUD COMPLETO =====

// Variables globales
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let gastoEnEdicion = null;

// ===== FUNCIONES DE UTILIDAD =====
function formatearFecha(fecha) {
    if (!fecha) return '';
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}

function fechaHoyISO() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
}

function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
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
        alimentacion: '🍽️',
        transporte: '🚗',
        servicios: '🏠',
        entretenimiento: '🎮',
        salud: '💊',
        educacion: '📚',
        otros: '📦'
    };
    return iconos[categoria] || '📦';
}

function obtenerIconoMetodo(metodo) {
    const iconos = {
        efectivo: '💵',
        tarjeta_credito: '💳',
        tarjeta_debito: '💳',
        transferencia: '🏦'
    };
    return iconos[metodo] || '💳';
}

// ===== FUNCIONES CRUD =====

// Crear nuevo gasto
function crearGasto(datosGasto) {
    const nuevoGasto = {
        id: Date.now(),
        categoria: datosGasto.categoria,
        metodo: datosGasto.metodo,
        monto: parseFloat(datosGasto.monto),
        fecha: datosGasto.fecha,
        descripcion: datosGasto.descripcion || '',
        esRecurrente: datosGasto.esRecurrente || false,
        frecuencia: datosGasto.frecuencia || '',
        tieneCuenta: datosGasto.tieneCuenta || false,
        cuenta: datosGasto.cuenta || '',
        fechaCreacion: new Date().toISOString()
    };
    
    gastos.push(nuevoGasto);
    guardarEnLocalStorage();
    mostrarGastos();
    actualizarResumen();
    actualizarGrafico();
    
    // Mostrar notificación
    mostrarNotificacion('Gasto agregado exitosamente', 'success');
}

// Leer gastos (ya implementado en mostrarGastos)
function obtenerGastos() {
    return gastos;
}

// Actualizar gasto existente
function actualizarGasto(id, datosActualizados) {
    const index = gastos.findIndex(g => g.id === id);
    if (index !== -1) {
        gastos[index] = {
            ...gastos[index],
            categoria: datosActualizados.categoria,
            metodo: datosActualizados.metodo,
            monto: parseFloat(datosActualizados.monto),
            fecha: datosActualizados.fecha,
            descripcion: datosActualizados.descripcion || '',
            esRecurrente: datosActualizados.esRecurrente || false,
            frecuencia: datosActualizados.frecuencia || '',
            tieneCuenta: datosActualizados.tieneCuenta || false,
            cuenta: datosActualizados.cuenta || '',
            fechaModificacion: new Date().toISOString()
        };
        
        guardarEnLocalStorage();
        mostrarGastos();
        actualizarResumen();
        actualizarGrafico();
        
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
styleSheet.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }
`;
document.head.appendChild(styleSheet);
