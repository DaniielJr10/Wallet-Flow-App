document.addEventListener("DOMContentLoaded", () => {
  renderInversiones()

  // Check for openForm query parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("openForm") === "true") {
    openAddInversionModal()
  }

  // Event listener for "Agregar Inversión" button on the page
  document.getElementById("btnAgregarInversionPage").addEventListener("click", openAddInversionModal)

  function openAddInversionModal() {
    const contenedorModalInversion = document.getElementById("contenedorModalInversion")
    if (!contenedorModalInversion) {
      console.error("Contenedor para modal de inversión no encontrado.")
      return
    }

    // Clear previous modal content
    contenedorModalInversion.innerHTML = ""

    // Load HTML for the add form
    fetch("../formulario-inversiones/forinversiones.html")
      .then((response) => response.text())
      .then((html) => {
        contenedorModalInversion.innerHTML = html
        // Load JS for the add form
        const script = document.createElement("script")
        script.src = "../formulario-inversiones/forinversiones.js"
        script.onload = () => {
          const initFormularioInversion = window.initFormularioInversion // Declare the variable before using it
          if (typeof initFormularioInversion === "function") {
            initFormularioInversion(renderInversiones) // Pass renderInversiones as callback
          }
          const modal = document.getElementById("modalAgregarInversion")
          if (modal) {
            modal.classList.remove("d-none")
          }
        }
        document.body.appendChild(script)
      })
      .catch((error) => console.error("Error loading inversion form:", error))
  }

  function renderInversiones() {
    const tabla = document.getElementById("tablaInversiones").querySelector("tbody")
    const inversiones = JSON.parse(localStorage.getItem("inversiones")) || []
    tabla.innerHTML = ""

    let totalInvertido = 0
    const tipoCount = {}
    let totalRendimiento = 0

    inversiones.forEach((inversion, index) => {
      totalInvertido += Number.parseFloat(inversion.monto)
      tipoCount[inversion.tipo] = (tipoCount[inversion.tipo] || 0) + Number.parseFloat(inversion.monto)
      totalRendimiento += Number.parseFloat(inversion.rendimientoEsperado || 0)

      const fila = document.createElement("tr")
      fila.innerHTML = `
        <td>${inversion.tipo}</td>
        <td>$${Number.parseFloat(inversion.monto).toFixed(2)}</td>
        <td>${inversion.fechaInicio}</td>
        <td>${inversion.fechaFin || "-"}</td>
        <td>${inversion.riesgo}</td>
        <td>${inversion.rendimientoEsperado ? `${inversion.rendimientoEsperado}%` : "-"}</td>
        <td>${inversion.descripcion || "-"}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 btn-editar" data-index="${index}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}"><i class="bi bi-trash"></i></button>
        </td>
      `
      tabla.appendChild(fila)
    })

    // Update summary
    document.getElementById("totalInvertido").textContent = `$${totalInvertido.toFixed(2)}`

    let principalInversionTipo = "N/A"
    let maxMonto = 0
    for (const tipo in tipoCount) {
      if (tipoCount[tipo] > maxMonto) {
        maxMonto = tipoCount[tipo]
        principalInversionTipo = tipo
      }
    }
    document.getElementById("inversionPrincipal").textContent = principalInversionTipo

    const promedioRendimiento = inversiones.length > 0 ? (totalRendimiento / inversiones.length).toFixed(2) : "0.00"
    document.getElementById("rendimientoPromedio").textContent = `${promedioRendimiento}%`

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index")
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta inversión?")
        if (confirmacion) {
          inversiones.splice(idx, 1)
          localStorage.setItem("inversiones", JSON.stringify(inversiones))
          renderInversiones()
          alert("¡Inversión eliminada exitosamente!")
        }
      })
    })

    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index")
        editarInversion(idx)
      })
    })
  }

  function editarInversion(idx) {
    const inversiones = JSON.parse(localStorage.getItem("inversiones")) || []
    const inversion = inversiones[idx]

    const contenedorModalEditarInversion = document.getElementById("contenedorModalEditarInversion")
    if (!contenedorModalEditarInversion) {
      console.error("Contenedor para modal de edición de inversión no encontrado.")
      return
    }
    contenedorModalEditarInversion.innerHTML = "" // Clear previous modal content

    const formHtml = `
      <div id="modalEditarInversion" class="modal-overlay">
        <form id="formEditarInversion" class="form-editar">
          <h5 class="form-titulo">Editar Inversión</h5>
          <label class="form-label">Tipo:
            <input class="form-control" name="tipo" value="${inversion.tipo}" required>
          </label>
          <label class="form-label">Monto:
            <input class="form-control" name="monto" type="number" min="0" step="0.01" value="${inversion.monto}" required>
          </label>
          <label class="form-label">Fecha Inicio:
            <input class="form-control" name="fechaInicio" type="date" value="${inversion.fechaInicio}" required>
          </label>
          <label class="form-label">Fecha Fin:
            <input class="form-control" name="fechaFin" type="date" value="${inversion.fechaFin || ""}">
          </label>
          <label class="form-label">Riesgo:
            <select class="form-control" name="riesgo">
              <option value="bajo" ${inversion.riesgo === "bajo" ? "selected" : ""}>Bajo</option>
              <option value="medio" ${inversion.riesgo === "medio" ? "selected" : ""}>Medio</option>
              <option value="alto" ${inversion.riesgo === "alto" ? "selected" : ""}>Alto</option>
            </select>
          </label>
          <label class="form-label">Rendimiento Esperado (%):
            <input class="form-control" name="rendimientoEsperado" type="number" step="0.01" value="${inversion.rendimientoEsperado || ""}">
          </label>
          <label class="form-label">Descripción:
            <input class="form-control" name="descripcion" value="${inversion.descripcion || ""}">
          </label>
          <div class="form-buttons">
            <button type="submit" class="btn btn-success btn-sm">Guardar</button>
            <button type="button" class="btn btn-secondary btn-sm" id="cancelarEditar">Cancelar</button>
          </div>
        </form>
      </div>
    `

    contenedorModalEditarInversion.innerHTML = formHtml

    document.getElementById("cancelarEditar").onclick = () => {
      contenedorModalEditarInversion.innerHTML = "" // Close modal
    }

    document.getElementById("formEditarInversion").onsubmit = function (e) {
      e.preventDefault()
      const formData = new FormData(this)
      inversiones[idx] = {
        tipo: formData.get("tipo"),
        monto: formData.get("monto"),
        fechaInicio: formData.get("fechaInicio"),
        fechaFin: formData.get("fechaFin"),
        riesgo: formData.get("riesgo"),
        rendimientoEsperado: formData.get("rendimientoEsperado"),
        descripcion: formData.get("descripcion"),
      }
      localStorage.setItem("inversiones", JSON.stringify(inversiones))
      contenedorModalEditarInversion.innerHTML = "" // Close modal
      renderInversiones()
      alert("¡Inversión actualizada exitosamente!")
    }
  }
})
