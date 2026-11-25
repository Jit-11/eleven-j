# Eleven-J

A modular Vite + vanilla JavaScript version of the supplied Eleven-J single-page website.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The optimized static site is generated in `dist/`. Deploy the contents of `dist/` to any static hosting provider.

## Project structure

```text
eleven-j/
├── index.html
├── public/
├── src/
│   ├── data/
│   │   └── logo-animation.js
│   ├── js/
│   │   ├── contact.js
│   │   ├── logo.js
│   │   ├── main.js
│   │   ├── router.js
│   │   └── theme.js
│   └── styles.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Architecture notes

- `main.js` is the application entry point.
- `router.js` owns hash-based page navigation and page titles.
- `theme.js` owns theme selection and persistence.
- `logo.js` initializes the Lottie animation.
- `data/logo-animation.js` contains the original embedded Lottie animation data.
- `contact.js` validates the contact form.

## Before calling this production-ready

The contact form is intentionally frontend-only. It validates input but does not deliver messages. Connect it to a backend/API endpoint or a trusted form service before accepting real submissions. Add server-side validation, rate limiting, spam protection and appropriate privacy disclosures.

Also configure your deployment platform's SPA fallback so unknown paths serve `index.html` if you later move from hash routing to history routing. With the current hash router, the server does not need to resolve each hash route.

## Subscribe and email verification

- `#subscribe` page: one email field with client-side validation. It calls `POST /api/v1/subscribe` with `{"email": "..."}`.
- The backend emails a link like `http://localhost:3000/verify-email?token=...`.
- `/verify-email` reads `token`, calls `POST /api/v1/verify` with `{"token": "..."}` and shows the result for the status `SUCCESS`, `VERIFIED`, `ALREADY_USED`, `EXPIRED` or `INVALID`. The token is removed from the address bar afterwards.
- Endpoint paths are defined in `src/js/config.js`. `vite.config.js` serves the dev site on port 3000 and proxies `/api` to `BACKEND_URL`.
- Production: the host must serve `index.html` for `/verify-email` (SPA fallback), and the backend setting `app.verify-url` must be `https://yoursite.com/verify-email`.
