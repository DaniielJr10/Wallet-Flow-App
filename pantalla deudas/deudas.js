// Datos iniciales
let deudas = [
  {
    id: 1,
    nombre: "Préstamo Personal",
    acreedor: "Banco BBVA",
    montoTotal: 10000000,
    montoPagado: 3550000,
    fechaInicio: "2024-03-12",
    fechaVencimiento: "2025-03-12",
    tasaInteres: 12,
    descripcion: "Préstamo Personal",
    estado: "pendiente",
  },
  {
    id: 2,
    nombre: "Tarjeta de Crédito",
    acreedor: "Banco Internacional",
    montoTotal: 2000000,
    montoPagado: 1400000,
    fechaInicio: "2024-01-15",
    fechaVencimiento: "2025-01-15",
    tasaInteres: 24,
    descripcion: "Tarjeta de Crédito",
    estado: "pendiente",
  },
]

let editandoId = null

// ========== FUNCIONES PARA LAS GRÁFICAS MEJORADAS ==========
function cargarGraficas() {
  cargarGraficoDeudas()
  cargarGraficoEstados()
}

function cargarGraficoDeudas() {
  const canvas = document.getElementById("graficoDeudas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Configurar canvas para alta resolución
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + "px"
  canvas.style.height = rect.height + "px"

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (deudas.length === 0) {
    // Mensaje cuando no hay datos - más elegante
    ctx.fillStyle = "#8e8e93"
    ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No hay deudas registradas", rect.width / 2, rect.height / 2)
    return
  }

  // Calcular datos para el gráfico de dona
  const totalDeuda = deudas.reduce((sum, deuda) => sum + deuda.montoTotal, 0)
  const totalPagado = deudas.reduce((sum, deuda) => sum + deuda.montoPagado, 0)
  const totalRestante = totalDeuda - totalPagado

  const porcentajePagado = (totalPagado / totalDeuda) * 100
  const porcentajeRestante = (totalRestante / totalDeuda) * 100

  // Configuración del gráfico
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const radius = Math.min(centerX, centerY) - 30
  const innerRadius = radius * 0.55

  // Crear gradientes
  const gradientPagado = ctx.createLinearGradient(0, 0, rect.width, rect.height)
  gradientPagado.addColorStop(0, "#34d399")
  gradientPagado.addColorStop(1, "#10b981")

  const gradientRestante = ctx.createLinearGradient(0, 0, rect.width, rect.height)
  gradientRestante.addColorStop(0, "#f87171")
  gradientRestante.addColorStop(1, "#ef4444")

  // Ángulos
  const startAngle = -Math.PI / 2
  const pagadoAngle = startAngle + (porcentajePagado / 100) * 2 * Math.PI
  const restanteAngle = pagadoAngle + (porcentajeRestante / 100) * 2 * Math.PI

  // Sombra para el gráfico
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 4

  // Dibujar sector pagado
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, pagadoAngle)
  ctx.arc(centerX, centerY, innerRadius, pagadoAngle, startAngle, true)
  ctx.closePath()
  ctx.fillStyle = gradientPagado
  ctx.fill()

  // Dibujar sector restante
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, pagadoAngle, restanteAngle)
  ctx.arc(centerX, centerY, innerRadius, restanteAngle, pagadoAngle, true)
  ctx.closePath()
  ctx.fillStyle = gradientRestante
  ctx.fill()

  // Quitar sombra para el texto
  ctx.shadowColor = "transparent"
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // Texto central con mejor tipografía
  ctx.fillStyle = "#1f2937"
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(`$${(totalDeuda / 1000000).toFixed(1)}M`, centerX, centerY - 8)

  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  ctx.fillStyle = "#6b7280"
  ctx.fillText("Total Deudas", centerX, centerY + 12)

  // Leyenda mejorada con iconos
  const legendY = rect.height - 50
  const legendSpacing = rect.width / 2 - 20

  // Leyenda Pagado
  ctx.fillStyle = "#10b981"
  ctx.beginPath()
  ctx.arc(40, legendY, 8, 0, 2 * Math.PI)
  ctx.fill()

  ctx.fillStyle = "#374151"
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  ctx.textAlign = "left"
  ctx.fillText(`Pagado: $${(totalPagado / 1000000).toFixed(1)}M`, 55, legendY + 4)

  // Leyenda Restante
  ctx.fillStyle = "#ef4444"
  ctx.beginPath()
  ctx.arc(40, legendY + 20, 8, 0, 2 * Math.PI)
  ctx.fill()

  ctx.fillStyle = "#374151"
  ctx.fillText(`Restante: $${(totalRestante / 1000000).toFixed(1)}M`, 55, legendY + 24)

  // Porcentajes
  ctx.fillStyle = "#6b7280"
  ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  ctx.textAlign = "right"
  ctx.fillText(`${porcentajePagado.toFixed(1)}%`, rect.width - 20, legendY + 4)
  ctx.fillText(`${porcentajeRestante.toFixed(1)}%`, rect.width - 20, legendY + 24)
}

function cargarGraficoEstados() {
  const canvas = document.getElementById("graficoEstados")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Configurar canvas para alta resolución
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + "px"
  canvas.style.height = rect.height + "px"

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (deudas.length === 0) {
    ctx.fillStyle = "#8e8e93"
    ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No hay deudas registradas", rect.width / 2, rect.height / 2)
    return
  }

  // Contar estados
  const estados = {}
  deudas.forEach((deuda) => {
    const estado = deuda.estado || "pendiente"
    estados[estado] = (estados[estado] || 0) + 1
  })

  // Colores modernos con gradientes
  const colores = {
    pendiente: { start: "#fbbf24", end: "#f59e0b" },
    pagada: { start: "#34d399", end: "#10b981" },
    vencida: { start: "#f87171", end: "#ef4444" },
    al_dia: { start: "#60a5fa", end: "#3b82f6" },
    atrasado: { start: "#fb923c", end: "#ea580c" },
    en_mora: { start: "#f43f5e", end: "#e11d48" },
  }

  // Configuración del gráfico de barras
  const padding = 40
  const chartWidth = rect.width - padding * 2
  const chartHeight = rect.height - 80
  const maxValue = Math.max(...Object.values(estados))
  const barWidth = (chartWidth / Object.keys(estados).length) * 0.7
  const barSpacing = (chartWidth / Object.keys(estados).length) * 0.3

  let x = padding + barSpacing / 2

  Object.entries(estados).forEach(([estado, cantidad], index) => {
    const barHeight = (cantidad / maxValue) * chartHeight
    const y = rect.height - 60 - barHeight

    // Crear gradiente para cada barra
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
    const colorConfig = colores[estado] || { start: "#6b7280", end: "#4b5563" }
    gradient.addColorStop(0, colorConfig.start)
    gradient.addColorStop(1, colorConfig.end)

    // Sombra para las barras
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2

    // Dibujar barra con bordes redondeados
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0])
    ctx.fill()

    // Quitar sombra para el texto
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Valor encima de la barra
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(cantidad.toString(), x + barWidth / 2, y - 8)

    // Etiqueta del estado (rotada y mejorada)
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.save()
    ctx.translate(x + barWidth / 2, rect.height - 25)
    ctx.rotate(-Math.PI / 6) // 30 grados
    ctx.textAlign = "center"

    // Capitalizar y formatear el texto
    const estadoFormateado = estado
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    ctx.fillText(estadoFormateado, 0, 0)
    ctx.restore()

    x += barWidth + barSpacing
  })

  // Líneas de cuadrícula sutiles
  ctx.strokeStyle = "#f3f4f6"
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const gridY = rect.height - 60 - (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, gridY)
    ctx.lineTo(rect.width - padding, gridY)
    ctx.stroke()
  }

  // Título del eje Y
  ctx.fillStyle = "#6b7280"
  ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  ctx.textAlign = "center"
  ctx.save()
  ctx.translate(15, rect.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText("Cantidad", 0, 0)
  ctx.restore()
}

// Función auxiliar para roundRect (si no está disponible)
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radii) {
    if (typeof radii === "number") {
      radii = [radii, radii, radii, radii]
    }

    this.beginPath()
    this.moveTo(x + radii[0], y)
    this.lineTo(x + width - radii[1], y)
    this.quadraticCurveTo(x + width, y, x + width, y + radii[1])
    this.lineTo(x + width, y + height - radii[2])
    this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height)
    this.lineTo(x + radii[3], y + height)
    this.quadraticCurveTo(x, y + height, x, y + height - radii[3])
    this.lineTo(x, y + radii[0])
    this.quadraticCurveTo(x, y, x + radii[0], y)
    this.closePath()
  }
}

// ========== FUNCIONES PRINCIPALES DE DEUDAS ==========

// Inicializar funcionalidad de deudas
document.addEventListener("DOMContentLoaded", () => {
  // Cargar deudas iniciales
  cargarDeudas()

  // Asegurar que las gráficas se carguen cuando se muestre la sección de deudas
  const btnDeudas = document.getElementById("btnDeudas")
  if (btnDeudas) {
    btnDeudas.addEventListener("click", () => {
      setTimeout(() => {
        console.log("Cargando gráficas...", deudas)
        cargarGraficas()
      }, 200)
    })
  }

  // Cargar gráficas inmediatamente si la sección ya está visible
  setTimeout(() => {
    const contenidoDeudas = document.getElementById("contenidoDeudas")
    if (contenidoDeudas && contenidoDeudas.style.display !== "none") {
      console.log("Cargando gráficas iniciales...", deudas)
      cargarGraficas()
    }
  }, 500)

  // Redimensionar gráficas cuando cambie el tamaño de ventana
  window.addEventListener("resize", () => {
    setTimeout(() => {
      cargarGraficas()
    }, 100)
  })

  // Eventos de formularios
  const formEditarDeuda = document.getElementById("formEditarDeuda")
  const formRegistrarPago = document.getElementById("formRegistrarPago")

  if (formEditarDeuda) {
    formEditarDeuda.onsubmit = (e) => {
      e.preventDefault()
      if (!validarFormulario("formEditarDeuda")) return mostrarError("validacionEditar")

      const deuda = deudas.find((d) => d.id === editandoId)
      deuda.nombre = document.getElementById("editDescripcion").value
      deuda.acreedor = document.getElementById("editNombreAcreedor").value
      deuda.montoTotal = +document.getElementById("editMontoDeuda").value
      deuda.montoPagado = +document.getElementById("editMontoPagado").value
      deuda.fechaInicio = document.getElementById("editFechaInicio").value
      deuda.fechaVencimiento = document.getElementById("editFechaVencimiento").value
      deuda.tasaInteres = +document.getElementById("editTasaInteres").value
      deuda.descripcion = document.getElementById("editDescripcion").value
      deuda.estado = document.getElementById("editEstadoDeuda").value

      cargarDeudas()
      cargarGraficas() // Actualizar gráficas
      cerrarModal("modalEditarDeuda")
    }
  }

  if (formRegistrarPago) {
    formRegistrarPago.onsubmit = (e) => {
      e.preventDefault()
      if (!validarFormulario("formRegistrarPago")) return mostrarError("validacionPago")

      const deuda = deudas.find((d) => d.id === editandoId)
      deuda.montoPagado += +document.getElementById("montoPago").value
      if (deuda.montoPagado >= deuda.montoTotal) {
        deuda.estado = "pagada"
        deuda.montoPagado = deuda.montoTotal
      }

      cargarDeudas()
      cargarGraficas() // Actualizar gráficas
      cerrarModal("modalRegistrarPago")
    }
  }

  // ========== FUNCIONALIDAD DEL FORMULARIO DE AGREGAR DEUDA ==========

  // Selecciona los elementos del formulario y los pasos
  const formAgregar = document.getElementById("formAgregar")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  const nextStepBtn = document.querySelector(".next-step-btn")
  const prevStepBtn = document.querySelector(".prev-step-btn")

  // Función para mostrar el siguiente paso del formulario
  function irAlSiguientePaso() {
    // Validar campos requeridos del paso 1
    const tipoDeuda = document.getElementById("addTipoDeuda")
    const acreedor = document.getElementById("addAcreedor")
    const monto = document.getElementById("addMonto")
    const fechaVencimiento = document.getElementById("addFechaVencimiento")

    // Verificar que los elementos existen y tienen valores
    if (!tipoDeuda || !tipoDeuda.value || tipoDeuda.value === "") {
      alert("Por favor selecciona el tipo de deuda.")
      return
    }

    if (!acreedor || !acreedor.value || acreedor.value === "") {
      alert("Por favor selecciona el acreedor.")
      return
    }

    if (!monto || !monto.value || monto.value.trim() === "") {
      alert("Por favor ingresa el monto total.")
      return
    }

    if (!fechaVencimiento || !fechaVencimiento.value || fechaVencimiento.value === "") {
      alert("Por favor selecciona la fecha de vencimiento.")
      return
    }

    // Validar que la fecha sea válida
    const fechaIngresada = new Date(fechaVencimiento.value)
    const fechaHoy = new Date()

    if (isNaN(fechaIngresada.getTime())) {
      alert("Por favor ingresa una fecha válida.")
      return
    }

    if (fechaIngresada < fechaHoy) {
      alert("La fecha de vencimiento no puede ser anterior a hoy.")
      return
    }

    // Validar que el monto sea un número válido
    const montoNumerico = Number.parseFloat(monto.value.replace(/,/g, ""))
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      alert("Por favor ingresa un monto válido mayor a 0.")
      return
    }

    // Si todo está correcto, continuar al siguiente paso
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

  // Función para calcular días hasta vencimiento
  function calcularDiasVencimiento(fechaVencimiento) {
    const hoy = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diferencia = vencimiento.getTime() - hoy.getTime()
    return Math.ceil(diferencia / (1000 * 3600 * 24))
  }

  // Envía el formulario
  if (formAgregar) {
    formAgregar.addEventListener("submit", (e) => {
      e.preventDefault()

      // Recopilar todos los datos del formulario
      const datos = {
        id: Date.now(),
        nombre:
          document.getElementById("addTipoDeuda").options[document.getElementById("addTipoDeuda").selectedIndex].text,
        acreedor:
          document.getElementById("addAcreedor").options[document.getElementById("addAcreedor").selectedIndex].text,
        montoTotal: Number.parseFloat(document.getElementById("addMonto").value.replace(/,/g, "")),
        montoPagado: 0,
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaVencimiento: document.getElementById("addFechaVencimiento").value,
        tasaInteres: 0,
        descripcion:
          document.getElementById("addDescripcion").value ||
          document.getElementById("addTipoDeuda").options[document.getElementById("addTipoDeuda").selectedIndex].text,
        estado: document.getElementById("addCheckEstado").checked
          ? document.getElementById("addEstado").value
          : "pendiente",
        cuotaMensual: document.getElementById("addCuotaMensual").value
          ? Number.parseFloat(document.getElementById("addCuotaMensual").value.replace(/,/g, ""))
          : null,
        esRecurrente: document.getElementById("addCheckRecurrente").checked,
        frecuencia: document.getElementById("addFrecuencia").value,
        prioridad: document.getElementById("addCheckPrioridad").checked
          ? document.getElementById("addPrioridad").value
          : "media",
      }

      // Validaciones adicionales
      if (datos.cuotaMensual && datos.cuotaMensual > datos.montoTotal) {
        alert("La cuota mensual no puede ser mayor al monto total de la deuda.")
        return
      }

      // Agregar la nueva deuda al array
      deudas.push(datos)

      // Recargar la vista de deudas y gráficas
      cargarDeudas()
      cargarGraficas()

      // Mostrar mensaje de confirmación
      const diasRestantes = calcularDiasVencimiento(datos.fechaVencimiento)
      let mensaje = `Deuda agregada exitosamente.\n`
      mensaje += `Monto: $${datos.montoTotal.toLocaleString()}\n`
      mensaje += `Acreedor: ${datos.acreedor}\n`

      if (diasRestantes > 0) {
        mensaje += `Días hasta vencimiento: ${diasRestantes}`
      } else if (diasRestantes === 0) {
        mensaje += `¡ATENCIÓN! La deuda vence hoy.`
      } else {
        mensaje += `¡ATENCIÓN! La deuda está vencida por ${Math.abs(diasRestantes)} días.`
      }

      alert(mensaje)
      cerrarModalAgregar()
    })
  }

  // Función para formatear números mientras se escriben
  const montoInput = document.getElementById("addMonto")
  const cuotaInput = document.getElementById("addCuotaMensual")
  const fechaInput = document.getElementById("addFechaVencimiento")

  if (montoInput) {
    montoInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/[^\d]/g, "")
      if (value) {
        e.target.value = Number.parseInt(value).toLocaleString()
      }
    })
  }

  if (cuotaInput) {
    cuotaInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/[^\d]/g, "")
      if (value) {
        e.target.value = Number.parseInt(value).toLocaleString()
      }
    })
  }

  // Establecer fecha mínima como hoy
  if (fechaInput) {
    const hoy = new Date().toISOString().split("T")[0]
    fechaInput.setAttribute("min", hoy)
  }
})

// ========== FUNCIONES AUXILIARES ==========

function cargarDeudas() {
  const container = document.getElementById("deudasContainer")
  if (!container) return

  container.innerHTML = deudas
    .map(
      (d) => `
        <div class="deuda-card">
            <div class="deuda-header">
                <div class="deuda-titulo">${d.nombre}</div>
                <div class="estado-badge ${d.estado}">${d.estado.charAt(0).toUpperCase() + d.estado.slice(1).replace("_", " ")}</div>
            </div>
            <div class="deuda-info">
                <div class="info-item"><span class="info-label">Total:</span><span class="info-value">$${d.montoTotal.toLocaleString()}</span></div>
                <div class="info-item"><span class="info-label">Pagado:</span><span class="info-value">$${d.montoPagado.toLocaleString()}</span></div>
                <div class="info-item"><span class="info-label">Restante:</span><span class="info-value">$${(d.montoTotal - d.montoPagado).toLocaleString()}</span></div>
            </div>
            <div class="deuda-detalles">
                <div class="detalle-column">
                    <div class="detalle-item"><span class="detalle-label">Acreedor:</span><span class="detalle-value">${d.acreedor}</span></div>
                    <div class="detalle-item"><span class="detalle-label">Inicio:</span><span class="detalle-value">${formatFecha(d.fechaInicio)}</span></div>
                </div>
                <div class="detalle-column">
                    <div class="detalle-item"><span class="detalle-label">Interés:</span><span class="detalle-value">${d.tasaInteres}%</span></div>
                    <div class="detalle-item"><span class="detalle-label">Vencimiento:</span><span class="detalle-value">${formatFecha(d.fechaVencimiento)}</span></div>
                </div>
            </div>
            <div class="deuda-acciones">
                <button class="btn-accion btn-registrar" onclick="abrirPago(${d.id})">Registrar Pago</button>
                <button class="btn-accion btn-editar" onclick="abrirEditar(${d.id})">Editar</button>
                <button class="btn-accion btn-eliminar" onclick="abrirEliminar(${d.id})">Eliminar</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function abrirModal(id) {
  const modal = document.getElementById(id)
  if (modal) {
    modal.style.display = "flex"
    document.querySelectorAll(".validation-message").forEach((v) => (v.style.display = "none"))
  }
}

function cerrarModal(id) {
  const modal = document.getElementById(id)
  if (modal) {
    modal.style.display = "none"
    const form = modal.querySelector("form")
    if (form) form.reset()
  }
}

function abrirPago(id) {
  editandoId = id
  const fechaPagoInput = document.getElementById("fechaPago")
  if (fechaPagoInput) {
    fechaPagoInput.value = new Date().toISOString().split("T")[0]
  }
  abrirModal("modalRegistrarPago")
}

function abrirEditar(id) {
  const d = deudas.find((deuda) => deuda.id === id)
  if (!d) return

  editandoId = id

  document.getElementById("editNombreAcreedor").value = d.acreedor
  document.getElementById("editMontoDeuda").value = d.montoTotal
  document.getElementById("editFechaInicio").value = d.fechaInicio
  document.getElementById("editFechaVencimiento").value = d.fechaVencimiento
  document.getElementById("editMontoPagado").value = d.montoPagado
  document.getElementById("editTasaInteres").value = d.tasaInteres
  document.getElementById("editDescripcion").value = d.descripcion
  document.getElementById("editEstadoDeuda").value = d.estado

  abrirModal("modalEditarDeuda")
}

function abrirEliminar(id) {
  editandoId = id
  abrirModal("modalEliminar")
}

function confirmarEliminacion() {
  deudas = deudas.filter((d) => d.id !== editandoId)
  cargarDeudas()
  cargarGraficas() // Actualizar gráficas
  cerrarModal("modalEliminar")
}

function validarFormulario(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  // Validar inputs de texto y números
  const inputs = form.querySelectorAll("input[required]")
  for (const input of inputs) {
    if (!input.value || input.value.trim() === "") {
      return false
    }
  }

  // Validar selects
  const selects = form.querySelectorAll("select[required]")
  for (const select of selects) {
    if (!select.value || select.value === "") {
      return false
    }
  }

  // Validar textareas
  const textareas = form.querySelectorAll("textarea[required]")
  for (const textarea of textareas) {
    if (!textarea.value || textarea.value.trim() === "") {
      return false
    }
  }

  return true
}

function mostrarError(id) {
  const el = document.getElementById(id)
  if (el) {
    el.style.display = "block"
    setTimeout(() => (el.style.display = "none"), 3000)
  }
}

function formatFecha(fecha) {
  const [a, m, d] = fecha.split("-")
  return `${d}/${m}/${a}`
}

// ========== FUNCIONES PARA EL FORMULARIO DE AGREGAR DEUDA ==========

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
function cerrarModalAgregar() {
  document.getElementById("modalAgregar").style.display = "none"
  limpiarFormulario()
  volverAlPasoAnterior()
}

// Función para limpiar el formulario
function limpiarFormulario() {
  const formAgregar = document.getElementById("formAgregar")
  if (formAgregar) {
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
}

function volverAlPasoAnterior() {
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  if (step1 && step2) {
    step2.classList.add("hidden")
    step1.classList.remove("hidden")
  }
}

// Permite cerrar el modal con la tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modalAgregar = document.getElementById("modalAgregar")
    if (modalAgregar && modalAgregar.style.display === "flex") {
      cerrarModalAgregar()
    }
  }
})

// Función global para forzar carga de gráficas (para debugging)
window.forzarGraficas = () => {
  console.log("Forzando carga de gráficas...", deudas)
  cargarGraficas()
}

// Exponer la función cargarGraficas globalmente
window.cargarGraficas = cargarGraficas
