document.addEventListener("DOMContentLoaded", () => {
  renderDeudas()

  // Exponer función renderDeudas globalmente para que otros componentes puedan actualizar la pantalla
  window.renderDeudas = renderDeudas

  // Event listener for "Agregar Deuda" button on the page
  document.getElementById("btnAgregarDeudaPage").addEventListener("click", openAddDeudaModal)

  // Event listener para cerrar sesión
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (confirmar) {
        // Limpiar datos de usuario
        localStorage.removeItem('walletflow_user_data');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Cerrar sesión en Firebase si está disponible
        if (window.firebaseAuth) {
          window.firebaseAuth.cerrarSesion();
        }
        
        // Redirigir al login
        window.location.href = '../../login/inicio de sesion/inicio.html';
      }
    });
  }

  // Check for openForm query parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("openForm") === "true") {
    openAddDeudaModal()
  }

  function openAddDeudaModal() {
    const contenedorModalDeuda = document.getElementById("contenedorModalDeuda")
    if (!contenedorModalDeuda) {
      console.error("Contenedor para modal de deuda no encontrado.")
      return
    }

    // Clear previous modal content
    contenedorModalDeuda.innerHTML = ""

    // Load HTML for the add form
    fetch("../../formularios/formulario-deudas/fordeudas.html")
      .then((response) => response.text())
      .then((html) => {
        contenedorModalDeuda.innerHTML = html
        // Load JS for the add form
        const script = document.createElement("script")
        script.src = "../../formularios/formulario-deudas/fordeudas.js"
        script.onload = () => {
          if (typeof initFormularioDeuda === 'function') {
            initFormularioDeuda(renderDeudas);
          }
          const modal = document.getElementById("modalAgregarDeuda")
          if (modal) {
            modal.classList.remove("d-none")
          }
        }
        document.body.appendChild(script)
      })
      .catch((error) => console.error("Error loading deuda form:", error))
  }

  function renderDeudas() {
    const tabla = document.getElementById("tablaDeudas").querySelector("tbody")
    const mensajeVacio = document.getElementById("mensajeVacio")
    const deudas = JSON.parse(localStorage.getItem("deudas")) || []
    tabla.innerHTML = ""

    let totalDeuda = 0
    let deudaPendiente = 0
    let deudasPagadas = 0

    // Mostrar/ocultar mensaje de "sin deudas"
    if (deudas.length === 0) {
      if (mensajeVacio) mensajeVacio.style.display = 'block'
      document.getElementById("tablaDeudas").style.display = 'none'
    } else {
      if (mensajeVacio) mensajeVacio.style.display = 'none'
      document.getElementById("tablaDeudas").style.display = 'table'
    }

    deudas.forEach((deuda, index) => {
      totalDeuda += Number.parseFloat(deuda.monto)
      if (deuda.estado === "pendiente") {
        deudaPendiente += Number.parseFloat(deuda.monto)
      } else if (deuda.estado === "pagada") {
        deudasPagadas += Number.parseFloat(deuda.monto)
      }

      const fila = document.createElement("tr")
      
      // Aplicar clase según el estado de la deuda
      let estadoClass = 'estado-pendiente';
      let estadoTexto = deuda.estado;
      
      if (deuda.estado === 'pagada') {
        estadoClass = 'estado-pagada';
        estadoTexto = 'Pagada';
      } else if (deuda.estado === 'renegociada') {
        estadoClass = 'estado-renegociada';
        estadoTexto = 'Renegociada';
      } else {
        estadoTexto = 'Pendiente';
      }
      
      fila.innerHTML = `
        <td><strong>${deuda.acreedor}</strong></td>
        <td><strong class="text-danger">$${Number.parseFloat(deuda.monto).toLocaleString('es-CO', {minimumFractionDigits: 2})}</strong></td>
        <td>${new Date(deuda.fechaInicio).toLocaleDateString('es-CO')}</td>
        <td>${deuda.fechaVencimiento ? new Date(deuda.fechaVencimiento).toLocaleDateString('es-CO') : "<span class='text-muted'>Sin fecha</span>"}</td>
        <td>${deuda.tasaInteres ? `<span class="badge bg-info">${deuda.tasaInteres}%</span>` : "<span class='text-muted'>-</span>"}</td>
        <td><span class="${estadoClass}">${estadoTexto}</span></td>
        <td><small class="text-muted">${deuda.descripcion || "Sin descripción"}</small></td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-warning me-1 btn-editar" data-index="${index}" title="Editar deuda">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}" title="Eliminar deuda">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `
      tabla.appendChild(fila)
    })

    // Update summary with formatted numbers
    document.getElementById("totalDeuda").textContent = `$${totalDeuda.toLocaleString('es-CO', {minimumFractionDigits: 2})}`
    document.getElementById("deudaPendiente").textContent = `$${deudaPendiente.toLocaleString('es-CO', {minimumFractionDigits: 2})}`
    document.getElementById("deudasPagadas").textContent = `$${deudasPagadas.toLocaleString('es-CO', {minimumFractionDigits: 2})}`

    // Update Debt Progress Bar
    const debtProgressBar = document.getElementById("debtProgressBar")
    const debtProgressText = document.getElementById("debtProgressText")

    if (debtProgressBar && debtProgressText) {
      let progressPercentage = 0
      if (totalDeuda > 0) {
        progressPercentage = (deudasPagadas / totalDeuda) * 100
      }
      debtProgressBar.style.width = `${progressPercentage.toFixed(2)}%`
      debtProgressBar.setAttribute("aria-valuenow", progressPercentage.toFixed(2))
      debtProgressText.textContent = `${progressPercentage.toFixed(2)}% Pagado`
    }

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index")
        const deuda = deudas[idx]
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la deuda con ${deuda.acreedor}?\n\nMonto: $${Number.parseFloat(deuda.monto).toLocaleString('es-CO')}`)
        if (confirmacion) {
          deudas.splice(idx, 1)
          localStorage.setItem("deudas", JSON.stringify(deudas))
          renderDeudas()
          
          // Mostrar notificación de éxito
          mostrarNotificacion("¡Deuda eliminada exitosamente!", "success")
        }
      })
    })

    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index")
        editarDeuda(idx)
      })
    })
  }

  function editarDeuda(idx) {
    const deudas = JSON.parse(localStorage.getItem("deudas")) || []
    const deuda = deudas[idx]

    const contenedorModalEditarDeuda = document.getElementById("contenedorModalEditarDeuda")
    if (!contenedorModalEditarDeuda) {
      console.error("Contenedor para modal de edición de deuda no encontrado.")
      return
    }
    contenedorModalEditarDeuda.innerHTML = "" // Clear previous modal content

    const formHtml = `
      <div id="modalEditarDeuda" class="modal-overlay">
        <form id="formEditarDeuda" class="form-editar">
          <h5 class="form-titulo">Editar Deuda</h5>
          <label class="form-label">Acreedor:
            <input class="form-control" name="acreedor" value="${deuda.acreedor}" required>
          </label>
          <label class="form-label">Monto:
            <input class="form-control" name="monto" type="number" min="0" step="0.01" value="${deuda.monto}" required>
          </label>
          <label class="form-label">Fecha Inicio:
            <input class="form-control" name="fechaInicio" type="date" value="${deuda.fechaInicio}" required>
          </label>
          <label class="form-label">Fecha Vencimiento:
            <input class="form-control" name="fechaVencimiento" type="date" value="${deuda.fechaVencimiento || ""}">
          </label>
          <label class="form-label">Tasa Interés (%):
            <input class="form-control" name="tasaInteres" type="number" step="0.01" value="${deuda.tasaInteres || ""}">
          </label>
          <label class="form-label">Estado:
            <select class="form-control" name="estado">
              <option value="pendiente" ${deuda.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="pagada" ${deuda.estado === "pagada" ? "selected" : ""}>Pagada</option>
              <option value="renegociada" ${deuda.estado === "renegociada" ? "selected" : ""}>Renegociada</option>
            </select>
          </label>
          <label class="form-label">Descripción:
            <input class="form-control" name="descripcion" value="${deuda.descripcion || ""}">
          </label>
          <div class="form-buttons">
            <button type="submit" class="btn btn-success btn-sm">Guardar</button>
            <button type="button" class="btn btn-secondary btn-sm" id="cancelarEditar">Cancelar</button>
          </div>
        </form>
      </div>
    `

    contenedorModalEditarDeuda.innerHTML = formHtml

    document.getElementById("cancelarEditar").onclick = () => {
      contenedorModalEditarDeuda.innerHTML = "" // Close modal
    }

    document.getElementById("formEditarDeuda").onsubmit = function (e) {
      e.preventDefault()
      const formData = new FormData(this)
      deudas[idx] = {
        acreedor: formData.get("acreedor"),
        monto: formData.get("monto"),
        fechaInicio: formData.get("fechaInicio"),
        fechaVencimiento: formData.get("fechaVencimiento"),
        tasaInteres: formData.get("tasaInteres"),
        estado: formData.get("estado"),
        descripcion: formData.get("descripcion"),
      }
      localStorage.setItem("deudas", JSON.stringify(deudas))
      contenedorModalEditarDeuda.innerHTML = "" // Close modal
      renderDeudas()
      mostrarNotificacion("¡Deuda actualizada exitosamente!", "success")
    }
  }

  // Función para mostrar notificaciones elegantes
  function mostrarNotificacion(mensaje, tipo = 'info') {
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
})
