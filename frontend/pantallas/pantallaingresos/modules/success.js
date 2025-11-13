(function(){
  function mostrarMensajeExitoIngreso(){
    const mensaje=document.createElement('div'); mensaje.className='mensaje-exito-ingreso'; mensaje.innerHTML=`<div class="mensaje-icono"><svg width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="23" fill="#27ae60" stroke="#fff" stroke-width="2"/><path d="M15 25 L22 32 L35 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div><h3>¡Ingreso Guardado!</h3><p>Tu ingreso se ha registrado exitosamente</p>`;
    mensaje.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.3);z-index:9999;text-align:center;animation:popIn .4s cubic-bezier(0.68,-0.55,0.265,1.55)';
    document.body.appendChild(mensaje);
    setTimeout(()=>{ mensaje.style.animation='popIn .3s reverse'; setTimeout(()=> mensaje.remove(),300); },1500);
  }
  window.ingresosSuccess = { mostrarMensajeExitoIngreso };
})();