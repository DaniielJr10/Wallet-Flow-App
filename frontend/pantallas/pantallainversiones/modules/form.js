(function(){
  function abrirModalAgregar(){ if(document.getElementById('modalAgregarInversion')) return; const wrap=document.createElement('div'); wrap.id='modalAgregarInversion'; wrap.className='modal-overlay'; wrap.innerHTML=`<div class='modal-form'><form id='formAgregarInversion' autocomplete='off'>
    <h2>Agregar Inversión</h2>
    <label>Tipo<select id='addTipoInversion' required><option value='acciones'>Acciones</option><option value='bonos'>Bonos</option><option value='fondos_mutuos'>Fondos Mutuos</option><option value='bienes_raices'>Bienes Raíces</option><option value='criptomonedas'>Criptomonedas</option><option value='otro'>Otro</option></select></label>
    <label>Monto<input type='number' id='addMontoInversion' required min='0' step='0.01'></label>
    <label>Fecha Inicio<input type='date' id='addFechaInicioInversion' required></label>
    <label>Riesgo<select id='addRiesgoInversion' required><option value='bajo'>Bajo</option><option value='medio'>Medio</option><option value='alto'>Alto</option></select></label>
    <label>Fecha Fin (Opcional)<input type='date' id='addFechaFinInversion'></label>
    <label>Rendimiento Esperado (%)<input type='number' id='addRendimientoEsperadoInversion' min='0' step='0.01'></label>
    <label>Descripción<textarea id='addDescripcionInversion'></textarea></label>
    <div class='botones'><button type='submit' class='btn btn-success btn-sm'>Guardar</button><button type='button' id='cancelarInversionFirestore' class='btn btn-secondary btn-sm'>Cancelar</button></div>
  </form></div>`; document.body.appendChild(wrap); const form=document.getElementById('formAgregarInversion'); const cancelar=document.getElementById('cancelarInversionFirestore'); cancelar&& (cancelar.onclick=()=> cerrar()); wrap.addEventListener('click',e=>{ if(e.target===wrap) cerrar(); }); form.onsubmit= async e=>{ e.preventDefault(); const datos={ tipo:val('addTipoInversion'), monto:parseFloat(val('addMontoInversion')), fechaInicio:val('addFechaInicioInversion'), riesgo:val('addRiesgoInversion'), fechaFin:val('addFechaFinInversion')||'', rendimientoEsperado:parseFloat(val('addRendimientoEsperadoInversion')||'0'), descripcion:val('addDescripcionInversion').trim() }; if(!datos.tipo || isNaN(datos.monto)){ window.inversionesMessages.mostrar('Datos inválidos','error'); return; } await window.inversionesService.agregarInversion(datos); cerrar(); }; function val(id){ return document.getElementById(id).value; } function cerrar(){ wrap.remove(); } }
  window.inversionesForm={ abrirModalAgregar };
})();
