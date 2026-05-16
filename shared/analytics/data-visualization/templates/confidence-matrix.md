# Template — Implementation Confidence Matrix

5 × 5 grid. X-axis: confidence (1=Low → 5=High). Y-axis: impact (1=Low → 5=High).

## Quadrant labels (printed)

| Quadrant | Range | Label |
|---|---|---|
| Top-right    | impact ≥ 4, confidence ≥ 4 | **Maintain** |
| Top-left     | impact ≥ 4, confidence ≤ 2 | **Strategic bets** |
| Bottom-right | impact ≤ 2, confidence ≥ 4 | **Quick wins** |
| Bottom-left  | impact ≤ 2, confidence ≤ 2 | **Reconsider** |

## Markdown (compact list view)

```markdown
**{{title}}**

| Item | Impact | Confidence | Quadrant |
|---|:---:|:---:|---|
{{#data}}
| {{label}} (`{{id}}`) | {{impact}} | {{confidence}} | {{quadrant}} |
{{/data}}

_Source: {{source}}_
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <!-- background cells: 5x5 grid, fill from confidence palette steps -->
  <!-- axis labels: "Impact" left (rotated), "Confidence" bottom -->
  <!-- {{#data}}
  one labeled dot per item, positioned at (confidence, impact) cell center
  {{/data}} -->
  <!-- quadrant labels printed in corner of each quadrant -->
  <text x="24" y="468" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Rules

- Both axes are clamped 1–5 integers.
- Identical (impact, confidence) coords from multiple items render as small jittered dots (deterministic jitter from `id` hash).
- Use `confidence` palette for cell backgrounds.
