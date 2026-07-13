# falcon-stepper-legacy — Recognition Layer

> 🔴 **DEPRECATED / DELETED COMPONENT.** The legacy `<falcon-stepper>` (bespoke Angular `dynamic-stepper`) no longer exists (deleted 2026-05-17, `[CODE]` libs/falcon/src/shared-ui/index.ts:11-13).

## Recognition rule

**A step-rail design ALWAYS routes to `<falcon-angular-stepper>` — never to this deleted component.** There is no decision to make: the only stepper in the codebase is the live one.

➡️ See **`falcon-stepper/RECOGNITION.md`** for the visual fingerprint, cross-library equivalents (MUI `<Stepper>`, PrimeNG `<p-stepper>`, Ant `<Steps>`), and the use-this-vs-siblings table.

## If you encounter a reference to the legacy component

- A `FalconStepperComponent` / `<falcon-step>` / `[falconStepperFooter]` reference in OLD code or docs → it is stale; the live target is `<falcon-angular-stepper>` with `[steps]` + `slot="content-{value}"`.
- A `dynamic-stepper.component.scss` reference (e.g. in `docs/_plans/W27-*`) → historical; the file is gone.

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Recognition unconditionally routes to the live component. Redirect → `falcon-stepper/RECOGNITION.md`.
