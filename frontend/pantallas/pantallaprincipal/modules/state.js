// Estado y referencias DOM de Pantalla Principal
(function(){
  const refs = {};
  function cacheDom(){
    refs.botonAgregar = document.getElementById('botonAgregar');
    refs.menuOpciones = document.getElementById('menuOpciones');
    refs.btnNuevoIngreso = document.getElementById('btnNuevoIngreso');
    refs.contenedorModalIngreso = document.getElementById('contenedorModalIngreso');
    refs.btnNuevoGasto = document.getElementById('btnNuevoGasto');
    refs.contenedorModalGasto = document.getElementById('contenedorModalGasto');
    refs.btnNuevaCuenta = document.getElementById('btnNuevaCuenta');
    refs.contenedorModalCuenta = document.getElementById('contenedorModalCuenta');
    refs.btnNuevoAhorro = document.querySelector('.ahorro-item');
    refs.contenedorModalAhorro = document.getElementById('contenedorModalAhorro');
    refs.btnNuevaDeuda = document.querySelector('.deuda-item');
    refs.contenedorModalDeuda = document.getElementById('contenedorModalDeuda');
    refs.btnNuevaInversion = document.querySelector('.inversion-item');
    refs.contenedorModalInversion = document.getElementById('contenedorModalInversion');
    refs.btnNuevoObjetivo = document.querySelector('.objetivo-item');
    refs.contenedorModalObjetivo = document.getElementById('contenedorModalObjetivo');
    refs.cerrarSesionPerfil = document.getElementById('cerrarSesionPerfil');
    refs.cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  }
  window.principalState = { refs, cacheDom };
})();
