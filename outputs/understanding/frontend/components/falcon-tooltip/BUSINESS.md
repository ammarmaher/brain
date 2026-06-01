# falcon-tooltip — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-tooltip` is the **transient hint surface** — a small floating panel that explains, on hover or focus, what a control does or what a truncated value contains. In business terms it carries *secondary* information: the operator does not need it to act, but it removes ambiguity (what does this icon button do, what is the full account name behind this `…`, what format does this field expect). It never blocks, never demands a decision, and disappears the moment the pointer leaves.

`[CODE]` `falcon-tooltip.tsx:1-5` — the component wraps a trigger element and reveals a token-styled panel on `mouseenter` / `focusin`.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The tooltip encodes no PRD `BR-*` rule — it is a presentation aid. Its *content* may explain a business rule (a field-format hint) but the component itself is rule-agnostic. |
| Accessibility: icon-only controls need a visible label | `[BRAIN-OUT]` `DECISION.md:41` (WAI-ARIA APG practice) | An icon-only `<falcon-angular-button>` is hard to identify; pairing it with a tooltip gives sighted users the label. The tooltip is sighted-only — `ariaLabel` on the button still covers screen readers. |

## Business constraints baked in
- `[CODE]` `falcon-tooltip.tsx:37,63-68,156` **`disabled=true` suppresses the hint entirely** — `open()` is a no-op and `showLabel` is gated by `!disabled`. Business meaning: a flow can mute the hint when it is no longer relevant (e.g. the control is itself disabled). ⚠ `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:13` — there is no `@Watch` on `disabled`, so a tooltip already *open* when `disabled` flips stays visible until pointer-leave; the consumer must call `close()`.
- `[CODE]` `falcon-tooltip.tsx:38,141-152` **`interactive=true` keeps the panel alive while the pointer is over it** — required when the hint contains a clickable link. Business meaning: a hint that offers a "View details" action must be interactive or the action is unreachable.
- `[CODE]` `falcon-tooltip.tsx:36,94-99` **A show delay (default 100ms) is built in** — the hint does not flash on every incidental hover. Business meaning: deliberate, not jumpy — the operator must dwell to see it.
- `[CODE]` `falcon-tooltip.tsx:166-176` **The trigger gets `tabIndex=0` unconditionally** — any wrapped element becomes keyboard-focusable so keyboard users can reach the hint. Business trade-off: wrapping a non-interactive label (e.g. a status badge) turns it into a focus stop (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:29`).

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Icon-button affordance labels | (general) | `[BRAIN-OUT]` `USAGE.md:8-19` — wraps icon-only action buttons (Edit, Delete) to name them for sighted users. |
| Truncated value expansion | data tables | `[BRAIN-OUT]` `USAGE.md:27-31` — reveals the full account/user name behind a `truncate`d table cell. |
| Form-field hints | compact forms | `[BRAIN-OUT]` `USAGE.md:53-63` — an info-circle icon next to a label explains the expected format (e.g. "13-digit registration number"). |
| Status indicator legends | (general) | `[BRAIN-OUT]` `OVERVIEW.md:16` — explains what a status dot/badge means. |

## Business gotchas
- `[BRAIN-OUT]` `OVERVIEW.md:50` **Under-leveraged primitive** — Wave 7 sweep found only the playground showcase as a consumer; zero feature-template usage. A builder adding icon-only buttons should pair them with a tooltip rather than leaving them unlabeled.
- `[BRAIN-OUT]` A tooltip is **not a label of record** — it is sighted-only and hover-gated. A control whose meaning *depends* on the tooltip fails for screen-reader and touch users. Always also set `ariaLabel` on the underlying control.
- `[BRAIN-OUT]` A tooltip is **not a menu and not a popover** — it carries information, not actions (beyond at most one link in `interactive` mode). Action lists belong in `falcon-angular-menu`; substantial interactive content belongs in a popup.
- `[CODE]` `falcon-tooltip.tsx:35` **No collision detection** — `placement` is fixed; a `placement="right"` tooltip with no room on the right overflows the viewport. The business hint can be clipped off-screen. Choose placement deliberately or constrain with `maxWidth`.
- `[INFERRED]` `placement` values are **physical** (`left`/`right`), not logical — under RTL the consumer must flip placement.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-tooltip.tsx` and the existing 6 dossier files. No PRD `BR-*` rule binds this primitive. The icon-button accessibility pairing is `[BRAIN-OUT]` design-system guidance, not a PRD rule.
