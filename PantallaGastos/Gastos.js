// ===============================================
// WALLET FLOW - JAVASCRIPT DE PANTALLA DE GASTOS
// ===============================================
// Archivo: Gastos.js
// Propósito: Funcionalidad para la gestión y control de gastos
// Coherencia: Mantiene la misma estructura que otros módulos
// Autor: Wallet Flow Team
// Fecha: 2025
//
// SECCIONES DEL CÓDIGO:
// 1. INICIALIZACIÓN - Configuración inicial al cargar la página
// 2. MENÚ LATERAL - Funcionalidades del menú de navegación
// 3. GESTIÓN DE GASTOS - CRUD y operaciones con gastos
// 4. UTILIDADES - Funciones auxiliares y helpers
// 5. EVENTOS - Manejadores de eventos de la interfaz
// ===============================================

// ===== 1. INICIALIZACIÓN ===== 
// Configuración que se ejecuta al cargar completamente la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes principales
    inicializarMenuLateral();
    inicializarEventos();
    marcarEnlaceActivo();
    
    console.log('✅ Pantalla de Gastos inicializada correctamente');
});

// ===== 2. MENÚ LATERAL ===== 
// Funcionalidades relacionadas con la navegación lateral

/**
 * Inicializa la funcionalidad del menú lateral
 * Configura eventos y estados iniciales
 */
function inicializarMenuLateral() {
    // Configurar cierre de sesión
    configurarCierreSesion();
    
    // Aplicar efectos visuales al menú
    aplicarEfectosMenu();
}

/**
 * Configura el evento de cerrar sesión
 * Idéntico al comportamiento de principal.html
 */
function configurarCierreSesion() {
    const btnCerrarSesion = document.getElementById('cerrarSesionBtn');
    
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirmar cierre de sesión con el usuario
            const confirmacion = confirm(
                '¿Estás seguro de que deseas cerrar sesión?\n\n' +
                'Se perderán los cambios no guardados.'
            );
            
            if (confirmacion) {
                // Mostrar mensaje de despedida
                console.log('👋 Cerrando sesión...');
                
                // Redirigir a la página de inicio de sesión
                window.location.href = '../inicio de sesion/inicio.html';
            }
        });
    }
}

/**
 * Aplica efectos visuales adicionales al menú
 * Mejora la experiencia del usuario
 */
function aplicarEfectosMenu() {
    const enlacesMenu = document.querySelectorAll('.menu-lateral .nav-link');
    
    enlacesMenu.forEach(enlace => {
        // Efecto de ripple al hacer clic
        enlace.addEventListener('click', function(e) {
            crearEfectoRipple(e, this);
        });
    });
}

/**
 * Crea un efecto visual de ripple en los enlaces del menú
 * @param {Event} e - Evento del clic
 * @param {Element} elemento - Elemento donde aplicar el efecto
 */
function crearEfectoRipple(e, elemento) {
    const ripple = document.createElement('span');
    const rect = elemento.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;
    
    elemento.style.position = 'relative';
    elemento.appendChild(ripple);
    
    // Eliminar el elemento después de la animación
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Marca el enlace actual como activo en el menú
 * Resalta visualmente la sección en la que se encuentra el usuario
 */
function marcarEnlaceActivo() {
    // Buscar el enlace de gastos en el menú
    const enlaceGastos = document.querySelector('a[href*="Gastos.html"]');
    
    if (enlaceGastos) {
        // Agregar clase activa
        enlaceGastos.classList.add('active');
        
        // Log para debugging
        console.log('🎯 Enlace de Gastos marcado como activo');
    }
    
    // Remover clase activa de otros enlaces si existe
    const todosLosEnlaces = document.querySelectorAll('.menu-lateral .nav-link');
    todosLosEnlaces.forEach(enlace => {
        if (enlace !== enlaceGastos && enlace.classList.contains('active')) {
            enlace.classList.remove('active');
        }
    });
}

// ===== 3. GESTIÓN DE GASTOS ===== 
// Funcionalidades principales para manejar gastos (se desarrollará en siguientes pasos)

/**
 * Función placeholder para cargar gastos
 * Se desarrollará en los siguientes pasos
 */
function cargarGastos() {
    console.log('📊 Cargando gastos... (función en desarrollo)');
    // TODO: Implementar carga de gastos desde localStorage
}

/**
 * Función placeholder para agregar gastos
 * Se desarrollará en los siguientes pasos
 */
function agregarGasto() {
    console.log('➕ Agregando gasto... (función en desarrollo)');
    // TODO: Implementar funcionalidad para agregar gastos
}

// ===== 4. UTILIDADES ===== 
// Funciones auxiliares y helpers

/**
 * Muestra mensajes de notificación al usuario
 * @param {string} mensaje - Texto del mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje (success, error, info, warning)
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
    `;
    
    // Contenido de la notificación
    notificacion.innerHTML = `
        <i class="bi bi-${obtenerIconoTipo(tipo)} me-2"></i>
        <strong>${mensaje}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.classList.remove('show');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 150);
        }
    }, 4000);
}

/**
 * Obtiene el icono apropiado según el tipo de mensaje
 * @param {string} tipo - Tipo de mensaje
 * @returns {string} Clase del icono de Bootstrap Icons
 */
function obtenerIconoTipo(tipo) {
    const iconos = {
        'success': 'check-circle-fill',
        'error': 'exclamation-triangle-fill',
        'warning': 'exclamation-triangle-fill',
        'info': 'info-circle-fill'
    };
    return iconos[tipo] || 'info-circle-fill';
}

// ===== 5. EVENTOS ===== 
// Configuración de manejadores de eventos

/**
 * Inicializa todos los eventos de la interfaz
 */
function inicializarEventos() {
    // Eventos del menú lateral ya configurados en inicializarMenuLateral()
    
    // Eventos específicos de gastos (se agregarán en siguientes pasos)
    console.log('🎮 Eventos inicializados');
}

// ===== ESTILOS CSS DINÁMICOS ===== 
// Agregar estilos para animaciones que no están en el CSS

// Crear hoja de estilos para animaciones dinámicas
const estilosDinamicos = document.createElement('style');
estilosDinamicos.textContent = `
    /* Animación para el efecto ripple */
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Mejoras visuales adicionales */
    .menu-lateral .nav-link {
        overflow: hidden;
    }
`;

// Agregar estilos al head del documento
document.head.appendChild(estilosDinamicos);

// ===============================================
// ESTADO ACTUAL: MENÚ LATERAL COMPLETO
// ===============================================
// ✅ Menú lateral funcionando 100% igual a principal.html
// ✅ Cerrar sesión configurado
// ✅ Enlace activo marcado
// ✅ Efectos visuales aplicados
// ✅ Estructura lista para desarrollo del contenido principal
//
// PRÓXIMOS PASOS:
// 🔄 Desarrollar contenido principal de gastos
// 🔄 Implementar CRUD de gastos
// 🔄 Agregar filtros y búsqueda
// 🔄 Crear gráficos y estadísticas
// ===============================================
