(function(){
  function initFormulario(){
    const modal=document.getElementById('modalAgregarGasto');
    const form=document.getElementById('formAgregarGasto');
    const step1=document.getElementById('step1'); const step2=document.getElementById('step2');
    const next=document.querySelector('.next-step-btn'); const prev=document.querySelector('.prev-step-btn');
    const chkRec=document.getElementById('addCheckRecurrenteGasto'); const freqOpt=document.getElementById('addFrecuenciaOptionsGasto');
    const chkCuenta=document.getElementById('addCheckCuentaGasto'); const cuentaOpt=document.getElementById('addCuentaAsociadaOptionsGasto');
    const cancelar=document.getElementById('cancelarGasto');
    if(!modal || modal.dataset.initialized==='true') return; modal.dataset.initialized='true';
    next&& next.addEventListener('click',()=>{ step1.classList.add('hidden'); step2.classList.remove('hidden'); });
    prev&& prev.addEventListener('click',()=>{ step2.classList.add('hidden'); step1.classList.remove('hidden'); });
    chkRec&& chkRec.addEventListener('change',()=> freqOpt.classList.toggle('visible', chkRec.checked));
    chkCuenta&& chkCuenta.addEventListener('change',()=> cuentaOpt.classList.toggle('visible', chkCuenta.checked));
    cancelar&& cancelar.addEventListener('click', ()=> cerrar());
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !modal.classList.contains('d-none')) cerrar(); });
    modal.addEventListener('click', e=>{ if(e.target===modal) cerrar(); });
    form.addEventListener('submit', async e=>{
      e.preventDefault(); const datos={ categoria:document.getElementById('addCategoriaGasto').value, metodo:document.getElementById('metodoPago').value, monto:document.getElementById('addMontoGasto').value, fecha:document.getElementById('addFechaGasto').value, descripcion:document.getElementById('addDescripcionGasto').value, esRecurrente:chkRec.checked, frecuencia:document.getElementById('addFrecuenciaGasto').value, tieneCuenta:chkCuenta.checked, cuenta:document.getElementById('addCuentaAsociadaGasto').value };
      if(!datos.categoria || !datos.metodo || !datos.fecha || !datos.monto || parseFloat(datos.monto)<=0){ window.gastosMessages.mostrarMensaje('Completa datos obligatorios','error'); step2.classList.add('hidden'); step1.classList.remove('hidden'); return; }
      await window.gastosService.agregarGasto(datos); cerrar();
    });
    function cerrar(){ modal.classList.add('d-none'); form.reset(); step2.classList.add('hidden'); step1.classList.remove('hidden'); freqOpt.classList.remove('visible'); cuentaOpt.classList.remove('visible'); modal.dataset.initialized='false'; }
    window.gastosForm={ cerrar };
  }
  window.gastosFormInit={ initFormulario };
})();