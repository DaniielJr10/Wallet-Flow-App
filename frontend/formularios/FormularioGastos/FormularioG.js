// Función de inicialización del formulario de gasto
function initFormularioGasto() {
    // Configurar la fecha actual como valor por defecto
    const fechaInput = document.getElementById('addFecha');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.value = hoy;
    }
    
    // Debug: Verificar que el localStorage está funcionando
    console.log('Formulario de gastos inicializado');
    console.log('Gastos actuales en localStorage:', JSON.parse(localStorage.getItem('gastos') || '[]'));
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initFormularioGasto);

// Selecciona los elementos del formulario y los pasos
const formAgregar = document.getElementById('formAgregar');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextStepBtn = document.querySelector('.next-step-btn');
const prevStepBtn = document.querySelector('.prev-step-btn');

// Función para mostrar el siguiente paso del formulario
function irAlSiguientePaso() {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
}

// Función para volver al paso anterior
function volverAlPasoAnterior() {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
}

// Asigna los eventos a los botones de navegación
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', irAlSiguientePaso);
}
if (prevStepBtn) {
    prevStepBtn.addEventListener('click', volverAlPasoAnterior);
}

// Mostrar/ocultar opciones de frecuencia según el checkbox
function toggleFrecuencia() {
    const check = document.getElementById('addCheckRecurrente');
    const opciones = document.getElementById('addFrecuenciaOptions');
    if (check && opciones) {
        if (check.checked) {
            opciones.classList.add('visible');
        } else {
            opciones.classList.remove('visible');
        }
    }
}

// Mostrar/ocultar opciones de cuenta asociada según el checkbox
function toggleCuenta() {
    const check = document.getElementById('addCheckCuenta');
    const opciones = document.getElementById('addCuentaAsociadaOptions');
    if (check && opciones) {
        if (check.checked) {
            opciones.classList.add('visible');
        } else {
            opciones.classList.remove('visible');
        }
    }
}

// Cierra el modal (puedes personalizar esta función)
function cerrarModal() {
    const modal = document.getElementById('modalAgregar');
    if (modal) {
        modal.style.display = 'none';
    }
    if (formAgregar) {
        formAgregar.reset();
        // Opcional: vuelve al primer paso al cerrar
        volverAlPasoAnterior();
    }
    // Regresar a la pantalla de gastos
    window.location.href = '../../pantallas/PantallaGastos/Gastos.html';
}

// Envía el formulario y guarda el gasto en localStorage
formAgregar.addEventListener('submit', function(e) {
    e.preventDefault();
    // Permitir 0, puntos y comas en el monto
    let montoRaw = document.getElementById('addMonto').value.trim();
    // Reemplaza puntos por nada y comas por punto para convertir a número
    let monto = montoRaw.replace(/\./g, '').replace(',', '.');
    monto = parseFloat(monto) || 0;

    const datos = {
        id: Date.now().toString(), // ID único
        categoria: document.getElementById('addCategoria').value,
        metodo: document.getElementById('addMetodo').value,
        monto: monto,
        fecha: document.getElementById('addFecha').value,
        descripcion: document.getElementById('addDescripcion').value || '',
        esRecurrente: document.getElementById('addCheckRecurrente')?.checked || false,
        frecuencia: document.getElementById('addFrecuencia')?.value || '',
        cuenta: document.getElementById('addCuentaAsociada')?.value || 'Sin cuenta',
        fechaCreacion: new Date().toISOString()
    };

    // Guardar en localStorage
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.push(datos);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    // Mostrar notificación de éxito
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Gasto guardado exitosamente', 'success');
    } else {
        // Fallback: alert simple si no está disponible la función
        alert('¡Gasto guardado exitosamente!');
    }

    cerrarModal();
    
    // Preguntar al usuario si quiere ver la pantalla de gastos
    setTimeout(() => {
        const irAGastos = confirm('¿Deseas ver todos tus gastos en la pantalla de Gastos?');
        if (irAGastos) {
            window.location.href = '../../pantallas/PantallaGastos/Gastos.html';
        } else {
            // Si no quiere ir a gastos, ofrecer volver al principal
            const irAPrincipal = confirm('¿Deseas volver a la pantalla principal?');
            if (irAPrincipal) {
                window.location.href = '../../pantallas/pantallaprincipal/principal.html';
            }
        }
    }, 1500);
    // Opcional: actualizar los datos en la pantalla principal
});

// Permite cerrar el modal con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});