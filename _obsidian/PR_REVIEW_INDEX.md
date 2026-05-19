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
| _none yet_ | — | — | — | — | — |

> Add one row per review. After a review, link it below to: affected page ·
> affected components · affected API/DTO · related gaps · related PRD/wiki docs ·
> approval decision.

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
