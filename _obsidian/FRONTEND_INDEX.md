*** Brain SK Frontend Index ***
*** Auto-updated by Brain SK TouchBase and report generation ***
*** Canonical-path repointed 2026-05-13 by Agent 6 (Obsidian Link Agent) — see migration audit ***

# Frontend Index

> **Canonical source for all frontend component knowledge:** `C:\Falcon\Brain Outputs\understanding\frontend`
> Old paths under `Brain Outputs\component-registry` and `Brain Outputs\frontend-understanding` are archival only — never used as active source.
>
> Hub notes: [[Frontend Understanding]] (top-level index) and [[Frontend Components Index]] (60 dossiers).
>
> **Visual QA:** Falcon Eyes is the semantic visual difference QA layer — see [[FALCON_EYES_INDEX]] and [[VISUAL_QA_INDEX]]. Brain SK MUST run Falcon Eyes before suggesting UI fixes when visual parity is below 90 % or when Ammar asks about source-vs-destination screenshot differences.

## Latest

### 2026-05-13 (night) · Incremental Component Scan — Run `2026-05-13-2337`

First baseline of the new incremental-scan skill (`domains/frontend/component-knowledge/incremental-scan/SKILL.md`).

- [COMPONENT_SCAN_REPORT (md)](../../Brain%20Outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_REPORT.md)
- [COMPONENT_SCAN_REPORT (pdf)](../../Brain%20Outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_REPORT.pdf)
- [COMPONENT_SCAN_DATA.json](../../Brain%20Outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_DATA.json)
- [COMPONENT_EDIT_HISTORY_TABLE](../../Brain%20Outputs/reports/component-scans/2026-05-13-2337/COMPONENT_EDIT_HISTORY_TABLE.md)
- [COMPONENT_SCAN_SUMMARY (csv)](../../Brain%20Outputs/reports/component-scans/2026-05-13-2337/COMPONENT_SCAN_SUMMARY.csv)
- [component-scan-metadata.json (canonical)](../../Brain%20Outputs/understanding/frontend/_scan-state/component-scan-metadata.json)
- [FRONTEND_COMPONENT_SCAN_RUN (log)](../../Brain%20Outputs/understanding/frontend/_scan-state/FRONTEND_COMPONENT_SCAN_RUN.md)

Coverage: 60 discovered · 60 scanned · 0 skipped · 0 missing-knowledge · 0 failed · 100 % scan coverage · 88 % edit-tracking completeness · Falcon `polishing-v0.4` @ `6ecd2f2f` · 9.5 s run.

### 2026-05-13 (evening) · Deep Falcon Component Knowledge Build

Seven-agent parallel investigation. **60 component folders x 6 files = 360 component markdown files** + master narrative files + theme + architecture + narrative reports.

- [[Frontend Components Index]] — every component dossier (60 entries) routed to canonical components folders
- [[FALCON_COMPONENT_INDEX]] — legacy index (now points to canonical paths after Agent 6 repointing)
- [CANONICAL_FRONTEND_UNDERSTANDING](../../Brain%20Outputs/understanding/frontend/CANONICAL_FRONTEND_UNDERSTANDING.md) — top-level canonical entry point
- [FALCON_COMPONENT_REGISTRY](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) — first-pass 58-row registry
- [FALCON_COMPONENT_REGISTRY_DEEP](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md) — 60-row deep registry
- [FALCON_COMPONENT_CAPABILITY_MATRIX](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md) — 60 x 15 capability matrix
- [COMPONENT_RELATIONSHIP_MAP](../../Brain%20Outputs/understanding/frontend/COMPONENT_RELATIONSHIP_MAP.md) — composition / replaces / supersedes
- [COMPONENT_UPGRADE_BACKLOG](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) — 124-item prioritized backlog
- [FRONTEND_COMPONENT_KNOWLEDGE_REPORT](../../Brain%20Outputs/understanding/frontend/FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md) — master narrative + top 15 findings
- [FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT](../../Brain%20Outputs/understanding/frontend/FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md) — 10-question synthesis
- [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md) — SSOT + 14 token families + 46 component-token files (216 tokens authoritative)
- [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md) — Stencil Shadow / Light / Angular wrapper architecture
- [narrative/READINESS_SCORES](../../Brain%20Outputs/understanding/frontend/narrative/READINESS_SCORES.md) — per-dimension percentages
- [narrative/FINAL_COVERAGE_REPORT](../../Brain%20Outputs/understanding/frontend/narrative/FINAL_COVERAGE_REPORT.md) — coverage totals + highest-risk gaps

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

- [FRONTEND_WORKSPACE_MAP](../../Brain%20Outputs/understanding/frontend/FRONTEND_WORKSPACE_MAP.md) — apps + libs tables, Module Federation share rules
- [FALCON_COMPONENT_REGISTRY](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) — original 58-row registry (47 Stencil pairs + 49 Angular wrappers + 7 legacy bespoke)
- [TAILWIND_TOKEN_MAP](../../Brain%20Outputs/understanding/frontend/TAILWIND_TOKEN_MAP.md) — `@theme` tokens across 14 categories (216 verified, was 264 in this file)
- [FRONTEND_STRUCTURE_REPORT](../../Brain%20Outputs/understanding/frontend/FRONTEND_STRUCTURE_REPORT.md) — Angular conventions, signals/zoneless/control-flow status
- [ANGULAR_AND_TAILWIND_RULES](../../Brain%20Outputs/understanding/frontend/ANGULAR_AND_TAILWIND_RULES.md) — Tailwind-only rules + hard prohibitions

## Theme + Architecture extended audits (canonical sub-folders)

- `theme/` — 11 audits (token flow, SSOT, dark-mode, density, RTL, etc.). Entry: [theme/THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md).
- `architecture/` — 13 audits (workspace topology, MF, routes, barrels, facades, etc.). Entry: [architecture/WORKSPACE_TOPOLOGY](../../Brain%20Outputs/understanding/frontend/architecture/WORKSPACE_TOPOLOGY.md).

Full enumeration in [[Frontend Understanding]].

## Snapshot

- 3 apps: `host-shell` (4200, host) · `admin-console` (4204, remote) · `management-console` (4301, remote)
- 9 libs: `falcon`, `falcon-ui-core`, `falcon-ui-tokens`, `falcon-theme`, `falcon-studio`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-ui-showcase-data`, `sdk`
- Angular 21.2.9 · zoneless · Tailwind v4 · standalone components · CVA on every form control · zero PrimeNG components · zero `*ngIf`/`*ngFor`
- Of 49 Stencil-backed Angular wrappers, only **13 have real-feature consumers**; 24 are lab-only, 12 fully unused.

## Migration audit

The canonical-path repointing for this index was performed 2026-05-13 by Agent 6 of the seven-agent frontend knowledge migration. Full audit:

- [migration/01_SOURCE_INVENTORY](../../Brain%20Outputs/understanding/frontend/migration/01_SOURCE_INVENTORY.md)
- [migration/02_LATEST_SELECTION_PLAN](../../Brain%20Outputs/understanding/frontend/migration/02_LATEST_SELECTION_PLAN.md)
- [migration/03_COMPONENT_MIGRATION_REPORT](../../Brain%20Outputs/understanding/frontend/migration/03_COMPONENT_MIGRATION_REPORT.md)
- [migration/04_MASTER_FILE_MIGRATION_REPORT](../../Brain%20Outputs/understanding/frontend/migration/04_MASTER_FILE_MIGRATION_REPORT.md)
- [migration/05_SKILL_PROTOCOL_UPDATE_REPORT](../../Brain%20Outputs/understanding/frontend/migration/05_SKILL_PROTOCOL_UPDATE_REPORT.md)
- [migration/06_OBSIDIAN_LINK_REPORT](../../Brain%20Outputs/understanding/frontend/migration/06_OBSIDIAN_LINK_REPORT.md)

## Legacy / Pre-canonicalization — DO NOT USE AS ACTIVE SOURCE

The links below are preserved for archival provenance. New writes go ONLY into the canonical `Brain Outputs\understanding\frontend\` tree. These references existed in this index before the 2026-05-13 canonical-path migration and are kept here so audit trails resolve.

### Parallel-agent raw outputs (archival)

The `parallel-agents\` subtree under the legacy `component-registry` is intentionally NOT mirrored into Obsidian — it is process-provenance and was rolled up into the canonical narrative + theme + architecture files.

- `outputs/component-registry/parallel-agents/agent-01-forms/` — 22 form/input components × 6 files
- `outputs/component-registry/parallel-agents/agent-02-data/` — 10 data/table/status components × 6 files
- `outputs/component-registry/parallel-agents/agent-03-layout-navigation/` — 15 layout/overlay components × 6 files
- `outputs/component-registry/parallel-agents/agent-04-workflow/` — 14 workflow/legacy components × 6 files
- `outputs/component-registry/parallel-agents/agent-05-theme-tailwind-tokens/` — 14 theme/token audit docs (11 knowledge docs migrated to `theme/`)
- `outputs/component-registry/parallel-agents/agent-06-frontend-architecture-usage/` — 16 architecture/usage docs (13 knowledge docs migrated to `architecture/`)

### Legacy frontend-knowledge paths (do not author here)

- `C:\Falcon\Brain Outputs\component-registry`
- `C:\Falcon\Brain Outputs\frontend-understanding`
- `C:\Falcon\Brain SK\outputs\component-registry`
- `C:\Falcon\Brain SK\outputs\frontend-understanding`

## Global Frontend Patterns

> Promoted page patterns only — promotion requires Ammar to say `promote this globally`. See [page-learning SKILL.md](../domains/frontend/page-learning/SKILL.md) and [APPROVAL_LEARNING_GATE.md](../protocols/APPROVAL_LEARNING_GATE.md).

- [patterns README](../../Brain%20Outputs/understanding/frontend/patterns/README.md)
- [TABLE_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/TABLE_PATTERN.md) — _seed; pending promotion candidates inbound from `organization-hierarchy / PP-001`_
- [TABS_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/TABS_PATTERN.md) — seed
- [FORM_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/FORM_PATTERN.md) — seed
- [BUTTON_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/BUTTON_PATTERN.md) — seed
- [POPUP_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/POPUP_PATTERN.md) — seed
- [VALIDATION_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/VALIDATION_PATTERN.md) — seed
- [API_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/API_PATTERN.md) — seed
- [PAGE_SECTION_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/PAGE_SECTION_PATTERN.md) — seed
- [FALCON_COMPONENT_CUSTOMIZATION_PATTERN](../../Brain%20Outputs/understanding/frontend/patterns/FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md) — seed (carries the canonical customization order)

## Page Learning System (2026-05-15)

Two-mode learning (Light + Deep) keyed per page under `Brain Outputs/understanding/pages/<page>/`. Skill: [page-learning](../domains/frontend/page-learning/SKILL.md). Per-page index: [[PAGE_KNOWLEDGE_INDEX]].
