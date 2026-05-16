# Schema — Input contract per chart type

All callers send a single JSON envelope:

```json
{
  "chart":   "<chart-type>",
  "title":   "<string>",
  "subtitle":"<string?>",
  "data":    "<chart-specific>",
  "options": "<chart-specific?>",
  "outputs": ["markdown" | "mermaid" | "svg"],
  "reportId":"<YYYY-MM-DD-HHmm>-<report-name>",
  "chartId": "<kebab-case-id>",
  "source":  "<provenance string for the Source: caption>"
}
```

`reportId`, `chartId`, and `source` are mandatory. Charts with no source are rejected.

## Per-chart data shapes

### bar

```ts
data: Array<{ label: string; value: number; color?: string }>
options: { palette?: string; sortBy?: "value-desc" | "value-asc" | "label" | "input"; showValues?: boolean }
```

### donut / pie

```ts
data: Array<{ label: string; value: number }>   // ≤ 7 slices (bucket rest into "Other")
options: { palette?: string; showLegend?: boolean; hole?: number /* 0..1 */ }
```

### scorecard

```ts
data: {
  value: number | string;
  unit?: string;
  delta?: string;
  trend?: "up" | "flat" | "down";
  footnote?: string;
}
```

### metric-grid

```ts
data: Array<{ label: string; value: number | string; trend?: "up" | "flat" | "down" }>
options: { columns?: 2 | 3 | 4 }
```

### gap-severity

```ts
data: {
  HIGH:   { count: number; blocks?: boolean; examples?: string[] };
  MEDIUM: { count: number; blocks?: boolean; examples?: string[] };
  LOW:    { count: number; blocks?: boolean; examples?: string[] };
  INFO?:  { count: number; examples?: string[] };
}
```

### readiness

```ts
data: Array<{ label: string; value: number /* 0..100 */ }>
options: { max?: 100; unit?: "%"; palette?: "readiness" }
```

### module-comparison

```ts
data: {
  columns: string[];
  rows: Array<{ module: string; scores: number[] /* same length as columns */ }>;
}
options: { heatmap?: boolean; palette?: string }
```

### confidence-matrix

```ts
data: Array<{
  id: string;
  label: string;
  impact: 1 | 2 | 3 | 4 | 5;
  confidence: 1 | 2 | 3 | 4 | 5;
}>
options: { palette?: "confidence" }
```

### progress-bar

```ts
data: { value: number; max: number; label?: string }
```

### stats-table

```ts
data: {
  rows: Array<{
    label: string;
    min: number; max: number; avg: number;
    p95?: number; p99?: number; n: number;
  }>;
}
```

## Validation

A request is rejected if any of these are true:

- `chart` is not in the allowed enum
- `data` does not match the per-chart shape
- `reportId`, `chartId`, or `source` is missing
- `palette` references an unregistered token (see `PALETTES.md`)
- numeric percentage chart has a value outside `[0, 100]`
- pie/donut has more than 7 slices
- any color is given as a raw hex literal

On rejection, the skill returns `{ "error": "<reason>" }` and writes nothing.
