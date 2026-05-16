# Renderers

Each chart type has up to three renderer paths:

| File | Engine | When to use |
|---|---|---|
| `markdown.md` | Pure GFM tables, inline glyphs, fenced blocks | Inline reports, Obsidian notes |
| `mermaid.md`  | Mermaid v10 fenced blocks | Web report viewers, GitHub README |
| `svg.md`      | Inline SVG with no JS | PDF embedding via the PDF Skills Suite |

The renderer logic is documented inside the per-chart-type templates under `../templates/`. The renderer notes here capture the cross-cutting rules.

## Cross-cutting rules

1. **Deterministic** — given the same input, output must be byte-identical. No random IDs. No timestamps in chart bodies.
2. **No JS in SVG** — PDFs render static SVG only. `<script>` is forbidden.
3. **Stable element ordering** — iterate input arrays in input order unless `options.sortBy` is set.
4. **Caption discipline** — every renderer ends with the `Source: …` caption line.
5. **Font** — `Inter, system-ui, sans-serif`. Falls back gracefully on PDF print.
6. **No external assets** — SVG must be self-contained. No external `<image href="...">`.

## Output filenames

```
<chartId>.md
<chartId>.mmd
<chartId>.svg
```

All written to `<outputs.reports>/<reportId>/charts/`.
