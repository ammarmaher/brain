# falcon-sending-credentials-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

The component is **presentational** — it owns no data and calls no endpoint. The chosen `FalconCredentialDeliveryMethod` is surfaced via `(send)` and persisted by whichever module owns the *create flow*:
- **Identity** — owns user creation + credential issuance (Add User; the new user's username/password + the chosen delivery channel).
- **Commerce** — owns client/account creation (Add Client; the account-owner record the credentials are sent to).
- The **delivery fan-out** (actually emailing / SMS-ing the credentials) is an Identity / notification concern triggered by the create payload.

## Backend wiring

| Step | Where | Notes |
|---|---|---|
| `(send)` emits `FalconCredentialDeliveryMethod` | this component → `<falcon-angular-wizard-finalization>` `onSend($event)` | `[CODE]` falcon-wizard-finalization.component.html:43. No HTTP from the dialog. |
| Method → backend delivery enum | `apps/admin-console/.../add-client-wizard/models/wire-builders.ts` | `[CODE]` grep-confirmed reference; the wire-builder maps the UI union (`'email'\|'sms'\|'both'`) onto the create-payload's delivery field. `[INFERRED]` exact field name not read this pass. |
| Create + send | Identity (user) / Commerce (client) create endpoint | `[INFERRED]` the create payload carries the delivery choice; the backend issues credentials + dispatches them on the chosen channel(s). Endpoint owned by the wizard's API service, NOT the dialog. |

> `[CODE]` The dialog itself imports no `HttpService` and no API service — confirmed by reading the full `.component.ts` (only `defineFalconTwComponent` + `FalconOverlayDirective` are imported). All network work is upstream of `(send)`.

## Validation rules (V-*)

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| (none in-component) | delivery method | — | `[CODE]` The component performs NO validation. A method is always selected (seeded to `email`); `(send)` always carries a valid union value. |
| Owner-contact completeness | phone (for SMS), email (for Email/Both) | — | `[CODE]` NOT enforced here — all 3 cards render unconditionally even if `ownerPhone`/`ownerEmail` are empty (html:50-128). Any "phone required for SMS" rule lives upstream. `[INFERRED]` GAP G4. |
| Submit lock | Send button | `disableSend()` true | `[CODE]` button `[attr.disabled]` + `onSend()` early-return (ts:168-171) — not a V-rule, a UI guard the parent drives. |

> `[CODE]` There is no built-in validator and no `errorMessage` input — unlike the input/uploader controls, this dialog surfaces no field errors. Send failures are reported by the parent's HTTP error pipeline (orchestrator toast), not by the dialog.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (inherits the create flow's PES) | reach the finalization step | `[INFERRED]` The Add Client / Add User wizard is itself PES-gated (create-client / create-user permission); a user who cannot reach the wizard never sees this dialog. |
| (none on the dialog) | choose method / send | `[CODE]` The dialog has no PES key of its own and reads no session — it is a dumb confirm surface gated entirely by the wizard it sits in. |

## State / signal pattern

`[CODE]` falcon-sending-credentials-dialog.component.ts:
- All props are signal `input()` (`open`, owner fields, labels, `defaultDelivery`, `disableSend`, dismiss toggles).
- Internal selection is `selected = signal<FalconCredentialDeliveryMethod>('email')` (ts:133); `options` is a `computed()` of the 3 cards from the label inputs (ts:135-139).
- An `effect()` (ts:149-151) re-seeds `selected` from `defaultDelivery()` on every false→true `open` transition — so reopening always resets to the default method.
- `viewChild('dlg')` (ts:145) keeps the `<dialog>` element ref purely for the backdrop-click target check in `onDialogClick` (ts:199-205) — the `[falconOverlay]` directive owns `showModal()`/`close()` and `FalconStackingService` registration so notification toasts re-assert above the dialog.
- Outputs are signal `output()`: `(send)` / `(cancel)`. No CVA, no internal HTTP, no error state.

## Skeleton ↔ app-wrapper layering

- **No Stencil skeleton** — there is no `<falcon-sending-credentials-dialog>` Shadow tag and no `-tw` twin. The component IS the implementation (an Angular composite).
- **Composes** `<falcon-button-tw>` (the shared Stencil button primitive) for the footer, registered on-demand via `defineFalconTwComponent('falcon-button')` in `ngOnInit` (ts:154-157).
- **Composed BY** `<falcon-angular-wizard-finalization>`, which is the app-facing finalization substrate. Per the library/skeleton API convention, this dialog never fetches data — the wizard's state slice + API service do.

## Integration gotchas

- `[CODE]` **`(send)` is not "sent"** — it is "operator confirmed method X." The parent must perform the create+dispatch and only then close the dialog (flip `open`). Keep `[disableSend]` true until the API resolves.
- `[CODE]` **No two-way `open`** — bind one-way and flip it in `(send)`/`(cancel)`. A common trap if you assume `[(open)]`.
- `[CODE]` **Footer buttons are `<falcon-button-tw>` with `(falcon-click)`** (the Stencil custom event), NOT Angular `(click)` on a `<falcon-angular-button>`. Disabled is `[attr.disabled]="disableSend() ? '' : null"` (attribute presence, not a property) — matches the `<falcon-angular-popup>` pattern (ts:12).
- `[CODE]` **Method-card semantics are `role="radio"` divs**, not a native radio group — assistive-tech users get per-card `aria-checked` but no group container / arrow-key roving (GAP G1).
- `[INFERRED]` **Delivery-enum mapping is the wire-builder's job** — the UI union (`email`/`sms`/`both`) must be mapped to the backend's delivery enum in `wire-builders.ts`; do not assume the backend accepts the lowercase UI strings verbatim.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) — no in-component HTTP/CVA/PES (full `.component.ts` read), the open→re-seed effect (ts:149-151), the `viewChild`/backdrop-target check (ts:199-205), and the `<falcon-button-tw>` `(falcon-click)` footer all confirmed. 🟡 Backend create+delivery wiring is CODE-DERIVED from the `wire-builders.ts` reference + wizard-finalization composition; the exact create-endpoint + delivery-field name were NOT read from backend source this pass — `[INFERRED]` flagged.
