# Template — Progress Bar (Inline)

Used inside table rows or paragraphs where a chart would be overkill.

## Markdown

`{{value}}% \`{{bar20}}\``

20-char Unicode bar: filled = `█`, empty = `░`.

Filled count formula: `floor((value / max) * 20)` with minimum 1 when `value > 0`.

Examples:

- `0%`   → `░░░░░░░░░░░░░░░░░░░░`
- `64%`  → `████████████░░░░░░░░`
- `100%` → `████████████████████`

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 28" role="img" aria-label="{{label}} {{value}}%">
  <title>{{label}} {{value}}%</title>
  <rect x="0" y="6" width="200" height="16" rx="8" fill="#E5E7EB"/>
  <rect x="0" y="6" width="{{filledWidth}}" height="16" rx="8" fill="{{readinessFill}}"/>
  <text x="208" y="20" font-family="Inter" font-size="12" fill="#111827">{{value}}%</text>
</svg>
```

## Rules

- Always pair the bar with the numeric % to its right.
- Use the `readiness` palette for fill color.
- Never use without a caller label — bars alone are meaningless.
