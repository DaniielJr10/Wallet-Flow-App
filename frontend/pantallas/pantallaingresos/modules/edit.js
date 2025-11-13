(function(){
  function editarIngreso(idx){
    const { state } = window.ingresosState; const ingreso= state.ingresosOriginales[idx]; if(!ingreso) return;
    const formHtml=`<form id="formEditarIngreso" class="form-editar"><h5 class="form-titulo"><i class="bi bi-pencil-square me-2"></i>Editar Ingreso</h5>`+
      `<div class="mb-3"><label class="form-label"><i class="bi bi-tag me-2"></i>Categoría</label><select class="form-select" name="categoria" required>`+
      ['salario','venta','freelance','otro'].map(c=>`<option value="${c}" ${ingreso.categoria===c?'selected':''}>${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')+`</select></div>`+
      `<div class="mb-3"><label class="form-label"><i class="bi bi-credit-card me-2"></i>Método</label><select class="form-select" name="metodo" required>`+
      ['efectivo','tarjeta_credito','tarjeta_debito','transferencia','nequidaviplata'].map(m=>`<option value="${m}" ${ingreso.metodo===m?'selected':''}>${m}</option>`).join('')+`</select></div>`+
      `<div class="row"><div class="col-md-6 mb-3"><label class="form-label"><i class="bi bi-currency-dollar me-2"></i>Monto</label><input class="form-control" name="monto" type="number" min="0" step="0.01" value="${ingreso.monto}" required></div>`+
      `<div class="col-md-6 mb-3"><label class="form-label"><i class="bi bi-calendar me-2"></i>Fecha</label><input class="form-control" name="fecha" type="date" value="${ingreso.fecha}" required></div></div>`+
      `<div class="mb-3"><label class="form-label"><i class="bi bi-file-text me-2"></i>Descripción</label><textarea class="form-control" name="descripcion" rows="2">${ingreso.descripcion||''}</textarea></div>`+
      `<div class="row"><div class="col-md-6 mb-3"><label class="form-label"><i class="bi bi-repeat me-2"></i>Recurrente</label><select class="form-select" name="esRecurrente"><option value="true" ${ingreso.esRecurrente?'selected':''}>Sí</option><option value="false" ${!ingreso.esRecurrente?'selected':''}>No</option></select></div>`+
      `<div class="col-md-6 mb-3"><label class="form-label"><i class="bi bi-clock me-2"></i>Frecuencia</label><select class="form-select" name="frecuencia"><option value="">Seleccionar...</option>`+
      ['diario','semanal','mensual'].map(f=>`<option value="${f}" ${ingreso.frecuencia===f?'selected':''}>${f}</option>`).join('')+`</select></div></div>`+
      `<div class="mb-3"><label class="form-label"><i class="bi bi-bank me-2"></i>Cuenta</label><select class="form-select" name="cuenta"><option value="">Seleccionar cuenta</option>`+
      ['bancolombia','davivienda','nequi','efectivo'].map(c=>`<option value="${c}" ${ingreso.cuenta===c?'selected':''}>${c}</option>`).join('')+`</select></div>`+
      `<div class="form-buttons"><button type="submit" class="btn btn-success"><i class="bi bi-check-circle me-2"></i>Guardar</button>`+
      `<button type="button" class="btn btn-secondary" id="cancelarEditar"><i class="bi bi-x-circle me-2"></i>Cancelar</button></div></form>`;
    const modal=document.createElement('div'); modal.id='modalEditarIngreso'; modal.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(5px);animation:fadeIn .3s'; modal.innerHTML=formHtml; document.body.appendChild(modal);
    document.getElementById('cancelarEditar').onclick=()=> cerrar();
    document.getElementById('formEditarIngreso').onsubmit=function(e){ e.preventDefault(); const fd=new FormData(this); const monto=parseFloat(fd.get('monto')); if(monto<=0){ alert('Monto > 0'); return; }
      const actualizado={ categoria:fd.get('categoria').trim(), metodo:fd.get('metodo').trim(), monto:monto, fecha:fd.get('fecha'), descripcion:fd.get('descripcion').trim(), esRecurrente:fd.get('esRecurrente')==='true', frecuencia:fd.get('frecuencia'), cuenta:fd.get('cuenta').trim() };
      (async()=>{ try{ if(ingreso.id && window.walletDB){ await window.walletDB.updateIncome(ingreso.id, actualizado); } else { state.ingresosOriginales[idx]=actualizado; localStorage.setItem('ingresos', JSON.stringify(state.ingresosOriginales)); }
        cerrar(); await window.ingresosService.cargarIngresosDesdeDB(); window.ingresosMessages.mostrarMensaje('Ingreso actualizado','success'); }catch(err){ console.error(err); window.ingresosMessages.mostrarMensaje('Error actualizando','danger'); } })(); };
    modal.addEventListener('click', e=>{ if(e.target===modal) cerrar(); });
    function cerrar(){ modal.style.animation='fadeOut .3s'; setTimeout(()=> modal.remove(),300); }
  }
  window.ingresosEdit = { editarIngreso };
})();