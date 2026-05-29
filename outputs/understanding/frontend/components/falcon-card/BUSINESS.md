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
- `[CODE]` falcon-card.tsx:36-37,44-47 — **a card with a `header` or `ariaLabel` becomes an ARIA `region` landmark.** Business consequence: a *named* section is navigable by screen-reader users as a discrete landmark; an *anonymous* card (`flat` decorative box) is not. Naming a card is therefore a meaningful product decision, not cosmetic.
- `[CODE]` falcon-card.tsx:14-15,49-62 — **default variant is `default`** (border + shadow). The card always reads as a *raised, separated* surface unless the host explicitly drops to `flat`. `flat` strips both border and shadow — `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:78 warns this looks indistinct on a white parent (no visual separation).
- `[CODE]` falcon-card.tsx:47,52-55 — the header is a **structural `<h3>`**, hard-coded to level 3. `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:62 — pages with a proper `h1→h2→h3` outline cannot override the level. A builder must accept the card's `<h3>` fits the document outline.
- `[CODE]` falcon-card.tsx — **the card is passive: no click, no selection, no `interactive` / `selected` state.** `[BRAIN-OUT]` API.md:28-30, OVERVIEW.md:23 explicitly correct the registry, which *wrongly* lists `interactive`/`selected`/`falcon-click` — **the live source has none of them.** A "selectable plan card" / "choose this option" tile pattern is NOT supported (`GAPS_AND_UPGRADES.md` P1).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[INFERRED]` Detail-page sections | organization-hierarchy info / settings panels | each card wraps one logical section of the record. |
| `[INFERRED]` KPI / stat tiles | dashboards | a small card per metric. |
| `[INFERRED]` Table container | any list page | `[BRAIN-OUT]` OVERVIEW.md:11 — wrapping a `<falcon-angular-data-table>` in a consistent bordered surface. |

`[BRAIN-OUT]` OVERVIEW.md:46-47 + GAPS_AND_UPGRADES.md:111-115 — **one production consumer** (the Wave 7 sweep found a single `<falcon-angular-card>` use). The component is near-unadopted; most sections are still hand-rolled `<div class="card">`.

## Business gotchas
- `[CODE]` falcon-card.tsx:48-63 — **the prop-driven header AND `<slot name="header">` both render simultaneously.** `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:19-24 (P1 footgun) — if a consumer passes a `[header]` prop *and* projects `slot="header"` content, **both appear**. To use only a slot, leave `header` empty. A duplicated section title is a real product defect, not a styling glitch.
- `[CODE]` falcon-card.tsx — there is **no `loading` / skeleton mode.** A card showing a fetching section must render its own skeleton; the card will not.
- `[INFERRED]` Do not use a card for a dialog, drawer or popup — those components own their own surface (`[BRAIN-OUT]` OVERVIEW.md:18). A card inside a dialog is a double surface.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-card.tsx + falcon-card.component.ts + the 6 dossier files. No `BR-*` rule binds this presentational primitive. The registry-vs-source contradiction (`interactive`/`selected`/`falcon-click` do **not** exist) is ✅ VERIFIED against `[CODE]` falcon-card.tsx — documented here per the task rule, the old 6 files left unedited.
