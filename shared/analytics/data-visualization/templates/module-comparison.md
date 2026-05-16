# Template — Module Comparison Table

## Markdown (with optional heatmap shading via HTML cells)

```markdown
**{{title}}**

| Module | {{#columns}}{{.}} | {{/columns}}Avg |
|---|{{#columns}}---:|{{/columns}}---:|
{{#rows}}
| **{{module}}** | {{#scores}}{{cell}} | {{/scores}}**{{avg}}** |
{{/rows}}

_Source: {{source}}_
```

When `options.heatmap: true`, each `cell` is rendered as an inline HTML span with `style="background:<readinessFill>;color:#fff;padding:2px 6px;border-radius:4px"` so PDF rendering preserves the heatmap shading.

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} {{height}}" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <!-- header row (columns) -->
  <!-- {{#rows}}
  module label + N colored cells + avg cell
  {{/rows}} -->
  <text x="24" y="{{footerY}}" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Rules

- Scores must be numeric and on the same scale (typically 0–100).
- `avg` is computed by the renderer; callers do not pass it.
- Heatmap fill uses the `readiness` palette by default.
