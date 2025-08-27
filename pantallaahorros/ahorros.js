// Renderiza las tarjetas de ahorros guardados en localStorage
document.addEventListener('DOMContentLoaded', function () {
	mostrarTarjetasAhorros();
});

function mostrarTarjetasAhorros() {
	const contenedor = document.getElementById('contenedorTarjetasAhorros');
	if (!contenedor) return;
	contenedor.innerHTML = '';
	const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
	if (ahorros.length === 0) {
		contenedor.innerHTML = '<div class="text-center text-muted">No tienes ahorros registrados aún.</div>';
		return;
	}
			ahorros.forEach((ahorro, idx) => {
				const tarjeta = document.createElement('div');
				tarjeta.className = 'col-12 col-md-6 col-lg-4';
						tarjeta.innerHTML = `
							<div class="card shadow-lg border-0 mb-4 rounded-4" style="background: linear-gradient(135deg, #f8fffe 0%, #eaf8ed 100%); border-radius: 2rem;">
								<div class="card-body rounded-4 p-4 d-flex flex-column justify-content-between" style="border-radius: 2rem; min-height: 320px;">
									<div>
										<div class="d-flex align-items-center mb-3">
											<div class="rounded-circle d-flex align-items-center justify-content-center me-3" style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); width: 54px; height: 54px;">
												<i class="bi bi-piggy-bank-fill text-white" style="font-size: 2rem;"></i>
											</div>
											<h5 class="card-title text-success mb-0" style="font-weight:700; font-size:1.3rem;">${ahorro.categoria ? formateaCategoria(ahorro.categoria) : 'Ahorro'}</h5>
										</div>
										<p class="card-text mb-1"><strong>Monto:</strong> <span style="color:#27ae60; font-weight:600;">$${formateaMonto(ahorro.monto)}</span></p>
										<p class="card-text mb-1"><strong>Fecha:</strong> <span style="color:#636e72;">${ahorro.fecha || '-'}</span></p>
										<p class="card-text mb-1"><strong>Método:</strong> <span style="color:#2ecc71;">${formateaMetodo(ahorro.metodo)}</span></p>
										<p class="card-text"><strong>Descripción:</strong> <span style="color:#2c3e50;">${ahorro.descripcion ? ahorro.descripcion : 'Sin descripción'}</span></p>
									</div>
									<div class="d-flex justify-content-end gap-2 mt-4">
										<button class="btn btn-outline-primary btn-sm rounded-pill px-3" title="Editar" onclick="editarAhorro(${idx})"><i class="bi bi-pencil"></i> Editar</button>
										<button class="btn btn-outline-danger btn-sm rounded-pill px-3" title="Eliminar" onclick="eliminarAhorro(${idx})"><i class="bi bi-trash"></i> Eliminar</button>
									</div>
								</div>
							</div>
						`;
				contenedor.appendChild(tarjeta);
			});
// Elimina un ahorro por índice y actualiza la vista
function eliminarAhorro(idx) {
	if (!confirm('¿Seguro que deseas eliminar este ahorro?')) return;
	let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
	ahorros.splice(idx, 1);
	localStorage.setItem('ahorros', JSON.stringify(ahorros));
	mostrarTarjetasAhorros();
}

// Edita un ahorro por índice (abre un prompt simple, puedes mejorar con modal)
function editarAhorro(idx) {
	let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
	const ahorro = ahorros[idx];
	if (!ahorro) return;
	// Prompt para editar monto y descripción (puedes expandir a más campos)
	const nuevoMonto = prompt('Editar monto:', ahorro.monto);
	if (nuevoMonto === null) return;
	const nuevaDescripcion = prompt('Editar descripción:', ahorro.descripcion);
	if (nuevaDescripcion === null) return;
	ahorro.monto = nuevoMonto;
	ahorro.descripcion = nuevaDescripcion;
	ahorros[idx] = ahorro;
	localStorage.setItem('ahorros', JSON.stringify(ahorros));
	mostrarTarjetasAhorros();
}
}

function formateaCategoria(cat) {
	switch(cat) {
		case 'meta': return 'Meta específica';
		case 'emergencia': return 'Fondo de emergencia';
		case 'inversion': return 'Ahorro para inversión';
		case 'educacion': return 'Educación';
		case 'viaje': return 'Viaje';
		case 'otro': return 'Otro';
		default: return cat;
	}
}

function formateaMetodo(metodo) {
	switch(metodo) {
		case 'cuenta_ahorros': return 'Cuenta de ahorros';
		case 'banco': return 'Banco';
		case 'alcancia': return 'Alcancía';
		case 'efectivo': return 'Efectivo';
		case 'otro': return 'Otro';
		default: return metodo || '-';
	}
}

function formateaMonto(monto) {
	if (!monto) return '0';
	return Number(monto).toLocaleString('es-CO');
}
