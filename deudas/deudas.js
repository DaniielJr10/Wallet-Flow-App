// Variables globales
let deudas = [
    {
        id: 1,
        nombre: "Préstamo Personal",
        acreedor: "Banco BBVA",
        montoTotal: 10000000,
        montoPagado: 3550000,
        fechaInicio: "2024-03-12",
        fechaVencimiento: "2025-03-12",
        tasaInteres: 12,
        descripcion: "Préstamo Personal",
        estado: "pendiente"
    },
    {
        id: 2,
        nombre: "Tarjeta de Crédito",
        acreedor: "Banco Internacional",
        montoTotal: 2000000,
        montoPagado: 1400000,
        fechaInicio: "2024-01-15",
        fechaVencimiento: "2025-01-15",
        tasaInteres: 24,
        descripcion: "Tarjeta de Crédito",
        estado: "pendiente"
    }
];

let deudaEditandoId = null;
let deudaEliminandoId = null;

// Funciones principales
function inicializar() {
    cargarDeudas();
    configurarEventos();
}

function cargarDeudas() {
    const container = document.getElementById('deudasContainer');
    container.innerHTML = '';

    deudas.forEach(deuda => {
        const deudaElement = crearElementoDeuda(deuda);
        container.appendChild(deudaElement);
    });
}

function crearElementoDeuda(deuda) {
    const div = document.createElement('div');
    div.className = 'deuda-card';
    
    const montoRestante = deuda.montoTotal - deuda.montoPagado;
    
    div.innerHTML = `
        <div class="deuda-header">
            <div class="deuda-titulo">${deuda.nombre}</div>
            <div class="estado-badge ${deuda.estado}">${capitalizar(deuda.estado)}</div>
        </div>
        
        <div class="deuda-info">
            <div class="info-item">
                <span class="info-label">Total:</span>
                <span class="info-value">$${formatearNumero(deuda.montoTotal)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Pagado:</span>
                <span class="info-value">$${formatearNumero(deuda.montoPagado)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Restante:</span>
                <span class="info-value">$${formatearNumero(montoRestante)}</span>
            </div>
        </div>
        
        <div class="deuda-detalles">
            <div class="detalle-column">
                <div class="detalle-item">
                    <span class="detalle-label">Acreedor:</span>
                    <span class="detalle-value">${deuda.acreedor}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Inicio:</span>
                    <span class="detalle-value">${formatearFecha(deuda.fechaInicio)}</span>
                </div>
            </div>
            <div class="detalle-column">
                <div class="detalle-item">
                    <span class="detalle-label">Interés:</span>
                    <span class="detalle-value">${deuda.tasaInteres}%</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Vencimiento:</span>
                    <span class="detalle-value">${formatearFecha(deuda.fechaVencimiento)}</span>
                </div>
            </div>
        </div>
        
        <div class="deuda-acciones">
            <button class="btn-accion btn-registrar" onclick="abrirRegistrarPago(${deuda.id})">Registrar Pago</button>
            <button class="btn-accion btn-editar" onclick="abrirEditarDeuda(${deuda.id})">Editar</button>
            <button class="btn-accion btn-eliminar" onclick="abrirEliminarDeuda(${deuda.id})">Eliminar</button>
        </div>
    `;
    return div;
}

// Funciones de modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    limpiarFormularios();
}

function abrirRegistrarPago(deudaId) {
    deudaEditandoId = deudaId;
    const fechaHoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaPago').value = fechaHoy;
    abrirModal('modalRegistrarPago');
}

function abrirEditarDeuda(deudaId) {
    const deuda = deudas.find(d => d.id === deudaId);
    if (!deuda) return;

    deudaEditandoId = deudaId;
    
    document.getElementById('editNombreAcreedor').value = deuda.acreedor;
    document.getElementById('editMontoDeuda').value = deuda.montoTotal;
    document.getElementById('editFechaInicio').value = deuda.fechaInicio;
    document.getElementById('editFechaVencimiento').value = deuda.fechaVencimiento;
    document.getElementById('editMontoPagado').value = deuda.montoPagado;
    document.getElementById('editTasaInteres').value = deuda.tasaInteres;
    document.getElementById('editDescripcion').value = deuda.descripcion;
    document.getElementById('editEstadoDeuda').value = deuda.estado;
    
    abrirModal('modalEditarDeuda');
}

function abrirEliminarDeuda(deudaId) {
    deudaEliminandoId = deudaId;
    abrirModal('modalEliminar');
}

function confirmarEliminacion() {
    if (deudaEliminandoId) {
        deudas = deudas.filter(d => d.id !== deudaEliminandoId);
        cargarDeudas();
        cerrarModal('modalEliminar');
        deudaEliminandoId = null;
    }
}

// Configurar eventos de formularios
function configurarEventos() {
    // Formulario nueva deuda
    document.getElementById('formNuevaDeuda').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario('formNuevaDeuda')) {
            mostrarValidacion();
            return;
        }
        
        const nuevaDeuda = {
            id: Date.now(),
            nombre: document.getElementById('descripcion').value,
            acreedor: document.getElementById('nombreAcreedor').value,
            montoTotal: parseInt(document.getElementById('montoDeuda').value),
            montoPagado: parseInt(document.getElementById('montoPagado').value) || 0,
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaVencimiento: document.getElementById('fechaVencimiento').value,
            tasaInteres: parseFloat(document.getElementById('tasaInteres').value),
            descripcion: document.getElementById('descripcion').value,
            estado: document.getElementById('estadoDeuda').value
        };
        
        deudas.push(nuevaDeuda);
        cargarDeudas();
        cerrarModal('modalNuevaDeuda');
    });

    // Formulario editar deuda
    document.getElementById('formEditarDeuda').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario('formEditarDeuda')) {
            mostrarValidacion();
            return;
        }
        
        const deuda = deudas.find(d => d.id === deudaEditandoId);
        if (deuda) {
            deuda.nombre = document.getElementById('editDescripcion').value;
            deuda.acreedor = document.getElementById('editNombreAcreedor').value;
            deuda.montoTotal = parseInt(document.getElementById('editMontoDeuda').value);
            deuda.fechaInicio = document.getElementById('editFechaInicio').value;
            deuda.fechaVencimiento = document.getElementById('editFechaVencimiento').value;
            deuda.montoPagado = parseInt(document.getElementById('editMontoPagado').value);
            deuda.tasaInteres = parseFloat(document.getElementById('editTasaInteres').value);
            deuda.descripcion = document.getElementById('editDescripcion').value;
            deuda.estado = document.getElementById('editEstadoDeuda').value;
            
            cargarDeudas();
            cerrarModal('modalEditarDeuda');
        }
    });

    // Formulario registrar pago
    document.getElementById('formRegistrarPago').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario('formRegistrarPago')) {
            mostrarValidacion();
            return;
        }
        
        const montoPago = parseInt(document.getElementById('montoPago').value);
        const deuda = deudas.find(d => d.id === deudaEditandoId);
        
        if (deuda) {
            deuda.montoPagado += montoPago;
            
            // Actualizar estado si está completamente pagada
            if (deuda.montoPagado >= deuda.montoTotal) {
                deuda.estado = 'pagada';
                deuda.montoPagado = deuda.montoTotal; // No exceder el monto total
            }
            
            cargarDeudas();
            cerrarModal('modalRegistrarPago');
        }
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                limpiarFormularios();
            }
        });
    });
}

// Funciones de utilidad
function validarFormulario(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    for (let input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}

function mostrarValidacion() {
    abrirModal('modalValidacion');
    setTimeout(() => {
        cerrarModal('modalValidacion');
    }, 2000);
}

function limpiarFormularios() {
    document.getElementById('formNuevaDeuda').reset();
    document.getElementById('formEditarDeuda').reset();
    document.getElementById('formRegistrarPago').reset();
    deudaEditandoId = null;
}

function formatearNumero(numero) {
    return numero.toLocaleString('es-CO');
}

function formatearFecha(fecha) {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', inicializar);