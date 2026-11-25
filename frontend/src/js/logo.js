import { logoAnimation } from "../data/logo-animation.js";

let animationInstance;

export function initializeLogoAnimation() {
  const container = document.querySelector("#logoAnim");
  if (!container || animationInstance) return;

  animationInstance = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: logoAnimation,
  });

  // Respect reduced-motion preferences.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animationInstance.pause();
  }
}
