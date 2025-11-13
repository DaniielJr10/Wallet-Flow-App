// Manejo de modales estilo herramientas
(function(){
  function open(tool){
    const modal = document.getElementById('modal-'+tool);
    if(modal){ modal.classList.add('active'); document.body.style.overflow='hidden';
      if(tool==='perfil') window.configProfile.loadUserProfile();
      else if(tool==='notificaciones') window.configNotifications.loadNotificationSettings();
    }
  }
  function close(tool){
    const modal = document.getElementById('modal-'+tool);
    if(modal){ modal.classList.remove('active'); document.body.style.overflow=''; }
  }
  // Click fuera
  document.addEventListener('click', e=>{
    if(e.target.classList && e.target.classList.contains('tool-modal')){
      const tool = e.target.id.replace('modal-',''); close(tool);
    }
  });
  // Escape
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.tool-modal.active').forEach(m=> close(m.id.replace('modal-','')));
    }
  });
  window.configModals = { open, close };
})();
