# falcon-textarea — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/textarea.tokens.css` (**~202 lines**, recount 2026-06-03). Scoped `:where(falcon-textarea, falcon-textarea-tw, falcon-angular-textarea, .falcon-textarea, [data-falcon-textarea])` — **gate-12 compliant** (not `:root`). All `--falcon-textarea-*` vars chain to workspace SSOT `--color-falcon-*` / `--font-*` tokens.

## Token categories (14 declared — `[CODE]` textarea.tokens.css header)

1. CONTAINER — width / min-width / max-width.
2. LABEL — color, color-error, font (family/size/weight/line-height), margin, cursor, required-color (mirrors input label tokens).
3. SIZING — per size: `--falcon-textarea-min-height-{sm,md,lg}` (72/88/112px), `-padding-x-*`, `-padding-y-*`, `-font-size-*`.
4. TYPOGRAPHY — font-weight, line-height (1.5), letter-spacing.
5. BACKGROUND — by state (default/hover/focus/error/success/warning/disabled/readonly) + Wave-9.C appearance fallbacks (`-bg-filled*`, `-bg-ghost-hover`).
6. TEXT COLOR — text-color, text-color-disabled, placeholder-color.
7. BORDER — width (1px), style, radius (`--falcon-radius-md`), color-by-state.
8. SHADOW / FOCUS RING — idle plain, focus 3-stop teal halo, error micro-drop; `-ring-width`/`-ring-color-focus`/`-ring-color-error`/`-ring-offset`.
9. HELPER TEXT — color, font, margin, padding-x.
10. ERROR TEXT — color (red-500), font, line-height (1.2), margin, padding-x.
11. COUNTER TEXT — `-counter-color` + `-counter-color-warning` (amber) + `-counter-color-over` (red), font-size 10.5px, weight, line-height, margin, padding-x.
12. RESIZE HANDLE — `--falcon-textarea-resize` (default `vertical`; auto-resize forces `none`). Type-defined but not prop-driven (GAP G5).
13. AUTO-RESIZE — `--falcon-textarea-line-height-px` (20px) + `--falcon-textarea-max-height` (none, the cap when capped).
14. MOTION — transition-duration (150ms), easing (ease).
15. ICON SLOT (footer) — `--falcon-textarea-icon-color` (defers to `--falcon-input-icon-color`) + `--falcon-textarea-icon-top-offset` (10px). The icon-input padding reuses input's `--falcon-input-icon-input-padding-{start,end}`.

## Related Falcon theme tokens

Same SSOT chain as input (`--color-falcon-neutral-*`, `-teal-500`, `-red-*`, `-green-500`, `-amber-500`, `--font-display`, `--font-weight-medium`). Counter font is a fixed `10.5px` (not a scale token, per the `.tpl-input-counter` reference spec).

## Tailwind utility guidance

`wrapperClass`, `inputClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Heights via `--falcon-density-input-height-*`.

## RTL

Native textarea respects `dir` attr.

## Static style risks

`[CODE]` The `-tw` twin writes inline `style.height` during auto-resize (the documented escape-hatch — falcon-textarea-tw.tsx:153-157) + an inline `style={{ color: var(--falcon-textarea-icon-color,...), top: var(--falcon-textarea-icon-top-offset, 10px) }}` on icon spans. Both are token-with-fallback or computed — acceptable. No raw color hex in the component CSS. **VERIFIED clean 2026-06-03.**

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
| Auto-resize bounds | `--falcon-textarea-min-height-{sm,md,lg}`, `--falcon-textarea-max-height`, `--falcon-textarea-line-height-px` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01). 14-category contract + 202-line count confirmed; counter 3-color + icon-defers-to-input tokens documented; CSS verified clean.
