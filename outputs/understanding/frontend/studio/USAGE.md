# @falcon/studio + @falcon/studio-runtime — USAGE

## The 3 wiring layers (loader system)

The loader system spans the leaf (runtime) + the editor + the app shell.

### Layer 1 — Host seeds the runtime defaults (once, at root)

```ts
// apps/host-shell/src/app/app.config.ts:70,174-181
import { provideFalconLoader, provideFalconDataTableSkeleton, provideFalconUploader } from '@falcon/studio/runtime';
...
...provideFalconDataTableSkeleton(),                                   // library defaults
...provideFalconLoader(HostComponentConfigurationFacade.loader),       // loader seed from facade
...provideFalconUploader(HostComponentConfigurationFacade.uploader),   // uploader seed from facade
```
`provideFalconLoader(opts)` → `[provideFalconLoaderDefaults(opts.defaults)]` → registers `FALCON_LOADER_DEFAULTS` via a `useFactory` that merges the override over `BUILT_IN_FALCON_LOADER_DEFAULTS`. `[CODE]` `provide-falcon-loader.ts:19-21` + `loader-defaults.provider.ts:23-30`. The three `*_DEFAULTS` tokens ALSO have `providedIn:'root'` factories (built-in fallback), so the wrappers work even if these `provide…` helpers are omitted. `[CODE]` `data-table-skeleton-defaults.token.ts:72-78`.

### Layer 2 — Always-alive runtime controller + mounted primitives

`FalconLoaderService` (`@Injectable({providedIn:'root'})`) seeds its live `signal<FalconLoaderConfig>` from `FALCON_LOADER_DEFAULTS`. The host shell mounts ONE always-alive `<falcon-angular-loader-overlay [configJson]="...">` bound to `runtime.config().overlay`; the wrappers read the same service signal so any `setConfig` propagates instantly. Visibility is **counter-based**: `showOverlay(reason)` returns a disposer; the overlay is visible while the counter > 0. `[CODE]` `falcon-loader.service.ts:29-98` + `apps/host-shell/src/app/app.ts` (mount) + `login-transition.service.ts` (show/dismiss around the post-login transition).

```ts
// any feature that needs a blocking loader
private readonly loader = inject(FalconLoaderService);
const done = this.loader.showOverlay('checkout-submit');
// ... async work ...
done();                                  // counter decrements; overlay hides at 0
// inline, per region:
const stop = this.loader.showInline('orders-table');
```

### Layer 3 — The Loader Studio editor authors the JSON

`<falcon-loader-studio>` (route `/falcon-ui-showcase/loader-studio`) holds a **draft** in `FalconLoaderStudioStateService` (seeded from the live runtime so the editor opens on the shipping config). The editor is a **module-driven renderer over `FALCON_LOADER_MODULES`** — zero hand-coded form fields; each row is a `LoaderControlSpec`. "Apply globally" copies the draft into the runtime; "Test Fullscreen" pushes the draft + flips the singleton overlay visible with an Esc/close-X chrome. `[CODE]` `loader-studio.component.ts:137-248` + `loader-studio-state.service.ts:143-167`.

```ts
// loader-studio-state.service.ts — the draft lifecycle
applyToRuntime(): void { this.runtime.setConfig(this._draft()); }   // :143-145
importJson(input): FalconLoaderStudioImportResult { ... validateLoaderConfig ... }  // :161-168
exportDraftJson(pretty=true): string { return JSON.stringify(this._draft(), null, 2); }  // :154-156
```

## How the editor is reached

`[CODE]` `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.routes.ts:14-18`:
```ts
{ path: 'loader-studio',
  loadComponent: () => import('@falcon/studio').then((m) => m.FalconLoaderStudioComponent) }
```
Navigated from the Showcase "Studios" section: `[CODE]` `library-section.component.ts:863` (`routerLink="loader-studio"`). Auth-free (inherits the showcase parent's no-guard config). The in-editor back button returns to the showcase.

The `<falcon-studio>` token/theme editor has **NO route** — to use it you would `import { FalconStudioComponent } from '@falcon/studio'` and drop `<falcon-studio />` into a route component yourself. No app currently does. `[CODE]` `Grep 'FalconStudioComponent'` in `apps/` = 0.

## Wrapper → leaf import pattern (FE-CYCLE-01)

Wrappers in `@falcon/ui-core/angular` import the runtime **type/service/token** from the LEAF subpath, never the heavy barrel:
```ts
// libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-overlay/falcon-loader-overlay.component.ts:23
import type { FalconLoaderOverlayCfg } from '@falcon/studio/runtime';
// .../falcon-wizard-finalization/falcon-wizard-finalization.component.ts:94
import { FalconLoaderService, type FalconLoaderDismiss } from '@falcon/studio/runtime';
// .../falcon-data-table/falcon-data-table.component.ts:48  (skeleton defaults token)
} from '@falcon/studio/runtime';
```
`[CODE]` all confirmed. The `falcon-data-table.component.ts:37` + `falcon-table.component.ts:41` comments explicitly note: "import from `@falcon/studio/runtime` (not the full barrel)" — this is the rule that keeps the wrappers off the heavy editor graph.

## Recommended usage (for future tasks)

1. **Need a blocking/inline loader at runtime?** `inject(FalconLoaderService)` and use `showOverlay/showInline` (they return disposers — always call the disposer in a `finally`/teardown). Import from `@falcon/studio/runtime`.
2. **Need to retune loader/uploader/skeleton defaults platform-wide?** Pass an override to `provideFalconLoader/Uploader/DataTableSkeleton` at the host root (deep-partial). Do NOT mutate the frozen `BUILT_IN_*` consts.
3. **Building/importing a loader JSON?** Always run it through `validateLoaderConfig` (it never throws; returns `{ok:false,errors}` for bad shapes/enums) and `freezeLoaderConfig` before handing it to the service — `setConfig` does this internally.
4. **A new wrapper that needs a runtime service/token?** Import from `@falcon/studio/runtime` (the leaf), NEVER `@falcon/studio` (the heavy editor barrel) — importing the barrel from a wrapper would re-introduce the FE-CYCLE-01 cycle.
5. **Embedding the token editor?** `<falcon-studio />` is self-contained (`providedIn:'root'` state services); just route to a wrapper that imports `FalconStudioComponent`. It is currently dormant — treat it as experimental, not "the way".
6. **Custom SVG mark?** The editor strips the outer `<svg>` wrapper (`extractSvgInner`) before storing the inner markup. ⚠ The downstream primitives inject `customSvg` via raw `innerHTML` (B-CAL XSS finding) — only ever feed trusted SVG.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `import { FalconLoaderService } from '@falcon/studio/runtime'` in wrappers | Import `FalconLoaderService` from `@falcon/studio` in a `@falcon/ui-core` wrapper (re-creates the cycle) |
| Seed defaults once at host root via `provideFalconLoader(...)` | Re-provide `FALCON_LOADER_DEFAULTS` inside a remote |
| Always call the `showOverlay/showInline` disposer | Call `hideOverlay()` to balance a `showOverlay` (it force-resets the counter, dropping other holders) |
| Validate imported JSON with `validateLoaderConfig` | Feed an unvalidated object straight to `setConfig` from untrusted input |
| Treat `@falcon/studio-runtime` as foundational (always live) | Assume `@falcon/studio` is dead — the loader-studio route is LIVE |
| Feed only trusted SVG to the custom-svg channel | Pass user-uploaded SVG through (raw `innerHTML` sink downstream) |

## Consumer Sweep (grep-verified 2026-06-03)

`[CODE]` `Grep '@falcon/studio'` (non-md) across `C:\Falcon\Falcon\falcon-web-platform-ui` = **38 files**; `Grep 'FalconLoaderService'` = **26 files**. Grouped:

**`@falcon/ui-core` wrappers importing the LEAF (`@falcon/studio/runtime`):**
- `libs/falcon-ui-core/.../falcon-data-table/falcon-data-table.component.ts:48` + `falcon-table/falcon-table.component.ts:52` (skeleton defaults token).
- `libs/falcon-ui-core/.../falcon-image-uploader/...:22` + `falcon-document-uploader/...:22` (`FALCON_UPLOADER_DEFAULTS`).
- `libs/falcon-ui-core/.../falcon-wizard-finalization/...:94` (`FalconLoaderService`).
- `libs/falcon-ui-core/.../falcon-loader-overlay/{component.ts:23,index.ts:6}` + `falcon-loader-inline/{component.ts:26,index.ts:7}` (config types).

**Host-shell runtime consumers:**
- `apps/host-shell/src/app/app.config.ts:70,174-181` (installs the 3 `provide…`).
- `apps/host-shell/src/app/app.ts` (always-alive loader overlay).
- `apps/host-shell/falcon-facades/host-component-configuration.facade.ts` (loader + uploader seed).
- `apps/host-shell/src/app/core/auth/login-transition.service.ts`, `shared-components/{service-pricing, do-payment-priority-popup, organization-hierarchy-tree}/...` (`FalconLoaderService` show/dismiss).
- `apps/management-console/.../contact-groups/.../upload-group-details-step.component.ts` (uploader/loader use).

**Editor (in `falcon-studio`, depends on the leaf):**
- `libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.ts`, `libs/falcon-studio/src/lib/services/loader-studio-state.service.ts`.

**Route + nav:** `apps/host-shell/.../falcon-ui-showcase/falcon-ui-showcase.routes.ts:17`, `library-section.component.ts:863`.

**Build/config + ambient:** `tsconfig.base.json:55-60`, `eslint.config.mjs`, `scripts/ensure-libs.mjs`, `libs/falcon-ui-core/web-types.json`, `libs/falcon-ui-core/src/components.d.ts`, both `*.tokens.css` for loader.

**App-level test (NOT in-lib):** `apps/host-shell/tests/falcon-component-defaults.spec.ts` (references the OLD `libs/falcon-studio/.../loader-studio` path in a comment `:14` — stale after the leaf move).

**Editor orphan:** `FalconStudioComponent` (`<falcon-studio>`) — 0 app routes/mounts (consumers = the lib's own barrel + showcase docs).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L09). 3-layer loader wiring traced through host `app.config.ts` (provide), `falcon-loader.service.ts` (signal+counter), and the editor draft/apply path. Wrapper→leaf imports confirmed on 8 wrapper files. Consumer counts (`@falcon/studio`=38, `FalconLoaderService`=26) grep-verified. Editor route LIVE at `falcon-ui-showcase.routes.ts:17`; `<falcon-studio>` route-less confirmed.
