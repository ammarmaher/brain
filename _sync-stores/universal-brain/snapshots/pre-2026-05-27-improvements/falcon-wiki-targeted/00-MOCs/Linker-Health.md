---
type: moc
role: dashboard
audience: humans+ai
updated: 2026-05-14
---

> [!tldr]
> Live density of the auto-linker autopilot. Shows orphan rate, edges per cluster, and which projections haven't been auto-linked yet. Run `auto-link.ps1` to refresh.

# Linker Health

## How the autopilot works (four tiers, zero orphans by construction)

1. **`scan-brain-outputs.ps1`** emits thin projection notes from Brain Outputs.
2. **`auto-link.ps1`** runs four linking tiers in order. Each tier adds different relations; together they guarantee every node has at least one edge.

| Tier | Field written | When applied | What it does |
|---|---|---|---|
| **A — textual mention** | `auto-related-components`, `auto-prds`, `auto-pages` | always | greps each note's canonical Brain Outputs files for other entity slugs + aliases |
| **C — family siblings** | `auto-family-siblings` | always (cohort clustering) | links each component to 2 others in its family (table / input / picker / dialog / wizard / select / toggle / menu / drawer / tree / visual / feedback / container / identity-input / utility / misc) |
| **D — co-presence** | `auto-co-present` | when Tier A has <2 edges | links to top-2 components most frequently co-used on the same page (parsed from each page's `COMPONENT_MAPPING.md`) |
| **E — cluster fallback** | `auto-cluster` | last resort — when A+C+D all empty | links to the cluster MOC (`[[Components]]`, `[[Pages]]`, `[[PRDs]]`) |

3. **Obsidian's graph view** picks up `[[]]` links from all four tiers and draws the edges.

**Refresh cadence:** rerun after every Brain Outputs change.

## Zero-orphan verification

```dataviewjs
const types = { component: '30-Components', page: '20-Pages', prd: '10-PRD' };
const totals = { component: 0, page: 0, prd: 0 };
const orphans = { component: [], page: [], prd: [] };
for (const [t, folder] of Object.entries(types)) {
  const notes = dv.pages(`"${folder}"`);
  for (const n of notes) {
    totals[t]++;
    const edges = (n["auto-related-components"]?.length ?? 0)
      + (n["auto-family-siblings"]?.length ?? 0)
      + (n["auto-co-present"]?.length ?? 0)
      + (n["auto-cluster"]?.length ?? 0)
      + (n["auto-prds"]?.length ?? 0)
      + (n["auto-pages"]?.length ?? 0);
    if (edges === 0) orphans[t].push(n.file.link);
  }
}
dv.table(["Cluster", "Total notes", "Orphans"],
  Object.keys(types).map(t => [t, totals[t], orphans[t].length === 0 ? "✅ 0" : `❌ ${orphans[t].length}`]));
```

## Tier coverage per component

```dataviewjs
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
let A = 0, C = 0, D = 0, E = 0;
for (const c of comps) {
  if ((c["auto-related-components"]?.length ?? 0) > 0) A++;
  if ((c["auto-family-siblings"]?.length ?? 0) > 0) C++;
  if ((c["auto-co-present"]?.length ?? 0) > 0) D++;
  if ((c["auto-cluster"]?.length ?? 0) > 0) E++;
}
dv.table(["Tier", "Coverage"], [
  ["A — textual mention", `${A}/${comps.length}`],
  ["C — family siblings", `${C}/${comps.length}`],
  ["D — co-presence", `${D}/${comps.length}`],
  ["E — MOC fallback", `${E}/${comps.length}`]
]);
```

## Most-linked components (hubs of the graph)

```dataviewjs
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
const rows = comps.map(c => {
  const n = (c["auto-related-components"] ?? []).length;
  return [c.file.link, n];
}).array().filter(r => r[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 20);
dv.table(["Component", "Outbound edges"], rows);
```

## Components reverse-referenced most often (graph hubs by inbound edges)

```dataviewjs
const comps = dv.pages('"30-Components"').where(p => p.type === "component");
const counts = {};
for (const c of comps) {
  for (const link of (c["auto-related-components"] ?? [])) {
    if (link?.path) counts[link.path] = (counts[link.path] || 0) + 1;
  }
}
const rows = Object.entries(counts)
  .map(([path, n]) => [dv.fileLink(path), n])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);
dv.table(["Component", "Inbound edges"], rows);
```

## PRD ↔ Page coverage

```dataview
TABLE WITHOUT ID
  file.link as "PRD",
  length(auto-pages) as "Linked pages"
FROM "10-PRD"
SORT length(auto-pages) DESC
```

## Page → component density (most-composed pages)

```dataview
TABLE WITHOUT ID
  file.link as "Page",
  length(auto-related-components) as "Linked components"
FROM "20-Pages"
SORT length(auto-related-components) DESC
```

## Refresh

```powershell
powershell -ExecutionPolicy Bypass -File C:\Falcon\falcon-wiki\auto-link.ps1
```

## When orphans persist after running auto-link

A projection stays an orphan when its canonical Brain Outputs files don't textually mention any other registered entity (component / page / PRD). Two ways to fix:

1. **Add aliases** — extend `auto-link.ps1` alias table for that entity (e.g. give `falcon-multi-select` the alias "multiselect").
2. **Author the dossier** — if the Brain Outputs file is empty or stub-only, invoke the relevant Brain SK skill (`component-capability-upgrade` for a component, `business-understanding` for a PRD) so the canonical content grows enough that other entities are referenced.
