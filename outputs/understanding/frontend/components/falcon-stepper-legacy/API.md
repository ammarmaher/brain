# falcon-stepper-legacy — API

> 🔴 **DEPRECATED / DELETED — NO LIVE API.** The component documented here was DELETED 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13). It has no callable API in the current codebase.

## Redirect

➡️ For the live stepper API, see **`falcon-stepper/API.md`** (`<falcon-angular-stepper>` — selectors, ~17 inputs, 4 outputs incl. `navigationBlocked`, CVA, Stencil `@Method`s).

## Historical API (no longer importable)

The deleted `FalconStepperComponent` exposed (per the archived `[BRAIN-OUT]` Brain Outputs/strategies/falcon-stepper-legacy/PLAN.md and prior dossier):
- Selector `<falcon-stepper>` (Angular bespoke — string collided with the Falcon-UI-core Stencil tag; resolved via the `@falcon` import barrel, NOT Custom Elements).
- Companion `<falcon-step>` content directive (`FalconStepDirective`: `label`, `icon`, `content` TemplateRef).
- Companion `[falconStepperFooter]` directive (`FalconStepperFooterDirective`: TemplateRef context `{ $implicit: currentStep, valid, isFirst, isLast }`).

`[CODE]` All three symbols (`FalconStepperComponent`, `FalconStepDirective`, `FalconStepperFooterDirective`) are ABSENT from live source — `Grep` finds them only in `docs/archive/WAVE-A-OLD-STRUCTURE.md`.

## Migration mapping (legacy → live)

| Legacy (deleted) | Live equivalent (`<falcon-angular-stepper>`) |
|---|---|
| `<falcon-step label icon>` TemplateRef directive | `[steps]="FalconStepperStep[]"` array + `slot="content-{value}"` projection |
| `[falconStepperFooter]` directive | externalize the footer, or use `<falcon-angular-wizard>` (Next/Back/Finish) |
| bespoke linear gating | `mode="linear"` + `[forwardLockedFrom]` + `(navigationBlocked)` |
| `*.component.scss` rail styling | `--falcon-stepper-*` tokens (`stepper.tokens.css`) |

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). No live API exists. Migration mapping derived from the archived PLAN + the live `falcon-stepper` dossier. Redirect → `falcon-stepper/API.md`.
