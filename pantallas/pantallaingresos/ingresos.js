document.addEventListener('DOMContentLoaded', function () {
  renderIngresos();

  function renderIngresos() {
    const tabla = document.getElementById('tablaIngresos').querySelector('tbody');
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    tabla.innerHTML = '';
    
    ingresos.forEach((ingreso, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>
          <span class="categoria-badge">${ingreso.categoria}</span>
        </td>
        <td>
          <span class="metodo-pago">${ingreso.metodo}</span>
        </td>
        <td>
          <span class="monto-destacado">$${formatearMonto(ingreso.monto)}</span>
        </td>
        <td>
          <span class="fecha-formato">${formatearFecha(ingreso.fecha)}</span>
        </td>
        <td>
          <span class="descripcion-texto">${ingreso.descripcion || 'Sin descripción'}</span>
        </td>
        <td>
          <span class="badge ${ingreso.esRecurrente ? 'badge-si' : 'badge-no'}">
            ${ingreso.esRecurrente ? 'Sí' : 'No'}
          </span>
        </td>
        <td>
          <span class="frecuencia-texto">${ingreso.frecuencia || '-'}</span>
        </td>
        <td>
          <span class="cuenta-texto">${ingreso.cuenta || '-'}</span>
        </td>
        <td>
          <div class="botones-accion">
            <button class="btn btn-sm btn-warning btn-editar me-1" data-index="${index}" title="Editar ingreso">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}" title="Eliminar ingreso">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tabla.appendChild(fila);
    });

    // Configurar eventos con mejor feedback
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este ingreso?\n\nEsta acción no se puede deshacer.');
        if (confirmacion) {
          // Animación de eliminación
          const fila = this.closest('tr');
          fila.style.transition = 'all 0.3s ease';
          fila.style.opacity = '0';
          fila.style.transform = 'translateX(-100px)';
          
          setTimeout(() => {
            ingresos.splice(idx, 1);
            localStorage.setItem('ingresos', JSON.stringify(ingresos));
            renderIngresos();
            mostrarMensaje('¡Ingreso eliminado exitosamente!', 'success');
          }, 300);
        }
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        editarIngreso(idx);
      });
    });
  }

  function editarIngreso(idx) {
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    const ingreso = ingresos[idx];

    const formHtml = `
      <form id="formEditarIngreso" class="form-editar">
        <h5 class="form-titulo">
          <i class="bi bi-pencil-square me-2"></i>Editar Ingreso
        </h5>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-tag me-2"></i>Categoría
          </label>
          <input class="form-control" name="categoria" value="${ingreso.categoria}" required>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-credit-card me-2"></i>Método
          </label>
          <input class="form-control" name="metodo" value="${ingreso.metodo}" required>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-currency-dollar me-2"></i>Monto
            </label>
            <input class="form-control" name="monto" type="number" min="0" step="0.01" value="${ingreso.monto}" required>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-calendar me-2"></i>Fecha
            </label>
            <input class="form-control" name="fecha" type="date" value="${ingreso.fecha}" required>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-file-text me-2"></i>Descripción
          </label>
          <textarea class="form-control" name="descripcion" rows="2" placeholder="Descripción del ingreso">${ingreso.descripcion || ''}</textarea>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-repeat me-2"></i>Recurrente
            </label>
            <select class="form-select" name="esRecurrente">
              <option value="true" ${ingreso.esRecurrente ? 'selected' : ''}>Sí</option>
              <option value="false" ${!ingreso.esRecurrente ? 'selected' : ''}>No</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">
              <i class="bi bi-clock me-2"></i>Frecuencia
            </label>
            <select class="form-select" name="frecuencia">
              <option value="">Seleccionar...</option>
              <option value="Semanal" ${ingreso.frecuencia === 'Semanal' ? 'selected' : ''}>Semanal</option>
              <option value="Quincenal" ${ingreso.frecuencia === 'Quincenal' ? 'selected' : ''}>Quincenal</option>
              <option value="Mensual" ${ingreso.frecuencia === 'Mensual' ? 'selected' : ''}>Mensual</option>
              <option value="Anual" ${ingreso.frecuencia === 'Anual' ? 'selected' : ''}>Anual</option>
            </select>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-bank me-2"></i>Cuenta
          </label>
          <input class="form-control" name="cuenta" value="${ingreso.cuenta || ''}" placeholder="Cuenta asociada">
        </div>
        
        <div class="form-buttons">
          <button type="submit" class="btn btn-success">
            <i class="bi bi-check-circle me-2"></i>Guardar Cambios
          </button>
          <button type="button" class="btn btn-secondary" id="cancelarEditar">
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
        </div>
      </form>
    `;

    const modal = document.createElement('div');
    modal.id = 'modalEditarIngreso';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
      justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;
    modal.innerHTML = formHtml;
    document.body.appendChild(modal);

    // Mejorar el evento de cancelar
    document.getElementById('cancelarEditar').onclick = function () {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    // Mejorar el envío del formulario
    document.getElementById('formEditarIngreso').onsubmit = function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      // Validación mejorada
      const monto = parseFloat(formData.get('monto'));
      if (monto <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
      }
      
      ingresos[idx] = {
        categoria: formData.get('categoria').trim(),
        metodo: formData.get('metodo').trim(),
        monto: monto,
        fecha: formData.get('fecha'),
        descripcion: formData.get('descripcion').trim(),
        esRecurrente: formData.get('esRecurrente') === 'true',
        frecuencia: formData.get('frecuencia'),
        cuenta: formData.get('cuenta').trim()
      };
      
      localStorage.setItem('ingresos', JSON.stringify(ingresos));
      
      // Animación de cierre y actualización
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(modal);
        renderIngresos();
        mostrarMensaje('¡Ingreso actualizado exitosamente!', 'success');
      }, 300);
    };

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      }
    });
  }

  // Función para mostrar mensajes mejorada
  function mostrarMensaje(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta-personalizada alerta-${tipo}`;
    alerta.innerHTML = `
      <div class="alerta-contenido">
        <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${mensaje}
      </div>
    `;
    
    // Estilos para la alerta
    alerta.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 11000;
      padding: 1rem 1.5rem; border-radius: 10px; color: white;
      font-weight: 500; animation: slideInRight 0.3s ease;
      background: ${tipo === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
      alerta.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(alerta);
      }, 300);
    }, 3000);
  }

  // Funciones auxiliares para mejor formato
  function formatearMonto(monto) {
    return parseFloat(monto).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatearFecha(fecha) {
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
  }

  // Agregar estilos dinámicos para animaciones
  const estilosAnimacion = document.createElement('style');
  estilosAnimacion.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    
    .categoria-badge { 
      background: linear-gradient(135deg, #3498db, #2980b9); 
      color: white; padding: 0.25rem 0.75rem; 
      border-radius: 20px; font-size: 0.85rem; font-weight: 500; 
    }
    .monto-destacado { 
      color: #27ae60; font-weight: 700; font-size: 1.1rem; 
    }
    .fecha-formato { 
      color: #7f8c8d; font-weight: 500; 
    }
    .badge-si { 
      background: linear-gradient(135deg, #2ecc71, #27ae60) !important; 
      color: white; padding: 0.25rem 0.5rem; border-radius: 10px; font-size: 0.8rem; 
    }
    .badge-no { 
      background: linear-gradient(135deg, #95a5a6, #7f8c8d) !important; 
      color: white; padding: 0.25rem 0.5rem; border-radius: 10px; font-size: 0.8rem; 
    }
    .botones-accion { display: flex; gap: 0.25rem; }
  `;
  document.head.appendChild(estilosAnimacion);
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
  window.location.href = '../../login/inicio de sesion/inicio.html';
      }
      // Si no confirma, no hace nada
    });
  }
});
