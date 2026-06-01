---
type: pending-question
status: RESOLVED
fork-id: F-026
task-id: night-shift-static-value-migration-W10
halted-at: 2026-05-18T00:30:00Z
resolved-at: 2026-05-18T00:35:00Z
night-shift-batch: 2026-05-18
---

# Fork: management-console pre-existing TypeScript path bug surfaces in final build [RESOLVED]

## Resolution

One-character relative-path fix applied at `apps/management-console/.../falcon-org-node-drawer/models/models.ts:7` — `'../../../../models/models'` → `'../../../../../models/models'`. Once the missing module resolved, the downstream `ServiceOperationResult<unknown>` narrowing in `services.ts:62` also cleared (no separate fix needed). Management-console build hash `d7a6f6714b6512c1` / 14.24s GREEN.

## Why halted

Final 3-app build of W10 caught a TypeScript compilation error in management-console **that I did NOT introduce** during the night-shift static-value migration. Both files cited are outside my migration scope (management-console is untouched throughout all 10 waves). The error surfaces only on full `nx build management-console --skip-nx-cache` and was masked in earlier session verifications by either a cache pass or an out-of-date type check.

## Symptom

```
apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/models/models.ts:7
  error TS2307: Cannot find module '../../../../models/models' or its corresponding type declarations.
    import type { ClientNode } from '../../../../models/models';

apps/management-console/src/app/features/org-hierarchy-page/services/services.ts:62
  error TS2322: Type 'Observable<ServiceOperationResult<CreateSubNodeWireResult> | ServiceOperationResult<unknown>>'
                is not assignable to type 'Observable<ServiceOperationResult<CreateSubNodeWireResult>>'.
```

## Root cause analysis (best-effort, no fix applied)

1. **TS2307** — relative path `'../../../../models/models'` from `falcon-org-node-drawer/models/` traverses 4 levels up which lands at `components/`, where there is no `models/` directory. The mgmt models file lives at `apps/management-console/src/app/features/org-hierarchy-page/models/models.ts` — that requires `'../../../../../models/models'` (5 levels). The admin-console drawer at the parallel path uses a correct relative depth; this is a port-divergence typo.
2. **TS2322** — once the missing import surfaces as `unknown`, the `catchError((err: unknown) => of(this.toSorFromError(err)))` widens to `ServiceOperationResult<unknown>` and TypeScript can no longer narrow the union back to the method's declared return type. Adding an explicit generic at the call site (`this.toSorFromError<CreateSubNodeWireResult>(err)`) — OR fixing the TS2307 first — clears both errors together.

## Confidence this is pre-existing, not caused by night-shift work

- Management-console source files modified during night-shift Wave NS-1: **0**
- My changes during waves 1–9 touched: `libs/falcon-theme/src/falcon-tailwind-tokens.css` (SSOT additive token expansion), admin-console + host-shell HTML/TS, `libs/falcon/src/shared-ui/lib/components/*.html`, and added new files at `libs/falcon/src/shared-utils/lib/state/`.
- None of those touch management-console's `services.ts` or `falcon-org-node-drawer/models/models.ts`.
- The management-console build did pass on earlier night-shift verification points (after W1 + after W4) — that earlier passing reflects a cache-friendly TS check, not the absence of the path typo.

## Sources reviewed
- [CODE] `apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/models/models.ts:7`
- [CODE] `apps/management-console/src/app/features/org-hierarchy-page/services/services.ts:62`
- [CODE] `apps/management-console/src/app/features/org-hierarchy-page/models/models.ts` (referenced target, exists)

## Recommended question for the human

Apply the relative-path fix (`'../../../../models/models'` → `'../../../../../models/models'`) as a one-line follow-up commit, OR roll into a dedicated management-console port-audit batch? (One-line fix is preferable; no other regression vectors.)

## Blast radius

- Management-console build is RED until this is fixed; admin-console and host-shell builds remain GREEN through all night-shift work.
- All Wave NS-1 SSOT token additions + admin-console + host-shell + libs/falcon migrations are validated by passing builds for the two affected apps.
- The night-shift run completes with the W10 final audit — the management-console RED is documented here as a pre-existing residual debt, not a Wave NS-1 regression.
