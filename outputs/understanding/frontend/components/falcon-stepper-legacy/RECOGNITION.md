# falcon-stepper (LEGACY) — Recognition Layer

> Given an external design / screenshot / React or Angular snippet that shows a step rail, identify the right Falcon component.
> ⚠️ **LEGACY — DELETED COMPONENT.** The legacy `<falcon-stepper>` no longer exists. **Recognition ALWAYS routes a step-rail design to the modern `<falcon-angular-stepper>` / `<falcon-angular-wizard>`** — never to this deleted component. See `BUSINESS.md` § "Status correction."

## Visual fingerprint (the pattern — routes to the modern component)
A horizontal (or vertical) **rail of step markers**: numbered or check-marked circles connected by a track/connector line. One circle is the *active* step (highlighted), earlier ones are *done* (filled / checked), later ones are *idle* (muted). A label sits under or beside each circle. A progress fill bar may show percent-complete. Below the rail, a **single step's content panel** is visible at a time; at the bottom, a **footer** with Back / Next / Finish (and sometimes Cancel / Save-Draft) buttons. The whole assembly = a multi-step wizard. If you see this in a design → use the **modern Falcon stepper**, per the routing table below.

## Cross-library equivalents
| Library | Their component | Route to (modern Falcon) |
|---|---|---|
| MUI | `<Stepper>` + `<Step>` + `<StepLabel>` | `<falcon-angular-stepper>` (rail) / `<falcon-angular-wizard>` (rail + footer) |
| PrimeNG | `<p-stepper>` / `<p-steps>` | `<falcon-angular-stepper>` — the legacy `<falcon-stepper>` itself originally wrapped `<p-stepper>` before the PrimeNG drop |
| Ant Design | `<Steps>` | `<falcon-angular-stepper>` |
| Bootstrap | no native stepper (community wizard plugins) | `<falcon-angular-wizard>` |
| shadcn / Radix | no Radix stepper primitive (community recipes) | `<falcon-angular-stepper>` |
| plain HTML | a hand-built `<ol>` of step `<li>`s + JS panel switching | `<falcon-angular-wizard>` |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a step rail (circles + connectors), single panel visible, multi-step task | `<falcon-angular-stepper>` (modern, Stencil-paired) | the deleted legacy `<falcon-stepper>` |
| a step rail PLUS a Next/Back/Finish/Draft footer + submission orchestration | `<falcon-angular-wizard>` (composes the modern stepper) | the deleted legacy `<falcon-stepper>` |
| anything that looks like the old bespoke Angular stepper | the modern stepper — the legacy one is **deleted** | importing `FalconStepperComponent` from `@falcon` (export removed) |
| a horizontal progress indicator with no step panels | a progress / `<falcon-angular-progress>` style component | a stepper |

## Composition recipe to reach parity (with the MODERN component)
The legacy component is deleted — there is nothing to compose. To build a wizard today, compose `<falcon-angular-wizard>` / `<falcon-angular-stepper>` (full recipe in their own dossiers). Summary, customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[steps]` (`FalconStepperStep[]`: `value`, `label`, optional `description` / `icon` / `disabled` / `optional` / `errorMessage`); `[(activeValue)]` (CVA, `string|number`); `[completedValues]`; `mode` (`linear`/`non-linear`); `orientation`; `size`; `labelPosition`; `showStepNumbers`; `showCheckOnComplete`; `[forwardLockedFrom]` (the declarative validation gate).
2. **Per-step data** — `step.icon`, `step.errorMessage` (paints the circle red — the per-step error state the legacy never had), `step.optional`.
3. **Slots / templates** — step bodies via `slot="content-{value}"`; footer additions via the wizard's `slot="footer-extra"`.
4. **Variants** — `mode` + `orientation` + `size` + `labelPosition`.
5. **Token override** — `--falcon-stepper-*` (14-category contract — see `falcon-stepper/TOKENS.md`).
6. **Events** — `(valueChange)`, `(stepClick)`, `(stepComplete)`, `(navigationBlocked)` (typed `reason`: `linear` / `disabled` / `forward-locked`).
7. **Wrapper** — `<falcon-angular-wizard>` for the full Next/Back/Finish/Draft footer + validation gates.

## Anti-patterns
- **Recognizing a step rail and reaching for the legacy `<falcon-stepper>`** — it is deleted. Always route to `<falcon-angular-stepper>` / `<falcon-angular-wizard>`.
- Importing `FalconStepperComponent` / `FalconStepDirective` / `FalconStepperFooterDirective` from the `@falcon` barrel — those exports were removed in Wave 7.13; the import fails the build.
- Hand-rolling an `<ol>`/`<li>` step rail — banned (`feedback_falcon_ui_library_only_no_native`); use the modern stepper.
- PrimeNG `<p-stepper>` in app code — banned; the modern Falcon stepper replaced it.
- Treating the contradictory old UI-layer dossiers as current — `OVERVIEW.md`/`API.md` describe a live "LEGACY-IN-USE" component; the live filesystem says it is gone. Trust the deletion (verified 2026-05-18).

## Verification
🔴 HISTORICAL — component DELETED. Deletion ✅ VERIFIED ([CODE] filesystem check 2026-05-18). Modern-stepper composition facts ✅ VERIFIED against live `[CODE]` falcon-stepper.types.ts + falcon-stepper.component.ts. Cross-library map `[INFERRED]` from standard library APIs.
