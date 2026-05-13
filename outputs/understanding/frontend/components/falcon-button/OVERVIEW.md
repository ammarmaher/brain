# falcon-button — OVERVIEW

## Component purpose
The flagship Falcon UI primitive — a token-driven `<button>` with five variants, three sizes, leading/trailing icon slots, loading spinner, full-width and icon-only modes. Renders through two parallel Stencil web components (Shadow + Light) plus an Angular wrapper that toggles between them via `useTailwind`.

## Business / UI use case
- Primary call-to-action on every form, dialog footer, drawer footer, page header strip.
- Secondary actions ("Cancel", "Back", ghost variants in admin/management settings strips).
- Icon-only utility triggers (edit, delete, kebab launchers when a `falcon-menu` is wired alongside).
- Toolbar / action-bar slot fills (next to `falcon-angular-tabs` via `falconTabActions`).

## When to use it
- Any interactive element that submits / cancels / triggers a flow.
- When a brand-aligned focus halo + spinner is required (`loading=true`).
- When you need consistent 34/38/44 px height across the platform.

## When NOT to use it
- For navigational links that change the URL — use `<a>` styled with tokens or `falcon-link` if it exists. `link` variant of this component is for in-content text actions (e.g. inline "Learn more"), not for routing.
- For pure icon affordances that should look like an `<i>` (no padding, no border) — use raw `<falcon-angular-icon>` inside a wrapper instead.
- For deeply customised buttons that need entirely bespoke geometry — extend tokens rather than overriding rendered classes.

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred.** Wave PR-8 + Wave 9.F backfill. Replaces every `p-button` from the Wave-1 PrimeNG era. The most-consumed UI primitive in the workspace — drawer footers, dialog footers, settings strips, wizard nav, toolbar actions all rely on it.

## Replaces
- PrimeNG `<p-button>` (deleted in Wave PR-8).
- Hand-rolled `<button class="btn ...">` patterns from the React V0.2 reference.

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.types.ts` |
| Stencil Shadow utils | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.utils.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-button-tw/falcon-button-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/button.tokens.css` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts` (referenced by `falcon-button-tw.tsx`) |
| Angular barrel index | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/index.ts` |

## Selectors / tags
- Angular: `<falcon-angular-button>`
- Stencil Shadow: `<falcon-button>`
- Stencil Light DOM: `<falcon-button-tw>`

## Known consumers (grep verified)
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/settings-tab/settings-tab.component.html` — header strip Edit / Cancel / Save buttons; `slot="icon-start"` pattern with `<i class="falcon-icon falcon-icon-pencil">`.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` — same layout, twin app.
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` — drawer footer Cancel (ghost) + Save (loading + disabled gating).
- `apps/host-shell/src/app/playground/playground.page.html` — full reference: every variant × size × state matrix, Shadow + Tailwind rows, full-width + icon-only.

## Related components
- `falcon-angular-icon` — leading / trailing slot content.
- `falcon-angular-popup` — composes 2 `<falcon-button-tw>` instances internally for the cancel + confirm footer pair.
- `falcon-angular-menu` — kebab-trigger button when wired via `slot="trigger"`.
- `falcon-angular-tabs` (via `falconTabActions`) — common holder for header action buttons.

## Ownership / responsibility
Owned by the Falcon UI Core team. Tokens are SSOT for paint; this wrapper is the only Angular-facing surface allowed for buttons in net-new code (Wave PR-8 lock-in).
