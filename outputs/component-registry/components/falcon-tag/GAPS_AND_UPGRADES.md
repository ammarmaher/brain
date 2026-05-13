# falcon-tag — GAPS & UPGRADES

## Missing capabilities

### Dead-code in the Angular wrapper

- The wrapper has a `classes` computed signal (lines 62-71) that generates hardcoded Tailwind classes (`bg-falcon-green-50 text-falcon-green-700` etc.) plus a `_sizeClasses()` + `_severityClasses()` helper pair. **Unused in the actual template** (which delegates to `<falcon-tag-tw>`). Likely a Wave 9.E carry-over that wasn't removed when the Stencil refactor landed. **P2 — remove the dead-code computed + helpers.**

### `'warn'` legacy alias

- `FalconTagSeverity` includes both `'warning'` and `'warn'` (legacy). Both should render identically. The Stencil renderer's switch must handle both → verify the token CSS maps `warn` to the same `warning` bucket. **P3 — deprecate `'warn'` with a TS deprecation tag.**

### Icon hover affordance

- When `dismissible=true`, the `✕` button has no hover/focus visual differentiation beyond browser defaults. **P2 — add hover/focus tokens for the dismiss button.**

### No `cell-template` shorthand for table

- A `col.type='tag'` on `FalconTableColumn` could auto-render an array of tags per cell. **P2 — same as FSB-02 for status-badge.**

### Container is fixed-size, not chip-flex

- `<falcon-tag>` is `inline-flex` content-shaped. Multi-tag wrapping is consumer's job. No `<falcon-tag-list>` orchestrator. **P3 — could ship a list wrapper that handles wrap + gap + overflow.**

### A11y

- Dismiss button `aria-label="Remove"` — good. But for an internationalized UI, `'Remove'` is hardcoded English. **P2 — add `[dismissAriaLabel]` input.**

### Tests

- No specs. **P3** — pure presentational.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FT-01 | Remove dead-code `classes` computed in wrapper | **P2** |
| FT-02 | Add `[dismissAriaLabel]` for i18n | **P2** |
| FT-03 | Dismiss button hover/focus tokens | **P2** |
| FT-04 | Deprecate `'warn'` severity | **P3** |
| FT-05 | `<falcon-tag-list>` orchestrator | **P3** |
| FT-06 | Typed `col.type='tag'` integration | **P2** |

## Workarounds available

- For tag overflow / wrapping: consumer uses `<div class="flex flex-wrap gap-1">` around tags.
- For i18n dismiss button: drop down to Stencil and pass `aria-label="…"` via attribute binding.

## Visual / interaction risks

- Severity buckets share tokens with `<falcon-badge>` palette (info=blue, success=green, etc.). Make sure consumers don't mix `<falcon-badge variant="info">` and `<falcon-tag severity="info">` on the same row — visually similar but semantically different.

## Future-proof recommendation

Clean up the dead `classes` computed. Add i18n affordances. Then promote `<falcon-angular-tag>` as the canonical chip primitive across multi-select and filter UIs.
