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
