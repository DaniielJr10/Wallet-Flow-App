document.addEventListener("DOMContentLoaded", () => {
  renderDeudas()

  // Check for openForm query parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("openForm") === "true") {
    openAddDeudaModal()
  }

  // Event listener for "Agregar Deuda" button on the page
  document.getElementById("btnAgregarDeudaPage").addEventListener("click", openAddDeudaModal)

  function openAddDeudaModal() {
    const contenedorModalDeuda = document.getElementById("contenedorModalDeuda")
    if (!contenedorModalDeuda) {
      console.error("Contenedor para modal de deuda no encontrado.")
      return
    }

    // Clear previous modal content
    contenedorModalDeuda.innerHTML = ""

    // Load HTML for the add form
    fetch("../formulario-deudas/fordeudas.html")
      .then((response) => response.text())
      .then((html) => {
        contenedorModalDeuda.innerHTML = html
        // Load JS for the add form
        const script = document.createElement("script")
        script.src = "../formulario-deudas/fordeudas.js"
        script.onload = () => {
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
    const deudas = JSON.parse(localStorage.getItem("deudas")) || []
    tabla.innerHTML = ""

    let totalDeuda = 0
    let deudaPendiente = 0
    let deudasPagadas = 0

    deudas.forEach((deuda, index) => {
      totalDeuda += Number.parseFloat(deuda.monto)
      if (deuda.estado === "pendiente") {
        deudaPendiente += Number.parseFloat(deuda.monto)
      } else if (deuda.estado === "pagada") {
        deudasPagadas += Number.parseFloat(deuda.monto)
      }

      const fila = document.createElement("tr")
      fila.innerHTML = `
        <td>${deuda.acreedor}</td>
        <td>$${Number.parseFloat(deuda.monto).toFixed(2)}</td>
        <td>${deuda.fechaInicio}</td>
        <td>${deuda.fechaVencimiento || "-"}</td>
        <td>${deuda.tasaInteres ? `${deuda.tasaInteres}%` : "-"}</td>
        <td>${deuda.estado}</td>
        <td>${deuda.descripcion || "-"}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 btn-editar" data-index="${index}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}"><i class="bi bi-trash"></i></button>
        </td>
      `
      tabla.appendChild(fila)
    })

    // Update summary
    document.getElementById("totalDeuda").textContent = `$${totalDeuda.toFixed(2)}`
    document.getElementById("deudaPendiente").textContent = `$${deudaPendiente.toFixed(2)}`
    document.getElementById("deudasPagadas").textContent = `$${deudasPagadas.toFixed(2)}`

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index")
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta deuda?")
        if (confirmacion) {
          deudas.splice(idx, 1)
          localStorage.setItem("deudas", JSON.stringify(deudas))
          renderDeudas()
          alert("¡Deuda eliminada exitosamente!")
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
      alert("¡Deuda actualizada exitosamente!")
    }
  }
})
