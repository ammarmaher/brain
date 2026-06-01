---
type: moc
role: hygiene
updated: 2026-05-14
---

> [!tldr]
> Frontmatter relations pointing to files that don't exist. Either create the missing note or remove the broken reference. Dead links break Dataview rollups and confuse AI agents.

# Dead Links

## Notes with broken outgoing wikilinks

```dataviewjs
const notes = dv.pages().where(p => !p.file.path.startsWith("_mounts/") && !p.file.path.startsWith("_templates/"));
const dead = [];
for (const p of notes) {
  for (const link of (p.file.outlinks ?? [])) {
    const target = dv.page(link.path);
    if (!target) dead.push([p.file.link, link.path]);
  }
}
dv.table(["From", "Broken link to"], dead);
```

## Notes whose typed relations point to missing files

```dataviewjs
const relFields = ["prd", "service", "page", "component", "components", "tokens", "endpoints", "tests", "gaps", "questions", "prd-reference"];
const notes = dv.pages().where(p => !p.file.path.startsWith("_mounts/") && !p.file.path.startsWith("_templates/"));
const dead = [];
for (const p of notes) {
  for (const f of relFields) {
    const v = p[f];
    if (!v) continue;
    const arr = Array.isArray(v) ? v : [v];
    for (const link of arr) {
      if (!link?.path) continue;
      if (!dv.page(link.path)) dead.push([p.file.link, f, link.path]);
    }
  }
}
dv.table(["From", "Field", "Missing target"], dead);
```
