---
name: "Falcon legacy stepper deletion"
description: "Deleted dead-code legacy Angular stepper at libs/falcon/src/shared-ui/lib/components/falcon-stepper/. 0 consumers, archived PLAN.md to Brain Outputs."
type: project
date: 2026-05-17
originSessionId: 2fead8b5-5483-4f1c-9877-08fcbc59ef1f
---
# Falcon Legacy Stepper — Deletion (2026-05-17)

🟢 **LANDED 2026-05-17.** Dead-code stepper folder removed. All 3 nx app builds GREEN.

## What

Deleted `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (7 files, 485 LOC of which 139 were commented-out SCSS that was never linked via `styleUrls`):
- `falcon-stepper.component.ts` (91 LOC — custom horizontal-rail Angular stepper, selector `falcon-stepper`, content-projection pattern with `<falcon-step>` directives)
- `falcon-stepper.component.html` (102 LOC)
- `falcon-stepper.component.scss` (139 LOC — entirely commented-out, dead weight)
- `falcon-step.directive.ts` (11 LOC)
- `falcon-stepper-footer.directive.ts` (16 LOC)
- `index.ts` (barrel)
- `PLAN.md` (13.8 KB) → **archived** to `C:\Falcon\Brain Outputs\strategies\falcon-stepper-legacy\PLAN.md`

## Why

**Zero runtime consumers across the entire workspace.** Greps proved no `.ts` or `.html` file imported `FalconStepperComponent`, `FalconStepDirective`, or `FalconStepperFooterDirective`. The only references were the 3 source files themselves + 1 barrel re-export + 2 archive docs (`PLAN.md` + a `docs/archive/WAVE-A-OLD-STRUCTURE.md`).

**Both wizards (Add User + Add Client) consume a DIFFERENT stepper:** `FalconAngularStepperComponent` from `@falcon/ui-core/angular` (Stencil-backed `<falcon-stepper-tw>` web component at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/`). That folder was the proposed "target" of the user's relocation request, which would have **bricked both wizards** if executed literally. The Stencil-backed stepper has a fundamentally different shape (`[steps]` props-array vs `<falcon-step>` content-projection) and a different selector (`<falcon-angular-stepper>` vs `<falcon-stepper>`).

## Latent risk closed

Two `<falcon-stepper>` selectors existed in parallel: the deleted Angular class registered selector `falcon-stepper`, and the Stencil web component registered tag `falcon-stepper` (`libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.tsx:52`). Today this worked because zero host components imported the Angular class — so the standalone compiler never matched the Angular selector. If anyone had ever added `FalconStepperComponent` to a future standalone `imports: []`, the Angular compiler would have matched `<falcon-stepper>` and broken the Stencil element everywhere both were referenced. **Deletion closes this latent landmine.**

## Files changed

1. **DELETE** `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (entire folder, 6 source files after PLAN.md moved)
2. **EDIT** `libs/falcon/src/shared-ui/index.ts` lines 12-18: removed legacy stepper exports block, replaced with a 3-line breadcrumb comment pointing to the Brain Outputs archive + the Stencil-backed replacement.
3. **ARCHIVE** `libs/falcon/.../falcon-stepper/PLAN.md` → `C:\Falcon\Brain Outputs\strategies\falcon-stepper-legacy\PLAN.md` (preserves the 13.8 KB falcon-stepper-architect Variant B custom-rail design plan for historical reference).

## Build hashes (all GREEN)

- `falcon-ui-core`: build finished 37.64s (only pre-existing reserved-prop warnings `scrollHeight` + `title` on `<falcon-table>` and `<falcon-toast>` — orthogonal, known follow-ups)
- `admin-console`: `dbd4376344586d0f` / 21.18s
- `host-shell`: `3567de0573770abe` / 10.63s
- `management-console`: `f82abb79dd2f17a3` / 19.18s

Bundle inspection confirmed `falcon-ui-stepper-tw.*.js` (the Stencil-backed stepper used by both wizards) is still emitted — wizards untouched.

## Doctrine

When asked to "move/relocate" a component:
1. **Always audit consumers first** — greps for class symbol, template selector, and any related types.
2. **Check the target location** — if it already exists, the move may overwrite a live component. Flag immediately.
3. **Prefer DELETE over MOVE** when consumer count is zero. Less code to maintain, fewer landmines.
4. **Archive design docs (PLAN.md etc.) to Brain Outputs** before deleting the source folder — preserves architectural thinking for future reference.

## Trigger to recall

- `where did the legacy stepper go` / `falcon-stepper deleted` / `which stepper do wizards use` / `2 steppers in the workspace`
