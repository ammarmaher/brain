*** Brain SK Frontend Index ***
*** Auto-updated by Brain SK TouchBase and report generation ***

# Frontend Index

## Latest

### 2026-05-13 (night) · Incremental Component Scan — Run `2026-05-13-2337`

First baseline of the new incremental-scan skill (`domains/frontend/component-knowledge/incremental-scan/SKILL.md`).

- [COMPONENT_SCAN_REPORT (md)](../outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_REPORT.md)
- [COMPONENT_SCAN_REPORT (pdf)](../outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_REPORT.pdf)
- [COMPONENT_SCAN_DATA.json](../outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_DATA.json)
- [COMPONENT_EDIT_HISTORY_TABLE](../outputs/reports/component-scans/2026-05-13-2337/COMPONENT_EDIT_HISTORY_TABLE.md)
- [COMPONENT_SCAN_SUMMARY (csv)](../outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_SUMMARY.csv)
- [component-scan-metadata.json (canonical)](../outputs/understanding/frontend/_scan-state/component-scan-metadata.json)
- [FRONTEND_COMPONENT_SCAN_RUN (log)](../outputs/understanding/frontend/_scan-state/FRONTEND_COMPONENT_SCAN_RUN.md)

Coverage: 60 discovered · 60 scanned · 0 skipped · 0 missing-knowledge · 0 failed · 100 % scan coverage · 88 % edit-tracking completeness · Falcon `polishing-v0.4` @ `6ecd2f2f` · 9.5 s run.

### 2026-05-13 (evening) · Deep Falcon Component Knowledge Build

Seven-agent parallel investigation. **60 component folders × 6 files = 360 component markdown files** + 10 master files + per-agent summaries.

- [[FALCON_COMPONENT_INDEX]] — every component dossier (60 entries)
- [FALCON_COMPONENT_REGISTRY_DEEP](../outputs/component-registry/FALCON_COMPONENT_REGISTRY_DEEP.md) — 60-row deep registry
- [FALCON_COMPONENT_CAPABILITY_MATRIX](../outputs/frontend-understanding/FALCON_COMPONENT_CAPABILITY_MATRIX.md) — 60 × 15 capability matrix
- [COMPONENT_RELATIONSHIP_MAP](../outputs/frontend-understanding/COMPONENT_RELATIONSHIP_MAP.md) — composition / replaces / supersedes
- [COMPONENT_UPGRADE_BACKLOG](../outputs/frontend-understanding/COMPONENT_UPGRADE_BACKLOG.md) — 124-item prioritized backlog
- [FRONTEND_COMPONENT_KNOWLEDGE_REPORT](../outputs/frontend-understanding/FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md) — master narrative + top 15 findings
- [FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT](../outputs/frontend-understanding/FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md) — 10-question synthesis
- [FALCON_THEME_AND_TAILWIND_REPORT](../outputs/frontend-understanding/FALCON_THEME_AND_TAILWIND_REPORT.md) — SSOT + 14 token families + 46 component-token files
- [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../outputs/frontend-understanding/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md) — Stencil Shadow / Light / Angular wrapper architecture
- [READINESS_SCORES](../outputs/frontend-understanding/READINESS_SCORES.md) — per-dimension percentages
- [FINAL_COVERAGE_REPORT](../outputs/frontend-understanding/FINAL_COVERAGE_REPORT.md) — coverage totals + highest-risk gaps

### Headline scores

| Dimension | Score |
|---|---:|
| Component API understanding | **95 %** |
| Usage understanding | **88 %** |
| Token / theme understanding | **96 %** |
| Dynamic capability understanding | **92 %** |
| Wrapper / render-path understanding | **94 %** |
| Upgrade gap confidence | **93 %** |
| Test / a11y confidence | **70 %** |
| **Overall frontend component readiness** | **91 %** |

### Top P0 risks (full list in FINAL_COVERAGE_REPORT)

1. Focus trap missing on `<falcon-angular-popup>` — WCAG violation.
2. 4 wizards still on legacy `<falcon-stepper>` — modern `<falcon-angular-stepper>` + `<falcon-angular-wizard>` have zero production consumers.
3. PrimeIcons residual `pi pi-ellipsis-v` in `<falcon-table>` row-action button + `pi pi-cloud-upload` / `pi pi-pencil` in uploader Stencil components — Wave PR-8 cleanup incomplete.
4. `<falcon-angular-tree>` lacks per-row template / action slot — blocks `<falcon-tree-panel>` convergence.
5. `FalconFormValidateDirective` targets deleted PrimeNG selectors — needs major refactor.
6. 20+ feature SCSS files violate the no-SCSS rule (~3 200 LOC across forgot-password / dashboard / enter-otp / etc.).
7. Three different `--font-sans` values across the three apps.
8. Zero `*.spec.ts` coverage on Falcon UI core components.

## First-pass discovery (2026-05-13 morning)

- [FRONTEND_WORKSPACE_MAP](../outputs/understanding/frontend/FRONTEND_WORKSPACE_MAP.md) — apps + libs tables, Module Federation share rules
- [FALCON_COMPONENT_REGISTRY](../outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) — original 58-row registry (47 Stencil pairs + 49 Angular wrappers + 7 legacy bespoke)
- [TAILWIND_TOKEN_MAP](../outputs/understanding/frontend/TAILWIND_TOKEN_MAP.md) — `@theme` tokens across 14 categories (216 verified, was 264 in this file)
- [FRONTEND_STRUCTURE_REPORT](../outputs/understanding/frontend/FRONTEND_STRUCTURE_REPORT.md) — Angular conventions, signals/zoneless/control-flow status
- [ANGULAR_AND_TAILWIND_RULES](../outputs/understanding/frontend/ANGULAR_AND_TAILWIND_RULES.md) — Tailwind-only rules + hard prohibitions

## Snapshot

- 3 apps: `host-shell` (4200, host) · `admin-console` (4204, remote) · `management-console` (4301, remote)
- 9 libs: `falcon`, `falcon-ui-core`, `falcon-ui-tokens`, `falcon-theme`, `falcon-studio`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-ui-showcase-data`, `sdk`
- Angular 21.2.9 · zoneless · Tailwind v4 · standalone components · CVA on every form control · zero PrimeNG components · zero `*ngIf`/`*ngFor`
- Of 49 Stencil-backed Angular wrappers, only **13 have real-feature consumers**; 24 are lab-only, 12 fully unused.

## Parallel-agent raw outputs (for audit / drill-down)

- `outputs/component-registry/parallel-agents/agent-01-forms/` — 22 form/input components × 6 files
- `outputs/component-registry/parallel-agents/agent-02-data/` — 10 data/table/status components × 6 files
- `outputs/component-registry/parallel-agents/agent-03-layout-navigation/` — 15 layout/overlay components × 6 files
- `outputs/component-registry/parallel-agents/agent-04-workflow/` — 14 workflow/legacy components × 6 files
- `outputs/component-registry/parallel-agents/agent-05-theme-tailwind-tokens/` — 14 theme/token audit docs
- `outputs/component-registry/parallel-agents/agent-06-frontend-architecture-usage/` — 16 architecture/usage docs
