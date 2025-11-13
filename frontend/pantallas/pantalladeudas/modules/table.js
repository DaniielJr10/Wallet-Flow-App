(function(){
  function renderTabla(){
    const { state }=window.deudasState; const tbody=document.querySelector('#tablaDeudas tbody'); const tabla=document.getElementById('tablaDeudas'); const mensajeVacio=document.getElementById('mensajeVacio'); if(!tbody) return;
    tbody.innerHTML=''; const datos=state.deudasFiltradas;
    if(!datos.length){ if(mensajeVacio) mensajeVacio.style.display='block'; if(tabla) tabla.style.display='none'; adjuntarBotonAgregar(); return; }
    if(mensajeVacio) mensajeVacio.style.display='none'; if(tabla) tabla.style.display='table';
    datos.forEach((d)=>{
      const tr=document.createElement('tr');
      let estadoClass='estado-pendiente'; let estadoTexto='Pendiente';
      if(d.estado==='pagada'){ estadoClass='estado-pagada'; estadoTexto='Pagada'; }
      else if(d.estado==='renegociada'){ estadoClass='estado-renegociada'; estadoTexto='Renegociada'; }
      tr.innerHTML=`<td><strong>${d.acreedor||''}</strong></td>`+
        `<td><strong class='text-danger'>$${window.deudasMessages.monto(d.monto||0)}</strong></td>`+
        `<td>${d.fechaInicio? window.deudasMessages.fecha(d.fechaInicio):''}</td>`+
        `<td>${d.fechaVencimiento? window.deudasMessages.fecha(d.fechaVencimiento):"<span class='text-muted'>Sin fecha</span>"}</td>`+
        `<td>${d.tasaInteres? `<span class='badge bg-info'>${d.tasaInteres}%</span>`:"<span class='text-muted'>-</span>"}</td>`+
        `<td><span class='${estadoClass}'>${estadoTexto}</span></td>`+
        `<td><small class='text-muted'>${d.descripcion||'Sin descripción'}</small></td>`+
        `<td><div class='btn-group' role='group'><button class='btn btn-sm btn-warning me-1 btn-editar' data-id='${d.id}' title='Editar'><i class='bi bi-pencil'></i></button><button class='btn btn-sm btn-danger btn-eliminar' data-id='${d.id}' title='Eliminar'><i class='bi bi-trash'></i></button></div></td>`;
      tbody.appendChild(tr);
    });
    configurarEventos();
  }
  function configurarEventos(){
    document.querySelectorAll('.btn-eliminar').forEach(btn=>{ btn.onclick=async function(){ const id=this.dataset.id; const deuda=window.deudasState.state.deudasOriginales.find(d=>d.id===id); if(!deuda) return; if(!confirm(`¿Eliminar deuda con ${deuda.acreedor}?\n\nMonto: $${window.deudasMessages.monto(deuda.monto||0)}`)) return; await window.deudasService.eliminarDeuda(id); }; });
    document.querySelectorAll('.btn-editar').forEach(btn=>{ btn.onclick=function(){ const id=this.dataset.id; window.deudasEdit.editarDeuda(id); }; });
    adjuntarBotonAgregar();
  }
  function adjuntarBotonAgregar(){ document.querySelectorAll('.btn-empty-add,#btnAgregarDeudaPage').forEach(btn=>{ btn.onclick=(e)=>{ e.preventDefault(); window.deudasForm.abrirModalAgregar(); }; }); }
  window.deudasTable={ renderTabla };
})();
