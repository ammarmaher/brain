# falcon-form-field — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-form-field.component.ts` is a pure presentational Angular wrapper — 7 signal inputs, 0 outputs, no service injection, no HTTP. It owns no data. The field it wraps belongs to whatever backend the host flow targets:
- Add Client step fields → **Commerce** (account / node) via the System Gateway.
- Add User step fields → **Identity** (user lifecycle).
- `[INFERRED]` The wrapper never calls any of them — it only renders the label/error chrome around a control whose value the consumer's `FormGroup` owns.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The wrapper makes no calls. The slotted control's value and the enclosing wizard step's submit are the consumer's responsibility. |

## Validation rules (V-*)
The wrapper runs **no validators of its own** — it is a *display surface* for a verdict the consumer computes. The V-rules belong to the enclosing wizard step's `FormGroup`.

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field display | any wrapped field marked `[required]="true"` | submit / blur with empty value | the consumer's validator sets `errorKey`; the wrapper renders the red `*errorKey | translate` line — `[CODE]` `falcon-form-field.component.html:20-24` |
| Max-length / pattern display | wrapped text fields | the consumer's validator fails | `errorKey` + `errorParams` (e.g. `{ max: 30 }`) interpolated into the message — `[CODE]` `falcon-form-field.component.html:23` |
| Explicit invalid override | the whole field | consumer sets `[invalid]="true"` | `hasError` returns `invalid()` directly, bypassing `errorKey` inference — `[CODE]` `falcon-form-field.component.ts` (per `API.md`) |
| Field-level V-rules (Add Client / Add User) | each wizard step field | per the step's `validations/validations.ts` | owned by the step's `FormGroup` validators per the Component-Folder doctrine — the wrapper only displays the result |

`[BRAIN-OUT]` Per the Component-Folder + Validation Doctrine (`CLAUDE.md` §"Component Folder + Validation Doctrine"), validation rules for a wizard step live in that step's `validations/validations.ts` and are injected via a per-component `InjectionToken`. `<falcon-form-field>` is downstream of all of that — it surfaces the verdict, it does not compute it.

## PES keys gating this component
The wrapper has **no PES key of its own**.
- `[INFERRED]` Whether a field is editable (and thus whether `<falcon-form-field [disabled]="true">`) may be driven by a PES resolution in the enclosing step — e.g. a Falcon-only field disabled for client users. The wrapper only sees the resulting `disabled` boolean, not the key.
- `[BRAIN-OUT]` Per the `falcon-dropdown` exemplar, a presentational component "inherits the gate of the field it renders" — the same applies: `<falcon-form-field>` inherits the wizard step's PES posture.

## State / signal pattern
`[CODE]` `falcon-form-field.component.ts` (per `API.md`):
- All 7 inputs are Angular signal inputs (`input()`): `label`, `required`, `hint`, `errorKey`, `errorParams`, `disabled`, `invalid`.
- A `computed` `hasError` signal returns `invalid()` when explicitly set, otherwise `!!errorKey()`.
- 0 outputs — the wrapper emits nothing; it is purely a render of inputs around projected content.
- `[CODE]` `falcon-form-field.component.html` uses Angular `@if` control flow for the label row and the error/hint mutual-exclusion.
- `[INFERRED]` In the real consumers the inputs are fed from `computed()` signals over the step's `FormGroup` — e.g. `[errorKey]="firstNameError()?.key ?? null"` (`USAGE.md` Example 1).

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton** — this is a pure-Angular bespoke component (`falcon-form-field.component.{ts,html,scss}`). It pre-dates the Stencil-skeleton + Angular-wrapper discipline. There is no Light/Shadow render path and no token contract (`GAPS_AND_UPGRADES.md` G1 — it still has a `.scss` file, violating the no-SCSS rule).
- **App / state layer** — the consuming wizard step owns the `FormGroup`, the validators (`validations/validations.ts`), the API service, and computes the `errorKey`/`required`/`disabled` inputs the wrapper renders.
- Per `feedback_library_skeleton_app_api`, a Stencil twin would split presentational chrome from the app's validation state — that port is the recommended (and currently un-done) upgrade.

## Integration gotchas
- `[CODE]` `falcon-form-field.component.html` **No `for`/`htmlFor` on the `<label>`** — the rendered `<label>` is not programmatically associated with the slotted control's `id` (`GAPS_AND_UPGRADES.md` G2). Screen readers may not announce the label on inner-control focus. The consumer should set a shared id explicitly until this is fixed.
- **Double-label** — `<falcon-form-field label="X">` around a `<falcon-angular-input label="X">` renders the label twice. The inner Falcon input has built-in label support; in legacy code set the label on exactly one. New code must not wrap Falcon inputs at all.
- **`hasError` does not cross-bind the slotted control's `state`** (G5) — the consumer must drive both: `[errorKey]` on the wrapper AND `[state]="error ? 'error' : 'default'"` on the inner control (the real usage examples do exactly this).
- **`required` asterisk ≠ `aria-required`** (G4) — set `required` on the wrapper for the visual and `aria-required` on the slotted control for AT.
- **`label`/`hint`/`errorKey` are i18n keys** — passing a translated string ships a missing-translation artifact; both `en.json` and `ar.json` must carry the key.
- `[CODE]` `falcon-form-field.component.html:34` Note the SCSS file still exists and the template carries one literal class `ff-slot` — a cleanup flag (`GAPS_AND_UPGRADES.md` G1), not a runtime risk.

## Verification
✅ VERIFIED in production usage — `<falcon-form-field>` is consumed by the confirmed-working Add Client / Add User wizard steps (`USAGE.md` Wave 7 — 5 consumers). Template + signal behaviour (`hasError` precedence, error/hint exclusion, no `for=` on label) is ✅ VERIFIED against `[CODE]` `falcon-form-field.component.html` (read in full) + the existing `API.md`. Backend-wiring table is intentionally empty — the wrapper has zero backend surface by design. PES rows are 🔴 INFERRED — the wrapper sees only the resolved `disabled` boolean.
