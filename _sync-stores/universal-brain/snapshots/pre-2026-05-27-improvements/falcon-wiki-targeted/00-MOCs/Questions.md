---
type: moc
role: cluster-index
cluster: questions
updated: 2026-05-14
---

> [!tldr]
> Open product / engineering questions, one note each. Each question carries the page or component it relates to, the asker, and the proposed answers. When answered, mark `status: answered` and link the resolving artifact.

# Questions

## Open questions

```dataview
TABLE WITHOUT ID
  file.link as "Question",
  page as "Page",
  component as "Component",
  asked-by as "Asker",
  asked-at as "Asked"
FROM "80-Questions"
WHERE type = "question" AND status = "open"
SORT asked-at ASC
```

## Stale questions (open > 30 days)

```dataview
TABLE WITHOUT ID file.link as "Question", asked-by, asked-at
FROM "80-Questions"
WHERE type = "question" AND status = "open" AND (date(today) - date(asked-at)).days > 30
SORT asked-at ASC
```

## Recently answered

```dataview
TABLE WITHOUT ID file.link as "Question", answered-at as "Answered", answered-by as "By"
FROM "80-Questions"
WHERE type = "question" AND status = "answered"
SORT answered-at DESC
LIMIT 10
```
