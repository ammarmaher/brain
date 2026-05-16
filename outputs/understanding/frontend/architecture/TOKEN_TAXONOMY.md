---
type: token-taxonomy
purpose: canonical-design-token-catalog
generatedAt: 2026-05-16
source: libs/falcon-theme/src/falcon-tailwind-tokens.css
generator: Tier 2 of FRONTEND_KNOWLEDGE_PATH (Agent A)
totalTokens: 218
mechanism: Tailwind v4 @theme block
verdictRNoor003: text-noor-* does NOT exist — amend rule (Option A)
---

# Token Taxonomy — Falcon Frontend

> **The permanent answer to "what design tokens does this workspace have?"**
> Source of truth: `libs/falcon-theme/src/falcon-tailwind-tokens.css` — Tailwind v4 `@theme` SSOT.
> This catalog resolves the R-NOOR-003 puzzle: **`text-noor-*` is not declared anywhere in the workspace.**

---

## 1. TL;DR — Token families at a glance

All counts are *declared* tokens inside the `@theme { ... }` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` (218 total). Dark-mode overrides (lines 392–458) redeclare a subset of these for `:where(.app-dark, …)` — they do not introduce new token *names*, only new values, and are excluded from the per-family counts.

| Family | Count | Token prefix(es) | Source line range |
|---|---:|---|---|
| **Color — brand teal** | 12 + 5 alpha | `--color-falcon-teal-*` | 19–39 |
| **Color — neutrals** | 27 | `--color-falcon-neutral-*` | 44–70 |
| **Color — status** | 14 | `--color-falcon-{green,red,amber,blue,success}-*` | 75–98 |
| **Color — accents** | 9 | `--color-falcon-{popover-dark, orgchart-line, cyan, lilac, mint}-*` | 103–113 |
| **Color — brand logos** | 9 | `--color-falcon-brand-*` | 115–123 |
| **Typography — families** | 5 | `--font-{sans,sans-latin,sans-ar,display,arabic}` | 128–132 |
| **Typography — text sizes** | 13 | `--text-{4xs,3xs,2xs,xs,sm,md,base,lg,xl,2xl,3xl,4xl,5xl,display,muted}` | 134–147, 321 |
| **Typography — leading scale** | 5 | `--falcon-leading-*` | 150–154 |
| **Sizing — control / icon / tile / stepper** | 19 | `--falcon-size-*`, `--falcon-icon-*`, `--falcon-stepper-*` | 160–216 |
| **Border width** | 4 | `--falcon-border-width-*` | 221–224 |
| **Spacing — scale + layout** | 31 | `--spacing-*` | 229–261 |
| **Radius** | 13 | `--radius-*` | 266–278 |
| **Shadows** | 13 | `--shadow-falcon-*`, `--shadow-brand-soft` | 283–295, 358 |
| **Breakpoints** | 5 | `--breakpoint-*` | 303–307 |
| **Motion** | 7 | `--ease-falcon-*`, `--duration-falcon-*`, `--animate-*` | 312–319 |
| **Tracking** | 2 | `--tracking-{label, brand-copy}` | 356–357 |
| **Z-index ladder** | 7 | `--z-falcon-*` | 347–353 |
| **Background images** | 2 | `--background-image-falcon-rail-*` | 326–337 |
| **Transition shorthands** | 1 | `--transition-falcon-row` | 342 |
| **TOTAL declared** | **218** | (matches `tokens.ts:4` header) | |

Per-component scoped tokens (`libs/falcon-ui-tokens/src/components/*.tokens.css`) — **47 files**, hundreds of additional `--falcon-<component>-*` variables — are catalogued in §11.

---

## 2. The Tailwind v4 `@theme` mechanism

The Falcon workspace uses **Tailwind CSS v4** with the `@theme` directive. Every CSS custom property declared inside the single `@theme { … }` block at `falcon-tailwind-tokens.css:15-367` is automatically promoted by Tailwind v4 to a *generated utility class*. The promotion is mechanical and namespace-driven: `--color-*` becomes `bg-*` / `text-*` / `border-*` / `ring-*` utilities, `--spacing-*` becomes `p-*` / `m-*` / `gap-*` / `w-*` / `h-*` / `inset-*` etc., `--text-*` becomes the font-size + line-height pair, `--radius-*` becomes `rounded-*`, `--shadow-*` becomes `shadow-*`, `--font-*` becomes `font-*`, `--ease-*` and `--duration-*` become `ease-*` / `duration-*`, `--z-*` becomes `z-*`, `--breakpoint-*` becomes the responsive prefixes, `--animate-*` becomes `animate-*`, and `--tracking-*` becomes `tracking-*`. This is **NOT** a PostCSS plugin and **NOT** an `@config`-driven theme map — it is Tailwind v4's native CSS-first config. (The single `@config "../../../tailwind.config.js"` import on line 8 is a v3→v4 bridge that re-enables `important: true` so utilities outrank legacy `::ng-deep` overrides; it does **not** define tokens.)

Because the `@theme` block is plain CSS, any token can also be referenced directly as `var(--token-name)` from a component-scoped `*.tokens.css` file under `libs/falcon-ui-tokens/`. This dual-consumption (utility class + CSS variable) is what lets Stencil Shadow DOM components and Light DOM Tailwind variants share the same SSOT — Stencil reads `var(--falcon-teal-700)`, while a Tailwind class `bg-falcon-teal-700` expands to the same value. The barrel at `libs/falcon-theme/src/index.css` exposes the SSOT plus the Falcon icon font as a single `@import "@falcon/theme"` entry-point for apps. The auto-generated `libs/falcon-theme/src/tokens.ts` (700 lines, 218 entries) gives TypeScript consumers a typed lookup for the same names — its header declares `Tokens: 218`, confirming the inventory below is exhaustive.

---

## 3. Color tokens

All color tokens use the `--color-falcon-*` prefix. Tailwind v4 promotes each to **5 utility families**: `bg-{name}`, `text-{name}`, `border-{name}`, `ring-{name}`, and `outline-{name}` (plus arbitrary opacity modifiers like `bg-{name}/50`). Source: `falcon-tailwind-tokens.css:19-123`.

### 3.1 Brand teal (canonical from org-menu) — lines 19–39

| Token | Hex / value | Role hint |
|---|---|---|
| `--color-falcon-teal-50`  | `#f3f8f5` | tint surface |
| `--color-falcon-teal-100` | `#e8f0f1` | hover well |
| `--color-falcon-teal-200` | `#d1e0e2` | divider |
| `--color-falcon-teal-300` | `#a8bec0` | disabled accent |
| `--color-falcon-teal-400` | `#698e92` | muted brand |
| `--color-falcon-teal-500` | `#124c52` | brand primary |
| `--color-falcon-teal-600` | `#104c54` | hover primary |
| `--color-falcon-teal-700` | `#0d3f44` | active / focus |
| `--color-falcon-teal-800` | `#0a3338` | text-on-light brand |
| `--color-falcon-teal-900` | `#082a2e` | darkest brand |
| `--color-falcon-teal-tint`   | `#eef3f4` | subtle brand tint |
| `--color-falcon-teal-option` | `#f1f6f6` | dropdown option hover (Wave 9) |
| `--color-falcon-teal-mid`    | `#00827a` | mid-teal accent (Wave 9) |
| `--color-falcon-teal-alpha-04` | `rgba(13,63,68,0.04)` | hover overlay |
| `--color-falcon-teal-alpha-06` | `rgba(13,63,68,0.06)` | row hover |
| `--color-falcon-teal-alpha-08` | `rgba(13,63,68,0.08)` | sticky-edge shadow |
| `--color-falcon-teal-alpha-12` | `rgba(13,63,68,0.12)` | focus halo |
| `--color-falcon-teal-alpha-18` | `rgba(13,63,68,0.18)` | tree rail default |

### 3.2 Neutrals (gray scale — truth set: org-menu render) — lines 44–70

| Token | Hex | Role hint |
|---|---|---|
| `--color-falcon-neutral-0` | `#ffffff` | page bg / surface |
| `--color-falcon-neutral-20` | `#fcfcfd` | elevated surface |
| `--color-falcon-neutral-25` | `#fafbfc` | input bg |
| `--color-falcon-neutral-30` | `#fafafa` | subtle well |
| `--color-falcon-neutral-40` | `#f8f8f8` | row stripe |
| `--color-falcon-neutral-45` | `#f7f8f9` | secondary well |
| `--color-falcon-neutral-50` | `#f5f7f8` | hover bg |
| `--color-falcon-neutral-75` | `#f5f6f7` | hover alt |
| `--color-falcon-neutral-100` | `#f1f3f5` | divider light |
| `--color-falcon-neutral-150` | `#eef0f2` | divider |
| `--color-falcon-neutral-160` | `#eff1f3` | divider alt |
| `--color-falcon-neutral-175` | `#e7eaee` | border subtle |
| `--color-falcon-neutral-200` | `#e5e7eb` | border default |
| `--color-falcon-neutral-300` | `#d4d8dc` | border medium |
| `--color-falcon-neutral-350` | `#d1d5db` | border alt |
| `--color-falcon-neutral-400` | `#c7ced4` | placeholder |
| `--color-falcon-neutral-450` | `#c4c9cf` | placeholder alt |
| `--color-falcon-neutral-475` | `#98a0a8` | muted icon |
| `--color-falcon-neutral-500` | `#9ca3af` | secondary text |
| `--color-falcon-neutral-600` | `#6b7280` | body muted |
| `--color-falcon-neutral-700` | `#5a6470` | body |
| `--color-falcon-neutral-750` | `#4a5568` | body strong |
| `--color-falcon-neutral-800` | `#3d3d3d` | heading muted |
| `--color-falcon-neutral-850` | `#2d3748` | heading |
| `--color-falcon-neutral-900` | `#1a1a1a` | heading primary |
| `--color-falcon-neutral-925` | `#111827` | text strongest |
| `--color-falcon-neutral-950` | `#000000` | absolute black |

### 3.3 Status — green / red / amber / blue / success — lines 75–98

| Token | Hex | Role |
|---|---|---|
| `--color-falcon-green-50`   | `#F3F8F5` | success tint (*) |
| `--color-falcon-green-100`  | `#dfece6` | success bg |
| `--color-falcon-green-200`  | `#d9ebe3` | success hover bg |
| `--color-falcon-green-500`  | `#16a34a` | success primary |
| `--color-falcon-green-700`  | `#0f7a3a` | success strong |
| `--color-falcon-red-50`     | `#fef5f5` | danger tint |
| `--color-falcon-red-100`    | `#fde2e4` | danger bg |
| `--color-falcon-red-500`    | `#dc2626` | danger primary |
| `--color-falcon-red-700`    | `#a1191d` | danger hover |
| `--color-falcon-red-900`    | `#7f1d1d` | danger strong |
| `--color-falcon-amber-50`   | `#ffeccb` | warning tint |
| `--color-falcon-amber-500`  | `#f59e0b` | warning primary |
| `--color-falcon-amber-700`  | `#a85a00` | warning strong |
| `--color-falcon-blue-500`   | `#0ea5e9` | info primary |
| `--color-falcon-success-20` | `#E6EFE9` | data-table shadow-row soft tint |
| `--color-falcon-success-50` | `#ecfdf5` | shadow-row fallback |

(\*) `green-50` has a double-semicolon typo `#F3F8F5;;` at line 75 — declared but does not affect the cascade.

### 3.4 Accents — popover / orgchart / cyan / lilac / mint — lines 103–113

| Token | Hex / value | Role |
|---|---|---|
| `--color-falcon-popover-dark` | `#3b4752` | dark popover bg |
| `--color-falcon-orgchart-line` | `rgba(124,130,169,0.5)` | hierarchy chart line |
| `--color-falcon-cyan` | `#2dd4d9` | cyan accent |
| `--color-falcon-lilac-25` | `#f8f8fc` | lilac tint |
| `--color-falcon-lilac-100` | `#e8e8f0` | lilac bg |
| `--color-falcon-lilac-450` | `#7c82a9` | lilac accent |
| `--color-falcon-lilac-500` | `#8b8fc8` | lilac primary |
| `--color-falcon-mint-100` | `#d9e6dd` | mint bg |
| `--color-falcon-mint-200` | `#b9d4c3` | mint hover |

### 3.5 Brand logos — lines 115–123

| Token | Hex | Brand |
|---|---|---|
| `--color-falcon-brand-aramco`    | `#0d6e0e` | Aramco primary |
| `--color-falcon-brand-aramco-1`  | `#0891b2` | Aramco accent 1 |
| `--color-falcon-brand-aramco-2`  | `#059669` | Aramco accent 2 |
| `--color-falcon-brand-aramco-3`  | `#065f46` | Aramco accent 3 |
| `--color-falcon-brand-bmw`       | `#1c69d4` | BMW |
| `--color-falcon-brand-rajhi`     | `#1e4fa3` | Al Rajhi |
| `--color-falcon-brand-snb`       | `#1a6b2e` | SNB |
| `--color-falcon-brand-bupa`      | `#007bc3` | Bupa |
| `--color-falcon-brand-bupa-soft` | `#0b74a6` | Bupa soft |

### 3.6 Dark-mode color overrides — lines 394–457

The `:where(.app-dark, .app-dark *), :where(.dark, .dark *)` selector remaps all 27 neutrals, the 5 teal-alpha tokens, and the `teal-option` / `teal-mid` pair. It also adds two **semantic-only** tokens that exist only in dark scope:

- `--color-falcon-bg-page` = `#111827` — outer page canvas
- `--color-falcon-bg-surface` = `#1f2937` — card/panel surface

Brand teal (`teal-500` / `teal-700` etc.) is intentionally NOT remapped — teal stays the brand colour in both modes.

---

## 4. Typography tokens

### 4.1 Font families — lines 128–132

| Token | Value |
|---|---|
| `--font-sans` | `var(--font-sans-latin)` (indirect; switches per locale) |
| `--font-sans-latin` | `"Neue Haas Grotesk Display Pro", system-ui, -apple-system, "Segoe UI", Arial, sans-serif` |
| `--font-sans-ar` | `"Cairo", system-ui, …` |
| `--font-display` | `"Poppins", "Inter", system-ui, sans-serif` |
| `--font-arabic` | `"IBM Plex Sans Arabic", "Poppins", sans-serif` |

### 4.2 Type scale — `--text-*` — lines 134–147 + 321

| Token | Size | Tailwind utility | Role hint |
|---|---|---|---|
| `--text-4xs` | `0.5625rem` (9px) | `text-4xs` | tree-node badge counts |
| `--text-3xs` | `0.625rem` (10px) | `text-3xs` | Studio meta-labels, mono token names |
| `--text-2xs` | `0.6875rem` (11px) | `text-2xs` | micro caption |
| `--text-xs` | `0.75rem` (12px) | `text-xs` | caption / table cell |
| `--text-sm` | `0.875rem` (14px) | `text-sm` | body small / form label |
| `--text-md` | `1rem` (16px) | `text-md` | body |
| `--text-base` | `1rem` (16px) | `text-base` | body (canonical alias of `md`) |
| `--text-lg` | `1.25rem` (20px) | `text-lg` | heading sm |
| `--text-xl` | `1.75rem` (28px) | `text-xl` | heading md (NOTE: larger than standard Tailwind 20px) |
| `--text-2xl` | `1.5rem` (24px) | `text-2xl` | heading lg |
| `--text-3xl` | `2rem` (32px) | `text-3xl` | title |
| `--text-4xl` | `2.5rem` (40px) | `text-4xl` | title lg |
| `--text-5xl` | `3rem` (48px) | `text-5xl` | display sm |
| `--text-display` | `5rem` (80px) | `text-display` | hero display |
| `--text-muted` | `#6b7280` (light) / `#9ca3af` (dark) | n/a — utility alias | muted text colour |

> ⚠️ **`--text-xl` (28px) is larger than `--text-2xl` (24px).** This is verbatim in the SSOT at lines 142–143 — a known irregularity in the Falcon scale where `xl` was tuned for legacy headings before `2xl` was added.

### 4.3 Line-height micro-scale — lines 150–154

| Token | Value | Role |
|---|---|---|
| `--falcon-leading-tight`   | `1.2` | dense rows |
| `--falcon-leading-snug`    | `1.3` | compact body |
| `--falcon-leading-normal`  | `1.4` | default body |
| `--falcon-leading-relaxed` | `1.5` | readable paragraph |
| `--falcon-leading-loose`   | `2.1` | airy display |

These are referenced by shared-ui legacy + Stencil compact modes via `var(--falcon-leading-*)`; they are **not** mapped to Tailwind `leading-*` utilities (Tailwind v4 maps `leading-*` from `--leading-*`, not `--falcon-leading-*`).

### 4.4 `text-noor-*` — DOES IT EXIST?

**NO.** Exhaustive search of the entire workspace:

```text
Grep pattern: text-noor|--text-noor|noor-display|noor-heading|noor-body|noor-caption|noor-micro|noor-label|noor-table-cell|noor-title
Scope:        C:/Falcon/Falcon/falcon-web-platform-ui (all files)
Result:       No files found
```

No `--text-noor-*` declaration exists in `falcon-tailwind-tokens.css`, in any per-component `*.tokens.css`, or anywhere else under `libs/`. No template, component, or CSS file ever uses `text-noor-*` utilities. The Noor typography scale described in R-NOOR-003 is **aspirational** — the rule was authored against a planned future-state vocabulary that was never declared.

---

## 5. Spacing tokens

`--spacing-*` — Tailwind v4 promotes these to every distance utility: `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `inset-*`, `top-*`, `right-*`, `bottom-*`, `left-*`, `space-x-*`, `space-y-*`, `size-*`, `min-w-*`, `min-h-*`, `max-w-*`, `max-h-*`, etc.

### 5.1 Numeric scale — lines 229–250

| Token | Value | Pixels |
|---|---|---|
| `--spacing-0` | `0` | 0 |
| `--spacing-px` | `1px` | 1 |
| `--spacing-0\.5` | `0.125rem` | 2 |
| `--spacing-1` | `0.25rem` | 4 |
| `--spacing-1\.5` | `0.375rem` | 6 |
| `--spacing-2` | `0.5rem` | 8 |
| `--spacing-2\.5` | `0.625rem` | 10 |
| `--spacing-3` | `0.75rem` | 12 |
| `--spacing-3\.5` | `0.875rem` | 14 |
| `--spacing-4` | `1rem` | 16 |
| `--spacing-5` | `1.5rem` | **24** (NOT 20; Falcon scale departs from Tailwind default here) |
| `--spacing-6` | `2rem` | **32** (NOT 24) |
| `--spacing-7` | `2.5rem` | **40** (NOT 28) |
| `--spacing-8` | `3rem` | **48** (NOT 32) |
| `--spacing-9` | `3.5rem` | **56** (NOT 36) |
| `--spacing-10` | `3.75rem` | **60** (NOT 40) |
| `--spacing-11` | `4rem` | **64** (NOT 44) |
| `--spacing-12` | `5rem` | **80** (NOT 48) |
| `--spacing-14` | `3.5rem` | 56 |
| `--spacing-16` | `4rem` | 64 |
| `--spacing-20` | `5rem` | 80 |
| `--spacing-24` | `6rem` | 96 |

> ⚠️ **Falcon spacing diverges from standard Tailwind from `spacing-5` upwards** — the Falcon scale grows faster (5=24px vs Tailwind 20px, 12=80px vs Tailwind 48px). This is intentional but a recurring source of "why does `p-6` look bigger than I expected" bugs.

### 5.2 Layout dimensions — lines 253–261

| Token | Value | Pixels | Role |
|---|---|---|---|
| `--spacing-sidebar` | `14rem` | 224 | sidebar width |
| `--spacing-sidebar-collapsed` | `4.25rem` | 68 | collapsed rail |
| `--spacing-topbar` | `4.5rem` | 72 | top app bar height |
| `--spacing-clients` | `17rem` | 272 | clients tree rail |
| `--spacing-rail` | `1.125rem` | 18 | hierarchy rail width |
| `--spacing-row-h` | `2.25rem` | 36 | tree row min-height |
| `--spacing-row-gap` | `0.375rem` | 6 | tree row gap |
| `--spacing-row-pad-y` | `0.375rem` | 6 | tree row vertical pad |
| `--spacing-row-pad-x` | `0.625rem` | 10 | tree row horizontal pad |

---

## 6. Radius tokens

Source: `falcon-tailwind-tokens.css:266-278`. Promoted to `rounded-*` utilities.

| Token | Value | Role |
|---|---|---|
| `--radius-none` | `0` | sharp edge |
| `--radius-2xs` | `0.1875rem` (3px) | tree multi-check pill, legacy stepper track |
| `--radius-xs`  | `0.25rem` (4px) | tag, small chip |
| `--radius-sm`  | `0.5rem` (8px) | tree row, hover well |
| `--radius-md`  | `0.75rem` (12px) | button, input |
| `--radius-lg`  | `1rem` (16px) | card |
| `--radius-xl`  | `1.5rem` (24px) | dialog |
| `--radius-2xl` | `1.75rem` (28px) | hero card |
| `--radius-3xl` | `2rem` (32px) | feature panel |
| `--radius-full` | `9999px` | circular |
| `--radius-pill` | `9999px` | pill (alias of full) |
| `--radius-form` | `1.25rem` (20px) | form-control corner |
| `--radius-row`  | `0.5rem` (8px) | tree-row pill |

---

## 7. Shadow tokens

Source: `falcon-tailwind-tokens.css:283-295, 358`. Promoted to `shadow-*` utilities. **Dark-mode counterparts** at lines 431–443 strengthen alpha for visibility on dark canvas.

| Token | Light value | Role |
|---|---|---|
| `--shadow-falcon-xs` | `0 1px 2px rgba(0,0,0,0.04)` | hairline |
| `--shadow-falcon-sm` | `0 1px 2px rgba(0,0,0,0.06)` | hover lift |
| `--shadow-falcon-md` | `0 10px 24px rgba(0,0,0,0.10)` | card |
| `--shadow-falcon-lg` | `0 10px 28px rgba(0,0,0,0.18)` | popover |
| `--shadow-falcon-xl` | composite (long) | dialog hero |
| `--shadow-falcon-popover` | `0 6px 18px rgba(0,0,0,0.18)` | popover panel |
| `--shadow-falcon-menu` | `0 12px 32px rgba(0,0,0,0.12)` | menu panel |
| `--shadow-falcon-drawer` | `-8px 0 12px -8px rgba(0,0,0,0.06)` | drawer edge |
| `--shadow-falcon-focus` | `0 0 0 3px rgba(13,63,68,0.12)` | focus halo |
| `--shadow-falcon-focus-strong` | `0 0 0 2px rgba(13,63,68,0.15)` | focus halo strong |
| `--shadow-falcon-danger-focus` | `0 0 0 3px rgba(220,38,38,0.15)` | danger focus halo |
| `--shadow-falcon-sticky-edge` | `-8px 0 8px -6px rgba(13,63,68,0.08)` | tree-node sticky edge |
| `--shadow-falcon-action` | `0 1px 3px rgba(0,0,0,0.25)` | uploader action |
| `--shadow-brand-soft` | `0 8px 18px rgba(16,76,84,0.08)` | branded soft drop |

---

## 8. Motion tokens

Source: `falcon-tailwind-tokens.css:312-319`. Promoted to `ease-*`, `duration-*`, `animate-*` utilities.

| Token | Value | Role |
|---|---|---|
| `--ease-falcon-in` | `cubic-bezier(0.4, 0, 1, 1)` | enter |
| `--ease-falcon-out` | `cubic-bezier(0, 0, 0.2, 1)` | exit |
| `--ease-falcon-inout` | `cubic-bezier(0.4, 0, 0.2, 1)` | through |
| `--duration-falcon-fast` | `0.12s` | micro interaction |
| `--duration-falcon-base` | `0.15s` | default |
| `--duration-falcon-slow` | `0.30s` | emphasis |
| `--animate-menu-in` | `menuIn 0.15s ease` | menu open |

Keyframes (declared outside `@theme`, lines 461–493): `menuIn`, `falcon-fade`, `falcon-scale`, `falcon-slide`, `falcon-soft-lift`, `falcon-pulse`, `falcon-loading`. These are referenced by Studio animation panel + component templates via inline `animation: falcon-<name> …` shorthand.

---

## 9. Z-index ladder

Source: `falcon-tailwind-tokens.css:347-353` — canonical bottom-to-top tier ladder. Promoted to `z-falcon-*` utilities.

| Token | Value | Tier |
|---|---:|---|
| `--z-falcon-dropdown` | 1000 | dropdown |
| `--z-falcon-sticky`   | 1020 | sticky table header |
| `--z-falcon-fixed`    | 1030 | fixed top-bar |
| `--z-falcon-overlay`  | 1040 | modal backdrop |
| `--z-falcon-modal`    | 1050 | dialog / drawer surface |
| `--z-falcon-popover`  | 1060 | popover panel |
| `--z-falcon-tooltip`  | 1070 | tooltip |

> ⚠️ **The per-component `overlay.tokens.css` declares a competing `--falcon-overlay-z-index: 1400`** — see `libs/falcon-ui-tokens/src/components/overlay.tokens.css:25`. This higher value was introduced (memory: `project_zindex_calendar_portal_root_cause_fix`) so body-portaled popovers (calendar, dropdown, multi-select) opened *from inside* a drawer (z=1200 in the component-scoped scheme) sit above the drawer surface. The canonical SSOT ladder (1000–1070) coexists with a higher component-scoped ladder (popover/drawer/dialog/toast 1100–1400). The two ladders are **not unified** — the SSOT covers global stacking; the component-scoped values cover the body-portal layer.

---

## 10. Other primitives

### 10.1 Border widths — lines 221–224

| Token | Value | Role |
|---|---|---|
| `--falcon-border-width-1`   | `1px`   | default |
| `--falcon-border-width-1-5` | `1.5px` | tree multi-check pill, checkbox stroke |
| `--falcon-border-width-2`   | `2px`   | send-credentials-popup focus border |
| `--falcon-border-width-4`   | `4px`   | stepper track thickness |

### 10.2 Sizing — control / icon / tile / stepper — lines 160–216

| Token | Value | Role |
|---|---|---|
| `--falcon-size-control-sm` | `1.75rem` (28px) | small input/button |
| `--falcon-size-control-md` | `2.125rem` (34px) | uploader btn, multi-select trigger |
| `--falcon-size-control-lg` | `2.375rem` (38px) | default form control |
| `--falcon-size-icon-xs` | `0.75rem` (12px) | toast dismiss |
| `--falcon-size-icon-sm` | `0.875rem` (14px) | chevron, pill |
| `--falcon-size-icon-md` | `1rem` (16px) | generic icon |
| `--falcon-size-icon-lg` | `1.5rem` (24px) | uploader, paginator |
| `--falcon-icon-sm` / `-md` / `-lg` | aliases | Iconify-facing aliases (Wave 8E) |
| `--falcon-size-tile-compact` | `3.5rem` (56px) | uploader compact tile |
| `--falcon-size-tile-sm` | `6rem` (96px) | uploader sm |
| `--falcon-size-tile-md` | `8rem` (128px) | uploader md |
| `--falcon-size-tile-lg` | `11rem` (176px) | uploader lg |
| `--falcon-size-stepper-circle-sm/md/lg` | 16/18/20px | stepper dot |
| `--falcon-stepper-step-size-1..5` | 14/16/18/22/26px | Studio runtime size override |
| `--falcon-stepper-step-shape/radius/rotate` | `circle/9999px/0deg` | Studio shape override |
| `--falcon-stepper-animation-enabled` | `1` | 0 = motion off |
| `--falcon-stepper-label-position` | `bottom` | top/bottom/left/right |
| `--falcon-stepper-label-visible` | `1` | 0 = labels hidden |

### 10.3 Breakpoints — lines 303–307

| Token | Value | Role |
|---|---|---|
| `--breakpoint-sm`  | `576px`  | sm: |
| `--breakpoint-md`  | `768px`  | md: |
| `--breakpoint-lg`  | `992px`  | lg: |
| `--breakpoint-xl`  | `1200px` | xl: |
| `--breakpoint-2xl` | `1920px` | 2xl: |

### 10.4 Tracking — lines 356–357

| Token | Value | Role |
|---|---|---|
| `--tracking-label` | `0.01em` | form labels |
| `--tracking-brand-copy` | `0.03em` | branded display copy |

### 10.5 Background images — lines 326–337

| Token | Value summary |
|---|---|
| `--background-image-falcon-rail-on-path` | vertical teal connector line, `teal-700`, full opacity |
| `--background-image-falcon-rail-default` | vertical connector line, `teal-alpha-18` (subtle) |

### 10.6 Transition shorthand — line 342

| Token | Value |
|---|---|
| `--transition-falcon-row` | `background var(--duration-falcon-fast), box-shadow var(--duration-falcon-fast)` |

---

## 11. Component-scoped tokens

47 per-component token files live at `libs/falcon-ui-tokens/src/components/*.tokens.css`. Each file declares a private `--falcon-<component>-*` namespace, scoped via a `:where(falcon-<tag>, falcon-<tag>-tw, falcon-angular-<tag>, .falcon-<tag>, [data-falcon-<tag>])` selector so the same tokens drive Stencil Shadow DOM, Tailwind Light DOM variant, and the Angular wrapper.

| File | Namespace |
|---|---|
| `accordion.tokens.css` | `--falcon-accordion-*` |
| `avatar.tokens.css` | `--falcon-avatar-*` |
| `badge.tokens.css` | `--falcon-badge-*` |
| `button.tokens.css` | `--falcon-button-*` |
| `calendar.tokens.css` | `--falcon-calendar-*` |
| `card.tokens.css` | `--falcon-card-*` |
| `checkbox-group.tokens.css` | `--falcon-checkbox-group-*` |
| `checkbox.tokens.css` | `--falcon-checkbox-*` |
| `combobox.tokens.css` | `--falcon-combobox-*` |
| `confirm-dialog.tokens.css` | `--falcon-confirm-dialog-*` |
| `data-table.tokens.css` | `--falcon-data-table-*` |
| `dialog.tokens.css` | `--falcon-dialog-*` |
| `drawer.tokens.css` | `--falcon-drawer-*` |
| `dropdown.tokens.css` | `--falcon-dropdown-*` |
| `email-field.tokens.css` | `--falcon-email-field-*` |
| `empty-data.tokens.css` | `--falcon-empty-data-*` |
| `empty-state.tokens.css` | `--falcon-empty-state-*` |
| `filter-panel.tokens.css` | `--falcon-filter-panel-*` |
| `grid-input.tokens.css` | `--falcon-grid-input-*` |
| `icon.tokens.css` | `--falcon-icon-*` |
| `input-number.tokens.css` | `--falcon-input-number-*` |
| `input.tokens.css` | `--falcon-input-*` |
| `insufficient-balance-dialog.tokens.css` | `--falcon-insufficient-balance-dialog-*` |
| `menu.tokens.css` | `--falcon-menu-*` |
| `multi-select.tokens.css` | `--falcon-multi-select-*` |
| `organization-hierarchy.tokens.css` | `--falcon-organization-hierarchy-*` |
| `otp-send-dialog.tokens.css` | `--falcon-otp-send-dialog-*` |
| `otp.tokens.css` | `--falcon-otp-*` |
| `overlay.tokens.css` | `--falcon-overlay-z-index`, `--falcon-overlay-*` (+ container CSS) |
| `paginator.tokens.css` | `--falcon-paginator-*` |
| `password.tokens.css` | `--falcon-password-*` |
| `phone-field.tokens.css` | `--falcon-phone-field-*` |
| `radio-group.tokens.css` | `--falcon-radio-group-*` |
| `radio.tokens.css` | `--falcon-radio-*` |
| `search-input.tokens.css` | `--falcon-search-input-*` |
| `single-uploader.tokens.css` | `--falcon-single-uploader-*` |
| `status-badge.tokens.css` | `--falcon-status-badge-*` |
| `stepper.tokens.css` | `--falcon-stepper-*` |
| `switch.tokens.css` | `--falcon-switch-*` |
| `table.tokens.css` | `--falcon-table-*` |
| `tabs.tokens.css` | `--falcon-tabs-*` |
| `tag.tokens.css` | `--falcon-tag-*` |
| `textarea.tokens.css` | `--falcon-textarea-*` |
| `toast.tokens.css` | `--falcon-toast-*` |
| `tooltip.tokens.css` | `--falcon-tooltip-*` |
| `tree-table.tokens.css` | `--falcon-tree-table-*` |
| `tree.tokens.css` | `--falcon-tree-*` |
| `uploader.tokens.css` | `--falcon-uploader-*` |
| `wizard.tokens.css` | `--falcon-wizard-*` |

Each file resolves its private namespace against the global `--color-falcon-*` / `--spacing-*` / `--radius-*` / `--shadow-falcon-*` SSOT — e.g. `button.tokens.css` defines `--falcon-button-bg-primary: var(--color-falcon-teal-700)`. The component layer is therefore a **theming indirection**, not an independent token set: changing the SSOT teal automatically propagates to every component.

---

## 12. Token-vs-utility mapping

| Token prefix | Tailwind utility prefix(es) | Example |
|---|---|---|
| `--color-falcon-*` | `bg-`, `text-`, `border-`, `ring-`, `outline-`, `fill-`, `stroke-`, `accent-`, `caret-`, `decoration-` | `--color-falcon-teal-700` → `bg-falcon-teal-700`, `text-falcon-teal-700`, `border-falcon-teal-700` |
| `--text-*` | `text-*` (font-size + line-height pair) | `--text-sm` → `text-sm` |
| `--font-*` | `font-*` (family) | `--font-display` → `font-display` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `size-*`, `inset-*`, `top-*`, `space-x-*`, `space-y-*`, `min-*`, `max-*` | `--spacing-4` → `p-4`, `m-4`, `gap-4`, `w-4` |
| `--radius-*` | `rounded-*` | `--radius-md` → `rounded-md` |
| `--shadow-*` | `shadow-*` (incl. `--shadow-falcon-md` → `shadow-falcon-md`) | `--shadow-falcon-popover` → `shadow-falcon-popover` |
| `--ease-*` | `ease-*` | `--ease-falcon-inout` → `ease-falcon-inout` |
| `--duration-*` | `duration-*` | `--duration-falcon-base` → `duration-falcon-base` |
| `--animate-*` | `animate-*` | `--animate-menu-in` → `animate-menu-in` |
| `--tracking-*` | `tracking-*` | `--tracking-label` → `tracking-label` |
| `--z-*` | `z-*` | `--z-falcon-modal` → `z-falcon-modal` |
| `--breakpoint-*` | responsive prefixes | `--breakpoint-lg` → `lg:` |
| `--background-image-*` | `bg-*` (when `--background-image-` prefix) | `--background-image-falcon-rail-default` → `bg-falcon-rail-default` |
| `--falcon-leading-*` | ⛔ **NOT auto-promoted** (does NOT match Tailwind v4's `--leading-*` map) — used only via `var()` in component CSS |
| `--falcon-size-*` | ⛔ **NOT auto-promoted** — used only via `var()` in component CSS / Stencil |
| `--falcon-border-width-*` | ⛔ **NOT auto-promoted** — used only via `var()` |
| `--falcon-stepper-*` | ⛔ component-private; consumed by stepper Stencil + Tailwind variant |
| `--falcon-icon-*` | ⛔ Iconify-facing aliases; consumed via `style="font-size: var(--falcon-icon-md)"` |
| `--transition-falcon-row` | ⛔ raw CSS var; used as `transition: var(--transition-falcon-row)` |

> Lines marked ⛔ are **declared inside `@theme`** but use a prefix Tailwind v4 does not auto-promote. They function as plain CSS variables, not utility classes. Components reference them via `var()` directly.

---

## 13. The R-NOOR-003 verdict

### Question

Does the `text-noor-{display, title, heading, body, caption, micro, label, table-cell}` token scale exist anywhere in the Falcon workspace?

### Answer

**NO.** Verified by exhaustive grep across `C:/Falcon/Falcon/falcon-web-platform-ui/` for `text-noor`, `--text-noor`, and every individual Noor token name (`noor-display`, `noor-heading`, `noor-body`, `noor-caption`, `noor-micro`, `noor-label`, `noor-table-cell`, `noor-title`). Zero matches. The token scale is aspirational and was never authored into `falcon-tailwind-tokens.css` (which contains 13 `--text-*` size tokens, all using the standard Tailwind ladder `4xs..5xl, display`).

### Recommended amendment to R-NOOR-003

Adopt **Option A** from the morning's `ACTUAL_RESULTS_AND_LEARNINGS.md:46-51`:

> Update R-NOOR-003 detector to ACCEPT token-backed Tailwind utilities `text-{4xs, 3xs, 2xs, xs, sm, md, base, lg, xl, 2xl, 3xl, 4xl, 5xl, display}` as compliant — these are the actual Falcon-declared tokens in `--text-*` form.

Concrete detector diff (edit `R-NOOR-003-typography-scale.md`):

```yaml
# REPLACE
detector.patterns[0]: '\b(text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl))\b'
# WITH (keep only what is NOT in the workspace token map)
detector.patterns[0]: '\b(text-(6xl|7xl|8xl|9xl))\b'

# REPLACE
detector.exemptPatterns[0]: '\btext-noor-(display|title|heading|body|caption|micro|label|table-cell)\b'
# WITH
detector.exemptPatterns[0]: '\btext-(4xs|3xs|2xs|xs|sm|md|base|lg|xl|2xl|3xl|4xl|5xl|display)\b'
```

After this amendment, R-NOOR-003 still catches:

- arbitrary `text-[Npx]` values (forbidden — bypasses tokens)
- `text-6xl..9xl` (forbidden — not declared in the SSOT)
- inline `style="font-size: ..."` (forbidden — bypasses utility system)
- ad-hoc `leading-*` and `tracking-*` modifiers

And legitimately permits everything backed by `--text-*` in the canonical theme.

**Expected platform impact:** R-NOOR-003 violation count drops from 146 → ~40 (only arbitrary `text-[Npx]` remains), per the morning's projection.

### Long-term alternative (Option B — not recommended)

If the Noor composite-token vision is still desired, the canonical theme must first be amended to ADD the 8 `--text-noor-*` tokens with locked size + line-height + tracking + font-weight (Tailwind v4 supports the composite shorthand via `--text-<name>: <size> <line-height>` and an `@theme` `--text-<name>--font-weight: …`). Then a separate sweep migrates 100+ files. Effort: 1–2 hours theme work + multi-week migration. **Per the morning's recommendation: do NOT pursue Option B; adopt Option A.**

---

## 14. Gaps surfaced

| # | Gap | Evidence | Recommended action |
|---|---|---|---|
| G-01 | `text-noor-*` referenced in R-NOOR-003 but undeclared | This document §4.4 + §13 | Amend R-NOOR-003 per §13 |
| G-02 | `--text-xl` (28px) is larger than `--text-2xl` (24px) — non-monotonic scale | `falcon-tailwind-tokens.css:142-143` | Theme curator review; decide whether to swap values or leave for legacy reasons |
| G-03 | `--text-md` and `--text-base` are aliased (both `1rem`) — utility duplication | `falcon-tailwind-tokens.css:139-140` | Pick one; deprecate the other (likely deprecate `text-md`) |
| G-04 | `--color-falcon-green-50` has double-semicolon typo `#F3F8F5;;` | `falcon-tailwind-tokens.css:75` | One-line fix |
| G-05 | Dual z-index ladder: SSOT `--z-falcon-*` (1000–1070) vs component-scoped `--falcon-overlay-z-index` (1400) + drawer/dialog/toast (1100–1400) in `overlay.tokens.css` | `overlay.tokens.css:7-22` | Document the dual-ladder rationale OR unify — pick one |
| G-06 | `--falcon-leading-*` declared inside `@theme` but NOT consumed by any Tailwind utility (Tailwind v4 reads `--leading-*` not `--falcon-leading-*`) | `falcon-tailwind-tokens.css:150-154` | Either rename to `--leading-*` (auto-promote to `leading-*` utilities) OR move out of `@theme` into a non-promoted block to signal var-only consumption |
| G-07 | `--spacing-5..12` diverges from Tailwind default scale (5=24px vs 20px, 12=80px vs 48px) — surprising for new developers | `falcon-tailwind-tokens.css:239-246` | Document loudly in onboarding; consider creating named layout tokens for the 24/32/40/48/56/60/64/80 values instead of overloading numeric keys |
| G-08 | `--falcon-stepper-step-shape: circle` is a string-valued token (`circle`) — does not flow through any utility, only consumed by Stencil JS logic | `falcon-tailwind-tokens.css:194` | Acceptable; document as "logical token" |
| G-09 | Brain-skills entry `noor-instructions-skill/Skill.md` referenced by R-NOOR-003 sources at line 48 is marked "file currently absent on disk" by the rule's own sources block | `R-NOOR-003-typography-scale.md:168-170` | Recreate the skill file OR remove the dangling reference |

---

## 15. Sources of truth

Every claim in this document cites a file and line range. Repeated here for traceability.

| Claim | Source |
|---|---|
| 218 total `@theme` tokens | `libs/falcon-theme/src/falcon-tailwind-tokens.css:15-367` (counted via `awk '/@theme \{/,/^\}/' \| grep -cE '^\s+--[a-z]'`) and `libs/falcon-theme/src/tokens.ts:4` (`Tokens: 218`) |
| Tailwind v4 + `@config` bridge | `falcon-tailwind-tokens.css:5-8` (`@import "tailwindcss"; @config "../../../tailwind.config.js"`) |
| Layer order | `falcon-tailwind-tokens.css:11` |
| Dark-mode custom variant | `falcon-tailwind-tokens.css:13` |
| Brand teal palette | `falcon-tailwind-tokens.css:19-39` |
| Neutrals | `falcon-tailwind-tokens.css:44-70` |
| Status colors | `falcon-tailwind-tokens.css:75-98` |
| Accents | `falcon-tailwind-tokens.css:103-113` |
| Brand logo colors | `falcon-tailwind-tokens.css:115-123` |
| Font families | `falcon-tailwind-tokens.css:128-132` |
| Type scale | `falcon-tailwind-tokens.css:134-147` + `:321` (`--text-muted`) |
| Leading | `falcon-tailwind-tokens.css:150-154` |
| Sizing | `falcon-tailwind-tokens.css:160-216` |
| Border widths | `falcon-tailwind-tokens.css:221-224` |
| Spacing | `falcon-tailwind-tokens.css:229-261` |
| Radii | `falcon-tailwind-tokens.css:266-278` |
| Shadows | `falcon-tailwind-tokens.css:283-295, 358` |
| Breakpoints | `falcon-tailwind-tokens.css:303-307` |
| Motion | `falcon-tailwind-tokens.css:312-319` |
| Keyframes | `falcon-tailwind-tokens.css:461-493` |
| Tracking | `falcon-tailwind-tokens.css:356-357` |
| Z-index ladder | `falcon-tailwind-tokens.css:347-353` |
| Overlay ladder override | `libs/falcon-ui-tokens/src/components/overlay.tokens.css:7-25` |
| Dark-mode overrides | `falcon-tailwind-tokens.css:392-458` |
| Barrel re-export | `libs/falcon-theme/src/index.css:7-8` |
| 47 component token files | `libs/falcon-ui-tokens/src/components/*.tokens.css` (enumerated in §11) |
| `text-noor-*` does not exist | Exhaustive grep result: 0 matches workspace-wide |
| R-NOOR-003 expects `text-noor-*` | `Brain SK/outputs/understanding/rules/frontend-admin-console/R-NOOR-003-typography-scale.md:19,25,72,84` |
| Morning's discovery | `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/ACTUAL_RESULTS_AND_LEARNINGS.md:39-51,98` |

---

## Appendix — How to verify this taxonomy is still current

```powershell
# Count tokens declared inside the @theme block (should be 218)
$theme = "C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-theme\src\falcon-tailwind-tokens.css"
$inBlock = $false
$count = 0
Get-Content $theme | ForEach-Object {
  if ($_ -match '^@theme \{') { $inBlock = $true; return }
  if ($inBlock -and $_ -match '^\}') { $inBlock = $false; return }
  if ($inBlock -and $_ -match '^\s+--[a-z]') { $count++ }
}
$count   # expect 218

# Check that text-noor-* still does NOT exist
rg -i "text-noor|--text-noor" "C:\Falcon\Falcon\falcon-web-platform-ui"
# expect: 0 matches

# Re-list component-scoped token files (expect 47)
(Get-ChildItem "C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\components\*.tokens.css").Count
```

If the token count changes, regenerate this file from the new `@theme` block. If `text-noor-*` appears, re-evaluate the R-NOOR-003 verdict in §13.
