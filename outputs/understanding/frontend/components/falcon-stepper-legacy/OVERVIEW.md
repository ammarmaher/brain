# falcon-stepper-legacy — OVERVIEW

> 🔴 **DEPRECATED / SUPERSEDED — NO LIVE SOURCE EXISTS.** This dossier documents a component that has been **DELETED from the codebase**. It is retained only as a tombstone + redirect. Do NOT treat any "live surface" described in prior versions of this dossier as real — it is not.

## Status

**DELETED 2026-05-17 / SUPERSEDED by `falcon-stepper`.**

`[CODE]` `libs/falcon/src/shared-ui/index.ts:11-13` (the only on-disk evidence remaining):
```ts
// Legacy Falcon Stepper (libs/falcon/.../falcon-stepper) DELETED 2026-05-17 — was dead code (0 consumers).
// Both wizards consume FalconAngularStepperComponent (Stencil-backed) re-exported below at line ~96.
// Architecture notes archived at: Brain Outputs/strategies/falcon-stepper-legacy/PLAN.md
```

## Redirect — use this instead

➡️ **`<falcon-angular-stepper>`** — the live, dual-render Stencil stepper. See the **`falcon-stepper/`** dossier (the multi-step shell every real wizard now uses). It carries all the production traffic the legacy component used to: Add Client / Add User (admin + mgmt), Templates wizard, Contracts Add wizard, Create Contact Group.

## What it was (historical only)

A bespoke Angular-only stepper component (`FalconStepperComponent`) that lived at `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (later also referred to as `dynamic-stepper`). It exposed a `<falcon-step>` content-projection directive + a `[falconStepperFooter]` footer directive, and rendered a custom horizontal rail + `@switch` panel + footer. It ported the React `ACStepBar` visual contract (`[BRAIN-OUT]` Brain Outputs/strategies/falcon-stepper-legacy/PLAN.md §1: 69px rail, 18px dot, 4px teal fill, halo + inner pulse).

## Why it was deleted

- It had **0 consumers** at deletion time (`[CODE]` index.ts:11). The org-hierarchy wizards had already migrated to the Stencil-paired `<falcon-angular-stepper>`.
- Keeping it violated DRY (two steppers) and the no-SCSS house rule (it carried a `*.component.scss`).
- The W27 planning docs (`[CODE]` docs/_plans/W27-5-stepper-diff.md) that reference `dynamic-stepper.component.scss` are HISTORICAL — that file no longer exists on disk.

## Source file paths

| Layer | Path | State (verified 2026-06-03) |
|---|---|---|
| Component / template / scss / directives / index | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/*` (also `.../dynamic-stepper/*`) | ❌ **DELETED** — `Glob`/`find` for `*stepper-legacy*` and `*dynamic-stepper*` under `libs/` (excluding `dist/`) return ZERO files. |
| `@falcon` barrel exports | `FalconStepperComponent`, `FalconStepDirective`, `FalconStepperFooterDirective` | ❌ **REMOVED** — `Grep` across non-`dist` source finds these symbols only in `docs/archive/WAVE-A-OLD-STRUCTURE.md`. |
| Archived architecture plan | `Brain Outputs/strategies/falcon-stepper-legacy/PLAN.md` | ✅ exists (the only surviving artifact). |

## Selectors / tags (historical)

- Selector was `falcon-stepper` (a string that COLLIDED with the Falcon-UI-core Stencil tag; resolved at import level — apps imported `FalconStepperComponent` from `@falcon`). This collision was one motivation for consolidation onto the namespaced `<falcon-angular-stepper>`.
- No Stencil tag — it was a pure Angular bespoke component.

## Known consumers (verified 2026-06-03)

**ZERO live consumers.** `Grep` for `FalconStepperComponent` / `FalconStepDirective` / `FalconStepperFooterDirective` across `apps/` + `libs/falcon/` (excluding `dist/`) returns only an archived doc. The org-hierarchy / templates / contracts / contact-group wizards all consume `<falcon-angular-stepper>` (see `falcon-stepper/USAGE.md` Consumer Sweep: 21 occurrences / 13 files).

## Related components

- ➡️ `falcon-stepper` (`<falcon-angular-stepper>`) — the LIVE replacement.
- `falcon-wizard` (`<falcon-angular-wizard>`) — composes the live stepper + a Next/Back/Finish footer (the modern analog of the legacy `[falconStepperFooter]` directive).

## Ownership / Responsibility

N/A — deleted. The replacement is owned by `libs/falcon-ui-core` (Falcon UI team).

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Verified via: (1) `[CODE]` libs/falcon/src/shared-ui/index.ts:11-13 deletion note; (2) `Glob`/`find` — no `falcon-stepper` / `dynamic-stepper` source dir under `libs/` (only `dist/` artifacts); (3) `Grep` — `FalconStepperComponent`/directives absent from live source (one archived-doc hit only). Prior dossier's "LEGACY-IN-USE + live consumers + live source path" claims are STALE and are corrected to DELETED/SUPERSEDED. No live surface fabricated. Redirect → `falcon-stepper/`.
