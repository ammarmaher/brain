# falcon-avatar — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-avatar.tsx:1-3 — falcon-avatar is a **presentational identity primitive**. In product terms it answers one question: *"who or what is this?"* — by showing a person's photo, a node's brand mark, or a graceful letter/icon stand-in when no image exists. It carries no business logic of its own; its business value is **visual identity continuity** — the same person/account/node reads the same across headers, lists and tree nodes.

`[INFERRED]` Because it is presentational, it holds **no `BR-*` rule** directly. Its business relevance is positional — *where* it appears and *what identity it represents* — not *what it enforces*.

## Node-identity contract
`[BRAIN-OUT]` OVERVIEW.md:8,48-49 + `[CODE]` falcon-avatar.tsx:40-66 — the avatar is the platform's **node / user identity glyph** with a strict 3-tier fallback:
1. **Image** (`src`) — a real uploaded photo or node logo (the `<falcon-photo-uploader>` output, per `[MEMORY]` project_falcon_photo_uploader_tailwind, feeds this).
2. **Initials** (`initials`) — letter stand-in computed from a person's first+last name or a node name.
3. **Brand / generic icon** (`iconName`) — a Falcon-icon-font glyph for system or anonymous accounts.

`[INFERRED]` This three-tier chain mirrors the business reality of Falcon node identity: a node *may* have a brand image, *usually* has a name (initials always derivable), and *always* falls back to a generic mark — so identity is never blank. For org-hierarchy nodes the **square shape** is the convention (`[BRAIN-OUT]` USAGE.md:48-55, DECISION.md:7); for individual users the **circle**.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Avatar is presentational — it surfaces identity, it does not gate a decision. |
| Node identity must never render blank | `[INFERRED]` from `[CODE]` falcon-avatar.tsx:40-43 fallback chain | The `showImage → showInitials → showIcon` cascade guarantees *some* identity mark always renders. |
| Account / node imagery is square; person imagery is circle | `[BRAIN-OUT]` DECISION.md:38, USAGE.md:96 | `shape` input — convention, not code-enforced. |

## Business constraints baked in
- `[CODE]` falcon-avatar.tsx:40-42 — **the fallback chain is render-time, not runtime.** Exactly one of image/initials/icon renders, decided by truthiness at render. A 404'd image does NOT downgrade to initials (see `GAPS_AND_UPGRADES.md` P1). Business consequence: a node whose stored logo URL has rotted shows a broken-image graphic, *not* its initials — identity continuity silently breaks.
- `[CODE]` falcon-avatar.tsx:67-74 — **status dot is presence metadata, not workflow state.** `online/offline/busy/away` describe a *user's availability*, never an account lifecycle state. For lifecycle state (Active/Pending/Disabled) use `<falcon-status-badge>` — a different business vocabulary.
- `[INFERRED]` **Initials carry no name semantics for assistive tech** — `[CODE]` falcon-avatar.tsx:55-59 renders a plain `<span>{initials}</span>` with no `aria-label`; a screen reader announces "JD", not "John Doe". A builder relying on the avatar to announce identity is mistaken.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[BRAIN-OUT]` Org-hierarchy node imagery | organization-hierarchy | Square avatar for a node's brand mark / initials in tree + info panel `[INFERRED]` — OVERVIEW.md:46 notes nodes currently use raw `<img>`; avatar is the intended replacement. |
| `[INFERRED]` User identity in headers / member rows | host-shell topbar, user lists | Circle avatar for the signed-in or listed user. |
| `[INFERRED]` Information panel profile picture | organization-hierarchy info panel | `[MEMORY]` project_info_panel_backend_integration_wave15 — info panel uses `<falcon-photo-uploader>` for edit; a read-only avatar is the natural display counterpart. |

## Business gotchas
- `[CODE]` falcon-avatar.tsx:46 — a node with **no logo and no resolvable name** falls through to an empty surface (just the teal disc). Treat an empty avatar as a *data-completeness signal* — the node record is missing both image and name.
- `[BRAIN-OUT]` OVERVIEW.md, USAGE.md Consumer Sweep — adoption is **starting**: the `wallet-balance-management` header is the first live consumer (account-logo avatar). Most org-hierarchy node imagery still uses raw `<img>`. A builder asked to "show the node logo" should adopt this component, not hand-roll another `<img>`. (B11 corrected the prior "zero production consumers" claim.)
- `[INFERRED]` Status `online/offline/busy/away` is a **user-presence model** Falcon does not yet emit — there is no live-presence backend. Do not wire `[status]` until a presence source exists; otherwise it always shows a stale value.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B11) from `[CODE]` falcon-avatar.tsx + the dossier. No `BR-*` rule binds this presentational primitive. Node-identity contract ✅ VERIFIED against source. Adoption state corrected: **1 live consumer** (wallet-balance-management) — prior "zero adoption" was stale.
