// Servicio de persistencia y carga de configuración
(function(){
  function loadSettings(){
    const saved = localStorage.getItem('walletFlowSettings');
    if(saved){
      try {
        const parsed = JSON.parse(saved);
        window.configState.settings = { ...window.configState.settings, ...parsed };
      } catch(e){ console.log('Error parse settings', e); }
    }
  }
  function saveSettings(){
    localStorage.setItem('walletFlowSettings', JSON.stringify(window.configState.settings));
    if(window.configMessages) window.configMessages.showToast('Configuración guardada exitosamente','success');
  }
  function generateSampleNotifications(){
    window.configState.notificationHistory = [
      { id:1, type:'payment', title:'Recordatorio de Pago', message:'Tienes un pago pendiente de 500 para mañana', date:new Date(Date.now()-86400000), read:false },
      { id:2, type:'tip', title:'Consejo Financiero', message:'Considera aumentar tu ahorro mensual en un 10%', date:new Date(Date.now()-172800000), read:true },
      { id:3, type:'summary', title:'Resumen Semanal', message:'Has gastado 1,234 esta semana. 15% menos que la semana anterior.', date:new Date(Date.now()-259200000), read:true }
    ];
  }
  window.configService = { loadSettings, saveSettings, generateSampleNotifications };
})();
