// Renderiza las tarjetas de ahorros guardados en localStorage
document.addEventListener('DOMContentLoaded', function () {
	mostrarTarjetasAhorros();
	configurarCerrarSesion();
});

// Configurar el botón de cerrar sesión
function configurarCerrarSesion() {
	const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
	if (cerrarSesionBtn) {
		cerrarSesionBtn.addEventListener('click', function(e) {
			e.preventDefault();
			const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
			if (confirmar) {
				// Limpiar datos de usuario
				localStorage.removeItem('walletflow_user_data');
				localStorage.removeItem('walletflow_remembered_user');
				
				// Cerrar sesión en Firebase si está disponible
				if (window.firebaseAuth) {
					window.firebaseAuth.cerrarSesion();
				}
				
				// Redirigir al login
				window.location.href = '../../login/inicio de sesion/inicio.html';
			}
		});
	}
}

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
	}
	// Elimina un ahorro por índice y actualiza la vista
function eliminarAhorro(idx) {
	if (!confirm('¿Seguro que deseas eliminar este ahorro?')) return;
	let ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
	ahorros.splice(idx, 1);
	localStorage.setItem('ahorros', JSON.stringify(ahorros));
	mostrarTarjetasAhorros();
}

// Edita un ahorro por índice usando el formulario completo en un modal
function editarAhorro(idx) {
	const ahorros = JSON.parse(localStorage.getItem('ahorros')) || [];
	const ahorro = ahorros[idx];
	if (!ahorro) return;

	// Asegurar contenedor y estilos del modal de formulario
	asegurarContenedorYEstilosAhorro();

	// Cargar HTML y JS del formulario y abrir en modo edición
	fetch("../../formularios/formulario ahorros/forahorros.html")
		.then(r => r.text())
		.then(html => {
			const cont = document.getElementById('contenedorModalAhorro');
			cont.innerHTML = html;

			cargarScriptFormularioAhorro(() => {
				if (typeof window.initFormularioAhorro === 'function') {
					window.initFormularioAhorro({
						modo: 'editar',
						datos: ahorro,
						indice: idx,
						onSave: mostrarTarjetasAhorros
					});
				} else {
					console.error('initFormularioAhorro no encontrado');
				}
			});
		});
}

// Asegurar disponibilidad global para manejadores inline
if (typeof window !== 'undefined') {
  window.eliminarAhorro = eliminarAhorro;
  window.editarAhorro = editarAhorro;
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
	if (monto === undefined || monto === null || monto === '') return '0,00';
	const num = Number(monto);
	if (isNaN(num)) return String(monto);
	return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

// Utilidades para cargar formulario de ahorro como modal
function asegurarContenedorYEstilosAhorro() {
	let cont = document.getElementById('contenedorModalAhorro');
	if (!cont) {
		cont = document.createElement('div');
		cont.id = 'contenedorModalAhorro';
		document.body.appendChild(cont);
	}
	// CSS del formulario (si no está ya cargado)
	if (!document.getElementById('ahorros-form-css')) {
		const link = document.createElement('link');
		link.id = 'ahorros-form-css';
		link.rel = 'stylesheet';
		link.href = '../../formularios/formulario ahorros/forahorros.css';
		document.head.appendChild(link);
	}
}

function cargarScriptFormularioAhorro(cb) {
	// Evitar múltiples inclusiones del script
	if (window.__forahorros_script_cargado) {
		cb && cb();
		return;
	}
	const script = document.createElement('script');
	script.src = '../../formularios/formulario ahorros/forahorros.js';
	script.onload = function(){
		window.__forahorros_script_cargado = true;
		cb && cb();
	};
	document.body.appendChild(script);
}
