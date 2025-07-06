// --- Utilidades ---
function formatearFecha(fecha) {
    if (!fecha) return '';
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}
function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// --- Mostrar gastos en la tabla ---
function mostrarGastos() {
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const tbody = document.querySelector('.lista-gastos table tbody') || crearTbody();
    tbody.innerHTML = '';
    gastos.forEach((gasto, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${capitalizar(gasto.categoria)}</td>
            <td>${capitalizar(gasto.metodo.replace('_', ' '))}</td>
            <td>$${Number(gasto.monto).toLocaleString()}</td>
            <td>${formatearFecha(gasto.fecha)}</td>
            <td>${gasto.descripcion || 'Sin descripción'}</td>
            <td>${gasto.esRecurrente && gasto.frecuencia ? `Sí (${capitalizar(gasto.frecuencia)})` : 'No'}</td>
            <td>${gasto.tieneCuenta && gasto.cuenta ? capitalizar(gasto.cuenta) : 'Ninguna'}</td>
            <td>
                <button class="editar" data-idx="${idx}">✏️</button>
                <button class="eliminar" data-idx="${idx}">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Si no hay <tbody>, lo crea
function crearTbody() {
    const table = document.querySelector('.lista-gastos table');
    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }
    return tbody;
}

// --- Calcular y mostrar resumen ---
function actualizarResumen() {
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    // Total de gastos
    const total = gastos.reduce((acc, g) => acc + Number(g.monto), 0);
    document.querySelector('.resumen .tarjeta:nth-child(1) h3').textContent = `$${total.toLocaleString()}`;

    // Gasto promedio diario (por días únicos)
    const diasUnicos = [...new Set(gastos.map(g => g.fecha))];
    const promedio = diasUnicos.length ? total / diasUnicos.length : 0;
    document.querySelector('.resumen .tarjeta:nth-child(2) h3').textContent = `$${Math.round(promedio).toLocaleString()}`;

    // Mayor categoría
    const categorias = {};
    gastos.forEach(g => {
        categorias[g.categoria] = (categorias[g.categoria] || 0) + Number(g.monto);
    });
    let mayor = 'N/A', mayorValor = 0;
    for (const [cat, val] of Object.entries(categorias)) {
        if (val > mayorValor) {
            mayor = cat;
            mayorValor = val;
        }
    }
    document.querySelector('.resumen .tarjeta:nth-child(3) h3').textContent = mayor !== 'N/A' ? capitalizar(mayor) : 'N/A';
}

// --- Actualizar gráfica ---
function actualizarGrafico() {
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const categorias = ['alimentacion', 'transporte', 'servicios', 'entretenimiento'];
    const colores = ['#00c2ff', '#2ecc71', '#f39c12', '#e74c3c'];
    const data = categorias.map(cat =>
        gastos.filter(g => g.categoria === cat).reduce((acc, g) => acc + Number(g.monto), 0)
    );
    grafico.data.labels = categorias.map(capitalizar);
    grafico.data.datasets[0].data = data;
    grafico.data.datasets[0].backgroundColor = colores;
    grafico.update();
}

// --- Eliminar gasto ---
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('eliminar')) {
        const idx = e.target.getAttribute('data-idx');
        const fila = e.target.closest('tr');
        const descripcion = fila.cells[4].textContent; // Ajusta el índice si tu descripción está en otra columna
        const confirmar = confirm(`¿Estás seguro de que deseas eliminar el gasto: "${descripcion}"?`);
        if (confirmar) {
            // Elimina del localStorage
            let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
            gastos.splice(idx, 1);
            localStorage.setItem('gastos', JSON.stringify(gastos));
            // Actualiza la tabla y resumen
            mostrarGastos();
            actualizarResumen();
            actualizarGrafico();
        }
        // Si NO confirma, no hace nada
    }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', function() {
    mostrarGastos();
    actualizarResumen();
    actualizarGrafico();
});
