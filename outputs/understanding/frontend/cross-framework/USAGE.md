# Falcon Cross-Framework — USAGE

How the three libs are meant to be consumed, how the build wires them, the recommended patterns, a Do/Don't table, and the grep-verified Consumer Sweep.

## How the wrappers are produced and shipped (the pipeline, end to end)

```
libs/falcon-ui-core/src/components/falcon-*/*.tsx   (Stencil source — the ONE source of truth)
                │
                ├─ nx build falcon-ui-core ──────────────────────────────────────────────┐
                │                                                                          │
   reactOutputTarget (in-process,                          generate-vue-proxies.cjs        │
   @stencil/react-output-target@0.7.4)                     (post-build .cjs in falcon-ui-core,
                │                                            EMFILE-resilient, regex-parses @Prop/@Event)
                ▼                                                          ▼
   libs/falcon-ui-react/src/components.ts                 libs/falcon-ui-vue/src/index.ts
   (106 React wrappers, DO-NOT-EDIT)                       (106 Vue proxies, DO-NOT-EDIT)
                │                                                          │
   nx build falcon-ui-react (tsc → dist/)                 nx build falcon-ui-vue (tsc → dist/libs/...)
```
`[CODE]` `stencil.config.ts:47`; `WAVE-7-VUE-TARGET.md:27-37`; `project.json` of each lib.

`falcon-ui-showcase-data` is **independent of the build** — `nx:noop` build/lint targets (`[CODE]` `project.json:8-15`); it ships its `src/` as the artifact (`package.json main/types → ./src/index.ts`). It is hand-edited via the docs README procedure.

## Recommended consumer usage (external React / Vue apps)

### React (per WAVE-6 doc)
```bash
npm install @falcon/ui-react @falcon/ui-core react react-dom
```
```tsx
// [CODE] WAVE-6-REACT-TARGET.md:51-58
import { FalconButton, FalconInput } from '@falcon/ui-react';

export function MyForm() {
  return <FalconButton variant="primary" label="Submit"
                       onFalconClick={(e) => console.log(e.detail)} />;
}
```
- Props pass through to the underlying custom element; event handlers use `onFalconX` (camelCase) and receive typed `Falcon*CustomEvent<...Detail>` payloads.
- For Next.js: the file already carries `'use client';` so the wrappers work in the app-router as client components. `[CODE]` `components.ts:1`.
- Peer deps: `react >=18`, `react-dom >=18`, `@falcon/ui-core >=0.1.0`. `[CODE]` `package.json:18-22`.

### Vue 3 (per WAVE-7 doc)
```bash
npm install @falcon/ui-vue
```
```ts
// [CODE] WAVE-7-VUE-TARGET.md:68-69
import { FalconButton, FalconInput } from '@falcon/ui-vue';
```
```vue
<FalconButton variant="primary" label="Submit" @falcon-click="onClick" />
```
- Importing the lib auto-runs `defineCustomElements()` → all elements register eagerly. `[CODE]` `index.ts:8`.
- Events bind with `@falcon-x` (kebab) / the emitted-events array; `v-model` works on the model-prop where defined.
- Peer dep: `vue >=3.2.0`. `[CODE]` `package.json:18-20`.

### Showcase-data (demo apps)
```ts
import { components, categories, componentsByCategory, getComponent } from '@falcon/ui-showcase-data';
// docs as raw text:
const docs = import.meta.glob('@falcon/ui-showcase-data/docs/*.md', { as: 'raw', eager: true });
```
- Drive a gallery from `componentsByCategory`; render the docs panel by matching the active slug to `docs/{slug}.md`. `[CODE]` `docs/README.md:9-16`.

## How to regenerate / extend (the maintenance rules)

| Task | Action | Source |
|---|---|---|
| Add/modify a Stencil component | Edit the `.tsx`, run `nx build falcon-ui-core` → React + Vue wrappers regenerate automatically. **Never** hand-edit `components.ts` or the vue `index.ts`. | `index.ts:1-3` (both) |
| A new component didn't appear in the wrappers | Confirm `nx build falcon-ui-core` completed past the flush; the Vue path depends on `generate-vue-proxies.cjs` running in `build.cjs`. | `WAVE-7-VUE-TARGET.md:32-37` |
| Add a showcase doc | (1) Add a `ComponentEntry` to the registry; (2) read the `.tsx`; (3) create `docs/{slug}.md` from the skeleton; the playground picks it up. | `docs/README.md:36-42` |
| Transcribe props/events for a doc | Copy verbatim from `falcon-{tag}.tsx` `@Prop()`/`@Event()` — do NOT invent. | `docs/README.md:31-32` |

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Treat `components.ts` / vue `index.ts` as **generated outputs** — change the Stencil source and rebuild | Hand-edit the generated wrapper files (the banner says they'll be lost on regen) |
| In an Angular app, consume components via `@falcon` `falcon-angular-*` | Import `@falcon/ui-react` or `@falcon/ui-vue` into the Angular host/remotes (wrong framework; 0 current importers for a reason) |
| Keep `registry.json` in lockstep with the Stencil component set when demoing | Assume `registry.tagTw` reflects whether a `-tw` element exists — it reflects what the demo wants shown |
| Restore the missing `registry.schema.json` (or drop the `$schema` line) | Leave the dangling `$schema` reference (silent — no validation runs) |
| Delete `vue/src/index.ts.bak` (4-line orphan stub) | Mistake `index.ts.bak` for a live file |
| Add the missing `notifications` id to `ComponentCategoryId` if a notifications component is demoed | Add a registry entry whose `category` isn't in the TS union (it widens to `any` via the JSON cast) |
| Add a smoke test that the wrapper count == Stencil element count | Ship a wrapper-count regression silently (no test guards parity today) |

## Consumer Sweep (grep-verified 2026-06-03)

`[CODE]` `Grep` across `C:\Falcon\Falcon\falcon-web-platform-ui` (`apps/`, `libs/`, `tools/`, `demos/`):

**`@falcon/ui-react`** — importers: **0** (apps + libs + tools). The package exists only as a generated output + tsconfig path alias (`tsconfig.base.json:97-99`).

**`@falcon/ui-vue`** — importers: **0** (apps + libs + tools). Path alias at `tsconfig.base.json:100-102`.

**`@falcon/ui-showcase-data`** — real importers: **0**. The 4 grep matches are non-code: `.nx/workspace-data/file-map.json`, `.nx/workspace-data/project-graph.json`, `graph.json` (nx graph metadata), and `tsconfig.base.json` (the path alias). No `.ts`/`.tsx`/`.vue` file imports it.

**The lone showcase consumer is a DUPLICATE, not the lib:**
- `demos/angular-playground/` (a standalone Vite app — **no `project.json`, not in the nx graph**) renders a component studio from its OWN in-app `src/studio/registry.ts` and reads docs from `demos/component-docs/` (28 MD files = a copy of `libs/falcon-ui-showcase-data/src/docs/`). `[CODE]` `Grep 'ui-showcase-data\|component-docs\|registry'` on `demos/angular-playground` → matches `studio/registry.ts`, `studio/component-docs-panel.component.ts`, `studio/gallery.component.ts`, etc., none importing the `@falcon/ui-showcase-data` barrel. (AUDIT F4 — the catalog is duplicated in the playground rather than imported.)

**Playgrounds named in the docs but ABSENT on disk:** `demos/react-playground/` + `demos/vue-playground/` — `ls` = No such file/directory. Only `demos/angular-playground` + `demos/component-docs` exist. `[CODE]` 2026-06-03. So the showcase-data `index.ts:2` comment ("Consumed by apps/demo/{angular,react,vue}") and `docs/README.md:5-7` are **aspirational** — the cross-framework demo trio was never built (or was removed).

**Net:** all three libs are **published-but-unconsumed** in-repo. This is consistent with their purpose (outbound, for external/future React/Vue consumers + a planned showcase trio) but it means they have **no in-repo runtime exercise** — their only validation is `tsc` compiling the generated output. See AUDIT F + DECISION.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L08). Pipeline traced through `stencil.config.ts` + `build.cjs` recon doc + each `project.json`. Consumer counts (0/0/0) grep-verified across apps+libs+tools+demos. `demos/angular-playground` duplication confirmed; `react-playground`/`vue-playground` absence confirmed. Recommended-usage snippets quoted from the two WAVE recon docs.
