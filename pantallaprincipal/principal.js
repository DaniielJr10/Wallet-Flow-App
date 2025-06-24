document.addEventListener('DOMContentLoaded', function () {
    const botonAgregar = document.getElementById('botonAgregar');
    const menuOpciones = document.getElementById('menuOpciones');
  
    botonAgregar.addEventListener('click', function (e) {
      e.preventDefault();
      menuOpciones.classList.toggle('d-none');
    });
  
    // (Opcional) Cerrar menú si haces clic fuera
    document.addEventListener('click', function (event) {
      if (!menuOpciones.contains(event.target) && !botonAgregar.contains(event.target)) {
        menuOpciones.classList.add('d-none');
      }
    });
  });
  