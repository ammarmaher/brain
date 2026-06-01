# falcon-angular-wizard — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-wizard.tsx` has no HTTP client and no service injection — it composes a `<falcon-stepper>` + slot bodies + a footer. The data behind a wizard belongs to whatever backend the host flow targets:
- Add Client wizard → **Commerce** (account / node creation) via the System Gateway.
- Add User wizard → **Identity** (user lifecycle).
- `[INFERRED]` The wizard never calls any of them — each step body component owns its API service, and the Finish handler triggers the final submit in the consumer.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The wizard makes no calls. Per-step bodies + the consumer's Finish handler own all backend wiring. |

`[INFERRED]` Integration shape: each step body owns a `FormGroup` + an API service; the consumer feeds those `FormGroup`s into `[stepControls]` (one per step index) for the validation gate, listens to `(falconWizardFinish)` to fire the create/submit call, and `(falconWizardDraft)` to fire a partial-save call. The wizard is a pure orchestration shell over those consumer-owned interactions.

## Validation rules (V-*)
The wizard runs **step-progression validation**, not field validation. Two strategies, mutually exclusive (`validateStep` wins if both given).

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `validateStep` gate | current step | `next()` or `handleFinish()` | `validateStep(currentStep)` resolves false → `falconStepValidationFail` emitted with `{ step }` — `[CODE]` `falcon-wizard.tsx:80-86,107-113` |
| `stepControls` bridge | current step's `AbstractControl` | `next()` / Finish (via derived `validateStep`) | wrapper runs `ctrl.markAllAsTouched(); return ctrl.valid;` — `[CODE]` `falcon-wizard.component.ts` `resolvedValidateStep` (per `API.md`) |
| `canProceed` hard-gate | whole step | `next()` / `handleFinish()` | early-return, no event — `[CODE]` `falcon-wizard.tsx:78,105` |
| Bounds gate | step index | `goTo(step)` | `step < 0 \|\| step >= steps.length` → no-op — `[CODE]` `falcon-wizard.tsx:68` |
| Field-level V-rules | step body fields | submit / blur inside a step body | owned by the step body's `FormGroup` validators, NOT the wizard |

`[CODE]` `falcon-wizard.tsx:81` The `validateStep` gate is `await`-aware: `await Promise.resolve(this.validateStep(this.currentStep))` — so a `validateStep` returning `Promise<boolean>` (a server-roundtrip uniqueness check) is supported. The `stepControls` bridge is **synchronous only** (`ctrl.valid`) and does not await `ctrl.pending` — a known gap (`GAPS_AND_UPGRADES.md` item 6).

## PES keys gating this component
The wizard has **no PES key of its own** — it is an orchestration shell.
- `[INFERRED]` Which steps the wizard renders (e.g. a Falcon-only Owner step) is decided by the consumer's `steps` array, which may itself be PES-driven.
- A `step.disabled` flag may be set from a PES denial — the wizard only sees the boolean.
- `[INFERRED]` The Finish action's true authorization is enforced by the backend on the submit call — the wizard's `canProceed` / `validateStep` are UX gates, not security gates.

## State / signal pattern
`[CODE]` `falcon-wizard.tsx` + `falcon-wizard.component.ts` (per `API.md`):
- `currentStep` is `@Prop({ mutable: true })` — two-way; the consumer typically drives a `signal<number>(0)` and binds `[(currentStep)]`.
- `[stepControls]` accepts `ReadonlyArray<AbstractControl | null>` (one per step). The wrapper derives `resolvedValidateStep` from it; the derived validator guards with `if (!this.stepControls?.length) return undefined;`.
- 6 wrapper Outputs: `falconWizardNext`, `falconWizardBack`, `falconWizardFinish`, `falconWizardDraft`, `falconWizardStepChange`, `falconStepValidationFail`.
- `[INFERRED]` Error-pipeline: a failed Finish *submit* (the consumer's API call) flows through the host-shell HTTP error pipeline (`falcon-http-ui.config.ts` — 400 → top-right toast, 5xx → popup) — the wizard itself emits no HTTP errors.
- `[CODE]` `falcon-wizard.tsx:140-145` The embedded `<falcon-stepper>` receives `[activeIndex]="currentStep"` — note the wizard composes a numeric `activeIndex` whereas the public `<falcon-stepper>` API exposes `activeValue` (string|number); a small composition asymmetry.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-wizard.tsx` (`<falcon-wizard>`, Shadow) + `falcon-wizard-tw.tsx` (`<falcon-wizard-tw>`, Light). Owns the 3-row layout (header / stepper / content / footer) and footer button rendering; no services, no data.
- **Angular wrapper** — `<falcon-angular-wizard>`: adds the `stepControls` Reactive-Forms bridge (the only "smart" part of the wrapper — it derives `validateStep` from injected `AbstractControl`s). Not a CVA.
- **App / state layer** — the consumer owns per-step `FormGroup`s, all API services, the Finish/Draft submit calls, and the cancel-with-dirty-state `<falcon-angular-popup>`. Per `feedback_library_skeleton_app_api`, the library never fetches.

## Integration gotchas
- `[CODE]` `falcon-wizard.tsx:154` **`slot="step-{currentStep}"` is the ONLY rendered body** — sibling step slots are projected but unrendered. `*ngFor` to emit `slot="step-{i}"` is unsafe; the slot name must be a literal string matching `currentStep`.
- **Do not combine `validateStep` + `stepControls`** expecting a merge — `validateStep` wins outright (`falcon-wizard.tsx:80` checks `validateStep` first, the wrapper only injects the derived one when no direct `validateStep` is given).
- **`step.status` is a no-op** — declared on `FalconWizardStep` but the Stencil source renders state from `currentStep` index only. Do not drive error/completed visuals off `status`.
- **`stepControls` marks the WHOLE control tree touched** — for a step with nested `FormArray`s ensure the structure is a single `AbstractControl` per step.
- **`currentStep` re-emission re-renders the embedded stepper** — negligible for 5 steps, measurable past ~20 (`GAPS_AND_UPGRADES.md` perf note).
- **The async-validator awaiting gap** — if a step uses `falconCheckExists`-style async validators, the synchronous `stepControls` bridge may pass/fail on a stale `ctrl.valid`. For server-roundtrip validation use a custom `validateStep` that awaits.
- `[INFERRED]` **Wire-format / gateway concerns** belong to the step body services, not the wizard — the same camelCase-wire + `useGateway()` + `FALCON_ROOT_NODE.id → null` rules the org-hierarchy memory entries describe apply to the *consumer's* API calls, not to the wizard component.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-wizard.tsx` (read in full) + the existing UI dossier. The validation-gate behaviour (`validateStep` await-aware, `canProceed` hard-gate, bounds check, `stepControls` precedence) is ✅ VERIFIED against source. Backend-wiring rows are 🔴 INFERRED — the wizard has zero backend surface by design; the empty table is intentional and data ownership is attributed to the host flow's module + step bodies.
