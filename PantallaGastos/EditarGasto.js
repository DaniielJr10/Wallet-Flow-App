const modal = document.getElementById('modalEdicion');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextStepBtn = document.querySelector('.next-step-btn');
const prevStepBtn = document.querySelector('.prev-step-btn');
const formEditar = document.getElementById('formEditar');

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('editar')) {
        const btn = e.target;
        const fila = btn.closest('tr');
        fila.classList.add('editando');

        // Ajusta los índices de las celdas según tu tabla
        document.getElementById('editCategoria').value = fila.cells[0].textContent.toLowerCase();
        document.getElementById('editMetodo').value = fila.cells[1].textContent.toLowerCase().replace(" ", "_");
        const montoTexto = fila.cells[2].textContent.replace('$', '').replace(/\./g, '').replace(',', '.').trim();
        const montoNumero = parseFloat(montoTexto) || 0;
        document.getElementById('editMonto').value = montoNumero.toLocaleString('es-CO');
        document.getElementById('editFecha').value = convertirFechaInversa(fila.cells[3].textContent);
        document.getElementById('editDescripcion').value = fila.cells[4].textContent === 'Sin descripción' ? '' : fila.cells[4].textContent;

        // Gasto recurrente y frecuencia
        const gastoRecurrenteTexto = fila.cells[5].textContent.trim();
        const esRecurrenteTabla = gastoRecurrenteTexto.toLowerCase().startsWith('sí');
        document.getElementById('checkRecurrente').checked = esRecurrenteTabla;
        toggleFrecuencia();
        if (esRecurrenteTabla) {
            const match = gastoRecurrenteTexto.match(/\(([^)]+)\)/);
            if (match && match[1]) {
                document.getElementById('frecuencia').value = match[1].toLowerCase();
            }
        } else {
            document.getElementById('frecuencia').value = '';
        }

        // Cuenta asociada
        const cuentaAsociadaTabla = fila.cells[6].textContent;
        document.getElementById('checkCuenta').checked = cuentaAsociadaTabla.toLowerCase() !== 'ninguna';
        toggleCuenta();
        if (cuentaAsociadaTabla.toLowerCase() !== 'ninguna') {
            document.getElementById('cuentaAsociada').value = cuentaAsociadaTabla.toLowerCase().replace(' ', '');
        } else {
            document.getElementById('cuentaAsociada').value = '';
        }

        modal.style.display = 'block';
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
    }
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
    document.getElementById('menuLateral')?.classList.add('blur');
}

function cerrarModal() {
    modal.style.display = 'none';
    document.getElementById('menuLateral')?.classList.remove('blur');
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
        filaEditando.cells[0].textContent = capitalizar(nuevosDatos.categoria);
        filaEditando.cells[1].textContent = capitalizar(nuevosDatos.metodoPago.replace('_', ' '));
        filaEditando.cells[2].textContent = `$${nuevosDatos.monto}`;
        filaEditando.cells[3].textContent = formatearFecha(nuevosDatos.fecha);
        filaEditando.cells[4].textContent = nuevosDatos.descripcion || 'Sin descripción';
        if (nuevosDatos.esRecurrente && nuevosDatos.frecuencia) {
            filaEditando.cells[5].textContent = `Sí (${capitalizar(nuevosDatos.frecuencia)})`;
        } else {
            filaEditando.cells[5].textContent = 'No';
        }
        filaEditando.cells[6].textContent = nuevosDatos.tieneCuentaAsociada && nuevosDatos.cuentaAsociada ? capitalizar(nuevosDatos.cuentaAsociada) : 'Ninguna';
        filaEditando.classList.remove('editando');
    }

    cerrarModal();
});

function formatearFecha(fecha) {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}

function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function convertirFechaInversa(fecha) {
    const partes = fecha.split('/');
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

document.getElementById('checkRecurrente')?.addEventListener('change', toggleFrecuencia);
document.getElementById('checkCuenta')?.addEventListener('change', toggleCuenta);