# Incubator Marketing Console

Standalone admin SPA for The Incubator's marketing campaigns. Deployed to its own
subdomain (e.g. `marketing.theincubatorhub.com`) and **shares the admin session**
with the main app via the shared Laravel API + a parent-domain session cookie.

- **Stack:** React 18 + Vite + TypeScript + Tailwind CSS 3 + shadcn/ui +
  `lucide-react`. Inter type and a green/ink theme that matches the main app
  admin (`theincubator_frontend`).
- **Auth:** Sanctum stateful-cookie flow gated on `role === 'admin'`. One login
  shared with the main app once `SESSION_DOMAIN` spans the apex. *(Ported into the
  React data layer in Phase B — the original Vue implementation is preserved under
  `legacy-vue/` as the functional spec.)*

## Develop

```bash
cp .env.example .env   # set VITE_API_BASE_URL to the API host
npm install
npm run dev            # http://localhost:5174
npm run build          # type-check + production build to dist/
```

## Backend requirements (set on the shared API; staging first)

- `SANCTUM_STATEFUL_DOMAINS` includes this app's host.
- `CORS_ALLOWED_ORIGINS` includes this app's origin.
- `SESSION_DOMAIN=.theincubatorhub.com` so the session cookie is shared across
  subdomains. **Changing this logs existing sessions out — schedule it.**

## Status

**Phase A (React rebuild) — scaffold + theme.** Vite + React + TS app with
Tailwind + shadcn initialised and themed to the main-app tokens (see
`src/index.css` for the CSS variables and `tailwind.config.ts`). `/` renders a
throwaway style-preview page proving visual parity; it is replaced by the real
shell and pages in later phases.

The previous Vue console (the functional spec for the API + auth + page
behaviour) is preserved under `legacy-vue/`.
