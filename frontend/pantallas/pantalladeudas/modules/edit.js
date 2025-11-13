(function(){
  function editarDeuda(id){
    const deuda=window.deudasState.state.deudasOriginales.find(d=> d.id===id); if(!deuda) return window.deudasMessages.mostrar('No encontrada','error');
    const cont=document.createElement('div'); cont.id='modalEditarDeuda'; cont.className='modal-overlay';
    cont.innerHTML=`<form id='formEditarDeuda' class='modal-form'>
      <h5>Editar Deuda</h5>
      <label>Acreedor<input class='form-control' name='acreedor' value='${deuda.acreedor||''}' required></label>
      <label>Monto<input class='form-control' name='monto' type='number' min='0' step='0.01' value='${deuda.monto||0}' required></label>
      <label>Fecha Inicio<input class='form-control' name='fechaInicio' type='date' value='${deuda.fechaInicio||''}' required></label>
      <label>Fecha Vencimiento<input class='form-control' name='fechaVencimiento' type='date' value='${deuda.fechaVencimiento||''}'></label>
      <label>Tasa Interés (%)<input class='form-control' name='tasaInteres' type='number' step='0.01' value='${deuda.tasaInteres||''}'></label>
      <label>Estado<select class='form-control' name='estado'>
        <option value='pendiente' ${deuda.estado==='pendiente'?'selected':''}>Pendiente</option>
        <option value='pagada' ${deuda.estado==='pagada'?'selected':''}>Pagada</option>
        <option value='renegociada' ${deuda.estado==='renegociada'?'selected':''}>Renegociada</option>
      </select></label>
      <label>Descripción<input class='form-control' name='descripcion' value='${deuda.descripcion||''}'></label>
      <div class='form-buttons mt-3'><button type='submit' class='btn btn-success btn-sm'>Guardar</button><button type='button' id='cancelarEditarDeuda' class='btn btn-secondary btn-sm'>Cancelar</button></div>
    </form>`;
    document.body.appendChild(cont);
    document.getElementById('cancelarEditarDeuda').onclick=()=> cerrar();
    document.getElementById('formEditarDeuda').onsubmit=async function(e){
      e.preventDefault(); const fd=new FormData(this); const upd={ acreedor:fd.get('acreedor'), monto:parseFloat(fd.get('monto')), fechaInicio:fd.get('fechaInicio'), fechaVencimiento:fd.get('fechaVencimiento'), tasaInteres:parseFloat(fd.get('tasaInteres')||'0'), estado:fd.get('estado'), descripcion:fd.get('descripcion') };
      if(isNaN(upd.monto)|| upd.monto<0){ window.deudasMessages.mostrar('Monto inválido','error'); return; }
      await window.deudasService.actualizarDeuda(deuda.id, upd); cerrar();
    };
    cont.addEventListener('click', e=>{ if(e.target===cont) cerrar(); });
    function cerrar(){ cont.remove(); }
  }
  window.deudasEdit={ editarDeuda };
})();
