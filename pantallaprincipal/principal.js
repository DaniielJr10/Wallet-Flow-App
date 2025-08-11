document.addEventListener('DOMContentLoaded', function () {
  const botonAgregar = document.getElementById('botonAgregar');
  const menuOpciones = document.getElementById('menuOpciones');
  const btnNuevoIngreso = document.getElementById('btnNuevoIngreso');
  const contenedorModalIngreso = document.getElementById('contenedorModalIngreso');

  botonAgregar.addEventListener('click', function (e) {
    e.preventDefault();
    menuOpciones.classList.toggle('d-none');
  });

  // Cierra el menú si haces clic fuera
  document.addEventListener('click', function (event) {
    if (!menuOpciones.contains(event.target) && !botonAgregar.contains(event.target)) {
      menuOpciones.classList.add('d-none');
    }
  });

  // Mostrar el formulario de ingreso como modal y cargar su JS
  btnNuevoIngreso.addEventListener('click', async function (e) {
    e.preventDefault();
    menuOpciones.classList.add('d-none');
    // Cargar el HTML del formulario
    const response = await fetch('../formulario ingresos/foringresos.html');
    const html = await response.text();
    contenedorModalIngreso.innerHTML = html;
    // Cargar y ejecutar el JS del formulario
    const script = document.createElement('script');
    script.src = '../formulario ingresos/foringresos.js';
    script.onload = function() {
      // Inicializar la lógica del formulario después de cargar el JS
      if (typeof initFormularioIngreso === 'function') {
        initFormularioIngreso();
      }
      // Mostrar el modal (por si el JS no lo hace automáticamente)
      const modal = document.getElementById('modalAgregarIngreso');
      if (modal) {
        modal.classList.remove('d-none');
      }
    };
    document.body.appendChild(script);
  });
});


// Lógica del botón agregar cuenta
const btnNuevaCuenta = document.getElementById('btnNuevaCuenta');
const contenedorModalCuenta = document.getElementById('contenedorModalCuenta');

btnNuevaCuenta.addEventListener('click', async function (e) {
  e.preventDefault();
  menuOpciones.classList.add('d-none');

  const response = await fetch('../formulario cuentas/forcuentas.html');
  const html = await response.text();
  contenedorModalCuenta.innerHTML = html;

  const script = document.createElement('script');
  script.src = '../formulario cuentas/forcuentas.js';
  script.onload = function () {
    if (typeof initFormularioCuenta === 'function') {
      initFormularioCuenta();
    }

    const modal = document.getElementById('modalAgregarCuenta');
    if (modal) {
      modal.classList.remove('d-none');
    }
  };
  document.body.appendChild(script);
});

// Funcionalidad para cerrar sesión con confirmación
document.addEventListener('DOMContentLoaded', function () {
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Mostrar confirmación con alert
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmar) {
        // Si confirma, limpiar datos de sesión y redirigir
        localStorage.removeItem('walletflow_current_user');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Redirigir al inicio de sesión
        window.location.href = '../inicio de sesion/inicio.html';
      }
      // Si no confirma, no hace nada
    });
  }
});

