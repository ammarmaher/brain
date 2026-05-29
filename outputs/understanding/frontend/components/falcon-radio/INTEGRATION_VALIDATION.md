# falcon-radio — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None — presentational only.** The component owns no data. The selected `value` is bound by CVA into the parent form and persisted by whatever module owns the field:
- **Identity** — OTP delivery-channel choice (the radio set inside `<falcon-angular-otp-send-dialog>` feeds an Identity-backed OTP-send request).
- **Commerce / others** — any wizard/setting whose mode/type field is a radio choice.
The radio is module-agnostic; the parent flow names the endpoint.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Selected value | CVA — `writeValue` (group value in) / `onChange` (this radio's `value` out) | (the flow's owner) | `[CODE]` `falcon-radio.component.ts:91-93,105-112` — emits `value` when checked, `null` otherwise |
| Selection event | `(valueChange)` `@Output`, `boolean` | — | `[CODE]` `falcon-radio.component.ts:71,111` — `true` when this radio becomes checked |
| Parent-driven check | `[checkedInput]` `@Input` (bypasses CVA) | — | `[CODE]` `falcon-radio.component.ts:60-62` — used by `<falcon-angular-radio-group>` to drive the radio without its own form control |
| Disabled state | Angular Forms `setDisabledState` only | — | `[CODE]` `falcon-radio.component.ts:100-102` — no `[disabled]` `@Input()` |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-choice | the radio group | submit with no option selected | `Validators.required` on the group's form control → `errorText` shown on radio(s) |
| `[INFERRED]` Conditional option-set | branching choices | a prior answer changes which radios are valid | parent step's `validations/validations.ts` — the radio only renders the state passed to it |

The radio does not validate. It renders `state='error'` + `errorText` when the parent supplies them and exposes `aria-invalid`. "Must pick one" is a **group/parent** rule.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | No PES key. A PES-locked choice is disabled via the parent form control (`control.disable()`), which flows to `setDisabledState`. A pre-decided choice (e.g. a business invariant) is rendered checked + the control disabled — mirroring the locked-dropdown pattern (`falcon-dropdown` BUSINESS.md, BR-AM-19). |

## State / signal pattern
`[CODE]` `falcon-radio.component.ts:77-82` — wrapper holds `checked$` + `disabled` signals and a once-computed `resolvedId` (`falcon-arad-{seq}`). Two ways the checked state is set: (a) CVA `writeValue` comparing the group value to this radio's `value`; (b) the `checkedInput` setter for parent-driven binding. `[CODE]` `falcon-radio.tsx:52-53` — Stencil keeps `focused` + `resolvedId` and a `@Watch('checked')` that re-syncs the native input. No service injection.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-radio>` (Shadow DOM, `falcon-radio.tsx`) / `<falcon-radio-tw>` (Light DOM, Tailwind). `[CODE]` `falcon-radio.tsx:1-8` — a real native `<input type="radio">` with the visible mark drawn by **growing the mark's border from 1.5px to 5px on `:checked`** (the "border-width-5 trick" — no separate inner-dot element). Emits `falcon-change` / `falcon-blur` / `falcon-focus`.
- **Angular wrapper** — `<falcon-angular-radio>`: CVA bridge + tag-switcher on `useTailwind`. `[CODE]` `falcon-radio.component.ts:44-46` lazy-registers the web component.
- Group-level keyboard navigation (arrow keys move selection) is NOT here — it lives on `<falcon-angular-radio-group>`.

## Integration gotchas
- `[CODE]` `falcon-radio.component.ts:50-52` **`errorText` IS forwarded** — the wrapper input is named `errorText`, but the template (`falcon-radio.component.html:11,33`) binds it to the Stencil prop `error-message`. So passing `errorText` does work end-to-end (clarification: the wrapper input name and the Stencil prop name differ — `API.md` correctly lists `errorText` on the wrapper; the Stencil-level prop is `errorMessage`).
- `[CODE]` `falcon-radio.component.ts` **No `disabled` `@Input()`** — disabled is CVA-only. A standalone disabled radio must be driven through a disabled form control or via the group.
- `[CODE]` `falcon-radio.component.ts:91-93` **CVA writeValue takes the GROUP value, not a boolean** — the radio self-determines `checked` by `value === groupValue`. Binding a boolean form control directly to a single radio will not behave as a checkbox would.
- `[CODE]` `falcon-radio.tsx:100-105` **No change event on un-check** — when another same-`name` radio is picked, the browser does not fire `change` on the now-unchecked radio. Consumers must read the *newly-checked* radio's value, never wait for an "off" event.
- `[CODE]` `falcon-radio.tsx:82-87` `select()` and `setFocus()` are Stencil `@Method`s but are **not proxied** on the Angular wrapper (`DECISION.md` G4) — no programmatic select from app code.
- `[CODE]` `falcon-radio.tsx:60-61` Stencil emits `falcon-focus`; the wrapper consumes only `falcon-change` + `falcon-blur` (`API.md` "Stencil emits falcon-change + falcon-blur" is incomplete — `falcon-focus` also exists).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-radio.tsx` + `falcon-radio.component.ts` + `falcon-radio.component.html`. Two clarifications to the legacy 6-file dossier documented (`errorText`→`error-message` forwarding confirmed working; `falcon-focus` event also exists). Backend-module mapping 🔴 INFERRED — the radio names no endpoint.
