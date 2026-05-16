# Template — Statistics Table

## Markdown

```markdown
**{{title}}**

| Label | n | Min | Avg | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|
{{#rows}}
| {{label}} | {{n}} | {{min}} | {{avg}} | {{p95}} | {{p99}} | {{max}} |
{{/rows}}

_Source: {{source}}_
```

## Rules

- `n` is required for every row (sample size).
- Numeric cells round to integer unless the metric is a percentage (one decimal).
- Empty `p95` / `p99` cells render as `—` rather than blank.
