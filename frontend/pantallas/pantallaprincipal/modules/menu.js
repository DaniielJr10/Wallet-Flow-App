// Lógica del menú emergente y ripple
(function(){
  function crearEfectoRipple(e, button){
    const ripple=document.createElement('span');
    const rect=button.getBoundingClientRect();
    const size=Math.max(rect.width, rect.height);
    const x=e.clientX-rect.left-size/2;
    const y=e.clientY-rect.top-size/2;
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=x+'px';
    ripple.style.top=y+'px';
    ripple.classList.add('ripple');
    const existing=button.querySelector('.ripple'); if(existing) existing.remove();
    button.appendChild(ripple); setTimeout(()=> ripple.remove(),600);
  }
  function abrirMenu(menu){ menu.classList.remove('d-none'); menu.style.animation='slideInUp 0.5s ease forwards'; }
  function cerrarMenu(menu){ menu.style.animation='slideOutDown 0.3s ease forwards'; setTimeout(()=> menu.classList.add('d-none'),300); }
  function toggleMenu(menu){ menu.classList.contains('d-none') ? abrirMenu(menu) : cerrarMenu(menu); }
  window.principalMenu = { crearEfectoRipple, abrirMenu, cerrarMenu, toggleMenu };
})();
