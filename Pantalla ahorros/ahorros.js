// Variables globales
const modal = document.getElementById('modalEdicion');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextStepBtn = document.querySelector('.next-step-btn');
const prevStepBtn = document.querySelector('.prev-step-btn');
const formEditar = document.getElementById('formEditar');
const listaAhorros = document.getElementById('listaAhorros');

let indiceEditando = null;

// Funciones utilitarias
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

// Mostrar tarjetas
function mostrarAhorros() {
  const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
  listaAhorros.innerHTML = '';

  ahorros.forEach((ahorro, idx) => {
    const porcentaje = ahorro.objetivo > 0
      ? Math.round((ahorro.monto / ahorro.objetivo) * 100)
      : 0;

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-ahorro');

    tarjeta.innerHTML = `
      <div class="ahorro-info">
        <h4>${ahorro.titulo}</h4>
        <p>Actual: <strong>$${Number(ahorro.monto).toLocaleString()}</strong></p>
        <p>Inicio: ${formatearFecha(ahorro.fechaInicio)}</p>
        <div class="acciones-ahorro">
          <button class="btn-azul" onclick="actualizarAhorro(${idx})">Actualizar</button>
          <button class="btn-verde" onclick="editarAhorro(${idx})">Editar</button>
          <button class="btn-rojo" onclick="eliminarAhorro(${idx})">Eliminar</button>
        </div>
      </div>
      <div class="ahorro-meta">
        <h5>${capitalizar(ahorro.categoria)}</h5>
        <p>${porcentaje}% completado</p>
        <p>Objetivo: <strong>$${Number(ahorro.objetivo).toLocaleString()}</strong></p>
        <p>Objetivo: ${formatearFecha(ahorro.fechaObjetivo)}</p>
      </div>
    `;

    listaAhorros.appendChild(tarjeta);
  });
}

// Modal
function mostrarModal() {
  modal.style.display = 'block';
  step1.classList.remove('hidden');
  step2.classList.add('hidden');
  limpiarFormulario();
  indiceEditando = null;
}

function cerrarModal() {
  modal.style.display = 'none';
  limpiarFormulario();
}

function limpiarFormulario() {
  formEditar.reset();
  document.getElementById('editCategoria').value = 'viajes';
  document.getElementById('editTitulo').value = '';
}

// Navegación pasos
nextStepBtn?.addEventListener('click', () => {
  step1.classList.add('hidden');
  step2.classList.remove('hidden');
});

prevStepBtn?.addEventListener('click', () => {
  step2.classList.add('hidden');
  step1.classList.remove('hidden');
});

// Guardar ahorro
formEditar.addEventListener('submit', e => {
  e.preventDefault();

  const nuevo = {
    categoria: document.getElementById('editCategoria').value,
    titulo: document.getElementById('editTitulo').value,
    monto: parseFloat(document.getElementById('editMonto').value),
    objetivo: parseFloat(document.getElementById('editObjetivo').value),
    fechaInicio: document.getElementById('editFechaInicio').value,
    fechaObjetivo: document.getElementById('editFechaObjetivo').value,
    descripcion: document.getElementById('editDescripcion').value
  };

  let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];

  if (indiceEditando !== null) {
    ahorros[indiceEditando] = nuevo;
  } else {
    ahorros.push(nuevo);
  }

  localStorage.setItem('ahorros', JSON.stringify(ahorros));
  cerrarModal();
  mostrarAhorros();
});

// Editar
function editarAhorro(idx) {
  const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
  const ahorro = ahorros[idx];

  document.getElementById('editCategoria').value = ahorro.categoria;
  document.getElementById('editTitulo').value = ahorro.titulo;
  document.getElementById('editMonto').value = ahorro.monto;
  document.getElementById('editObjetivo').value = ahorro.objetivo;
  document.getElementById('editFechaInicio').value = ahorro.fechaInicio;
  document.getElementById('editFechaObjetivo').value = ahorro.fechaObjetivo;
  document.getElementById('editDescripcion').value = ahorro.descripcion;

  indiceEditando = idx;
  mostrarModal();
}

// Eliminar
function eliminarAhorro(idx) {
  const confirmar = confirm('¿Eliminar este ahorro?');
  if (confirmar) {
    let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
    ahorros.splice(idx, 1);
    localStorage.setItem('ahorros', JSON.stringify(ahorros));
    mostrarAhorros();
  }
}

// Actualizar (solo recalcula el porcentaje, sin abrir modal)
function actualizarAhorro(idx) {
  const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
  const ahorro = ahorros[idx];
  alert(`Ahorro "${ahorro.titulo}" actualizado al ${Math.round((ahorro.monto / ahorro.objetivo) * 100)}%`);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  mostrarAhorros();
});

document.addEventListener('DOMContentLoaded', () => {
  const btnMenu = document.getElementById('btnMenu');
  const menuLateral = document.getElementById('menuLateral');

  btnMenu?.addEventListener('click', () => {
    menuLateral.classList.toggle('mostrar');
  });

  mostrarAhorros(); // ya estaba en tu código
});
