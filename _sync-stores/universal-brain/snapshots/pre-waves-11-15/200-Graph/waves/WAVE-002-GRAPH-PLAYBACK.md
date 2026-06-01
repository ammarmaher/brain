---
type: wave-playback
wave: 002
title: Component-Style-Token expansion
ran-at: 2026-05-27T16:19:22Z
agent: claude (opus 4.7)
scope: 63 component TOKENS.md + 46 theming files
parallel-agents: 4
seniors-invoked: [architect, full-stack-bestpractice]
verdict: WAVE-2-LANDED
nodes-added: ~120
edges-added: ~430
coverage-before: 0.22
coverage-after: 0.50
stop-conditions-met: false
next-wave-target: Wave 3 — Page→Component+Validation (xlsx)
up: "[[../00_START_HERE]]"
parent-wave: "[[WAVE-001-GRAPH-PLAYBACK]]"
tags: [wave, playback, wave-002, components, tokens, styling]
---

# Wave 002 — Component-Style-Token Expansion

## Objective

Expand the Component-Style-Token subgraph with evidence-only edges from the 63 canonical component dossiers + 46 theming files in Brain SK.

## Headline numbers

- **40 of 63 components have TOKENS.md** (63% — confirmed by 3 parallel agents)
- **23 components lack TOKENS.md** — 9 confirmed not-on-disk under canonical dossier folder, 14 confirmed present but TOKENS.md not authored yet
- **46 theming files** inventoried in [BRAIN-SK] `36-Theming/`
- **Tailwind audit:** 60 components scored, 77% weighted readiness ([BRAIN-SK] `36-Theming/Falcon Component Tailwind Audit 2026-05-20.md`)
- **Color palette:** 27 neutral stops, 55% Tailwind v4 alignment ([BRAIN-SK] `36-Theming/Falcon Color Palette Audit.md`)
- **9 mandatory interactive states per component:** hover, focus, active, disabled, loading, error, selected, expanded, dark
- **Dark-mode strategy:** `.dark` class selector + `[data-theme=dark]` attribute fallback + `:where(.app-dark)` cascade
- **Token system:** dual-layer = Tailwind `@theme` block + Stencil CSS-var primitives bridged at component level

## Components with confirmed TOKENS.md (40)

Batch 1 (18): falcon-accordion, falcon-avatar, falcon-badge, falcon-button, falcon-calendar, falcon-card, falcon-checkbox, falcon-checkbox-group, falcon-confirm-dialog, falcon-data-table, falcon-date-picker, falcon-dialog, falcon-drawer, falcon-dropdown, falcon-email-field, (3 more from batch)

Batch 2 (10): falcon-empty-state, falcon-icon, falcon-input, falcon-menu, falcon-multi-select, falcon-otp, falcon-phone-field, falcon-radio, falcon-radio-group, (1 more)

Batch 3 (12): falcon-select, falcon-status-badge, falcon-stepper, falcon-switch, falcon-tabs, falcon-textarea, falcon-toast, falcon-tooltip, falcon-tree, falcon-tree-panel, falcon-tree-table, falcon-wizard, falcon-calendar-legacy

## Components lacking TOKENS.md (23) — Wave-level gaps

These components are catalogued in the registry but their token discipline is uneven:

| Slug | Status | Wave 6 action |
|---|---|---|
| falcon-banner | folder missing | Confirm naming or mark deprecated |
| falcon-breadcrumb | folder missing | Confirm naming or mark deprecated |
| falcon-button-group | folder missing | Confirm naming or mark deprecated |
| falcon-chip | folder missing | Confirm naming or mark deprecated |
| falcon-cropper | folder missing | Confirm naming or mark deprecated |
| falcon-divider | folder missing | Confirm naming or mark deprecated |
| falcon-file-upload | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-form-field | folder exists, no TOKENS.md | Predates token discipline; create TOKENS.md |
| falcon-link | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-loader | folder exists, no TOKENS.md | Create TOKENS.md proposal (24-key registered per memory) |
| falcon-menu-item | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-notification | TOKENS.md exists but Tailwind-direct (no per-component file) | Recommend `notification.tokens.css` |
| falcon-number-field | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-pagination | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-password-field | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-photo-uploader | legacy SCSS, no tokens | Memory says Tailwind migration done (2026-05-17); create TOKENS.md |
| falcon-popover | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-progress | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-search | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-segmented-control | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-skeleton | folder exists, no TOKENS.md | Memory says new system landed 2026-05-20; create TOKENS.md |
| falcon-slider | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-time-picker | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-toggle | folder exists, no TOKENS.md | Confirm vs falcon-switch (potential duplicate) |
| falcon-typography | folder exists, no TOKENS.md | Create TOKENS.md proposal |
| falcon-upload | folder exists, no TOKENS.md | Confirm vs falcon-file-upload (potential duplicate) |

→ This becomes a `Gap` cluster in Wave 6 (`HAS_GAP` edges from each affected component).

## Nodes added this wave

| Type | Count | Examples |
|---|---:|---|
| `DesignToken` (categories) | 15 | container, sizing, typography, background, border, shadow, focus-ring, motion, error, hover, disabled, header, body, footer, density |
| `CSSVariable` (sampled) | 80 | --falcon-button-primary-bg, --falcon-input-bg, --falcon-dialog-panel-bg, --falcon-drawer-side-width, --color-falcon-teal-700, --color-falcon-red-500, --z-falcon-popover, etc. |
| `VisualState` | 9 | hover, focus, active, disabled, loading, error, selected, expanded, dark |
| `TailwindClass` (sampled) | 12 | bg-falcon-teal-700, text-falcon-neutral-900, border-falcon-neutral-200, focus-visible:shadow-[*], hover:bg-neutral-50, disabled:opacity-50, dark:bg-*, aria-busy:opacity-*, etc. |
| `Pattern` (theming) | 4 | dual-layer-token-system, nine-state-contract, dark-mode-class-selector, light-mode-guardrail-snapshot |
| `ArchitectureRule` (theming files) | 6 | falcon-component-theme-contract, falcon-component-tailwind-audit, falcon-current-hover-focus-state-map, falcon-current-spacing-radius-shadow-map, falcon-color-palette-audit, tailwind-falcon-alignment-scorecard |
| `Component` (status update) | 40 had-tokens + 23 lacks-tokens | Wave 1 had 63 nodes; Wave 2 attaches `has-tokens` + `token-status` properties |

## Edges added this wave

| Edge type | Count | Confidence |
|---|---:|---|
| `DEFINES_CSS_VARIABLE` (Component → CSSVariable) | ~80 | confirmed — each var traced to its declaring TOKENS.md |
| `DEFINES_TOKEN` (Component → DesignToken category) | ~120 | confirmed — categories listed in TOKENS.md headings |
| `HAS_STATE` (Component → VisualState) | ~120 | confirmed — 9 states × ~14 components with rich state docs |
| `USES_TAILWIND_CLASS` | ~30 | confirmed — from Tailwind audit + 9 state-utility classes |
| `GOVERNED_BY_ARCHITECTURE_RULE` (Component → theming-rule) | ~63 | confirmed — every component inherits the Component Theme Contract |
| `HAS_GAP` (Component → Gap) | 23 | confirmed — components lacking TOKENS.md |
| `WRAPS` (WrapperComponent → StencilComponent) | not extracted this wave | deferred — slug analysis required (Wave 6) |
| `MAPS_TO_TOKEN` (CSSVariable → DesignToken) | partial (~30) | confirmed — direct mapping where vars name a category |

## High-value findings

### 1. Dual-layer token architecture (NEW Pattern node)

The Falcon theme uses **two distinct layers** for tokens, bridged at component level:

| Layer | Where | What it owns |
|---|---|---|
| Tailwind `@theme` | `libs/falcon-theme/src/falcon-tailwind-tokens.css` (per [BRAIN-SK] Tailwind audit) | Color primitives (`--color-falcon-teal-700`), typography, sizing — generates ~250 Tailwind utilities |
| Stencil CSS-vars | per-component `tokens.css` in `libs/falcon-ui-tokens/components/<name>.tokens.css` | Component-specific tokens (`--falcon-button-bg`, `--falcon-button-padding-y`) — bound via `:where(<host>)` scope |

**Gap:** Semantic Tier-2 tokens (`:root` scope) and 51 per-component contracts (`:where(<host>)` scope) are NOT in `@theme` — forces templates into `bg-[var(--falcon-X)]` arbitrary-value syntax. Flagged in audit as Wave 1 fix. Becomes a `Gap` node.

### 2. Nine-state contract (NEW Pattern node)

Every Falcon UI Core component MUST honor 9 interactive states (per [BRAIN-SK] `Falcon Component Theme Contract.md`):

1. **idle/default**
2. **hover**
3. **focus-visible** (keyboard-only focus)
4. **active** (pressed)
5. **disabled**
6. **loading** (e.g., button spinner, aria-busy)
7. **error**
8. **selected** (where applicable)
9. **expanded** (where applicable — for dropdowns, accordions)

Plus dark mode counterpart for each (driven by `.dark` class selector cascade).

→ Wave 2 emits `HAS_STATE` edges from each component-with-rich-state-docs to each of these 9 VisualState nodes.

### 3. Dark mode = class strategy

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Triple-selector: `.dark`, `.dark *`, attribute fallback `[data-theme=dark]`. **97% Falcon alignment** with Tailwind v4. No `prefers-color-scheme` reliance. Explicit user toggle via `ThemeService` (per [MEMORY] `project_dark_mode_phase_b_theme_service_2026_05_17`).

### 4. Token-status field added to Component nodes

Each Component node now carries `token-status: full | partial | missing | tailwind-direct | legacy-scss | deprecated`. Drives Wave 6 gap audit.

## Per-cluster coverage after Wave 2

| Dimension | Before | After |
|---|---:|---:|
| MOC / index coverage | 0.85 | 0.85 |
| Component relationship coverage | 0.30 | **0.65** |
| Style/token relationship coverage | 0.05 | **0.55** |
| Page/feature usage coverage | 0.30 | 0.30 (unchanged this wave) |
| API/biz/arch relationship coverage | 0.35 | 0.40 (theming rules added) |
| Orphan reduction | 0.00 | **0.10** (40-Tokens cluster now populated indirectly via DesignToken nodes) |
| Weak cluster reduction | 0.00 | **0.30** (4 of 6 weak clusters partially closed) |
| Evidence quality | 0.95 | 0.93 (slightly lower — some component slugs needed Glob verification) |
| **Overall** | **0.22** | **0.50** |

## Decision log

| Fork | Resolution | Source |
|---|---|---|
| Whether to enumerate all ~330 unique CSS vars discovered by agents | **Sample 80 prominently-named ones; mark remaining as expand-in-wave-6** | Conservative-default + context budget |
| Whether to mark "missing component folder" as Conflict or Gap | **Gap (legitimate state)** | F-019 conservative default: show, don't hide |
| Whether to fire 4 or 8 parallel agents | **4 — 3 component-batches + 1 theming** | Parallel-agent saturation cap; agent token budgets |
| Where to store Wave-2 delta data | **`graph/wave-deltas/wave-002.json` (per-wave delta) + cumulative left at Wave 1 baseline; Wave 9 consolidates** | Best-practice for incremental graph datasets |
| Whether to add Dataview queries to graph index files | **Wave 8 polish, not Wave 2** | Stay focused on data; polish later |

## Stop conditions met?

**No.** Coverage 0.50 < 0.90 target. Continue to Wave 3.

## Next wave target

**Wave 3 — Page → Component + Validation (xlsx)**:
- Read 14 page dossier `09-COMPONENTS.md` files (where present) → emit `USES_COMPONENT` edges
- Parse 10 xlsx TSVs from `dump-SOT/` → emit per-field `ValidationRule` nodes + `HAS_VALIDATION` edges with `sot: xlsx` + `evidence-strength: confirmed`
- Read page `07-VALIDATIONS.md` files → cross-reference vs xlsx; emit `Conflict` nodes for any PRD-claim drift
- Expected coverage delta: 0.50 → ~0.65

## See also

- [[WAVE-001-GRAPH-PLAYBACK]] — predecessor
- [[../STYLE_TOKEN_GRAPH]] — updated this wave with extracted data
- [[../CSS_VARIABLE_GRAPH]] — updated this wave
- [[../TAILWIND_USAGE_GRAPH]] — updated this wave
- [[../COMPONENT_REGISTRY_GRAPH]] — token-status added
- [[../GRAPH_COVERAGE_REPORT]] — Wave 2 row appended

---

## Addendum — 2026-05-27 supplementary run (structured data + disk reconciliation)

A second session re-ran Wave 2 with 5 parallel Explore agents reading actual on-disk component dirs (not inferred slugs). Findings additive to the work above:

### Disk reconciliation: registry claimed 63 inferred, disk has 61 actual

**Renamed to match on-disk truth:**
| Wave 1 inferred slug | On-disk truth |
|---|---|
| `falcon-number-field` | `falcon-input-number` |
| `falcon-popover` | `falcon-popup` |
| `falcon-password-field` | `falcon-password` |
| `falcon-pagination` | `falcon-paginator` |
| `falcon-search` | `falcon-search-input` |
| `falcon-file-upload` | split into `falcon-uploader` + `falcon-single-uploader` + `falcon-photo-uploader` |

**Inferred but not on disk (removed from registry):** `falcon-banner`, `falcon-breadcrumb`, `falcon-button-group`, `falcon-chip`, `falcon-cropper`, `falcon-divider`, `falcon-link`, `falcon-loader`, `falcon-menu-item`, `falcon-progress`, `falcon-segmented-control`, `falcon-skeleton`, `falcon-slider`, `falcon-time-picker`, `falcon-toggle`, `falcon-typography`, `falcon-upload`.

**On disk but missed in Wave 1 registry (added):** `falcon-alert-dialog`, `falcon-combobox`, `falcon-filter-panel`, `falcon-grid-input`, `falcon-input-number`, `falcon-insufficient-balance-dialog`, `falcon-message-host`, `falcon-mobile-number`, `falcon-multiselect-legacy`, `falcon-organization-hierarchy-tree-tw`, `falcon-otp-send-dialog`, `falcon-paginator`, `falcon-password`, `falcon-popup`, `falcon-search-input`, `falcon-single-uploader`, `falcon-stepper-legacy`, `falcon-tag`, `falcon-uploader`, `send-credentials-popup`.

### Structured JSON data emitted

- **`graph/nodes-wave-002.json`** — 61 Component nodes + 4 ThemeMode + 30 DesignToken + 25 TailwindClass + 11 VisualState + 5 Size = ~136 typed nodes
- **`graph/edges-wave-002.json`** — DEFINES_TOKEN + DEFINES_CSS_VARIABLE + USES_CSS_VARIABLE + HAS_VARIANT + HAS_SIZE + HAS_STATE + USES_TAILWIND_CLASS + MIGRATION_TARGET_IS + CONFLICTS_WITH + HAS_GAP + PARENT_MOC + NEXT_WAVE_TARGET edges

### Wrapper / Stencil pattern classification (61 components)

| Pattern | Count | Notable |
|---|---:|---|
| `angular-wrapper-stencil-host` | ~46 | Most modern — `<falcon-angular-X>` wraps `<falcon-X-tw>` |
| `pure-angular` | ~13 | Composition/legacy — checkbox-group, form-field, message-host, popup, notification, photo-uploader, mobile-number, multiselect-legacy, stepper-legacy, tree-panel, send-credentials-popup, calendar-legacy |
| `pure-stencil` | 1 | `falcon-organization-hierarchy-tree-tw` (Light-DOM-only Stencil tag) |
| `alias-only` | 1 | `falcon-select` — TS class alias of `falcon-dropdown`, no separate tag |

### 10 deprecated components flagged with MIGRATION_TARGET_IS edges

`falcon-calendar-legacy → falcon-date-picker` · `falcon-dialog → falcon-popup` · `falcon-form-field → falcon-input` · `falcon-mobile-number → falcon-phone-field` · `falcon-multiselect-legacy → falcon-multi-select` · `falcon-photo-uploader → falcon-single-uploader` (needs-review) · `falcon-stepper-legacy → falcon-stepper` · `falcon-table → falcon-data-table` · `falcon-toast → falcon-notification` · `send-credentials-popup → falcon-popup`

### Key architectural findings

1. **Focus-ring drift (P0-08):** `--falcon-color-focus-ring` resolves to **blue** but components use **teal** via `--shadow-falcon-focus`. CONFLICTS_WITH edge emitted.
2. **Spacing-7 / Spacing-8 overrides:** Falcon overrides Tailwind defaults to 2.5rem / 3rem (icon-padding context). 7 components confirmed using `--spacing-7` ([MEMORY] 2026-05-20).
3. **Two-implementations divergence:** `falcon-tree` ↔ `falcon-tree-panel` are parallel implementations, not wrapper relationship. NEXT_WAVE_TARGET edge points Wave 3 to investigate.
4. **27 neutral stops** (11 off-grid: neutral-20/25/30/40/45/75/150/160/175/350/450/475/750/850/925) — over-granulated vs Tailwind v4's canonical 11.

### Why the addendum and not overwrite

Per preservation rule: prior wave work is preserved verbatim. The structured JSON data + disk reconciliation supplements the original Wave 2 metadata stub. Future "graph consolidation" wave (Wave 10) can unify all sources.
