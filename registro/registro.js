document.addEventListener("DOMContentLoaded", () => {
    const steps = Array.from(document.querySelectorAll(".form-step"));
    const nextBtns = document.querySelectorAll(".next-step");
    const prevBtns = document.querySelectorAll(".prev-step");
    const progress = document.getElementById("formProgress");
    const form = document.getElementById("multiStepForm");
  
    let currentStep = 0;
  
    const updateFormSteps = () => {
      steps.forEach((step, i) => {
        step.classList.toggle("d-none", i !== currentStep);
      });
      const pct = (currentStep + 1) / steps.length * 100;
      progress.style.width = `${pct}%`;
      progress.setAttribute("aria-valuenow", pct);
    };
  
    nextBtns.forEach(btn => btn.addEventListener("click", () => {
      const inputs = steps[currentStep].querySelectorAll("input");
      for (let inp of inputs) {
        if (!inp.checkValidity()) return inp.reportValidity();
      }
      currentStep++;
      updateFormSteps();
    }));
  
    prevBtns.forEach(btn => btn.addEventListener("click", () => {
      currentStep--;
      updateFormSteps();
    }));
  
    form.addEventListener("submit", e => {
      e.preventDefault();
      // Aquí puedes enviar datos al servidor o simularlo:
      alert("¡Registro completo!");
    });
  });
  