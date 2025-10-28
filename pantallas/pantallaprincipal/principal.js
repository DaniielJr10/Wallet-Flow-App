document.addEventListener('DOMContentLoaded', function () {
  // ===== ELEMENTOS DEL DOM PRINCIPALES =====
  const botonAgregar = document.getElementById('botonAgregar');
  const menuOpciones = document.getElementById('menuOpciones');
  const btnNuevoIngreso = document.getElementById('btnNuevoIngreso');
  const contenedorModalIngreso = document.getElementById('contenedorModalIngreso');
  const btnNuevoGasto = document.getElementById('btnNuevoGasto');
  const contenedorModalGasto = document.getElementById('contenedorModalGasto');
  const btnNuevaCuenta = document.getElementById('btnNuevaCuenta');
  const contenedorModalCuenta = document.getElementById('contenedorModalCuenta');
  const btnNuevoAhorro = document.querySelector('.ahorro-item');
  const contenedorModalAhorro = document.getElementById('contenedorModalAhorro');
  const btnNuevaDeuda = document.querySelector('.deuda-item');
  const contenedorModalDeuda = document.getElementById('contenedorModalDeuda');
  const btnNuevaInversion = document.querySelector('.inversion-item');
  const contenedorModalInversion = document.getElementById('contenedorModalInversion');

  // ===== INICIALIZACIÓN DE COMPONENTES Y EVENTOS =====
  inicializarComponentes();
  configurarEventos();

  function inicializarComponentes() {
  // Inicializar tooltips de Bootstrap para los botones con tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Configurar nombre de usuario en el perfil
    configurarPerfilUsuario();
  }

  function configurarPerfilUsuario() {
    // Cargar y mostrar el nombre del usuario en el perfil si existe en localStorage
    const usuario = localStorage.getItem('walletflow_current_user');
    if (usuario) {
      try {
        const userData = JSON.parse(usuario);
        // Actualizar nombre en el dropdown header si existe
        const dropdownHeader = document.querySelector('.dropdown-header strong');
        if (dropdownHeader && userData.nombre) {
          dropdownHeader.textContent = userData.nombre;
        }
      } catch (e) {
        console.log('No se pudo cargar datos del usuario');
      }
    }
  }

  function configurarEventos() {
  // Botón flotante: muestra menú emergente y efecto ripple
    if (botonAgregar) {
      botonAgregar.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Crear efecto ripple
        crearEfectoRipple(e, this);
        
        // Toggle del menú con animación
        toggleMenuEmergente();
      });
    }

  // Botón para cerrar el menú emergente
    const btnCerrarMenu = document.getElementById('btnCerrarMenu');
    if (btnCerrarMenu) {
      btnCerrarMenu.addEventListener('click', function(e) {
        e.preventDefault();
        cerrarMenuEmergente();
      });
    }

  // Cerrar menú emergente al hacer clic fuera de él
    document.addEventListener('click', function (event) {
      if (menuOpciones && !menuOpciones.contains(event.target) && 
          botonAgregar && !botonAgregar.contains(event.target)) {
        cerrarMenuEmergente();
      }
    });

  // Botón para mostrar el formulario de ingreso
    if (btnNuevoIngreso) {
      btnNuevoIngreso.addEventListener('click', manejarNuevoIngreso);
    }

  // Botón para mostrar el formulario de gasto
    if (btnNuevoGasto) {
      btnNuevoGasto.addEventListener('click', manejarNuevoGasto);
      
      // Funcionalidad adicional: clic derecho para ir a la pantalla de gastos
      btnNuevoGasto.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        cerrarMenuEmergente();
        window.location.href = '../PantallaGastos/Gastos.html';
      });
      
      // Para móviles: mantener presionado para ir a la pantalla de gastos
      let pressTimer;
      btnNuevoGasto.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
          cerrarMenuEmergente();
          window.location.href = '../PantallaGastos/Gastos.html';
        }, 800);
      });
      
      btnNuevoGasto.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
      });
    }

  // Botón para mostrar el formulario de ahorro
    if (btnNuevoAhorro) {
      btnNuevoAhorro.addEventListener('click', manejarNuevoAhorro);
    }

  // Botón para mostrar el formulario de cuenta
    if (btnNuevaCuenta) {
      btnNuevaCuenta.addEventListener('click', manejarNuevaCuenta);
    }

  // Botón para mostrar el formulario de deuda
    if (btnNuevaDeuda) {
      btnNuevaDeuda.addEventListener('click', manejarNuevaDeuda);
    }

  // Botón para mostrar el formulario de inversión
    if (btnNuevaInversion) {
      btnNuevaInversion.addEventListener('click', manejarNuevaInversion);
    }

  // Botón para cerrar sesión desde el perfil
    const cerrarSesionPerfil = document.getElementById('cerrarSesionPerfil');
    if (cerrarSesionPerfil) {
      cerrarSesionPerfil.addEventListener('click', manejarCerrarSesion);
    }

  // Botón para cerrar sesión desde el menú lateral
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
      cerrarSesionBtn.addEventListener('click', manejarCerrarSesion);
    }

  // Efecto hover para los items del menú emergente
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(8px)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
      });
    });
  }

  function toggleMenuEmergente() {
  // Alterna la visibilidad del menú emergente
    if (menuOpciones.classList.contains('d-none')) {
      abrirMenuEmergente();
    } else {
      cerrarMenuEmergente();
    }
  }

  function abrirMenuEmergente() {
  // Abre el menú emergente con animación
    menuOpciones.classList.remove('d-none');
    menuOpciones.style.animation = 'slideInUp 0.5s ease forwards';
  }

  function cerrarMenuEmergente() {
  // Cierra el menú emergente con animación
    menuOpciones.style.animation = 'slideOutDown 0.3s ease forwards';
    setTimeout(() => {
      menuOpciones.classList.add('d-none');
    }, 300);
  }

  function crearEfectoRipple(e, button) {
  // Crea el efecto visual ripple en el botón flotante
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Remover ripple anterior si existe
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remover el ripple después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  async function manejarNuevoIngreso(e) {
  // Muestra el formulario de ingreso en el modal dinámico
    e.preventDefault();
    cerrarMenuEmergente();
    
    try {
  const response = await fetch('../../formularios/formulario ingresos/foringresos.html');
      const html = await response.text();
      contenedorModalIngreso.innerHTML = html;
      
      const script = document.createElement('script');
  script.src = '../../formularios/formulario ingresos/foringresos.js';
      script.onload = function() {
        if (typeof initFormularioIngreso === 'function') {
          initFormularioIngreso();
        }
        const modal = document.getElementById('modalAgregarIngreso');
        if (modal) {
          modal.classList.remove('d-none');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al cargar formulario de ingreso:', error);
      mostrarNotificacion('Error al cargar el formulario', 'danger');
    }
  }

  async function manejarNuevoGasto(e) {
  // Muestra el formulario de gasto en el modal dinámico
    e.preventDefault();
    cerrarMenuEmergente();
    
    try {
      const response = await fetch('../../formularios/FormularioGastos/FormularioG.html');
      const html = await response.text();
      contenedorModalGasto.innerHTML = html;
      
      const script = document.createElement('script');
      script.src = '../../formularios/FormularioGastos/FormularioG.js';
      script.onload = function() {
        if (typeof initFormularioGasto === 'function') {
          initFormularioGasto();
        }
        const modal = document.getElementById('modalAgregar');
        if (modal) {
          modal.style.display = 'flex';
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al cargar formulario de gasto:', error);
      mostrarNotificacion('Error al cargar el formulario de gasto', 'danger');
    }
  }

  async function manejarNuevaCuenta(e) {
    e.preventDefault();
    cerrarMenuEmergente();

    try {
  const response = await fetch('../../formularios/formulario cuentas/forcuentas.html');
      const html = await response.text();
      contenedorModalCuenta.innerHTML = html;

      const script = document.createElement('script');
  script.src = '../../formularios/formulario cuentas/forcuentas.js';
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
    } catch (error) {
      console.error('Error al cargar formulario de cuenta:', error);
      mostrarNotificacion('Error al cargar el formulario', 'danger');
    }
  }

  async function manejarNuevoAhorro(e) {
  // Muestra el formulario de ahorro en el modal dinámico
  // Muestra el formulario de cuenta en el modal dinámico
    e.preventDefault();
    cerrarMenuEmergente();

    try {
  const response = await fetch('../../formularios/formulario ahorros/forahorros.html');
      const html = await response.text();
      // Si el contenedor no existe, lo creamos
      let contenedor = contenedorModalAhorro;
      if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedorModalAhorro';
        document.body.appendChild(contenedor);
      }
      contenedor.innerHTML = html;

      const script = document.createElement('script');
  script.src = '../../formularios/formulario ahorros/forahorros.js';
      script.onload = function() {
        if (typeof initFormularioAhorro === 'function') {
          initFormularioAhorro();
        }
        const modal = document.getElementById('modalAgregarAhorro');
        if (modal) {
          modal.classList.remove('d-none');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al cargar formulario de ahorro:', error);
      mostrarNotificacion('Error al cargar el formulario de ahorro', 'danger');
    }
  }

  async function manejarNuevaDeuda(e) {
  // Muestra el formulario de deuda en el modal dinámico
    e.preventDefault();
    cerrarMenuEmergente();

    try {
      const response = await fetch('../../formularios/formulario-deudas/fordeudas.html');
      const html = await response.text();
      contenedorModalDeuda.innerHTML = html;

      const script = document.createElement('script');
      script.src = '../../formularios/formulario-deudas/fordeudas.js';
      script.onload = function() {
        if (typeof initFormularioDeuda === 'function') {
          // Pasar función de callback para refrescar si existe
          const refreshCallback = window.renderDeudas || null;
          initFormularioDeuda(refreshCallback);
        }
        const modal = document.getElementById('modalAgregarDeuda');
        if (modal) {
          modal.classList.remove('d-none');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al cargar formulario de deuda:', error);
      mostrarNotificacion('Error al cargar el formulario de deuda', 'danger');
    }
  }

  async function manejarNuevaInversion(e) {
  // Muestra el formulario de inversión en el modal dinámico
    e.preventDefault();
    cerrarMenuEmergente();

    try {
      const response = await fetch('../../formularios/formulario-inversiones/forinversiones.html');
      const html = await response.text();
      contenedorModalInversion.innerHTML = html;

      const script = document.createElement('script');
      script.src = '../../formularios/formulario-inversiones/forinversiones.js';
      script.onload = function() {
        if (typeof initFormularioInversion === 'function') {
          // Pasar función de callback para refrescar si existe
          const refreshCallback = window.renderInversiones || null;
          initFormularioInversion(refreshCallback);
        }
        const modal = document.getElementById('modalAgregarInversion');
        if (modal) {
          modal.classList.remove('d-none');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al cargar formulario de inversión:', error);
      mostrarNotificacion('Error al cargar el formulario de inversión', 'danger');
    }
  }

  function manejarCerrarSesion(e) {
  // Lógica para cerrar sesión y redirigir al inicio de sesión
    e.preventDefault();
    
    // Crear modal de confirmación personalizado más elegante
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmar) {
      // Animación de salida
      document.body.style.opacity = '0.7';
      document.body.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        localStorage.removeItem('walletflow_current_user');
        localStorage.removeItem('walletflow_remembered_user');
  window.location.href = '../../login/inicio de sesion/inicio.html';
      }, 300);
    }
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
  // Muestra una notificación temporal en la pantalla
    // Crear notificación temporal más elegante
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = `
      top: 20px; 
      right: 20px; 
      z-index: 9999; 
      min-width: 300px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border: none;
    `;
    notificacion.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => notificacion.remove(), 300);
      }
    }, 4000);
  }

  // ===== EFECTOS ADICIONALES =====
  
  // Animación de entrada para el botón flotante
  setTimeout(() => {
    if (botonAgregar) {
      botonAgregar.style.opacity = '0';
      botonAgregar.style.transform = 'scale(0) rotate(180deg)';
      botonAgregar.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      setTimeout(() => {
        botonAgregar.style.opacity = '1';
        botonAgregar.style.transform = 'scale(1) rotate(0deg)';
      }, 500);
    }
  }, 100);

  // Efecto hover mejorado para el perfil
  // Efecto hover mejorado para el botón de perfil
  const perfilBtn = document.querySelector('.btn-perfil');
  if (perfilBtn) {
    perfilBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    perfilBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  }
});

