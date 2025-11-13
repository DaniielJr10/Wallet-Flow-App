// Boot de Configuración
(function(){
  function start(){
    window.configService.loadSettings();
    window.configService.generateSampleNotifications();
    window.configProfile.loadUserProfile();
    window.configNotifications.loadNotificationSettings();
    window.configPersonalization.applyAll();
    window.configPersonalization.updatePreview();
    window.configActions.attachCoreListeners();
  }
  document.addEventListener('DOMContentLoaded', start);
  window.configBoot = { start };
})();
