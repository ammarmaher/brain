# Template — Readiness Percentage

## Markdown

```markdown
**{{title}}**

| Area | Readiness | Bar |
|---|---:|---|
{{#data}}
| {{label}} | **{{value}}%** | `{{bar20}}` |
{{/data}}

_Source: {{source}}_
```

`bar20` = 20-char Unicode bar built from `█` (filled) and `░` (empty). Filled count = `round(value/5)`.

Example for `74.5%`: `███████████████░░░░░`

## Mermaid

```mermaid
xychart-beta horizontal
  title "{{title}}"
  x-axis "Readiness %" 0 --> 100
  y-axis [{{#data}}"{{label}}"{{^last}}, {{/last}}{{/data}}]
  bar [{{#data}}{{value}}{{^last}}, {{/last}}{{/data}}]
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 {{height}}" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <!-- {{#data}}
  one row per area: label left, bar middle (fill from readiness palette), value % right
  {{/data}} -->
  <text x="24" y="{{footerY}}" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Palette mapping (readiness)

| Value range | Fill |
|---|---|
| 0–24%   | `#EF4444` |
| 25–49%  | `#F59E0B` |
| 50–74%  | `#84CC16` |
| 75–89%  | `#22C55E` |
| 90–100% | `#059669` |

## Rules

- `value` clamped to `[0, 100]`. Out-of-range → reject.
- Always one decimal precision when value < 100.
- A "remaining" remainder row may be appended to make the chart sum to 100 when reporting overall completion.
