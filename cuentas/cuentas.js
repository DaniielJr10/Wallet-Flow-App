function renderizarCuentas() {
  const contenedorCuentas = document.getElementById('contenedorCuentas');
  contenedorCuentas.innerHTML = ''; // Limpiar el contenedor antes de renderizar

  const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];

  cuentas.forEach((cuenta, index) => {
    // Crear la tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-4 mb-4'; // Clase de Bootstrap para columnas y margen inferior
    tarjeta.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${cuenta.nombre}</h5>
          <div class="d-flex justify-content-between">
            <span class="label">Tipo:</span>
            <span class="value">${cuenta.tipo}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="label">Número:</span>
            <span class="value">${cuenta.numero}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="label">Saldo Inicial:</span>
            <span class="value">$${cuenta.saldoInicial.toFixed(2)}</span>
          </div>
          ${cuenta.esPrincipal ? '<span class="badge bg-success">Principal</span>' : ''}
          <div class="mt-3">
            <button class="btn btn-primary btn-editar" data-index="${index}">Editar</button>
            <button class="btn btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    contenedorCuentas.appendChild(tarjeta);
  });

  // Agregar eventos a los botones de eliminar
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      eliminarCuenta(index);
    });
  });

  // Agregar eventos a los botones de editar
  const botonesEditar = document.querySelectorAll('.btn-editar');
  botonesEditar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      editarCuenta(index);
    });
  });
}

// Función para eliminar una cuenta con confirmación
function eliminarCuenta(index) {
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta cuenta?');
  if (confirmacion) {
    const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
    cuentas.splice(index, 1); // Eliminar la cuenta del array
    localStorage.setItem('cuentas', JSON.stringify(cuentas)); // Actualizar localStorage
    renderizarCuentas(); // Volver a renderizar las tarjetas
    alert('¡Cuenta eliminada exitosamente!'); // Mensaje de éxito
  }
}

// Función para editar una cuenta
function editarCuenta(index) {
  const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
  const cuenta = cuentas[index];

  // Mostrar el modal con los datos de la cuenta
  const modal = new bootstrap.Modal(document.getElementById('modalAgregarCuenta'));
  modal.show();

  // Rellenar el formulario con los datos de la cuenta
  document.getElementById('nombreCuenta').value = cuenta.nombre;
  document.getElementById('tipoCuenta').value = cuenta.tipo;
  document.getElementById('numeroCuenta').value = cuenta.numero;
  document.getElementById('saldoInicial').value = cuenta.saldoInicial;
  document.getElementById('cuentaPrincipal').checked = cuenta.esPrincipal;

  // Actualizar la cuenta al guardar
  const form = document.getElementById('formAgregarCuenta');
  form.onsubmit = function (e) {
    e.preventDefault();
    cuentas[index] = {
      nombre: document.getElementById('nombreCuenta').value,
      tipo: document.getElementById('tipoCuenta').value,
      numero: document.getElementById('numeroCuenta').value,
      saldoInicial: parseFloat(document.getElementById('saldoInicial').value),
      esPrincipal: document.getElementById('cuentaPrincipal').checked
    };
    localStorage.setItem('cuentas', JSON.stringify(cuentas)); // Actualizar localStorage
    modal.hide(); // Cerrar el modal
    form.reset(); // Limpiar el formulario
    renderizarCuentas(); // Volver a renderizar las tarjetas
  };
}

// Renderizar las cuentas al cargar la página
document.addEventListener('DOMContentLoaded', renderizarCuentas);

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
