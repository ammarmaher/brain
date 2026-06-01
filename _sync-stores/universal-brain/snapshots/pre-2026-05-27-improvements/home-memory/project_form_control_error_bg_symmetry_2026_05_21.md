---
name: form-control-error-bg-symmetry-2026-05-21
description: "5-file core fix aligning textarea/email-field/phone-field/multi-select/otp bg-error tokens to the input.tokens.css golden path — var(--color-falcon-red-50,"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2d6e507-4803-44cf-8bfe-71a14924b69e
---

🟢 BUILD-GREEN 2026-05-21 — error-background symmetry pass across 5 form-control token files.

**Scope.** User-approved fix limited to the 5 form-input-style components whose `*-bg-error` token had drifted from the input.tokens.css reference (`var(--color-falcon-red-50, #fef5f5)`). Out-of-scope (deliberately untouched): checkbox/radio (white-bg-on-error by design), switch.track / stepper.circle / uploader+single-uploader (different visual semantic — solid track, indicator disc, translucent dropzone, progress-fill bar), toast.icon-error-bg, dialog alert banners, and the `--color-falcon-red-500, #a1191d` border-fallback drift in input + textarea (`#a1191d` is actually red-700; canonical red-500 is `#dc2626`).

**Canonical SoT** ([CODE] `falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css:81-85`):
- `--color-falcon-red-50: #fef5f5` ← error background
- `--color-falcon-red-100: #fde2e4` (NOT a background tint)
- `--color-falcon-red-500: #dc2626` ← border/icon
- `--color-falcon-red-700: #a1191d` ← text

**Reference pattern** ([CODE] `libs/falcon-ui-tokens/src/components/input.tokens.css:83`): `--falcon-input-bg-error: var(--color-falcon-red-50, #fef5f5)`. Border-radius axis already symmetric across all components — no `-radius-error` overrides exist anywhere; every form control declares ONE `--*-border-radius` shared by all states.

**The 5 edits** (1 line each, `red-100` → `red-50` + normalized `#fef5f5` fallback):

| File | Line | Old `bg-error` | New |
|---|---|---|---|
| `libs/falcon-ui-tokens/src/components/textarea.tokens.css` | 87 | `red-100, #fef5f5` (var-drift) | `red-50, #fef5f5` |
| `libs/falcon-ui-tokens/src/components/email-field.tokens.css` | 61 | `red-100, rgba(220,38,38,0.04)` (var + fallback wrong) | `red-50, #fef5f5` |
| `libs/falcon-ui-tokens/src/components/phone-field.tokens.css` | 68 | `red-100, rgba(220,38,38,0.04)` | `red-50, #fef5f5` |
| `libs/falcon-ui-tokens/src/components/multi-select.tokens.css` | 100 | `red-100, #fef5f5` | `red-50, #fef5f5` |
| `libs/falcon-ui-tokens/src/components/otp.tokens.css` | 68 | `red-100, #fee2e2` | `red-50, #fef5f5` |

**Net effect.** In production (where CSS vars resolve), all 8 form-input-style components (`input`, `date-picker`, `dropdown`, `textarea`, `email-field`, `phone-field`, `multi-select`, `otp`) now render the same `#fef5f5` background on `[invalid]` state. The previous behaviour resolved `red-100 = #fde2e4` (more saturated pink) on textarea/multi-select/otp and `rgba(220,38,38,0.04)` (translucent overlay, color-bleed from row beneath) on email-field/phone-field — three visually distinct error treatments for what is semantically the same state.

**Consumer scan.** No Stencil `.css`, `.tsx`, or Tailwind classmap edits needed — every consumer reads through the component's own `--*-bg-error` token. Grep confirmed all 8 form-input wrappers reference `var(--falcon-*-bg-error)` and never inline a literal red.

**Build verification.**
- `nx build falcon-ui-tokens` — PASS; token registry recompiled: 51 components / 3622 tokens.
- `nx build falcon-ui-core` — PASS in 39.63s; 103 Stencil component proxies written. Lone pre-existing `scrollHeight` prop-naming warning at [CODE] `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:165` is unrelated to this change.

**NOT verified.** Browser runtime not exercised. The mechanical-correctness of the 1-line variable flip is high, but actually triggering each form-control's `[invalid]`/error state in a live app to eyeball the rendered `#fef5f5` background was not done.

**Rule for future work.** Any new form-input-style Stencil component MUST declare `--<comp>-bg-error: var(--color-falcon-red-50, #fef5f5)` in its `*.tokens.css`. Border-color-error stays `var(--color-falcon-red-500, #dc2626)` (canonical) — flag any new occurrence of `#a1191d` as red-500 fallback as drift. Border-radius is single-radius-all-states; do NOT add `-radius-error` overrides.

Linked: [[z-index-unified-ladder-2026-05-20-rev3]], [[icon-left-right-padding-token-fix]].
