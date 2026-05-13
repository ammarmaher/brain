# falcon-tabs — OVERVIEW

## Component purpose
Dual-mode tabbed control:
- **`mode="navigation"`** — horizontal/vertical tablist + sliding underline indicator + one panel per tab value (Stencil slots `panel-<value>`).
- **`mode="radio-cards"`** — radiogroup of icon/title/sub-description cards (no underline; per-card selected state).

Plus a **per-tab actions slot** exposed via `<ng-template falconTabActions="<tab-value>">` that the Angular wrapper physically lifts into the Stencil tablist row via a MutationObserver — so caller-projected templates sit as siblings of the tab buttons (same row, same border, vertically aligned).

## Business / UI use case
- Page-level tab navigation (Organization Hierarchy menu — Hierarchy / Settings / Apps / CommChannels tabs).
- Radio-card selectors for guided choices (account type picker, channel type chooser in the OTP send dialog).
- Anywhere you'd previously have reached for PrimeNG `<p-tabView>` or `<p-tabPanel>`.

## When to use it
- Mutually exclusive view switches with associated panels.
- When you need a sliding underline that animates between tabs (the JS-set transform is the one "escape hatch" inline style on a dedicated indicator span).
- When per-tab header actions are needed (filter toggles, view-mode flips) — pair with `falconTabActions`.

## When NOT to use it
- Routing-driven nested views — use Angular Router with a `routerLink` strip.
- Single-tab "scrollable section header" — over-engineering.
- Step-by-step wizards — use `falcon-angular-stepper` / `falcon-angular-wizard` (Agent 4 scope).

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred.** Used by the org-hierarchy pages on both admin + management consoles. Replaces `p-tabView`.

## Replaces
- PrimeNG `<p-tabView>` + `<p-tabPanel>` (gone in Wave PR-8).
- The legacy `.tabs-bar` / `.tpl-tabs` CSS pattern from admin/styles.css and admin/templates.css (per token-file spec source).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tabs/falcon-tabs.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tabs/falcon-tabs.component.html` |
| Per-tab actions directive | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tabs/falcon-tab-actions.directive.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tabs/falcon-tabs.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-tabs/falcon-tabs.types.ts` |
| Stencil Shadow utils | `libs/falcon-ui-core/src/components/falcon-tabs/falcon-tabs.utils.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tabs-tw/falcon-tabs-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/tabs.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-tabs>`
- Stencil Shadow: `<falcon-tabs>`
- Stencil Light: `<falcon-tabs-tw>`
- Per-tab actions: `<ng-template falconTabActions="<tab-value>">`

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html` (line 54) — main tab strip for the org-hierarchy page.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` — twin app.
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` — reference implementation of `falconTabActions` (Overview / Usage / Examples with per-tab pill toggles).
- `apps/host-shell/src/app/playground/playground.page.html` — full variant matrix.
- `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` — showcase registry.
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` — Live / Code toggle.

## Related components
- `falcon-tab-actions.directive` — companion directive (`<ng-template falconTabActions="value">`).
- `falcon-org-view-toggle` — placed in the tabs-bar row as a manual sibling (in admin's org-hierarchy menu — separate from the `falconTabActions` mechanism, see USAGE.md for why).
- `falcon-angular-radio` / `falcon-angular-radio-group` — radio-cards mode is a stylistic cousin (consider when picking).

## Ownership / responsibility
Owned by Falcon UI Core. The `falconTabActions` per-tab slot pattern is Falcon-novel — no other Falcon component uses MutationObserver to lift a sibling into a Shadow tablist. Consumers should not replicate this pattern manually.
