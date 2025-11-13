(function(){
  function abrirModalAgregar(){ cargarFormulario(true); }
  function editarCuenta(id){ cargarFormulario(false,id); }
  async function cargarFormulario(isNew,id){
    const formHtmlPath='../../formularios/formulario cuentas/forcuentas.html';
    const formJsPath='../../formularios/formulario cuentas/forcuentas.js';
    try{
      const resp=await fetch(encodeURI(formHtmlPath)); if(!resp.ok) throw new Error('HTTP '+resp.status); const html=await resp.text();
      const cont=document.getElementById('contenedorModalCuenta'); if(!cont) throw new Error('ContenedorModalCuenta no encontrado');
      const existing=cont.querySelector('#modalAgregarCuenta'); if(existing) existing.remove();
      cont.innerHTML=html;
      const scriptLoaded=Array.from(document.scripts).some(s=> s.src && s.src.includes(encodeURI(formJsPath)));
      if(!scriptLoaded){ await new Promise((res,rej)=>{ const sc=document.createElement('script'); sc.src=encodeURI(formJsPath); sc.onload=()=>res(); sc.onerror=rej; document.body.appendChild(sc); }); }
      if(typeof initFormularioCuenta==='function'){ try{ initFormularioCuenta(); }catch(e){ console.error('initFormularioCuenta error',e); } }
      const modal=document.getElementById('modalAgregarCuenta'); if(modal){ modal.classList.remove('d-none'); }
      if(!isNew && id){ precargarEdicion(id); }
    }catch(e){ console.error('Error cargando formulario cuenta:', e); alert('No se pudo cargar el formulario'); }
  }
  function precargarEdicion(id){ const cuenta=window.cuentasState.state.cuentasOriginales.find(c=> c.id===id); if(!cuenta) return; document.getElementById('nombreCuenta').value=cuenta.nombre||''; document.getElementById('tipoCuenta').value=cuenta.tipo||''; document.getElementById('numeroCuenta').value=cuenta.numero||''; document.getElementById('saldoInicial').value=cuenta.saldo||0; document.getElementById('cuentaPrincipal').checked=!!cuenta.esPrincipal; let hidden=document.getElementById('hiddenAccountId'); if(!hidden){ hidden=document.createElement('input'); hidden.type='hidden'; hidden.id='hiddenAccountId'; document.getElementById('formAgregarCuenta').appendChild(hidden); } hidden.value=id; const label=document.getElementById('modalEditarCuentaLabel'); if(label) label.textContent='Editar Cuenta'; }
  window.cuentasForm={ abrirModalAgregar,editarCuenta };
})();
