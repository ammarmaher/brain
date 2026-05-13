# falcon-textarea — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/textarea.tokens.css`.

## Token categories

Mirrors `<falcon-input>` plus:

1. MIN-HEIGHT / MAX-HEIGHT — from `rows` and density.
2. RESIZE-HANDLE — visual via native `resize: vertical` plus token.
3. COUNTER — color, font, position (bottom-right).
4. AUTO-RESIZE BOUNDARIES — min-rows / max-rows tokens.

Plus same:
- LABEL, SIZING, BACKGROUND, TEXT COLOR, BORDER, SHADOW, FOCUS RING, HELPER, ERROR, MOTION.

## Related Falcon theme tokens

Same as input. Plus typography for counter typically `--falcon-font-size-xs`.

## Tailwind utility guidance

`wrapperClass`, `inputClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Heights via `--falcon-density-input-height-*`.

## RTL

Native textarea respects `dir` attr.

## Static style risks

Verify Stencil for any hardcoded resize CSS.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-textarea-bg`, `--falcon-textarea-border-color`, `--falcon-textarea-text-color` |
| Focus | `--falcon-textarea-border-color-focus`, `--falcon-textarea-shadow-focus`, `--falcon-textarea-ring-color-focus` |
| Error | `--falcon-textarea-border-color-error`, `--falcon-textarea-shadow-error`, `--falcon-textarea-error-text-color` |
| Filled | `--falcon-textarea-bg-filled` |
| Ghost | `--falcon-textarea-bg-ghost-hover` |
| Counter | `--falcon-textarea-counter-color`, `--falcon-textarea-counter-font-size`, `--falcon-textarea-counter-padding-x` |
| Disabled | `--falcon-textarea-bg-disabled`, `--falcon-textarea-text-color-disabled` |
| Auto-resize bounds | `--falcon-textarea-min-height`, `--falcon-textarea-max-height` |
