# falcon-angular-stepper — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-stepper.tsx` has no HTTP client, no fetch path, no service injection — `API.md` confirms "The stepper is presentation-only — there is no async data fetch path." The stepper owns *navigation state* only. The data behind each step (the form payloads) is owned by whatever backend module the host flow targets:
- Add Client steps → **Commerce** (account / node creation) via the System Gateway.
- Add User steps → **Identity** (user lifecycle).
- `[INFERRED]` The stepper never touches any of them; it only reflects `activeValue` / `completedValues` the consumer computes.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The stepper makes no calls. The *wizard* / *consumer* owns all backend wiring; the stepper consumes `[completedValues]` derived from per-step submit success. |

`[INFERRED]` Integration shape: each step's body component owns its own `FormGroup` + API service; on a successful per-step persist (or a passed validation gate), the consumer pushes that step's `value` into `completedValues` and advances `activeValue`. The stepper is a pure sink for those two signals.

## Validation rules (V-*)
The stepper does not run field validators — it runs **navigation validation** (which step is reachable). Field-level V-rules live in each step body.

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Linear-order gate | step navigation | click a step beyond `activeIdx + 1` that is not completed | `falcon-navigation-blocked` detail `reason: 'linear'` — `[CODE]` `falcon-stepper.tsx:194` |
| Forward-lock gate | step navigation | forward click while current step's value is in `forwardLockedFrom` | `falcon-navigation-blocked` detail `reason: 'forward-locked'` — `[CODE]` `falcon-stepper.tsx:182-188` |
| Disabled-step gate | step navigation | click a step whose `step.disabled === true` | `falcon-navigation-blocked` detail `reason: 'disabled'` — `[CODE]` `falcon-stepper.tsx:179` |
| Per-step error surfacing | a whole step | consumer sets `step.errorMessage` (its form failed) | dot flips to `error` state — `[CODE]` `falcon-stepper.utils.ts:75` |
| Field-level V-rules | step body fields | submit / blur inside a step | owned by the step body component, NOT the stepper |

`[CODE]` Block-check order is fixed in `resolveNavigationBlock()` (`falcon-stepper.tsx:175-195`): per-step `disabled` → `forward-locked` (consumer gate) → `linear` skip rule. The forward-lock check precedes the linear check *deliberately* so the consumer gate wins even on an adjacent-step click that linear mode would otherwise allow.

## PES keys gating this component
The stepper has **no PES key of its own** — it is a presentational primitive. PES gating happens one layer up:
- `[INFERRED]` Whether a *step exists at all* (e.g. the Owner step) is decided by the consumer's `visibleSteps()` computed, which may itself be PES-driven (Falcon-only vs client-user step sets).
- A `step.disabled` flag may be set from a PES denial — but the stepper only sees the boolean, not the key.
- `[BRAIN-OUT]` Per the `falcon-dropdown` exemplar pattern, a presentational component "inherits the gate of the field/flow it renders" — the same applies here: the stepper inherits the flow's PES posture.

## State / signal pattern
`[CODE]` `falcon-stepper.component.ts` (per `API.md`):
- `activeValue` setter feeds an internal Angular `signal()` so an `OnPush` host sees the change; it is the CVA value (`writeValue` / `[(ngModel)]` / `formControlName` all bind it).
- `completedValues` is a plain `@Input` — the consumer typically supplies a `computed<readonly (string|number)[]>()`.
- `disabled` setter writes a `disabledSig` signal.
- `@Input() steps` setter pushes imperatively to the live Stencil element (`el.steps = …`) because Angular's attribute fallback would stringify the array.
- `[CODE]` `falcon-stepper.tsx:89-102` The Stencil component emits 5 events; the wrapper (`[CODE]` ts:118-124 + html:11-14/24-27) intercepts ALL of them: `falcon-change` → `valueChange`, `falcon-step-click` → `stepClick`, `falcon-complete` → `stepComplete`, `falcon-navigation-blocked` → `navigationBlocked`, `falcon-blur` → `onTouched()`. **CORRECTION 2026-06-03: `falcon-navigation-blocked` IS surfaced as the wrapper `@Output() navigationBlocked`** (the prior dossier wrongly said it was not) — consumers wire it declaratively (`(navigationBlocked)="…"`), as the live wizards do.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-stepper.tsx` (`<falcon-stepper>`, Shadow) + `falcon-stepper-tw.tsx` (`<falcon-stepper-tw>`, Light DOM). Pure presentational + navigation-gating; zero service injection. Per `feedback_library_skeleton_app_api`, the skeleton owns behaviour + a11y, never data.
- **Angular wrapper** — `<falcon-angular-stepper>`: CVA, signal-backed inputs, imperative `steps` sync via `componentOnReady().then(assign)`.
- **App / state layer** — the consumer (or `<falcon-angular-wizard>`) owns `completedValues` derivation, `forwardLockedFrom` derivation, per-step form validation, and all backend calls. The library never reaches into the app.

## Integration gotchas
- `[CODE]` `falcon-stepper.tsx:202-218` **A blocked click still fires `falcon-step-click` first, THEN the block** — `handleDotClick` emits `falcon-step-click` unconditionally (for analytics) and only afterwards checks the block. Consumers must not treat `stepClick` as "navigation happened" — listen for `valueChange` for an actual transition, and `navigationBlocked` for a rejection.
- `[CODE]` **`(navigationBlocked)` is the canonical block-feedback channel** — the live wizards bind `(navigationBlocked)="onNavigationBlocked($event)"` to reveal the offending step's field errors (`[CODE]` add-client-wizard.component.html:66). The detail carries `attemptedValue` / `currentValue` / `direction` / `reason` (`'linear' | 'disabled' | 'forward-locked'`). No native `addEventListener` needed (the prior dossier's workaround is obsolete).
- `[CODE]` `falcon-stepper.tsx:62` **`activeValue` reflects to the DOM attribute, `completedValues` does not** — attribute-watching tooling sees the active step but not the completed set.
- **Steps array reference identity** — the wrapper's `steps` setter pushes on every parent ref change. A consumer that recreates the array each CD cycle re-renders the dot row each cycle; use an immutable `computed()` (the real consumers do).
- **`[disabled]` must be a property binding** — same trap as the dropdown: `[attr.disabled]` does not trigger the wrapper's setter, so the inner Stencil stepper stays enabled.
- `[CODE]` `falcon-stepper.tsx:375` Per-step disabling: the HTML `disabled` attribute on the dot is bound to `step.disabled || this.disabled` only — for linear / forward-lock blocks the button stays `disabled={false}` so the click still fires and emits `falcon-navigation-blocked`. That is the contract: `aria-disabled` reflects ALL block reasons, but native `disabled` reflects only true disablement.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) from `[CODE]` `falcon-stepper.tsx` + `.utils.ts` + the wrapper `.ts`/`.html` (read in full). Navigation-validation rules + block-check order ✅ VERIFIED against source. **Drift corrected:** `navigationBlocked` IS a wrapper `@Output` (declarative `(navigationBlocked)` binding, no listener workaround). Backend-wiring rows remain 🔴 INFERRED — the stepper has zero backend surface by design.
