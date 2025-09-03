// ===== SISTEMA DE INICIO DE SESIÓN - WALLET FLOW =====
// Archivo: inicio.js
// Descripción: Maneja toda la lógica de autenticación y validación del login

// ===== VARIABLES GLOBALES =====
let users = JSON.parse(localStorage.getItem('walletflow_users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('walletflow_current_user') || 'null');

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
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    setupEventListeners();
    checkRememberedUser();
});

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Evento del formulario de login
    loginForm.addEventListener('submit', handleLogin);
    
    // Toggle para mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Enlace para "olvidaste contraseña"
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../cambiar contraseña/index.html';
    });
    
    // Validación en tiempo real
    loginIdentifier.addEventListener('input', clearValidation);
    loginPassword.addEventListener('input', clearValidation);
}

// ===== INICIALIZACIÓN DE LA PÁGINA DE LOGIN =====
function initializeLogin() {
    // Crear usuarios de prueba si no existen
    createTestUsers();
}

// ===== GESTIÓN DE USUARIOS DE PRUEBA =====
function createTestUsers() {
    if (users.length === 0) {
        const testUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@walletflow.com',
                password: 'WalletFlow123!',
                name: 'Administrador',
                lastname: 'Sistema',
                phone: '1234567890',
                birthdate: '1990-01-01',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'usuario',
                email: 'usuario@ejemplo.com',
                password: 'MiPassword123!',
                name: 'Usuario',
                lastname: 'Ejemplo',
                phone: '0987654321',
                birthdate: '1995-06-15',
                createdAt: new Date().toISOString()
            }
        ];
        
        users = testUsers;
        localStorage.setItem('walletflow_users', JSON.stringify(users));
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

// ===== MANEJO DEL FORMULARIO DE LOGIN =====
async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }
    
    const identifier = loginIdentifier.value.trim();
    const password = loginPassword.value;
    
    // Mostrar spinner de carga
    showLoginLoading(true);
    
    // Simular delay de autenticación (en una app real sería una petición al servidor)
    setTimeout(() => {
        const user = authenticateUser(identifier, password);
        
        if (user) {
            handleSuccessfulLogin(user);
        } else {
            handleFailedLogin();
        }
        
        showLoginLoading(false);
    }, 1500);
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateLoginForm() {
    let isValid = true;
    
    // Validar campo de usuario/email
    if (!loginIdentifier.value.trim()) {
        showFieldError(loginIdentifier, 'Por favor ingresa tu usuario o email.');
        isValid = false;
    } else {
        showFieldSuccess(loginIdentifier);
    }
    
    // Validar contraseña
    if (!loginPassword.value) {
        showFieldError(loginPassword, 'Por favor ingresa tu contraseña.');
        isValid = false;
    } else {
        showFieldSuccess(loginPassword);
    }
    
    return isValid;
}

// ===== AUTENTICACIÓN DE USUARIO =====
function authenticateUser(identifier, password) {
    // Por el momento, cualquier combinación es válida para fines de desarrollo
    // Crear un usuario temporal para la sesión
    return {
        id: Math.floor(Math.random() * 1000),
        username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@walletflow.com`,
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        lastname: 'Usuario',
        password: password
    };
}

// ===== MANEJO DE LOGIN EXITOSO =====
function handleSuccessfulLogin(user) {
    // Guardar usuario actual en localStorage
    currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('walletflow_current_user', JSON.stringify(currentUser));
    
    // Manejar funcionalidad "recordar usuario"
    if (rememberMe.checked) {
        localStorage.setItem('walletflow_remembered_user', loginIdentifier.value.trim());
    } else {
        localStorage.removeItem('walletflow_remembered_user');
    }
    
    // Mostrar mensaje de éxito
    showMessage(`¡Bienvenido/a, ${user.name}!`, 'success');
    
    // Redireccionar a la pantalla principal después de un breve delay
    setTimeout(() => {
    window.location.href = '../../pantallas/pantallaprincipal/principal.html';
    }, 1500);
}

// ===== MANEJO DE LOGIN FALLIDO =====
function handleFailedLogin() {
    showMessage('Usuario o contraseña incorrectos. Por favor verifica tus datos.', 'danger');
    loginPassword.value = '';
    loginPassword.focus();
    
    // Agregar clase de error a los campos
    loginIdentifier.classList.add('is-invalid');
    loginPassword.classList.add('is-invalid');
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
    loginSpinner.classList.toggle('d-none', !show);
    loginBtn.disabled = show;
    loginBtn.textContent = show ? 'Iniciando sesión...' : 'Iniciar Sesión';
    
    if (show) {
        loginBtn.prepend(loginSpinner);
    }
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

// ===== HERRAMIENTAS DE DESARROLLO =====
// Mostrar usuarios disponibles en consola (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('=== WALLETFLOW - USUARIOS DE PRUEBA ===');
    console.log('Admin: usuario="admin", password="WalletFlow123!"');
    console.log('Usuario: usuario="usuario", password="MiPassword123!"');
    console.log('Email Admin: admin@walletflow.com');
    console.log('Email Usuario: usuario@ejemplo.com');
    console.log('========================================');
}
