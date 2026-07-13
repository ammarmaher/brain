# Falcon Cross-Framework — AUDIT (best-practice rubric §5)

Scope note: these are **generated-wrapper** libs (`falcon-ui-react`, `falcon-ui-vue`) + a **static demo catalog** (`falcon-ui-showcase-data`). The component-authoring dimensions (A Angular-21 idioms, B Stencil dual-render, D accessibility) are mostly **N/A** — the wrappers carry no authored logic, render the upstream custom elements, and inherit their a11y. The audit weights **E (cross-framework parity — the batch headline)** and **F (completeness / sync / drift)**, with light C (house-rule hygiene on the hand-written catalog).

## Rubric scorecard

| Dim | Verdict | One-line basis |
|---|---|---|
| **A — Angular 21** | ⚪ N/A | No Angular code in any of the three libs (React wrappers, Vue proxies, a TS data module). |
| **B — Stencil dual-render** | ⚪ N/A (inherited) | The wrappers don't author Shadow/`-tw` — they wrap BOTH twins equally (every base + every `-tw` element is wrapped in both frameworks). Parity of the twins is upstream (`falcon-ui-core`). |
| **C — Falcon house rules** | 🟡 minor | Generated files correctly carry DO-NOT-EDIT banners + `/*@__PURE__*/` tree-shake hints ✅. Showcase catalog: `*** ***`-style banners on `index.ts`/docs ✅; but a missing `$schema` file, a category-union omission, and a duplicated catalog (F-items) are hygiene gaps. No SCSS/hex/px (no styling anywhere) ✅. |
| **D — Accessibility** | ⚪ N/A (inherited) | Wrappers render the upstream elements; a11y lives in `falcon-ui-core`. |
| **E — Cross-framework parity** | ✅ **PASS (exemplary)** | **106 Stencil elements → 106 React → 106 Vue, identical tag set (100%).** Set-diff empty in all directions. The earlier "no React/Vue parity" flags are demonstrably FALSE. Shared token contract inherited. |
| **F — Completeness / sync / drift** | 🟠 medium | Wrappers are **in sync with current code** (the headline staleness check PASSES) but the **recon docs are stale** (say 93, actual 106); **0 tests** in all three libs; **0 in-repo consumers**; `registry.schema.json` missing; `notifications` category missing from the TS union; `stat-card` README claim partly stale; `index.ts.bak` orphan; showcase catalog duplicated into `demos/angular-playground`. |

**Area verdict: ✅ on the headline (parity), 🟠 medium overall** — driven entirely by **F (sync/drift/test-absence)**, every item `safe-local`. The generation pipeline is sound and the wrappers are genuinely current; the medium rating is hygiene + the "published-but-unconsumed, untested" posture, not a wrapper defect. **Zero HIGH-RISK-QUEUE items** (no public-API/behavior/PES/payment/destructive concerns — these are derivative outputs + static data).

---

## E — Cross-framework parity (the headline)

**PASS, exemplary.** Measured 2026-06-03:
- `[CODE]` Stencil element folders = **106** (`ls src/components/ | grep '^falcon-'`).
- `[CODE]` React `tagName` bindings = **106**; Vue `defineContainer` bindings = **106**.
- `[CODE]` `comm -23 stencil react` = **empty** (no Stencil element lacks a React wrapper).
- `[CODE]` `comm -23 stencil vue` = **empty** (no Stencil element lacks a Vue wrapper).
- `[CODE]` `diff react vue` = **empty** (React and Vue wrap the identical tag set).
- `[CODE]` `comm -13 stencil react` = **empty** (no React wrapper points at a non-existent element).

### Refutation of prior-batch "no React/Vue parity" flags
SPEC notes that several earlier component batches flagged specific components (e.g. `loader-overlay`) as lacking React/Vue parity. **Those flags are FALSE:**
- `falcon-loader-overlay` + `falcon-loader-overlay-tw`: React `[CODE]` `components.ts:1068,1087`; Vue `[CODE]` `index.ts:1390,1402`. **Both wrapped in both frameworks.**
- `falcon-loader-inline` + `-tw`: React `:1034,1051`; Vue `:1368,1379`. Wrapped.
- `falcon-organization-hierarchy-tree-tw` (tw-only element): React `:1203`; Vue `:1534`. Wrapped.
- Every other element verified by the empty set-diff above.

The likely origin of the false flag: a component-batch agent grepped the **Angular** `falcon-angular-*` wrapper set (or the showcase registry, which is a curated 28-subset) and concluded "no React/Vue wrapper" — but the React/Vue generation covers the **full** Stencil element set, not the Angular wrapper subset or the demo subset. **Recommendation:** correct those component dossiers' parity lines to "✅ React + Vue wrapper present (auto-generated)".

### The ONE genuine non-parity (by design)
- `stat-card`: appears in the showcase registry (`registry.json:50`) but has **no Stencil element folder** (`falcon-stat-card` absent from the 106) → correctly **no** React/Vue wrapper. It is a **synthetic Tailwind preview** in the demo, not a component. `[CODE]` `docs/README.md:34`. This is a showcase-only construct, not a wrapper gap.

### Shared token contract
✅ The wrappers render the same Shadow/`-tw` elements that read `falcon-ui-tokens` CSS vars — so React/Vue consumers inherit the identical token contract as Angular. The wrappers themselves carry zero styling (pure element bindings). `[BRAIN-OUT]` `reference_gate12_component_token_scope_portal_2026_06_02` (tokens scoped under `:where(falcon-X, falcon-X-tw, ...)` apply regardless of the host framework).

## F — Completeness / consistency / drift

### Staleness of the GENERATED wrappers vs current Stencil — PASS
✅ The wrappers ARE in sync: 106 = 106 = 106, and every wrapped tag maps to a live element folder (empty `comm -13`). No orphaned wrapper, no missing wrapper. The "are the generated wrappers in sync with current Stencil components?" check **passes**. This is the most important F result.

### F1 — recon-doc staleness (🟡, safe-local)
`[CODE]` `WAVE-6-REACT-TARGET.md:67` + `WAVE-7-VUE-TARGET.md:76` both state **"93 components"**; live count is **106**. The Vue doc additionally documents a `vueOutputTarget({...})` block in `stencil.config.ts` (`:10-16`) that **is not present** in the live `stencil.config.ts` (`Grep 'vue'` = 0 hits — the real generator is `generate-vue-proxies.cjs`). The docs are recon artifacts from the build waves; the **code** is current, the **docs** lagged. Recommendation: update both counts to 106 and the Vue doc to describe the `.cjs` generator as the live path.

### F2 — `registry.schema.json` missing (🟡, safe-local)
`[CODE]` `registry.json:2` references `"$schema": "./registry.schema.json"`, but `ls libs/falcon-ui-showcase-data/src/registry.schema.json` = **No such file**. The `$schema` does nothing (no editor/CI validation). Recommendation: add the schema (validate slug/tag/category/doc shape) or drop the dangling line.

### F3 — `notifications` category missing from the TS union (🟠→🟡, safe-local)
`[CODE]` `registry.json:11` defines category id `"notifications"` and the `insufficient-balance-dialog` entry uses `"category": "notifications"` (`:43`), but `ComponentCategoryId` (`index.ts:6-13`) lists only 7 ids and **omits `notifications`**. Because `registry` is a blind `as ShowcaseRegistry` cast (`:36`), TS does not flag the mismatch — `componentsByCategory` will simply never build a `notifications` bucket from the typed surface, and `getCategoryLabel('notifications')` is not type-reachable. A real (if low-impact) type↔data drift. Recommendation: add `'notifications'` to the union.

### F4 — showcase catalog duplicated in `demos/angular-playground` (🟡, safe-local)
`[CODE]` The only existing playground reads its OWN `src/studio/registry.ts` + `demos/component-docs/` (28 MD = a copy of `libs/falcon-ui-showcase-data/src/docs/`) rather than importing `@falcon/ui-showcase-data`. So the lib's whole reason to exist ("add once, appears in all three demos") is currently unrealized — there is a parallel hand-maintained copy that can drift from the lib. Recommendation: point `angular-playground` at the `@falcon/ui-showcase-data` barrel + `/docs/*` sub-path, delete `demos/component-docs/`.

### F5 — registry `tagTw` ≠ actual twin existence (🟡, safe-local)
`[CODE]` 14 registry entries carry `tagTw: null` (`multi-select`, `radio`, `switch`, `table`, `tree`, …) yet the corresponding `-tw` Stencil element + React/Vue wrapper **exist** (e.g. `falcon-multi-select-tw`). The registry field encodes "which twin the demo shows", not "which twin exists" — undocumented semantics that could mislead a maintainer into thinking those `-tw` elements are missing. Recommendation: document the field's meaning in `index.ts` / the README, or split into `hasTwin` vs `demoTwin`.

### F6 — `card`/`stat-card` README claim partly stale (🟡, safe-local)
`[CODE]` `docs/README.md:34` — "card and stat-card have no Stencil component yet". `falcon-card` (+`falcon-card-tw`) **does** exist as a Stencil element + wrapper now; only `falcon-stat-card` is genuinely synthetic. Recommendation: amend to "stat-card has no Stencil component (synthetic Tailwind preview)".

### F7 — `index.ts.bak` orphan (🟡, safe-local)
`[CODE]` `libs/falcon-ui-vue/src/index.ts.bak` is a 4-line `export {}` stub (the pre-generation placeholder) left in the tree. Harmless (not in `include`), but dead. Recommendation: delete.

### F8 — zero tests across all three libs (🟠, safe-local)
`[CODE]` Glob over each `src/**/*` = **0 `*.spec.ts`**. Nothing guards: (a) the **wrapper count == Stencil element count** invariant (a regression where a new component fails to wrap would ship silently — exactly the parity property this batch had to measure by hand); (b) the showcase catalog's slug↔doc 1:1 mapping; (c) `getComponent`/`componentsByCategory` behavior. A tiny `parity.spec.ts` (count React/Vue exports vs `falcon-ui-core` element folders) + a `registry.spec.ts` (every slug has a doc; every category in the union) would be cheap, high-value insurance given there are 0 runtime consumers to catch drift. Recommendation: add both (additive).

### F9 — no README in the wrapper libs (🟡, safe-local)
`[CODE]` `ls libs/falcon-ui-react/README.md` / `libs/falcon-ui-vue/README.md` = **No such file**, yet the Vue build does `copyFileSync('libs/falcon-ui-vue/README.md', dist/...)` inside a `try/catch` (`project.json:17`) — silently no-ops. The WAVE recon docs serve as de-facto READMEs but aren't packaged. Recommendation: add a short README to each (usage + "generated, do not edit"); makes the published package self-documenting.

## C — Falcon house rules (light)

- ✅ **Generated-file discipline:** both wrapper files carry explicit DO-NOT-EDIT banners + `/* eslint-disable */` + `/*@__PURE__*/` tree-shake annotations. Correct for generated code. `[CODE]` `components.ts:4-8`; `index.ts:1-3`.
- ✅ **No styling / no `any` abuse:** the wrappers are pure element bindings; showcase `index.ts` is typed (one justified `as ShowcaseRegistry` cast on the JSON import). No SCSS/hex/px anywhere.
- ✅ **`*** ***` banners:** showcase `index.ts:1-2` + `docs/README.md` follow the terse-banner convention.
- 🟡 **kebab-case:** all filenames kebab-case ✅ except the orphan `index.ts.bak` (F7).

## A / B / D — N/A justification
- **A:** no Angular constructs (these target React/Vue/plain-TS). The build configs use modern `nx:run-commands` + `tsc`; React tsconfig correctly uses `moduleResolution: bundler` for the `@stencil/react-output-target/runtime` subpath export. `[CODE]` `tsconfig.json:6`.
- **B:** the wrappers don't author Shadow/`-tw`; they wrap both. Twin parity is an upstream `falcon-ui-core` concern.
- **D:** a11y is inherited from the rendered custom elements.

## HIGH-RISK-QUEUE items (do NOT fix this pass)
**NONE.** Every finding is `safe-local` — recon-doc text, a missing schema file, a TS union omission, a doc duplication, an orphan stub, and additive tests/READMEs. There is no public-API change, no behavior change, no PES/security/payment/destructive surface in these derivative-output + static-data libs.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L08). Parity (E) computed by set-diff — empty in all directions; false prior-batch flags refuted by direct grep of `loader-overlay` wrappers. Every F-item cites a read source line or a measured `ls`/`Grep`. Test-absence verified by Glob (0 specs in all three libs). 0 in-repo consumers + absent `react-playground`/`vue-playground` confirmed. Area verdict: ✅ parity / 🟠 medium overall; 0 HIGH-RISK-QUEUE, 9 safe-local.
