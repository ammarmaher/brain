# falcon-radio — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None — presentational only.** The component owns no data. The selected `value` is bound by CVA into the parent form and persisted by whatever module owns the field:
- **Commerce** — wallet balance-type / wallet-type config (the wallet-balance radio sets feed a Commerce wallet-settings payload).
- **Commerce / templates** — template message-type / flow-type selection.
- **Commerce / Identity** — wizard branching choices (org-hierarchy add-client/add-user steps).
The radio is module-agnostic; the parent flow names the endpoint.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Selected value | CVA — `writeValue` (group value in) / `onChange` (this radio's `value` out) | (the flow's owner) | `[CODE]` falcon-radio.component.ts:102-104,116-128 — emits `value` when checked, `null` otherwise |
| Selection event | `(valueChange)` `@Output`, `boolean` | — | `[CODE]` falcon-radio.component.ts:82,127 — `true` when this radio becomes checked |
| Parent-driven check | `[checkedInput]` setter (bypasses CVA) | — | `[CODE]` falcon-radio.component.ts:60-62 — used by wb-radio-pill + radio-group to drive checked without a form control |
| Parent-driven disable | `[disabledInput]` setter (bypasses CVA) | — | `[CODE]` falcon-radio.component.ts:64-73 — writes the same `disabled` signal as `setDisabledState`; used for view/readonly mode |

> `[INFERRED]` The radio never calls these endpoints itself — the parent step's state slice does. The radio only emits `falcon-change` → `handleChange` → CVA / `(valueChange)`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-choice | the radio group | submit with no option selected | `Validators.required` on the group's control → `errorText` + `state='error'` on the radio(s) |
| `[INFERRED]` Conditional option-set | branching choices | a prior answer changes which radios are valid | parent step's validators — the radio only renders the state it is passed |

> `[CODE]` falcon-radio.utils.ts:25-27 — the radio's `hasError` is purely `state === 'error' \|\| !!errorMessage`. It does NOT validate. "Must pick one" is a **group/parent** rule.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | No PES key. A PES-locked or already-decided choice is rendered with `[disabledInput]="true"` (or a disabled form control flowing through `setDisabledState`), making the radio inert. A pre-decided choice is rendered checked + disabled (the templates-card / configured-wallet pattern). |

The radio has no PES key of its own — it inherits the gate of the **field** it renders.

## State / signal pattern
`[CODE]` falcon-radio.component.ts:88-93 — wrapper holds `checked$` + `disabled` signals + a once-computed `resolvedId` (`falcon-arad-{seq}`). The checked state has two sources: (a) CVA `writeValue` comparing the group value to this radio's `value`; (b) the `checkedInput` setter for parent-driven binding. The disabled state has two sources: CVA `setDisabledState` and the `disabledInput` setter — both write one `disabled` signal (single source of truth). `[CODE]` falcon-radio.tsx:51-53,69-74 — Stencil keeps `focused` + `resolvedId` + a `@Watch('checked')` that re-syncs the native input. No service injection.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-radio>` (Shadow, `falcon-radio.tsx`) / `<falcon-radio-tw>` (Light DOM, Tailwind). `[CODE]` falcon-radio.tsx:1-8 — a real native `<input type="radio">` with the visible mark drawn by **growing the mark's border 1.5px → 5px on `:checked`** (the border-width-5 trick — no separate inner-dot element). Emits `falcon-change` / `falcon-blur` / `falcon-focus`.
- **Angular wrapper** — `<falcon-angular-radio>`: CVA bridge + tag-switcher on `useTailwind`. `[CODE]` falcon-radio.component.ts:44-46 lazy-registers the web component via `defineFalconTwComponent('falcon-radio')`.
- Group-level keyboard navigation (arrow keys) is NOT here — it relies on native same-`name` grouping at whatever assembles the radios.

## Integration gotchas
- `[CODE]` falcon-radio.component.ts:51 + html:11/33 **`errorText` IS forwarded** — the wrapper input is `errorText`, bound to the Stencil attr `error-message`. So `errorText` works end-to-end; the name just differs from the Stencil prop `errorMessage` and from siblings.
- `[CODE]` falcon-radio.component.ts:64-73 **Parent-driven disable is `disabledInput`, NOT `disabled`** — `[disabled]` will not bind on the radio (unlike `<falcon-angular-switch>`, where it IS `disabled`). This is a deliberate but easy-to-trip inconsistency.
- `[CODE]` falcon-radio.component.ts:102-104 **CVA writeValue takes the GROUP value, not a boolean** — the radio self-determines `checked` by `value === groupValue`. Binding a boolean control to a single radio will not behave like a checkbox.
- `[CODE]` falcon-radio.tsx:100-105 **No change event on un-check** — when another same-`name` radio is picked, the browser does not fire `change` on the now-unchecked radio. Read the newly-checked value; never wait for an "off" event.
- `[CODE]` falcon-radio.tsx:77-87 / -tw:92-101 `setFocus()` + `select()` are Stencil `@Method`s on BOTH tags but are **not proxied** on the Angular wrapper (GAP) — no programmatic select from app code.
- `[CODE]` falcon-radio.tsx:60-61 Stencil emits `falcon-focus`; the wrapper binds only `falcon-change` + `falcon-blur` (GAP) — attach a native `(focus)` if a focus signal is needed.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B06) — `errorText`→`error-message` forwarding, the dual-source `disabled` signal (`disabledInput` + `setDisabledState`), group-valued CVA, no-uncheck-event, and unproxied `setFocus`/`select` all re-confirmed in live source. Backend-module mapping 🔴 INFERRED (the radio names no endpoint); flows re-grounded to the wallet/templates consumers (OTP-send-dialog mapping removed — unverified).
