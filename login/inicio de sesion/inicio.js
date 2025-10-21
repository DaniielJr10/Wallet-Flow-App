// ===== SISTEMA DE INICIO DE SESIÓN CON FIREBASE - WALLET FLOW =====
// Archivo: inicio.js
// Descripción: Maneja toda la lógica de autenticación con Firebase

// ===== ELEMENTOS DEL DOM =====
const loginForm = document.getElementById('loginForm');
const loginIdentifier = document.getElementById('login-identifier');
const loginPassword = document.getElementById('login-password');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const rememberMe = document.getElementById('rememberMe');
const loginMessage = document.getElementById('loginMessage');
const loginBtn = document.getElementById('loginBtn');
const loginSpinner = document.getElementById('loginSpinner');
const forgotPasswordLink = document.getElementById('forgotPassword');

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', async function() {
    await initializeFirebase();
    setupEventListeners();
    checkRememberedUser();
    checkAuthState();
});

// ===== INICIALIZACIÓN DE FIREBASE =====
async function initializeFirebase() {
    try {
        const initialized = await window.firebaseAuth.init();
        if (initialized) {
            console.log('Firebase inicializado correctamente para login');
        } else {
            showMessage('Error al inicializar el sistema de autenticación', 'danger');
        }
    } catch (error) {
        console.error('Error en inicialización:', error);
        showMessage('Error de conexión. Verifica tu internet', 'danger');
    }
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Evento del formulario de login
    loginForm.addEventListener('submit', handleFirebaseLogin);
    
    // Toggle para mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Enlace para "olvidaste contraseña" - funciona automáticamente con href
    
    // Validación en tiempo real
    loginIdentifier.addEventListener('input', clearValidation);
    loginPassword.addEventListener('input', clearValidation);
}

// ===== VERIFICAR ESTADO DE AUTENTICACIÓN =====
function checkAuthState() {
    // Si ya hay un usuario autenticado, redirigir a la pantalla principal
    if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
        console.log('Usuario ya autenticado, redirigiendo...');
        // window.location.href = '../../pantallas/pantallaprincipal/principal.html';
    }
}



// ===== FUNCIONALIDAD "RECORDAR USUARIO" =====
function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('walletflow_remembered_user');
    if (rememberedUser) {
        loginIdentifier.value = rememberedUser;
        rememberMe.checked = true;
        loginPassword.focus();
    }
}

// ===== MANEJO DEL LOGIN CON FIREBASE =====
async function handleFirebaseLogin(e) {
    e.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }
    
    const email = loginIdentifier.value.trim();
    const password = loginPassword.value;
    
    // Mostrar spinner de carga
    showLoginLoading(true);
    hideMessage();
    
    try {
        // Intentar iniciar sesión con Firebase
        const result = await window.firebaseAuth.iniciarSesion(email, password);
        
        if (result.success) {
            handleSuccessfulLogin(result.user);
        } else {
            handleFailedLogin(result.message);
        }
    } catch (error) {
        console.error('Error en login:', error);
        handleFailedLogin('Error de conexión. Intenta nuevamente.');
    } finally {
        showLoginLoading(false);
    }
}

// ===== MANEJO DE OLVIDO DE CONTRASEÑA =====
async function handleForgotPassword() {
    const email = loginIdentifier.value.trim();
    
    if (!email) {
        showMessage('Por favor ingresa tu correo electrónico para recuperar tu contraseña', 'warning');
        loginIdentifier.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un correo electrónico válido', 'warning');
        loginIdentifier.focus();
        return;
    }
    
    try {
        showLoginLoading(true);
        const result = await window.firebaseAuth.recuperarContrasena(email);
        
        if (result.success) {
            showMessage(result.message, 'success');
        } else {
            showMessage(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        showMessage('Error al enviar email de recuperación. Intenta nuevamente.', 'danger');
    } finally {
        showLoginLoading(false);
    }
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateLoginForm() {
    let isValid = true;
    
    // Validar campo de email
    if (!loginIdentifier.value.trim()) {
        showFieldError(loginIdentifier, 'Por favor ingresa tu correo electrónico.');
        isValid = false;
    } else if (!isValidEmail(loginIdentifier.value.trim())) {
        showFieldError(loginIdentifier, 'Por favor ingresa un correo electrónico válido.');
        isValid = false;
    } else {
        showFieldSuccess(loginIdentifier);
    }
    
    // Validar contraseña
    if (!loginPassword.value) {
        showFieldError(loginPassword, 'Por favor ingresa tu contraseña.');
        isValid = false;
    } else if (loginPassword.value.length < 6) {
        showFieldError(loginPassword, 'La contraseña debe tener al menos 6 caracteres.');
        isValid = false;
    } else {
        showFieldSuccess(loginPassword);
    }
    
    return isValid;
}

// ===== VALIDACIÓN DE EMAIL =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}



// ===== MANEJO DE LOGIN EXITOSO =====
function handleSuccessfulLogin(user) {
    console.log('Login exitoso:', user);
    
    // Guardar usuario recordado si está marcado
    if (rememberMe.checked) {
        localStorage.setItem('walletflow_remembered_user', user.email);
    } else {
        localStorage.removeItem('walletflow_remembered_user');
    }
    
    // Mostrar mensaje de éxito
    showMessage('¡Inicio de sesión exitoso! Bienvenido a WalletFlow.', 'success');
    
    // Redirigir después de un breve delay
    setTimeout(() => {
        // Redirigir a la pantalla principal
        window.location.href = '../../pantallas/pantallaprincipal/principal.html';
    }, 1500);
}

// ===== MANEJO DE LOGIN FALLIDO =====
function handleFailedLogin(errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.') {
    showMessage(errorMessage, 'danger');
    
    // Limpiar contraseña por seguridad
    loginPassword.value = '';
    loginPassword.focus();
    
    // Aplicar efecto de shake al formulario
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
}

// ===== TOGGLE PARA MOSTRAR/OCULTAR CONTRASEÑA =====
function togglePasswordVisibility() {
    const isPassword = loginPassword.type === 'password';
    loginPassword.type = isPassword ? 'text' : 'password';
    toggleIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
}

// ===== FUNCIONES DE INTERFAZ DE USUARIO =====

// Mostrar mensajes de estado en el login
function showMessage(message, type) {
    loginMessage.className = `alert alert-${type}`;
    loginMessage.textContent = message;
    loginMessage.classList.remove('d-none');
    
    // Auto-ocultar mensajes de error después de 5 segundos
    if (type === 'danger') {
        setTimeout(() => {
            loginMessage.classList.add('d-none');
        }, 5000);
    }
}

// Mostrar error en campo específico
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Actualizar mensaje de error
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

// Mostrar éxito en campo específico
function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}

// Limpiar validación de campos
function clearValidation() {
    loginMessage.classList.add('d-none');
    loginIdentifier.classList.remove('is-invalid', 'is-valid');
    loginPassword.classList.remove('is-invalid', 'is-valid');
}

// Mostrar/ocultar spinner de carga durante el login
function showLoginLoading(show) {
    if (show) {
        loginSpinner.classList.remove('d-none');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Iniciando sesión...';
    } else {
        loginSpinner.classList.add('d-none');
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Iniciar Sesión';
    }
}

function hideMessage() {
    loginMessage.classList.add('d-none');
}

// ===== FUNCIONES GLOBALES PARA GESTIÓN DE SESIÓN =====

// Función para cerrar sesión (disponible globalmente)
window.logout = function() {
    localStorage.removeItem('walletflow_current_user');
    localStorage.removeItem('walletflow_remembered_user');
    window.location.href = '../inicio de sesion/inicio.html';
};

// Función para verificar autenticación (disponible globalmente)
window.checkAuth = function() {
    const currentUser = JSON.parse(localStorage.getItem('walletflow_current_user') || 'null');
    if (!currentUser) {
        window.location.href = '../inicio de sesion/inicio.html';
        return false;
    }
    return currentUser;
};

// ===== ESTILOS CSS ADICIONALES =====
// Agregar CSS para animación de shake
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ===== FUNCIONES GLOBALES PARA GESTIÓN DE SESIÓN =====

// Función para cerrar sesión (disponible globalmente)
window.logout = function() {
    if (window.firebaseAuth) {
        window.firebaseAuth.cerrarSesion();
    }
    localStorage.removeItem('walletflow_current_user');
    localStorage.removeItem('walletflow_remembered_user');
    window.location.href = '../inicio de sesion/inicio.html';
};

// Función para verificar autenticación (disponible globalmente)
window.checkAuth = function() {
    if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
        return window.firebaseAuth.getCurrentUser();
    }
    return null;
};
