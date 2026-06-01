---
type: moc
role: hygiene
updated: 2026-05-14
---

> [!tldr]
> Notes with zero incoming and zero outgoing links. Either link them into the graph, or delete them. Orphans are dead weight in retrieval and dilute the graph view.

# Orphans

## Orphaned notes

```dataviewjs
const skip = ["_INDEX", "Glossary", "Conventions"]; // root entries are not real orphans
const notes = dv.pages().where(p => 
  !p.file.path.startsWith("_mounts/") &&
  !p.file.path.startsWith("_templates/") &&
  !p.file.path.startsWith("_macros/") &&
  !p.file.path.startsWith("_attachments/") &&
  !p.file.path.startsWith(".obsidian/") &&
  !p.file.path.startsWith("Home/") &&
  !skip.includes(p.file.name)
);
const orphans = notes.where(p => 
  (p.file.inlinks?.length ?? 0) === 0 && 
  (p.file.outlinks?.length ?? 0) === 0
);
dv.table(["File", "Type"], orphans.map(p => [p.file.link, p.type ?? "(no type)"]).array());
```

## How to fix

- If the note belongs in a cluster, add the matching frontmatter and at least one `[[]]` link to a related note.
- If the note is obsolete, set `status: archived` instead of deleting (preserves backlinks for history).
- If the note is a draft you'll get to later, add `status: draft` and link it from the relevant MOC's "Drafts" section.
