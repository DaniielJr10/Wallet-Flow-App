function limpiarFormulario() {
  document.getElementById("crearTitulo").value = "";
  document.getElementById("crearDescripcion").value = "";
  document.getElementById("crearFechaCreacion").value = "";
  document.getElementById("crearFechaLimite").value = "";
  document.getElementById("crearEstado").value = "";
}

function volverAtras() {
  window.history.back();
}

function formatearFecha(fechaStr) {
  const partes = fechaStr.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

document.getElementById("formCrear").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const titulo = document.getElementById("crearTitulo").value;
  const descripcion = document.getElementById("crearDescripcion").value;
  const fechaCreacion = document.getElementById("crearFechaCreacion").value;
  const fechaLimite = document.getElementById("crearFechaLimite").value;
  const estado = document.getElementById("crearEstado").value;

  // Almacenar el objetivo en localStorage
  const nuevoObjetivo = {
    titulo: titulo,
    descripcion: descripcion,
    fechaCreacion: formatearFecha(fechaCreacion),
    fechaLimite: formatearFecha(fechaLimite),
    estado: estado,
    progreso: "0"
  };

  // Guardar en localStorage
  let objetivos = JSON.parse(localStorage.getItem('objetivos') || '[]');
  objetivos.push(nuevoObjetivo);
  localStorage.setItem('objetivos', JSON.stringify(objetivos));

  // Redireccionar a la pantalla de objetivos
  window.location.href = "../../pantallas/PantallaObjetivos/PantallaObjetivo.html";
});