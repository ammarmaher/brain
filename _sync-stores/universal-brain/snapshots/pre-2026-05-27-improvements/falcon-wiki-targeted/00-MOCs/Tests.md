---
type: moc
role: cluster-index
cluster: tests
updated: 2026-05-14
---

> [!tldr]
> One file per Gherkin scenario. Each test declares the page or component it covers and the on-disk path to the .feature file. Coverage rolls up to each page's and component's `knowledge.test-coverage` score.

# Tests

## All tests

```dataview
TABLE WITHOUT ID
  file.link as "Test",
  page as "Page",
  component as "Component",
  status as "Status"
FROM "90-Tests"
WHERE type = "test"
SORT file.name ASC
```

## Tests per page

```dataviewjs
const tests = dv.pages('"90-Tests"').where(p => p.type === "test");
const pages = dv.pages('"20-Pages"').where(p => p.type === "page");
const rows = pages.map(p => {
  const linked = tests.where(t => t.page && t.page.path === p.file.path).length;
  return [p.file.link, linked];
}).array().sort((a, b) => a[1] - b[1]);
dv.table(["Page", "# tests"], rows);
```

## Tests per component

```dataviewjs
const tests = dv.pages('"90-Tests"').where(p => p.type === "test");
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
const rows = comps.map(c => {
  const linked = tests.where(t => t.component && t.component.path === c.file.path).length;
  return [c.file.link, linked];
}).array().sort((a, b) => a[1] - b[1]);
dv.table(["Component", "# tests"], rows);
```
