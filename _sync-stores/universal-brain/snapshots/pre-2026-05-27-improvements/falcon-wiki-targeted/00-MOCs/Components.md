---
type: moc
role: cluster-index
cluster: components
updated: 2026-05-14
---

> [!tldr]
> Index of every Falcon-* component in the design system. Each component declares its tokens, variants, tests, and visual reference. Reverse "used-in" relations are computed from page declarations.

# Components

## All components

```dataview
TABLE WITHOUT ID
  file.link as "Component",
  kind as "Kind",
  status as "Status",
  length(variants) as "Variants",
  length(tokens) as "Tokens"
FROM "30-Components"
WHERE type = "component"
SORT file.name ASC
```

## Most-used components (by page count)

```dataviewjs
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
const pages = dv.pages('"20-Pages"').where(p => p.type === "page");
const rows = comps.map(c => {
  const usedCount = pages.where(p => (p.components ?? []).some(l => l.path === c.file.path)).length;
  return [c.file.link, usedCount];
}).array().sort((a, b) => b[1] - a[1]);
dv.table(["Component", "Used on # pages"], rows);
```

## Components with no test coverage

```dataview
TABLE WITHOUT ID file.link as "Component", knowledge.test-coverage as "Test %"
FROM "30-Components"
WHERE type = "component" AND (knowledge.test-coverage = null OR knowledge.test-coverage < 30)
SORT knowledge.test-coverage ASC
```

## Components needing re-verification

```dataview
TABLE WITHOUT ID file.link as "Component", verified-at
FROM "30-Components"
WHERE type = "component" AND (date(today) - date(verified-at)).days > 90
SORT verified-at ASC
```
