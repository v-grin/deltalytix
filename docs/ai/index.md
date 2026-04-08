# Deltalytix AI Docs Index

This index is for AI agents working in this repository.

## Start Here

1. [Project README](../../README.md)  
High-level product overview, features, stack, and setup instructions.

## Core Documents

1. [Architecture](./architecture.md)  
System topology, entry points, data flow, env model, conventions.

2. [Playbooks](./playbooks.md)  
Task-driven implementation flows (widgets, broker sync, API, auth, billing, imports).

3. [Merge Strategy](./merge-strategy.md)  
Fork-safe customization patterns and upstream merge hygiene.

## Quick Task -> Files

| Task | Start Here | Then Check |
|---|---|---|
| Fix dashboard widget rendering/layout | `app/[locale]/dashboard/components/widget-canvas.tsx` | `app/[locale]/dashboard/config/widget-registry.tsx`, `app/[locale]/dashboard/types/dashboard.ts` |
| Add new widget | `app/[locale]/dashboard/config/widget-registry.tsx` | `app/[locale]/dashboard/types/dashboard.ts`, widget component in `app/[locale]/dashboard/components/**` |
| Debug import step flow | `app/[locale]/dashboard/components/import/import-button.tsx` | `app/[locale]/dashboard/components/import/config/platforms.tsx` |
| Add broker sync integration | `app/[locale]/dashboard/components/import/<broker>/sync/actions.ts` | `app/api/<broker>/sync/route.ts`, `server/database.ts` |
| Fix OAuth/login redirect/session issues | `proxy.ts` | `server/auth.ts`, `app/api/auth/callback/route.ts` |
| Fix subscription/plan access | `server/subscription.ts` | `server/billing.ts`, `app/api/stripe/webhooks/route.ts` |
| Fix trade persistence/duplicates/cache | `server/database.ts` | `prisma/schema.prisma`, `server/user-data.ts` |
| Add API route | `app/api/<domain>/<name>/route.ts` | domain logic in `server/*` or `lib/*` |
| Modify DB schema | `prisma/schema.prisma` | `prisma/migrations`, `prisma.config.ts`, call-sites in `server/*` |
| Fix CI Docker build | `.github/workflows/build-ghcr.yml` | `Dockerfile.bun`, env fallbacks/build args |

## Fast Navigation by Domain

- Auth/session: `proxy.ts`, `server/auth.ts`, `app/api/auth/callback/route.ts`
- Dashboard shell/data: `app/[locale]/dashboard/layout.tsx`, `context/data-provider.tsx`, `server/user-data.ts`
- Imports/sync: `app/[locale]/dashboard/components/import/**`
- Billing: `server/billing.ts`, `server/stripe.ts`, `app/api/stripe/webhooks/route.ts`
- AI endpoints: `app/api/ai/**`
- Data model: `prisma/schema.prisma`, `lib/prisma.ts`
