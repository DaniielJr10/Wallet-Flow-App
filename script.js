window.addEventListener("DOMContentLoaded", () => {
  const stepEmail = document.getElementById("step-email");
  const stepCode = document.getElementById("step-code");
  const stepNewPassword = document.getElementById("step-new-password");

  document.getElementById("send-code").addEventListener("click", () => {
    stepEmail.classList.add("hidden");
    stepCode.classList.remove("hidden");
  });

  document.getElementById("verify-code").addEventListener("click", () => {
    stepCode.classList.add("hidden");
    stepNewPassword.classList.remove("hidden");
  });

  document.getElementById("reset-password").addEventListener("click", () => {
    alert("Simulación: contraseña restablecida.");
    window.location.href = "../Iniciodesesion/inicio.html";
  });
});
