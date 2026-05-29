---
type: reference
library: "[[Tailwind CSS]]"
topic: token-generation
priority: critical
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Token Generation Flow — the full pipeline ***
*** From @theme SSOT → tokens.ts → component contracts → templates ***
*** Read-only audit — no code changes, no regeneration ***

# Falcon Token Generation Flow

> The full token pipeline: how a single hex value flows from the SSOT `@theme` block all the way to a class name in an Angular template. Audited against live source 2026-05-20.

## The verified pipeline (current state)

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. SOURCE OF TRUTH (manually edited)                                 │
│  libs/falcon-theme/src/falcon-tailwind-tokens.css                     │
│  @theme { --color-falcon-teal-700: #0d3f44; … }                       │
│  276 tokens · primitives + 2 semantic stubs                           │
└──────────────────────────────────────────────────────────────────────┘
                          │                          │
                          │ Codegen                  │ CSS @import
                          ▼                          ▼
┌──────────────────────────────────────┐  ┌─────────────────────────────────────┐
│  2. TS BRIDGE (auto-generated)        │  │  3. PRIMITIVES MIRROR                │
│  libs/falcon-theme/src/tokens.ts      │  │  libs/falcon-ui-tokens/src/          │
│  Banner: "DO NOT EDIT BY HAND"        │  │  primitives/colors.css               │
│                                       │  │  --falcon-color-teal-50:             │
│  Built by:                            │  │    var(--color-falcon-teal-50, …)   │
│  nx run falcon-theme:                 │  │                                      │
│    generate-tokens-ts                 │  │  Bridge pattern: Stencil layer       │
│                                       │  │  inherits SSOT values with hex       │
│  Source: parses @theme block          │  │  fallback for standalone usage       │
│  Output: 276 tokens grouped into 10   │  │                                      │
│  axes (colors / spacing / radii /     │  │                                      │
│  shadows / typography / breakpoints / │  │                                      │
│  motion / zIndex / sizing / misc)     │  │                                      │
└──────────────────────────────────────┘  └─────────────────────────────────────┘
                          │                          │
                          │ Future: React/Vue        │ Chains into…
                          ▼                          ▼
                  (consumers TBD)         ┌─────────────────────────────────────┐
                                          │  4. SEMANTIC LAYER                   │
                                          │  libs/falcon-ui-tokens/src/          │
                                          │  semantic/semantic.css               │
                                          │  --falcon-color-primary:             │
                                          │    var(--falcon-color-teal-700, …)  │
                                          │                                      │
                                          │  ⚠️ Declared in :root, not @theme   │
                                          │     → no Tailwind utilities          │
                                          │     → templates fall back to         │
                                          │       bg-[var(--falcon-color-X)]    │
                                          │       arbitrary syntax (P1-37 fix)  │
                                          └─────────────────────────────────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────────────────────┐
                                          │  5. THEME OVERRIDES                  │
                                          │  themes/light.css (opt-in)           │
                                          │  themes/dark.css (178 lines per-     │
                                          │    component bypass)                 │
                                          │                                      │
                                          │  density/comfortable.css (default)  │
                                          │  density/compact.css ([data-density])│
                                          │  rtl/rtl.css (dir=rtl flips)        │
                                          └─────────────────────────────────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────────────────────┐
                                          │  6. COMPONENT CONTRACTS (51 files)  │
                                          │  libs/falcon-ui-tokens/src/          │
                                          │  components/<name>.tokens.css        │
                                          │                                      │
                                          │  :where(falcon-button, falcon-       │
                                          │    button-tw, falcon-angular-        │
                                          │    button, …) {                      │
                                          │      --falcon-button-bg-default:     │
                                          │        var(--falcon-color-primary); │
                                          │      …                               │
                                          │  }                                   │
                                          │                                      │
                                          │  ⚠️ Many slots chain through Layer-1│
                                          │     primitives directly, not Layer-2│
                                          │     semantic (P0-08 fallback drift) │
                                          └─────────────────────────────────────┘
                                                     │
                                                     ▼
                          ┌────────────────────────────────────────────┐
                          │  7. CONSUMPTION                             │
                          │                                             │
                          │  (a) Stencil scoped CSS                     │
                          │      libs/falcon-ui-core/src/components/    │
                          │      <name>/<name>.css                      │
                          │      .button { background: var(--falcon-    │
                          │        button-bg-default); }                │
                          │                                             │
                          │  (b) Stencil TSX template (Tailwind mode)   │
                          │      libs/falcon-ui-core/src/components/    │
                          │      <name>-tw/<name>-tw.tsx                │
                          │      <button class="bg-falcon-teal-700">    │
                          │                                             │
                          │  (c) Tailwind class-map TS                  │
                          │      libs/falcon-ui-core/src/tailwind/      │
                          │      <name>-tailwind-classes.ts             │
                          │      "bg-falcon-teal-700 hover:bg-falcon-…" │
                          │      (strings concatenated at runtime —     │
                          │      needs @source inline safelist)         │
                          │                                             │
                          │  (d) Angular template (apps)                │
                          │      <falcon-angular-button variant="…"     │
                          │        class="bg-falcon-surface-primary">   │
                          │      (consumes Tailwind utility born from   │
                          │      SSOT @theme token)                     │
                          └────────────────────────────────────────────┘
                                                     │
                                                     ▼
                          ┌────────────────────────────────────────────┐
                          │  8. STUDIO (parallel consumer)              │
                          │  libs/falcon-studio/src/lib/registry/       │
                          │  component-tokens.generated.ts              │
                          │  (auto-generated mirror of contracts —      │
                          │  drives Studio token explorer UI)           │
                          └────────────────────────────────────────────┘
```

## The 3 codegen scripts (audited)

### A — `falcon-theme/scripts/generate-tokens-ts.mjs`

**Input:** `libs/falcon-theme/src/falcon-tailwind-tokens.css`
**Output:** `libs/falcon-theme/src/tokens.ts`
**Tokens emitted:** 276 (current count per generated banner)
**Run via:** `nx run falcon-theme:generate-tokens-ts`
**Cache:** ✅ Nx cached (inputs: SSOT CSS + script itself)

**How it works:**
1. Reads `@theme { … }` block from SSOT CSS
2. Strips block comments (avoids `/* --token: x; */` false matches)
3. Parses `--name: value;` declarations with regex
4. Buckets each token into 10 semantic axes (`colors`, `spacing`, `radii`, `shadows`, `typography`, `breakpoints`, `motion`, `zIndex`, `sizing`, `misc`) by name prefix
5. Stable alphabetic sort within each axis
6. Emits two const blocks: `tokens` (var() references) + `tokenValues` (raw values) + 10 grouped exports
7. Adds banner: `AUTO-GENERATED — DO NOT EDIT BY HAND` + regen command + token count
8. Emits TS types (`FalconTokens`, `FalconTokenName`, `FalconTokenValues`)

**Invariants:**
- ❌ Never edit `tokens.ts` by hand — script wipes changes silently on next run.
- ✅ Re-run after any `@theme` block edit.
- ✅ Bucket function in script is the source of truth for axis assignment.

### B — `falcon-ui-tokens/scripts/build-token-registry.mjs`

**Purpose:** (Likely) builds a registry of per-component tokens for downstream tooling. Needs deep read to confirm.
**Risk:** ⚠️ Not yet audited in detail — flagged for [[Falcon Wave 1A Readiness]].

### C — `falcon-ui-tokens/scripts/scope-component-tokens.mjs`

**Purpose:** Lints / enforces the `:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])` selector shape across all 51 per-component contract files.
**Risk:** ⚠️ Status unknown — flagged for [[Falcon Wave 1A Readiness]].

## Consumption layers (in order)

| Layer | Where it lives | Consumes from | Edited? |
|---|---|---|---|
| Layer 1 — Primitives | `falcon-tailwind-tokens.css` `@theme` | (hardcoded values) | Manually ✅ |
| Layer 2 — Semantic | `semantic/semantic.css` `:root` | Layer 1 via `var()` | Manually ✅ |
| Layer 3 — Component | `components/<name>.tokens.css` `:where()` | Layer 2 (should) or Layer 1 (currently — drift) | Manually ✅ |
| Theme overrides | `themes/dark.css` `:where(.app-dark)` | Re-declares Layer 1 tokens | Manually ✅ |
| Density overrides | `density/compact.css` `[data-density]` | Re-declares Layer 3 tokens | Manually ✅ |
| Stencil scoped CSS | `components/<name>/<name>.css` | Layer 3 (`var(--falcon-button-bg-default)`) | Manually ✅ |
| Tailwind utility classes | (auto-generated by Tailwind v4 build) | Layer 1 + 2 (when in `@theme`) | Auto |
| Templates | Angular templates + Stencil TSX | Tailwind utilities | Manually ✅ |

## Cascade resolution (single value's full journey)

```
User toggles dark mode → <html class="app-dark"> set
   ↓
themes/dark.css redeclares --color-falcon-neutral-30 to #1e2741
   ↓
semantic.css: --falcon-color-surface inherits new value via var()
   ↓
components/button.tokens.css: --falcon-button-bg inherits via var()
   ↓
Stencil .button { background: var(--falcon-button-bg) } resolves to #1e2741
   ↓
Angular template <falcon-angular-button> renders with new background
   ↓
DevTools shows: background: #1e2741 (resolved from --color-falcon-neutral-30)
```

## Audit findings

| Finding | Severity | Source |
|---|---|---|
| **`tokens.ts` regenerates cleanly** | 🟢 OK | Verified — banner present, 276 tokens, script reads SSOT |
| **Semantic Tier-2 not in @theme** → no Tailwind utilities → templates fall back to `bg-[var(--falcon-X)]` arbitrary | 🔴 P0/P1 | [[Tailwind Falcon Alignment Scorecard]] Wave 1 Phase A · P1-37 |
| **Component contracts reference Layer-1 directly** (fallback drift) — button/input/dropdown/multi-select/phone/email/combobox have hex `#0d3f44` fallback that ≠ SSOT primitive `#124c52` | 🔴 P0-08 | Brain Outputs P0-08 / UP-01 |
| **178-line dark-mode bypass** in `themes/dark.css` — should collapse via alpha chain | 🟡 P1-39 | Brain Outputs P1-39 / UP-06 |
| **No per-component token-file shape lint** | 🟡 P1-40 | Brain Outputs P1-40 / UP-07 |
| **`build-token-registry.mjs` purpose not yet audited** | ⚪ TBD | Wave 1A item |
| **`scope-component-tokens.mjs` runtime status not verified** | ⚪ TBD | Wave 1A item |

## See also

- [[Falcon Theme Folder Structure]] — where every file lives
- [[Falcon Generated Files Rules]] — what's auto-generated, what's manual
- [[Falcon Tailwind Theme]] — the 5 governance rules
- [[Falcon Design Tokens]] — dual-system architecture (Tailwind layer + Stencil layer bridged)
- [[Tailwind Mental Model]] — the 3-layer token doctrine
- [[Tailwind Falcon Alignment Scorecard]] — the gap analysis
- Supporting evidence (linked, not authoritative): [TAILWIND_TOKEN_MAP](../../Brain%20Outputs/understanding/frontend/TAILWIND_TOKEN_MAP.md) · [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #priority/critical #audit

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
