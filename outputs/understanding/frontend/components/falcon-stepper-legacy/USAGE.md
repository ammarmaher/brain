# falcon-stepper-legacy — USAGE

> 🔴 **DEPRECATED / DELETED — NOT USABLE.** Deleted 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13). There is nothing to import and nothing in the app renders it.

## Redirect

➡️ For live usage examples, see **`falcon-stepper/USAGE.md`** (rail-only stepper + external `@switch` panels + `[forwardLockedFrom]` validity gate — the pattern every wizard now uses).

## Consumer Sweep (2026-06-03)

`[CODE]` `Grep` for `FalconStepperComponent` / `FalconStepDirective` / `FalconStepperFooterDirective` across `apps/` + `libs/falcon/` (excluding `dist/`) → **ZERO live consumers** (one hit, in `docs/archive/WAVE-A-OLD-STRUCTURE.md`, is an archived doc). The prior dossier listed admin/mgmt org-hierarchy add-client / add-user wizards as consumers — those have ALL migrated to `<falcon-angular-stepper>` (see `falcon-stepper/USAGE.md`: 21 occurrences / 13 files).

## Do NOT

- Do NOT add a new `import { FalconStepperComponent } from '@falcon'` — the symbol no longer exists.
- Do NOT recreate `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (or `dynamic-stepper/`) — it was deliberately deleted for being dead code.
- Do NOT follow the `dynamic-stepper.component.scss` instructions in `docs/_plans/W27-*` — those planning docs are historical; the file is gone.

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Consumer Sweep grep'd: zero live consumers. Redirect → `falcon-stepper/USAGE.md`.
