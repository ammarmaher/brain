---
runId: overnight-frontend
generatedAt: 2026-05-16T00:19:35.3600638Z
targets: C:\Falcon\Falcon\falcon-web-platform-ui
---

# Code Audit Summary — overnight-frontend

> Run started 2026-05-16 03:19:35 · scanned 1 repos.

## Totals

| Severity | Count |
|---|---|
| 🔴 must | 2974 |
| 🟠 should | 20 |
| 🟢 nice | 0 |
| **Total real violations** | **2994** |

## By rule (top 10)

| Rule | Name | Severity | Count |
|---|---|---|---|
| `R-FE-004` | Tokens only â€” no hardcoded hex, px, or palette names | must | 2271 |
| `R-NOOR-003` | Typography scale â€” only documented type tokens allowed | must | 296 |
| `R-FE-003` | No inline styles, ever | must | 120 |
| `R-FE-005` | Falcon library FIRST â€” no raw HTML replacements | must | 111 |
| `R-NOOR-005` | Color naming â€” palette over intent (Admin Console) | must | 48 |
| `R-FE-002` | No SCSS, no component CSS, no styles array | must | 44 |
| `R-NOOR-007` | i18n & RTL â€” strings from catalog, logical spacing only | must | 40 |
| `R-FE-001` | Tailwind utilities only on Angular templates | must | 38 |
| `R-FE-009` | Feature folder structure â€” one file per type-folder | should | 20 |
| `R-NOOR-008` | Global selector hygiene â€” no naked body/*/:root overrides | must | 4 |

## By repo

| Repo | Violations |
|---|---|
| `C:\Falcon\Falcon\falcon-web-platform-ui` | 2994 |

## High severity (first 20)

| Rule | File | Line | Snippet |
|---|---|---|---|
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 8 | `<span class="text-falcon-neutral-500 tracking-[0.5px]">-----</span>` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/falcon-status.component.html` | 2 | `<span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-s` |
| `R-FE-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 71 | `style="height: calc(95vh - 40px)">` |
| `R-FE-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 83 | `[style]="indentStyle(row.indent)">` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 20 | `success: 'bg-emerald-100',` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 21 | `warning: 'bg-amber-100',` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 22 | `danger:  'bg-rose-100',` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 23 | `muted:   'bg-slate-200',` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 70 | `class="hidden lg:flex lg:col-span-1 flex-col gap-3 rounded-2xl border border-sla` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 74 | `<div class="h-3.5 w-1/2 rounded-md bg-slate-300/70 animate-pulse"></div>` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 77 | `<div class="h-3 w-2/5 rounded-md bg-slate-300/70 animate-pulse mb-1"></div>` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 87 | `<div class="w-3 h-3 rounded-sm bg-slate-300/70 animate-pulse"></div>` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 89 | `<div class="h-3.5 rounded-md bg-slate-300/70 animate-pulse" [class]="row.width">` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 94 | `<main class="lg:col-span-4 min-w-0 rounded-2xl border border-slate-200 bg-white ` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 95 | `<div class="grid grid-cols-[1fr_auto] items-center gap-4 h-16 px-7 border-b bord` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 98 | `<div class="h-3.5 rounded-md bg-slate-200/80 animate-pulse" [class]="w"></div>` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 101 | `<div class="h-9 w-28 rounded-full bg-slate-200/80 animate-pulse"></div>` |
| `R-FE-004` | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | 107 | `<div class="h-6 w-56 rounded-md bg-slate-300/70 animate-pulse"></div>` |

## Outputs
- `violations.jsonl` — every violation as JSONL
- `violations-regex.jsonl` · `violations-structural.jsonl` · `violations-ast.jsonl` · `violations-semantic.jsonl` — per-engine streams
- `engine-runtimes.md` — performance + failure reasons

