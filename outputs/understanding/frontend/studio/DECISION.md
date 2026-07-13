# @falcon/studio + @falcon/studio-runtime — DECISION

## Brain SK final recommendation

**STATUS: SPLIT.**
- **`@falcon/studio-runtime` — READY / FOUNDATIONAL — KEEP & DEPEND ON.** The leaf is correct, signals-first, always-live runtime infrastructure. It is the canonical home for `FalconLoaderService`, the `*_DEFAULTS` tokens, and the loader config model (`FalconLoaderOverlayCfg` etc.). Wrappers MUST import from here, never the heavy barrel. The FE-CYCLE-01 extraction is a textbook cycle break — do not undo it.
- **`@falcon/studio` (loader-studio half) — ACTIVE / KEEP.** The Loader Studio editor is a live, self-contained, auth-free showcase route (`/falcon-ui-showcase/loader-studio`). It is the design-token authoring surface for the loader JSON; keep it.
- **`@falcon/studio` (`<falcon-studio>` token-editor half) — DORMANT / "HIDDEN-BUT-KEPT".** The token/theme editor shell is exported but route-less. It is the in-repo design tool preserved on disk. Treat it as experimental tooling, not a shippable customer surface. Do not build product features on it without a deliberate revive decision.

The 🟠 audit rating is **hygiene** (no in-lib tests, verbatim-defaults DRY, stale docs, a dormant editor) — NOT a design or integrity problem.

## Use these libraries for

- **`@falcon/studio/runtime`:**
  - Any runtime loader (`inject(FalconLoaderService)` → `showOverlay`/`showInline` disposers).
  - Tuning loader / uploader / data-table-skeleton defaults platform-wide (`provideFalconLoader/Uploader/DataTableSkeleton` at host root).
  - The canonical loader JSON shape + validator (`FalconLoaderConfig`, `validateLoaderConfig`, `freezeLoaderConfig`).
  - A new `@falcon/ui-core` wrapper that needs a runtime token/service — import from HERE.
- **`@falcon/studio`:**
  - Authoring a loader configuration (route to `FalconLoaderStudioComponent`, export the JSON, feed it to `provideFalconLoader({defaults})`).
  - (Experimental) embedding the live token/theme editor (`<falcon-studio />`).

## Avoid these libraries for

- **`@falcon/ui-core` wrappers must NOT import `@falcon/studio`** (the heavy editor barrel) — only `@falcon/studio/runtime`. Importing the barrel re-creates the FE-CYCLE-01 cycle and pulls the entire gallery graph into the wrapper bundle.
- **Do not treat `<falcon-studio>` (token editor) as a product feature** — it is dormant tooling.
- **Do not hand-build a new loader-control UI** — extend `FALCON_LOADER_MODULES` (declarative `LoaderModuleSpec`/`LoaderControlSpec`); the editor renders generically.
- **Do not duplicate the loader defaults** — `BUILT_IN_FALCON_LOADER_DEFAULTS` is the SoT (note the existing 3-place verbatim hazard with the Stencil primitives — don't add a 4th).

## Preferred wiring (the rule for future tasks)

1. **Runtime loader/uploader/skeleton consumers + wrappers → `@falcon/studio/runtime`.** Editor/gallery/token-tool consumers → `@falcon/studio`.
2. **Seed defaults once at the host root** via `provideFalconLoader/Uploader/DataTableSkeleton` (deep-partial override). Never re-provide in a remote.
3. **Always validate untrusted loader JSON** with `validateLoaderConfig` before `setConfig` (the service does this internally; do it explicitly at import boundaries).
4. **Balance every `showOverlay/showInline` with its returned disposer**, not with `hideOverlay()/hideInline()` (those force-reset the counter and drop other holders).
5. **New loader knobs = a new/extended `LoaderModuleSpec`** in `registry/loader-studio/modules/` + the matching field on `FalconLoaderOverlayCfg`/`InlineCfg` + a `BUILT_IN_*` default. The editor picks it up automatically.
6. **Keep the leaf a leaf** — `falcon-studio-runtime` must never import anything from the workspace except `@angular/core`. Adding a `@falcon/*` import there would risk re-introducing a cycle.
7. **Custom SVG is a trusted-input channel only** (raw `innerHTML` downstream — B-CAL).

## Relationship to other areas

- **Consumed BY:** `@falcon/ui-core/angular` wrappers (loader-overlay/inline, data-table, table, image/document-uploader, wizard-finalization) — they depend DOWN on the leaf; host-shell (`app.config.ts` providers + always-alive overlay in `app.ts` + several services); the Loader Studio editor; the showcase route.
- **Drives:** `falcon-loader-overlay` / `falcon-loader-inline` Stencil primitives (via the shared config + `FalconLoaderService` signal).
- **Re-exports:** `@falcon/studio` re-exports the entire `@falcon/studio-runtime` leaf for back-compat.
- **Sibling FE-CYCLE-01 move:** `falcon-error-dialog-host` was relocated UP into `libs/falcon/src/shared-ui` (the other leg of the same cycle fix); the loader editor surfaces import errors via `ErrorDialogService`.
- **Shared WITH (MF):** singleton/eager via the `@falcon/*` resolver branch — true singleton across federated bundles.

## Required upgrades before wider use

**None block usage.** The runtime is production-quality; the loader editor is a working tool. Hygiene backlog (all `safe-local`), in priority order:
1. **G3 — add in-lib tests** to the leaf: `validate-loader-config.spec.ts` (bad JSON / bad enum / partial-merge), `falcon-loader.service.spec.ts` (counter + disposer idempotency + `hideOverlay` reset), `merge-loader-config.spec.ts`. Cheap, high-signal for an always-mounted service.
2. **G4 — codegen the verbatim defaults** (or relocate them into a Stencil-importable leaf) so `defaults.ts` ↔ the two Stencil primitives stop relying on "KEEP IN SYNC" comments.
3. **G5/G6/G8 — refresh stale docs/paths**: host `app.config.ts:173` comment, the FE-standard `ANGULAR_AND_TAILWIND_RULES.md:147` "route removed" line, the app-level spec comment.
4. **C-1 — promote `<falcon-studio-slider>` to `@falcon/ui-core`** (close GAP-LIB-slider) so the loader editor stops being the only consumer of a lib-local control; document `<falcon-studio-color-picker>`.
5. **G9 — decide `<falcon-studio>` token editor fate**: route it (revive) or formally label it dev-tooling. No urgency.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- The loader `$schema` pin (`'falcon.loader.v1'`) and the full 88-prop overlay / 30-group inline shape.
- The 28 `FALCON_LOADER_MODULES` specs + their default values.
- The React-SoT-derived `BUILT_IN_FALCON_LOADER_DEFAULTS` colours/numerics + `FALCON_BRAND_MARK_PATH_D`.
- The studio tab registry, mood presets, popup-control matrix.

### 2. What is dynamic through inputs/options?
- `provideFalconLoader/Uploader/DataTableSkeleton({defaults})` accept **deep-partial overrides** merged over the built-ins. `[CODE]` `provide-falcon-loader.ts:13-21`.
- `FalconLoaderService.setConfig(json|object)` swaps the entire live config at runtime; `showOverlay(reason)`/`showInline(target)` are fully dynamic, counter-composed.
- The editor's draft is fully mutable per-field via `setField`; import/export round-trips arbitrary JSON.

### 3. What is dynamic through slots / templates?
- The Loader Studio editor is a **declarative renderer** — adding a `LoaderModuleSpec` to the registry adds an editor section with no template change. `[CODE]` `loader-studio.component.ts:137-157` (`visibleModules` + generic row dispatch).

### 4. What is dynamic through token/theme overrides?
- The data-table skeleton defaults point at `var(--color-falcon-neutral-*)` tokens → re-theme automatically. The loader config carries hex *as data* (not tokens), so loader colours are config-driven, not palette-driven (by design — it's a bespoke splash surface).
- The `<falcon-studio>` token editor's entire job is mutating CSS custom properties via `FalconStudioTokenMutationService`.

### 5. What is dynamic through "Tailwind classes"?
- The editor's chrome is Tailwind-utility-driven (e.g. `bg-falcon-neutral-0`, `text-falcon-neutral-900`); `falcon-studio.component.css` is the one whitelisted CSS-rule carve-out.

### 6. What is missing to make it reusable across more apps/frameworks?
- **In-lib tests** (none today) — the single biggest gap for confident reuse.
- A **Stencil-importable defaults source** to kill the 3-place verbatim copy.
- React/Vue Studio editors do not exist (Angular-only); the *config model* is already framework-neutral, so a non-Angular editor is feasible later.

### 7. What capability should be promoted (not lib-hacked)?
- `<falcon-studio-slider>` → `@falcon/ui-core` (`<falcon-angular-slider>`, GAP-LIB-slider). `<falcon-studio-color-picker>` likewise if a general picker is needed.

### 8. What flags / options would make it better?
- A `sanitizeSvg` option on the custom-svg channel (defense-in-depth for the downstream `innerHTML` sink).
- A compile-time-safe `setField` (per-module typed dispatch) to remove the `as never` erasure.
- A dev-time warn when `showOverlay` is called without its disposer ever firing (leaked loader).

### 9. What is the safest upgrade path?
1. **Phase A (zero-risk, additive):** add the three leaf specs (G3); refresh stale docs (G5/G6/G8); document the color-picker. Non-breaking.
2. **Phase B (additive):** codegen/relocate the verbatim defaults (G4); promote the slider to `@falcon/ui-core` and re-point the editor (C-1).
3. **Phase C (decision):** revive or formally retire `<falcon-studio>` (G9). Touching the editor only — no runtime blast radius.
All phases keep the leaf a leaf and the wrapper→leaf direction intact.

### 10. What is risky to change because others depend on it?
- **`FalconLoaderService` API + the `*_DEFAULTS` token identities** — injected by always-mounted wrappers + host providers across federated bundles (MF singleton). Renaming/re-creating a token breaks DI everywhere.
- **`FalconLoaderConfig` shape** — the wire contract between editor, service, and the Stencil primitives; a field change ripples to the verbatim copies in both Stencil tags.
- **The leaf's import isolation** — adding any `@falcon/*` import to `falcon-studio-runtime` risks re-creating the FE-CYCLE-01 cycle. This is the single most important invariant.
- **The `@falcon/studio/runtime` tsconfig alias** — wrappers depend on it; removing it would force them onto the heavy barrel.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L09). Recommendation: KEEP the leaf (foundational) + the loader-studio editor (live); treat the `<falcon-studio>` token editor as dormant tooling. **0 HIGH-RISK-QUEUE** (the only XSS concern lives in the loader-overlay primitives, already queued in B-CAL). All claims trace to source lines cited in OVERVIEW/SURFACE/AUDIT. The FE-CYCLE-01 leaf-extraction integrity is verified clean.
