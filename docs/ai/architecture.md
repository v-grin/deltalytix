# Deltalytix AI Architecture

This document is optimized for AI agents, not end-users.

## 1) System Summary

Deltalytix is a single-repo, full-stack Next.js App Router application for trading analytics:
- Supabase authentication (OAuth/email/password).
- PostgreSQL persistence via Prisma.
- Dashboard with configurable widgets and import/sync flows.
- Stripe billing + subscription gates.
- AI endpoints for analysis/chat/import support.

Architecture style: monolithic Next.js app (UI, API handlers, and server actions in one codebase).

## 2) Stack Snapshot

| Layer | Tech |
|---|---|
| Runtime | Next.js App Router (`next@16`), React 19, TypeScript |
| UI | Tailwind CSS, Radix UI, Framer Motion |
| Data | PostgreSQL + Prisma (`@prisma/adapter-pg`) |
| Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| State | Zustand stores + React Context providers |
| Billing | Stripe webhook + server modules |
| AI | `ai` SDK + OpenAI provider |
| CI/CD | GitHub Actions + Docker + GHCR |

## 3) Runtime Topology

### Edge/request pre-processing
`proxy.ts` acts as middleware-equivalent:
- locale rewrite (`en`, `fr`, with `ru` alias behavior),
- Supabase session refresh,
- protected route checks (`/dashboard`, `/admin`),
- geolocation headers/cookies.

### App Router layer
- Pages/layouts: `app/[locale]/**`
- HTTP APIs: `app/api/**/route.ts`
- Server actions called by components: mostly `server/**`

### Data and external integrations
- Prisma runtime client: `lib/prisma.ts`
- Auth helpers/session client: `server/auth.ts`
- Billing client adapter: `server/stripe.ts`
- Billing orchestration: `server/billing.ts`, `server/subscription.ts`

## 4) Key Entry Points

### UI
- `app/layout.tsx`: global shell and metadata.
- `app/[locale]/layout.tsx`: locale provider.
- `app/[locale]/dashboard/layout.tsx`: dashboard provider composition.
- `app/[locale]/dashboard/page.tsx`: dashboard tabs + widget canvas.

### API
- Auth callback: `app/api/auth/callback/route.ts`
- Broker sync examples:
  - `app/api/tradovate/sync/route.ts`
  - `app/api/dxfeed/sync/route.ts`
- Stripe webhook: `app/api/stripe/webhooks/route.ts`
- AI routes: `app/api/ai/**`

### Domain server actions
- `server/database.ts`: trade persistence/update/grouping/layout cache invalidation.
- `server/user-data.ts`: dashboard bootstrap aggregation + tagged cache.
- `server/accounts.ts`, `server/groups.ts`, `server/tags.ts`: supporting domain mutations.

## 5) Data Model Hotspots

Source of truth: `prisma/schema.prisma`.

High-impact models:
- `Trade`: core analytics fact table.
- `User`: app user linked to auth identity.
- `Synchronization`: per-account sync/token metadata.
- `Account`, `Group`, `Payout`: account organization + performance context.
- `Subscription`, `BusinessSubscription`, `TeamSubscription`: plan/access control.
- `DashboardLayout`, `Tag`, `Mood`, `FinancialEvent`: dashboard/user UX data.

## 6) State and Caching

### Client state
- Zustand in `store/**`.
- Cross-cutting hydration and data orchestration in `context/data-provider.tsx`.

### Server cache
- Uses `unstable_cache`, `updateTag`, `revalidateTag`.
- Common cache tags:
  - `trades-{userId}`
  - `user-data-{userId}` (+ locale variants)

When modifying write paths, ensure associated invalidation tags are updated.

## 7) Environment Model

### Runtime
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Prisma CLI / generate / migrate
- `DIRECT_URL` from `prisma.config.ts`

### Optional feature keys
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- broker credentials (Tradovate, DxFeed, etc.)

### Build behavior
- `Dockerfile.bun` includes build-time fallbacks for env-sensitive steps.
- `.github/workflows/build-ghcr.yml` passes build args and pushes on `main`.

## 8) Code Conventions (Detected)

- TypeScript-first (`.ts/.tsx`).
- `route.ts` for API handlers.
- `page.tsx` / `layout.tsx` App Router structure.
- Mostly kebab-case component file naming.
- Alias imports via `@/*` from `tsconfig.json`.
- Error handling style: explicit `try/catch` with structured JSON responses in API routes.

## 9) Testing Reality

- No `tests/`, `__tests__/`, `*.test.*`, or `*.spec.*` detected.
- Treat cross-module refactors as high risk; do focused manual smoke checks.

