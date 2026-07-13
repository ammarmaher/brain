# falcon-node-details-section — Recognition Layer

> Given an external design / screenshot / snippet, identify `<falcon-node-details-section>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A horizontal **header strip** on a near-white surface (`bg-falcon-neutral-0`), full width, with comfortable padding (`px-5 pt-5 pb-5`):

- **Left:** a small **circular avatar** — either an organization logo image (28px circle, neutral border), a **brand SVG / custom chip** (when a custom avatar is projected, e.g. the Falcon root mark), or a **teal-700 initials chip** with a single white uppercase letter (36px) when there's no image — immediately followed by the node **name** in `text-sm font-semibold` (truncated with a hover title).
- **Right:** zero or more **action buttons** (typically Falcon primary/secondary buttons like Edit, or Cancel + Save) that change with the screen's mode.

If a screenshot shows "[logo/initials] Node Name ............ [Edit]" or "[…] Node Name … [Cancel] [Save]" at the top of a node-scoped panel — that's this component.

## Cross-library equivalents

| Library | Their construct | Parity notes |
|---|---|---|
| MUI | `<CardHeader avatar={<Avatar/>} title=… action={<IconButton/>}/>` | Direct conceptual match — avatar + title + action region |
| PrimeNG | `<p-toolbar>` with a left avatar/title template + right buttons | PrimeNG splits left/right templates; Falcon bakes avatar+label left, projects actions right |
| Ant Design | `<PageHeader avatar={…} title=… extra={[…]}/>` | `extra` ≈ the `falconNodeDetailsActions` slot; `avatar` ≈ the avatar slot |
| Bootstrap | `.card-header` flex with an avatar + `.ms-auto` button group | upgrade target — replace wholesale |
| shadcn / Radix | composed `<div className="flex items-center justify-between">` + `<Avatar>` + `<Button>` | shadcn hand-composes; Falcon is one slot-driven component |
| plain HTML | `<header><img/> <h?>Name</h?> <button>…</button></header>` | always replace with this |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a node-identity header with avatar + name + mode-driven action buttons | `<falcon-node-details-section>` | — |
| a read-only label/value details grid (key: value rows) | `<falcon-info-card>` (B25) | this |
| a page-level loading placeholder (skeleton tree + table) | `<falcon-page-skeleton>` (B26) | this |
| a node header with a **built-in** back-arrow + hardcoded action buttons + inlined brand SVG | `<falcon-node-details-section>` + project your own actions | `<falcon-org-node-header>` (B25 — deletion candidate, do not use) |
| a segmented List/Tree view switcher | `<falcon-view-toggle>` (B25) | this |
| a single action button | `<falcon-angular-button>` directly | this |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.

1. **Inputs** — `[label]` (required), `[imageUrl]`, `[imageAlt]`. That's the whole input surface.
2. **Templates** — none beyond the two slot directives below (no `ng-template` *inputs*).
3. **Slots:**
   - `<ng-template falconNodeDetailsActions>` — project the right-side action buttons (use `<falcon-angular-button>`); gate them with `@if` on the parent's mode/PES signals.
   - `<ng-template falconNodeDetailsAvatar>` — project a custom avatar (brand SVG / status chip / the shared `<app-org-node-avatar>`); this **overrides** `imageUrl` + the initials fallback.
4. **Variants** — **none** (no `size`/`variant` axis — GAP G2). One fixed presentation.
5. **Token override** — **N/A** (no token contract — GAP G6). To recolour you'd edit the shared template (a shared change) or add `dark:` for dark mode (GAP G5). Add only **layout** utilities on the host `class=` (e.g. a `border-b` divider — GAP G4).
6. **Upgrade** — need a compact header, dark mode, or unified avatar size? Those are GAPs G2/G5/G3 — raise them; do not fork the component per page.
7. **Wrapper** — do not wrap. This IS the shared wrapper (it was promoted from app-level in Wave 19 precisely to stop per-app forks).

## Anti-patterns

- Re-implementing the brand SVG inline in a parent instead of projecting `<app-org-node-avatar>` via the avatar slot — that mistake is what made `<falcon-org-node-header>` (B25) rigid and superseded.
- Adding a hardcoded Edit/Back button to the component "for convenience" — actions are the parent's; keep the strip presentational.
- Using `<falcon-org-node-header>` / `<app-org-node-header>` in new code — both are **0-consumer deletion candidates** (B25 G1). Use THIS component.
- Native `<button>` in the actions slot — house rule is `<falcon-angular-button>`.
- Expecting the strip to draw its own divider line — it does not (stale comment, GAP G4); add `border-b` on the host if needed.
- Expecting dark-mode adaptation of the strip surface — none today (GAP G5).
- Using it as a details grid (key/value rows) — wrong component; use `<falcon-info-card>`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B26) from `falcon-node-details-section.component.ts` + `.html` + the two directives. Sibling routing table cross-checked against B25 FINDINGS (`<falcon-org-node-header>` deletion candidate, `<falcon-info-card>`, `<falcon-view-toggle>`) + B26 `<falcon-page-skeleton>`. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
