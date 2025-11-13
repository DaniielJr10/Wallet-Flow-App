(function(){
  function ensureOption(list, currentValue, labelMap){
    // Si currentValue no está en list, agregamos una opción con ese valor para no perderlo
    if(!currentValue) return '';
    const exists = list.some(v => v === currentValue);
    return exists ? '' : `<option value='${currentValue}' selected>${labelMap?.[currentValue] || currentValue}</option>`;
  }

  function editarGasto(id){
    const { state }=window.gastosState; const gasto= state.gastosOriginales.find(g=> g.id===id); if(!gasto) return window.gastosMessages.mostrarMensaje('Gasto no encontrado','error');

    // Enumeraciones alineadas con el formulario de alta
    const categorias = ['alimentacion','transporte','entretenimiento','servicios','compras','otro'];
    const categoriaLabels = { alimentacion:'Alimentación', transporte:'Transporte', entretenimiento:'Entretenimiento', servicios:'Servicios', compras:'Compras', otro:'Otro' };
    const metodos = ['efectivo','tarjeta_credito','tarjeta_debito','transferencia','nequidaviplata'];
    const metodoLabels = { efectivo:'Efectivo', tarjeta_credito:'Tarjeta de Crédito', tarjeta_debito:'Tarjeta de Débito', transferencia:'Transferencia', nequidaviplata:'Nequi/Daviplata' };
    const frecuencias = ['diario','semanal','mensual'];
    const frecuenciaLabels = { diario:'Diario', semanal:'Semanal', mensual:'Mensual' };

    const categoriaOptions = ensureOption(categorias, gasto.categoria, categoriaLabels) + categorias.map(c=>`<option value='${c}' ${gasto.categoria===c?'selected':''}>${categoriaLabels[c]}</option>`).join('');
    const metodoOptions = ensureOption(metodos, gasto.metodo, metodoLabels) + metodos.map(m=>`<option value='${m}' ${gasto.metodo===m?'selected':''}>${metodoLabels[m]}</option>`).join('');
    const frecuenciaOptions = `<option value=''>No aplica</option>` + ensureOption(frecuencias, gasto.frecuencia, frecuenciaLabels) + frecuencias.map(f=>`<option value='${f}' ${gasto.frecuencia===f?'selected':''}>${frecuenciaLabels[f]}</option>`).join('');

    const formHtml=`<form id='formEditarGasto' class='form-editar'><h5 class='form-titulo'><i class='bi bi-pencil-square me-2'></i>Editar Gasto</h5>`+
      `<div class='row'><div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-tag me-2'></i>Categoría</label><select class='form-select' name='categoria' required>${categoriaOptions}</select></div>`+
      `<div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-credit-card me-2'></i>Método</label><select class='form-select' name='metodo' required>${metodoOptions}</select></div></div>`+
      `<div class='row'><div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-currency-dollar me-2'></i>Monto</label><input class='form-control' name='monto' type='number' min='0.01' step='0.01' value='${gasto.monto}' required></div>`+
      `<div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-calendar me-2'></i>Fecha</label><input class='form-control' name='fecha' type='date' value='${gasto.fecha}' required></div></div>`+
      `<div class='mb-3'><label class='form-label'><i class='bi bi-file-text me-2'></i>Descripción</label><textarea class='form-control' name='descripcion' rows='2'>${gasto.descripcion||''}</textarea></div>`+
      `<div class='row'><div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-repeat me-2'></i>Recurrente</label><select class='form-select' name='esRecurrente'><option value='true' ${gasto.esRecurrente?'selected':''}>Sí</option><option value='false' ${!gasto.esRecurrente?'selected':''}>No</option></select></div>`+
      `<div class='col-md-6 mb-3'><label class='form-label'><i class='bi bi-clock me-2'></i>Frecuencia</label><select class='form-select' name='frecuencia'>${frecuenciaOptions}</select></div></div>`+
      `<div class='mb-3'><label class='form-label'><i class='bi bi-bank me-2'></i>Cuenta</label><input class='form-control' name='cuenta' value='${gasto.cuenta||''}'></div>`+
      `<div class='form-buttons'><button type='submit' class='btn btn-success'><i class='bi bi-check-circle me-2'></i>Guardar</button>`+
      `<button type='button' class='btn btn-secondary' id='cancelarEditarGasto'><i class='bi bi-x-circle me-2'></i>Cancelar</button></div></form>`;

    const modal=document.createElement('div'); modal.id='modalEditarGasto'; modal.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(5px);animation:fadeIn .3s'; modal.innerHTML=formHtml; document.body.appendChild(modal);
    document.getElementById('cancelarEditarGasto').onclick=()=> cerrar();
    document.getElementById('formEditarGasto').onsubmit=function(e){ e.preventDefault(); const fd=new FormData(this); const monto=parseFloat(fd.get('monto')); if(!(monto>0)){ alert('El monto debe ser mayor a 0'); return; }
      const actualizado={ categoria:fd.get('categoria'), metodo:fd.get('metodo'), monto:monto, fecha:fd.get('fecha'), descripcion:(fd.get('descripcion')||'').trim(), esRecurrente:fd.get('esRecurrente')==='true', frecuencia:fd.get('frecuencia')||'', cuenta:(fd.get('cuenta')||'').trim() };
      (async()=>{ try{ await window.gastosService.actualizarGasto(gasto.id, actualizado); cerrar(); }catch(err){ console.error(err); window.gastosMessages.mostrarMensaje('Error actualizando','error'); } })(); };
    modal.addEventListener('click', e=>{ if(e.target===modal) cerrar(); });
    function cerrar(){ modal.style.animation='fadeOut .3s'; setTimeout(()=> modal.remove(),300); }
  }
  window.gastosEdit={ editarGasto };
})();