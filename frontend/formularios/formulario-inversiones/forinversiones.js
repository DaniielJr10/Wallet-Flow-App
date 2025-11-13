// Lógica del formulario de inversión

function initFormularioInversion(callbackRender) {
  // Elementos del formulario
  const modal = document.getElementById("modalAgregarInversion")
  const form = document.getElementById("formAgregarInversion")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  const nextStepBtn = form.querySelector(".next-step-btn")
  const prevStepBtn = form.querySelector(".prev-step-btn")
  const cancelarBtn = document.getElementById("cancelarInversion")

  // Paso siguiente
  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      // validacion basica para el paso 1
      const tipo = document.getElementById("addTipoInversion").value
      const monto = document.getElementById("addMontoInversion").value
      const fechaInicio = document.getElementById("addFechaInicioInversion").value
      const riesgo = document.getElementById("addRiesgoInversion").value

      if (!tipo || !monto || !fechaInicio || !riesgo || Number.parseFloat(monto) <= 0) {
        alert("Por favor, completa todos los campos obligatorios del Paso 1.")
        return
      }

      step1.classList.add("hidden")
      step2.classList.remove("hidden")
    })
  }
  // Paso anterior
  if (prevStepBtn) {
    prevStepBtn.addEventListener("click", () => {
      step2.classList.add("hidden")
      step1.classList.remove("hidden")
    })
  }
 
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      cerrarModalInversion()
    })
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.classList.contains("d-none")) {
      cerrarModalInversion()
    }
  })

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        cerrarModalInversion()
      }
    })
  }
  // Envío del formulario
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const datos = {
        tipo: document.getElementById("addTipoInversion").value,
        monto: document.getElementById("addMontoInversion").value,
        fechaInicio: document.getElementById("addFechaInicioInversion").value,
        riesgo: document.getElementById("addRiesgoInversion").value,
        fechaFin: document.getElementById("addFechaFinInversion").value,
        rendimientoEsperado: document.getElementById("addRendimientoEsperadoInversion").value,
        descripcion: document.getElementById("addDescripcionInversion").value,
      }
      // Guardar en localStorage
      const inversiones = JSON.parse(localStorage.getItem("inversiones")) || []
      datos.id = Date.now();
      inversiones.push(datos)
      localStorage.setItem("inversiones", JSON.stringify(inversiones))
      
    
      alert("¡Inversión guardada exitosamente!")
      cerrarModalInversion()
      
   
      if (callbackRender) {
        callbackRender() 
      }
      
 
      if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Inversión guardada correctamente', 'success');
      }
    })
  }

  function cerrarModalInversion() {
    modal.classList.add("d-none")
    if (form) {
      form.reset()
      step2.classList.add("hidden")
      step1.classList.remove("hidden")
    }
  }
}
