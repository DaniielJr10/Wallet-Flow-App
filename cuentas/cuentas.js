document.addEventListener('DOMContentLoaded', function () {
    const contenedorCuentas = document.getElementById('contenedorCuentas');
  
    // Cargar cuentas desde localStorage
    const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
  
    // Verificar si hay cuentas
    if (cuentas.length === 0) {
      contenedorCuentas.innerHTML = '<p class="text-center">No hay cuentas registradas.</p>';
      return;
    }
  
    // Renderizar las cuentas como tarjetas
    cuentas.forEach(cuenta => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'col-md-4 mb-3';
      tarjeta.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${cuenta.nombre}</h5>
            <p class="card-text">Tipo: ${cuenta.tipo}</p>
            <p class="card-text">Número: ${cuenta.numero}</p>
            <p class="card-text">Saldo Inicial: $${cuenta.saldoInicial.toFixed(2)}</p>
            ${cuenta.esPrincipal ? '<span class="badge bg-success">Principal</span>' : ''}
          </div>
        </div>
      `;
      contenedorCuentas.appendChild(tarjeta);
    });
  });