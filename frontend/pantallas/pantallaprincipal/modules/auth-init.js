// Inicialización de Firebase/Auth para Pantalla Principal
(function(){
  async function initAuth(){
    try {
      if(window.firebaseAuth) await window.firebaseAuth.init();
      if(window.walletDB) await window.walletDB.init();
      const auth = firebase.auth();
      if(!auth.currentUser){
        auth.onAuthStateChanged(u=>{ if(!u){ window.location.href='../../login/inicio de sesion/inicio.html'; } });
      }
    }catch(e){ console.error(e); }
  }
  window.principalAuthInit = { initAuth };
})();
