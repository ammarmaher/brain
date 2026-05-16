# Template — Gap Severity Chart

## Markdown

```markdown
**{{title}}** — Total findings: **{{total}}**

| Severity | Count | Blocks ship? | Examples |
|---|---:|:---:|---|
| 🔺 **HIGH**   | **{{HIGH.count}}**   | {{HIGH.blocksGlyph}}   | {{HIGH.examples}} |
| ◼ **MEDIUM** | {{MEDIUM.count}}     | {{MEDIUM.blocksGlyph}} | {{MEDIUM.examples}} |
| ● **LOW**    | {{LOW.count}}        | {{LOW.blocksGlyph}}    | {{LOW.examples}} |

_Source: {{source}}_
```

`blocksGlyph`: `true → ✋ YES`, `false → —`.

HIGH row MUST come first. INFO row optional, rendered after LOW when present.

## Mermaid (stacked bar)

```mermaid
%%{init: {"themeVariables": {"primaryColor": "#DC2626"}}}%%
xychart-beta
  title "{{title}}"
  x-axis ["HIGH", "MEDIUM", "LOW"]
  y-axis "Count" 0 --> {{max}}
  bar [{{HIGH.count}}, {{MEDIUM.count}}, {{LOW.count}}]
```

## SVG (skeleton)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" role="img" aria-label="{{title}}">
  <title>{{title}}</title>
  <!-- 3 horizontal bars, lengths proportional to count -->
  <!-- HIGH row -->
  <text x="24" y="56" font-family="Inter" font-size="13" font-weight="600" fill="#DC2626">▲ HIGH ({{HIGH.count}})</text>
  <rect x="160" y="44" width="{{HIGH.barWidth}}" height="20" fill="#DC2626"/>
  <!-- MEDIUM row -->
  <text x="24" y="104" font-family="Inter" font-size="13" font-weight="600" fill="#F59E0B">■ MEDIUM ({{MEDIUM.count}})</text>
  <rect x="160" y="92" width="{{MEDIUM.barWidth}}" height="20" fill="#F59E0B"/>
  <!-- LOW row -->
  <text x="24" y="152" font-family="Inter" font-size="13" font-weight="600" fill="#10B981">● LOW ({{LOW.count}})</text>
  <rect x="160" y="140" width="{{LOW.barWidth}}" height="20" fill="#10B981"/>
  <text x="24" y="220" font-family="Inter" font-size="11" fill="#6B7280">Source: {{source}}</text>
</svg>
```

## Rules

- HIGH count > 0 → caller MUST mark the parent report as `gates: blocking` in front-matter.
- Each severity row uses both color AND shape (triangle / square / circle) for color-blind safety.
