// Animaciones iniciales
(function(){
  function animateFloatingButton(){
    const btn = window.principalState.refs.botonAgregar;
    if(!btn) return;
    setTimeout(()=>{
      btn.style.opacity='0';
      btn.style.transform='scale(0) rotate(180deg)';
      btn.style.transition='all 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)';
      setTimeout(()=>{ btn.style.opacity='1'; btn.style.transform='scale(1) rotate(0deg)'; },500);
    },100);
  }
  window.principalAnimations = { animateFloatingButton };
})();
