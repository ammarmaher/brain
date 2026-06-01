---
type: moc
role: dashboard
audience: humans+ai
updated: 2026-05-14
---

> [!tldr]
> Live system-wide knowledge dashboard. Each note's knowledge dimensions (PRD coverage, UX parity, code confidence, test coverage) roll up here. Sort by the weakest first to know what to fix.

# Knowledge Health

## System-wide average (computed)

```dataviewjs
const types = ["page", "component", "prd", "gap", "test", "service", "endpoint", "token"];
const all = dv.pages().where(p => types.includes(p.type));
let totalScore = 0, n = 0;
for (const p of all) {
  const k = p.knowledge ?? {};
  const dims = ["prd-coverage", "ux-parity", "code-confidence", "test-coverage"].map(d => k[d]).filter(v => typeof v === "number");
  if (dims.length === 0) continue;
  const avg = dims.reduce((a, b) => a + b, 0) / dims.length;
  totalScore += avg;
  n++;
}
const sysAvg = n === 0 ? "—" : (totalScore / n).toFixed(1);
const color = sysAvg === "—" ? "⚪" : sysAvg >= 80 ? "🟢" : sysAvg >= 50 ? "🟡" : "🔴";
dv.paragraph(`${color} **System average: ${sysAvg}%** across ${n} scored notes`);
```

## Pages — weakest first

```dataview
TABLE WITHOUT ID
  file.link as "Page",
  knowledge.prd-coverage as "PRD %",
  knowledge.ux-parity as "UX %",
  knowledge.code-confidence as "Code %",
  knowledge.test-coverage as "Test %",
  verified-at as "Verified"
FROM "20-Pages"
WHERE type = "page"
SORT (knowledge.prd-coverage + knowledge.ux-parity + knowledge.code-confidence + knowledge.test-coverage) ASC
```

## Components — weakest first

```dataview
TABLE WITHOUT ID
  file.link as "Component",
  knowledge.prd-coverage as "PRD %",
  knowledge.ux-parity as "UX %",
  knowledge.code-confidence as "Code %",
  knowledge.test-coverage as "Test %",
  verified-at as "Verified"
FROM "30-Components"
WHERE type = "component"
SORT (knowledge.prd-coverage + knowledge.ux-parity + knowledge.code-confidence + knowledge.test-coverage) ASC
```

## Decaying notes (verified > 90 days ago)

```dataview
TABLE WITHOUT ID
  file.link as "Note",
  type as "Type",
  verified-at as "Last verified",
  verified-by as "By"
FROM "20-Pages" OR "30-Components" OR "10-PRD" OR "50-Services"
WHERE verified-at AND (date(today) - date(verified-at)).days > 90
SORT verified-at ASC
```

## Distribution by knowledge band

```dataviewjs
const all = dv.pages().where(p => ["page","component","prd","service"].includes(p.type) && p.knowledge);
const bands = { high: 0, medium: 0, low: 0, unscored: 0 };
for (const p of all) {
  const k = p.knowledge ?? {};
  const dims = ["prd-coverage","ux-parity","code-confidence","test-coverage"].map(d => k[d]).filter(v => typeof v === "number");
  if (dims.length === 0) { bands.unscored++; continue; }
  const avg = dims.reduce((a, b) => a + b, 0) / dims.length;
  if (avg >= 80) bands.high++;
  else if (avg >= 50) bands.medium++;
  else bands.low++;
}
dv.table(["Band", "Count"], [
  ["🟢 high (≥80)", bands.high],
  ["🟡 medium (50-79)", bands.medium],
  ["🔴 low (<50)", bands.low],
  ["⚪ unscored", bands.unscored]
]);
```
