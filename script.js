const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const thankYouModal = document.querySelector(".thank-you-modal");
const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-ok");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    if (!contactForm.checkValidity()) {
      return;
    }

    window.setTimeout(() => {
      thankYouModal?.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      contactForm.reset();
    }, 250);
  });
}

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    thankYouModal?.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
  });
});

thankYouModal?.addEventListener("click", (event) => {
  if (event.target === thankYouModal) {
    thankYouModal.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
  }
});
