const ROUTES = ["home", "subscribe", "case-study", "blog", "contact"];
const VERIFY_PATH = "/verify-email";
const PAGE_TITLES = {
  home: "Eleven-J · Learn System Design & Networking",
  subscribe: "Subscribe · Eleven-J",
  "case-study": "Case Study · Eleven-J",
  blog: "Blog · Eleven-J",
  contact: "Contact · Eleven-J",
  "verify-email": "Verify email · Eleven-J",
  404: "404 · Eleven-J",
};

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function initializeRouter({ onHomeRoute, onVerifyRoute } = {}) {
  function renderRoute() {
    const hash = window.location.hash.slice(1);
    const onVerifyPath = currentPath() === VERIFY_PATH;

    // Leaving /verify-email through a menu link: switch the address back to "/"
    if (onVerifyPath && hash) {
      window.history.replaceState(null, "", `/#${hash}`);
    }

    let activeRoute;
    if (onVerifyPath && !hash) {
      activeRoute = "verify-email";
    } else {
      const requested = hash || "home";
      activeRoute = ROUTES.includes(requested) ? requested : "404";
    }

    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("on", view.id === `v-${activeRoute}`);
    });

    document.querySelectorAll("#nav a[data-r]").forEach((link) => {
      if (link.dataset.r === activeRoute) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    document.title = PAGE_TITLES[activeRoute];
    if (activeRoute === "home") onHomeRoute?.();
    if (activeRoute === "verify-email") onVerifyRoute?.();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
