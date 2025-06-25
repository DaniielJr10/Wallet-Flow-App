// Datos iniciales
let deudas = [
    {id: 1, nombre: "Préstamo Personal", acreedor: "Banco BBVA", montoTotal: 10000000, montoPagado: 3550000, fechaInicio: "2024-03-12", fechaVencimiento: "2025-03-12", tasaInteres: 12, descripcion: "Préstamo Personal", estado: "pendiente"},
    {id: 2, nombre: "Tarjeta de Crédito", acreedor: "Banco Internacional", montoTotal: 2000000, montoPagado: 1400000, fechaInicio: "2024-01-15", fechaVencimiento: "2025-01-15", tasaInteres: 24, descripcion: "Tarjeta de Crédito", estado: "pendiente"}
];

let editandoId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarDeudas();
    
    // Evento para el botón Volver
    document.querySelector('.volver-btn').addEventListener('click', function() {
        // CAMBIA AQUÍ EL NOMBRE DEL ARCHIVO AL QUE QUIERES REDIRIGIR
        window.location.href = 'inicio.html'; // Cambia por tu archivo
    });
    
    // Eventos de formularios
    document.getElementById('formNuevaDeuda').onsubmit = (e) => {
        e.preventDefault();
        if (!validar('formNuevaDeuda')) return mostrarError('validacionNueva');
        
        deudas.push({
            id: Date.now(),
            nombre: document.getElementById('descripcion').value,
            acreedor: document.getElementById('nombreAcreedor').value,
            montoTotal: +document.getElementById('montoDeuda').value,
            montoPagado: +document.getElementById('montoPagado').value || 0,
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaVencimiento: document.getElementById('fechaVencimiento').value,
            tasaInteres: +document.getElementById('tasaInteres').value,
            descripcion: document.getElementById('descripcion').value,
            estado: document.getElementById('estadoDeuda').value
        });
        
        cargarDeudas();
        cerrarModal('modalNuevaDeuda');
    };
    
    document.getElementById('formEditarDeuda').onsubmit = (e) => {
        e.preventDefault();
        if (!validar('formEditarDeuda')) return mostrarError('validacionEditar');
        
        const deuda = deudas.find(d => d.id === editandoId);
        deuda.nombre = document.getElementById('editDescripcion').value;
        deuda.acreedor = document.getElementById('editNombreAcreedor').value;
        deuda.montoTotal = +document.getElementById('editMontoDeuda').value;
        deuda.montoPagado = +document.getElementById('editMontoPagado').value;
        deuda.fechaInicio = document.getElementById('editFechaInicio').value;
        deuda.fechaVencimiento = document.getElementById('editFechaVencimiento').value;
        deuda.tasaInteres = +document.getElementById('editTasaInteres').value;
        deuda.descripcion = document.getElementById('editDescripcion').value;
        deuda.estado = document.getElementById('editEstadoDeuda').value;
        
        cargarDeudas();
        cerrarModal('modalEditarDeuda');
    };
    
    document.getElementById('formRegistrarPago').onsubmit = (e) => {
        e.preventDefault();
        if (!validar('formRegistrarPago')) return mostrarError('validacionPago');
        
        const deuda = deudas.find(d => d.id === editandoId);
        deuda.montoPagado += +document.getElementById('montoPago').value;
        if (deuda.montoPagado >= deuda.montoTotal) {
            deuda.estado = 'pagada';
            deuda.montoPagado = deuda.montoTotal;
        }
        
        cargarDeudas();
        cerrarModal('modalRegistrarPago');
    };
});

function cargarDeudas() {
    document.getElementById('deudasContainer').innerHTML = deudas.map(d => `
        <div class="deuda-card">
            <div class="deuda-header">
                <div class="deuda-titulo">${d.nombre}</div>
                <div class="estado-badge ${d.estado}">${d.estado.charAt(0).toUpperCase() + d.estado.slice(1)}</div>
            </div>
            <div class="deuda-info">
                <div class="info-item"><span class="info-label">Total:</span><span class="info-value">$${d.montoTotal.toLocaleString()}</span></div>
                <div class="info-item"><span class="info-label">Pagado:</span><span class="info-value">$${d.montoPagado.toLocaleString()}</span></div>
                <div class="info-item"><span class="info-label">Restante:</span><span class="info-value">$${(d.montoTotal - d.montoPagado).toLocaleString()}</span></div>
            </div>
            <div class="deuda-detalles">
                <div class="detalle-column">
                    <div class="detalle-item"><span class="detalle-label">Acreedor:</span><span class="detalle-value">${d.acreedor}</span></div>
                    <div class="detalle-item"><span class="detalle-label">Inicio:</span><span class="detalle-value">${formatFecha(d.fechaInicio)}</span></div>
                </div>
                <div class="detalle-column">
                    <div class="detalle-item"><span class="detalle-label">Interés:</span><span class="detalle-value">${d.tasaInteres}%</span></div>
                    <div class="detalle-item"><span class="detalle-label">Vencimiento:</span><span class="detalle-value">${formatFecha(d.fechaVencimiento)}</span></div>
                </div>
            </div>
            <div class="deuda-acciones">
                <button class="btn-accion btn-registrar" onclick="abrirPago(${d.id})">Registrar Pago</button>
                <button class="btn-accion btn-editar" onclick="abrirEditar(${d.id})">Editar</button>
                <button class="btn-accion btn-eliminar" onclick="abrirEliminar(${d.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
    document.querySelectorAll('.validation-message').forEach(v => v.style.display = 'none');
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
    document.getElementById(id).querySelector('form').reset();
}

function abrirPago(id) {
    editandoId = id;
    document.getElementById('fechaPago').value = new Date().toISOString().split('T')[0];
    abrirModal('modalRegistrarPago');
}

function abrirEditar(id) {
    const d = deudas.find(deuda => deuda.id === id);
    editandoId = id;
    
    document.getElementById('editNombreAcreedor').value = d.acreedor;
    document.getElementById('editMontoDeuda').value = d.montoTotal;
    document.getElementById('editFechaInicio').value = d.fechaInicio;
    document.getElementById('editFechaVencimiento').value = d.fechaVencimiento;
    document.getElementById('editMontoPagado').value = d.montoPagado;
    document.getElementById('editTasaInteres').value = d.tasaInteres;
    document.getElementById('editDescripcion').value = d.descripcion;
    document.getElementById('editEstadoDeuda').value = d.estado;
    
    abrirModal('modalEditarDeuda');
}

function abrirEliminar(id) {
    editandoId = id;
    abrirModal('modalEliminar');
}

function confirmarEliminacion() {
    deudas = deudas.filter(d => d.id !== editandoId);
    cargarDeudas();
    cerrarModal('modalEliminar');
}

function validar(formId) {
    const inputs = document.getElementById(formId).querySelectorAll('[required]');
    return Array.from(inputs).every(input => input.value.trim());
}

function mostrarError(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

function formatFecha(fecha) {
    const [a, m, d] = fecha.split('-');
    return `${d}/${m}/${a}`;
}