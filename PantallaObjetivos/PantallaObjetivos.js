let objetivoEditando = null;

// Referencia al modal
const modal = document.getElementById("modalEdicion");

// Función para cerrar el modal
function cerrarModal() {
  modal.style.display = "none";
}

// Convierte de "dd/mm/yyyy" a "yyyy-mm-dd" (para el input de fecha)
function convertirFecha(fechaStr) {
  const partes = fechaStr.split("/");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// Convierte de "yyyy-mm-dd" a "dd/mm/yyyy" (para mostrar en la tarjeta)
function formatearFecha(fechaStr) {
  const partes = fechaStr.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function actualizarProgreso(btn) {
  const progreso = btn.closest('.info').querySelector('.progreso');
  let porcentaje = parseInt(progreso.textContent);
  if (porcentaje < 100) {
    porcentaje += 5;
    progreso.textContent = porcentaje + '% Completado';
  } else {
    alert('¡Objetivo ya completado!');
  }
}

function editarObjetivo(btn) {
  const info = btn.closest(".info");
  objetivoEditando = info; 


  const titulo = info.querySelector("h3").childNodes[0].textContent.trim();
  const descripcion = info.querySelector("p").textContent;
  const fechaCreacion = info.querySelectorAll("p")[1].querySelector("span").textContent;
  const fechaLimite = info.querySelectorAll("p")[2].querySelector("span").textContent;
  const estado = info.querySelector(".estado").textContent;

  document.getElementById("editarTitulo").value = titulo;
  document.getElementById("editarDescripcion").value = descripcion;
  document.getElementById("editarFechaCreacion").value = convertirFecha(fechaCreacion);
  document.getElementById("editarFechaLimite").value = convertirFecha(fechaLimite);
  document.getElementById("editarEstado").value = estado;

  modal.style.display = "flex";
}

function eliminarObjetivo(btn) {
  if (confirm('¿Estás seguro de eliminar este objetivo?')) {
    const objetivo = btn.closest('.objetivo');
    objetivo.remove();
  }
}

document.getElementById("formEditar").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que recargue la página

  if (!objetivoEditando) return;

  // Obtener nuevos valores del formulario
  const nuevoTitulo = document.getElementById("editarTitulo").value;
  const nuevaDescripcion = document.getElementById("editarDescripcion").value;
  const nuevaCreacion = document.getElementById("editarFechaCreacion").value;
  const nuevaLimite = document.getElementById("editarFechaLimite").value;
  const nuevoEstado = document.getElementById("editarEstado").value;

  // Actualizar el contenido de la tarjeta
  objetivoEditando.querySelector("h3").childNodes[0].textContent = nuevoTitulo + " ";
  objetivoEditando.querySelector(".estado").textContent = nuevoEstado;
  objetivoEditando.querySelector("p").textContent = nuevaDescripcion;
  objetivoEditando.querySelectorAll("p")[1].querySelector("span").textContent = formatearFecha(nuevaCreacion);
  objetivoEditando.querySelectorAll("p")[2].querySelector("span").textContent = formatearFecha(nuevaLimite);

  window.addEventListener("click", function (e) {
  if (e.target === modal) {
    cerrarModal();
  }
});
});