# falcon-accordion — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` A **progressive-disclosure container** — it lets a screen present several distinct business sections while keeping the operator's attention on one (or a few) at a time. In business terms it answers "show me only the part of this information I care about right now": a settings page broken into General / Billing / Security groups, an FAQ, a long multi-group form.

`[CODE]` `falcon-accordion.tsx:1-4` header — two modes: `single` (one section open at a time) and `multiple` (any number open). Token-only paint, ARIA-correct header/region pairing.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[INFERRED]` No PRD rule baked in | — | The accordion is a pure layout/disclosure primitive. It carries no `BR-*` rule, no locked value, no PES default. Which sections exist and which start open is entirely host-supplied via `items` + `expandedValues`. |
| `[INFERRED]` Section-level gating | `[CODE]` `falcon-accordion.tsx:148` per-item `disabled` + accordion-wide `disabled` | A business flow that must hide/lock a whole section (e.g. an operator without rights to a Security group) can pass `disabled: true` on that item — the header is non-clickable and ARIA-disabled. This is the only place a business decision touches the component, and the *decision* is still host-owned. |

## Business constraints baked in
- `[CODE]` `falcon-accordion.tsx:92-99` **`mode="single"` does NOT mean "always one open."** `applyToggle` runs `toggleExpanded` — clicking the open section *collapses it to zero open*. Business consequence: if a flow needs a section to *always* be visible (tab-like persistence), `single` mode does not guarantee it; the host must re-expand imperatively via the `expand()` method. (`GAPS_AND_UPGRADES.md` P1 proposes a `single-locked` mode.)
- `[CODE]` `falcon-accordion.tsx:102-106` **A disabled section cannot be toggled** — `handleHeaderClick` short-circuits when `disabled || item.disabled`. A locked section is a business statement ("this section is not yours to open here"), enforced at the click boundary.
- `[CODE]` `falcon-accordion.tsx:109-126` **Keyboard navigation skips disabled sections** — `getNextEnabledIndex` / `firstEnabledIndex` / `lastEnabledIndex`. Business intent: a locked section is not just unclickable, it is invisible to keyboard traversal.
- `[CODE]` `falcon-accordion.tsx:214` **A collapsed panel is `hidden`** — not just visually collapsed; its projected content is removed from the accessibility tree and focus order. Business meaning: collapsed content is genuinely "not present" for the operator, not merely scrolled away.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[CODE]` **none** (Consumer Sweep 2026-06-03 → 0 app + 0 lib consumers) | — | The accordion is **production-ready but UNADOPTED**: exported + demoed in the showcase, not wired into any real business flow. (The prior dossier's `playground.page.html` consumer is stale — that route is gone.) |
| `[INFERRED]` Candidate: settings groups, FAQ sections, multi-group forms | admin-console / management-console settings | The intended business homes — none wired yet. |

## Business gotchas
- `[INFERRED]` **The accordion owns no business state** — it is a container. The sections inside (e.g. a Settings form projected into `slot="content-security"`) own their own data, validation, and PES gating. A builder must not look to the accordion to enforce a section's business rules.
- `[CODE]` **`single` mode can leave the operator with nothing open** — for a flow where an empty state is confusing, either use `multiple` and pre-expand one item, or re-expand imperatively.
- `[CODE]` **Duplicate `item.value`s break section identity** — `headerRefs` is a `Map` keyed by `value` (`falcon-accordion.tsx:64`); two items with the same `value` collide and corrupt keyboard focus and slot matching. Each business section must have a unique stable `value`.
- `[INFERRED]` **Not a substitute for tabs** — if the business UX is "switch between mutually-exclusive views", that is `<falcon-angular-tabs>`; the accordion keeps section *content inline*, stacked.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B13) from `[CODE]` `falcon-accordion.tsx` + `falcon-accordion.component.ts`. The component carrying no baked-in business rule is `[INFERRED]` from full source read. UNADOPTED status re-confirmed by the B13 Consumer Sweep (0 consumers; prior `playground.page.html` reference retired).
