# falcon-empty-state — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-empty-state>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-empty-state.tsx:30-62 — a **centred vertical stack occupying empty space**:
- A large **icon** at the top (sized to the empty-state's `size`, not a normal inline glyph).
- An **`<h3>` title** below it ("No users found").
- An optional **`<p>` description** in muted text ("Try adjusting your filters").
- An optional **action region** at the bottom — typically one or two buttons.
- The whole thing is centred in the area that *would* hold the missing content (an empty table body, an empty page).
- Three sizes (`sm/md/lg`) scaling the icon, font and vertical rhythm.

Distinguishing tell vs siblings: an empty-state is a *centred icon-title-description-action stack filling a content void*. It is not a card (no bordered surface), not a dialog (does not float / trap focus), not a loader (no spinner / motion).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | no first-class component — hand-rolled `<Box>` with an icon + `<Typography>` + `<Button>` | Falcon promotes this pattern into one component. |
| PrimeNG | the `emptymessage` template on `<p-table>` (text only) | PrimeNG's empty-message is bare text; `<falcon-angular-empty-state>` is the richer icon+title+action version, projected via `<ng-template falconDataTableEmpty>`. |
| Ant Design | `<Empty>` (`image`, `description`, children for the action) | direct 1:1 — Ant `<Empty>`'s image/description/children map to `iconName`/`descriptionText`/`slot="action"`. |
| Bootstrap | no component — hand-rolled centred `<div>` | Falcon promotes it into a component. |
| shadcn / Radix | no first-class component — community "empty state" block (icon + heading + text + button) | Falcon's component matches that block shape. |
| plain HTML | a centred `<div>` with "No data" text | always replace with `<falcon-angular-empty-state>`. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a centred icon + "No data" message + a CTA, filling empty space | `<falcon-angular-empty-state>` | hand-rolled `<div>` |
| an empty table body with guidance | `<falcon-angular-empty-state>` via `<ng-template falconDataTableEmpty>` | bare `emptyMessage` string |
| a spinner / skeleton while data loads | the table `[loading]` skeleton / `<falcon-angular-loader-*>` | empty-state |
| an error placeholder ("Failed to load — Retry") | **GAP** — empty-state has no `error` variant (FES-04); raise it | empty-state |
| a bordered section grouping content | `<falcon-angular-card>` | empty-state |
| a decorated empty **card** (dashed border + glossy gradient + tinted disc + built-in CTA button + info chip), or any empty data-**table** | `<falcon-angular-empty-data>` (sibling — the **RICHER** card tier; auto-mounted by the data-table `[emptyData]` shorthand) | this component (the minimal tier) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[iconName]` (a Falcon-icon glyph, e.g. `users`, `search`, `inbox`), `[titleText]` (REQUIRED — the headline), `[descriptionText]` (supporting copy), `size` (`sm|md|lg`).
2. **Action slot** — project the CTA: `<falcon-angular-button slot="action">Add user</falcon-angular-button>`. The `slot="action"` attribute is mandatory on the projected element.
3. **No `ng-template` directives on the component itself** — the only projection point is the `action` slot. (To use it *inside a table*, that is the table's `<ng-template falconDataTableEmpty>` directive — a table feature, not an empty-state one.)
4. **Variants** — `size` is the only variant axis today; `[variant]` for error/success/info is a `GAPS_AND_UPGRADES.md` proposal (FES-04).
5. **Token override** — restyle via `empty-state.tokens.css`; never hardcode.
6. **Upgrade** — illustration slot (FES-02), `[actionLayout]` row/column (FES-03), `[variant]` (FES-04), `[ariaLabel]` on the wrapper (FES-05) are all proposed gaps — raise them.
7. **Wrapper** — to make an empty-state fully presentational (`ariaLabel=""`) drop to the Stencil `<falcon-empty-state>` tag — the Angular wrapper lacks `ariaLabel`.

## Anti-patterns
- Using an empty-state during a **loading** fetch — it falsely says "no data" before data arrives; use the loading skeleton.
- Using an empty-state as an **error** placeholder — no `error` variant exists (FES-04); a failed load needs a different treatment.
- Omitting `titleText` — the `<h3>` is not rendered and the placeholder has no announced name.
- Projecting an action button without the `slot="action"` attribute — it will not land in the action region, especially on the Light-DOM path.
- Expecting `<falcon-table>` core to show this automatically — it renders only a bare text empty cell (FES-01); project `<ng-template falconDataTableEmpty>` explicitly.
- Passing an `iconName` not in the Falcon icon font — renders an empty glyph (see `falcon-icon`). (The icon is an **icon-font** glyph, NOT an inline SVG — that is the `<falcon-empty-data>` sibling.)
- Reaching for this when the design clearly shows a **card** (border/gradient/disc/CTA button) — that is `<falcon-empty-data>`, the richer sibling; this minimal stack has no card surface.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B12 refresh) from `[CODE]` falcon-empty-state.tsx + .component.ts. Sibling routing table CORRECTED — `<falcon-empty-data>` is the RICHER card tier (prior dossier wrongly called it "lighter inline empty marker"). Cross-library map `[INFERRED]` from standard library APIs. Icon-font (not SVG) render confirmed against source.
