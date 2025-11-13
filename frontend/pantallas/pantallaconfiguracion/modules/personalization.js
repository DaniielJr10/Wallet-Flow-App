// Personalización (placeholder de vista previa)
(function(){
  function updatePreview(){
    const preview = document.querySelector('.preview-text p');
    if(preview){
      const theme = window.configState.settings.personalization.theme;
      const fontSize = window.configState.settings.personalization.fontSize;
      preview.textContent = 'Vista previa - Tema: ' + theme + ', Fuente: default, Tamaño: ' + fontSize;
    }
  }
  function applyTheme(){ if(window.refreshTheme) window.refreshTheme(); }
  function applyFontSize(){ if(window.refreshTheme) window.refreshTheme(); }
  function applyBoldText(){ if(window.refreshTheme) window.refreshTheme(); }
  function applyAll(){ applyTheme(); applyFontSize(); applyBoldText(); }
  function resetPersonalization(){
    if(!confirm('¿Restablecer toda la configuración de personalización?')) return;
    window.configState.settings.personalization = { theme:'light', fontSize:'medium', boldText:false };
    applyAll(); updatePreview(); window.configService.saveSettings();
  }
  window.configPersonalization = { updatePreview, applyTheme, applyFontSize, applyBoldText, applyAll, resetPersonalization };
})();
