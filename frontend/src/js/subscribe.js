import { ENDPOINTS } from "./config.js";
import { postJson } from "./api.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COOLDOWN_SECONDS = 60;

// Returns "" when valid, otherwise a message to show the user.
export function validateEmail(value) {
    const email = value.trim();
    if (!email) return "Please enter your email.";
    if (email.length > 254) return "That email is too long.";
    if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
    return "";
}

export function initializeSubscribeForm() {
    const form = document.querySelector("#sub-form");
    const input = document.querySelector("#sub-email");
    const button = document.querySelector("#sub-btn");
    const status = document.querySelector("#sub-status");
    if (!form || !input || !button || !status) return;

    const label = button.textContent;
    let timer = null;

    function show(message, type = "") {
        status.textContent = message;
        status.className = `status ${type}`.trim();
        input.setAttribute("aria-invalid", String(type === "err"));
    }

    function startCooldown() {
        let left = COOLDOWN_SECONDS;
        button.disabled = true;
        const tick = () => {
            if (left <= 0) {
                clearInterval(timer);
                button.disabled = false;
                button.textContent = label;
                return;
            }
            button.textContent = `Resend in ${left}s`;
            left -= 1;
        };
        tick();
        timer = setInterval(tick, 1000);
    }

    input.addEventListener("input", () => {
        if (status.classList.contains("err")) show("");
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (button.disabled) return;

        const problem = validateEmail(input.value);
        if (problem) {
            show(problem, "err");
            input.focus();
            return;
        }

        button.disabled = true;
        button.textContent = "Sending…";
        show("");

        const result = await postJson(ENDPOINTS.subscribe, {
            email: input.value.trim().toLowerCase(),
        });

        if (result.ok) {
            show("Check your inbox. If this address can be verified, we sent a link to it.", "ok");
            startCooldown();
            return;
        }

        button.disabled = false;
        button.textContent = label;

        if (result.networkError) {
            show("Can’t reach the server. Check your connection and try again.", "err");
        } else if (result.status === 400) {
            show(result.data?.fieldErrors?.email || "Please enter a valid email address.", "err");
        } else if (result.status === 429) {
            show("Too many requests. Please wait a moment and try again.", "err");
        } else if (result.status === 503) {
            show(result.data?.message || "We couldn’t send the email right now. Please try again later.", "err");
        } else {
            show("Something went wrong. Please try again.", "err");
        }
    });
}
