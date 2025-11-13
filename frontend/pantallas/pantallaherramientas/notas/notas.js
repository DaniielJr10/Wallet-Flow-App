// Variables globales
let notas = [];
let notaActual = null;
let filtroActivo = 'todas';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que Firebase y módulos estén listos si existen
    try {
        if (window.walletDB) await window.walletDB.init();
        if (window.walletDBModulesReady) await window.walletDBModulesReady;
    } catch(e){ console.warn('Firebase init falló, usando localStorage', e); }
    cargarNotas();
    configurarEventListeners();
    actualizarVista();
});

// Configurar event listeners
function configurarEventListeners() {
    // Búsqueda
    const inputBuscar = document.getElementById('buscar-notas');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', function() {
            filtrarNotas();
        });
    }

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modalNota');
    if (modal) {
        modal.addEventListener('hidden.bs.modal', function() {
            limpiarFormulario();
        });
    }
}

// Cargar notas desde localStorage
async function cargarNotas() {
    // Intentar Firestore primero
    const authed = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
    const puedeCloud = !!(window.walletDB && window.walletDB.listNotes && authed);
    if (puedeCloud) {
        try {
            const datos = await window.walletDB.listNotes();
            // Normalizar estructura
            notas = datos.map(n => ({
                id: n.id,
                titulo: n.titulo || '',
                contenido: n.contenido || '',
                categoria: n.categoria || 'general',
                prioridad: n.prioridad || 'media',
                tags: Array.isArray(n.tags) ? n.tags : [],
                fechaCreacion: n.fechaCreacion || new Date().toISOString(),
                fechaModificacion: n.fechaModificacion || n.updatedAt || new Date().toISOString(),
                _cloud: true
            }));
            return;
        } catch(e) {
            console.warn('Fallo listNotes Firestore, usando localStorage', e);
        }
    }
    // Fallback localStorage
    const notasGuardadas = localStorage.getItem('wallet_flow_notas');
    if (notasGuardadas) {
        notas = JSON.parse(notasGuardadas);
    } else {
        notas = [];
        guardarNotasEnStorage();
    }
}

// Guardar notas en localStorage
function guardarNotasEnStorage() { localStorage.setItem('wallet_flow_notas', JSON.stringify(notas)); }

// Generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Actualizar la vista principal
function actualizarVista() {
    const grid = document.getElementById('notas-grid');
    const estadoVacio = document.getElementById('estado-vacio');
    
    if (!grid || !estadoVacio) return;

    if (notas.length === 0) {
        grid.style.display = 'none';
        estadoVacio.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        estadoVacio.style.display = 'none';
        mostrarNotas(notas);
    }
}

// Mostrar notas en el grid
function mostrarNotas(notasAMostrar) {
    const grid = document.getElementById('notas-grid');
    if (!grid) return;

    grid.innerHTML = '';

    notasAMostrar.forEach(nota => {
        const notaElement = crearElementoNota(nota);
        grid.appendChild(notaElement);
    });
}

// Crear elemento HTML para una nota
function crearElementoNota(nota) {
    const div = document.createElement('div');
    div.className = `nota-card categoria-${nota.categoria} prioridad-${nota.prioridad}`;
    div.onclick = () => editarNota(nota.id);

    const tags = nota.tags ? nota.tags.map(tag => `<span class="tag">#${tag}</span>`).join('') : '';
    const fechaCreacion = new Date(nota.fechaCreacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    div.innerHTML = `
        <div class="nota-header">
            <div>
                <h5 class="nota-titulo">${nota.titulo}</h5>
                <span class="nota-categoria">${getCategoriaTexto(nota.categoria)}</span>
            </div>
        </div>
        <div class="nota-contenido">${nota.contenido}</div>
        ${tags ? `<div class="nota-tags">${tags}</div>` : ''}
        <div class="nota-footer">
            <div class="nota-fecha">
                <i class="bi bi-calendar3"></i>
                ${fechaCreacion}
            </div>
            <div class="nota-acciones">
                <button class="btn-accion edit" onclick="event.stopPropagation(); editarNota('${nota.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-accion delete" onclick="event.stopPropagation(); confirmarEliminar('${nota.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    return div;
}

// Obtener texto de categoría
function getCategoriaTexto(categoria) {
    const categorias = {
        'general': '📝 General',
        'ingresos': '💰 Ingresos',
        'gastos': '💸 Gastos',
        'ahorros': '🏦 Ahorros',
        'inversiones': '📈 Inversiones',
        'deudas': '💳 Deudas',
        'objetivos': '🎯 Objetivos'
    };
    return categorias[categoria] || categorias['general'];
}

// Filtrar notas
function filtrarNotas() {
    const busqueda = document.getElementById('buscar-notas')?.value.toLowerCase() || '';
    
    let notasFiltradas = notas;

    // Filtrar por búsqueda
    if (busqueda) {
        notasFiltradas = notasFiltradas.filter(nota => 
            nota.titulo.toLowerCase().includes(busqueda) ||
            nota.contenido.toLowerCase().includes(busqueda) ||
            (nota.tags && nota.tags.some(tag => tag.toLowerCase().includes(busqueda)))
        );
    }

    mostrarNotas(notasFiltradas);
}

// Mostrar modal para nueva nota
function mostrarModalNuevaNota() {
    notaActual = null;
    limpiarFormulario();
    document.getElementById('titulo-modal').textContent = 'Nueva Nota';
    document.getElementById('texto-guardar').textContent = 'Guardar Nota';
    
    const modal = new bootstrap.Modal(document.getElementById('modalNota'));
    modal.show();
}

// Editar nota existente
function editarNota(id) {
    const nota = notas.find(n => n.id === id);
    if (!nota) return;

    notaActual = nota;
    
    document.getElementById('titulo-nota').value = nota.titulo;
    document.getElementById('contenido-nota').value = nota.contenido;
    document.getElementById('categoria-nota').value = nota.categoria;
    document.getElementById('prioridad-nota').value = nota.prioridad || 'media';
    document.getElementById('tags-nota').value = nota.tags ? nota.tags.join(', ') : '';
    
    document.getElementById('titulo-modal').textContent = 'Editar Nota';
    document.getElementById('texto-guardar').textContent = 'Actualizar Nota';
    
    const modal = new bootstrap.Modal(document.getElementById('modalNota'));
    modal.show();
}

// Guardar nota
async function guardarNota() {
    const titulo = document.getElementById('titulo-nota').value.trim();
    const contenido = document.getElementById('contenido-nota').value.trim();
    const categoria = document.getElementById('categoria-nota').value;
    const prioridad = document.getElementById('prioridad-nota').value;
    const tagsInput = document.getElementById('tags-nota').value.trim();

    if (!titulo || !contenido) {
        mostrarAlerta('Por favor, completa el título y contenido de la nota.', 'warning');
        return;
    }

    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const authed = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
    const puedeCloud = !!(window.walletDB && window.walletDB.addNote && authed);

    if (notaActual) {
        notaActual.titulo = titulo;
        notaActual.contenido = contenido;
        notaActual.categoria = categoria;
        notaActual.prioridad = prioridad;
        notaActual.tags = tags;
        notaActual.fechaModificacion = new Date().toISOString();
        try {
            if (puedeCloud && notaActual._cloud) {
                await window.walletDB.updateNote(notaActual.id, {
                    titulo, contenido, categoria, prioridad, tags
                });
            }
            mostrarAlerta('Nota actualizada correctamente', 'success');
        } catch(e){
            console.error('Error actualizando nota en nube', e);
            mostrarAlerta('Actualizada localmente (sin sincronizar)', 'warning');
        }
    } else {
        const nuevaNota = {
            id: generateId(),
            titulo,
            contenido,
            categoria,
            prioridad,
            tags,
            fechaCreacion: new Date().toISOString(),
            fechaModificacion: new Date().toISOString(),
            _cloud: false
        };
        if (puedeCloud) {
            try {
                const newId = await window.walletDB.addNote(nuevaNota);
                nuevaNota.id = newId;
                nuevaNota._cloud = true;
            } catch(e){
                console.warn('Fallo addNote nube, quedará local', e);
            }
        }
        notas.unshift(nuevaNota);
        mostrarAlerta('Nota creada correctamente', 'success');
    }

    if (!puedeCloud) guardarNotasEnStorage();
    actualizarVista();
    filtrarNotas();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNota'));
    modal.hide();
}

// Confirmar eliminación
function confirmarEliminar(id) {
    const nota = notas.find(n => n.id === id);
    if (!nota) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la nota "${nota.titulo}"?`)) {
        eliminarNota(id);
    }
}

// Eliminar nota
async function eliminarNota(id) {
    const index = notas.findIndex(n => n.id === id);
    if (index === -1) return;
    const nota = notas[index];
    const authed = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
    const puedeCloud = !!(window.walletDB && window.walletDB.deleteNote && authed);
    try {
        if (puedeCloud && nota._cloud) {
            await window.walletDB.deleteNote(nota.id);
        }
        notas.splice(index, 1);
        if (!puedeCloud) guardarNotasEnStorage();
        actualizarVista();
        filtrarNotas();
        mostrarAlerta('Nota eliminada correctamente', 'success');
    } catch(e){
        console.error('Error eliminando nota nube', e);
        mostrarAlerta('No se pudo eliminar en la nube', 'danger');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('titulo-nota').value = '';
    document.getElementById('contenido-nota').value = '';
    document.getElementById('categoria-nota').value = 'general';
    document.getElementById('prioridad-nota').value = 'media';
    document.getElementById('tags-nota').value = '';
}

// Mostrar alerta
function mostrarAlerta(mensaje, tipo = 'info') {
    // Crear el elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alerta.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alerta);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 3000);
}

// Funciones auxiliares para eventos globales
window.mostrarModalNuevaNota = mostrarModalNuevaNota;
window.editarNota = editarNota;
window.guardarNota = guardarNota;
window.confirmarEliminar = confirmarEliminar;
window.eliminarNota = eliminarNota;

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N para nueva nota
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        mostrarModalNuevaNota();
    }
    
    // Escape para cerrar modal
    if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNota'));
        if (modal) {
            modal.hide();
        }
    }
    
    // Ctrl/Cmd + S para guardar (cuando el modal está abierto)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNota'));
        if (modal && modal._element.classList.contains('show')) {
            e.preventDefault();
            guardarNota();
        }
    }
});

// Auto-guardar cada 30 segundos si hay cambios en el formulario
let cambiosPendientes = false;
let autoGuardarInterval;

function configurarAutoGuardado() {
    const inputs = ['titulo-nota', 'contenido-nota', 'categoria-nota', 'prioridad-nota', 'tags-nota'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                cambiosPendientes = true;
            });
        }
    });

    // Auto-guardar cada 30 segundos
    autoGuardarInterval = setInterval(() => {
        if (cambiosPendientes && notaActual) {
            guardarNota();
            cambiosPendientes = false;
        }
    }, 30000);
}

// Inicializar auto-guardado cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    configurarAutoGuardado();
});
