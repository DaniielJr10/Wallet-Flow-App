/* Ahorros: migrado a Firestore (subcolección savings del usuario) */
let ahorrosCache = [];
let filtradosCache = [];
document.addEventListener('DOMContentLoaded', initAhorrosUI);

async function asegurarAuth(maxEsperas = 8, intervaloMs = 250) {
  const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  // Escuchar primer cambio
  await new Promise(resolve => auth.onAuthStateChanged(() => resolve()));
  if (auth.currentUser) return auth.currentUser;
  // Reintentos suaves mientras se hidrata la sesión persistida
  for (let i = 0; i < maxEsperas && !auth.currentUser; i++) {
    await new Promise(r => setTimeout(r, intervaloMs));
  }
  return auth.currentUser;
}

async function cargarAhorrosDesdeFirestore() {
  const user = await asegurarAuth();
  if (!user) {
    console.warn('Ahorros: usuario no autenticado aún');
    return; // Salida silenciosa, UI queda vacía hasta login
  }
  try {
    if (!window.walletDB) throw new Error('DB no disponible');
    ahorrosCache = await window.walletDB.listSavings();
  } catch(e) {
    console.error('Error listando ahorros:', e);
    ahorrosCache = [];
  }
}

function initAhorrosUI() {
  const buscar = document.getElementById('buscarAhorro');
  const filtroCat = document.getElementById('filtroCategoriaAhorro');
  const filtroMes = document.getElementById('filtroMesAhorro');
  const tbody = document.getElementById('tbodyAhorros');
  const totalEl = document.getElementById('totalAhorros');
  const conteoEl = document.getElementById('conteoAhorros');
  const promEl = document.getElementById('promAhorros');
  const metaEl = document.getElementById('metaPrincipal');
  const btnLimpiar = document.getElementById('btnLimpiarAhorros');
  const btnAgregar = document.getElementById('btnAgregarAhorro');
  const exportBtn = document.getElementById('exportAhorros');
  if (!buscar || !filtroCat || !filtroMes || !tbody || !totalEl || !conteoEl || !promEl || !metaEl) return;

  buscar.addEventListener('input', renderList);
  filtroCat.addEventListener('change', renderList);
  filtroMes.addEventListener('change', renderList);
  if (btnLimpiar) btnLimpiar.addEventListener('click', () => { buscar.value=''; filtroCat.value=''; filtroMes.value=''; renderList(); });
  if (btnAgregar) btnAgregar.addEventListener('click', () => openAhorroModal());
  if (exportBtn) exportBtn.addEventListener('click', () => { if (!filtradosCache.length) return alert('No hay registros para exportar'); exportCSV(filtradosCache); });

  cargarAhorrosDesdeFirestore().then(renderList);
}

function openAhorroModal(editId = null) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const editData = editId ? ahorrosCache.find(a => a.id === editId) : null;
  overlay.innerHTML = `
    <div class="modal-form">
      <h5>${editId ? 'Editar Ahorro' : 'Agregar Ahorro'}</h5>
      <form id="formAhorro">
        <div class="mb-2"><label>Categoría</label><select id="catAhorro" class="form-select" required>
          <option value="meta">Meta específica</option>
          <option value="emergencia">Fondo de emergencia</option>
          <option value="inversion">Inversión</option>
          <option value="educacion">Educación</option>
          <option value="viaje">Viaje</option>
          <option value="otro">Otro</option>
        </select></div>
        <div class="mb-2"><label>Monto</label><input id="montoAhorro" class="form-control" type="number" min="0" step="0.01" required></div>
        <div class="mb-2"><label>Fecha</label><input id="fechaAhorro" class="form-control" type="date" required></div>
        <div class="mb-2"><label>Método</label><select id="metodoAhorro" class="form-select"><option value="cuenta_ahorros">Cuenta de ahorro</option><option value="banco">Banco</option><option value="alcancia">Alcancía</option><option value="efectivo">Efectivo</option></select></div>
        <div class="mb-2"><label>Descripción</label><textarea id="descAhorro" class="form-control"></textarea></div>
        <div class="d-flex justify-content-between mt-3"><button type="submit" class="btn btn-warning">Guardar</button><button type="button" id="cancelModal" class="btn btn-secondary">Cancelar</button></div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
  if (editData) {
    overlay.querySelector('#catAhorro').value = editData.objetivo || editData.categoria || '';
    overlay.querySelector('#montoAhorro').value = (editData.montoActual ?? editData.monto ?? '');
    overlay.querySelector('#fechaAhorro').value = editData.fechaLimite || editData.fecha || '';
    overlay.querySelector('#metodoAhorro').value = editData.cuenta || editData.metodo || '';
    overlay.querySelector('#descAhorro').value = editData.descripcion || '';
  }
  overlay.querySelector('#cancelModal').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#formAhorro').addEventListener('submit', async ev => {
    ev.preventDefault();
    const payloadUI = {
      categoria: overlay.querySelector('#catAhorro').value,
      monto: parseFloat(overlay.querySelector('#montoAhorro').value),
      fecha: overlay.querySelector('#fechaAhorro').value,
      metodo: overlay.querySelector('#metodoAhorro').value,
      descripcion: overlay.querySelector('#descAhorro').value.trim()
    };
    try {
      if (!window.walletDB) throw new Error('DB no disponible');
      if (editId) {
        await window.walletDB.updateSaving(editId, {
          objetivo: payloadUI.categoria,
          montoActual: payloadUI.monto,
          fechaLimite: payloadUI.fecha,
          cuenta: payloadUI.metodo,
          descripcion: payloadUI.descripcion
        });
      } else {
        await window.walletDB.addSaving({
          objetivo: payloadUI.categoria,
          montoObjetivo: payloadUI.monto, // usando mismo valor si no hay campo separado
          montoActual: payloadUI.monto,
          fechaLimite: payloadUI.fecha,
          cuenta: payloadUI.metodo,
          descripcion: payloadUI.descripcion
        });
      }
      await cargarAhorrosDesdeFirestore();
      renderList();
      overlay.remove();
    } catch(e) { console.error('Error guardando ahorro:', e); alert('Error guardando ahorro'); }
  });
}

async function eliminarAhorro(id) {
  if (!confirm('Eliminar este ahorro?')) return;
  try {
    await window.walletDB.deleteSaving(id);
    await cargarAhorrosDesdeFirestore();
    renderList();
  } catch(e) { console.error('Error eliminando ahorro:', e); alert('Error eliminando'); }
}

function renderList() {
  const buscar = document.getElementById('buscarAhorro');
  const filtroCat = document.getElementById('filtroCategoriaAhorro');
  const filtroMes = document.getElementById('filtroMesAhorro');
  const tbody = document.getElementById('tbodyAhorros');
  const totalEl = document.getElementById('totalAhorros');
  const conteoEl = document.getElementById('conteoAhorros');
  const promEl = document.getElementById('promAhorros');
  const metaEl = document.getElementById('metaPrincipal');
  const exportBtn = document.getElementById('exportAhorros');
  if (!buscar || !filtroCat || !filtroMes || !tbody) return;

  const q = buscar.value.trim().toLowerCase();
  const cat = filtroCat.value;
  const mes = filtroMes.value;

  filtradosCache = ahorrosCache.filter(a => {
    const categoria = a.objetivo || a.categoria || '';
    const fecha = a.fechaLimite || a.fecha || '';
    if (cat && categoria !== cat) return false;
    if (mes) { const m = fecha.substring(5,7); if (m !== mes) return false; }
    if (q) {
      const texto = ((a.descripcion||'') + ' ' + categoria).toLowerCase();
      if (!texto.includes(q)) return false;
    }
    return true;
  });

  tbody.innerHTML = '';
  filtradosCache.forEach(a => {
    const categoria = a.objetivo || a.categoria || '';
    const fecha = a.fechaLimite || a.fecha || '';
    const metodo = a.cuenta || a.metodo || '';
    const monto = (a.montoActual !== undefined ? a.montoActual : a.monto);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${formateaCategoria(categoria)}</td><td>${fecha||''}</td><td>${formateaMetodo(metodo)}</td><td>$${formateaMonto(monto)}</td><td>${(a.descripcion||'')}</td><td><button class='btn btn-sm btn-outline-primary me-1' data-id='${a.id}' data-action='edit'>Editar</button><button class='btn btn-sm btn-outline-danger' data-id='${a.id}' data-action='delete'>Eliminar</button></td>`;
    tbody.appendChild(tr);
  });

  if (filtradosCache.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6"><div class="tabla-vacia"><div class="icono"><i class="bi bi-wallet2"></i></div><p>No hay ahorros registrados<br><small>Comienza agregando tu primer ahorro</small></p><button class="btn-primer" id="btnPrimerAhorro"><i class="bi bi-plus-circle me-2"></i>Agregar Primer Ahorro</button></div></td>`;
    tbody.appendChild(tr);
    const primerBtn = document.getElementById('btnPrimerAhorro');
    if (primerBtn) primerBtn.addEventListener('click', () => openAhorroModal());
  }

  const mostrandoEl = document.getElementById('mostrandoCuenta');
  if (mostrandoEl) mostrandoEl.textContent = `${filtradosCache.length} de ${ahorrosCache.length}`;
  if (exportBtn) exportBtn.disabled = !filtradosCache.length;

  tbody.querySelectorAll('button').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', () => {
      if (action === 'edit') openAhorroModal(id);
      if (action === 'delete') eliminarAhorro(id);
    });
  });

  const total = ahorrosCache.reduce((s, it) => s + (Number(it.montoActual !== undefined ? it.montoActual : it.monto) || 0), 0);
  totalEl.textContent = '$' + formateaMonto(total);
  conteoEl.textContent = ahorrosCache.length;
  const prom = ahorrosCache.length ? (total / Math.max(1, ahorrosCache.length)).toFixed(2) : '0.00';
  promEl.textContent = '$' + formateaMonto(prom);
  const mayor = ahorrosCache.slice().sort((a,b) => (Number(b.montoActual !== undefined ? b.montoActual : b.monto)||0) - (Number(a.montoActual !== undefined ? a.montoActual : a.monto)||0))[0];
  metaEl.textContent = mayor ? formateaCategoria(mayor.objetivo || mayor.categoria) + ' - $' + formateaMonto(mayor.montoActual !== undefined ? mayor.montoActual : mayor.monto) : 'Sin datos';
}

// Helpers
function formateaCategoria(cat) { if (!cat) return '-'; const map = { meta:'Meta específica', emergencia:'Fondo de emergencia', inversion:'Ahorro para inversión', educacion:'Educación', viaje:'Viaje', otro:'Otro' }; return map[cat]||cat; }
function formateaMetodo(metodo) { if (!metodo) return '-'; const map = { cuenta_ahorros:'Cuenta de ahorros', banco:'Banco', alcancia:'Alcancía', efectivo:'Efectivo', otro:'Otro' }; return map[metodo]||metodo; }
function formateaMonto(monto) { const num = Number(monto); if (isNaN(num)) return String(monto); return new Intl.NumberFormat('es-CO',{ minimumFractionDigits:2, maximumFractionDigits:2 }).format(num); }

function exportCSV(items) {
  const headers = ['categoria','fecha','metodo','monto','descripcion'];
  const rows = items.map(it => [it.categoria||'', it.fecha||'', it.metodo||'', it.monto||'', (it.descripcion||'').replace(/\r?\n/g,' ')]);
  const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ahorros_export.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
