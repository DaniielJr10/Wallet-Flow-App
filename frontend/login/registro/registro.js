// ===== SISTEMA DE REGISTRO =====

// ===== ELEMENTOS DEL DOM =====
const progress = document.getElementById("formProgress");
const form = document.getElementById("multiStepForm");
const backToLoginLink = document.getElementById("back-to-login");

// Campos del formulario
const regEmail = document.getElementById("reg-email");
const regName = document.getElementById("reg-name");
const regLastname = document.getElementById("reg-lastname");
const regPassword = document.getElementById("reg-password");
const regConfirmPassword = document.getElementById("reg-confirm-password");

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", async () => {
    await initializeFirebase();
    setupEventListeners();
  
    if (progress) {
        progress.style.width = '100%';
        progress.setAttribute('aria-valuenow', 100);
    }
    checkAuthState();
});

// ===== INICIALIZACIÓN DE FIREBASE =====
async function initializeFirebase() {
    try {
        console.log('Intentando inicializar Firebase en registro...');

        if (!window.firebaseAuth) {
            throw new Error('firebaseAuth no está disponible. Verifica que firebase-autenticacion.js se haya cargado.');
        }
        
        const initialized = await window.firebaseAuth.init();
        if (initialized) {
            console.log('Firebase inicializado correctamente para registro');
        } else {
            console.error('Firebase no se pudo inicializar');
            showMessage('Error al inicializar el sistema de autenticación. Revisa la consola para más detalles.', 'danger');
        }
    } catch (error) {
        console.error('Error en inicialización del registro:', error);
        showMessage(`Error: ${error.message}`, 'danger');
    }
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Envío del formulario
    form.addEventListener("submit", handleRegistration);
    
    // Enlace para regresar al login
    backToLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = '../inicio de sesion/inicio.html';
    });
    
    // Validación en tiempo real de contraseñas
    regPassword.addEventListener("input", validatePassword);
    regConfirmPassword.addEventListener("input", validatePasswordMatch);
    
    // Validación de email
    regEmail.addEventListener("input", validateEmailField);
}
// ===== VERIFICAR ESTADO DE AUTENTICACIÓN =====
function checkAuthState() {
    // Si ya hay un usuario autenticado, redirigir a la pantalla principal
    if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
        console.log('Usuario ya autenticado, redirigiendo...');
        window.location.href = '../../pantallas/pantallaprincipal/principal.html';
    }
}
// ===== VALIDACIONES =====
function validateCurrentStep() {

    const inputs = form.querySelectorAll("input[required]");
    let isValid = true;

    for (let input of inputs) {
        if (!validateField(input)) {
            isValid = false;
        }
    }

    if (!isValidEmail(regEmail.value)) {
        showFieldError(regEmail, 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    if (!field.value.trim()) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    } else {
        showFieldSuccess(field);
        return true;
    }
}

function validateEmailField() {
    const email = regEmail.value.trim();
    if (!email) {
        showFieldError(regEmail, 'El correo electrónico es obligatorio');
    } else if (!isValidEmail(email)) {
        showFieldError(regEmail, 'Ingresa un correo electrónico válido');
    } else {
        showFieldSuccess(regEmail);
    }
}

function validatePassword() {
    const password = regPassword.value;
    const requirements = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    let message = '';
    if (!requirements.length) message += 'Mínimo 6 caracteres. ';
    if (!requirements.uppercase) message += 'Una mayúscula. ';
    if (!requirements.number) message += 'Un número. ';
    if (!requirements.symbol) message += 'Un símbolo. ';
    
    if (message) {
        showFieldError(regPassword, message.trim());
        return false;
    } else {
        showFieldSuccess(regPassword);
        return true;
    }
}

function validatePasswordMatch() {
    if (regPassword.value !== regConfirmPassword.value) {
        showFieldError(regConfirmPassword, 'Las contraseñas no coinciden');
        return false;
    } else if (regConfirmPassword.value) {
        showFieldSuccess(regConfirmPassword);
        return true;
    }
    return false;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== REGISTRO CON FIREBASE =====
async function handleRegistration(e) {
    e.preventDefault();
    
    // Validar todos los campos
    if (!validateAllFields()) {
        return;
    }
    

    showRegistrationLoading(true);
    
    const userData = {
        email: regEmail.value.trim(),
        password: regPassword.value,
        displayName: `${regName.value.trim()} ${regLastname.value.trim()}`,
 
        personalInfo: {
            name: regName.value.trim(),
            lastname: regLastname.value.trim()
        }
    };
    
    try {
        const result = await window.firebaseAuth.registrarUsuario(
            userData.email,
            userData.password,
            { 
                displayName: userData.displayName,
                personalInfo: userData.personalInfo
            }
        );
        
        if (result.success) {
            handleSuccessfulRegistration(result);
        } else {
            handleFailedRegistration(result.message);
        }
    } catch (error) {
        console.error('Error en registro:', error);
        handleFailedRegistration('Error de conexión. Intenta nuevamente.');
    } finally {
        showRegistrationLoading(false);
    }
}

function validateAllFields() {
    let isValid = true;
    
    // Validar paso 1
    const step1Fields = [regEmail, regName, regLastname];
    step1Fields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    if (!isValidEmail(regEmail.value)) {
        showFieldError(regEmail, 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validar paso 2
    const step2Fields = [regPassword, regConfirmPassword];
    step2Fields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    if (!validatePassword()) isValid = false;
    if (!validatePasswordMatch()) isValid = false;
    
    return isValid;
}

// ===== MANEJO DE RESPUESTAS =====
function handleSuccessfulRegistration(result) {
    showMessage(result.message, 'success');
    
    // Guardar información del usuario en localStorage
    const userData = {
        email: regEmail.value.trim(),
        nombre: regName.value.trim(),
        apellido: regLastname.value.trim(),
        nombreCompleto: `${regName.value.trim()} ${regLastname.value.trim()}`,
        uid: result.user ? result.user.uid : null
    };
    
    localStorage.setItem('walletflow_user_data', JSON.stringify(userData));

    setTimeout(() => {
        window.location.href = '../inicio de sesion/inicio.html';
    }, 3000);
}

function handleFailedRegistration(errorMessage) {
    showMessage(errorMessage, 'danger');
    

    if (errorMessage.includes('correo electrónico ya está registrado')) {
        currentStep = 0;
        updateFormSteps();
        regEmail.focus();
    }
}

// ===== FUNCIONES DE UI =====
function showRegistrationLoading(show) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Registrando...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Registrarse';
    }
}

function showMessage(message, type = 'info') {

    let alertElement = document.querySelector('.alert');
    if (!alertElement) {
        alertElement = document.createElement('div');
        alertElement.className = 'alert mt-3';
        form.appendChild(alertElement);
    }
    
    alertElement.className = `alert alert-${type} mt-3`;
    alertElement.textContent = message;
    

    alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    

    if (type === 'success') {
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
   
    let feedback = field.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}
  