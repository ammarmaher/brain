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
| PES key | Action | Effect when denied |
|---|---|---|
| `[CODE]` `state.permFlags().canEditPhone` (User-Details) | edit the phone | `user-details-page.component.html:458` binds `[readonly]="!state.permFlags().canEditPhone || state.isTargetStatusFrozen()"` — read-only when the actor lacks edit-phone permission OR the target's status is frozen. |
| `[CODE]` `state.phoneVerifyDisabled()` (User-Details) | press Verify | `[verifyDisabled]` wired off a flow predicate — see/edit the phone but can't trigger SMS verification when disallowed. |

The phone-field has **no PES key of its own** — it inherits the gate of the **field**. The flagship User-Details page resolves `canEditPhone` and binds `[readonly]` + `[verifyDisabled]`. (Where a wizard step is PES-gated, that step resolves the gate; use the `[disabled]`/`[readonly]` *property* binding so the wrapper's signal fires — never `[attr.disabled]`.)

## State / signal pattern
- `[CODE]` `falcon-phone-field.component.ts:65-185` Angular wrapper is `ChangeDetectionStrategy.OnPush` + CVA. Internal `value` + `disabled` are `signal`s. `writeValue` is lenient; `onChange` emits `detail.value` (full E.164).
- `[CODE]` `falcon-phone-field.component.ts:180-185` `handleInput` reads `detail.nationalNumber` into the value signal but emits `detail.value` to the form — the national part is the *display*, the E.164 is the *model*.
- `[CODE]` `falcon-phone-field.component.ts:187-200` `falcon-country-change`, `falcon-verify` re-emitted as wrapper `@Output`s (`countryChangeOut` / `verifyOut`); `handleBlur` re-emits `(blur)` + `onTouched`.
- `[CODE]` `falcon-phone-field.component.ts:95-96,209-265` injects `FalconStackingService` + holds `activePanelEl`; the `(falcon-open)`/`(falcon-close)` handlers acquire/release the native Top Layer for the portaled panel.
- `[CODE]` `falcon-phone-field.tsx:77-81` Stencil-internal `@State`: `focused`, `open` (country panel), `searchQuery`, `resolvedId` — none leak to the app.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton (two tags, divergent panel rendering):**
  - `<falcon-phone-field>` (Shadow, `falcon-phone-field.tsx`) — renders chooser + dial + native `<input type="tel">` + optional Verify inside one border, and the country panel **INLINE** (`{this.open && <div class="falcon-phone-field-panel">…}` `:404-478`). Outside-click (document `mousedown`) + Esc close.
  - `<falcon-phone-field-tw>` (Light, `falcon-phone-field-tw.tsx`) — same surface but **body-portals** the panel into `.falcon-overlay-container` via `ensurePortaled`/`positionPopoverFixed`/`removeFromOverlay` (`appendTo='body'` default; set `'inline'` to opt out), with scroll/resize reposition listeners + a `disconnectedCallback` cleanup (`:184-246`).
- **Angular wrapper** — `<falcon-angular-phone-field>`: CVA, lazy-registers via `defineFalconTwComponent('falcon-phone-field')`, `useTailwind=true` selects the Light variant, and **drives the native Top-Layer popover lifecycle** off `(falcon-open)`/`(falcon-close)` (Phase C / Wave 6) — see below.
- Per `feedback_library_skeleton_app_api` — the library never fetches; the country list is a static constant and the flow owns any backend interaction.

## Top-Layer popover lifecycle (Angular wrapper) — **NOT a no-op**
`[CODE]` `falcon-phone-field.component.ts:86-265` — the wrapper injects `FalconStackingService`. On `(falcon-open)` → `handlePopoverOpen()` → `scheduleTopLayerAcquire()` defers a frame, finds the portaled panel (`.falcon-overlay-container [data-falcon-popover-instance="<resolvedId>"][data-falcon-portaled="true"]`), promotes it via `showPopover()` (native Top Layer), and `stacking.register(panel, 'popover')`. On `(falcon-close)` / `ngOnDestroy` → `releaseTopLayer()` → `hidePopover()` + `stacking.unregister`. **Correction vs the prior dossier: these are active handlers, not no-ops** (the no-op state was the 2026-05-15 portal wave; the 2026-05-21 Phase C wave wired them).

## Integration gotchas
- `[CODE]` `falcon-phone-field.component.ts:166-185` **CVA value-shape split** — `writeValue` is lenient (sets the signal as-is); `handleInput` stores `nationalNumber` in the signal but emits the **full E.164** (`detail.value`) to `onChange`. Always seed `country` alongside `[(ngModel)]` — `writeValue` does NOT parse a dial-code out of an incoming value, so the emitted E.164 depends on the current `country`.
- `[CODE]` `falcon-phone-field.component.ts:144-146` Outputs are kebab-case aliases (`falcon-country-change`, `falcon-verify`) — bind exactly those strings; a camelCase guess silently no-ops. `(blur)` IS camelCase (re-emitted Stencil `falcon-blur`).
- `[CODE]` **`verifyIcon` + `*ExtraClass` + `appendTo` are `-tw`-only** — the Shadow tag lacks them; toggling them while `useTailwind=false` no-ops.
- `[CODE]` **No `componentOnReady` value re-push** in `writeValue` — same data-table-cell-remount race as email-field (GAP).
- `[CODE]` **`[maxlength]` is NOT a wrapper input** — the User-Details consumer's `[maxlength]="10"` falls through as an unknown attr on the host and does NOT cap the inner native input. Cap via a Reactive Forms validator (GAP).
- `[CODE]` Performance: the default list is **25** entries (`falcon-phone-field.utils.ts:8-34`), rendered unvirtualized — fine. The GAPS "~250 nodes" virtualization concern is **stale/overstated** and is corrected there.

## Verification
🟢 code-verified (2026-06-03) against `falcon-phone-field.component.ts` + `.html` + `falcon-phone-field.tsx` + `falcon-phone-field-tw.tsx` + `.utils.ts`, and the flagship `user-details-page.component.html:453-463`. **Corrected**: the popover handlers actively acquire the Top Layer (not no-ops); documented Shadow-inline vs `-tw`-portal; real `canEditPhone` PES gating; the 25-country fact; the non-existent `maxlength` input. Backend (SMS-OTP) wiring 🟡 code-derived from `forgot-password-flow.service.ts` (prior pass).
