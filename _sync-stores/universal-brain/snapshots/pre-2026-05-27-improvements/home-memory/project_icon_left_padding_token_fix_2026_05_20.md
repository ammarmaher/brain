---
name: project-icon-left-padding-token-fix-2026-05-20
description: "🟢 BUILD-GREEN 2026-05-20 — icon-left/right padding on all 6 -tw form controls now driven by --falcon-input-icon-input-padding-{start,end}. Falcon spacing override of --spacing-7 to 40px was making the hard-coded ps-7 run away, leaving a ~24px dead-gap between the icon and the value text on Add-Client wizard Steps 3 & 4 (CommChannels + Applications)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 66f03247-c8c5-4b1c-b115-73d20781b037
---

# Icon-left / icon-right padding — token-driven across all 6 -tw form controls

**Status:** 🟢 BUILD-GREEN 2026-05-20 — falcon-ui-tokens OK (registry 3614 → 3622 tokens), falcon-ui-core 43.8 s OK, admin-console `85efdee0809dd69e` 30.2 s OK. Not yet runtime-verified in browser.

## Problem

Add-Client wizard Step 3 (CommChannels) + Step 4 (Applications) `<falcon-angular-input [iconLeft]="true">` (the per-row price-value cell) rendered the SAR glyph at the very left edge and "123" text ~24 px to its right, with a visibly broken dead-gap. User screenshot (DevTools) showed the native `<input>` carrying `padding: 0 0 0 40px`.

## Root cause (two-headed)

1. **[CODE] [falcon-tailwind-tokens.css:274](Falcon/falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css:274)** — Falcon overrides Tailwind stock `--spacing-7` from 1.75 rem (28 px) → 2.5 rem (40 px). Every consumer of the literal `ps-7` / `pe-7` utility silently bloated from 28 px → 40 px.
2. **[CODE] 6 Stencil `-tw` components** (all listed below) hard-coded the literal `'ps-7'` / `'pe-7'` whenever `iconLeft` / `iconRight` was true — bypassing the existing-but-unconsumed token `--falcon-input-icon-input-padding-{start,end}` declared in `input.tokens.css:218`.

The token had been **defined as a placeholder in May 17's iconLeft unification but never wired**. Result: every icon-left form control on the platform inherited the 40 px run-away.

## Fix

**Token value tightened.** [CODE] `libs/falcon-ui-tokens/src/components/input.tokens.css:218-219`
```css
/* was 1.75rem (28px) — design target before Falcon spacing override */
--falcon-input-icon-input-padding-start: 1.5rem;  /* 24px */
--falcon-input-icon-input-padding-end:   1.5rem;
```
For a 14 px icon at `start-2.5` (10 px), this lands the value text at x ≈ 33 px → ~8 px breathing room from icon-end (x ≈ 25). For the default 16 px icon, ~6 px gap. Both inside the "normal input with icon" comfort band.

**6 Stencil files now consume the token** (literal `ps-7` / `pe-7` replaced with `ps-[length:var(--falcon-input-icon-input-padding-start)]` / `pe-[length:var(--falcon-input-icon-input-padding-end)]`):
- `libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx:208-217`
- `libs/falcon-ui-core/src/components/falcon-email-field-tw/falcon-email-field-tw.tsx:189-193`
- `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx:350`
- `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx:505`
- `libs/falcon-ui-core/src/components/falcon-multi-select-tw/falcon-multi-select-tw.tsx:536`
- `libs/falcon-ui-core/src/components/falcon-textarea-tw/falcon-textarea-tw.tsx:207-215`
- `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx:453-455` (pe only — has no iconLeft)

7 files total. No public API change. The native control class strings updated; consumers (Angular wrappers + apps) need no edit.

## Why a token (and not per-component override)

User explicitly asked for "a token … change the value for this token". The token already existed but wasn't consumed. The fix:
- **One mutation point** — change `--falcon-input-icon-input-padding-start` → updates all 7 form controls platform-wide.
- **Density-aware** — token can be re-declared in `density/compact.css` / `density/comfortable.css` if Studio wants different inset per density (currently a single rem value).
- **Falcon-spacing-safe** — explicit rem instead of `--spacing-N` insulates the icon padding from future spacing-scale tweaks.

## Visual impact

Add-Client wizard Step 3 (CommChannels) and Step 4 (Applications) — price-value cell:
- **Before:** icon-end at x ≈ 25, value text at x ≈ 49, **dead gap ≈ 24 px**.
- **After:** icon-end at x ≈ 25, value text at x ≈ 33, **gap ≈ 8 px** (normal).

Same fix flows to every other `iconLeft="true"` / `iconRight="true"` Falcon form control across the platform — search inputs, filter panels, every wizard step that uses an icon-prefixed field. No consumer code change.

## Tailwind v4 verification

`dist/apps/admin-console/styles.css` ships:
```css
.ps-\[length\:var\(--falcon-input-icon-input-padding-start\)\] {
  padding-inline-start: var(--falcon-input-icon-input-padding-start);
}
```
plus the matching `pe-` rule. Tailwind v4's JIT scanner correctly emits the arbitrary-value utility from the Stencil-bundled JS string.

## Related memories

Same Falcon-spacing-override gotcha as [[project_shadow_row_price_input_padding_fix_2026_05_20]] (shadow row used `ps-8` → 48 px, fixed to `ps-2.5`). Both cases trace back to `--spacing-N >= 5` not matching stock Tailwind. This fix is the **platform-wide** sibling of that single-consumer fix.

## Files touched

1. `libs/falcon-ui-tokens/src/components/input.tokens.css` (1.75rem → 1.5rem + comment)
2. `libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx`
3. `libs/falcon-ui-core/src/components/falcon-email-field-tw/falcon-email-field-tw.tsx`
4. `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx`
5. `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx`
6. `libs/falcon-ui-core/src/components/falcon-multi-select-tw/falcon-multi-select-tw.tsx`
7. `libs/falcon-ui-core/src/components/falcon-textarea-tw/falcon-textarea-tw.tsx`
8. `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx`
