(function(){
  async function cargarCuentas(){
    const { setCuentasOriginales,setCuentasFiltradas }=window.cuentasState; let datos=[];
    try{
      // Prefer walletDB if it exposes listAccounts
      if(window.walletDB && typeof window.walletDB.listAccounts === 'function'){
        const authed=(typeof firebase!=='undefined' && firebase.auth && firebase.auth().currentUser);
        if(!authed) throw new Error('Inicia sesión para ver cuentas');
        datos = await window.walletDB.listAccounts();
      } else {
        // Fallback: try localStorage or empty array
        if(window.walletDB && typeof window.walletDB.listAccounts !== 'function') console.warn('walletDB.listAccounts no disponible, usando localStorage');
        datos = JSON.parse(localStorage.getItem('cuentas')||'[]');
      }
    }catch(e){
      console.error('Error cargando cuentas',e);
      try{ datos = JSON.parse(localStorage.getItem('cuentas')||'[]'); }catch(_){ datos = []; }
      // Avoid intrusive UI errors for transient DB issues; log instead
      console.warn('cargarCuentas warning:', e && e.message ? e.message : e);
    }
    setCuentasOriginales(datos); setCuentasFiltradas([...datos]); window.cuentasSummary.actualizarResumen(datos); window.cuentasGrid.render();
  }

  async function agregarCuenta(data){
    const pendingKey = 'pending_cuentas';
    try{
      if(window.cuentasService && window.walletDB && typeof window.walletDB.addAccount === 'function'){
        await window.walletDB.addAccount(data);
        await cargarCuentas();
        try{ window.cuentasMessages.mostrar('Cuenta agregada','success'); }catch(_){ }
        return;
      }
      // Encolar en caso de no disponer de walletDB.addAccount
      const q = JSON.parse(localStorage.getItem(pendingKey)||'[]');
      data.id = data.id || ('local_'+Date.now());
      q.push(data);
      localStorage.setItem(pendingKey, JSON.stringify(q));
      // Also persist to visible local list so UI shows it immediately
      const visible = JSON.parse(localStorage.getItem('cuentas')||'[]'); visible.push(data); localStorage.setItem('cuentas', JSON.stringify(visible));
      await cargarCuentas();
      try{ window.cuentasMessages.mostrar('Cuenta encolada (sin conexión)', 'warning'); }catch(_){ }
    }catch(e){ console.error('Error agregando cuenta', e); console.warn('agregarCuenta error:', e && e.message ? e.message : e); }
  }

  async function actualizarCuenta(id,data){ try{ if(!window.walletDB || typeof window.walletDB.updateAccount !== 'function') throw new Error('DB no disponible'); await window.walletDB.updateAccount(id,data); await cargarCuentas(); try{ window.cuentasMessages.mostrar('Cuenta actualizada','success'); }catch(_){ } } catch(e){ console.error(e); console.warn('actualizarCuenta error:', e && e.message ? e.message : e); } }

  async function eliminarCuenta(id){ try{ if(!window.walletDB || typeof window.walletDB.deleteAccount !== 'function') throw new Error('DB no disponible'); await window.walletDB.deleteAccount(id); await cargarCuentas(); try{ window.cuentasMessages.mostrar('Cuenta eliminada','success'); }catch(_){ } } catch(e){ console.error(e); console.warn('eliminarCuenta error:', e && e.message ? e.message : e); } }

  // Flush pending queue when DB becomes available
  async function flushPendingCuentas(){
    const key = 'pending_cuentas';
    try{
      if(!window.walletDB || typeof window.walletDB.addAccount !== 'function') return;
      const q = JSON.parse(localStorage.getItem(key)||'[]'); if(!q.length) return;
      for(const item of q){ try{ await window.walletDB.addAccount(item); }catch(err){ console.error('Error syncing pending cuenta', err); } }
      localStorage.removeItem(key);
      await cargarCuentas();
      try{ window.cuentasMessages.mostrar('Cola de cuentas sincronizada','success'); }catch(_){ }
    }catch(e){ console.error('flushPendingCuentas error', e); }
  }
  setTimeout(()=>flushPendingCuentas(),1000);
  setInterval(()=>flushPendingCuentas(),5000);
  window.cuentasService={ cargarCuentas,agregarCuenta,actualizarCuenta,eliminarCuenta };
})();
