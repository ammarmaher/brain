# @falcon/studio + @falcon/studio-runtime — OVERVIEW

> Non-component library area (SPEC §7 lighter 5-file set: OVERVIEW · SURFACE · USAGE · AUDIT · DECISION). One consolidated dossier covering **BOTH** sibling libs. Mirrors the falcon-input / @falcon/sdk dossier tone; adapts the structure for a *design-token-editor + runtime-controller* library pair.

## Purpose

Two cooperating libraries that share one wall:

- **`@falcon/studio`** (`libs/falcon-studio`) — the **design-token / loader-studio EDITOR surface**. A live, in-app authoring tool: a non-technical theme/token controller (`<falcon-studio>`) and the **Loader Studio** page (`<falcon-loader-studio>`) that authors the JSON config the `<falcon-angular-loader-overlay>` / `<falcon-angular-loader-inline>` primitives render. `[CODE]` `libs/falcon-studio/src/index.ts:1-2` banner — "Falcon Studio — public entry. Drop `<falcon-studio />` into any Angular app to host the live theme editor." This is the **heavy** lib: ~57 components + 14 services + registries (the gallery, token editors, color pickers, abstraction-map, popup matrix, skeleton previews).
- **`@falcon/studio-runtime`** (`libs/falcon-studio-runtime`) — the **leaf RUNTIME lib** extracted out of `falcon-studio` in **FE-CYCLE-01** (2026-06-03) to break the `falcon-studio → falcon-ui-core-angular → falcon-studio` project cycle. It holds the loader / uploader / data-table-skeleton **runtime surface** that the low-level Angular wrappers consume at runtime: `FalconLoaderService`, the `*_DEFAULTS` injection tokens + `provide…` fns, and the **canonical loader config model** (`registry/loader-studio/config.types.ts` — `FalconLoaderOverlayCfg` / `FalconLoaderInlineCfg` / `FalconLoaderConfig`). `[CODE]` `libs/falcon-studio-runtime/src/index.ts:1-21` banner.

The split exists because the wrappers in `@falcon/ui-core/angular` (e.g. `<falcon-angular-data-table>`, `<falcon-angular-wizard-finalization>`, the loader wrappers) consume `FalconLoaderService` / the `*_DEFAULTS` tokens / the config model. A wrapper must depend **DOWNWARD** on a leaf, never UPWARD on the feature/editor lib that itself consumes the wrappers. So that runtime surface was relocated into a genuine **leaf** the wrappers depend on; `@falcon/studio` then **re-exports the full leaf for back-compat** via `export * from '@falcon/studio/runtime'`. `[CODE]` `libs/falcon-studio/src/index.ts:234-244`.

## Business / architectural use case

- **Author once, propagate everywhere (loader).** Loader Studio edits a draft JSON; "Apply globally" calls `FalconLoaderService.setConfig(draft)`, which writes a single `signal<FalconLoaderConfig>`. Every mounted `<falcon-loader-overlay|inline>` reads that one signal, so a config change is reflected live across the whole app. `[CODE]` `libs/falcon-studio-runtime/src/lib/services/falcon-loader.service.ts:29-58` + `libs/falcon-studio/src/lib/services/loader-studio-state.service.ts:143-145`.
- **Single JSON contract for boot/route/section loaders.** `FalconLoaderConfig` (`$schema:'falcon.loader.v1'`, `overlay`, `inline`) is the SoT shape traveling between the editor, the service, and the Stencil primitives' `[config]` prop. `[CODE]` `config.types.ts:426-430`.
- **Centralised behavioural defaults for uploader + data-table skeleton.** The runtime leaf also owns `FALCON_UPLOADER_DEFAULTS` and `FALCON_DATA_TABLE_SKELETON_DEFAULTS` (+ `provide…` helpers + a shared `falcon-component-defaults.json`) so a host can tune `<falcon-angular-image/document-uploader>` and the data-table skeleton platform-wide. `[CODE]` `libs/falcon-studio-runtime/src/index.ts:42-103`.
- **A token editor that never writes raw HTML.** The editor's own doctrine forbids native form HTML — every editor row is a Falcon component (`<falcon-angular-input/switch/tabs/tag/textarea/button>`), with the one studio-local `<falcon-studio-slider>` exception (because `<falcon-angular-slider>` is not yet in falcon-ui-core — GAP-LIB-slider). `[CODE]` `loader-studio.component.ts:32-48`.

## Status — hidden vs live (FE-standard claim VERIFIED)

**SPLIT: partly LIVE, partly HIDDEN.** The FE-standard doc claims the lib is fully dormant — that is now **STALE/INCORRECT**:

> `[BRAIN-OUT]` `ANGULAR_AND_TAILWIND_RULES.md:147` — "`libs/falcon-studio` hidden-but-kept — preserved on disk per Wave 2 v3.1, but Tailwind no longer scans it and **host-shell route is removed**."

Reality on disk 2026-06-03:
- **`<falcon-studio>` token-theme editor (`FalconStudioComponent`)** — **HIDDEN/ORPHANED at the app level.** `[CODE]` `Grep 'FalconStudioComponent'` across `apps/` = **0 routes, 0 mounts** (the only matches are inside `libs/falcon-studio` itself). Exported from the barrel but no app navigates to it. ✅ matches "route removed".
- **Loader Studio editor (`FalconLoaderStudioComponent`)** — **LIVE.** `[CODE]` `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.routes.ts:14-18` — `{ path: 'loader-studio', loadComponent: () => import('@falcon/studio').then(m => m.FalconLoaderStudioComponent) }`, auth-free, navigated from `library-section.component.ts:863` (`routerLink="loader-studio"`). So the lib **does** ship a live host-shell route → the "route is removed" claim is FALSE for the loader-studio surface.
- **`@falcon/studio-runtime`** — **ALWAYS LIVE / FOUNDATIONAL.** Its `FalconLoaderService` + `*_DEFAULTS` tokens are injected by always-mounted `@falcon/ui-core` wrappers and the host installs `provideFalconLoader/Uploader/DataTableSkeleton` at root. `[CODE]` `apps/host-shell/src/app/app.config.ts:70,174-181`.

Net: the **runtime leaf is core infrastructure**; the **loader-studio editor page is a live (auth-free showcase) route**; only the **`<falcon-studio>` token editor is genuinely dormant**. Tailwind-scan status (whether `@source` crawls `libs/falcon-studio`) was not re-verified this pass — flagged `[INFERRED]` for the Tailwind half of the claim.

## What lives where

| Lib | Owns | Heavy/leaf |
|---|---|---|
| `@falcon/studio` | The editor UI: `<falcon-studio>` shell + `<falcon-studio-page>` (Wave 12B 4-region), the card-based gallery + per-component detail/token editors, color pickers/sliders, preset bar, export panel, abstraction-map registry, popup-control matrix, ~26 skeleton preview components, the **Loader Studio editor page** `<falcon-loader-studio>` + its editor-local draft state service | HEAVY (~101 src files) |
| `@falcon/studio-runtime` | The runtime surface the wrappers depend DOWN on: `FalconLoaderService`, `FALCON_LOADER_DEFAULTS` + `provideFalconLoader(Defaults)`, the loader config model (`config.types.ts`, `loader-module.types.ts`, `defaults.ts`, `validate-loader-config.ts`, 28 module specs), `FALCON_UPLOADER_DEFAULTS` + provider, `FALCON_DATA_TABLE_SKELETON_DEFAULTS` + provider, `FALCON_COMPONENT_DEFAULTS` JSON | LEAF (46 src files) |

## Source roots

| Concern | Path | Notes |
|---|---|---|
| Editor barrel | `libs/falcon-studio/src/index.ts` | 259 lines; re-exports the leaf at :244 |
| Editor shell | `libs/falcon-studio/src/lib/components/falcon-studio.component.ts` | `<falcon-studio>`; default = `<falcon-studio-page>`, `?engineeringView=true` / Ctrl+Shift+E = Wave 5C raw-token panels |
| Default editor surface | `libs/falcon-studio/src/lib/components/studio-page.component.ts` | `<falcon-studio-page>` Wave 12B 4-region |
| Loader Studio page | `libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.{ts,html}` | `<falcon-loader-studio>`; TS 398 lines, HTML 509 lines; the live route target |
| Loader editor draft state | `libs/falcon-studio/src/lib/services/loader-studio-state.service.ts` | `FalconLoaderStudioStateService` — draft JSON, import/export, apply-to-runtime |
| Central studio state | `libs/falcon-studio/src/lib/services/studio-state.service.ts` | `FalconStudioStateService` + `FALCON_STUDIO_TABS` |
| Runtime barrel | `libs/falcon-studio-runtime/src/index.ts` | 104 lines |
| Loader runtime controller | `libs/falcon-studio-runtime/src/lib/services/falcon-loader.service.ts` | `FalconLoaderService` (163 lines, signal + counter) |
| Loader config model | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/config.types.ts` | 436 lines — `FalconLoaderOverlayCfg` (88 props/21 groups) + `FalconLoaderInlineCfg` (30 groups) |
| Module spec contract | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/loader-module.types.ts` | `LoaderModuleSpec` / `LoaderControlSpec` discriminated union |
| Module registry | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/modules/index.ts` | `FALCON_LOADER_MODULES` (28 frozen module specs) |
| Runtime validator | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/validate-loader-config.ts` | `validateLoaderConfig` / `freezeLoaderConfig` |
| Seed defaults | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/defaults.ts` | `BUILT_IN_FALCON_LOADER_DEFAULTS` + `FALCON_BRAND_MARK_PATH_D` (verbatim from React SoT) |
| Uploader defaults | `libs/falcon-studio-runtime/src/lib/services/uploader-defaults.{token,provider}.ts` + `provide-falcon-uploader.ts` | |
| Data-table skeleton defaults | `libs/falcon-studio-runtime/src/lib/services/data-table-skeleton-defaults.{token,provider}.ts` + `provide-falcon-data-table-skeleton.ts` | |
| Shared component defaults | `libs/falcon-studio-runtime/src/config/falcon-component-defaults.json` | `FALCON_COMPONENT_DEFAULTS` (uploader + loader slices) |

**Spec/tests:** `[CODE]` **NO `*.spec.ts` under either `libs/falcon-studio/src` or `libs/falcon-studio-runtime/src`** (Glob over both src trees returns 0 spec files). The runtime validator + the loader service counter logic + the import/export round-trip have **zero unit coverage in-lib**; the only related test is an app-level `apps/host-shell/tests/falcon-component-defaults.spec.ts` (which references the OLD `libs/falcon-studio/.../loader-studio` path in a comment, `:14`). See AUDIT F.

## Import paths

- `@falcon/studio` → `libs/falcon-studio/src/index.ts` (full editor barrel + re-exported leaf). `[CODE]` `tsconfig.base.json:55-57`.
- `@falcon/studio/runtime` → `libs/falcon-studio-runtime/src/index.ts` (leaf only — preferred for runtime/wrapper consumers). `[CODE]` `tsconfig.base.json:58-60`.
- No relative imports across the lib boundary; the editor imports the leaf via `@falcon/studio/runtime` (downward). `[CODE]` `loader-studio.component.ts:53-61`.

## Build wiring (NX project graph)

- **`falcon-studio-runtime`** = a `tsc --noEmit` typecheck lib. `[CODE]` `libs/falcon-studio-runtime/project.json:14-21` — build = `tsc --noEmit -p libs/falcon-studio-runtime/tsconfig.lib.json`, **NO `dependsOn`** → a genuine leaf (depends on nothing in the workspace except the `@angular/core` framework peer). Tags `scope:shared`, `type:falcon-runtime`.
- **`falcon-studio`** = also `tsc --noEmit`, but **`dependsOn` falcon-ui-core build + falcon-ui-tokens build-token-registry + falcon-theme generate-tokens-ts**. `[CODE]` `libs/falcon-studio/project.json:22-28`. So `falcon-studio` depends DOWN on `falcon-ui-core` (it consumes the wrappers), which is the correct direction — `falcon-ui-core-angular` no longer imports anything upward. Tags `scope:shared`, `type:falcon-studio`.

## Known consumers (grep-verified 2026-06-03)

`[CODE]` `Grep '@falcon/studio'` (non-md) = **38 files**. The load-bearing runtime consumers:
- **`@falcon/ui-core` wrappers (import DOWN from `@falcon/studio/runtime`):** `falcon-data-table.component.ts:48`, `falcon-table.component.ts:52`, `falcon-image-uploader.component.ts:22`, `falcon-document-uploader.component.ts:22`, `falcon-wizard-finalization.component.ts:94` (`FalconLoaderService`), `falcon-loader-overlay.component.ts:23` + `index.ts:6` (type `FalconLoaderOverlayCfg`), `falcon-loader-inline.component.ts:26` + `index.ts:7` (type `FalconLoaderInlineCfg`).
- **Host-shell:** `app.config.ts:70,174-181` (installs `provideFalconLoader/DataTableSkeleton/Uploader`), `app.ts` (always-alive loader overlay bound to `runtime.config().overlay`), `host-component-configuration.facade.ts` (feeds loader+uploader seed), `login-transition.service.ts` + several shared-components (`FalconLoaderService` show/dismiss).
- **Loader Studio editor:** `loader-studio.component.ts`, `loader-studio-state.service.ts` (both in `falcon-studio`, depend on the leaf).
- **Showcase route + nav:** `falcon-ui-showcase.routes.ts:17`, `library-section.component.ts:863`.
- **Build/config:** `tsconfig.base.json`, `eslint.config.mjs`, `scripts/ensure-libs.mjs`, `libs/falcon-ui-core/web-types.json`, `components.d.ts`.

See USAGE.md Consumer Sweep for the full enumerated list.

## Related areas

- **`falcon-loader-overlay` / `falcon-loader-inline`** (B-CAL + B16/B20 components): the Stencil dual-render primitives the loader config drives. ⚠ B-CAL flagged `customSvg` injected raw via `innerHTML` (XSS sink) on both render paths, and the `DEFAULT_OVERLAY_CFG` + `FALCON_BRAND_MARK_PATH_D` are inlined VERBATIM in 3 places (the two Stencil tags + this leaf's `defaults.ts`) synced only by "KEEP IN SYNC" comments. Cross-ref AUDIT C/F.
- **`@falcon/ui-core/angular`** — the wrapper lib that depends DOWN on this leaf (FE-CYCLE-01 fixed leg).
- **`@falcon` shared-ui** — now hosts `falcon-error-dialog-host` (moved UP from `falcon-ui-core-angular` in the OTHER half of FE-CYCLE-01); the loader editor surfaces import errors via `ErrorDialogService`.
- **falcon-component-creation skill** (`brain-skills/code-skills/falcon-component-creation-skill`) — the authoring doctrine the loader-studio editor's "every row is a Falcon component" rule reflects.

## Ownership

`libs/falcon-studio` + `libs/falcon-studio-runtime` — owned by the Falcon UI / platform team. The runtime leaf is **high-blast-radius** (always-mounted wrappers inject it); the editor is low-risk (the `<falcon-studio>` half is dormant, the loader-studio half is a self-contained showcase route).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L09 sweep). Both barrels read in full; runtime service + config model + validator + module registry + providers + both project.json + tsconfig aliases + MF config + host app.config wiring + showcase route all read on disk. FE-standard "route removed" claim re-checked against `falcon-ui-showcase.routes.ts` → CORRECTED (loader-studio route is LIVE; only `<falcon-studio>` is route-less). File counts: falcon-studio 101 / falcon-studio-runtime 46. Tailwind-scan half of the FE-standard claim left `[INFERRED]` (not re-verified this pass).
