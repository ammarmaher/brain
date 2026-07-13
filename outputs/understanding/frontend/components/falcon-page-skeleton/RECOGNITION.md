# falcon-page-skeleton — Recognition Layer

> Given an external design / screenshot / snippet, identify `<falcon-page-skeleton>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A **full-page loading ghost** of a two-pane workspace, every shape rendered as a pale shimmering (`animate-pulse`) placeholder block:

- **Left:** a rounded card (`bg-emerald-50/40` tint) holding a stack of ~12 **indented tree rows** — each a small circle (node icon) + a grey bar (label), some rows highlighted teal (selected), with vertical guide lines for nested indent levels. Hidden below the `lg` breakpoint.
- **Right:** a larger white card with a **tab strip** (4 grey bars + a pill button) along the top, then a **node-header row** (avatar circle + a long title bar + two button placeholders, one teal), then a **data table**: a header row of short bars, ~9 body rows each ending in a coloured **status pill** (emerald/amber/rose/slate) + a row-action dot, and a footer row with a pagination bar + 4 square button placeholders.

If a screenshot shows a shimmering "tree on the left, table-with-status-pills on the right" loading state — that's this component.

## Cross-library equivalents

| Library | Their construct | Parity notes |
|---|---|---|
| MUI | `<Skeleton variant="rectangular"/>` composed into a layout | MUI gives skeleton primitives; this is a pre-composed full-page layout of them |
| PrimeNG | `<p-skeleton>` blocks assembled into a page | PrimeNG primitive vs this fixed composition |
| Ant Design | `<Skeleton>` / `<Skeleton.Node>` arranged into a page | Ant primitive vs this fixed layout |
| Bootstrap | `.placeholder` + `.placeholder-glow` blocks | upgrade target |
| shadcn / Radix | `<Skeleton className="h-… w-…"/>` composed by hand | shadcn primitive; this is the assembled workspace ghost |
| plain HTML | hand-rolled `<div class="animate-pulse bg-gray-200">` grid | always replace with this for the tree+table shape |

> **Key distinction:** every library above ships a *skeleton primitive*; this component is a **pre-assembled, layout-specific full-page skeleton** for ONE shape (org-hierarchy / Templates). It is closer to "a page-shaped loading screen" than to a reusable skeleton primitive. (Splitting it into primitives is GAP G2.)

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a full-page loading ghost of a tree + table workspace | `<falcon-page-skeleton>` | a bare spinner |
| a loading ghost of a DIFFERENT page shape | a page-specific skeleton (this one is hardcoded — G2) | `<falcon-page-skeleton>` |
| a node-identity header (real, not loading) | `<falcon-node-details-section>` (B26) | this |
| a read-only details grid (real, not loading) | `<falcon-info-card>` (B25) | this |
| per-row loading inside an already-rendered table | (the table's own hard content-swap; or a future `<falcon-table-skeleton>` — G2) | this whole-page overlay |
| a single small loading block | a one-off `animate-pulse` block | this |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.

1. **Inputs** — `[loading]` (self-gating) OR `[forceVisible]="true"` (when you gate with your own `@if`). That's the entire input surface.
2. **Templates** — none. The layout is fully hardcoded (no `ng-template` inputs).
3. **Slots** — none (no `<ng-content>`). You cannot inject or reshape content.
4. **Variants** — none (no size/shape axis — GAP G2).
5. **Token override** — N/A (no token file; raw-palette + Falcon-token mix baked in — GAP G3). You cannot recolour per-instance.
6. **Upgrade** — need a different shape, dark mode, RTL-correct indent, or ARIA loading semantics? Those are GAPs G2/G4/G5/A1 — raise them; do not fork a third copy (there are already two — G6).
7. **Wrapper** — for the overlay pattern, wrap it yourself: `@if (loading) { <div class="absolute inset-0 z-10 bg-falcon-neutral-75 pointer-events-none"><falcon-page-skeleton [forceVisible]="true"/></div> }` (the Templates pattern).

## Anti-patterns

- Using it on a page whose real layout is NOT tree+table — it promises the wrong shape (GAP G2).
- Creating a THIRD copy of the skeleton — there are already two (this + `app-org-hierarchy-skeleton`); the right move is the dedup (G6), not another fork.
- "Fixing" the raw-palette colours (G3) on ONE copy only — it breaks the pixel-parity the copy exists to preserve; do it after consolidating (G6).
- Leaving it visible with no timeout/error path — it has no auto-hide; the consumer must flip `visible()` false on success/error.
- Letting the overlay intercept clicks — keep `pointer-events-none` so placeholder rows aren't clickable.
- Expecting dark-mode or RTL correctness — neither is handled (GAPs G4/G5).
- Expecting a screen-reader "loading" announcement — there's no ARIA (GAP A1); add an `aria-live` region in the consumer.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B26) from `falcon-page-skeleton.component.ts` (inline template). Sibling routing cross-checked against B25/B26 dossiers (`<falcon-node-details-section>`, `<falcon-info-card>`). The "pre-assembled vs primitive" framing + GAP cross-refs are 🟢 code-grounded (fixed constants, no slots, raw palette). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
