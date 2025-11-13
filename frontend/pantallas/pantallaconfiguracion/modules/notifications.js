// Notificaciones: carga, guardado e historial
(function(){
  function loadNotificationSettings(){
    const str = localStorage.getItem('walletflow_notifications');
    if(!str) return;
    try { const settings = JSON.parse(str);
      setChecked('emailNotifications', settings.emailNotifications);
      setChecked('paymentReminders', settings.paymentReminders);
      setChecked('financialTips', settings.financialTips);
      if(settings.frequency) setValue('notificationFrequency', settings.frequency);
    }catch(e){ console.log('Error notificaciones', e); }
  }
  function saveNotifications(){
    const settings = {
      emailNotifications: getChecked('emailNotifications'),
      paymentReminders: getChecked('paymentReminders'),
      financialTips: getChecked('financialTips'),
      frequency: getValue('notificationFrequency')
    };
    localStorage.setItem('walletflow_notifications', JSON.stringify(settings));
    window.configMessages.showToast('✓ Preferencias de notificaciones guardadas','success');
    setTimeout(()=> window.configModals.close('notificaciones'),1500);
  }
  function setChecked(id,val){ const el=document.getElementById(id); if(el && val!==undefined) el.checked=!!val; }
  function getChecked(id){ const el=document.getElementById(id); return el? el.checked : false; }
  function setValue(id,val){ const el=document.getElementById(id); if(el) el.value=val; }
  function getValue(id){ const el=document.getElementById(id); return el? el.value : ''; }
  function formatDate(date){
    const now = new Date(); const diff = now - date; const days = Math.floor(diff/86400000);
    if(days===0) return 'Hoy'; if(days===1) return 'Ayer'; if(days<7) return 'Hace '+days+' días';
    return date.toLocaleDateString('es-ES');
  }
  function getNotificationIcon(type){ const icons = { payment:'', tip:'', summary:'', alert:'' }; return icons[type] || ''; }
  function showNotificationHistory(){
    const modal = document.getElementById('notificationModal');
    const container = document.getElementById('notificationHistory');
    const history = window.configState.notificationHistory || [];
    if(!container) return;
    if(!history.length){ container.innerHTML = '<p class="no-notifications">No hay notificaciones en el historial</p>'; }
    else { container.innerHTML = history.map(n=> `<div class="notification-item ${n.read?'read':'unread'}"><div class="notification-header"><span class="notification-type ${n.type}">${getNotificationIcon(n.type)}</span><h4>${n.title}</h4><span class="notification-date">${formatDate(n.date)}</span></div><p>${n.message}</p></div>`).join(''); }
    if(modal) modal.style.display='flex';
  }
  window.configNotifications = { loadNotificationSettings, saveNotifications, showNotificationHistory };
})();
