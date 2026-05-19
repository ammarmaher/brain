# PR Review Index

> Obsidian graph node for all Brain SK pull-request reviews.
> Source of truth = `Brain Outputs/reports/pr-reviews/`. This note holds links + minimal context only.
> Canonical skill: `skills/pr-review-governance/SKILL.md`.

## About

Every PR reviewed with the **PR Review Governance Skill** gets a dated folder under
`Brain Outputs/reports/pr-reviews/<PR-or-branch-name>-<YYYY-MM-DD>/` containing six
documents (report · findings · checklist · risk matrix · required fixes · approval
decision). Each review is registered here and linked into the knowledge graph.

## Reviews

| Date | PR / branch | Target | Domains | Decision | Report folder |
|---|---|---|---|---|---|
| 2026-05-19 | PR #41631 — `final_template_management_feature` | `main` | Frontend (Angular/Nx) | `REQUEST_CHANGES` | `outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/` |

> Add one row per review. After a review, link it below to: affected page ·
> affected components · affected API/DTO · related gaps · related PRD/wiki docs ·
> approval decision.

## Reviews — link blocks

### PR #41631 `final_template_management_feature` — 2026-05-19
- Decision: `REQUEST_CHANGES` (0 P0 · 1 P1 · 3 P2 · 2 P3)
- Repository: `falcon-web-platform-ui` (legacy clone `C:\Falcon\Falcon\falcon-web-platform-ui`)
- Scope: 77 files, +5860 / −21 — Template Management feature + checker-level assignment
- Affected page(s): [[Template Management]] (new) · [[User Profile]] / Add User wizard
- Affected component(s): new `falcon-checker-section` · modified `falcon-multiselect` · feature components `body-type-section`, `body-type-view`, `channel-tabs`, `checker-level-picker`, `unrestricted-banner`, `checker-level-rows`, `template-config-editor`
- Affected API/DTO: Core Templates gateway (`baseURLCoreTemplatesGateway`) · `template-management-api.service` · `checker-assignment-api.service` · DTOs `checker-assignment.models.ts`, `templates-base.ts`
- Related gaps: Atlas Wave 4 — "Templates CRUD missing"; new gap candidate — no `understanding/backend/` for Core Templates service
- Related PRD / wiki: Template Management PRD NOT located (finding F4) · PES Subject Contract (`falcon-wiki/00-MOCs/PES-Subject-Contract.md`) — referenced for F3
- Top blocker: F1/R1 — Template Management shared layer duplicated verbatim across `admin-console` + `management-console`
- Report: [PR_REVIEW_REPORT.md](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_REPORT.md) · [Findings](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_FINDINGS.md) · [Checklist](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_CHECKLIST.md) · [Risk Matrix](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_RISK_MATRIX.md) · [Required Fixes](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_REQUIRED_FIXES.md) · [Approval Decision](../outputs/reports/pr-reviews/final_template_management_feature-2026-05-19/PR_REVIEW_APPROVAL_DECISION.md)

## Per-review link template

When a review is added, append a block like:

```text
### <PR-or-branch> — <YYYY-MM-DD>
- Decision: <APPROVE / ... >
- Affected page(s): [[<Page>]]
- Affected component(s): [[<Component>]]
- Affected API/DTO: <service> / <DTO>
- Related gaps: <GAP- id(s)>
- Related PRD / wiki: <doc links>
- Report: Brain Outputs/reports/pr-reviews/<folder>/PR_REVIEW_REPORT.md
```

## Related indexes

- [[GAPS_INDEX]] — gaps surfaced by reviews
- [[PAGE_LEARNING_INDEX]] — page behavior truth
- [[COMPONENT_INDEX]] — Falcon component truth
- [[API_INDEX]] — API / DTO contract truth
- [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[PRD_INDEX]]
