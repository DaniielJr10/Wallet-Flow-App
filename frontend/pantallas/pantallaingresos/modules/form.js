(function(){
  function initFormularioIngreso(){
    const modal=document.getElementById('modalAgregarIngreso');
    const form=document.getElementById('formAgregarIngreso');
    const step1=document.getElementById('step1');
    const step2=document.getElementById('step2');
    const next=document.querySelector('.next-step-btn');
    const prev=document.querySelector('.prev-step-btn');
    const checkRec=document.getElementById('addCheckRecurrenteIngreso');
    const freqOpt=document.getElementById('addFrecuenciaOptionsIngreso');
    const checkCuenta=document.getElementById('addCheckCuentaIngreso');
    const cuentaOpt=document.getElementById('addCuentaAsociadaOptionsIngreso');
    const cancelar=document.getElementById('cancelarIngreso');
    if(!modal || !form || modal.dataset.initialized==='true') return; modal.dataset.initialized='true';
    next?.addEventListener('click',()=>{ step1.classList.add('hidden'); step2.classList.remove('hidden'); });
    prev?.addEventListener('click',()=>{ step2.classList.add('hidden'); step1.classList.remove('hidden'); });
    checkRec?.addEventListener('change',()=> freqOpt.classList.toggle('visible', checkRec.checked));
    checkCuenta?.addEventListener('change',()=> cuentaOpt.classList.toggle('visible', checkCuenta.checked));
    cancelar?.addEventListener('click',()=> cerrarModalIngreso());
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !modal.classList.contains('d-none')) cerrarModalIngreso(); });
    modal.addEventListener('click', e=>{ if(e.target===modal) cerrarModalIngreso(); });
    form.addEventListener('submit', async e=>{
      e.preventDefault(); e.stopPropagation();
      const datos={ categoria:document.getElementById('addCategoriaIngreso').value, metodo:document.getElementById('addMetodoIngreso').value, monto:document.getElementById('addMontoIngreso').value, fecha:document.getElementById('addFechaIngreso').value, descripcion:document.getElementById('addDescripcionIngreso').value, esRecurrente:checkRec.checked, frecuencia:document.getElementById('addFrecuenciaIngreso').value, tieneCuenta:checkCuenta.checked, cuenta:document.getElementById('addCuentaAsociadaIngreso').value };
      if(!datos.categoria||!datos.metodo||!datos.fecha||!datos.monto||parseFloat(datos.monto)<=0){ window.ingresosMessages.mostrarMensaje('Completa datos obligatorios','danger'); step2.classList.add('hidden'); step1.classList.remove('hidden'); return; }
      try{ const isAuthed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser); if(!window.walletDB || !isAuthed) throw new Error('Inicia sesión'); await window.walletDB.addIncome(datos); cerrarModalIngreso(); await window.ingresosService.cargarIngresosDesdeDB(); window.ingresosMessages.mostrarMensaje('Ingreso guardado','success'); }catch(err){ console.error(err); window.ingresosMessages.mostrarMensaje(err.message||'Error guardando','danger'); }
    });
    function cerrarModalIngreso(){ modal.classList.add('d-none'); form.reset(); step2.classList.add('hidden'); step1.classList.remove('hidden'); freqOpt.classList.remove('visible'); cuentaOpt.classList.remove('visible'); modal.dataset.initialized='false'; }
    window.ingresosForm = { cerrarModalIngreso };
  }
  window.ingresosFormInit = { initFormularioIngreso };
})();