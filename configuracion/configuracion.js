class ConfigurationManager {
    constructor() {
        this.settings = {
            notifications: {
                push: true,
                inApp: true,
                payments: true,
                tips: true,
                email: false,
                frequency: 'daily'
            },
            personalization: {
                theme: 'light',
                font: 'default',
                fontSize: 'medium',
                customFontSize: 16,
                accentColor: '#28a745',
                highContrast: false,
                boldText: false
            }
        };
        this.notificationHistory = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applyTheme();
        this.generateSampleNotifications();
        this.updatePreview();
    }

    loadSettings() {
        const saved = localStorage.getItem('walletFlowSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applySettingsToUI();
        }
    }

    saveSettings() {
        localStorage.setItem('walletFlowSettings', JSON.stringify(this.settings));
        this.showNotification('Configuración guardada exitosamente', 'success');
    }

    setupEventListeners() {
        // Notification settings
        document.getElementById('pushNotifications').addEventListener('change', (e) => {
            this.settings.notifications.push = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('inAppNotifications').addEventListener('change', (e) => {
            this.settings.notifications.inApp = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('paymentReminders').addEventListener('change', (e) => {
            this.settings.notifications.payments = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('financialTips').addEventListener('change', (e) => {
            this.settings.notifications.tips = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('emailNotifications').addEventListener('change', (e) => {
            this.settings.notifications.email = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('notificationFrequency').addEventListener('change', (e) => {
            this.settings.notifications.frequency = e.target.value;
            this.saveSettings();
        });

        // Personalization settings
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.settings.personalization.theme = e.target.value;
            this.applyTheme();
            this.saveSettings();
        });

        document.getElementById('fontSelect').addEventListener('change', (e) => {
            this.settings.personalization.font = e.target.value;
            this.applyFont();
            this.saveSettings();
            this.updatePreview();
        });

        document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
            this.settings.personalization.fontSize = e.target.value;
            this.toggleCustomFontSize();
            this.applyFontSize();
            this.saveSettings();
            this.updatePreview();
        });

        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            this.settings.personalization.customFontSize = parseInt(e.target.value);
            this.applyFontSize();
            this.updatePreview();
        });

        document.getElementById('fontSizeSlider').addEventListener('change', () => {
            this.saveSettings();
        });

        document.getElementById('accentColor').addEventListener('change', (e) => {
            this.settings.personalization.accentColor = e.target.value;
            this.applyAccentColor();
            this.saveSettings();
        });

        document.getElementById('highContrast').addEventListener('change', (e) => {
            this.settings.personalization.highContrast = e.target.checked;
            this.applyAccessibility();
            this.saveSettings();
        });

        document.getElementById('boldText').addEventListener('change', (e) => {
            this.settings.personalization.boldText = e.target.checked;
            this.applyAccessibility();
            this.saveSettings();
            this.updatePreview();
        });

        // Color presets
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.settings.personalization.accentColor = color;
                document.getElementById('accentColor').value = color;
                this.applyAccentColor();
                this.saveSettings();
            });
        });

        // Delete account validation
        document.getElementById('deleteConfirmation').addEventListener('input', (e) => {
            this.validateDeleteConfirmation(e.target.value);
        });

        document.getElementById('deleteReason').addEventListener('change', (e) => {
            this.deleteReason = e.target.value;
        });
    }

    applySettingsToUI() {
        // Apply notification settings
        document.getElementById('pushNotifications').checked = this.settings.notifications.push;
        document.getElementById('inAppNotifications').checked = this.settings.notifications.inApp;
        document.getElementById('paymentReminders').checked = this.settings.notifications.payments;
        document.getElementById('financialTips').checked = this.settings.notifications.tips;
        document.getElementById('emailNotifications').checked = this.settings.notifications.email;
        document.getElementById('notificationFrequency').value = this.settings.notifications.frequency;

        // Apply personalization settings
        document.getElementById('themeSelect').value = this.settings.personalization.theme;
        document.getElementById('fontSelect').value = this.settings.personalization.font;
        document.getElementById('fontSizeSelect').value = this.settings.personalization.fontSize;
        document.getElementById('fontSizeSlider').value = this.settings.personalization.customFontSize;
        document.getElementById('accentColor').value = this.settings.personalization.accentColor;
        document.getElementById('highContrast').checked = this.settings.personalization.highContrast;
        document.getElementById('boldText').checked = this.settings.personalization.boldText;

        this.toggleCustomFontSize();
        this.applyTheme();
        this.applyFont();
        this.applyFontSize();
        this.applyAccentColor();
        this.applyAccessibility();
    }

    applyTheme() {
        const body = document.body;
        const theme = this.settings.personalization.theme;
        
        body.removeAttribute('data-theme');
        
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                body.setAttribute('data-theme', 'dark');
            }
        }
    }

    applyFont() {
        const body = document.body;
        body.removeAttribute('data-font');
        if (this.settings.personalization.font !== 'default') {
            body.setAttribute('data-font', this.settings.personalization.font);
        }
    }

    applyFontSize() {
        const root = document.documentElement;
        let fontSize = 16;

        switch (this.settings.personalization.fontSize) {
            case 'small':
                fontSize = 14;
                break;
            case 'medium':
                fontSize = 16;
                break;
            case 'large':
                fontSize = 18;
                break;
            case 'custom':
                fontSize = this.settings.personalization.customFontSize;
                break;
        }

        root.style.setProperty('--font-size', fontSize + 'px');
    }

    applyAccentColor() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.settings.personalization.accentColor);
    }

    applyAccessibility() {
        const body = document.body;
        
        if (this.settings.personalization.highContrast) {
            body.setAttribute('data-theme', 'high-contrast');
        }
        
        if (this.settings.personalization.boldText) {
            body.classList.add('bold-text');
        } else {
            body.classList.remove('bold-text');
        }
    }

    toggleCustomFontSize() {
        const slider = document.getElementById('fontSizeSlider');
        slider.style.display = this.settings.personalization.fontSize === 'custom' ? 'block' : 'none';
    }

    updatePreview() {
        const preview = document.querySelector('.preview-text p');
        preview.textContent = `Vista previa - Tema: ${this.settings.personalization.theme}, Fuente: ${this.settings.personalization.font}, Tamaño: ${this.settings.personalization.fontSize}`;
    }

    generateSampleNotifications() {
        this.notificationHistory = [
            {
                id: 1,
                title: 'Recordatorio de Pago',
                message: 'Tu pago de tarjeta de crédito vence mañana',
                time: '2024-01-15 10:30',
                type: 'payment',
                read: false
            },
            {
                id: 2,
                title: 'Meta de Ahorro',
                message: 'Has alcanzado el 80% de tu meta mensual',
                time: '2024-01-14 15:20',
                type: 'goal',
                read: true
            },
            {
                id: 3,
                title: 'Consejo Financiero',
                message: 'Considera invertir tus ahorros adicionales',
                time: '2024-01-13 09:15',
                type: 'tip',
                read: true
            }
        ];
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        let bgColor = 'var(--primary-color)';
        if (type === 'success') bgColor = 'var(--success-color)';
        if (type === 'error') bgColor = 'var(--danger-color)';
        if (type === 'warning') bgColor = 'var(--warning-color)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    validateDeleteConfirmation(value) {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        const input = document.getElementById('deleteConfirmation');
        
        if (value === 'ELIMINAR CUENTA') {
            deleteBtn.disabled = false;
            input.classList.add('valid');
            deleteBtn.style.opacity = '1';
        } else {
            deleteBtn.disabled = true;
            input.classList.remove('valid');
            deleteBtn.style.opacity = '0.5';
        }
    }

    resetPersonalization() {
        this.showConfirmModal('¿Estás seguro de que deseas restablecer toda la configuración de personalización?', () => {
            this.settings.personalization = {
                theme: 'light',
                font: 'default',
                fontSize: 'medium',
                customFontSize: 16,
                accentColor: '#28a745',
                highContrast: false,
                boldText: false
            };
            this.applySettingsToUI();
            this.saveSettings();
            this.showNotification('Configuración restablecida exitosamente', 'success');
        });
    }

    showConfirmModal(message, callback) {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        messageEl.textContent = message;
        
        this.confirmCallback = callback;
        modal.style.display = 'block';
    }

    confirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.closeConfirmModal();
    }

    closeConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.confirmCallback = null;
    }
}

// Global functions
function goBack() {
    window.location.href = '../principal.html';
}

function showNotificationHistory() {
    const modal = document.getElementById('notificationModal');
    const historyContainer = document.getElementById('notificationHistory');
    
    historyContainer.innerHTML = '';
    
    configManager.notificationHistory.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        item.innerHTML = `
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <div class="time">${notification.time}</div>
        `;
        historyContainer.appendChild(item);
    });
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

function resetPersonalization() {
    configManager.resetPersonalization();
}

function confirmAction() {
    configManager.confirmAction();
}

function closeConfirmModal() {
    configManager.closeConfirmModal();
}

function deleteAccount() {
    const confirmation = document.getElementById('deleteConfirmation').value;
    
    if (confirmation !== 'ELIMINAR CUENTA') {
        configManager.showNotification('Debes escribir "ELIMINAR CUENTA" para confirmar', 'error');
        return;
    }
    
    const modal = document.getElementById('deleteAccountModal');
    modal.style.display = 'block';
}

function confirmDeleteAccount() {
    // Simulate account deletion process
    configManager.showNotification('Eliminando cuenta...', 'warning');
    
    setTimeout(() => {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        
        // Simulate account deletion
        configManager.showNotification('Cuenta eliminada exitosamente', 'success');
        
        setTimeout(() => {
            // Redirect to login or home page
            alert('Tu cuenta ha sido eliminada permanentemente. Serás redirigido a la página principal.');
            window.location.href = '../pantalla.html';
        }, 2000);
        
    }, 2000);
    
    closeDeleteModal();
}

function closeDeleteModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
}

// Initialize the configuration manager
const configManager = new ConfigurationManager();

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .delete-account-input {
        transition: all 0.3s ease;
    }
    
    .delete-account-input.valid {
        background-color: #d4edda;
        border-color: var(--success-color);
    }
    
    .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .action-btn:disabled:hover {
        transform: none !important;
        box-shadow: none !important;
    }
`;
