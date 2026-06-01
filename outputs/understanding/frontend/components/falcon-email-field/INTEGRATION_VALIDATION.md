# falcon-email-field — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None directly — presentational only.** The component reads/writes one `string` (the email) and emits a verify intent. The data it captures and the verification it triggers are owned elsewhere:
- **Identity** — owns user/account email persistence and the actual email-verification challenge (OTP / verification code issue + confirm). The `falcon-verify` event is the hand-off point into an Identity-backed flow.
- **Commerce** — owns the account-owner record in Add Client; the email value lands in the Commerce account payload.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Email value | CVA (`writeValue` / `onChange`) into the parent form | Commerce / Identity (flow owner) | `[CODE]` `falcon-email-field.component.ts:98-117` — plain `string`, no transform |
| Verify intent | `(falcon-verify)` `@Output` → consumer handler | Identity (verification challenge) | `[CODE]` `falcon-email-field.component.ts:82,119-122` — payload `{ value: string }` |
| Verification challenge itself | consumer calls e.g. an OTP/verification endpoint | Identity | the component is NOT involved past emitting `falcon-verify` |
| Disabled state | Angular Forms `setDisabledState` | — | `[CODE]` `falcon-email-field.component.ts:107-109` — no `[disabled]` input |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Email-format | the email field | submit / blur with malformed value | parent reactive `Validators.email` → consumer passes `errorMessage` |
| Required-field | a `required` email field | submit empty | `Validators.required` → `errorMessage` input |
| `[INFERRED]` Verify-precondition | Verify button | value not a valid email | consumer sets `verifyDisabled=true` until the form control is valid — gate, not an error |
| `[INFERRED]` Email-already-in-use | the email field | server rejects on submit | backend (Identity) error surfaced through the parent step's error pipeline, not the component |

The component **does not validate**. It renders `state='error'` + `errorMessage` when the parent supplies them and exposes `aria-invalid`. All `V-*` logic is the parent step's (`validations/validations.ts`).

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | No PES key. A PES-gated email field is disabled via the parent step's form control (`control.disable()`); `verifyDisabled` can also be wired off a PES result to block verification while still showing the value. |

## State / signal pattern
`[CODE]` `falcon-email-field.component.ts:87-92` — wrapper holds `value` (string) + `disabled` (boolean) signals written by CVA, plus a once-computed `resolvedId` (`falcon-email-field-ng-{seq}`). `[CODE]` `falcon-email-field.tsx:61-62` — Stencil keeps `focused` + `resolvedId` state. The only escape hatch besides CVA is the `verifyOut` EventEmitter. No service injection; verification orchestration lives entirely in the consuming feature/state slice.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-email-field>` (Shadow DOM, `falcon-email-field.tsx`) / `<falcon-email-field-tw>` (Light DOM, Tailwind). `[CODE]` `falcon-email-field.tsx:142,162` renders a single-border wrapper holding the native `<input type="email">`, an optional 1px `verify-divider`, and the verify `<button>`. Emits `falcon-input` / `falcon-change` / `falcon-verify` / `falcon-focus` / `falcon-blur`.
- **Angular wrapper** — `<falcon-angular-email-field>`: CVA bridge + tag-switcher on `useTailwind`. Re-emits `falcon-verify` as the `verifyOut` `@Output`. `[CODE]` `falcon-email-field.component.ts:50-52` lazy-registers the web component.
- Per `feedback_library_skeleton_app_api`, the library never sends the verification request — that is app-layer work.

## Integration gotchas
- `[CODE]` `falcon-email-field.tsx:163-167,191-195` **Icon slots `icon-left` / `icon-right` exist** (correction: `API.md` "Slots: None" is stale — the 2026-05-17 unified icon-slot API added them; `icon-right` is suppressed when `verifyButton` is on so the button and a trailing icon never collide).
- `[CODE]` `falcon-email-field.component.ts` **No `disabled` `@Input()`** — disabled is CVA-only via `setDisabledState`. `verifyDisabled` IS a normal input and is independent of it.
- `[CODE]` `falcon-email-field.tsx:200-215` **Single-element look** — input + divider + verify button share ONE wrapper border; the divider is a 1px span, not a real border. Token changes to height/radius can desynchronize the button against the input — verify both heights after any token edit.
- `[INFERRED]` **Verify button is RTL-sensitive** — it sits on the inline-end side; under `dir="rtl"` it (and the divider) flip. Confirm placement on Arabic locales.
- `[CODE]` Only `falcon-verify` is re-emitted by the wrapper; `falcon-change` / `falcon-input` escape only via CVA. `setFocus()` is a Stencil `@Method` but is **not proxied** on the wrapper (`DECISION.md` G7).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-email-field.tsx` + `falcon-email-field.component.ts`. One correction to the legacy 6-file dossier documented (icon slots exist). Backend-module mapping 🔴 INFERRED — verification is conceptually Identity-owned but the component never names an endpoint.
