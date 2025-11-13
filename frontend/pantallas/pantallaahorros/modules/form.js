(function(){
  function abrirModalAhorro(editId=null){
    if(document.getElementById('modalAhorro')) return; const overlay=document.createElement('div'); overlay.id='modalAhorro'; overlay.className='modal-overlay'; const editData= editId? window.ahorrosState.state.ahorrosOriginales.find(a=> a.id===editId): null;
    overlay.innerHTML=`<div class='modal-form'><h5>${editId?'Editar Ahorro':'Agregar Ahorro'}</h5><form id='formAhorro'>
      <div class='mb-2'><label>Categoría</label><select id='catAhorro' class='form-select' required>
        <option value='meta'>Meta específica</option><option value='emergencia'>Fondo de emergencia</option><option value='inversion'>Inversión</option><option value='educacion'>Educación</option><option value='viaje'>Viaje</option><option value='otro'>Otro</option>
      </select></div>
      <div class='mb-2'><label>Monto</label><input id='montoAhorro' class='form-control' type='number' min='0' step='0.01' required></div>
      <div class='mb-2'><label>Fecha</label><input id='fechaAhorro' class='form-control' type='date' required></div>
      <div class='mb-2'><label>Método</label><select id='metodoAhorro' class='form-select'><option value='cuenta_ahorros'>Cuenta de ahorro</option><option value='banco'>Banco</option><option value='alcancia'>Alcancía</option><option value='efectivo'>Efectivo</option></select></div>
      <div class='mb-2'><label>Descripción</label><textarea id='descAhorro' class='form-control'></textarea></div>
      <div class='d-flex justify-content-between mt-3'><button type='submit' class='btn btn-warning'>Guardar</button><button type='button' id='cancelAhorro' class='btn btn-secondary'>Cancelar</button></div>
    </form></div>`;
    document.body.appendChild(overlay);
    if(editData){ overlay.querySelector('#catAhorro').value=editData.objetivo||editData.categoria||''; overlay.querySelector('#montoAhorro').value=(editData.montoActual?? editData.monto ?? ''); overlay.querySelector('#fechaAhorro').value=editData.fechaLimite||editData.fecha||''; overlay.querySelector('#metodoAhorro').value=editData.cuenta||editData.metodo||''; overlay.querySelector('#descAhorro').value=editData.descripcion||''; }
    overlay.querySelector('#cancelAhorro').onclick=()=> cerrar();
    overlay.addEventListener('click', e=>{ if(e.target===overlay) cerrar(); });
    overlay.querySelector('#formAhorro').onsubmit= async ev=>{
      ev.preventDefault(); const payload={ categoria:val('catAhorro'), monto:parseFloat(val('montoAhorro')), fecha:val('fechaAhorro'), metodo:val('metodoAhorro'), descripcion:val('descAhorro').trim() };
      if(isNaN(payload.monto)|| payload.monto<0){ window.ahorrosMessages.mostrar('Monto inválido','error'); return; }
      try{ if(editId){ await window.ahorrosService.actualizarAhorro(editId,{ objetivo:payload.categoria, montoActual:payload.monto, fechaLimite:payload.fecha, cuenta:payload.metodo, descripcion:payload.descripcion }); }
        else { await window.ahorrosService.agregarAhorro({ objetivo:payload.categoria, montoObjetivo:payload.monto, montoActual:payload.monto, fechaLimite:payload.fecha, cuenta:payload.metodo, descripcion:payload.descripcion }); }
        cerrar(); }
      catch(e){ console.error(e); window.ahorrosMessages.mostrar('Error guardando','error'); }
    };
    function val(id){ return overlay.querySelector('#'+id).value; }
    function cerrar(){ overlay.remove(); }
  }
  window.ahorrosForm={ abrirModalAhorro };
})();
