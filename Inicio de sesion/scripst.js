function showLogin() {
    hideAll();
    document.getElementById('login-form').classList.remove('hidden');
  }
  
  function showForgot() {
    hideAll();
    document.getElementById('forgot-form').classList.remove('hidden');
  }
  
  function showRegister() {
    hideAll();
    document.getElementById('register-form').classList.remove('hidden');
  }
  
  function hideAll() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    document.getElementById('verify-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
  }
  
  function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (!email.includes('@')) {
      alert('Incluye un signo "@" en el correo electrónico.');
      return;
    }
    alert(`Iniciaste sesión con: ${email}`);
  }
  
  function sendRecoveryCode() {
    const email = document.getElementById('forgot-email').value;
    if (!email.includes('@')) {
      alert('Incluye un signo "@" en el correo electrónico.');
      return;
    }
    alert(`Se envió un código a: ${email}`);
    hideAll();
    document.getElementById('verify-form').classList.remove('hidden');
  }
  
  function verifyCode() {
    const code = document.getElementById('recovery-code').value;
    alert(`Código ingresado: ${code}`);
    showLogin();
  }
  
  function register() {
    const email = document.getElementById('register-email').value.trim();
    const id = document.getElementById('register-id').value.trim();
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const birthdate = document.getElementById('register-birthdate').value;
    const username = document.getElementById('register-username').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
  
    if (!email || !id || !firstname || !lastname || !birthdate || !username || !phone || !password || !confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    if (!email.includes('@')) {
      alert('El correo electrónico debe contener "@"');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
  
    alert(`¡Cuenta creada exitosamente para ${firstname} ${lastname} (${username})!`);
    showLogin();
  }
  