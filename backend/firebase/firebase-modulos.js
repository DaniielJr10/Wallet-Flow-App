// Cargador agregado de módulos CRUD de WalletDB
// En lugar de incluir 8 scripts, basta incluir este después de firebase-db.js
// Se autodetecta la ruta y carga: incomes, expenses, accounts, savings, debts,
// investments y goals. Expone Promise window.walletDBModulesReady.
(function(){
  try {
    var current = document.currentScript && document.currentScript.src || '';
    var baseDir = current.split('/').slice(0,-1).join('/') + '/';
    var modules = [
      'firebase-incomes.js',
      'firebase-expenses.js',
      'firebase-accounts.js',
      'firebase-savings.js',
      'firebase-debts.js',
      'firebase-investments.js',
      'firebase-goals.js',
      'firebase-notes.js'
    ];
    var loaders = modules.map(function(name){
      // Si un método clave ya existe podemos considerar cargado, pero mantenemos carga para consistencia
      return new Promise(function(resolve,reject){
        // Evitar duplicados
        if (document.querySelector('script[data-fbmod="'+name+'"]')) { resolve(); return; }
        var s = document.createElement('script');
        s.src = baseDir + name;
        s.async = false; // mantener orden (aunque no crítico)
        s.dataset.fbmod = name;
        s.onload = function(){ resolve(); };
        s.onerror = function(){ console.error('No se pudo cargar módulo', name); reject(new Error('Fallo cargando '+name)); };
        document.head.appendChild(s);
      });
    });
    window.walletDBModulesReady = Promise.all(loaders).then(function(){
      // Emite evento para quien quiera escuchar
      try { window.dispatchEvent(new Event('walletdb-modules-ready')); } catch(_){ }
      return true;
    }).catch(function(e){ console.error('Error cargando módulos WalletDB:', e); return false; });
  } catch(e) {
    console.error('Error inicializando cargador de módulos WalletDB:', e);
  }
})();