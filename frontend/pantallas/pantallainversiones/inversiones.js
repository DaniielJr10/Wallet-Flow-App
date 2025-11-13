// Inversiones Firestore-only
let inversionesCache = []

async function waitForDB(maxMs=5000){
  const start = Date.now();
  while((!window.walletDB) && Date.now()-start < maxMs){
    await new Promise(r=>setTimeout(r,100));
  }
  return !!window.walletDB;
}

async function cargarInversionesDesdeFirestore(){
  try {
    const ok = await waitForDB();
    if(!ok || !window.walletDB) throw new Error('DB no disponible');
    await window.walletDB.init();
    const auth = (typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null;
    if(auth && !auth.currentUser) await new Promise(r=>auth.onAuthStateChanged(()=>r()));
    if(!auth || !auth.currentUser){ console.warn('Inversiones: usuario no autenticado aún'); return; }
    inversionesCache = await window.walletDB.listInvestments();
  } catch(e){ console.error('Error cargando inversiones Firestore:', e); inversionesCache = []; }
}

function renderInversiones(){
  const tablaBody = document.getElementById('tablaInversiones')?.querySelector('tbody');
  if(!tablaBody) return;
  tablaBody.innerHTML='';
  const inversiones = inversionesCache;
  const mensajeVacio = document.getElementById('mensajeVacio');
  const card = document.getElementById('tablaInversiones')?.closest('.card');
  if(inversiones.length===0){
    if(mensajeVacio) mensajeVacio.style.display='block';
    if(card) card.style.display='none';
  } else {
    if(mensajeVacio) mensajeVacio.style.display='none';
    if(card) card.style.display='block';
  }
  let totalInvertido=0, totalRendimiento=0, inversionesActivas=0;
  inversiones.forEach(inv=>{
    totalInvertido += parseFloat(inv.monto)||0;
    totalRendimiento += parseFloat(inv.rendimientoEsperado||0);
    if(!inv.fechaFin || new Date(inv.fechaFin) > new Date()) inversionesActivas++;
    let riesgoClass='';
    switch(inv.riesgo){
      case 'bajo': riesgoClass='riesgo-bajo'; break;
      case 'medio': riesgoClass='riesgo-medio'; break;
      case 'alto': riesgoClass='riesgo-alto'; break;
      default: riesgoClass='riesgo-medio';
    }
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${inv.tipo||'-'}</strong></td>
      <td><strong>$${(parseFloat(inv.monto)||0).toLocaleString()}</strong></td>
      <td>${inv.fechaInicio||inv.fecha||'-'}</td>
      <td><span class="${riesgoClass}">${inv.riesgo||'-'}</span></td>
      <td>${inv.rendimientoEsperado? `<strong>${inv.rendimientoEsperado}%</strong>`:'-'}</td>
      <td>${inv.descripcion||'-'}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2 btn-editar" data-id="${inv.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${inv.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
      </td>`;
    tablaBody.appendChild(tr);
  });
  const totalInvertidoEl = document.getElementById('totalInvertido');
  if(totalInvertidoEl) totalInvertidoEl.textContent = `$${totalInvertido.toLocaleString()}`;
  const numeroInvEl = document.getElementById('numeroInversiones');
  if(numeroInvEl) numeroInvEl.textContent = inversiones.length;
  const inversionesActivasEl = document.getElementById('inversionesActivas');
  if(inversionesActivasEl) inversionesActivasEl.textContent = inversionesActivas;
  const promedioRendEl = document.getElementById('rendimientoPromedio');
  const promedio = inversiones.length>0 ? (totalRendimiento/inversiones.length).toFixed(1): '0.0';
  if(promedioRendEl) promedioRendEl.textContent = `${promedio}%`;
  configurarEventosBotones();
}

function configurarEventosBotones(){
  document.querySelectorAll('.btn-eliminar').forEach(btn=>{
    btn.addEventListener('click', ()=> eliminarInversion(btn.getAttribute('data-id')));
  });
  document.querySelectorAll('.btn-editar').forEach(btn=>{
    btn.addEventListener('click', ()=> editarInversion(btn.getAttribute('data-id')));
  });
}

async function eliminarInversion(id){
  const inv = inversionesCache.find(i=>i.id===id);
  if(!inv) return;
  const confirmacion = confirm(`¿Eliminar inversión "${inv.tipo}" de $${(parseFloat(inv.monto)||0).toLocaleString()}?`);
  if(!confirmacion) return;
  try {
    await waitForDB();
    await window.walletDB.init();
    await window.walletDB.deleteInvestment(id);
    await cargarInversionesDesdeFirestore();
    renderInversiones();
    if(typeof mostrarNotificacion==='function') mostrarNotificacion('Inversión eliminada','success');
  } catch(e){ console.error('Error eliminando inversión:', e); if(typeof mostrarNotificacion==='function') mostrarNotificacion('Error eliminando','danger'); }
}

function openAddInversionModal(){
  const contenedor = document.getElementById('contenedorModalInversion');
  if(!contenedor){ console.error('contenedorModalInversion no encontrado'); return; }
  contenedor.innerHTML='';
  const styleId='inversion-firestore-styles';
  if(!document.getElementById(styleId)){
    const style=document.createElement('style'); style.id=styleId; style.textContent=`.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:10000}.modal-form{background:#fff;border-radius:14px;padding:20px;width:95%;max-width:540px;box-shadow:0 12px 32px rgba(0,0,0,.25)}.modal-form h2{margin:0 0 14px;font-size:1.25rem}.modal-form label{font-weight:600;margin-top:8px}.modal-form input,.modal-form select,.modal-form textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;margin-top:4px}.botones{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}`; document.head.appendChild(style);
  }
  contenedor.innerHTML=`<div id="modalAgregarInversion" class="modal-overlay"><div class="modal-form"><form id="formAgregarInversion" autocomplete="off"><h2>Agregar Inversión</h2><label>Tipo<select id="addTipoInversion" required><option value="acciones">Acciones</option><option value="bonos">Bonos</option><option value="fondos_mutuos">Fondos Mutuos</option><option value="bienes_raices">Bienes Raíces</option><option value="criptomonedas">Criptomonedas</option><option value="otro">Otro</option></select></label><label>Monto<input type="number" id="addMontoInversion" required min="0" step="0.01"></label><label>Fecha Inicio<input type="date" id="addFechaInicioInversion" required></label><label>Riesgo<select id="addRiesgoInversion" required><option value="bajo">Bajo</option><option value="medio">Medio</option><option value="alto">Alto</option></select></label><label>Fecha Fin (Opcional)<input type="date" id="addFechaFinInversion"></label><label>Rendimiento Esperado (%)<input type="number" id="addRendimientoEsperadoInversion" min="0" step="0.01"></label><label>Descripción<textarea id="addDescripcionInversion"></textarea></label><div class="botones"><button type="submit" class="btn btn-success btn-sm">Guardar</button><button type="button" id="cancelarInversionFirestore" class="btn btn-secondary btn-sm">Cancelar</button></div></form></div></div>`;
  const modal=document.getElementById('modalAgregarInversion');
  const form=document.getElementById('formAgregarInversion');
  const cancelar=document.getElementById('cancelarInversionFirestore');
  if(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      try {
        await waitForDB();
        await window.walletDB.init();
        const datos={
          tipo: document.getElementById('addTipoInversion').value,
          monto: parseFloat(document.getElementById('addMontoInversion').value),
          fechaInicio: document.getElementById('addFechaInicioInversion').value,
          riesgo: document.getElementById('addRiesgoInversion').value,
          fechaFin: document.getElementById('addFechaFinInversion').value || '',
          rendimientoEsperado: parseFloat(document.getElementById('addRendimientoEsperadoInversion').value||'0'),
          descripcion: document.getElementById('addDescripcionInversion').value.trim()
        };
        await window.walletDB.addInvestment(datos);
        await cargarInversionesDesdeFirestore();
        renderInversiones();
        if(typeof mostrarNotificacion==='function') mostrarNotificacion('¡Inversión guardada!','success');
        if(modal) modal.remove();
      } catch(err){ console.error('Error guardando inversión:', err); if(typeof mostrarNotificacion==='function') mostrarNotificacion('Error al guardar','danger'); }
    });
  }
  if(cancelar) cancelar.addEventListener('click', ()=>{ if(modal) modal.remove(); });
  if(modal) modal.addEventListener('click', ev=>{ if(ev.target===modal) modal.remove(); });
}

function editarInversion(id){
  const inv = inversionesCache.find(i=>i.id===id);
  if(!inv) return;
  const contenedor = document.getElementById('contenedorModalEditarInversion');
  if(!contenedor){ console.error('contenedorModalEditarInversion no encontrado'); return; }
  contenedor.innerHTML='';
  contenedor.innerHTML=`<div id="modalEditarInversion" class="modal-overlay"><div class="modal-form"><form id="formEditarInversion" autocomplete="off"><h2>Editar Inversión</h2><label>Tipo<input type="text" id="editTipoInversion" value="${inv.tipo||''}" required></label><label>Monto<input type="number" id="editMontoInversion" value="${inv.monto||0}" min="0" step="0.01" required></label><label>Fecha Inicio<input type="date" id="editFechaInicioInversion" value="${inv.fechaInicio||inv.fecha||''}" required></label><label>Fecha Fin<input type="date" id="editFechaFinInversion" value="${inv.fechaFin||''}"></label><label>Riesgo<select id="editRiesgoInversion"><option value="bajo" ${inv.riesgo==='bajo'?'selected':''}>Bajo</option><option value="medio" ${inv.riesgo==='medio'?'selected':''}>Medio</option><option value="alto" ${inv.riesgo==='alto'?'selected':''}>Alto</option></select></label><label>Rendimiento Esperado (%)<input type="number" id="editRendimientoEsperadoInversion" value="${inv.rendimientoEsperado||0}" min="0" step="0.01"></label><label>Descripción<textarea id="editDescripcionInversion">${inv.descripcion||''}</textarea></label><div class="botones"><button type="submit" class="btn btn-success btn-sm">Guardar</button><button type="button" id="cancelarEditarInversion" class="btn btn-secondary btn-sm">Cancelar</button></div></form></div></div>`;
  const modal=document.getElementById('modalEditarInversion');
  const form=document.getElementById('formEditarInversion');
  const cancelar=document.getElementById('cancelarEditarInversion');
  if(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      try {
        await waitForDB();
        await window.walletDB.init();
        const datos={
          tipo: document.getElementById('editTipoInversion').value.trim(),
          monto: parseFloat(document.getElementById('editMontoInversion').value),
          fechaInicio: document.getElementById('editFechaInicioInversion').value,
          fechaFin: document.getElementById('editFechaFinInversion').value || '',
          riesgo: document.getElementById('editRiesgoInversion').value,
          rendimientoEsperado: parseFloat(document.getElementById('editRendimientoEsperadoInversion').value||'0'),
          descripcion: document.getElementById('editDescripcionInversion').value.trim()
        };
        await window.walletDB.updateInvestment(id, datos);
        await cargarInversionesDesdeFirestore();
        renderInversiones();
        if(typeof mostrarNotificacion==='function') mostrarNotificacion('Inversión actualizada','success');
        if(modal) modal.remove();
      } catch(err){ console.error('Error actualizando inversión:', err); if(typeof mostrarNotificacion==='function') mostrarNotificacion('Error al actualizar','danger'); }
    });
  }
  if(cancelar) cancelar.addEventListener('click', ()=>{ if(modal) modal.remove(); });
  if(modal) modal.addEventListener('click', ev=>{ if(ev.target===modal) modal.remove(); });
}

document.addEventListener('DOMContentLoaded', async () => {
  window.renderInversiones = renderInversiones;
  // Escuchar notificaciones desde otros tabs/páginas (ej. formulario en pantalla principal)
  window.addEventListener('storage', function(e){
    if(!e) return;
    if(e.key === 'wallet_notify_inversiones' || e.key === 'pending_inversiones'){
      try{ cargarInversionesDesdeFirestore().then(()=>renderInversiones()); }catch(err){ console.warn('Inversiones refresh failed on storage event', err); }
    }
  });
  const btnAgregar = document.getElementById('btnAgregarInversionPage');
  if(btnAgregar) btnAgregar.addEventListener('click', openAddInversionModal);
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('openForm')==='true') openAddInversionModal();
  await cargarInversionesDesdeFirestore();
  renderInversiones();
});
