# falcon-angular-wizard — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-wizard>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-wizard.tsx:127-194`:
A vertical three-(to-four-)row shell: an optional **header row** (title + close), a **stepper rail** (the embedded `<falcon-stepper>` — numbered dots + fill track), a large **content region** holding the current step's body form, and a **footer row** of buttons. The footer always reads, left-to-right (LTR): `[Back]` (hidden on step 1) · `[footer-extra slot]` · `[Save Draft]` (optional) · `[Next]` or `[Finish]` (Finish only on the last step). Next/Finish render `disabled` when `canProceed` is false. The whole shell is one bounded card — distinct from a bare stepper (no footer) and from tabs (no progress rail, no Next/Back).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Stepper>` + `<Step>` + a hand-rolled Back/Next button row + `<StepContent>` | MUI has no single "wizard" — it is stepper + manual footer. This component is that composition pre-assembled. |
| PrimeNG | `<p-stepper>` with `[linear]` + `<p-stepperPanel>` + footer template | closest 1:1 — replaces `<p-stepper>` (PrimeNG uninstalled, Wave PR-8). |
| Ant Design | `<Steps>` + a manual button row, or the community `<MultiStepForm>` | Ant has no built-in wizard shell; this component packages it. |
| Bootstrap | bespoke `.bs-stepper` plugin + custom buttons | upgrade target — replace with this. |
| shadcn / Radix | no wizard primitive — hand-rolled `Stepper` + `Form` + `Button` row | replace the hand-roll with this component. |
| plain HTML | `<fieldset>`s shown one at a time + Prev/Next `<button>`s | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an ordered multi-step form WITH Next/Back/Finish/Save-Draft buttons and per-step validation | `<falcon-angular-wizard>` | a bare stepper |
| only a numbered progress rail, with navigation owned elsewhere | `<falcon-angular-stepper>` | wizard |
| parallel section switches (Hierarchy / Settings / Apps) with no "complete in order" | `<falcon-angular-tabs>` `mode="navigation"` | wizard |
| a guided "pick one card" choice | `<falcon-angular-tabs>` `mode="radio-cards"` | wizard |
| a single-step form | the form + a normal button row | wizard |
| a multi-step flow where each step is its own full page with its own chrome | per-step routing / separate pages | wizard |
| the unsaved-changes confirmation when cancelling | `<falcon-angular-popup variant="unsaved">` (consumer-owned) | the wizard does not own this |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.

1. **Inputs** — supply `[steps]` (`FalconWizardStep[]` — `label` + optional `disabled`/`optional`/`status`), bind `[(currentStep)]` to a `signal<number>(0)`. Set `showBack`/`showFinish`/`showDraft`, the four label strings (`nextLabel`/`backLabel`/`finishLabel`/`draftLabel` — consumer pre-translates), and `size`.
2. **Validation** — pick ONE: `[stepControls]` = array of one `AbstractControl` per step index (the synchronous Reactive-Forms bridge), OR `[validateStep]` = a `(step) => boolean | Promise<boolean>` callback for async / server-roundtrip checks. They do not combine.
3. **Slots** — project `slot="header"` (title + close), one `slot="step-{index}"` per step body component (literal index, never `*ngFor`), and `slot="footer-extra"` for tertiary actions like Cancel.
4. **Outputs** — wire `(falconWizardFinish)` to the submit call, `(falconWizardDraft)` to the partial-save call, `(falconStepValidationFail)` to a toast + focus-first-invalid-field, `(falconWizardStepChange)` for analytics.
5. **Variants** — `size` (`sm`/`md`/`lg`, forwarded to the embedded stepper), `useTailwind` (Light vs Shadow render path). There is no orientation toggle — the wizard is always stepper-on-top.
6. **Token override** — restyle footer buttons / content padding / header margin via `--falcon-wizard-*` tokens (`wizard.tokens.css`); the embedded stepper inherits all 14 `--falcon-stepper-*` token categories. Per-instance via `<falcon-angular-wizard class="x">` + `:where(.x){ --falcon-wizard-…: … }`.
7. **Shared upgrade / GAP** — `step.status` visualization, a Skip button for optional steps, a `disabled`/`busy` overall flag, a `reset()` method, async-validator awaiting in the bridge → all documented GAPS (`GAPS_AND_UPGRADES.md` items 1-9). Raise an upgrade, do not hand-roll.

## Anti-patterns
- Supplying BOTH `[validateStep]` and `[stepControls]` expecting them to merge — `validateStep` wins outright.
- `*ngFor` to emit `slot="step-{i}"` — the slot name must literally match `currentStep`; loop output may not.
- Driving error/completed dot visuals off `step.status` — it is declared but not visualized; use `currentStep`.
- Wrapping the wizard in a `<form>` when using `stepControls` — each step body owns its own `FormGroup`; the wizard is not a form.
- Building the unsaved-changes confirm modal inside the wizard — that is the consumer's `<falcon-angular-popup>`.
- Hand-rolling stepper + buttons instead of using this wizard for a new multi-step flow — the architect contract (§5.12.3) mandates this component.
- Adding custom CSS to reorder/restyle the footer — propose `--falcon-wizard-*` tokens instead.
- Expecting `falconStepValidationFail` to surface its own UI — it is a bare event; the consumer must show the toast / focus the field.
- Relying on `[(currentStep)]` two-way on the wrapper to read the advanced step — the wrapper `currentStep` is one-way (no `currentStepChange`); track via `(falconWizardStepChange)` (2026-06-03, GAP G-MODEL-1).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B20 REFRESH) — visual fingerprint + sibling-routing table + composition recipe re-confirmed against `falcon-wizard.tsx`. Added the `[(currentStep)]` anti-pattern (wrapper is one-way). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]`.
