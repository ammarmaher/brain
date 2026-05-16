# 07 — Integration Points

> A new component is **not done** until every registration site is patched. Missing any one of these silently breaks consumers.

## 1. The 5 registration sites

[CODE] Verified against `libs/falcon-ui-core/` (2026-05-14).

| # | File | Patch | Status if missed |
|---|---|---|---|
| 1 | `libs/falcon-ui-core/src/define-falcon-tw-component.ts` | Add a `twLoaders` map entry | Angular wrapper `ngOnInit` rejects with `[defineFalconTwComponent] no loader registered for tag 'falcon-X-tw'.` — `-tw` render path dead |
| 2 | `libs/falcon-ui-tokens/src/index.css` | Add `@import './components/X.tokens.css';` | Tokens never load → component renders with default browser styles (broken visuals) |
| 3 | `libs/falcon-ui-core/src/angular-wrapper/index.ts` | Add `export * from './components/falcon-X';` | Consumers can't `import { FalconAngularXComponent } from '@falcon/ui-core/angular-wrapper'` — wrapper unreachable |
| 4 | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/index.ts` | Re-export wrapper class + types | Component file exists but its dir-level barrel doesn't re-export; #3 fails to resolve |
| 5 | (Optional) `libs/falcon/src/shared-ui/index.ts` re-export | If consumed via `@falcon/shared-ui` legacy facade | Apps importing from the legacy facade can't see the new component |

### 1.1 `define-falcon-tw-component.ts` patch

[CODE] `libs/falcon-ui-core/src/define-falcon-tw-component.ts` lines 14-62.

Add ONE line inside the `twLoaders` object, alphabetised by tag where reasonable:

```ts
const twLoaders: Record<string, () => Promise<{ defineCustomElement: () => void }>> = {
  // ... existing entries
  'falcon-X-tw': () => import(/* webpackChunkName: "falcon-ui-X-tw" */ '../dist/components/falcon-X-tw'),
};
```

**Notes:**
- Key is `falcon-X-tw` (full tag with suffix).
- `webpackChunkName` is `falcon-ui-X-tw` (no leading `falcon-`-`falcon-`, no `dist`).
- Path is `../dist/components/falcon-X-tw` — Stencil emits one entry-point per component to `dist/components/`.
- The function returns a default-export shape `{ defineCustomElement }`.

### 1.2 `libs/falcon-ui-tokens/src/index.css` patch

[CODE] `libs/falcon-ui-tokens/src/index.css` lines 21-67.

Append a line in the `components/` block (alphabetical not strictly enforced — verified order is feature-grouped):

```css
@import './components/X.tokens.css';
```

**Notes:**
- Place after the `semantic/`, `themes/`, `density/`, `rtl/` blocks — components ALWAYS load last so they can reference primitive / semantic vars.
- The file name follows the rule from `03-NAMING_CONVENTION.md` §7 — `<kebab>.tokens.css`, NO `falcon-` prefix.

### 1.3 `libs/falcon-ui-core/src/angular-wrapper/index.ts` patch

[CODE] `libs/falcon-ui-core/src/angular-wrapper/index.ts` lines 12-63.

Append:

```ts
export * from './components/falcon-X';
```

**Notes:**
- The current file groups by feature family — match neighbours (e.g. `falcon-empty-state` and `falcon-empty-data` are adjacent).
- Re-exports surface types automatically because the inner `index.ts` re-exports them via `export type { ... }`.

### 1.4 `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/index.ts`

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/index.ts`.

```ts
/*** falcon-angular-X — dual-render-path wrapper around the Stencil
     <falcon-X> / <falcon-X-tw> web components. ***/

export {
  FalconAngularXComponent,
  type FalconXSize,        // re-export every type the wrapper component re-exports
} from './falcon-X.component';
```

**Notes:**
- Re-export the wrapper class.
- Re-export every type the component re-exported via `export type { ... }` (Angular wrapper TypeScript pattern — types are forwarded through the component file from `falcon-X.types.ts`).

### 1.5 (Optional) `libs/falcon/src/shared-ui/index.ts`

Only patch if the new component is consumed by apps that still import from the legacy `@falcon/shared-ui` facade. New components shipping after 2026-05-08 [MEMORY] `feedback_angular_only_scope.md` typically go straight to `@falcon/ui-core/angular-wrapper`.

## 2. Stencil's automatic outputs (NO manual edits)

[CODE] `libs/falcon-ui-core/stencil.config.ts` lines 27-48.

These run on `nx build falcon-ui-core`. **You do not edit anything to make them happen — they emit automatically once the Shadow + Light tsx files compile.**

| Output target | Result | Purpose |
|---|---|---|
| `dist` (with `esmLoaderPath: '../loader'`) | `libs/falcon-ui-core/loader/` | Legacy ESM loader. Imported by host-shell bootstrap (`defineCustomElements()`) to register all Shadow tags eagerly |
| `dist-custom-elements` (with `externalRuntime: false, generateTypeDeclarations: true`) | `libs/falcon-ui-core/dist/components/falcon-X.{js,d.ts}` and `falcon-X-tw.{js,d.ts}` | Tree-shakeable per-component entry points. `define-falcon-tw-component.ts` dynamic-imports from here |
| `docs-readme` (with footer text) | `libs/falcon-ui-core/src/components/falcon-X/readme.md` + `falcon-X-tw/readme.md` | Auto-generated Props/Events/Slots tables |
| `reactOutputTarget` (outDir `../falcon-ui-react/src`) | `libs/falcon-ui-react/src/components/FalconX.ts` (React binding) | React consumers `import { FalconX } from '@falcon/ui-react'` |

Plus the Vue proxy script:

| Script | Trigger | Result |
|---|---|---|
| `libs/falcon-ui-core/generate-vue-proxies.cjs` | `npm run generate-vue-proxies` (run from `libs/falcon-ui-core/`) | `libs/falcon-ui-vue/src/components/FalconX.ts` (Vue 3 binding) |

## 3. Risk-if-missed checklist

[INFERRED] Use this during code review:

- [ ] **#1 `define-falcon-tw-component.ts`** — open the file, grep for `falcon-X-tw`. Must return one hit.
- [ ] **#2 `libs/falcon-ui-tokens/src/index.css`** — open the file, grep for `X.tokens.css`. Must return one hit.
- [ ] **#3 `libs/falcon-ui-core/src/angular-wrapper/index.ts`** — open the file, grep for `'./components/falcon-X'`. Must return one hit.
- [ ] **#4 wrapper folder `index.ts`** — open the file, must re-export `FalconAngularXComponent`.
- [ ] **Build** — run `nx build falcon-ui-core`. Expect zero errors. Confirms `dist/components/falcon-X-tw.js` exists (so #1's loader resolves).
- [ ] **React wrapper auto-emitted** — `libs/falcon-ui-react/src/components/FalconX.ts` must exist after build.
- [ ] **Tokens cascade reaches all 5 selector targets** — `03-NAMING_CONVENTION.md` §2 `:where()` chain present in the new `X.tokens.css`.

## 4. Discovery: are there more integration sites?

[INFERRED] As of 2026-05-14, no additional registration site is required:
- ESLint flat-block does not need per-component entries.
- Stencil `components.d.ts` is auto-generated.
- `libs/falcon-ui-core/src/types/` is for shared cross-component types only — new components do NOT add files here unless they expose a type referenced by ≥2 other components.
- `libs/falcon-ui-core/src/utils/` is for shared utils (`id.ts`, `a11y.ts`) — component-specific utils stay in the Shadow component folder.

If a future run discovers a NEW registration site, append it to this doc with a `[RUN-<date>]` source tag and update `09-PER_RUN_LOG.md`.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
