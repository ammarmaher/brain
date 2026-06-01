---
name: project_uploader_loader_config_json_pilot_2026_05_31
description: Single editable config JSON pilot (uploader+loader behavioural defaults) + uploader bg→green-50 token change; the behaviour-vs-colour single-source split rule
metadata: 
  node_type: memory
  type: project
  originSessionId: 0228138f-9cf4-46a7-9687-5f8fc396b326
---

Two related pieces of work, 2026-05-31, branch **polishing-v0.4**, **NO COMMITS**, all verified.

## A. Uploader GREEN colour — CORRECTED 2026-05-31: it's the PROCESS (progress/water) fill, NOT the row background
- **Requirement clarified by user:** the "processing" part (the bottom-up water/bar fill shown while uploading) should be green — NOT the uploader's overall row background.
- **Final state** (both at `[CODE] libs/falcon-ui-tokens/src/components/file-uploader.tokens.css`):
  - `--falcon-file-uploader-row-bg` (line ~44) → **REVERTED** to `var(--color-falcon-neutral-45, #f7f8f9)` (the original).
  - `--falcon-file-uploader-progress-fill` (line ~61) → `var(--color-falcon-teal-500,#0d3f44)` **→ `var(--color-falcon-green-500, #16a34a)`** (the PROCESS fill is now green).
- **Used green-500 (#16a34a), NOT green-50.** green-50 = `#F3F8F5` (near-white) → invisible as a water fill; the user's earlier "green-50" was for the (now-reverted) background. green-500 is the visible success-green the uploader already uses for its success ring/badge (`--falcon-file-uploader-success`), and it's saturated enough to show in BOTH light + dark mode. Real token: `[CODE] libs/falcon-theme/src/falcon-tailwind-tokens.css:90 --color-falcon-green-500: #16a34a`.
- One line hits BOTH image + document variants — shared `:where(...)` selector at `file-uploader.tokens.css:36-40`.
- Did NOT (yet) green the progress TEXT (`--falcon-file-uploader-progress-text-color`, ~line128) or spinner (`--falcon-file-uploader-spinner-color`, ~line117) — both still teal-500. Offer to green those too for full "processing is green" consistency if asked.

## B. Single editable config JSON — PILOT (uploader + loader) (DONE, test+compile+boot verified)
Goal: "one place to change all the VALUES for each component." Built the **pilot** scope the user chose.
- **NEW** `[CODE] apps/host-shell/falcon-facades/falcon-component-defaults.json` = single source for host-shell uploader (image/document/photo) + loader (inline, 24 keys) BEHAVIOURAL defaults. Values are a **verbatim snapshot** of the previously-hardcoded defaults → zero behaviour change.
- **Facade** `[CODE] host-component-configuration.facade.ts` rewritten: imports the JSON, exposes `loader`/`uploader` via `as unknown as ProvideFalcon{Loader,Uploader}Options`. `app.config.ts:174,180` already consumes `HostComponentConfigurationFacade.loader/.uploader` → **app.config UNTOUCHED**.
- **NEW** test `[CODE] apps/host-shell/tests/falcon-component-defaults.spec.ts` (vitest) — **14/14 GREEN**. Validates enum/numeric/boolean/hex fields (restores the literal-type safety lost on JSON import). Run: `npx vitest run --config apps/host-shell/vite.config.mts falcon-component-defaults` from `Falcon/falcon-web-platform-ui`.
- Verified: dev-server recompiled host-shell **clean (0 TS errors)**; reload → `appRoot present`, **0 console errors** → providers reading JSON boot fine.
- Pilot touches **host-shell ONLY** (no shared-lib edits) = low risk + reversible.

## HARD RULES learned
1. **Behaviour/structure → the JSON; Colour/theme → `*.tokens.css` design tokens.** Colours are deliberately NOT config values — locked at `[CODE] uploader-defaults.token.ts:23-25` + `file-uploader.tokens.css:6-7` ("only component DEFAULTS differ, never the visual tokens"). CSS tokens keep dark-mode + RTL + cascade; hex-in-JSON-as-input loses all that. EXCEPTION: `loader.inline.*Color/*From/*To` are Loader-Studio knob values (part of the loader's own config contract), so they stay in the JSON.
2. JSON import widens string-literals → use `as unknown as <OptionsType>` (precedent `[CODE] falcon-configuration.service.ts:42`) + a vitest validation guard. Never rely on `satisfies` once values move to JSON.
3. `uploader-document-show.defaults.json` (in `plans/`) is a **generated "DO NOT edit by hand"** SoT research extract — NOT the runtime source. Runtime uploader defaults = `BUILT_IN_FALCON_UPLOADER_DEFAULTS` const in `uploader-defaults.token.ts`. Loader uses the same trio (`loader-defaults.token.ts` → `BUILT_IN_FALCON_LOADER_DEFAULTS` in registry/loader-studio).

## Two config seams that exist today (context)
- **InjectionToken + `provide*()` trio** (uploader, loader, data-table-skeleton) — the codebase's self-declared "canonical Falcon component-config DI shape" (`uploader-defaults.token.ts:2-3`). Newer.
- **`FalconConfigurationService` + `falcon-defaults.json`** (notification, popup, empty-data) in `libs/falcon-ui-core/src/configurations/`. Wave 19 (2026-05-14). Components inject the service + call `resolve*Defaults()`.

## C. EXPAND step — DONE 2026-05-31 (verified)
JSON promoted to **`[CODE] libs/falcon-studio/src/config/falcon-component-defaults.json`** (SHARED, all 3 apps).
- `BUILT_IN_FALCON_UPLOADER_DEFAULTS` (`uploader-defaults.token.ts`) now reads `.uploader` from it (the inline const copy was DELETED → deduped + shared across host/admin/mgmt). Cast `as unknown as FalconUploaderDefaultsConfig`, per-variant `Object.freeze` kept.
- Loader slice re-exported as `FALCON_COMPONENT_DEFAULTS` via `[CODE] libs/falcon-studio/src/runtime.ts` (`export { default as FALCON_COMPONENT_DEFAULTS } from './config/...json'`); host facade reads `.loader` from it; uploader override reverted to empty `{}` (lib built-in now authoritative).
- Host pilot JSON `apps/host-shell/falcon-facades/falcon-component-defaults.json` **DELETED**; test repointed to the lib JSON (`../../../libs/falcon-studio/src/config/...`).
- **Verified:** host-shell dev recompile clean incl. the full-studio 16.7MB showcase chunk + `tsc -p libs/falcon-studio/tsconfig.lib.json --noEmit` **EXIT 0** (this is the FIRST JSON import in falcon-studio — `resolveJsonModule` inherited from `tsconfig.base.json`, works) + vitest **14/14** + app boots clean (appRoot present) + uploader bg still green-50.

**⚠️ notification/popup/empty-data NOT folded in — DELIBERATE (cycle risk).** They live in `[CODE] libs/falcon-ui-core/src/configurations/falcon-defaults.json` (read by `FalconConfigurationService`). Folding them into the falcon-studio JSON would create a `falcon-ui-core → falcon-studio` dependency CYCLE — falcon-ui-core's uploader wrappers (`falcon-image-uploader.component.ts`/`falcon-document-uploader.component.ts`) ALREADY import the uploader token FROM falcon-studio, and falcon-studio imports ui-core components → bidirectional already; deepening it risks the documented runtime.ts TDZ class of crash. They're already consolidated (one JSON + one service). **End state = TWO lib-level config JSONs (one per lib boundary) — the correct cycle-safe architecture, NOT one physical file.**

**REMAINING pre-commit gate:** full `nx build admin-console` + `nx build management-console` (heavy/OOM-risk, NOT run in-session). Change is type-identical value-source-only → risk very low; 4 independent compile/test/boot checks already pass.

## Files touched (NO COMMITS)
1. `libs/falcon-ui-tokens/src/components/file-uploader.tokens.css:44` (colour) · 2. `libs/falcon-studio/src/config/falcon-component-defaults.json` (NEW, shared SoT) · 3. `libs/falcon-studio/src/lib/services/uploader-defaults.token.ts` (built-in reads JSON) · 4. `libs/falcon-studio/src/runtime.ts` (re-export FALCON_COMPONENT_DEFAULTS) · 5. `apps/host-shell/falcon-facades/host-component-configuration.facade.ts` (reads runtime export) · 6. `apps/host-shell/tests/falcon-component-defaults.spec.ts` (NEW test) · host pilot JSON DELETED.

Related: [[project_photo_uploader_to_image_uploader_migration_2026_05_31]] · [[project_uploader_animation_fix_clippath_2026_05_30]] · [[project_wallet_admin_native_html_to_falcon_2026_05_30]].
