---
type: component
tag: falcon-empty-data
family: empty-state
status: shipped
version: 1.0
created: 2026-05-14
framework: stencil+angular
pattern: dual-render
component-slug: falcon-empty-data
verified-at: 2026-05-14
source-prefix: "[CODE]"
strategy-run: "2026-05-14_falcon-empty-data"
score: 97
tags: [layer/frontend, scope/falcon-ui-core, status/active, knowledge/high]
related:
  - "[[../FALCON_COMPONENT_INDEX|FALCON_COMPONENT_INDEX]]"
  - "[[../Frontend Components Index|Frontend Components Index]]"
  - "[[../Frontend Understanding|Frontend Understanding]]"
cross-vault:
  - "C:\\Falcon\\falcon-wiki\\30-Components\\falcon-empty-data.md"
---

> [!tldr]
> Brain SK companion note for the canonical Falcon wiki entry at `[VAULT] C:\Falcon\falcon-wiki\30-Components\falcon-empty-data.md`. Themed empty-state component for Falcon data tables and full-page hero placeholders. Dual-render (Stencil Shadow + Light + Angular wrapper) with full Studio-token compatibility. Auto-mounts inside `<falcon-angular-data-table>` via `[emptyData]` shorthand when `data.length === 0`.

# falcon-empty-data (Brain SK companion)

## Canonical sources (source-prefixed)

| Source | Path |
|---|---|
| `[VAULT]` (canonical typed-note) | `C:\Falcon\falcon-wiki\30-Components\falcon-empty-data.md` |
| `[CODE]` (component) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/` |
| `[CODE]` (tokens) | `libs/falcon-ui-tokens/src/components/empty-data.tokens.css` |
| `[CODE]` (HTML reference) | `Source_of_truth_theme/HTML/Empty Table.html` |
| `[BRAIN-OUT]` (scorecard) | `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\runs\2026-05-14_falcon-empty-data\SCORECARD.md` |
| `[BRAIN-SK]` (registry section #10 canonical) | `C:\falcon\Brain SK\registries\FALCON_COMPONENT_REGISTRY.md` |
| `[BRAIN-SK]` (pitfalls) | `C:\falcon\Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md` → BUG-012, BUG-013 |

## Identity

`[CODE]` Three Angular tags ship as part of the family (canonical dual-render pattern):

| Tag | Role | Notes |
|---|---|---|
| `<falcon-empty-data>` | Wrapper | Picks variant via `[useTailwind]` (default `true`) |
| `<falcon-empty-data-tw>` | Tailwind Light-DOM | Token-driven theming preferred path |
| `<falcon-angular-empty-data>` | Angular Shadow | `ViewEncapsulation.ShadowDom`, scoped CSS in `styles:` array |

## Role

`[CODE]` Themed empty-state with full Studio-token compatibility (~35 CSS vars resolving via `color-mix()` from Falcon brand tokens). Two layout modes (`table` / `page`) × three container-fit strategies (`fill` / `mini` / `fit`) cover every empty-cell and zero-state hero scenario.

## Contract — Inputs (22 total)

`titleText` · `body` · `iconKey` · `cardBackground` · `glossyGradient` · `iconBackground` · `coloredIcon` · `iconOpacityOn` · `opacity` · `showAction` · `actionLabel` · `actionSize` · `actionBorder` · `showInfo` · `infoText` · `mode` · `containerFit` · `padX` · `padY` · `marginX` · `marginY` · `useTailwind`

For full table see `[VAULT] C:\Falcon\falcon-wiki\30-Components\falcon-empty-data.md`.

## Contract — Outputs (1)

| Output | Type | Fires when |
|---|---|---|
| `actionClick` | `EventEmitter<void>` | CTA button pressed |

## Supported icon keys (8)

`users` · `inbox` · `search` · `folder` · `doc` · `bell` · `box` · `star`

## Data-table integration

`[CODE]` `<falcon-angular-data-table>` exposes `[emptyData]: FalconEmptyDataConfig` + `(emptyDataAction)`. When `data.length === 0` AND no `*falconDataTableEmpty` template is projected, the data-table dynamically `createComponent`s a `FalconEmptyDataComponent` and mounts its root into the empty `<td>`. Chrome management is handled by `applyEmptyDataChrome()` / `restoreEmptyDataChrome()` (hides `<thead>` via inline style; zeros empty-cell pad CSS vars).

## Score

`[BRAIN-OUT]` **97 / 100** (first run, Wave 19 / 16th iter). Will climb as `08-COMMON_PITFALLS` additions land in the strategy v1.0 catalog.

## Pitfalls discovered during creation

- `[BRAIN-SK]` **BUG-2026-05-14-012** — Stencil reserved HTMLElement prop names. Use `<noun>Text` suffix (e.g. `titleText`) to avoid silent dist-emission skip.
- `[BRAIN-SK]` **BUG-2026-05-14-013** — Loader-entry chicken-and-egg with Stencil dist on first build. One-time bootstrap: comment line → build → uncomment → rebuild.
- `[BRAIN-SK]` **BUG-2026-05-14-011** — Library-layering trap (placed in `@falcon/ui-core/angular`, NOT `@falcon/shared-ui`).

## Related Brain SK notes

- [[../FALCON_COMPONENT_INDEX|FALCON_COMPONENT_INDEX]] — canonical 60-component dossier index
- [[../Frontend Components Index|Frontend Components Index]]
- [[../Frontend Understanding|Frontend Understanding]]

## Cross-vault link

The authoritative typed-note for graph queries lives in the Falcon Wiki vault:
- `[VAULT]` [[file://C:/Falcon/falcon-wiki/30-Components/falcon-empty-data.md|falcon-empty-data.md (Falcon Wiki)]]

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_

## Tags

#type/falcon-component
