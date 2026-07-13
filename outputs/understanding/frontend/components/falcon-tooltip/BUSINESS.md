# falcon-tooltip — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` `falcon-tooltip` is the **transient hint surface** — a small floating panel that explains, on hover or focus, what a control does or what a truncated value contains. In business terms it carries *secondary* information: the operator does not need it to act, but it removes ambiguity (what does this icon button do, what is the full account name behind this `…`, what format does this field expect). It never blocks, never demands a decision, and disappears the moment the pointer leaves.

`[CODE]` falcon-tooltip.tsx:1-5 — the component wraps a trigger element and reveals a token-styled panel on `mouseenter` / `focusin`.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The tooltip encodes no PRD `BR-*` rule — it is a presentation aid. Its *content* may explain a business rule (a field-format hint) but the component itself is rule-agnostic. |
| Accessibility: icon-only controls need a visible label | `[BRAIN-OUT]` WAI-ARIA APG practice | An icon-only `<falcon-angular-button>` is hard to identify; pairing it with a tooltip gives sighted users the label. The tooltip is sighted-only — `ariaLabel` on the button still covers screen readers. |

## Business constraints baked in

- `[CODE]` falcon-tooltip.tsx:37,64-68,156 **`disabled=true` suppresses the hint entirely** — `open()` is a no-op and `showLabel` is gated by `!disabled`. A flow can mute the hint when it is no longer relevant. ⚠ `[CODE]` no `@Watch` on `disabled` (`[CODE]` falcon-tooltip.tsx:37) — a tooltip already *open* when `disabled` flips stays visible until pointer-leave; the consumer must call `close()`.
- `[CODE]` falcon-tooltip.tsx:38,141-152 **`interactive=true` keeps the panel alive while the pointer is over it** — required when the hint contains a clickable link, or the action is unreachable across the 8px gap.
- `[CODE]` falcon-tooltip.tsx:36,94-99 **A show delay (default 100ms) is built in** — the hint does not flash on incidental hover; the operator must dwell.
- `[CODE]` falcon-tooltip.tsx:166-176 **The trigger gets `tabIndex=0` unconditionally** — any wrapped element becomes keyboard-focusable so keyboard users can reach the hint. Trade-off: wrapping a non-interactive label turns it into a focus stop.

## Business flows using this component

`[CODE]` **NONE at runtime today** — the tooltip has ZERO feature-template consumers (Consumer Sweep, USAGE.md). The intended flows (per design-system guidance, not observed in features):

| Intended flow | Page | Role |
|---|---|---|
| Icon-button affordance labels | (general — icon-only buttons) | Names Edit/Delete icon buttons for sighted users. |
| Truncated value expansion | data tables | Reveals the full account/user name behind a `truncate`d cell. |
| Form-field hints | compact forms | Info-circle next to a label explains the expected format. |
| Status-indicator legends | (general) | Explains what a status dot/badge means. |

## Business gotchas

- `[BRAIN-OUT]` **Under-leveraged primitive** — the sweep found ZERO consumers (down from the prior "1 = playground", which is now gone). A builder adding icon-only buttons should pair them with a tooltip rather than leaving them unlabeled.
- `[BRAIN-OUT]` A tooltip is **not a label of record** — sighted-only and hover-gated. A control whose meaning *depends* on the tooltip fails for screen-reader and touch users. Always also set `ariaLabel` on the underlying control.
- `[BRAIN-OUT]` A tooltip is **not a menu and not a popover** — it carries information, not actions (beyond at most one link in `interactive` mode). Action lists → `falcon-angular-menu`; substantial interactive content → a popup.
- `[CODE]` falcon-tooltip.tsx:35 **No collision detection** — a `placement="right"` tooltip with no room on the right overflows the viewport; the business hint can be clipped off-screen. (The wrapper's Top-Layer promotion fixes ANCESTOR-CLIPPING but NOT viewport-edge overflow — those are different problems.) Choose placement deliberately or constrain with `maxWidth`.
- `[INFERRED]` `placement` values are **physical** (`left`/`right`), not logical — under RTL the consumer must flip placement.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-tooltip.tsx + the UI dossier files. No PRD `BR-*` rule binds this primitive. Consumer count corrected to 0 (playground showcase removed). The icon-button accessibility pairing is `[BRAIN-OUT]` design-system guidance, not a PRD rule.
