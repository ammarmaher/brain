# falcon-badge — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-badge.tsx:1-4 — falcon-badge is a **presentational visual indicator** for a count, a flag, or a short semantic label. In product terms it is how a UI says *"there are N of these"* or *"this thing has a property worth flagging"* — a notification count, a `Beta` feature flag, a `New`/`Updated` marker. It carries **no business logic** and **no `BR-*` rule** of its own.

`[CODE]` falcon-badge.tsx:2-3 — the source explicitly positions it as the *generic* badge, **distinct from `<falcon-status-badge>`** which is the domain-specific composed variant carrying workflow-state vocabulary. This split is the single most important business fact about this component.

## The three-badge business vocabulary
`[BRAIN-OUT]` OVERVIEW.md:5,42-44 + GAPS_AND_UPGRADES.md:10-11 — Falcon has **three sibling badge components, each owning a different business meaning**:
| Component | Business meaning | Example |
|---|---|---|
| `falcon-badge` | a count / a generic flag / a free semantic label | "Inbox 12", "Beta", "New" |
| `falcon-status-badge` | a **workflow lifecycle state** from a fixed domain vocabulary | "Active", "Pending", "Disabled", "Expired" |
| `falcon-tag` | a **dismissible chip** — a removable categorisation | a removable filter chip |

`[INFERRED]` Choosing the wrong one is a *business* error, not a styling one: a lifecycle state rendered as a `falcon-badge` loses its connection to the domain status enum and the bucket-to-colour mapping that `falcon-status-badge` guarantees.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Badge is presentational — it surfaces a count/flag, it enforces nothing. |
| Workflow state must use `falcon-status-badge`, not this | `[CODE]` falcon-badge.tsx:2-3 | Source comment draws the boundary — `falcon-badge` is explicitly the *non-domain* badge. |

## Business constraints baked in
- `[CODE]` falcon-badge.tsx:20 — **default variant is `neutral`** and `[CODE]` :23 default appearance is `subtle`. A badge with no props is a quiet grey pill — the safe, non-alarming default. Escalation to `danger`/`warning` is an explicit, deliberate choice.
- `[CODE]` falcon-badge.tsx:34-37,48 — **`ariaLabel` exists for dot-only badges** (`dot=true` with no text). Business consequence: a bare coloured dot conveys *intent* (e.g. "unread") that a screen reader cannot see — the label is mandatory for that pattern to carry meaning. `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:14,FB-01 — note `ariaLabel` is **missing on the Angular wrapper** (`[CODE]` falcon-badge.component.ts has no such `@Input()` — confirmed), so the dot-only accessible-label pattern is currently only reachable on the Stencil layer.
- `[CODE]` falcon-badge.tsx:58-60 — the label is a **default `<slot>`**; the badge does not own its text. It renders whatever the consumer projects.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[INFERRED]` Notification count | host-shell topbar | count badge on a bell / inbox icon. |
| `[INFERRED]` Feature flag marker | any page with a beta feature | `Beta` / `New` flag next to a menu item or heading. |
| `[INFERRED]` Generic severity label | tables / detail panels | a `subtle` semantic tag where the value is *not* a lifecycle state. |

`[BRAIN-OUT]` OVERVIEW.md:38-39, GAPS_AND_UPGRADES.md:7,43 — **zero production consumers.** Production pages currently hand-roll count badges with raw Tailwind utilities. The component is showcase-only; adoption is a refactor opportunity.

## Business gotchas
- `[CODE]` falcon-badge.tsx:2-3 + `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:10 — **do not use `falcon-badge` for a lifecycle status.** If the value comes from a domain status enum (account status, service status, order status) it belongs in `<falcon-status-badge>`. Using `falcon-badge` decouples the colour from the domain bucket map and invites drift.
- `[CODE]` falcon-badge.tsx:31-32,51-57 — `iconName` resolves against the Falcon icon font; a non-existent name renders an **empty `<i>`** silently (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md:18-19). A missing leading icon is a typo, not a backend gap.
- `[INFERRED]` A count badge showing `0` is usually a business mistake — most "Inbox N" patterns hide the badge entirely at zero. The component does not enforce this; the consumer must `*ngIf` it.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-badge.tsx + falcon-badge.component.ts + the 6 dossier files. No `BR-*` rule binds this presentational primitive. Three-badge vocabulary and `ariaLabel`-wrapper-gap ✅ VERIFIED against source.
