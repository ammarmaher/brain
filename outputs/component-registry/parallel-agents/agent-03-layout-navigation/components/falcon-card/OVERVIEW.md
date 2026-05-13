# falcon-card — OVERVIEW

## Component purpose
Surface container with optional `header` / `subheader` / `footer` text props and three slot pairs: stencil `slot="header"`, default body slot, `slot="footer"`. Three variants (`default` with shadow + border, `flat` borderless, `outlined` border only) × three sizes (`sm` / `md` / `lg`).

## Business / UI use case
- Section containers ("Account details", "Permissions", "Activity") with optional title strip + footer.
- KPI / stat tiles.
- Wrapping `falcon-angular-data-table` or other content in a consistent bordered surface.
- Composing dashboard widgets.

## When to use it
- When a section needs a bordered surface with consistent padding + radius.
- When you want the same component to support both text-only headers and full content slots (badge / icon / action button next to the title).
- When you want token-driven dark-mode and density consistency.

## When NOT to use it
- For dialogs / drawers / popups — use those components directly (they have their own surface).
- For full-bleed page hero strips — too constrained.
- For interactive selectable tiles (no `selected` / `interactive` state — see GAPS_AND_UPGRADES).

## Active / preferred / deprecated / legacy status
**ACTIVE — Wave 9.F backfill.** Note the registry currently lists `variant`, `padding`, `interactive`, `selected`, `falcon-click` — the **actual Stencil source has none of these** (only `variant: 'default' | 'flat' | 'outlined'`, `size: sm/md/lg`, `header`, `subheader`, `footer`, `rootClass`, `ariaLabel`). The registry needs updating.

## Replaces
- Hand-rolled `<div class="card">` patterns from V0.2.
- PrimeNG `<p-card>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-card/falcon-card.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-card/falcon-card.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-card-tw/falcon-card-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/card.tokens.css` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/card-tailwind-classes.ts` |

## Selectors / tags
- Angular: `<falcon-angular-card>`
- Stencil Shadow: `<falcon-card>`
- Stencil Light: `<falcon-card-tw>`

## Known consumers
Grep result for `falcon-angular-card` returned no matches in `apps/` — the wrapper is exported but not yet adopted in production templates. Likely used inside showcase/playground; verify with Agent 6 (architecture). This makes it an under-leveraged primitive.

## Related components
- `falcon-angular-button` — common in `slot="footer"` for "View details" / "Edit".
- `falcon-angular-status-badge` / `falcon-angular-tag` — header-right adornments (manually positioned in slot content).
- `falcon-angular-empty-state` — alternative when the card has no data.

## Ownership / responsibility
Owned by Falcon UI Core. Should grow `interactive` / `selected` / `clickable` props before broader adoption (see GAPS).
