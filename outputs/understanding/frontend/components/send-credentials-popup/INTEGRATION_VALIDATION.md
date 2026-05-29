# send-credentials-popup (LEGACY / ORPHAN) — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.
> ⚠ **Correction vs the old 6 dossier files:** the legacy `send-credentials-popup` source files do not exist (verified 2026-05-18). This component is an ORPHAN; its live successor is `falcon-sending-credentials-dialog` (`<falcon-angular-sending-credentials-dialog>`). Integration facts below describe the successor where the legacy is gone.

## Owning backend module(s)
**The component owns no data** — `[CODE]` `falcon-sending-credentials-dialog.component.ts` performs no HTTP calls; it only collects a delivery-method choice and emits it. The *flow* it belongs to is bound to **Falcon Identity**:
- **Identity** — owns the user lifecycle and credential issuance. The actual "send credentials" dispatch (email/SMS with username + password) is an Identity-service responsibility, triggered by the Add Client / Add User finalize step after this popup emits its choice.
- **Commerce** — owns the account/node creation that *produces* the new owner whose credentials are being sent.

## Backend wiring
| Endpoint / service | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| Credential-dispatch (Add Client / Add User finalize) | POST | Identity | `[INFERRED]` req carries the new account-owner id + chosen delivery method | System Gateway (Falcon admin) / Core Gateway (client) | The popup itself does **not** call this — the wizard's finalize handler does, after `(send)` emits. |

`[CODE]` `falcon-sending-credentials-dialog.component.ts:91-92,126-129` The component's entire backend contribution is the `send` output emitting `FalconCredentialDeliveryMethod` (`'email' | 'sms' | 'both'`). The consuming wizard step owns the API call. `[INFERRED]` exact endpoint/DTO not in the read sources — flagged for the Add Client `08-BACKEND_API.md` playbook section.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | delivery method | — | No `V-*` rule — picking a delivery method cannot be "invalid" (a default is always selected). |

`[CODE]` `falcon-sending-credentials-dialog.component.ts:126-129` The only gate is `disableSend` — when true, `onSend()` is a no-op. This is in-flight guarding, not data validation.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` Add Client / Add User create permission | account creation | If the operator cannot create the account, the wizard never reaches the finalize step → the popup is never shown. |

The popup has **no PES key of its own** — it is gated by the wizard flow that hosts it.

## State / signal pattern
**Legacy `send-credentials-popup` (per old API dossier — source gone):**
- `[BRAIN-OUT]` `API.md:16-30` Used **classic `@Input()` / `@Output()`** decorators; `[(visible)]` two-way binding; internal `method: DeliveryMethod` field; options built in `ngOnInit` via `Helper.enumToOptions`.

**Live successor `falcon-sending-credentials-dialog` (`[CODE]` source):**
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:55-92` Uses **modern signal inputs/outputs** — `input<T>()` / `output<T>()`, not decorators. `open`, `ownerName`, `ownerPhone`, `ownerEmail`, `defaultDelivery`, `disableSend`, plus a full set of pre-translated label inputs.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:97,106-110` Internal `selected = signal<FalconCredentialDeliveryMethod>('email')`; an `effect()` re-seeds it from `defaultDelivery()` on every open.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:99-103` `options` is a `computed()` of the three method cards.
- `[INFERRED]` No error-pipeline interaction — the popup never handles HTTP errors; a failed dispatch is surfaced by the wizard's own error handling.

## Skeleton ↔ app-wrapper layering
**This is the key correction to record.** The two components layer differently:
- **Legacy `send-credentials-popup`** — `[BRAIN-OUT]` `OVERVIEW.md:24-28` was a **pure Angular bespoke component** living in `libs/falcon/src/shared-ui/` that *composed* `<falcon-angular-dialog>` as its shell, `<falcon-angular-radio>` for the method group, `<falcon-angular-button>` for actions. It owned its own `.scss` file (a project-rule violation). It had **no Stencil layer**.
- **Successor `falcon-sending-credentials-dialog`** — `[CODE]` `falcon-sending-credentials-dialog.component.ts:5-9` is a **pure Angular standalone component** (no Stencil wrapper either) but does **NOT** compose `falcon-dialog`. It hand-rolls its own backdrop + panel with Tailwind utilities and composes the Stencil `<falcon-button-tw>` tag directly — the same pattern as `<falcon-angular-popup>`. It lives in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/`. Method cards are `<div role="radio">` wrappers with an inline visual radio dot.

So: the credential-delivery overlay was **rebuilt away from the `falcon-dialog` composition** into a self-contained Tailwind component — mirroring the same move `falcon-insufficient-balance-dialog` made. Per `feedback_library_skeleton_app_api`, neither version fetches data — the Add Client / Add User wizard step is the app layer that owns the credential-dispatch call.

### Overlay / z-index tier ladder
`[CODE]` `falcon-sending-credentials-dialog.component.html:8` — the successor's backdrop is `z-[var(--falcon-dialog-z-index)]` (= 1200 per the template comment). The Falcon overlay tier ordering, low → high:
- `falcon-tooltip` (`--falcon-tooltip-z`) — transient hint.
- `falcon-drawer` (`--falcon-drawer-z`) — edge sheet.
- `falcon-dialog` (`--falcon-dialog-z`) — generic centered modal.
- `falcon-insufficient-balance-dialog` (`--falcon-ib-dialog-backdrop-z: 1000`) — domain dialog.
- **`falcon-sending-credentials-dialog` (`--falcon-dialog-z-index` = 1200)** — domain dialog, pinned at the top of the modal tier.
- `[INFERRED]` The successor reuses the shared `--falcon-dialog-z-index` token rather than minting its own — so it sits at the canonical modal tier, not above it; the `1200` value is the shared dialog z, not a custom escalation.

## Integration gotchas
- `[CODE]` Both versions emit a **different delivery-method type**: legacy emitted the `DeliveryMethod` **enum** (`[BRAIN-OUT]` `API.md:28`); the successor emits a **string union** `'email' | 'sms' | 'both'` (`[CODE]` `falcon-sending-credentials-dialog.component.ts:27`). A flow migrated between them must remap.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:131-136,145-148` The successor gates backdrop and Esc dismissal behind `closeOnBackdrop` / `closeOnEsc` inputs; it emits `cancel` (void), not a reason-carrying detail.
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:5` The legacy component shipped its own `.scss` — a standing project-rule violation. The successor is Tailwind-only (`[CODE]` `falcon-sending-credentials-dialog.component.html`), correcting it.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:112-115` The successor registers `<falcon-button-tw>` on demand via `defineFalconTwComponent('falcon-button')` in `ngOnInit` — the footer buttons need the Stencil tag loaded.
- `[INFERRED]` The successor `falcon-sending-credentials-dialog` currently has **no dossier of its own** — `[BRAIN-OUT]` `USAGE.md:67` flags it as a MISSING component requiring authoring. Anyone implementing credential delivery should request that dossier.

## Verification
🔴 INFERRED for the legacy `send-credentials-popup` — source gone; reconstructed from the existing 6 dossiers (`[BRAIN-OUT]`). 🟡 CODE-DERIVED for the successor from `[CODE]` `falcon-sending-credentials-dialog.component.{ts,html}`. `[INFERRED]` items: exact Identity credential-dispatch endpoint/DTO (not in read sources) and PES key. **Corrections recorded:** legacy is an ORPHAN, not "LEGACY-IN-USE"; the successor does NOT compose `falcon-dialog` (it is self-contained Tailwind, like `falcon-popup`).
