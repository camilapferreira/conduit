# Conduit — Epics, user stories & task breakdown

**Author:** John (Product Manager)  
**Owner:** Camila  
**Basis:** `conduit-prd.md`, `conduit-frontend-architecture.md`, current repo  
**Last updated:** 2026-05-12  

This document **extends** the PRD story list (§5) with **implementation tasks** and adds **missing** epics/stories toward Conduit / RealWorld parity.  

**Status legend:** `Done` · `Partial` · `Not started`

---

## How to use this file

- **Epic** → **Stories** (acceptance stays aligned with PRD where IDs match **E1–E4**).  
- **Tasks** are ordered, small enough for one PR or one focused session.  
- Update **Status** when work ships so planning stays honest.

---

## Epic E1 — Local platform & developer experience

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E1-S1 | Run frontend locally | Done |
| E1-S2 | Run backend locally | Done |
| E1-S3 | README matches reality | Partial — confirm ports, JSX, two-terminal flow, `.env.example` |

### E1-S1 — Run frontend locally

| # | Task | Status |
| - | ---- | ------ |
| T1.1 | Vite + React app boots with `npm install && npm run dev` | Done |
| T1.2 | Document default dev port in README | Partial — verify |

### E1-S2 — Run backend locally

| # | Task | Status |
| - | ---- | ------ |
| T1.3 | Fastify server runs from `src/backend` with `npm install && npm run dev` | Done |
| T1.4 | CORS allows frontend origin (`@fastify/cors`, `origin: true` or explicit) | Done |

### E1-S3 — README matches reality

| # | Task | Status |
| - | ---- | ------ |
| T1.5 | README: frontend JSX (not TS), paths, `VITE_API_URL` | Partial |
| T1.6 | README: exact commands for backend + frontend | Partial |
| T1.7 | Optional: root `package.json` script to run both | Not started |

---

## Epic E2 — Identity & session

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E2-S1 | Register API | Done |
| E2-S2 | Login API | Done |
| E2-S3 | Client token storage | Done |
| E2-S4 | Auth chrome | Done |
| E2-S5 | Protected routes | Done |

### E2-S1 — Register API

| # | Task | Status |
| - | ---- | ------ |
| T2.1 | `POST /api/users` validates username, email, password | Done |
| T2.2 | Password hashed before persist (current: SHA-256 + salt — plan upgrade to bcrypt/argon2 for production) | Done |
| T2.3 | 422 on duplicate email/username | Done |
| T2.4 | 201 returns `user` + `token` | Done |

### E2-S2 — Login API

| # | Task | Status |
| - | ---- | ------ |
| T2.5 | `POST /api/users/login` 200 with token on valid credentials | Done |
| T2.6 | 401 on invalid credentials with stable error shape | Done |

### E2-S3 — Client token storage

| # | Task | Status |
| - | ---- | ------ |
| T2.7 | Token in `localStorage` after login/register | Done |
| T2.8 | Document behavior on refresh and multi-tab (`storage` event if implemented) | Partial |
| T2.9 | **Gap:** server does not validate token on protected API routes — see **E8** | Not started |

### E2-S4 — Auth chrome

| # | Task | Status |
| - | ---- | ------ |
| T2.10 | `AuthLayout` swaps `HeaderAuthenticated` / `HeaderUnauthenticated` from context | Done |
| T2.11 | After login, header updates without full page reload | Done |

### E2-S5 — Protected routes

| # | Task | Status |
| - | ---- | ------ |
| T2.12 | `ProtectedRoute` uses same auth source as header (`AuthContext`) | Done |
| T2.13 | No token → redirect `/login` with replace | Done |

### Follow-up (product + UX)

| # | Task | Status |
| - | ---- | ------ |
| T2.14 | Login & register **UI** show API errors (not only `console.error`) | Not started |
| T2.15 | Resolve PRD open decision: register → auto-login vs redirect to login; implement + document | Not started |

---

## Epic E3 — Home & articles (read path)

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E3-S1 | List articles API | Partial — mock in `server.js`, shape close to list |
| E3-S2 | Home consumes API | Done |
| E3-S3 | Error/empty states | Done |

### E3-S1 — List articles API

| # | Task | Status |
| - | ---- | ------ |
| T3.1 | `GET /api/articles` returns JSON with slug, title, description, author, tags, dates | Done (mock) |
| T3.2 | **RealWorld:** response wrapper `{ articles, articlesCount }` + optional pagination | Not started |
| T3.3 | Persist articles in SQLite; replace inline mock | Not started |

### E3-S2 — Home consumes API

| # | Task | Status |
| - | ---- | ------ |
| T3.4 | Home fetches on load via shared `api` client | Done |
| T3.5 | Renders `ArticlePreview` (title, meta, link) | Done |

### E3-S3 — Error/empty states

| # | Task | Status |
| - | ---- | ------ |
| T3.6 | Loading + error + empty copy on Home | Done |

---

## Epic E4 — Shell pages (Conduit parity path)

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E4-S1 | Editor route | Partial — form exists; submit not wired |
| E4-S2 | Profile route | Partial — client filter from list API |
| E4-S3 | Settings route | Partial — form + logout; persist profile not wired |

### E4-S1 — Editor route

| # | Task | Status |
| - | ---- | ------ |
| T4.1 | `/editor` behind `ProtectedRoute` | Done |
| T4.2 | Article form (title, description, body, tags) with react-hook-form | Done |
| T4.3 | **POST** article to API + navigate to `/article/:slug` | Not started |
| T4.4 | **PUT** article when editing by slug | Not started |

### E4-S2 — Profile route

| # | Task | Status |
| - | ---- | ------ |
| T4.5 | `/profile/:username` resolves param | Done |
| T4.6 | Lists articles for author (today: client-side filter on list response) | Partial |
| T4.7 | **Product:** public profile vs auth-only — align with RealWorld (visitors see profiles) | Not started |
| T4.8 | **GET** `/api/profiles/:username` (+ articles query if split from list) | Not started |

### E4-S3 — Settings route

| # | Task | Status |
| - | ---- | ------ |
| T4.9 | `/settings` protected | Done |
| T4.10 | Logout clears token and navigates home | Done |
| T4.11 | **PUT** `/api/user` (or RealWorld-equivalent) updates profile | Not started |

---

## Epic E5 — Article detail (read) — **added**

**Goal:** Feed → article page works end-to-end (`/article/:slug` + API).

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E5-S1 | Single-article API | Not started |
| E5-S2 | Article route & UI | Partial — `Article.jsx` exists; **no route in `App.jsx`**; backend has no `GET /api/articles/:slug` in current `server.js` |

### E5-S1 — Single-article API

| # | Task | Status |
| - | ---- | ------ |
| T5.1 | `GET /api/articles/:slug` returns `{ article }` or 404 with errors object | Not started |
| T5.2 | Same data source as list (mock → DB when E3-S1 persists) | Not started |

### E5-S2 — Article page route & UI

| # | Task | Status |
| - | ---- | ------ |
| T5.3 | Register public route `/article/:slug` → `Article` in `App.jsx` | Not started |
| T5.4 | `Article.jsx` calls detail API; loading/error/404 UX | Partial |
| T5.5 | Comments: placeholder until E7 | Partial |

---

## Epic E6 — Engagement (favorites, tags, follow) — **added** (backlog)

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E6-S1 | Favorite / unfavorite article | Not started |
| E6-S2 | Follow / unfollow author | Not started |
| E6-S3 | Filter feed by tag | Not started |

| # | Task | Status |
| - | ---- | ------ |
| T6.1 | Favorites `POST`/`DELETE` + auth (**E8**) | Not started |
| T6.2 | Follow `POST`/`DELETE` + auth | Not started |
| T6.3 | `GET /api/articles?tag=` or dedicated tag feed | Not started |

---

## Epic E7 — Comments — **added** (backlog)

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E7-S1 | List comments for article | Not started |
| E7-S2 | Post comment (authenticated) | Not started |

| # | Task | Status |
| - | ---- | ------ |
| T7.1 | Schema: `comments` + FK to articles | Not started |
| T7.2 | `GET /api/articles/:slug/comments` | Not started |
| T7.3 | `POST /api/articles/:slug/comments` with auth | Not started |
| T7.4 | Enable comment form in `Article.jsx` | Not started |

---

## Epic E8 — API authentication for protected operations — **added**

**Goal:** Mutations and user-scoped reads validate `Authorization: Token …` (or chosen scheme).

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E8-S1 | Persist or sign tokens server-side | Not started |
| E8-S2 | Shared Fastify `preHandler` / decorator for auth | Not started |
| E8-S3 | Document public vs authenticated routes | Not started |

| # | Task | Status |
| - | ---- | ------ |
| T8.1 | Store token on login/register (table or JWT) | Not started |
| T8.2 | Validate header; 401 when missing/invalid | Not started |
| T8.3 | Apply to article create/update, user update, favorites, follows, comments | Not started |

---

## Epic E9 — Quality & product polish — **added**

| Story ID | Summary | Status |
| -------- | ------- | ------ |
| E9-S1 | Smoke / E2E (auth + protected nav) | Not started |
| E9-S2 | Client API error surfacing | Partial |
| E9-S3 | Header profile link = **current user** | Not started |

| # | Task | Status |
| - | ---- | ------ |
| T9.1 | Minimal E2E: login → `/settings` | Not started |
| T9.2 | Inline errors on login/register/settings/editor | Not started |
| T9.3 | After login, persist or derive username for `NavLink` (replace hard-coded `/profile/test`) | Not started |
| T9.4 | Optional: hide `/components` in production build | Not started |

---

## Suggested next slice (priority)

1. **E5** — Article detail API + `/article/:slug` route.  
2. **E2** T2.14, T2.15 — form errors + post-register decision.  
3. **E8** — server-side token validation.  
4. **E4** T4.3, T4.11 — create article + update user.  
5. **E3** T3.2, T3.3 — RealWorld list envelope + DB.

---

## Traceability

| PRD | This document |
| --- | ------------- |
| §5 E1–E4 | Stories preserved; tasks + status added |
| §7 Out of scope | E5–E9 captured as **backlog** / next slices |
| §9 Open decisions | T2.15, T4.7 |

**Related:** `conduit-frontend-architecture.md` (technical decisions).
