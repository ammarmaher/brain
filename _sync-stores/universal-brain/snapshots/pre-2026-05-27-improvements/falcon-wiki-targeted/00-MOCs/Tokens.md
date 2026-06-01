---
type: moc
role: cluster-index
cluster: tokens
updated: 2026-05-14
---

> [!tldr]
> One file per design token family (color, radius, spacing, typography, motion). Components reference tokens via `tokens:` frontmatter; tokens never reference components — the reverse list is computed.

# Tokens

## All tokens

```dataview
TABLE WITHOUT ID
  file.link as "Token",
  family as "Family",
  scope as "Scope"
FROM "40-Tokens"
WHERE type = "token"
SORT family ASC
```

## Components consuming each token

```dataviewjs
const tokens = dv.pages('"40-Tokens"').where(p => p.type === "token");
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
const rows = tokens.map(t => {
  const linked = comps.where(c => (c.tokens ?? []).some(x => x.path === t.file.path)).map(c => c.file.link).array();
  return [t.file.link, linked.length === 0 ? "—" : linked.join(", ")];
}).array();
dv.table(["Token", "Used by components"], rows);
```
