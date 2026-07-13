# falcon-status-badge — OVERVIEW

## Purpose

Specialized status pill — composed visual variant of `<falcon-tag>` (`[CODE]` falcon-status-badge.tsx:2 "Specialized status pill (composed variant of <falcon-tag>, architect §5.12.2)"). 9 user/service severities collapse into 4 visual buckets (success / warning / neutral / danger) plus a leading severity-tinted dot. Spec source: React V0.2 `.status-badge` (admin/styles.css:1194-1220, per `[CODE]` status-badge.tokens.css:5-6).

## Business / UI use case

User-row status (active / pending / suspended / locked / deleted) and service-row status (inactive / paid / expired / disabled). The canonical visual for workflow state on every list page. `[CODE]` Verified production use as the status-cell render inside `<ng-template falconDataTableCell field="status">` (contact-groups-list.component.html:143-148 in BOTH consoles).

## When to use it

- Any list cell rendering a user / account / service state.
- Inside `<ng-template falconDataTableCell="status">` projection.

## When NOT to use it

- Generic chip / count indicators — use `<falcon-badge>` (semantic-bucket variants) or `<falcon-tag>` (severity tag).
- Non-status badges (e.g. notification count) — use `<falcon-badge>`.

## Status

**ACTIVE / ADOPTED.** Stencil Shadow + Light + Angular wrapper `<falcon-angular-status-badge>` with dual-render-path. Public API preserved from Wave 9.F pre-backfill (`[CODE]` falcon-status-badge.component.ts:6 "Public API preserved from Wave 9.F pre-backfill — every legacy Input still exists"). Now genuinely adopted across both consoles (see Known consumers — the prior "no consumers found" claim is **stale**).

## Replaces

- Hand-rolled `bg-falcon-{color}-50 text-falcon-{color}-700` status chips.
- Status-purposed PrimeNG `<p-tag>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-status-badge/falcon-status-badge.component.ts` (80 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-status-badge/falcon-status-badge.component.html` (25 ln; pure tag-switcher) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-status-badge/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.tsx` (50 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.css` (110 ln; token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-status-badge-tw/falcon-status-badge-tw.tsx` (57 ln, `shadow: false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.types.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/status-badge-tailwind-classes.ts` (144 ln) |
| Token file | `libs/falcon-ui-tokens/src/components/status-badge.tokens.css` (91 ln; `:where()` scoped — gate-12 compliant) |
| Stencil readme | `libs/falcon-ui-core/src/components/falcon-status-badge/readme.md` (auto-gen) |
| Spec / e2e | **NONE** — no `.spec.ts` / `.e2e.ts` for any layer (gap). |
| React proxy | `libs/falcon-ui-react/src/components.ts:1573-1592` (`FalconStatusBadge` + `FalconStatusBadgeTw`) |
| Vue proxy | `libs/falcon-ui-vue/src/index.ts:2021-2037` (`FalconStatusBadge` + `FalconStatusBadgeTw`) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-status-badge` |
| Stencil Shadow tag | `<falcon-status-badge>` |
| Stencil Light tag | `<falcon-status-badge-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-status-badge>` across `apps/` = **16 files / 21 occurrences**, plus **4 files / 5 occurrences** under `libs/falcon/`. (The prior dossier's "No direct use found in apps/" is **stale** — the component is now broadly adopted.) Representative consumers:

- `apps/{admin,management}-console/src/app/features/contracts-cost-management/contracts-cost-management.component.html` + `components/contracts-view-contract/contracts-view-contract.component.{html,ts}` (contract status pills)
- `apps/{admin,management}-console/src/app/features/contact-groups/contact-groups-list/contact-groups-list.component.html` (status column cell — `[severity]="statusSeverity(row)" [label]="statusLabel(row)"`, line 144)
- `apps/{admin,management}-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.{html,ts}`
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/{client-comm-channels-step,client-applications-step}.component.html`
- `libs/falcon/src/shared-features/comm-mkt-view/comm-mkt-view.component.html` + `components/card/comm-mkt-card.component.ts`
- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html`
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (2)

See `USAGE.md` Consumer Sweep for the full enumerated list. (NOTE: the old `organization-hierarchy/` paths are gone — folder is now `org-hierarchy-page/`.)

## Related components

- `<falcon-badge>` — generic semantic badge (different surface contract)
- `<falcon-tag>` — chip / dismissible severity tag (generic 7-value palette, NOT status enums)
- `<falcon-card-status>` — a SEPARATE small status component (do not conflate with `<falcon-card>`)
- `<falcon-data-table>` — the typical consumer via `<ng-template falconDataTableCell="status">`

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owns the 9-severity → 4-visual-bucket mapping. `status-badge.tokens.css` is the SSOT for status colors. Token contract lives in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10 sweep). Source-file table re-confirmed on disk; consumer list refreshed to live paths (16 app files / 21 occurrences + 4 lib files / 5 occurrences — the prior "no consumers" claim corrected). Stencil tag `shadow:true`, `-tw` `shadow:false`, token file `:where()`-scoped all re-confirmed.
