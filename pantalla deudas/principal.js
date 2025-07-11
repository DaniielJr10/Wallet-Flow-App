document.addEventListener("DOMContentLoaded", () => {
  const botonAgregar = document.getElementById("botonAgregar")
  const menuOpciones = document.getElementById("menuOpciones")
  const btnNuevoIngreso = document.getElementById("btnNuevoIngreso")
  const btnNuevaDeuda = document.getElementById("btnNuevaDeuda")
  const contenedorModalIngreso = document.getElementById("contenedorModalIngreso")

  // Elementos del menú lateral
  const btnInicio = document.getElementById("btnInicio")
  const btnDeudas = document.getElementById("btnDeudas")
  const btnVolverInicio = document.getElementById("btnVolverInicio")

  // Contenidos
  const contenidoInicio = document.getElementById("contenidoInicio")
  const contenidoDeudas = document.getElementById("contenidoDeudas")

  // Funciones para cargar deudas y gráficas
  function cargarDeudas() {
    // Implementación de cargarDeudas
    console.log("Cargando deudas...")
  }

  function cargarGraficas() {
    // Implementación de cargarGraficas
    console.log("Cargando gráficas...")
  }

  // Función para mostrar/ocultar contenidos
  function mostrarContenido(contenido) {
    // Ocultar todos los contenidos
    contenidoInicio.style.display = "none"
    contenidoDeudas.style.display = "none"

    // Remover clase active de todos los enlaces del menú
    document.querySelectorAll(".menu-lateral .nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    // Mostrar el contenido seleccionado
    contenido.style.display = "block"
  }

  // Event listeners para navegación
  btnInicio.addEventListener("click", (e) => {
    e.preventDefault()
    mostrarContenido(contenidoInicio)
    btnInicio.classList.add("active")
  })

  btnDeudas.addEventListener("click", (e) => {
    e.preventDefault()
    mostrarContenido(contenidoDeudas)
    btnDeudas.classList.add("active")
    // Cargar las deudas y gráficas cuando se muestra la sección
    setTimeout(() => {
      if (typeof cargarDeudas === "function") {
        cargarDeudas()
      }
      if (typeof cargarGraficas === "function") {
        console.log("Llamando cargarGraficas desde principal.js")
        cargarGraficas()
      } else {
        console.error("cargarGraficas no está definida")
      }
    }, 300)
  })

  btnVolverInicio.addEventListener("click", (e) => {
    e.preventDefault()
    mostrarContenido(contenidoInicio)
    btnInicio.classList.add("active")
  })

  // Botón flotante y menú emergente
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

  // Nueva deuda desde el menú flotante
  btnNuevaDeuda.addEventListener("click", (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Mostrar la sección de deudas si no está visible
    if (contenidoDeudas.style.display === "none") {
      mostrarContenido(contenidoDeudas)
      btnDeudas.classList.add("active")
    }
    // Abrir el nuevo modal de agregar deuda
    abrirModalAgregar()
  })

  // Mostrar el formulario de ingreso como modal y cargar su JS
  btnNuevoIngreso.addEventListener("click", async (e) => {
    e.preventDefault()
    menuOpciones.classList.add("d-none")
    // Aquí puedes agregar la lógica para cargar el formulario de ingresos
    console.log("Abrir formulario de ingresos")
  })

  // Función para abrir el modal de agregar deuda
  function abrirModalAgregar() {
    const modal = document.getElementById("modalAgregar")
    if (modal) {
      modal.style.display = "flex"
    }
  }

  // Inicializar con el contenido de inicio
  btnInicio.classList.add("active")
})
