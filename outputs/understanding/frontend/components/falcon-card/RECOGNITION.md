# falcon-card — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-card>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-card.tsx:36-80 — a **rectangular surface container**:
- A box with rounded corners (radius scales `sm`=6px / `md`=8px / `lg`=14px), a light fill (`bg-falcon-neutral-0`), and — in the default variant — a 1px neutral border + a soft drop shadow.
- An optional **header strip** at the top: an `<h3>` title and an optional `<p>` subheader.
- A **body region** with consistent padding (12 / 16 / 24 px by size).
- An optional **footer strip** at the bottom, separated by a top border.
- Three variants: `default` (border + shadow), `flat` (no border, no shadow), `outlined` (heavier border, no shadow).

Distinguishing tell vs siblings: a card is a *static, non-modal, in-flow* surface that groups a section. A dialog/drawer/popup floats above the page and traps focus — those are not cards. An empty-state is *content inside* a card, not the card itself.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Card>` + `<CardHeader>` + `<CardContent>` + `<CardActions>` | direct 1:1 — MUI's header/content/actions map to Falcon's `slot="header"` / default slot / `slot="footer"`. MUI `<CardActionArea>` (clickable card) → Falcon **GAP** (no interactive mode). |
| PrimeNG | `<p-card>` | direct 1:1 — `[BRAIN-OUT]` OVERVIEW.md:29 — this component replaced `<p-card>` (Wave PR-8). |
| Ant Design | `<Card>` (`title`, `extra`, `bordered`, `hoverable`) | `title` → `header` prop; `extra` → header-slot content; `bordered` → `outlined` variant. Ant `hoverable` → Falcon **GAP**. |
| Bootstrap | `.card` + `.card-header` / `.card-body` / `.card-footer` | direct 1:1. |
| shadcn / Radix | `<Card>` + `<CardHeader>` / `<CardTitle>` / `<CardContent>` / `<CardFooter>` | direct 1:1 — shadcn's sub-components map to Falcon's slots. |
| plain HTML | `<div class="card">` / `<section>` | always replace — `[BRAIN-OUT]` OVERVIEW.md:28 — the card replaces hand-rolled `<div class="card">` from V0.2. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a bordered, padded section grouping content | `<falcon-angular-card>` | hand-rolled `<div>` |
| a section with a title strip + a "View details" footer button | `<falcon-angular-card>` with header + footer slots | — |
| a floating, focus-trapping modal | `<falcon-angular-dialog>` / `<falcon-angular-drawer>` | card |
| a "no data" placeholder *inside* a section | `<falcon-angular-empty-state>` (inside the card body) | card |
| a **clickable / selectable** tile ("choose this plan") | **GAP** — card has no `interactive`/`selected` mode; hand-roll or raise `GAPS_AND_UPGRADES.md` P1 | card |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[header]` / `[subheader]` / `[footer]` (plain-text strips), `variant` (`default|flat|outlined`), `size` (`sm|md|lg`), `[rootClass]` (extra class for token overrides).
2. **Slots** — for rich content beyond plain text, project: `slot="header"` (title + icon + action button in one row), the **default slot** (body), `slot="footer"`. **Leave the matching prop empty when you project a slot** — prop and slot both render otherwise (`GAPS_AND_UPGRADES.md` P1 footgun).
3. **No `ng-template` directives** — there are no `falconCardHeader`/`falconCardFooter` directives; rich content goes through the Stencil slots.
4. **Variants** — `variant` + `size` are the only axes; both fully token-driven.
5. **Token override** — restyle via `card.tokens.css` vars or `[rootClass]`; never hardcode.
6. **Upgrade** — `interactive`/`selected`/`loading`/`tone`/`headingLevel`/`bodyPadding` are all `GAPS_AND_UPGRADES.md` proposals — raise them; do not hand-roll a selectable card.
7. **Wrapper** — none needed; the card injects nothing.

## Anti-patterns
- Passing a `[header]` prop **and** projecting `slot="header"` content — both render (duplicate title). Pick one.
- Expecting a clickable / selectable card — the live source is fully passive (`API.md:28` — the registry's `interactive`/`selected`/`falcon-click` do **not** exist).
- Relying on the wrapper's `computed()` class helpers (`classes`, `bodyClasses`, …) — they are dead code; styling comes from the Stencil layer.
- Using `flat` on a white parent expecting visual separation — `flat` strips border *and* shadow; the card becomes invisible against white.
- Putting a card inside a dialog/drawer/popup — those already own a surface; a card inside is a double surface.
- Hand-rolling `<div class="card">` — adopt this component (it exists precisely to replace that V0.2 pattern).
