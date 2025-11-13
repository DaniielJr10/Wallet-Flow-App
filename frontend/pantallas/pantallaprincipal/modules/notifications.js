// Notificaciones simples (puede reutilizar utilidades globales luego)
(function(){
  function mostrarNotificacion(mensaje, tipo='info'){
    const div=document.createElement('div');
    div.className='alert alert-'+tipo+' alert-dismissible fade show position-fixed';
    div.style.cssText='top:20px;right:20px;z-index:9999;min-width:300px;border-radius:15px;box-shadow:0 8px 25px rgba(0,0,0,0.15);border:none;';
    div.innerHTML = mensaje + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    document.body.appendChild(div);
    setTimeout(()=>{ if(div.parentNode){ div.style.opacity='0'; div.style.transform='translateX(100%)'; setTimeout(()=> div.remove(),300); } },4000);
  }
  window.principalNotifications = { mostrarNotificacion };
})();
