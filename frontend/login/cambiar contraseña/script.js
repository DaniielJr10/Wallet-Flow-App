// ===== SISTEMA DE RECUPERACIÓN DE CONTRASEÑA CON FIREBASE - WALLET FLOW =====
// Archivo: script.js
// Descripción: Maneja la recuperación de contraseña con Firebase

class WalletFlowPasswordRecovery {
  constructor() {
    this.currentStep = "email"
    this.userEmail = ""
    this.firebaseInitialized = false

    this.init()
  }

  async init() {
    await this.initializeFirebase()
    this.bindEvents()
    this.updateStepTitle()
    this.checkAuthState()
  }

  async initializeFirebase() {
    try {
      const initialized = await window.firebaseAuth.init()
      if (initialized) {
        console.log('Firebase inicializado correctamente para recuperación')
        this.firebaseInitialized = true
      } else {
        this.showErrorMessage('Error al inicializar el sistema de autenticación')
      }
    } catch (error) {
      console.error('Error en inicialización:', error)
      this.showErrorMessage('Error de conexión. Verifica tu internet')
    }
  }

  checkAuthState() {
    // Si ya hay un usuario autenticado, mostrar opción de cambio directo
    if (window.firebaseAuth && window.firebaseAuth.isAuthenticated()) {
      this.showAuthenticatedUserOptions()
    }
  }

  bindEvents() {
    // Formulario de email
    document.getElementById("email-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleEmailSubmit()
    })

    // Formulario de código
    document.getElementById("code-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleCodeSubmit()
    })

    // Formulario de contraseña
    document.getElementById("password-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handlePasswordSubmit()
    })

    // Input de código - solo números y máximo 6 dígitos
    document.getElementById("recovery-code").addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6)
      this.toggleCodeButton()
    })

    // Validación de contraseña en tiempo real
    document.getElementById("new-password").addEventListener("input", () => {
      this.validatePassword()
    })

    document.getElementById("confirm-password").addEventListener("input", () => {
      this.checkPasswordMatch()
    })

    // Botón de reenviar código
    document.getElementById("resend-code-btn").addEventListener("click", () => {
      this.resendCode()
    })

    // Volver al login
    document.getElementById("back-to-login").addEventListener("click", (e) => {
      e.preventDefault()
      this.goToLogin()
    })
  }

  async handleEmailSubmit() {
    const email = document.getElementById("recovery-email").value
    const button = document.getElementById("send-code-btn")
    const emailInput = document.getElementById("recovery-email")

    if (!this.isValidEmail(email)) {
      emailInput.classList.add("is-invalid")
      this.showError("Por favor ingresa un correo electrónico válido")
      return
    }

    if (!this.firebaseInitialized) {
      this.showError("Sistema no disponible. Recarga la página.")
      return
    }

    emailInput.classList.remove("is-invalid")
    emailInput.classList.add("is-valid")

    this.setLoading(button, true)
    this.hideMessages()

    try {
      // Enviar email de recuperación con Firebase
      const result = await window.firebaseAuth.recuperarContrasena(email)

      if (result.success) {
        this.userEmail = email
        this.showSuccess(result.message)
        
        setTimeout(() => {
          this.showPasswordResetSent()
        }, 2000)
      } else {
        this.showError(result.message)
      }
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error)
      this.showError("Error al enviar el email. Inténtalo de nuevo.")
    } finally {
      this.setLoading(button, false)
    }
  }

  async handleCodeSubmit() {
    const code = document.getElementById("recovery-code").value
    const button = document.getElementById("verify-code-btn")
    const codeInput = document.getElementById("recovery-code")

    if (code.length !== 6) {
      codeInput.classList.add("is-invalid")
      this.showError("El código debe tener 6 dígitos")
      return
    }

    codeInput.classList.remove("is-invalid")
    codeInput.classList.add("is-valid")

    this.setLoading(button, true)
    this.hideMessages()

    try {
      // Simular verificación de código
      await this.delay(1500)

      // Para demo, acepta cualquier código de 6 dígitos excepto 000000
      if (code === "000000") {
        throw new Error("Código incorrecto")
      }

      this.showSuccess("Código verificado correctamente")
      this.stopCountdown()

      setTimeout(() => {
        this.goToStep("password")
      }, 1500)
    } catch (error) {
      codeInput.classList.add("is-invalid")
      this.showError("Código incorrecto. Verifica e inténtalo de nuevo.")
    } finally {
      this.setLoading(button, false)
    }
  }

  async handlePasswordSubmit() {
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const button = document.getElementById("reset-password-btn")
    const newPasswordInput = document.getElementById("new-password")
    const confirmPasswordInput = document.getElementById("confirm-password")

    let isValid = true

    if (!this.isPasswordValid(newPassword)) {
      newPasswordInput.classList.add("is-invalid")
      this.showError("La contraseña no cumple con todos los requisitos")
      isValid = false
    } else {
      newPasswordInput.classList.remove("is-invalid")
      newPasswordInput.classList.add("is-valid")
    }

    if (newPassword !== confirmPassword) {
      confirmPasswordInput.classList.add("is-invalid")
      if (isValid) this.showError("Las contraseñas no coinciden")
      isValid = false
    } else {
      confirmPasswordInput.classList.remove("is-invalid")
      confirmPasswordInput.classList.add("is-valid")
    }

    if (!isValid) return

    this.setLoading(button, true)
    this.hideMessages()

    try {
      // Simular restablecimiento de contraseña
      await this.delay(2000)

      this.showSuccess("Contraseña restablecida exitosamente")

      setTimeout(() => {
        this.goToLogin()
      }, 2000)
    } catch (error) {
      this.showError("Error al restablecer la contraseña. Inténtalo de nuevo.")
    } finally {
      this.setLoading(button, false)
    }
  }

  async resendCode() {
    const button = document.getElementById("resend-code-btn")
    const originalText = button.textContent

    button.disabled = true
    button.textContent = "Reenviando..."
    button.classList.add("disabled")

    try {
      await this.delay(1000)
      this.showSuccess(`Código reenviado a ${this.userEmail}`)
      this.countdownTime = 600
      this.startCountdown()
    } catch (error) {
      this.showError("Error al reenviar el código")
    } finally {
      button.disabled = false
      button.textContent = originalText
      button.classList.remove("disabled")
    }
  }

  goToStep(step) {
    // Ocultar paso actual
    document.querySelectorAll(".step-container").forEach((container) => {
      container.classList.remove("active")
      container.classList.add("d-none")
    })

    // Mostrar nuevo paso
    const newStepElement = document.getElementById(`step-${step}`)
    newStepElement.classList.remove("d-none")
    newStepElement.classList.add("active")

    this.currentStep = step
    this.updateStepTitle()
    this.hideMessages()

    // Limpiar validaciones de Bootstrap
    document.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
      el.classList.remove("is-valid", "is-invalid")
    })

    // Configuraciones específicas por paso
    if (step === "code") {
      document.getElementById("email-display").textContent = this.userEmail
      setTimeout(() => {
        document.getElementById("recovery-code").focus()
      }, 100)
    }
  }

  updateStepTitle() {
    const titles = {
      email: "Recuperar Contraseña",
      code: "Verificar Código",
      password: "Nueva Contraseña",
    }

    document.getElementById("step-title").textContent = titles[this.currentStep]
  }

  startCountdown() {
    this.stopCountdown() // Limpiar cualquier countdown previo

    this.countdownTimer = setInterval(() => {
      this.countdownTime--

      const minutes = Math.floor(this.countdownTime / 60)
      const seconds = this.countdownTime % 60

      document.getElementById("countdown").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`

      if (this.countdownTime <= 0) {
        this.stopCountdown()
        this.showError("El código ha expirado. Solicita uno nuevo.")
      }
    }, 1000)
  }

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  }

  toggleCodeButton() {
    const code = document.getElementById("recovery-code").value
    const button = document.getElementById("verify-code-btn")
    button.disabled = code.length !== 6
  }

  validatePassword() {
    const password = document.getElementById("new-password").value
    const requirements = {
      "req-length": password.length >= 12,
      "req-uppercase": /[A-Z]/.test(password),
      "req-number": /\d/.test(password),
      "req-symbol": /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    Object.entries(requirements).forEach(([id, isValid]) => {
      const element = document.getElementById(id)
      const icon = element.querySelector("i")

      if (isValid) {
        element.classList.add("met")
        element.classList.remove("text-danger")
        element.classList.add("text-success")
        icon.className = "fas fa-check me-2"
      } else {
        element.classList.remove("met")
        element.classList.remove("text-success")
        element.classList.add("text-danger")
        icon.className = "fas fa-times me-2"
      }
    })

    this.checkPasswordMatch()
    this.togglePasswordButton()
  }

  checkPasswordMatch() {
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const matchElement = document.getElementById("password-match")
    const noMatchElement = document.getElementById("password-no-match")

    if (confirmPassword.length === 0) {
      matchElement.classList.add("d-none")
      noMatchElement.classList.add("d-none")
      return
    }

    if (newPassword === confirmPassword) {
      matchElement.classList.remove("d-none")
      noMatchElement.classList.add("d-none")
    } else {
      matchElement.classList.add("d-none")
      noMatchElement.classList.remove("d-none")
    }

    this.togglePasswordButton()
  }

  togglePasswordButton() {
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const button = document.getElementById("reset-password-btn")

    const isPasswordValid = this.isPasswordValid(newPassword)
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0

    button.disabled = !(isPasswordValid && passwordsMatch)
  }

  isPasswordValid(password) {
    return (
      password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  setLoading(button, isLoading) {
    const btnText = button.querySelector(".btn-text")
    const spinner = button.querySelector(".loading-spinner")

    if (isLoading) {
      btnText.classList.add("hide")
      spinner.classList.remove("d-none")
      button.disabled = true
    } else {
      btnText.classList.remove("hide")
      spinner.classList.add("d-none")
      button.disabled = false
    }
  }

  showSuccess(message) {
    this.hideMessages()
    document.getElementById("success-text").textContent = message
    document.getElementById("success-message").classList.remove("d-none")
    document.getElementById("message-container").classList.remove("d-none")

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideMessages()
    }, 5000)
  }

  showError(message) {
    this.hideMessages()
    document.getElementById("error-text").textContent = message
    document.getElementById("error-message").classList.remove("d-none")
    document.getElementById("message-container").classList.remove("d-none")

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideMessages()
    }, 5000)
  }

  hideMessages() {
    document.getElementById("message-container").classList.add("d-none")
    document.getElementById("success-message").classList.add("d-none")
    document.getElementById("error-message").classList.add("d-none")
  }

  goToLogin() {
    // Redirigir a la página de inicio de sesión
    window.location.href = '../inicio de sesion/inicio.html';
  }

  createToast(message) {
    const toastContainer = document.createElement("div")
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
    toastContainer.innerHTML = `
      <div class="toast" role="alert">
        <div class="toast-header">
          <strong class="me-auto">WalletFlow</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `
    document.body.appendChild(toastContainer)
    return toastContainer.querySelector(".toast")
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ===== MÉTODOS ESPECÍFICOS PARA FIREBASE =====
  
  showPasswordResetSent() {
    // Ocultar todos los pasos
    document.querySelectorAll('.step-container').forEach(step => {
      step.classList.add('d-none')
    })
    
    // Mostrar mensaje de éxito personalizado
    const formContent = document.querySelector('.form-content')
    formContent.innerHTML = `
      <div class="text-center py-4">
        <div class="mb-4">
          <i class="fas fa-envelope-circle-check text-success" style="font-size: 4rem;"></i>
        </div>
        <h3 class="text-success mb-3">¡Email Enviado!</h3>
        <p class="text-muted mb-4">
          Hemos enviado un enlace de recuperación a <strong>${this.userEmail}</strong>
        </p>
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Instrucciones:</strong><br>
          1. Revisa tu bandeja de entrada (y spam)<br>
          2. Haz clic en el enlace del email<br>
          3. Sigue las instrucciones para crear una nueva contraseña
        </div>
        <div class="d-grid gap-2 mt-4">
          <button class="btn btn-success btn-lg" onclick="window.location.href='../inicio de sesion/inicio.html'">
            <i class="fas fa-arrow-left me-2"></i>
            Volver al Inicio de Sesión
          </button>
          <button class="btn btn-outline-secondary" onclick="window.location.reload()">
            <i class="fas fa-redo me-2"></i>
            Enviar Otro Email
          </button>
        </div>
      </div>
    `
    
    // Actualizar título
    document.getElementById('step-title').textContent = 'Revisa tu Email'
  }

  showAuthenticatedUserOptions() {
    // Si hay un usuario autenticado, mostrar opción de cambio directo
    const user = window.firebaseAuth.getCurrentUser()
    if (user) {
      const formContent = document.querySelector('.step-description')
      if (formContent) {
        formContent.innerHTML = `
          <div class="alert alert-info mb-3">
            <i class="fas fa-user me-2"></i>
            Sesión activa como: <strong>${user.email}</strong>
          </div>
          <p class="text-muted">
            Como ya tienes una sesión activa, también puedes cambiar tu contraseña directamente 
            desde tu perfil en la aplicación.
          </p>
        `
      }
    }
  }

  showErrorMessage(message) {
    this.showError(message)
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new WalletFlowPasswordRecovery()
})
