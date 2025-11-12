// Lógica del formulario de deuda avanzado

function initFormularioDeuda(callbackRender) {
  // Elementos del formulario
  const modal = document.getElementById("modalAgregarDeuda")
  const form = document.getElementById("formAgregarDeuda")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  const nextStepBtn = form.querySelector(".next-step-btn")
  const prevStepBtn = form.querySelector(".prev-step-btn")
  const cancelarBtn = document.getElementById("cancelarDeuda")

  // Paso siguiente
  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      // Basic validation for step 1
      const acreedor = document.getElementById("addAcreedorDeuda").value
      const monto = document.getElementById("addMontoDeuda").value
      const fechaInicio = document.getElementById("addFechaInicioDeuda").value
      const estado = document.getElementById("addEstadoDeuda").value

      if (!acreedor || !monto || !fechaInicio || !estado || Number.parseFloat(monto) <= 0) {
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
  // Cancelar y cerrar modal
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      cerrarModalDeuda()
    })
  }
  // Cerrar modal con Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.classList.contains("d-none")) {
      cerrarModalDeuda()
    }
  })
  // Cerrar modal al hacer clic fuera del contenido
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        cerrarModalDeuda()
      }
    })
  }
  // Envío del formulario
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const datos = {
        acreedor: document.getElementById("addAcreedorDeuda").value,
        monto: document.getElementById("addMontoDeuda").value,
        fechaInicio: document.getElementById("addFechaInicioDeuda").value,
        estado: document.getElementById("addEstadoDeuda").value,
        fechaVencimiento: document.getElementById("addFechaVencimientoDeuda").value,
        tasaInteres: document.getElementById("addTasaInteresDeuda").value,
        descripcion: document.getElementById("addDescripcionDeuda").value,
      }
      // Guardar en localStorage
      const deudas = JSON.parse(localStorage.getItem("deudas")) || []
      datos.id = Date.now(); // Agregar ID único
      deudas.push(datos)
      localStorage.setItem("deudas", JSON.stringify(deudas))
      
      // Mensaje de éxito (opcional)
      alert("¡Deuda guardada exitosamente!")
      cerrarModalDeuda()
      
      // Actualizar la pantalla si hay callback de renderizado
      if (callbackRender) {
        callbackRender() // Call the render function from the parent page
      }
      
      // Si estamos en la pantalla principal, mostrar notificación adicional
      if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Deuda guardada correctamente', 'success');
      }
    })
  }
  // Función para cerrar y limpiar el modal
  function cerrarModalDeuda() {
    modal.classList.add("d-none")
    if (form) {
      form.reset()
      step2.classList.add("hidden")
      step1.classList.remove("hidden")
    }
  }
}
