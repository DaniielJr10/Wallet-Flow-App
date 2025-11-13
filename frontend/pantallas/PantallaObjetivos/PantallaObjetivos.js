// Objetivos Firestore-only
let objetivosCache = [];

async function waitForDB(maxMs=5000){
  const start=Date.now();
  while((!window.walletDB) && Date.now()-start < maxMs){
    await new Promise(r=>setTimeout(r,100));
  }
  return !!window.walletDB;
}

async function cargarObjetivosDesdeFirestore(){
  try {
    const ok = await waitForDB();
    if(!ok || !window.walletDB) throw new Error('DB no disponible');
    await window.walletDB.init();
    const auth=(typeof firebase!=='undefined' && firebase.auth)?firebase.auth():null;
    if(auth && !auth.currentUser) await new Promise(r=>auth.onAuthStateChanged(()=>r()));
    if(!auth || !auth.currentUser){ console.warn('Objetivos: usuario no autenticado aún'); return; }
    objetivosCache = await window.walletDB.listGoals();
  } catch(e){ console.error('Error cargando objetivos Firestore:', e); objetivosCache=[]; }
}

function renderObjetivos(){
  const objetivos = objetivosCache;
  const tableBody = document.querySelector('#tablaObjetivos tbody');
  const mensajeVacio = document.getElementById('mensajeVacio');
  if(!tableBody) return;
  tableBody.innerHTML='';
  if(objetivos.length===0){
    if(mensajeVacio) mensajeVacio.style.display='block';
    const tablaCard=document.querySelector('#tablaObjetivos');
    if(tablaCard && tablaCard.closest('.card')) tablaCard.closest('.card').style.display='none';
  } else {
    if(mensajeVacio) mensajeVacio.style.display='none';
    const tablaCard=document.querySelector('#tablaObjetivos');
    if(tablaCard && tablaCard.closest('.card')) tablaCard.closest('.card').style.display='block';
    objetivos.forEach(obj=>{
      const row=document.createElement('tr');
      const progreso = obj.progreso !== undefined ? obj.progreso : (obj.montoObjetivo? Math.round(((obj.montoActual||0)/(obj.montoObjetivo||1))*100):0);
      let estado = obj.estado;
      // Normalizar estado para compatibilidad
      if(estado==='en_progreso') estado='Pendiente';
      else if(estado==='completado') estado='Completado';
      let estadoClass='', estadoColor='';
      switch(estado){
        case 'Completado': estadoClass='badge bg-success'; estadoColor='success'; break;
        case 'Pendiente': estadoClass='badge bg-warning text-dark'; estadoColor='warning'; break;
        default: estadoClass='badge bg-secondary'; estadoColor='secondary'; break;
      }
      const fechaCreacion = obj.createdAt && obj.createdAt.toDate? obj.createdAt.toDate().toISOString().slice(0,10): (obj.fechaCreacion||'-');
      row.innerHTML=`<td><div class="d-flex align-items-center"><i class="bi bi-bullseye me-2 text-warning"></i><strong>${obj.titulo||'-'}</strong></div></td>
        <td><span class="text-muted">${obj.descripcion||'-'}</span></td>
        <td><small class="text-muted"><i class="bi bi-calendar-plus me-1"></i>${fechaCreacion}</small></td>
        <td><small class="text-muted"><i class="bi bi-calendar-check me-1"></i>${obj.fechaLimite||'-'}</small></td>
        <td><span class="${estadoClass}">${estado}</span></td>
        <td><div class="progress" style="height:20px"><div class="progress-bar bg-${estadoColor}" role="progressbar" style="width:${progreso}%" aria-valuenow="${progreso}" aria-valuemin="0" aria-valuemax="100">${progreso}%</div></div></td>
        <td><div class="btn-group" role="group"><button class="btn btn-sm btn-outline-primary" data-id="${obj.id}" data-action="edit" title="Editar"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" data-id="${obj.id}" data-action="delete" title="Eliminar"><i class="bi bi-trash"></i></button></div></td>`;
      tableBody.appendChild(row);
    });
    tableBody.querySelectorAll('button[data-action="edit"]').forEach(b=>b.addEventListener('click',()=>editarObjetivo(b.getAttribute('data-id'))));
    tableBody.querySelectorAll('button[data-action="delete"]').forEach(b=>b.addEventListener('click',()=>eliminarObjetivo(b.getAttribute('data-id'))));
  }
  updateStats();
}

function updateStats(){
  const objetivos=objetivosCache;
  const total=objetivos.length;
  const completados=objetivos.filter(o=> (o.estado==='Completado' || o.estado==='completado')).length;
  const pendientes=objetivos.filter(o=> (o.estado==='Pendiente' || o.estado==='en_progreso')).length;
  let progresoTotal=0;
  objetivos.forEach(o=>{
    const p = o.progreso !== undefined? o.progreso : (o.montoObjetivo? Math.round(((o.montoActual||0)/(o.montoObjetivo||1))*100):0);
    progresoTotal+=p;
  });
  const promedio = total>0? Math.round(progresoTotal/total):0;
  const totalEl=document.getElementById('totalObjetivos'); if(totalEl) totalEl.textContent=total;
  const compEl=document.getElementById('objetivosCompletados'); if(compEl) compEl.textContent=completados;
  const pendEl=document.getElementById('objetivosPendientes'); if(pendEl) pendEl.textContent=pendientes;
  const progEl=document.getElementById('progresoPromedio'); if(progEl) progEl.textContent=`${promedio}%`;
}

function showNotification(message,type='info'){
  const n=document.createElement('div');
  n.className=`alert alert-${type} alert-dismissible fade show position-fixed`;
  n.style.cssText='top:20px;right:20px;z-index:9999;min-width:300px';
  n.innerHTML=`${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(n);
  setTimeout(()=>{ if(n.parentNode) n.remove(); },3000);
}

function openAddObjetivoModal(){
  const modalEl=document.getElementById('modalAgregar');
  if(!modalEl){ console.error('Modal agregar no encontrado'); return; }
  modalEl.style.display='flex';
}
function cerrarModalAgregar(){ const m=document.getElementById('modalAgregar'); if(m) m.style.display='none'; }
function cerrarModal(){ const m=document.getElementById('modalEdicion'); if(m) m.style.display='none'; }

function editarObjetivo(id){
  const obj=objetivosCache.find(o=>o.id===id); if(!obj) return;
  const modalEl=document.getElementById('modalEdicion'); if(!modalEl){ console.error('Modal edición no encontrado'); return; }
  document.getElementById('editarTitulo').value=obj.titulo||'';
  document.getElementById('editarDescripcion').value=obj.descripcion||'';
  document.getElementById('editarFechaCreacion').value= obj.createdAt && obj.createdAt.toDate? obj.createdAt.toDate().toISOString().slice(0,10): (obj.fechaCreacion||'');
  document.getElementById('editarFechaLimite').value=obj.fechaLimite||'';
  document.getElementById('editarEstado').value= (obj.estado==='en_progreso')? 'Pendiente': (obj.estado==='completado'? 'Completado': obj.estado||'Pendiente');
  document.getElementById('editarPrioridad').value= obj.prioridad || 'medium';
  let hiddenId=document.getElementById('hiddenGoalId');
  if(!hiddenId){ hiddenId=document.createElement('input'); hiddenId.type='hidden'; hiddenId.id='hiddenGoalId'; document.getElementById('formEditar').appendChild(hiddenId); }
  hiddenId.value=id;
  modalEl.style.display='flex';
}

async function eliminarObjetivo(id){
  const obj=objetivosCache.find(o=>o.id===id); if(!obj) return;
  if(!confirm(`¿Eliminar objetivo "${obj.titulo}"?`)) return;
  try {
    await waitForDB(); await window.walletDB.init();
    await window.walletDB.deleteGoal(id);
    await cargarObjetivosDesdeFirestore();
    renderObjetivos();
    showNotification('Objetivo eliminado exitosamente','success');
  } catch(e){ console.error('Error eliminando objetivo:', e); showNotification('Error al eliminar','danger'); }
}

document.addEventListener('DOMContentLoaded', async () => {
  window.renderObjetivos = renderObjetivos;
  const cerrarSesionBtn=document.getElementById('cerrarSesionBtn');
  if(cerrarSesionBtn){ cerrarSesionBtn.addEventListener('click', e=>{ e.preventDefault(); if(confirm('¿Cerrar sesión?')){ if(window.firebaseAuth) window.firebaseAuth.cerrarSesion(); window.location.href='../../login/inicio de sesion/inicio.html'; }}); }
  const btnAdd=document.getElementById('btnAgregarObjetivoPage'); if(btnAdd) btnAdd.addEventListener('click', openAddObjetivoModal);
  const urlParams=new URLSearchParams(window.location.search); if(urlParams.get('openForm')==='true') openAddObjetivoModal();
  // Submit agregar
  const formAgregar=document.getElementById('formAgregar');
  if(formAgregar){
    formAgregar.addEventListener('submit', async e=>{
      e.preventDefault();
      try {
        await waitForDB(); await window.walletDB.init();
        const datos={
          titulo: document.getElementById('nuevoTitulo').value.trim(),
          descripcion: document.getElementById('nuevaDescripcion').value.trim(),
          fechaLimite: document.getElementById('nuevaFechaLimite').value,
          prioridad: document.getElementById('nuevaPrioridad').value,
          montoObjetivo: parseFloat(document.getElementById('nuevoMonto').value||'0'),
          montoActual: 0,
          estado: 'en_progreso',
          progreso: 0
        };
        await window.walletDB.addGoal(datos);
        await cargarObjetivosDesdeFirestore();
        renderObjetivos();
        formAgregar.reset();
        cerrarModalAgregar();
        showNotification('Objetivo creado','success');
      } catch(err){ console.error('Error creando objetivo:', err); showNotification('Error al crear','danger'); }
    });
  }
  // Submit editar
  const formEditar=document.getElementById('formEditar');
  if(formEditar){
    formEditar.addEventListener('submit', async e=>{
      e.preventDefault();
      const hiddenId=document.getElementById('hiddenGoalId'); if(!hiddenId||!hiddenId.value) return;
      try {
        await waitForDB(); await window.walletDB.init();
        const datos={
          titulo: document.getElementById('editarTitulo').value.trim(),
          descripcion: document.getElementById('editarDescripcion').value.trim(),
          fechaLimite: document.getElementById('editarFechaLimite').value,
          prioridad: document.getElementById('editarPrioridad').value,
          estado: document.getElementById('editarEstado').value==='Pendiente'? 'en_progreso':'Completado',
          // Progreso no editable aquí directamente; podría derivarse
        };
        await window.walletDB.updateGoal(hiddenId.value, datos);
        await cargarObjetivosDesdeFirestore();
        renderObjetivos();
        cerrarModal();
        hiddenId.remove();
        showNotification('Objetivo actualizado','success');
      } catch(err){ console.error('Error actualizando objetivo:', err); showNotification('Error al actualizar','danger'); }
    });
  }
  await cargarObjetivosDesdeFirestore();
  renderObjetivos();
});
