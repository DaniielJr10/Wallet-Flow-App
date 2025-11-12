// Consolidated and cleaned up deudas.js
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar y exponer renderDeudas
  window.renderDeudas = renderDeudas
  renderDeudas()

  // Botón Agregar Deuda
  const btnAgregar = document.getElementById('btnAgregarDeudaPage')
  if (btnAgregar) btnAgregar.addEventListener('click', openAddDeudaModal)

  // Botón cerrar sesión (si existe)
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn')
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault()
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?')
      if (confirmar) {
        localStorage.removeItem('walletflow_user_data')
        localStorage.removeItem('walletflow_remembered_user')
        if (window.firebaseAuth) window.firebaseAuth.cerrarSesion()
        window.location.href = '../../login/inicio de sesion/inicio.html'
      }
    })
  }

  // Si viene openForm=true en la URL abrir el formulario automáticamente
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('openForm') === 'true') openAddDeudaModal()
})

function ensureCss(href) {
  try {
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => l.href && l.href.includes(href))
    if (exists) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = encodeURI(href)
    document.head.appendChild(link)
  } catch (e) {
    console.warn('No se pudo inyectar CSS:', e)
  }
}

async function openAddDeudaModal() {
  const contenedorModalDeuda = document.getElementById('contenedorModalDeuda')
  if (!contenedorModalDeuda) {
    console.error('Contenedor para modal de deuda no encontrado.')
    return
  }

  // limpiar
  contenedorModalDeuda.innerHTML = ''

  const formHtmlPath = '../../formularios/formulario-deudas/fordeudas.html'
  const formJsPath = '../../formularios/formulario-deudas/fordeudas.js'
  const formCssPath = '../../formularios/formulario-deudas/fordeudas.css'

  try {
    // Cargar y mostrar HTML + CSS
    ensureCss(formCssPath)
    const resp = await fetch(encodeURI(formHtmlPath))
    if (!resp.ok) throw new Error('HTTP ' + resp.status)
    const html = await resp.text()
    contenedorModalDeuda.innerHTML = html

    // Mostrar modal inmediatamente (si existe)
    const modalImmediate = document.getElementById('modalAgregarDeuda')
    if (modalImmediate) {
      modalImmediate.classList.remove('d-none')
      modalImmediate.style.display = 'flex'
    }

    // Cargar script
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = formJsPath
      script.onload = () => resolve()
      script.onerror = (e) => reject(e)
      document.body.appendChild(script)
    })

    // Inicializar si existe la función
    if (typeof initFormularioDeuda === 'function') {
      try {
        initFormularioDeuda(renderDeudas)
      } catch (e) {
        console.error('Error ejecutando initFormularioDeuda:', e)
      }
    } else {
      console.warn('initFormularioDeuda no encontrada después de cargar script')
    }

    // Asegurar visible
    setTimeout(() => {
      const modal = document.getElementById('modalAgregarDeuda')
      if (modal) {
        modal.classList.remove('d-none')
        modal.style.display = 'flex'
      }
    }, 120)

  } catch (err) {
  console.error('Error loading deuda form:', err)
  // No mostrar notificación visual para el usuario aquí (el fallback embebido gestiona la experiencia)
  console.warn('Fallback embebido para formulario de deuda activado:', err)

    // (Se omitió el aviso emergente en caso de error para evitar mostrar mensajes intrusivos en la UI)
    // Para depuración, dejamos un aviso en la consola.
    console.warn('No se pudo cargar el formulario en la app. Fallback embebido activo. (Aviso visual eliminado)')

    // Embedded fallback: inyectar un modal mínimo y su lógica para permitir el guardado sin dependencias externas
    try {
      const fallbackStyleId = 'deuda-fallback-styles'
      if (!document.getElementById(fallbackStyleId)) {
        const style = document.createElement('style')
        style.id = fallbackStyleId
        style.textContent = `
          .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000}
          .modal-form{background:#fff;border-radius:12px;padding:18px;width:92%;max-width:520px;box-shadow:0 12px 30px rgba(0,0,0,0.2)}
          .modal-form h2{margin:0 0 12px}
          .modal-form label{display:block;margin-bottom:6px;font-weight:600}
          .modal-form input,.modal-form select,.modal-form textarea{width:100%;padding:10px;border-radius:8px;border:1px solid #e6e6e6;margin-bottom:12px}
          .modal-form .botones{display:flex;gap:8px;justify-content:flex-end}
        `
        document.head.appendChild(style)
      }

      const embeddedHtml = `
        <div id="modalAgregarDeuda" class="modal-overlay">
          <div class="modal-form">
            <form id="formAgregarDeuda" autocomplete="off">
              <h2>Agregar Deuda</h2>
              <label for="addAcreedorDeuda">Acreedor</label>
              <input type="text" id="addAcreedorDeuda" required>
              <label for="addMontoDeuda">Monto</label>
              <input type="number" id="addMontoDeuda" required min="0" step="0.01">
              <label for="addFechaInicioDeuda">Fecha de Inicio</label>
              <input type="date" id="addFechaInicioDeuda" required>
              <label for="addEstadoDeuda">Estado</label>
              <select id="addEstadoDeuda">
                <option value="pendiente">Pendiente</option>
                <option value="pagada">Pagada</option>
                <option value="renegociada">Renegociada</option>
              </select>
              <label for="addFechaVencimientoDeuda">Fecha de Vencimiento (Opcional)</label>
              <input type="date" id="addFechaVencimientoDeuda">
              <label for="addTasaInteresDeuda">Tasa de Interés (%)</label>
              <input type="number" id="addTasaInteresDeuda" min="0" step="0.01">
              <label for="addDescripcionDeuda">Descripción</label>
              <textarea id="addDescripcionDeuda"></textarea>
              <div class="botones" style="margin-top:6px">
                <button type="submit" class="btn btn-success btn-sm">Guardar</button>
                <button type="button" id="cancelarDeudaEmbedded" class="btn btn-secondary btn-sm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      `

      contenedorModalDeuda.innerHTML = embeddedHtml

      // Lógica mínima del formulario embebido
      const modal = document.getElementById('modalAgregarDeuda')
      const form = document.getElementById('formAgregarDeuda')
      const cancelarBtn = document.getElementById('cancelarDeudaEmbedded')

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault()
          const datos = {
            acreedor: document.getElementById('addAcreedorDeuda').value,
            monto: document.getElementById('addMontoDeuda').value,
            fechaInicio: document.getElementById('addFechaInicioDeuda').value,
            estado: document.getElementById('addEstadoDeuda').value,
            fechaVencimiento: document.getElementById('addFechaVencimientoDeuda') ? document.getElementById('addFechaVencimientoDeuda').value : '',
            tasaInteres: document.getElementById('addTasaInteresDeuda') ? document.getElementById('addTasaInteresDeuda').value : '',
            descripcion: document.getElementById('addDescripcionDeuda') ? document.getElementById('addDescripcionDeuda').value : '',
          }
          const deudas = JSON.parse(localStorage.getItem('deudas')) || []
          datos.id = Date.now()
          deudas.push(datos)
          localStorage.setItem('deudas', JSON.stringify(deudas))
          if (modal && modal.parentNode) modal.parentNode.removeChild(modal)
          mostrarNotificacion && mostrarNotificacion('¡Deuda guardada exitosamente!', 'success')
          renderDeudas()
        })
      }

      if (cancelarBtn) cancelarBtn.addEventListener('click', () => {
        const m = document.getElementById('modalAgregarDeuda')
        if (m && m.parentNode) m.parentNode.removeChild(m)
      })

      if (modal) modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.remove() })

    } catch (embedErr) {
      console.error('Error al inyectar modal embebido de deuda:', embedErr)
    }
  }
}

function renderDeudas() {
  const tablaEl = document.getElementById('tablaDeudas')
  const tabla = tablaEl ? tablaEl.querySelector('tbody') : null
  const mensajeVacio = document.getElementById('mensajeVacio')
  const deudas = JSON.parse(localStorage.getItem('deudas')) || []
  if (tabla) tabla.innerHTML = ''

  let totalDeuda = 0
  let deudaPendiente = 0
  let deudasPagadas = 0

  if (deudas.length === 0) {
    if (mensajeVacio) mensajeVacio.style.display = 'block'
    if (tablaEl) tablaEl.style.display = 'none'
  } else {
    if (mensajeVacio) mensajeVacio.style.display = 'none'
    if (tablaEl) tablaEl.style.display = 'table'
  }

  deudas.forEach((deuda, index) => {
    totalDeuda += Number.parseFloat(deuda.monto || 0)
    if (deuda.estado === 'pendiente') deudaPendiente += Number.parseFloat(deuda.monto || 0)
    if (deuda.estado === 'pagada') deudasPagadas += Number.parseFloat(deuda.monto || 0)

    if (!tabla) return
    const fila = document.createElement('tr')
    let estadoClass = 'estado-pendiente'
    let estadoTexto = 'Pendiente'
    if (deuda.estado === 'pagada') {
      estadoClass = 'estado-pagada'
      estadoTexto = 'Pagada'
    } else if (deuda.estado === 'renegociada') {
      estadoClass = 'estado-renegociada'
      estadoTexto = 'Renegociada'
    }

    fila.innerHTML = `
      <td><strong>${deuda.acreedor || ''}</strong></td>
      <td><strong class="text-danger">$${Number.parseFloat(deuda.monto || 0).toLocaleString('es-CO', {minimumFractionDigits: 2})}</strong></td>
      <td>${deuda.fechaInicio ? new Date(deuda.fechaInicio).toLocaleDateString('es-CO') : ''}</td>
      <td>${deuda.fechaVencimiento ? new Date(deuda.fechaVencimiento).toLocaleDateString('es-CO') : "<span class='text-muted'>Sin fecha</span>"}</td>
      <td>${deuda.tasaInteres ? `<span class="badge bg-info">${deuda.tasaInteres}%</span>` : "<span class='text-muted'>-</span>"}</td>
      <td><span class="${estadoClass}">${estadoTexto}</span></td>
      <td><small class="text-muted">${deuda.descripcion || 'Sin descripción'}</small></td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-warning me-1 btn-editar" data-index="${index}" title="Editar deuda"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}" title="Eliminar deuda"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    `
    tabla.appendChild(fila)
  })

  // actualizar resúmenes
  const totalEl = document.getElementById('totalDeuda')
  const pendienteEl = document.getElementById('deudaPendiente')
  const pagadasEl = document.getElementById('deudasPagadas')
  if (totalEl) totalEl.textContent = `$${totalDeuda.toLocaleString('es-CO', {minimumFractionDigits: 2})}`
  if (pendienteEl) pendienteEl.textContent = `$${deudaPendiente.toLocaleString('es-CO', {minimumFractionDigits: 2})}`
  if (pagadasEl) pagadasEl.textContent = `$${deudasPagadas.toLocaleString('es-CO', {minimumFractionDigits: 2})}`

  // progress
  const debtProgressBar = document.getElementById('debtProgressBar')
  const debtProgressText = document.getElementById('debtProgressText')
  if (debtProgressBar && debtProgressText) {
    let p = 0
    if (totalDeuda > 0) p = (deudasPagadas / totalDeuda) * 100
    debtProgressBar.style.width = `${p.toFixed(2)}%`
    debtProgressBar.setAttribute('aria-valuenow', p.toFixed(2))
    debtProgressText.textContent = `${p.toFixed(2)}% Pagado`
  }

  // attach actions
  document.querySelectorAll('.btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index')
      const deuda = deudas[idx]
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la deuda con ${deuda.acreedor}?\n\nMonto: $${Number.parseFloat(deuda.monto || 0).toLocaleString('es-CO')}`)
      if (confirmacion) {
        deudas.splice(idx, 1)
        localStorage.setItem('deudas', JSON.stringify(deudas))
        renderDeudas()
        mostrarNotificacion('¡Deuda eliminada exitosamente!', 'success')
      }
    })
  })

  document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index')
      editarDeuda(idx)
    })
  })

  // Asegurar que cualquier botón de tipo "Agregar" (incluyendo el del empty-state) abra el formulario
  document.querySelectorAll('.btn-empty-add, #btnAgregarDeudaPage').forEach((btn) => {
    // evitar duplicar listeners si ya existen
    btn.removeEventListener && btn.removeEventListener('click', openAddDeudaModal)
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      openAddDeudaModal()
    })
  })
}

function editarDeuda(idx) {
  const deudas = JSON.parse(localStorage.getItem('deudas')) || []
  const deuda = deudas[idx]
  const contenedorModalEditarDeuda = document.getElementById('contenedorModalEditarDeuda')
  if (!contenedorModalEditarDeuda) {
    console.error('Contenedor para modal de edición de deuda no encontrado.')
    return
  }
  contenedorModalEditarDeuda.innerHTML = ''

  const formHtml = `
    <div id="modalEditarDeuda" class="modal-overlay">
      <form id="formEditarDeuda" class="form-editar">
        <h5 class="form-titulo">Editar Deuda</h5>
        <label class="form-label">Acreedor:
          <input class="form-control" name="acreedor" value="${deuda.acreedor}" required>
        </label>
        <label class="form-label">Monto:
          <input class="form-control" name="monto" type="number" min="0" step="0.01" value="${deuda.monto}" required>
        </label>
        <label class="form-label">Fecha Inicio:
          <input class="form-control" name="fechaInicio" type="date" value="${deuda.fechaInicio}" required>
        </label>
        <label class="form-label">Fecha Vencimiento:
          <input class="form-control" name="fechaVencimiento" type="date" value="${deuda.fechaVencimiento || ''}">
        </label>
        <label class="form-label">Tasa Interés (%):
          <input class="form-control" name="tasaInteres" type="number" step="0.01" value="${deuda.tasaInteres || ''}">
        </label>
        <label class="form-label">Estado:
          <select class="form-control" name="estado">
            <option value="pendiente" ${deuda.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="pagada" ${deuda.estado === 'pagada' ? 'selected' : ''}>Pagada</option>
            <option value="renegociada" ${deuda.estado === 'renegociada' ? 'selected' : ''}>Renegociada</option>
          </select>
        </label>
        <label class="form-label">Descripción:
          <input class="form-control" name="descripcion" value="${deuda.descripcion || ''}">
        </label>
        <div class="form-buttons">
          <button type="submit" class="btn btn-success btn-sm">Guardar</button>
          <button type="button" class="btn btn-secondary btn-sm" id="cancelarEditar">Cancelar</button>
        </div>
      </form>
    </div>
  `

  contenedorModalEditarDeuda.innerHTML = formHtml

  const cancelar = document.getElementById('cancelarEditar')
  if (cancelar) cancelar.onclick = () => { contenedorModalEditarDeuda.innerHTML = '' }

  const form = document.getElementById('formEditarDeuda')
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault()
      const formData = new FormData(this)
      deudas[idx] = {
        acreedor: formData.get('acreedor'),
        monto: formData.get('monto'),
        fechaInicio: formData.get('fechaInicio'),
        fechaVencimiento: formData.get('fechaVencimiento'),
        tasaInteres: formData.get('tasaInteres'),
        estado: formData.get('estado'),
        descripcion: formData.get('descripcion'),
      }
      localStorage.setItem('deudas', JSON.stringify(deudas))
      contenedorModalEditarDeuda.innerHTML = ''
      renderDeudas()
      mostrarNotificacion('¡Deuda actualizada exitosamente!', 'success')
    }
  }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div')
  notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`
  notificacion.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border: none;
  `
  notificacion.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `
  document.body.appendChild(notificacion)
  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.style.opacity = '0'
      notificacion.style.transform = 'translateX(100%)'
      setTimeout(() => notificacion.remove(), 300)
    }
  }, 4000)
}
