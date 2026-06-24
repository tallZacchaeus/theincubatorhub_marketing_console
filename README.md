# Incubator Marketing Console

Standalone admin SPA for The Incubator's marketing campaigns. Deployed to its own
subdomain (e.g. `marketing.theincubatorhub.com`) and **shares the admin session**
with the main app via the shared Laravel API + a parent-domain session cookie.

- **Stack:** Vue 3 + Vite + TypeScript + vue-router. Plain CSS (no UI framework).
- **Auth:** Sanctum stateful-cookie flow (`src/api/client.ts`), gated on
  `role === 'admin'` (`src/router`, `src/stores/auth.ts`). One login shared with
  the main app once `SESSION_DOMAIN` spans the apex.

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

Phase 9 — shell + shared-session auth + empty routed pages (Dashboard, Contacts,
Categories, Templates, Campaigns, Analytics, Settings). Pages are implemented
against the console APIs in Phase 10.
