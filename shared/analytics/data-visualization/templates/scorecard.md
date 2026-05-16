# Template — Scorecard

## Markdown

```markdown
> ### {{title}}
>
> # {{value}}{{unit}}    {{trendGlyph}} **{{delta}}**
>
> {{footnote}}
>
> _Source: {{source}}_
```

`trendGlyph` mapping: `up → ▲`, `flat → ▬`, `down → ▼`.

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <rect width="360" height="180" rx="12" fill="#F9FAFB" stroke="#E5E7EB"/>
  <text x="20" y="36" font-family="Inter" font-size="13" fill="#6B7280">{{title}}</text>
  <text x="20" y="96" font-family="Inter" font-size="44" font-weight="700" fill="#111827">{{value}}{{unit}}</text>
  <text x="20" y="128" font-family="Inter" font-size="13" fill="{{trendColor}}">{{trendGlyph}} {{delta}}</text>
  <text x="20" y="160" font-family="Inter" font-size="11" fill="#6B7280">{{footnote}} · Source: {{source}}</text>
</svg>
```

## Notes

- `trendColor`: `up → #059669`, `flat → #6B7280`, `down → #DC2626`.
- `value` always rendered with its `unit` (default `%` for percentages).
- `delta` rendered verbatim (caller decides `+2.1pp` vs `+2.1%` vs `+12`).
