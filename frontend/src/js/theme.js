const THEME_KEY = "eleven-j-theme";
const root = document.documentElement;
const toggle = document.querySelector("#theme");

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getTheme() {
  return root.dataset.theme || systemTheme();
}

function renderThemeButton() {
  if (!toggle) return;
  const dark = getTheme() === "dark";
  toggle.textContent = dark ? "☀ Light" : "☾ Dark";
  toggle.setAttribute("aria-pressed", String(dark));
}

export function initializeTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }

  renderThemeButton();

  toggle?.addEventListener("click", () => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Theme still works for the current page session.
    }
    renderThemeButton();
  });
}
