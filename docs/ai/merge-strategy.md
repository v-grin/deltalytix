# Deltalytix Fork Merge Strategy (AI-Focused)

Goal: keep your fork easy to rebase/merge from upstream while still shipping custom features.

## 1) Principles

1. Prefer additive extension points over edits in shared orchestrators.
2. Keep changes localized and composable.
3. Avoid broad refactors in files that upstream frequently changes.
4. Merge upstream regularly in small intervals.

## 2) High-Conflict Surfaces

These files are likely to conflict when upstream evolves:
- `app/[locale]/dashboard/components/import/import-button.tsx`
- `app/[locale]/dashboard/components/import/config/platforms.tsx`
- `app/[locale]/dashboard/config/widget-registry.tsx`
- `app/[locale]/dashboard/types/dashboard.ts`
- `proxy.ts`

Treat edits here as expensive.

## 3) Recommended Customization Pattern

### For widgets
1. Put custom widget implementation in new files under dedicated custom folder/scope.
2. Keep registry changes as small as possible.
3. Avoid changing existing widget behavior unless necessary.

### For broker sync
1. Add broker-specific module in isolated path under `components/import/<broker>/`.
2. Reuse existing shared persistence path (`saveTradesAction`).
3. Touch platform registry once to wire new type.

### For middleware/auth
1. Prefer additive guards and narrowly scoped conditions.
2. Avoid changing global redirect behavior unless required.

## 4) Commit Hygiene for Mergeability

1. One feature/fix per commit.
2. Keep commit subject explicit (`feat:`, `fix:`, `ci:`, etc.).
3. Avoid mixed commits touching unrelated domains.
4. Reference affected subsystem in message (widgets/import/auth/billing).

## 5) Upstream Sync Routine

Suggested cadence: frequent and small.

1. Fetch upstream.
2. Rebase or merge upstream main into your branch.
3. Resolve conflicts immediately while context is fresh.
4. Run smoke checks for touched subsystems.
5. Push updated branch.

## 6) Conflict Resolution Priority

When conflict happens:
1. Preserve upstream behavior in shared orchestrators when possible.
2. Re-apply fork custom behavior through extension points.
3. Re-test only impacted flow (widget render, import step flow, auth callback, webhook path).

## 7) AI Agent Rules During Merge Work

1. Do not refactor conflict files “while you are here”.
2. Keep diff minimal to restore intended behavior.
3. Prefer deterministic, typed changes over broad cleanup.
4. Document why a divergence from upstream is intentional.

## 8) Practical Merge Checklist

Before finishing merge:
1. `proxy.ts` behavior unchanged for protected routes.
2. Import flow still transitions correctly in `import-button.tsx`.
3. Widget registry still maps every `WidgetType`.
4. Auth callback still redirects to dashboard/next correctly.
5. Billing webhook still updates subscription rows.

