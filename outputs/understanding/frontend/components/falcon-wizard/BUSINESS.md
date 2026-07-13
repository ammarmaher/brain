# falcon-angular-wizard — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` The wizard is the **end-to-end shell for a multi-step business form**. Where the stepper only *shows* progress, the wizard *governs* it: it owns the chrome (stepper rail + per-step body + Next/Back/Finish/Save-Draft footer) and the validation gates that decide whether the operator may proceed. In business terms it is the enforcement layer for "complete each step correctly, in order, before the transaction is committed" — the pattern behind Add Client, Add User, and every future Add-X flow.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A later step is not reachable until the prior step is valid | `[BRAIN-OUT]` Add Client folder `README.md` (5-step wizard) + `[CODE]` `falcon-wizard.tsx:77-92` | `next()` runs the `validateStep` gate for the *current* step; if it returns false the wizard does not advance and `falconStepValidationFail` fires instead. |
| Submit (Finish) is blocked when the current step is invalid | `[CODE]` `falcon-wizard.tsx:104-114` | `handleFinish()` runs the same `validateStep` gate before emitting `falconWizardFinish`; an invalid step blocks the final submit. |
| `canProceed` hard-blocks forward motion | `[CODE]` `falcon-wizard.tsx:78,159-190` | `next()` and `handleFinish()` early-return when `canProceed === false`; the Next/Finish buttons render `disabled`. |
| Each step's own form owns its field-level rules | `[BRAIN-OUT]` Add Client folder per-step section files (`02..07`) + `[CODE]` `falcon-wizard.component.ts` `stepControls` bridge | The Reactive-Forms `[stepControls]` bridge marks the step's `AbstractControl` touched and returns `control.valid` — field rules live in the step body, the wizard only consults the verdict. |
| Owner Role is the invariant owner of an account (BR-AM-19) | `[MEMORY]` project_add_client_wizard_wave7_1_prd_defaults | Surfaced in the wizard's Owner step body — the wizard delegates field defaults to the step component; it does not encode BR-AM-19 itself. |
| Back navigation is always permitted | `[CODE]` `falcon-wizard.tsx:94-102` | `back()` has no validation gate — the operator may always return to correct an earlier step. |

## Business constraints baked in
- `[CODE]` `falcon-wizard.tsx:80-86` **Forward = gated, Back = free.** The validation gate runs ONLY on `next()` / `handleFinish()`. `back()` never validates. This encodes "you may always revisit and correct, you may never skip ahead broken".
- `[CODE]` `falcon-wizard.tsx:79` **Cannot advance past the last step.** `next()` early-returns when `currentStep >= steps.length - 1`; the last step shows Finish, not Next.
- `[CODE]` `falcon-wizard.tsx:158` **Back is suppressed on the first step** regardless of `showBack` — a flow has no "before step 1".
- `[CODE]` `falcon-wizard.tsx:24` **`currentStep` is 0-indexed.** The first step is index 0. (The legacy bespoke stepper was 1-indexed — a migration footnote, see `GAPS_AND_UPGRADES.md` item 2.)
- `[CODE]` `falcon-wizard.component.ts` (per `API.md`) **`validateStep` beats `stepControls`.** If both are supplied, the direct `validateStep` callback wins outright — they do not combine. A builder must pick one validation strategy per wizard.
- `[INFERRED]` **The wizard owns no form.** It does not wrap a `<form>`; each step body owns its own `FormGroup`. The wizard composes form controls — it is not itself a form control (not a CVA).
- `[CODE]` `falcon-wizard.tsx:166-169` **Save Draft saves but does not close.** `falconWizardDraft` is a distinct event from Finish — a draft is a partial-commit business action, not flow completion.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard (5 steps) | organization-hierarchy | Full shell: Information → Settings → Channels → Applications → Owner, with per-step validation gating + Finish submit. 🟡 target consumer — production wizards still run the legacy bespoke stepper + manual buttons. |
| Add User wizard | organization-hierarchy | Full shell for the Add User flow (personal → role/status → permissions). 🟡 same migration status. |
| Add Subscription / Add Contact Group (future) | organization-hierarchy | `[INFERRED]` Any future multi-step business form — the architect contract says all new wizards use this component. |
| ~~Playground showcase~~ | ~~host-shell~~ | **REMOVED (2026-06-03)** — the playground route was deleted (`[MEMORY]` B01); no showcase consumer remains. The wizard shell currently has **0 consumers of any kind**. |

## Business gotchas
- `falconStepValidationFail` is a **business signal, not an error** — it means "the operator tried to advance with an invalid step". The consumer MUST react (toast + focus the first invalid field); otherwise the Next button looks dead.
- The `stepControls` bridge runs `markAllAsTouched()` then `return ctrl.valid` — **synchronously**. If a step has async validators (uniqueness check), `ctrl.valid` may be momentarily false; for server-roundtrip validation use a custom `validateStep` that `await`s the result (see `USAGE.md` async example).
- `step.status` on `FalconWizardStep` is declared but **not visualized** (`GAPS_AND_UPGRADES.md` item 1) — flagging `status: 'error'` does not paint the dot red. Drive completion off `currentStep` index, not `status`.
- Cancel-with-unsaved-changes is **NOT** the wizard's job. The wizard owns Next/Back/Finish/Draft only; a Cancel button goes in `slot="footer-extra"` and the dirty-state confirm modal is the consumer's `<falcon-angular-popup variant="unsaved">`.
- The wizard does not destroy non-current step bodies — sibling `slot="step-{i}"` content stays in the DOM (just unrendered). Heavy step bodies still run lifecycle hooks (`GAPS_AND_UPGRADES.md` item 11).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B20 REFRESH) — step-gating rules (forward-gated/back-free, `canProceed` block, last-step Finish, validate-on-Finish, 0-indexed, draft≠finish) re-confirmed against `falcon-wizard.tsx`. Stale playground row struck through (route removed). The Add Client / Add User features prove the *business pattern* but run on the legacy `<falcon-stepper>` + manual footer + `<falcon-angular-wizard-finalization>` — this shell still has **0 production consumers** (B20 Consumer Sweep). Rule cross-refs (BR-AM-19, Add Client README) 🟡 CODE-DERIVED / `[MEMORY]`.
