const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");

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
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const updates = formData.get("updates") === "yes" ? "Yes" : "No";

    const subject = `New enquiry from ${name || "Evershine website"}`;
    const body = [
      "New enquiry from Evershine Learning Academy website",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Updates requested: ${updates}`,
      "",
      "Message:",
      message || "No message provided.",
    ].join("\n");

    const mailto = `mailto:evershineacademytcr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
