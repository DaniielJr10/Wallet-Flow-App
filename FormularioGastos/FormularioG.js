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
    document.getElementById('modalAgregar').style.display = 'none';
    formAgregar.reset();
    // Opcional: vuelve al primer paso al cerrar
    volverAlPasoAnterior();
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
        categoria: document.getElementById('addCategoria').value,
        metodo: document.getElementById('addMetodo').value,
        monto: monto,
        fecha: document.getElementById('addFecha').value,
        descripcion: document.getElementById('addDescripcion').value,
        esRecurrente: document.getElementById('addCheckRecurrente')?.checked || false,
        frecuencia: document.getElementById('addFrecuencia')?.value || '',
        tieneCuenta: document.getElementById('addCheckCuenta')?.checked || false,
        cuenta: document.getElementById('addCuentaAsociada')?.value || ''
    };

    // Guardar en localStorage
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.push(datos);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    cerrarModal();
    // Redirigir a la pantalla de gastos principal
    window.location.href = '../PantallaGastos/Gastos.html';
});

// Permite cerrar el modal con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});