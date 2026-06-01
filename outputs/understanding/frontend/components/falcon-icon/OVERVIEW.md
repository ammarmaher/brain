# falcon-icon — OVERVIEW

## Component purpose
Thin wrapper around the vendored Falcon icon font (`libs/falcon-theme/src/styles/falcon-icons.css`). Renders `<i class="falcon-icon falcon-icon-<name>">` with standardised size tokens + a11y posture (decorative `aria-hidden` by default; meaningful via `decorative=false` + `label`). Cross-framework compatible (works in Angular / React / Vue / plain JS).

## Business / UI use case
- Standard icon rendering across all Falcon UIs.
- Inside buttons, menus, accordions, badges, status indicators.
- Form-field decorations (info-circle next to label).
- Empty-state illustrations (when paired with `<falcon-angular-empty-state>`).

## When to use it
- Whenever you need a Falcon-icon-font glyph.
- For consistent sizing (xs/sm/md/lg/xl) tied to icon tokens.
- For correct a11y posture (decorative-by-default).

## When NOT to use it
- For SVG icons that aren't in the Falcon icon font: for a **platform-owned, exact** glyph (e.g. the SAR currency symbol) use the shared **`<falcon-svg-icon name="…">`** registry (`[CODE]` libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.component.ts + registry `svg-icon.registry.ts`; exported from `@falcon` as `SvgIconComponent` + `SVG_ICON_NAMES`). For a one-off third-party/brand mark use raw `<svg>` or `<iconify-icon>` (Iconify is also installed as a side-effect import — verify globally).
- For images / avatars — use `<falcon-angular-avatar>`.
- For brand logos — use raw `<img src>` or dedicated brand asset.

## Active / preferred / deprecated / legacy status
**ACTIVE.** Wave 9.E. Architect §5.12.1 foundation. The vendored icon font replaces all `pi pi-*` PrimeIcons (Wave PR-8). 122 icons migrated per project memory.

## Replaces
- PrimeIcons `<i class="pi pi-X">` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-icon/falcon-icon.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-icon/falcon-icon.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-icon-tw/falcon-icon-tw.tsx` |
| Icon font CSS | `libs/falcon-theme/src/styles/falcon-icons.css` |
| Font asset | `libs/falcon-theme/src/assets/fonts/` |
| Token file | `libs/falcon-ui-tokens/src/components/icon.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-icon>`
- Stencil Shadow: `<falcon-icon>`
- Stencil Light: `<falcon-icon-tw>`

## Known consumers
- `apps/host-shell/src/app/layout/layout.component.html` — direct use.
- Plus widespread use of the icon FONT CLASS (`<i class="falcon-icon falcon-icon-X">`) across many components and feature templates. The `<falcon-angular-icon>` wrapper is the **preferred** form going forward, but many existing files use the bare `<i>` pattern.

## Related components
- `falcon-angular-button` — should use `slot="icon-start"` with `<falcon-angular-icon>` (currently most consumers use `<i class="falcon-icon ...">` directly).
- `falcon-angular-empty-state` — composes icon for the empty illustration.
- `iconify-icon` — secondary side-effect import for non-Falcon icons (verified in some showcase components like `showcase-tabs-actions-demo.component.ts`).
- `falcon-svg-icon` — the shared multi-path **SVG registry** (`libs/falcon/src/shared-ui/lib/ui/svg-icon/`, `SVG_ICON_REGISTRY` / `SVG_ICON_NAMES`, exported from `@falcon` as `SvgIconComponent`). The blessed home for platform-owned exact SVG glyphs the icon font cannot carry (e.g. `currency-sar`, already shared by wallet / applications-table / Add-Client / comm-mkt-view). Prefer this over re-drawing the SVG inline per feature.

## Ownership / responsibility
Owned by Falcon UI Core. The vendored font is curated — adding new icons requires updating the font asset.
