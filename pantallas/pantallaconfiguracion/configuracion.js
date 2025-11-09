// ========================================
// FUNCIONES PARA TARJETAS ESTILO HERRAMIENTAS
// ========================================

// Abrir modal de herramienta
function openToolModal(toolName) {
    const modal = document.getElementById(`modal-${toolName}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Cargar datos si es necesario
        if (toolName === 'perfil') {
            loadUserProfile();
        } else if (toolName === 'notificaciones') {
            loadNotificationSettings();
        }
    }
}

// Cerrar modal de herramienta
function closeToolModal(toolName) {
    const modal = document.getElementById(`modal-${toolName}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tool-modal')) {
        const modalId = e.target.id;
        const toolName = modalId.replace('modal-', '');
        closeToolModal(toolName);
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.tool-modal.active').forEach(modal => {
            const toolName = modal.id.replace('modal-', '');
            closeToolModal(toolName);
        });
    }
});

// Cargar perfil de usuario
function loadUserProfile() {
    const userDataStr = localStorage.getItem("walletflow_user_data");
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            
            // Llenar campos del perfil
            const nameInput = document.getElementById('profileName');
            const emailInput = document.getElementById('profileEmail');
            const phoneInput = document.getElementById('profilePhone');
            
            if (nameInput && userData.nombre) nameInput.value = userData.nombre;
            if (emailInput && userData.email) emailInput.value = userData.email;
            if (phoneInput && userData.telefono) phoneInput.value = userData.telefono;
            
            // Cargar foto de perfil si existe
            if (userData.profilePhoto) {
                const photoElement = document.getElementById('profilePhotoDisplay');
                if (photoElement) {
                    photoElement.innerHTML = `<img src="${userData.profilePhoto}" alt="Foto de perfil">`;
                }
            }
        } catch (e) {
            console.log("Error al cargar usuario:", e);
        }
    }
}

// Guardar perfil de usuario
function saveProfile() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    
    if (!name || !email) {
        showNotificationCard("Por favor, completa el nombre y el correo", "error");
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotificationCard("Por favor, ingresa un correo válido", "error");
        return;
    }
    
    const userDataStr = localStorage.getItem("walletflow_user_data");
    let userData = {};
    
    if (userDataStr) {
        try {
            userData = JSON.parse(userDataStr);
        } catch (e) {
            console.log("Error al parsear datos:", e);
        }
    }
    
    userData.nombre = name;
    userData.email = email;
    userData.telefono = phone;
    
    localStorage.setItem("walletflow_user_data", JSON.stringify(userData));
    showNotificationCard("✓ Perfil actualizado exitosamente", "success");
    
    // Cerrar modal después de guardar
    setTimeout(() => {
        closeToolModal('perfil');
    }, 1500);
}

// Cambiar foto de perfil
function changeProfilePhoto() {
    document.getElementById('photoInput').click();
}

function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showNotificationCard("Por favor, selecciona una imagen válida", "error");
        return;
    }
    
    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotificationCard("La imagen es muy grande. Máximo 2MB", "error");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        
        // Mostrar preview
        const photoElement = document.getElementById('profilePhotoDisplay');
        if (photoElement) {
            photoElement.innerHTML = `<img src="${photoData}" alt="Foto de perfil">`;
        }
        
        // Guardar en localStorage
        const userDataStr = localStorage.getItem("walletflow_user_data");
        let userData = {};
        
        if (userDataStr) {
            try {
                userData = JSON.parse(userDataStr);
            } catch (err) {
                console.log("Error:", err);
            }
        }
        
        userData.profilePhoto = photoData;
        localStorage.setItem("walletflow_user_data", JSON.stringify(userData));
        showNotificationCard("✓ Foto actualizada exitosamente", "success");
    };
    
    reader.readAsDataURL(file);
}

// Cargar preferencias de notificaciones
function loadNotificationSettings() {
    const settingsStr = localStorage.getItem("walletflow_notifications");
    if (settingsStr) {
        try {
            const settings = JSON.parse(settingsStr);
            
            if (settings.emailNotifications !== undefined) {
                document.getElementById('emailNotifications').checked = settings.emailNotifications;
            }
            if (settings.paymentReminders !== undefined) {
                document.getElementById('paymentReminders').checked = settings.paymentReminders;
            }
            if (settings.financialTips !== undefined) {
                document.getElementById('financialTips').checked = settings.financialTips;
            }
            if (settings.frequency) {
                document.getElementById('notificationFrequency').value = settings.frequency;
            }
        } catch (e) {
            console.log("Error al cargar preferencias de notificaciones:", e);
        }
    }
}

// Guardar notificaciones
function saveNotifications() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        paymentReminders: document.getElementById('paymentReminders').checked,
        financialTips: document.getElementById('financialTips').checked,
        frequency: document.getElementById('notificationFrequency').value
    };
    
    localStorage.setItem("walletflow_notifications", JSON.stringify(settings));
    showNotificationCard("✓ Preferencias de notificaciones guardadas", "success");
    
    // Cerrar modal después de guardar
    setTimeout(() => {
        closeToolModal('notificaciones');
    }, 1500);
}

// Cambiar contraseña
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotificationCard("Por favor, completa todos los campos", "error");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotificationCard("Las contraseñas no coinciden", "error");
        return;
    }
    
    if (newPassword.length < 6) {
        showNotificationCard("La contraseña debe tener al menos 6 caracteres", "error");
        return;
    }
    
    // Aquí iría la lógica de verificación con Firebase
    // Por ahora simulamos éxito
    
    // Limpiar campos
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showNotificationCard("✓ Contraseña actualizada exitosamente", "success");
}

// Validar campo de confirmación para eliminar cuenta
function validateDeleteInput() {
    const input = document.getElementById('confirmDeleteInput');
    const btn = document.getElementById('btnDeleteAccount');
    
    if (input && btn) {
        btn.disabled = input.value !== 'ELIMINAR';
    }
}

// Eliminar cuenta
function deleteAccount() {
    const deleteModal = document.getElementById('deleteAccountModal');
    if (deleteModal) {
        deleteModal.classList.add('active');
    }
}

// Confirmar eliminación de cuenta
function confirmDeleteAccount() {
    // Mostrar advertencia final
    if (confirm("⚠️ ADVERTENCIA FINAL ⚠️\n\nEsta acción es IRREVERSIBLE. Todos tus datos serán eliminados permanentemente.\n\n¿Estás absolutamente seguro?")) {
        // Limpiar todo el localStorage
        localStorage.clear();
        
        // Redirigir al login
        showNotificationCard("Cuenta eliminada. Redirigiendo...", "success");
        setTimeout(() => {
            window.location.href = "../../login/inicio de sesion/inicio.html";
        }, 2000);
    }
}

// Cancelar eliminación de cuenta
function cancelDeleteAccount() {
    const deleteModal = document.getElementById('deleteAccountModal');
    if (deleteModal) {
        deleteModal.classList.remove('active');
    }
    document.getElementById('confirmDeleteInput').value = '';
    
    // También cerrar el modal de privacidad si está abierto
    // (opcional, depende del flujo que prefieras)
}

// Mostrar notificación estilo toast
function showNotificationCard(message, type) {
    type = type || "info";
    const notification = document.createElement("div");
    notification.className = "notification-toast " + type;
    
    const colors = {
        success: "linear-gradient(135deg, #28a745, #20c997)",
        error: "linear-gradient(135deg, #dc3545, #c82333)",
        info: "linear-gradient(135deg, #17a2b8, #138496)",
        warning: "linear-gradient(135deg, #ffc107, #e0a800)"
    };
    
    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        warning: "⚠"
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${colors[type]};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        z-index: 12000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        font-size: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos iniciales
    loadUserProfile();
    loadNotificationSettings();
    
    // Agregar listener para el input de confirmación de eliminar cuenta
    const confirmInput = document.getElementById('confirmDeleteInput');
    if (confirmInput) {
        confirmInput.addEventListener('input', validateDeleteInput);
    }
    
    // Cerrar modal de eliminación al hacer click fuera
    const deleteModal = document.getElementById('deleteAccountModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                cancelDeleteAccount();
            }
        });
    }
    
    // Botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                localStorage.removeItem("walletflow_user_data");
                window.location.href = "../../login/inicio de sesion/inicio.html";
            }
        });
    }
});

// ========================================
// CÓDIGO ORIGINAL DEL SISTEMA DE CONFIGURACIÓN
// ========================================

// Sistema de configuración global
class ConfigurationManager {
    constructor() {
        this.settings = {
            notifications: {
                email: false,
                payments: true,
                tips: true,
                summary: true,
                frequency: "daily"
            },
            personalization: {
                theme: "light",
                fontSize: "medium",
                boldText: false
            }
        };
        this.notificationHistory = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applyAllSettings();
        this.generateSampleNotifications();
        this.updatePreview();
        this.loadUserProfile();
    }

    loadUserProfile() {
        const userDataStr = localStorage.getItem("walletflow_user_data");
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                console.log("Usuario cargado:", userData);
            } catch (e) {
                console.log("Error al cargar usuario:", e);
            }
        }
    }

    loadSettings() {
        const saved = localStorage.getItem("walletFlowSettings");
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applySettingsToUI();
        }
    }

    saveSettings() {
        localStorage.setItem("walletFlowSettings", JSON.stringify(this.settings));
        this.showNotification("Configuración guardada exitosamente", "success");
    }

    setupEventListeners() {
        const emailNotifications = document.getElementById("emailNotifications");
        if (emailNotifications) {
            emailNotifications.addEventListener("change", (e) => {
                this.settings.notifications.email = e.target.checked;
                this.saveSettings();
            });
        }

        const paymentReminders = document.getElementById("paymentReminders");
        if (paymentReminders) {
            paymentReminders.addEventListener("change", (e) => {
                this.settings.notifications.payments = e.target.checked;
                this.saveSettings();
            });
        }

        const financialTips = document.getElementById("financialTips");
        if (financialTips) {
            financialTips.addEventListener("change", (e) => {
                this.settings.notifications.tips = e.target.checked;
                this.saveSettings();
            });
        }

        const summaryNotifications = document.getElementById("summaryNotifications");
        if (summaryNotifications) {
            summaryNotifications.addEventListener("change", (e) => {
                this.settings.notifications.summary = e.target.checked;
                this.saveSettings();
            });
        }

        const notificationFrequency = document.getElementById("notificationFrequency");
        if (notificationFrequency) {
            notificationFrequency.addEventListener("change", (e) => {
                this.settings.notifications.frequency = e.target.value;
                this.saveSettings();
            });
        }

        const themeSelect = document.getElementById("themeSelect");
        if (themeSelect) {
            themeSelect.addEventListener("change", (e) => {
                this.settings.personalization.theme = e.target.value;
                this.saveSettings(); // Guarda primero
                this.applyTheme();   // Luego aplica
            });
        }

        const fontSizeSelect = document.getElementById("fontSizeSelect");
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener("change", (e) => {
                this.settings.personalization.fontSize = e.target.value;
                this.applyFontSize();
                this.saveSettings();
                this.updatePreview();
            });
        }

        const boldText = document.getElementById("boldText");
        if (boldText) {
            boldText.addEventListener("change", (e) => {
                this.settings.personalization.boldText = e.target.checked;
                this.applyBoldText();
                this.saveSettings();
                this.updatePreview();
            });
        }

        const deleteConfirmation = document.getElementById("deleteConfirmation");
        if (deleteConfirmation) {
            deleteConfirmation.addEventListener("input", (e) => {
                this.validateDeleteConfirmation(e.target.value);
            });
        }

        const deleteReason = document.getElementById("deleteReason");
        if (deleteReason) {
            deleteReason.addEventListener("change", (e) => {
                this.deleteReason = e.target.value;
            });
        }
    }

    applySettingsToUI() {
        const emailNotifications = document.getElementById("emailNotifications");
        if (emailNotifications) {
            emailNotifications.checked = this.settings.notifications.email;
        }

        const paymentReminders = document.getElementById("paymentReminders");
        if (paymentReminders) {
            paymentReminders.checked = this.settings.notifications.payments;
        }

        const financialTips = document.getElementById("financialTips");
        if (financialTips) {
            financialTips.checked = this.settings.notifications.tips;
        }

        const summaryNotifications = document.getElementById("summaryNotifications");
        if (summaryNotifications) {
            summaryNotifications.checked = this.settings.notifications.summary !== undefined ? this.settings.notifications.summary : true;
        }

        const notificationFrequency = document.getElementById("notificationFrequency");
        if (notificationFrequency) {
            notificationFrequency.value = this.settings.notifications.frequency;
        }

        const themeSelect = document.getElementById("themeSelect");
        if (themeSelect) {
            themeSelect.value = this.settings.personalization.theme;
        }

        const fontSizeSelect = document.getElementById("fontSizeSelect");
        if (fontSizeSelect) {
            fontSizeSelect.value = this.settings.personalization.fontSize;
        }

        const boldText = document.getElementById("boldText");
        if (boldText) {
            boldText.checked = this.settings.personalization.boldText;
        }
    }

    applyAllSettings() {
        this.applyTheme();
        this.applyFontSize();
        this.applyBoldText();
    }

    applyTheme() {
        if (window.refreshTheme) {
            window.refreshTheme();
        }
    }

    applyFontSize() {
        if (window.refreshTheme) {
            window.refreshTheme();
        }
    }

    applyBoldText() {
        if (window.refreshTheme) {
            window.refreshTheme();
        }
    }

    updatePreview() {
        const preview = document.querySelector(".preview-text p");
        if (preview) {
            const theme = this.settings.personalization.theme;
            const fontSize = this.settings.personalization.fontSize;
            preview.textContent = `Vista previa - Tema: ` + theme + `, Fuente: default, Tamaño: ` + fontSize;
        }
    }

    generateSampleNotifications() {
        this.notificationHistory = [
            {
                id: 1,
                type: "payment",
                title: "Recordatorio de Pago",
                message: "Tienes un pago pendiente de 500 para mañana",
                date: new Date(Date.now() - 86400000),
                read: false
            },
            {
                id: 2,
                type: "tip",
                title: "Consejo Financiero",
                message: "Considera aumentar tu ahorro mensual en un 10%",
                date: new Date(Date.now() - 172800000),
                read: true
            },
            {
                id: 3,
                type: "summary",
                title: "Resumen Semanal",
                message: "Has gastado 1,234 esta semana. 15% menos que la semana anterior.",
                date: new Date(Date.now() - 259200000),
                read: true
            }
        ];
    }

    showNotification(message, type) {
        type = type || "info";
        const notification = document.createElement("div");
        notification.className = "notification " + type;
        notification.textContent = message;
        notification.style.cssText = "position:fixed;top:20px;right:20px;padding:15px 25px;background:" + (type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#007bff") + ";color:white;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;animation:slideIn 0.3s ease;";
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = "slideOut 0.3s ease";
            setTimeout(function() { notification.remove(); }, 300);
        }, 3000);
    }

    validateDeleteConfirmation(value) {
        const deleteBtn = document.getElementById("deleteAccountBtn");
        if (deleteBtn) {
            deleteBtn.disabled = value !== "ELIMINAR CUENTA";
        }
    }
}

function showNotificationHistory() {
    const modal = document.getElementById("notificationModal");
    const historyContainer = document.getElementById("notificationHistory");
    
    if (!configManager.notificationHistory.length) {
        historyContainer.innerHTML = "<p class=no-notifications>No hay notificaciones en el historial</p>";
    } else {
        historyContainer.innerHTML = configManager.notificationHistory.map(function(notif) {
            return "<div class=\"notification-item " + (notif.read ? "read" : "unread") + "\"><div class=notification-header><span class=\"notification-type " + notif.type + "\">" + getNotificationIcon(notif.type) + "</span><h4>" + notif.title + "</h4><span class=notification-date>" + formatDate(notif.date) + "</span></div><p>" + notif.message + "</p></div>";
        }).join("");
    }
    
    modal.style.display = "flex";
}

function getNotificationIcon(type) {
    const icons = { payment: "", tip: "", summary: "", alert: "" };
    return icons[type] || "";
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return "Hace " + days + " días";
    return date.toLocaleDateString("es-ES");
}

function closeModal() {
    document.getElementById("notificationModal").style.display = "none";
}

function resetPersonalization() {
    if (confirm("¿Estás seguro de que quieres restablecer toda la configuración de personalización?")) {
        configManager.settings.personalization = {
            theme: "light",
            fontSize: "medium",
            boldText: false
        };
        configManager.applyAllSettings();
        configManager.applySettingsToUI();
        configManager.saveSettings();
        configManager.updatePreview();
    }
}

function deleteAccount() {
    const confirmation = document.getElementById("deleteConfirmation").value;
    
    if (confirmation !== "ELIMINAR CUENTA") {
        alert("Por favor, escribe ELIMINAR CUENTA para confirmar");
        return;
    }
    
    document.getElementById("deleteAccountModal").style.display = "flex";
}

function confirmDeleteAccount() {
    alert("Funcionalidad de eliminación de cuenta implementada");
    localStorage.clear();
    window.location.href = "../../login/inicio de sesion/inicio.html";
}

function closeDeleteModal() {
    document.getElementById("deleteAccountModal").style.display = "none";
    document.getElementById("deleteConfirmation").value = "";
}

function closeConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                localStorage.removeItem("walletflow_user_data");
                window.location.href = "../../login/inicio de sesion/inicio.html";
            }
        });
    }
});

const configManager = new ConfigurationManager();

window.onclick = function(event) {
    const notificationModal = document.getElementById("notificationModal");
    const deleteAccountModal = document.getElementById("deleteAccountModal");
    const confirmModal = document.getElementById("confirmModal");
    
    if (event.target === notificationModal) {
        closeModal();
    }
    if (event.target === deleteAccountModal) {
        closeDeleteModal();
    }
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
};

const style = document.createElement("style");
style.textContent = "@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}";
document.head.appendChild(style);
