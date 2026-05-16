---
runId: post-do-all-5
generatedAt: 2026-05-16T08:11:00.6362411Z
targets: C:\Falcon\Falcon\falcon-web-platform-ui
---

# Code Audit Summary — post-do-all-5

> Run started 2026-05-16 11:11:00 · scanned 1 repos.

## Totals

| Severity | Count |
|---|---|
| 🔴 must | 219 |
| 🟠 should | 17 |
| 🟢 nice | 0 |
| **Total real violations** | **236** |

## By rule (top 10)

| Rule | Name | Severity | Count |
|---|---|---|---|
| `R-NOOR-003` | Typography scale â€” only documented type tokens allowed | must | 146 |
| `R-FE-002` | No SCSS, no component CSS, no styles array | must | 35 |
| `R-NOOR-005` | Color naming â€” palette over intent (Admin Console) | must | 24 |
| `R-FE-009` | Feature folder structure â€” one file per type-folder | should | 17 |
| `R-NOOR-007` | i18n & RTL â€” strings from catalog, logical spacing only | must | 10 |
| `R-NOOR-008` | Global selector hygiene â€” no naked body/*/:root overrides | must | 2 |
| `R-NOOR-001` | Layout ownership â€” shell owns chrome, page owns content | must | 1 |
| `R-FE-012` | Build must be green â€” nx build exit 0 required | must | 1 |

## By repo

| Repo | Violations |
|---|---|
| `C:\Falcon\Falcon\falcon-web-platform-ui` | 236 |

## High severity (first 20)

| Rule | File | Line | Snippet |
|---|---|---|---|
| `R-NOOR-003` | `apps/admin-console/src/tailwind.css` | 67 | `@source inline("text-xs");` |
| `R-NOOR-003` | `apps/admin-console/src/tailwind.css` | 94 | `@source inline("text-sm");` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 188 | `<h2 class="text-base font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.us` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 193 | `class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-f` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 196 | `<i class="falcon-icon falcon-icon-filter text-sm"></i>` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute start-2.5 text-falcon-neutral-` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 247 | `<div class="px-5 py-8 text-sm text-falcon-neutral-500 italic">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 202 | `label.className = 'text-xs text-falcon-neutral-600 me-2 whitespace-nowrap';` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 8 | `<div class="px-6 pt-4 pb-3.5 border-b border-falcon-neutral-200 text-sm font-bol` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 172 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 175 | `<div class="text-xs text-base font-bold text-falcon-neutral-900">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 181 | `<div class="text-xs text-base text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 184 | `<div class="text-xs font-bold text-falcon-neutral-900">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 192 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 195 | `<div class="text-base font-bold text-falcon-neutral-900 inline-flex items-center` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 196 | `<falcon-angular-saudi-riyal-icon text-lg class="text-falcon-neutral-700" />` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 28 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 40 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 60 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 30 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |

## Outputs
- `violations.jsonl` — every violation as JSONL
- `violations-regex.jsonl` · `violations-structural.jsonl` · `violations-ast-fe.jsonl` · `violations-ast-be.jsonl` · `violations-semantic.jsonl` — per-engine streams
- `engine-runtimes.md` — performance + failure reasons

