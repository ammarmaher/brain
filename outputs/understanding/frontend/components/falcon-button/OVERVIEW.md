# falcon-button — OVERVIEW

## Component purpose
The flagship Falcon UI primitive — a token-driven `<button>` with **ten variants**, three sizes, leading/trailing icon slots, a loading spinner, full-width and icon-only modes. Renders through two parallel Stencil web components (Shadow `<falcon-button>` + Light `<falcon-button-tw>`) plus an Angular wrapper `<falcon-angular-button>` that toggles between them via `useTailwind` (default `true` → Light DOM). `[CODE]` `buildRootClasses()` (falcon-button.utils.ts:14) is the single source-of-truth class-shape shared by both render paths.

## Business / UI use case
- Primary call-to-action on every form, dialog footer, drawer footer, page header strip.
- Secondary actions ("Cancel", "Back", ghost variants in admin/management settings strips).
- Icon-only utility triggers (edit, delete, kebab launchers when a `falcon-menu` is wired alongside).
- Toolbar / action-bar slot fills (next to `falcon-angular-tabs`).
- Templates-page decision cards use the Wave 9.F variant family (`primary-dark`, `outline-primary-dark`, `outline-danger`, `outline`) for Approve/Reject toggles + "Switch perspective" / "+ Create Template" CTAs (`[CODE]` falcon-button.types.ts:10-17 inline doc).

## When to use it
- Any interactive element that submits / cancels / triggers a flow.
- When a brand-aligned focus halo + spinner is required (`loading=true`).
- When you need consistent 34/38/44 px height across the platform.

## When NOT to use it
- For navigational links that change the URL — use a routed `<a>` styled with tokens. The `link` variant is for in-content text actions (e.g. inline "Information"), NOT routing.
- For pure icon affordances that should look like a bare `<i>` (no padding, no border) — use raw `<falcon-angular-icon>` inside a wrapper instead.
- For deeply customised buttons that need entirely bespoke geometry — extend tokens rather than overriding rendered classes.

## Status
**ACTIVE / PREFERRED / FLAGSHIP REFERENCE.** Wave PR-8 + Wave 9.F + Wave 13b + Wave 19 polish. Replaces every `p-button` from the Wave-1 PrimeNG era. The **single most-consumed UI primitive in the workspace** — 182 occurrences across 55 app files + 10 in `libs/falcon` (grep verified 2026-06-03). Mandatory for all net-new buttons (Wave PR-8 lock-in).

## Replaces
- PrimeNG `<p-button>` (deleted in Wave PR-8).
- Hand-rolled `<button class="btn ...">` patterns from the React V0.2 reference (`[CODE]` button.tokens.css:11-17 spec source `admin/styles.css` `.btn` family).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.ts` (75 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.html` (45 ln — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.css` (26 ln — host display + full-width flip only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.tsx` (160 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.css` (299 ln — `@apply` structure + `var(--falcon-button-*)` only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-button-tw/falcon-button-tw.tsx` (189 ln, `shadow: false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-button/falcon-button.utils.ts` (`buildRootClasses` + `isIconOnly`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts` (253 ln — 4 builders; cross-framework SSOT consumed by `-tw`) |
| Component token file | `libs/falcon-ui-tokens/src/components/button.tokens.css` (278 ln; 14 categories) |
| Stencil unit spec | _None on disk (verified 2026-06-03)_ — GAP G6. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-button` |
| Stencil Shadow tag | `<falcon-button>` |
| Stencil Light tag | `<falcon-button-tw>` |

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-button[\s>]` across `apps/` = **182 occurrences / 55 files**, plus **10 occurrences / 3 files** under `libs/falcon`. Heaviest users: Templates-page wizard + decision cards (BOTH consoles), org-hierarchy page menus / node-drawer / node-header / settings-tab, new-wallet-balance feature cards/drawers, auth flows (get-started, forgot-password, change-password), and the showcase library-section. Representative files:

- `apps/{admin,management}-console/.../templates-page/components/templates-details/templates-details.component.html` (8 each) — decision cards (Approve/Reject Wave 9.F variants).
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html` (9 each).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html` (11-12) + `.../falcon-org-node-drawer.component.html` (5).
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-*` (settings-card 4, allocation-table 2, balance-transfer-drawer 3, wb-client-view 3).
- `apps/host-shell/.../auth/{get-started,forgot-password-flow,change-password}.component.html` (1 each; stale selector refs also linger in their `.scss` — see USAGE Consumer Sweep).
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (7); `libs/falcon/src/shared-features/comm-mkt-view/.../comm-mkt-card.component.ts` (2); `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.ts` (1).

See `USAGE.md` Consumer Sweep for the enumerated list. (NOTE: the prior dossier's `organization-hierarchy/` + `host-shell playground.page.html` paths are GONE — folder renamed to `org-hierarchy-page/`; the playground route was removed and replaced by the `falcon-ui-showcase` library-section.)

## Related components
- `<falcon-angular-icon>` — leading / trailing slot content (`slot="icon-start"` / `slot="icon-end"`).
- `<falcon-angular-popup>` / `<falcon-alert-dialog>` / `<falcon-confirm-dialog>` — dialog footers compose button-shaped affordances (some still raw `<button>` — see those dossiers' Falcon-component-over-native findings).
- `<falcon-angular-menu>` — kebab-trigger button when wired via `slot="trigger"`.
- `<falcon-angular-tabs>` — common holder for header action buttons.

## Ownership / responsibility
`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Tokens are the SSOT for paint and live in `libs/falcon-ui-tokens`; this wrapper is the only Angular-facing surface allowed for buttons in net-new code (Wave PR-8 lock-in).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 sweep). All source layers re-read on disk; variant count corrected 5 → **10** (`[CODE]` falcon-button.types.ts:3-17); consumer list refreshed to live `org-hierarchy-page/` + new-wallet-balance + Templates paths (182 app occurrences / 55 files + 10 in `libs/falcon`); stale `playground.page.html` reference removed; spec-absence (G6) recorded.
