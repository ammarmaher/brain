---
type: patterns-index
generatedAt: 2026-05-16T03:43:17.4155078+03:00
patternCount: 17
---

# 🧩 Patterns Index — refactor atlas

> 16 reusable refactor patterns surfaced by Agent C during the overnight deep-dive. Each pattern is a one-time refactor template that eliminates a class of rule violations across the codebase.

## All patterns (sorted by priority)

| # | Pattern | Reach | Effort | Priority | Rules |
|---|---|---|---|---|---|
| [PATTERN-12-host-shell-auth-scss-rebuild](PATTERN-12-host-shell-auth-scss-rebuild.md) | Auth feature SCSS cluster â†’ pure Tailwind templates (sweep) | 5 SCSS files (change-password, enter-otp, forgot-password-flow, get-started, login-layout) + their templates | ~3 | high | R-FE-001, R-FE-002, R-FE-004 |
| [PATTERN-04-scss-file-to-tailwind](PATTERN-04-scss-file-to-tailwind.md) | Component .scss file â†’ Tailwind utilities on the template | 13 SCSS files (10 in apps, 3 in libs/falcon/shared-ui), each referenced by a styleUrls in a `.ts` | ~5 | high | R-FE-001, R-FE-002 |
| [PATTERN-06-hex-color-to-token](PATTERN-06-hex-color-to-token.md) | Hardcoded hex colour â†’ token-backed Tailwind class | ~25 occurrences in templates + scss files outside the token catalogue | ~1.5 | high | R-FE-004, R-NOOR-005 |
| [PATTERN-03-inline-style-to-tailwind](PATTERN-03-inline-style-to-tailwind.md) | Inline style="â€¦" â†’ Tailwind utilities + tokens | 22 occurrences across 4 files (otp-dialog 11, falcon-table-edit-row 9, applications-table 1, org-hierarchy-page-menu 1) | ~2.5 | high | R-FE-003, R-FE-004 |
| [PATTERN-02-raw-button-to-falcon-button](PATTERN-02-raw-button-to-falcon-button.md) | Raw <button> â†’ <falcon-angular-button> | 87 occurrences across 18 files (most density in playground; ~30 in production code) | ~5 | high | R-FE-005, R-FE-006, R-FE-004, R-NOOR-006 |
| [PATTERN-01-raw-input-to-falcon-input](PATTERN-01-raw-input-to-falcon-input.md) | Raw <input> â†’ <falcon-angular-input> | 13 occurrences across 7 files | ~1.5 | high | R-FE-005, R-FE-006 |
| [PATTERN-11-falcon-icon-class-to-icon-component](PATTERN-11-falcon-icon-class-to-icon-component.md) | <i class="falcon-icon falcon-icon-xxx"> â†’ <falcon-angular-icon name="xxx"> | 38 occurrences across 11 files | ~1.5 | medium | R-FE-005, R-FE-006 |
| [PATTERN-05-arbitrary-px-class-to-token](PATTERN-05-arbitrary-px-class-to-token.md) | Arbitrary Tailwind values (w-[Npx] / text-[Npx] / gap-[Npx]) â†’ Token-backed utility | ~98 occurrences across 23 files (17 with sizing arbitraries + 81 occurrences of text/p/m/gap arbitraries) | ~5 | medium | R-FE-004, R-FE-001 |
| [PATTERN-16-aria-label-to-i18n-key](PATTERN-16-aria-label-to-i18n-key.md) | Hardcoded English aria-label="â€¦" â†’ `[attr.aria-label]="'key' | translate"` | 13 hardcoded aria-labels across 8 files | ~0.5 | medium | R-NOOR-007 |
| [PATTERN-13-host-shell-layout-scss-rebuild](PATTERN-13-host-shell-layout-scss-rebuild.md) | Host-shell layout/topbar/sidebar SCSS â†’ Tailwind (with extra care) | 4 SCSS files in host-shell layout cluster | ~3 | medium | R-FE-001, R-FE-002 |
| [PATTERN-08-feature-services-folder](PATTERN-08-feature-services-folder.md) | Loose *.service.ts files â†’ consolidated services/services.ts | 16 loose `*.service.ts` files across host-shell + admin-console features | ~2 | medium | R-FE-009 |
| [PATTERN-10-close-button-replaced-by-closable](PATTERN-10-close-button-replaced-by-closable.md) | Manual close <button> + aria-label â†’ `[closable]` input on Falcon dialog/drawer | ~6 manual close buttons across drawer/dialog templates | ~0.5 | medium | R-FE-005, R-FE-006 |
| [PATTERN-07-physical-margin-padding-to-logical](PATTERN-07-physical-margin-padding-to-logical.md) | Physical ml-*/mr-*/pl-*/pr-* â†’ Logical ms-*/me-*/ps-*/pe-* (RTL safety) | 8 occurrences across 7 files (in production code only â€” admin-console + host-shell) | ~0.5 | medium | R-NOOR-007 |
| [PATTERN-17-ng-deep-scss-purge](PATTERN-17-ng-deep-scss-purge.md) | `:host` / `::ng-deep` in SCSS â†’ removed (collateral of PATTERN-04) | 25 occurrences across 14 files (mostly inside the SCSS files already targeted by PATTERN-04) | 0 (already covered) | low | R-FE-002, R-NOOR-008 |
| [PATTERN-14-tab-template-flex-to-grid](PATTERN-14-tab-template-flex-to-grid.md) | Multi-row flexbox layouts â†’ CSS Grid (Tailwind grid utilities) | 22 files with `flex flex-col`/`flex flex-row` clusters of 3+ siblings where Grid is more appropriate | ~3 | low | R-FE-008 |
| [PATTERN-15-falcon-icon-class-default-fallback](PATTERN-15-falcon-icon-class-default-fallback.md) | Token CSS-var defensive fallback (var(--token, #hex)) â†’ drop fallback once token is guaranteed-loaded | 7 occurrences across 4 files (templates only â€” token CSS files are exempt) | ~0.25 | low | R-FE-004 |
| [PATTERN-09-jsdoc-to-banner-comment](PATTERN-09-jsdoc-to-banner-comment.md) | Verbose JSDoc â†’ terse banner comment ***...*** | ~40 occurrences across 8 service/utility files (counted via `*\s+@param/@returns` matches) | ~1.5 | low | R-FE-010 |

## How to read this

- **Reach** = how many occurrences across the codebase this pattern eliminates
- **Effort** = estimated total hours to migrate all occurrences
- **Priority** = high/medium/low ranking based on reach ÷ effort + architectural importance
- **Rules** = which rulebook entries this pattern violates

## Recommended sequence

1. Apply patterns marked `priority: high` first — they have the highest reach per hour
2. Within high priority, start with the pattern whose **detection regex is most precise** (least false-positive risk)
3. After each pattern migration, re-run `quick-frontend-scan.ps1` to measure violation drop
4. Update each PATTERN-NN-*.md with a final `status: applied` + commit-sha record for traceability

## Related

- [TOP_PRIORITY_FIXES.md](../TOP_PRIORITY_FIXES.md) — ranked morning actions referencing these patterns
- [APPS_RANKING.md](../per-app/APPS_RANKING.md) — which apps benefit from each pattern most
- [BACKUP_AGGREGATES.md](../BACKUP_AGGREGATES.md) — raw counts driving the patterns

