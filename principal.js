document.addEventListener("DOMContentLoaded", () => {
  const botonAgregar = document.getElementById("botonAgregar")
  const menuOpciones = document.getElementById("menuOpciones")
  const btnNuevoIngreso = document.getElementById("btnNuevoIngreso")
  const btnNuevaDeuda = document.getElementById("btnNuevaDeuda")
  const btnNuevaInversion = document.getElementById("btnNuevaInversion")
  const btnNuevaCuenta = document.getElementById("btnNuevaCuenta")

  // Toggle menu de opciones al hacer clic en el botón flotante
  botonAgregar.addEventListener("click", (e) => {
    e.preventDefault()
    menuOpciones.classList.toggle("d-none")
  })

  // Cierra el menú si haces clic fuera
  document.addEventListener("click", (event) => {
    if (!menuOpciones.contains(event.target) && !botonAgregar.contains(event.target)) {
      menuOpciones.classList.add("d-none")
    }
  })

  // Función para cargar y mostrar un modal
  async function loadModal(containerId, htmlPath, jsPath, initFunction) {
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`Contenedor no encontrado: ${containerId}`)
      return
    }

    // Limpiar contenedor antes de cargar nuevo contenido
    container.innerHTML = ""

    // Cargar el HTML del formulario
    const response = await fetch(htmlPath)
    const html = await response.text()
    container.innerHTML = html

    // Cargar y ejecutar el JS del formulario
    const script = document.createElement("script")
    script.src = jsPath
    script.onload = () => {
      if (typeof initFunction === "function") {
        initFunction() // Inicializar la lógica del formulario
      }
      // Mostrar el modal (asumiendo que el JS del formulario lo hace)
      const modal = container.querySelector(".modal-overlay")
      if (modal) {
        modal.classList.remove("d-none")
      }
    }
    document.body.appendChild(script)
  }

  // Event listeners para los botones del menú flotante
  btnNuevoIngreso.addEventListener("click", async (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Redirigir a la página de ingresos y abrir el modal
    window.location.href = "ingresos/ingresos.html?openForm=true"
  })

  btnNuevaDeuda.addEventListener("click", async (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Redirigir a la página de deudas y abrir el modal
    window.location.href = "deudas/deudas.html?openForm=true"
  })

  btnNuevaInversion.addEventListener("click", async (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Redirigir a la página de inversiones y abrir el modal
    window.location.href = "inversiones/inversiones.html?openForm=true"
  })

  btnNuevaCuenta.addEventListener("click", async (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Placeholder para el formulario de cuentas
    alert("Formulario de Cuentas (en construcción)")
  })

  // Lógica para el menú lateral en móviles (Bootstrap collapse)
  const menuLateral = document.getElementById("menuLateral")
  const menuToggleButton = document.querySelector(".d-md-none.m-2")

  if (menuToggleButton) {
    menuToggleButton.addEventListener("click", () => {
      if (menuLateral.classList.contains("d-none")) {
        menuLateral.classList.remove("d-none")
        menuLateral.classList.add("d-block")
      } else {
        menuLateral.classList.remove("d-block")
        menuLateral.classList.add("d-none")
      }
    })
  }
})
