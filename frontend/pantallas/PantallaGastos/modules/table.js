(function(){
  function renderTabla(){
    const { state }=window.gastosState; const tbody=document.getElementById('tbodyGastos'); if(!tbody) return;
    tbody.innerHTML=''; const datos=state.gastosFiltrados;
    if(!datos.length){ tbody.innerHTML='<tr><td colspan="9" class="text-center py-5"><div class="estado-vacio"><i class="bi bi-receipt icono-vacio" style="font-size:3rem;color:#e74c3c;margin-bottom:1rem"></i><h5>No hay gastos registrados</h5><p class="text-muted">Comienza agregando tu primer gasto</p><button class="btn btn-danger btn-agregar-primero" id="agregarPrimeroGasto"><i class="bi bi-plus-circle me-2"></i>Agregar Primer Gasto</button></div></td></tr>'; const btn=document.getElementById('agregarPrimeroGasto'); if(btn){ btn.onclick=()=> document.getElementById('btnAgregarGasto')?.click(); } actualizarPaginacion(0); return; }
    const inicio=(state.paginaActual-1)*state.registrosPorPagina; const fin=inicio+state.registrosPorPagina; const pagina=datos.slice(inicio,fin);
    pagina.forEach(g=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><span class='categoria-badge'>${g.categoria||''}</span></td>`+
        `<td><span class='fecha-formato'>${window.gastosMessages.fecha(g.fecha)}</span></td>`+
        `<td><span class='metodo-pago'>${g.metodo||''}</span></td>`+
        `<td><span class='monto-destacado'>$${window.gastosMessages.monto(g.monto)}</span></td>`+
        `<td><div class='descripcion-texto' title='${g.descripcion||''}'>${window.gastosMessages.truncar(g.descripcion||'Sin descripción',40)}</div></td>`+
        `<td><span class='status-badge ${g.esRecurrente?'badge-recurrente':'badge-no-recurrente'}'>${g.esRecurrente?'Sí':'No'}</span></td>`+
        `<td>${g.esRecurrente && g.frecuencia? `<small class='frecuencia-texto'>${g.frecuencia}</small>`: '<span class="text-muted">-</span>'}</td>`+
        `<td><span class='cuenta-texto'>${g.cuenta||'-'}</span></td>`+
        `<td><div class='botones-accion'><button class='btn btn-sm btn-warning btn-editar me-1' data-id='${g.id}' title='Editar'><i class='bi bi-pencil'></i></button><button class='btn btn-sm btn-danger btn-eliminar' data-id='${g.id}' title='Eliminar'><i class='bi bi-trash'></i></button></div></td>`;
      tbody.appendChild(tr);
    });
    actualizarPaginacion(state.gastosFiltrados.length);
    configurarEventos();
  }
  function actualizarPaginacion(total){
    const { state,setPaginaActual }=window.gastosState; const info=document.getElementById('infoPaginacion'); const cont=document.getElementById('paginacionGastos'); if(info){ if(!total){ info.textContent='Mostrando 0 de 0 registros'; } else { const inicio=(state.paginaActual-1)*state.registrosPorPagina+1; const fin=Math.min(state.paginaActual*state.registrosPorPagina,total); info.textContent=`Mostrando ${inicio}-${fin} de ${total} registros`; } }
    if(!cont) return; const totalPaginas=Math.ceil(total/state.registrosPorPagina); if(totalPaginas<=1){ cont.innerHTML=''; return; }
    let html='<nav><ul class="pagination pagination-sm">'; html+=`<li class='page-item ${state.paginaActual===1?'disabled':''}'><a class='page-link' href='#' data-page='${state.paginaActual-1}'>Anterior</a></li>`;
    for(let i=1;i<=totalPaginas;i++){ html+=`<li class='page-item ${i===state.paginaActual?'active':''}'><a class='page-link' href='#' data-page='${i}'>${i}</a></li>`; }
    html+=`<li class='page-item ${state.paginaActual===totalPaginas?'disabled':''}'><a class='page-link' href='#' data-page='${state.paginaActual+1}'>Siguiente</a></li>`; html+='</ul></nav>'; cont.innerHTML=html;
    cont.onclick=function(e){ if(e.target.matches('.page-link')){ e.preventDefault(); const p=parseInt(e.target.dataset.page); if(!isNaN(p) && p>=1 && p<=totalPaginas){ setPaginaActual(p); renderTabla(); } } };
  }
  function configurarEventos(){
    document.querySelectorAll('.btn-eliminar').forEach(btn=>{ btn.onclick=async function(){ const id=this.dataset.id; if(!confirm('¿Eliminar gasto?')) return; await window.gastosService.eliminarGasto(id); }; });
    document.querySelectorAll('.btn-editar').forEach(btn=>{ btn.onclick=function(){ const id=this.dataset.id; window.gastosEdit.editarGasto(id); }; });
  }
  window.gastosTable={ renderTabla };
})();