---
ruleId: R-FE-004
name: Tokens only — no hardcoded hex, px, or palette names
category: theme
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.html"
    - "apps/**/*.ts"
    - "libs/**/*.html"
    - "libs/**/*.ts"
    - "libs/**/*.css"
  exemptPaths:
    - "libs/falcon/src/theme/**"
    - "libs/falcon-ui-tokens/**"
    - "libs/falcon-ui-core/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: regex
  patterns:
    - '#[0-9a-fA-F]{3,8}\b'
    - '\brgb\(\s*\d'
    - '\brgba\(\s*\d'
    - '\bhsl\(\s*\d'
    - '\bhsla\(\s*\d'
    - '\b(bg|text|border|ring|from|to|via|fill|stroke|outline|shadow|divide|placeholder|accent|caret)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)\b'
    - '\b(w|h|min-w|max-w|min-h|max-h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|top|bottom|left|right|inset|rounded|text|leading|tracking|border|shadow)-\[\d+(\.\d+)?(px|rem|em|%|vh|vw)\]'
    - '\brounded-\[\d+(\.\d+)?px\]'
    - '\bshadow-\[[^\]]+\]'
  exemptPatterns:
    - 'var\(--falcon-'
    - '#000\b'
    - '#fff\b'
  description: Catches raw hex/rgb/hsl color literals, Tailwind default palette utilities (bg-blue-500 etc.), and Tailwind arbitrary-value utilities with pixel/rem literals (w-[732px], rounded-[6px], text-[14px]) outside the canonical theme file
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Replace each literal with the matching Falcon token utility (bg-blue-500 → bg-falcon-primary-500; w-[732px] → w-[var(--falcon-modal-width)] then promote to a Tailwind utility); add the token to falcon.theme.css if absent'
relatedRules:
  - R-FE-001
  - R-FE-002
  - R-FE-003
source:
  - file: feedback_no_inline_styles_tokens_only.md
    location: memory
  - file: feedback_shadow_is_token_ssot.md
    location: memory
  - file: feedback_v02_theme_adopted.md
    location: memory
  - file: project_token_unification_plan.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-004 — Tokens only, never raw values ***
*** Source: feedback_no_inline_styles_tokens_only (2026-05-05) + shadow-is-token-SSOT (2026-05-07) ***
*** Detector: regex (9 patterns) ***

# R-FE-004 — Tokens only — no hardcoded hex, px, or palette names

## What it says

Every color, border, radius, shadow, spacing, font-size, font-weight, line-height, z-index, and breakpoint in Falcon frontend code MUST come from a token declared in the canonical Tailwind v4 `@theme` SSOT at `libs/falcon/src/theme/falcon.theme.css`. Forbidden literals: raw hex (`#3b82f6`), `rgb()` / `rgba()` / `hsl()` with literal channels, Tailwind default palette names (`bg-blue-500`, `text-red-600`, `border-slate-200`), and Tailwind arbitrary values with pixel/rem literals (`w-[732px]`, `rounded-[6px]`, `text-[14px]`, `shadow-[0_2px_4px_#0001]`).

## Why it exists

The Theme Studio (in active build) lets the user mutate ONE token and see all consumers update — Shadow components, Tailwind variants, and apps in lock-step. Any raw value breaks that loop, freezes the design, and re-introduces the divergence the V0.2 theme adoption was meant to eliminate. Pair this with R-FE-003 (no inline styles) and the Shadow-is-token-SSOT rule: every visual property must travel through `var(--falcon-*)` from the same per-component contract file.

## Detector strategy

Pure regex sweep, 9 patterns:

1. `#[0-9a-fA-F]{3,8}` — raw hex (exempt `#000` and `#fff` which are universal black/white)
2. `rgb(` `rgba(` `hsl(` `hsla(` — function-form color literals with numeric channels
3. Tailwind default-palette utility — `(bg|text|border|...)-(slate|gray|red|...)-(50..950)` — the entire default palette is forbidden; Falcon uses `falcon-<family>-<shade>` prefixed tokens
4. Arbitrary-value utilities with literal units — `w-[732px]`, `p-[18px]`, `rounded-[6px]`, `text-[14px]`, `shadow-[...]` — any Tailwind `[...]` containing a `px` / `rem` / `em` literal

Allowed inside `[...]`: `var(--falcon-...)` references. Allowed everywhere: `#000` and `#fff` as the universal monochrome anchors.

## Examples

### ✅ Good

```html
<!-- apps/admin-console/.../card.component.html -->
<div class="bg-falcon-slate-50 border border-falcon-slate-200 rounded-md p-4 shadow-falcon-card">
  <h3 class="text-falcon-heading-md text-falcon-text-primary">Title</h3>
</div>
```

```css
/* libs/falcon/src/theme/falcon.theme.css — the ONLY file where tokens are declared */
@theme {
  --color-falcon-primary-500: oklch(0.62 0.17 250);
  --shadow-falcon-card: 0 2px 4px var(--color-falcon-slate-900-alpha-10);
  --radius-falcon-md: 0.5rem;
}
```

### ❌ Bad

```html
<!-- apps/admin-console/.../card.component.html -->
<div class="bg-blue-500 border border-[#e2e8f0] rounded-[6px] p-[18px] shadow-[0_2px_4px_#0001]">
  <h3 class="text-[14px] text-[#1e293b]" style="color: #3b82f6;">Title</h3>
</div>
```

Why each one is wrong:
- `bg-blue-500` — Tailwind default palette, not a Falcon token
- `border-[#e2e8f0]` — raw hex in arbitrary value
- `rounded-[6px]`, `p-[18px]`, `text-[14px]` — literal pixel values, no token
- `shadow-[0_2px_4px_#0001]` — fully literal shadow
- `text-[#1e293b]` — raw hex color
- `style="color: #3b82f6"` — also violates R-FE-003 (inline style)

## Known legitimate exemptions

- `libs/falcon/src/theme/**` — the canonical `@theme` SSOT, where tokens are DECLARED in OKLCH/hex
- `libs/falcon-ui-tokens/**` — per-component token contract files (`<name>.tokens.css`)
- `libs/falcon-ui-core/**` — Stencil Shadow components consume `var(--falcon-*)`; their CSS files may contain hex *only inside `@theme`-equivalent declarations*
- `#000` and `#fff` — universal monochrome anchors
- `*.spec.ts` — test fixtures
- Anything listed against `R-FE-004` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. **Hex / rgb / hsl literal** — find the matching token in `falcon.theme.css`. If none exists, add one (name it `--color-falcon-<purpose>-<shade>`), then use the corresponding Tailwind utility.
2. **Tailwind default palette** (e.g. `bg-blue-500`) — rename to the Falcon-prefixed equivalent (`bg-falcon-primary-500`). If the Falcon variant doesn't exist, add the token first.
3. **Arbitrary value with pixel** (e.g. `w-[732px]`) — first ask: does a spacing/size token apply here? If yes (`w-falcon-modal-md`), use it. If no, add a token, then use it. Last resort: leave as `w-[var(--falcon-modal-width)]` and document the GAP.
4. **Arbitrary shadow** — promote the shadow definition into `falcon.theme.css` as `--shadow-falcon-<name>`, then use `shadow-falcon-<name>`.
5. Re-run `nx build <app>` and the detector to confirm clean.

If you're inside `libs/falcon-ui-core/**` and the Shadow CSS declares a literal, that literal must be wrapped in a `--falcon-<component>-*` variable inside the per-component `<name>.tokens.css` first, then consumed in the Shadow CSS. The Tailwind/Light variant for the same component must read the SAME variable name (see [[R-FE-001-tailwind-utilities-only]] and the Shadow-is-token-SSOT rule).

## Related rules

- [[R-FE-001-tailwind-utilities-only]] — Tailwind is the consumer layer; this rule constrains its inputs
- [[R-FE-002-no-scss-no-component-css]] — bans the alternate places literals would hide
- [[R-FE-003-no-inline-styles]] — bans inline `style="..."` where literals most commonly land

## Sources of truth

1. `memory/feedback_no_inline_styles_tokens_only.md` — hardened 2026-05-05 with grep gate
2. `memory/feedback_shadow_is_token_ssot.md` — contract → Shadow → Tailwind chain
3. `memory/feedback_v02_theme_adopted.md` — Tailwind v4 `@theme` SSOT location
4. `memory/project_token_unification_plan.md` — ~700-edit migration to `falcon-{family}-{shade}` naming
