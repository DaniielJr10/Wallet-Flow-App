// Enlaza eventos de UI
(function(){
  function bind(){
    const r = window.principalState.refs;
    // Botón flotante
    if(r.botonAgregar){ r.botonAgregar.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.crearEfectoRipple(e, r.botonAgregar); window.principalMenu.toggleMenu(r.menuOpciones); }); }
    // Cerrar menú por botón
    const btnCerrarMenu = document.getElementById('btnCerrarMenu');
    if(btnCerrarMenu){ btnCerrarMenu.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); }); }
    // Cerrar menú clic fuera
    document.addEventListener('click', ev=>{ if(r.menuOpciones && !r.menuOpciones.contains(ev.target) && r.botonAgregar && !r.botonAgregar.contains(ev.target)){ window.principalMenu.cerrarMenu(r.menuOpciones); } });
    // Items
    if(r.btnNuevoIngreso) r.btnNuevoIngreso.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevoIngreso().catch(err=> window.principalNotifications.mostrarNotificacion('Error ingreso','danger')); });
    if(r.btnNuevoGasto){
      r.btnNuevoGasto.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevoGasto().catch(err=> window.principalNotifications.mostrarNotificacion('Error gasto','danger')); });
      r.btnNuevoGasto.addEventListener('contextmenu', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.location.href='../PantallaGastos/Gastos.html'; });
      let pressTimer; r.btnNuevoGasto.addEventListener('touchstart', ()=>{ pressTimer = setTimeout(()=>{ window.principalMenu.cerrarMenu(r.menuOpciones); window.location.href='../PantallaGastos/Gastos.html'; },800); }); r.btnNuevoGasto.addEventListener('touchend', ()=> clearTimeout(pressTimer));
    }
    if(r.btnNuevoAhorro) r.btnNuevoAhorro.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevoAhorro().catch(()=> window.principalNotifications.mostrarNotificacion('Error ahorro','danger')); });
    if(r.btnNuevaCuenta) r.btnNuevaCuenta.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevaCuenta().catch(()=> window.principalNotifications.mostrarNotificacion('Error cuenta','danger')); });
    if(r.btnNuevaDeuda) r.btnNuevaDeuda.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevaDeuda().catch(()=> window.principalNotifications.mostrarNotificacion('Error deuda','danger')); });
    if(r.btnNuevaInversion) r.btnNuevaInversion.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevaInversion().catch(()=> window.principalNotifications.mostrarNotificacion('Error inversión','danger')); });
    if(r.btnNuevoObjetivo) r.btnNuevoObjetivo.addEventListener('click', e=>{ e.preventDefault(); window.principalMenu.cerrarMenu(r.menuOpciones); window.principalLoaders.nuevoObjetivo().catch(()=> window.principalNotifications.mostrarNotificacion('Error objetivo','danger')); });
    // Logout
    if(r.cerrarSesionPerfil) r.cerrarSesionPerfil.addEventListener('click', e=>{ e.preventDefault(); window.principalLogout.cerrarSesion(); });
    if(r.cerrarSesionBtn) r.cerrarSesionBtn.addEventListener('click', e=>{ e.preventDefault(); window.principalLogout.cerrarSesion(); });
    // Hover animación menú items
    document.querySelectorAll('.menu-item').forEach(item=>{ item.addEventListener('mouseenter', ()=> item.style.transform='translateX(8px)'); item.addEventListener('mouseleave', ()=> item.style.transform='translateX(0)'); });
  }
  window.principalActions = { bind };
})();
