document.addEventListener('DOMContentLoaded', function () {
  // Variables globales
  let ingresosOriginales = [];
  let ingresosFiltrados = [];
  let paginaActual = 1;
  const registrosPorPagina = 10;

  // Inicializar funcionalidades
  renderIngresos();
  initFormularioIngreso();
  initFiltros();
  initAccionesTabla();
  
  // Configurar botón para abrir modal
  const btnAgregarIngreso = document.getElementById('btnAgregarIngreso');
  if (btnAgregarIngreso) {
    btnAgregarIngreso.addEventListener('click', function() {
      abrirModalIngreso();
    });
  }

  function abrirModalIngreso() {
    const modal = document.getElementById('modalAgregarIngreso');
    if (modal) {
      modal.classList.remove('d-none');
      // Establecer fecha actual por defecto
      const fechaHoy = new Date().toISOString().split('T')[0];
      document.getElementById('addFechaIngreso').value = fechaHoy;
    }
  }

  // Función de filtros
  function initFiltros() {
    const buscarInput = document.getElementById('buscarIngreso');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroMes = document.getElementById('filtroMes');
    const limpiarFiltros = document.getElementById('limpiarFiltros');

    // Búsqueda en tiempo real
    if (buscarInput) {
      buscarInput.addEventListener('input', aplicarFiltros);
    }

    // Filtro por categoría
    if (filtroCategoria) {
      filtroCategoria.addEventListener('change', aplicarFiltros);
    }

    // Filtro por mes
    if (filtroMes) {
      filtroMes.addEventListener('change', aplicarFiltros);
    }

    // Limpiar filtros
    if (limpiarFiltros) {
      limpiarFiltros.addEventListener('click', function() {
        buscarInput.value = '';
        filtroCategoria.value = '';
        filtroMes.value = '';
        aplicarFiltros();
      });
    }
  }

  function aplicarFiltros() {
    const textoBusqueda = document.getElementById('buscarIngreso').value.toLowerCase();
    const categoriaFiltro = document.getElementById('filtroCategoria').value;
    const mesFiltro = document.getElementById('filtroMes').value;

    ingresosFiltrados = ingresosOriginales.filter(ingreso => {
      const coincideTexto = !textoBusqueda || 
        ingreso.descripcion.toLowerCase().includes(textoBusqueda) ||
        ingreso.categoria.toLowerCase().includes(textoBusqueda) ||
        ingreso.metodo.toLowerCase().includes(textoBusqueda);

      const coincideCategoria = !categoriaFiltro || ingreso.categoria === categoriaFiltro;

      const coincideMes = !mesFiltro || ingreso.fecha.startsWith(mesFiltro);

      return coincideTexto && coincideCategoria && coincideMes;
    });

    paginaActual = 1;
    renderTablaConPaginacion();
  }

  // Acciones de tabla
  function initAccionesTabla() {
    const exportarBtn = document.getElementById('exportarDatos');
    const selectAllBtn = document.getElementById('selectAll');
    const seleccionarTodoBtn = document.getElementById('seleccionarTodo');
    const eliminarSeleccionadosBtn = document.getElementById('eliminarSeleccionados');

    if (exportarBtn) {
      exportarBtn.addEventListener('click', exportarDatos);
    }

    if (selectAllBtn) {
      selectAllBtn.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = this.checked);
      });
    }

    if (seleccionarTodoBtn) {
      seleccionarTodoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const selectAll = document.getElementById('selectAll');
        selectAll.checked = true;
        selectAll.dispatchEvent(new Event('change'));
      });
    }

    if (eliminarSeleccionadosBtn) {
      eliminarSeleccionadosBtn.addEventListener('click', function(e) {
        e.preventDefault();
        eliminarSeleccionados();
      });
    }
  }

  function exportarDatos() {
    const datos = ingresosFiltrados.map(ingreso => ({
      Categoría: ingreso.categoria,
      Método: ingreso.metodo,
      Monto: ingreso.monto,
      Fecha: ingreso.fecha,
      Descripción: ingreso.descripcion,
      Recurrente: ingreso.esRecurrente ? 'Sí' : 'No',
      Frecuencia: ingreso.frecuencia || '-',
      Cuenta: ingreso.cuenta || '-'
    }));

    const csv = convertirACSV(datos);
    descargarCSV(csv, 'ingresos.csv');
  }

  function convertirACSV(datos) {
    if (datos.length === 0) return '';
    
    const headers = Object.keys(datos[0]);
    const csvContent = [
      headers.join(','),
      ...datos.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }

  function descargarCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function eliminarSeleccionados() {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    if (indices.length === 0) {
      mostrarMensaje('No hay elementos seleccionados', 'warning');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de eliminar ${indices.length} ingreso(s)?`);
    if (confirmacion) {
      // Eliminar en orden inverso para mantener índices
      indices.sort((a, b) => b - a).forEach(index => {
        ingresosOriginales.splice(index, 1);
      });
      
      localStorage.setItem('ingresos', JSON.stringify(ingresosOriginales));
      renderIngresos();
      mostrarMensaje(`${indices.length} ingreso(s) eliminado(s) exitosamente`, 'success');
    }
  }

  function renderIngresos() {
    ingresosOriginales = JSON.parse(localStorage.getItem('ingresos')) || [];
    ingresosFiltrados = [...ingresosOriginales];
    
    // Actualizar resúmenes
    actualizarResumenes(ingresosOriginales);
    
    // Renderizar tabla con paginación
    renderTablaConPaginacion();
  }

  function renderTablaConPaginacion() {
    const tabla = document.getElementById('tablaIngresos').querySelector('tbody');
    tabla.innerHTML = '';
    
    // Verificar si hay datos
    if (ingresosFiltrados.length === 0) {
      mostrarEstadoVacio(tabla);
      actualizarPaginacion(0, 0);
      return;
    }
    
    // Calcular paginación
    const totalRegistros = ingresosFiltrados.length;
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const ingresosPagina = ingresosFiltrados.slice(inicio, fin);
    
    // Renderizar filas
    ingresosPagina.forEach((ingreso, indexLocal) => {
      const indexGlobal = ingresosOriginales.findIndex(item => 
        item.fecha === ingreso.fecha && 
        item.monto === ingreso.monto && 
        item.categoria === ingreso.categoria
      );
      
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>
          <input type="checkbox" data-index="${indexGlobal}">
        </td>
        <td>
          <span class="categoria-badge">${ingreso.categoria}</span>
        </td>
        <td>
          <span class="fecha-formato">${formatearFecha(ingreso.fecha)}</span>
        </td>
        <td>
          <span class="metodo-pago">${ingreso.metodo}</span>
        </td>
        <td>
          <span class="monto-destacado">$${formatearMonto(ingreso.monto)}</span>
        </td>
        <td>
          <span class="descripcion-texto" title="${ingreso.descripcion || 'Sin descripción'}">
            ${truncarTexto(ingreso.descripcion || 'Sin descripción', 30)}
          </span>
        </td>
        <td>
          <span class="status-badge ${ingreso.esRecurrente ? 'badge-recurrente' : 'badge-no-recurrente'}">
            ${ingreso.esRecurrente ? 'Sí' : 'No'}
          </span>
        </td>
        <td>
          <span class="frecuencia-texto">${ingreso.frecuencia || '-'}</span>
        </td>
        <td>
          <span class="cuenta-texto">${ingreso.cuenta || '-'}</span>
        </td>
        <td>
          <div class="botones-accion">
            <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${indexGlobal}" title="Editar ingreso">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-index="${indexGlobal}" title="Eliminar ingreso">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tabla.appendChild(fila);
    });

    // Actualizar información de paginación
    actualizarPaginacion(totalRegistros, totalPaginas);
    
    // Configurar eventos
    configurarEventosTabla();
  }

  function actualizarPaginacion(totalRegistros, totalPaginas) {
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');
    
    // Información
    const inicio = (paginaActual - 1) * registrosPorPagina + 1;
    const fin = Math.min(paginaActual * registrosPorPagina, totalRegistros);
    paginationInfo.textContent = `Mostrando ${inicio}-${fin} de ${totalRegistros} registros`;
    
    // Controles
    paginationControls.innerHTML = '';
    
    if (totalPaginas <= 1) return;
    
    // Botón anterior
    const prevBtn = document.createElement('li');
    prevBtn.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = `<a class="page-link" href="#" data-page="${paginaActual - 1}">‹</a>`;
    paginationControls.appendChild(prevBtn);
    
    // Páginas
    for (let i = Math.max(1, paginaActual - 2); i <= Math.min(totalPaginas, paginaActual + 2); i++) {
      const pageBtn = document.createElement('li');
      pageBtn.className = `page-item ${i === paginaActual ? 'active' : ''}`;
      pageBtn.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      paginationControls.appendChild(pageBtn);
    }
    
    // Botón siguiente
    const nextBtn = document.createElement('li');
    nextBtn.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    nextBtn.innerHTML = `<a class="page-link" href="#" data-page="${paginaActual + 1}">›</a>`;
    paginationControls.appendChild(nextBtn);
    
    // Eventos de paginación
    paginationControls.addEventListener('click', function(e) {
      e.preventDefault();
      if (e.target.matches('.page-link') && !e.target.closest('.disabled')) {
        paginaActual = parseInt(e.target.dataset.page);
        renderTablaConPaginacion();
      }
    });
  }

  function configurarEventosTabla() {
    // Configurar eventos con mejor feedback
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este ingreso?\n\nEsta acción no se puede deshacer.');
        if (confirmacion) {
          // Animación de eliminación
          const fila = this.closest('tr');
          fila.style.transition = 'all 0.3s ease';
          fila.style.opacity = '0';
          fila.style.transform = 'translateX(-100px)';
          
          setTimeout(() => {
            ingresosOriginales.splice(idx, 1);
            localStorage.setItem('ingresos', JSON.stringify(ingresosOriginales));
            renderIngresos();
            mostrarMensaje('¡Ingreso eliminado exitosamente!', 'success');
          }, 300);
        }
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        editarIngreso(idx);
      });
    });

    // Actualizar estado del checkbox principal
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const selectAll = document.getElementById('selectAll');
    
    checkboxes.forEach(cb => {
      cb.addEventListener('change', function() {
        const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        selectAll.checked = checkedBoxes.length === checkboxes.length;
        selectAll.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
      });
    });
  }

  // Función para truncar texto
  function truncarTexto(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }

  // Función para mostrar estado vacío
  function mostrarEstadoVacio(tabla) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td colspan="10" class="text-center estado-vacio">
        <div class="py-5">
          <div class="icono-vacio mb-3">
            <i class="bi bi-inbox" style="font-size: 4rem; color: #bdc3c7;"></i>
          </div>
          <h5 class="text-muted mb-2">No hay ingresos registrados</h5>
          <p class="text-muted mb-4">Comienza agregando tu primer ingreso para llevar el control de tus finanzas</p>
          <button class="btn btn-success btn-agregar-primero">
            <i class="bi bi-plus-circle me-2"></i>Agregar Mi Primer Ingreso
          </button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);

    // Agregar evento al botón
    fila.querySelector('.btn-agregar-primero').addEventListener('click', abrirModalIngreso);
  }

  // Función para actualizar resúmenes
  function actualizarResumenes(ingresos) {
    // Calcular total de ingresos
    const totalIngresos = ingresos.reduce((total, ingreso) => {
      return total + parseFloat(ingreso.monto || 0);
    }, 0);

    // Encontrar categoría principal
    const categorias = {};
    ingresos.forEach(ingreso => {
      const categoria = ingreso.categoria || 'Sin categoría';
      categorias[categoria] = (categorias[categoria] || 0) + parseFloat(ingreso.monto || 0);
    });

    const categoriaPrincipal = Object.keys(categorias).reduce((a, b) => 
      categorias[a] > categorias[b] ? a : b, 'Sin datos'
    );

    // Calcular promedio mensual (últimos 3 meses)
    const hoy = new Date();
    const hace3Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
    
    const ingresosRecientes = ingresos.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha);
      return fechaIngreso >= hace3Meses;
    });

    const totalRecientes = ingresosRecientes.reduce((total, ingreso) => {
      return total + parseFloat(ingreso.monto || 0);
    }, 0);

    const promedioMensual = totalRecientes / 3;

    // Actualizar los elementos en el DOM
    const totalElement = document.querySelector('.total-amount');
    const categoriaElement = document.querySelector('.ingreso-principal');
    const promedioElement = document.querySelector('.promedio-amount');
    const conteoElement = document.querySelector('.total-count');
    
    if (totalElement) {
      totalElement.textContent = `$${formatearMonto(totalIngresos)}`;
    }
    
    if (categoriaElement) {
      categoriaElement.textContent = categoriaPrincipal;
    }

    if (promedioElement) {
      promedioElement.textContent = `$${formatearMonto(promedioMensual)}`;
    }

    if (conteoElement) {
      conteoElement.textContent = ingresos.length;
    }
  }

  function editarIngreso(idx) {
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    const ingreso = ingresos[idx];

    const formHtml = `
      <form id="formEditarIngreso" class="form-editar">
        <h5 class="form-titulo">
          <i class="bi bi-pencil-square me-2"></i>Editar Ingreso
        </h5>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-tag me-2"></i>Categoría
          </label>
          <input class="form-control" name="categoria" value="${ingreso.categoria}" required>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-credit-card me-2"></i>Método
          </label>
          <input class="form-control" name="metodo" value="${ingreso.metodo}" required>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-currency-dollar me-2"></i>Monto
            </label>
            <input class="form-control" name="monto" type="number" min="0" step="0.01" value="${ingreso.monto}" required>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-calendar me-2"></i>Fecha
            </label>
            <input class="form-control" name="fecha" type="date" value="${ingreso.fecha}" required>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-file-text me-2"></i>Descripción
          </label>
          <textarea class="form-control" name="descripcion" rows="2" placeholder="Descripción del ingreso">${ingreso.descripcion || ''}</textarea>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-repeat me-2"></i>Recurrente
            </label>
            <select class="form-select" name="esRecurrente">
              <option value="true" ${ingreso.esRecurrente ? 'selected' : ''}>Sí</option>
              <option value="false" ${!ingreso.esRecurrente ? 'selected' : ''}>No</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-clock me-2"></i>Frecuencia
            </label>
            <select class="form-select" name="frecuencia">
              <option value="">Seleccionar...</option>
              <option value="Semanal" ${ingreso.frecuencia === 'Semanal' ? 'selected' : ''}>Semanal</option>
              <option value="Quincenal" ${ingreso.frecuencia === 'Quincenal' ? 'selected' : ''}>Quincenal</option>
              <option value="Mensual" ${ingreso.frecuencia === 'Mensual' ? 'selected' : ''}>Mensual</option>
              <option value="Anual" ${ingreso.frecuencia === 'Anual' ? 'selected' : ''}>Anual</option>
            </select>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-bank me-2"></i>Cuenta
          </label>
          <input class="form-control" name="cuenta" value="${ingreso.cuenta || ''}" placeholder="Cuenta asociada">
        </div>
        
        <div class="form-buttons">
          <button type="submit" class="btn btn-success">
            <i class="bi bi-check-circle me-2"></i>Guardar Cambios
          </button>
          <button type="button" class="btn btn-secondary" id="cancelarEditar">
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
        </div>
      </form>
    `;

    const modal = document.createElement('div');
    modal.id = 'modalEditarIngreso';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
      justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;
    modal.innerHTML = formHtml;
    document.body.appendChild(modal);

    // Mejorar el evento de cancelar
    document.getElementById('cancelarEditar').onclick = function () {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    // Mejorar el envío del formulario
    document.getElementById('formEditarIngreso').onsubmit = function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      // Validación mejorada
      const monto = parseFloat(formData.get('monto'));
      if (monto <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
      }
      
      ingresos[idx] = {
        categoria: formData.get('categoria').trim(),
        metodo: formData.get('metodo').trim(),
        monto: monto,
        fecha: formData.get('fecha'),
        descripcion: formData.get('descripcion').trim(),
        esRecurrente: formData.get('esRecurrente') === 'true',
        frecuencia: formData.get('frecuencia'),
        cuenta: formData.get('cuenta').trim()
      };
      
      localStorage.setItem('ingresos', JSON.stringify(ingresos));
      
      // Animación de cierre y actualización
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(modal);
        renderIngresos();
        mostrarMensaje('¡Ingreso actualizado exitosamente!', 'success');
      }, 300);
    };

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      }
    });
  }

  // Función para mostrar mensajes mejorada
  function mostrarMensaje(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta-personalizada alerta-${tipo}`;
    alerta.innerHTML = `
      <div class="alerta-contenido">
        <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${mensaje}
      </div>
    `;
    
    // Estilos para la alerta
    alerta.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 11000;
      padding: 1rem 1.5rem; border-radius: 10px; color: white;
      font-weight: 500; animation: slideInRight 0.3s ease;
      background: ${tipo === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
      alerta.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(alerta);
      }, 300);
    }, 3000);
  }

  // Funciones auxiliares para mejor formato
  function formatearMonto(monto) {
    return parseFloat(monto).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatearFecha(fecha) {
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
  }

  // Agregar estilos dinámicos para animaciones
  const estilosAnimacion = document.createElement('style');
  estilosAnimacion.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    
    .categoria-badge { 
      background: linear-gradient(135deg, #3498db, #2980b9); 
      color: white; padding: 0.25rem 0.75rem; 
      border-radius: 20px; font-size: 0.85rem; font-weight: 500; 
    }
    .monto-destacado { 
      color: #27ae60; font-weight: 700; font-size: 1.1rem; 
    }
    .fecha-formato { 
      color: #7f8c8d; font-weight: 500; 
    }
    .badge-si { 
      background: linear-gradient(135deg, #2ecc71, #27ae60) !important; 
      color: white; padding: 0.25rem 0.5rem; border-radius: 10px; font-size: 0.8rem; 
    }
    .badge-no { 
      background: linear-gradient(135deg, #95a5a6, #7f8c8d) !important; 
      color: white; padding: 0.25rem 0.5rem; border-radius: 10px; font-size: 0.8rem; 
    }
    .botones-accion { display: flex; gap: 0.25rem; }
  `;
  document.head.appendChild(estilosAnimacion);
});

// Lógica del formulario de ingreso
function initFormularioIngreso() {
  // Elementos del formulario
  const modal = document.getElementById('modalAgregarIngreso');
  const form = document.getElementById('formAgregarIngreso');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const nextStepBtn = document.querySelector('.next-step-btn');
  const prevStepBtn = document.querySelector('.prev-step-btn');
  const checkRecurrente = document.getElementById('addCheckRecurrenteIngreso');
  const frecuenciaOptions = document.getElementById('addFrecuenciaOptionsIngreso');
  const checkCuenta = document.getElementById('addCheckCuentaIngreso');
  const cuentaOptions = document.getElementById('addCuentaAsociadaOptionsIngreso');
  const cancelarBtn = document.getElementById('cancelarIngreso');

  // Paso siguiente
  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }
  
  // Paso anterior
  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', function () {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }
  
  // Mostrar/ocultar frecuencia
  if (checkRecurrente) {
    checkRecurrente.addEventListener('change', function () {
      frecuenciaOptions.classList.toggle('visible', checkRecurrente.checked);
    });
  }
  
  // Mostrar/ocultar cuenta asociada
  if (checkCuenta) {
    checkCuenta.addEventListener('change', function () {
      cuentaOptions.classList.toggle('visible', checkCuenta.checked);
    });
  }
  
  // Cancelar y cerrar modal
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', function () {
      cerrarModalIngreso();
    });
  }
  
  // Cerrar modal con Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('d-none')) {
      cerrarModalIngreso();
    }
  });
  
  // Cerrar modal al hacer clic fuera del contenido
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        cerrarModalIngreso();
      }
    });
  }
  
  // Envío del formulario
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const datos = {
        categoria: document.getElementById('addCategoriaIngreso').value,
        metodo: document.getElementById('addMetodoIngreso').value,
        monto: document.getElementById('addMontoIngreso').value,
        fecha: document.getElementById('addFechaIngreso').value,
        descripcion: document.getElementById('addDescripcionIngreso').value,
        esRecurrente: checkRecurrente.checked,
        frecuencia: document.getElementById('addFrecuenciaIngreso').value,
        tieneCuenta: checkCuenta.checked,
        cuenta: document.getElementById('addCuentaAsociadaIngreso').value
      };
      
      // Guardar en localStorage
      let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
      ingresos.push(datos);
      localStorage.setItem('ingresos', JSON.stringify(ingresos));
      
      // Mostrar mensaje de éxito
      mostrarMensaje('¡Ingreso guardado exitosamente!', 'success');
      
      // Actualizar la tabla
      renderIngresos();
      
      // Cerrar modal
      cerrarModalIngreso();
    });
  }
  
  // Función para cerrar y limpiar el modal
  function cerrarModalIngreso() {
    modal.classList.add('d-none');
    if (form) {
      form.reset();
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      frecuenciaOptions.classList.remove('visible');
      cuentaOptions.classList.remove('visible');
    }
  }
}

// Funcionalidad para cerrar sesión con confirmación
document.addEventListener('DOMContentLoaded', function () {
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Mostrar confirmación con alert
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmar) {
        // Si confirma, limpiar datos de sesión y redirigir
        localStorage.removeItem('walletflow_current_user');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Redirigir al inicio de sesión
  window.location.href = '../../login/inicio de sesion/inicio.html';
      }
      // Si no confirma, no hace nada
    });
  }
});
