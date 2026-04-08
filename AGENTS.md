# Codex Project Instructions

## Purpose
This repository is a full-stack Next.js trading analytics app (Deltalytix).
Use this file as a fast operational guide for Codex agents making code changes.

## Tech Stack
- Next.js App Router + React 19 + TypeScript
- Prisma + PostgreSQL (`@prisma/adapter-pg`)
- Supabase auth/session (`@supabase/ssr`)
- Zustand stores + React Context providers
- Stripe billing + webhook routes

## Runbook
- Install deps: `npm install` (or `bun install`)
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

## Env Model
- Runtime DB uses `DATABASE_URL` (`lib/prisma.ts`).
- Prisma CLI uses `DIRECT_URL` (`prisma.config.ts`).
- Commonly required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DATABASE_URL`
  - `DIRECT_URL` (CLI/migrations)
- Optional feature flags/keys: `OPENAI_API_KEY`, Stripe keys, Resend, broker-specific keys.

## Architecture Map
- `proxy.ts`: locale/auth gating + session refresh + route access policy.
- `app/[locale]/**`: UI routes and layouts.
- `app/api/**/route.ts`: HTTP API handlers.
- `server/**`: server actions/domain logic.
- `lib/**`: reusable utilities/adapters.
- `store/**`: Zustand client state.
- `context/**`: cross-feature client providers.
- `prisma/schema.prisma`: source-of-truth data model.

## Key High-Impact Files
- Dashboard widget system:
  - `app/[locale]/dashboard/config/widget-registry.tsx`
  - `app/[locale]/dashboard/types/dashboard.ts`
  - `app/[locale]/dashboard/components/widget-canvas.tsx`
- Import/sync system:
  - `app/[locale]/dashboard/components/import/import-button.tsx`
  - `app/[locale]/dashboard/components/import/config/platforms.tsx`
  - `app/[locale]/dashboard/components/import/<broker>/sync/actions.ts`
- Auth flow:
  - `server/auth.ts`
  - `app/api/auth/callback/route.ts`
  - `proxy.ts`
- Billing:
  - `server/billing.ts`
  - `server/subscription.ts`
  - `app/api/stripe/webhooks/route.ts`

## Conventions
- Use `@/*` imports.
- Keep API handlers thin; move business logic to `server/*` or `lib/*`.
- Use explicit `try/catch` + HTTP status in `route.ts`.
- Preserve existing file naming style (mostly kebab-case for component files).
- Follow conventional commit style seen in history (`feat:`, `fix:`, `refactor:`, `ci:`, `docs:`).

## Change Playbooks
### Add widget
1. Add component.
2. Register in `widget-registry.tsx`.
3. Extend `WidgetType` in `types/dashboard.ts`.
4. Verify sizing/layout in `widget-canvas.tsx`.

### Add broker sync
1. Add broker module under `components/import/<broker>/`.
2. Register platform in `platforms.tsx`.
3. Add API route under `app/api/<broker>/.../route.ts` if needed.
4. Reuse `saveTradesAction` for persistence + cache invalidation.

## Risk Notes
- Import flow is state-heavy; test transitions carefully.
- CI/build can fail when new env-dependent logic is added without build-safe fallbacks.
- No automated tests detected in repo; verify changes with focused manual checks.

## Related Docs
- AI docs index: `docs/ai/index.md`
- Architecture details: `docs/ai/architecture.md`
- Task playbooks: `docs/ai/playbooks.md`
- Fork merge strategy: `docs/ai/merge-strategy.md`
