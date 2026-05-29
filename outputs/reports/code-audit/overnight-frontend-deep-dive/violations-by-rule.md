# Violations by rule — overnight-frontend

## `R-FE-004` — Tokens only â€” no hardcoded hex, px, or palette names (2271 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 8 | `<span class="text-falcon-neutral-500 tracking-[0.5px]">-----</span>` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 40 | `<main class="bg-white border border-falcon-neutral-200 rounded-[14px] overflow-h` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 40 | `<main class="bg-white border border-falcon-neutral-200 rounded-[14px] overflow-h` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 164 | `<div class="mx-5 mb-6 border border-falcon-neutral-200 rounded-md overflow-hidde` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 187 | `<div class="flex items-center justify-between gap-3 px-[18px] py-[14px] bg-white` |
| 7 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 188 | `<h2 class="text-[15px] font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.` |
| 8 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 193 | `class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-f` |
| 9 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 196 | `<i class="falcon-icon falcon-icon-filter text-[13px]"></i>` |
| 10 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-5` |
| 11 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 217 | `style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falc` |
| 12 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 211 | `/***    Round 3 (2026-05-15): bumped to React SoT canonical #f5f5f5             ` |
| 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 213 | `/***    use #F5F5F5). The Falcon token --color-falcon-neutral-50 resolves to    ` |
| 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 214 | `/***    #f5f7f8 (slightly bluer); the SoT shade is a true neutral grey, so we se` |
| 15 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 220 | `t.style.setProperty('--falcon-table-header-bg', '#f5f5f5');` |
| 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 221 | `t.style.setProperty('--falcon-table-footer-bg', '#f5f5f5');` |
| 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 222 | `t.style.setProperty('--falcon-table-container-bg', 'var(--color-falcon-neutral-0` |
| 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 20 | `success: 'bg-emerald-100',` |
| 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 21 | `warning: 'bg-amber-100',` |
| 20 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 22 | `danger:  'bg-rose-100',` |
| 21 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 23 | `muted:   'bg-slate-200',` |
| 22 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 70 | `class="hidden lg:flex lg:col-span-1 flex-col gap-3 rounded-2xl border border-sla` |
| 23 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 74 | `<div class="h-3.5 w-1/2 rounded-md bg-slate-300/70 animate-pulse"></div>` |
| 24 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 77 | `<div class="h-3 w-2/5 rounded-md bg-slate-300/70 animate-pulse mb-1"></div>` |
| 25 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 87 | `<div class="w-3 h-3 rounded-sm bg-slate-300/70 animate-pulse"></div>` |
| 26 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 89 | `<div class="h-3.5 rounded-md bg-slate-300/70 animate-pulse" [class]="row.width">` |
| 27 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 94 | `<main class="lg:col-span-4 min-w-0 rounded-2xl border border-slate-200 bg-white ` |
| 28 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 95 | `<div class="grid grid-cols-[1fr_auto] items-center gap-4 h-16 px-7 border-b bord` |
| 29 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 98 | `<div class="h-3.5 rounded-md bg-slate-200/80 animate-pulse" [class]="w"></div>` |
| 30 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 101 | `<div class="h-9 w-28 rounded-full bg-slate-200/80 animate-pulse"></div>` |
| 31 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 107 | `<div class="h-6 w-56 rounded-md bg-slate-300/70 animate-pulse"></div>` |
| 32 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 110 | `<div class="h-3.5 w-28 rounded-md bg-slate-200/80 animate-pulse"></div>` |
| 33 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 111 | `<div class="h-14 w-35 rounded-xl bg-slate-200/80 animate-pulse"></div>` |
| 34 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 115 | `<section class="rounded-xl border border-slate-200 bg-white overflow-hidden">` |
| 35 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 116 | `<div class="grid grid-cols-[1fr_auto] items-center h-16 px-5 border-b border-sla` |
| 36 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 117 | `<div class="h-4 w-20 rounded-md bg-slate-300/70 animate-pulse"></div>` |
| 37 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 118 | `<div class="h-9 w-28 rounded-full bg-slate-200/80 animate-pulse"></div>` |
| 38 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 121 | `<div class="grid grid-cols-[36px_1.1fr_1fr_1.35fr_1.2fr_1fr_1.15fr_0.9fr_32px] i` |
| 39 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 121 | `<div class="grid grid-cols-[36px_1.1fr_1fr_1.35fr_1.2fr_1fr_1.15fr_0.9fr_32px] i` |
| 40 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 122 | `<div class="w-3.5 h-3.5 rounded-sm bg-slate-200/80 animate-pulse"></div>` |
| 41 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 123 | `<div class="h-3 w-14 rounded bg-slate-200/80 animate-pulse"></div>` |
| 42 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 124 | `<div class="h-3 w-12 rounded bg-slate-200/80 animate-pulse"></div>` |
| 43 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 125 | `<div class="h-3 w-12 rounded bg-slate-200/80 animate-pulse"></div>` |
| 44 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 126 | `<div class="h-3 w-12 rounded bg-slate-200/80 animate-pulse"></div>` |
| 45 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 127 | `<div class="h-3 w-10 rounded bg-slate-200/80 animate-pulse"></div>` |
| 46 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 128 | `<div class="h-3 w-12 rounded bg-slate-200/80 animate-pulse"></div>` |
| 47 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 129 | `<div class="h-3 w-12 rounded bg-slate-200/80 animate-pulse"></div>` |
| 48 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 134 | `class="grid grid-cols-[36px_1.1fr_1fr_1.35fr_1.2fr_1fr_1.15fr_0.9fr_32px] items-` |
| 49 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 134 | `class="grid grid-cols-[36px_1.1fr_1fr_1.35fr_1.2fr_1fr_1.15fr_0.9fr_32px] items-` |
| 50 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 137 | `[class]="row.selected ? 'bg-falcon-teal-700' : 'bg-slate-200/80'"></div>` |
| 51 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 138 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[0]"` |
| 52 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 139 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[1]"` |
| 53 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 140 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[2]"` |
| 54 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 141 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[3]"` |
| 55 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 142 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[4]"` |
| 56 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 143 | `<div class="h-3.5 rounded bg-slate-300/70 animate-pulse" [class]="row.widths[5]"` |
| 57 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 145 | `<div class="w-4 h-4 rounded-full bg-slate-200/80 animate-pulse"></div>` |
| 58 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 148 | `<div class="grid grid-cols-[1fr_auto] items-center h-14 px-5 min-w-[860px]">` |
| 59 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 149 | `<div class="h-3.5 w-40 rounded-md bg-slate-200/80 animate-pulse"></div>` |
| 60 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 151 | `<div class="w-8 h-8 rounded-lg bg-slate-200/80 animate-pulse"></div>` |
| 61 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 152 | `<div class="w-8 h-8 rounded-lg bg-slate-200/80 animate-pulse"></div>` |
| 62 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 153 | `<div class="w-8 h-8 rounded-lg bg-slate-200/80 animate-pulse"></div>` |
| 63 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 154 | `<div class="w-8 h-8 rounded-lg bg-slate-200/80 animate-pulse"></div>` |
| 64 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 17 | `component sets header-bg + footer-bg to the canonical SoT colour (#F5F5F5) via t` |
| 65 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 19 | `here was overriding the menu patch and producing a #FAFAFA header / #FAFAFA foot` |
| 66 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 71 | `<span class="text-falcon-neutral-400 tracking-[0.5px]">â€”â€”â€”â€”â€”</span>` |
| 67 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 80 | `<span class="text-falcon-neutral-400 tracking-[0.5px]">â€”â€”â€”â€”â€”</span>` |
| 68 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 89 | `<span class="text-falcon-neutral-400 tracking-[0.5px]">â€”â€”â€”â€”â€”</span>` |
| 69 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 101 | `<span class="text-falcon-neutral-400 tracking-[0.5px]">â€”â€”â€”â€”â€”</span>` |
| 70 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.ts` | 216 | `{ field: 'name',            headerKey: t('hierarchy.applications.col.name'),    ` |
| 71 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 4 | `- Background = #F3F8F5 (light green-teal stripe).` |
| 72 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 18 | `style="background: #F3F8F5; padding-inline: 16px;">` |
| 73 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 28 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 74 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 40 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 75 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 60 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 76 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] bo` |
| 77 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] bo` |
| 78 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] bo` |
| 79 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 30 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 80 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 35 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-teal-700 tex` |
| 81 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 37 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 82 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 39 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 83 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 47 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-mint-100 tex` |
| 84 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 49 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 85 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 51 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 86 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 1 | `<div class="absolute bottom-3.5 end-3.5 z-[5] flex items-center gap-1 p-1 bg-whi` |
| 87 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 1 | `<div class="absolute bottom-3.5 end-3.5 z-[5] flex items-center gap-1 p-1 bg-whi` |
| 88 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 1 | `<div class="absolute bottom-3.5 end-3.5 z-[5] flex items-center gap-1 p-1 bg-whi` |
| 89 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 4 | `class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-` |
| 90 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 15 | `class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-` |
| 91 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 24 | `<div class="px-2 h-6 flex items-center text-[11.5px] font-semibold text-falcon-n` |
| 92 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 27 | `class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-` |
| 93 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 37 | `class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-` |
| 94 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 85 | `<div class="text-[11px] font-semibold text-falcon-neutral-900 truncate">{{ u.fir` |
| 95 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 86 | `@if (u.role) { <div class="text-[10px] text-falcon-neutral-600 truncate">{{ u.ro` |
| 96 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `class="absolute top-3.5 end-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-[7` |
| 97 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `class="absolute top-3.5 end-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-[7` |
| 98 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 32 | `<span class="text-[18px] font-bold text-falcon-neutral-900 leading-tight">{{ nod` |
| 99 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 41 | `<h4 class="col-span-full text-[13px] font-bold text-falcon-neutral-900 m-0 mt-2"` |
| 100 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 47 | `<span class="text-xs font-normal text-falcon-neutral-600 tracking-[0.01em]">` |
| 101 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 72 | `<span class="text-[11px] text-falcon-danger-600 mt-0.5">` |
| 102 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 77 | `<span class="text-[13.5px] font-bold text-falcon-neutral-900 leading-[1.4] break` |
| 103 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 17 | `<i class="falcon-icon falcon-icon-times text-[14px]"></i>` |
| 104 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 38 | `<p class="text-[11px] text-falcon-neutral-500 m-0 mt-1">` |
| 105 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 46 | `class="inline-flex items-center h-[34px] px-3 text-sm font-medium text-falcon-ne` |
| 106 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 51 | `class="inline-flex items-center h-[34px] px-5 rounded-md bg-falcon-teal-700 text` |
| 107 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 4 | `with h-8 / px-3 / text-[12.5px]). Library component handles all sizing tokens.` |
| 108 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 11 | `<i class="falcon-icon falcon-icon-arrow-left text-[14px]"></i>` |
| 109 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 17 | `<span class="text-[15px] font-semibold text-falcon-neutral-900">` |
| 110 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 25 | `class="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-med` |
| 111 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 66 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 112 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 83 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 113 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 108 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 114 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 139 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 115 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 170 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 116 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 229 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 uppercase trackin` |
| 117 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 28 | `background: rgba(13, 63, 68, 0.55);` |
| 118 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 44 | `style="width: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);"` |
| 119 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fa` |
| 120 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 99 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 121 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 104 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 122 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 115 | `stroke="var(--color-falcon-neutral-150, #e6eaee)"` |
| 123 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 119 | `stroke="var(--color-falcon-teal-700, #0d3f44)"` |
| 124 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 135 | `class="inline-flex items-center gap-1.5 mt-1 text-[13px] font-medium disabled:cu` |
| 125 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 126 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 37 | `<div class="flex items-center justify-between px-7 pt-[22px] pb-2.5 shrink-0">` |
| 127 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 128 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | 54 | `<button type="button" class="absolute right-[10px] top-1/2 -translate-y-1/2 p-1 ` |
| 129 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 56 | `<div class="flex items-center gap-3 mb-[18px]">` |
| 130 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 57 | `<span class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0` |
| 131 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 17 | `class="relative inline-block w-[34px] h-4 rounded-full transition-colors"` |
| 132 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 22 | `[class.left-[18px]]="r.visible"` |
| 133 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 44 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 134 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-` |
| 135 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 66 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 136 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 72 | `<span class="inline-flex items-center h-6 px-3.5 rounded-full bg-white border bo` |
| 137 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 76 | `<span class="text-falcon-neutral-500 text-[13px] tracking-[0.5px]">------</span>` |
| 138 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 5 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 139 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 25 | `<strong class="text-[13px] font-semibold text-falcon-neutral-900">` |
| 140 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 28 | `<em class="not-italic text-[11.5px] text-falcon-neutral-600 leading-[1.4]">` |
| 141 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 36 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 142 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 55 | `<div class="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center g` |
| 143 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 57 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] fo` |
| 144 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 76 | `<i slot="icon-start" class="falcon-icon falcon-icon-plus text-[12px]" aria-hidde` |
| 145 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 85 | `<div class="flex flex-wrap items-center gap-2.5 mb-[6px]">` |
| 146 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 99 | `<div class="text-[11.5px] text-falcon-red-500 mt-1">` |
| 147 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 103 | `<div class="text-[11.5px] text-falcon-red-500 mt-1">` |
| 148 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 107 | `<div class="text-[11.5px] text-falcon-red-500 mt-1 font-medium">` |
| 149 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 113 | `<aside class="rounded-sm p-[22px] flex flex-col gap-4 bg-falcon-neutral-30 borde` |
| 150 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 114 | `<div class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[` |
| 151 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 129 | `<div class="flex flex-col gap-[6px]">` |
| 152 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 135 | `<div class="flex flex-col gap-[3px]">` |
| 153 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 136 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 154 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 143 | `<div class="flex flex-col gap-[3px]">` |
| 155 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 144 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 156 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 168 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNormalError()!` |
| 157 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 172 | `<div class="flex flex-col gap-[6px]">` |
| 158 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 178 | `<div class="flex flex-col gap-[3px]">` |
| 159 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 179 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 160 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 186 | `<div class="flex flex-col gap-[3px]">` |
| 161 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 187 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 162 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 211 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxSystemError()!` |
| 163 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 215 | `<div class="flex flex-col gap-[6px]">` |
| 164 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 221 | `<div class="flex flex-col gap-[3px]">` |
| 165 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 222 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 166 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 229 | `<div class="flex flex-col gap-[3px]">` |
| 167 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 230 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 168 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 254 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNodeError()!.k` |
| 169 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 170 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 37 | `<div class="flex items-center justify-between px-10 pt-[22px] pb-2.5 shrink-0">` |
| 171 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 172 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 16 | `<div class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0.` |
| 173 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 23 | `<span class="text-[13px] font-medium text-falcon-neutral-900">` |
| 174 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 28 | `<label class="inline-flex items-center gap-2 cursor-pointer text-[13px] text-fal` |
| 175 | `apps/host-shell/remote-route-loader.service.ts` | 42 | `"color: #0a7bd7; font-weight: bold;"` |
| 176 | `apps/host-shell/remote-route-loader.service.ts` | 47 | `"color: #7b1fa2;",` |
| 177 | `apps/host-shell/remote-route-loader.service.ts` | 55 | `"color: #00c853; font-weight: bold;"` |
| 178 | `apps/host-shell/remote-route-loader.service.ts` | 64 | `"color: #00c853; font-weight: bold;"` |
| 179 | `apps/host-shell/remote-route-loader.service.ts` | 72 | `"color: #d50000; font-weight: bold;"` |
| 180 | `apps/host-shell/remote-route-loader.service.ts` | 86 | `"color: #d50000; font-weight: bold;"` |
| 181 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 39 | `console.error(`%c[MF] FAIL ${name}: not declared in manifest`, 'color:#d63031;fo` |
| 182 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 43 | `console.error(`%c[MF] FAIL ${name}: declared but inactive`, 'color:#d63031;font-` |
| 183 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 48 | `'color:#d63031;font-weight:bold;',` |
| 184 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 54 | `'color:#d63031;font-weight:bold;',` |
| 185 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 70 | `'color:#00b894;font-weight:bold;',` |
| 186 | `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` | 75 | `'color:#d63031;font-weight:bold;',` |
| 187 | `apps/host-shell/src/app/core/services/remote-route.service.ts` | 27 | `console.log('%c[REMOTE-ROUTES]', 'color:#7b1fa2;font-weight:bold;', ...args);` |
| 188 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` | 8 | `<circle cx="32" cy="32" r="30" stroke="var(--color-falcon-teal-700, #104C54)" st` |
| 189 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` | 9 | `<path d="M20 33l8 8 16-16" stroke="var(--color-falcon-teal-700, #104C54)" stroke` |
| 190 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 94 | `<circle cx="32" cy="32" r="30" stroke="var(--color-falcon-teal-700, #104C54)" st` |
| 191 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 95 | `<path d="M20 33l8 8 16-16" stroke="var(--color-falcon-teal-700, #104C54)" stroke` |
| 192 | `apps/host-shell/src/app/features/error/error.component.ts` | 26 | `background: linear-gradient(135deg, #f4f7fb 0%, #e7eef9 100%);` |
| 193 | `apps/host-shell/src/app/features/error/error.component.ts` | 32 | `background: #ffffff;` |
| 194 | `apps/host-shell/src/app/features/error/error.component.ts` | 34 | `box-shadow: 0 1.5rem 3rem rgba(24, 39, 75, 0.12);` |
| 195 | `apps/host-shell/src/app/features/error/error.component.ts` | 41 | `color: #1f2937;` |
| 196 | `apps/host-shell/src/app/features/error/error.component.ts` | 47 | `color: #4b5563;` |
| 197 | `apps/host-shell/src/app/features/error/error.component.ts` | 55 | `background: #1d4ed8;` |
| 198 | `apps/host-shell/src/app/features/error/error.component.ts` | 56 | `color: #ffffff;` |
| 199 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 9 | `/*** lights, filename pill, line-number gutter, #1A2424 body, Prism token tints ` |
| 200 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 210 | `<div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[` |
| 201 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 225 | `<div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[` |
| 202 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 233 | `class="px-2.5 py-[5px] rounded-md text-[11.5px] font-medium bg-falcon-teal-50 te` |
| 203 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 515 | `/***   â€¢ The deeply-nested `<pre>` / `<code>` / line-number gutter â€” the use` |
| 204 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 527 | `border: 1px solid #050a0a;` |
| 205 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 528 | `background: #1A2424;` |
| 206 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 530 | `0 1px 2px rgba(0, 0, 0, 0.2),` |
| 207 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 531 | `0 14px 36px -18px rgba(0, 0, 0, 0.55),` |
| 208 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 532 | `inset 0 1px 0 rgba(255, 255, 255, 0.04);` |
| 209 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 540 | `background: linear-gradient(to bottom, #202f2f 0%, #1a2727 100%);` |
| 210 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 541 | `border-bottom: 1px solid #050a0a;` |
| 211 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 555 | `inset 0 0 0 1px rgba(0, 0, 0, 0.25),` |
| 212 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 556 | `inset 0 1px 0 rgba(255, 255, 255, 0.2);` |
| 213 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 558 | `.studio-code-shell .studio-code-dot--red    { background: #ff5f56; }` |
| 214 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 559 | `.studio-code-shell .studio-code-dot--amber  { background: #ffbd2e; }` |
| 215 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 560 | `.studio-code-shell .studio-code-dot--green  { background: #27c93f; }` |
| 216 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 573 | `color: #d6e0e0;` |
| 217 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 586 | `background: rgba(0, 0, 0, 0.4);` |
| 218 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 587 | `border: 1px solid rgba(255, 255, 255, 0.04);` |
| 219 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 601 | `color: #93a8a8;` |
| 220 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 605 | `color: #e6eded;` |
| 221 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 606 | `background: rgba(255, 255, 255, 0.06);` |
| 222 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 609 | `color: #ffffff;` |
| 223 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 610 | `background: #0d3f44; /* falcon-teal-700 */` |
| 224 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 611 | `box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);` |
| 225 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 614 | `outline: 2px solid #7dd3c5;` |
| 226 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 626 | `color: #cbd5d5;` |
| 227 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 627 | `background: rgba(255, 255, 255, 0.04);` |
| 228 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 628 | `border: 1px solid rgba(255, 255, 255, 0.08);` |
| 229 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 633 | `background: rgba(255, 255, 255, 0.12);` |
| 230 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 634 | `color: #ffffff;` |
| 231 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 637 | `outline: 2px solid #7dd3c5;` |
| 232 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 641 | `/*** â”€â”€ Terminal body â€” gutter + code, all rendered ON #1A2424 â”€â”€ ***/` |
| 233 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 645 | `background: #1A2424;` |
| 234 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 647 | `linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 0%, transparent 16px),` |
| 235 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 648 | `linear-gradient(to bottom, #1A2424 0%, #141d1d 100%);` |
| 236 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 659 | `background: rgba(0, 0, 0, 0.22);` |
| 237 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 660 | `border-right: 1px solid rgba(255, 255, 255, 0.04);` |
| 238 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 661 | `color: #4b6363;` |
| 239 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 676 | `color: #d4dfdf;` |
| 240 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 693 | `/*** Prism token palette tuned for the #1A2424 base â€” these MUST be global (Pr` |
| 241 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 698 | `.studio-code-shell .studio-code-pre .token.selector       { color: #7dd3c5; }` |
| 242 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 701 | `.studio-code-shell .studio-code-pre .token.directive       { color: #f3c969; }` |
| 243 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 704 | `.studio-code-shell .studio-code-pre .token.char            { color: #c2e7b0; }` |
| 244 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 708 | `.studio-code-shell .studio-code-pre .token.cdata           { color: #5a7373; fon` |
| 245 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 709 | `.studio-code-shell .studio-code-pre .token.punctuation     { color: #8aa1a1; }` |
| 246 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 711 | `.studio-code-shell .studio-code-pre .token.class-name      { color: #f0a978; }` |
| 247 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 713 | `.studio-code-shell .studio-code-pre .token.number          { color: #d49ee0; }` |
| 248 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 714 | `.studio-code-shell .studio-code-pre .token.operator        { color: #e0e6e6; }` |
| 249 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 718 | `background: #182121;` |
| 250 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 724 | `color: #dbe5e5;` |
| 251 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 734 | `color: #f3c969;` |
| 252 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 739 | `background: rgba(125, 211, 197, 0.1);` |
| 253 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 740 | `color: #a6e3d7;` |
| 254 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 748 | `color: #7dd3c5;` |
| 255 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 751 | `color: #cbd5d5;` |
| 256 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 755 | `color: #2f4040;` |
| 257 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 766 | `<span class="text-[12.5px] font-semibold text-falcon-neutral-900 truncate">` |
| 258 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 769 | `<span class="text-[11px] text-falcon-neutral-500 leading-relaxed">{{ s.summary }` |
| 259 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 772 | `text-[10.5px] font-semibold uppercase tracking-wider` |
| 260 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 830 | `<p class="text-[12px] text-falcon-neutral-500 max-w-md leading-relaxed">` |
| 261 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 44 | `<div class="flex items-center justify-between gap-2 min-h-[28px] max-h-[32px]">` |
| 262 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 56 | `<span class="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full t` |
| 263 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 29 | `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-falc` |
| 264 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 35 | `<p class="mt-1 text-[11px] text-falcon-teal-50/70 truncate max-w-[64ch]">` |
| 265 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 43 | `<div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 ` |
| 266 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 44 | `<span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Compo` |
| 267 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 47 | `<div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 ` |
| 268 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 48 | `<span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Stack` |
| 269 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 51 | `<div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 ` |
| 270 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 52 | `<span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Port<` |
| 271 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 40 | `<div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[` |
| 272 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 43 | `class="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md` |
| 273 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 44 | `text-[11.5px] font-medium leading-tight transition-colors border-0 cursor-pointe` |
| 274 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 46 | `? 'bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]'` |
| 275 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 53 | `class="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md` |
| 276 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 54 | `text-[11.5px] font-medium leading-tight transition-colors border-0 cursor-pointe` |
| 277 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 56 | `? 'bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]'` |
| 278 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 67 | `<div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[` |
| 279 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 70 | `class="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md` |
| 280 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 71 | `text-[11.5px] font-medium leading-tight transition-colors border-0 cursor-pointe` |
| 281 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 73 | `? 'bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]'` |
| 282 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 79 | `class="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md` |
| 283 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 80 | `text-[11.5px] font-medium leading-tight transition-colors border-0 cursor-pointe` |
| 284 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 82 | `? 'bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]'` |
| 285 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 93 | `class="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-md text-[11.5px]` |
| 286 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 106 | `<div class="p-4 text-[12px] text-falcon-neutral-700">` |
| 287 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 111 | `<span class="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-falcon` |
| 288 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 120 | `<span class="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-falcon` |
| 289 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 129 | `<span class="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-falcon` |
| 290 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-row.component.ts` | 48 | `<div class="min-h-0 max-h-[480px] overflow-auto rounded-lg border border-falcon-` |
| 291 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-row.component.ts` | 69 | `'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medi` |
| 292 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 96 | `<span class="text-[11px] font-semibold truncate"` |
| 293 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 100 | `<span class="text-[10px] text-falcon-neutral-475 truncate">{{ example.descriptio` |
| 294 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 248 | `'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font` |
| 295 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 285 | `'min-h-[120px] w-full grid items-center bg-falcon-neutral-0 p-4 border-t border-` |
| 296 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 48 | `<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-n` |
| 297 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 52 | `<p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` |
| 298 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 68 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 shadow-[0_1px_2px_rgba(13,63,68,0.25` |
| 299 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 79 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 shadow-[0_1px_2px_rgba(13,63,68,0.25` |
| 300 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 90 | `<article class="rounded-2xl border border-falcon-neutral-200 bg-falcon-neutral-0` |
| 301 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 92 | `<h3 class="text-[13px] font-semibold text-falcon-neutral-900">Users</h3>` |
| 302 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 93 | `<span class="text-[11px] text-falcon-neutral-500">` |
| 303 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 99 | `<div class="min-h-[260px]">` |
| 304 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 143 | `<article class="rounded-2xl border border-falcon-neutral-200 bg-falcon-neutral-0` |
| 305 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 145 | `<span class="text-[13px] font-semibold text-falcon-neutral-900">Empty-state cont` |
| 306 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 152 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Card background<` |
| 307 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 153 | `<span class="text-[11px] text-falcon-neutral-500">Soft tinted panel behind every` |
| 308 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 161 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Glossy gradient<` |
| 309 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 162 | `<span class="text-[11px] text-falcon-neutral-500">Top-to-bottom sheen on the car` |
| 310 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 170 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon background<` |
| 311 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 171 | `<span class="text-[11px] text-falcon-neutral-500">Circular tinted disc behind th` |
| 312 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 179 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Colored icon</sp` |
| 313 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 180 | `<span class="text-[11px] text-falcon-neutral-500">Teal accent vs neutral grey</s` |
| 314 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 188 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon opacity</sp` |
| 315 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 189 | `<span class="text-[11px] text-falcon-neutral-500">Affects icon + chip only, neve` |
| 316 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 197 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Opacity value</s` |
| 317 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 198 | `<span class="text-[11px] text-falcon-neutral-500">{{ opacity() }}%</span>` |
| 318 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 201 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 319 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 207 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon</span>` |
| 320 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 208 | `<span class="text-[11px] text-falcon-neutral-500">Swap the glyph in the chip</sp` |
| 321 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 268 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon size</span>` |
| 322 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 269 | `<span class="text-[11px] text-falcon-neutral-500">{{ iconSize() }}px</span>` |
| 323 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 272 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 324 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 278 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Dismissable</spa` |
| 325 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 279 | `<span class="text-[11px] text-falcon-neutral-500">Marks the empty-state as user-` |
| 326 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 287 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Feedback level</` |
| 327 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 288 | `<span class="text-[11px] text-falcon-neutral-500">Semantic intent â€” drives rol` |
| 328 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 293 | `class="px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors"` |
| 329 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 305 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Show action butt` |
| 330 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 306 | `<span class="text-[11px] text-falcon-neutral-500">"+ Add User" call-to-action</s` |
| 331 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 314 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Button label</sp` |
| 332 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 315 | `<span class="text-[11px] text-falcon-neutral-500">Text shown next to the plus ic` |
| 333 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 323 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Button size</spa` |
| 334 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 324 | `<span class="text-[11px] text-falcon-neutral-500">Compact / standard / spacious<` |
| 335 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 329 | `class="px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors"` |
| 336 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 341 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Button border</s` |
| 337 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 342 | `<span class="text-[11px] text-falcon-neutral-500">Solid, dashed, or none</span>` |
| 338 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 347 | `class="px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors"` |
| 339 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 359 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Show info note</` |
| 340 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 360 | `<span class="text-[11px] text-falcon-neutral-500">Small info chip below the butt` |
| 341 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 368 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Info text</span>` |
| 342 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 369 | `<span class="text-[11px] text-falcon-neutral-500">Context shown next to the info` |
| 343 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 379 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Container fit</s` |
| 344 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 380 | `<span class="text-[11px] text-falcon-neutral-500">Fill the wrapper, cap at 50vw ` |
| 345 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 385 | `class="px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors"` |
| 346 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 397 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Outer padding X<` |
| 347 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 398 | `<span class="text-[11px] text-falcon-neutral-500">{{ padX() }}px</span>` |
| 348 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 401 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 349 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 407 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Outer padding Y<` |
| 350 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 408 | `<span class="text-[11px] text-falcon-neutral-500">{{ padY() }}px</span>` |
| 351 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 411 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 352 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 417 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Outer margin X</` |
| 353 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 418 | `<span class="text-[11px] text-falcon-neutral-500">{{ marginX() }}px</span>` |
| 354 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 421 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 355 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 427 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Outer margin Y</` |
| 356 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 428 | `<span class="text-[11px] text-falcon-neutral-500">{{ marginY() }}px</span>` |
| 357 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 431 | `<span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-` |
| 358 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 437 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900">Render path</spa` |
| 359 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 438 | `<span class="text-[11px] text-falcon-neutral-500">` |
| 360 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 444 | `class="px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors"` |
| 361 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 450 | `class="px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors"` |
| 362 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 462 | `<article class="rounded-2xl border border-falcon-neutral-200 bg-falcon-neutral-0` |
| 363 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 465 | `<span class="text-[13px] font-semibold text-falcon-neutral-900">Preview alert â€` |
| 364 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 466 | `<span class="text-[11px] text-falcon-neutral-500">` |
| 365 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 475 | `<div class="grid grid-cols-[120px_1fr_1fr_28px] gap-x-4 gap-y-2 items-center tex` |
| 366 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 476 | `<span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-falcon-n` |
| 367 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 477 | `<span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-falcon-n` |
| 368 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 478 | `<span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-falcon-n` |
| 369 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 483 | `<code class="text-[11.5px] text-falcon-neutral-900 bg-falcon-neutral-50 px-2 py-` |
| 370 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 484 | `<code class="text-[11.5px] text-falcon-neutral-600 bg-falcon-neutral-30 px-2 py-` |
| 371 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 485 | `<span class="text-[14px] leading-none" [title]="row.match ? 'matches config defa` |
| 372 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 516 | `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);` |
| 373 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 127 | `<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-n` |
| 374 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 131 | `<p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` |
| 375 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 188 | `class="self-start text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5` |
| 376 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 197 | `<p class="text-[12.5px] text-falcon-neutral-500 leading-relaxed flex-1">` |
| 377 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 203 | `<span class="text-[11.5px] text-falcon-neutral-400">Press to open</span>` |
| 378 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 249 | `<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-n` |
| 379 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 253 | `<p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` |
| 380 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 262 | `<div class="rounded-2xl border border-falcon-neutral-200 bg-falcon-neutral-0 sha` |
| 381 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 267 | `<span class="text-[11px] font-semibold uppercase tracking-wider text-falcon-neut` |
| 382 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 270 | `<span class="text-[11.5px] text-falcon-neutral-400">When to fade away</span>` |
| 383 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 280 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 shadow-[0_1px_2px_rgba(13,63,68,0.25` |
| 384 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 291 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 shadow-[0_1px_2px_rgba(13,63,68,0.25` |
| 385 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 337 | `<span class="text-[11px] font-semibold uppercase tracking-wider text-falcon-neut` |
| 386 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 340 | `<span class="text-[11.5px] text-falcon-neutral-400">Pick any combination</span>` |
| 387 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 350 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 border-falcon-teal-800 shadow-[0_1px` |
| 388 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 365 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 border-falcon-teal-800 shadow-[0_1px` |
| 389 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 380 | `? 'bg-falcon-teal-800 text-falcon-neutral-0 border-falcon-teal-800 shadow-[0_1px` |
| 390 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 393 | `<span class="text-[11px] font-semibold uppercase tracking-wider text-falcon-neut` |
| 391 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 396 | `<span class="text-[11.5px] text-falcon-neutral-400">Border, accents, radius</spa` |
| 392 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 458 | `class="self-start text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5` |
| 393 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 467 | `<p class="text-[12.5px] text-falcon-neutral-500 leading-relaxed flex-1">` |
| 394 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 473 | `<span class="text-[11.5px] text-falcon-neutral-400">Press to fire</span>` |
| 395 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 494 | `<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-n` |
| 396 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 498 | `<p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` |
| 397 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 501 | `jump-to-bottom). Backed by a generic <code class="text-[12px]">items: &#123;id, ` |
| 398 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 501 | `jump-to-bottom). Backed by a generic <code class="text-[12px]">items: &#123;id, ` |
| 399 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 502 | `the dialog emits <code class="text-[12px]">orderedIds</code> on Proceed. All API` |
| 400 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 503 | `in the host-shell wrapper <code class="text-[12px]">&lt;app-do-payment-priority-` |
| 401 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 513 | `<span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-falcon-n` |
| 402 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 518 | `<span class="text-[12.5px] font-semibold text-falcon-neutral-900 leading-tight">` |
| 403 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 519 | `<span class="text-[11px] text-falcon-neutral-500 leading-snug">{{ toggle.sub }}<` |
| 404 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 530 | `<span class="text-[12.5px] font-semibold text-falcon-neutral-900 leading-tight">` |
| 405 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 531 | `<span class="text-[11px] text-falcon-neutral-500 leading-snug">Drop-skeleton ope` |
| 406 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 541 | `class="flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium text-falcon-neutral` |
| 407 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 549 | `<span class="text-[12.5px] font-semibold text-falcon-neutral-900 leading-tight">` |
| 408 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 559 | `class="flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium text-falcon-neutral` |
| 409 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 571 | `<span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-falcon-n` |
| 410 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 574 | `<div class="ib-mirror-frame rounded-2xl ring-1 ring-falcon-neutral-200 p-5 min-h` |
| 411 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 585 | `<span class="relative inline-flex items-center justify-center w-[72px] h-[72px]"` |
| 412 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 591 | `[attr.fill]="ibShowIconColor() ? 'var(--color-falcon-red-500, #dc2626)' : 'var(-` |
| 413 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 596 | `<h2 class="m-0 text-[18px] font-bold leading-tight text-falcon-neutral-900">Insu` |
| 414 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 597 | `<p class="m-0 text-[13px] leading-[1.5] max-w-[460px] text-falcon-neutral-600">` |
| 415 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 604 | `<div class="border border-falcon-neutral-200 rounded-xl p-[14px] bg-falcon-neutr` |
| 416 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 606 | `<div class="text-[12px] text-falcon-neutral-500 font-medium mb-2.5">Drag To Chan` |
| 417 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 628 | `<span class="w-[18px] text-[13px] text-falcon-neutral-500 text-center font-mediu` |
| 418 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 651 | `<span class="flex-1 text-[13px] font-medium text-falcon-neutral-900 min-w-0 trun` |
| 419 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 704 | `<div class="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-lg bg-falcon-teal-5` |
| 420 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 722 | `class="self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-falc` |
| 421 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 736 | `<span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-falcon-n` |
| 422 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 741 | `<span class="text-[12px] text-falcon-neutral-700">{{ slider.label }}</span>` |
| 423 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 742 | `<span class="text-[11px] text-falcon-neutral-500 tabular-nums">{{ ibSliderValue(` |
| 424 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 754 | `<span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-falcon-n` |
| 425 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 756 | `class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-falcon-teal-700 ` |
| 426 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 761 | `<ul class="flex flex-col gap-1.5 list-none m-0 p-0 max-h-[280px] overflow-y-auto` |
| 427 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 764 | `<span class="text-[10.5px] text-falcon-neutral-500 w-4 text-center">{{ i + 1 }}<` |
| 428 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 765 | `<span class="text-[12.5px] font-medium text-falcon-neutral-900 flex-1 truncate">` |
| 429 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 791 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 leading-tight">{{` |
| 430 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 792 | `<span class="text-[11.5px] text-falcon-neutral-500 leading-relaxed">{{ sub }}</s` |
| 431 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 847 | `linear-gradient(135deg, rgba(241, 243, 245, 0.95) 0%, rgba(229, 231, 235, 0.85) ` |
| 432 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 853 | `background: rgba(255, 255, 255, 0.92);` |
| 433 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 867 | `color: var(--color-falcon-neutral-400, #c7ced4);` |
| 434 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 871 | `.ib-mirror-grip:hover { background: var(--color-falcon-neutral-100, #f1f3f5); }` |
| 435 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 882 | `border-color: var(--color-falcon-teal-500, #124c52) !important;` |
| 436 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 887 | `color: var(--color-falcon-neutral-400, #c7ced4) !important;` |
| 437 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 902 | `border: 2px dashed var(--color-falcon-teal-500, #124c52);` |
| 438 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 904 | `background: var(--color-falcon-teal-50, #f3f8f5);` |
| 439 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 905 | `color: var(--color-falcon-teal-700, #0d3f44);` |
| 440 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 921 | `background: var(--color-falcon-teal-700, #0d3f44);` |
| 441 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 922 | `color: var(--color-falcon-neutral-0, #ffffff);` |
| 442 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 980 | `background: var(--color-falcon-neutral-100, #f1f3f5);` |
| 443 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 981 | `color: var(--color-falcon-neutral-600, #6b7280);` |
| 444 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 987 | `background: var(--color-falcon-teal-500, #124c52);` |
| 445 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 988 | `color: var(--color-falcon-neutral-0, #ffffff);` |
| 446 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1004 | `background: var(--color-falcon-neutral-0, #ffffff);` |
| 447 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1005 | `color: var(--color-falcon-neutral-700, #5a6470);` |
| 448 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1006 | `border-color: var(--color-falcon-neutral-200, #e5e7eb);` |
| 449 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1009 | `background: var(--color-falcon-teal-700, #0d3f44);` |
| 450 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1010 | `color: var(--color-falcon-neutral-0, #ffffff);` |
| 451 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1032 | `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);` |
| 452 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1041 | `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);` |
| 453 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1044 | `box-shadow: 0 0 0 3px rgba(13, 63, 68, 0.25);` |
| 454 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1161 | `ghost.style.boxShadow = '0 12px 24px -6px rgba(0,0,0,0.25)';` |
| 455 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 4 | `/*** Frame wrapper with bounded inner content (max-w-[180px]). ***/` |
| 456 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 19 | `<div class="w-full max-w-[180px]">` |
| 457 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 21 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Label</span>` |
| 458 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 23 | `<span class="text-[9px] text-falcon-neutral-475">Placeholder</span>` |
| 459 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 40 | `<div class="w-full max-w-[180px]">` |
| 460 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 42 | `<span class="inline-flex items-center justify-center h-7 px-3 rounded-md bg-falc` |
| 461 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 43 | `<span class="inline-flex items-center justify-center h-7 px-3 rounded-md bg-falc` |
| 462 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 58 | `<div class="w-full max-w-[180px]">` |
| 463 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 60 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Country</span>` |
| 464 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 62 | `<span class="text-[9px] text-falcon-neutral-900">Saudi Arabia</span>` |
| 465 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 79 | `<div class="w-full max-w-[180px]">` |
| 466 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 81 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Stack</span>` |
| 467 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 84 | `<span class="inline-flex items-center h-4 px-1 rounded-sm bg-falcon-teal-50 text` |
| 468 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 85 | `<span class="inline-flex items-center h-4 px-1 rounded-sm bg-falcon-teal-50 text` |
| 469 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 103 | `<div class="w-full max-w-[180px]">` |
| 470 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 108 | `<span class="text-[10px] text-falcon-neutral-900">Remember me</span>` |
| 471 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 123 | `<div class="w-full max-w-[180px]">` |
| 472 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 128 | `<span class="text-[10px] text-falcon-neutral-900">Selected</span>` |
| 473 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 143 | `<div class="w-full max-w-[180px]">` |
| 474 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 148 | `<span class="text-[10px] text-falcon-neutral-900">On</span>` |
| 475 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 163 | `<div class="w-full max-w-[180px]">` |
| 476 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 165 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Notes</span>` |
| 477 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 167 | `<span class="text-[9px] text-falcon-neutral-900 leading-tight">Write a short mes` |
| 478 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 185 | `<div class="w-full max-w-[180px]">` |
| 479 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 187 | `<span class="text-[9px] font-medium text-falcon-neutral-700 text-center">Enter t` |
| 480 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 189 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 481 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 190 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 482 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 191 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 483 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 194 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 484 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 195 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 485 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 196 | `<span class="inline-flex items-center justify-center h-6 w-5 rounded-md text-[10` |
| 486 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 212 | `<div class="w-full max-w-[180px]">` |
| 487 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 214 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Phone</span>` |
| 488 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 217 | `<span class="text-[10px]">ðŸ‡¸ðŸ‡¦</span>` |
| 489 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 218 | `<span class="text-[9px] text-falcon-neutral-700">+966</span>` |
| 490 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 220 | `<span class="flex-1 px-2 text-[9px] text-falcon-neutral-475 truncate">5xx xxx xx` |
| 491 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 236 | `<div class="w-full max-w-[180px]">` |
| 492 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 238 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Email</span>` |
| 493 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 241 | `<span class="text-[9px] text-falcon-neutral-475 truncate">name&#64;falcon.sa</sp` |
| 494 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 257 | `<div class="w-full max-w-[180px]">` |
| 495 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 259 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Start date</span>` |
| 496 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 261 | `<span class="text-[9px] text-falcon-neutral-900">2026-05-09</span>` |
| 497 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 280 | `<div class="w-full max-w-[180px]">` |
| 498 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 283 | `<span class="text-[8px] font-medium text-falcon-neutral-700">Name</span>` |
| 499 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 284 | `<span class="text-[8px] font-medium text-falcon-neutral-700">Role</span>` |
| 500 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 285 | `<span class="text-[8px] font-medium text-falcon-neutral-700 text-right">Status</` |
| 501 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 288 | `<span class="text-[8px] text-falcon-neutral-900">Lina</span>` |
| 502 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 289 | `<span class="text-[8px] text-falcon-neutral-700">Eng</span>` |
| 503 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 290 | `<span class="justify-self-end inline-flex items-center h-3 px-1 rounded-full tex` |
| 504 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 293 | `<span class="text-[8px] text-falcon-neutral-900">Omar</span>` |
| 505 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 294 | `<span class="text-[8px] text-falcon-neutral-700">Des</span>` |
| 506 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 295 | `<span class="justify-self-end inline-flex items-center h-3 px-1 rounded-full tex` |
| 507 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 298 | `<span class="text-[8px] text-falcon-neutral-900">Aya</span>` |
| 508 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 299 | `<span class="text-[8px] text-falcon-neutral-700">PM</span>` |
| 509 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 300 | `<span class="justify-self-end inline-flex items-center h-3 px-1 rounded-full tex` |
| 510 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 316 | `<div class="w-full max-w-[180px]">` |
| 511 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 321 | `<span class="text-[10px] text-falcon-neutral-900 font-medium">Design</span>` |
| 512 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 326 | `<span class="text-[10px] text-falcon-neutral-900">Tokens</span>` |
| 513 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 331 | `<span class="text-[10px] text-falcon-neutral-900 font-medium">Components</span>` |
| 514 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 335 | `<span class="text-[10px] text-falcon-neutral-700">Button.tsx</span>` |
| 515 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 351 | `<div class="w-full max-w-[180px]">` |
| 516 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 354 | `<span class="text-[8px] font-medium text-falcon-neutral-700">Service</span>` |
| 517 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 355 | `<span class="text-[8px] font-medium text-falcon-neutral-700">Status</span>` |
| 518 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 360 | `<span class="text-[9px] text-falcon-neutral-900 font-medium">Platform</span>` |
| 519 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 362 | `<span class="inline-flex items-center h-3 px-1 rounded-full text-[7px] font-medi` |
| 520 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 365 | `<span class="text-[9px] text-falcon-neutral-900">Commerce</span>` |
| 521 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 366 | `<span class="inline-flex items-center h-3 px-1 rounded-full text-[7px] font-medi` |
| 522 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 369 | `<span class="text-[9px] text-falcon-neutral-900">Charging</span>` |
| 523 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 370 | `<span class="inline-flex items-center h-3 px-1 rounded-full text-[7px] font-medi` |
| 524 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 386 | `<div class="w-full max-w-[180px]">` |
| 525 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 391 | `<span class="inline-flex items-center justify-center h-5 w-5 rounded-md text-[9p` |
| 526 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 392 | `<span class="inline-flex items-center justify-center h-5 w-5 rounded-md text-[9p` |
| 527 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 393 | `<span class="inline-flex items-center justify-center h-5 w-5 rounded-md text-[9p` |
| 528 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 394 | `<span class="inline-flex items-center justify-center h-5 w-5 rounded-md text-[9p` |
| 529 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 414 | `<div class="w-full max-w-[180px]">` |
| 530 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 417 | `<span class="pb-1 text-[10px] font-medium border-b-2 text-falcon-neutral-700 bor` |
| 531 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 418 | `<span class="pb-1 text-[10px] font-medium border-b-2 text-falcon-teal-500 border` |
| 532 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 419 | `<span class="pb-1 text-[10px] font-medium border-b-2 text-falcon-neutral-700 bor` |
| 533 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 437 | `<div class="w-full max-w-[180px]">` |
| 534 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 440 | `<span class="inline-flex items-center justify-center h-4 w-4 rounded-full text-[` |
| 535 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 442 | `<span class="inline-flex items-center justify-center h-4 w-4 rounded-full text-[` |
| 536 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 444 | `<span class="inline-flex items-center justify-center h-4 w-4 rounded-full text-[` |
| 537 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 446 | `<div class="flex items-start justify-between text-[8px] text-falcon-neutral-700"` |
| 538 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 467 | `<div class="w-full max-w-[180px]">` |
| 539 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 470 | `<span class="text-[10px] font-medium text-falcon-neutral-900">General</span>` |
| 540 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 475 | `<span class="text-[10px] font-medium text-falcon-teal-500">Security</span>` |
| 541 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 478 | `<span class="text-[9px] text-falcon-neutral-700 leading-tight">Two-factor authen` |
| 542 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 481 | `<span class="text-[10px] font-medium text-falcon-neutral-900">Billing</span>` |
| 543 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 498 | `<div class="w-full max-w-[180px]">` |
| 544 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 501 | `<span class="text-[10px] font-medium text-falcon-neutral-900">Project Falcon</sp` |
| 545 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 504 | `<span class="text-[9px] text-falcon-neutral-700 leading-tight">Cross-framework U` |
| 546 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 505 | `<span class="mt-1 inline-flex items-center w-fit h-3 px-1 rounded-full text-[7px` |
| 547 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 520 | `<div class="w-full max-w-[180px]">` |
| 548 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 523 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Revenue</span>` |
| 549 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 526 | `<span class="text-[14px] font-medium text-falcon-neutral-900 leading-none">$24.6` |
| 550 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 528 | `<span class="inline-flex items-center gap-0.5 text-[8px] text-falcon-green-700 f` |
| 551 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 552 | `<div class="w-full max-w-[180px]">` |
| 552 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 555 | `<span class="text-[9px] font-medium text-falcon-neutral-900">May 2026</span>` |
| 553 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 561 | `<div class="grid grid-cols-7 gap-0.5 text-[7px] text-falcon-neutral-475 text-cen` |
| 554 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 565 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 555 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 566 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 556 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 567 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 557 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 568 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 558 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 569 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 559 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 570 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 560 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 571 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 561 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 574 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 562 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 575 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 563 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 576 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 564 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 577 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 565 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 578 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 566 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 579 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 567 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 580 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 568 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 583 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 569 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 584 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 570 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 585 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 571 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 586 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 572 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 587 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 573 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 588 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 574 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 589 | `<span class="inline-flex items-center justify-center h-3.5 w-full rounded-full t` |
| 575 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 608 | `<div class="w-full max-w-[180px]">` |
| 576 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 611 | `<span class="text-[9px] text-falcon-neutral-0">Tooltip text</span>` |
| 577 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 631 | `<div class="w-full max-w-[180px]">` |
| 578 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 635 | `<span class="text-[10px] font-medium text-falcon-neutral-900">Verify email</span` |
| 579 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 637 | `<span class="text-[9px] text-falcon-neutral-700 leading-tight truncate">We sent ` |
| 580 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 639 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 581 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 640 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 582 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 641 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 583 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 642 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 584 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 643 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 585 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 644 | `<span class="inline-flex items-center justify-center h-5 w-3.5 rounded-sm text-[` |
| 586 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 647 | `<span class="inline-flex items-center justify-center h-4 px-2 rounded-sm bg-falc` |
| 587 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 664 | `<div class="w-full max-w-[180px]">` |
| 588 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 670 | `<path d="M32 6 L60 56 L4 56 Z" fill="var(--color-falcon-red-500,#e63946)" />` |
| 589 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 675 | `<span class="text-[9px] font-semibold text-falcon-neutral-900 leading-none">Insu` |
| 590 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 680 | `<span class="text-[7px] text-falcon-neutral-500">1</span>` |
| 591 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 681 | `<span class="text-falcon-neutral-400 text-[8px]">â‹®â‹®</span>` |
| 592 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 682 | `<span class="text-[8px] font-medium text-falcon-neutral-900 truncate">WhatsApp</` |
| 593 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 685 | `<span class="text-[7px] text-falcon-neutral-500">2</span>` |
| 594 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 686 | `<span class="text-falcon-neutral-400 text-[8px]">â‹®â‹®</span>` |
| 595 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 687 | `<span class="text-[8px] font-medium text-falcon-neutral-900 truncate">Voice</spa` |
| 596 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 690 | `<span class="text-[7px] text-falcon-neutral-500">3</span>` |
| 597 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 691 | `<span class="text-falcon-neutral-400 text-[8px]">â‹®â‹®</span>` |
| 598 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 692 | `<span class="text-[8px] font-medium text-falcon-neutral-900 truncate">AI-ChatGPT` |
| 599 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 697 | `<span class="inline-flex items-center justify-center h-3 px-1.5 rounded-sm bg-fa` |
| 600 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 698 | `<span class="inline-flex items-center justify-center h-3 px-1.5 rounded-sm bg-fa` |
| 601 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 716 | `<div class="w-full max-w-[180px]">` |
| 602 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 718 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Attachments</span>` |
| 603 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 721 | `<span class="text-[9px] font-medium text-falcon-teal-700">Drop files here</span>` |
| 604 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 722 | `<span class="text-[8px] text-falcon-neutral-700">or click to browse</span>` |
| 605 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 738 | `<div class="w-full max-w-[180px]">` |
| 606 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 740 | `<span class="text-[9px] font-medium text-falcon-neutral-700">Avatar</span>` |
| 607 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 744 | `<span class="text-[9px] font-medium text-falcon-neutral-900 truncate">Choose a f` |
| 608 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 745 | `<span class="text-[8px] text-falcon-neutral-475 truncate">PNG Â· JPG up to 2MB</` |
| 609 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 27 | `background-color: var(--color-falcon-neutral-0, #f5f5f5);` |
| 610 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 35 | `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);` |
| 611 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 42 | `color: var(--color-falcon-red-500, #e74c3c);` |
| 612 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 49 | `color: var(--color-falcon-neutral-900, #333);` |
| 613 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 55 | `color: var(--color-falcon-neutral-600, #666);` |
| 614 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 62 | `background-color: var(--color-falcon-teal-700, #007bff);` |
| 615 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 70 | `background-color: var(--color-falcon-teal-800, #0056b3);` |
| 616 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 19 | `<div class="sidebar-logo flex items-center gap-2.5 text-xl font-bold tracking-[0` |
| 617 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 25 | `<span class="text-lg leading-none tracking-[0.06em]">{{ brandText() }}</span>` |
| 618 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 186 | `return `${base} text-[11px] font-medium text-white/40 tracking-[0.02em] px-3 pt-` |
| 619 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 193 | `'nav-item flex items-center gap-2.5 mb-0.5 rounded-sm w-full text-start text-[13` |
| 620 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 197 | `/*** W18: React `.nav-item { padding: 9px 10px }` â†’ `px-2.5 py-[9px]` for exac` |
| 621 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 198 | `const padding = this.collapsed() ? 'p-2.5 justify-center' : 'px-2.5 py-[9px]';` |
| 622 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 27 | `<div class="topbar-actions flex items-center gap-[18px] shrink-0">` |
| 623 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 30 | `class="icon-btn relative grid place-items-center size-[38px] rounded-[10px] text` |
| 624 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 30 | `class="icon-btn relative grid place-items-center size-[38px] rounded-[10px] text` |
| 625 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 41 | `class="icon-btn relative grid place-items-center size-[38px] rounded-[10px] text` |
| 626 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 41 | `class="icon-btn relative grid place-items-center size-[38px] rounded-[10px] text` |
| 627 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 51 | `<div class="topbar-divider w-px h-[30px] bg-falcon-neutral-200"></div>` |
| 628 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 62 | `<rect width="40" height="40" fill="#cfd8dc"/>` |
| 629 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 63 | `<circle cx="20" cy="16" r="7" fill="#8a9ea7"/>` |
| 630 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 64 | `<path d="M7 37c0-7 6-11 13-11s13 4 13 11" fill="#8a9ea7"/>` |
| 631 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 68 | `<div class="user-name text-[13px] font-semibold text-falcon-neutral-900 leading-` |
| 632 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 69 | `<div class="user-job text-[11px] font-medium text-falcon-neutral-600 leading-[1.` |
| 633 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 78 | `<div class="user-menu absolute top-[calc(100%+8px)] end-0 w-[260px] z-[200] over` |
| 634 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 78 | `<div class="user-menu absolute top-[calc(100%+8px)] end-0 w-[260px] z-[200] over` |
| 635 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 78 | `<div class="user-menu absolute top-[calc(100%+8px)] end-0 w-[260px] z-[200] over` |
| 636 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 79 | `<div class="user-menu-head flex items-center gap-2.5 p-2.5 mb-1.5 rounded-[10px]` |
| 637 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 79 | `<div class="user-menu-head flex items-center gap-2.5 p-2.5 mb-1.5 rounded-[10px]` |
| 638 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 82 | `<rect width="40" height="40" fill="#cfd8dc"/>` |
| 639 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 83 | `<circle cx="20" cy="16" r="7" fill="#8a9ea7"/>` |
| 640 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 84 | `<path d="M7 37c0-7 6-11 13-11s13 4 13 11" fill="#8a9ea7"/>` |
| 641 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 88 | `<div class="user-name text-[13px] font-semibold text-white leading-[1.3] truncat` |
| 642 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 89 | `<div class="user-job text-[11px] text-white/75 leading-[1.3] truncate">{{ effect` |
| 643 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 95 | `class="user-menu-item flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text` |
| 644 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 106 | `<span class="sub block text-[11px] text-falcon-neutral-600">{{ languageLabelKey(` |
| 645 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 110 | `<div class="user-menu-item flex items-center gap-3 w-full px-3 py-2.5 rounded-lg` |
| 646 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 117 | `<div class="mood-toggle inline-flex bg-falcon-teal-700 text-white rounded-full p` |
| 647 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 156 | `class="user-menu-item danger flex items-center gap-3 w-full px-3 py-2.5 rounded-` |
| 648 | `apps/host-shell/src/app/playground/playground.page.html` | 2390 | `<code class="text-[11px] text-falcon-teal-500 font-medium" data-hover-chain-item` |
| 649 | `apps/host-shell/src/app/playground/playground.page.html` | 2396 | `<div class="text-[11px] text-falcon-neutral-475 mt-1">` |
| 650 | `apps/host-shell/src/app/playground/playground.page.html` | 2469 | `<div class="text-[11px] text-falcon-neutral-475 font-mono" data-tree-prog-log="t` |
| 651 | `apps/host-shell/src/app/playground/playground.page.html` | 3929 | `<div class="min-h-[480px] max-h-[640px]">` |
| 652 | `apps/host-shell/src/app/playground/playground.page.html` | 3953 | `<div class="min-h-[480px] max-h-[640px]">` |
| 653 | `apps/host-shell/src/app/playground/playground.page.html` | 3978 | `<div class="min-h-[480px] max-h-[640px]">` |
| 654 | `apps/host-shell/src/app/playground/playground.page.html` | 4002 | `<div class="min-h-[480px] max-h-[640px]">` |
| 655 | `apps/host-shell/src/app/playground/playground.page.html` | 4025 | `<div class="min-h-[480px] max-h-[640px]" dir="rtl">` |
| 656 | `apps/host-shell/src/app/playground/playground.page.html` | 4049 | `<div class="min-h-[480px] max-h-[640px]">` |
| 657 | `apps/host-shell/src/app/remote-route.service.ts` | 23 | `//     console.log('%c[REMOTE-ROUTES]', 'color:#7b1fa2;font-weight:bold;', ...ar` |
| 658 | `apps/host-shell/src/app/remote-route.service.ts` | 198 | `console.log('%c[REMOTE-ROUTES]', 'color:#7b1fa2;font-weight:bold;', ...args);` |
| 659 | `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` | 87 | `class: 'block w-[272px] h-full min-h-0 shrink-0',` |
| 660 | `libs/falcon/src/shared-ui/index.ts` | 191 | `// Segmented-pill toggle (List/Tree, Grid/List, etc). Container: bg-neutral-50` |
| 661 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html` | 6 | `<label class="text-xs font-medium text-[var(--text-2,#3d3d3d)] flex items-center` |
| 662 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html` | 24 | `<span class="text-2xs text-[var(--text-muted,#6b7280)] leading-[1.3]">` |
| 663 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 2 | `<div class="fpu-block flex items-center justify-between gap-4 rounded-sm px-5 py` |
| 664 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 14 | `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d3f44" str` |
| 665 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 23 | `class="fpu-avatar-edit absolute -top-1 -right-1 grid place-items-center w-[22px]` |
| 666 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 23 | `class="fpu-avatar-edit absolute -top-1 -right-1 grid place-items-center w-[22px]` |
| 667 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 23 | `class="fpu-avatar-edit absolute -top-1 -right-1 grid place-items-center w-[22px]` |
| 668 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 33 | `class="fpu-avatar-delete absolute -bottom-1 -right-1 grid place-items-center w-[` |
| 669 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 33 | `class="fpu-avatar-delete absolute -bottom-1 -right-1 grid place-items-center w-[` |
| 670 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 33 | `class="fpu-avatar-delete absolute -bottom-1 -right-1 grid place-items-center w-[` |
| 671 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 45 | `<span class="text-sm font-semibold text-[var(--text,#1a1a1a)] leading-[1.3]">` |
| 672 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 48 | `<span class="text-xs text-[var(--text-muted,#6b7280)] leading-[1.3]">` |
| 673 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 56 | `<span class="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted,#6b` |
| 674 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 65 | `class="fpu-btn h-[34px] inline-flex items-center justify-center rounded-md bg-[v` |
| 675 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 65 | `class="fpu-btn h-[34px] inline-flex items-center justify-center rounded-md bg-[v` |
| 676 | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.html` | 76 | `<div class="flex-shrink-0 flex justify-end items-center gap-2 px-6 py-4 bg-white` |
| 677 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` | 33 | `<i class="falcon-icon falcon-icon-chevron-right text-[8px]" aria-hidden="true"><` |
| 678 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` | 42 | `<span class="client-logo grid place-items-center shrink-0 w-[26px] h-[26px] roun` |
| 679 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` | 49 | `<span class="client-logo grid place-items-center shrink-0 w-[26px] h-[26px] roun` |
| 680 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` | 70 | `<i class="falcon-icon falcon-icon-ellipsis-v text-[10px]" aria-hidden="true"></i` |
| 681 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 2 | `<aside class="bg-falcon-teal-50 border border-falcon-neutral-200 rounded-[14px] ` |
| 682 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 2 | `<aside class="bg-falcon-teal-50 border border-falcon-neutral-200 rounded-[14px] ` |
| 683 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 37 | `<span class="grid place-items-center w-7 h-7 rounded-full text-white text-[10px]` |
| 684 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 48 | `<span class="text-[15px] font-semibold truncate" [title]="displayName()">{{ disp` |
| 685 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 60 | `class="inline-flex items-center justify-center w-[22px] h-[22px] border-0 bg-tra` |
| 686 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | 63 | `<i class="falcon-icon falcon-icon-ellipsis-v text-[10px]" aria-hidden="true"></i` |
| 687 | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` | 8 | `? 'bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]'` |
| 688 | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` | 32 | `<i class="falcon-icon falcon-icon-{{ opt.icon }} text-[12px]" aria-hidden="true"` |
| 689 | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.ts` | 9 | `***   - Active button: bg white + text teal-700 + subtle shadow (0 1px 3px rgba(` |
| 690 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 54 | `<circle cx="49" cy="49" r="49" fill="#E8F2EC"/>` |
| 691 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 55 | `<path d="M47.9794 17.2102C47.5452 17.3216 47.0219 17.4997 46.8103 17.6111C46.420` |
| 692 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 57 | `<path d="M24.9056 33.0659C23.1798 34.3018 21.7546 35.3373 21.7657 35.393C21.7657` |
| 693 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 58 | `<path d="M70.8828 35.7494C70.8828 40.4593 70.8939 40.7265 71.0721 40.5818C71.339` |
| 694 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 60 | `<path d="M46.2592 40.0654C45.8684 39.6997 45.8684 39.1052 46.2592 38.7395C46.649` |
| 695 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 64 | `<stop offset="1" stop-color="#DAE7E8"/>` |
| 696 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 67 | `<stop stop-color="#104C54"/>` |
| 697 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 68 | `<stop offset="1" stop-color="#23A8BA"/>` |
| 698 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 96 | `<circle cx="51" cy="50" r="49" fill="#E8F2EC"/>` |
| 699 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 98 | `<circle cx="51" cy="49" r="49" fill="#104C54"/>` |
| 700 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 105 | `<rect y="54.3304" width="93.8996" height="23.3724" rx="11.6862" fill="#7C9FA4"/>` |
| 701 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 125 | `<stop offset="1" stop-color="#D7E5E6"/>` |
| 702 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 128 | `<stop stop-color="#104C54"/>` |
| 703 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 129 | `<stop offset="1" stop-color="#23A8BA"/>` |
| 704 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 158 | `<circle cx="61" cy="49" r="49" fill="#E8F2EC"/>` |
| 705 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 167 | `<path d="M66.0915 61.0193C63.6321 60.8542 61.221 61.7546 59.4849 63.4936C57.748 ` |
| 706 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 168 | `<path d="M66.5004 16C63.9818 16.0027 61.5671 17.0042 59.7862 18.7847C58.0053 20.` |
| 707 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 169 | `<path d="M53.4827 38.525C49.2698 45.0789 36.3545 58.2153 28.556 48.2913C23.5538 ` |
| 708 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 170 | `<path d="M19.0005 63.1035C26.4289 60.7536 44.7574 58.9004 44.4157 71.5173C44.196` |
| 709 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 193 | `<stop stop-color="#104C54"/>` |
| 710 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 194 | `<stop offset="1" stop-color="#23A8BA"/>` |
| 711 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 197 | `<stop stop-color="#104C54"/>` |
| 712 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 198 | `<stop offset="1" stop-color="#23A8BA"/>` |
| 713 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 202 | `<stop offset="1" stop-color="#D7E5E6"/>` |
| 714 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 206 | `<stop offset="1" stop-color="#D7E5E6"/>` |
| 715 | `libs/falcon-studio/src/lib/components/color-change-badge.component.ts` | 45 | `class="text-3xs font-mono text-falcon-neutral-500 truncate max-w-[260px]"` |
| 716 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 314 | `protected readonly pickerInitialHex = '#124c52';` |
| 717 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 66 | `const DEFAULT_INITIAL_HEX = '#3aa1a8';` |
| 718 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 128 | `placeholder="#3aa1a8"` |
| 719 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 337 | `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);` |
| 720 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 346 | `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);` |
| 721 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 360 | `hsl(0, 100%, 50%) 0%,` |
| 722 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 361 | `hsl(60, 100%, 50%) 17%,` |
| 723 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 362 | `hsl(120, 100%, 50%) 33%,` |
| 724 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 363 | `hsl(180, 100%, 50%) 50%,` |
| 725 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 364 | `hsl(240, 100%, 50%) 67%,` |
| 726 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 365 | `hsl(300, 100%, 50%) 83%,` |
| 727 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 366 | `hsl(360, 100%, 50%) 100%` |
| 728 | `libs/falcon-studio/src/lib/components/component-detail-panel.component.ts` | 30 | `class="fixed top-0 right-0 z-40 flex flex-col w-[420px] h-screen bg-falcon-neutr` |
| 729 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 99 | `class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-3` |
| 730 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 145 | `class="flex-1 flex items-center justify-center min-h-[80px] rounded-md bg-falcon` |
| 731 | `libs/falcon-studio/src/lib/components/component-popup.component.ts` | 106 | `class="rounded-lg border border-falcon-neutral-200 bg-falcon-neutral-0 shadow-fa` |
| 732 | `libs/falcon-studio/src/lib/components/context-menu.component.ts` | 63 | `class="fixed z-50 min-w-[220px] rounded-lg border border-falcon-neutral-200 bg-f` |
| 733 | `libs/falcon-studio/src/lib/components/context-menu.component.ts` | 105 | `<span class="inline-block w-[14px] h-[14px]" aria-hidden="true"></span>` |
| 734 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 54 | `class="falcon-custom-composer fixed inset-y-0 right-0 z-40 flex flex-col w-[360p` |
| 735 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 22 | `background: linear-gradient(180deg, #0b1020 0%, #0f1530 100%);` |
| 736 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 45 | `background-color: var(--color-falcon-neutral-50, #f5f7f8);` |
| 737 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 46 | `border-right: 1px solid var(--color-falcon-neutral-200, #e2e8f0);` |
| 738 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 63 | `background-color: var(--color-falcon-neutral-0, #ffffff);` |
| 739 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 64 | `border-bottom: 1px solid var(--color-falcon-neutral-200, #e2e8f0);` |
| 740 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 74 | `color: var(--color-falcon-neutral-700, #334155);` |
| 741 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 83 | `background-color: var(--color-falcon-neutral-50, #f5f7f8);` |
| 742 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 86 | `background-color: var(--color-falcon-teal-tint, rgba(45, 212, 217, 0.15));` |
| 743 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 87 | `color: var(--color-falcon-teal-700, #104c54);` |
| 744 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 88 | `box-shadow: inset 0 -2px 0 0 var(--color-falcon-teal-500, #2dd4d9);` |
| 745 | `libs/falcon-studio/src/lib/components/falcon-studio.component.css` | 127 | `/*outline: 2px solid var(--color-falcon-teal-500, #2dd4d9);*/` |
| 746 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 37 | `iconColor: '#0f172a',` |
| 747 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 38 | `trendSuccess: '#16a34a',` |
| 748 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 39 | `trendDanger: '#dc2626',` |
| 749 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 45 | `iconColor: '#166534',` |
| 750 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 46 | `trendSuccess: '#16a34a',` |
| 751 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 47 | `trendDanger: '#dc2626',` |
| 752 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 53 | `iconColor: '#92400e',` |
| 753 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 54 | `trendSuccess: '#16a34a',` |
| 754 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 55 | `trendDanger: '#dc2626',` |
| 755 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 61 | `iconColor: '#991b1b',` |
| 756 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 62 | `trendSuccess: '#16a34a',` |
| 757 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 63 | `trendDanger: '#dc2626',` |
| 758 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 69 | `iconColor: '#1e3a8a',` |
| 759 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 70 | `trendSuccess: '#16a34a',` |
| 760 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 71 | `trendDanger: '#dc2626',` |
| 761 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 77 | `iconColor: '#713f12',` |
| 762 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 78 | `trendSuccess: '#16a34a',` |
| 763 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 79 | `trendDanger: '#dc2626',` |
| 764 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 160 | `box-shadow: var(--shadow-falcon-lg, 0 16px 40px rgba(15, 23, 42, 0.12));` |
| 765 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 179 | `return 'var(--color-falcon-neutral-0, #ffffff)';` |
| 766 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 187 | `return '1px solid var(--color-falcon-neutral-200, #e5e7eb)';` |
| 767 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 202 | `if (this.trend() === 'flat') return 'var(--color-falcon-neutral-600, #475569)';` |
| 768 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 209 | `() => 'var(--shadow-falcon-md, 0 8px 24px rgba(15,23,42,0.08))',` |
| 769 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 213 | `if (this.trend() === 'down') return 'rgba(220, 38, 38, 0.12)';` |
| 770 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 214 | `if (this.trend() === 'flat') return 'rgba(71, 85, 105, 0.12)';` |
| 771 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 215 | `return 'rgba(22, 163, 74, 0.12)';` |
| 772 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 594 | `const tints = ['#f3f6f7', '#eaf1f2', '#dde8e9', '#cfe0e2', '#b9d4d6'] as const;` |
| 773 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 643 | `const tints = ['#f3f6f7', '#eaf1f2', '#dde8e9', '#cfe0e2', '#b9d4d6'] as const;` |
| 774 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 704 | `const tints = ['#cfe0e2', '#7ab3b6', '#3a7c80', '#0d3f44', '#062628'] as const;` |
| 775 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 757 | `const reds = ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#991b1b'] as const;` |
| 776 | `libs/falcon-studio/src/lib/components/scope-chooser.component.ts` | 59 | `class="fixed z-falcon-popover w-[340px] rounded-lg border border-falcon-neutral-` |
| 777 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 433 | `border-bottom: 1px solid var(--color-falcon-neutral-200, #e5e7eb);` |
| 778 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 442 | `box-shadow: inset 0 0 0 0 rgba(20, 184, 166, 0);` |
| 779 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 445 | `box-shadow: inset 0 0 0 3px rgba(20, 184, 166, 0.45);` |
| 780 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 448 | `box-shadow: inset 0 0 0 0 rgba(20, 184, 166, 0);` |
| 781 | `libs/falcon-studio/src/lib/components/token-editor-color.component.ts` | 10 | `/*** that <input type="color"> understands. Falls back to #000000 on failure. **` |
| 782 | `libs/falcon-studio/src/lib/components/token-editor-color.component.ts` | 12 | `if (!color) return '#000000';` |
| 783 | `libs/falcon-studio/src/lib/components/token-editor-color.component.ts` | 21 | `if (typeof document === 'undefined') return '#000000';` |
| 784 | `libs/falcon-studio/src/lib/components/token-editor-color.component.ts` | 29 | `if (!m) return '#000000';` |
| 785 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 110 | `'--color-falcon-neutral-0': '#ffffff',` |
| 786 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 111 | `'--color-falcon-neutral-50': '#f5f7f8',` |
| 787 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 112 | `'--color-falcon-neutral-100': '#f1f3f5',` |
| 788 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 113 | `'--color-falcon-neutral-200': '#e5e7eb',` |
| 789 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 114 | `'--color-falcon-teal-500': '#0d9488',` |
| 790 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 115 | `'--color-falcon-teal-600': '#0d6e6a',` |
| 791 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 116 | `'--color-falcon-teal-700': '#104c54',` |
| 792 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 117 | `'--shadow-falcon-sm': '0 1px 2px rgba(15, 23, 42, 0.04)',` |
| 793 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 118 | `'--shadow-falcon-md': '0 4px 12px rgba(15, 23, 42, 0.06)',` |
| 794 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 119 | `'--shadow-falcon-lg': '0 10px 24px rgba(15, 23, 42, 0.08)',` |
| 795 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 135 | `'--color-falcon-neutral-0': '#fafbfa',` |
| 796 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 136 | `'--color-falcon-neutral-50': '#f3f6f4',` |
| 797 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 137 | `'--color-falcon-teal-500': '#5b8b7a',` |
| 798 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 138 | `'--color-falcon-teal-600': '#476f61',` |
| 799 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 139 | `'--color-falcon-teal-700': '#345148',` |
| 800 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 140 | `'--shadow-falcon-sm': '0 1px 2px rgba(40, 60, 50, 0.05)',` |
| 801 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 141 | `'--shadow-falcon-md': '0 4px 12px rgba(40, 60, 50, 0.06)',` |
| 802 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 142 | `'--shadow-falcon-lg': '0 10px 24px rgba(40, 60, 50, 0.08)',` |
| 803 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 161 | `'--color-falcon-neutral-0': '#ffffff',` |
| 804 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 162 | `'--color-falcon-neutral-50': '#f5f7f8',` |
| 805 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 163 | `'--color-falcon-neutral-900': '#0a0a0a',` |
| 806 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 164 | `'--color-falcon-teal-500': '#06b6b8',` |
| 807 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 165 | `'--color-falcon-teal-600': '#067a7d',` |
| 808 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 166 | `'--color-falcon-teal-700': '#055e60',` |
| 809 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 167 | `'--shadow-falcon-sm': '0 2px 4px rgba(0, 0, 0, 0.10)',` |
| 810 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 168 | `'--shadow-falcon-md': '0 8px 18px rgba(0, 0, 0, 0.16)',` |
| 811 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 169 | `'--shadow-falcon-lg': '0 16px 36px rgba(0, 0, 0, 0.22)',` |
| 812 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 187 | `'--color-falcon-neutral-0': '#fdfdfb',` |
| 813 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 188 | `'--color-falcon-neutral-50': '#f7f4ee',` |
| 814 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 189 | `'--color-falcon-neutral-100': '#efeae0',` |
| 815 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 190 | `'--color-falcon-teal-500': '#1a5e62',` |
| 816 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 191 | `'--color-falcon-teal-600': '#114449',` |
| 817 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 192 | `'--color-falcon-teal-700': '#0a3033',` |
| 818 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 193 | `'--shadow-falcon-sm': '0 2px 6px rgba(15, 23, 42, 0.10)',` |
| 819 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 194 | `'--shadow-falcon-md': '0 12px 32px rgba(15, 23, 42, 0.14)',` |
| 820 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 195 | `'--shadow-falcon-lg': '0 24px 56px rgba(15, 23, 42, 0.20)',` |
| 821 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 214 | `'--color-falcon-neutral-0': '#0b1020',` |
| 822 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 215 | `'--color-falcon-neutral-50': '#111933',` |
| 823 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 216 | `'--color-falcon-neutral-100': '#162042',` |
| 824 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 217 | `'--color-falcon-neutral-200': '#243056',` |
| 825 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 218 | `'--color-falcon-neutral-300': '#324070',` |
| 826 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 219 | `'--color-falcon-neutral-600': '#9aa6c2',` |
| 827 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 220 | `'--color-falcon-neutral-700': '#c1cae0',` |
| 828 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 221 | `'--color-falcon-neutral-900': '#f2f4fb',` |
| 829 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 222 | `'--color-falcon-teal-500': '#3ee0c4',` |
| 830 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 223 | `'--color-falcon-teal-700': '#22b099',` |
| 831 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 224 | `'--shadow-falcon-sm': '0 1px 2px rgba(0, 0, 0, 0.40)',` |
| 832 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 225 | `'--shadow-falcon-md': '0 8px 24px rgba(0, 0, 0, 0.50)',` |
| 833 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 226 | `'--shadow-falcon-lg': '0 16px 40px rgba(0, 0, 0, 0.60)',` |
| 834 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 274 | `'--shadow-falcon-sm': '0 1px 2px rgba(15, 23, 42, 0.04)',` |
| 835 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 275 | `'--shadow-falcon-md': '0 4px 12px rgba(15, 23, 42, 0.06)',` |
| 836 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 276 | `'--shadow-falcon-lg': '0 10px 24px rgba(15, 23, 42, 0.08)',` |
| 837 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 280 | `'--shadow-falcon-sm': '0 2px 4px rgba(15, 23, 42, 0.10)',` |
| 838 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 281 | `'--shadow-falcon-md': '0 8px 18px rgba(15, 23, 42, 0.16)',` |
| 839 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 282 | `'--shadow-falcon-lg': '0 16px 36px rgba(15, 23, 42, 0.22)',` |
| 840 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 378 | `'--color-falcon-teal-500': '#06b6b8',` |
| 841 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 379 | `'--color-falcon-teal-600': '#067a7d',` |
| 842 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 380 | `'--color-falcon-teal-700': '#055e60',` |
| 843 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 381 | `'--color-falcon-cyan': '#22d3ee',` |
| 844 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 385 | `'--color-falcon-teal-500': '#124c52',` |
| 845 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 386 | `'--color-falcon-teal-600': '#104c54',` |
| 846 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 387 | `'--color-falcon-teal-700': '#0d3f44',` |
| 847 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 388 | `'--color-falcon-cyan': '#2dd4d9',` |
| 848 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 427 | `'--shadow-falcon-focus': '0 0 0 4px rgba(13, 63, 68, 0.32)',` |
| 849 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 428 | `'--shadow-falcon-focus-strong': '0 0 0 3px rgba(13, 63, 68, 0.45)',` |
| 850 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 432 | `'--shadow-falcon-focus': '0 0 0 3px rgba(13, 63, 68, 0.12)',` |
| 851 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 433 | `'--shadow-falcon-focus-strong': '0 0 0 2px rgba(13, 63, 68, 0.15)',` |
| 852 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 475 | `'--color-falcon-red-500': '#ef4444',` |
| 853 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 476 | `'--color-falcon-red-700': '#b91c1c',` |
| 854 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 480 | `'--color-falcon-red-500': '#dc2626',` |
| 855 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 481 | `'--color-falcon-red-700': '#a1191d',` |
| 856 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 552 | `{ sm: '0 0 0 rgba(0,0,0,0)',                 md: '0 0 0 rgba(0,0,0,0)',         ` |
| 857 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 553 | `{ sm: '0 1px 2px rgba(15,23,42,0.04)',       md: '0 4px 8px rgba(15,23,42,0.06)'` |
| 858 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 554 | `{ sm: '0 1px 2px rgba(15,23,42,0.06)',       md: '0 10px 24px rgba(15,23,42,0.10` |
| 859 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 555 | `{ sm: '0 2px 4px rgba(15,23,42,0.10)',       md: '0 12px 32px rgba(15,23,42,0.14` |
| 860 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 556 | `{ sm: '0 4px 8px rgba(15,23,42,0.14)',       md: '0 18px 48px rgba(15,23,42,0.20` |
| 861 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 629 | `{ n0: '#1f2937', n50: '#1f2937', n100: '#374151' },` |
| 862 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 630 | `{ n0: '#e5e7eb', n50: '#d1d5db', n100: '#cbd5e1' },` |
| 863 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 631 | `{ n0: '#ffffff', n50: '#f5f7f8', n100: '#f1f3f5' },` |
| 864 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 632 | `{ n0: '#ffffff', n50: '#fafbfc', n100: '#f5f7f8' },` |
| 865 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 633 | `{ n0: '#ffffff', n50: '#ffffff', n100: '#fafbfc' },` |
| 866 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 653 | `{ t500: '#5b6e72', t600: '#475557', t700: '#34403e' },` |
| 867 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 654 | `{ t500: '#356165', t600: '#28494b', t700: '#1c3537' },` |
| 868 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 655 | `{ t500: '#124c52', t600: '#104c54', t700: '#0d3f44' },` |
| 869 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 656 | `{ t500: '#0a8389', t600: '#066369', t700: '#054d52' },` |
| 870 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 657 | `{ t500: '#06b6b8', t600: '#067a7d', t700: '#055e60' },` |
| 871 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 717 | `'0 0 0 1px rgba(13, 63, 68, 0.10)',` |
| 872 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 718 | `'0 0 0 2px rgba(13, 63, 68, 0.12)',` |
| 873 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 719 | `'0 0 0 3px rgba(13, 63, 68, 0.16)',` |
| 874 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 720 | `'0 0 0 4px rgba(13, 63, 68, 0.28)',` |
| 875 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` | 721 | `'0 0 0 5px rgba(13, 63, 68, 0.40)',` |
| 876 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 50 | `{ id: '50',  tokenName: '--color-falcon-teal-50',  hex: '#f3f8f5' },` |
| 877 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 51 | `{ id: '100', tokenName: '--color-falcon-teal-100', hex: '#e8f0f1' },` |
| 878 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 52 | `{ id: '200', tokenName: '--color-falcon-teal-200', hex: '#d1e0e2' },` |
| 879 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 53 | `{ id: '300', tokenName: '--color-falcon-teal-300', hex: '#a8bec0' },` |
| 880 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 54 | `{ id: '400', tokenName: '--color-falcon-teal-400', hex: '#698e92' },` |
| 881 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 55 | `{ id: '500', tokenName: '--color-falcon-teal-500', hex: '#124c52' },` |
| 882 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 56 | `{ id: '600', tokenName: '--color-falcon-teal-600', hex: '#104c54' },` |
| 883 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 57 | `{ id: '700', tokenName: '--color-falcon-teal-700', hex: '#0d3f44' },` |
| 884 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 58 | `{ id: '800', tokenName: '--color-falcon-teal-800', hex: '#0a3338' },` |
| 885 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 59 | `{ id: '900', tokenName: '--color-falcon-teal-900', hex: '#082a2e' },` |
| 886 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 66 | `{ id: '50',  tokenName: '--color-falcon-green-50',  hex: '#d9f2e4' },` |
| 887 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 67 | `{ id: '100', tokenName: '--color-falcon-green-100', hex: '#dfece6' },` |
| 888 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 68 | `{ id: '200', tokenName: '--color-falcon-green-200', hex: '#d9ebe3' },` |
| 889 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 69 | `{ id: '500', tokenName: '--color-falcon-green-500', hex: '#16a34a' },` |
| 890 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 70 | `{ id: '700', tokenName: '--color-falcon-green-700', hex: '#0f7a3a' },` |
| 891 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 77 | `{ id: '50',  tokenName: '--color-falcon-red-50',  hex: '#fef5f5' },` |
| 892 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 78 | `{ id: '100', tokenName: '--color-falcon-red-100', hex: '#fde2e4' },` |
| 893 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 79 | `{ id: '500', tokenName: '--color-falcon-red-500', hex: '#dc2626' },` |
| 894 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 80 | `{ id: '700', tokenName: '--color-falcon-red-700', hex: '#a1191d' },` |
| 895 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 81 | `{ id: '900', tokenName: '--color-falcon-red-900', hex: '#7f1d1d' },` |
| 896 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 88 | `{ id: '50',  tokenName: '--color-falcon-amber-50',  hex: '#ffeccb' },` |
| 897 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 89 | `{ id: '500', tokenName: '--color-falcon-amber-500', hex: '#f59e0b' },` |
| 898 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 90 | `{ id: '700', tokenName: '--color-falcon-amber-700', hex: '#a85a00' },` |
| 899 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 97 | `{ id: '500', tokenName: '--color-falcon-blue-500', hex: '#0ea5e9' },` |
| 900 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 104 | `{ id: '25',  tokenName: '--color-falcon-lilac-25',  hex: '#f8f8fc' },` |
| 901 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 105 | `{ id: '100', tokenName: '--color-falcon-lilac-100', hex: '#e8e8f0' },` |
| 902 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 106 | `{ id: '450', tokenName: '--color-falcon-lilac-450', hex: '#7c82a9' },` |
| 903 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 107 | `{ id: '500', tokenName: '--color-falcon-lilac-500', hex: '#8b8fc8' },` |
| 904 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 114 | `{ id: '100', tokenName: '--color-falcon-mint-100', hex: '#d9e6dd' },` |
| 905 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 115 | `{ id: '200', tokenName: '--color-falcon-mint-200', hex: '#b9d4c3' },` |
| 906 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 128 | `{ id: '0',   tokenName: '--color-falcon-neutral-0',   hex: '#ffffff' },` |
| 907 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 129 | `{ id: '50',  tokenName: '--color-falcon-neutral-50',  hex: '#f5f7f8' },` |
| 908 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 130 | `{ id: '100', tokenName: '--color-falcon-neutral-100', hex: '#f1f3f5' },` |
| 909 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 131 | `{ id: '200', tokenName: '--color-falcon-neutral-200', hex: '#e5e7eb' },` |
| 910 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 132 | `{ id: '300', tokenName: '--color-falcon-neutral-300', hex: '#d4d8dc' },` |
| 911 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 133 | `{ id: '400', tokenName: '--color-falcon-neutral-400', hex: '#c7ced4' },` |
| 912 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 134 | `{ id: '500', tokenName: '--color-falcon-neutral-500', hex: '#9ca3af' },` |
| 913 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 135 | `{ id: '600', tokenName: '--color-falcon-neutral-600', hex: '#6b7280' },` |
| 914 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 136 | `{ id: '700', tokenName: '--color-falcon-neutral-700', hex: '#5a6470' },` |
| 915 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 137 | `{ id: '800', tokenName: '--color-falcon-neutral-800', hex: '#3d3d3d' },` |
| 916 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 138 | `{ id: '900', tokenName: '--color-falcon-neutral-900', hex: '#1a1a1a' },` |
| 917 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` | 139 | `{ id: '950', tokenName: '--color-falcon-neutral-950', hex: '#000000' },` |
| 918 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 366 | `['--falcon-{type}-shadow', '0 1px 2px rgba(0, 0, 0, 0.06)'],` |
| 919 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 367 | `['--falcon-{type}-shadow-hover', '0 2px 4px rgba(0, 0, 0, 0.08)'],` |
| 920 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 375 | `['--falcon-{type}-shadow', '0 4px 12px rgba(0, 0, 0, 0.10)'],` |
| 921 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 376 | `['--falcon-{type}-shadow-hover', '0 6px 16px rgba(0, 0, 0, 0.14)'],` |
| 922 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 384 | `['--falcon-{type}-shadow', '0 10px 28px rgba(0, 0, 0, 0.18)'],` |
| 923 | `libs/falcon-studio/src/lib/registry/common-actions.config.ts` | 385 | `['--falcon-{type}-shadow-hover', '0 14px 32px rgba(0, 0, 0, 0.22)'],` |
| 924 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 32 | `{ name: '--falcon-accordion-chevron-color', defaultValue: 'var(--color-falcon-ne` |
| 925 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 33 | `{ name: '--falcon-accordion-chevron-color-expanded', defaultValue: 'var(--color-` |
| 926 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 34 | `{ name: '--falcon-accordion-chevron-color-hover', defaultValue: 'var(--color-fal` |
| 927 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 42 | `{ name: '--falcon-accordion-bg', defaultValue: 'var(--color-falcon-neutral-0, #f` |
| 928 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 43 | `{ name: '--falcon-accordion-border-color', defaultValue: 'var(--color-falcon-neu` |
| 929 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 52 | `{ name: '--falcon-accordion-description-color', defaultValue: 'var(--color-falco` |
| 930 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 61 | `{ name: '--falcon-accordion-focus-ring-color', defaultValue: 'var(--color-falcon` |
| 931 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 67 | `{ name: '--falcon-accordion-header-color', defaultValue: 'var(--color-falcon-neu` |
| 932 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 68 | `{ name: '--falcon-accordion-header-color-disabled', defaultValue: 'var(--color-f` |
| 933 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 69 | `{ name: '--falcon-accordion-header-color-expanded', defaultValue: 'var(--color-f` |
| 934 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 70 | `{ name: '--falcon-accordion-header-color-hover', defaultValue: 'var(--color-falc` |
| 935 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 89 | `{ name: '--falcon-accordion-error-color', defaultValue: 'var(--color-falcon-red-` |
| 936 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 95 | `{ name: '--falcon-accordion-helper-color', defaultValue: 'var(--color-falcon-neu` |
| 937 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 101 | `{ name: '--falcon-accordion-icon-color', defaultValue: 'var(--color-falcon-neutr` |
| 938 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 102 | `{ name: '--falcon-accordion-icon-color-expanded', defaultValue: 'var(--color-fal` |
| 939 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 108 | `{ name: '--falcon-accordion-item-bg-disabled', defaultValue: 'var(--color-falcon` |
| 940 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 109 | `{ name: '--falcon-accordion-item-bg-expanded', defaultValue: 'var(--color-falcon` |
| 941 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 110 | `{ name: '--falcon-accordion-item-bg-hover', defaultValue: 'var(--color-falcon-ne` |
| 942 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 111 | `{ name: '--falcon-accordion-item-border-color', defaultValue: 'var(--color-falco` |
| 943 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 120 | `{ name: '--falcon-accordion-panel-bg', defaultValue: 'var(--color-falcon-neutral` |
| 944 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 121 | `{ name: '--falcon-accordion-panel-border-top-color', defaultValue: 'var(--color-` |
| 945 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 123 | `{ name: '--falcon-accordion-panel-color', defaultValue: 'var(--color-falcon-neut` |
| 946 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 134 | `{ name: '--falcon-accordion-separator-color', defaultValue: 'var(--color-falcon-` |
| 947 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 163 | `{ name: '--falcon-avatar-status-away', defaultValue: 'var(--color-falcon-amber-5` |
| 948 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 164 | `{ name: '--falcon-avatar-status-busy', defaultValue: 'var(--color-falcon-red-500` |
| 949 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 165 | `{ name: '--falcon-avatar-status-offline', defaultValue: 'var(--color-falcon-neut` |
| 950 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 166 | `{ name: '--falcon-avatar-status-online', defaultValue: 'var(--color-falcon-green` |
| 951 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 167 | `{ name: '--falcon-avatar-status-ring-color', defaultValue: 'var(--color-falcon-n` |
| 952 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 172 | `{ name: '--falcon-avatar-bg', defaultValue: 'var(--color-falcon-teal-500, #124c5` |
| 953 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 173 | `{ name: '--falcon-avatar-fg', defaultValue: 'var(--color-falcon-neutral-50, #fff` |
| 954 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 191 | `{ name: '--falcon-badge-danger-dot-bg', defaultValue: 'var(--color-falcon-red-50` |
| 955 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 192 | `{ name: '--falcon-badge-dot-bg', defaultValue: 'var(--color-falcon-neutral-500, ` |
| 956 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 194 | `{ name: '--falcon-badge-info-dot-bg', defaultValue: 'var(--color-falcon-blue-500` |
| 957 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 195 | `{ name: '--falcon-badge-primary-dot-bg', defaultValue: 'var(--color-falcon-teal-` |
| 958 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 196 | `{ name: '--falcon-badge-success-dot-bg', defaultValue: 'var(--color-falcon-green` |
| 959 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 197 | `{ name: '--falcon-badge-warning-dot-bg', defaultValue: 'var(--color-falcon-amber` |
| 960 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 212 | `{ name: '--falcon-badge-bg', defaultValue: 'var(--color-falcon-neutral-100, #f3f` |
| 961 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 213 | `{ name: '--falcon-badge-danger-bg', defaultValue: 'var(--color-falcon-red-100, #` |
| 962 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 214 | `{ name: '--falcon-badge-danger-fg', defaultValue: 'var(--color-falcon-red-700, #` |
| 963 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 215 | `{ name: '--falcon-badge-fg', defaultValue: 'var(--color-falcon-neutral-700, #3d3` |
| 964 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 216 | `{ name: '--falcon-badge-info-bg', defaultValue: 'var(--color-falcon-blue-100, #d` |
| 965 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 217 | `{ name: '--falcon-badge-info-fg', defaultValue: 'var(--color-falcon-blue-700, #1` |
| 966 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 218 | `{ name: '--falcon-badge-primary-bg', defaultValue: 'var(--color-falcon-teal-100,` |
| 967 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 219 | `{ name: '--falcon-badge-primary-fg', defaultValue: 'var(--color-falcon-teal-700,` |
| 968 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 220 | `{ name: '--falcon-badge-solid-fg', defaultValue: 'var(--color-falcon-neutral-50,` |
| 969 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 221 | `{ name: '--falcon-badge-success-bg', defaultValue: 'var(--color-falcon-green-200` |
| 970 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 222 | `{ name: '--falcon-badge-success-fg', defaultValue: 'var(--color-falcon-green-700` |
| 971 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 223 | `{ name: '--falcon-badge-warning-bg', defaultValue: 'var(--color-falcon-amber-50,` |
| 972 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 224 | `{ name: '--falcon-badge-warning-fg', defaultValue: 'var(--color-falcon-amber-700` |
| 973 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 246 | `{ name: '--falcon-button-danger-border', defaultValue: 'var(--color-falcon-red-5` |
| 974 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 247 | `{ name: '--falcon-button-danger-border-active', defaultValue: 'var(--color-falco` |
| 975 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 248 | `{ name: '--falcon-button-danger-border-hover', defaultValue: 'var(--color-falcon` |
| 976 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 255 | `{ name: '--falcon-button-primary-border', defaultValue: 'var(--color-falcon-teal` |
| 977 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 256 | `{ name: '--falcon-button-primary-border-active', defaultValue: 'var(--color-falc` |
| 978 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 257 | `{ name: '--falcon-button-primary-border-hover', defaultValue: 'var(--color-falco` |
| 979 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 258 | `{ name: '--falcon-button-secondary-border', defaultValue: 'var(--color-falcon-ne` |
| 980 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 259 | `{ name: '--falcon-button-secondary-border-active', defaultValue: 'var(--color-fa` |
| 981 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 260 | `{ name: '--falcon-button-secondary-border-hover', defaultValue: 'var(--color-fal` |
| 982 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 267 | `{ name: '--falcon-button-danger-bg', defaultValue: 'var(--color-falcon-red-500, ` |
| 983 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 268 | `{ name: '--falcon-button-danger-bg-active', defaultValue: 'var(--color-falcon-re` |
| 984 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 269 | `{ name: '--falcon-button-danger-bg-disabled', defaultValue: 'var(--color-falcon-` |
| 985 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 270 | `{ name: '--falcon-button-danger-bg-hover', defaultValue: 'var(--color-falcon-red` |
| 986 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 273 | `{ name: '--falcon-button-dashed-bg', defaultValue: 'var(--color-falcon-neutral-0` |
| 987 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 274 | `{ name: '--falcon-button-dashed-bg-active', defaultValue: 'var(--color-falcon-te` |
| 988 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 275 | `{ name: '--falcon-button-dashed-bg-disabled', defaultValue: 'var(--color-falcon-` |
| 989 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 276 | `{ name: '--falcon-button-dashed-bg-hover', defaultValue: 'var(--color-falcon-tea` |
| 990 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 277 | `{ name: '--falcon-button-dashed-border', defaultValue: 'var(--color-falcon-teal-` |
| 991 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 278 | `{ name: '--falcon-button-dashed-border-active', defaultValue: 'var(--color-falco` |
| 992 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 279 | `{ name: '--falcon-button-dashed-border-hover', defaultValue: 'var(--color-falcon` |
| 993 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 281 | `{ name: '--falcon-button-dashed-text', defaultValue: 'var(--color-falcon-teal-70` |
| 994 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 282 | `{ name: '--falcon-button-dashed-text-disabled', defaultValue: 'var(--color-falco` |
| 995 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 283 | `{ name: '--falcon-button-dashed-text-hover', defaultValue: 'var(--color-falcon-t` |
| 996 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 294 | `{ name: '--falcon-button-ghost-bg-active', defaultValue: 'var(--color-falcon-neu` |
| 997 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 296 | `{ name: '--falcon-button-ghost-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 998 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 319 | `{ name: '--falcon-button-primary-bg', defaultValue: 'var(--color-falcon-teal-500` |
| 999 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 320 | `{ name: '--falcon-button-primary-bg-active', defaultValue: 'var(--color-falcon-t` |
| 1000 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 321 | `{ name: '--falcon-button-primary-bg-disabled', defaultValue: 'var(--color-falcon` |
| 1001 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 322 | `{ name: '--falcon-button-primary-bg-hover', defaultValue: 'var(--color-falcon-te` |
| 1002 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 325 | `{ name: '--falcon-button-secondary-bg', defaultValue: 'var(--color-falcon-neutra` |
| 1003 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 326 | `{ name: '--falcon-button-secondary-bg-active', defaultValue: 'var(--color-falcon` |
| 1004 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 327 | `{ name: '--falcon-button-secondary-bg-disabled', defaultValue: 'var(--color-falc` |
| 1005 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 328 | `{ name: '--falcon-button-secondary-bg-hover', defaultValue: 'var(--color-falcon-` |
| 1006 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 332 | `{ name: '--falcon-button-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.18) 0 ` |
| 1007 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 333 | `{ name: '--falcon-button-shadow-focus-danger', defaultValue: 'rgba(220, 38, 38, ` |
| 1008 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 361 | `{ name: '--falcon-button-danger-text', defaultValue: 'var(--color-falcon-neutral` |
| 1009 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 362 | `{ name: '--falcon-button-danger-text-disabled', defaultValue: 'var(--color-falco` |
| 1010 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 363 | `{ name: '--falcon-button-danger-text-hover', defaultValue: 'var(--color-falcon-n` |
| 1011 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 364 | `{ name: '--falcon-button-ghost-text', defaultValue: 'var(--color-falcon-neutral-` |
| 1012 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 365 | `{ name: '--falcon-button-ghost-text-disabled', defaultValue: 'var(--color-falcon` |
| 1013 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 366 | `{ name: '--falcon-button-ghost-text-hover', defaultValue: 'var(--color-falcon-ne` |
| 1014 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 367 | `{ name: '--falcon-button-link-text', defaultValue: 'var(--color-falcon-neutral-6` |
| 1015 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 368 | `{ name: '--falcon-button-link-text-disabled', defaultValue: 'var(--color-falcon-` |
| 1016 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 369 | `{ name: '--falcon-button-link-text-hover', defaultValue: 'var(--color-falcon-tea` |
| 1017 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 370 | `{ name: '--falcon-button-primary-text', defaultValue: 'var(--color-falcon-neutra` |
| 1018 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 371 | `{ name: '--falcon-button-primary-text-disabled', defaultValue: 'var(--color-falc` |
| 1019 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 372 | `{ name: '--falcon-button-primary-text-hover', defaultValue: 'var(--color-falcon-` |
| 1020 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 373 | `{ name: '--falcon-button-secondary-text', defaultValue: 'var(--color-falcon-neut` |
| 1021 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 374 | `{ name: '--falcon-button-secondary-text-disabled', defaultValue: 'var(--color-fa` |
| 1022 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 375 | `{ name: '--falcon-button-secondary-text-hover', defaultValue: 'var(--color-falco` |
| 1023 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 390 | `{ name: '--falcon-calendar-bg', defaultValue: 'var(--color-falcon-neutral-0, #ff` |
| 1024 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 391 | `{ name: '--falcon-calendar-border-color', defaultValue: 'var(--color-falcon-neut` |
| 1025 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 394 | `{ name: '--falcon-calendar-color', defaultValue: 'var(--color-falcon-neutral-900` |
| 1026 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 398 | `{ name: '--falcon-calendar-shadow', defaultValue: '0 12px 32px rgba(13, 63, 68, ` |
| 1027 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 404 | `{ name: '--falcon-calendar-day-bg-hover', defaultValue: 'var(--color-falcon-teal` |
| 1028 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 406 | `{ name: '--falcon-calendar-day-color', defaultValue: 'var(--color-falcon-neutral` |
| 1029 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 407 | `{ name: '--falcon-calendar-day-color-hover', defaultValue: 'var(--color-falcon-t` |
| 1030 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 409 | `{ name: '--falcon-calendar-day-disabled-bg', defaultValue: 'var(--color-falcon-n` |
| 1031 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 410 | `{ name: '--falcon-calendar-day-disabled-color', defaultValue: 'var(--color-falco` |
| 1032 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 417 | `{ name: '--falcon-calendar-day-outside-color', defaultValue: 'var(--color-falcon` |
| 1033 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 419 | `{ name: '--falcon-calendar-day-selected-bg', defaultValue: 'var(--color-falcon-t` |
| 1034 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 420 | `{ name: '--falcon-calendar-day-selected-color', defaultValue: 'var(--color-falco` |
| 1035 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 424 | `{ name: '--falcon-calendar-day-today-color', defaultValue: 'var(--color-falcon-t` |
| 1036 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 426 | `{ name: '--falcon-calendar-day-today-shadow', defaultValue: 'inset 0 0 0 1px var` |
| 1037 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 427 | `{ name: '--falcon-calendar-disabled-icon-color', defaultValue: 'var(--color-falc` |
| 1038 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 433 | `{ name: '--falcon-calendar-focus-ring-color', defaultValue: 'var(--color-falcon-` |
| 1039 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 436 | `{ name: '--falcon-date-picker-error-color', defaultValue: 'var(--color-falcon-re` |
| 1040 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 437 | `{ name: '--falcon-date-picker-helper-color', defaultValue: 'var(--color-falcon-n` |
| 1041 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 460 | `{ name: '--falcon-calendar-header-title-color', defaultValue: 'var(--color-falco` |
| 1042 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 466 | `{ name: '--falcon-calendar-nav-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1043 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 468 | `{ name: '--falcon-calendar-nav-color', defaultValue: 'var(--color-falcon-neutral` |
| 1044 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 469 | `{ name: '--falcon-calendar-nav-color-hover', defaultValue: 'var(--color-falcon-t` |
| 1045 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 476 | `{ name: '--falcon-date-picker-icon-color', defaultValue: 'var(--color-falcon-neu` |
| 1046 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 481 | `{ name: '--falcon-date-picker-input-bg', defaultValue: 'var(--color-falcon-neutr` |
| 1047 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 482 | `{ name: '--falcon-date-picker-input-bg-error', defaultValue: 'var(--color-falcon` |
| 1048 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 483 | `{ name: '--falcon-date-picker-input-border-color', defaultValue: 'var(--color-fa` |
| 1049 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 484 | `{ name: '--falcon-date-picker-input-border-color-error', defaultValue: 'var(--co` |
| 1050 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 485 | `{ name: '--falcon-date-picker-input-border-color-focus', defaultValue: 'var(--co` |
| 1051 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 488 | `{ name: '--falcon-date-picker-input-color', defaultValue: 'var(--color-falcon-ne` |
| 1052 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 496 | `{ name: '--falcon-date-picker-input-placeholder-color', defaultValue: 'var(--col` |
| 1053 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 498 | `{ name: '--falcon-date-picker-input-shadow-focus', defaultValue: '0 0 0 3px var(` |
| 1054 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 507 | `{ name: '--falcon-calendar-popover-bg', defaultValue: 'var(--color-falcon-neutra` |
| 1055 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 508 | `{ name: '--falcon-calendar-popover-border-color', defaultValue: 'var(--color-fal` |
| 1056 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 515 | `{ name: '--falcon-calendar-popover-shadow', defaultValue: '0 12px 32px rgba(13, ` |
| 1057 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 521 | `{ name: '--falcon-date-picker-readonly-bg', defaultValue: 'var(--color-falcon-ne` |
| 1058 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 524 | `{ name: '--falcon-calendar-week-number-color', defaultValue: 'var(--color-falcon` |
| 1059 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 531 | `{ name: '--falcon-calendar-weekday-color', defaultValue: 'var(--color-falcon-neu` |
| 1060 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 550 | `{ name: '--falcon-card-footer-border-color', defaultValue: 'var(--color-falcon-n` |
| 1061 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 551 | `{ name: '--falcon-card-footer-fg', defaultValue: 'var(--color-falcon-neutral-700` |
| 1062 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 558 | `{ name: '--falcon-card-header-fg', defaultValue: 'var(--color-falcon-neutral-900` |
| 1063 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 562 | `{ name: '--falcon-card-subheader-fg', defaultValue: 'var(--color-falcon-neutral-` |
| 1064 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 566 | `{ name: '--falcon-card-border-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1065 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 568 | `{ name: '--falcon-card-outlined-border-color', defaultValue: 'var(--color-falcon` |
| 1066 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 574 | `{ name: '--falcon-card-bg', defaultValue: 'var(--color-white, #ffffff)', categor` |
| 1067 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 575 | `{ name: '--falcon-card-fg', defaultValue: 'var(--color-falcon-neutral-800, #1f29` |
| 1068 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 576 | `{ name: '--falcon-card-shadow', defaultValue: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 ` |
| 1069 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 591 | `{ name: '--falcon-checkbox-bg', defaultValue: 'var(--color-falcon-neutral-0, #ff` |
| 1070 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 592 | `{ name: '--falcon-checkbox-bg-checked', defaultValue: 'var(--color-falcon-teal-5` |
| 1071 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 593 | `{ name: '--falcon-checkbox-bg-disabled', defaultValue: 'var(--color-falcon-neutr` |
| 1072 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 594 | `{ name: '--falcon-checkbox-bg-disabled-checked', defaultValue: 'var(--color-falc` |
| 1073 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 595 | `{ name: '--falcon-checkbox-bg-error', defaultValue: 'var(--color-falcon-neutral-` |
| 1074 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 596 | `{ name: '--falcon-checkbox-bg-focus', defaultValue: 'var(--color-falcon-neutral-` |
| 1075 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 597 | `{ name: '--falcon-checkbox-bg-hover', defaultValue: 'var(--color-falcon-neutral-` |
| 1076 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 598 | `{ name: '--falcon-checkbox-bg-indeterminate', defaultValue: 'var(--color-falcon-` |
| 1077 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 599 | `{ name: '--falcon-checkbox-bg-readonly', defaultValue: 'var(--color-falcon-neutr` |
| 1078 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 602 | `{ name: '--falcon-checkbox-border-color', defaultValue: 'var(--color-falcon-neut` |
| 1079 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 603 | `{ name: '--falcon-checkbox-border-color-checked', defaultValue: 'var(--color-fal` |
| 1080 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 604 | `{ name: '--falcon-checkbox-border-color-disabled', defaultValue: 'var(--color-fa` |
| 1081 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 605 | `{ name: '--falcon-checkbox-border-color-error', defaultValue: 'var(--color-falco` |
| 1082 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 606 | `{ name: '--falcon-checkbox-border-color-focus', defaultValue: 'var(--color-falco` |
| 1083 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 607 | `{ name: '--falcon-checkbox-border-color-hover', defaultValue: 'var(--color-falco` |
| 1084 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 608 | `{ name: '--falcon-checkbox-border-color-indeterminate', defaultValue: 'var(--col` |
| 1085 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 609 | `{ name: '--falcon-checkbox-border-color-readonly', defaultValue: 'var(--color-fa` |
| 1086 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 615 | `{ name: '--falcon-checkbox-check-color', defaultValue: 'var(--color-falcon-neutr` |
| 1087 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 616 | `{ name: '--falcon-checkbox-check-color-disabled', defaultValue: 'var(--color-fal` |
| 1088 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 630 | `{ name: '--falcon-checkbox-error-color', defaultValue: 'var(--color-falcon-red-5` |
| 1089 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 640 | `{ name: '--falcon-checkbox-group-label-color', defaultValue: 'var(--color-falcon` |
| 1090 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 646 | `{ name: '--falcon-checkbox-helper-color', defaultValue: 'var(--color-falcon-neut` |
| 1091 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 653 | `{ name: '--falcon-checkbox-indeterminate-color', defaultValue: 'var(--color-falc` |
| 1092 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 661 | `{ name: '--falcon-checkbox-label-color', defaultValue: 'var(--color-falcon-neutr` |
| 1093 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 662 | `{ name: '--falcon-checkbox-label-color-disabled', defaultValue: 'var(--color-fal` |
| 1094 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 663 | `{ name: '--falcon-checkbox-label-color-error', defaultValue: 'var(--color-falcon` |
| 1095 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 670 | `{ name: '--falcon-checkbox-required-color', defaultValue: 'var(--color-falcon-re` |
| 1096 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 677 | `{ name: '--falcon-checkbox-ring-color-error', defaultValue: 'var(--color-falcon-` |
| 1097 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 678 | `{ name: '--falcon-checkbox-ring-color-focus', defaultValue: 'var(--color-falcon-` |
| 1098 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 684 | `{ name: '--falcon-checkbox-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.08) ` |
| 1099 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 712 | `{ name: '--falcon-checkbox-accent', defaultValue: 'var(--color-falcon-teal-700, ` |
| 1100 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 713 | `{ name: '--falcon-checkbox-group-error-fg', defaultValue: 'var(--color-falcon-re` |
| 1101 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 715 | `{ name: '--falcon-checkbox-group-helper-fg', defaultValue: 'var(--color-falcon-n` |
| 1102 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 716 | `{ name: '--falcon-checkbox-group-label-fg', defaultValue: 'var(--color-falcon-ne` |
| 1103 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 730 | `{ name: '--falcon-combobox-bg', defaultValue: 'var(--color-falcon-neutral-0, #ff` |
| 1104 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 731 | `{ name: '--falcon-combobox-bg-disabled', defaultValue: 'var(--color-falcon-neutr` |
| 1105 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 732 | `{ name: '--falcon-combobox-bg-focus', defaultValue: 'var(--color-falcon-neutral-` |
| 1106 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 733 | `{ name: '--falcon-combobox-bg-hover', defaultValue: 'var(--color-falcon-neutral-` |
| 1107 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 736 | `{ name: '--falcon-combobox-border-color', defaultValue: 'var(--color-falcon-neut` |
| 1108 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 737 | `{ name: '--falcon-combobox-border-color-disabled', defaultValue: 'var(--color-fa` |
| 1109 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 738 | `{ name: '--falcon-combobox-border-color-focus', defaultValue: 'var(--color-falco` |
| 1110 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 739 | `{ name: '--falcon-combobox-border-color-hover', defaultValue: 'var(--color-falco` |
| 1111 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 746 | `{ name: '--falcon-combobox-clear-button-bg-hover', defaultValue: 'var(--color-fa` |
| 1112 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 747 | `{ name: '--falcon-combobox-clear-button-color', defaultValue: 'var(--color-falco` |
| 1113 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 748 | `{ name: '--falcon-combobox-clear-button-color-hover', defaultValue: 'var(--color` |
| 1114 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 757 | `{ name: '--falcon-combobox-error-color', defaultValue: 'var(--color-falcon-red-5` |
| 1115 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 762 | `{ name: '--falcon-combobox-helper-color', defaultValue: 'var(--color-falcon-neut` |
| 1116 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 769 | `{ name: '--falcon-combobox-label-color', defaultValue: 'var(--color-falcon-neutr` |
| 1117 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 770 | `{ name: '--falcon-combobox-label-color-error', defaultValue: 'var(--color-falcon` |
| 1118 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 776 | `{ name: '--falcon-combobox-required-color', defaultValue: 'var(--color-falcon-re` |
| 1119 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 784 | `{ name: '--falcon-combobox-empty-color', defaultValue: 'var(--color-falcon-neutr` |
| 1120 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 789 | `{ name: '--falcon-combobox-option-bg-active', defaultValue: 'var(--color-falcon-` |
| 1121 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 790 | `{ name: '--falcon-combobox-option-bg-hover', defaultValue: 'var(--color-falcon-t` |
| 1122 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 791 | `{ name: '--falcon-combobox-option-bg-selected', defaultValue: 'var(--color-falco` |
| 1123 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 792 | `{ name: '--falcon-combobox-option-color', defaultValue: 'var(--color-falcon-neut` |
| 1124 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 793 | `{ name: '--falcon-combobox-option-color-disabled', defaultValue: 'var(--color-fa` |
| 1125 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 794 | `{ name: '--falcon-combobox-option-color-selected', defaultValue: 'var(--color-fa` |
| 1126 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 803 | `{ name: '--falcon-combobox-panel-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1127 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 804 | `{ name: '--falcon-combobox-panel-border-color', defaultValue: 'var(--color-falco` |
| 1128 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 811 | `{ name: '--falcon-combobox-panel-shadow', defaultValue: '0 8px 24px rgba(0, 0, 0` |
| 1129 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 815 | `{ name: '--falcon-combobox-scrollbar-thumb', defaultValue: 'var(--color-falcon-n` |
| 1130 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 820 | `{ name: '--falcon-combobox-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.08) ` |
| 1131 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 838 | `{ name: '--falcon-combobox-placeholder-color', defaultValue: 'var(--color-falcon` |
| 1132 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 839 | `{ name: '--falcon-combobox-text-color', defaultValue: 'var(--color-falcon-neutra` |
| 1133 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 840 | `{ name: '--falcon-combobox-text-color-disabled', defaultValue: 'var(--color-falc` |
| 1134 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 854 | `{ name: '--falcon-confirm-dialog-accept-bg', defaultValue: 'var(--color-falcon-t` |
| 1135 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 855 | `{ name: '--falcon-confirm-dialog-accept-fg', defaultValue: 'var(--color-falcon-n` |
| 1136 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 865 | `{ name: '--falcon-confirm-dialog-message-fg', defaultValue: 'var(--color-falcon-` |
| 1137 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 867 | `{ name: '--falcon-confirm-dialog-reject-bg', defaultValue: 'var(--color-falcon-n` |
| 1138 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 868 | `{ name: '--falcon-confirm-dialog-reject-border', defaultValue: 'var(--color-falc` |
| 1139 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 869 | `{ name: '--falcon-confirm-dialog-reject-fg', defaultValue: 'var(--color-falcon-n` |
| 1140 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 885 | `{ name: '--falcon-data-table-actions-sticky-bg', defaultValue: 'var(--color-falc` |
| 1141 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 890 | `{ name: '--falcon-data-table-cell-color', defaultValue: 'var(--color-falcon-neut` |
| 1142 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 895 | `{ name: '--falcon-data-table-row-bg-hover', defaultValue: 'var(--color-falcon-ne` |
| 1143 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 896 | `{ name: '--falcon-data-table-row-bg-selected', defaultValue: 'var(--color-falcon` |
| 1144 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 897 | `{ name: '--falcon-data-table-row-bg-striped', defaultValue: 'var(--color-falcon-` |
| 1145 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 898 | `{ name: '--falcon-data-table-row-divider', defaultValue: 'var(--color-falcon-neu` |
| 1146 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 899 | `{ name: '--falcon-data-table-row-focus-ring-color', defaultValue: 'var(--color-f` |
| 1147 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 906 | `{ name: '--falcon-data-table-divider', defaultValue: 'var(--color-falcon-neutral` |
| 1148 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 907 | `{ name: '--falcon-data-table-wrap-bg', defaultValue: 'var(--color-falcon-neutral` |
| 1149 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 911 | `{ name: '--falcon-data-table-empty-color', defaultValue: 'var(--color-falcon-neu` |
| 1150 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 917 | `{ name: '--falcon-data-table-header-bg', defaultValue: 'var(--color-falcon-neutr` |
| 1151 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 918 | `{ name: '--falcon-data-table-header-color', defaultValue: 'var(--color-falcon-ne` |
| 1152 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 927 | `{ name: '--falcon-data-table-loading-overlay-bg', defaultValue: 'rgba(255, 255, ` |
| 1153 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 928 | `{ name: '--falcon-data-table-loading-overlay-color', defaultValue: 'var(--color-` |
| 1154 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 929 | `{ name: '--falcon-data-table-loading-spinner-border-color', defaultValue: 'var(-` |
| 1155 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 932 | `{ name: '--falcon-data-table-skeleton-bg', defaultValue: 'var(--color-falcon-neu` |
| 1156 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 941 | `{ name: '--falcon-data-table-paginator-bg', defaultValue: 'var(--color-falcon-ne` |
| 1157 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 942 | `{ name: '--falcon-data-table-paginator-color', defaultValue: 'var(--color-falcon` |
| 1158 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 943 | `{ name: '--falcon-data-table-paginator-current-color', defaultValue: 'var(--colo` |
| 1159 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 945 | `{ name: '--falcon-data-table-paginator-divider', defaultValue: 'var(--color-falc` |
| 1160 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 953 | `{ name: '--falcon-data-table-paginator-rpp-bg', defaultValue: 'var(--color-falco` |
| 1161 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 954 | `{ name: '--falcon-data-table-paginator-rpp-border-color', defaultValue: 'var(--c` |
| 1162 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 957 | `{ name: '--falcon-data-table-paginator-rpp-label-color', defaultValue: 'var(--co` |
| 1163 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 967 | `{ name: '--falcon-data-table-paginator-input-bg', defaultValue: 'var(--color-fal` |
| 1164 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 968 | `{ name: '--falcon-data-table-paginator-input-border-color', defaultValue: 'var(-` |
| 1165 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 969 | `{ name: '--falcon-data-table-paginator-input-border-color-focus', defaultValue: ` |
| 1166 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 971 | `{ name: '--falcon-data-table-paginator-input-color', defaultValue: 'var(--color-` |
| 1167 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 980 | `{ name: '--falcon-data-table-paginator-nav-bg-hover', defaultValue: 'var(--color` |
| 1168 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 981 | `{ name: '--falcon-data-table-paginator-nav-color', defaultValue: 'var(--color-fa` |
| 1169 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 982 | `{ name: '--falcon-data-table-paginator-nav-color-disabled', defaultValue: 'var(-` |
| 1170 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 989 | `{ name: '--falcon-data-table-paginator-page-bg-active', defaultValue: 'var(--col` |
| 1171 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 990 | `{ name: '--falcon-data-table-paginator-page-border-color-active', defaultValue: ` |
| 1172 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 991 | `{ name: '--falcon-data-table-paginator-page-color-active', defaultValue: 'var(--` |
| 1173 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1017 | `{ name: '--falcon-data-table-shadow-chevron-bg-expanded', defaultValue: 'var(--c` |
| 1174 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1018 | `{ name: '--falcon-data-table-shadow-chevron-bg-expanded-hover', defaultValue: 'v` |
| 1175 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1020 | `{ name: '--falcon-data-table-shadow-chevron-color', defaultValue: 'var(--color-f` |
| 1176 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1021 | `{ name: '--falcon-data-table-shadow-chevron-color-expanded', defaultValue: 'var(` |
| 1177 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1023 | `{ name: '--falcon-data-table-shadow-row-bg', defaultValue: 'var(--color-falcon-s` |
| 1178 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1028 | `{ name: '--falcon-data-table-shadow-save-bg', defaultValue: 'var(--color-falcon-` |
| 1179 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1029 | `{ name: '--falcon-data-table-shadow-save-bg-hover', defaultValue: 'var(--color-f` |
| 1180 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1030 | `{ name: '--falcon-data-table-shadow-save-color', defaultValue: 'var(--color-falc` |
| 1181 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1034 | `{ name: '--falcon-data-table-sort-icon-color', defaultValue: 'var(--color-falcon` |
| 1182 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1035 | `{ name: '--falcon-data-table-sort-icon-color-active', defaultValue: 'var(--color` |
| 1183 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1045 | `{ name: '--falcon-dialog-backdrop-bg', defaultValue: 'var(--color-falcon-teal-al` |
| 1184 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1050 | `{ name: '--falcon-dialog-body-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1185 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1058 | `{ name: '--falcon-dialog-close-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1186 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1060 | `{ name: '--falcon-dialog-close-color', defaultValue: 'var(--color-falcon-neutral` |
| 1187 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1061 | `{ name: '--falcon-dialog-close-color-hover', defaultValue: 'var(--color-falcon-n` |
| 1188 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1071 | `{ name: '--falcon-dialog-description-color', defaultValue: 'var(--color-falcon-n` |
| 1189 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1077 | `{ name: '--falcon-dialog-focus-ring-color', defaultValue: 'var(--color-falcon-te` |
| 1190 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1081 | `{ name: '--falcon-dialog-footer-border-top-color', defaultValue: 'var(--color-fa` |
| 1191 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1090 | `{ name: '--falcon-dialog-header-border-bottom-color', defaultValue: 'var(--color` |
| 1192 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1106 | `{ name: '--falcon-dialog-panel-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1193 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1111 | `{ name: '--falcon-dialog-panel-color', defaultValue: 'var(--color-falcon-neutral` |
| 1194 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1122 | `{ name: '--falcon-dialog-panel-shadow', defaultValue: '0 24px 60px rgba(0, 0, 0,` |
| 1195 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1127 | `{ name: '--falcon-dialog-severity-danger-color', defaultValue: 'var(--color-falc` |
| 1196 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1128 | `{ name: '--falcon-dialog-severity-danger-focus-ring-color', defaultValue: 'rgba(` |
| 1197 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1130 | `{ name: '--falcon-dialog-severity-danger-title-color', defaultValue: 'var(--colo` |
| 1198 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1131 | `{ name: '--falcon-dialog-severity-info-color', defaultValue: 'var(--color-falcon` |
| 1199 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1132 | `{ name: '--falcon-dialog-severity-info-focus-ring-color', defaultValue: 'rgba(14` |
| 1200 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1134 | `{ name: '--falcon-dialog-severity-info-title-color', defaultValue: 'var(--color-` |
| 1201 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1136 | `{ name: '--falcon-dialog-severity-success-color', defaultValue: 'var(--color-fal` |
| 1202 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1137 | `{ name: '--falcon-dialog-severity-success-focus-ring-color', defaultValue: 'rgba` |
| 1203 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1139 | `{ name: '--falcon-dialog-severity-success-title-color', defaultValue: 'var(--col` |
| 1204 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1140 | `{ name: '--falcon-dialog-severity-warning-color', defaultValue: 'var(--color-fal` |
| 1205 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1141 | `{ name: '--falcon-dialog-severity-warning-focus-ring-color', defaultValue: 'rgba` |
| 1206 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1143 | `{ name: '--falcon-dialog-severity-warning-title-color', defaultValue: 'var(--col` |
| 1207 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1178 | `{ name: '--falcon-dialog-title-color', defaultValue: 'var(--color-falcon-neutral` |
| 1208 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1196 | `{ name: '--falcon-drawer-body-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1209 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1204 | `{ name: '--falcon-drawer-close-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1210 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1206 | `{ name: '--falcon-drawer-close-color', defaultValue: 'var(--color-falcon-neutral` |
| 1211 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1207 | `{ name: '--falcon-drawer-close-color-hover', defaultValue: 'var(--color-falcon-n` |
| 1212 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1221 | `{ name: '--falcon-drawer-focus-ring-color', defaultValue: 'var(--color-falcon-te` |
| 1213 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1225 | `{ name: '--falcon-drawer-header-border-bottom-color', defaultValue: 'var(--color` |
| 1214 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1236 | `{ name: '--falcon-drawer-overlay-bg', defaultValue: 'var(--color-falcon-teal-alp` |
| 1215 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1241 | `{ name: '--falcon-drawer-panel-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1216 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1249 | `{ name: '--falcon-drawer-panel-color', defaultValue: 'var(--color-falcon-neutral` |
| 1217 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1250 | `{ name: '--falcon-drawer-panel-shadow', defaultValue: '0 24px 60px rgba(0, 0, 0,` |
| 1218 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1259 | `{ name: '--falcon-drawer-title-color', defaultValue: 'var(--color-falcon-neutral` |
| 1219 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1275 | `{ name: '--falcon-dropdown-bg', defaultValue: 'var(--color-falcon-neutral-0, #ff` |
| 1220 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1276 | `{ name: '--falcon-dropdown-bg-disabled', defaultValue: 'var(--color-falcon-neutr` |
| 1221 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1277 | `{ name: '--falcon-dropdown-bg-error', defaultValue: 'var(--color-falcon-red-100,` |
| 1222 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1278 | `{ name: '--falcon-dropdown-bg-filled', defaultValue: 'var(--color-falcon-neutral` |
| 1223 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1279 | `{ name: '--falcon-dropdown-bg-filled-focus', defaultValue: 'var(--color-falcon-n` |
| 1224 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1280 | `{ name: '--falcon-dropdown-bg-filled-hover', defaultValue: 'var(--color-falcon-n` |
| 1225 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1281 | `{ name: '--falcon-dropdown-bg-focus', defaultValue: 'var(--color-falcon-neutral-` |
| 1226 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1282 | `{ name: '--falcon-dropdown-bg-ghost-hover', defaultValue: 'var(--color-falcon-ne` |
| 1227 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1283 | `{ name: '--falcon-dropdown-bg-hover', defaultValue: 'var(--color-falcon-neutral-` |
| 1228 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1284 | `{ name: '--falcon-dropdown-bg-readonly', defaultValue: 'var(--color-falcon-neutr` |
| 1229 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1285 | `{ name: '--falcon-dropdown-bg-success', defaultValue: 'var(--color-falcon-neutra` |
| 1230 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1286 | `{ name: '--falcon-dropdown-bg-warning', defaultValue: 'var(--color-falcon-neutra` |
| 1231 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1289 | `{ name: '--falcon-dropdown-border-color', defaultValue: 'var(--color-falcon-neut` |
| 1232 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1290 | `{ name: '--falcon-dropdown-border-color-disabled', defaultValue: 'var(--color-fa` |
| 1233 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1291 | `{ name: '--falcon-dropdown-border-color-error', defaultValue: 'var(--color-falco` |
| 1234 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1292 | `{ name: '--falcon-dropdown-border-color-focus', defaultValue: 'var(--color-falco` |
| 1235 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1293 | `{ name: '--falcon-dropdown-border-color-hover', defaultValue: 'var(--color-falco` |
| 1236 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1294 | `{ name: '--falcon-dropdown-border-color-readonly', defaultValue: 'var(--color-fa` |
| 1237 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1295 | `{ name: '--falcon-dropdown-border-color-success', defaultValue: 'var(--color-fal` |
| 1238 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1296 | `{ name: '--falcon-dropdown-border-color-warning', defaultValue: 'var(--color-fal` |
| 1239 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1308 | `{ name: '--falcon-dropdown-clear-button-bg-hover', defaultValue: 'var(--color-fa` |
| 1240 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1309 | `{ name: '--falcon-dropdown-clear-button-color', defaultValue: 'var(--color-falco` |
| 1241 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1310 | `{ name: '--falcon-dropdown-clear-button-color-hover', defaultValue: 'var(--color` |
| 1242 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1313 | `{ name: '--falcon-dropdown-error-color', defaultValue: 'var(--color-falcon-red-5` |
| 1243 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1321 | `{ name: '--falcon-dropdown-chevron-color', defaultValue: 'var(--color-falcon-neu` |
| 1244 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1322 | `{ name: '--falcon-dropdown-chevron-color-disabled', defaultValue: 'var(--color-f` |
| 1245 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1327 | `{ name: '--falcon-dropdown-ring-color-error', defaultValue: 'var(--color-falcon-` |
| 1246 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1328 | `{ name: '--falcon-dropdown-ring-color-focus', defaultValue: 'var(--color-falcon-` |
| 1247 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1331 | `{ name: '--falcon-dropdown-search-bg', defaultValue: 'var(--color-falcon-neutral` |
| 1248 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1332 | `{ name: '--falcon-dropdown-search-border-color', defaultValue: 'var(--color-falc` |
| 1249 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1336 | `{ name: '--falcon-dropdown-search-icon-color', defaultValue: 'var(--color-falcon` |
| 1250 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1343 | `{ name: '--falcon-dropdown-helper-color', defaultValue: 'var(--color-falcon-neut` |
| 1251 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1350 | `{ name: '--falcon-dropdown-label-color', defaultValue: 'var(--color-falcon-neutr` |
| 1252 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1351 | `{ name: '--falcon-dropdown-label-color-error', defaultValue: 'var(--color-falcon` |
| 1253 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1358 | `{ name: '--falcon-dropdown-required-color', defaultValue: 'var(--color-falcon-re` |
| 1254 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1367 | `{ name: '--falcon-dropdown-option-bg-active', defaultValue: 'var(--color-falcon-` |
| 1255 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1368 | `{ name: '--falcon-dropdown-option-bg-hover', defaultValue: 'var(--color-falcon-t` |
| 1256 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1369 | `{ name: '--falcon-dropdown-option-bg-selected', defaultValue: 'var(--color-falco` |
| 1257 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1370 | `{ name: '--falcon-dropdown-option-color', defaultValue: 'var(--color-falcon-neut` |
| 1258 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1371 | `{ name: '--falcon-dropdown-option-color-disabled', defaultValue: 'var(--color-fa` |
| 1259 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1372 | `{ name: '--falcon-dropdown-option-color-selected', defaultValue: 'var(--color-fa` |
| 1260 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1381 | `{ name: '--falcon-dropdown-panel-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1261 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1381 | `{ name: '--falcon-dropdown-panel-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1262 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1382 | `{ name: '--falcon-dropdown-panel-border-color', defaultValue: 'var(--color-falco` |
| 1263 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1389 | `{ name: '--falcon-dropdown-panel-shadow', defaultValue: '0 8px 24px rgba(0, 0, 0` |
| 1264 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1393 | `{ name: '--falcon-dropdown-empty-color', defaultValue: 'var(--color-falcon-neutr` |
| 1265 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1397 | `{ name: '--falcon-dropdown-scrollbar-thumb', defaultValue: 'var(--color-falcon-n` |
| 1266 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1398 | `{ name: '--falcon-dropdown-scrollbar-thumb-hover', defaultValue: 'var(--color-fa` |
| 1267 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1404 | `{ name: '--falcon-dropdown-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0 0 ` |
| 1268 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1405 | `{ name: '--falcon-dropdown-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.08) ` |
| 1269 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1427 | `{ name: '--falcon-dropdown-placeholder-color', defaultValue: 'var(--color-falcon` |
| 1270 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1428 | `{ name: '--falcon-dropdown-text-color', defaultValue: 'var(--color-falcon-neutra` |
| 1271 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1429 | `{ name: '--falcon-dropdown-text-color-disabled', defaultValue: 'var(--color-falc` |
| 1272 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1448 | `{ name: '--falcon-email-field-error-color', defaultValue: 'var(--color-falcon-re` |
| 1273 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1454 | `{ name: '--falcon-email-field-helper-color', defaultValue: 'var(--color-falcon-n` |
| 1274 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1462 | `{ name: '--falcon-email-field-input-caret-color', defaultValue: 'var(--color-fal` |
| 1275 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1463 | `{ name: '--falcon-email-field-input-color', defaultValue: 'var(--color-falcon-ne` |
| 1276 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1464 | `{ name: '--falcon-email-field-input-color-disabled', defaultValue: 'var(--color-` |
| 1277 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1465 | `{ name: '--falcon-email-field-input-placeholder-color', defaultValue: 'var(--col` |
| 1278 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1476 | `{ name: '--falcon-email-field-label-color', defaultValue: 'var(--color-falcon-ne` |
| 1279 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1477 | `{ name: '--falcon-email-field-label-color-error', defaultValue: 'var(--color-fal` |
| 1280 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1483 | `{ name: '--falcon-email-field-required-color', defaultValue: 'var(--color-falcon` |
| 1281 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1504 | `{ name: '--falcon-email-field-verify-bg-hover', defaultValue: 'var(--color-falco` |
| 1282 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1505 | `{ name: '--falcon-email-field-verify-color', defaultValue: 'var(--color-falcon-t` |
| 1283 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1506 | `{ name: '--falcon-email-field-verify-color-disabled', defaultValue: 'var(--color` |
| 1284 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1507 | `{ name: '--falcon-email-field-verify-color-hover', defaultValue: 'var(--color-fa` |
| 1285 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1510 | `{ name: '--falcon-email-field-verify-divider-color', defaultValue: 'var(--color-` |
| 1286 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1530 | `{ name: '--falcon-email-field-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0` |
| 1287 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1531 | `{ name: '--falcon-email-field-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.0` |
| 1288 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1534 | `{ name: '--falcon-email-field-bg', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1289 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1535 | `{ name: '--falcon-email-field-bg-disabled', defaultValue: 'var(--color-falcon-ne` |
| 1290 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1536 | `{ name: '--falcon-email-field-bg-error', defaultValue: 'var(--color-falcon-red-1` |
| 1291 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1537 | `{ name: '--falcon-email-field-bg-focus', defaultValue: 'var(--color-falcon-neutr` |
| 1292 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1538 | `{ name: '--falcon-email-field-bg-hover', defaultValue: 'var(--color-falcon-neutr` |
| 1293 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1539 | `{ name: '--falcon-email-field-border-color', defaultValue: 'var(--color-falcon-n` |
| 1294 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1540 | `{ name: '--falcon-email-field-border-color-disabled', defaultValue: 'var(--color` |
| 1295 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1541 | `{ name: '--falcon-email-field-border-color-error', defaultValue: 'var(--color-fa` |
| 1296 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1542 | `{ name: '--falcon-email-field-border-color-focus', defaultValue: 'var(--color-fa` |
| 1297 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1543 | `{ name: '--falcon-email-field-border-color-hover', defaultValue: 'var(--color-fa` |
| 1298 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1552 | `{ name: '--falcon-empty-data-btn-bg', defaultValue: 'var(--color-falcon-teal-800` |
| 1299 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1553 | `{ name: '--falcon-empty-data-btn-bg-dashed', defaultValue: 'var(--color-falcon-n` |
| 1300 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1554 | `{ name: '--falcon-empty-data-btn-border-color', defaultValue: 'var(--color-falco` |
| 1301 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1556 | `{ name: '--falcon-empty-data-btn-fg', defaultValue: 'var(--color-falcon-neutral-` |
| 1302 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1557 | `{ name: '--falcon-empty-data-btn-fg-dashed', defaultValue: 'var(--color-falcon-t` |
| 1303 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1572 | `{ name: '--falcon-empty-data-body-color', defaultValue: 'var(--color-falcon-neut` |
| 1304 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1578 | `{ name: '--falcon-empty-data-card-bg-fallback', defaultValue: 'color-mix(in srgb` |
| 1305 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1579 | `{ name: '--falcon-empty-data-card-bg-glossy-end', defaultValue: 'color-mix(in sr` |
| 1306 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1580 | `{ name: '--falcon-empty-data-card-bg-glossy-start', defaultValue: 'color-mix(in ` |
| 1307 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1581 | `{ name: '--falcon-empty-data-card-border-color', defaultValue: 'color-mix(in srg` |
| 1308 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1589 | `{ name: '--falcon-empty-data-glyph-bg', defaultValue: 'var(--color-falcon-teal-5` |
| 1309 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1590 | `{ name: '--falcon-empty-data-glyph-border-color', defaultValue: 'color-mix(in sr` |
| 1310 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1592 | `{ name: '--falcon-empty-data-glyph-fg', defaultValue: 'var(--color-falcon-teal-7` |
| 1311 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1593 | `{ name: '--falcon-empty-data-glyph-fg-mono', defaultValue: 'var(--color-falcon-n` |
| 1312 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1601 | `{ name: '--falcon-empty-data-info-bg', defaultValue: 'color-mix(in srgb, var(--c` |
| 1313 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1602 | `{ name: '--falcon-empty-data-info-border-color', defaultValue: 'color-mix(in srg` |
| 1314 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1605 | `{ name: '--falcon-empty-data-info-icon-color', defaultValue: 'var(--color-falcon` |
| 1315 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1611 | `{ name: '--falcon-empty-data-info-text-color', defaultValue: 'var(--color-falcon` |
| 1316 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1624 | `{ name: '--falcon-empty-data-title-color', defaultValue: 'var(--color-falcon-neu` |
| 1317 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1637 | `{ name: '--falcon-empty-state-description-color', defaultValue: 'var(--color-fal` |
| 1318 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1638 | `{ name: '--falcon-empty-state-icon-color', defaultValue: 'var(--color-falcon-neu` |
| 1319 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1639 | `{ name: '--falcon-empty-state-title-color', defaultValue: 'var(--color-falcon-ne` |
| 1320 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1675 | `{ name: '--falcon-filter-panel-apply-bg', defaultValue: 'var(--color-falcon-teal` |
| 1321 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1676 | `{ name: '--falcon-filter-panel-apply-bg-hover', defaultValue: 'var(--color-falco` |
| 1322 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1677 | `{ name: '--falcon-filter-panel-apply-color', defaultValue: 'var(--color-falcon-n` |
| 1323 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1683 | `{ name: '--falcon-filter-panel-clear-bg-hover', defaultValue: 'var(--color-falco` |
| 1324 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1684 | `{ name: '--falcon-filter-panel-clear-border-color', defaultValue: 'var(--color-f` |
| 1325 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1685 | `{ name: '--falcon-filter-panel-clear-border-color-hover', defaultValue: 'var(--c` |
| 1326 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1686 | `{ name: '--falcon-filter-panel-clear-color', defaultValue: 'var(--color-falcon-n` |
| 1327 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1689 | `{ name: '--falcon-filter-panel-input-bg', defaultValue: 'var(--color-falcon-neut` |
| 1328 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1690 | `{ name: '--falcon-filter-panel-input-border-color', defaultValue: 'var(--color-f` |
| 1329 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1691 | `{ name: '--falcon-filter-panel-input-border-color-focus', defaultValue: 'var(--c` |
| 1330 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1692 | `{ name: '--falcon-filter-panel-input-border-color-hover', defaultValue: 'var(--c` |
| 1331 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1694 | `{ name: '--falcon-filter-panel-input-color', defaultValue: 'var(--color-falcon-n` |
| 1332 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1700 | `{ name: '--falcon-filter-panel-input-placeholder-color', defaultValue: 'var(--co` |
| 1333 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1703 | `{ name: '--falcon-filter-panel-label-color', defaultValue: 'var(--color-falcon-n` |
| 1334 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1708 | `{ name: '--falcon-filter-panel-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1335 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1732 | `{ name: '--falcon-grid-input-focus-ring-color', defaultValue: 'var(--color-falco` |
| 1336 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1759 | `{ name: '--falcon-input-bg', defaultValue: 'var(--color-falcon-neutral-0, #fffff` |
| 1337 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1760 | `{ name: '--falcon-input-bg-disabled', defaultValue: 'var(--color-falcon-neutral-` |
| 1338 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1761 | `{ name: '--falcon-input-bg-error', defaultValue: 'var(--color-falcon-red-100, #d` |
| 1339 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1762 | `{ name: '--falcon-input-bg-filled', defaultValue: 'var(--color-falcon-neutral-10` |
| 1340 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1763 | `{ name: '--falcon-input-bg-filled-focus', defaultValue: 'var(--color-falcon-neut` |
| 1341 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1764 | `{ name: '--falcon-input-bg-filled-hover', defaultValue: 'var(--color-falcon-neut` |
| 1342 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1765 | `{ name: '--falcon-input-bg-focus', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1343 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1766 | `{ name: '--falcon-input-bg-ghost-hover', defaultValue: 'var(--color-falcon-neutr` |
| 1344 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1767 | `{ name: '--falcon-input-bg-hover', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1345 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1768 | `{ name: '--falcon-input-bg-readonly', defaultValue: 'var(--color-falcon-neutral-` |
| 1346 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1769 | `{ name: '--falcon-input-bg-success', defaultValue: 'var(--color-falcon-neutral-0` |
| 1347 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1770 | `{ name: '--falcon-input-bg-warning', defaultValue: 'var(--color-falcon-neutral-0` |
| 1348 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1773 | `{ name: '--falcon-input-border-color', defaultValue: 'var(--color-falcon-neutral` |
| 1349 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1774 | `{ name: '--falcon-input-border-color-disabled', defaultValue: 'var(--color-falco` |
| 1350 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1775 | `{ name: '--falcon-input-border-color-error', defaultValue: 'var(--color-falcon-r` |
| 1351 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1776 | `{ name: '--falcon-input-border-color-focus', defaultValue: 'var(--color-falcon-t` |
| 1352 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1777 | `{ name: '--falcon-input-border-color-hover', defaultValue: 'var(--color-falcon-n` |
| 1353 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1778 | `{ name: '--falcon-input-border-color-readonly', defaultValue: 'var(--color-falco` |
| 1354 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1779 | `{ name: '--falcon-input-border-color-success', defaultValue: 'var(--color-falcon` |
| 1355 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1780 | `{ name: '--falcon-input-border-color-warning', defaultValue: 'var(--color-falcon` |
| 1356 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1787 | `{ name: '--falcon-input-clear-button-bg-hover', defaultValue: 'var(--color-falco` |
| 1357 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1788 | `{ name: '--falcon-input-clear-button-color', defaultValue: 'var(--color-falcon-n` |
| 1358 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1789 | `{ name: '--falcon-input-clear-button-color-hover', defaultValue: 'var(--color-fa` |
| 1359 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1799 | `{ name: '--falcon-input-error-color', defaultValue: 'var(--color-falcon-red-500,` |
| 1360 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1807 | `{ name: '--falcon-input-ring-color-error', defaultValue: 'var(--color-falcon-red` |
| 1361 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1808 | `{ name: '--falcon-input-ring-color-focus', defaultValue: 'var(--color-falcon-tea` |
| 1362 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1813 | `{ name: '--falcon-input-helper-color', defaultValue: 'var(--color-falcon-neutral` |
| 1363 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1820 | `{ name: '--falcon-input-label-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1364 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1821 | `{ name: '--falcon-input-label-color-error', defaultValue: 'var(--color-falcon-re` |
| 1365 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1828 | `{ name: '--falcon-input-required-color', defaultValue: 'var(--color-falcon-red-5` |
| 1366 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1836 | `{ name: '--falcon-input-prefix-color', defaultValue: 'var(--color-falcon-neutral` |
| 1367 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1838 | `{ name: '--falcon-input-suffix-color', defaultValue: 'var(--color-falcon-neutral` |
| 1368 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1844 | `{ name: '--falcon-input-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0 0 0, ` |
| 1369 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1845 | `{ name: '--falcon-input-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.09) 0 0` |
| 1370 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1866 | `{ name: '--falcon-input-placeholder-color', defaultValue: 'var(--color-falcon-ne` |
| 1371 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1867 | `{ name: '--falcon-input-text-color', defaultValue: 'var(--color-falcon-neutral-9` |
| 1372 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1868 | `{ name: '--falcon-input-text-color-disabled', defaultValue: 'var(--color-falcon-` |
| 1373 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1883 | `{ name: '--falcon-input-number-spinner-bg', defaultValue: 'var(--color-falcon-ne` |
| 1374 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1884 | `{ name: '--falcon-input-number-spinner-border', defaultValue: 'var(--color-falco` |
| 1375 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1885 | `{ name: '--falcon-input-number-spinner-fg', defaultValue: 'var(--color-falcon-ne` |
| 1376 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1886 | `{ name: '--falcon-input-number-spinner-hover-bg', defaultValue: 'var(--color-fal` |
| 1377 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1897 | `{ name: '--falcon-ib-dialog-backdrop-bg', defaultValue: 'rgba(15, 23, 42, 0.42)'` |
| 1378 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1899 | `{ name: '--falcon-ib-dialog-btn-bg', defaultValue: 'var(--color-falcon-neutral-1` |
| 1379 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1900 | `{ name: '--falcon-ib-dialog-btn-bg-hover', defaultValue: 'var(--color-falcon-tea` |
| 1380 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1902 | `{ name: '--falcon-ib-dialog-btn-fg', defaultValue: 'var(--color-falcon-neutral-6` |
| 1381 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1903 | `{ name: '--falcon-ib-dialog-btn-fg-hover', defaultValue: 'var(--color-falcon-neu` |
| 1382 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1908 | `{ name: '--falcon-ib-dialog-drag-label-color', defaultValue: 'var(--color-falcon` |
| 1383 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1911 | `{ name: '--falcon-ib-dialog-error-bg', defaultValue: 'var(--color-falcon-red-50,` |
| 1384 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1912 | `{ name: '--falcon-ib-dialog-error-fg', defaultValue: 'var(--color-falcon-red-700` |
| 1385 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1920 | `{ name: '--falcon-ib-dialog-footer-btn-cancel-bg', defaultValue: 'var(--color-fa` |
| 1386 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1921 | `{ name: '--falcon-ib-dialog-footer-btn-cancel-border', defaultValue: 'var(--colo` |
| 1387 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1922 | `{ name: '--falcon-ib-dialog-footer-btn-cancel-fg', defaultValue: 'var(--color-fa` |
| 1388 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1923 | `{ name: '--falcon-ib-dialog-footer-btn-confirm-bg', defaultValue: 'var(--color-f` |
| 1389 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1924 | `{ name: '--falcon-ib-dialog-footer-btn-confirm-fg', defaultValue: 'var(--color-f` |
| 1390 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1936 | `{ name: '--falcon-ib-dialog-icon-bg', defaultValue: 'var(--color-falcon-red-50, ` |
| 1391 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1939 | `{ name: '--falcon-ib-dialog-icon-color', defaultValue: 'var(--color-falcon-red-5` |
| 1392 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1940 | `{ name: '--falcon-ib-dialog-icon-color-neutral', defaultValue: 'var(--color-falc` |
| 1393 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1942 | `{ name: '--falcon-ib-dialog-info-bg', defaultValue: 'var(--color-falcon-teal-50,` |
| 1394 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1943 | `{ name: '--falcon-ib-dialog-info-fg', defaultValue: 'var(--color-falcon-teal-700` |
| 1395 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1951 | `{ name: '--falcon-ib-dialog-list-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1396 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1952 | `{ name: '--falcon-ib-dialog-list-border', defaultValue: '1px solid var(--color-f` |
| 1397 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1956 | `{ name: '--falcon-ib-dialog-panel-bg', defaultValue: 'var(--color-falcon-neutral` |
| 1398 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1961 | `{ name: '--falcon-ib-dialog-panel-shadow', defaultValue: '0 25px 50px -12px rgba` |
| 1399 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1962 | `{ name: '--falcon-ib-dialog-row-bg', defaultValue: 'var(--color-falcon-neutral-0` |
| 1400 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1963 | `{ name: '--falcon-ib-dialog-row-border', defaultValue: '1px solid var(--color-fa` |
| 1401 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1966 | `{ name: '--falcon-ib-dialog-row-dragging-shadow', defaultValue: '0 8px 20px -6px` |
| 1402 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1968 | `{ name: '--falcon-ib-dialog-row-grip-color', defaultValue: 'var(--color-falcon-n` |
| 1403 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1971 | `{ name: '--falcon-ib-dialog-row-hover-border', defaultValue: 'var(--color-falcon` |
| 1404 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1972 | `{ name: '--falcon-ib-dialog-row-label-color', defaultValue: 'var(--color-falcon-` |
| 1405 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1979 | `{ name: '--falcon-ib-dialog-row-rank-color', defaultValue: 'var(--color-falcon-n` |
| 1406 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1982 | `{ name: '--falcon-ib-dialog-subtitle-color', defaultValue: 'var(--color-falcon-n` |
| 1407 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 1986 | `{ name: '--falcon-ib-dialog-title-color', defaultValue: 'var(--color-falcon-neut` |
| 1408 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2002 | `{ name: '--falcon-menu-item-bg-hover', defaultValue: 'var(--color-falcon-neutral` |
| 1409 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2004 | `{ name: '--falcon-menu-item-color', defaultValue: 'var(--color-falcon-neutral-90` |
| 1410 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2005 | `{ name: '--falcon-menu-item-color-hover', defaultValue: 'var(--color-falcon-neut` |
| 1411 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2009 | `{ name: '--falcon-menu-item-focus-ring-color', defaultValue: 'var( --color-falco` |
| 1412 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2021 | `{ name: '--falcon-menu-item-icon-color', defaultValue: 'var(--color-falcon-neutr` |
| 1413 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2032 | `{ name: '--falcon-menu-panel-bg', defaultValue: 'var(--color-falcon-neutral-0, #` |
| 1414 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2033 | `{ name: '--falcon-menu-panel-border-color', defaultValue: 'var(--color-falcon-ne` |
| 1415 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2043 | `{ name: '--falcon-menu-panel-shadow', defaultValue: '0 8px 24px rgba(0, 0, 0, 0.` |
| 1416 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2047 | `{ name: '--falcon-menu-separator-border-color', defaultValue: 'var( --color-falc` |
| 1417 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2058 | `{ name: '--falcon-menu-trigger-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1418 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2060 | `{ name: '--falcon-menu-trigger-border-color-hover', defaultValue: 'var(--color-f` |
| 1419 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2064 | `{ name: '--falcon-menu-trigger-color', defaultValue: 'var(--color-falcon-neutral` |
| 1420 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2066 | `{ name: '--falcon-menu-trigger-focus-ring-color', defaultValue: 'var( --color-fa` |
| 1421 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2084 | `{ name: '--falcon-multi-select-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1422 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2085 | `{ name: '--falcon-multi-select-bg-disabled', defaultValue: 'var(--color-falcon-n` |
| 1423 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2086 | `{ name: '--falcon-multi-select-bg-error', defaultValue: 'var(--color-falcon-red-` |
| 1424 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2087 | `{ name: '--falcon-multi-select-bg-focus', defaultValue: 'var(--color-falcon-neut` |
| 1425 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2088 | `{ name: '--falcon-multi-select-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1426 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2089 | `{ name: '--falcon-multi-select-bg-readonly', defaultValue: 'var(--color-falcon-n` |
| 1427 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2090 | `{ name: '--falcon-multi-select-bg-success', defaultValue: 'var(--color-falcon-ne` |
| 1428 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2091 | `{ name: '--falcon-multi-select-bg-warning', defaultValue: 'var(--color-falcon-ne` |
| 1429 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2094 | `{ name: '--falcon-multi-select-border-color', defaultValue: 'var(--color-falcon-` |
| 1430 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2095 | `{ name: '--falcon-multi-select-border-color-disabled', defaultValue: 'var(--colo` |
| 1431 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2096 | `{ name: '--falcon-multi-select-border-color-error', defaultValue: 'var(--color-f` |
| 1432 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2097 | `{ name: '--falcon-multi-select-border-color-focus', defaultValue: 'var(--color-f` |
| 1433 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2098 | `{ name: '--falcon-multi-select-border-color-hover', defaultValue: 'var(--color-f` |
| 1434 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2099 | `{ name: '--falcon-multi-select-border-color-readonly', defaultValue: 'var(--colo` |
| 1435 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2100 | `{ name: '--falcon-multi-select-border-color-success', defaultValue: 'var(--color` |
| 1436 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2101 | `{ name: '--falcon-multi-select-border-color-warning', defaultValue: 'var(--color` |
| 1437 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2107 | `{ name: '--falcon-multi-select-chevron-color', defaultValue: 'var(--color-falcon` |
| 1438 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2108 | `{ name: '--falcon-multi-select-chevron-color-disabled', defaultValue: 'var(--col` |
| 1439 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2113 | `{ name: '--falcon-multi-select-search-bg', defaultValue: 'var(--color-falcon-neu` |
| 1440 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2114 | `{ name: '--falcon-multi-select-search-border-color', defaultValue: 'var(--color-` |
| 1441 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2118 | `{ name: '--falcon-multi-select-search-icon-color', defaultValue: 'var(--color-fa` |
| 1442 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2125 | `{ name: '--falcon-multi-select-chip-bg', defaultValue: 'var(--color-falcon-teal-` |
| 1443 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2127 | `{ name: '--falcon-multi-select-chip-color', defaultValue: 'var(--color-falcon-te` |
| 1444 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2137 | `{ name: '--falcon-multi-select-chip-remove-bg-hover', defaultValue: 'var(--color` |
| 1445 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2138 | `{ name: '--falcon-multi-select-chip-remove-icon-color', defaultValue: 'var(--col` |
| 1446 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2139 | `{ name: '--falcon-multi-select-chip-remove-icon-hover-color', defaultValue: 'var` |
| 1447 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2142 | `{ name: '--falcon-multi-select-chip-remove-size', defaultValue: '16px', category` |
| 1448 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2145 | `{ name: '--falcon-multi-select-legacy-remove-color', defaultValue: 'var(--color-` |
| 1449 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2155 | `{ name: '--falcon-multi-select-clear-button-bg-hover', defaultValue: 'var(--colo` |
| 1450 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2156 | `{ name: '--falcon-multi-select-clear-button-color', defaultValue: 'var(--color-f` |
| 1451 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2157 | `{ name: '--falcon-multi-select-clear-button-color-hover', defaultValue: 'var(--c` |
| 1452 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2167 | `{ name: '--falcon-multi-select-error-color', defaultValue: 'var(--color-falcon-r` |
| 1453 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2175 | `{ name: '--falcon-multi-select-ring-color-error', defaultValue: 'var(--color-fal` |
| 1454 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2176 | `{ name: '--falcon-multi-select-ring-color-focus', defaultValue: 'var(--color-fal` |
| 1455 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2181 | `{ name: '--falcon-multi-select-helper-color', defaultValue: 'var(--color-falcon-` |
| 1456 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2188 | `{ name: '--falcon-multi-select-label-color', defaultValue: 'var(--color-falcon-n` |
| 1457 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2189 | `{ name: '--falcon-multi-select-label-color-error', defaultValue: 'var(--color-fa` |
| 1458 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2196 | `{ name: '--falcon-multi-select-required-color', defaultValue: 'var(--color-falco` |
| 1459 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2205 | `{ name: '--falcon-multi-select-option-bg-active', defaultValue: 'var(--color-fal` |
| 1460 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2206 | `{ name: '--falcon-multi-select-option-bg-hover', defaultValue: 'var(--color-falc` |
| 1461 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2207 | `{ name: '--falcon-multi-select-option-bg-selected', defaultValue: 'var(--color-f` |
| 1462 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2209 | `{ name: '--falcon-multi-select-option-check-bg-checked', defaultValue: 'var(--co` |
| 1463 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2210 | `{ name: '--falcon-multi-select-option-check-border-color', defaultValue: 'var(--` |
| 1464 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2211 | `{ name: '--falcon-multi-select-option-check-border-color-checked', defaultValue:` |
| 1465 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2213 | `{ name: '--falcon-multi-select-option-check-color', defaultValue: 'var(--color-f` |
| 1466 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2216 | `{ name: '--falcon-multi-select-option-color', defaultValue: 'var(--color-falcon-` |
| 1467 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2217 | `{ name: '--falcon-multi-select-option-color-disabled', defaultValue: 'var(--colo` |
| 1468 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2218 | `{ name: '--falcon-multi-select-option-color-selected', defaultValue: 'var(--colo` |
| 1469 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2226 | `{ name: '--falcon-multi-select-select-all-bg', defaultValue: 'var(--color-falcon` |
| 1470 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2227 | `{ name: '--falcon-multi-select-select-all-border-bottom', defaultValue: '1px sol` |
| 1471 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2228 | `{ name: '--falcon-multi-select-select-all-color', defaultValue: 'var(--color-fal` |
| 1472 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2237 | `{ name: '--falcon-multi-select-overflow-pill-bg', defaultValue: 'var(--color-fal` |
| 1473 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2239 | `{ name: '--falcon-multi-select-overflow-pill-color', defaultValue: 'var(--color-` |
| 1474 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2246 | `{ name: '--falcon-multi-select-panel-bg', defaultValue: 'var(--color-falcon-neut` |
| 1475 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2247 | `{ name: '--falcon-multi-select-panel-border-color', defaultValue: 'var(--color-f` |
| 1476 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2254 | `{ name: '--falcon-multi-select-panel-shadow', defaultValue: '0 8px 24px rgba(0, ` |
| 1477 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2258 | `{ name: '--falcon-multi-select-empty-color', defaultValue: 'var(--color-falcon-n` |
| 1478 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2262 | `{ name: '--falcon-multi-select-scrollbar-thumb', defaultValue: 'var(--color-falc` |
| 1479 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2263 | `{ name: '--falcon-multi-select-scrollbar-thumb-hover', defaultValue: 'var(--colo` |
| 1480 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2269 | `{ name: '--falcon-multi-select-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 ` |
| 1481 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2270 | `{ name: '--falcon-multi-select-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.` |
| 1482 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2293 | `{ name: '--falcon-multi-select-placeholder-color', defaultValue: 'var(--color-fa` |
| 1483 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2294 | `{ name: '--falcon-multi-select-text-color', defaultValue: 'var(--color-falcon-ne` |
| 1484 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2295 | `{ name: '--falcon-multi-select-text-color-disabled', defaultValue: 'var(--color-` |
| 1485 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2358 | `{ name: '--falcon-org-hierarchy-menu-btn-shadow', defaultValue: '-8px 0 8px -6px` |
| 1486 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2381 | `{ name: '--falcon-org-hierarchy-ctx-menu-shadow', defaultValue: '0 12px 32px rgb` |
| 1487 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2396 | `{ name: '--falcon-org-hierarchy-list-scrollbar-thumb-color', defaultValue: 'var(` |
| 1488 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2397 | `{ name: '--falcon-org-hierarchy-list-scrollbar-thumb-color-hover', defaultValue:` |
| 1489 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2406 | `{ name: '--falcon-otp-bg', defaultValue: 'var(--color-falcon-neutral-0, #ffffff)` |
| 1490 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2407 | `{ name: '--falcon-otp-bg-disabled', defaultValue: 'var(--color-falcon-neutral-50` |
| 1491 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2408 | `{ name: '--falcon-otp-bg-error', defaultValue: 'var(--color-falcon-red-100, #fee` |
| 1492 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2409 | `{ name: '--falcon-otp-bg-filled', defaultValue: 'var(--color-falcon-neutral-0, #` |
| 1493 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2410 | `{ name: '--falcon-otp-bg-focus', defaultValue: 'var(--color-falcon-neutral-0, #f` |
| 1494 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2411 | `{ name: '--falcon-otp-bg-hover', defaultValue: 'var(--color-falcon-neutral-0, #f` |
| 1495 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2414 | `{ name: '--falcon-otp-border-color', defaultValue: 'var(--color-falcon-neutral-2` |
| 1496 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2415 | `{ name: '--falcon-otp-border-color-disabled', defaultValue: 'var(--color-falcon-` |
| 1497 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2416 | `{ name: '--falcon-otp-border-color-error', defaultValue: 'var(--color-falcon-red` |
| 1498 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2417 | `{ name: '--falcon-otp-border-color-filled', defaultValue: 'var(--color-falcon-ne` |
| 1499 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2418 | `{ name: '--falcon-otp-border-color-focus', defaultValue: 'var(--color-falcon-tea` |
| 1500 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2419 | `{ name: '--falcon-otp-border-color-hover', defaultValue: 'var(--color-falcon-neu` |
| 1501 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2430 | `{ name: '--falcon-otp-caret-color', defaultValue: 'var(--color-falcon-teal-500, ` |
| 1502 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2440 | `{ name: '--falcon-otp-error-color', defaultValue: 'var(--color-falcon-red-500, #` |
| 1503 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2447 | `{ name: '--falcon-otp-helper-color', defaultValue: 'var(--color-falcon-neutral-7` |
| 1504 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2453 | `{ name: '--falcon-otp-label-color', defaultValue: 'var(--color-falcon-neutral-80` |
| 1505 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2454 | `{ name: '--falcon-otp-label-color-error', defaultValue: 'var(--color-falcon-red-` |
| 1506 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2470 | `{ name: '--falcon-otp-separator-color', defaultValue: 'var(--color-falcon-neutra` |
| 1507 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2477 | `{ name: '--falcon-otp-ring-color-error', defaultValue: 'var(--color-falcon-red-1` |
| 1508 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2478 | `{ name: '--falcon-otp-ring-color-focus', defaultValue: 'var(--color-falcon-teal-` |
| 1509 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2481 | `{ name: '--falcon-otp-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0 0 0, rg` |
| 1510 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2482 | `{ name: '--falcon-otp-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.09) 0 0 0` |
| 1511 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2486 | `{ name: '--falcon-otp-placeholder-color', defaultValue: 'var(--color-falcon-neut` |
| 1512 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2487 | `{ name: '--falcon-otp-text-color', defaultValue: 'var(--color-falcon-neutral-900` |
| 1513 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2488 | `{ name: '--falcon-otp-text-color-disabled', defaultValue: 'var(--color-falcon-ne` |
| 1514 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2489 | `{ name: '--falcon-otp-text-color-error', defaultValue: 'var(--color-falcon-red-7` |
| 1515 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2521 | `{ name: '--falcon-otp-send-dialog-option-bg', defaultValue: 'var(--color-falcon-` |
| 1516 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2522 | `{ name: '--falcon-otp-send-dialog-option-bg-hover', defaultValue: 'var(--color-f` |
| 1517 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2523 | `{ name: '--falcon-otp-send-dialog-option-bg-selected', defaultValue: 'var(--colo` |
| 1518 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2524 | `{ name: '--falcon-otp-send-dialog-option-border-color', defaultValue: 'var(--col` |
| 1519 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2525 | `{ name: '--falcon-otp-send-dialog-option-border-color-hover', defaultValue: 'var` |
| 1520 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2526 | `{ name: '--falcon-otp-send-dialog-option-border-color-selected', defaultValue: '` |
| 1521 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2534 | `{ name: '--falcon-otp-send-dialog-option-sub-text-color', defaultValue: 'var(--c` |
| 1522 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2540 | `{ name: '--falcon-otp-send-dialog-code-description-color', defaultValue: 'var(--` |
| 1523 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2544 | `{ name: '--falcon-otp-send-dialog-code-description-target-color', defaultValue: ` |
| 1524 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2555 | `{ name: '--falcon-otp-send-dialog-error-bg', defaultValue: 'var(--color-falcon-r` |
| 1525 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2557 | `{ name: '--falcon-otp-send-dialog-error-color', defaultValue: 'var(--color-falco` |
| 1526 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2567 | `{ name: '--falcon-otp-send-dialog-subtitle-color', defaultValue: 'var(--color-fa` |
| 1527 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2575 | `{ name: '--falcon-otp-send-dialog-icon-color', defaultValue: 'var(--color-falcon` |
| 1528 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2576 | `{ name: '--falcon-otp-send-dialog-icon-color-selected', defaultValue: 'var(--col` |
| 1529 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2592 | `{ name: '--falcon-otp-send-dialog-resend-color', defaultValue: 'var(--color-falc` |
| 1530 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2593 | `{ name: '--falcon-otp-send-dialog-resend-color-disabled', defaultValue: 'var(--c` |
| 1531 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2594 | `{ name: '--falcon-otp-send-dialog-resend-color-hover', defaultValue: 'var(--colo` |
| 1532 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2609 | `{ name: '--falcon-otp-send-dialog-success-bg', defaultValue: 'var(--color-falcon` |
| 1533 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2611 | `{ name: '--falcon-otp-send-dialog-success-color', defaultValue: 'var(--color-fal` |
| 1534 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2621 | `{ name: '--falcon-otp-send-dialog-target-color', defaultValue: 'var(--color-falc` |
| 1535 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2655 | `{ name: '--falcon-paginator-ellipsis-color', defaultValue: 'var(--color-falcon-n` |
| 1536 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2660 | `{ name: '--falcon-paginator-focus-ring-color', defaultValue: 'var(--color-falcon` |
| 1537 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2672 | `{ name: '--falcon-paginator-page-bg-active', defaultValue: 'var(--color-falcon-t` |
| 1538 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2674 | `{ name: '--falcon-paginator-page-bg-hover', defaultValue: 'var(--color-falcon-ne` |
| 1539 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2675 | `{ name: '--falcon-paginator-page-border-color', defaultValue: 'var(--color-falco` |
| 1540 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2676 | `{ name: '--falcon-paginator-page-border-color-active', defaultValue: 'var(--colo` |
| 1541 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2677 | `{ name: '--falcon-paginator-page-border-color-disabled', defaultValue: 'var(--co` |
| 1542 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2678 | `{ name: '--falcon-paginator-page-border-color-hover', defaultValue: 'var(--color` |
| 1543 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2681 | `{ name: '--falcon-paginator-page-color', defaultValue: 'var(--color-falcon-neutr` |
| 1544 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2682 | `{ name: '--falcon-paginator-page-color-active', defaultValue: 'var(--color-falco` |
| 1545 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2683 | `{ name: '--falcon-paginator-page-color-disabled', defaultValue: 'var(--color-fal` |
| 1546 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2684 | `{ name: '--falcon-paginator-page-color-hover', defaultValue: 'var(--color-falcon` |
| 1547 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2687 | `{ name: '--falcon-paginator-info-color', defaultValue: 'var(--color-falcon-neutr` |
| 1548 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2694 | `{ name: '--falcon-paginator-nav-bg-hover', defaultValue: 'var(--color-falcon-neu` |
| 1549 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2695 | `{ name: '--falcon-paginator-nav-border-color', defaultValue: 'var(--color-falcon` |
| 1550 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2696 | `{ name: '--falcon-paginator-nav-color', defaultValue: 'var(--color-falcon-neutra` |
| 1551 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2697 | `{ name: '--falcon-paginator-nav-color-disabled', defaultValue: 'var(--color-falc` |
| 1552 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2698 | `{ name: '--falcon-paginator-nav-color-hover', defaultValue: 'var(--color-falcon-` |
| 1553 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2730 | `{ name: '--falcon-password-meter-off-bg', defaultValue: 'var(--color-falcon-neut` |
| 1554 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2731 | `{ name: '--falcon-password-meter-on-bg', defaultValue: 'var(--color-falcon-teal-` |
| 1555 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2732 | `{ name: '--falcon-password-meter-strength-1', defaultValue: 'var(--color-falcon-` |
| 1556 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2733 | `{ name: '--falcon-password-meter-strength-2', defaultValue: 'var(--color-falcon-` |
| 1557 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2734 | `{ name: '--falcon-password-meter-strength-3', defaultValue: 'var(--color-falcon-` |
| 1558 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2735 | `{ name: '--falcon-password-meter-strength-4', defaultValue: 'var(--color-falcon-` |
| 1559 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2737 | `{ name: '--falcon-password-toggle-fg', defaultValue: 'var(--color-falcon-neutral` |
| 1560 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2738 | `{ name: '--falcon-password-toggle-hover-fg', defaultValue: 'var(--color-falcon-n` |
| 1561 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2755 | `{ name: '--falcon-phone-field-cc-bg-hover', defaultValue: 'var(--color-falcon-ne` |
| 1562 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2757 | `{ name: '--falcon-phone-field-cc-chev-color', defaultValue: 'var(--color-falcon-` |
| 1563 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2759 | `{ name: '--falcon-phone-field-cc-color', defaultValue: 'var(--color-falcon-neutr` |
| 1564 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2763 | `{ name: '--falcon-phone-field-divider-color', defaultValue: 'var(--color-falcon-` |
| 1565 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2770 | `{ name: '--falcon-phone-field-dial-color', defaultValue: 'var(--color-falcon-neu` |
| 1566 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2776 | `{ name: '--falcon-phone-field-empty-color', defaultValue: 'var(--color-falcon-ne` |
| 1567 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2782 | `{ name: '--falcon-phone-field-flag-bg', defaultValue: 'var(--color-falcon-neutra` |
| 1568 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2791 | `{ name: '--falcon-phone-field-error-color', defaultValue: 'var(--color-falcon-re` |
| 1569 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2797 | `{ name: '--falcon-phone-field-helper-color', defaultValue: 'var(--color-falcon-n` |
| 1570 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2805 | `{ name: '--falcon-phone-field-input-caret-color', defaultValue: 'var(--color-fal` |
| 1571 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2806 | `{ name: '--falcon-phone-field-input-color', defaultValue: 'var(--color-falcon-ne` |
| 1572 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2807 | `{ name: '--falcon-phone-field-input-color-disabled', defaultValue: 'var(--color-` |
| 1573 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2812 | `{ name: '--falcon-phone-field-input-placeholder-color', defaultValue: 'var(--col` |
| 1574 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2815 | `{ name: '--falcon-phone-field-label-color', defaultValue: 'var(--color-falcon-ne` |
| 1575 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2816 | `{ name: '--falcon-phone-field-label-color-error', defaultValue: 'var(--color-fal` |
| 1576 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2822 | `{ name: '--falcon-phone-field-required-color', defaultValue: 'var(--color-falcon` |
| 1577 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2832 | `{ name: '--falcon-phone-field-option-bg-hover', defaultValue: 'var(--color-falco` |
| 1578 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2833 | `{ name: '--falcon-phone-field-option-bg-selected', defaultValue: 'var(--color-fa` |
| 1579 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2834 | `{ name: '--falcon-phone-field-option-color', defaultValue: 'var(--color-falcon-n` |
| 1580 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2835 | `{ name: '--falcon-phone-field-option-color-disabled', defaultValue: 'var(--color` |
| 1581 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2836 | `{ name: '--falcon-phone-field-option-dialpill-bg', defaultValue: 'var(--color-fa` |
| 1582 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2837 | `{ name: '--falcon-phone-field-option-dialpill-border-color', defaultValue: 'var(` |
| 1583 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2838 | `{ name: '--falcon-phone-field-option-dialpill-color', defaultValue: 'var(--color` |
| 1584 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2848 | `{ name: '--falcon-phone-field-option-separator-color', defaultValue: 'var(--colo` |
| 1585 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2852 | `{ name: '--falcon-phone-field-panel-bg', defaultValue: 'var(--color-falcon-neutr` |
| 1586 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2853 | `{ name: '--falcon-phone-field-panel-border-color', defaultValue: 'var(--color-fa` |
| 1587 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2859 | `{ name: '--falcon-phone-field-panel-shadow', defaultValue: '0 12px 28px rgba(15,` |
| 1588 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2863 | `{ name: '--falcon-phone-field-search-border-bottom-color', defaultValue: 'var(--` |
| 1589 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2864 | `{ name: '--falcon-phone-field-search-color', defaultValue: 'var(--color-falcon-n` |
| 1590 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2867 | `{ name: '--falcon-phone-field-search-icon-color', defaultValue: 'var(--color-fal` |
| 1591 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2871 | `{ name: '--falcon-phone-field-search-placeholder-color', defaultValue: 'var(--co` |
| 1592 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2876 | `{ name: '--falcon-phone-field-verify-bg-hover', defaultValue: 'var(--color-falco` |
| 1593 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2877 | `{ name: '--falcon-phone-field-verify-color', defaultValue: 'var(--color-falcon-t` |
| 1594 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2878 | `{ name: '--falcon-phone-field-verify-color-disabled', defaultValue: 'var(--color` |
| 1595 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2879 | `{ name: '--falcon-phone-field-verify-color-hover', defaultValue: 'var(--color-fa` |
| 1596 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2880 | `{ name: '--falcon-phone-field-verify-divider-color', defaultValue: 'var(--color-` |
| 1597 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2896 | `{ name: '--falcon-phone-field-bg', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1598 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2897 | `{ name: '--falcon-phone-field-bg-disabled', defaultValue: 'var(--color-falcon-ne` |
| 1599 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2898 | `{ name: '--falcon-phone-field-bg-error', defaultValue: 'var(--color-falcon-red-1` |
| 1600 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2899 | `{ name: '--falcon-phone-field-bg-focus', defaultValue: 'var(--color-falcon-neutr` |
| 1601 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2900 | `{ name: '--falcon-phone-field-bg-hover', defaultValue: 'var(--color-falcon-neutr` |
| 1602 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2901 | `{ name: '--falcon-phone-field-border-color', defaultValue: 'var(--color-falcon-n` |
| 1603 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2902 | `{ name: '--falcon-phone-field-border-color-disabled', defaultValue: 'var(--color` |
| 1604 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2903 | `{ name: '--falcon-phone-field-border-color-error', defaultValue: 'var(--color-fa` |
| 1605 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2904 | `{ name: '--falcon-phone-field-border-color-focus', defaultValue: 'var(--color-fa` |
| 1606 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2905 | `{ name: '--falcon-phone-field-border-color-hover', defaultValue: 'var(--color-fa` |
| 1607 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2914 | `{ name: '--falcon-phone-field-shadow', defaultValue: 'none', category: 'WRAPPER'` |
| 1608 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2915 | `{ name: '--falcon-phone-field-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0` |
| 1609 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2916 | `{ name: '--falcon-phone-field-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.0` |
| 1610 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2925 | `{ name: '--falcon-radio-bg', defaultValue: 'var(--color-falcon-neutral-0, #fffff` |
| 1611 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2926 | `{ name: '--falcon-radio-bg-checked', defaultValue: 'var(--color-falcon-neutral-0` |
| 1612 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2927 | `{ name: '--falcon-radio-bg-disabled', defaultValue: 'var(--color-falcon-neutral-` |
| 1613 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2928 | `{ name: '--falcon-radio-bg-disabled-checked', defaultValue: 'var(--color-falcon-` |
| 1614 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2929 | `{ name: '--falcon-radio-bg-error', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1615 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2930 | `{ name: '--falcon-radio-bg-focus', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1616 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2931 | `{ name: '--falcon-radio-bg-hover', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1617 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2934 | `{ name: '--falcon-radio-border-color', defaultValue: 'var(--color-falcon-neutral` |
| 1618 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2935 | `{ name: '--falcon-radio-border-color-checked', defaultValue: 'var(--color-falcon` |
| 1619 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2936 | `{ name: '--falcon-radio-border-color-disabled', defaultValue: 'var(--color-falco` |
| 1620 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2937 | `{ name: '--falcon-radio-border-color-disabled-checked', defaultValue: 'var(--col` |
| 1621 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2938 | `{ name: '--falcon-radio-border-color-error', defaultValue: 'var(--color-falcon-r` |
| 1622 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2939 | `{ name: '--falcon-radio-border-color-focus', defaultValue: 'var(--color-falcon-t` |
| 1623 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2940 | `{ name: '--falcon-radio-border-color-hover', defaultValue: 'var(--color-falcon-t` |
| 1624 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2958 | `{ name: '--falcon-radio-error-color', defaultValue: 'var(--color-falcon-red-500,` |
| 1625 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2968 | `{ name: '--falcon-radio-group-label-color', defaultValue: 'var(--color-falcon-ne` |
| 1626 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2974 | `{ name: '--falcon-radio-helper-color', defaultValue: 'var(--color-falcon-neutral` |
| 1627 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2981 | `{ name: '--falcon-radio-label-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1628 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2982 | `{ name: '--falcon-radio-label-color-disabled', defaultValue: 'var(--color-falcon` |
| 1629 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2983 | `{ name: '--falcon-radio-label-color-error', defaultValue: 'var(--color-falcon-re` |
| 1630 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 2990 | `{ name: '--falcon-radio-required-color', defaultValue: 'var(--color-falcon-red-5` |
| 1631 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3002 | `{ name: '--falcon-radio-ring-color-error', defaultValue: 'var(--color-falcon-red` |
| 1632 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3003 | `{ name: '--falcon-radio-ring-color-focus', defaultValue: 'var(--color-falcon-tea` |
| 1633 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3009 | `{ name: '--falcon-radio-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.08) 0 0` |
| 1634 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3037 | `{ name: '--falcon-radio-accent', defaultValue: 'var(--color-falcon-teal-700, #12` |
| 1635 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3038 | `{ name: '--falcon-radio-group-error-fg', defaultValue: 'var(--color-falcon-red-7` |
| 1636 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3040 | `{ name: '--falcon-radio-group-helper-fg', defaultValue: 'var(--color-falcon-neut` |
| 1637 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3041 | `{ name: '--falcon-radio-group-label-fg', defaultValue: 'var(--color-falcon-neutr` |
| 1638 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3047 | `{ name: '--falcon-radio-group-required-fg', defaultValue: 'var(--color-falcon-re` |
| 1639 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3057 | `{ name: '--falcon-search-input-spinner-color', defaultValue: 'var(--color-falcon` |
| 1640 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3059 | `{ name: '--falcon-search-input-spinner-track', defaultValue: 'var(--color-falcon` |
| 1641 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3068 | `{ name: '--falcon-single-uploader-action-bg', defaultValue: 'rgba(0, 0, 0, 0.55)` |
| 1642 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3069 | `{ name: '--falcon-single-uploader-action-bg-hover', defaultValue: 'rgba(0, 0, 0,` |
| 1643 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3072 | `{ name: '--falcon-single-uploader-action-color', defaultValue: 'var(--color-falc` |
| 1644 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3073 | `{ name: '--falcon-single-uploader-action-focus-shadow', defaultValue: '0 0 0 3px` |
| 1645 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3077 | `{ name: '--falcon-single-uploader-action-shadow', defaultValue: '0 1px 3px rgba(` |
| 1646 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3084 | `{ name: '--falcon-single-uploader-delete-bg', defaultValue: 'var(--color-falcon-` |
| 1647 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3085 | `{ name: '--falcon-single-uploader-delete-bg-hover', defaultValue: 'var(--color-f` |
| 1648 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3086 | `{ name: '--falcon-single-uploader-delete-color', defaultValue: 'var(--color-falc` |
| 1649 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3089 | `{ name: '--falcon-single-uploader-edit-bg', defaultValue: 'var(--color-falcon-te` |
| 1650 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3090 | `{ name: '--falcon-single-uploader-edit-bg-hover', defaultValue: 'var(--color-fal` |
| 1651 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3091 | `{ name: '--falcon-single-uploader-edit-color', defaultValue: 'var(--color-falcon` |
| 1652 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3094 | `{ name: '--falcon-single-uploader-empty-bg', defaultValue: 'var(--color-falcon-n` |
| 1653 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3095 | `{ name: '--falcon-single-uploader-empty-bg-disabled', defaultValue: 'var(--color` |
| 1654 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3096 | `{ name: '--falcon-single-uploader-empty-bg-drag-over', defaultValue: 'var(--colo` |
| 1655 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3097 | `{ name: '--falcon-single-uploader-empty-bg-error', defaultValue: 'rgba(220, 38, ` |
| 1656 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3098 | `{ name: '--falcon-single-uploader-empty-bg-hover', defaultValue: 'var(--color-fa` |
| 1657 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3099 | `{ name: '--falcon-single-uploader-empty-border-color', defaultValue: 'var(--colo` |
| 1658 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3100 | `{ name: '--falcon-single-uploader-empty-border-color-disabled', defaultValue: 'v` |
| 1659 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3101 | `{ name: '--falcon-single-uploader-empty-border-color-drag-over', defaultValue: '` |
| 1660 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3102 | `{ name: '--falcon-single-uploader-empty-border-color-error', defaultValue: 'var(` |
| 1661 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3103 | `{ name: '--falcon-single-uploader-empty-border-color-focus', defaultValue: 'var(` |
| 1662 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3104 | `{ name: '--falcon-single-uploader-empty-border-color-hover', defaultValue: 'var(` |
| 1663 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3108 | `{ name: '--falcon-single-uploader-empty-color', defaultValue: 'var(--color-falco` |
| 1664 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3109 | `{ name: '--falcon-single-uploader-empty-color-disabled', defaultValue: 'var(--co` |
| 1665 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3111 | `{ name: '--falcon-single-uploader-empty-focus-shadow', defaultValue: '0 0 0 3px ` |
| 1666 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3117 | `{ name: '--falcon-single-uploader-empty-icon-color', defaultValue: 'var(--color-` |
| 1667 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3118 | `{ name: '--falcon-single-uploader-empty-icon-color-drag-over', defaultValue: 'va` |
| 1668 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3124 | `{ name: '--falcon-single-uploader-icon-fallback-color', defaultValue: 'var(--col` |
| 1669 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3125 | `{ name: '--falcon-single-uploader-icon-fallback-name-color', defaultValue: 'var(` |
| 1670 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3132 | `{ name: '--falcon-single-uploader-error-color', defaultValue: 'var(--color-falco` |
| 1671 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3137 | `{ name: '--falcon-single-uploader-helper-color', defaultValue: 'var(--color-falc` |
| 1672 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3143 | `{ name: '--falcon-single-uploader-label-color', defaultValue: 'var(--color-falco` |
| 1673 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3148 | `{ name: '--falcon-single-uploader-required-marker-color', defaultValue: 'var(--c` |
| 1674 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3157 | `{ name: '--falcon-single-uploader-placeholder-color', defaultValue: 'var(--color` |
| 1675 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3158 | `{ name: '--falcon-single-uploader-placeholder-color-muted', defaultValue: 'var(-` |
| 1676 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3173 | `{ name: '--falcon-single-uploader-tile-bg', defaultValue: 'var(--color-falcon-ne` |
| 1677 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3174 | `{ name: '--falcon-single-uploader-tile-border-color', defaultValue: 'var(--color` |
| 1678 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3175 | `{ name: '--falcon-single-uploader-tile-border-color-error', defaultValue: 'var(-` |
| 1679 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3179 | `{ name: '--falcon-single-uploader-tile-shadow', defaultValue: '0 1px 2px rgba(0,` |
| 1680 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3185 | `{ name: '--falcon-single-uploader-progress-fill-bg', defaultValue: 'var(--color-` |
| 1681 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3186 | `{ name: '--falcon-single-uploader-progress-fill-bg-error', defaultValue: 'var(--` |
| 1682 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3189 | `{ name: '--falcon-single-uploader-progress-track-bg', defaultValue: 'rgba(0, 0, ` |
| 1683 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3200 | `{ name: '--falcon-status-badge-active-dot-bg', defaultValue: 'var(--color-falcon` |
| 1684 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3201 | `{ name: '--falcon-status-badge-danger-dot-bg', defaultValue: 'var(--color-falcon` |
| 1685 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3202 | `{ name: '--falcon-status-badge-dot-bg', defaultValue: 'var(--color-falcon-neutra` |
| 1686 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3205 | `{ name: '--falcon-status-badge-inactive-dot-bg', defaultValue: 'var(--color-falc` |
| 1687 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3206 | `{ name: '--falcon-status-badge-pending-dot-bg', defaultValue: 'var(--color-falco` |
| 1688 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3231 | `{ name: '--falcon-status-badge-active-bg', defaultValue: 'var(--color-falcon-gre` |
| 1689 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3232 | `{ name: '--falcon-status-badge-active-fg', defaultValue: 'var(--color-falcon-gre` |
| 1690 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3233 | `{ name: '--falcon-status-badge-bg', defaultValue: 'var(--color-falcon-neutral-17` |
| 1691 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3234 | `{ name: '--falcon-status-badge-danger-bg', defaultValue: 'var(--color-falcon-red` |
| 1692 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3235 | `{ name: '--falcon-status-badge-danger-fg', defaultValue: 'var(--color-falcon-red` |
| 1693 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3236 | `{ name: '--falcon-status-badge-fg', defaultValue: 'var(--color-falcon-neutral-70` |
| 1694 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3237 | `{ name: '--falcon-status-badge-inactive-bg', defaultValue: 'var(--color-falcon-n` |
| 1695 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3238 | `{ name: '--falcon-status-badge-inactive-fg', defaultValue: 'var(--color-falcon-n` |
| 1696 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3239 | `{ name: '--falcon-status-badge-pending-bg', defaultValue: 'var(--color-falcon-am` |
| 1697 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3240 | `{ name: '--falcon-status-badge-pending-fg', defaultValue: 'var(--color-falcon-am` |
| 1698 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3255 | `{ name: '--falcon-stepper-track-color', defaultValue: 'var(--color-falcon-neutra` |
| 1699 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3256 | `{ name: '--falcon-stepper-track-color-completed', defaultValue: 'var(--color-fal` |
| 1700 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3263 | `{ name: '--falcon-stepper-error-ring-shadow', defaultValue: '0 0 0 4px rgba(220,` |
| 1701 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3270 | `{ name: '--falcon-stepper-focus-outline', defaultValue: '2px solid var(--color-f` |
| 1702 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3283 | `{ name: '--falcon-stepper-group-label-color', defaultValue: 'var(--color-falcon-` |
| 1703 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3289 | `{ name: '--falcon-stepper-error-text-color', defaultValue: 'var(--color-falcon-r` |
| 1704 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3294 | `{ name: '--falcon-stepper-helper-color', defaultValue: 'var(--color-falcon-neutr` |
| 1705 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3300 | `{ name: '--falcon-stepper-icon-color-active', defaultValue: '#ffffff', category:` |
| 1706 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3301 | `{ name: '--falcon-stepper-icon-color-completed', defaultValue: '#ffffff', catego` |
| 1707 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3302 | `{ name: '--falcon-stepper-icon-color-disabled', defaultValue: 'var(--color-falco` |
| 1708 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3303 | `{ name: '--falcon-stepper-icon-color-error', defaultValue: '#ffffff', category: ` |
| 1709 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3304 | `{ name: '--falcon-stepper-icon-color-upcoming', defaultValue: 'var(--color-falco` |
| 1710 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3310 | `{ name: '--falcon-stepper-optional-color', defaultValue: 'var(--color-falcon-neu` |
| 1711 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3323 | `{ name: '--falcon-stepper-circle-bg-active', defaultValue: 'var(--color-falcon-t` |
| 1712 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3324 | `{ name: '--falcon-stepper-circle-bg-completed', defaultValue: 'var(--color-falco` |
| 1713 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3325 | `{ name: '--falcon-stepper-circle-bg-disabled', defaultValue: 'var(--color-falcon` |
| 1714 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3326 | `{ name: '--falcon-stepper-circle-bg-error', defaultValue: 'var(--color-falcon-re` |
| 1715 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3327 | `{ name: '--falcon-stepper-circle-bg-upcoming', defaultValue: 'var(--color-falcon` |
| 1716 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3330 | `{ name: '--falcon-stepper-circle-color-active', defaultValue: '#ffffff', categor` |
| 1717 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3331 | `{ name: '--falcon-stepper-circle-color-completed', defaultValue: '#ffffff', cate` |
| 1718 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3332 | `{ name: '--falcon-stepper-circle-color-disabled', defaultValue: 'var(--color-fal` |
| 1719 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3333 | `{ name: '--falcon-stepper-circle-color-error', defaultValue: '#ffffff', category` |
| 1720 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3334 | `{ name: '--falcon-stepper-circle-color-upcoming', defaultValue: 'var(--color-fal` |
| 1721 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3336 | `{ name: '--falcon-stepper-circle-shadow-active', defaultValue: '0 0 0 4px rgba(1` |
| 1722 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3337 | `{ name: '--falcon-stepper-circle-shadow-focus', defaultValue: '0 0 0 3px rgba(13` |
| 1723 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3341 | `{ name: '--falcon-stepper-label-color-active', defaultValue: 'var(--color-falcon` |
| 1724 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3342 | `{ name: '--falcon-stepper-label-color-completed', defaultValue: 'var(--color-fal` |
| 1725 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3343 | `{ name: '--falcon-stepper-label-color-disabled', defaultValue: 'var(--color-falc` |
| 1726 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3344 | `{ name: '--falcon-stepper-label-color-error', defaultValue: 'var(--color-falcon-` |
| 1727 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3345 | `{ name: '--falcon-stepper-label-color-upcoming', defaultValue: 'var(--color-falc` |
| 1728 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3361 | `{ name: '--falcon-stepper-pulse-color', defaultValue: '#ffffff', category: 'STEP` |
| 1729 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3365 | `{ name: '--falcon-stepper-desc-color', defaultValue: 'var(--color-falcon-neutral` |
| 1730 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3378 | `{ name: '--falcon-switch-track-bg-channel-pill-on', defaultValue: 'var(--color-f` |
| 1731 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3379 | `{ name: '--falcon-switch-track-bg-disabled-off', defaultValue: 'var(--color-falc` |
| 1732 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3380 | `{ name: '--falcon-switch-track-bg-disabled-on', defaultValue: 'var(--color-falco` |
| 1733 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3381 | `{ name: '--falcon-switch-track-bg-error', defaultValue: 'var(--color-falcon-red-` |
| 1734 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3382 | `{ name: '--falcon-switch-track-bg-off', defaultValue: 'var(--color-falcon-neutra` |
| 1735 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3383 | `{ name: '--falcon-switch-track-bg-off-hover', defaultValue: 'var(--color-falcon-` |
| 1736 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3384 | `{ name: '--falcon-switch-track-bg-on', defaultValue: 'var(--color-falcon-teal-50` |
| 1737 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3385 | `{ name: '--falcon-switch-track-bg-on-hover', defaultValue: 'var(--color-falcon-t` |
| 1738 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3388 | `{ name: '--falcon-switch-track-border-color-channel-pill-off', defaultValue: 'va` |
| 1739 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3389 | `{ name: '--falcon-switch-track-border-color-channel-pill-on', defaultValue: 'var` |
| 1740 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3390 | `{ name: '--falcon-switch-track-border-color-disabled', defaultValue: 'var(--colo` |
| 1741 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3391 | `{ name: '--falcon-switch-track-border-color-error', defaultValue: 'var(--color-f` |
| 1742 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3393 | `{ name: '--falcon-switch-track-border-color-on', defaultValue: 'var(--color-falc` |
| 1743 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3406 | `{ name: '--falcon-switch-error-color', defaultValue: 'var(--color-falcon-red-500` |
| 1744 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3414 | `{ name: '--falcon-switch-ring-color-error', defaultValue: 'var(--color-falcon-re` |
| 1745 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3415 | `{ name: '--falcon-switch-ring-color-focus', defaultValue: 'var(--color-falcon-te` |
| 1746 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3419 | `{ name: '--falcon-switch-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.08) 0 ` |
| 1747 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3424 | `{ name: '--falcon-switch-group-label-color', defaultValue: 'var(--color-falcon-n` |
| 1748 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3430 | `{ name: '--falcon-switch-helper-color', defaultValue: 'var(--color-falcon-neutra` |
| 1749 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3437 | `{ name: '--falcon-switch-knob-bg', defaultValue: 'var(--color-falcon-neutral-0, ` |
| 1750 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3438 | `{ name: '--falcon-switch-knob-bg-channel-pill-off', defaultValue: 'var(--color-f` |
| 1751 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3439 | `{ name: '--falcon-switch-knob-bg-channel-pill-on', defaultValue: 'var(--color-fa` |
| 1752 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3440 | `{ name: '--falcon-switch-knob-bg-disabled', defaultValue: 'var(--color-falcon-ne` |
| 1753 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3441 | `{ name: '--falcon-switch-knob-bg-on', defaultValue: 'var(--color-falcon-neutral-` |
| 1754 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3443 | `{ name: '--falcon-switch-knob-shadow', defaultValue: '0 1px 2px rgba(0, 0, 0, 0.` |
| 1755 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3447 | `{ name: '--falcon-switch-label-color', defaultValue: 'var(--color-falcon-neutral` |
| 1756 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3448 | `{ name: '--falcon-switch-label-color-disabled', defaultValue: 'var(--color-falco` |
| 1757 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3449 | `{ name: '--falcon-switch-label-color-error', defaultValue: 'var(--color-falcon-r` |
| 1758 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3456 | `{ name: '--falcon-switch-required-color', defaultValue: 'var(--color-falcon-red-` |
| 1759 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3495 | `{ name: '--falcon-switch-inner-label-color-off', defaultValue: 'var(--color-falc` |
| 1760 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3496 | `{ name: '--falcon-switch-inner-label-color-on', defaultValue: 'var(--color-falco` |
| 1761 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3514 | `{ name: '--falcon-table-cell-color', defaultValue: 'var(--color-falcon-neutral-9` |
| 1762 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3525 | `{ name: '--falcon-table-cell-badge-bg', defaultValue: 'var(--color-falcon-neutra` |
| 1763 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3526 | `{ name: '--falcon-table-cell-badge-color', defaultValue: 'var(--color-falcon-neu` |
| 1764 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3544 | `{ name: '--falcon-table-container-bg', defaultValue: 'var(--color-falcon-neutral` |
| 1765 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3545 | `{ name: '--falcon-table-container-border-color', defaultValue: 'var(--color-falc` |
| 1766 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3560 | `{ name: '--falcon-table-empty-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1767 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3567 | `{ name: '--falcon-table-focus-ring-color', defaultValue: 'var(--color-falcon-tea` |
| 1768 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3573 | `{ name: '--falcon-table-header-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1769 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3574 | `{ name: '--falcon-table-header-border-bottom-color', defaultValue: 'var(--color-` |
| 1770 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3576 | `{ name: '--falcon-table-header-color', defaultValue: 'var(--color-falcon-neutral` |
| 1771 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3591 | `{ name: '--falcon-table-sort-hover-color', defaultValue: 'var(--color-falcon-neu` |
| 1772 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3592 | `{ name: '--falcon-table-sort-indicator-active-color', defaultValue: 'var(--color` |
| 1773 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3594 | `{ name: '--falcon-table-sort-indicator-color', defaultValue: 'var(--color-falcon` |
| 1774 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3600 | `{ name: '--falcon-table-loading-overlay-bg', defaultValue: 'rgba(255, 255, 255, ` |
| 1775 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3601 | `{ name: '--falcon-table-loading-overlay-color', defaultValue: 'var(--color-falco` |
| 1776 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3602 | `{ name: '--falcon-table-loading-spinner-border-color', defaultValue: 'var(--colo` |
| 1777 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3608 | `{ name: '--falcon-table-footer-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1778 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3609 | `{ name: '--falcon-table-footer-border-top-color', defaultValue: 'var(--color-fal` |
| 1779 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3611 | `{ name: '--falcon-table-footer-color', defaultValue: 'var(--color-falcon-neutral` |
| 1780 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3620 | `{ name: '--falcon-table-row-bg-focus', defaultValue: 'var(--color-falcon-teal-ti` |
| 1781 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3621 | `{ name: '--falcon-table-row-bg-hover', defaultValue: 'var(--color-falcon-neutral` |
| 1782 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3622 | `{ name: '--falcon-table-row-bg-selected', defaultValue: 'var(--color-falcon-teal` |
| 1783 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3623 | `{ name: '--falcon-table-row-border-bottom-color', defaultValue: 'var(--color-fal` |
| 1784 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3625 | `{ name: '--falcon-table-row-color', defaultValue: 'var(--color-falcon-neutral-90` |
| 1785 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3629 | `{ name: '--falcon-table-bordered-cell-border-inline-end-color', defaultValue: 'v` |
| 1786 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3635 | `{ name: '--falcon-table-row-bg-striped', defaultValue: 'var(--color-falcon-neutr` |
| 1787 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3649 | `{ name: '--falcon-tabs-error-color', defaultValue: 'var(--color-falcon-red-500, ` |
| 1788 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3657 | `{ name: '--falcon-tabs-helper-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1789 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3675 | `{ name: '--falcon-tabs-panel-color', defaultValue: 'var(--color-falcon-neutral-9` |
| 1790 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3680 | `{ name: '--falcon-tabs-rc-card-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1791 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3681 | `{ name: '--falcon-tabs-rc-card-bg-disabled', defaultValue: 'var(--color-falcon-n` |
| 1792 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3682 | `{ name: '--falcon-tabs-rc-card-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1793 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3683 | `{ name: '--falcon-tabs-rc-card-bg-selected', defaultValue: 'var(--color-falcon-t` |
| 1794 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3684 | `{ name: '--falcon-tabs-rc-card-border-color', defaultValue: 'var(--color-falcon-` |
| 1795 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3685 | `{ name: '--falcon-tabs-rc-card-border-color-hover', defaultValue: 'var(--color-f` |
| 1796 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3686 | `{ name: '--falcon-tabs-rc-card-border-color-selected', defaultValue: 'var(--colo` |
| 1797 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3697 | `{ name: '--falcon-tabs-rc-header-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1798 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3698 | `{ name: '--falcon-tabs-rc-header-border-color', defaultValue: 'var(--color-falco` |
| 1799 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3706 | `{ name: '--falcon-tabs-rc-tab-bg-active', defaultValue: 'var(--color-falcon-neut` |
| 1800 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3708 | `{ name: '--falcon-tabs-rc-tab-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1801 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3709 | `{ name: '--falcon-tabs-rc-tab-color-active', defaultValue: 'var(--color-falcon-n` |
| 1802 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3710 | `{ name: '--falcon-tabs-rc-tab-color-hover', defaultValue: 'var(--color-falcon-ne` |
| 1803 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3711 | `{ name: '--falcon-tabs-rc-tab-divider-color', defaultValue: 'var(--color-falcon-` |
| 1804 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3721 | `{ name: '--falcon-tabs-rc-radio-bg', defaultValue: 'var(--color-falcon-neutral-0` |
| 1805 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3722 | `{ name: '--falcon-tabs-rc-radio-border-color', defaultValue: 'var(--color-falcon` |
| 1806 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3723 | `{ name: '--falcon-tabs-rc-radio-border-color-selected', defaultValue: 'var(--col` |
| 1807 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3730 | `{ name: '--falcon-tabs-rc-desc-color', defaultValue: 'var(--color-falcon-neutral` |
| 1808 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3734 | `{ name: '--falcon-tabs-rc-title-color', defaultValue: 'var(--color-falcon-neutra` |
| 1809 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3744 | `{ name: '--falcon-tabs-tab-color', defaultValue: 'var(--color-falcon-neutral-500` |
| 1810 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3745 | `{ name: '--falcon-tabs-tab-color-active', defaultValue: 'var(--color-falcon-neut` |
| 1811 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3746 | `{ name: '--falcon-tabs-tab-color-disabled', defaultValue: 'var(--color-falcon-ne` |
| 1812 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3747 | `{ name: '--falcon-tabs-tab-color-focus', defaultValue: 'var(--color-falcon-neutr` |
| 1813 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3748 | `{ name: '--falcon-tabs-tab-color-hover', defaultValue: 'var(--color-falcon-neutr` |
| 1814 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3753 | `{ name: '--falcon-tabs-tab-focus-shadow', defaultValue: 'rgba(13, 63, 68, 0.18) ` |
| 1815 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3778 | `{ name: '--falcon-tabs-tablist-bg', defaultValue: 'var(--color-falcon-neutral-0,` |
| 1816 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3779 | `{ name: '--falcon-tabs-tablist-border-bottom-color', defaultValue: 'var(--color-` |
| 1817 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3794 | `{ name: '--falcon-tabs-indicator-color', defaultValue: 'var(--color-falcon-teal-` |
| 1818 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3821 | `{ name: '--falcon-tag-bg', defaultValue: 'var(--color-falcon-neutral-175, #eff0f` |
| 1819 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3822 | `{ name: '--falcon-tag-fg', defaultValue: 'var(--color-falcon-neutral-700, #37415` |
| 1820 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3842 | `{ name: '--falcon-textarea-bg', defaultValue: 'var(--color-falcon-neutral-0, #ff` |
| 1821 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3843 | `{ name: '--falcon-textarea-bg-disabled', defaultValue: 'var(--color-falcon-neutr` |
| 1822 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3844 | `{ name: '--falcon-textarea-bg-error', defaultValue: 'var(--color-falcon-red-100,` |
| 1823 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3845 | `{ name: '--falcon-textarea-bg-filled', defaultValue: 'var(--color-falcon-neutral` |
| 1824 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3846 | `{ name: '--falcon-textarea-bg-filled-focus', defaultValue: 'var(--color-falcon-n` |
| 1825 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3847 | `{ name: '--falcon-textarea-bg-filled-hover', defaultValue: 'var(--color-falcon-n` |
| 1826 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3848 | `{ name: '--falcon-textarea-bg-focus', defaultValue: 'var(--color-falcon-neutral-` |
| 1827 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3849 | `{ name: '--falcon-textarea-bg-ghost-hover', defaultValue: 'var(--color-falcon-ne` |
| 1828 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3850 | `{ name: '--falcon-textarea-bg-hover', defaultValue: 'var(--color-falcon-neutral-` |
| 1829 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3851 | `{ name: '--falcon-textarea-bg-readonly', defaultValue: 'var(--color-falcon-neutr` |
| 1830 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3852 | `{ name: '--falcon-textarea-bg-success', defaultValue: 'var(--color-falcon-neutra` |
| 1831 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3853 | `{ name: '--falcon-textarea-bg-warning', defaultValue: 'var(--color-falcon-neutra` |
| 1832 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3856 | `{ name: '--falcon-textarea-border-color', defaultValue: 'var(--color-falcon-neut` |
| 1833 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3857 | `{ name: '--falcon-textarea-border-color-disabled', defaultValue: 'var(--color-fa` |
| 1834 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3858 | `{ name: '--falcon-textarea-border-color-error', defaultValue: 'var(--color-falco` |
| 1835 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3859 | `{ name: '--falcon-textarea-border-color-focus', defaultValue: 'var(--color-falco` |
| 1836 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3860 | `{ name: '--falcon-textarea-border-color-hover', defaultValue: 'var(--color-falco` |
| 1837 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3861 | `{ name: '--falcon-textarea-border-color-readonly', defaultValue: 'var(--color-fa` |
| 1838 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3862 | `{ name: '--falcon-textarea-border-color-success', defaultValue: 'var(--color-fal` |
| 1839 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3863 | `{ name: '--falcon-textarea-border-color-warning', defaultValue: 'var(--color-fal` |
| 1840 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3874 | `{ name: '--falcon-textarea-counter-color', defaultValue: 'var(--color-falcon-neu` |
| 1841 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3875 | `{ name: '--falcon-textarea-counter-color-over', defaultValue: 'var(--color-falco` |
| 1842 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3876 | `{ name: '--falcon-textarea-counter-color-warning', defaultValue: 'var(--color-fa` |
| 1843 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3884 | `{ name: '--falcon-textarea-error-color', defaultValue: 'var(--color-falcon-red-5` |
| 1844 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3892 | `{ name: '--falcon-textarea-helper-color', defaultValue: 'var(--color-falcon-neut` |
| 1845 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3899 | `{ name: '--falcon-textarea-label-color', defaultValue: 'var(--color-falcon-neutr` |
| 1846 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3900 | `{ name: '--falcon-textarea-label-color-error', defaultValue: 'var(--color-falcon` |
| 1847 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3907 | `{ name: '--falcon-textarea-required-color', defaultValue: 'var(--color-falcon-re` |
| 1848 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3917 | `{ name: '--falcon-textarea-ring-color-error', defaultValue: 'var(--color-falcon-` |
| 1849 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3918 | `{ name: '--falcon-textarea-ring-color-focus', defaultValue: 'var(--color-falcon-` |
| 1850 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3923 | `{ name: '--falcon-textarea-shadow-error', defaultValue: 'rgba(0, 0, 0, 0) 0 0 0 ` |
| 1851 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3924 | `{ name: '--falcon-textarea-shadow-focus', defaultValue: 'rgba(13, 63, 68, 0.09) ` |
| 1852 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3945 | `{ name: '--falcon-textarea-placeholder-color', defaultValue: 'var(--color-falcon` |
| 1853 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3946 | `{ name: '--falcon-textarea-text-color', defaultValue: 'var(--color-falcon-neutra` |
| 1854 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3947 | `{ name: '--falcon-textarea-text-color-disabled', defaultValue: 'var(--color-falc` |
| 1855 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3961 | `{ name: '--falcon-toast-action-color', defaultValue: 'var(--color-falcon-teal-50` |
| 1856 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3962 | `{ name: '--falcon-toast-action-color-hover', defaultValue: 'var(--color-falcon-t` |
| 1857 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3979 | `{ name: '--falcon-toast-dismiss-bg-hover', defaultValue: 'var(--color-falcon-neu` |
| 1858 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3980 | `{ name: '--falcon-toast-dismiss-color', defaultValue: 'var(--color-falcon-neutra` |
| 1859 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3981 | `{ name: '--falcon-toast-dismiss-color-hover', defaultValue: 'var(--color-falcon-` |
| 1860 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 3986 | `{ name: '--falcon-toast-focus-ring-color', defaultValue: 'var(--color-falcon-tea` |
| 1861 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4000 | `{ name: '--falcon-toast-icon-error-bg', defaultValue: 'var(--color-falcon-red-10` |
| 1862 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4001 | `{ name: '--falcon-toast-icon-error-color', defaultValue: 'var(--color-falcon-red` |
| 1863 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4002 | `{ name: '--falcon-toast-icon-info-bg', defaultValue: '#e0f2fe', category: 'SEVER` |
| 1864 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4003 | `{ name: '--falcon-toast-icon-info-color', defaultValue: '#0284c7', category: 'SE` |
| 1865 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4004 | `{ name: '--falcon-toast-icon-success-bg', defaultValue: 'var(--color-falcon-gree` |
| 1866 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4005 | `{ name: '--falcon-toast-icon-success-color', defaultValue: 'var(--color-falcon-g` |
| 1867 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4006 | `{ name: '--falcon-toast-icon-warning-bg', defaultValue: 'var(--color-falcon-ambe` |
| 1868 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4007 | `{ name: '--falcon-toast-icon-warning-color', defaultValue: 'var(--color-falcon-a` |
| 1869 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4023 | `{ name: '--falcon-toast-message-color', defaultValue: 'var(--color-falcon-neutra` |
| 1870 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4029 | `{ name: '--falcon-toast-title-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1871 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4036 | `{ name: '--falcon-toast-bg', defaultValue: 'var(--color-falcon-neutral-0, #fffff` |
| 1872 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4037 | `{ name: '--falcon-toast-border-color', defaultValue: 'var(--color-falcon-neutral` |
| 1873 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4040 | `{ name: '--falcon-toast-color', defaultValue: 'var(--color-falcon-neutral-900, #` |
| 1874 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4045 | `{ name: '--falcon-toast-shadow', defaultValue: '0 8px 24px rgba(0, 0, 0, 0.10)',` |
| 1875 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4067 | `{ name: '--falcon-tooltip-light-bg', defaultValue: 'var(--color-falcon-neutral-0` |
| 1876 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4068 | `{ name: '--falcon-tooltip-light-border-color', defaultValue: 'var(--color-falcon` |
| 1877 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4069 | `{ name: '--falcon-tooltip-light-color', defaultValue: 'var(--color-falcon-neutra` |
| 1878 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4080 | `{ name: '--falcon-tooltip-trigger-focus-ring-color', defaultValue: 'var(--color-` |
| 1879 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4094 | `{ name: '--falcon-tooltip-panel-bg', defaultValue: 'var(--color-falcon-neutral-9` |
| 1880 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4099 | `{ name: '--falcon-tooltip-panel-color', defaultValue: 'var(--color-falcon-neutra` |
| 1881 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4104 | `{ name: '--falcon-tooltip-panel-shadow', defaultValue: '0 4px 12px rgba(0, 0, 0,` |
| 1882 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4135 | `{ name: '--falcon-tree-badge-danger-bg', defaultValue: 'var(--color-falcon-red-1` |
| 1883 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4136 | `{ name: '--falcon-tree-badge-danger-color', defaultValue: 'var(--color-falcon-re` |
| 1884 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4140 | `{ name: '--falcon-tree-badge-info-bg', defaultValue: 'var(--color-falcon-teal-10` |
| 1885 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4141 | `{ name: '--falcon-tree-badge-info-color', defaultValue: 'var(--color-falcon-teal` |
| 1886 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4144 | `{ name: '--falcon-tree-badge-success-bg', defaultValue: 'var(--color-falcon-gree` |
| 1887 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4145 | `{ name: '--falcon-tree-badge-success-color', defaultValue: 'var(--color-falcon-g` |
| 1888 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4146 | `{ name: '--falcon-tree-badge-warning-bg', defaultValue: 'var(--color-falcon-ambe` |
| 1889 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4147 | `{ name: '--falcon-tree-badge-warning-color', defaultValue: 'var(--color-falcon-a` |
| 1890 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4150 | `{ name: '--falcon-tree-chevron-bg-hover', defaultValue: 'var(--color-falcon-neut` |
| 1891 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4153 | `{ name: '--falcon-tree-chevron-color', defaultValue: 'var(--color-falcon-neutral` |
| 1892 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4154 | `{ name: '--falcon-tree-chevron-color-collapsed', defaultValue: 'var(--color-falc` |
| 1893 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4155 | `{ name: '--falcon-tree-chevron-color-hover', defaultValue: 'var(--color-falcon-t` |
| 1894 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4163 | `{ name: '--falcon-tree-indicator-bg', defaultValue: 'var(--color-falcon-mint-100` |
| 1895 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4164 | `{ name: '--falcon-tree-indicator-border-color', defaultValue: 'var(--color-falco` |
| 1896 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4167 | `{ name: '--falcon-tree-indicator-color', defaultValue: 'var(--color-falcon-teal-` |
| 1897 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4174 | `{ name: '--falcon-tree-bg', defaultValue: 'var(--color-falcon-neutral-0, #ffffff` |
| 1898 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4175 | `{ name: '--falcon-tree-border-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1899 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4186 | `{ name: '--falcon-tree-error-color', defaultValue: 'var(--color-falcon-red-500, ` |
| 1900 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4194 | `{ name: '--falcon-tree-group-label-color', defaultValue: 'var(--color-falcon-neu` |
| 1901 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4198 | `{ name: '--falcon-tree-helper-color', defaultValue: 'var(--color-falcon-neutral-` |
| 1902 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4205 | `{ name: '--falcon-tree-focus-halo-color', defaultValue: 'var(--color-falcon-teal` |
| 1903 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4207 | `{ name: '--falcon-tree-focus-ring-color', defaultValue: 'var(--color-falcon-teal` |
| 1904 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4213 | `{ name: '--falcon-tree-icon-color', defaultValue: 'var(--color-falcon-neutral-70` |
| 1905 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4230 | `{ name: '--falcon-tree-node-bg-focus', defaultValue: 'var(--color-falcon-teal-10` |
| 1906 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4231 | `{ name: '--falcon-tree-node-bg-hover', defaultValue: 'var(--color-falcon-neutral` |
| 1907 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4233 | `{ name: '--falcon-tree-node-bg-selected', defaultValue: 'var(--color-falcon-teal` |
| 1908 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4235 | `{ name: '--falcon-tree-node-color', defaultValue: 'var(--color-falcon-neutral-90` |
| 1909 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4236 | `{ name: '--falcon-tree-node-color-disabled', defaultValue: 'var(--color-falcon-n` |
| 1910 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4237 | `{ name: '--falcon-tree-node-color-hover', defaultValue: 'var(--color-falcon-neut` |
| 1911 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4238 | `{ name: '--falcon-tree-node-color-selected', defaultValue: 'var(--color-falcon-t` |
| 1912 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4246 | `{ name: '--falcon-tree-label-color', defaultValue: 'var(--color-falcon-neutral-9` |
| 1913 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4247 | `{ name: '--falcon-tree-label-color-selected', defaultValue: 'var(--color-falcon-` |
| 1914 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4254 | `{ name: '--falcon-tree-rail-color', defaultValue: 'var(--color-falcon-teal-alpha` |
| 1915 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4255 | `{ name: '--falcon-tree-rail-color-active', defaultValue: 'var(--color-falcon-tea` |
| 1916 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4261 | `{ name: '--falcon-tree-rail-elbow-color', defaultValue: 'var(--color-falcon-teal` |
| 1917 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4262 | `{ name: '--falcon-tree-rail-elbow-color-active', defaultValue: 'var(--color-falc` |
| 1918 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4272 | `{ name: '--falcon-tree-table-cell-border-bottom-color', defaultValue: 'var(--col` |
| 1919 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4275 | `{ name: '--falcon-tree-table-cell-color', defaultValue: 'var(--color-falcon-neut` |
| 1920 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4288 | `{ name: '--falcon-tree-table-bg', defaultValue: 'var(--color-falcon-neutral-0, #` |
| 1921 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4289 | `{ name: '--falcon-tree-table-border-color', defaultValue: 'var(--color-falcon-ne` |
| 1922 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4297 | `{ name: '--falcon-tree-table-badge-bg', defaultValue: 'var(--color-falcon-teal-o` |
| 1923 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4298 | `{ name: '--falcon-tree-table-badge-bg-inactive', defaultValue: 'var(--color-falc` |
| 1924 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4300 | `{ name: '--falcon-tree-table-badge-color', defaultValue: 'var(--color-falcon-tea` |
| 1925 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4301 | `{ name: '--falcon-tree-table-badge-color-inactive', defaultValue: 'var(--color-f` |
| 1926 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4309 | `{ name: '--falcon-tree-table-error-color', defaultValue: 'var(--color-falcon-red` |
| 1927 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4315 | `{ name: '--falcon-tree-table-group-label-color', defaultValue: 'var(--color-falc` |
| 1928 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4319 | `{ name: '--falcon-tree-table-helper-color', defaultValue: 'var(--color-falcon-ne` |
| 1929 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4326 | `{ name: '--falcon-tree-table-radio-cell-bg-selected', defaultValue: 'var(--color` |
| 1930 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4332 | `{ name: '--falcon-tree-table-chevron-bg-hover', defaultValue: 'var(--color-falco` |
| 1931 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4334 | `{ name: '--falcon-tree-table-chevron-color', defaultValue: 'var(--color-falcon-n` |
| 1932 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4335 | `{ name: '--falcon-tree-table-chevron-color-collapsed', defaultValue: 'var(--colo` |
| 1933 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4336 | `{ name: '--falcon-tree-table-chevron-color-hover', defaultValue: 'var(--color-fa` |
| 1934 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4347 | `{ name: '--falcon-tree-table-header-bg', defaultValue: 'var(--color-falcon-neutr` |
| 1935 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4348 | `{ name: '--falcon-tree-table-header-border-bottom-color', defaultValue: 'var(--c` |
| 1936 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4351 | `{ name: '--falcon-tree-table-header-color', defaultValue: 'var(--color-falcon-ne` |
| 1937 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4360 | `{ name: '--falcon-tree-table-icon-color', defaultValue: 'var(--color-falcon-neut` |
| 1938 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4385 | `{ name: '--falcon-tree-table-row-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1939 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4386 | `{ name: '--falcon-tree-table-row-bg-disabled', defaultValue: 'var(--color-falcon` |
| 1940 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4387 | `{ name: '--falcon-tree-table-row-bg-focus', defaultValue: 'var(--color-falcon-te` |
| 1941 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4388 | `{ name: '--falcon-tree-table-row-bg-hover', defaultValue: 'var(--color-falcon-ne` |
| 1942 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4389 | `{ name: '--falcon-tree-table-row-bg-root', defaultValue: 'var(--color-falcon-tea` |
| 1943 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4390 | `{ name: '--falcon-tree-table-row-bg-selected', defaultValue: 'var(--color-falcon` |
| 1944 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4391 | `{ name: '--falcon-tree-table-row-color', defaultValue: 'var(--color-falcon-neutr` |
| 1945 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4392 | `{ name: '--falcon-tree-table-row-color-disabled', defaultValue: 'var(--color-fal` |
| 1946 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4393 | `{ name: '--falcon-tree-table-row-color-hover', defaultValue: 'var(--color-falcon` |
| 1947 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4394 | `{ name: '--falcon-tree-table-row-color-selected', defaultValue: 'var(--color-fal` |
| 1948 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4396 | `{ name: '--falcon-tree-table-row-focus-shadow', defaultValue: 'inset 0 0 0 2px v` |
| 1949 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4399 | `{ name: '--falcon-tree-table-label-color', defaultValue: 'var(--color-falcon-neu` |
| 1950 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4414 | `{ name: '--falcon-uploader-browse-link-color', defaultValue: 'var(--color-falcon` |
| 1951 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4415 | `{ name: '--falcon-uploader-browse-link-color-hover', defaultValue: 'var(--color-` |
| 1952 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4423 | `{ name: '--falcon-uploader-dropzone-bg', defaultValue: 'var(--color-falcon-neutr` |
| 1953 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4424 | `{ name: '--falcon-uploader-dropzone-bg-disabled', defaultValue: 'var(--color-fal` |
| 1954 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4425 | `{ name: '--falcon-uploader-dropzone-bg-drag-over', defaultValue: 'var(--color-fa` |
| 1955 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4426 | `{ name: '--falcon-uploader-dropzone-bg-error', defaultValue: 'rgba(220, 38, 38, ` |
| 1956 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4427 | `{ name: '--falcon-uploader-dropzone-bg-hover', defaultValue: 'var(--color-falcon` |
| 1957 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4428 | `{ name: '--falcon-uploader-dropzone-border-color', defaultValue: 'var(--color-fa` |
| 1958 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4429 | `{ name: '--falcon-uploader-dropzone-border-color-disabled', defaultValue: 'var(-` |
| 1959 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4430 | `{ name: '--falcon-uploader-dropzone-border-color-drag-over', defaultValue: 'var(` |
| 1960 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4431 | `{ name: '--falcon-uploader-dropzone-border-color-error', defaultValue: 'var(--co` |
| 1961 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4432 | `{ name: '--falcon-uploader-dropzone-border-color-focus', defaultValue: 'var(--co` |
| 1962 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4433 | `{ name: '--falcon-uploader-dropzone-border-color-hover', defaultValue: 'var(--co` |
| 1963 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4437 | `{ name: '--falcon-uploader-dropzone-color', defaultValue: 'var(--color-falcon-ne` |
| 1964 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4438 | `{ name: '--falcon-uploader-dropzone-color-disabled', defaultValue: 'var(--color-` |
| 1965 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4440 | `{ name: '--falcon-uploader-dropzone-focus-shadow', defaultValue: '0 0 0 3px rgba` |
| 1966 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4447 | `{ name: '--falcon-uploader-dropzone-icon-color', defaultValue: 'var(--color-falc` |
| 1967 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4448 | `{ name: '--falcon-uploader-dropzone-icon-color-drag-over', defaultValue: 'var(--` |
| 1968 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4453 | `{ name: '--falcon-uploader-item-bg', defaultValue: 'var(--color-falcon-neutral-0` |
| 1969 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4454 | `{ name: '--falcon-uploader-item-bg-error', defaultValue: 'rgba(220, 38, 38, 0.04` |
| 1970 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4455 | `{ name: '--falcon-uploader-item-bg-hover', defaultValue: 'var(--color-falcon-neu` |
| 1971 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4456 | `{ name: '--falcon-uploader-item-bg-success', defaultValue: 'var(--color-falcon-t` |
| 1972 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4457 | `{ name: '--falcon-uploader-item-bg-uploading', defaultValue: 'var(--color-falcon` |
| 1973 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4458 | `{ name: '--falcon-uploader-item-border-color', defaultValue: 'var(--color-falcon` |
| 1974 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4459 | `{ name: '--falcon-uploader-item-border-color-error', defaultValue: 'rgba(220, 38` |
| 1975 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4470 | `{ name: '--falcon-uploader-name-color', defaultValue: 'var(--color-falcon-neutra` |
| 1976 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4476 | `{ name: '--falcon-uploader-size-color', defaultValue: 'var(--color-falcon-neutra` |
| 1977 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4482 | `{ name: '--falcon-uploader-label-color', defaultValue: 'var(--color-falcon-neutr` |
| 1978 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4487 | `{ name: '--falcon-uploader-required-marker-color', defaultValue: 'var(--color-fa` |
| 1979 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4492 | `{ name: '--falcon-uploader-error-text-color', defaultValue: 'var(--color-falcon-` |
| 1980 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4497 | `{ name: '--falcon-uploader-helper-color', defaultValue: 'var(--color-falcon-neut` |
| 1981 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4501 | `{ name: '--falcon-uploader-item-error-color', defaultValue: 'var(--color-falcon-` |
| 1982 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4511 | `{ name: '--falcon-uploader-placeholder-color', defaultValue: 'var(--color-falcon` |
| 1983 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4512 | `{ name: '--falcon-uploader-placeholder-color-muted', defaultValue: 'var(--color-` |
| 1984 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4521 | `{ name: '--falcon-uploader-icon-fallback-color', defaultValue: 'var(--color-falc` |
| 1985 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4523 | `{ name: '--falcon-uploader-thumb-bg', defaultValue: 'var(--color-falcon-neutral-` |
| 1986 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4524 | `{ name: '--falcon-uploader-thumb-border-color', defaultValue: 'var(--color-falco` |
| 1987 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4530 | `{ name: '--falcon-uploader-progress-fill-bg', defaultValue: 'var(--color-falcon-` |
| 1988 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4531 | `{ name: '--falcon-uploader-progress-fill-bg-error', defaultValue: 'var(--color-f` |
| 1989 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4535 | `{ name: '--falcon-uploader-progress-track-bg', defaultValue: 'var(--color-falcon` |
| 1990 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4539 | `{ name: '--falcon-uploader-remove-bg-hover', defaultValue: 'rgba(220, 38, 38, 0.` |
| 1991 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4540 | `{ name: '--falcon-uploader-remove-color', defaultValue: 'var(--color-falcon-neut` |
| 1992 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4541 | `{ name: '--falcon-uploader-remove-color-hover', defaultValue: 'var(--color-falco` |
| 1993 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4547 | `{ name: '--falcon-uploader-badge-bg-error', defaultValue: 'rgba(220, 38, 38, 0.1` |
| 1994 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4548 | `{ name: '--falcon-uploader-badge-bg-queued', defaultValue: 'var(--color-falcon-n` |
| 1995 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4549 | `{ name: '--falcon-uploader-badge-bg-success', defaultValue: 'var(--color-falcon-` |
| 1996 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4550 | `{ name: '--falcon-uploader-badge-bg-uploading', defaultValue: 'var(--color-falco` |
| 1997 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4551 | `{ name: '--falcon-uploader-badge-color-error', defaultValue: 'var(--color-falcon` |
| 1998 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4552 | `{ name: '--falcon-uploader-badge-color-queued', defaultValue: 'var(--color-falco` |
| 1999 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4553 | `{ name: '--falcon-uploader-badge-color-success', defaultValue: 'var(--color-falc` |
| 2000 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4554 | `{ name: '--falcon-uploader-badge-color-uploading', defaultValue: 'var(--color-fa` |
| 2001 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4569 | `{ name: '--falcon-wizard-btn-back-border', defaultValue: 'var(--color-falcon-neu` |
| 2002 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4570 | `{ name: '--falcon-wizard-btn-back-fg', defaultValue: 'var(--color-falcon-neutral` |
| 2003 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4573 | `{ name: '--falcon-wizard-btn-draft-fg', defaultValue: 'var(--color-falcon-teal-7` |
| 2004 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4578 | `{ name: '--falcon-wizard-btn-primary-bg', defaultValue: 'var(--color-falcon-teal` |
| 2005 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4579 | `{ name: '--falcon-wizard-btn-primary-fg', defaultValue: 'var(--color-falcon-neut` |
| 2006 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4593 | `{ name: '--falcon-wizard-bg', defaultValue: 'var(--color-falcon-neutral-50, #fff` |
| 2007 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4594 | `{ name: '--falcon-wizard-border-color', defaultValue: 'var(--color-falcon-neutra` |
| 2008 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4596 | `{ name: '--falcon-wizard-divider-color', defaultValue: 'var(--color-falcon-neutr` |
| 2009 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | 4597 | `{ name: '--falcon-wizard-fg', defaultValue: 'var(--color-falcon-neutral-800, #1f` |
| 2010 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 30 | `'--color-falcon-neutral-0': '#0b1020',` |
| 2011 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 31 | `'--color-falcon-neutral-50': '#111933',` |
| 2012 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 32 | `'--color-falcon-neutral-100': '#162042',` |
| 2013 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 33 | `'--color-falcon-neutral-200': '#243056',` |
| 2014 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 34 | `'--color-falcon-neutral-300': '#324070',` |
| 2015 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 35 | `'--color-falcon-neutral-600': '#9aa6c2',` |
| 2016 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 36 | `'--color-falcon-neutral-700': '#c1cae0',` |
| 2017 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 37 | `'--color-falcon-neutral-900': '#f2f4fb',` |
| 2018 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 38 | `'--color-falcon-teal-500': '#3ee0c4',` |
| 2019 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 39 | `'--color-falcon-teal-700': '#22b099',` |
| 2020 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 47 | `'--color-falcon-teal-500': '#ff7e54',` |
| 2021 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 48 | `'--color-falcon-teal-700': '#d65a30',` |
| 2022 | `libs/falcon-studio/src/lib/services/preset.service.ts` | 49 | `'--color-falcon-cyan': '#ffb35a',` |
| 2023 | `libs/falcon-studio/src/lib/utils/color-conversions.ts` | 30 | `/*** Normalize `#abc` â†’ `#aabbcc`, lowercase. ***/` |
| 2024 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 19 | `--color-falcon-teal-50:   #f3f8f5;` |
| 2025 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 20 | `--color-falcon-teal-100:  #e8f0f1;` |
| 2026 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 21 | `--color-falcon-teal-200:  #d1e0e2;` |
| 2027 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 22 | `--color-falcon-teal-300:  #a8bec0;` |
| 2028 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 23 | `--color-falcon-teal-400:  #698e92;` |
| 2029 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 24 | `--color-falcon-teal-500:  #124c52;` |
| 2030 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 25 | `--color-falcon-teal-600:  #104c54;` |
| 2031 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 26 | `--color-falcon-teal-700:  #0d3f44;` |
| 2032 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 27 | `--color-falcon-teal-800:  #0a3338;` |
| 2033 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 28 | `--color-falcon-teal-900:  #082a2e;` |
| 2034 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 29 | `--color-falcon-teal-tint:   #eef3f4;` |
| 2035 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 30 | `/*** Wave 9: option-hover surface (#f1f6f6) + mid-teal accent (#00827a) ***/` |
| 2036 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 31 | `--color-falcon-teal-option: #f1f6f6;` |
| 2037 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 32 | `--color-falcon-teal-mid:    #00827a;` |
| 2038 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 34 | `/*** Teal alpha derivatives â€” rgba(13, 63, 68, ...) at fixed alphas ***/` |
| 2039 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 35 | `--color-falcon-teal-alpha-04: rgba(13, 63, 68, 0.04);` |
| 2040 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 36 | `--color-falcon-teal-alpha-06: rgba(13, 63, 68, 0.06);` |
| 2041 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 37 | `--color-falcon-teal-alpha-08: rgba(13, 63, 68, 0.08);` |
| 2042 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 38 | `--color-falcon-teal-alpha-12: rgba(13, 63, 68, 0.12);` |
| 2043 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 39 | `--color-falcon-teal-alpha-18: rgba(13, 63, 68, 0.18);` |
| 2044 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 44 | `--color-falcon-neutral-0:   #ffffff;` |
| 2045 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 45 | `--color-falcon-neutral-20:  #fcfcfd;` |
| 2046 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 46 | `--color-falcon-neutral-25:  #fafbfc;` |
| 2047 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 47 | `--color-falcon-neutral-30:  #fafafa;` |
| 2048 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 48 | `--color-falcon-neutral-40:  #f8f8f8;` |
| 2049 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 49 | `--color-falcon-neutral-45:  #f7f8f9;` |
| 2050 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 50 | `--color-falcon-neutral-50:  #f5f7f8;` |
| 2051 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 51 | `--color-falcon-neutral-75:  #f5f6f7;` |
| 2052 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 52 | `--color-falcon-neutral-100: #f1f3f5;` |
| 2053 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 53 | `--color-falcon-neutral-150: #eef0f2;` |
| 2054 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 54 | `--color-falcon-neutral-160: #eff1f3;` |
| 2055 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 55 | `--color-falcon-neutral-175: #e7eaee;` |
| 2056 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 56 | `--color-falcon-neutral-200: #e5e7eb;` |
| 2057 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 57 | `--color-falcon-neutral-300: #d4d8dc;` |
| 2058 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 58 | `--color-falcon-neutral-350: #d1d5db;` |
| 2059 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 59 | `--color-falcon-neutral-400: #c7ced4;` |
| 2060 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 60 | `--color-falcon-neutral-450: #c4c9cf;` |
| 2061 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 61 | `--color-falcon-neutral-475: #98a0a8;` |
| 2062 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 62 | `--color-falcon-neutral-500: #9ca3af;` |
| 2063 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 63 | `--color-falcon-neutral-600: #6b7280;` |
| 2064 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 64 | `--color-falcon-neutral-700: #5a6470;` |
| 2065 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 65 | `--color-falcon-neutral-750: #4a5568;` |
| 2066 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 66 | `--color-falcon-neutral-800: #3d3d3d;` |
| 2067 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 67 | `--color-falcon-neutral-850: #2d3748;` |
| 2068 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 68 | `--color-falcon-neutral-900: #1a1a1a;` |
| 2069 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 69 | `--color-falcon-neutral-925: #111827;` |
| 2070 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 70 | `--color-falcon-neutral-950: #000000;` |
| 2071 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 75 | `--color-falcon-green-50:   #F3F8F5;;` |
| 2072 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 76 | `--color-falcon-green-100:  #dfece6;` |
| 2073 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 77 | `--color-falcon-green-200:  #d9ebe3;` |
| 2074 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 78 | `--color-falcon-green-500:  #16a34a;` |
| 2075 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 79 | `--color-falcon-green-700:  #0f7a3a;` |
| 2076 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 81 | `--color-falcon-red-50:     #fef5f5;` |
| 2077 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 82 | `--color-falcon-red-100:    #fde2e4;` |
| 2078 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 83 | `--color-falcon-red-500:    #dc2626;` |
| 2079 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 84 | `--color-falcon-red-700:    #a1191d;` |
| 2080 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 85 | `--color-falcon-red-900:    #7f1d1d;` |
| 2081 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 87 | `--color-falcon-amber-50:   #ffeccb;` |
| 2082 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 88 | `--color-falcon-amber-500:  #f59e0b;` |
| 2083 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 89 | `--color-falcon-amber-700:  #a85a00;` |
| 2084 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 91 | `--color-falcon-blue-500:   #0ea5e9;` |
| 2085 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 97 | `--color-falcon-success-20:  #E6EFE9;` |
| 2086 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 98 | `--color-falcon-success-50:  #ecfdf5;` |
| 2087 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 103 | `--color-falcon-popover-dark:    #3b4752;` |
| 2088 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 104 | `--color-falcon-orgchart-line:   rgba(124, 130, 169, 0.5);` |
| 2089 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 105 | `--color-falcon-cyan:            #2dd4d9;` |
| 2090 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 107 | `--color-falcon-lilac-25:   #f8f8fc;` |
| 2091 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 108 | `--color-falcon-lilac-100:  #e8e8f0;` |
| 2092 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 109 | `--color-falcon-lilac-450:  #7c82a9;` |
| 2093 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 110 | `--color-falcon-lilac-500:  #8b8fc8;` |
| 2094 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 112 | `--color-falcon-mint-100:   #d9e6dd;` |
| 2095 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 113 | `--color-falcon-mint-200:   #b9d4c3;` |
| 2096 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 115 | `--color-falcon-brand-aramco:    #0d6e0e;` |
| 2097 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 116 | `--color-falcon-brand-aramco-1:  #0891b2;` |
| 2098 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 117 | `--color-falcon-brand-aramco-2:  #059669;` |
| 2099 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 118 | `--color-falcon-brand-aramco-3:  #065f46;` |
| 2100 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 119 | `--color-falcon-brand-bmw:       #1c69d4;` |
| 2101 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 120 | `--color-falcon-brand-rajhi:     #1e4fa3;` |
| 2102 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 121 | `--color-falcon-brand-snb:       #1a6b2e;` |
| 2103 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 122 | `--color-falcon-brand-bupa:      #007bc3;` |
| 2104 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 123 | `--color-falcon-brand-bupa-soft: #0b74a6;` |
| 2105 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 283 | `--shadow-falcon-xs:   0 1px 2px rgba(0, 0, 0, 0.04);` |
| 2106 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 284 | `--shadow-falcon-sm:   0 1px 2px rgba(0, 0, 0, 0.06);` |
| 2107 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 285 | `--shadow-falcon-md:   0 10px 24px rgba(0, 0, 0, 0.10);` |
| 2108 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 286 | `--shadow-falcon-lg:   0 10px 28px rgba(0, 0, 0, 0.18);` |
| 2109 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 287 | `--shadow-falcon-xl:   0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 20px -6px rgb` |
| 2110 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 288 | `--shadow-falcon-popover: 0 6px 18px rgba(0, 0, 0, 0.18);` |
| 2111 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 289 | `--shadow-falcon-menu:    0 12px 32px rgba(0, 0, 0, 0.12);` |
| 2112 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 290 | `--shadow-falcon-drawer:  -8px 0 12px -8px rgba(0, 0, 0, 0.06);` |
| 2113 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 291 | `--shadow-falcon-focus:        0 0 0 3px rgba(13, 63, 68, 0.12);` |
| 2114 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 292 | `--shadow-falcon-focus-strong: 0 0 0 2px rgba(13, 63, 68, 0.15);` |
| 2115 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 293 | `--shadow-falcon-danger-focus: 0 0 0 3px rgba(220, 38, 38, 0.15);` |
| 2116 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 294 | `--shadow-falcon-sticky-edge:  -8px 0 8px -6px rgba(13, 63, 68, 0.08);  /*** tree` |
| 2117 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 295 | `--shadow-falcon-action:       0 1px 3px rgba(0, 0, 0, 0.25);           /*** sing` |
| 2118 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 321 | `--text-muted: #6b7280;` |
| 2119 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 358 | `--shadow-brand-soft:   0 8px 18px rgba(16, 76, 84, 0.08);` |
| 2120 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 377 | `* Brand teal (#124c52) intentionally unchanged â€” teal is a brand color` |
| 2121 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 381 | `*   bg-page    â†’ neutral-925 (#111827)   â€” darkest canvas` |
| 2122 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 382 | `*   bg-surface â†’ neutral-850 (#2d3748)   â€” elevated card / panel` |
| 2123 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 383 | `*   bg-overlay â†’ neutral-800 (#3d3d3d)   â€” modals / dropdowns` |
| 2124 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 384 | `*   bg-subtle  â†’ neutral-750 (#4a5568)   â€” muted well, disabled` |
| 2125 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 385 | `*   text-primary  â†’ neutral-0 (#ffffff)  â€” maximum contrast body text` |
| 2126 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 386 | `*   text-muted    â†’ neutral-500 (#9ca3af)â€” secondary labels` |
| 2127 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 387 | `*   text-subtle   â†’ neutral-600 (#6b7280)â€” tertiary / placeholders` |
| 2128 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 388 | `*   border        â†’ neutral-750 (#4a5568)â€” subtle divider` |
| 2129 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 389 | `*   border-strong â†’ neutral-600 (#6b7280)â€” prominent divider` |
| 2130 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 398 | `--color-falcon-neutral-0:   #1a1a2e;  /* dark page canvas (was #ffffff) */` |
| 2131 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 399 | `--color-falcon-neutral-20:  #16213e;` |
| 2132 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 400 | `--color-falcon-neutral-25:  #1a2340;` |
| 2133 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 401 | `--color-falcon-neutral-30:  #1e2741;` |
| 2134 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 402 | `--color-falcon-neutral-40:  #232b44;` |
| 2135 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 403 | `--color-falcon-neutral-45:  #252e48;` |
| 2136 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 404 | `--color-falcon-neutral-50:  #2d3748;  /* elevated surface (was very light gray) ` |
| 2137 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 405 | `--color-falcon-neutral-75:  #374151;` |
| 2138 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 406 | `--color-falcon-neutral-100: #3d3d3d;  /* subtle well / disabled bg */` |
| 2139 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 407 | `--color-falcon-neutral-150: #4a5568;` |
| 2140 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 408 | `--color-falcon-neutral-160: #4b5563;` |
| 2141 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 409 | `--color-falcon-neutral-175: #525c6e;` |
| 2142 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 410 | `--color-falcon-neutral-200: #5a6470;  /* border default */` |
| 2143 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 411 | `--color-falcon-neutral-300: #6b7280;` |
| 2144 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 412 | `--color-falcon-neutral-350: #7b8494;` |
| 2145 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 413 | `--color-falcon-neutral-400: #9ca3af;  /* placeholder / muted icon */` |
| 2146 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 414 | `--color-falcon-neutral-450: #a1aab5;` |
| 2147 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 415 | `--color-falcon-neutral-475: #aab2bc;` |
| 2148 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 416 | `--color-falcon-neutral-500: #b0b7c0;  /* muted text */` |
| 2149 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 417 | `--color-falcon-neutral-600: #c7ced4;  /* secondary text */` |
| 2150 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 418 | `--color-falcon-neutral-700: #d4d8dc;` |
| 2151 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 419 | `--color-falcon-neutral-750: #e5e7eb;` |
| 2152 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 420 | `--color-falcon-neutral-800: #f1f3f5;  /* primary text (was near-black) */` |
| 2153 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 421 | `--color-falcon-neutral-850: #f5f7f8;` |
| 2154 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 422 | `--color-falcon-neutral-900: #ffffff;  /* maximum contrast text (was #1a1a1a) */` |
| 2155 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 423 | `--color-falcon-neutral-925: #ffffff;` |
| 2156 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 424 | `--color-falcon-neutral-950: #ffffff;` |
| 2157 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 427 | `--color-falcon-bg-page:    #111827;   /* outermost page canvas */` |
| 2158 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 428 | `--color-falcon-bg-surface: #1f2937;   /* card / panel surface */` |
| 2159 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 431 | `--shadow-falcon-xs:   0 1px 2px rgba(0, 0, 0, 0.20);` |
| 2160 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 432 | `--shadow-falcon-sm:   0 1px 2px rgba(0, 0, 0, 0.28);` |
| 2161 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 433 | `--shadow-falcon-md:   0 10px 24px rgba(0, 0, 0, 0.35);` |
| 2162 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 434 | `--shadow-falcon-lg:   0 10px 28px rgba(0, 0, 0, 0.50);` |
| 2163 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 435 | `--shadow-falcon-xl:   0 20px 60px -12px rgba(0, 0, 0, 0.50), 0 8px 20px -6px rgb` |
| 2164 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 436 | `--shadow-falcon-popover: 0 6px 18px rgba(0, 0, 0, 0.50);` |
| 2165 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 437 | `--shadow-falcon-menu:    0 12px 32px rgba(0, 0, 0, 0.45);` |
| 2166 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 438 | `--shadow-falcon-drawer:  -8px 0 12px -8px rgba(0, 0, 0, 0.35);` |
| 2167 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 441 | `--shadow-falcon-focus:        0 0 0 3px rgba(105, 142, 146, 0.30);` |
| 2168 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 442 | `--shadow-falcon-focus-strong: 0 0 0 2px rgba(105, 142, 146, 0.35);` |
| 2169 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 443 | `--shadow-falcon-danger-focus: 0 0 0 3px rgba(220, 38, 38, 0.35);` |
| 2170 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 446 | `--color-falcon-teal-option: #1e3a3a;  /*** dark: deep teal well (was light #f1f6` |
| 2171 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 447 | `--color-falcon-teal-mid:    #2dd4d9;  /*** dark: bright cyan (--color-falcon-cya` |
| 2172 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 450 | `--color-falcon-teal-alpha-04: rgba(105, 142, 146, 0.08);` |
| 2173 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 451 | `--color-falcon-teal-alpha-06: rgba(105, 142, 146, 0.12);` |
| 2174 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 452 | `--color-falcon-teal-alpha-08: rgba(105, 142, 146, 0.16);` |
| 2175 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 453 | `--color-falcon-teal-alpha-12: rgba(105, 142, 146, 0.22);` |
| 2176 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 454 | `--color-falcon-teal-alpha-18: rgba(105, 142, 146, 0.30);` |
| 2177 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 457 | `--text-muted: #9ca3af;` |
| 2178 | `libs/falcon-theme/src/tokens.ts` | 236 | `'color-falcon-amber-50': '#ffeccb',` |
| 2179 | `libs/falcon-theme/src/tokens.ts` | 237 | `'color-falcon-amber-500': '#f59e0b',` |
| 2180 | `libs/falcon-theme/src/tokens.ts` | 238 | `'color-falcon-amber-700': '#a85a00',` |
| 2181 | `libs/falcon-theme/src/tokens.ts` | 239 | `'color-falcon-blue-500': '#0ea5e9',` |
| 2182 | `libs/falcon-theme/src/tokens.ts` | 240 | `'color-falcon-brand-aramco': '#0d6e0e',` |
| 2183 | `libs/falcon-theme/src/tokens.ts` | 241 | `'color-falcon-brand-aramco-1': '#0891b2',` |
| 2184 | `libs/falcon-theme/src/tokens.ts` | 242 | `'color-falcon-brand-aramco-2': '#059669',` |
| 2185 | `libs/falcon-theme/src/tokens.ts` | 243 | `'color-falcon-brand-aramco-3': '#065f46',` |
| 2186 | `libs/falcon-theme/src/tokens.ts` | 244 | `'color-falcon-brand-bmw': '#1c69d4',` |
| 2187 | `libs/falcon-theme/src/tokens.ts` | 245 | `'color-falcon-brand-bupa': '#007bc3',` |
| 2188 | `libs/falcon-theme/src/tokens.ts` | 246 | `'color-falcon-brand-bupa-soft': '#0b74a6',` |
| 2189 | `libs/falcon-theme/src/tokens.ts` | 247 | `'color-falcon-brand-rajhi': '#1e4fa3',` |
| 2190 | `libs/falcon-theme/src/tokens.ts` | 248 | `'color-falcon-brand-snb': '#1a6b2e',` |
| 2191 | `libs/falcon-theme/src/tokens.ts` | 249 | `'color-falcon-cyan': '#2dd4d9',` |
| 2192 | `libs/falcon-theme/src/tokens.ts` | 250 | `'color-falcon-green-100': '#dfece6',` |
| 2193 | `libs/falcon-theme/src/tokens.ts` | 251 | `'color-falcon-green-200': '#d9ebe3',` |
| 2194 | `libs/falcon-theme/src/tokens.ts` | 252 | `'color-falcon-green-50': '#F3F8F5',` |
| 2195 | `libs/falcon-theme/src/tokens.ts` | 253 | `'color-falcon-green-500': '#16a34a',` |
| 2196 | `libs/falcon-theme/src/tokens.ts` | 254 | `'color-falcon-green-700': '#0f7a3a',` |
| 2197 | `libs/falcon-theme/src/tokens.ts` | 255 | `'color-falcon-lilac-100': '#e8e8f0',` |
| 2198 | `libs/falcon-theme/src/tokens.ts` | 256 | `'color-falcon-lilac-25': '#f8f8fc',` |
| 2199 | `libs/falcon-theme/src/tokens.ts` | 257 | `'color-falcon-lilac-450': '#7c82a9',` |
| 2200 | `libs/falcon-theme/src/tokens.ts` | 258 | `'color-falcon-lilac-500': '#8b8fc8',` |
| 2201 | `libs/falcon-theme/src/tokens.ts` | 259 | `'color-falcon-mint-100': '#d9e6dd',` |
| 2202 | `libs/falcon-theme/src/tokens.ts` | 260 | `'color-falcon-mint-200': '#b9d4c3',` |
| 2203 | `libs/falcon-theme/src/tokens.ts` | 261 | `'color-falcon-neutral-0': '#ffffff',` |
| 2204 | `libs/falcon-theme/src/tokens.ts` | 262 | `'color-falcon-neutral-100': '#f1f3f5',` |
| 2205 | `libs/falcon-theme/src/tokens.ts` | 263 | `'color-falcon-neutral-150': '#eef0f2',` |
| 2206 | `libs/falcon-theme/src/tokens.ts` | 264 | `'color-falcon-neutral-160': '#eff1f3',` |
| 2207 | `libs/falcon-theme/src/tokens.ts` | 265 | `'color-falcon-neutral-175': '#e7eaee',` |
| 2208 | `libs/falcon-theme/src/tokens.ts` | 266 | `'color-falcon-neutral-20': '#fcfcfd',` |
| 2209 | `libs/falcon-theme/src/tokens.ts` | 267 | `'color-falcon-neutral-200': '#e5e7eb',` |
| 2210 | `libs/falcon-theme/src/tokens.ts` | 268 | `'color-falcon-neutral-25': '#fafbfc',` |
| 2211 | `libs/falcon-theme/src/tokens.ts` | 269 | `'color-falcon-neutral-30': '#fafafa',` |
| 2212 | `libs/falcon-theme/src/tokens.ts` | 270 | `'color-falcon-neutral-300': '#d4d8dc',` |
| 2213 | `libs/falcon-theme/src/tokens.ts` | 271 | `'color-falcon-neutral-350': '#d1d5db',` |
| 2214 | `libs/falcon-theme/src/tokens.ts` | 272 | `'color-falcon-neutral-40': '#f8f8f8',` |
| 2215 | `libs/falcon-theme/src/tokens.ts` | 273 | `'color-falcon-neutral-400': '#c7ced4',` |
| 2216 | `libs/falcon-theme/src/tokens.ts` | 274 | `'color-falcon-neutral-45': '#f7f8f9',` |
| 2217 | `libs/falcon-theme/src/tokens.ts` | 275 | `'color-falcon-neutral-450': '#c4c9cf',` |
| 2218 | `libs/falcon-theme/src/tokens.ts` | 276 | `'color-falcon-neutral-475': '#98a0a8',` |
| 2219 | `libs/falcon-theme/src/tokens.ts` | 277 | `'color-falcon-neutral-50': '#f5f7f8',` |
| 2220 | `libs/falcon-theme/src/tokens.ts` | 278 | `'color-falcon-neutral-500': '#9ca3af',` |
| 2221 | `libs/falcon-theme/src/tokens.ts` | 279 | `'color-falcon-neutral-600': '#6b7280',` |
| 2222 | `libs/falcon-theme/src/tokens.ts` | 280 | `'color-falcon-neutral-700': '#5a6470',` |
| 2223 | `libs/falcon-theme/src/tokens.ts` | 281 | `'color-falcon-neutral-75': '#f5f6f7',` |
| 2224 | `libs/falcon-theme/src/tokens.ts` | 282 | `'color-falcon-neutral-750': '#4a5568',` |
| 2225 | `libs/falcon-theme/src/tokens.ts` | 283 | `'color-falcon-neutral-800': '#3d3d3d',` |
| 2226 | `libs/falcon-theme/src/tokens.ts` | 284 | `'color-falcon-neutral-850': '#2d3748',` |
| 2227 | `libs/falcon-theme/src/tokens.ts` | 285 | `'color-falcon-neutral-900': '#1a1a1a',` |
| 2228 | `libs/falcon-theme/src/tokens.ts` | 286 | `'color-falcon-neutral-925': '#111827',` |
| 2229 | `libs/falcon-theme/src/tokens.ts` | 287 | `'color-falcon-neutral-950': '#000000',` |
| 2230 | `libs/falcon-theme/src/tokens.ts` | 288 | `'color-falcon-orgchart-line': 'rgba(124, 130, 169, 0.5)',` |
| 2231 | `libs/falcon-theme/src/tokens.ts` | 289 | `'color-falcon-popover-dark': '#3b4752',` |
| 2232 | `libs/falcon-theme/src/tokens.ts` | 290 | `'color-falcon-red-100': '#fde2e4',` |
| 2233 | `libs/falcon-theme/src/tokens.ts` | 291 | `'color-falcon-red-50': '#fef5f5',` |
| 2234 | `libs/falcon-theme/src/tokens.ts` | 292 | `'color-falcon-red-500': '#dc2626',` |
| 2235 | `libs/falcon-theme/src/tokens.ts` | 293 | `'color-falcon-red-700': '#a1191d',` |
| 2236 | `libs/falcon-theme/src/tokens.ts` | 294 | `'color-falcon-red-900': '#7f1d1d',` |
| 2237 | `libs/falcon-theme/src/tokens.ts` | 295 | `'color-falcon-success-20': '#E6EFE9',` |
| 2238 | `libs/falcon-theme/src/tokens.ts` | 296 | `'color-falcon-success-50': '#ecfdf5',` |
| 2239 | `libs/falcon-theme/src/tokens.ts` | 297 | `'color-falcon-teal-100': '#e8f0f1',` |
| 2240 | `libs/falcon-theme/src/tokens.ts` | 298 | `'color-falcon-teal-200': '#d1e0e2',` |
| 2241 | `libs/falcon-theme/src/tokens.ts` | 299 | `'color-falcon-teal-300': '#a8bec0',` |
| 2242 | `libs/falcon-theme/src/tokens.ts` | 300 | `'color-falcon-teal-400': '#698e92',` |
| 2243 | `libs/falcon-theme/src/tokens.ts` | 301 | `'color-falcon-teal-50': '#f3f8f5',` |
| 2244 | `libs/falcon-theme/src/tokens.ts` | 302 | `'color-falcon-teal-500': '#124c52',` |
| 2245 | `libs/falcon-theme/src/tokens.ts` | 303 | `'color-falcon-teal-600': '#104c54',` |
| 2246 | `libs/falcon-theme/src/tokens.ts` | 304 | `'color-falcon-teal-700': '#0d3f44',` |
| 2247 | `libs/falcon-theme/src/tokens.ts` | 305 | `'color-falcon-teal-800': '#0a3338',` |
| 2248 | `libs/falcon-theme/src/tokens.ts` | 306 | `'color-falcon-teal-900': '#082a2e',` |
| 2249 | `libs/falcon-theme/src/tokens.ts` | 307 | `'color-falcon-teal-alpha-04': 'rgba(13, 63, 68, 0.04)',` |
| 2250 | `libs/falcon-theme/src/tokens.ts` | 308 | `'color-falcon-teal-alpha-06': 'rgba(13, 63, 68, 0.06)',` |
| 2251 | `libs/falcon-theme/src/tokens.ts` | 309 | `'color-falcon-teal-alpha-08': 'rgba(13, 63, 68, 0.08)',` |
| 2252 | `libs/falcon-theme/src/tokens.ts` | 310 | `'color-falcon-teal-alpha-12': 'rgba(13, 63, 68, 0.12)',` |
| 2253 | `libs/falcon-theme/src/tokens.ts` | 311 | `'color-falcon-teal-alpha-18': 'rgba(13, 63, 68, 0.18)',` |
| 2254 | `libs/falcon-theme/src/tokens.ts` | 312 | `'color-falcon-teal-mid': '#00827a',` |
| 2255 | `libs/falcon-theme/src/tokens.ts` | 313 | `'color-falcon-teal-option': '#f1f6f6',` |
| 2256 | `libs/falcon-theme/src/tokens.ts` | 314 | `'color-falcon-teal-tint': '#eef3f4',` |
| 2257 | `libs/falcon-theme/src/tokens.ts` | 376 | `'shadow-brand-soft': '0 8px 18px rgba(16, 76, 84, 0.08)',` |
| 2258 | `libs/falcon-theme/src/tokens.ts` | 377 | `'shadow-falcon-action': '0 1px 3px rgba(0, 0, 0, 0.25)',` |
| 2259 | `libs/falcon-theme/src/tokens.ts` | 378 | `'shadow-falcon-danger-focus': '0 0 0 3px rgba(220, 38, 38, 0.15)',` |
| 2260 | `libs/falcon-theme/src/tokens.ts` | 379 | `'shadow-falcon-drawer': '-8px 0 12px -8px rgba(0, 0, 0, 0.06)',` |
| 2261 | `libs/falcon-theme/src/tokens.ts` | 380 | `'shadow-falcon-focus': '0 0 0 3px rgba(13, 63, 68, 0.12)',` |
| 2262 | `libs/falcon-theme/src/tokens.ts` | 381 | `'shadow-falcon-focus-strong': '0 0 0 2px rgba(13, 63, 68, 0.15)',` |
| 2263 | `libs/falcon-theme/src/tokens.ts` | 382 | `'shadow-falcon-lg': '0 10px 28px rgba(0, 0, 0, 0.18)',` |
| 2264 | `libs/falcon-theme/src/tokens.ts` | 383 | `'shadow-falcon-md': '0 10px 24px rgba(0, 0, 0, 0.10)',` |
| 2265 | `libs/falcon-theme/src/tokens.ts` | 384 | `'shadow-falcon-menu': '0 12px 32px rgba(0, 0, 0, 0.12)',` |
| 2266 | `libs/falcon-theme/src/tokens.ts` | 385 | `'shadow-falcon-popover': '0 6px 18px rgba(0, 0, 0, 0.18)',` |
| 2267 | `libs/falcon-theme/src/tokens.ts` | 386 | `'shadow-falcon-sm': '0 1px 2px rgba(0, 0, 0, 0.06)',` |
| 2268 | `libs/falcon-theme/src/tokens.ts` | 387 | `'shadow-falcon-sticky-edge': '-8px 0 8px -6px rgba(13, 63, 68, 0.08)',` |
| 2269 | `libs/falcon-theme/src/tokens.ts` | 388 | `'shadow-falcon-xl': '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 20px -6px rgba` |
| 2270 | `libs/falcon-theme/src/tokens.ts` | 389 | `'shadow-falcon-xs': '0 1px 2px rgba(0, 0, 0, 0.04)',` |
| 2271 | `libs/falcon-theme/src/tokens.ts` | 432 | `'text-muted': '#6b7280',` |

## `R-NOOR-003` — Typography scale â€” only documented type tokens allowed (296 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 188 | `<h2 class="text-[15px] font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 188 | `<h2 class="text-[15px] font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.` |
| 7 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 193 | `class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-f` |
| 8 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 193 | `class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-f` |
| 9 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 196 | `<i class="falcon-icon falcon-icon-filter text-[13px]"></i>` |
| 10 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 196 | `<i class="falcon-icon falcon-icon-filter text-[13px]"></i>` |
| 11 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-5` |
| 12 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-5` |
| 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 247 | `<div class="px-5 py-8 text-sm text-falcon-neutral-500 italic">` |
| 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 247 | `<div class="px-5 py-8 text-sm text-falcon-neutral-500 italic">` |
| 15 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 203 | `label.className = 'text-xs text-falcon-neutral-600 me-2 whitespace-nowrap';` |
| 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | 203 | `label.className = 'text-xs text-falcon-neutral-600 me-2 whitespace-nowrap';` |
| 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 8 | `<div class="px-6 pt-4 pb-3.5 border-b border-falcon-neutral-200 text-sm font-bol` |
| 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 8 | `<div class="px-6 pt-4 pb-3.5 border-b border-falcon-neutral-200 text-sm font-bol` |
| 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 172 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| 20 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 172 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| 21 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 175 | `<div class="text-xs text-base font-bold text-falcon-neutral-900">` |
| 22 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 175 | `<div class="text-xs text-base font-bold text-falcon-neutral-900">` |
| 23 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 181 | `<div class="text-xs text-base text-falcon-neutral-500">` |
| 24 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 181 | `<div class="text-xs text-base text-falcon-neutral-500">` |
| 25 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 184 | `<div class="text-xs font-bold text-falcon-neutral-900">` |
| 26 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 184 | `<div class="text-xs font-bold text-falcon-neutral-900">` |
| 27 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 192 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| 28 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 192 | `<div class="text-xs font-normal text-falcon-neutral-500">` |
| 29 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 195 | `<div class="text-base font-bold text-falcon-neutral-900 inline-flex items-center` |
| 30 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 195 | `<div class="text-base font-bold text-falcon-neutral-900 inline-flex items-center` |
| 31 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 196 | `<falcon-angular-saudi-riyal-icon text-lg class="text-falcon-neutral-700" />` |
| 32 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 196 | `<falcon-angular-saudi-riyal-icon text-lg class="text-falcon-neutral-700" />` |
| 33 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 28 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 34 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 28 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 35 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 40 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 36 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 40 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 37 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 60 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 38 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 60 | `<span class="text-[11px] font-medium text-falcon-neutral-500">` |
| 39 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 30 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 40 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 30 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 41 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 35 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-teal-700 tex` |
| 42 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 35 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-teal-700 tex` |
| 43 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 37 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 44 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 37 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 45 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 39 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 46 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 39 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 47 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 47 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-mint-100 tex` |
| 48 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 47 | `<span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-mint-100 tex` |
| 49 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 49 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 50 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 49 | `<div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.n` |
| 51 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 51 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 52 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 51 | `<div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` |
| 53 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 3 | `<div class="flex items-center gap-4 text-xs text-falcon-neutral-600">` |
| 54 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 3 | `<div class="flex items-center gap-4 text-xs text-falcon-neutral-600">` |
| 55 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 8 | `<div class="text-xs text-falcon-neutral-500 italic truncate">` |
| 56 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 8 | `<div class="text-xs text-falcon-neutral-500 italic truncate">` |
| 57 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 67 | `class="chart-user-circle absolute grid place-items-center rounded-full bg-white ` |
| 58 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 67 | `class="chart-user-circle absolute grid place-items-center rounded-full bg-white ` |
| 59 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 85 | `<div class="text-[11px] font-semibold text-falcon-neutral-900 truncate">{{ u.fir` |
| 60 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 85 | `<div class="text-[11px] font-semibold text-falcon-neutral-900 truncate">{{ u.fir` |
| 61 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 86 | `@if (u.role) { <div class="text-[10px] text-falcon-neutral-600 truncate">{{ u.ro` |
| 62 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 86 | `@if (u.role) { <div class="text-[10px] text-falcon-neutral-600 truncate">{{ u.ro` |
| 63 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `class="absolute top-3.5 end-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-[7` |
| 64 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `class="absolute top-3.5 end-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-[7` |
| 65 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 107 | `<i class="falcon-icon falcon-icon-times text-xs" aria-hidden="true"></i>` |
| 66 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 107 | `<i class="falcon-icon falcon-icon-times text-xs" aria-hidden="true"></i>` |
| 67 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 1 | `<header class="px-6 pt-5 pb-3.5 bg-white text-sm font-bold text-falcon-neutral-9` |
| 68 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 1 | `<header class="px-6 pt-5 pb-3.5 bg-white text-sm font-bold text-falcon-neutral-9` |
| 69 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 28 | `<span class="grid place-items-center w-16 h-16 rounded-full text-white text-xl f` |
| 70 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 28 | `<span class="grid place-items-center w-16 h-16 rounded-full text-white text-xl f` |
| 71 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 32 | `<span class="text-[18px] font-bold text-falcon-neutral-900 leading-tight">{{ nod` |
| 72 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 32 | `<span class="text-[18px] font-bold text-falcon-neutral-900 leading-tight">{{ nod` |
| 73 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 32 | `<span class="text-[18px] font-bold text-falcon-neutral-900 leading-tight">{{ nod` |
| 74 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 32 | `<span class="text-[18px] font-bold text-falcon-neutral-900 leading-tight">{{ nod` |
| 75 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 33 | `<span class="text-xs text-falcon-neutral-600 mt-0.5">{{ 'hierarchy.info.clientPi` |
| 76 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 33 | `<span class="text-xs text-falcon-neutral-600 mt-0.5">{{ 'hierarchy.info.clientPi` |
| 77 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 41 | `<h4 class="col-span-full text-[13px] font-bold text-falcon-neutral-900 m-0 mt-2"` |
| 78 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 41 | `<h4 class="col-span-full text-[13px] font-bold text-falcon-neutral-900 m-0 mt-2"` |
| 79 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 47 | `<span class="text-xs font-normal text-falcon-neutral-600 tracking-[0.01em]">` |
| 80 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 47 | `<span class="text-xs font-normal text-falcon-neutral-600 tracking-[0.01em]">` |
| 81 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 72 | `<span class="text-[11px] text-falcon-danger-600 mt-0.5">` |
| 82 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 72 | `<span class="text-[11px] text-falcon-danger-600 mt-0.5">` |
| 83 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 11 | `<h3 class="text-lg font-semibold m-0 text-falcon-neutral-900">` |
| 84 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 11 | `<h3 class="text-lg font-semibold m-0 text-falcon-neutral-900">` |
| 85 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 17 | `<i class="falcon-icon falcon-icon-times text-[14px]"></i>` |
| 86 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 17 | `<i class="falcon-icon falcon-icon-times text-[14px]"></i>` |
| 87 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 21 | `<div class="flex flex-col gap-1.5 px-6 pt-4 text-sm">` |
| 88 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 21 | `<div class="flex flex-col gap-1.5 px-6 pt-4 text-sm">` |
| 89 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 22 | `<label class="text-xs text-falcon-neutral-600 font-medium" for="orgNodeNameInput` |
| 90 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 22 | `<label class="text-xs text-falcon-neutral-600 font-medium" for="orgNodeNameInput` |
| 91 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 26 | `class="w-full bg-transparent border-0 border-b border-falcon-neutral-200 focus:b` |
| 92 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 26 | `class="w-full bg-transparent border-0 border-b border-falcon-neutral-200 focus:b` |
| 93 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 33 | `<span class="text-xs text-falcon-red-500">` |
| 94 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 33 | `<span class="text-xs text-falcon-red-500">` |
| 95 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 38 | `<p class="text-[11px] text-falcon-neutral-500 m-0 mt-1">` |
| 96 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 38 | `<p class="text-[11px] text-falcon-neutral-500 m-0 mt-1">` |
| 97 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 46 | `class="inline-flex items-center h-[34px] px-3 text-sm font-medium text-falcon-ne` |
| 98 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 46 | `class="inline-flex items-center h-[34px] px-3 text-sm font-medium text-falcon-ne` |
| 99 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 51 | `class="inline-flex items-center h-[34px] px-5 rounded-md bg-falcon-teal-700 text` |
| 100 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 51 | `class="inline-flex items-center h-[34px] px-5 rounded-md bg-falcon-teal-700 text` |
| 101 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 22 | `<span class="grid place-items-center w-7 h-7 rounded-full text-white text-xs fon` |
| 102 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 22 | `<span class="grid place-items-center w-7 h-7 rounded-full text-white text-xs fon` |
| 103 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 27 | `<span class="text-sm font-semibold text-falcon-neutral-925 truncate" [title]="no` |
| 104 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 27 | `<span class="text-sm font-semibold text-falcon-neutral-925 truncate" [title]="no` |
| 105 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` | 6 | `<i class="falcon-icon falcon-icon-home text-base"></i>` |
| 106 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` | 6 | `<i class="falcon-icon falcon-icon-home text-base"></i>` |
| 107 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` | 8 | `<h3 class="text-base font-semibold m-0 text-falcon-neutral-900 truncate">` |
| 108 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` | 8 | `<h3 class="text-base font-semibold m-0 text-falcon-neutral-900 truncate">` |
| 109 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 11 | `<i class="falcon-icon falcon-icon-arrow-left text-[14px]"></i>` |
| 110 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 11 | `<i class="falcon-icon falcon-icon-arrow-left text-[14px]"></i>` |
| 111 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 13 | `<div class="w-10 h-10 rounded-full bg-falcon-teal-100 text-falcon-teal-700 inlin` |
| 112 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 13 | `<div class="w-10 h-10 rounded-full bg-falcon-teal-100 text-falcon-teal-700 inlin` |
| 113 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 17 | `<span class="text-[15px] font-semibold text-falcon-neutral-900">` |
| 114 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 17 | `<span class="text-[15px] font-semibold text-falcon-neutral-900">` |
| 115 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 20 | `<span class="text-xs text-falcon-neutral-500">{{ currentField().username }}</spa` |
| 116 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 20 | `<span class="text-xs text-falcon-neutral-500">{{ currentField().username }}</spa` |
| 117 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 25 | `class="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-med` |
| 118 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 25 | `class="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-med` |
| 119 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 58 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 120 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 58 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 121 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 66 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 122 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 66 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 123 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 69 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().firstName }}</sp` |
| 124 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 69 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().firstName }}</sp` |
| 125 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 75 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 126 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 75 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 127 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 83 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 128 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 83 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 129 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 86 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().lastName }}</spa` |
| 130 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 86 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().lastName }}</spa` |
| 131 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 92 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 132 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 92 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 133 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 95 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().username }}</spa` |
| 134 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 95 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().username }}</spa` |
| 135 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 100 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 136 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 100 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 137 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 108 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 138 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 108 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 139 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 111 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().nationalId \|\| ` |
| 140 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 111 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().nationalId \|\| ` |
| 141 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 117 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 142 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 117 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 143 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 127 | `class="h-9 px-3 rounded-lg bg-falcon-warning-100 text-falcon-warning-700 text-xs` |
| 144 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 127 | `class="h-9 px-3 rounded-lg bg-falcon-warning-100 text-falcon-warning-700 text-xs` |
| 145 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 132 | `<span class="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-falcon-succes` |
| 146 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 132 | `<span class="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-falcon-succes` |
| 147 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 139 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 148 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 139 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 149 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 142 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().phone }}</span>` |
| 150 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 142 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().phone }}</span>` |
| 151 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 148 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 152 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 148 | `<span class="text-xs text-falcon-neutral-600 font-medium">` |
| 153 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 158 | `class="h-9 px-3 rounded-lg bg-falcon-warning-100 text-falcon-warning-700 text-xs` |
| 154 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 158 | `class="h-9 px-3 rounded-lg bg-falcon-warning-100 text-falcon-warning-700 text-xs` |
| 155 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 163 | `<span class="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-falcon-succes` |
| 156 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 163 | `<span class="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-falcon-succes` |
| 157 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 170 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 158 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 170 | `<span class="text-[11px] text-falcon-red-500">{{ 'hierarchy.userDetails.errorReq` |
| 159 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 173 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().email }}</span>` |
| 160 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 173 | `<span class="text-sm text-falcon-neutral-900">{{ currentField().email }}</span>` |
| 161 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 184 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 162 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 184 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 163 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 192 | `<span class="text-sm text-falcon-neutral-900">{{ statusLabel(currentField().stat` |
| 164 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 192 | `<span class="text-sm text-falcon-neutral-900">{{ statusLabel(currentField().stat` |
| 165 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 198 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 166 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 198 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 167 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 205 | `<span class="text-sm text-falcon-neutral-900">{{ roleLabel(currentField().role) ` |
| 168 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 205 | `<span class="text-sm text-falcon-neutral-900">{{ roleLabel(currentField().role) ` |
| 169 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 216 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 170 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 216 | `<span class="text-xs text-falcon-neutral-600 font-medium">{{ 'hierarchy.userDeta` |
| 171 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 223 | `<span class="text-sm text-falcon-neutral-900">{{ permGroupLabel(currentField().p` |
| 172 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 223 | `<span class="text-sm text-falcon-neutral-900">{{ permGroupLabel(currentField().p` |
| 173 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 229 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 uppercase trackin` |
| 174 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 229 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 uppercase trackin` |
| 175 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 229 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 uppercase trackin` |
| 176 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 229 | `<span class="text-[13px] font-semibold text-falcon-neutral-900 uppercase trackin` |
| 177 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 235 | `<span class="text-sm font-medium text-falcon-neutral-700">{{ 'hierarchy.userDeta` |
| 178 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 235 | `<span class="text-sm font-medium text-falcon-neutral-700">{{ 'hierarchy.userDeta` |
| 179 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 248 | `<span class="text-sm text-falcon-neutral-900">{{ checkerLabel(currentField().che` |
| 180 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 248 | `<span class="text-sm text-falcon-neutral-900">{{ checkerLabel(currentField().che` |
| 181 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 254 | `<span class="text-sm font-medium text-falcon-neutral-700">{{ 'hierarchy.userDeta` |
| 182 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 254 | `<span class="text-sm font-medium text-falcon-neutral-700">{{ 'hierarchy.userDeta` |
| 183 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 267 | `<span class="text-sm text-falcon-neutral-900">{{ checkerLabel(currentField().che` |
| 184 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 267 | `<span class="text-sm text-falcon-neutral-900">{{ checkerLabel(currentField().che` |
| 185 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 280 | `<span class="text-xs text-falcon-red-600">{{ 'hierarchy.userDetails.verifyBefore` |
| 186 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 280 | `<span class="text-xs text-falcon-red-600">{{ 'hierarchy.userDetails.verifyBefore` |
| 187 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 285 | `class="inline-flex items-center h-9 px-4 rounded-lg border border-falcon-neutral` |
| 188 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 285 | `class="inline-flex items-center h-9 px-4 rounded-lg border border-falcon-neutral` |
| 189 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 290 | `class="inline-flex items-center h-9 px-4 rounded-lg text-sm font-semibold"` |
| 190 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 290 | `class="inline-flex items-center h-9 px-4 rounded-lg text-sm font-semibold"` |
| 191 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 66 | `<h2 class="font-extrabold text-falcon-neutral-900 leading-tight text-center trac` |
| 192 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 66 | `<h2 class="font-extrabold text-falcon-neutral-900 leading-tight text-center trac` |
| 193 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 66 | `<h2 class="font-extrabold text-falcon-neutral-900 leading-tight text-center trac` |
| 194 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 66 | `<h2 class="font-extrabold text-falcon-neutral-900 leading-tight text-center trac` |
| 195 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 67 | `style="font-size: 40px;">` |
| 196 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 67 | `style="font-size: 40px;">` |
| 197 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 73 | `<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` |
| 198 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 73 | `<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` |
| 199 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 73 | `<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` |
| 200 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 73 | `<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` |
| 201 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 76 | `<p class="font-extrabold italic text-falcon-teal-700" style="font-size: 22px;">` |
| 202 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 76 | `<p class="font-extrabold italic text-falcon-teal-700" style="font-size: 22px;">` |
| 203 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fa` |
| 204 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fa` |
| 205 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fa` |
| 206 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fa` |
| 207 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 99 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 208 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 99 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 209 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 104 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 210 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 104 | `<span class="text-[13px] text-falcon-red-500 font-medium">` |
| 211 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 127 | `style="font-size: 38px;">` |
| 212 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 127 | `style="font-size: 38px;">` |
| 213 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 135 | `class="inline-flex items-center gap-1.5 mt-1 text-[13px] font-medium disabled:cu` |
| 214 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 135 | `class="inline-flex items-center gap-1.5 mt-1 text-[13px] font-medium disabled:cu` |
| 215 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 216 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 217 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 218 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 219 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 41 | `<div class="text-xs font-medium text-falcon-neutral-600 bg-falcon-neutral-45 px-` |
| 220 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 41 | `<div class="text-xs font-medium text-falcon-neutral-600 bg-falcon-neutral-45 px-` |
| 221 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 57 | `<span class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0` |
| 222 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 57 | `<span class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0` |
| 223 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 3 | `<div class="grid grid-cols-5 items-center gap-4 pb-3.5 px-1 text-xs font-medium ` |
| 224 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 3 | `<div class="grid grid-cols-5 items-center gap-4 pb-3.5 px-1 text-xs font-medium ` |
| 225 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 28 | `<strong class="text-sm font-semibold"` |
| 226 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 28 | `<strong class="text-sm font-semibold"` |
| 227 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 44 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 228 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 44 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 229 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-` |
| 230 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-` |
| 231 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 66 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 232 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 66 | `<span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.req` |
| 233 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 72 | `<span class="inline-flex items-center h-6 px-3.5 rounded-full bg-white border bo` |
| 234 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 72 | `<span class="inline-flex items-center h-6 px-3.5 rounded-full bg-white border bo` |
| 235 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 76 | `<span class="text-falcon-neutral-500 text-[13px] tracking-[0.5px]">------</span>` |
| 236 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 76 | `<span class="text-falcon-neutral-500 text-[13px] tracking-[0.5px]">------</span>` |
| 237 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 5 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 238 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 5 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 239 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 25 | `<strong class="text-[13px] font-semibold text-falcon-neutral-900">` |
| 240 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 25 | `<strong class="text-[13px] font-semibold text-falcon-neutral-900">` |
| 241 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 36 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 242 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 36 | `<div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutra` |
| 243 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 48 | `class="w-full h-9 px-3 pr-16 rounded-md border bg-white text-sm focus:outline-no` |
| 244 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 48 | `class="w-full h-9 px-3 pr-16 rounded-md border bg-white text-sm focus:outline-no` |
| 245 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 57 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] fo` |
| 246 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 57 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] fo` |
| 247 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 57 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] fo` |
| 248 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 57 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] fo` |
| 249 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 62 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-base lead` |
| 250 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 62 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-base lead` |
| 251 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 62 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-base lead` |
| 252 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 62 | `class="inline-flex items-center justify-center w-7 h-7 rounded-md text-base lead` |
| 253 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 76 | `<i slot="icon-start" class="falcon-icon falcon-icon-plus text-[12px]" aria-hidde` |
| 254 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 76 | `<i slot="icon-start" class="falcon-icon falcon-icon-plus text-[12px]" aria-hidde` |
| 255 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 114 | `<div class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[` |
| 256 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 114 | `<div class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[` |
| 257 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 130 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 258 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 130 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 259 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 136 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 260 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 136 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 261 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 144 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 262 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 144 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 263 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 168 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNormalError()!` |
| 264 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 168 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNormalError()!` |
| 265 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 173 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 266 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 173 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 267 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 179 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 268 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 179 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 269 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 187 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 270 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 187 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 271 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 211 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxSystemError()!` |
| 272 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 211 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxSystemError()!` |
| 273 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 216 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 274 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 216 | `<label class="text-xs text-falcon-neutral-800 font-medium">` |
| 275 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 222 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 276 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 222 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 277 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 230 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 278 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 230 | `<span class="text-[10px] text-falcon-neutral-600 font-medium">{{ 'hierarchy.sett` |
| 279 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 254 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNodeError()!.k` |
| 280 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 254 | `<div class="text-[10px] text-falcon-red-500 leading-[1.3]">*{{ maxNodeError()!.k` |
| 281 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 282 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 283 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 284 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 38 | `<div class="text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]">` |
| 285 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 41 | `<div class="text-xs font-medium text-falcon-neutral-600 bg-falcon-neutral-45 px-` |
| 286 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 41 | `<div class="text-xs font-medium text-falcon-neutral-600 bg-falcon-neutral-45 px-` |
| 287 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 16 | `<div class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0.` |
| 288 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 16 | `<div class="text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0.` |
| 289 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 23 | `<span class="text-[13px] font-medium text-falcon-neutral-900">` |
| 290 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 23 | `<span class="text-[13px] font-medium text-falcon-neutral-900">` |
| 291 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 28 | `<label class="inline-flex items-center gap-2 cursor-pointer text-[13px] text-fal` |
| 292 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 28 | `<label class="inline-flex items-center gap-2 cursor-pointer text-[13px] text-fal` |
| 293 | `apps/admin-console/src/tailwind.css` | 67 | `@source inline("text-xs");` |
| 294 | `apps/admin-console/src/tailwind.css` | 67 | `@source inline("text-xs");` |
| 295 | `apps/admin-console/src/tailwind.css` | 94 | `@source inline("text-sm");` |
| 296 | `apps/admin-console/src/tailwind.css` | 94 | `@source inline("text-sm");` |

## `R-FE-003` — No inline styles, ever (120 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 217 | `style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falc` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 71 | `style="height: calc(95vh - 40px)">` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 83 | `[style]="indentStyle(row.indent)">` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 157 | `To override per page, set `style="--falcon-data-table-shadow-row-min-height: 48p` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 18 | `style="background: #F3F8F5; padding-inline: 16px;">` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 22 | `<div class="flex-shrink-0" style="width: 96px;"></div>` |
| 7 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 24 | `<div class="flex-shrink-0" style="width: 140px;"></div>` |
| 8 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 27 | `<div class="flex flex-col gap-1" style="width: 180px;">` |
| 9 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 39 | `<div class="flex flex-col gap-1" style="width: 220px;">` |
| 10 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 52 | `<div class="flex-shrink-0" style="width: 96px;"></div>` |
| 11 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 54 | `<div class="flex-shrink-0" style="width: 140px;"></div>` |
| 12 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 56 | `<div class="flex-shrink-0" style="width: 180px;"></div>` |
| 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 59 | `<div class="flex flex-col gap-1" style="width: 260px;">` |
| 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 18 | `style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); p` |
| 15 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 44 | `style="width: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);"` |
| 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 48 | `<div class="w-full bg-falcon-teal-700" style="height: 8px;" aria-hidden="true"><` |
| 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 53 | `style="top: 32px; inset-inline-end: 36px; width: 28px; height: 28px;"` |
| 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 63 | `style="padding: 72px 72px 64px 72px; gap: 36px;">` |
| 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 67 | `style="font-size: 40px;">` |
| 20 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 72 | `<div class="flex flex-col items-center text-center" style="gap: 6px;">` |
| 21 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 73 | `<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` |
| 22 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 76 | `<p class="font-extrabold italic text-falcon-teal-700" style="font-size: 22px;">` |
| 23 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 111 | `<div class="relative" style="width: 140px; height: 140px; margin-top: 12px;" [at` |
| 24 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 127 | `style="font-size: 38px;">` |
| 25 | `apps/host-shell/src/app/core/services/remote-route.service.ts` | 463 | `const previousLinks = document.querySelectorAll<HTMLLinkElement>(`link[data-remo` |
| 26 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-expanded-card.component.ts` | 36 | `style="isolation: isolate;"` |
| 27 | `apps/host-shell/src/app/preview-page.component.ts` | 12 | `<div [class.collapsed]="collapsed()" style="display: grid; grid-template-columns` |
| 28 | `apps/host-shell/src/app/preview-shell.component.ts` | 21 | `<div [class.collapsed]="collapsed()" style="display: grid; grid-template-columns` |
| 29 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | 97 | `<mask id="mask0_1109_2834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x=` |
| 30 | `libs/falcon/src/shared-ui/lib/ui/icon/icon.component.ts` | 49 | `[ngStyle]="maskStyle"` |
| 31 | `libs/falcon-studio/src/lib/components/abstract-slider.component.ts` | 70 | `style="font-size: var(--falcon-icon-md);"` |
| 32 | `libs/falcon-studio/src/lib/components/abstract-slider.component.ts` | 104 | `style="font-size: var(--falcon-icon-md);"` |
| 33 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 65 | `style="font-size: var(--falcon-icon-md);"` |
| 34 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 116 | `style="font-size: var(--falcon-icon-lg);"` |
| 35 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 201 | `style="font-size: var(--falcon-icon-sm);"` |
| 36 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 238 | `style="font-size: var(--falcon-icon-lg);"` |
| 37 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 265 | `style="font-size: var(--falcon-icon-sm);"` |
| 38 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 280 | `style="font-size: var(--falcon-icon-sm);"` |
| 39 | `libs/falcon-studio/src/lib/components/color-change-badge.component.ts` | 35 | `style="font-size: var(--falcon-icon-md); color: var(--color-falcon-teal-500); ma` |
| 40 | `libs/falcon-studio/src/lib/components/color-change-badge.component.ts` | 66 | `style="font-size: var(--falcon-icon-sm);"` |
| 41 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 85 | `style="font-size: var(--falcon-icon-sm);"` |
| 42 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 106 | `style="font-size: var(--falcon-icon-sm);"` |
| 43 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 233 | `style="font-size: var(--falcon-icon-sm); vertical-align: -2px; margin-inline-end` |
| 44 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 246 | `style="font-size: var(--falcon-icon-sm); vertical-align: -2px; margin-inline-end` |
| 45 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 256 | `style="font-size: var(--falcon-icon-sm);"` |
| 46 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 270 | `style="font-size: var(--falcon-icon-sm);"` |
| 47 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 287 | `style="font-size: var(--falcon-icon-sm); vertical-align: -2px; margin-inline-end` |
| 48 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 299 | `style="font-size: var(--falcon-icon-sm); vertical-align: -2px; margin-inline-end` |
| 49 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 60 | `style="font-size: var(--falcon-icon-sm);"` |
| 50 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 76 | `style="font-size: var(--falcon-icon-sm);"` |
| 51 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 103 | `style="font-size: var(--falcon-icon-md);"` |
| 52 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 137 | `style="font-size: var(--falcon-icon-md);"` |
| 53 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 166 | `style="font-size: var(--falcon-icon-sm);"` |
| 54 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 181 | `style="font-size: var(--falcon-icon-sm);"` |
| 55 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 201 | `style="font-size: var(--falcon-icon-lg);"` |
| 56 | `libs/falcon-studio/src/lib/components/component-detail-panel.component.ts` | 53 | `style="font-size: var(--falcon-icon-md);"` |
| 57 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 94 | `style="font-size: var(--falcon-icon-sm);"` |
| 58 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 139 | `style="font-size: var(--falcon-icon-sm);"` |
| 59 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 156 | `style="font-size: var(--falcon-icon-lg);"` |
| 60 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 168 | `style="font-size: var(--falcon-icon-sm);"` |
| 61 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 192 | `style="font-size: var(--falcon-icon-lg);"` |
| 62 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 72 | `style="font-size: var(--falcon-icon-sm);"` |
| 63 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 82 | `style="font-size: var(--falcon-icon-sm);"` |
| 64 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 101 | `style="font-size: var(--falcon-icon-sm);"` |
| 65 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 125 | `style="font-size: var(--falcon-icon-md);"` |
| 66 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 144 | `style="font-size: var(--falcon-icon-sm);"` |
| 67 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 160 | `style="font-size: var(--falcon-icon-sm);"` |
| 68 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 176 | `style="font-size: var(--falcon-icon-md);"` |
| 69 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 262 | `style="font-size: var(--falcon-icon-sm);"` |
| 70 | `libs/falcon-studio/src/lib/components/context-menu.component.ts` | 73 | `style="font-size: var(--falcon-icon-sm);"` |
| 71 | `libs/falcon-studio/src/lib/components/context-menu.component.ts` | 101 | `style="font-size: var(--falcon-icon-sm);"` |
| 72 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 65 | `style="font-size: var(--falcon-icon-lg);"` |
| 73 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 83 | `style="font-size: var(--falcon-icon-md);"` |
| 74 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 174 | `style="font-size: var(--falcon-icon-sm);"` |
| 75 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 189 | `style="font-size: var(--falcon-icon-sm);"` |
| 76 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 204 | `style="font-size: var(--falcon-icon-sm);"` |
| 77 | `libs/falcon-studio/src/lib/components/custom-class-composer.component.ts` | 219 | `style="font-size: var(--falcon-icon-sm);"` |
| 78 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 102 | `style="font-size: var(--falcon-icon-lg);"` |
| 79 | `libs/falcon-studio/src/lib/components/inline-slider.component.ts` | 71 | `style="font-size: var(--falcon-icon-md);"` |
| 80 | `libs/falcon-studio/src/lib/components/inline-slider.component.ts` | 105 | `style="font-size: var(--falcon-icon-md);"` |
| 81 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 164 | `<iconify-icon [attr.icon]="s.icon" width="18" height="18" style="font-size: var(` |
| 82 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 196 | `<iconify-icon [attr.icon]="p.icon" width="18" height="18" style="font-size: var(` |
| 83 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 354 | `<iconify-icon [attr.icon]="s.icon" width="18" height="18" style="font-size: var(` |
| 84 | `libs/falcon-studio/src/lib/components/internal-control-renderer.component.ts` | 378 | `<iconify-icon [attr.icon]="a.icon" width="18" height="18" style="font-size: var(` |
| 85 | `libs/falcon-studio/src/lib/components/nested-part-picker.component.ts` | 63 | `style="font-size: var(--falcon-icon-sm);"` |
| 86 | `libs/falcon-studio/src/lib/components/nested-part-picker.component.ts` | 91 | `style="font-size: var(--falcon-icon-sm);"` |
| 87 | `libs/falcon-studio/src/lib/components/scope-chooser.component.ts` | 93 | `style="font-size: var(--falcon-icon-md);"` |
| 88 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-accordion.component.ts` | 21 | `style="font-size: var(--falcon-icon-sm);"` |
| 89 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-accordion.component.ts` | 33 | `style="font-size: var(--falcon-icon-sm);"` |
| 90 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-accordion.component.ts` | 47 | `style="font-size: var(--falcon-icon-sm);"` |
| 91 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-calendar.component.ts` | 22 | `style="font-size: var(--falcon-icon-sm);"` |
| 92 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-calendar.component.ts` | 30 | `style="font-size: var(--falcon-icon-sm);"` |
| 93 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-date-picker.component.ts` | 21 | `style="font-size: var(--falcon-icon-sm);"` |
| 94 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-dialog.component.ts` | 21 | `style="font-size: var(--falcon-icon-sm);"` |
| 95 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-dropdown.component.ts` | 21 | `style="font-size: var(--falcon-icon-sm);"` |
| 96 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-email-field.component.ts` | 18 | `style="font-size: var(--falcon-icon-sm);"` |
| 97 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-multi-select.component.ts` | 25 | `style="font-size: var(--falcon-icon-sm);"` |
| 98 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-otp-send-dialog.component.ts` | 20 | `style="font-size: var(--falcon-icon-sm);"` |
| 99 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-paginator.component.ts` | 17 | `style="font-size: var(--falcon-icon-sm);"` |
| 100 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-paginator.component.ts` | 39 | `style="font-size: var(--falcon-icon-sm);"` |
| 101 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-single-uploader.component.ts` | 20 | `style="font-size: var(--falcon-icon-md);"` |
| 102 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-stat-card.component.ts` | 20 | `style="font-size: var(--falcon-icon-md);"` |
| 103 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-toast.component.ts` | 19 | `style="font-size: var(--falcon-icon-md);"` |
| 104 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-toast.component.ts` | 31 | `style="font-size: var(--falcon-icon-sm);"` |
| 105 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-tree.component.ts` | 17 | `style="font-size: var(--falcon-icon-sm);"` |
| 106 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-tree.component.ts` | 28 | `style="font-size: var(--falcon-icon-sm);"` |
| 107 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-tree-table.component.ts` | 24 | `style="font-size: var(--falcon-icon-sm);"` |
| 108 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-tree-table.component.ts` | 36 | `style="font-size: var(--falcon-icon-sm);"` |
| 109 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-tree-table.component.ts` | 48 | `style="font-size: var(--falcon-icon-sm);"` |
| 110 | `libs/falcon-studio/src/lib/components/skeletons/skeleton-uploader.component.ts` | 20 | `style="font-size: var(--falcon-icon-lg);"` |
| 111 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 106 | `style="font-size: var(--falcon-icon-md);"` |
| 112 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 138 | `style="font-size: var(--falcon-icon-sm);"` |
| 113 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 196 | `style="font-size: var(--falcon-icon-sm);"` |
| 114 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 212 | `style="font-size: var(--falcon-icon-sm);"` |
| 115 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 301 | `style="font-size: var(--falcon-icon-sm);"` |
| 116 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 330 | `<div class="grid h-full min-h-0" style="grid-template-rows: auto 1fr;">` |
| 117 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 365 | `style="font-size: var(--falcon-icon-sm);"` |
| 118 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 373 | `style="font-size: var(--falcon-icon-sm);"` |
| 119 | `libs/falcon-studio/src/lib/components/token-group.component.ts` | 33 | `style="font-size: var(--falcon-icon-md);"` |
| 120 | `libs/falcon-studio/src/lib/components/token-group.component.ts` | 40 | `style="font-size: var(--falcon-icon-md);"` |

## `R-FE-005` — Falcon library FIRST â€” no raw HTML replacements (111 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 192 | `<button type="button"` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 2 | `<!-- *** Migrated from hand-rolled <table> to <falcon-angular-data-table> + cell` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 1 | `<button` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 2 | `<button` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 13 | `<button` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 25 | `<button` |
| 7 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 35 | `<button` |
| 8 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 65 | `<button` |
| 9 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 103 | `<button` |
| 10 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 14 | `<button type="button" aria-label="Close"` |
| 11 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 25 | `<input id="orgNodeNameInput" type="text"` |
| 12 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 45 | `<button type="button"` |
| 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 50 | `<button type="button"` |
| 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 3 | `1. Buttons rewritten with <falcon-angular-button size="sm"> (was hardcoded <butt` |
| 15 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 7 | `<button type="button"` |
| 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 24 | `<button type="button"` |
| 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 126 | `<button type="button"` |
| 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 157 | `<button type="button"` |
| 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 284 | `<button type="button"` |
| 20 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 289 | `<button type="button"` |
| 21 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 1 | `<!-- Wave 13m (2026-05-15) â€” OTP modal in native <dialog> top-layer.` |
| 22 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 16 | `<dialog #dlg` |
| 23 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 51 | `<button type="button"` |
| 24 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 134 | `<button type="button"` |
| 25 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 13 | `<!-- Falcon library buttons â€” variant + size tokens own the visual, no raw <bu` |
| 26 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 16 | `<button type="button" role="switch" [attr.aria-checked]="r.visible"` |
| 27 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 56 | `<input type="number" min="0"` |
| 28 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 42 | `<!-- Wave 8 â€” IP input keeps native <input> because FalconIpAddressDirective t` |
| 29 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 47 | `<input type="text" falconIpAddress autofocus` |
| 30 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 56 | `<button type="button"` |
| 31 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 61 | `<button type="button"` |
| 32 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 13 | `<!-- Falcon library buttons â€” variant + size tokens own the visual, no raw <bu` |
| 33 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 29 | `<input` |
| 34 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 39 | `<button type="button" class="cp-icon-right" (click)="toggleCurrentPasswordVisibi` |
| 35 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 71 | `<button type="button" class="cp-verify-btn" (click)="onVerifyCurrentPassword()">` |
| 36 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 100 | `<input` |
| 37 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 108 | `<button type="button" class="cp-icon-right" (click)="toggleNewPasswordVisibility` |
| 38 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 144 | `<input` |
| 39 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 152 | `<button type="button" class="cp-icon-right" (click)="toggleConfirmPasswordVisibi` |
| 40 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 181 | `<button` |
| 41 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` | 100 | `<button` |
| 42 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 26 | `<input` |
| 43 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 61 | `<button` |
| 44 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 182 | `<button` |
| 45 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 228 | `<input` |
| 46 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 237 | `<button type="button" class="fpf-icon-right" (click)="toggleNewPasswordVisibilit` |
| 47 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 268 | `<input` |
| 48 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 277 | `<button type="button" class="fpf-icon-right" (click)="toggleConfirmPasswordVisib` |
| 49 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 313 | `<button` |
| 50 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 34 | `<input` |
| 51 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 65 | `<input` |
| 52 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 74 | `<button type="button" class="gs-icon-right" (click)="togglePasswordVisibility()"` |
| 53 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 107 | `<button` |
| 54 | `apps/host-shell/src/app/features/not-found/not-found.component.html` | 12 | `<button` |
| 55 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 28 | `<button` |
| 56 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 54 | `<button` |
| 57 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 74 | `<button` |
| 58 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 94 | `<button` |
| 59 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 118 | `<button` |
| 60 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 137 | `<button` |
| 61 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 28 | `<button` |
| 62 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 39 | `<button` |
| 63 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 54 | `<button` |
| 64 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 93 | `<button` |
| 65 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 118 | `<button` |
| 66 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 133 | `<button` |
| 67 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 154 | `<button` |
| 68 | `apps/host-shell/src/app/playground/playground.page.html` | 37 | `<table class="w-full border-collapse text-sm">` |
| 69 | `apps/host-shell/src/app/playground/playground.page.html` | 907 | `<!-- *** Component section: <falcon-textarea>. Native <textarea> directly visibl` |
| 70 | `apps/host-shell/src/app/playground/playground.page.html` | 1667 | `<button` |
| 71 | `apps/host-shell/src/app/playground/playground.page.html` | 1848 | `<button type="button" (click)="backLinearShadow()"` |
| 72 | `apps/host-shell/src/app/playground/playground.page.html` | 1852 | `<button type="button" (click)="advanceLinearShadow()"` |
| 73 | `apps/host-shell/src/app/playground/playground.page.html` | 2429 | `<input` |
| 74 | `apps/host-shell/src/app/playground/playground.page.html` | 2451 | `<button` |
| 75 | `apps/host-shell/src/app/playground/playground.page.html` | 2537 | `<button type="button"` |
| 76 | `apps/host-shell/src/app/playground/playground.page.html` | 2544 | `<button type="button"` |
| 77 | `apps/host-shell/src/app/playground/playground.page.html` | 2551 | `<button type="button"` |
| 78 | `apps/host-shell/src/app/playground/playground.page.html` | 2558 | `<button type="button"` |
| 79 | `apps/host-shell/src/app/playground/playground.page.html` | 2565 | `<button type="button"` |
| 80 | `apps/host-shell/src/app/playground/playground.page.html` | 2578 | `<button type="button"` |
| 81 | `apps/host-shell/src/app/playground/playground.page.html` | 2585 | `<button type="button"` |
| 82 | `apps/host-shell/src/app/playground/playground.page.html` | 2592 | `<button type="button"` |
| 83 | `apps/host-shell/src/app/playground/playground.page.html` | 2599 | `<button type="button"` |
| 84 | `apps/host-shell/src/app/playground/playground.page.html` | 2803 | `<button type="button"` |
| 85 | `apps/host-shell/src/app/playground/playground.page.html` | 2809 | `<button type="button"` |
| 86 | `apps/host-shell/src/app/playground/playground.page.html` | 2815 | `<button type="button"` |
| 87 | `apps/host-shell/src/app/playground/playground.page.html` | 2821 | `<button type="button"` |
| 88 | `apps/host-shell/src/app/playground/playground.page.html` | 2827 | `<button type="button"` |
| 89 | `apps/host-shell/src/app/playground/playground.page.html` | 2833 | `<button type="button"` |
| 90 | `apps/host-shell/src/app/playground/playground.page.html` | 2839 | `<button type="button"` |
| 91 | `apps/host-shell/src/app/playground/playground.page.html` | 2875 | `<button type="button"` |
| 92 | `apps/host-shell/src/app/playground/playground.page.html` | 2881 | `<button type="button"` |
| 93 | `apps/host-shell/src/app/playground/playground.page.html` | 2887 | `<button type="button"` |
| 94 | `apps/host-shell/src/app/playground/playground.page.html` | 2893 | `<button type="button"` |
| 95 | `apps/host-shell/src/app/playground/playground.page.html` | 2899 | `<button type="button"` |
| 96 | `apps/host-shell/src/app/playground/playground.page.html` | 2905 | `<button type="button"` |
| 97 | `apps/host-shell/src/app/playground/playground.page.html` | 2914 | `<button type="button"` |
| 98 | `apps/host-shell/src/app/playground/playground.page.html` | 2918 | `<button type="button"` |
| 99 | `apps/host-shell/src/app/playground/playground.page.html` | 2922 | `<button type="button"` |
| 100 | `apps/host-shell/src/app/playground/playground.page.html` | 2926 | `<button type="button"` |
| 101 | `apps/host-shell/src/app/playground/playground.page.html` | 2933 | `<button type="button"` |
| 102 | `apps/host-shell/src/app/playground/playground.page.html` | 2968 | `<button type="button"` |
| 103 | `apps/host-shell/src/app/playground/playground.page.html` | 2972 | `<button type="button"` |
| 104 | `apps/host-shell/src/app/playground/playground.page.html` | 3004 | `<button type="button"` |
| 105 | `apps/host-shell/src/app/playground/playground.page.html` | 3008 | `<button type="button"` |
| 106 | `apps/host-shell/src/app/playground/playground.page.html` | 3056 | `<button type="button"` |
| 107 | `apps/host-shell/src/app/playground/playground.page.html` | 3060 | `<button type="button"` |
| 108 | `apps/host-shell/src/app/playground/playground.page.html` | 3079 | `<button type="button"` |
| 109 | `apps/host-shell/src/app/playground/playground.page.html` | 3083 | `<button type="button"` |
| 110 | `apps/host-shell/src/app/playground/playground.page.html` | 3114 | `<button type="button"` |
| 111 | `apps/host-shell/src/app/playground/playground.page.html` | 3118 | `<button type="button"` |

## `R-NOOR-005` — Color naming â€” palette over intent (Admin Console) (48 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/tailwind.css` | 303 | `@source inline("bg-[var(--falcon-switch-track-bg-error)]");` |
| 2 | `apps/admin-console/src/tailwind.css` | 303 | `@source inline("bg-[var(--falcon-switch-track-bg-error)]");` |
| 3 | `apps/admin-console/src/tailwind.css` | 381 | `@source inline("bg-[var(--falcon-textarea-bg-error)]");` |
| 4 | `apps/admin-console/src/tailwind.css` | 381 | `@source inline("bg-[var(--falcon-textarea-bg-error)]");` |
| 5 | `apps/admin-console/src/tailwind.css` | 732 | `@source inline("bg-[var(--falcon-stepper-circle-bg-error,#dc2626)]");` |
| 6 | `apps/admin-console/src/tailwind.css` | 732 | `@source inline("bg-[var(--falcon-stepper-circle-bg-error,#dc2626)]");` |
| 7 | `apps/admin-console/src/tailwind.css` | 841 | `@source inline("bg-[var(--falcon-uploader-dropzone-bg-error,rgba(220,38,38,0.04)` |
| 8 | `apps/admin-console/src/tailwind.css` | 841 | `@source inline("bg-[var(--falcon-uploader-dropzone-bg-error,rgba(220,38,38,0.04)` |
| 9 | `apps/admin-console/src/tailwind.css` | 884 | `@source inline("bg-[var(--falcon-uploader-item-bg-success,rgba(0,130,122,0.04))]` |
| 10 | `apps/admin-console/src/tailwind.css` | 884 | `@source inline("bg-[var(--falcon-uploader-item-bg-success,rgba(0,130,122,0.04))]` |
| 11 | `apps/admin-console/src/tailwind.css` | 885 | `@source inline("bg-[var(--falcon-uploader-item-bg-error,rgba(220,38,38,0.04))]")` |
| 12 | `apps/admin-console/src/tailwind.css` | 885 | `@source inline("bg-[var(--falcon-uploader-item-bg-error,rgba(220,38,38,0.04))]")` |
| 13 | `apps/admin-console/src/tailwind.css` | 916 | `@source inline("bg-[var(--falcon-uploader-progress-fill-bg-error,#dc2626)]");` |
| 14 | `apps/admin-console/src/tailwind.css` | 916 | `@source inline("bg-[var(--falcon-uploader-progress-fill-bg-error,#dc2626)]");` |
| 15 | `apps/admin-console/src/tailwind.css` | 929 | `@source inline("bg-[var(--falcon-uploader-badge-bg-success,rgba(0,130,122,0.12))` |
| 16 | `apps/admin-console/src/tailwind.css` | 929 | `@source inline("bg-[var(--falcon-uploader-badge-bg-success,rgba(0,130,122,0.12))` |
| 17 | `apps/admin-console/src/tailwind.css` | 931 | `@source inline("bg-[var(--falcon-uploader-badge-bg-error,rgba(220,38,38,0.12))]"` |
| 18 | `apps/admin-console/src/tailwind.css` | 931 | `@source inline("bg-[var(--falcon-uploader-badge-bg-error,rgba(220,38,38,0.12))]"` |
| 19 | `apps/admin-console/src/tailwind.css` | 972 | `@source inline("bg-[var(--falcon-single-uploader-empty-bg-error,rgba(220,38,38,0` |
| 20 | `apps/admin-console/src/tailwind.css` | 972 | `@source inline("bg-[var(--falcon-single-uploader-empty-bg-error,rgba(220,38,38,0` |
| 21 | `apps/admin-console/src/tailwind.css` | 1025 | `@source inline("bg-[var(--falcon-single-uploader-progress-fill-bg-error,#dc2626)` |
| 22 | `apps/admin-console/src/tailwind.css` | 1025 | `@source inline("bg-[var(--falcon-single-uploader-progress-fill-bg-error,#dc2626)` |
| 23 | `apps/admin-console/src/tailwind.css` | 1597 | `@source inline("bg-[var(--falcon-date-picker-input-bg-error)]");` |
| 24 | `apps/admin-console/src/tailwind.css` | 1597 | `@source inline("bg-[var(--falcon-date-picker-input-bg-error)]");` |
| 25 | `apps/admin-console/src/tailwind.css` | 1622 | `@source inline("bg-[var(--falcon-checkbox-bg-error)]");` |
| 26 | `apps/admin-console/src/tailwind.css` | 1622 | `@source inline("bg-[var(--falcon-checkbox-bg-error)]");` |
| 27 | `apps/admin-console/src/tailwind.css` | 1627 | `@source inline("bg-[var(--falcon-dropdown-bg-error)]");` |
| 28 | `apps/admin-console/src/tailwind.css` | 1627 | `@source inline("bg-[var(--falcon-dropdown-bg-error)]");` |
| 29 | `apps/admin-console/src/tailwind.css` | 1635 | `@source inline("bg-[var(--falcon-input-bg-error)]");` |
| 30 | `apps/admin-console/src/tailwind.css` | 1635 | `@source inline("bg-[var(--falcon-input-bg-error)]");` |
| 31 | `apps/admin-console/src/tailwind.css` | 1639 | `@source inline("bg-[var(--falcon-multi-select-bg-error)]");` |
| 32 | `apps/admin-console/src/tailwind.css` | 1639 | `@source inline("bg-[var(--falcon-multi-select-bg-error)]");` |
| 33 | `apps/admin-console/src/tailwind.css` | 1650 | `@source inline("bg-[var(--falcon-radio-bg-error)]");` |
| 34 | `apps/admin-console/src/tailwind.css` | 1650 | `@source inline("bg-[var(--falcon-radio-bg-error)]");` |
| 35 | `apps/admin-console/src/tailwind.css` | 1810 | `@source inline("shadow-[var(--falcon-input-shadow-error)]");` |
| 36 | `apps/admin-console/src/tailwind.css` | 1810 | `@source inline("shadow-[var(--falcon-input-shadow-error)]");` |
| 37 | `apps/admin-console/src/tailwind.css` | 1918 | `@source inline("bg-[var(--falcon-otp-bg-error)]");` |
| 38 | `apps/admin-console/src/tailwind.css` | 1918 | `@source inline("bg-[var(--falcon-otp-bg-error)]");` |
| 39 | `apps/admin-console/src/tailwind.css` | 1931 | `@source inline("shadow-[var(--falcon-otp-shadow-error)]");` |
| 40 | `apps/admin-console/src/tailwind.css` | 1931 | `@source inline("shadow-[var(--falcon-otp-shadow-error)]");` |
| 41 | `apps/admin-console/src/tailwind.css` | 1981 | `@source inline("bg-[var(--falcon-phone-field-bg-error)]");` |
| 42 | `apps/admin-console/src/tailwind.css` | 1981 | `@source inline("bg-[var(--falcon-phone-field-bg-error)]");` |
| 43 | `apps/admin-console/src/tailwind.css` | 1992 | `@source inline("shadow-[var(--falcon-phone-field-shadow-error)]");` |
| 44 | `apps/admin-console/src/tailwind.css` | 1992 | `@source inline("shadow-[var(--falcon-phone-field-shadow-error)]");` |
| 45 | `apps/admin-console/src/tailwind.css` | 2134 | `@source inline("bg-[var(--falcon-email-field-bg-error)]");` |
| 46 | `apps/admin-console/src/tailwind.css` | 2134 | `@source inline("bg-[var(--falcon-email-field-bg-error)]");` |
| 47 | `apps/admin-console/src/tailwind.css` | 2145 | `@source inline("shadow-[var(--falcon-email-field-shadow-error)]");` |
| 48 | `apps/admin-console/src/tailwind.css` | 2145 | `@source inline("shadow-[var(--falcon-email-field-shadow-error)]");` |

## `R-FE-002` — No SCSS, no component CSS, no styles array (44 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` | 29 | `styleUrls: ['./change-password.component.scss'],` |
| 2 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | 31 | `styleUrls: ['./enter-otp.component.scss'],` |
| 3 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | 37 | `styleUrls: ['./forgot-password-flow.component.scss'],` |
| 4 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | 27 | `styleUrls: ['./get-started.component.scss'],` |
| 5 | `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | 14 | `styleUrls: ['./login-layout.component.scss'],` |
| 6 | `apps/host-shell/src/app/features/dashboard/dashboard.component.ts` | 38 | `styleUrls: ['./dashboard.component.scss'],` |
| 7 | `apps/host-shell/src/app/features/error/error.component.ts` | 19 | `styles: [`` |
| 8 | `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts` | 29 | `styleUrls: ['./showcase.css'],` |
| 9 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 518 | `styles: [` |
| 10 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-live-element.component.ts` | 25 | `styles: [':host { display: contents; }'],` |
| 11 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 496 | `styles: [` |
| 12 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 836 | `styles: [` |
| 13 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 20 | `styles: [`` |
| 14 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 78 | `styleUrls: ['./sidebar.component.scss'],` |
| 15 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` | 37 | `styleUrls: ['./topbar.component.scss'],` |
| 16 | `apps/host-shell/src/app/layout/layout.component.ts` | 28 | `styleUrls: ['./layout.component.scss'],` |
| 17 | `apps/host-shell/src/app/preview-page.component.ts` | 29 | `styles: [`` |
| 18 | `apps/host-shell/src/app/preview-shell.component.ts` | 42 | `styles: [`` |
| 19 | `demos/angular-playground/src/studio/live-element.component.ts` | 26 | `styles: [':host { display: contents; }'],` |
| 20 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts` | 12 | `styleUrls: ['./falcon-form-field.component.scss'],` |
| 21 | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` | 31 | `styleUrls: ['./falcon-mobile-number.component.scss'],` |
| 22 | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts` | 29 | `styleUrls: ['./falcon-multiselect.component.scss'],` |
| 23 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` | 24 | `styleUrls: ['./falcon-photo-uploader.component.scss'],` |
| 24 | `libs/falcon/src/shared-ui/lib/components/falcon-saudi-riyal-icon/falcon-saudi-riyal-icon.component.ts` | 21 | `styles: [`` |
| 25 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` | 11 | `styleUrls: ['./falcon-tree-node.component.scss'],` |
| 26 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` | 67 | `styleUrls: ['./falcon-tree-panel.component.scss'],` |
| 27 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts` | 16 | `styleUrls: ['./send-credentials-popup.component.scss'],` |
| 28 | `libs/falcon/src/shared-ui/lib/ui/falcon-icon/falcon-icon.component.ts` | 26 | `styles: [`` |
| 29 | `libs/falcon/src/shared-ui/lib/ui/icon/icon.component.ts` | 55 | `styles: [`` |
| 30 | `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.component.ts` | 72 | `styles: [` |
| 31 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 288 | `styles: [` |
| 32 | `libs/falcon-studio/src/lib/components/color-change-badge.component.ts` | 73 | `styles: [` |
| 33 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 267 | `styles: [` |
| 34 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 309 | `styles: [` |
| 35 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 216 | `styles: [` |
| 36 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 201 | `styles: [` |
| 37 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 272 | `styles: [` |
| 38 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 158 | `styles: [`` |
| 39 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 395 | `styles: [` |
| 40 | `node_modules/@angular/cdk/_index.scss` | 1 | `(SCSS file present)` |
| 41 | `node_modules/@angular/cdk/a11y/_index.scss` | 1 | `(SCSS file present)` |
| 42 | `node_modules/@angular/cdk/overlay/_index.scss` | 1 | `(SCSS file present)` |
| 43 | `node_modules/@angular/cdk/text-field/_index.scss` | 1 | `(SCSS file present)` |
| 44 | `node_modules/@docsearch/css/dist/style.scss` | 1 | `(SCSS file present)` |

## `R-NOOR-007` — i18n & RTL â€” strings from catalog, logical spacing only (40 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 60 | `<div class="pl-5 pr-2 pt-1 border-b border-falcon-neutral-150">` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 60 | `<div class="pl-5 pr-2 pt-1 border-b border-falcon-neutral-150">` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-5` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-5` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 85 | `<span class="absolute -left-3 top-0 h-full border-l border-falcon-teal-100"></sp` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 85 | `<span class="absolute -left-3 top-0 h-full border-l border-falcon-teal-100"></sp` |
| 7 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] bo` |
| 8 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] bo` |
| 9 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 32 | `class="absolute top-0 left-0 origin-top-left transition-transform duration-200"` |
| 10 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 32 | `class="absolute top-0 left-0 origin-top-left transition-transform duration-200"` |
| 11 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 49 | `<span class="text-falcon-danger-600 font-bold mr-0.5">*</span>` |
| 12 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 49 | `<span class="text-falcon-danger-600 font-bold mr-0.5">*</span>` |
| 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 15 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 53 | `<falcon-step [label]="'hierarchy.addClient.steps.info'">` |
| 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 53 | `<falcon-step [label]="'hierarchy.addClient.steps.info'">` |
| 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 62 | `<falcon-step [label]="'hierarchy.addClient.steps.settings'">` |
| 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 62 | `<falcon-step [label]="'hierarchy.addClient.steps.settings'">` |
| 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 71 | `<falcon-step [label]="'hierarchy.addClient.steps.channels'">` |
| 20 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 71 | `<falcon-step [label]="'hierarchy.addClient.steps.channels'">` |
| 21 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 80 | `<falcon-step [label]="'hierarchy.addClient.steps.apps'">` |
| 22 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 80 | `<falcon-step [label]="'hierarchy.addClient.steps.apps'">` |
| 23 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 89 | `<falcon-step [label]="'hierarchy.addClient.steps.owner'">` |
| 24 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 89 | `<falcon-step [label]="'hierarchy.addClient.steps.owner'">` |
| 25 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 23 | `[class.left-px]="!r.visible"></span>` |
| 26 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 23 | `[class.left-px]="!r.visible"></span>` |
| 27 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-` |
| 28 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-` |
| 29 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 24 | `<span class="flex flex-col gap-0.5 -ml-1">` |
| 30 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 24 | `<span class="flex flex-col gap-0.5 -ml-1">` |
| 31 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 48 | `class="w-full h-9 px-3 pr-16 rounded-md border bg-white text-sm focus:outline-no` |
| 32 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 48 | `class="w-full h-9 px-3 pr-16 rounded-md border bg-white text-sm focus:outline-no` |
| 33 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 34 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 9 | `<span class="text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]">Falc` |
| 35 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 53 | `<falcon-step [label]="'hierarchy.addUser.steps.personal'">` |
| 36 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 53 | `<falcon-step [label]="'hierarchy.addUser.steps.personal'">` |
| 37 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 62 | `<falcon-step [label]="'hierarchy.addUser.steps.role'">` |
| 38 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 62 | `<falcon-step [label]="'hierarchy.addUser.steps.role'">` |
| 39 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 71 | `<falcon-step [label]="'hierarchy.addUser.steps.permissions'">` |
| 40 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 71 | `<falcon-step [label]="'hierarchy.addUser.steps.permissions'">` |

## `R-FE-001` — Tailwind utilities only on Angular templates (38 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` | 29 | `styleUrls: ['./change-password.component.scss'],` |
| 2 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | 31 | `styleUrls: ['./enter-otp.component.scss'],` |
| 3 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | 37 | `styleUrls: ['./forgot-password-flow.component.scss'],` |
| 4 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | 27 | `styleUrls: ['./get-started.component.scss'],` |
| 5 | `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | 14 | `styleUrls: ['./login-layout.component.scss'],` |
| 6 | `apps/host-shell/src/app/features/dashboard/dashboard.component.ts` | 39 | `styleUrls: ['./dashboard.component.scss'],` |
| 7 | `apps/host-shell/src/app/features/error/error.component.ts` | 20 | `styles: [`` |
| 8 | `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts` | 30 | `styleUrls: ['./showcase.css'],` |
| 9 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 519 | `styles: [` |
| 10 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-live-element.component.ts` | 26 | `styles: [':host { display: contents; }'],` |
| 11 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 497 | `styles: [` |
| 12 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 837 | `styles: [` |
| 13 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 21 | `styles: [`` |
| 14 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 78 | `styleUrls: ['./sidebar.component.scss'],` |
| 15 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` | 37 | `styleUrls: ['./topbar.component.scss'],` |
| 16 | `apps/host-shell/src/app/layout/layout.component.ts` | 29 | `styleUrls: ['./layout.component.scss'],` |
| 17 | `apps/host-shell/src/app/preview-page.component.ts` | 29 | `styles: [`` |
| 18 | `apps/host-shell/src/app/preview-shell.component.ts` | 42 | `styles: [`` |
| 19 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts` | 13 | `styleUrls: ['./falcon-form-field.component.scss'],` |
| 20 | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` | 32 | `styleUrls: ['./falcon-mobile-number.component.scss'],` |
| 21 | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts` | 30 | `styleUrls: ['./falcon-multiselect.component.scss'],` |
| 22 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` | 25 | `styleUrls: ['./falcon-photo-uploader.component.scss'],` |
| 23 | `libs/falcon/src/shared-ui/lib/components/falcon-saudi-riyal-icon/falcon-saudi-riyal-icon.component.ts` | 22 | `styles: [`` |
| 24 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` | 12 | `styleUrls: ['./falcon-tree-node.component.scss'],` |
| 25 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` | 68 | `styleUrls: ['./falcon-tree-panel.component.scss'],` |
| 26 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts` | 17 | `styleUrls: ['./send-credentials-popup.component.scss'],` |
| 27 | `libs/falcon/src/shared-ui/lib/ui/falcon-icon/falcon-icon.component.ts` | 27 | `styles: [`` |
| 28 | `libs/falcon/src/shared-ui/lib/ui/icon/icon.component.ts` | 56 | `styles: [`` |
| 29 | `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.component.ts` | 73 | `styles: [` |
| 30 | `libs/falcon-studio/src/lib/components/animation-panel.component.ts` | 288 | `styles: [` |
| 31 | `libs/falcon-studio/src/lib/components/color-change-badge.component.ts` | 73 | `styles: [` |
| 32 | `libs/falcon-studio/src/lib/components/color-panel.component.ts` | 267 | `styles: [` |
| 33 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` | 309 | `styles: [` |
| 34 | `libs/falcon-studio/src/lib/components/common-actions-rail.component.ts` | 216 | `styles: [` |
| 35 | `libs/falcon-studio/src/lib/components/component-gallery-cards.component.ts` | 201 | `styles: [` |
| 36 | `libs/falcon-studio/src/lib/components/component-preview.component.ts` | 272 | `styles: [` |
| 37 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` | 158 | `styles: [`` |
| 38 | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | 395 | `styles: [` |

## `R-FE-009` — Feature folder structure â€” one file per type-folder (20 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 2 | `apps/host-shell/src/app/core/services/` | 1 | `services/ has 3 ts files but no services.ts` |
| 3 | `apps/host-shell/src/app/features/auth/change-password/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 4 | `apps/host-shell/src/app/features/auth/change-password/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 5 | `apps/host-shell/src/app/features/auth/enter-otp/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 6 | `apps/host-shell/src/app/features/auth/enter-otp/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 7 | `apps/host-shell/src/app/features/auth/forgot-password-flow/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 8 | `apps/host-shell/src/app/features/auth/forgot-password-flow/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 9 | `apps/host-shell/src/app/features/auth/get-started/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 10 | `apps/host-shell/src/app/features/auth/get-started/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 11 | `apps/host-shell/src/app/features/auth/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 12 | `libs/falcon/src/core/lib/services/` | 1 | `services/ has 3 ts files but no services.ts` |
| 13 | `libs/falcon/src/language/lib/services/` | 1 | `services/ has 1 ts files but no services.ts` |
| 14 | `libs/falcon/src/shared-data-access/lib/services/` | 1 | `services/ has 8 ts files but no services.ts` |
| 15 | `libs/falcon/src/shared-ui/lib/directives/` | 1 | `directives/ has 13 ts files but no directives.ts` |
| 16 | `libs/falcon-studio/src/lib/directives/` | 1 | `directives/ has 1 ts files but no directives.ts` |
| 17 | `libs/falcon-studio/src/lib/services/` | 1 | `services/ has 12 ts files but no services.ts` |
| 18 | `node_modules/@nx/module-federation/src/plugins/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 19 | `node_modules/@nx/module-federation/src/utils/models/` | 1 | `models/ has 1 ts files but no models.ts` |
| 20 | `node_modules/nx/dist/src/nx-cloud/models/` | 1 | `models/ has 1 ts files but no models.ts` |

## `R-NOOR-008` — Global selector hygiene â€” no naked body/*/:root overrides (4 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 100 | `*{{ 'hierarchy.validation.invalidIp' \| translate: { value: pendingIp() } }` |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 100 | `*{{ 'hierarchy.validation.invalidIp' \| translate: { value: pendingIp() } }` |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 104 | `*{{ ipError()!.key \| translate: (ipError()!.params ?? undefined) }` |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 104 | `*{{ ipError()!.key \| translate: (ipError()!.params ?? undefined) }` |

## `R-NOOR-001` — Layout ownership â€” shell owns chrome, page owns content (1 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` | 1 | `Admin Console page missing <falcon-page-shell> wrapper` |

## `R-FE-012` — Build must be green â€” nx build exit 0 required (1 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `(out-of-band)` | 0 | `Build state verified by audit-orchestrator post-hoc, not by this handler` |


