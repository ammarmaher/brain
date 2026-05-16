# Chart Types — Catalog & Selection Rules

This catalog is the **single source of truth** for which chart type Ammar Brain renders for which data shape. Report writers MUST pick from this list and MUST NOT invent new chart types ad-hoc.

## Selection rules (decision table)

| Data shape | Chart |
|---|---|
| 1 headline number + delta | Scorecard |
| 4–12 KPIs in one block | Metric grid |
| Categorical comparison, ≤ 20 categories | Bar chart |
| Composition of a whole, ≤ 7 slices | Donut / Pie |
| Composition of a whole, > 7 slices | Stacked bar (variant of bar) |
| Severity-classified findings (HIGH / MEDIUM / LOW) | Gap severity chart |
| % complete per module/area | Readiness percentage |
| Side-by-side module scores across N criteria | Module comparison table |
| Capability mapped on 2 axes (impact × confidence) | Implementation confidence matrix |
| Inline % inside a table row | Progress bar |
| Numeric distribution (min/max/avg/p95) | Statistics table |

If none of the above fit, **stop** and ask Ammar — do not invent.

## 1. Bar chart

**Use:** comparing values across discrete categories.

**Data shape:**

```json
{
  "chart": "bar",
  "title": "Components scanned per area",
  "data": [
    { "label": "Buttons", "value": 27 },
    { "label": "Inputs",  "value": 19 },
    { "label": "Tables",  "value": 14 }
  ],
  "options": { "palette": "falcon-default", "sortBy": "value-desc", "showValues": true }
}
```

**Rules:** sort by value descending unless time-ordered; cap at 20 bars; truncate label > 24 chars.

## 2. Donut / Pie

**Use:** showing share of a single total. Donut preferred (hole improves label legibility).

**Data shape:** same as bar with `value` summing to a meaningful total. Limit to **7 slices**; bucket the rest into `Other`.

**Rules:** never used for time series; never used when slices are < 5%.

## 3. Scorecard

**Use:** one headline metric.

**Data shape:**

```json
{
  "chart": "scorecard",
  "title": "Frontend coverage",
  "data": {
    "value": 87.4,
    "unit": "%",
    "delta": "+2.1pp",
    "trend": "up",
    "footnote": "vs last week"
  }
}
```

**Rules:** always show unit; always show delta when prior value is known; trend ∈ `up | flat | down`.

## 4. Metric grid

**Use:** 4–12 KPIs in one block.

**Data shape:**

```json
{
  "chart": "metric-grid",
  "title": "Bootstrap readiness",
  "data": [
    { "label": "Repos OK",    "value": "6/6",  "trend": "flat" },
    { "label": "Tools OK",    "value": "5/5",  "trend": "up" },
    { "label": "Wiki sync",   "value": "OK",   "trend": "flat" },
    { "label": "Obsidian",    "value": "OK",   "trend": "up" },
    { "label": "Dirty repos", "value": "1",    "trend": "down" }
  ]
}
```

**Rules:** 2–4 columns; never exceed 12 cells; mixed numeric + string allowed.

## 5. Gap severity chart

**Use:** distribution of findings by severity. Always HIGH → MEDIUM → LOW order.

**Data shape:**

```json
{
  "chart": "gap-severity",
  "title": "Gap audit — May 2026",
  "data": {
    "HIGH":   { "count": 4, "blocks": true,  "examples": ["GP-014", "GP-021"] },
    "MEDIUM": { "count": 9, "blocks": false, "examples": ["GP-008"] },
    "LOW":    { "count": 17, "blocks": false }
  }
}
```

**Rules:** HIGH first; HIGH-blocks flag must be visible; total = HIGH + MEDIUM + LOW shown in caption.

## 6. Readiness percentage chart

**Use:** % complete per module / area / phase.

**Data shape:**

```json
{
  "chart": "readiness",
  "title": "Module readiness",
  "data": [
    { "label": "Account Management",  "value": 92.0 },
    { "label": "Charging",            "value": 74.5 },
    { "label": "Provisioning",        "value": 61.0 },
    { "label": "Auth",                "value": 88.0 }
  ],
  "options": { "max": 100, "unit": "%", "palette": "readiness" }
}
```

**Rules:** value clamped to [0, 100]; readiness palette steps at 25 / 50 / 75 / 90.

## 7. Module comparison table

**Use:** side-by-side module scoring across N criteria.

**Data shape:**

```json
{
  "chart": "module-comparison",
  "title": "Module health",
  "data": {
    "columns": ["PRD", "Backend", "Frontend", "Tests"],
    "rows": [
      { "module": "Account Management", "scores": [95, 88, 92, 70] },
      { "module": "Charging",           "scores": [80, 74, 61, 55] },
      { "module": "Provisioning",       "scores": [70, 61, 50, 40] }
    ]
  },
  "options": { "heatmap": true, "palette": "readiness" }
}
```

**Rules:** when `heatmap: true`, each cell gets a readiness-palette background.

## 8. Implementation confidence matrix

**Use:** 2-axis map — impact (Y) × confidence (X).

**Data shape:**

```json
{
  "chart": "confidence-matrix",
  "title": "Capability confidence",
  "data": [
    { "id": "CMP-001", "label": "<falcon-button>",    "impact": 5, "confidence": 5 },
    { "id": "CMP-014", "label": "<falcon-data-grid>", "impact": 5, "confidence": 2 },
    { "id": "CMP-022", "label": "<falcon-toast>",     "impact": 2, "confidence": 4 }
  ],
  "options": { "palette": "confidence" }
}
```

**Rules:** both axes 1–5; quadrant labels printed (`Quick wins`, `Strategic bets`, `Reconsider`, `Maintain`).

## 9. Progress bar (inline)

**Use:** % inside a table row.

**Data shape:** `{ "chart": "progress-bar", "data": { "value": 64.0, "max": 100 } }`

**Rules:** rendered as 20-char Unicode bar in Markdown; SVG when in PDF.

## 10. Statistics table

**Use:** raw numeric distribution.

**Data shape:**

```json
{
  "chart": "stats-table",
  "title": "Scan duration (ms)",
  "data": {
    "rows": [
      { "label": "Buttons", "min": 12, "max": 240, "avg": 88, "p95": 210, "n": 27 }
    ]
  }
}
```

**Rules:** always include `n` (sample size); round to integer except %.

## Anti-patterns (forbidden)

- 3D charts
- Truncated Y-axis on bar charts (must start at 0)
- Pie charts with > 7 slices
- Color-only severity (must also use label or icon)
- Charts without a `Source:` caption
- Charts inside `C:\Falcon\Brain SK\` outputs (must go to `Brain Outputs`)
