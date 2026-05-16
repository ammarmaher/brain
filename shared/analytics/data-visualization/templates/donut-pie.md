# Template — Donut / Pie

## Markdown

```markdown
**{{title}}** — Total: **{{total}}**

| Slice | Value | Share |
|---|---:|---:|
{{#data}}
| {{label}} | {{value}} | {{percent}}% |
{{/data}}

_Source: {{source}}_
```

## Mermaid

```mermaid
%%{init: {"themeVariables": {"pie1": "#1F6FEB", "pie2": "#0FB5A1", "pie3": "#F59E0B", "pie4": "#7C3AED", "pie5": "#E11D48", "pie6": "#64748B", "pie7": "#84CC16"}}}%%
pie showData
  title {{title}}
  {{#data}}
  "{{label}}" : {{value}}
  {{/data}}
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <g transform="translate(180,180)">
    <!-- {{#data}} one <path/> arc per slice, fill from palette {{/data}} -->
    <!-- donut hole when options.hole > 0 -->
    <circle r="{{holeRadius}}" fill="#FFFFFF"/>
  </g>
  <g transform="translate(340,80)">
    <!-- legend rows, one per slice -->
  </g>
  <text x="24" y="346" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Notes

- Hard cap at 7 slices — bucket remainder into `Other`.
- Never use for slices < 5% (move into `Other`).
- Donut hole default `hole: 0.55`; full pie when `hole: 0`.
