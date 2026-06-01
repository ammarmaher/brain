---
type: moc
role: cluster-index
cluster: prd
updated: 2026-05-14
---

> [!tldr]
> Index of every PRD section in the vault. Each PRD declares its module, version, and source (Drive URL). Pages reference PRDs by their note link; gaps reference specific PRD sections.

# PRDs

## All PRDs

```dataview
TABLE WITHOUT ID
  file.link as "PRD",
  module as "Module",
  version as "Version",
  source as "Source"
FROM "10-PRD"
WHERE type = "prd"
SORT module ASC, version DESC
```

## Pages implementing each PRD

```dataviewjs
const prds = dv.pages('"10-PRD"').where(p => p.type === "prd");
const pages = dv.pages('"20-Pages"').where(p => p.type === "page");
const rows = prds.map(prd => {
  const impls = pages.where(p => p.prd && p.prd.path === prd.file.path).map(p => p.file.link).array();
  return [prd.file.link, impls.length === 0 ? "—" : impls.join(", ")];
}).array();
dv.table(["PRD", "Implemented by"], rows);
```

## PRDs with open gaps

```dataviewjs
const prds = dv.pages('"10-PRD"').where(p => p.type === "prd");
const gaps = dv.pages('"70-Gaps"').where(p => p.type === "gap" && p.status !== "closed");
const rows = prds.map(prd => {
  const linked = gaps.where(g => g["prd-reference"] && g["prd-reference"].path === prd.file.path);
  return [prd.file.link, linked.length];
}).array().filter(r => r[1] > 0);
dv.table(["PRD", "Open gaps"], rows);
```
