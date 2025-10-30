// ===== GESTIÓN AVANZADA DE GASTOS =====

// Variables globales
let gastos = [];
let gastosFiltrados = [];
let paginaActual = 1;
const gastosPorPagina = 10;
let gastoEditando = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de gastos iniciado');
    cargarGastos();
    inicializarEventListeners();
    actualizarInterfaz();
    configurarFiltros();
});

// ===== GESTIÓN DE DATOS =====
function cargarGastos() {
    const gastosGuardados = localStorage.getItem('gastos');
    if (gastosGuardados) {
        gastos = JSON.parse(gastosGuardados);
    }
    gastosFiltrados = [...gastos];
    console.log(`Cargados ${gastos.length} gastos`);
}

function guardarGastos() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
    console.log('Gastos guardados en localStorage');
}

// ===== EVENT LISTENERS =====
function inicializarEventListeners() {
    // Botón agregar gasto
    const btnAgregar = document.getElementById('btnAgregarGasto');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', mostrarFormularioAgregar);
    }

    // Botón exportar
    const btnExportar = document.getElementById('btnExportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarGastos);
    }

    // Formulario
    const formulario = document.getElementById('formGasto');
    if (formulario) {
        formulario.addEventListener('submit', guardarGasto);
    }

    // Botón cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarFormulario);
    }

    // Filtros
    const filtros = ['filtroCategoria', 'filtroMetodo', 'filtroRecurrente', 'filtroCuenta'];
    filtros.forEach(filtro => {
        const elemento = document.getElementById(filtro);
        if (elemento) {
            elemento.addEventListener('change', aplicarFiltros);
        }
    });

    // Búsqueda
    const busqueda = document.getElementById('buscarGasto');
    if (busqueda) {
        busqueda.addEventListener('input', aplicarFiltros);
    }

    // Paginación
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            const pagina = parseInt(e.target.dataset.page);
            if (!isNaN(pagina)) {
                cambiarPagina(pagina);
            }
        }
    });
}

// ===== FORMULARIO =====
function mostrarFormularioAgregar() {
    gastoEditando = null;
    limpiarFormulario();
    document.getElementById('tituloFormulario').textContent = 'Agregar Nuevo Gasto';
    document.getElementById('overlayFormulario').style.display = 'flex';
}

function mostrarFormularioEditar(id) {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;

    gastoEditando = gasto;
    llenarFormulario(gasto);
    document.getElementById('tituloFormulario').textContent = 'Editar Gasto';
    document.getElementById('overlayFormulario').style.display = 'flex';
}

function llenarFormulario(gasto) {
    document.getElementById('descripcion').value = gasto.descripcion || '';
    document.getElementById('monto').value = gasto.monto || '';
    document.getElementById('categoria').value = gasto.categoria || '';
    document.getElementById('metodoPago').value = gasto.metodo || '';
    document.getElementById('fecha').value = gasto.fecha || '';
    document.getElementById('cuenta').value = gasto.cuenta || '';
    document.getElementById('esRecurrente').checked = gasto.esRecurrente || false;
    document.getElementById('frecuencia').value = gasto.frecuencia || '';
    
    // Mostrar/ocultar frecuencia
    const contenedorFrecuencia = document.getElementById('contenedorFrecuencia');
    if (contenedorFrecuencia) {
        contenedorFrecuencia.style.display = gasto.esRecurrente ? 'block' : 'none';
    }
}

function limpiarFormulario() {
    const formulario = document.getElementById('formGasto');
    if (formulario) {
        formulario.reset();
    }
    const contenedorFrecuencia = document.getElementById('contenedorFrecuencia');
    if (contenedorFrecuencia) {
        contenedorFrecuencia.style.display = 'none';
    }
}

function cerrarFormulario() {
    document.getElementById('overlayFormulario').style.display = 'none';
    gastoEditando = null;
}

function guardarGasto(e) {
    e.preventDefault();
    
    const datos = {
        descripcion: document.getElementById('descripcion').value.trim(),
        monto: parseFloat(document.getElementById('monto').value),
        categoria: document.getElementById('categoria').value,
        metodo: document.getElementById('metodoPago').value,
        fecha: document.getElementById('fecha').value,
        cuenta: document.getElementById('cuenta').value,
        esRecurrente: document.getElementById('esRecurrente').checked,
        frecuencia: document.getElementById('frecuencia').value || ''
    };

    // Validación
    if (!datos.descripcion || !datos.monto || !datos.categoria || !datos.fecha) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }

    if (gastoEditando) {
        // Editar gasto existente
        const indice = gastos.findIndex(g => g.id === gastoEditando.id);
        if (indice !== -1) {
            gastos[indice] = { ...datos, id: gastoEditando.id };
        }
    } else {
        // Agregar nuevo gasto
        const nuevoGasto = {
            ...datos,
            id: Date.now().toString()
        };
        gastos.push(nuevoGasto);
    }

    guardarGastos();
    actualizarInterfaz();
    cerrarFormulario();
    mostrarNotificacion(gastoEditando ? 'Gasto actualizado' : 'Gasto agregado');
}

// ===== TABLA Y VISUALIZACIÓN =====
function actualizarInterfaz() {
    aplicarFiltros();
    actualizarEstadisticas();
    actualizarTabla();
    actualizarPaginacion();
}

function actualizarTabla() {
    const tbody = document.getElementById('tbodyGastos');
    if (!tbody) return;

    const inicio = (paginaActual - 1) * gastosPorPagina;
    const fin = inicio + gastosPorPagina;
    const gastosPagina = gastosFiltrados.slice(inicio, fin);

    if (gastosPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5">
                    <div class="estado-vacio">
                        <i class="bi bi-receipt icono-vacio" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                        <h5>No hay gastos registrados</h5>
                        <p class="text-muted">Comienza agregando tu primer gasto</p>
                        <button class="btn btn-danger btn-agregar-primero" onclick="mostrarFormularioAgregar()">
                            <i class="bi bi-plus-circle me-2"></i>Agregar Primer Gasto
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = gastosPagina.map(gasto => `
        <tr>
            <td>
                <input type="checkbox" class="form-check-input" value="${gasto.id}">
            </td>
            <td>
                <span class="categoria-badge">
                    ${gasto.categoria}
                </span>
            </td>
            <td>
                <span class="fecha-formato">
                    ${formatearFecha(gasto.fecha)}
                </span>
            </td>
            <td>
                <span class="metodo-pago">
                    ${gasto.metodo}
                </span>
            </td>
            <td>
                <span class="monto-destacado">
                    $${Number(gasto.monto).toLocaleString('es-CO')}
                </span>
            </td>
            <td>
                <div class="descripcion-texto" title="${gasto.descripcion}">
                    ${gasto.descripcion}
                </div>
            </td>
            <td>
                <span class="status-badge ${gasto.esRecurrente ? 'badge-recurrente' : 'badge-no-recurrente'}">
                    ${gasto.esRecurrente ? 'Sí' : 'No'}
                </span>
            </td>
            <td>
                ${gasto.esRecurrente && gasto.frecuencia ? `
                    <small class="frecuencia-texto">${gasto.frecuencia}</small>
                ` : '<span class="text-muted">-</span>'}
            </td>
            <td>
                <span class="cuenta-texto">
                    ${gasto.cuenta}
                </span>
            </td>
            <td>
                <div class="botones-accion">
                    <button class="btn btn-sm btn-warning btn-editar me-1" onclick="mostrarFormularioEditar('${gasto.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" onclick="eliminarGasto('${gasto.id}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== ESTADÍSTICAS =====
function actualizarEstadisticas() {
    const totalGastos = gastosFiltrados.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
    const promedioGastos = gastosFiltrados.length > 0 ? totalGastos / gastosFiltrados.length : 0;
    const totalRegistros = gastosFiltrados.length;

    // Actualizar cards de estadísticas
    const elementoTotal = document.getElementById('totalGastos');
    if (elementoTotal) {
        elementoTotal.textContent = `$${totalGastos.toLocaleString('es-CO')}`;
    }

    const elementoPromedio = document.getElementById('promedioGastos');
    if (elementoPromedio) {
        elementoPromedio.textContent = `$${Math.round(promedioGastos).toLocaleString('es-CO')}`;
    }

    // Actualizar categoría principal
    const categorias = {};
    gastosFiltrados.forEach(gasto => {
        categorias[gasto.categoria] = (categorias[gasto.categoria] || 0) + Number(gasto.monto);
    });
    
    const categoriaPrincipal = Object.keys(categorias).reduce((a, b) => 
        categorias[a] > categorias[b] ? a : b, 'Sin datos'
    );
    
    const elementoCategoria = document.getElementById('categoriaPrincipal');
    if (elementoCategoria) {
        elementoCategoria.textContent = categoriaPrincipal;
    }

    const elementoConteo = document.getElementById('conteoGastos');
    if (elementoConteo) {
        elementoConteo.textContent = totalRegistros;
    }
}

// ===== FILTROS =====
function configurarFiltros() {
    actualizarOpcionesFiltros();
    
    // Configurar checkbox de recurrente
    const checkRecurrente = document.getElementById('esRecurrente');
    const contenedorFrecuencia = document.getElementById('contenedorFrecuencia');
    
    if (checkRecurrente && contenedorFrecuencia) {
        checkRecurrente.addEventListener('change', function() {
            contenedorFrecuencia.style.display = this.checked ? 'block' : 'none';
        });
    }
}

function actualizarOpcionesFiltros() {
    const categorias = [...new Set(gastos.map(g => g.categoria))].filter(Boolean);
    const metodos = [...new Set(gastos.map(g => g.metodo))].filter(Boolean);
    const cuentas = [...new Set(gastos.map(g => g.cuenta))].filter(Boolean);

    actualizarSelectFiltro('filtroCategoria', categorias);
    actualizarSelectFiltro('filtroMetodo', metodos);
    actualizarSelectFiltro('filtroCuenta', cuentas);
}

function actualizarSelectFiltro(id, opciones) {
    const select = document.getElementById(id);
    if (!select) return;

    const valorActual = select.value;
    const opcionesTodas = select.querySelector('option[value=""]');
    
    select.innerHTML = '';
    if (opcionesTodas) {
        select.appendChild(opcionesTodas);
    }

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
    });

    select.value = valorActual;
}

function aplicarFiltros() {
    const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
    const filtroMetodo = document.getElementById('filtroMetodo')?.value || '';
    const filtroRecurrente = document.getElementById('filtroRecurrente')?.value || '';
    const filtroCuenta = document.getElementById('filtroCuenta')?.value || '';
    const busqueda = document.getElementById('buscarGasto')?.value.toLowerCase() || '';

    gastosFiltrados = gastos.filter(gasto => {
        const cumpleCategoria = !filtroCategoria || gasto.categoria === filtroCategoria;
        const cumpleMetodo = !filtroMetodo || gasto.metodo === filtroMetodo;
        const cumpleCuenta = !filtroCuenta || gasto.cuenta === filtroCuenta;
        
        let cumpleRecurrente = true;
        if (filtroRecurrente === 'si') {
            cumpleRecurrente = gasto.esRecurrente === true;
        } else if (filtroRecurrente === 'no') {
            cumpleRecurrente = gasto.esRecurrente === false;
        }

        const cumpleBusqueda = !busqueda || 
            gasto.descripcion.toLowerCase().includes(busqueda) ||
            gasto.categoria.toLowerCase().includes(busqueda) ||
            gasto.metodo.toLowerCase().includes(busqueda) ||
            gasto.cuenta.toLowerCase().includes(busqueda);

        return cumpleCategoria && cumpleMetodo && cumpleCuenta && cumpleRecurrente && cumpleBusqueda;
    });

    paginaActual = 1;
    actualizarEstadisticas();
    actualizarTabla();
    actualizarPaginacion();
}

function limpiarFiltros() {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroMetodo').value = '';
    document.getElementById('filtroRecurrente').value = '';
    document.getElementById('filtroCuenta').value = '';
    document.getElementById('buscarGasto').value = '';
    aplicarFiltros();
}

// ===== PAGINACIÓN =====
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(gastosFiltrados.length / gastosPorPagina);
    const contenedorPaginacion = document.getElementById('paginacionGastos');
    
    if (!contenedorPaginacion) return;

    if (totalPaginas <= 1) {
        contenedorPaginacion.innerHTML = '';
        return;
    }

    let html = '<nav><ul class="pagination pagination-sm">';
    
    // Botón anterior
    html += `<li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${paginaActual - 1}">Anterior</a>
    </li>`;
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<li class="page-item ${i === paginaActual ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }
    
    // Botón siguiente
    html += `<li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${paginaActual + 1}">Siguiente</a>
    </li>`;
    
    html += '</ul></nav>';
    contenedorPaginacion.innerHTML = html;

    // Actualizar información de paginación
    const infoPaginacion = document.getElementById('infoPaginacion');
    if (infoPaginacion) {
        const inicio = (paginaActual - 1) * gastosPorPagina + 1;
        const fin = Math.min(paginaActual * gastosPorPagina, gastosFiltrados.length);
        infoPaginacion.textContent = `Mostrando ${inicio}-${fin} de ${gastosFiltrados.length} gastos`;
    }
}

function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(gastosFiltrados.length / gastosPorPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        actualizarTabla();
        actualizarPaginacion();
    }
}

// ===== ELIMINAR GASTO =====
function eliminarGasto(id) {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;

    if (confirm(`¿Estás seguro de eliminar el gasto "${gasto.descripcion}"?`)) {
        gastos = gastos.filter(g => g.id !== id);
        guardarGastos();
        actualizarInterfaz();
        mostrarNotificacion('Gasto eliminado');
    }
}

// ===== EXPORTAR =====
function exportarGastos() {
    if (gastosFiltrados.length === 0) {
        alert('No hay gastos para exportar');
        return;
    }

    const datos = gastosFiltrados.map(gasto => ({
        'Descripción': gasto.descripcion,
        'Monto': gasto.monto,
        'Categoría': gasto.categoria,
        'Método de Pago': gasto.metodo,
        'Fecha': gasto.fecha,
        'Cuenta': gasto.cuenta,
        'Es Recurrente': gasto.esRecurrente ? 'Sí' : 'No',
        'Frecuencia': gasto.frecuencia || ''
    }));

    const csv = convertirACSV(datos);
    descargarCSV(csv, 'gastos_export.csv');
    mostrarNotificacion('Gastos exportados exitosamente');
}

// ===== UTILIDADES =====
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO');
}

function convertirACSV(datos) {
    if (datos.length === 0) return '';
    
    const headers = Object.keys(datos[0]);
    const csv = [
        headers.join(','),
        ...datos.map(fila => headers.map(header => `"${fila[header]}"`).join(','))
    ].join('\n');
    
    return csv;
}

function descargarCSV(csv, nombreArchivo) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success position-fixed';
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// ===== FUNCIONES GLOBALES PARA EVENTOS =====
window.mostrarFormularioAgregar = mostrarFormularioAgregar;
window.mostrarFormularioEditar = mostrarFormularioEditar;
window.eliminarGasto = eliminarGasto;


function configurarFiltros() {
  // Obtiene referencias a controles simplificados
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroMetodo = document.getElementById('filtroMetodo');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');
  const filtroTexto = document.getElementById('buscadorGlobal');
  const btnLimpiar = document.getElementById('btnLimpiarFiltros');

  [filtroCategoria, filtroMetodo, filtroFechaInicio, filtroFechaFin].forEach(filtro => {
    if (filtro) filtro.addEventListener('change', aplicarFiltros);
  });
  if (filtroTexto) filtroTexto.addEventListener('input', aplicarFiltros);
  if (btnLimpiar) btnLimpiar.addEventListener('click', () => {
    [filtroCategoria, filtroMetodo, filtroFechaInicio, filtroFechaFin, filtroTexto].forEach(el => { if (el) el.value = ''; });
    aplicarFiltros();
  });
}

// ===== FUNCIÓN PARA APLICAR FILTROS =====
function aplicarFiltros() {
  // Lee valores activos de filtros
  const categoria = document.getElementById('filtroCategoria').value;
  const metodo = document.getElementById('filtroMetodo').value;
  const fechaInicio = document.getElementById('filtroFechaInicio').value;
  const fechaFin = document.getElementById('filtroFechaFin').value;
  const texto = (document.getElementById('buscadorGlobal')?.value || '').trim().toLowerCase();

  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  // Aplicar filtros
  if (categoria) {
    gastos = gastos.filter(gasto => gasto.categoria === categoria);
  }
  if (metodo) {
    gastos = gastos.filter(gasto => gasto.metodo === metodo);
  }
  if (fechaInicio) {
    gastos = gastos.filter(gasto => gasto.fecha >= fechaInicio);
  }
  if (fechaFin) {
    gastos = gastos.filter(gasto => gasto.fecha <= fechaFin);
  }
  if (texto) {
    gastos = gastos.filter(gasto => (gasto.descripcion || '').toLowerCase().includes(texto));
  }

  renderGastosFiltrados(gastos);
}

// ===== FUNCIÓN PARA RENDERIZAR GASTOS =====
function renderGastos() {
  // Pinta la tabla completa sin filtros y actualiza contador
  const tabla = document.getElementById('tablaGastos').querySelector('tbody');
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  tabla.innerHTML = '';
  
  const estadoTabla = document.getElementById('estadoTabla');
  if (estadoTabla) estadoTabla.textContent = gastos.length + ' registros';
  if (gastos.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-inbox me-2"></i>No hay gastos registrados
        </td>
      </tr>
    `;
    return;
  }
  
  gastos.forEach((gasto, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <span class="categoria-badge">${gasto.categoria}</span>
      </td>
      <td>
        <span class="metodo-pago">${gasto.metodo}</span>
      </td>
      <td>
        <span class="monto-destacado">$${formatearMonto(gasto.monto)}</span>
      </td>
      <td>
        <span class="fecha-formato">${formatearFecha(gasto.fecha)}</span>
      </td>
      <td>
        <span class="descripcion-texto">${gasto.descripcion || 'Sin descripción'}</span>
      </td>
      <td>
        <span class="badge ${gasto.esRecurrente ? 'badge-si' : 'badge-no'}">
          ${gasto.esRecurrente ? 'Sí' : 'No'}
        </span>
      </td>
      <td>
        <span class="frecuencia-texto">${gasto.frecuencia || '-'}</span>
      </td>
      <td>
        <span class="cuenta-texto">${gasto.cuenta || '-'}</span>
      </td>
      <td>
        <div class="botones-accion">
          <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${index}" title="Editar gasto">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}" title="Eliminar gasto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Configurar eventos de botones
  configurarEventosBotones();
}

// ===== FUNCIÓN PARA RENDERIZAR GASTOS FILTRADOS =====
function renderGastosFiltrados(gastosFiltrados) {
  // Pinta tabla usando un subconjunto filtrado
  const tabla = document.getElementById('tablaGastos').querySelector('tbody');
  tabla.innerHTML = '';
  
  const estadoTabla = document.getElementById('estadoTabla');
  if (estadoTabla) estadoTabla.textContent = gastosFiltrados.length + ' registros filtrados';
  if (gastosFiltrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-search me-2"></i>No se encontraron gastos con los filtros aplicados
        </td>
      </tr>
    `;
    return;
  }
  
  gastosFiltrados.forEach((gasto, index) => {
    // Encontrar el índice real del gasto en el array completo
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const indiceReal = gastos.findIndex(g => 
      g.categoria === gasto.categoria && 
      g.monto === gasto.monto && 
      g.fecha === gasto.fecha && 
      g.descripcion === gasto.descripcion
    );
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <span class="categoria-badge">${gasto.categoria}</span>
      </td>
      <td>
        <span class="metodo-pago">${gasto.metodo}</span>
      </td>
      <td>
        <span class="monto-destacado">$${formatearMonto(gasto.monto)}</span>
      </td>
      <td>
        <span class="fecha-formato">${formatearFecha(gasto.fecha)}</span>
      </td>
      <td>
        <span class="descripcion-texto">${gasto.descripcion || 'Sin descripción'}</span>
      </td>
      <td>
        <span class="badge ${gasto.esRecurrente ? 'badge-si' : 'badge-no'}">
          ${gasto.esRecurrente ? 'Sí' : 'No'}
        </span>
      </td>
      <td>
        <span class="frecuencia-texto">${gasto.frecuencia || '-'}</span>
      </td>
      <td>
        <span class="cuenta-texto">${gasto.cuenta || '-'}</span>
      </td>
      <td>
        <div class="botones-accion">
          <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${indiceReal}" title="Editar gasto">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${indiceReal}" title="Eliminar gasto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Configurar eventos de botones
  configurarEventosBotones();
}

// ===== CONFIGURACIÓN DE EVENTOS DE BOTONES =====
function configurarEventosBotones() {
  // Enlaza eventos dinámicos de cada fila (editar/eliminar)
  // Botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      eliminarGasto(idx);
    });
  });

  // Botones de editar
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      editarGasto(idx);
    });
  });
}

// ===== FUNCIÓN PARA ELIMINAR GASTO =====
function eliminarGasto(idx) {
  // Borra un gasto por índice y recalcula métricas
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este gasto?\n\nEsta acción no se puede deshacer.');
  if (confirmacion) {
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.splice(idx, 1);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    renderGastos();
    calcularResumen();
    mostrarMensaje('¡Gasto eliminado exitosamente!', 'success');
  }
}

// ===== FUNCIÓN PARA MOSTRAR FORMULARIO AGREGAR =====
function mostrarFormularioAgregar() {
  // Lanza formulario modal vacío para crear gasto
  const formHtml = crearFormularioHTML('Agregar Nuevo Gasto', {});
  mostrarModal(formHtml, guardarNuevoGasto);
}

// ===== FUNCIÓN PARA EDITAR GASTO =====
function editarGasto(idx) {
  // Abre formulario precargado para editar gasto existente
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  const gasto = gastos[idx];
  
  const formHtml = crearFormularioHTML('Editar Gasto', gasto);
  mostrarModal(formHtml, (formData) => actualizarGasto(idx, formData));
}

// ===== FUNCIÓN PARA CREAR HTML DEL FORMULARIO =====
function crearFormularioHTML(titulo, gasto) {
  // Genera markup del formulario (uso reutilizable agregar/editar)
  return `
    <form id="formGasto" class="form-gasto">
      <h5 class="form-titulo">
        <i class="bi bi-${titulo.includes('Agregar') ? 'plus-circle' : 'pencil-square'} me-2"></i>${titulo}
      </h5>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-tag me-2"></i>Categoría
          </label>
          <select class="form-select" name="categoria" required>
            <option value="">Seleccionar categoría...</option>
            <option value="Alimentación" ${gasto.categoria === 'Alimentación' ? 'selected' : ''}>Alimentación</option>
            <option value="Transporte" ${gasto.categoria === 'Transporte' ? 'selected' : ''}>Transporte</option>
            <option value="Entretenimiento" ${gasto.categoria === 'Entretenimiento' ? 'selected' : ''}>Entretenimiento</option>
            <option value="Servicios" ${gasto.categoria === 'Servicios' ? 'selected' : ''}>Servicios</option>
            <option value="Salud" ${gasto.categoria === 'Salud' ? 'selected' : ''}>Salud</option>
            <option value="Educación" ${gasto.categoria === 'Educación' ? 'selected' : ''}>Educación</option>
            <option value="Compras" ${gasto.categoria === 'Compras' ? 'selected' : ''}>Compras</option>
            <option value="Otros" ${gasto.categoria === 'Otros' ? 'selected' : ''}>Otros</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-credit-card me-2"></i>Método de Pago
          </label>
          <select class="form-select" name="metodo" required>
            <option value="">Seleccionar método...</option>
            <option value="Efectivo" ${gasto.metodo === 'Efectivo' ? 'selected' : ''}>Efectivo</option>
            <option value="Tarjeta de Débito" ${gasto.metodo === 'Tarjeta de Débito' ? 'selected' : ''}>Tarjeta de Débito</option>
            <option value="Tarjeta de Crédito" ${gasto.metodo === 'Tarjeta de Crédito' ? 'selected' : ''}>Tarjeta de Crédito</option>
            <option value="Transferencia" ${gasto.metodo === 'Transferencia' ? 'selected' : ''}>Transferencia</option>
          </select>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-currency-dollar me-2"></i>Monto
          </label>
          <input class="form-control" name="monto" type="number" min="0.01" step="0.01" 
                 value="${gasto.monto || ''}" placeholder="0.00" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-calendar me-2"></i>Fecha
          </label>
          <input class="form-control" name="fecha" type="date" 
                 value="${gasto.fecha || new Date().toISOString().split('T')[0]}" required>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">
          <i class="bi bi-file-text me-2"></i>Descripción
        </label>
        <textarea class="form-control" name="descripcion" rows="2" 
                  placeholder="Descripción del gasto">${gasto.descripcion || ''}</textarea>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-repeat me-2"></i>¿Es Recurrente?
          </label>
          <select class="form-select" name="esRecurrente">
            <option value="false" ${!gasto.esRecurrente ? 'selected' : ''}>No</option>
            <option value="true" ${gasto.esRecurrente ? 'selected' : ''}>Sí</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">
            <i class="bi bi-clock me-2"></i>Frecuencia
          </label>
          <select class="form-select" name="frecuencia">
            <option value="">No aplica</option>
            <option value="Semanal" ${gasto.frecuencia === 'Semanal' ? 'selected' : ''}>Semanal</option>
            <option value="Quincenal" ${gasto.frecuencia === 'Quincenal' ? 'selected' : ''}>Quincenal</option>
            <option value="Mensual" ${gasto.frecuencia === 'Mensual' ? 'selected' : ''}>Mensual</option>
            <option value="Anual" ${gasto.frecuencia === 'Anual' ? 'selected' : ''}>Anual</option>
          </select>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">
          <i class="bi bi-bank me-2"></i>Cuenta Asociada
        </label>
        <input class="form-control" name="cuenta" value="${gasto.cuenta || ''}" 
               placeholder="Cuenta desde donde se realizó el gasto">
      </div>
      
      <div class="form-buttons">
        <button type="submit" class="btn btn-success">
          <i class="bi bi-check-circle me-2"></i>${titulo.includes('Agregar') ? 'Agregar Gasto' : 'Guardar Cambios'}
        </button>
        <button type="button" class="btn btn-secondary" id="cancelarForm">
          <i class="bi bi-x-circle me-2"></i>Cancelar
        </button>
      </div>
    </form>
  `;
}

// ===== FUNCIÓN PARA MOSTRAR MODAL =====
function mostrarModal(contenidoHTML, funcionGuardar) {
  // Crea contenedor modal simple (sin Bootstrap) e inserta contenido
  const modal = document.createElement('div');
  modal.id = 'modalGasto';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
    justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease;
  `;
  modal.innerHTML = contenidoHTML;
  document.body.appendChild(modal);

  // Evento para cancelar
  document.getElementById('cancelarForm').onclick = function () {
    cerrarModal(modal);
  };

  // Evento para guardar
  document.getElementById('formGasto').onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Validación
    if (!validarFormulario(formData)) {
      return;
    }
    
    funcionGuardar(formData);
    cerrarModal(modal);
  };

  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      cerrarModal(modal);
    }
  });
}

// ===== FUNCIÓN PARA CERRAR MODAL =====
function cerrarModal(modal) {
  // Animación y retirada del modal del DOM
  modal.style.animation = 'fadeOut 0.3s ease';
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 300);
}

// ===== FUNCIÓN PARA VALIDAR FORMULARIO =====
function validarFormulario(formData) {
  // Validaciones mínimas de campos obligatorios / valores coherentes
  const monto = parseFloat(formData.get('monto'));
  const categoria = formData.get('categoria');
  const metodo = formData.get('metodo');
  const fecha = formData.get('fecha');
  
  if (!categoria) {
    mostrarMensaje('Por favor selecciona una categoría', 'error');
    return false;
  }
  
  if (!metodo) {
    mostrarMensaje('Por favor selecciona un método de pago', 'error');
    return false;
  }
  
  if (monto <= 0) {
    mostrarMensaje('El monto debe ser mayor a 0', 'error');
    return false;
  }
  
  if (!fecha) {
    mostrarMensaje('Por favor selecciona una fecha', 'error');
    return false;
  }
  
  return true;
}

// ===== FUNCIÓN PARA GUARDAR NUEVO GASTO =====
function guardarNuevoGasto(formData) {
  // Inserta nuevo objeto gasto en localStorage
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  const nuevoGasto = {
    categoria: formData.get('categoria'),
    metodo: formData.get('metodo'),
    monto: parseFloat(formData.get('monto')),
    fecha: formData.get('fecha'),
    descripcion: formData.get('descripcion').trim(),
    esRecurrente: formData.get('esRecurrente') === 'true',
    frecuencia: formData.get('frecuencia'),
    cuenta: formData.get('cuenta').trim(),
    fechaCreacion: new Date().toISOString()
  };
  
  gastos.push(nuevoGasto);
  localStorage.setItem('gastos', JSON.stringify(gastos));
  
  renderGastos();
  calcularResumen();
  mostrarMensaje('¡Gasto agregado exitosamente!', 'success');
}

// ===== FUNCIÓN PARA ACTUALIZAR GASTO =====
function actualizarGasto(idx, formData) {
  // Sustituye datos de un gasto existente por índice
  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  gastos[idx] = {
    ...gastos[idx],
    categoria: formData.get('categoria'),
    metodo: formData.get('metodo'),
    monto: parseFloat(formData.get('monto')),
    fecha: formData.get('fecha'),
    descripcion: formData.get('descripcion').trim(),
    esRecurrente: formData.get('esRecurrente') === 'true',
    frecuencia: formData.get('frecuencia'),
    cuenta: formData.get('cuenta').trim(),
    fechaModificacion: new Date().toISOString()
  };
  
  localStorage.setItem('gastos', JSON.stringify(gastos));
  
  renderGastos();
  calcularResumen();
  mostrarMensaje('¡Gasto actualizado exitosamente!', 'success');
}

// ===== FUNCIÓN PARA CALCULAR RESUMEN =====
function calcularResumen() {
  // Recalcula KPIs mostrados en tarjetas (total, categoría principal, etc.)
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  
  // Calcular total de gastos
  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
  const totalGastosEl = document.getElementById('totalGastos');
  if (totalGastosEl) totalGastosEl.textContent = `$${formatearMonto(totalGastos)}`;
  
  // Encontrar categoría principal
  const categorias = {};
  gastos.forEach(gasto => {
    categorias[gasto.categoria] = (categorias[gasto.categoria] || 0) + gasto.monto;
  });
  
  let categoriaPrincipal = '-';
  let mayorMonto = 0;
  for (const [categoria, monto] of Object.entries(categorias)) {
    if (monto > mayorMonto) {
      mayorMonto = monto;
      categoriaPrincipal = categoria;
    }
  }
  const catPrincipalEl = document.getElementById('categoriaPrincipal');
  if (catPrincipalEl) catPrincipalEl.textContent = categoriaPrincipal;
  const porcentajeCat = document.getElementById('porcentajeCategoria');
  if (porcentajeCat && mayorMonto>0 && totalGastos>0) porcentajeCat.textContent = ((mayorMonto/totalGastos)*100).toFixed(1)+"% del total";

  // Recurrentes
  const recurrentes = gastos.filter(g=>g.esRecurrente);
  const totalRecurrentes = recurrentes.reduce((acc,g)=>acc+g.monto,0);
  const totalRecurrentesEl = document.getElementById('totalRecurrentes');
  if (totalRecurrentesEl) totalRecurrentesEl.textContent = recurrentes.length;
  const porcentajeRecurrentes = document.getElementById('porcentajeRecurrentes');
  if (porcentajeRecurrentes && totalGastos>0) porcentajeRecurrentes.textContent = (totalRecurrentes/totalGastos*100).toFixed(1)+"% del monto";

  // (Promedio diario removido por requerimiento)
  
  // Comparación con mes anterior (simulada)
  const mesAnterior = Math.random() * totalGastos; // Simulación
  const diferencia = totalGastos - mesAnterior;
  const comparacionElement = document.getElementById('comparacion');
  if (comparacionElement){
    if (diferencia > 0) {
      comparacionElement.textContent = `+$${formatearMonto(Math.abs(diferencia))} vs mes anterior`;
      comparacionElement.classList.remove('text-success','text-muted');
      comparacionElement.classList.add('text-danger');
    } else if (diferencia < 0) {
      comparacionElement.textContent = `-$${formatearMonto(Math.abs(diferencia))} vs mes anterior`;
      comparacionElement.classList.remove('text-danger','text-muted');
      comparacionElement.classList.add('text-success');
    } else {
      comparacionElement.textContent = 'Sin cambios vs mes anterior';
      comparacionElement.classList.remove('text-danger','text-success');
      comparacionElement.classList.add('text-muted');
    }
  }
}

// ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
function mostrarMensaje(mensaje, tipo) {
  // Mensajes flotantes temporales (éxito / error)
  const alerta = document.createElement('div');
  alerta.className = `alerta-personalizada alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-contenido">
      <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
      ${mensaje}
    </div>
  `;
  
  // Estilos para la alerta
  const bgColor = tipo === 'success' ? 
    'linear-gradient(135deg, #27ae60, #229954)' : 
    'linear-gradient(135deg, #e74c3c, #c0392b)';
    
  alerta.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 11000;
    padding: 1rem 1.5rem; border-radius: 10px; color: white;
    font-weight: 500; animation: slideInRight 0.3s ease;
    background: ${bgColor};
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(alerta);
  
  setTimeout(() => {
    alerta.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(alerta)) {
        document.body.removeChild(alerta);
      }
    }, 300);
  }, 3000);
}

// ===== FUNCIONES AUXILIARES PARA FORMATO =====
function formatearMonto(monto) {
  // Devuelve monto con formato local (2 decimales)
  return parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatearFecha(fecha) {
  // Formatea fecha ISO (yyyy-mm-dd) a dd mes yyyy local
  const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
}

/* (Lógica de gráficos removida) */