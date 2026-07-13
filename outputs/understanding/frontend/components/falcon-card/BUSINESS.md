# falcon-card — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-card.tsx:1-3 — falcon-card is a **presentational surface container**: a bordered, padded box with an optional title strip and footer. In product terms it is how the UI **groups a coherent unit of information** — "Account details", "Permissions", "Activity", a KPI tile, a dashboard widget — into one visually-bounded region. It carries **no business logic** and **no `BR-*` rule**.

`[INFERRED]` Its business value is *information architecture*: a card tells the user "these fields belong together". It does not decide what goes in the card — the host feature does.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Card is presentational — it groups content, it enforces nothing. |
| `[INFERRED]` Section-level grouping convention | — | A card maps 1:1 to a "section" in a detail page (info section, settings section). The card *is* the visual section boundary. |

## Business constraints baked in
- `[CODE]` falcon-card.tsx:36-37,44-47 — **on the React/Vue (Shadow) path, a card with a `header` or `ariaLabel` becomes an ARIA `region` landmark.** ⚠️ **The Angular `<falcon-angular-card>` does NOT do this** — its `<div>` has no `role` and no `ariaLabel` input (FC-A11Y-1). So in the Angular app, a named card is NOT a screen-reader landmark today. Naming a card is a meaningful product decision on the Shadow path; on the Angular path it is currently cosmetic until FC-A11Y-1 lands.
- `[CODE]` falcon-card.tsx:14-15,49-62 — **default variant is `default`** (border + shadow). The card always reads as a *raised, separated* surface unless the host explicitly drops to `flat`. `flat` strips both border and shadow — `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:78 warns this looks indistinct on a white parent (no visual separation).
- `[CODE]` falcon-card.tsx:47,52-55 — the header is a **structural `<h3>`**, hard-coded to level 3. `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:62 — pages with a proper `h1→h2→h3` outline cannot override the level. A builder must accept the card's `<h3>` fits the document outline.
- `[CODE]` falcon-card.tsx — **the card is passive: no click, no selection, no `interactive` / `selected` state.** `[BRAIN-OUT]` API.md:28-30, OVERVIEW.md:23 explicitly correct the registry, which *wrongly* lists `interactive`/`selected`/`falcon-click` — **the live source has none of them.** A "selectable plan card" / "choose this option" tile pattern is NOT supported (`GAPS_AND_UPGRADES.md` P1).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[INFERRED]` Detail-page sections | organization-hierarchy info / settings panels | each card wraps one logical section of the record. |
| `[INFERRED]` KPI / stat tiles | dashboards | a small card per metric. |
| `[INFERRED]` Table container | any list page | `[BRAIN-OUT]` OVERVIEW.md:11 — wrapping a `<falcon-angular-data-table>` in a consistent bordered surface. |

`[CODE]` **Now broadly adopted** — the 2026-06-03 sweep finds 10 app files / 42 occurrences + 1 lib / 3 (wallet-balance-management, contact-groups detail/create/review/list-error-banner). The prior "one consumer / near-unadopted" is **stale**. The dominant pattern is `variant="outlined"` + content in the default body slot + an optional `rootClass` accent (e.g. error banner).

## Business gotchas
- `[CODE]` falcon-card.component.html:16-26 — **the prop-driven `<header>` AND the `<ng-content select="[slot=header]">` both render simultaneously** (Angular-template double-render — G-FOOTGUN-1, P1). If a consumer passes `[header]` *and* projects `slot="header"`, **both appear** (a duplicated section title — a real product defect). To use only a slot, leave `header` empty. (Corrects the prior framing as a Stencil-`<slot>` issue; for the Angular path it is the Angular template, not Stencil.)
- `[CODE]` falcon-card.tsx — there is **no `loading` / skeleton mode.** A card showing a fetching section must render its own skeleton; the card will not.
- `[INFERRED]` Do not use a card for a dialog, drawer or popup — those components own their own surface (`[BRAIN-OUT]` OVERVIEW.md:18). A card inside a dialog is a double surface.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B10) from `[CODE]` falcon-card.component.ts + .component.html + falcon-card.tsx. No `BR-*` rule binds this presentational primitive. Registry-vs-source contradiction (`interactive`/`selected`/`falcon-click` don't exist) ✅ VERIFIED. **Corrected:** `role="region"` is Shadow-path-only (Angular path lacks it — FC-A11Y-1); the double-header footgun is an Angular-template render; the component is now broadly adopted (10 app / 42 + 1 lib / 3, not "one consumer").
