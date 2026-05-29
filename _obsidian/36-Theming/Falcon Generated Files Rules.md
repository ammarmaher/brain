---
type: reference
library: "[[Tailwind CSS]]"
topic: generated-files
priority: critical
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Generated Files Rules — what's auto-generated, what's manual ***
*** Hand-editing a generated file is silently overwritten by next codegen ***
*** Read-only audit — rules only, no regeneration this turn ***

# Falcon Generated Files Rules

> Every file in the Falcon workspace is either source-of-truth (manually edited) or generated output (codegen). Hand-editing a generated file is silently wiped on the next codegen run. This note enumerates every generated file in the theme/component chain and the DO-NOT-EDIT contract.

## The cardinal rule

> **If a file has a banner that starts with `AUTO-GENERATED` — DO NOT EDIT IT.**
>
> Edit the SOURCE that the codegen reads from. Re-run the codegen. The generated file updates automatically.

## Generated files in the theme chain

### Tier 1 — Token TS bridge

| Generated file | Source | Codegen | Runs on |
|---|---|---|---|
| `libs/falcon-theme/src/tokens.ts` | `falcon-tailwind-tokens.css` `@theme` block | `libs/falcon-theme/scripts/generate-tokens-ts.mjs` | `nx run falcon-theme:generate-tokens-ts` (Nx-cached) |

**File contents banner (verified):**
```
/*** AUTO-GENERATED — DO NOT EDIT BY HAND ***/
/*** Source: libs/falcon-theme/src/falcon-tailwind-tokens.css ***/
/*** Regenerate: nx run falcon-theme:generate-tokens-ts ***/
/*** Tokens: 276 ***/
```

**What's inside:**
- `tokens` const — 276 `name: 'var(--name)'` entries
- `tokenValues` const — same 276 tokens with raw values
- 10 grouped exports: `colors`, `spacing`, `radii`, `shadows`, `typography`, `breakpoints`, `motion`, `zIndex`, `sizing`, `misc`
- Derived types: `FalconTokens`, `FalconTokenName`, `FalconTokenValues`

**To extend:** edit `@theme { … }` in the SSOT CSS file, then re-run codegen.

### Tier 2 — Stencil component aggregators (Stencil build)

| Generated file | Source | Codegen | Runs on |
|---|---|---|---|
| `libs/falcon-ui-core/src/components.ts` (+ `.js` + `.d.ts` + maps) | All Stencil component sources | Stencil compiler | `nx build falcon-ui-core` |
| `libs/falcon-ui-core/src/define-custom-elements.ts` (+ `.js` + `.d.ts` + maps) | Stencil components | Stencil compiler | Stencil build |
| `libs/falcon-ui-core/src/define-falcon-component.ts` (+ `.js` + `.d.ts` + maps) | Stencil components | Stencil compiler | Stencil build |
| `libs/falcon-ui-core/src/define-falcon-tw-component.ts` (+ `.js` + `.d.ts` + maps) | Stencil `-tw` components | Stencil compiler | Stencil build |
| `libs/falcon-ui-core/src/index.ts` (+ `.js` + `.d.ts` + maps) | Workspace barrel | Stencil compiler | Stencil build |

**Indicator:** the `.js` + `.js.map` + `.d.ts` + `.d.ts.map` quartet next to every `.ts` file is a strong "compiled output, do not edit" smell. The `.ts` files in this set ARE the source for Stencil's own compiler but treat them as Stencil-managed — don't edit by hand.

### Tier 3 — Theme Studio registry

| Generated file | Source | Codegen | Runs on |
|---|---|---|---|
| `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | Per-component contracts at `libs/falcon-ui-tokens/src/components/*.tokens.css` | (codegen tool TBD — flagged for Wave 1A audit) | Pre-Studio build |

**What's inside (inferred from naming convention):**
- Mirror of every component's tokens
- Drives Studio's token explorer UI
- Live preview of token edits

**Risk:** ⚠️ if drift between this generated file and the source contracts goes unchecked, Studio shows stale knobs to users.

### Tier 4 — App-level Tailwind safelist

| Generated file | Source | Codegen | Runs on |
|---|---|---|---|
| `apps/host-shell/src/tailwind.css` — `@source inline(...)` block (~2113 entries) | Hand-curated today; **P1-38 proposes auto-generation** from `*-tailwind-classes.ts` helpers | (P1-38 / UP-05 — not implemented) | Future build step |

**Risk:** ❌ today this is manually maintained → 3 apps' safelists drifted (host-shell 2113, admin-console 2050, mgmt-console 0). The P1-38 fix would derive safelist from class-map files.

### Tier 5 — Nx / TypeScript / Vite generated cache

| Generated file/folder | Source | Codegen |
|---|---|---|
| `.nx/cache/<hash>/` | Nx tasks (incl. token codegen) | Nx orchestrator |
| `.angular/cache/` | Angular CLI | Angular CLI |
| `node_modules/` | `package.json` lockfile | npm |
| `dist/` | Build outputs | Various builders |
| `*.tsbuildinfo` | TypeScript incremental | tsc |

**These are all gitignored** and never edited by hand. Mentioned only for completeness.

## DO-EDIT files (the SoT layer)

These are the manually edited files that drive the generated chain. Editing these is the correct path.

| File | What it owns | What it triggers |
|---|---|---|
| `libs/falcon-theme/src/falcon-tailwind-tokens.css` | The 276 SSOT `@theme` tokens | Re-run `generate-tokens-ts` → updates `tokens.ts` |
| `libs/falcon-ui-tokens/src/components/<name>.tokens.css` (51 files) | Per-component CSS-var contracts | Stencil rebuild + (future) Studio registry regen |
| `libs/falcon-ui-tokens/src/semantic/semantic.css` | Tier-2 semantic intent (`--falcon-color-primary` etc.) | Cascades through all consumers |
| `libs/falcon-ui-tokens/src/themes/dark.css` | Dark cascade overrides | All consumers when `.app-dark` active |
| `libs/falcon-ui-tokens/src/density/comfortable.css` + `compact.css` | Density variants | All consumers when `[data-density]` set |
| `libs/falcon-ui-tokens/src/rtl/rtl.css` | RTL flips | All consumers when `dir="rtl"` |
| `libs/falcon-ui-core/src/components/<name>/<name>.tsx` (103 files) | Stencil TSX templates | Stencil rebuild → Web Component |
| `libs/falcon-ui-core/src/components/<name>/<name>.css` | Stencil scoped CSS | Stencil rebuild |
| `libs/falcon-ui-core/src/tailwind/<name>-tailwind-classes.ts` (95 files) | Runtime class-string composers | Editable but require static-string discipline (Tailwind text scanner) |
| `libs/falcon-ui-core/src/angular-wrapper/components/<name>/<name>.component.ts` (62 entries) | Angular wrappers | Angular rebuild |
| `apps/<app>/src/tailwind.css` | App-level Tailwind entry + scan paths + safelist | Vite/PostCSS rebuild |

## DO-NOT-EDIT files (full enumeration)

Per the audit, these files should NEVER be edited by hand. Any change here is silently wiped:

| File | Reason | Banner present? |
|---|---|---|
| `libs/falcon-theme/src/tokens.ts` | Generated by `generate-tokens-ts.mjs` | ✅ Explicit |
| `libs/falcon-ui-core/src/components.ts/.js/.d.ts/.map` | Stencil-managed barrel | ⚠️ No explicit banner — confusing |
| `libs/falcon-ui-core/src/define-custom-elements.ts/.js/.d.ts/.map` | Stencil-managed loader | ⚠️ No explicit banner |
| `libs/falcon-ui-core/src/define-falcon-component.ts/.js/.d.ts/.map` | Stencil-managed helper | ⚠️ No explicit banner |
| `libs/falcon-ui-core/src/define-falcon-tw-component.ts/.js/.d.ts/.map` | Stencil-managed `-tw` helper | ⚠️ No explicit banner |
| `libs/falcon-ui-core/src/index.ts/.js/.d.ts/.map` | Stencil-managed barrel | ⚠️ No explicit banner |
| `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` | Studio registry codegen | ✅ Explicit per filename `.generated.ts` |
| All `*.js`, `*.js.map`, `*.d.ts.map` files next to a `*.ts` | Build outputs | ⚠️ Convention — no banner |

**Recommendation (audit finding):** add explicit `AUTO-GENERATED` banner to the Stencil-managed files in `libs/falcon-ui-core/src/`. Today only the `falcon-theme` codegen has the discipline; Stencil-emitted `.ts` files lack the warning. New contributors might edit them by accident.

## Verification rules

Before editing ANY file in the theme/component chain:

1. **Read the top of the file.** If you see `AUTO-GENERATED — DO NOT EDIT BY HAND`, stop.
2. **Look at the file name.** Files ending in `.generated.ts` or having `.map` siblings are likely generated.
3. **Check `project.json` `outputs` arrays.** If a path appears there, it's a build output.
4. **Look for `.js` + `.js.map` + `.d.ts` next to a `.ts` file.** That's the compiled-output quartet.
5. **If unclear, ask** the architect or grep the file path in workspace scripts/Nx configs.

## Audit findings

| Finding | Severity | Notes |
|---|---|---|
| `tokens.ts` has explicit DO-NOT-EDIT banner ✅ | 🟢 OK | Cleanest example |
| Stencil-emitted `.ts` files lack DO-NOT-EDIT banner | 🟡 MED | Confusing for new contributors |
| `component-tokens.generated.ts` codegen tool not audited | ⚪ TBD | Wave 1A item |
| Tailwind safelist hand-maintained (P1-38) — drifted across 3 apps | 🟡 MED | Should be auto-generated from class-maps |
| `*.tsbuildinfo` + cache folders not gitignored / not flagged | 🟢 OK | Standard hygiene |

## See also

- [[Falcon Theme Folder Structure]] — where files live
- [[Falcon Token Generation Flow]] — the pipeline
- [[Falcon Component Library Structure]] — Stencil + wrapper layout
- [[Falcon Studio Token Registry Flow]] — Studio's generated registry
- [[Falcon Wave 1A Readiness]] — readiness gate before any Wave 1 implementation
- [[Tailwind Source Detection]] — why class-map runtime strings need safelist or static literals
- Supporting evidence (Brain Outputs): [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #priority/critical #audit

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
