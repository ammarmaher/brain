# Template — Metric Grid

## Markdown

Render as a 2/3/4 column GFM table (alignment chosen by `options.columns`, default 3).

```markdown
**{{title}}**

| {{col1}} | {{col2}} | {{col3}} |
|---|---|---|
{{#rows}}
| **{{cell1.label}}**<br>{{cell1.value}} {{cell1.trendGlyph}} | **{{cell2.label}}**<br>{{cell2.value}} {{cell2.trendGlyph}} | **{{cell3.label}}**<br>{{cell3.value}} {{cell3.trendGlyph}} |
{{/rows}}

_Source: {{source}}_
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 {{height}}" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <text x="24" y="32" font-family="Inter" font-size="16" font-weight="600">{{title}}</text>
  <!-- {{#data}} 1 cell rect per metric, label top, value 28px below, trend glyph right {{/data}} -->
  <text x="24" y="{{footerY}}" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Notes

- 4–12 cells only. Below 4 → use scorecard. Above 12 → split into two grids.
- Cells render as: small label on top, big value in the middle, trend glyph on the right.
