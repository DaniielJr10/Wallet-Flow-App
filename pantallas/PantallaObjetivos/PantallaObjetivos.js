let objetivoEditando = null;
let objetivos = [];

// Referencias a los modales
const modalEdicion = document.getElementById("modalEdicion");
const modalAgregar = document.getElementById("modalAgregar");

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarObjetivos();
    inicializarEventListeners();
    actualizarEstadisticas();
    configurarFiltrosBusqueda();
});

// Configurar event listeners
function inicializarEventListeners() {
    // Event listeners para los modales
    document.getElementById("formEditar").addEventListener("submit", guardarEdicion);
    document.getElementById("formAgregar").addEventListener("submit", agregarNuevoObjetivo);
    
    // Event listeners para filtros y búsqueda
    document.getElementById("searchInput").addEventListener("input", filtrarObjetivos);
    document.getElementById("sortSelect").addEventListener("change", ordenarObjetivos);
    
    // Event listeners para filtros de estado
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtrarPorEstado(this.dataset.filter);
        });
    });

    // Cerrar menús desplegables al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.objective-menu')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Funciones para el modal de edición
function cerrarModal() {
    modalEdicion.classList.remove('show');
    modalEdicion.style.display = "none";
    setTimeout(() => {
        modalEdicion.querySelector('.modal-container').classList.remove('animate__zoomIn');
    }, 300);
}

function mostrarModal() {
    modalEdicion.style.display = "flex";
    modalEdicion.classList.add('show');
    modalEdicion.querySelector('.modal-container').classList.add('animate__zoomIn');
}

// Funciones para el modal de agregar
function cerrarModalAgregar() {
    modalAgregar.classList.remove('show');
    modalAgregar.style.display = "none";
    setTimeout(() => {
        modalAgregar.querySelector('.modal-container').classList.remove('animate__zoomIn');
    }, 300);
}

function mostrarModalAgregar() {
    modalAgregar.style.display = "flex";
    modalAgregar.classList.add('show');
    modalAgregar.querySelector('.modal-container').classList.add('animate__zoomIn');
}

// Conversión de fechas
function convertirFecha(fechaStr) {
    if (!fechaStr || fechaStr === '') return '';
    const partes = fechaStr.split("/");
    if (partes.length !== 3) return fechaStr;
    const fecha = new Date(partes[2], partes[1] - 1, partes[0]);
    if (isNaN(fecha.getTime())) {
        console.error('Fecha inválida:', fechaStr);
        return '';
    }
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    const partes = fechaStr.split("-");
    if (partes.length !== 3) return fechaStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatearFechaParaMostrar(fechaStr) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Calcular tiempo restante
function calcularTiempoRestante(fechaLimite) {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite - hoy;
    
    if (diferencia <= 0) {
        return "Vencido";
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const años = Math.floor(dias / 365);
    const meses = Math.floor((dias % 365) / 30);
    const diasRestantes = dias % 30;
    
    if (años > 0) {
        return `${años} año${años !== 1 ? 's' : ''}${meses > 0 ? `, ${meses} mes${meses !== 1 ? 'es' : ''}` : ''} restantes`;
    } else if (meses > 0) {
        return `${meses} mes${meses !== 1 ? 'es' : ''}${diasRestantes > 0 ? `, ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}` : ''} restantes`;
    } else {
        return `${dias} día${dias !== 1 ? 's' : ''} restantes`;
    }
}

// Funciones principales
function actualizarProgreso(btn) {
    const card = btn.closest('.objective-card');
    const progressPercentage = card.querySelector('.progress-percentage');
    const progressFill = card.querySelector('.progress-fill');
    
    let porcentaje = parseInt(progressPercentage.textContent);
    
    if (porcentaje < 100) {
        porcentaje = Math.min(100, porcentaje + 5);
        progressPercentage.textContent = porcentaje + '%';
        progressFill.style.width = porcentaje + '%';
        
        // Efecto visual de actualización
        progressFill.classList.add('animate__pulse');
        setTimeout(() => {
            progressFill.classList.remove('animate__pulse');
        }, 1000);
        
        // Actualizar el estado si llega al 100%
        if (porcentaje >= 100) {
            const statusBadge = card.querySelector('.status-badge');
            statusBadge.textContent = 'Completado';
            statusBadge.className = 'status-badge status-completed';
            
            // Animación de celebración
            card.classList.add('animate__pulse');
            setTimeout(() => {
                card.classList.remove('animate__pulse');
            }, 1000);
            
            // Confetti effect simulation
            card.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
            setTimeout(() => {
                card.style.background = '';
            }, 3000);
            
            mostrarNotificacion('🎉 ¡Increíble! Has completado tu objetivo. ¡Felicitaciones por tu logro!', 'success');
        } else {
            mostrarNotificacion(`¡Excelente progreso! Ahora tienes un ${porcentaje}% completado`, 'success');
        }
        
        actualizarEstadisticas();
        guardarEnLocalStorage();
    } else {
        mostrarNotificacion('¡Este objetivo ya está completado al 100%! 🎯', 'info');
    }
}

function toggleMenu(btn) {
    const menu = btn.nextElementSibling;
    const isVisible = menu.classList.contains('show');
    
    // Cerrar todos los menús
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    
    // Mostrar este menú si estaba cerrado
    if (!isVisible) {
        menu.classList.add('show');
    }
}

function editarObjetivo(btn) {
    const card = btn.closest(".objective-card");
    objetivoEditando = card;
    
    const titulo = card.querySelector("h3").textContent;
    const descripcion = card.querySelector(".objective-description p").textContent;
    const fechaCreacion = card.querySelector(".date-item:first-child strong").textContent;
    const fechaLimite = card.querySelector(".date-item:last-child strong").textContent;
    const estado = card.querySelector(".status-badge").textContent;
    
    document.getElementById("editarTitulo").value = titulo;
    document.getElementById("editarDescripcion").value = descripcion;
    document.getElementById("editarFechaCreacion").value = convertirFecha(fechaCreacion);
    document.getElementById("editarFechaLimite").value = convertirFecha(fechaLimite);
    document.getElementById("editarEstado").value = estado;
    
    // Cerrar el menú desplegable
    btn.closest('.dropdown-menu').classList.remove('show');
    mostrarModal();
}

function eliminarObjetivo(btn) {
    if (confirm('¿Estás seguro de que deseas eliminar este objetivo? Esta acción no se puede deshacer.')) {
        const card = btn.closest('.objective-card');
        
        // Animación de salida
        card.classList.add('animate__fadeOut');
        setTimeout(() => {
            card.remove();
            actualizarEstadisticas();
            guardarEnLocalStorage();
            mostrarNotificacion('Objetivo eliminado exitosamente', 'success');
        }, 500);
    }
    
    // Cerrar el menú desplegable
    btn.closest('.dropdown-menu').classList.remove('show');
}

function limpiarFormulario() {
    const form = document.getElementById("formEditar");
    form.reset();
    
    // Agregar animación visual
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.transform = 'scale(0.95)';
        input.style.opacity = '0.5';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.opacity = '1';
        }, 200);
    });
    
    mostrarNotificacion("Formulario limpiado correctamente", 'info');
}

function limpiarFormularioAgregar() {
    const form = document.getElementById("formAgregar");
    form.reset();
    
    // Agregar animación visual
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.transform = 'scale(0.95)';
        input.style.opacity = '0.5';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.opacity = '1';
        }, 200);
    });
    
    mostrarNotificacion("Formulario limpiado correctamente", 'info');
}

// Guardar edición
function guardarEdicion(e) {
    e.preventDefault();
    
    if (!objetivoEditando) return;
    
    const nuevoTitulo = document.getElementById("editarTitulo").value;
    const nuevaDescripcion = document.getElementById("editarDescripcion").value;
    const nuevaCreacion = document.getElementById("editarFechaCreacion").value;
    const nuevaLimite = document.getElementById("editarFechaLimite").value;
    const nuevoEstado = document.getElementById("editarEstado").value;
    const nuevaPrioridad = document.getElementById("editarPrioridad").value;
    
    // Actualizar la tarjeta
    objetivoEditando.querySelector("h3").textContent = nuevoTitulo;
    objetivoEditando.querySelector(".objective-description p").textContent = nuevaDescripcion;
    objetivoEditando.querySelector(".date-item:first-child strong").textContent = formatearFechaParaMostrar(nuevaCreacion);
    objetivoEditando.querySelector(".date-item:last-child strong").textContent = formatearFechaParaMostrar(nuevaLimite);
    
    const statusBadge = objetivoEditando.querySelector(".status-badge");
    statusBadge.textContent = nuevoEstado;
    statusBadge.className = `status-badge status-${nuevoEstado.toLowerCase()}`;
    
    // Actualizar tiempo restante
    const timeRemaining = objetivoEditando.querySelector(".time-remaining span");
    timeRemaining.textContent = calcularTiempoRestante(nuevaLimite);
    
    // Actualizar prioridad
    const priorityIndicator = objetivoEditando.querySelector(".priority-indicator");
    priorityIndicator.className = `priority-indicator priority-${nuevaPrioridad}`;
    
    cerrarModal();
    actualizarEstadisticas();
    guardarEnLocalStorage();
    mostrarNotificacion('Objetivo actualizado exitosamente', 'success');
}

// Agregar nuevo objetivo
function agregarNuevoObjetivo(e) {
    e.preventDefault();
    
    const titulo = document.getElementById("nuevoTitulo").value;
    const descripcion = document.getElementById("nuevaDescripcion").value;
    const fechaLimite = document.getElementById("nuevaFechaLimite").value;
    const prioridad = document.getElementById("nuevaPrioridad").value;
    const monto = document.getElementById("nuevoMonto").value;
    const fechaCreacion = new Date().toISOString().split('T')[0];
    
    // Validar que la fecha límite no sea en el pasado
    if (new Date(fechaLimite) < new Date()) {
        mostrarNotificacion('La fecha objetivo no puede ser en el pasado', 'error');
        return;
    }
    
    const nuevoObjetivo = crearTarjetaObjetivo({
        titulo,
        descripcion,
        fechaCreacion: formatearFechaParaMostrar(fechaCreacion),
        fechaLimite: formatearFechaParaMostrar(fechaLimite),
        estado: 'Pendiente',
        progreso: 0,
        prioridad,
        monto: monto || null
    });
    
    const grid = document.getElementById("objectivesGrid");
    nuevoObjetivo.classList.add('animate__fadeInUp');
    grid.appendChild(nuevoObjetivo);
    
    cerrarModalAgregar();
    limpiarFormularioAgregar();
    actualizarEstadisticas();
    guardarEnLocalStorage();
    mostrarNotificacion(`¡Excelente! Tu objetivo "${titulo}" ha sido creado`, 'success');
}

// Crear tarjeta de objetivo
function crearTarjetaObjetivo(objetivo) {
    const card = document.createElement('div');
    card.className = 'objective-card animate__animated';
    
    card.innerHTML = `
        <div class="objective-header">
            <div class="objective-title">
                <h3>${objetivo.titulo}</h3>
                <span class="status-badge status-${objetivo.estado.toLowerCase()}">${objetivo.estado}</span>
            </div>
            <div class="objective-menu">
                <button class="menu-btn" onclick="toggleMenu(this)">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <div class="dropdown-menu">
                    <button onclick="editarObjetivo(this)"><i class="bi bi-pencil"></i> Editar</button>
                    <button onclick="actualizarProgreso(this)"><i class="bi bi-arrow-up"></i> Actualizar</button>
                    <button onclick="eliminarObjetivo(this)" class="delete"><i class="bi bi-trash"></i> Eliminar</button>
                </div>
            </div>
        </div>
        
        <div class="objective-description">
            <p>${objetivo.descripcion}</p>
        </div>

        <div class="objective-dates">
            <div class="date-item">
                <i class="bi bi-calendar-plus"></i>
                <span>Creado: <strong>${objetivo.fechaCreacion}</strong></span>
            </div>
            <div class="date-item">
                <i class="bi bi-calendar-event"></i>
                <span>Límite: <strong>${objetivo.fechaLimite}</strong></span>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-header">
                <span class="progress-label">Progreso</span>
                <span class="progress-percentage">${objetivo.progreso}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${objetivo.progreso}%"></div>
            </div>
            <div class="progress-actions">
                <button class="btn-progress-update" onclick="actualizarProgreso(this)">
                    <i class="bi bi-plus-circle"></i>
                    +5%
                </button>
            </div>
        </div>

        <div class="objective-footer">
            <div class="time-remaining">
                <i class="bi bi-hourglass-split"></i>
                <span>${calcularTiempoRestante(convertirFecha(objetivo.fechaLimite))}</span>
            </div>
            <div class="priority-indicator priority-${objetivo.prioridad || 'medium'}">
                <i class="bi bi-flag-fill"></i>
            </div>
        </div>
    `;
    
    return card;
}

// Cargar objetivos del localStorage
function cargarObjetivos() {
    const objetivosGuardados = JSON.parse(localStorage.getItem('objetivos') || '[]');
    const grid = document.getElementById("objectivesGrid");
    
    // Limpiar objetivos existentes (excepto el de ejemplo si no hay guardados)
    if (objetivosGuardados.length > 0) {
        grid.innerHTML = '';
    }
    
    objetivosGuardados.forEach(objetivo => {
        const card = crearTarjetaObjetivo(objetivo);
        grid.appendChild(card);
    });
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    const cards = document.querySelectorAll('.objective-card');
    const objetivos = Array.from(cards).map(card => ({
        titulo: card.querySelector('h3').textContent,
        descripcion: card.querySelector('.objective-description p').textContent,
        fechaCreacion: card.querySelector('.date-item:first-child strong').textContent,
        fechaLimite: card.querySelector('.date-item:last-child strong').textContent,
        estado: card.querySelector('.status-badge').textContent,
        progreso: parseInt(card.querySelector('.progress-percentage').textContent),
        prioridad: card.querySelector('.priority-indicator').className.split(' ').pop().replace('priority-', '')
    }));
    
    localStorage.setItem('objetivos', JSON.stringify(objetivos));
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const cards = document.querySelectorAll('.objective-card');
    const total = cards.length;
    let completados = 0;
    let progreso = 0;
    
    cards.forEach(card => {
        const estado = card.querySelector('.status-badge').textContent;
        const porcentajeProgreso = parseInt(card.querySelector('.progress-percentage').textContent);
        
        if (estado === 'Completado') {
            completados++;
        }
        progreso += porcentajeProgreso;
    });
    
    const promedioProgreso = total > 0 ? Math.round(progreso / total) : 0;
    const pendientes = total - completados;
    
    document.getElementById('completedCount').textContent = completados;
    document.getElementById('pendingCount').textContent = pendientes;
    document.getElementById('averageProgress').textContent = promedioProgreso + '%';
    document.getElementById('thisMonthGoals').textContent = total;
}

// Configurar filtros y búsqueda
function configurarFiltrosBusqueda() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    searchInput.addEventListener('input', filtrarObjetivos);
    sortSelect.addEventListener('change', ordenarObjetivos);
}

function filtrarObjetivos() {
    const termino = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.objective-card');
    
    cards.forEach(card => {
        const titulo = card.querySelector('h3').textContent.toLowerCase();
        const descripcion = card.querySelector('.objective-description p').textContent.toLowerCase();
        
        if (titulo.includes(termino) || descripcion.includes(termino)) {
            card.style.display = 'block';
            card.classList.add('animate__fadeIn');
        } else {
            card.style.display = 'none';
        }
    });
}

function filtrarPorEstado(estado) {
    const cards = document.querySelectorAll('.objective-card');
    
    cards.forEach(card => {
        const estadoCard = card.querySelector('.status-badge').textContent.toLowerCase();
        
        if (estado === 'all' || 
            (estado === 'pending' && estadoCard === 'pendiente') ||
            (estado === 'completed' && estadoCard === 'completado')) {
            card.style.display = 'block';
            card.classList.add('animate__fadeIn');
        } else {
            card.style.display = 'none';
        }
    });
}

function ordenarObjetivos() {
    const sortValue = document.getElementById('sortSelect').value;
    const grid = document.getElementById('objectivesGrid');
    const cards = Array.from(document.querySelectorAll('.objective-card'));
    
    cards.sort((a, b) => {
        switch (sortValue) {
            case 'name':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            case 'progress':
                return parseInt(b.querySelector('.progress-percentage').textContent) - 
                       parseInt(a.querySelector('.progress-percentage').textContent);
            case 'date':
            default:
                const fechaA = new Date(convertirFecha(a.querySelector('.date-item:last-child strong').textContent));
                const fechaB = new Date(convertirFecha(b.querySelector('.date-item:last-child strong').textContent));
                return fechaA - fechaB;
        }
    });
    
    // Reorganizar en el DOM
    cards.forEach(card => grid.appendChild(card));
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo} animate__animated animate__fadeInRight`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'x-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                max-width: 400px;
                border-left: 4px solid #3b82f6;
            }
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification-content { display: flex; align-items: center; gap: 8px; flex: 1; }
            .notification-close { 
                background: none; border: none; cursor: pointer; 
                color: #64748b; padding: 4px; border-radius: 4px;
            }
            .notification-close:hover { background: #f1f5f9; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}
