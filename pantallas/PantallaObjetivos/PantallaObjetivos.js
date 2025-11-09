document.addEventListener("DOMContentLoaded", () => {
  renderObjetivos()

  // Exponer función renderObjetivos globalmente para que otros componentes puedan actualizar la pantalla
  window.renderObjetivos = renderObjetivos

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
    openAddObjetivoModal()
  }

  // Event listener for "Agregar Objetivo" button on the page
  document.getElementById("btnAgregarObjetivoPage").addEventListener("click", openAddObjetivoModal)

  function openAddObjetivoModal() {
    const contenedorModalObjetivo = document.getElementById("contenedorModalObjetivo")
    if (!contenedorModalObjetivo) {
      console.error("Contenedor para modal de objetivo no encontrado.")
      return
    }

  // Clear previous modal content
  contenedorModalObjetivo.innerHTML = ""

    // Load HTML for the add form
    fetch("../../formularios/FormularioObjetivo/FormularioOb.html")
      .then((response) => response.text())
      .then((html) => {
        contenedorModalObjetivo.innerHTML = html
        // Load JS for the add form
        const script = document.createElement("script")
        script.src = "../../formularios/FormularioObjetivo/FormularioObj.js"
        script.onload = () => {
          const initFormularioObjetivo = window.initFormularioObjetivo
          if (typeof initFormularioObjetivo === "function") {
            // Modo creación
            initFormularioObjetivo(renderObjetivos)
            const modal = new bootstrap.Modal(document.getElementById("modalAgregarObjetivo"))
            modal.show()
          } else {
            console.error("initFormularioObjetivo function not found")
          }
        }
        document.body.appendChild(script)
      })
      .catch((error) => console.error("Error loading add objetivo form:", error))
  }

  function openEditObjetivoModal(index) {
    const contenedorModalObjetivo = document.getElementById("contenedorModalObjetivo")
    if (!contenedorModalObjetivo) {
      console.error("Contenedor para modal de objetivo no encontrado.")
      return
    }

    // Clear previous modal content
    contenedorModalObjetivo.innerHTML = ""

    fetch("../../formularios/FormularioObjetivo/FormularioOb.html")
      .then((response) => response.text())
      .then((html) => {
        contenedorModalObjetivo.innerHTML = html
        const script = document.createElement("script")
        script.src = "../../formularios/FormularioObjetivo/FormularioObj.js"
        script.onload = () => {
          const initFormularioObjetivo = window.initFormularioObjetivo
          const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]")
          const objetivo = objetivos[index]
          if (!objetivo) {
            console.error("Objetivo no encontrado para edición.")
            return
          }
          if (typeof initFormularioObjetivo === "function") {
            // Pasar datos para modo edición
            initFormularioObjetivo(renderObjetivos, objetivo, index)
            const modal = new bootstrap.Modal(document.getElementById("modalAgregarObjetivo"))
            modal.show()
          } else {
            console.error("initFormularioObjetivo function not found")
          }
        }
        document.body.appendChild(script)
      })
      .catch((error) => console.error("Error loading edit objetivo form:", error))
  }

  // Exponer función para edición
  window.openEditObjetivoModal = openEditObjetivoModal
})

function renderObjetivos() {
  console.log("Rendering objetivos...")
  
  // Get objetivos from localStorage
  const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]")
  console.log("Objetivos encontrados:", objetivos)
  console.log("Número de objetivos:", objetivos.length)

  // Get table body
  const tableBody = document.querySelector("#tablaObjetivos tbody")
  const mensajeVacio = document.getElementById("mensajeVacio")

  if (!tableBody) {
    console.error("Table body not found")
    return
  }

  // Clear existing rows
  tableBody.innerHTML = ""

  if (objetivos.length === 0) {
    console.log("No hay objetivos, mostrando mensaje vacío")
    // Show empty message
    if (mensajeVacio) {
      mensajeVacio.style.display = "block"
    }
    const tablaCard = document.querySelector("#tablaObjetivos")
    if (tablaCard && tablaCard.closest('.card')) {
      tablaCard.closest('.card').style.display = "none"
    }
  } else {
    console.log("Mostrando objetivos en tabla")
    // Hide empty message
    if (mensajeVacio) {
      mensajeVacio.style.display = "none"
    }
    const tablaCard = document.querySelector("#tablaObjetivos")
    if (tablaCard && tablaCard.closest('.card')) {
      tablaCard.closest('.card').style.display = "block"
    }

    // Add rows for each objetivo
  objetivos.forEach((objetivo, index) => {
      console.log(`Procesando objetivo ${index}:`, objetivo)
      const row = document.createElement("tr")
      
      // Determinar color del estado
      let estadoClass = '';
      let estadoColor = '';
      switch(objetivo.estado) {
        case 'Completado':
          estadoClass = 'badge bg-success';
          estadoColor = 'success';
          break;
        case 'Pendiente':
          estadoClass = 'badge bg-warning text-dark';
          estadoColor = 'warning';
          break;
        default:
          estadoClass = 'badge bg-secondary';
          estadoColor = 'secondary';
      }

      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-bullseye me-2 text-warning"></i>
            <strong>${objetivo.titulo}</strong>
          </div>
        </td>
        <td>
          <span class="text-muted">${objetivo.descripcion}</span>
        </td>
        <td>
          <small class="text-muted">
            <i class="bi bi-calendar-plus me-1"></i>
            ${objetivo.fechaCreacion}
          </small>
        </td>
        <td>
          <small class="text-muted">
            <i class="bi bi-calendar-check me-1"></i>
            ${objetivo.fechaLimite}
          </small>
        </td>
        <td>
          <span class="${estadoClass}">${objetivo.estado}</span>
        </td>
        <td>
          <div class="progress" style="height: 20px;">
            <div class="progress-bar bg-${estadoColor}" role="progressbar" 
                 style="width: ${objetivo.progreso}%" 
                 aria-valuenow="${objetivo.progreso}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
              ${objetivo.progreso}%
            </div>
          </div>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-primary" onclick="editarObjetivo(${index})" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarObjetivo(${index})" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `
      tableBody.appendChild(row)
    })
  }

  // Update statistics
  updateStats()
  console.log("Renderizado de objetivos completado")
}

function updateStats() {
  const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]")
  console.log("Actualizando estadísticas con objetivos:", objetivos)
  
  const totalObjetivos = objetivos.length
  const objetivosCompletados = objetivos.filter(obj => obj.estado === 'Completado').length
  const objetivosPendientes = objetivos.filter(obj => obj.estado === 'Pendiente').length
  
  // Calcular progreso promedio
  let progresoTotal = 0
  objetivos.forEach(obj => {
    progresoTotal += parseInt(obj.progreso) || 0
  })
  const progresoPromedio = totalObjetivos > 0 ? Math.round(progresoTotal / totalObjetivos) : 0

  console.log("Estadísticas calculadas:", {
    total: totalObjetivos,
    completados: objetivosCompletados,
    pendientes: objetivosPendientes,
    progresoPromedio: progresoPromedio
  })

  // Update DOM elements
  const totalElement = document.getElementById("totalObjetivos")
  const completadosElement = document.getElementById("objetivosCompletados")
  const pendientesElement = document.getElementById("objetivosPendientes")
  const progresoElement = document.getElementById("progresoPromedio")

  if (totalElement) {
    totalElement.textContent = totalObjetivos
    console.log("Total actualizado:", totalObjetivos)
  } else {
    console.warn("Elemento totalObjetivos no encontrado")
  }
  
  if (completadosElement) {
    completadosElement.textContent = objetivosCompletados
    console.log("Completados actualizado:", objetivosCompletados)
  } else {
    console.warn("Elemento objetivosCompletados no encontrado")
  }
  
  if (pendientesElement) {
    pendientesElement.textContent = objetivosPendientes
    console.log("Pendientes actualizado:", objetivosPendientes)
  } else {
    console.warn("Elemento objetivosPendientes no encontrado")
  }
  
  if (progresoElement) {
    progresoElement.textContent = `${progresoPromedio}%`
    console.log("Progreso promedio actualizado:", `${progresoPromedio}%`)
  } else {
    console.warn("Elemento progresoPromedio no encontrado")
  }
}

function editarObjetivo(index) {
  console.log("Solicitando edición para índice:", index)
  if (typeof window.openEditObjetivoModal === 'function') {
    window.openEditObjetivoModal(index)
  } else {
    alert("Editor no disponible todavía")
  }
}

function eliminarObjetivo(index) {
  if (confirm("¿Estás seguro de que deseas eliminar este objetivo?")) {
    const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]")
    objetivos.splice(index, 1)
    localStorage.setItem("objetivos", JSON.stringify(objetivos))
    renderObjetivos()
    
    // Show success message
    showNotification("Objetivo eliminado exitosamente", "success")
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
  `
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `
  
  document.body.appendChild(notification)
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 3000)
}
