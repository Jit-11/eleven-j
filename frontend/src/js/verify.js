import { ENDPOINTS } from "./config.js";
import { postJson } from "./api.js";

// What to show for each status the API can return.
const RESULTS = {
    SUCCESS: { state: "ok", title: "Email verified ✔", text: "Thanks! Your email is confirmed." },
    VERIFIED: { state: "ok", title: "Already verified", text: "This email is already verified. You’re all set." },
    ALREADY_USED: { state: "warn", title: "Link already used", text: "This link was used before. If you already verified, you’re all set." },
    EXPIRED: { state: "err", title: "Link expired", text: "This link is too old. Subscribe again to get a new one.", retry: true },
    INVALID: { state: "err", title: "Invalid link", text: "We couldn’t verify this link. It may be incomplete or wrong.", retry: true },
};
// If the body has no status, fall back to the HTTP code.
const STATUS_BY_HTTP = { 200: "SUCCESS", 400: "INVALID", 409: "ALREADY_USED", 410: "EXPIRED" };

let inFlight = false;
let finished = false;

function render(result) {
    const card = document.querySelector("#verify-card");
    card.dataset.state = result.state;
    document.querySelector("#verify-title").textContent = result.title;
    document.querySelector("#verify-text").textContent = result.text;
    document.querySelector("#verify-retry").hidden = !result.retry;
}

// Called by the router whenever the /verify-email page is shown.
export async function runEmailVerification() {
    if (inFlight || finished) return;

    const token = (new URLSearchParams(window.location.search).get("token") || "").trim();
    if (!token) {
        finished = true;
        render(RESULTS.INVALID);
        return;
    }

    inFlight = true;
    const result = await postJson(ENDPOINTS.verify, { token });
    inFlight = false;

    if (result.networkError || result.status >= 500) {
        render({
            state: "err",
            title: "Couldn’t verify right now",
            text: result.networkError
                ? "We couldn’t reach the server. Refresh this page to try again."
                : "Something went wrong on our side. Refresh this page to try again.",
        });
        return; // keep the token in the URL so a refresh can retry
    }

    const code = String(result.data?.status ?? "").toUpperCase() || STATUS_BY_HTTP[result.status];
    render(RESULTS[code] ?? RESULTS.INVALID);
    finished = true;

    // Remove the secret token from the address bar and browser history.
    window.history.replaceState(null, "", window.location.pathname);
}
