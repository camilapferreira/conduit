# Conduit — Frontend Architecture

**Author:** Winston (System Architect)  
**Basis:** `conduit-prd.md` (this folder)  
**Stack:** React 18, Vite 7, React Router DOM v7, axios, react-hook-form  
**Status:** As-implemented + intentional gaps  
**Last updated:** 2026-03-30

---

## 1. Scope and goals

The frontend is a **single-page application (SPA)** whose **only interactive UI is React**. The browser loads `index.html`, which mounts one root at `#root` via `src/main.jsx`. All product-facing screens live as **function components** under `src/pages/`. Layout and cross-cutting concerns (auth chrome, API client) sit under `src/components/` and `src/api/`.

**Near-term alignment with the PRD:** credible Conduit-style UX, API-backed home feed where the backend supports it, and **token-based auth** with predictable protected navigation.

---

## 2. Runtime architecture

### 2.1 Entry and rendering

| Artifact | Role |
|----------|------|
| `index.html` | Shell: `#root` + module entry |
| `src/main.jsx` | `createRoot(...).render(<StrictMode><App /></StrictMode>)` |
| `src/App.jsx` | `BrowserRouter`, providers, `Routes` / `Route` tree |

**Invariant:** There is **no parallel non-React page system** (no separate MPA routes, no server-rendered templates for app screens). Styling uses shared CSS (`index.css`, `App.css`, `styles.css` as referenced by the project).

### 2.2 Routing and layouts

- **Router:** `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `Navigate`, `Link` / `NavLink` in leaf components).
- **Layout:** `AuthLayout` wraps public + guarded routes and chooses **authenticated vs unauthenticated header** from auth context, then renders child routes via `<Outlet />`.
- **Guards:** `ProtectedRoute` renders `<Outlet />` when the user is authenticated; otherwise `<Navigate to="/login" replace />`.

This keeps **one source of truth** for “logged in” (context + `localStorage`-backed token) for both the header and protected segments.

---

## 3. Page inventory — every page is React

All product routes are implemented as **`.jsx` React components** in `src/pages/`. None of these are static HTML files or non-React templates.

| Path (as in `App.jsx`) | React page component | Source file |
|------------------------|----------------------|-------------|
| `/` | `Home` | `src/pages/Home.jsx` |
| `/components` | `Components` | `src/pages/Components.jsx` |
| `/login` | `Login` | `src/pages/Login.jsx` |
| `/register` | `Register` | `src/pages/Register.jsx` |
| `/editor` | `ArticleEditCreate` | `src/pages/ArticleEditCreate.jsx` |
| `/profile/:username` | `Profile` | `src/pages/Profile.jsx` |
| `/settings` | `Settings` | `src/pages/Settings.jsx` |

**Additional React page module:** `src/pages/Article.jsx` — implements **article detail** as a React component. **`App.jsx` does not yet declare a route** for it; add e.g. `/article/:slug` when links from `ArticlePreview` should resolve inside the SPA.

**Guarantee (precise):** Every screen under `src/pages/` is a **React function component** in JSX. The SPA **always** mounts through `main.jsx` → `App.jsx`.

---

## 4. State and authentication

- **`AuthProvider`** (`src/components/AuthProvider.jsx`): holds auth/token in React state, persists token (e.g. `localStorage`), exposes `useAuth()` (`setToken`, `removeToken`, `auth`).
- **Cross-tab:** optional sync via `storage` event (when implemented in the provider).
- **Protected routes:** depend on the same `auth` boolean as the header to avoid “header says logged in but route disagrees” drift.

**Trade-off:** Client-only token storage is simple for a local demo; production hardening (httpOnly cookies, refresh tokens, CSRF) is out of scope for this note but should be explicit before any public deployment.

---

## 5. Data layer

- **HTTP:** centralized axios instance `src/api/client.js` with `baseURL` from `import.meta.env.VITE_API_URL` (trimmed) and fallback to `http://localhost:3000`.
- **Forms:** `react-hook-form` on auth, settings, and editor pages for controlled-yet-lightweight inputs.
- **Article list/detail:** align with Fastify routes as implemented (`GET /api/articles`, detail when present); loading/error/empty states in page components.

---

## 6. UI composition

- **Layout helpers:** e.g. `HomeLayout` (header/footer slots + main content).
- **Reuse:** `ArticlePreview` for list cards; shared date helpers under `src/utils/`.
- **Navigation:** prefer `Link` / `NavLink` for in-app navigation to preserve SPA behavior.

---

## 7. Non-functional notes

- **Build:** `vite build` produces static assets; dev uses Vite HMR.
- **Env:** document `VITE_API_URL` for non-default API hosts (see `.env.example` if present).
- **Accessibility / i18n:** follow incremental improvement; not blocking for the current PRD slice.

---

## 8. Known gaps and decisions (explicit trade-offs)

1. **`Article.jsx` routing:** Component exists in React; add a `Route` (e.g. `/article/:slug`) consistent with `ArticlePreview` links so detail is reachable without a full reload.
2. **Profile visibility:** `Profile` is under `ProtectedRoute` (login required). Change only if the PRD requires public profiles (RealWorld Conduit typically allows viewing profiles while logged out).
3. **Editor/settings:** wire submit handlers to real endpoints when the API is ready; until then, local validation + console or stub responses are acceptable for scaffolding.

---

## 9. Traceability to PRD

| PRD theme | Frontend realization |
|-----------|----------------------|
| Register / login journeys | `Register.jsx`, `Login.jsx`, `AuthProvider`, API client |
| Home feed API-backed | `Home.jsx` + articles API |
| Authenticated chrome | `AuthLayout`, `HeaderAuthenticated` / `HeaderUnauthenticated` |
| Protected editor/settings | `ProtectedRoute` + `ArticleEditCreate.jsx`, `Settings.jsx` |

---

## 10. Repository pointers

| Path | Purpose |
|------|---------|
| `_bmad-output/planning-artifacts/conduit-prd.md` | Product requirements |
| `src/main.jsx` | SPA bootstrap |
| `src/App.jsx` | Route table |
| `src/api/client.js` | API base URL + axios defaults |
| `src/components/AuthProvider.jsx` | Token + `useAuth()` |
| `src/components/ProtectedRoute.jsx` | `AuthLayout`, `ProtectedRoute` |
