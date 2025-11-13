// Sistema de mensajes / toasts unificado
(function(){
  function showToast(message, type){
    type = type || 'info';
    const notification = document.createElement('div');
    notification.className = 'notification-toast '+type;
    const colors = { success:'linear-gradient(135deg,#28a745,#20c997)', error:'linear-gradient(135deg,#dc3545,#c82333)', info:'linear-gradient(135deg,#17a2b8,#138496)', warning:'linear-gradient(135deg,#ffc107,#e0a800)' };
    const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
    notification.innerHTML = `<span class="notification-icon">${icons[type]}</span><span class="notification-message">${message}</span>`;
    notification.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 25px;background:${colors[type]};color:white;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.2);z-index:12000;display:flex;align-items:center;gap:12px;font-weight:600;font-size:15px;animation:slideIn .3s ease;`;
    document.body.appendChild(notification);
    setTimeout(()=>{ notification.style.animation='slideOut .3s ease'; setTimeout(()=> notification.remove(),300); },3000);
  }
  window.configMessages = { showToast };
})();
