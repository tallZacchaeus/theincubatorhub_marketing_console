# Incubator Marketing Console

Standalone admin SPA for The Incubator's marketing campaigns. Deployed to its own
subdomain (e.g. `marketing.theincubatorhub.com`) and **shares the admin session**
with the main app via the shared Laravel API + a parent-domain session cookie.

This is a **React rebuild** of the original Vue console — same backend, same API
contract, redesigned to match the main app admin and to be usable by a
non-marketer. The original Vue source is preserved under `legacy-vue/` as the
functional spec (it is **not** part of the build).

## Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS 3 + shadcn/ui** (Radix primitives), `lucide-react` icons, Inter
  type — themed via CSS variables in `src/index.css` / `tailwind.config.ts` to the
  main app tokens (green `#16a34a`, ink `#111827`, app bg `#f5f7fa`, `rounded-2xl`
  cards, pill badges).
- **TanStack Query** (server state) + **axios** (Sanctum stateful client)
- **react-router-dom** (routing + admin guard)
- **react-hook-form + zod** (forms/validation), **@tanstack/react-table**
  (DataTable), **recharts** (analytics charts)
- **driver.js** (guided walkthrough)
- **gsap + @gsap/react** (motion layer — all animations respect
  `prefers-reduced-motion`)

## Auth

Sanctum stateful-cookie flow, gated on `role === 'admin'`. One login shared with
the main app once `SESSION_DOMAIN` spans the apex. The axios client primes
`GET /sanctum/csrf-cookie` before mutations and rehydrates the session via
`GET /api/student/me` on load (`src/api/client.ts`, `src/auth/AuthContext.tsx`).

## Pages & routes

UI labels are plain-language; backend endpoint paths are unchanged.

| Route | Page | Backend |
|---|---|---|
| `/` | **Home** — campaign overview | `/api/admin/marketing/broadcasts` |
| `/contacts` | **Contacts** — leads, import, unsubscribe | `/api/admin/marketing/contacts` |
| `/audiences` | **Audiences** — filtered segments (was Categories) | `/api/admin/marketing/categories` |
| `/templates` | **Email templates** | `/api/admin/marketing/email-templates` |
| `/campaigns`, `/campaigns/:id` | **Campaigns** + detail (was Broadcasts) | `/api/admin/marketing/broadcasts`, `/links` |
| `/analytics` | **Analytics** | `/api/admin/marketing/broadcasts/{id}/analytics` |
| `/settings` | **Settings** | — |
| `/help` | **Help & glossary** + guided walkthrough | — |
| `/login` | Sign in (public) | `/api/login`, `/api/student/me`, `/api/logout` |

Tracked-link types are shown as **Bring new people / Re-engage existing /
Referral** (backend: `acquisition` / `reengagement` / `referral`).

## Develop

```bash
cp .env.example .env   # set VITE_API_BASE_URL to the API host
npm install
npm run dev            # http://localhost:5174
npm run build          # type-check (tsc) + production build to dist/
npm run preview        # serve the production build locally
```

Environment:

- `VITE_API_BASE_URL` — base URL of the shared Laravel API (default
  `http://localhost:8080`).

There is no separate lint step; `npm run build` runs `tsc` in strict mode
(`noUnusedLocals`/`noUnusedParameters`) as the type/lint gate.

## Backend requirements (set on the shared API; staging first)

- `marketing.enabled` (config) — the marketing API is gated behind this flag.
- `SANCTUM_STATEFUL_DOMAINS` includes this app's host.
- CORS allowed origins include this app's origin (with credentials).
- `SESSION_DOMAIN=.theincubatorhub.com` so the session cookie is shared across
  subdomains. **Changing this logs existing sessions out — schedule it.**

The backend mailer/ESP and delivery webhooks are configured server-side; consent
and the suppression (do-not-email) list are enforced on every send.

## Guided walkthrough

A first-run, re-runnable tour (driver.js) teaches the 5-step flow
(audience → template → campaign → tracked links → preview/test-send → results).
It only navigates and highlights — it never sends. It shows once on first visit
(gated by `localStorage['mc_tour_seen']`) and can be re-run anytime from the
top-bar **?** menu or the **Help & glossary** page.

## Accessibility & motion

- Keyboard-navigable; visible green focus rings; `aria-label` on icon-only
  buttons; `aria-current` on the active nav item; `aria-sort` on sortable tables.
- All motion (GSAP + CSS) honours `prefers-reduced-motion: reduce` — animations
  degrade to final-state and the app stays fully usable.

## Project layout

- `src/api/` — Sanctum client, endpoint modules, error helper, types
- `src/auth/` — auth context + admin route guard
- `src/components/` — shell, design-system kit (`ui/`), glossary, motion, tour
- `src/content/` — glossary + link-type copy
- `src/pages/` — the routed pages (`dev/ComponentsShowcase` is dev-only, not
  mounted in production builds)
- `legacy-vue/` — original Vue console, kept as the functional spec; excluded
  from the build
