// Deudas Firestore-only
let deudasCache = []

async function waitForDB(maxMs=5000){
  const start = Date.now();
  while ((!window.walletDB || !window.walletDB.db) && Date.now()-start < maxMs){
    await new Promise(r=>setTimeout(r,100));
  }
  return window.walletDB && window.walletDB.db;
}

async function cargarDeudasDesdeFirestore(){
  try {
    await waitForDB();
    if (!window.walletDB) throw new Error('DB no disponible');
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if (auth && !auth.currentUser) await new Promise(r => auth.onAuthStateChanged(()=>r()));
    if (!auth || !auth.currentUser){ console.warn('Deudas: usuario no autenticado aún'); return; }
    deudasCache = await window.walletDB.listDebts();
  } catch(e){ console.error('Error cargando deudas Firestore:', e); deudasCache = []; }
}

async function openAddDeudaModal() {
  const contenedorModalDeuda = document.getElementById('contenedorModalDeuda');
  if (!contenedorModalDeuda) { console.error('Contenedor modal deuda no encontrado'); return; }
  contenedorModalDeuda.innerHTML = '';
  const styleId = 'deuda-firestore-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:10000}.modal-form{background:#fff;border-radius:14px;padding:20px;width:95%;max-width:540px;box-shadow:0 12px 32px rgba(0,0,0,.25)}.modal-form h2{margin:0 0 14px;font-size:1.25rem}.modal-form label{font-weight:600;margin-top:8px}.modal-form input,.modal-form select,.modal-form textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;margin-top:4px}.botones{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}`;
    document.head.appendChild(style);
  }
  contenedorModalDeuda.innerHTML = `
    <div id="modalAgregarDeuda" class="modal-overlay">
      <div class="modal-form">
        <form id="formAgregarDeuda" autocomplete="off">
          <h2>Agregar Deuda</h2>
          <label>Acreedor<input type="text" id="addAcreedorDeuda" required></label>
          <label>Monto<input type="number" id="addMontoDeuda" required min="0" step="0.01"></label>
          <label>Fecha Inicio<input type="date" id="addFechaInicioDeuda" required></label>
          <label>Estado<select id="addEstadoDeuda"><option value="pendiente">Pendiente</option><option value="pagada">Pagada</option><option value="renegociada">Renegociada</option></select></label>
          <label>Fecha Vencimiento (Opcional)<input type="date" id="addFechaVencimientoDeuda"></label>
          <label>Tasa de Interés (%)<input type="number" id="addTasaInteresDeuda" min="0" step="0.01"></label>
          <label>Descripción<textarea id="addDescripcionDeuda"></textarea></label>
          <div class="botones"><button type="submit" class="btn btn-success btn-sm">Guardar</button><button type="button" id="cancelarDeudaFirestore" class="btn btn-secondary btn-sm">Cancelar</button></div>
        </form>
      </div>
    </div>`;
  const modal = document.getElementById('modalAgregarDeuda');
  const form = document.getElementById('formAgregarDeuda');
  const cancelarBtn = document.getElementById('cancelarDeudaFirestore');
    if (form){
    form.addEventListener('submit', async e => {
      console.trace('submit handler triggered: deudas.js (top add modal)')
      e.preventDefault();
      try {
        await waitForDB();
        if (!window.deudasService || typeof window.deudasService.agregarDeuda !== 'function') throw new Error('Servicio de deudas no disponible');
        const datos = {
          acreedor: document.getElementById('addAcreedorDeuda').value.trim(),
          monto: parseFloat(document.getElementById('addMontoDeuda').value),
          fechaInicio: document.getElementById('addFechaInicioDeuda').value,
          estado: document.getElementById('addEstadoDeuda').value,
          fechaVencimiento: document.getElementById('addFechaVencimientoDeuda').value || '',
          tasaInteres: parseFloat(document.getElementById('addTasaInteresDeuda').value || '0'),
          descripcion: document.getElementById('addDescripcionDeuda').value.trim()
        };
        await window.deudasService.agregarDeuda(datos);
        // cargarDeudasDesdeFirestore() and renderDeudas() will be called by the service
        if (modal) modal.remove();
      } catch(err){ console.error('Error guardando deuda:', err); mostrarNotificacion('Error al guardar deuda','danger'); }
    });
  }
  if (cancelarBtn) cancelarBtn.addEventListener('click', ()=>{ if (modal) modal.remove(); });
  if (modal) modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove(); });
}

document.addEventListener('DOMContentLoaded', async () => {
  window.renderDeudas = renderDeudas;
  await cargarDeudasDesdeFirestore();
  renderDeudas();

  // Botón Agregar Deuda
  async function openAddDeudaModal() {
    const contenedorModalDeuda = document.getElementById('contenedorModalDeuda')
    if (!contenedorModalDeuda) { console.error('Contenedor modal deuda no encontrado'); return }
    contenedorModalDeuda.innerHTML = ''
    const styleId = 'deuda-firestore-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:10000}.modal-form{background:#fff;border-radius:14px;padding:20px;width:95%;max-width:540px;box-shadow:0 12px 32px rgba(0,0,0,.25)}.modal-form h2{margin:0 0 14px;font-size:1.25rem}.modal-form label{font-weight:600;margin-top:8px}.modal-form input,.modal-form select,.modal-form textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;margin-top:4px}.botones{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}`
      document.head.appendChild(style)
    }
    contenedorModalDeuda.innerHTML = `
      <div id="modalAgregarDeuda" class="modal-overlay">
        <div class="modal-form">
          <form id="formAgregarDeuda" autocomplete="off">
            <h2>Agregar Deuda</h2>
            <label>Acreedor<input type="text" id="addAcreedorDeuda" required></label>
            <label>Monto<input type="number" id="addMontoDeuda" required min="0" step="0.01"></label>
            <label>Fecha Inicio<input type="date" id="addFechaInicioDeuda" required></label>
            <label>Estado<select id="addEstadoDeuda"><option value="pendiente">Pendiente</option><option value="pagada">Pagada</option><option value="renegociada">Renegociada</option></select></label>
            <label>Fecha Vencimiento (Opcional)<input type="date" id="addFechaVencimientoDeuda"></label>
            <label>Tasa de Interés (%)<input type="number" id="addTasaInteresDeuda" min="0" step="0.01"></label>
            <label>Descripción<textarea id="addDescripcionDeuda"></textarea></label>
            <div class="botones"><button type="submit" class="btn btn-success btn-sm">Guardar</button><button type="button" id="cancelarDeudaFirestore" class="btn btn-secondary btn-sm">Cancelar</button></div>
          </form>
        </div>
      </div>`
    const modal = document.getElementById('modalAgregarDeuda')
    const form = document.getElementById('formAgregarDeuda')
    const cancelarBtn = document.getElementById('cancelarDeudaFirestore')
    if (form) {
      form.addEventListener('submit', async (e) => {
        console.trace('submit handler triggered: deudas.js (DOM add modal)')
        e.preventDefault()
        try {
          if (!window.walletDB) throw new Error('DB no disponible')
          const datos = {
            acreedor: document.getElementById('addAcreedorDeuda').value.trim(),
            monto: parseFloat(document.getElementById('addMontoDeuda').value),
            fechaInicio: document.getElementById('addFechaInicioDeuda').value,
            estado: document.getElementById('addEstadoDeuda').value,
            fechaVencimiento: document.getElementById('addFechaVencimientoDeuda').value || '',
            tasaInteres: parseFloat(document.getElementById('addTasaInteresDeuda').value || '0'),
            descripcion: document.getElementById('addDescripcionDeuda').value.trim()
          }
          await window.deudasService.agregarDeuda(datos)
          // service will reload and re-render
          if (modal) modal.remove()
        } catch(err){ console.error('Error guardando deuda:', err); mostrarNotificacion('Error al guardar deuda','danger') }
      })
    }
    if (cancelarBtn) cancelarBtn.addEventListener('click', () => { if (modal) modal.remove() })
    if (modal) modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove() })
  }

});

function renderDeudas() {
  const tablaEl = document.getElementById('tablaDeudas')
  const tabla = tablaEl ? tablaEl.querySelector('tbody') : null
  const mensajeVacio = document.getElementById('mensajeVacio')
  const deudas = deudasCache || []
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
    btn.addEventListener('click', async function () {
      const idx = this.getAttribute('data-index')
      const deuda = deudas[idx]
      const confirmacion = confirm(`¿Eliminar deuda con ${deuda.acreedor}?\n\nMonto: $${Number.parseFloat(deuda.monto || 0).toLocaleString('es-CO')}`)
      if (confirmacion) {
        try {
          await window.walletDB.deleteDebt(deuda.id)
          await cargarDeudasDesdeFirestore()
          renderDeudas()
          mostrarNotificacion('¡Deuda eliminada exitosamente!','success')
        } catch(err){ console.error('Error eliminando deuda:', err); mostrarNotificacion('Error al eliminar deuda','danger') }
      }
    })
  })

  document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = this.getAttribute('data-index')
      editarDeuda(idx)
    })
  })

  // Ensure any Add buttons open the same modal and remove previous listeners
  document.querySelectorAll('.btn-empty-add, #btnAgregarDeudaPage').forEach((btn) => {
    // replace the node to remove any existing listeners attached by other modules
    const replacement = btn.cloneNode(true)
    btn.parentNode.replaceChild(replacement, btn)
    replacement.onclick = (e) => {
      e.preventDefault()
      if (window.deudasForm && typeof window.deudasForm.abrirModalAgregar === 'function') {
        window.deudasForm.abrirModalAgregar()
      } else if (typeof openAddDeudaModal === 'function') {
        openAddDeudaModal()
      }
    }
  })
}

function editarDeuda(idx) {
  const deudas = deudasCache || []
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
    form.onsubmit = async function (e) {
      e.preventDefault()
      const formData = new FormData(this)
      const updated = {
        acreedor: formData.get('acreedor'),
        monto: parseFloat(formData.get('monto')), 
        fechaInicio: formData.get('fechaInicio'),
        fechaVencimiento: formData.get('fechaVencimiento'),
        tasaInteres: parseFloat(formData.get('tasaInteres')||'0'),
        estado: formData.get('estado'),
        descripcion: formData.get('descripcion')
      }
      try {
        await window.walletDB.updateDebt(deuda.id, updated)
        await cargarDeudasDesdeFirestore()
        contenedorModalEditarDeuda.innerHTML = ''
        renderDeudas()
        mostrarNotificacion('¡Deuda actualizada exitosamente!','success')
      } catch(err){ console.error('Error actualizando deuda:', err); mostrarNotificacion('Error al actualizar deuda','danger') }
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
