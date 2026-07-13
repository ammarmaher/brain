# falcon-card-status — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` falcon-card-status.tsx:1-7 — card-status is a **presentation-only shell**. In product terms it answers "how do I show one service/application/entity as a card in a grid, with its status legible at a glance and its actions always in the same place?" Its business value is **visual consistency of the entity-card pattern** + a **guaranteed, predictable action footer** so that a row of cards never has actions drifting to different vertical positions. It carries **no `BR-*` rule of its own** — every business decision (which actions, when, gated how) lives in the **caller**.

`[INFERRED]` Because it is presentation-only, its business relevance is *positional + chromatic*: where the card sits, what status tone it shows, and that its actions are bottom-aligned — not what it enforces.

## The status-bucket contract (presentation, not domain)

`[CODE]` falcon-card-status.types.ts:3-13 — the 4 buckets (`active`/`expired`/`disabled`/`inactive`) are **visual border tones**, explicitly NOT business meaning: the comment says "`status` drives ONLY the root border tone + card chrome; it carries NO business meaning and NO behaviour." The four tones mirror the SoT card: active→teal, expired→danger-red, disabled/inactive→neutral.

`[CODE]` The caller maps its **domain** status to a bucket — comm-mkt-card.component.ts:233-244 `cardStatus()` collapses `FalconItemStatus.{Active,Expired,Disabled, InActive, Pending*}` → the 4 buckets (`InActive`/`Pending*` → `inactive`). So the *business* status vocabulary is the caller's enum; the card only knows the 4 *colors*.

## PRD / business rules touched (all via the caller)

| Rule | Source | How it surfaces (through this card) |
|---|---|---|
| A service/app card shows its lifecycle status | `[CODE]` comm-mkt-card `cardStatus()` + `severity()`/`statusLabel()` | Border tone via `[status]`; the human-readable label via a `<falcon-angular-status-badge>` projected into `slot="status"`. The card paints the border; the badge states the word. |
| Disable / Enable are server-`allowedActions`-gated | `[CODE]` comm-mkt-card `actions()` → `resolveCommMktActions(item)` | The caller computes the action list; the card just lays the resulting buttons into `slot="actions"`. The card does NOT decide which actions appear. |
| Do-Payment is status-gated (BUG-DOPAYMENT) | `[CODE]` comm-mkt-card actions catalog + `[MEMORY]` BACKEND-BUGS-REGISTRY BUG-DOPAYMENT | Do-Payment is offered per the caller's status-gate and (in the page wrapper) wired to the host-shell SignalR DoPayment popup. `[MEMORY]` BUG-DOPAYMENT (Do-Payment dropped on mgmt path for Expired/Inactive) is a **caller/backend** concern — NOT this card. |
| Price is shown only on certain statuses | `[CODE]` comm-mkt-card `showsPrice()` = `cardShowsPrice(status) && showPrice` | The price line is projected into `slot="status"` by the caller; the card neither knows nor enforces the price rule. |

> Every rule above is enforced **outside** the card. The card's only business-relevant guarantees are (a) the border tone matches the bucket the caller passed and (b) the actions sit bottom-right.

## Business constraints baked in

- `[CODE]` falcon-card-status.tsx/component.ts — **the card owns presentation, the caller owns behaviour.** A builder must NOT add Disable/Enable/Do-Payment logic, visibility, or permission into the card — those are the caller's (this is stated three times in the source comments). The card is reusable precisely because it is behaviour-free.
- `[CODE]` falcon-card-status.component.ts:53-59 — **`status` defaults to `inactive`** (the neutral fallback). An unmapped / null domain status renders a neutral card, never a misleading active/expired tone — a safe default.
- `[CODE]` card-status-tailwind-classes.ts:89-91 — **the action area is GUARANTEED via `mt-auto`** — actions pin to the card bottom regardless of body height. Business consequence: in a grid, every card's actions line up even when descriptions differ in length (comm-mkt-card reinforces this with a fixed 3-line description + a reserved price-line spacer).
- `[INFERRED]` **The status tone is advisory, not authoritative** — it is a visual hint; the authoritative status is the caller's badge label + the backend record. A builder must not read the card's border color back as state.

## Business flows using this component

| Flow | Page | Role of the card |
|---|---|---|
| `[CODE]` Communication channels grid | comm-channels page (admin + mgmt) | Each channel = one `<app-comm-mkt-card>` → `<falcon-angular-card-status>`; border tone = channel status, actions = Disable/Enable/Do-Payment. |
| `[CODE]` Applications grid | applications page (admin + mgmt) | Same shell for application cards. |
| `[INFERRED]` Any future entity-grid with status + actions | — | The blessed shell for "status-toned card with a guaranteed action footer." |

## Business gotchas

- `[CODE]` **Do not confuse `status` (4 color buckets) with the domain status enum** — passing `FalconItemStatus.Pending` (not a bucket) would not type-check; map it (`Pending → inactive`) in the caller.
- `[MEMORY]` **BUG-DOPAYMENT lives in the caller/backend, not here** — if Do-Payment misbehaves on the mgmt path for Expired/Inactive, the fault is in `resolveCommMktActions`/the page wrapper/the charging backend, NOT in this presentational card.
- `[CODE]` **The card does not gate or hide actions** — an empty `slot="actions"` shows an empty (reserved) footer; if a caller wants "no actions," it simply projects nothing.
- `[INFERRED]` **The status tone has no i18n** — color is universal; the human-readable status is the caller's translated badge label. A builder must not try to localise the border.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B11 — NEW) from `[CODE]` falcon-card-status.tsx + .types.ts + comm-mkt-card.component.ts. No `BR-*` rule binds this presentational primitive — every business rule (allowedActions gating, Do-Payment, price) is the caller's, ✅ VERIFIED against comm-mkt-card source. BUG-DOPAYMENT cross-referenced from `[MEMORY]` as a caller/backend concern, not a card concern.
