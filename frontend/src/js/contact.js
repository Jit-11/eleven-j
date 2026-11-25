export function initializeContactForm() {
  const nameInput = document.querySelector("#n");
  const emailInput = document.querySelector("#e");
  const messageInput = document.querySelector("#m");
  const submitButton = document.querySelector("#go");
  const status = document.querySelector("#ok");

  if (!nameInput || !emailInput || !messageInput || !submitButton || !status) return;

  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  submitButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please provide your name, a valid email and a message.";
      return;
    }

    if (!emailInput.checkValidity()) {
      status.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }
    
    status.textContent = "The form is validated, but message delivery is not configured yet.";
  });
}
