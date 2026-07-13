# falcon-textarea — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None — presentational only.** The component owns no data and calls no endpoint. Its string value is bound by CVA into whatever parent form/payload hosts it; the **backend module that owns the persisted field** is the flow's owner (e.g. Commerce for an account address captured in Add Client; Identity for a user note in Add User). The textarea is module-agnostic.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Field value | CVA (`writeValue` / `onChange`) into the parent reactive form group | (the flow's owning module) | `[CODE]` `falcon-textarea.component.ts:99-117` — value flows as a plain `string`, no transform |
| Disabled state | Angular Forms `setDisabledState` only | — | `[CODE]` `falcon-textarea.component.ts:108-110` — no `[disabled]` input exists |
| Submit | parent step serializes the form; textarea contributes one string key | (flow owner) | textarea never POSTs on its own |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error |
|---|---|---|---|
| Required-field | any `required` textarea | submit with empty value | field-level "required" — surfaced via `errorMessage` input |
| Max-length | length-capped fields | typing past `maxlength` | native browser cap — input is blocked, no error fires `[CODE]` `falcon-textarea-tw.tsx:257` |
| `[INFERRED]` Min-length / format | description fields with a business floor | submit below floor | not enforced by the component — parent reactive validator (`Validators.minLength`) must own it |

The textarea **does not validate**. It renders `errorMessage` / `state='error'` when the parent passes them, and exposes `aria-invalid`. All `V-*` logic lives in the parent step's `validations/validations.ts` per the Falcon validation doctrine.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | The textarea has no PES key. Where its host field is PES-gated, the parent step disables the **form control** (CVA `setDisabledState`) — there is no `[disabled]` input to bind a PES result to directly. |

## State / signal pattern
`[CODE]` `falcon-textarea.component.ts:86-91` — wrapper holds two signals: `value` (string) and `disabled` (boolean), both written by CVA. `resolvedId` is a once-computed unique id (`falcon-ata-{seq}`). `[CODE]` `falcon-textarea-tw.tsx:86,111-119` — the Stencil layer keeps `focused` + `resolvedId` state and a `@Watch('value')` that re-syncs the native `<textarea>` and re-runs auto-resize. No service injection, no error-pipeline involvement.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-textarea>` (Shadow DOM, `falcon-textarea.tsx`) / `<falcon-textarea-tw>` (Light DOM, Tailwind, `falcon-textarea-tw.tsx`). Pure presentational; emits `falcon-input` / `falcon-change` / `falcon-focus` / `falcon-blur`.
- **Angular wrapper** — `<falcon-angular-textarea>`: CVA bridge + tag-switcher on `useTailwind` (default `true` → Light DOM). `[CODE]` `falcon-textarea.component.ts:45-47` registers the web component lazily via `defineFalconTwComponent('falcon-textarea')` in `ngOnInit`.
- Per `feedback_library_skeleton_app_api`, the library component never fetches — the app/state layer owns data.

## Integration gotchas
- `[CODE]` **No wrapper `@Output`s** — `falcon-change` / `falcon-input` / `falcon-blur` from Stencil are consumed internally; value escapes only through CVA. A consumer needing a debounced or raw change event must use the form control's `valueChanges`, not a template event binding.
- `[CODE]` `falcon-textarea.component.ts` **No `disabled` `@Input()`** — the existing `API.md` lists ~22 inputs but `disabled` is **not** among them (correction: disabled is CVA-only). To disable, call `control.disable()`.
- `[CODE]` `falcon-textarea-tw.tsx:80-83,235-280` **Icon slots `iconLeft` / `iconRight` DO exist** (correction: `API.md` "Slots: None" is stale — the 2026-05-17 unified icon-slot API added `slot="icon-left"` / `slot="icon-right"`, projected through by the wrapper template's `<ng-content>`).
- `[CODE]` `falcon-textarea.types.ts:8` defines `FalconTextareaResize` (`none|vertical|horizontal|both`) but **no `resize` prop consumes it** — resize behavior is token/CSS-driven only; the type is currently dead (matches `GAPS_AND_UPGRADES` G5).
- `[CODE]` `falcon-textarea-tw.tsx:150-169` Auto-resize measures `scrollHeight` on every input — a known performance watch-point for very long content (`DECISION.md` risk #10).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B01) — CODE-DERIVED from `falcon-textarea-tw.tsx`, `falcon-textarea.component.ts`, `falcon-textarea.component.html`, `falcon-textarea.types.ts` re-read this pass. The three legacy corrections (icon slots exist; no `disabled` input; `FalconTextareaResize` dead) re-confirmed; added: wrapper has ZERO `@Output`s (no `(blur)` re-emit, diverges from input — G1). Backend-module mapping 🔴 INFERRED — the textarea is genuinely module-agnostic.
