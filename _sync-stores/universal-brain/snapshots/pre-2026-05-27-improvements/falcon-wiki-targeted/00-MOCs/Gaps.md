---
type: moc
role: cluster-index
cluster: gaps
updated: 2026-05-14
---

> [!tldr]
> Every PRD ↔ implementation gap is one note here. Gaps act as **bridge notes** — they link a page, a component, and a PRD section, making them the highest-information nodes in the graph.

# Gaps

## Open gaps by severity

```dataview
TABLE WITHOUT ID
  file.link as "Gap",
  severity as "Severity",
  page as "Page",
  component as "Component",
  status as "Status"
FROM "70-Gaps"
WHERE type = "gap" AND status != "closed"
SORT severity ASC, file.name ASC
```

## Closed gaps (audit trail)

```dataview
TABLE WITHOUT ID file.link as "Gap", page, closed-at as "Closed"
FROM "70-Gaps"
WHERE type = "gap" AND status = "closed"
SORT closed-at DESC
LIMIT 20
```

## Pages with the most open gaps

```dataviewjs
const gaps = dv.pages('"70-Gaps"').where(p => p.type === "gap" && p.status !== "closed");
const byPage = {};
for (const g of gaps) {
  const k = g.page ? g.page.path : "(unscoped)";
  byPage[k] = (byPage[k] || 0) + 1;
}
const rows = Object.entries(byPage)
  .map(([path, n]) => [dv.fileLink(path), n])
  .sort((a, b) => b[1] - a[1]);
dv.table(["Page", "Open gaps"], rows);
```
