# falcon-card — OVERVIEW

## Component purpose

Surface container with optional `header` / `subheader` / `footer` text props plus slot projection for rich header / body / footer content. Three variants (`default` = border + shadow, `flat` = borderless, `outlined` = border only) × three sizes (`sm` / `md` / `lg`).

> **CRITICAL (corrected 2026-06-03):** the Angular wrapper `<falcon-angular-card>` does **NOT** delegate to the Stencil `<falcon-card-tw>` element. After "Defect A FIX (2026-05-28)" (`[CODE]` falcon-card.component.ts:1-11) it renders the Tailwind/light-DOM card chrome **directly in Angular** — plain `<div>`/`<header>`/`<footer>` + native `<ng-content>`. The `computed()` class helpers (`classes`/`bodyClasses`/`headerClasses`/`footerClasses`) are the **LIVE render path** (bound in the template), NOT dead code. The Stencil `<falcon-card>` / `<falcon-card-tw>` components exist in the lib **only for the React / Vue output targets**. The `useTailwind` `@Input` is **preserved for API compat but is a NO-OP** (always Angular chrome). See API.md / INTEGRATION_VALIDATION.md — this corrects the prior dossier, which wrongly described the wrapper as rendering through `<falcon-card-tw>`.

## Business / UI use case

- Section containers ("Account details", "Group details", "Permissions") with optional title strip + footer.
- Error banners (`variant="outlined"` + `rootClass="border-falcon-error-200 bg-falcon-error-50"`).
- Wrapping content (a detail grid, a contacts table) in a consistent bordered surface.
- `[CODE]` Verified production use: contact-group-detail "Group details" + "Contact Group" cards (contact-group-detail.component.html:96/246), error banners (contact-groups-list.component.html:49; contact-group-detail.component.html:40), wallet-balance-management surfaces.

## When to use it

- When a section needs a bordered surface with consistent padding + radius.
- When you want a token-driven, dark-mode-consistent surface for content.
- For an inline error/info banner (`outlined` + `rootClass` accent).

## When NOT to use it

- For dialogs / drawers / popups — those components own their own surface.
- For full-bleed page hero strips — too constrained.
- For interactive / selectable tiles — there is **no `selected` / `interactive` / click state** (see GAPS_AND_UPGRADES).

## Active / preferred / deprecated / legacy status

**ACTIVE / ADOPTED — Wave 9.F backfill + Defect A FIX (2026-05-28).** Broadly used now (10 app files / 42 occurrences + 1 lib / 3 — the prior "no matches in apps/" is **stale**). NOTE: the registry historically listed `interactive`/`selected`/`padding`/`falcon-click` — the **live source has none of these** (`[CODE]` falcon-card.component.ts has only `header`/`subheader`/`footer`/`variant`/`size`/`rootClass`/`useTailwind`; the Stencil source adds `ariaLabel`). The registry needs updating.

## Replaces

- Hand-rolled `<div class="card">` patterns from V0.2.
- PrimeNG `<p-card>` (Wave PR-8).

## Source file paths

| Artifact | Path | Role |
|---|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.ts` (104 ln) | **LIVE render** (pure-Angular chrome) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.html` (38 ln) | **LIVE** `<div>` + `<ng-content>` chrome |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/index.ts` | |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-card/falcon-card.tsx` (82 ln, `shadow: true`) | **React/Vue only** (Angular never instantiates) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-card/falcon-card.css` (78 ln; token-only) | React/Vue (Shadow) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-card-tw/falcon-card-tw.tsx` (83 ln, `scoped: true`) | **React/Vue only** |
| Types | `libs/falcon-ui-core/src/components/falcon-card/falcon-card.types.ts` | |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/card-tailwind-classes.ts` (62 ln) | Used by `-tw` (React/Vue) + mirrored inline by the Angular wrapper |
| Token file | `libs/falcon-ui-tokens/src/components/card.tokens.css` (66 ln; `:where()` scoped) | Consumed by the **Shadow path only** (React/Vue) |
| Stencil readme | `libs/falcon-ui-core/src/components/falcon-card/readme.md` (auto-gen) | |
| Spec / e2e | **NONE** — no `.spec.ts` for any layer (gap). | |
| React proxy | `libs/falcon-ui-react/src/components.ts:299-327` (`FalconCard` + `FalconCardTw`) | |
| Vue proxy | `libs/falcon-ui-vue/src/index.ts:216-239` (`FalconCard` + `FalconCardTw`) | |

## Selectors / tags

- Angular: `<falcon-angular-card>` (renders pure-Angular `<div>` chrome)
- Stencil Shadow: `<falcon-card>` (React/Vue only)
- Stencil Light: `<falcon-card-tw>` (React/Vue only)

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-card>` across `apps/` = **10 files / 42 occurrences**, plus **1 file / 3 occurrences** under `libs/falcon/`. (The prior "no matches in apps/" is **stale**.) Heaviest users:

- `apps/admin-console/.../wallet-balance-management/wallet-balance-management.component.html` (9)
- `apps/management-console/.../contact-groups/contact-group-detail/contact-group-detail.component.html` (6 — Group-details + Contact-group cards + error banner)
- `apps/management-console/.../contact-groups/create-contact-group/create-contact-group.component.html` (6) + `steps/review-create-step.component.html` (6) + `steps/preview-configure-step.component.html` (2)
- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` (2 each — error banner)
- `apps/management-console/.../wallet-balance-management/wallet-balance-management.component.html` (2)
- `apps/admin-console/.../contracts-cost-management/components/contracts-view-contract/contracts-view-contract.component.ts` (1)
- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` (3)

See `USAGE.md` Consumer Sweep for the full list. **NOTE: no raw `<falcon-card>` / `<falcon-card-tw>` Stencil-tag usage exists in `apps/`** — all consumption is via the Angular wrapper.

## Related components

- `<falcon-angular-button>` — common in footer content for "View details" / "Edit".
- `<falcon-angular-status-badge>` / `<falcon-angular-tag>` — header-right adornments (manually positioned in slot content).
- `<falcon-angular-empty-state>` — alternative when the card has no data.
- `<falcon-card-status>` — a **separate** small status-card Stencil component (do NOT conflate).

## Ownership / responsibility

`libs/falcon-ui-core`. The Angular wrapper owns the live light-DOM chrome; the Stencil pair backs React/Vue. Token contract (`card.tokens.css`) lives in `libs/falcon-ui-tokens` and is consumed by the Shadow path only.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10 sweep). **Major correction:** the Angular wrapper renders pure-Angular chrome (NOT `<falcon-card-tw>`); `computed()` helpers are LIVE; `useTailwind` is a no-op; Stencil pair is React/Vue-only (`[CODE]` falcon-card.component.ts:1-11 + .component.html:1-14). Consumer list refreshed (10 app files / 42 + 1 lib / 3 — corrects "no matches"). No raw Stencil-tag usage in apps.
