// Lógica del formulario de deuda

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
      // validacion basica para el paso 1
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
 
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      cerrarModalDeuda()
    })
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.classList.contains("d-none")) {
      cerrarModalDeuda()
    }
  })

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        cerrarModalDeuda()
      }
    })
  }
  // Envío del formulario
  if (form) {
    // Evita enlazar el submit más de una vez
    if (form.dataset.inited !== '1') {
      form.dataset.inited = '1'
      form.addEventListener("submit", async (e) => {
        console.trace('submit handler triggered: fordeudas.js')
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

        try {
          // Usar el servicio centralizado (evita mezclar localStorage y DB)
          if (window.deudasService && typeof window.deudasService.agregarDeuda === 'function') {
            await window.deudasService.agregarDeuda(datos)
          } else if (window.walletDB && typeof window.walletDB.addDebt === 'function') {
            await window.walletDB.addDebt(datos)
          } else {
            throw new Error('Servicio de deudas no disponible')
          }

          // Success
          if (typeof mostrarNotificacion === 'function') mostrarNotificacion('Deuda guardada correctamente', 'success')
          else alert('¡Deuda guardada exitosamente!')

          cerrarModalDeuda()

          // Actualizar la pantalla si hay callback de renderizado
          if (callbackRender) callbackRender()
        } catch (err) {
          console.error('Error guardando deuda:', err)
          if (typeof mostrarNotificacion === 'function') mostrarNotificacion(err.message || 'Error al guardar deuda', 'danger')
          else alert('Error al guardar deuda')
        }
      })
    }

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
