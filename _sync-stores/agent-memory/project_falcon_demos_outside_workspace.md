# Falcon cross-framework demos — moved OUTSIDE workspace (2026-05-10)

## Why this exists separately
The **react-playground + vue-playground** were originally inside the Nx workspace at `falcon-web-platform-ui/demos/{react,vue}-playground/`. During the 2026-05-09 night-shift's Wave 2.5 they were deleted on the (mistaken) understanding that they were unused per memory `feedback_angular_only_scope.md`. They were NEVER committed to git so deletion was unrecoverable from history.

After the user requested restoration, both were **re-scaffolded outside the workspace** at `C:\Falcon\demos\` so any future workspace-internal cleanup operations can't sweep them.

## Current locations + ports

| Playground | Path | Port | Status |
|---|---|---:|---|
| Angular 20 (Analog) | `C:\Falcon\falcon-web-platform-ui\demos\angular-playground\` | 5175 | Original; in workspace; intact |
| **React 19** | `C:\Falcon\demos\react-playground\` | **5173** | Re-scaffolded 2026-05-10; OUTSIDE workspace |
| **Vue 3** | `C:\Falcon\demos\vue-playground\` | **5174** | Re-scaffolded 2026-05-10; OUTSIDE workspace |

## All three share

- **Same 28-component registry** (≈46 KB Angular original; ~145 KB React expansion). Component-count parity confirmed via grep across all 3.
- **Same 29 component-docs markdown files** at `falcon-web-platform-ui/demos/component-docs/*.md` — pulled by all 3 via `import.meta.glob`.
- **Same Falcon Stencil components** at `libs/falcon-ui-core/dist/` consumed via Vite alias (`@falcon/ui-core`, `@falcon/ui-core/loader`, `@falcon/ui-tokens`).
- **Same gallery / card / docs / live-element / hero pattern**.

## Architectural deltas across the 3 frameworks

| Concern | Angular | React | Vue |
|---|---|---|---|
| Custom-element registration | `defineCustomElements()` from `@falcon/ui-core/loader` in `main.ts` | same in `main.tsx` | same in `main.ts` |
| Unknown-tag handling | Angular's `CUSTOM_ELEMENTS_SCHEMA` per-component | React 19 native (no shim) | Vue plugin `compilerOptions.isCustomElement: tag => tag.startsWith('falcon-')` |
| Event binding | Angular `Renderer2.listen` | `addEventListener` + `useEffect` cleanup | `addEventListener` + `onBeforeUnmount` cleanup |
| Markdown glob path | `'../../../component-docs/*.md'` | `'../../../falcon-web-platform-ui/demos/component-docs/*.md'` | same as React (extra `..` to leave workspace) |
| Token CSS resolution | Direct alias to workspace lib | Local snapshot at `src/falcon-ui-tokens/` (Tailwind v4's `@import` won't walk above project root) | Same local snapshot |
| Skeleton states | 28 hand-tuned per-component | 1 generic Skeleton tile | 1 generic Skeleton tile |

## Run commands

```powershell
# Angular (in workspace)
cd C:\Falcon\falcon-web-platform-ui\demos\angular-playground
npm install --no-audit --no-fund
npm run dev   # serves :5175

# React (outside workspace)
cd C:\Falcon\demos\react-playground
npm install --no-audit --no-fund
npm run dev   # serves :5173

# Vue (outside workspace)
cd C:\Falcon\demos\vue-playground
npm install --no-audit --no-fund
npm run dev   # serves :5174
```

## Source of truth
- Detailed agent report: `C:\Falcon\Brain\Brain Generated\demos-recreation-summary.md`
- Original (lost) prototype memory: `project_falcon_ui_react_vue_playgrounds.md`
- Pre-deletion runtime verification: `project_falcon_ui_cross_framework_demos.md`

## Caveats
- The Angular playground `package.json` declares `@angular/core@^20` but the workspace itself is now on Angular 21.2.9. The playground runs INDEPENDENTLY of the workspace builds (own node_modules), so this drift is functionally irrelevant. Worth bumping later for consistency.
- The Angular playground hit a `@angular/build/private` resolution issue on first cold boot (W3.5 soft watch-item: `@analogjs/vite-plugin-angular` cadence vs Angular 21). Fix was a one-line `@angular/build@^20` install in the playground's local `node_modules`.
- All 3 playgrounds need a local `postcss.config.js` exporting `{ plugins: {} }` so Vite doesn't inherit the workspace-root config (which expects `@tailwindcss/postcss`). Tailwind v4's `@tailwindcss/vite` plugin handles compilation directly.
- All 3 playgrounds run independently of the production app builds. They don't appear in `nx graph`. They ARE separate Vite projects, not Nx targets.
