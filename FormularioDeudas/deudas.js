// JavaScript para el formulario de deudas
document.addEventListener("DOMContentLoaded", () => {
  // Configurar fecha mínima como hoy
  const fechaInput = document.getElementById("addFecha")
  const today = new Date().toISOString().split("T")[0]
  fechaInput.setAttribute("min", today)
  fechaInput.value = today

  // Navegación entre pasos
  const nextBtn = document.querySelector(".next-step-btn")
  const prevBtn = document.querySelector(".prev-step-btn")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")

  nextBtn.addEventListener("click", () => {
    if (validarPaso1()) {
      step1.classList.add("hidden")
      step2.classList.remove("hidden")
    }
  })

  prevBtn.addEventListener("click", () => {
    step2.classList.add("hidden")
    step1.classList.remove("hidden")
  })

  // Manejar envío del formulario
  document.getElementById("formAgregar").addEventListener("submit", (e) => {
    e.preventDefault()
    guardarDeuda()
  })
})

function validarPaso1() {
  const categoria = document.getElementById("addCategoria").value
  const acreedor = document.getElementById("addMetodo").value
  const monto = document.getElementById("addMonto").value
  const fecha = document.getElementById("addFecha").value

  if (!categoria || !acreedor || !monto || !fecha) {
    alert("Por favor, completa todos los campos obligatorios.")
    return false
  }

  if (Number.parseFloat(monto) <= 0) {
    alert("El monto debe ser mayor a 0.")
    return false
  }

  return true
}

function toggleFrecuencia() {
  const checkbox = document.getElementById("addCheckRecurrente")
  const options = document.getElementById("addFrecuenciaOptions")

  if (checkbox.checked) {
    options.classList.add("show")
    options.style.display = "block"
  } else {
    options.classList.remove("show")
    options.style.display = "none"
    document.getElementById("addFrecuencia").value = ""
  }
}

function toggleCuenta() {
  const checkbox = document.getElementById("addCheckCuenta")
  const options = document.getElementById("addCuentaAsociadaOptions")

  if (checkbox.checked) {
    options.classList.add("show")
    options.style.display = "block"
  } else {
    options.classList.remove("show")
    options.style.display = "none"
    document.getElementById("addCuentaAsociada").value = ""
  }
}

function toggleInteres() {
  const checkbox = document.getElementById("addCheckInteres")
  const options = document.getElementById("addInteresOptions")

  if (checkbox.checked) {
    options.classList.add("show")
    options.style.display = "block"
  } else {
    options.classList.remove("show")
    options.style.display = "none"
    document.getElementById("addTasaInteres").value = ""
  }
}

function guardarDeuda() {
  const deuda = {
    tipo: document.getElementById("addCategoria").value,
    acreedor: document.getElementById("addMetodo").value,
    monto: Number.parseFloat(document.getElementById("addMonto").value),
    fechaVencimiento: document.getElementById("addFecha").value,
    descripcion: document.getElementById("addDescripcion").value,
    esRecurrente: document.getElementById("addCheckRecurrente").checked,
    frecuencia: document.getElementById("addFrecuencia").value,
    cuentaPago: document.getElementById("addCuentaAsociada").value,
    tasaInteres: document.getElementById("addTasaInteres").value
      ? Number.parseFloat(document.getElementById("addTasaInteres").value)
      : null,
    fechaCreacion: new Date().toISOString(),
  }

  console.log("Deuda guardada:", deuda)

  // Aquí puedes agregar la lógica para guardar en base de datos o localStorage
  alert("Deuda guardada exitosamente!")

  // Limpiar formulario
  document.getElementById("formAgregar").reset()
  cerrarModal()
}

function cerrarModal() {
  document.getElementById("modalAgregar").style.display = "none"
  // Resetear a paso 1
  document.getElementById("step2").classList.add("hidden")
  document.getElementById("step1").classList.remove("hidden")
}

// Cerrar modal al hacer clic fuera
document.getElementById("modalAgregar").addEventListener("click", function (e) {
  if (e.target === this) {
    cerrarModal()
  }
})
