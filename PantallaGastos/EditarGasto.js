const editarBtns = document.querySelectorAll('.editar');
const modal = document.getElementById('modalEdicion');
const formEditar = document.getElementById('formEditar');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

// Selecciona los nuevos botones de navegación
const nextStepBtn = document.querySelector('.next-step-btn');
const prevStepBtn = document.querySelector('.prev-step-btn');

editarBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const fila = btn.closest('tr');
        // Marcar la fila que se está editando
        fila.classList.add('editando');
        
        document.getElementById('editFecha').value = convertirFechaInversa(fila.cells[0].textContent);
        document.getElementById('editDescripcion').value = fila.cells[1].textContent === 'Sin descripción' ? '' : fila.cells[1].textContent;
        document.getElementById('editCategoria').value = fila.cells[2].textContent.toLowerCase();
        document.getElementById('editMetodo').value = fila.cells[3].textContent.toLowerCase().replace(" ", "_");
        document.getElementById('editMonto').value = fila.cells[4].textContent.replace('$', '').replace('.', '').trim();

        // Leer los valores de Gasto Recurrente y Cuenta Asociada de la tabla
        const esRecurrenteTabla = fila.cells[5].textContent.toLowerCase() === 'sí';
        const cuentaAsociadaTabla = fila.cells[6].textContent;

        document.getElementById('checkRecurrente').checked = esRecurrenteTabla;
        toggleFrecuencia(); // Actualiza la visibilidad de las opciones de frecuencia

        if (esRecurrenteTabla) {
            // Asume que si es recurrente, el valor de la frecuencia está en algún lugar,
            // si no, necesitarás una forma de almacenarlo en la tabla o un valor predeterminado.
            // Por ahora, lo dejamos en blanco o puedes establecer un valor por defecto si lo deseas.
            // document.getElementById('frecuencia').value = 'semanal'; // Ejemplo
        }

        document.getElementById('checkCuenta').checked = cuentaAsociadaTabla.toLowerCase() !== 'n/a';
        toggleCuenta(); // Actualiza la visibilidad de las opciones de cuenta

        if (cuentaAsociadaTabla.toLowerCase() !== 'n/a') {
            document.getElementById('cuentaAsociada').value = cuentaAsociadaTabla.toLowerCase().replace(' ', ''); // Ajusta según tus valores
        } else {
             document.getElementById('cuentaAsociada').value = ''; // Limpiar si no hay cuenta asociada
        }

        modal.style.display = 'block';
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
    });
});

// Función para avanzar al siguiente paso
function irAlSiguientePaso() {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
}

// Función para retroceder al paso anterior
function volverAlPasoAnterior() {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
}

// Event listeners para los botones de navegación del modal
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', irAlSiguientePaso);
}

if (prevStepBtn) {
    prevStepBtn.addEventListener('click', volverAlPasoAnterior);
}

function mostrarModal() {
    document.getElementById('modalEdicion').style.display = 'block';
}

function cerrarModal() {
    modal.style.display = 'none';
    const filaEditando = document.querySelector('tr.editando');
    if (filaEditando) {
        filaEditando.classList.remove('editando');
    }
    limpiarFormulario();
}

formEditar.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevosDatos = {
        categoria: document.getElementById('editCategoria').value,
        metodoPago: document.getElementById('editMetodo').value,
        monto: document.getElementById('editMonto').value,
        fecha: document.getElementById('editFecha').value,
        descripcion: document.getElementById('editDescripcion').value,
        esRecurrente: document.getElementById('checkRecurrente').checked,
        frecuencia: document.getElementById('frecuencia')?.value,
        tieneCuentaAsociada: document.getElementById('checkCuenta').checked,
        cuentaAsociada: document.getElementById('cuentaAsociada')?.value
    };

    const filaEditando = document.querySelector('tr.editando');
    if (filaEditando) {
        filaEditando.cells[0].textContent = formatearFecha(nuevosDatos.fecha);
        filaEditando.cells[1].textContent = nuevosDatos.descripcion || 'Sin descripción';
        filaEditando.cells[2].textContent = capitalizar(nuevosDatos.categoria);
        filaEditando.cells[3].textContent = capitalizar(nuevosDatos.metodoPago.replace('_', ' '));
        filaEditando.cells[4].textContent = `$${nuevosDatos.monto}`;
        
        // Actualizar las nuevas columnas
        filaEditando.cells[5].textContent = nuevosDatos.esRecurrente ? 'Sí' : 'No';
        filaEditando.cells[6].textContent = nuevosDatos.tieneCuentaAsociada && nuevosDatos.cuentaAsociada ? capitalizar(nuevosDatos.cuentaAsociada) : 'N/A';
        
        filaEditando.classList.remove('editando');
    }

    cerrarModal();
});

function formatearFecha(fecha) {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}

function capitalizar(texto) {
    if (!texto) return ''; // Manejar caso de texto nulo o vacío
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function convertirFechaInversa(fecha) {
    const partes = fecha.split('/');
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
}

function toggleOpcionesExtra(tipo) {
    const recurrenteOptions = document.getElementById('recurrenteOptions');
    const cuentaOptions = document.getElementById('cuentaOptions');

    if (tipo === 'recurrente') {
        const checkRecurrente = document.getElementById('checkRecurrente');
        recurrenteOptions.classList.toggle('hidden', !checkRecurrente.checked);
    }

    if (tipo === 'cuenta') {
        const checkCuenta = document.getElementById('checkCuenta');
        cuentaOptions.classList.toggle('hidden', !checkCuenta.checked);
    }
}

function limpiarFormulario() {
    document.getElementById('editFecha').value = '';
    document.getElementById('editDescripcion').value = '';
    document.getElementById('editCategoria').value = 'alimentacion';
    document.getElementById('editMetodo').value = 'efectivo';
    document.getElementById('editMonto').value = '';
    
    const checkRecurrente = document.getElementById('checkRecurrente');
    const checkCuenta = document.getElementById('checkCuenta');
    if (checkRecurrente) checkRecurrente.checked = false;
    if (checkCuenta) checkCuenta.checked = false;
    
    // También limpiar los select de frecuencia y cuenta asociada
    const frecuenciaSelect = document.getElementById('frecuencia');
    if (frecuenciaSelect) frecuenciaSelect.value = '';
    const cuentaAsociadaSelect = document.getElementById('cuentaAsociada');
    if (cuentaAsociadaSelect) cuentaAsociadaSelect.value = '';

    toggleFrecuencia();
    toggleCuenta();
}

function toggleFrecuencia() {
    const checkbox = document.getElementById('checkRecurrente');
    const frecuenciaOptions = document.getElementById('frecuenciaOptions');
    
    if (checkbox && frecuenciaOptions) {
        if (checkbox.checked) {
            frecuenciaOptions.classList.add('visible');
        } else {
            frecuenciaOptions.classList.remove('visible');
        }
    }
}

function toggleCuenta() {
    const checkbox = document.getElementById('checkCuenta');
    const cuentaOptions = document.getElementById('cuentaAsociadaOptions');
    
    if (checkbox && cuentaOptions) {
        if (checkbox.checked) {
            cuentaOptions.classList.add('visible');
        } else {
            cuentaOptions.classList.remove('visible');
        }
    }
}

document.getElementById('checkRecurrente')?.addEventListener('change', toggleFrecuencia);
document.getElementById('checkCuenta')?.addEventListener('change', toggleCuenta);