# falcon-resizable-split-pane — Recognition Layer

> Given an external design / screenshot / snippet, identify `<falcon-resizable-split-pane>` as the component to use, and how to compose it to parity.

## Visual fingerprint

Two side-by-side content panes separated by a **thin draggable vertical divider** carrying a small **rounded teal pill (grip)** centred on the divider. The two panes are **row-aligned** and scroll **together** (one scrollbar on the right pane). On hover/focus/drag of the divider the grip **grows** and goes fully opaque; at idle it gives a subtle **pulse** ("you can drag me"). The left pane often has a static header that stays put while its body scrolls in lockstep with the right.

If a screenshot shows "two columns, a slim divider with a little pill handle between them, dragging the divider resizes the columns, and both columns scroll as one" — that's this component. The wallet's **Organizations ⟷ Wallet/Transfer values** ledger is the canonical look.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| PrimeNG | `<p-splitter>` / `<p-splitterPanel>` | Direct match — draggable splitter with panels; PrimeNG doesn't enforce the single-synced-scroll alignment |
| Angular CDK | `cdkDrag` on a divider + manual flex-basis | CDK gives drag primitives; this packages the whole resize + synced-scroll + grip + a11y |
| react-resizable-panels | `<PanelGroup><Panel/><PanelResizeHandle/>` | Conceptual 1:1 (panels + a resize handle); this adds the mirrored single scroll |
| Split.js | `Split([leftEl, rightEl])` | Split.js resizes two elements with a gutter; this adds the scroll mirror + tokenised grip + Angular signals |
| MUI | (no first-class splitter; community `Allotment`) | Allotment ≈ this; MUI core has none |
| Bootstrap | none (hand-rolled gutter) | upgrade target |
| plain HTML/JS | hand-rolled `mousedown` + flex-basis + scroll sync | always replace with this |

> **Distinguishing trait:** most splitters resize two *independently-scrolling* panes. THIS one enforces **one synced scroll** (right pane owns the bar; left mirrors via transform) so the two columns stay **row-aligned** — that alignment guarantee is its reason to exist (the wallet org↔balance pairing).

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| two resizable, row-aligned columns sharing ONE scroll (ledger / master-detail) | `<falcon-resizable-split-pane>` | a hand-rolled flex + gutter |
| two columns that DON'T need to resize or align | plain flex/grid | this |
| two INDEPENDENTLY-scrolling panes | a basic two-column layout | this (it forces one synced scroll) |
| a TOP/BOTTOM (horizontal) split | (build one / propose `orientation` — GAP G3) | this (vertical only) |
| a loading placeholder of a two-pane page | `<falcon-page-skeleton>` (B26) | this |
| a node-identity header | `<falcon-node-details-section>` (B26) | this |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.

1. **Inputs** — `[leftDefaultWidth]`, `[leftMinWidth]`, `[rightReserveWidth]`, `[arrowStep]`, `[resizerAriaLabel]` (translated), `[resizerTitle]` (translated). Optional two-way `[(leftWidth)]` to persist/restore.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — the core of composition:
   - `[slot=left-header]` — static left header (does NOT scroll).
   - `[slot=left]` — left body rows (mirror-scroll with the right; no own scrollbar).
   - `[slot=right]` — the ONE scroll region (sticky header + body). **Put all scroll content here.**
4. **Variants** — none discrete; geometry is the numeric inputs (GAP G3 if you need horizontal).
5. **Token override** — per-instance host class mutating `--falcon-split-pane-*` (most commonly `--falcon-split-pane-grip-shadow`, as the wallet does for SoT pixel-parity — tokens.css:41-48). Never hand-roll Tailwind to recolour the grip/resizer.
6. **Upgrade** — need horizontal split, RTL-correct drag, or `aria-valuetext`? Those are GAPs G3/G2/A1 — raise them; do not fork the resizer.
7. **Wrapper** — do not wrap. This IS the shared wrapper (the W3 extraction of the wallet's resizer).

## Anti-patterns

- Putting scrollable content in `[slot=left]` — the left scrollbar is hidden (it mirrors); scroll content belongs in `[slot=right]`.
- Reintroducing JS grip placement — the grip is CSS-centred (the fix for the old `position:fixed` viewport-middle bug); do not undo it.
- Hand-rolling Tailwind to recolour the grip/resizer — override `--falcon-split-pane-*` tokens instead.
- Binding `[leftWidth]` one-way and expecting the drag to update your state — use `[(leftWidth)]` (two-way) or omit it (internal management).
- Passing raw English to `resizerAriaLabel`/`resizerTitle` — they render as-is; pass `… | translate`.
- Redefining the `.falcon-split-*` class names in consumer CSS — `ViewEncapsulation.None` means they're global.
- Using it for a non-resizable or independently-scrolling two-column layout — wrong tool (plain flex/grid).
- Assuming RTL drag is correct without testing — the drag delta assumes left=resized (GAP G2).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B26) from `falcon-resizable-split-pane.component.ts` + `.html` + `.math.ts` + `resizable-split-pane.tokens.css`. The single-synced-scroll distinguishing trait, slot recipe, grip-shadow override, and CSS-centred-grip anti-pattern are 🟢 code-grounded. Sibling routing cross-checked against B26 (`<falcon-page-skeleton>`, `<falcon-node-details-section>`). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
