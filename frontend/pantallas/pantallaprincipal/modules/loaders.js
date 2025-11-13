// Cargadores dinámicos de formularios
(function(){
  function fetchInject(pathHtml, pathJs, container, initFnName, modalId, showFn){
    return fetch(encodeURI(pathHtml))
      .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); })
      .then(html=>{ container.innerHTML=html; return new Promise(res=>{ const s=document.createElement('script'); s.src=encodeURI(pathJs); s.onload=()=>res(); s.onerror=()=>res(); document.body.appendChild(s); }); })
      .then(()=>{ if(typeof window[initFnName]==='function'){
        const refreshCallback = window['render'+initFnName.replace('initFormulario','')] || null;
        try{ window[initFnName](refreshCallback); }catch(e){ console.log('Init error', e); }
      }
        const modal = document.getElementById(modalId);
        if(modal){ showFn ? showFn(modal) : modal.classList.remove('d-none'); }
      });
  }
  function nuevoIngreso(){ const st=window.principalState.refs; return fetchInject('../../formularios/formulario ingresos/foringresos.html','../../formularios/formulario ingresos/foringresos.js', st.contenedorModalIngreso,'initFormularioIngreso','modalAgregarIngreso'); }
  function nuevoGasto(){ const st=window.principalState.refs; return fetchInject('../../formularios/FormularioGastos/FormularioG.html','../../formularios/FormularioGastos/FormularioG.js', st.contenedorModalGasto,'initFormularioGasto','modalAgregar', m=> m.style.display='flex'); }
  function nuevaCuenta(){ const st=window.principalState.refs; return fetchInject('../../formularios/formulario cuentas/forcuentas.html','../../formularios/formulario cuentas/forcuentas.js', st.contenedorModalCuenta,'initFormularioCuenta','modalAgregarCuenta'); }
  function nuevoAhorro(){ const st=window.principalState.refs; return fetchInject('../../formularios/formulario ahorros/forahorros.html','../../formularios/formulario ahorros/forahorros.js', st.contenedorModalAhorro,'initFormularioAhorro','modalAgregarAhorro'); }
  function nuevaDeuda(){ const st=window.principalState.refs; return fetchInject('../../formularios/formulario-deudas/fordeudas.html','../../formularios/formulario-deudas/fordeudas.js', st.contenedorModalDeuda,'initFormularioDeuda','modalAgregarDeuda'); }
  function nuevaInversion(){ const st=window.principalState.refs; return fetchInject('../../formularios/formulario-inversiones/forinversiones.html','../../formularios/formulario-inversiones/forinversiones.js', st.contenedorModalInversion,'initFormularioInversion','modalAgregarInversion'); }
  function nuevoObjetivo(){ const st=window.principalState.refs; return fetchInject('../../formularios/FormularioObjetivo/FormularioOb.html','../../formularios/FormularioObjetivo/FormularioObj.js', st.contenedorModalObjetivo,'initFormularioObjetivo','modalAgregarObjetivo', modal=>{ const bModal=new bootstrap.Modal(modal); bModal.show(); }); }
  window.principalLoaders = { nuevoIngreso, nuevoGasto, nuevaCuenta, nuevoAhorro, nuevaDeuda, nuevaInversion, nuevoObjetivo };
})();
