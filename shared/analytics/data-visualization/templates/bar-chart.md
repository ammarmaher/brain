# Template — Bar Chart

## Markdown (GFM)

```markdown
**{{title}}**

| Category | Value |
|---|---:|
{{#data}}
| {{label}} | {{value}}{{unit}} |
{{/data}}

_Source: {{source}}_
```

## Mermaid

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#1F6FEB"}}}%%
xychart-beta
  title "{{title}}"
  x-axis [{{#data}}"{{label}}"{{^last}}, {{/last}}{{/data}}]
  y-axis "{{unit}}" 0 --> {{max}}
  bar [{{#data}}{{value}}{{^last}}, {{/last}}{{/data}}]
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <!-- title -->
  <text x="24" y="32" font-family="Inter, system-ui" font-size="18" font-weight="600" fill="#111827">{{title}}</text>
  <!-- axes -->
  <line x1="60" y1="300" x2="700" y2="300" stroke="#D1D5DB"/>
  <line x1="60" y1="60"  x2="60"  y2="300" stroke="#D1D5DB"/>
  <!-- {{#data}} one <rect/> per bar, width = (640 / N) - gap, height proportional to value/max {{/data}} -->
  <!-- value labels above each bar -->
  <!-- caption -->
  <text x="24" y="346" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Notes

- Always sort `value-desc` unless data is time-ordered.
- Bar count > 20 → reject (too dense for the bar chart family).
- Color resolves through `options.palette` (default: `falcon-default`).
- Y-axis MUST start at 0.
