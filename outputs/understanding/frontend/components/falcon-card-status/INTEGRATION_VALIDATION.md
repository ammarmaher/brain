# falcon-card-status — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

The card is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-card-status.component.ts has no `inject()`, no HTTP, no service. The data and actions it *displays* are owned by the **caller** (`comm-mkt-view`):
- **Commerce / Provisioning** — the service/application/channel records (status, price, dates) that feed the caller's `item` (`CommMktItem`). The caller resolves these through the page's gateway.
- **Charging** — the Do-Payment / wallet flow behind the projected Do-Payment button (`[MEMORY]` ChargingGateway).
- **None for the card itself** — the card renders a border tone + slots.

## Backend wiring (via the caller, not the card)

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none — card) | — | — | — | — | `[CODE]` the card has no service injection. |
| `[INFERRED]` comm-channels / applications list | GET | Commerce / Provisioning | the list feeding `CommMktItem[]` | Core / System Gateway (per console) | `[CODE]` resolved by the comm-mkt-view page, not the card. |
| `[INFERRED]` Disable / Enable | POST | Provisioning / Commerce | `allowedActions`-gated action | per console gateway | `[CODE]` comm-mkt-card emits `(action)`; the page wrapper calls the endpoint. |
| `[MEMORY]` Do-Payment (priority) | — | Charging + realtime | DoPayment / SignalR popup | Charging Gateway | `[MEMORY]` BUG-DOPAYMENT — Do-Payment dropped on the mgmt path for Expired/Inactive (caller/backend bug, NOT the card). |

> `[INFERRED]` The card element never calls any endpoint — the caller's `(action)` `@Output` does. The card only renders.

## Validation rules (V-*)

The card runs **no validation** — no form control, no CVA (`API.md`). There are no `V-*` rules on the card. The only correctness concern is the `status` → bucket mapping (a caller concern):

| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-card-status.component.ts:53-59 | `status` | `null`/`undefined`/unmapped domain value | coerces to `'inactive'` (neutral border) — never a misleading tone. |
| `[CODE]` comm-mkt-card.ts:233-244 | (caller) `cardStatus()` | domain enum → bucket | the caller's switch is the real "validation" of which tone shows. |

## PES keys gating this component

**None on the card.** `[CODE]` falcon-card-status.component.ts — no permission check. The card never gates anything. PES/`allowedActions` gating of the projected buttons is entirely the caller's: `[CODE]` comm-mkt-card `resolveCommMktActions(item)` consults the server `allowedActions`; the card just lays out whatever buttons result. The card's own visibility is decided by the host page's PES gate on the surrounding grid.

## State / signal pattern

`[CODE]` falcon-card-status.component.ts — **signals-first, presentation-only**:
- `_status` / `_size` are `signal<…>()` written by `@Input() set` (null-coerced to defaults).
- `rootClasses` is a `computed<string>()` = `falconCardStatusRootClasses({status, size})` + the `rootClass` input; `topClasses`/`bodyClasses`/`actionsClasses` are precomputed strings.
- `OnPush` enforced. No subscriptions, no teardown needed, no error pipeline — nothing can fail.
- The wrapper does **NOT** call `defineFalconTwComponent(...)` (contrast every tag-switcher wrapper) — because it renders plain Angular `<div>`s, there is no custom element to register.

## Skeleton ↔ app-wrapper layering (the deliberate divergence)

- **Stencil "skeleton"** — `[CODE]` falcon-card-status.tsx `<falcon-card-status>` (`scoped:true`, no `styleUrl`, no Shadow). Renders the same chrome via `<slot>`s. **Used ONLY by the React/Vue output targets.**
- **Angular "wrapper"** — `[CODE]` falcon-card-status.component.ts `<falcon-angular-card-status>` renders the chrome **DIRECTLY in Angular** (plain `<div>` + `<ng-content>`), NOT the Stencil element, NO `useTailwind`. Per the component doc-comment: a `-tw` Stencil element's render destroys Angular-projected interactive light-DOM content under zoneless CD + the define-before-project race (the `<falcon-angular-card>` Defect-A finding, 2026-05-28). Rendering in Angular keeps Angular in control of projection.
- **Both share** the `card-status-tailwind-classes.ts` helpers → one token chain, visually identical.
- Per `feedback_library_skeleton_app_api`: the card never fetches — the **caller's state slice** resolves the entity + actions; the card is a dumb shell.

## Integration gotchas

- `[CODE]` **The Angular path is NOT the Stencil element** — do NOT add `CUSTOM_ELEMENTS_SCHEMA`, do NOT look for `useTailwind`, do NOT try to mount `<falcon-card-status>` in Angular. Mounting the scoped/`-tw` element would re-break interactive button projection under zoneless CD (the exact defect this design avoids).
- `[CODE]` **`status` is presentation** — never read the card's border color back as state; the authoritative status is the caller's `item.status` + the backend record.
- `[CODE]` **The card guarantees the action AREA, not the buttons** — empty `slot="actions"` → empty (reserved) footer.
- `[CODE]` **Union re-declaration** — the wrapper re-declares `FalconCardStatusType`/`FalconCardStatusSize` instead of importing from the types file (component.ts:42-43). Identical today; a silent-drift risk if the types file changes. (Same class as FSB-04.)
- `[MEMORY]` **BUG-DOPAYMENT is a caller/backend bug** — if Do-Payment misbehaves, debug `resolveCommMktActions` / the page wrapper / the charging backend, not this card.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B11 — NEW) from `[CODE]` falcon-card-status.tsx + .component.ts + comm-mkt-card.component.ts. No backend wiring, no V-rules, no PES on the card — confirmed by the absence of `inject()`/HTTP/CVA and the no-`defineFalconTwComponent` call. The Angular-direct-chrome (Defect-A) layering ✅ VERIFIED against source comments. Backend/action wiring is the caller's (comm-mkt-view), cross-referenced from `[CODE]` + `[MEMORY]` BUG-DOPAYMENT.
