(function(){
  function renderTabla(){
    const { state }=window.ahorrosState; const tbody=document.getElementById('tbodyAhorros'); if(!tbody) return; tbody.innerHTML=''; const datos=state.ahorrosFiltrados;
    if(!datos.length){ const tr=document.createElement('tr'); tr.innerHTML=`<td colspan='6'><div class='tabla-vacia'><div class='icono'><i class='bi bi-wallet2'></i></div><p>No hay ahorros registrados<br><small>Comienza agregando tu primer ahorro</small></p><button class='btn-primer' id='btnPrimerAhorro'><i class='bi bi-plus-circle me-2'></i>Agregar Primer Ahorro</button></div></td>`; tbody.appendChild(tr); const primer=document.getElementById('btnPrimerAhorro'); primer&& (primer.onclick=()=> window.ahorrosForm.abrirModalAhorro()); return; }
    datos.forEach(a=>{ const categoria=a.objetivo||a.categoria||''; const fecha=a.fechaLimite||a.fecha||''; const metodo=a.cuenta||a.metodo||''; const monto=(a.montoActual!==undefined? a.montoActual: a.monto); const tr=document.createElement('tr'); tr.innerHTML=`<td>${categoria}</td><td>${fecha}</td><td>${metodo}</td><td>$${window.ahorrosMessages.monto(monto)}</td><td>${a.descripcion||''}</td><td><button class='btn btn-sm btn-outline-primary me-1' data-id='${a.id}' data-action='edit'>Editar</button><button class='btn btn-sm btn-outline-danger' data-id='${a.id}' data-action='delete'>Eliminar</button></td>`; tbody.appendChild(tr); });
    tbody.querySelectorAll('button').forEach(btn=>{ const id=btn.dataset.id; const action=btn.dataset.action; btn.onclick=()=>{ if(action==='edit') window.ahorrosEdit.editarAhorro(id); if(action==='delete') window.ahorrosService.eliminarAhorro(id); }; });
  }
  window.ahorrosTable={ renderTabla };
})();
