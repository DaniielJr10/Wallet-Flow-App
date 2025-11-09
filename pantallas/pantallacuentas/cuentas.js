function renderizarCuentas() {
  const contenedorCuentas = document.getElementById('contenedorCuentas');
  contenedorCuentas.innerHTML = ''; // Limpiar el contenedor antes de renderizar

  const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];

  cuentas.forEach((cuenta, index) => {
    // Crear la tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-4 mb-4'; // Clase de Bootstrap para columnas y margen inferior
    tarjeta.innerHTML = `
      <div class="account-card">
        <div class="card-header-custom">
          <div class="account-icon">
            <i class="bi ${getAccountIcon(cuenta.tipo)}"></i>
          </div>
          <div class="account-status">
            ${cuenta.esPrincipal ? '<span class="badge-principal"><i class="bi bi-star-fill"></i> Principal</span>' : ''}
          </div>
        </div>
        
        <div class="card-content">
          <h3 class="account-name">${cuenta.nombre}</h3>
          <div class="account-type">${cuenta.tipo}</div>
          
          <div class="account-details">
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-credit-card-2-front"></i>
                Número de cuenta
              </span>
              <span class="detail-value">${cuenta.numero}</span>
            </div>
            
            <div class="detail-item balance-item">
              <span class="detail-label">
                <i class="bi bi-cash-stack"></i>
                Saldo disponible
              </span>
              <span class="detail-value balance-value">$${formatCurrency(cuenta.saldoInicial)}</span>
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button class="btn-action btn-edit" data-index="${index}">
            <i class="bi bi-pencil-square"></i>
            <span>Editar</span>
          </button>
          <button class="btn-action btn-delete" data-index="${index}">
            <i class="bi bi-trash"></i>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    `;
    contenedorCuentas.appendChild(tarjeta);
  });

  // Agregar eventos a los botones de eliminar
  const botonesEliminar = document.querySelectorAll('.btn-delete');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      eliminarCuenta(index);
    });
  });

  // Agregar eventos a los botones de editar
  const botonesEditar = document.querySelectorAll('.btn-edit');
  botonesEditar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      editarCuenta(index);
    });
  });
}

// Función auxiliar para obtener el icono según el tipo de cuenta
function getAccountIcon(tipo) {
  const iconMap = {
    'Ahorros': 'bi-piggy-bank-fill',
    'Corriente': 'bi-bank2',
    'Credito': 'bi-credit-card-fill',
    'Débito': 'bi-credit-card-2-front-fill',
    'Efectivo': 'bi-cash-stack',
    'Digital': 'bi-phone-fill'
  };
  return iconMap[tipo] || 'bi-bank';
}

// Función auxiliar para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
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

  // Actualizar el título del modal
  document.getElementById('modalEditarCuentaLabel').textContent = 'Editar Cuenta';

  // Actualizar la cuenta al guardar
  const form = document.getElementById('formAgregarCuenta');
  form.onsubmit = function (e) {
    e.preventDefault();
    
    // Validar que se haya seleccionado un tipo
    const tipoSeleccionado = document.getElementById('tipoCuenta').value;
    if (!tipoSeleccionado) {
      showFormError('Por favor selecciona un tipo de cuenta');
      return;
    }

    cuentas[index] = {
      nombre: document.getElementById('nombreCuenta').value,
      tipo: tipoSeleccionado,
      numero: document.getElementById('numeroCuenta').value,
      saldoInicial: parseFloat(document.getElementById('saldoInicial').value),
      esPrincipal: document.getElementById('cuentaPrincipal').checked
    };
    
    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    modal.hide();
    form.reset();
    renderizarCuentas();
    showSuccessMessage('¡Cuenta actualizada exitosamente!');
  };
}

// Función para mostrar mensajes de error
function showFormError(message) {
  // Crear o actualizar mensaje de error
  let errorDiv = document.querySelector('.form-error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    document.querySelector('.modern-body').insertBefore(errorDiv, document.querySelector('.form-grid'));
  }
  
  errorDiv.innerHTML = `
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      ${message}
    </div>
  `;
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    if (errorDiv) errorDiv.remove();
  }, 3000);
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="alert alert-success d-flex align-items-center" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>
      ${message}
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
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
        // Limpiar datos de usuario
        localStorage.removeItem('walletflow_user_data');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Cerrar sesión en Firebase si está disponible
        if (window.firebaseAuth) {
          window.firebaseAuth.cerrarSesion();
        }
        
        // Redirigir al inicio de sesión
        window.location.href = '../../login/inicio de sesion/inicio.html';
      }
    });
  }
});
