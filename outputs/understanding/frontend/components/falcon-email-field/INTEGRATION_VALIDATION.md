# falcon-email-field — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None directly — presentational only.** The component reads/writes one `string` (the email) and emits a verify intent. The data it captures and the verification it triggers are owned elsewhere:
- **Identity** — owns user/account email persistence and the actual email-verification challenge (OTP / verification code issue + confirm). The `falcon-verify` event is the hand-off point into an Identity-backed flow.
- **Commerce** — owns the account-owner record in Add Client; the email value lands in the Commerce account payload.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Email value | CVA (`writeValue` / `onChange`) into the parent form | Commerce / Identity (flow owner) | `[CODE]` `falcon-email-field.component.ts:104-123` — plain `string`, no transform |
| Verify intent | `(falcon-verify)` `@Output` (`verifyOut`) → consumer handler | Identity (verification challenge) | `[CODE]` `falcon-email-field.component.ts:84,125-128` — payload `{ value: string }`; component does NOT call any endpoint |
| Verification challenge itself | consumer calls e.g. an OTP/verification endpoint | Identity | the component is NOT involved past emitting `falcon-verify` |
| Touched / blur | `(blur)` `@Output` re-emit of Stencil `falcon-blur` + CVA `onTouched` | — | `[CODE]` `falcon-email-field.component.ts:88,130-133` — added 2026-05-21 because native DOM blur does NOT bubble; without it required-field errors stayed hidden. **This is the live wiring on the User-Details page (`(blur)` updates touched → `emailState()` paints error).** |
| Disabled state | Angular Forms `setDisabledState` | — | `[CODE]` `falcon-email-field.component.ts:113-115` — no `[disabled]` input; the User-Details flagship instead binds `[readonly]` off the `canEditEmail` PES flag |

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
| `[CODE]` `state.permFlags().canEditEmail` (User-Details) | edit the email | `user-details-page.component.html:478` binds `[readonly]="!state.permFlags().canEditEmail || state.isTargetStatusFrozen()"` — when the actor lacks the edit-email permission OR the target's status is frozen, the field is read-only (value shown, not editable). |
| `[CODE]` `state.emailVerifyDisabled()` (User-Details) | press Verify | `[verifyDisabled]` is wired off a flow predicate so the operator can still see/edit the email but cannot trigger verification when not allowed. |

The email-field has **no PES key of its own** — it inherits the gate of the **field** it renders. The flagship User-Details page resolves the permission (`canEditEmail`) and binds `[readonly]` + `[verifyDisabled]` accordingly.

## State / signal pattern
`[CODE]` `falcon-email-field.component.ts:87-92` — wrapper holds `value` (string) + `disabled` (boolean) signals written by CVA, plus a once-computed `resolvedId` (`falcon-email-field-ng-{seq}`). `[CODE]` `falcon-email-field.tsx:61-62` — Stencil keeps `focused` + `resolvedId` state. The only escape hatch besides CVA is the `verifyOut` EventEmitter. No service injection; verification orchestration lives entirely in the consuming feature/state slice.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-email-field>` (Shadow DOM, `falcon-email-field.tsx`) / `<falcon-email-field-tw>` (Light DOM, Tailwind). `[CODE]` `falcon-email-field.tsx:140-216` renders a single-border wrapper holding the native `<input type="email">`, an optional 1px `verify-divider`, and the verify `<button>`. It does NOT compose `<falcon-input>` — it owns its own `--falcon-email-field-*` styling. Emits `falcon-input` / `falcon-change` / `falcon-verify` / `falcon-focus` / `falcon-blur`; both tags expose `@Method() setFocus()`.
- **Angular wrapper** — `<falcon-angular-email-field>`: CVA bridge + tag-switcher on `useTailwind`. Re-emits `falcon-verify` as `verifyOut` and `falcon-blur` as `blur`. `[CODE]` `falcon-email-field.component.ts:50-52` lazy-registers via `defineFalconTwComponent('falcon-email-field')`.
- Per `feedback_library_skeleton_app_api`, the library never sends the verification request — that is app-layer work.

## Integration gotchas
- `[CODE]` `falcon-email-field.tsx:163-167,191-195` + `.component.html:35-36` **Icon slots `icon-left` / `icon-right` exist** on both render paths (the 2026-05-17 unified icon-slot API); `icon-right` is suppressed when `verifyButton` is on so the button and a trailing icon never collide.
- `[CODE]` **`verifyIcon` + `wrapperClass`/`inputClass`/`labelClass` are `-tw`-only** — the Shadow tag declares none of them (`falcon-email-field.tsx` has no `verifyIcon`/`*ExtraClass` props). Toggling them while `useTailwind=false` silently no-ops. (Divergence — `GAPS_AND_UPGRADES.md`.)
- `[CODE]` **No `componentOnReady` value re-push** — unlike `falcon-input`/`falcon-password`, `writeValue` (`:104-106`) only sets the signal; the value rides `[attr.value]` declaratively. If an email-field is mounted inside a remounting data-table cell, watch for the same empty-until-keystroke race input guards against (GAP).
- `[CODE]` **No `disabled` `@Input()`** — disabled is CVA-only via `setDisabledState`. `verifyDisabled` IS a normal input and is independent. The User-Details flagship gates via `[readonly]` off a PES flag, not `disabled`.
- `[CODE]` `falcon-email-field.tsx:197-216` **Single-element look** — input + 1px divider + verify button share ONE wrapper border. Token changes to height/radius can desynchronize the button against the input — verify both heights after any token edit.
- `[CODE]` Logical-property layout (`padding-inline-*`, `margin-inline-*`, `start-2.5`/`end-2.5`) → the verify button + divider flip correctly under `dir="rtl"`.
- `[CODE]` Only `falcon-verify` + `falcon-blur` are re-emitted by the wrapper; `falcon-change`/`falcon-input` escape only via CVA, and `falcon-focus` is not re-emitted. `setFocus()` is a Stencil `@Method` but is **not proxied** on the wrapper (GAP).

## Verification
🟢 code-verified (2026-06-03) against `falcon-email-field.component.ts` + `.html` + `falcon-email-field.tsx` + `falcon-email-field-tw.tsx`, and the flagship `user-details-page.component.html:474-484`. Added the `(blur)` re-emit wiring + the real `canEditEmail` / `emailVerifyDisabled` PES gating (the prior doc only inferred a generic gate). Backend-module mapping 🔴 INFERRED — verification is conceptually Identity-owned but the component never names an endpoint; the User-Details flow owns the actual challenge call.
