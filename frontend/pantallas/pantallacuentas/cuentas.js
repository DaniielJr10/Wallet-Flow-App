// Cuentas Firestore-only
let cuentasCache = [];

async function waitForDB(maxMs=5000){
  const start=Date.now();
  while((!window.walletDB) && Date.now()-start < maxMs){
    await new Promise(r=>setTimeout(r,100));
  }
  return !!window.walletDB;
}

async function cargarCuentasDesdeFirestore(){
  try {
    const ok = await waitForDB();
    if(!ok || !window.walletDB) throw new Error('DB no disponible');
    await window.walletDB.init();
    const auth = (typeof firebase!=='undefined' && firebase.auth)? firebase.auth(): null;
    if(auth && !auth.currentUser) await new Promise(r=>auth.onAuthStateChanged(()=>r()));
    if(!auth || !auth.currentUser){ console.warn('Cuentas: usuario no autenticado aún'); return; }
    cuentasCache = await window.walletDB.listAccounts();
  } catch(e){ console.error('Error cargando cuentas Firestore:', e); cuentasCache=[]; }
}

function renderizarCuentas(){
  const contenedorCuentas = document.getElementById('contenedorCuentas');
  if(!contenedorCuentas) return;
  contenedorCuentas.innerHTML='';
  cuentasCache.forEach((cuenta)=>{
    const tarjeta=document.createElement('div');
    tarjeta.className='col-md-4 mb-4';
    tarjeta.innerHTML=`<div class="account-card">
      <div class="card-header-custom">
        <div class="account-icon"><i class="bi ${getAccountIcon(cuenta.tipo)}"></i></div>
        <div class="account-status">${cuenta.esPrincipal? '<span class="badge-principal"><i class="bi bi-star-fill"></i> Principal</span>':''}</div>
      </div>
      <div class="card-content">
        <h3 class="account-name">${cuenta.nombre||'-'}</h3>
        <div class="account-type">${cuenta.tipo||'-'}</div>
        <div class="account-details">
          <div class="detail-item"><span class="detail-label"><i class="bi bi-credit-card-2-front"></i> Número de cuenta</span><span class="detail-value">${cuenta.numero||'-'}</span></div>
          <div class="detail-item balance-item"><span class="detail-label"><i class="bi bi-cash-stack"></i> Saldo disponible</span><span class="detail-value balance-value">$${formatCurrency(cuenta.saldo||0)}</span></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-action btn-edit" data-id="${cuenta.id}"><i class="bi bi-pencil-square"></i><span>Editar</span></button>
        <button class="btn-action btn-delete" data-id="${cuenta.id}"><i class="bi bi-trash"></i><span>Eliminar</span></button>
      </div>
    </div>`;
    contenedorCuentas.appendChild(tarjeta);
  });
  document.querySelectorAll('.btn-delete').forEach(btn=>btn.addEventListener('click',()=>eliminarCuenta(btn.getAttribute('data-id'))));
  document.querySelectorAll('.btn-edit').forEach(btn=>btn.addEventListener('click',()=>editarCuenta(btn.getAttribute('data-id'))));
}

// Función auxiliar para obtener el icono según el tipo de cuenta
function getAccountIcon(tipo) {
  const iconMap = {
    'Ahorros': 'bi-piggy-bank-fill',
    'Corriente': 'bi-bank2',
    'Credito': 'bi-credit-card-fill',
    'Débito': 'bi-credit-card-2-front-fill',
    'Efectivo': 'bi-cash-stack',
    'Digital': 'bi-phone-fill'
  };
  return iconMap[tipo] || 'bi-bank';
}

// Función auxiliar para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Función para eliminar una cuenta con confirmación
async function eliminarCuenta(id){
  const cuenta = cuentasCache.find(c=>c.id===id);
  if(!cuenta) return;
  const confirmacion = confirm(`¿Eliminar cuenta "${cuenta.nombre}"?`);
  if(!confirmacion) return;
  try {
    await waitForDB();
    await window.walletDB.init();
    await window.walletDB.deleteAccount(id);
    await cargarCuentasDesdeFirestore();
    renderizarCuentas();
    if(typeof mostrarNotificacion==='function') mostrarNotificacion('Cuenta eliminada','success');
  } catch(e){ console.error('Error eliminando cuenta:', e); if(typeof mostrarNotificacion==='function') mostrarNotificacion('Error al eliminar','danger'); }
}

// Función para editar una cuenta
function editarCuenta(id){
  const cuenta = cuentasCache.find(c=>c.id===id);
  if(!cuenta) return;
  const modalEl=document.getElementById('modalAgregarCuenta');
  if(!modalEl) return;
  const modal=new bootstrap.Modal(modalEl);
  modal.show();
  document.getElementById('nombreCuenta').value = cuenta.nombre||'';
  document.getElementById('tipoCuenta').value = cuenta.tipo||'';
  document.getElementById('numeroCuenta').value = cuenta.numero||'';
  document.getElementById('saldoInicial').value = cuenta.saldo||0;
  document.getElementById('cuentaPrincipal').checked = !!cuenta.esPrincipal;
  document.getElementById('modalEditarCuentaLabel').textContent='Editar Cuenta';
  let hiddenId=document.getElementById('hiddenAccountId');
  if(!hiddenId){ hiddenId=document.createElement('input'); hiddenId.type='hidden'; hiddenId.id='hiddenAccountId'; document.getElementById('formAgregarCuenta').appendChild(hiddenId); }
  hiddenId.value=id;
}

// Función para mostrar mensajes de error
function showFormError(message) {
  // Crear o actualizar mensaje de error
  let errorDiv = document.querySelector('.form-error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    document.querySelector('.modern-body').insertBefore(errorDiv, document.querySelector('.form-grid'));
  }
  
  errorDiv.innerHTML = `
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      ${message}
    </div>
  `;
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    if (errorDiv) errorDiv.remove();
  }, 3000);
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="alert alert-success d-flex align-items-center" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>
      ${message}
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Renderizar y preparar submit al cargar
document.addEventListener('DOMContentLoaded', async () => {
  window.renderizarCuentas = renderizarCuentas;
  await cargarCuentasDesdeFirestore();
  renderizarCuentas();
  const form=document.getElementById('formAgregarCuenta');
  if(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const tipoSeleccionado = document.getElementById('tipoCuenta').value;
      if(!tipoSeleccionado){ showFormError('Por favor selecciona un tipo de cuenta'); return; }
      try {
        await waitForDB();
        await window.walletDB.init();
        const payload={
          nombre: document.getElementById('nombreCuenta').value.trim(),
          tipo: tipoSeleccionado,
          numero: document.getElementById('numeroCuenta').value.trim(),
          saldo: parseFloat(document.getElementById('saldoInicial').value)||0,
          esPrincipal: document.getElementById('cuentaPrincipal').checked,
          moneda: 'COP'
        };
        const hiddenId=document.getElementById('hiddenAccountId');
        if(hiddenId && hiddenId.value){
          await window.walletDB.updateAccount(hiddenId.value, payload);
        } else {
          await window.walletDB.addAccount(payload);
        }
        await cargarCuentasDesdeFirestore();
        renderizarCuentas();
        form.reset();
        if(hiddenId) hiddenId.remove();
        const modalEl=document.getElementById('modalAgregarCuenta');
        if(modalEl){try{bootstrap.Modal.getInstance(modalEl)?.hide();}catch(_){modalEl.classList.add('d-none');}}
        if(typeof mostrarNotificacion==='function') mostrarNotificacion('Cuenta guardada','success'); else showSuccessMessage('¡Cuenta guardada exitosamente!');
        document.getElementById('modalEditarCuentaLabel').textContent='Gestionar Cuenta';
      } catch(err){ console.error('Error guardando cuenta:', err); if(typeof mostrarNotificacion==='function') mostrarNotificacion('Error al guardar','danger'); else showFormError('Error al guardar cuenta'); }
    });
  }
});

// Configurar botón de agregar cuenta (tanto header como empty-state) y crear nueva cuenta
document.addEventListener('DOMContentLoaded', function () {
  const btnHeader = document.getElementById('btnAgregarCuentaPage')
  const btnEmpty = document.getElementById('btnAgregarCuentaPageEmpty')

  function openAddCuentaModal() {
    // Goal: reuse the existing page Bootstrap modal (#modalAgregarCuenta) by
    // fetching the canonical form HTML (forcuentas.html), injecting its
    // form markup into the page's `form#formAgregarCuenta`, loading the
    // form script if needed, initializing it and then opening the modal.
    const formHtmlPath = '../../formularios/formulario cuentas/forcuentas.html'
    const formJsPath = '../../formularios/formulario cuentas/forcuentas.js'

    fetch(encodeURI(formHtmlPath))
      .then((resp) => {
        if (!resp.ok) throw new Error('HTTP ' + resp.status)
        return resp.text()
      })
      .then((html) => {
        // Inject the canonical form HTML into the contenedorModalCuenta so we
        // use exactly the form markup you keep in /formularios.
        const contenedor = document.getElementById('contenedorModalCuenta')
        if (!contenedor) throw new Error('ContenedorModalCuenta no encontrado')

        // Remove any existing injected modal with the same id to avoid duplicates
        const existingInjected = contenedor.querySelector('#modalAgregarCuenta')
        if (existingInjected) existingInjected.remove()

        // Also remove page-local modal with same id if it exists (we will use the external form)
        const pageModal = document.getElementById('modalAgregarCuenta')
        if (pageModal && pageModal.parentElement !== contenedor) {
          try { pageModal.remove(); } catch (e) { /* ignore */ }
        }

        contenedor.innerHTML = html

        // Ensure the form script is loaded only once
        const encodedJs = encodeURI(formJsPath)
        let scriptAlready = Array.from(document.scripts).some(s => s.src && s.src.includes(encodedJs))
        return new Promise((resolve, reject) => {
          if (scriptAlready) return resolve()
          const script = document.createElement('script')
          script.src = encodedJs
          script.onload = () => resolve()
          script.onerror = (e) => reject(e)
          document.body.appendChild(script)
        })
      })
      .then(() => {
        // Initialize the form script and display the injected overlay/modal
        if (typeof initFormularioCuenta === 'function') {
          try { initFormularioCuenta(); } catch (e) { console.error('Error initFormularioCuenta:', e) }
        } else {
          console.warn('initFormularioCuenta no encontrada; el script pudo no haberse cargado correctamente')
        }

        // Show the injected modal overlay (forcuentas.html uses #modalAgregarCuenta .d-none)
        const injectedModal = document.getElementById('modalAgregarCuenta')
        if (injectedModal) {
          injectedModal.classList.remove('d-none')
        }
      })
      .catch((err) => {
        console.error('Error cargando formulario de cuenta:', err)
        alert('No se pudo cargar el formulario de cuenta')
      })
  }

  if (btnHeader) btnHeader.addEventListener('click', function(e){ e.preventDefault(); openAddCuentaModal(); })
  if (btnEmpty) btnEmpty.addEventListener('click', function(e){ e.preventDefault(); openAddCuentaModal(); })
})

// Funcionalidad para cerrar sesión con confirmación
document.addEventListener('DOMContentLoaded', function () {
  const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
  
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Mostrar confirmación con alert
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmar) {
        // Limpiar datos de usuario
        localStorage.removeItem('walletflow_user_data');
        localStorage.removeItem('walletflow_remembered_user');
        
        // Cerrar sesión en Firebase si está disponible
        if (window.firebaseAuth) {
          window.firebaseAuth.cerrarSesion();
        }
        
        // Redirigir al inicio de sesión
        window.location.href = '../../login/inicio de sesion/inicio.html';
      }
    });
  }
});

// Escuchar evento personalizado para refrescar la lista cuando un formulario externo guarde una cuenta
window.addEventListener('cuenta:guardada', async ()=>{
  await cargarCuentasDesdeFirestore();
  renderizarCuentas();
});
