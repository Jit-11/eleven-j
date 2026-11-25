import { initializeTheme } from "./theme.js";
import { initializeRouter } from "./router.js";
import { initializeLogoAnimation } from "./logo.js";
import { initializeContactForm } from "./contact.js";
import { initializeSubscribeForm } from "./subscribe.js";
import { runEmailVerification } from "./verify.js";

initializeTheme();
initializeContactForm();
initializeSubscribeForm();

initializeRouter({
    onHomeRoute: initializeLogoAnimation,
    onVerifyRoute: runEmailVerification,
});
