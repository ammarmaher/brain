---
type: moc
role: cluster-index
cluster: business-rules
updated: 2026-05-14
---

> [!tldr]
> Projection cluster for business rules per page. Each page's `BUSINESS_RULES.md` from Brain Outputs is transcluded inside the page projection.

# Business Rules

## All pages with business rules

```dataview
TABLE WITHOUT ID
  file.link as "Page",
  projection-source as "Canonical source"
FROM "20-Pages"
WHERE type = "page"
SORT file.name ASC
```

## Authoring
- Skill: `_mounts/brain-sk/skills/business-understanding/SKILL.md`
- Output: `_mounts/brain-outputs/understanding/pages/<page>/BUSINESS_RULES.md`
- Trigger: `analyze business rules for <page>` or `Analyze this PRD` (skill autoresolves)

## Cross-references
Business rules cite:
- PRD requirements (`10-PRD/`)
- Validation rules (`65-Validation-Rules/`)
- PES gates (`66-PES-Rules/`)
- API contracts (Brain Outputs backend understanding)
