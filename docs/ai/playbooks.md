# Deltalytix AI Playbooks

Task-driven implementation guidance for Codex/AI agents.

## 1) Add a Dashboard Widget

1. Build widget component under `app/[locale]/dashboard/components/**`.
2. Register widget in `app/[locale]/dashboard/config/widget-registry.tsx`:
- category,
- size constraints,
- component + preview mapping.
3. Extend `WidgetType` in `app/[locale]/dashboard/types/dashboard.ts`.
4. Add/verify i18n labels in `locales/*` if widget has user-visible text.
5. Validate layout behavior in `app/[locale]/dashboard/components/widget-canvas.tsx`.

## 2) Add a Broker Sync Integration

1. Create broker module under `app/[locale]/dashboard/components/import/<broker>/`.
2. Add sync/domain actions in `<broker>/sync/actions.ts`.
3. Register new import type in `app/[locale]/dashboard/components/import/config/platforms.tsx`.
4. Add API route when sync is server-triggered: `app/api/<broker>/sync/route.ts`.
5. Reuse persistence path via `saveTradesAction` in `server/database.ts`.
6. Add required env vars to `.env.example` and build args if needed during build.

## 3) Add/Modify Import Flow Step

Primary orchestrators:
- `app/[locale]/dashboard/components/import/import-button.tsx`
- `app/[locale]/dashboard/components/import/config/platforms.tsx`

Checklist:
1. Add step component.
2. Register step id sequence in platform config.
3. Ensure back/next transitions are valid.
4. Confirm final `handleSave` path still receives normalized data.

## 4) Add API Endpoint

1. Create `app/api/<domain>/<name>/route.ts`.
2. Keep route thin:
- parse/validate request,
- call domain function in `server/*` or `lib/*`,
- return explicit status + JSON.
3. Avoid embedding broad business logic directly in route handlers.

## 5) Auth/Login Bug Triage

Start files:
- `proxy.ts`
- `server/auth.ts`
- `app/api/auth/callback/route.ts`

Flow:
1. Verify callback query params handling (`code`, `next`, `locale`, action flags).
2. Verify session exchange and redirect URL composition.
3. Verify protected-route behavior in `proxy.ts` and auth headers propagation.
4. Confirm Supabase env keys are present and correct.

## 6) Billing/Plan Access Triage

Start files:
- `server/subscription.ts`
- `server/billing.ts`
- `server/stripe.ts`
- `app/api/stripe/webhooks/route.ts`

Flow:
1. Confirm webhook event handling updates local subscription rows.
2. Verify access checks use DB state you expect.
3. Verify Stripe key presence and graceful degradation path.

## 7) Trade Persistence / Duplicates

Start files:
- `server/database.ts`
- `prisma/schema.prisma`

Flow:
1. Inspect deterministic trade id generation and duplicate strategy.
2. Validate `createMany(... skipDuplicates: true)` semantics for your change.
3. Verify cache tags (`trades-{userId}`) revalidation on write paths.

## 8) Schema Change Playbook

1. Edit `prisma/schema.prisma`.
2. Ensure `DIRECT_URL` is available for Prisma CLI operations.
3. Run migrate/generate flow used by your environment.
4. Update server/domain call-sites for new fields/constraints.
5. Re-check docker/CI build behavior if schema generation runs during build.

## 9) Debug Sequence for Unknown Runtime Error

1. Reproduce and isolate route/surface.
2. Locate nearest entry point (`page.tsx` / `route.ts` / server action).
3. Trace imported domain layer (`server/*`, `lib/*`, `store/*`).
4. Verify env assumptions for that path.
5. Check cache invalidation assumptions.
6. Apply minimal patch, verify only changed behavior.

## 10) High-Risk Files (Edit Carefully)

- `app/[locale]/dashboard/components/import/import-button.tsx`
- `app/[locale]/dashboard/components/import/config/platforms.tsx`
- `app/[locale]/dashboard/config/widget-registry.tsx`
- `app/[locale]/dashboard/types/dashboard.ts`
- `proxy.ts`

These files are central orchestrators and frequent merge-conflict points.

