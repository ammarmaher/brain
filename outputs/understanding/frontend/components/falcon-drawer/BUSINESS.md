# falcon-drawer — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-drawer` is the **edge-anchored work surface** — a panel that slides in from a screen edge to host a focused task (create/edit a record, transfer balance, filter a list, inspect a detail) without fully discarding the page context behind it. In business terms it is the "do a side job" surface: heavier than a tooltip, lighter than a full page navigation; unlike a centered dialog it keeps the originating list/tree visible at the edge so the operator stays oriented.

`[CODE]` `falcon-drawer.tsx:1-5` — the component owns the overlay, slide-from-edge panel, focus trap, focus restore, and Esc/backdrop dismissal.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The drawer encodes no PRD `BR-*` rule — it is a layout primitive. The business logic lives in the form/list projected into its body. |
| "Balance transfer happens in a side panel" | `[CODE]` wallet-balance-management / new-wallet-balance balance-transfer comments | The Balance Transfer flow is conceptually a right-side drawer (source/destination/wallet pickers + amount + description + Save). **BUT the live shell is hand-rolled native Angular, NOT `<falcon-angular-drawer>`** — see the WAIVER below. |
| "Create / edit a node happens in a side panel" | `[BRAIN-OUT]` prior OVERVIEW (org-hierarchy) | Historically the Org Hierarchy Add/Edit Node flow was a right drawer; the live `falcon-org-node-drawer` was NOT found as a `<falcon-angular-drawer>` consumer in the 2026-06-03 sweep (unconfirmed). |

## Business constraints baked in
- `[CODE]` `falcon-drawer.tsx:40,107-109,115-119` **`dismissable=false` is a hard lock** — when false, both Esc and backdrop click are suppressed. A flow can force the operator to resolve the side task via explicit Cancel/Save buttons and forbid accidental dismissal mid-edit.
- `[CODE]` `falcon-drawer.tsx:39` **`closable` toggles the close ×** — the canonical destructive-risk form sets `[closable]="false"` and relies on a consumer-owned Cancel button: exactly one explicit exit path, no ambient × that could be hit by mistake.
- `[CODE]` `falcon-drawer.tsx:41,105-109` **`modal=true` blocks underlying clicks** — protects data integrity (the operator cannot mutate the underlying record while a side edit is open); `modal=false` is for non-blocking inspectors only (and also disables outside-click dismiss).
- `[INFERRED]` **Body unmounts on close** (`[CODE]` `falcon-drawer.tsx:169` `render()` returns `null`) — an abandoned draft is discarded, not silently retained. Lift any business state to the parent if it must survive a close.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Balance Transfer | wallet-balance-management + new-wallet-balance (both consoles) | The transfer side panel — **but rendered as a hand-rolled native `<aside role="dialog">` shell**, NOT `<falcon-angular-drawer>` (WAIVER W11), to dodge the zoneless-CD slot-wipe bug. Every field inside is still a Falcon primitive. |
| Add / Edit Node | organization-hierarchy (both consoles) | `[BRAIN-OUT]` historical — not confirmed as a live `<falcon-angular-drawer>` consumer 2026-06-03. |
| Filter panels / side inspectors | (general) | `[BRAIN-OUT]` recommended surface — no live consumer today. |

## The WAIVER — why the primitive is unused (critical business gotcha)
- `[CODE]` `wb-balance-transfer-drawer.component.ts:5-23` + `balance-transfer.component.html:4-10` — the Balance Transfer features **deliberately do NOT use `<falcon-angular-drawer>`**. Rationale recorded verbatim in source: *"The Stencil drawer custom element wiped the projected default-slot body under the app's zoneless change detection, so the opened drawer painted with only its header + footer and an EMPTY body."* Routing through the Stencil drawer "would re-introduce that empty-body bug = a behavior regression". The hand-rolled shell is stricter (fully token-bound) and keeps every field a Falcon primitive.
- **Business reading:** the canonical "side-job" surface is, at the platform's current zoneless-CD baseline, **not safe for projected-body forms**. Builders MUST be told this (it is GAP G-ZONELESS-SLOT, HIGH-RISK) — otherwise a new feature that "follows the rules" by using `<falcon-angular-drawer>` will ship an empty-body drawer.

## Business gotchas
- `[BRAIN-OUT]` A drawer is for **work and detail**, not decisions — `position="bottom"` for a confirm prompt is the wrong concept. Decisions belong in `falcon-angular-popup`.
- `[CODE]` `falcon-drawer.tsx:40` vs `falcon-dialog.tsx:48` **spelling trap** — drawer prop is `dismissable` (a-spelling); dialog prop is `dismissible` (i-spelling). Copying a dialog template into a drawer silently gets the default (GAP G-SPELL).
- `[INFERRED]` `position="right"`/`"left"` are **physical** — they do not auto-swap under RTL (the Stencil overlay's `justify-content` does flip with `dir`, but the per-position radius is physical).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). `dismissable`/`closable`/`modal` semantics + body-destroy-on-close re-confirmed in falcon-drawer.tsx. **The OVERVIEW/INTEGRATION "0 adoption / unconfirmed" contradiction is RESOLVED: there are zero live `<falcon-angular-drawer>` tags, by a documented WAIVER (zoneless-CD slot wipe).** No PRD `BR-*` rule binds the primitive. Org-node-drawer consumer flagged unconfirmed.
