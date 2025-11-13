(function(){
  function abrirModalAgregar(){
    if(document.getElementById('modalAgregarDeuda')) return; // evitar duplicados
    const wrap=document.createElement('div'); wrap.id='modalAgregarDeuda'; wrap.className='modal-overlay';
    wrap.innerHTML=`<div class='modal-form'><form id='formAgregarDeuda' autocomplete='off'>
      <h2>Agregar Deuda</h2>
      <label>Acreedor<input type='text' id='addAcreedorDeuda' required></label>
      <label>Monto<input type='number' id='addMontoDeuda' required min='0' step='0.01'></label>
      <label>Fecha Inicio<input type='date' id='addFechaInicioDeuda' required></label>
      <label>Estado<select id='addEstadoDeuda'><option value='pendiente'>Pendiente</option><option value='pagada'>Pagada</option><option value='renegociada'>Renegociada</option></select></label>
      <label>Fecha Vencimiento (Opcional)<input type='date' id='addFechaVencimientoDeuda'></label>
      <label>Tasa de Interés (%)<input type='number' id='addTasaInteresDeuda' min='0' step='0.01'></label>
      <label>Descripción<textarea id='addDescripcionDeuda'></textarea></label>
      <div class='botones'><button type='submit' class='btn btn-success btn-sm'>Guardar</button><button type='button' id='cancelarDeudaFirestore' class='btn btn-secondary btn-sm'>Cancelar</button></div>
    </form></div>`;
    document.body.appendChild(wrap);
    const form=document.getElementById('formAgregarDeuda'); const cancelar=document.getElementById('cancelarDeudaFirestore');
    cancelar&& (cancelar.onclick=()=> cerrar());
    wrap.addEventListener('click',e=>{ if(e.target===wrap) cerrar(); });
    // Attach submit handler only once to avoid duplicate adds
    if (!form.dataset.inited) {
      form.dataset.inited = '1'
      form.addEventListener('submit', async e=>{
        console.trace('submit handler triggered: modules/form.js')
        e.preventDefault(); const datos={ acreedor:val('addAcreedorDeuda'), monto:parseFloat(val('addMontoDeuda')), fechaInicio:val('addFechaInicioDeuda'), estado:val('addEstadoDeuda'), fechaVencimiento:val('addFechaVencimientoDeuda')||'', tasaInteres:parseFloat(val('addTasaInteresDeuda')||'0'), descripcion:val('addDescripcionDeuda').trim() };
        if(!datos.acreedor || !datos.fechaInicio || isNaN(datos.monto)){ window.deudasMessages.mostrar('Datos inválidos','error'); return; }
        await window.deudasService.agregarDeuda(datos); cerrar();
      });
    }
    function val(id){ return document.getElementById(id).value; }
    function cerrar(){ wrap.remove(); }
  }
  window.deudasForm={ abrirModalAgregar };
})();
