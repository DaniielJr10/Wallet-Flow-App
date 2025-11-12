/* Ahorros: renderizado, filtros y modal de creación/edición
   Implementa: carga desde localStorage, resumen, tabla, filtros (search, categoria, mes)
*/
document.addEventListener('DOMContentLoaded', () => {
  initAhorrosUI();
});

function initAhorrosUI() {
  // elementos
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

  // proteger por si faltan elementos en el HTML
  if (!buscar || !filtroCat || !filtroMes || !tbody || !totalEl || !conteoEl || !promEl || !metaEl) return;

  // eventos
  buscar.addEventListener('input', renderList);
  filtroCat.addEventListener('change', renderList);
  filtroMes.addEventListener('change', renderList);
  if (btnLimpiar) btnLimpiar.addEventListener('click', () => { buscar.value=''; filtroCat.value=''; filtroMes.value=''; renderList(); });
  if (btnAgregar) btnAgregar.addEventListener('click', () => openAhorroModal());

  // export
  const exportBtn = document.getElementById('exportAhorros');
  let currentFiltered = [];
  if (exportBtn) {
    // start disabled until there are records
    exportBtn.disabled = true;
    exportBtn.addEventListener('click', () => {
      if (!currentFiltered || currentFiltered.length === 0) return alert('No hay registros para exportar');
      exportCSV(currentFiltered);
    });
  }

  renderList();

  // modal creación/edición dinámico
  function openAhorroModal(editIndex = null) {
    // construir modal HTML simple
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-form">
        <h5>${editIndex === null ? 'Agregar Ahorro' : 'Editar Ahorro'}</h5>
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

    const form = overlay.querySelector('#formAhorro');
    const cancel = overlay.querySelector('#cancelModal');
    if (editIndex !== null) {
      const datos = (JSON.parse(localStorage.getItem('ahorros')) || [])[editIndex] || {};
      overlay.querySelector('#catAhorro').value = datos.categoria || '';
      overlay.querySelector('#montoAhorro').value = datos.monto || '';
      overlay.querySelector('#fechaAhorro').value = datos.fecha || '';
      overlay.querySelector('#metodoAhorro').value = datos.metodo || '';
      overlay.querySelector('#descAhorro').value = datos.descripcion || '';
    }

    cancel.addEventListener('click', () => overlay.remove());
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const nuevo = {
        categoria: overlay.querySelector('#catAhorro').value,
        monto: overlay.querySelector('#montoAhorro').value,
        fecha: overlay.querySelector('#fechaAhorro').value,
        metodo: overlay.querySelector('#metodoAhorro').value,
        descripcion: overlay.querySelector('#descAhorro').value
      };
      let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
      if (editIndex === null) ahorros.unshift(nuevo); else ahorros[editIndex] = nuevo;
      localStorage.setItem('ahorros', JSON.stringify(ahorros));
      overlay.remove(); renderList();
    });
  }

  // render list
  function renderList() {
    const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
    const q = buscar.value.trim().toLowerCase();
    const cat = filtroCat.value;
    const mes = filtroMes.value;

    const filtrados = ahorros.filter(a => {
      if (cat && a.categoria !== cat) return false;
      if (mes) {
        const fecha = (a.fecha || '');
        const m = fecha.substring(5,7);
        if (m !== mes) return false;
      }
      if (q) {
        const hay = (a.descripcion||'').toLowerCase().includes(q) || (a.categoria||'').toLowerCase().includes(q);
        if (!hay) return false;
      }
      return true;
    });

  // tabla
    tbody.innerHTML = '';
    filtrados.forEach((a, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${formateaCategoria(a.categoria)}</td><td>${a.fecha||''}</td><td>${formateaMetodo(a.metodo)}</td><td>$${formateaMonto(a.monto)}</td><td>${(a.descripcion||'')}</td><td><button class='btn btn-sm btn-outline-primary me-1' data-idx='${idx}' data-action='edit'>Editar</button><button class='btn btn-sm btn-outline-danger' data-idx='${idx}' data-action='delete'>Eliminar</button></td>`;
      tbody.appendChild(tr);
    });

    // si no hay registros filtrados, mostrar estado vacío similar al ejemplo
    if (filtrados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6">
        <div class="tabla-vacia">
          <div class="icono"><i class="bi bi-wallet2"></i></div>
          <p>No hay ahorros registrados<br><small>Comienza agregando tu primer ahorro</small></p>
          <button class="btn-primer" id="btnPrimerAhorro"><i class="bi bi-plus-circle me-2"></i>Agregar Primer Ahorro</button>
        </div>
      </td>`;
      tbody.appendChild(tr);
      const primerBtn = document.getElementById('btnPrimerAhorro');
      if (primerBtn) primerBtn.addEventListener('click', () => openAhorroModal());
    }

  // actualizar contador de mostrando
  const mostrandoEl = document.getElementById('mostrandoCuenta');
  if (mostrandoEl) mostrandoEl.textContent = `${filtrados.length} de ${ahorros.length}`;

  // guardar filtrados para export
  currentFiltered = filtrados.slice();
  // habilitar/deshabilitar botón exportar
  if (exportBtn) exportBtn.disabled = !currentFiltered || currentFiltered.length === 0;

    // acciones de botones
    tbody.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = Number(btn.getAttribute('data-idx'));
        const action = btn.getAttribute('data-action');
        if (action === 'edit') openAhorroModal(i);
        if (action === 'delete') { if (confirm('Eliminar este ahorro?')) { let arr = JSON.parse(localStorage.getItem('ahorros'))||[]; arr.splice(i,1); localStorage.setItem('ahorros', JSON.stringify(arr)); renderList(); } }
      });
    });

    // resumen
    const total = (ahorros.reduce((s, it) => s + (Number(it.monto)||0), 0));
    totalEl.textContent = '$' + formateaMonto(total);
    conteoEl.textContent = ahorros.length;
    // promedio últimos 3 meses (simple)
    const prom = ahorros.length ? (total / Math.max(1, ahorros.length)).toFixed(2) : '0.00';
    promEl.textContent = '$' + formateaMonto(prom);
    // meta principal (ejemplo: nombre de mayor monto)
    const mayor = ahorros.slice().sort((a,b) => (Number(b.monto)||0) - (Number(a.monto)||0))[0];
    metaEl.textContent = mayor ? formateaCategoria(mayor.categoria) + ' - $' + formateaMonto(mayor.monto) : 'Sin datos';
  }

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
