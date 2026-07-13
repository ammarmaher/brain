# falcon-angular-wizard — OVERVIEW

## Purpose
Multi-step workflow **shell** that composes `<falcon-stepper>` plus a `[slot="step-{index}"]` content area plus a Next/Back/Finish/Draft footer. Adds optional per-step validation gating: a `validateStep` callback OR an Angular Reactive Forms `AbstractControl[]` (`stepControls`) bridge — Wave 5 contract. Dual-render Stencil (Shadow `<falcon-wizard>` + Light `<falcon-wizard-tw>` + Angular `<falcon-angular-wizard>`). Architect §5.12.3, Wave 9.G.

## Business / UI use case
- Any multi-step business form (Add Client, Add User, Add Subscription, etc.) where each step has its own form.
- The wizard owns the chrome (stepper + body + footer) so the consumer only writes per-step body components.
- The validation gate prevents the user from clicking Next until the current step's form is valid (mark-all-touched + return `control.valid`).

## When to use it / when NOT to use it
- USE for any new wizard / multi-step form. Default the import to `FalconAngularWizardComponent` in `imports: []`.
- USE when you want a single component to own stepper + body + footer (and you accept slot-based body projection).
- DO NOT use when the steps are non-sequential, free-form, or contextual (use tabs instead).
- DO NOT use when each step needs entirely different chrome (e.g., one full-screen page + one drawer) — the wizard expects a single content area.
- DO NOT use for a single-step form (just use the form + a normal button row).

## Status
- **ACTIVE / PREFERRED for any NEW wizard, but ZERO production adoption today** (`[CODE]` grep `<falcon-angular-wizard[ >]` across `apps/` + `libs/falcon/` → **0 element usages**, 2026-06-03). The org-hierarchy Add Client / Add User wizards in BOTH consoles still use the legacy `<falcon-stepper>` directly + manual Next/Back/Cancel buttons + `<falcon-angular-popup>` for unsaved-changes confirm; the end-of-wizard channel→submit→success sequence is handled by the separate `<falcon-angular-wizard-finalization>` orchestrator (see that dossier). This wizard **shell** remains the recommended target but is un-adopted.
- Architect §5.12.3 wizard contract. Wave 9.G + Wave 5 (validation bridge).

## Selectors / Tags
- **Angular selector:** `falcon-angular-wizard` `[CODE]` falcon-wizard.component.ts:37
- **Stencil Shadow tag:** `<falcon-wizard>` (`shadow: true`, default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-wizard-tw>` (`shadow: false`, default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.ts` (114 ln) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.html` (55 ln) |
| Angular index | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.tsx` (196 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.css` (98 ln — token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-wizard-tw/falcon-wizard-tw.tsx` (171 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.types.ts` (31 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/wizard-tailwind-classes.ts` (`falconWizard*Classes` — used by the `-tw` twin) |
| Tokens | `libs/falcon-ui-tokens/src/components/wizard.tokens.css` (~4 KB; `:where()` scoped — gate-12 OK) |
| React wrapper (generated) | `libs/falcon-ui-react/src/components.ts` (`FalconWizard` + `FalconWizardTw` event types present) |
| Spec/tests | _None found_ (no `*.spec.ts` / `*.e2e.ts` for wizard or wizard-tw or wrapper). |

> Note (drift correction 2026-06-03): the prior dossier listed `apps/host-shell/src/app/playground/playground.page.html` as the showcase consumer. The **playground route was removed** (`[MEMORY]` B01) and the wizard tag is NOT present in the current `falcon-ui-showcase` folder either — there is **no live consumer of any kind** this pass.

## Known consumers
- **None.** No production consumer and no showcase consumer found 2026-06-03. The org-hierarchy wizards are the standing migration target (they currently use `<falcon-stepper>` + manual footer).

## Related components
- `<falcon-angular-stepper>` — internal composition (the wizard renders one inside `<div class="falcon-wizard-stepper">`; Shadow uses `<falcon-stepper>`, `-tw` uses `<falcon-stepper-tw>`).
- `<falcon-angular-wizard-finalization>` — the **end-of-wizard** orchestrator (channel popup → submitFn → success dialog / error toast). It is NOT this shell; it is mounted alongside the legacy stepper today. See its dossier.
- `<falcon-angular-popup>` — recommended for the unsaved-changes confirmation modal (consumer-owned, not embedded by the wizard).
- `<falcon-angular-button>`-equivalent styling is used inside the wizard footer (native `<button>` + tokens, not the button component).

## Ownership / Responsibility
- Owned by Falcon UI core (Stencil + Angular wrapper).
- The Stencil component owns the slot layout + footer button rendering (header / step-{i} / footer-extra) + the `next()`/`back()`/`goTo()` navigation methods + the `validateStep` gate.
- The Angular wrapper adds the `stepControls` Reactive-Forms bridge — a derived `resolvedValidateStep` callback that marks the matching `AbstractControl` as touched and returns `control.valid`.
- Token contract: `wizard.tokens.css`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 REFRESH). Source-file table re-read across all layers; consumer count re-confirmed **0** (production + showcase). Drift corrected: stale playground consumer removed; `<falcon-angular-wizard-finalization>` relationship clarified (separate orchestrator, NOT this shell). Recommendation unchanged (ACTIVE/PREFERRED target, un-adopted).
