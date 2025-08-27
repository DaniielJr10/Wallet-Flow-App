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
			<div class="card shadow-sm border-0 mb-3">
				<div class="card-body">
					<h5 class="card-title text-success"><i class="bi bi-piggy-bank-fill me-2"></i>${ahorro.categoria ? formateaCategoria(ahorro.categoria) : 'Ahorro'}</h5>
					<p class="card-text mb-1"><strong>Monto:</strong> $${formateaMonto(ahorro.monto)}</p>
					<p class="card-text mb-1"><strong>Fecha:</strong> ${ahorro.fecha || '-'}</p>
					<p class="card-text mb-1"><strong>Método:</strong> ${formateaMetodo(ahorro.metodo)}</p>
					<p class="card-text"><strong>Descripción:</strong> ${ahorro.descripcion ? ahorro.descripcion : 'Sin descripción'}</p>
				</div>
			</div>
		`;
		contenedor.appendChild(tarjeta);
	});
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
