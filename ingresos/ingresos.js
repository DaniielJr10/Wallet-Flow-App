//Mostar los ingresos
document.addEventListener('DOMContentLoaded', function () {
  renderIngresos();

  function renderIngresos() {
    const tabla = document.getElementById('tablaIngresos').querySelector('tbody');
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    tabla.innerHTML = '';
    ingresos.forEach((ingreso, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${ingreso.categoria}</td>
        <td>${ingreso.metodo}</td>
        <td>$${parseFloat(ingreso.monto).toFixed(2)}</td>
        <td>${ingreso.fecha}</td>
        <td>${ingreso.descripcion || ''}</td>
        <td>${ingreso.esRecurrente ? 'Sí' : 'No'}</td>
        <td>${ingreso.frecuencia || '-'}</td>
        <td>${ingreso.cuenta || '-'}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar" data-index="${index}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    // Botón eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        ingresos.splice(idx, 1);
        localStorage.setItem('ingresos', JSON.stringify(ingresos));
        renderIngresos();
      });
    });

    // Botón editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        editarIngreso(idx);
      });
    });
  }

  // Formulario modal simple para editar todos los campos
  function editarIngreso(idx) {
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    const ingreso = ingresos[idx];

    // Crea el formulario HTML
    const formHtml = `
      <form id="formEditarIngreso" style="z-index:9999; background:#fff; padding:20px; border-radius:10px; max-width:400px; margin:auto;">
        <h5>Editar Ingreso</h5>
        <label>Categoría:<input class="form-control" name="categoria" value="${ingreso.categoria}" required></label>
        <label>Método:<input class="form-control" name="metodo" value="${ingreso.metodo}" required></label>
        <label>Monto:<input class="form-control" name="monto" type="number" min="0" step="0.01" value="${ingreso.monto}" required></label>
        <label>Fecha:<input class="form-control" name="fecha" type="date" value="${ingreso.fecha}" required></label>
        <label>Descripción:<input class="form-control" name="descripcion" value="${ingreso.descripcion || ''}"></label>
        <label>Recurrente:
          <select class="form-control" name="esRecurrente">
            <option value="true" ${ingreso.esRecurrente ? 'selected' : ''}>Sí</option>
            <option value="false" ${!ingreso.esRecurrente ? 'selected' : ''}>No</option>
          </select>
        </label>
        <label>Frecuencia:<input class="form-control" name="frecuencia" value="${ingreso.frecuencia || ''}"></label>
        <label>Cuenta:<input class="form-control" name="cuenta" value="${ingreso.cuenta || ''}"></label>
        <div class="mt-2">
          <button type="submit" class="btn btn-success btn-sm">Guardar</button>
          <button type="button" class="btn btn-secondary btn-sm" id="cancelarEditar">Cancelar</button>
        </div>
      </form>
      <div id="fondoModalEditar" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9998;"></div>
    `;

    // Crea el modal
    const modal = document.createElement('div');
    modal.id = 'modalEditarIngreso';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    modal.innerHTML = formHtml;
    document.body.appendChild(modal);

    // Evento cancelar
    document.getElementById('cancelarEditar').onclick = function () {
      document.body.removeChild(modal);
    };
    document.getElementById('fondoModalEditar').onclick = function () {
      document.body.removeChild(modal);
    };

    // Evento guardar
    document.getElementById('formEditarIngreso').onsubmit = function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      ingresos[idx] = {
        categoria: formData.get('categoria'),
        metodo: formData.get('metodo'),
        monto: formData.get('monto'),
        fecha: formData.get('fecha'),
        descripcion: formData.get('descripcion'),
        esRecurrente: formData.get('esRecurrente') === 'true',
        frecuencia: formData.get('frecuencia'),
        cuenta: formData.get('cuenta')
      };
      localStorage.setItem('ingresos', JSON.stringify(ingresos));
      document.body.removeChild(modal);
      renderIngresos();
    };
  }
});