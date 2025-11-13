// Función de inicialización del formulario de gasto
function initFormularioGasto() {

    const fechaInput = document.getElementById('addFecha');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.value = hoy;
    }
    
    //Verificar que el localStorage está funcionando
    console.log('Formulario de gastos inicializado');
    console.log('Gastos actuales en localStorage:', JSON.parse(localStorage.getItem('gastos') || '[]'));
}


document.addEventListener('DOMContentLoaded', initFormularioGasto);

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


function cerrarModal() {
    const modal = document.getElementById('modalAgregar');
    if (modal) {
        modal.style.display = 'none';
    }
    if (formAgregar) {
        formAgregar.reset();

        volverAlPasoAnterior();
    }
 
    window.location.href = '../../pantallas/PantallaGastos/Gastos.html';
}

// Envía el formulario y guarda el gasto en localStorage
formAgregar.addEventListener('submit', function(e) {
    e.preventDefault();
   
    let montoRaw = document.getElementById('addMonto').value.trim();
 
    let monto = montoRaw.replace(/\./g, '').replace(',', '.');
    monto = parseFloat(monto) || 0;

    const datos = {
        id: Date.now().toString(), 
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

    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Gasto guardado exitosamente', 'success');
    } else {

        alert('¡Gasto guardado exitosamente!');
    }

    cerrarModal();
    
  
    setTimeout(() => {
        const irAGastos = confirm('¿Deseas ver todos tus gastos en la pantalla de Gastos?');
        if (irAGastos) {
            window.location.href = '../../pantallas/PantallaGastos/Gastos.html';
        } else {
           
            const irAPrincipal = confirm('¿Deseas volver a la pantalla principal?');
            if (irAPrincipal) {
                window.location.href = '../../pantallas/pantallaprincipal/principal.html';
            }
        }
    }, 1500);

});


document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});