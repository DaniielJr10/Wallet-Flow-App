document.addEventListener('DOMContentLoaded', function () {
  // ===== ELEMENTOS DEL DOM =====
  const botonAgregar = document.getElementById('botonAgregar');
  const menuOpciones = document.getElementById('menuOpciones');
  const btnNuevoIngreso = document.getElementById('btnNuevoIngreso');
  const contenedorModalIngreso = document.getElementById('contenedorModalIngreso');
  const btnNuevaCuenta = document.getElementById('btnNuevaCuenta');
  const contenedorModalCuenta = document.getElementById('contenedorModalCuenta');

  // ===== INICIALIZACIÓN =====
  inicializarComponentes();
  configurarEventos();

  function inicializarComponentes() {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Configurar nombre de usuario en el perfil
    configurarPerfilUsuario();
  }

  function configurarPerfilUsuario() {
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
    // Botón flotante con efecto ripple
    if (botonAgregar) {
      botonAgregar.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Crear efecto ripple
        crearEfectoRipple(e, this);
        
        // Toggle del menú con animación
        toggleMenuEmergente();
      });
    }

    // Botón cerrar menú
    const btnCerrarMenu = document.getElementById('btnCerrarMenu');
    if (btnCerrarMenu) {
      btnCerrarMenu.addEventListener('click', function(e) {
        e.preventDefault();
        cerrarMenuEmergente();
      });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (event) {
      if (menuOpciones && !menuOpciones.contains(event.target) && 
          botonAgregar && !botonAgregar.contains(event.target)) {
        cerrarMenuEmergente();
      }
    });

    // Botón nuevo ingreso
    if (btnNuevoIngreso) {
      btnNuevoIngreso.addEventListener('click', manejarNuevoIngreso);
    }

    // Botón nueva cuenta
    if (btnNuevaCuenta) {
      btnNuevaCuenta.addEventListener('click', manejarNuevaCuenta);
    }

    // Cerrar sesión desde el perfil
    const cerrarSesionPerfil = document.getElementById('cerrarSesionPerfil');
    if (cerrarSesionPerfil) {
      cerrarSesionPerfil.addEventListener('click', manejarCerrarSesion);
    }

    // Cerrar sesión desde el menú lateral (mantener funcionalidad existente)
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
      cerrarSesionBtn.addEventListener('click', manejarCerrarSesion);
    }

    // Efecto hover para items del menú
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
    if (menuOpciones.classList.contains('d-none')) {
      abrirMenuEmergente();
    } else {
      cerrarMenuEmergente();
    }
  }

  function abrirMenuEmergente() {
    menuOpciones.classList.remove('d-none');
    menuOpciones.style.animation = 'slideInUp 0.5s ease forwards';
  }

  function cerrarMenuEmergente() {
    menuOpciones.style.animation = 'slideOutDown 0.3s ease forwards';
    setTimeout(() => {
      menuOpciones.classList.add('d-none');
    }, 300);
  }

  function crearEfectoRipple(e, button) {
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
    e.preventDefault();
    cerrarMenuEmergente();
    
    try {
      const response = await fetch('../formulario ingresos/foringresos.html');
      const html = await response.text();
      contenedorModalIngreso.innerHTML = html;
      
      const script = document.createElement('script');
      script.src = '../formulario ingresos/foringresos.js';
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

  async function manejarNuevaCuenta(e) {
    e.preventDefault();
    cerrarMenuEmergente();

    try {
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
    } catch (error) {
      console.error('Error al cargar formulario de cuenta:', error);
      mostrarNotificacion('Error al cargar el formulario', 'danger');
    }
  }

  function manejarCerrarSesion(e) {
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
        window.location.href = '../inicio de sesion/inicio.html';
      }, 300);
    }
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
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

