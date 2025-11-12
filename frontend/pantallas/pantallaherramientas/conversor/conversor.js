// Conversor de monedas simple usando tasas fijas de ejemplo
// Puedes reemplazar las tasas por una API real si lo deseas

document.addEventListener('DOMContentLoaded', function () {
  const tasas = {
    USD: { USD: 1, EUR: 0.92, MXN: 17.1, COP: 4000, PEN: 3.7, ARS: 900 },
    EUR: { USD: 1.09, EUR: 1, MXN: 18.6, COP: 4350, PEN: 4, ARS: 980 },
    MXN: { USD: 0.058, EUR: 0.054, MXN: 1, COP: 234, PEN: 0.21, ARS: 52 },
    COP: { USD: 0.00025, EUR: 0.00023, MXN: 0.0043, COP: 1, PEN: 0.0009, ARS: 0.22 },
    PEN: { USD: 0.27, EUR: 0.25, MXN: 4.8, COP: 1100, PEN: 1, ARS: 240 },
    ARS: { USD: 0.0011, EUR: 0.001, MXN: 0.019, COP: 4.5, PEN: 0.0042, ARS: 1 }
  };

  const cantidad = document.getElementById('cantidad');
  const monedaOrigen = document.getElementById('monedaOrigen');
  const monedaDestino = document.getElementById('monedaDestino');
  const convertirBtn = document.getElementById('convertirBtn');
  const resultado = document.getElementById('resultado');

  convertirBtn.addEventListener('click', function () {
    const valor = parseFloat(cantidad.value);
    const origen = monedaOrigen.value;
    const destino = monedaDestino.value;

    if (isNaN(valor) || valor <= 0) {
      resultado.textContent = 'Por favor ingresa una cantidad válida.';
      resultado.classList.remove('d-none', 'alert-info', 'error');
      resultado.classList.add('error');
      return;
    }

    const tasa = tasas[origen][destino];
    const convertido = valor * tasa;
    resultado.textContent = `${valor} ${origen} = ${convertido.toLocaleString(undefined, {maximumFractionDigits: 2})} ${destino}`;
    resultado.classList.remove('d-none', 'alert-danger', 'error');
    resultado.classList.add('alert-info');
  });
});
