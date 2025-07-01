// Selecciona los elementos del formulario y los pasos
const formAgregar = document.getElementById("formAgregar")
const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const nextStepBtn = document.querySelector(".next-step-btn")
const prevStepBtn = document.querySelector(".prev-step-btn")

// Función para mostrar el siguiente paso del formulario
function irAlSiguientePaso() {
  // Validar campos requeridos del paso 1
  const tipoDeuda = document.getElementById("addTipoDeuda").value
  const acreedor = document.getElementById("addAcreedor").value
  const monto = document.getElementById("addMonto").value
  const fechaVencimiento = document.getElementById("addFechaVencimiento").value

  if (!tipoDeuda || !acreedor || !monto || !fechaVencimiento) {
    alert("Por favor completa todos los campos requeridos antes de continuar.")
    return
  }

  step1.classList.add("hidden")
  step2.classList.remove("hidden")
}

// Función para volver al paso anterior
function volverAlPasoAnterior() {
  step2.classList.add("hidden")
  step1.classList.remove("hidden")
}

// Asigna los eventos a los botones de navegación
if (nextStepBtn) {
  nextStepBtn.addEventListener("click", irAlSiguientePaso)
}
if (prevStepBtn) {
  prevStepBtn.addEventListener("click", volverAlPasoAnterior)
}

// Mostrar/ocultar opciones de frecuencia según el checkbox
function toggleFrecuencia() {
  const check = document.getElementById("addCheckRecurrente")
  const opciones = document.getElementById("addFrecuenciaOptions")
  if (check.checked) {
    opciones.classList.add("visible")
  } else {
    opciones.classList.remove("visible")
    document.getElementById("addFrecuencia").value = ""
  }
}

// Mostrar/ocultar opciones de estado según el checkbox
function toggleEstado() {
  const check = document.getElementById("addCheckEstado")
  const opciones = document.getElementById("addEstadoOptions")
  if (check.checked) {
    opciones.classList.add("visible")
  } else {
    opciones.classList.remove("visible")
    document.getElementById("addEstado").value = ""
  }
}

// Mostrar/ocultar opciones de prioridad según el checkbox
function togglePrioridad() {
  const check = document.getElementById("addCheckPrioridad")
  const opciones = document.getElementById("addPrioridadOptions")
  if (check.checked) {
    opciones.classList.add("visible")
  } else {
    opciones.classList.remove("visible")
    document.getElementById("addPrioridad").value = ""
  }
}

// Cierra el modal
function cerrarModal() {
  document.getElementById("modalAgregar").style.display = "none"
  limpiarFormulario()
  volverAlPasoAnterior()
}

// Función para limpiar el formulario
function limpiarFormulario() {
  formAgregar.reset()

  // Ocultar opciones adicionales
  document.getElementById("addFrecuenciaOptions").classList.remove("visible")
  document.getElementById("addEstadoOptions").classList.remove("visible")
  document.getElementById("addPrioridadOptions").classList.remove("visible")

  // Resetear checkboxes
  document.getElementById("addCheckRecurrente").checked = false
  document.getElementById("addCheckEstado").checked = false
  document.getElementById("addCheckPrioridad").checked = false
}

// Función para calcular días hasta vencimiento
function calcularDiasVencimiento(fechaVencimiento) {
  const hoy = new Date()
  const vencimiento = new Date(fechaVencimiento)
  const diferencia = vencimiento.getTime() - hoy.getTime()
  return Math.ceil(diferencia / (1000 * 3600 * 24))
}

// Envía el formulario
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault()

  // Recopilar todos los datos del formulario
  const datos = {
    tipoDeuda: document.getElementById("addTipoDeuda").value,
    acreedor: document.getElementById("addAcreedor").value,
    monto: Number.parseFloat(document.getElementById("addMonto").value),
    fechaVencimiento: document.getElementById("addFechaVencimiento").value,
    descripcion: document.getElementById("addDescripcion").value,
    cuotaMensual: document.getElementById("addCuotaMensual").value
      ? Number.parseFloat(document.getElementById("addCuotaMensual").value)
      : null,
    esRecurrente: document.getElementById("addCheckRecurrente").checked,
    frecuencia: document.getElementById("addFrecuencia").value,
    tieneEstado: document.getElementById("addCheckEstado").checked,
    estado: document.getElementById("addEstado").value,
    tienePrioridad: document.getElementById("addCheckPrioridad").checked,
    prioridad: document.getElementById("addPrioridad").value,
    diasVencimiento: calcularDiasVencimiento(document.getElementById("addFechaVencimiento").value),
    fechaCreacion: new Date().toISOString().split("T")[0],
  }

  // Validaciones adicionales
  if (datos.cuotaMensual && datos.cuotaMensual > datos.monto) {
    alert("La cuota mensual no puede ser mayor al monto total de la deuda.")
    return
  }

  // Mostrar datos en consola (aquí puedes integrar con tu backend)
  console.log("Deuda agregada:", datos)

  // Mostrar mensaje de confirmación
  const diasRestantes = datos.diasVencimiento
  let mensaje = `Deuda agregada exitosamente.\n`
  mensaje += `Monto: $${datos.monto.toLocaleString()}\n`
  mensaje += `Acreedor: ${datos.acreedor}\n`

  if (diasRestantes > 0) {
    mensaje += `Días hasta vencimiento: ${diasRestantes}`
  } else if (diasRestantes === 0) {
    mensaje += `¡ATENCIÓN! La deuda vence hoy.`
  } else {
    mensaje += `¡ATENCIÓN! La deuda está vencida por ${Math.abs(diasRestantes)} días.`
  }

  alert(mensaje)
  cerrarModal()
})

// Permite cerrar el modal con la tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cerrarModal()
  }
})

// Función para formatear números mientras se escriben
document.getElementById("addMonto").addEventListener("input", (e) => {
  const value = e.target.value.replace(/[^\d]/g, "")
  if (value) {
    e.target.value = Number.parseInt(value).toLocaleString()
  }
})

document.getElementById("addCuotaMensual").addEventListener("input", (e) => {
  const value = e.target.value.replace(/[^\d]/g, "")
  if (value) {
    e.target.value = Number.parseInt(value).toLocaleString()
  }
})

// Establecer fecha mínima como hoy
document.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("addFechaVencimiento")
  const hoy = new Date().toISOString().split("T")[0]
  fechaInput.setAttribute("min", hoy)
})
