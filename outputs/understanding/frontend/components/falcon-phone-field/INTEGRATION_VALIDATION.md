# falcon-phone-field — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational** — it owns no data and makes no HTTP calls. Its emitted value is consumed by, and the country list could be sourced from:
- **Identity** — the phone is a user-lifecycle attribute. Account-owner / new-user phones flow into Identity's user creation and the `auth/forgot-password` SMS-OTP path. `[CODE]` `forgot-password-flow.service.ts:20-28`
- `[INFERRED]` No backend owns the country list today — it is a hardcoded constant (`DEFAULT_PHONE_COUNTRIES`). If countries ever become tenant-configurable, that catalog would be Provisioning/Identity reference data.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `auth/forgot-password` | POST | Identity | `{ username, phoneNumber, deliveryMethod }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth (direct auth host) | `[CODE]` `forgot-password-flow.service.ts:20-28` — the `phoneNumber` originates from this field. |
| (country list) | — | none | `DEFAULT_PHONE_COUNTRIES` constant | — | `[CODE]` `falcon-phone-field.utils.ts:8-34` — no fetch; static. |

The component itself binds **nothing**. The owning *flow* (Add Client / Add User / forgot-password) takes the emitted E.164 value and submits it.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | account-owner / user phone | submit with empty value | field-level "required" — driven by the consumer's Reactive Forms `Validators.required`, surfaced via `[errorMessage]` + `[state]="'error'"`. |
| E.164 / national-format | phone number | submit with malformed digits | `[CODE]` NOT enforced by the component (`falcon-phone-field.tsx:2-6` — validation deferred). Consumer MUST add a libphonenumber-based or regex validator. |
| Ownership / verification | phone number | flow requires a verified number | proven only by the OTP round-trip (`<falcon-otp-send-dialog>` / `auth/verify-otp`), never by this field. |

## PES keys gating this component
- `[INFERRED]` The field has no PES key of its own. Where the host *form field* is PES-gated (e.g. account-owner step in Add Client), the parent step resolves the gate and binds `disabled` accordingly. Use the property binding — not the attribute — so the wrapper's `setDisabledState` / `disabled` signal actually fires.

## State / signal pattern
- `[CODE]` `falcon-phone-field.component.ts:107-129` Angular wrapper is a `ChangeDetectionStrategy.OnPush` CVA. Internal `value` + `disabled` are `signal`s. `writeValue` accepts the full E.164 string OR national number; `onChange` emits `detail.value` (full E.164).
- `[CODE]` `falcon-phone-field.component.ts:132-137` `handleInput` reads `detail.nationalNumber` into the value signal but emits `detail.value` to the form — the national part is the *display*, the E.164 is the *model*.
- `[CODE]` `falcon-phone-field.component.ts:139-147` `falcon-country-change` and `falcon-verify` are re-emitted as wrapper `@Output`s for the flow to consume.
- `[CODE]` `falcon-phone-field.tsx:75-80` Stencil-internal `@State`: `focused`, `open` (country panel), `searchQuery`, `resolvedId` — none leak to the app.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-phone-field>` (Shadow, `falcon-phone-field.tsx`) / `<falcon-phone-field-tw>` (Light DOM). Pure presentational: renders chooser + native `<input type="tel">` + optional Verify button inside one border. Owns the country panel, outside-click + Esc close, paste-fill is N/A here.
- **Angular wrapper** — `<falcon-angular-phone-field>` (`falcon-phone-field.component.ts`): CVA, `defineFalconTwComponent('falcon-phone-field')` lazy-registers the Stencil element on `ngOnInit`, `useTailwind=true` default selects the Light-DOM variant.
- Per `feedback_library_skeleton_app_api` — the library never fetches; the country list is a static constant and the flow owns any backend interaction.

## Integration gotchas
- `[CODE]` `falcon-phone-field.component.ts:118-120` `writeValue` is lenient — passing a national number works, but then the emitted E.164 may be missing a dial-code prefix if the country never changed. Always seed `country` alongside `[(ngModel)]`.
- `[CODE]` `falcon-phone-field.component.ts:100-102` Outputs are kebab-case (`falcon-country-change`, `falcon-verify`) — bind exactly that string; a camelCase guess silently no-ops.
- `[CODE]` `falcon-phone-field.tsx:153-165` The country panel is portal-managed in the `-tw` variant (moved into `.falcon-overlay-container`) — the wrapper's `handlePopoverOpen/Close` are deliberate no-ops; do not re-wire them.
- `[INFERRED]` Performance: the default list is only 25 entries, so the GAPS doc's "~250 nodes" concern is stale against current source — `DEFAULT_PHONE_COUNTRIES` is short and unvirtualized rendering is fine.

## Verification
🟡 CODE-DERIVED from `falcon-phone-field.{tsx,utils.ts,component.ts}` + `forgot-password-flow.service.ts`. Correction vs `GAPS_AND_UPGRADES.md`: the default country list is **25 countries, not ~250** (`falcon-phone-field.utils.ts:8-34`) — the virtualization perf concern is overstated. PES gating 🔴 INFERRED.
