// Loader dinámico de componentes de Configuración
(function(){
  const components = [
    { name:'perfil', html:'components/perfil/perfil.html', css:'components/perfil/perfil.css', js:'components/perfil/perfil.js' },
    { name:'notificaciones', html:'components/notificaciones/notificaciones.html', css:'components/notificaciones/notificaciones.css', js:'components/notificaciones/notificaciones.js' },
    { name:'privacidad', html:'components/privacidad/privacidad.html', css:'components/privacidad/privacidad.css', js:'components/privacidad/privacidad.js' },
    { name:'acerca', html:'components/acerca/acerca.html', css:'components/acerca/acerca.css', js:'components/acerca/acerca.js' }
  ];
  function loadAll(){
    const root = document.getElementById('config-tools-root');
    if(!root) return;
    let pending = components.length;
    components.forEach(c=>{
      // CSS
      if(c.css){ const link=document.createElement('link'); link.rel='stylesheet'; link.href=c.css; link.dataset.componentCss=c.name; document.head.appendChild(link); }
      // HTML
      fetch(c.html).then(r=>r.text()).then(html=>{
        const wrapper=document.createElement('div');
        wrapper.innerHTML=html;
        root.appendChild(wrapper);
        // JS
        if(c.js){ const script=document.createElement('script'); script.src=c.js; script.dataset.componentJs=c.name; document.head.appendChild(script); }
      }).catch(err=> console.error('Error cargando componente', c.name, err))
      .finally(()=>{
        pending--; if(pending===0){ document.dispatchEvent(new CustomEvent('config-components-loaded')); }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', loadAll);
})();
