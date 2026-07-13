# falcon-checkbox-group — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/checkbox-group.tokens.css` (~21 lines — small).

Selector chain (gate-12-compliant; ALSO scopes the checkbox tags so the group's shared accent reaches children):

```css
:where(
  falcon-checkbox-group, falcon-checkbox-group-tw, falcon-angular-checkbox-group,
  .falcon-checkbox-group, [data-falcon-checkbox-group],
  falcon-checkbox, falcon-checkbox-tw, falcon-angular-checkbox, .falcon-checkbox
) { … }
```

## Tokens declared (actual names — verified 2026-06-03)

| Token | Value | Purpose |
|---|---|---|
| `--falcon-checkbox-group-gap` | `8px` | root flex gap (label↔options↔helper) |
| `--falcon-checkbox-group-option-gap` | `8px` | gap between options (vertical) |
| `--falcon-checkbox-group-option-gap-horizontal` | `16px` | gap between options (horizontal) |
| `--falcon-checkbox-group-label-font-family` | `var(--font-sans, …)` | group label font |
| `--falcon-checkbox-group-label-font-size` | `13px` | group label size |
| `--falcon-checkbox-group-label-font-weight` | `500` | group label weight |
| `--falcon-checkbox-group-label-fg` | `var(--color-falcon-neutral-700, #374151)` | group label color |
| `--falcon-checkbox-group-helper-fg` | `var(--color-falcon-neutral-500, #6b7280)` | helper text color |
| `--falcon-checkbox-group-error-fg` | `var(--color-falcon-red-700, #dc2626)` | error text color |
| `--falcon-checkbox-accent` | `var(--color-falcon-teal-700, #124c52)` | the shared checkbox accent (also read by the `-tw` group's `accent-[…]`) |

> The prior dossier listed token names that do not exist (`-label-color`, `-error-text-color`, `-required-color`, `-helper-font-size`, `--falcon-spacing-*`). Corrected to the real names above.

## Token VALUES use raw px literals (token-over-literal note)

`[CODE]` checkbox-group.tokens.css:8-13 — `--falcon-checkbox-group-gap: 8px`, `-label-font-size: 13px`, `-option-gap-horizontal: 16px`, `-label-font-weight: 500` are hardcoded numeric literals rather than aliasing `--falcon-spacing-*` / `--falcon-font-size-*` / `--font-weight-medium`. Acceptable as a token SSOT, but it means the group's spacing/typography does NOT auto-follow the platform spacing/type scale. **GAP G11 (token-over-literal).** `safe-local`.

## Where the layout CSS actually lives — a divergence

`[CODE]` The `.falcon-checkbox-group-root` / `-label` / `-options` / `-options.is-horizontal` / `-helper` / `-error` **CSS rules exist ONLY inside `falcon-checkbox-group.css`** (the Stencil Shadow component's stylesheet, scoped to that Shadow DOM via `:host`). The **Angular wrapper** template (Light DOM) reuses the same class names (`falcon-checkbox-group`, `-options.is-vertical`, `-label`, `-helper`, `-error`) but there is **no global stylesheet providing them** — so in the Angular path these classes are largely inert (notably `.is-vertical` is not targeted anywhere; only `.is-horizontal` has a rule, and it lives in the unreachable Shadow scope). The Angular group's vertical layout therefore falls back to each child checkbox's own `inline-block` rather than a token-driven gap. **GAP G12 (Angular-path layout unstyled).** `safe-local` but visually real.

## Related Falcon theme tokens

- `--color-falcon-neutral-700` / `-500` — label / helper.
- `--color-falcon-red-700` — error.
- `--color-falcon-teal-700` (`#124c52`) — the shared `--falcon-checkbox-accent`.
- Child `<falcon-angular-checkbox>` uses its OWN `--falcon-checkbox-*` tokens; the group does NOT override them (it only contributes the shared accent + group label/helper/error/gap tokens).

## Tailwind utility guidance for this component

The Tailwind helper `checkbox-group-tailwind-classes.ts` is a 13-line orientation flex helper (`flex gap-2` + `flex-row flex-wrap` / `flex-col`) — used only by the Stencil `-tw` group. For the Angular wrapper, layout comes from `[orientation]` + host `class=` (e.g. `grid grid-cols-2 gap-3`).

## Dark mode support

Token-driven (label/helper/error inherit neutral inversion). The `-tw` group's `accent-[var(--falcon-checkbox-accent,#124c52)]` follows the shared accent token.

## Density support

Group gap would shift with the spacing scale — but the raw-px token values (G11) blunt this; the gap is fixed at 8px/16px unless overridden.

## RTL support

Vertical orientation unaffected; horizontal flips item order via flex direction inheritance.

## Static style risks

- `[CODE]` falcon-checkbox-group-tw.tsx:97,114,125,128 — the Stencil `-tw` group hardcodes Tailwind literals for the label/row/helper/error (`text-[13px]`, `text-falcon-neutral-700`, `accent-[var(--falcon-checkbox-accent,#124c52)]`, `w-4 h-4`) rather than reading `--falcon-checkbox-group-*`. Not the Angular path, but a parity/token note. `safe-local`.
- Angular wrapper has no `styleUrl` — and the class names it emits are unstyled in Light DOM (G12).

## No CSS / no SCSS guidance

- Per-instance overrides via `--falcon-checkbox-group-*` token mutation on a host class. Never hardcode hex/px in consumer CSS.

## Token usage by state

| State / part | Token(s) consumed |
|---|---|
| Root gap | `--falcon-checkbox-group-gap` |
| Options gap (vertical / horizontal) | `--falcon-checkbox-group-option-gap` / `-option-gap-horizontal` |
| Group label | `--falcon-checkbox-group-label-fg`, `-label-font-family`, `-label-font-size`, `-label-font-weight` |
| Helper | `--falcon-checkbox-group-helper-fg` |
| Error | `--falcon-checkbox-group-error-fg` |
| Child accent | `--falcon-checkbox-accent` |
| (Per-checkbox box/check/border) | the child's own `--falcon-checkbox-*` tokens |

## Verification
🟢 code-verified against checkbox-group.tokens.css + falcon-checkbox-group.css + the `-tw` group (read 2026-06-03). Token names CORRECTED to the real `-fg`/`-font-*` set. NEW gaps: raw-px literals (G11), Angular-path layout-classes-unstyled (G12), `-tw` literal-bypass.
