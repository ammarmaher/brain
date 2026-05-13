*** Dark mode audit ***
*** Source: SSOT `falcon-tailwind-tokens.css` lines 385-451 + `libs/falcon-ui-tokens/src/themes/dark.css` ***
*** Verified against active source at 2026-05-13 ***

# Dark mode audit

## Trigger

```css
/* libs/falcon-theme/src/falcon-tailwind-tokens.css:13 */
@custom-variant dark (&:where(.app-dark, .app-dark *));

/* SSOT dark override block selector — line 385 */
:where(.app-dark, .app-dark *),
:where(.dark, .dark *) {
  ...
}

/* UI-tokens dark theme selector — libs/falcon-ui-tokens/src/themes/dark.css:11 */
:where([data-theme='dark'], .app-dark, .dark) {
  ...
}
```

Three activator classes/attrs:
1. `<html class="app-dark">` — canonical Falcon class.
2. `<html class="dark">` — Tailwind v3 compat (still wired in both SSOT + dark.css).
3. `<html data-theme="dark">` — UI-tokens layer compatibility (also wired in dark.css).

Toggling any one of these activates dark mode for all consumers below.

---

## Two-layer dark cascade

### Layer A — SSOT dark block (`falcon-tailwind-tokens.css:385-451`, 67 lines)

Inverts primitives that auto-propagate through the cascade. Specifically:

1. **Neutrals** — every `--color-falcon-neutral-{0..950}` stop gets a new dark value (lines 391-417). Inversion is engineered so that:
   - `neutral-0` (page canvas) goes white → dark-blue-purple (`#1a1a2e`).
   - `neutral-900` (primary text) goes near-black → white.
   - Mid stops (`200`, `400`, `600`) move smoothly between, providing the same surface/text/border hierarchy in inverse.

2. **Semantic surface aliases** (lines 419-421) — added ONLY in dark mode (no light-mode counterpart in the SSOT @theme block).
   ```
   --color-falcon-bg-page:    #111827;   /* outermost page canvas */
   --color-falcon-bg-surface: #1f2937;   /* card / panel surface */
   ```

3. **Shadows** (lines 423-431) — every `--shadow-falcon-*` re-stated with **stronger alpha** (`0.20`-`0.50` range, up from `0.04`-`0.18` light).

4. **Focus rings** (lines 433-436) — three teal-alpha focus shadows shift from `rgba(13, 63, 68, X)` (light teal-700 base) to `rgba(105, 142, 146, X)` (dark teal-400 base, more contrast on dark canvas).

5. **Wave-9 teal primitives** (lines 438-440):
   ```
   --color-falcon-teal-option: #1e3a3a; /* dark: deep teal well */
   --color-falcon-teal-mid:    #2dd4d9; /* dark: bright cyan */
   ```

6. **Teal alpha derivatives** (lines 442-447) — recalculated from `rgba(13, 63, 68, ...)` to `rgba(105, 142, 146, ...)`.

7. **Text-muted alias** (line 450):
   ```
   --text-muted: #9ca3af;
   ```

### Layer B — UI-tokens dark theme (`libs/falcon-ui-tokens/src/themes/dark.css`, 178 lines)

Per-component RGBA bypass overrides. Needed because some component tokens hardcode `rgba(13, 63, 68, X)` (teal-700 base) which doesn't auto-invert.

#### Semantic intent layer (lines 13-46)

```
--falcon-color-primary: var(--falcon-color-teal-400);    /* up from teal-600 light */
--falcon-color-primary-hover: var(--falcon-color-teal-300);
--falcon-color-on-primary: var(--falcon-color-neutral-900);  /* note: dark neutral-900 = #ffffff */

--falcon-color-danger: var(--falcon-color-red-500);
--falcon-color-success: var(--falcon-color-green-500);
--falcon-color-warning: var(--falcon-color-amber-300);

--falcon-color-surface: var(--falcon-color-neutral-900);    /* note: in dark, neutral-900 = #ffffff... */
--falcon-color-surface-muted: var(--falcon-color-neutral-800);
--falcon-color-text: var(--falcon-color-neutral-50);
--falcon-color-text-muted: var(--falcon-color-neutral-300);
...
```

**NOTE**: The dark.css semantic overrides reference `--falcon-color-neutral-900` etc., which in dark mode are remapped to LIGHT values (white for primary text on dark canvas). The chain is consistent because `--falcon-color-neutral-900` itself is auto-inverted by the SSOT dark block. The semantic layer then says "text uses neutral-50" which in dark mode resolves to `#2d3748` light gray on dark — wrong direction.

Wait — let me re-read. Dark SSOT lines 412-413:
```
--color-falcon-neutral-800: #f1f3f5;  /* primary text (was near-black) */
--color-falcon-neutral-900: #ffffff;  /* maximum contrast text */
```

But dark.css line 31 says:
```
--falcon-color-text: var(--falcon-color-neutral-50);
```

`--falcon-color-neutral-50` in DARK mode is the LIGHT-mode value `#f5f7f8` (the primitives file `colors.css` just aliases SSOT, and the SSOT light value `#f5f7f8` for neutral-50 gets REMAPPED to `#2d3748` (elevated surface) per dark SSOT line 397).

So `var(--falcon-color-neutral-50)` in dark mode resolves to `#2d3748` (elevated surface — dark gray). But `--falcon-color-text` should be the brightest contrast text — that's `--falcon-color-neutral-900` (`#ffffff` in dark).

**GAP in dark.css line 31**: `--falcon-color-text: var(--falcon-color-neutral-50)` resolves to `#2d3748` in dark, which is barely-darker than the page canvas `#1a1a2e`. Body text would be invisible. This is either:
- A bug (should be `var(--falcon-color-neutral-900)` to get `#ffffff`).
- A misunderstanding on my part of the cascade direction.

Re-reading carefully: dark.css line 31 says `--falcon-color-text: var(--falcon-color-neutral-50)`. Reading the SSOT dark block lines 391-417, in dark mode `--color-falcon-neutral-50: #2d3748` (elevated surface). `--falcon-color-neutral-50` in `primitives/colors.css:37` is `var(--color-falcon-neutral-50, #f5f7f8)`. So in dark mode `--falcon-color-neutral-50` resolves to `#2d3748` (dark). That can't be body text.

**LIKELY BUG**: dark.css line 31 should be `var(--falcon-color-neutral-900)` for the SSOT cascade to invert it correctly to white. Or, the dark.css was written assuming the primitives layer was NOT yet updated to alias SSOT — i.e., a regression from when dark.css was a standalone fallback before SSOT existed.

Need a runtime QA verification. Flagging as GAP — see TOKEN_FLOW_REPORT cascade resolution section.

#### Per-component bypass overrides (lines 48-177)

Components that need explicit dark overrides because they have hardcoded `rgba()` values:

| COMPONENT | TOKENS OVERRIDDEN | REASON |
|---|---|---|
| Input | `--falcon-input-shadow-focus`, `--falcon-input-shadow-error`, `--falcon-input-ring-color-focus` | hardcoded teal rgba in base |
| Button | `--falcon-button-shadow-focus` | hardcoded teal rgba |
| Dialog | `--falcon-dialog-backdrop-bg`, `--falcon-dialog-panel-bg`, `--falcon-dialog-panel-color`, `--falcon-dialog-panel-shadow`, `--falcon-dialog-title/description/body-color`, `--falcon-dialog-close-bg-hover` | dialog needs neutral-50 (elevated) on dark + stronger shadow |
| Menu | `--falcon-menu-panel-bg/border/shadow`, `--falcon-menu-item-bg-hover`, `--falcon-menu-trigger-bg-hover` | menu panel needs elevated surface treatment |
| Toast | `--falcon-toast-bg/color/border/shadow`, `--falcon-toast-title/message-color`, `--falcon-toast-dismiss-bg-hover`, `--falcon-toast-icon-info-bg/color`, `--falcon-toast-icon-warning-bg` | toast severity icons + surface |
| Badge | (auto-inherits — comment on line 103-104) | |
| Avatar | `--falcon-avatar-status-ring-color: var(--color-falcon-neutral-50)` | status ring needs to be visible on dark |
| Empty state | (auto-inherits — comment on line 110) | |
| Wizard | `--falcon-wizard-btn-back-fg/border`, `--falcon-wizard-btn-draft-fg` | wizard buttons need dark-canvas color |
| Stepper | `--falcon-stepper-circle-shadow-active/focus`, `--falcon-stepper-error-ring-shadow` | hardcoded rgba halos |
| Table | `--falcon-table-loading-overlay-bg: rgba(26, 26, 46, 0.75)` | loading scrim needs to match dark canvas |
| Data-table | `--falcon-data-table-loading-overlay-bg` | same |
| Calendar | `--falcon-calendar-focus-ring-color`, `--falcon-calendar-day-disabled-bg/color`, `--falcon-date-picker-input-bg-error` | hardcoded teal alpha + disabled day bg |
| Uploader | `--falcon-uploader-dropzone-bg`, `--falcon-uploader-badge-bg-uploading`, `--falcon-uploader-item-bg-hover` | dropzone bg, hover states |
| Single-uploader | `--falcon-single-uploader-empty-bg` | dropzone bg |
| Table rows | `--falcon-table-row-bg-hover/selected/focus` | row state colors |
| Tree-table | `--falcon-tree-table-header-bg`, `--falcon-tree-table-row-bg-hover`, `--falcon-tree-table-badge-bg` | row + header + badge bg |
| Tabs | `--falcon-tabs-rc-tab-bg-active`, `--falcon-tabs-rc-card-bg-selected/border-color-hover`, `--falcon-tabs-rc-radio-border-color` | radio-card mode visual states |
| Tree | `--falcon-tree-indicator-bg/border-color` | indicator on dark canvas |
| Multi-select / Dropdown / Combobox | chip bg + option bg-hover/active | chip + option visual states |

**Total**: ~70 component-level overrides in dark.css.

---

## What MOVES vs what STAYS — invariant table

### MOVES in dark mode

| Token family | Moves? | Where the change lives |
|---|---|---|
| `--color-falcon-neutral-*` (27 stops) | YES | SSOT dark block (lines 391-417) |
| Surface aliases `--color-falcon-bg-page`, `--color-falcon-bg-surface` | ADDED ONLY in dark | SSOT dark block (lines 419-421) |
| Shadows `--shadow-falcon-*` (9 tokens) | YES (stronger alpha) | SSOT dark block (lines 423-431) |
| Focus rings (3 tokens) | YES (lighter teal alpha) | SSOT dark block (lines 433-436) |
| `--color-falcon-teal-option` / `--color-falcon-teal-mid` | YES | SSOT dark block (lines 438-440) |
| `--color-falcon-teal-alpha-*` (5 tokens) | YES (teal-400 base instead of teal-700) | SSOT dark block (lines 442-447) |
| `--text-muted` alias | YES | SSOT dark block (line 450) |
| `--falcon-color-{primary,danger,success,warning}` semantic intent | YES | dark.css (lines 13-21) |
| `--falcon-color-{surface,surface-muted,surface-subtle,surface-disabled,surface-readonly}` | YES | dark.css (lines 24-28) |
| `--falcon-color-{text,text-muted,text-subtle,text-disabled,text-placeholder}` | YES (with possible GAP — see above) | dark.css (lines 31-35) |
| `--falcon-color-{border,border-hover,border-strong,border-disabled}` | YES | dark.css (lines 38-41) |
| `--falcon-color-{focus-ring,error-ring}` | YES (brighter alpha) | dark.css (lines 44-45) |
| Component-specific hardcoded RGBA halos | YES | dark.css per-component bypass (lines 48-177) |

### STAYS stable (no dark override)

| Token family | Why stable |
|---|---|
| Brand teal swatches (`teal-50`/`100`/.../`900`) | Intentional — brand color identical in both modes |
| Status colors (green/red/amber/blue 500) | Intentional — semantic colors stay consistent for accessibility |
| Lilac / mint / brand-tenant accents | Decorative; no functional need to flip |
| Type scale `--text-*` | Geometry stable |
| Spacing `--spacing-*` | Geometry stable |
| Radii `--radius-*` | Geometry stable |
| Border widths `--falcon-border-width-*` | Geometry stable |
| Sizing `--falcon-size-*` (control/icon/tile/stepper) | Geometry stable |
| Breakpoints `--breakpoint-*` | Geometry stable |
| Motion `--duration-*`, `--ease-*` | Motion stable |
| Keyframes (`menuIn`, `falcon-fade`, etc.) | Animation independent of mode |
| Z-index `--z-falcon-*` | Layering stable |
| Background-image rail gradients | Stable — uses teal alpha derivatives which DO update via cascade |
| Tracking `--tracking-*` | Typography stable |

---

## Geometry stability is a load-bearing decision

The SSOT comment at lines 367-368 explicitly documents the rule:

> Geometry (sizes / radii / spacing / motion) is STABLE across modes. Only surface / text / border / shadow tokens invert here.

This means dark mode never reflows the page. Component heights, paddings, gaps, radii — all the same. Only colors, shadows, focus rings, surfaces invert. This is what makes dark mode tractable: nothing recomputes layout.

---

## Brand teal stays unchanged

The SSOT comment at lines 372-373 documents the intentional choice:

> Brand teal (#124c52) intentionally unchanged — teal is a brand color that must remain visible in both light and dark contexts.

`--color-falcon-teal-500` = `#124c52` in BOTH light and dark. Brand recognition over auto-invert.

(The alpha derivatives DO flip — they use teal-700 base in light, teal-400 base in dark — because alpha overlays need to retain LEGIBILITY at low opacity on the underlying canvas.)

---

## Light mode is implicit

`libs/falcon-ui-tokens/src/themes/light.css` is 10 lines. It's an explicit OPT-IN block for `[data-theme='light']` that re-asserts the semantic intent already declared in `semantic/semantic.css`. The light theme is the default — no special activation needed.

---

## Verification rule

A future Brain SK build agent should run this sequence to verify dark mode behavior:

1. Set `<html class="app-dark">`.
2. Verify every `--color-falcon-neutral-*` has flipped (`getComputedStyle(html).getPropertyValue('--color-falcon-neutral-0')` returns `#1a1a2e`, not `#ffffff`).
3. Verify every component's surface/text/border colors auto-cascade via the neutral remap.
4. Verify hardcoded-rgba components (input/button/stepper/etc.) honor the dark.css per-component overrides.
5. Verify GEOMETRY is unchanged (run a layout-snapshot diff between light and dark; should be byte-identical except in color-bearing rules).

---

## Known gaps

1. **dark.css line 31**: `--falcon-color-text: var(--falcon-color-neutral-50)` likely resolves to `#2d3748` in dark mode (barely darker than canvas). Suspected bug — should be `var(--falcon-color-neutral-900)`. Needs runtime QA verification.
2. **dark.css lines 25-28**: surface-* tokens use `--falcon-color-neutral-{800,900}` — these in dark mode resolve to LIGHT colors (`#f1f3f5`, `#ffffff`). Surfaces (panels, cards) on dark canvas should be elevated grays. Likely intentional given the SSOT inverts neutral-900 to white, but the intent comment is unclear.
3. **`themes/light.css`**: minimal contents; the explicit `[data-theme='light']` selectors are LIGHT carry-over and may not even be referenced.
4. **No documented dark-mode QA suite**: per-component visual diff between light and dark not gated.

---

## Cross-references

- See `THEME_SSOT_AUDIT.md` for dark block enumeration.
- See `COMPONENT_TOKEN_FILES_AUDIT.md` for which component tokens have dark overrides.
- See `TOKEN_FLOW_REPORT.md` for the cascade resolution.
- See `UPGRADE_CANDIDATES.md` UP-06 for collapsing 178-line dark.css via teal-alpha cascade.
