# falcon-angular-stepper — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-stepper>` as the component to use, and how to compose it to parity.

> Recognition note: an external design that shows a step rail belongs to the **Stencil-backed `<falcon-angular-stepper>`** documented here — NOT the legacy bespoke `<falcon-stepper>` in `libs/falcon/src/shared-ui/` (`falcon-stepper-legacy/`). The legacy one is reference-only; never target it for new work.

## Visual fingerprint
`[CODE]` `falcon-stepper.tsx` + `falcon-stepper.css`:
A horizontal (or vertical) row of **evenly-spaced solid circular dots**, 16/18/22 px (`sm`/`md`/`lg`), connected by a thin **track bar** (4 px) whose teal **fill** runs from the first dot to the active dot. Each dot shows a 1-indexed **number**, or a **check SVG** once completed, or a **pulse** when active with numbers off. Below/above each dot sits a **label** (12 px/500, teal when active) with an optional **description** line and an optional small **"Optional" tag**. Optional **group label** above the rail, optional **helper text** or red **error message** below it. States visible at a glance: `upcoming` (neutral dot), `active` (teal + halo), `completed` (teal + check), `error` (red dot), `disabled` (dimmed). Vertical mode draws connector lines between dots and an inline panel under each label.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Stepper>` + `<Step>` + `<StepLabel>` (+ `<StepContent>` for vertical) | direct conceptual 1:1 — MUI `activeStep` ≈ `activeValue`, MUI `completed` map ≈ `completedValues`. |
| PrimeNG | `<p-steps>` / `<p-stepper>` + `<p-stepperPanel>` | direct 1:1 — this component replaces `<p-stepper>` (PrimeNG uninstalled, Wave PR-8). |
| Ant Design | `<Steps>` + `<Steps.Step>` | `Steps` `current` ≈ `activeValue`; Ant `status` per step ≈ the `upcoming/active/completed/error` resolution. |
| Bootstrap | no native stepper — bespoke `.bs-stepper` plugin or a custom progress row | upgrade target — always replace with this. |
| shadcn / Radix | no first-class stepper; usually a hand-rolled flex row of `Badge` + `Separator` | replace the hand-roll with this component. |
| plain HTML | `<ol>` of numbered `<li>` + a `<progress>` bar | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a numbered dot rail tracking progress through an ordered flow | `<falcon-angular-stepper>` | — |
| the same rail PLUS Next/Back/Finish/Save-Draft buttons and per-step validation | `<falcon-angular-wizard>` (it wraps this stepper) | a bare stepper |
| parallel, non-sequential section switches (Hierarchy / Settings / Apps) | `<falcon-angular-tabs>` `mode="navigation"` | stepper |
| a guided "pick one card" choice | `<falcon-angular-tabs>` `mode="radio-cards"` | stepper |
| a checklist where the user ticks independent items | `<falcon-angular-checkbox-group>` | stepper |
| a single-screen percentage bar with no discrete steps | a `<progress>` or Tailwind bar | stepper |
| a free-form / hierarchical menu | `<falcon-angular-menu>` or a side rail | stepper |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.

1. **Inputs** — supply `[steps]` (`FalconStepperStep[]` with unique `value` + `label`, optional `description`/`icon`/`disabled`/`optional`/`errorMessage`), bind `[activeValue]` (or `[(ngModel)]`/`formControlName`/`[(activeValue)]`), bind `[completedValues]`. Set `mode` (`linear` for ordered flows), `orientation`, `size`, `showStepNumbers`, `showCheckOnComplete`, `groupLabel`, `helperText`/`errorMessage`.
2. **Step-gating** — to block forward navigation while a step is invalid, bind `[forwardLockedFrom]` to a computed of currently-invalid step values; listen to `falcon-navigation-blocked` (native listener — no wrapper Output yet) to reveal field errors.
3. **Slots** — project per-step body content as a top-level child annotated `slot="content-{value}"` (the `formatStepPanelSlot()` naming). One slot per step.
4. **Variants** — `orientation` (`horizontal`/`vertical`), `labelPosition` (`top-center`/`bottom-center`/`side`), `size` (`sm`/`md`/`lg`), `useTailwind` (Light vs Shadow render path).
5. **Token override** — restyle dots/track/labels/halo/motion via the 14 `--falcon-stepper-*` token categories in `stepper.tokens.css`; per-instance via `<falcon-angular-stepper class="x">` + `:where(.x){ --falcon-stepper-…: … }`. Never hardcode hex/px.
6. **Shared upgrade** — custom dot content beyond {number, check, pulse, icon}, inline per-step error text, an async `canAdvance` gate, dark-mode tokens → all are documented GAPS (`GAPS_AND_UPGRADES.md` items 2-6). Raise an upgrade, do not hand-roll.
7. **Wrapper** — if you need the full Next/Back/Finish + validation-bridge experience, do not bolt buttons onto the stepper — use `<falcon-angular-wizard>`, which composes this stepper.

## Anti-patterns
- Bolting your own Next/Back buttons + validation onto a bare stepper — use `<falcon-angular-wizard>` instead.
- Using `non-linear` for a flow whose later steps depend on earlier-step data — that breaks the business order contract.
- `[attr.disabled]` — no-ops the wrapper setter; always `[disabled]="…"`.
- Duplicate `value`s in `steps[]` — breaks the active/completed selectors and the dot-ref map.
- Targeting the legacy bespoke `<falcon-stepper>` (`libs/falcon/src/shared-ui/`) for new code — reference-only.
- Hand-painting dot CSS or animating the fill with JS — override tokens; the fill transition is token-owned.
- `<p-stepper>` / `<p-step>` anywhere — PrimeNG is uninstalled (`feedback_falcon_ui_library_only_no_native`).
- Treating `stepClick` as "navigation happened" — it fires even on a blocked click; listen to `valueChange`.
