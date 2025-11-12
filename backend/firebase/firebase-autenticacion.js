// Servicios de autenticación de Firebase para WalletFlow

class FirebaseAuth {
    constructor() {
        this.auth = null;
        this.user = null;
        this.initialized = false;
    }

    // Inicializar Firebase
    async init() {
        try {
            console.log('Iniciando Firebase...');
            
            // Verificar que Firebase esté disponible
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK no está cargado. Verifica tu conexión a internet.');
            }
            
            // Verificar que la configuración esté disponible
            if (!window.firebaseConfig) {
                throw new Error('Configuración de Firebase no encontrada');
            }
            
            console.log('Configuración Firebase:', window.firebaseConfig);
            
            // Inicializar la app de Firebase
            const app = firebase.initializeApp(window.firebaseConfig);
            this.auth = firebase.auth();
            this.initialized = true;
            
            // Escuchar cambios en el estado de autenticación
            this.auth.onAuthStateChanged((user) => {
                this.user = user;
                if (user) {
                    console.log('Usuario autenticado:', user.email);
                } else {
                    console.log('Usuario no autenticado');
                }
            });
            
            console.log('Firebase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error detallado al inicializar Firebase:', error);
            console.error('Tipo de error:', error.name);
            console.error('Mensaje:', error.message);
            return false;
        }
    }

    // Registrar nuevo usuario
    async registrarUsuario(email, password, userData = {}) {
        try {
            if (!this.initialized) {
                throw new Error('Firebase no está inicializado');
            }

            // Crear usuario con email y contraseña
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Actualizar perfil del usuario si se proporcionan datos adicionales
            if (userData.displayName) {
                await user.updateProfile({
                    displayName: userData.displayName
                });
            }

            // Enviar email de verificación
            await user.sendEmailVerification();

            console.log('Usuario registrado exitosamente:', user.email);
            return {
                success: true,
                user: user,
                message: 'Usuario registrado exitosamente. Por favor verifica tu email.'
            };

        } catch (error) {
            console.error('Error detallado al registrar usuario:', error);
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            console.error('Error completo:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code) + ` (${error.code})`
            };
        }
    }

    // Iniciar sesión
    async iniciarSesion(email, password) {
        try {
            if (!this.initialized) {
                throw new Error('Firebase no está inicializado');
            }

       
            if (!email || !password) {
                console.warn('Intento de login con campos vacíos');
                return { success: false, error: 'auth/missing-credentials', message: 'Por favor ingresa correo y contraseña' };
            }

            console.log(`Intentando iniciar sesión con: ${email}`);

            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            console.log('Inicio de sesión exitoso:', user.email);
            return {
                success: true,
                user: user,
                message: 'Inicio de sesión exitoso'
            };

        } catch (error) {
      
            console.error('Error al iniciar sesión (detallado):', error);
            console.error('Código de error:', error && error.code);
            console.error('Mensaje de error:', error && error.message);

            const code = (error && error.code) ? error.code : 'auth/unknown-error';

            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    // Cerrar sesión
    async cerrarSesion() {
        try {
            await this.auth.signOut();
            console.log('Sesión cerrada exitosamente');
            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return {
                success: false,
                error: error.code,
                message: 'Error al cerrar sesión'
            };
        }
    }

    // Cambiar contraseña
    async cambiarContrasena(currentPassword, newPassword) {
        try {
            if (!this.user) {
                throw new Error('No hay usuario autenticado');
            }

            // Re-autenticar al usuario con su contraseña actual
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.user.email,
                currentPassword
            );
            
            await this.user.reauthenticateWithCredential(credential);
            
            // Cambiar la contraseña
            await this.user.updatePassword(newPassword);

            console.log('Contraseña cambiada exitosamente');
            return {
                success: true,
                message: 'Contraseña cambiada exitosamente'
            };

        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    // Recuperar contraseña
    async recuperarContrasena(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            console.log('Email de recuperación enviado');
            return {
                success: true,
                message: 'Se ha enviado un email para recuperar tu contraseña'
            };
        } catch (error) {
            console.error('Error al enviar email de recuperación:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.user;
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.user !== null;
    }

    // Obtener mensajes de error en español
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/invalid-email': 'El correo electrónico no es válido',
            'auth/user-not-found': 'No existe un usuario con este correo electrónico',
            'auth/wrong-password': 'La contraseña es incorrecta',
            'auth/invalid-login-credentials': 'Credenciales inválidas. Verifica tu correo y contraseña',
            'auth/missing-credentials': 'Faltan el correo o la contraseña',
            'auth/unknown-error': 'Error desconocido. Revisa la consola para más detalles',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
            'auth/invalid-credential': 'Las credenciales son inválidas',
            'auth/requires-recent-login': 'Esta operación requiere autenticación reciente',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };

        return errorMessages[errorCode] || 'Ha ocurrido un error. Intenta nuevamente';
    }
}

// Crear instancia global de FirebaseAuth
try {
    console.log('Creando instancia de FirebaseAuth...');
    window.firebaseAuth = new FirebaseAuth();
    console.log('FirebaseAuth creado exitosamente:', window.firebaseAuth);
    console.log('Métodos disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.firebaseAuth)));
} catch (error) {
    console.error('Error al crear FirebaseAuth:', error);
}