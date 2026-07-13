# falcon-icon — DECISION

## Brain SK final recommendation

**STATUS: READY (production-grade), adoption growing. Use `<falcon-angular-icon>` for ALL Falcon icon-font glyphs in net-new code.**

(Upgraded from the prior "zero consumers" framing — the wrapper is now adopted in comm-mkt-view + wallet/new-wallet. The genuine remaining adoption issue is the dominant raw-`<i class="falcon-icon …">` pattern, which a codemod should migrate — GAP G1.)

## Use this component for

- Every Falcon icon-font glyph (the **314** available — see OVERVIEW for the full set).
- Inside `<falcon-angular-button>` slots (`icon-start` / `icon-end`) — comm-mkt-card does exactly this.
- Inside menu items, accordion items, tab options, status indicators, form-field hints, date bands.
- The icon fallback inside `<falcon-angular-avatar>` / illustration in `<falcon-angular-empty-state>`.

## Avoid this component for

- A **platform-owned exact SVG** the font cannot carry (e.g. SAR `currency-sar`) → `<falcon-svg-icon name="…">` (shared `SVG_ICON_REGISTRY`).
- A one-off third-party / brand SVG → `<iconify-icon>` (until the G3 unified router ships).
- Brand logos / photos / avatars → dedicated components (`<img>`, `<falcon-angular-avatar>`).

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM (`<falcon-icon-tw>`). The global `.falcon-icon` font-face applies natively without per-Shadow imports; the `-tw` size utilities read the same tokens. Best for Studio mutation + React/Vue parity.

**`useTailwind=false`** (Shadow path) — only for style isolation; the font-face still cascades through the boundary (the Shadow CSS re-declares the `.falcon-icon` class chain). Both paths are prop-identical with identical a11y logic, so there is rarely a reason to switch.

## Required upgrades before wider use

None block production use. Leverage upgrades:
- **G1 (P0):** ESLint rule + codemod to migrate raw `<i class="falcon-icon …">` → the wrapper (the design-system-enforcement win).
- **G3 (P1):** unified Iconify fallback (`:`-prefix routing) — consolidates the platform icon strategy.
- **G2 (P1):** `spin`/`pulse` for loading indicators.

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-button` | Glyph in `slot="icon-start"`/`icon-end` (blessed pattern). |
| `falcon-angular-avatar` | Falls back to a `<i class="falcon-icon …">` glyph (renders the class directly). |
| `falcon-angular-empty-state` | Composes an icon for the empty illustration. |
| `falcon-svg-icon` | Shared SVG registry for platform-owned exact glyphs the font can't carry (`currency-sar`). |
| `iconify-icon` | Third-party non-Falcon glyphs (the G3 fallback target). |
| `falcon-angular-menu`/`tabs`/`accordion` | Item icons — currently CSS class strings; migrate to the wrapper. |

## Exact rule for future implementation tasks

1. **Need a Falcon glyph?** Use `<falcon-angular-icon name="X">` (X WITHOUT the `falcon-icon-` prefix; must exist in `falcon-icons.css` — 314 names).
2. **Pick a `size`** (xs/sm/md/lg/xl). Leave `decorative=true` for icons inside text/buttons.
3. **`decorative=false` + `label`** ONLY when the icon is the ONLY thing conveying meaning (e.g. a standalone status pill).
4. **Color via the parent** `text-falcon-*` (the icon inherits `currentColor`) — or the `--falcon-icon-color` token for one instance. No `style="color"`.
5. **Don't size with Tailwind `text-*`** — use `size`.
6. **Non-Falcon glyph?** `<falcon-svg-icon>` (platform-owned exact) or `<iconify-icon>` (third-party). Never `pi pi-*`.
7. **Missing glyph?** Raise a registry addition (font asset + CSS regen). Never substitute a near-miss — a wrong icon is a semantic defect.
8. **Net-new code uses the wrapper**, not raw `<i class="falcon-icon …">`.

---

## Dynamic capability assessment

### 1. What is static today?

- The icon font set (**314** glyphs) — adding one is a registry/font-asset change.
- No animation (spin/pulse), no color shorthand, no flip/rotate, no Iconify routing in the wrapper.
- `name` is an untyped `string` (no compile-time name validation).
- An unknown name renders silently (empty `<i>`).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **5 inputs** — `name` (signal-backed setter) / `size` / `decorative` / `label` (signal-backed setter) / `useTailwind`.
- **0 outputs** — purely visual.

### 3. What is already dynamic through slots / ng-template?

- **None.** No `<slot>`, no `ng-template` — a glyph has no projectable content.

### 4. What is dynamic through token / theme overrides?

- Per-size px via `--falcon-icon-size-{xs,sm,md,lg,xl}` (alias the canonical `--falcon-icon-{size}`).
- Color via `--falcon-icon-color` (defaults `currentColor`).
- Dark mode is automatic — color inherits from the parent, which flips with the theme.

### 5. What is dynamic through Tailwind classes?

- Parent `text-falcon-*` → icon color via `currentColor`.
- Host `class=` for margin/layout (and `animate-spin` as a spin workaround).

### 6. What is missing to make this component reusable across pages?

- Animation props (G2), Iconify fallback (G3), `color` shorthand (G5), flip/rotate (G6), a `FalconIconName` union (G4), a dev-mode unknown-name warning (G7), and lint enforcement of the wrapper over raw `<i>` (G1).

### 7. What capability should be added to the shared component (not a page hack)?

- All of item 6 — especially G1 (lint/codemod) and G3 (unified Iconify), which fragment the platform icon strategy if left per-page.

### 8. What flags / options / templates / slots would make it better?

- `[spin]` / `[pulse]` / `[flip]` / `[rotate]`, `[color]` shorthand, `:`-prefix Iconify auto-detect, typed `name: FalconIconName`.

### 9. What is the safest upgrade path?

1. **Phase A (additive inputs):** `spin`/`pulse`/`flip`/`rotate`/`color` — backwards-compatible.
2. **Phase B (typed name):** generate `FalconIconName` from `falcon-icons.css` at build; widen `name` to `FalconIconName | string` first, then narrow.
3. **Phase C (Iconify):** auto-detect `:` in `name` → `<iconify-icon>` (only activates for prefixed names).
4. **Phase D (enforcement):** ESLint rule + codemod migrating raw `<i class="falcon-icon …">` → the wrapper.

All additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- **The `name` → `.falcon-icon-{name}` convention** — flipping it breaks every consumer (wrapper AND every raw `<i class="falcon-icon …">`).
- **The default `decorative=true`** — changing would impose `aria-label` requirements everywhere.
- **The default `size="md"`** — would resize every icon.
- **`--falcon-icon-color: currentColor` inheritance** — removing forces per-icon color.
- **The vendored font asset location** (`@font-face` path) — moving it blanks every icon until paths update.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11). Recommendation upgraded to READY/promote (adopted in comm-mkt-view + wallet/new-wallet). 5 inputs (2 signal-backed), 0 outputs, 0 slots. Name set = **314** (corrected from "122"). G1 (raw-`<i>` codemod) + G3 (Iconify) are the strategic upgrades.
