# Falcon Cross-Framework — DECISION

## Brain SK final recommendation

**STATUS: READY / DERIVATIVE — KEEP the generation pipeline as-is; treat the wrapper libs as build outputs, never edit them.** `falcon-ui-react` and `falcon-ui-vue` are correctly-built, **fully in-sync** (106/106/106, 100% parity) generated wrappers over the `@falcon/ui-core` Stencil components. `falcon-ui-showcase-data` is a clean, hand-curated demo catalog. The 🟠 medium audit rating is **hygiene + posture** (recon docs stale, zero tests, zero in-repo consumers, a few catalog drifts) — **not** a design or parity defect. **Zero HIGH-RISK items.**

The single most important fact for future tasks: **the React + Vue wrappers cover the FULL Stencil element set with 100% parity.** Any component dossier or report claiming a component "has no React/Vue wrapper" is wrong (the only true exception is `stat-card`, which has no Stencil element at all).

## Use these libs for

- **`@falcon/ui-react`** — building a React (incl. Next.js) app on the Falcon design system. Import `Falcon*` components, get typed props + `onFalconX` events.
- **`@falcon/ui-vue`** — building a Vue 3 app on the Falcon design system. Import `Falcon*`, bind `@falcon-x` events; elements auto-register on import.
- **`@falcon/ui-showcase-data`** — the single catalog + docs source for any cross-framework component playground/gallery.

## Avoid these libs for

- **Anything inside the Angular host/remotes.** The in-repo apps consume components via `@falcon` `falcon-angular-*` — NOT these libs (which is why they have 0 in-repo importers). Importing `@falcon/ui-react`/`vue` into an Angular bundle is a mistake.
- **Authoring component behavior.** These are outputs of `falcon-ui-core` — to change a component, change the Stencil `.tsx` and rebuild; never hand-edit `components.ts` or the vue `index.ts`.
- **Treating the showcase registry as a parity contract.** It is a curated demo subset (28 of 53 logical components); `tagTw:null` there does NOT mean the `-tw` element is missing.

## Preferred wiring (the rule for future tasks)

1. **Component change?** Edit `libs/falcon-ui-core/src/components/falcon-*/*.tsx` → `nx build falcon-ui-core`. React (in-process `reactOutputTarget`) + Vue (`generate-vue-proxies.cjs`) wrappers regenerate. Verify the new component appears in BOTH `components.ts` and the vue `index.ts`.
2. **Never hand-edit** the generated wrapper files (DO-NOT-EDIT banners). If a wrapper looks wrong, fix the Stencil source or the generator, then rebuild.
3. **Adding a showcase component?** Registry entry → read `.tsx` → `docs/{slug}.md` from the 8-section skeleton. Keep the slug↔doc 1:1.
4. **Repointing the playground** (recommended cleanup): consume `@falcon/ui-showcase-data` + `/docs/*` from `demos/angular-playground` instead of the duplicated `demos/component-docs/`.
5. **A "no React/Vue parity" claim** must be re-checked against the FULL Stencil element folder set (`ls falcon-ui-core/src/components`), not the Angular wrapper subset or the demo registry.

## Relationship to other areas

- **Generated FROM:** `falcon-ui-core` (`stencil.config.ts` `reactOutputTarget` + `build.cjs` → `generate-vue-proxies.cjs`). These libs are 100% derivative of it.
- **Sibling to:** the **Angular** `falcon-angular-*` wrappers (`libs/falcon-ui-core/src/angular-wrapper/`) — the same components for the in-repo apps.
- **Inherits:** the `falcon-ui-tokens` CSS-token contract (the rendered elements read the tokens regardless of host framework).
- **Demoed by:** `demos/angular-playground` (currently via a duplicated catalog, not the lib).

## Required upgrades before wider use

**None block usage.** The wrappers are production-quality and current. Hygiene backlog (all `safe-local`), in priority order:
1. **F8 — add a `parity.spec.ts`** asserting `React export count == Vue export count == falcon-ui-core element-folder count`. Highest signal: guards the exact invariant this batch measured by hand; catches a "new component didn't wrap" regression that would otherwise ship silently (there are 0 runtime consumers to catch it).
2. **F1 — refresh the two WAVE recon docs** (93 → 106; describe `generate-vue-proxies.cjs` as the live Vue path; remove the stale `vueOutputTarget` snippet).
3. **F4 — repoint `demos/angular-playground`** at `@falcon/ui-showcase-data` + delete `demos/component-docs/` duplicate.
4. **F3 — add `'notifications'`** to `ComponentCategoryId`; **F2 — add or remove** `registry.schema.json`.
5. **F6/F7/F9** — fix the `card`/`stat-card` README line, delete `index.ts.bak`, add a short README to each wrapper lib.
6. **(Decision)** Confirm the **intended audience** of the wrapper libs. If no external React/Vue consumer is planned and the demo trio was abandoned, consider whether the two wrapper libs + showcase-data should remain in the build at all (they cost a `tsc` per build with zero in-repo benefit). If external consumers ARE planned, build the `react-playground`/`vue-playground` to exercise them.

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- The generated wrapper files (regenerated, but byte-identical between builds for a fixed Stencil set).
- The showcase `registry.json` (hand-edited; `generatedAt:2026-05-11` is decorative — it's not auto-generated).
- The 8-section doc skeleton + the 28 doc files.

### 2. What is dynamic through inputs/options?
- React wrappers: every Stencil `@Prop()` flows through as a typed React prop; events as `onFalconX`. `[CODE]` `components.ts`.
- Vue proxies: every `@Prop()` is in the attrs array; `@Event()` in the emits array. `[CODE]` `index.ts`.
- Showcase: `getComponent(slug)` / `componentsByCategory` / `getCategoryLabel` are the runtime query surface. `[CODE]` `index.ts:48-54`.

### 3. What is dynamic through slots / templates?
- The wrappers pass children/slots straight to the custom element (Stencil `<slot>`s render through both React `children` and Vue default/named slots). Authored upstream.

### 4. What is dynamic through token/theme overrides?
- N/A in the wrappers themselves; the rendered elements consume `falcon-ui-tokens` CSS vars → token overrides work identically for React/Vue/Angular consumers.

### 5. What is dynamic through "Tailwind classes"?
- The `-tw` twins (light-DOM Tailwind variants) are fully wrapped in both frameworks, exposing the same `*ExtraClass` props the Stencil twins define (`wrapperExtraClass`, `rootExtraClass`, `appendTo`, …). `[CODE]` `index.ts:106-115,469`.

### 6. What is missing to make it reusable across more apps/frameworks?
- A **parity test** so the count can't silently regress (F8).
- **READMEs** in the published wrapper packages (F9).
- A **realized cross-framework demo** (react/vue playgrounds) to prove the wrappers in anger (the trio was never built).
- The showcase lib being **actually imported** by the demos instead of duplicated (F4).

### 7. What capability should be promoted (not app-hacked)?
- The duplicated `demos/component-docs/` + `studio/registry.ts` should be **replaced by the `@falcon/ui-showcase-data` lib** — that's the whole point of the lib, currently bypassed (F4).

### 8. What flags / options would make it better?
- A generator-side assertion that every Stencil element produced a wrapper (fail the build on a gap) — turns parity from a manual check into a gate.
- Split the registry `tagTw` into `hasTwin` vs `demoTwin` to remove the F5 ambiguity.

### 9. What is the safest upgrade path?
1. **Phase A (zero-risk, additive):** add `parity.spec.ts` + `registry.spec.ts`; add READMEs; delete `index.ts.bak`; refresh the two WAVE docs; add `'notifications'` to the union; add/remove `registry.schema.json`. None touch generated output or behavior.
2. **Phase B (cleanup):** repoint `demos/angular-playground` to the lib + delete the duplicate `component-docs/`.
3. **Phase C (decision):** with stakeholders, decide whether the wrapper libs + showcase trio are kept (build the playgrounds) or trimmed (remove from the build) given 0 in-repo consumers.
All of A is non-breaking (the generated files are untouched). B/C are organizational, not runtime-risky.

### 10. What is risky to change because others depend on it?
- **The generation config** (`stencil.config.ts` `reactOutputTarget`, `build.cjs` → `generate-vue-proxies.cjs`) — these produce the wrappers; breaking them breaks BOTH framework libs at once. The EMFILE-resilient `.cjs` is load-bearing on Windows.
- **The `@falcon/ui-core` element tag names** — renaming an element silently changes the wrapper tag in both frameworks (and the showcase `tag`/`tagTw`).
- **Almost nothing else in-repo depends on these libs** (0 importers) — which is precisely why a parity regression would go unnoticed without F8's test. The blast radius is external consumers, who can't be seen from this repo.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L08). Recommendation: KEEP the pipeline, treat wrappers as outputs, work the F-hygiene backlog (all safe-local), and make the "no parity" myth-correction the durable takeaway. 100% parity computed by set-diff; 0 in-repo consumers + absent demo playgrounds confirmed; 0 HIGH-RISK-QUEUE.
