(function(){
  function renderTabla(){
    const { state }=window.inversionesState; const tbody=document.querySelector('#tablaInversiones tbody'); const card=document.getElementById('tablaInversiones')?.closest('.card'); const mensajeVacio=document.getElementById('mensajeVacio'); if(!tbody) return;
    tbody.innerHTML=''; const datos=state.inversionesFiltradas;
    if(!datos.length){ if(mensajeVacio) mensajeVacio.style.display='block'; if(card) card.style.display='none'; return; }
    if(mensajeVacio) mensajeVacio.style.display='none'; if(card) card.style.display='block';
    datos.forEach(inv=>{ let riesgoClass='riesgo-medio'; if(inv.riesgo==='bajo') riesgoClass='riesgo-bajo'; else if(inv.riesgo==='alto') riesgoClass='riesgo-alto'; const tr=document.createElement('tr'); tr.innerHTML=`<td><strong>${inv.tipo||'-'}</strong></td><td><strong>$${window.inversionesMessages.monto(inv.monto||0)}</strong></td><td>${inv.fechaInicio||inv.fecha||'-'}</td><td><span class='${riesgoClass}'>${inv.riesgo||'-'}</span></td><td>${inv.rendimientoEsperado? `<strong>${inv.rendimientoEsperado}%</strong>`:'-'}</td><td>${inv.descripcion||'-'}</td><td><button class='btn btn-sm btn-warning me-2 btn-editar' data-id='${inv.id}' title='Editar'><i class='bi bi-pencil'></i></button><button class='btn btn-sm btn-danger btn-eliminar' data-id='${inv.id}' title='Eliminar'><i class='bi bi-trash'></i></button></td>`; tbody.appendChild(tr); });
    configurarEventos();
  }
  function configurarEventos(){ document.querySelectorAll('.btn-eliminar').forEach(btn=>{ btn.onclick=function(){ const id=this.dataset.id; const item=window.inversionesState.state.inversionesOriginales.find(i=>i.id===id); if(!item) return; if(!confirm(`¿Eliminar inversión "${item.tipo}" de $${window.inversionesMessages.monto(item.monto||0)}?`)) return; window.inversionesService.eliminarInversion(id); }; }); document.querySelectorAll('.btn-editar').forEach(btn=>{ btn.onclick=function(){ window.inversionesEdit.editarInversion(this.dataset.id); }; }); }
  window.inversionesTable={ renderTabla };
})();
