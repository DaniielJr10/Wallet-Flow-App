(function(){
  function truncarTexto(t,l){ return window.wfUtils.format.truncar(t,l); }
  function mostrarEstadoVacio(tbody){
    const fila=document.createElement('tr');
    fila.innerHTML='<td colspan="10" class="text-center estado-vacio"><div class="py-5"><div class="icono-vacio mb-3"><i class="bi bi-inbox" style="font-size:4rem;color:#bdc3c7"></i></div><h5 class="text-muted mb-2">No hay ingresos registrados</h5><p class="text-muted mb-4">Agrega tu primer ingreso para comenzar</p><button class="btn btn-success btn-agregar-primero"><i class="bi bi-plus-circle me-2"></i>Agregar Mi Primer Ingreso</button></div></td>';
    tbody.appendChild(fila);
    fila.querySelector('.btn-agregar-primero').addEventListener('click',()=>{ document.getElementById('btnAgregarIngreso')?.click(); });
  }
  function actualizarPaginacion(totalRegistros,totalPaginas){
    const { state } = window.ingresosState;
    const paginationInfo=document.getElementById('paginationInfo');
    const paginationControls=document.getElementById('paginationControls');
    const inicio=(state.paginaActual-1)*state.registrosPorPagina+1;
    const fin=Math.min(state.paginaActual*state.registrosPorPagina,totalRegistros);
    paginationInfo.textContent=`Mostrando ${totalRegistros?inicio:0}-${totalRegistros?fin:0} de ${totalRegistros} registros`;
    paginationControls.innerHTML='';
    if(totalPaginas<=1) return;
    const addBtn=(page,label,disabled,active)=>{
      const li=document.createElement('li');
      li.className='page-item '+(disabled? 'disabled ':'')+(active?'active':'');
      li.innerHTML=`<a class="page-link" href="#" data-page="${page}">${label}</a>`; paginationControls.appendChild(li);
    };
    addBtn(state.paginaActual-1,'‹', state.paginaActual===1, false);
    for(let i=Math.max(1,state.paginaActual-2); i<=Math.min(totalPaginas,state.paginaActual+2); i++){ addBtn(i,i,false,i===state.paginaActual); }
    addBtn(state.paginaActual+1,'›', state.paginaActual===totalPaginas,false);
    paginationControls.onclick=function(e){ e.preventDefault(); if(e.target.matches('.page-link') && !e.target.closest('.disabled')){ window.ingresosState.setPaginaActual(parseInt(e.target.dataset.page)); renderTablaConPaginacion(); }};
  }
  function configurarEventosTabla(){
    document.querySelectorAll('.btn-eliminar').forEach(btn=>{
      btn.addEventListener('click', async function(){
        const idx=this.getAttribute('data-index');
        if(!confirm('¿Eliminar ingreso?')) return;
        const fila=this.closest('tr'); fila.style.transition='all .3s'; fila.style.opacity='0'; fila.style.transform='translateX(-100px)';
        const { state } = window.ingresosState;
        const item=state.ingresosOriginales[idx];
        try{ if(item?.id && window.walletDB){ await window.walletDB.deleteIncome(item.id); setTimeout(async()=>{ await window.ingresosService.cargarIngresosDesdeDB(); window.ingresosMessages.mostrarMensaje('Ingreso eliminado','success'); },300); } }
        catch(e){ console.error(e); window.ingresosMessages.mostrarMensaje('Error eliminando','danger'); }
      });
    });
    document.querySelectorAll('.btn-editar').forEach(btn=>{ btn.addEventListener('click', function(){ window.ingresosEdit.editarIngreso(this.getAttribute('data-index')); }); });
    const checkboxes=document.querySelectorAll('tbody input[type="checkbox"]');
    const selectAll=document.getElementById('selectAll');
    checkboxes.forEach(cb=> cb.addEventListener('change',()=>{
      const checked=document.querySelectorAll('tbody input[type="checkbox"]:checked');
      selectAll.checked=checked.length===checkboxes.length; selectAll.indeterminate= checked.length>0 && checked.length<checkboxes.length;
    }));
  }
  function renderTablaConPaginacion(){
    const { state } = window.ingresosState; const tbody=document.getElementById('tablaIngresos').querySelector('tbody');
    tbody.innerHTML='';
    const datos=state.ingresosFiltrados;
    if(datos.length===0){ mostrarEstadoVacio(tbody); actualizarPaginacion(0,0); return; }
    const totalRegistros=datos.length; const totalPaginas=Math.ceil(totalRegistros/state.registrosPorPagina);
    const inicio=(state.paginaActual-1)*state.registrosPorPagina; const fin=inicio+state.registrosPorPagina;
    const pagina=datos.slice(inicio, fin);
    pagina.forEach(ingreso=>{
      const indexGlobal=state.ingresosOriginales.findIndex(item=> item.id? item.id===ingreso.id: (item.fecha===ingreso.fecha && item.monto===ingreso.monto && item.categoria===ingreso.categoria));
      const fila=document.createElement('tr');
      fila.innerHTML=`<td><input type="checkbox" data-index="${indexGlobal}"></td>`+
        `<td><span class="categoria-badge">${ingreso.categoria||''}</span></td>`+
        `<td><span class="metodo-pago">${ingreso.metodo||''}</span></td>`+
        `<td><span class="monto-destacado">$${window.ingresosMessages.formatearMonto(ingreso.monto)}</span></td>`+
        `<td><span class="descripcion-texto" title="${ingreso.descripcion||'Sin descripción'}">${truncarTexto(ingreso.descripcion||'Sin descripción',30)}</span></td>`+
        `<td><span class="fecha-formato">${window.ingresosMessages.formatearFecha(ingreso.fecha)}</span></td>`+
        `<td><span class="status-badge ${ingreso.esRecurrente? 'badge-recurrente':'badge-no-recurrente'}">${ingreso.esRecurrente? 'Sí':'No'}</span></td>`+
        `<td><span class="frecuencia-texto">${ingreso.frecuencia||'-'}</span></td>`+
        `<td><span class="cuenta-texto">${ingreso.cuenta||'-'}</span></td>`+
        `<td><div class="botones-accion"><button class="btn btn-sm btn-warning btn-editar me-1" data-index="${indexGlobal}" title="Editar ingreso"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-danger btn-eliminar" data-index="${indexGlobal}" title="Eliminar ingreso"><i class="bi bi-trash"></i></button></div></td>`;
      tbody.appendChild(fila);
    });
    actualizarPaginacion(totalRegistros,totalPaginas); configurarEventosTabla();
  }
  window.ingresosTable = { renderTablaConPaginacion };
})();