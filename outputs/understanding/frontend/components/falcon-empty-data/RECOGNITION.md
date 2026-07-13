# falcon-empty-data — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-empty-data>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-empty-data.tsx:254-340 — a **centred, decorated card filling an empty content area**:
- A **dashed-border card** with a faint glossy teal gradient background (square corners by default — `--falcon-empty-data-card-radius: 0px`).
- A **circular tinted disc** (64×64, teal-50 bg) containing a line-art **glyph** (one of 8: users / inbox / search / folder / doc / bell / box / star).
- A **title** (`<div>`, ~15px, semibold, near-black) and a muted **body** line below it.
- Optionally an **"Add"-style CTA button** (teal filled / white dashed / ghost) with a leading `+` icon.
- Optionally a **rounded info-chip pill** with a leading info-circle icon.
- The whole thing sits centred in the void (an empty table body or a page hero block).

Distinguishing tell vs siblings: empty-data is the **card-with-disc-and-CTA** empty visual — it has a bordered/gradient card surface, a circular icon disc, and a built-in action button. If the design is a *bare* centred icon + heading + text with no card surface, that is `<falcon-empty-state>`. If it's a spinner/skeleton, that's the loader. If it floats and traps focus, it's a dialog.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | no first-class component — hand-rolled `<Paper variant="outlined">` with an icon disc + `<Typography>` + `<Button>` | Falcon promotes this card pattern into one component with a config-driven default. |
| PrimeNG | `<p-card>` composed with content, or the `emptymessage` template (text-only) | PrimeNG's empty-message is bare text; empty-data is the richer card auto-mounted by the Falcon data-table. |
| Ant Design | `<Empty>` (image + description + children action) wrapped in a `<Card>` | Ant `<Empty>` ≈ the icon+title+body; wrap it in a card to match empty-data's chrome. |
| Bootstrap | a hand-rolled `.card` with centred content + a `.btn` | upgrade target — replace with the component. |
| shadcn / Radix | community "empty state" card block (icon disc + heading + text + button) | direct shape match — shadcn hand-composes it; Falcon packages it. |
| plain HTML | a centred `<div>` "No data" + a button | always replace with `<falcon-angular-empty-data>` (or the data-table `[emptyData]` shorthand). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a decorated empty **card** with a disc icon + title + body + an "Add" CTA, filling a table or page | `<falcon-angular-empty-data>` | hand-rolled card |
| an empty **table body** with guidance | `<falcon-angular-data-table [emptyData]="config">` (auto-mounts empty-data) | bare `emptyMessage` string |
| a **minimal** centred icon + heading + text with a *projected* action and NO card surface | `<falcon-angular-empty-state>` (lighter sibling — has a `slot="action"`, uses `<h3>`) | empty-data |
| a custom action (router link / icon-only / two buttons) in the empty state | `<falcon-angular-empty-state>` (`slot="action"`) OR a projected `*falconDataTableEmpty` template | empty-data (no action slot — G2) |
| a spinner / skeleton while data loads | the table `[loading]` skeleton / `<falcon-angular-loader-*>` | empty-data |
| an error placeholder ("Failed to load — Retry") | **GAP G5** — empty-data has no error variant; use a dedicated error treatment | empty-data |
| an arbitrary icon-font glyph (not one of the 8 SVG keys) | `<falcon-angular-empty-state>` (icon-font) | empty-data (closed 8-key set — G9) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[titleText]`, `[body]`, `[iconKey]` (one of the 8), `[showAction]` + `[actionLabel]`/`[actionSize]`/`[actionBorder]`, `[showInfo]` + `[infoText]`, `[mode]` (`table`/`page`), `[containerFit]` (`fill`/`mini`/`fit`), card toggles (`[cardBackground]`/`[glossyGradient]`/`[iconBackground]`/`[coloredIcon]`/`[iconOpacityOn]`), `[opacity]`, `[iconSize]`, `[padX/padY/marginX/marginY]`, `[context]`.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — **NONE.** The CTA + info chip render from props internally; you cannot project content (GAP G2). If you need a projected action, use `<falcon-empty-state>` or a `*falconDataTableEmpty` template.
4. **Variants** — `mode` × `containerFit` × `actionSize` × `actionBorder`. Pick `mode='table'` inside grids, `mode='page'` for heroes. There is no `error`/`success`/`info` tone (GAP G5).
5. **Token override** — per-instance host class mutating `--falcon-empty-data-*` (radius, glyph colors, button bg). Example: round the card with `--falcon-empty-data-card-radius: 12px`. Never hardcode hex/px.
6. **Upgrade** — need a custom CTA? → GAP G2 (action slot). Need an error look? → GAP G5. Need a custom glyph? → GAP G9. Raise them; don't hand-roll a sibling element.
7. **Wrapper / fallback** — for table empties, prefer the data-table `[emptyData]` shorthand over rendering the wrapper yourself; let the table own the mount/teardown.

## Anti-patterns
- Using empty-data during a **loading** fetch — it falsely says "no data" before data arrives; use the loading skeleton.
- Using empty-data as an **error** placeholder — `feedbackLevel='destructive'` only re-roles for a11y; there is no error visual (G5).
- Setting both `[emptyData]` AND a `*falconDataTableEmpty` template on the data-table — the template silently wins (`[CODE]` falcon-data-table.component.ts:1020).
- Setting `showInfo=true` without `infoText` — the chip renders nothing (needs both).
- Trying to project a custom button — there is no action slot (G2); use `<falcon-empty-state>`.
- Normalising the wrapper's mixed `[prop]`/`[attr.*]` bindings — breaks Stencil boolean defaults.
- Expecting an arbitrary icon — only 8 SVG keys exist (G9); use `<falcon-empty-state>` for icon-font glyphs.
- Hardcoding "No data found" per page — set the default in `FalconConfigurationService`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B12, NEW) from `[CODE]` falcon-empty-data.tsx + .component.ts + the data-table integration. Sibling routing table cross-checked against the reconcile analysis in GAPS_AND_UPGRADES + the live `<falcon-empty-state>` source. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
