# Product Requirements Document (PRD)

**Product:** Conduit  
**Owner:** Camila  
**Status:** Draft — as-built + near-term intent  
**Last updated:** 2026-05-05

---

## 1. Vision & success

**Vision:** Deliver a Conduit-style “medium for ideas” where users sign up, sign in, and consume and share knowledge—starting with a credible local stack (React + Fastify + SQLite) aligned with the RealWorld Conduit demo.

**Success (near term):**

- A new developer can run frontend + backend locally and complete **register → login → see authenticated chrome**.
- **Home** loads article data from the API (not only static HTML).
- **Protected** areas behave consistently with **token in `localStorage`**.

---

## 2. Problem statements

| ID | Problem | Impact |
|----|---------|--------|
| P1 | Learners need a **small, real** full-stack slice (auth + API + SPA) without cloud complexity. | Without it, practice stays toy-level or tutorial-only. |
| P2 | Conduit/RealWorld expects **consistent UX** (nav, feed, auth) while the team iterates on API completeness. | Confusing routes or broken guards undermine the demo goal. |
| P3 | **Session state** must stay understandable (token storage, when header updates). | Bugs block trust in “I’m logged in” and route protection. |

---

## 3. Personas

1. **Visitor Alex** — Wants to skim the home feed and maybe register.
2. **Member Morgan** — Wants to log in, see “my” nav, open settings/editor/profile.
3. **Developer Dana** — Wants clear runbooks, API contracts, and gaps documented for the next sprint.

---

## 4. User journeys

### J4.1 Register

1. Open `/register`.
2. Submit username, email, password.
3. System creates user in SQLite and returns user + token.
4. User lands in app as authenticated (or is prompted to log in, per product decision).
5. **Happy end:** user appears in DB; can log in later with same email.

### J4.2 Login

1. Open `/login`.
2. Submit email + password.
3. API validates; client stores token.
4. User sees **authenticated** header and can open protected routes.
5. **Sad path:** invalid credentials → clear error, no token.

### J4.3 Browse home feed (API-backed)

1. Open `/`.
2. Client requests `GET /api/articles`.
3. Feed reflects returned articles (titles, links, meta).
4. **Happy end:** no console-only flow; UI matches API.

### J4.4 Protected area

1. Without token, visit `/settings` (or `/editor`, `/profile/:username`).
2. Redirect to `/login` with replace.
3. After login, same URL works.

---

## 5. Epics, stories & acceptance criteria

### Epic E1 — Local platform & developer experience

| ID | Story | Acceptance criteria |
|----|--------|---------------------|
| E1-S1 | Run frontend locally | `npm install && npm run dev` serves app; README documents port. |
| E1-S2 | Run backend locally | `cd src/backend && npm install && npm run dev` serves API on agreed port; CORS allows dev origin. |
| E1-S3 | README matches reality | Documents JSX (not TS if app is JS), backend path, two-terminal runbook. |

### Epic E2 — Identity & session

| ID | Story | Acceptance criteria |
|----|--------|---------------------|
| E2-S1 | Register API | `POST /api/users` persists user with hashed password; 422 on duplicate; 201 with `user` + `token` on success. |
| E2-S2 | Login API | `POST /api/users/login` returns 200 + token on valid pair; 401 on invalid. |
| E2-S3 | Client token storage | Token stored in `localStorage` after login; **documented** refresh/UX behavior. |
| E2-S4 | Auth chrome | Navbar reflects authenticated vs guest state **reliably** (define: after login without full page reload, if required). |
| E2-S5 | Protected routes | No token → redirect to `/login`; with token → child route renders. **Guard must call a defined `getToken` (import/context).** |

### Epic E3 — Home & articles (read path)

| ID | Story | Acceptance criteria |
|----|--------|---------------------|
| E3-S1 | List articles API | `GET /api/articles` returns stable JSON shape (RealWorld-like fields). |
| E3-S2 | Home consumes API | On load, fetch articles; **render** at least title/slug/author in feed (not only `console.log`). |
| E3-S3 | Error/empty states | Network failure shows user-visible message or empty state (product picks tone). |

### Epic E4 — Shell pages (Conduit parity path)

| ID | Story | Acceptance criteria |
|----|--------|---------------------|
| E4-S1 | Editor route | `/editor` reachable when authenticated; placeholder or real form per sprint scope. |
| E4-S2 | Profile route | `/profile/:username` resolves param and shows placeholder or real data. |
| E4-S3 | Settings route | `/settings` reachable when authenticated. |

---

## 6. Non-functional requirements

- **Security:** Passwords never stored plain; tokens not logged in production; document that API does not yet verify token on article routes.
- **Performance:** Home article list acceptable for < 100 mock rows on localhost.
- **Maintainability:** Single source of truth for API base URL (env), not hard-coded duplicates (future story).

---

## 7. Out of scope (this PRD cycle)

- Production deployment, HTTPS, rate limiting.
- Full article CRUD + comments + favorites in SQLite.
- JWT + server-side session store.

---

## 8. Dependencies & risks

| Risk | Mitigation |
|------|------------|
| `auth` in context stale after `setToken` | Introduce `useState` + `useEffect` or reload strategy; align with UX. |
| `getToken` not imported in `ProtectedRoute` | Fix imports or unify on context; add smoke test for protected nav. |
| Hard-coded API URL | Add `VITE_API_URL` and document. |

---

## 9. Open decisions

1. After **register**, auto-login with returned token vs redirect to **login**?
2. Replace mock articles with DB now or keep mock until auth is solid?
3. Align **Home** `Header` vs global **AuthLayout** headers to avoid duplicate nav (if any).
