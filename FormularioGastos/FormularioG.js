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
    if (check.checked) {
        opciones.classList.add('visible');
    } else {
        opciones.classList.remove('visible');
    }
}

// Mostrar/ocultar opciones de cuenta asociada según el checkbox
function toggleCuenta() {
    const check = document.getElementById('addCheckCuenta');
    const opciones = document.getElementById('addCuentaAsociadaOptions');
    if (check.checked) {
        opciones.classList.add('visible');
    } else {
        opciones.classList.remove('visible');
    }
}

// Cierra el modal (puedes personalizar esta función)
function cerrarModal() {
    document.getElementById('modalAgregar').style.display = 'none';
    formAgregar.reset();
    // Opcional: vuelve al primer paso al cerrar
    volverAlPasoAnterior();
}

// Envía el formulario (aquí puedes agregar tu lógica para guardar el gasto)
formAgregar.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aquí puedes obtener los valores y hacer lo que necesites
    const datos = {
        categoria: document.getElementById('addCategoria').value,
        metodo: document.getElementById('addMetodo').value,
        monto: document.getElementById('addMonto').value,
        fecha: document.getElementById('addFecha').value,
        descripcion: document.getElementById('addDescripcion').value,
        esRecurrente: document.getElementById('addCheckRecurrente').checked,
        frecuencia: document.getElementById('addFrecuencia').value,
        tieneCuenta: document.getElementById('addCheckCuenta').checked,
        cuenta: document.getElementById('addCuentaAsociada').value
    };
    // Por ahora solo mostramos los datos en consola
    console.log('Gasto agregado:', datos);
    cerrarModal();
});

// Permite cerrar el modal con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});