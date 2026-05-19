# PR Review Findings — PR #41631 (`final_template_management_feature`)

> Reviewer: Brain SK · 2026-05-19 · Severity: P0 BLOCKER · P1 MAJOR · P2 MEDIUM · P3 MINOR.

## Findings detail

| # | Severity | File / location | Issue | Source rule (truth) | Required / recommended fix | Status |
|---|---|---|---|---|---|---|
| F1 | P1 | `apps/admin-console/src/app/features/template-management/**` + `apps/management-console/src/app/features/template-management/**` | Shared layer duplicated verbatim across two Nx apps — `template-management.models.ts` confirmed byte-identical; `template-management.mappers.ts`, `template-management-api.service.ts`, and sub-components (`body-type-section`, `body-type-view`, `channel-tabs`, `checker-level-picker`, `unrestricted-banner`) copied. | Architecture/structure governance — no duplicated logic; shared-vs-feature-local; Nx lib boundaries | Promote shared model/mapper/API/sub-component layer to `libs/falcon`; keep only app-specific shells | open — required |
| F2 | P2 | whole PR (51 added files, +5860 LOC) | Zero `*.spec.ts` test files added for a large new feature. | Quality gates — tests added/updated where needed | Add specs for `template-form.service`, mappers, `checker-assignment-api.service`, permissions/checker step | open — recommended |
| F3 | P2 | `host-shell/.../permissions-privilege-step/**`, `checker-level-rows/**`, `checker-assignment-api.service.ts`, `libs/falcon/.../falcon-access.registry.ts` | Checker-level / PES-adjacent changes reviewed at governance level only; not deep-validated vs PES Subject Contract or access-registry semantics. | Security/PES review | Dedicated PES pass — verify subject IDs `u:<ZitadelUserId>@<ns>`, `authorizeResources` keys, FE-before-BE fallback | open — recommended |
| F4 | P2 | Template Management feature (business layer) | No Template Management PRD/business spec located in `Brain Outputs/prd` or `understanding/`; business lifecycle / maker-checker rules only partially verifiable. | Business logic review — PRD flow followed | Supply/link the Template Management PRD (relates to Atlas Wave 4 gap "Templates CRUD missing") | open — recommended |
| F5 | P3 | `apps/host-shell/.../services/checker-assignment-api.service.ts` | `console.error('Failed to load checker assignments:', err)` in load catch. | Quality gates — no console noise | Acceptable as error logging; route through a logger if available | open — minor |
| F6 | P3 | 8 files importing `primeng/*` (template-management, `checker-level-rows`, `falcon-checker-section`) | New code adds PrimeNG surface. | Standing rule "No PrimeNG for new work" (v2 workspace) | NOT a violation in this repo (PrimeNG in `package.json`; 70 files on `main` use it). Migrate when repo adopts platform-wide removal. | noted — not blocking |

## Severity counts

| Severity | Count |
|---|---|
| P0 BLOCKER | 0 |
| P1 MAJOR | 1 |
| P2 MEDIUM | 3 |
| P3 MINOR | 2 |

## Conflicts / ambiguities

| Conflict | Sources in conflict | Safest recommended action |
|---|---|---|
| Repo identity | Brain SK memory describes v2 workspace `C:\Falcon\falcon-web-platform-ui` (no PrimeNG, Stencil `falcon-ui-core`, native UI banned). Repo under review is legacy `C:\Falcon\Falcon\falcon-web-platform-ui` (PrimeNG present, Angular Nx `shared-ui` libs, no `falcon-button`). | Reviewed against the repo's own conventions (codebase = SoT tier 2 > memory). PrimeNG/raw-button NOT flagged as violations here. Confirm with the architect which repo is canonical. |
| Core Templates backend contract | New `checker-assignment.models.ts` / `templates-base.ts` DTOs vs no `understanding/backend/` entry for a Core Templates service. | DTO ↔ backend contract left UNVERIFIED; recommend generating backend understanding for the Core Templates service before merge. |
| Template Management PRD | Feature implemented; no PRD found. | Business rules marked UNVERIFIED rather than assumed correct. |
