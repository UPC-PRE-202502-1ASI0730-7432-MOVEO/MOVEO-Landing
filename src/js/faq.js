document.addEventListener("DOMContentLoaded", () => {
  // ----- TOGGLE RESPUESTAS -----
  const questions = document.querySelectorAll(".faq__question");

  questions.forEach(q => {
    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;
      const isOpen = q.getAttribute("aria-expanded") === "true";

      q.setAttribute("aria-expanded", !isOpen);

      if (isOpen) {
        // Cerrar respuesta
        answer.style.maxHeight = null;
        answer.classList.remove("show");
      } else {
        // Abrir respuesta
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.classList.add("show");
      }
    });
  });

  // ----- TABS FAQ -----
  const tabs = document.querySelectorAll(".faq__tab");
  const tabContents = document.querySelectorAll(".faq__tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Activar pestaña
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Mostrar solo contenido de la pestaña
      tabContents.forEach(tc => {
        if (tc.id === target) {
          tc.classList.add("active");

          // Cerrar todas las respuestas dentro de la pestaña activa
          tc.querySelectorAll(".faq__answer").forEach(ans => {
            ans.style.maxHeight = null;
            ans.classList.remove("show");
          });
          tc.querySelectorAll(".faq__question").forEach(q => q.setAttribute("aria-expanded", false));
        } else {
          tc.classList.remove("active");
        }
      });
    });
  });
});
