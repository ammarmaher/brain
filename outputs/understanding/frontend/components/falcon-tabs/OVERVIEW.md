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
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tabs-tw/falcon-tabs-tw.tsx` (385 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/tabs-tailwind-classes.ts` (consumed only by the `-tw` twin) |
| Token file | `libs/falcon-ui-tokens/src/components/tabs.tokens.css` (243 ln; `:where()`-scoped, gate-12 compliant) |
| Spec/e2e | **None** — no `*tabs*.spec.ts` / `.e2e.ts` on any layer (`[CODE]` listing 2026-06-03). |

## Selectors / tags
- Angular: `<falcon-angular-tabs>`
- Stencil Shadow: `<falcon-tabs>`
- Stencil Light: `<falcon-tabs-tw>` (default — `useTailwind=true`)
- Per-tab actions: `<ng-template falconTabActions="<tab-value>">`

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-tabs` across `apps/` = **12 files**, plus **1** under `libs/falcon/`. Heaviest real-feature users:
- `apps/{admin,management}-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — main tab strip for the org-hierarchy page (BOTH consoles; pairs with `falconTabActions` for the tree/chart view toggle).
- `apps/{admin,management}-console/src/app/features/templates-page/components/templates-list.component.html` — templates list tab strip.
- `apps/admin-console/.../contracts-cost-management/components/contracts-{view,edit}-contract.component.{ts,html}` + `apps/management-console/.../contracts-view-contract.component.html` — contract view/edit tabs.
- `apps/management-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` — contact-groups list tabs.
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` — shared user-details tab strip (uses `falconTabActions`).
- Showcase (host-shell): `falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` (reference impl of `falconTabActions`), `showcase-code-panel.component.ts` (Live/Code toggle), `showcase-data/registry.ts` (registry entry).

See `USAGE.md` Consumer Sweep for the full enumerated list. (NOTE: the old `organization-hierarchy/` + `host-shell playground` paths in prior dossier versions are gone — folder is now `org-hierarchy-page/`; playground route removed; user-details moved to `libs/falcon`.)

## Related components
- `falcon-tab-actions.directive` — companion directive (`<ng-template falconTabActions="value">`).
- `falcon-org-view-toggle` — placed in the tabs-bar row as a manual sibling (in admin's org-hierarchy menu — separate from the `falconTabActions` mechanism, see USAGE.md for why).
- `falcon-angular-radio` / `falcon-angular-radio-group` — radio-cards mode is a stylistic cousin (consider when picking).

## Ownership / responsibility
Owned by Falcon UI Core. The `falconTabActions` per-tab slot pattern is Falcon-novel — no other Falcon component uses an `effect()` + MutationObserver to lift a sibling into the Stencil tablist row. Consumers should not replicate this pattern manually.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13 sweep). Source-file table re-confirmed; `-tw` Light twin verified (385 ln, registered in `define-falcon-tw-component.ts:23`). Consumer list refreshed to live `org-hierarchy-page/` + templates + contracts + contact-groups paths (12 app files + 1 in `libs/falcon`). Stale `organization-hierarchy/` admin path + `playground.page.html` retired.
