# @falcon/studio + @falcon/studio-runtime — SURFACE (public API / exports)

Everything re-exported from the two barrels. `@falcon/studio` re-exports the **entire** `@falcon/studio-runtime` leaf for back-compat (`export * from '@falcon/studio/runtime'`, `[CODE]` `libs/falcon-studio/src/index.ts:244`), so a `@falcon/studio` consumer sees the union of both. Prefer `@falcon/studio/runtime` for runtime-only consumers (wrappers do).

---

## A. `@falcon/studio-runtime` (the LEAF) — `libs/falcon-studio-runtime/src/index.ts`

The runtime surface the wrappers depend DOWN on. `[CODE]` `:27-103`.

### A.1 Loader config model — `registry/loader-studio/*` (re-exported flat via `:27`)

| Export | Kind | Source `[CODE]` |
|---|---|---|
| `FalconLoaderConfig` | interface — `{ $schema, overlay, inline }` | `config.types.ts:426-430` |
| `FalconLoaderOverlayCfg` | interface — **88 props across 21 numbered groups** (Stage/Logo/Logo-motion/Halo/Ring/Bubbles/Sparkles/Progress/Caption/Sub-caption/Dots/Skeleton/Vignette/Drop-tint/Animated-bg/Pattern/Stars/Waves/Ripples/Spotlight/Global-opacity) | `config.types.ts:78-235` |
| `FalconLoaderInlineCfg` | interface — **30 numbered groups** (Geometry…Trail + `customSvg`) | `config.types.ts:241-420` |
| `FalconLoaderOverlayCfgKey` / `FalconLoaderInlineCfgKey` | `keyof` aliases | `config.types.ts:434-435` |
| `FalconLoaderConfigOverride<T>` | recursive deep-partial | `config.types.ts:15-17` |
| `FalconLoaderSchemaVersion` | `'falcon.loader.v1'` | `config.types.ts:11` |
| 23 enum aliases | `FalconLoaderBgMode/BlendMode/Anim/Easing/AnimDirection/RingStyle/RingDirection/BubbleDirection/ProgressStyle/DotsStyle/BgAnimType/PatternKind/Shape/BgKind/InlineBgAnimBlend/BorderStyle/LabelTone/LabelStyle/LogoSource/CaptionWeight` | `config.types.ts:23-72` |
| `LoaderMode` (`'overlay'\|'inline'\|'both'`) · `LoaderModuleGroup` · `LoaderModuleSpec<T>` · `LoaderModuleRegistry` | module spec contract | `loader-module.types.ts:10,13,98,126` |
| `LoaderControlSpec` union + `LoaderToggleSpec/SliderSpec/SegmentSpec/SegmentOption/ColorSpec/TextSpec/FileSpec` | per-row editor control specs (discriminated by `kind`) | `loader-module.types.ts:26-92` |
| `BUILT_IN_FALCON_LOADER_DEFAULTS` | frozen seed `FalconLoaderConfig` (verbatim from React SoT) | `defaults.ts` (re-export `index.ts:49`) |
| `FALCON_BRAND_MARK_PATH_D` | the Falcon logo SVG path-d string | `defaults.ts:371` (re-export `index.ts:49`) |
| `validateLoaderConfig(input)` | structural+enum validator → `{ok,config}\|{ok:false,errors}` | `validate-loader-config.ts:51` |
| `freezeLoaderConfig(input)` | deep `Object.freeze` of a config | `validate-loader-config.ts:192` |
| `ValidateLoaderConfigResult` | result union | `validate-loader-config.ts:43-45` |
| `FALCON_LOADER_MODULES` | frozen array of **28 `LoaderModuleSpec`** (atmosphere→centerpiece→motion→typography→inline-chrome→flourish) | `modules/index.ts:69-110` |
| 28 individual `*Module` consts | `stageModule`, `globalOverlayModule`, … `noiseModule` | `modules/index.ts:38-65` |

### A.2 Loader runtime service + providers

| Export | Kind | Source `[CODE]` |
|---|---|---|
| `FALCON_LOADER_DEFAULTS` | `InjectionToken<FalconLoaderConfig>` | `loader-defaults.token.ts` (re-export `index.ts:30`) |
| `provideFalconLoaderDefaults(override?)` | `Provider` — `useFactory` merges override over built-in | `loader-defaults.provider.ts:23` |
| `mergeLoaderConfig(base, override?)` | pure deep-merge (overlay+inline only; `$schema` re-pinned) | `loader-defaults.provider.ts:34` |
| `FalconLoaderService` | `@Injectable({providedIn:'root'})` — the runtime controller | `falcon-loader.service.ts:25` |
| `FalconLoaderDismiss` | `() => void` disposer type | `falcon-loader.service.ts:22` |
| `provideFalconLoader(options?)` | aggregate bootstrap helper → `[provideFalconLoaderDefaults(...)]` | `provide-falcon-loader.ts:19` |
| `ProvideFalconLoaderOptions` | `{ defaults?: FalconLoaderConfigOverride<FalconLoaderConfig> }` | `provide-falcon-loader.ts:13-16` |

### A.3 Data-table skeleton defaults

`FALCON_DATA_TABLE_SKELETON_DEFAULTS` (token, `providedIn:'root'` factory) · `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS` · `FalconDataTableSkeletonConfig` · `FalconDataTableSkeletonAnimation` (`'pulse'\|'shimmer'\|'none'`) · `provideFalconDataTableSkeletonDefaults` · `mergeDataTableSkeletonConfig` · `FalconDataTableSkeletonConfigOverride` · `provideFalconDataTableSkeleton` · `ProvideFalconDataTableSkeletonOptions`. `[CODE]` `index.ts:43-63` + `data-table-skeleton-defaults.token.ts:17,56,72`.

### A.4 Uploader defaults

`FALCON_UPLOADER_DEFAULTS` · `BUILT_IN_FALCON_UPLOADER_DEFAULTS` · `FalconUploaderDefaultsConfig` + 6 sub-types (`FalconUploaderVariantDefaults/ProgressMode/Shape/BorderStyle/Size/FilterMode`) · `provideFalconUploaderDefaults` · `mergeUploaderConfig` · `FalconUploaderConfigOverride` · `provideFalconUploader` · `ProvideFalconUploaderOptions`. `[CODE]` `index.ts:70-95`.

### A.5 Shared component-defaults JSON

`FALCON_COMPONENT_DEFAULTS` — default-import of `./config/falcon-component-defaults.json` (uploader + loader behavioural-default slices; the host facade reads the `loader` slice to seed the always-alive overlay). `[CODE]` `index.ts:103`.

---

## B. `@falcon/studio` (the EDITOR) — `libs/falcon-studio/src/index.ts`

A large flat barrel (259 lines). Grouped by Wave. **PLUS the full leaf re-export at `:244`.**

### B.1 Loader Studio editor (the live route surface)

| Export | Kind | Source `[CODE]` |
|---|---|---|
| `FalconLoaderStudioComponent` | `<falcon-loader-studio>` — the editor page at `/falcon-ui-showcase/loader-studio` | `index.ts:254` → `components/loader-studio/loader-studio.component.ts:97` |
| `FalconLoaderStudioStateService` | editor-local DRAFT JSON state (import/export/apply-to-runtime) | `index.ts:247` → `services/loader-studio-state.service.ts:38` |
| `FalconLoaderStudioMode` (`'overlay'\|'inline'`) · `FalconLoaderStudioImportResult` | editor types | `index.ts:248-251` |

### B.2 Studio shell + central state

| Export | Kind | Source `[CODE]` |
|---|---|---|
| `FalconStudioComponent` | `<falcon-studio>` — the token/theme editor shell (route-less / dormant) | `index.ts:7` → `falcon-studio.component.ts:111` |
| `FalconStudioPageComponent` | `<falcon-studio-page>` — Wave 12B 4-region default surface | `index.ts:142` |
| `FalconStudioStateService` + `FALCON_STUDIO_TABS` | central signal state + tab registry | `index.ts:29-32` → `studio-state.service.ts:60,47` |
| `FalconStudioTabId/ScopeMode/PreviewBackground/ViewMode/TabDefinition` | studio state types | `index.ts:33-38,202` |

### B.3 Token editing + presets + export

`FalconStudioTokenEditorPanelComponent` · `FalconStudioTokenMutationService` · `FalconStudioPresetBarComponent` + `FalconStudioPresetService` + `FALCON_STUDIO_PRESETS` + `FalconStudioPreset/PresetId` · `FalconStudioExportPanelComponent` + `FalconStudioExportService` + `FalconStudioExportFormat/Filter` · `FALCON_STUDIO_TOKEN_GROUPS` + `falconStudioAllTokens` + `FalconStudioToken/TokenGroup/TokenKind/SelectOption`. `[CODE]` `index.ts:11-13,26,39-59`.

### B.4 Gallery + component registry + token introspection

`FalconStudioComponentGalleryCardsComponent` (Wave 14B single gallery entry) · `FalconStudioComponentDetailPanelComponent` · `FalconStudioComponentPreviewComponent` · `FALCON_STUDIO_COMPONENT_REGISTRY` + `FALCON_STUDIO_CATEGORIES` + `getComponentEntry`/`getComponentsByCategory` · `FALCON_GALLERY_COMPONENTS` + `FALCON_GALLERY_CATEGORY_ORDER/CATEGORIES/ALL_STATES` + `findGalleryComponent` · `listComponents`/`getComponentTokens`/`getComponentTokensFlat`/`searchTokens`/`getSemanticGroups` + `SEMANTIC_GROUP_ORDER` + `ComponentTokenMeta/ComponentTokensEntry/SemanticGroup`. `[CODE]` `index.ts:154-232`.

### B.5 Non-technical "abstract" controls + 4-region rails (Wave 7 / 12B-D)

`FalconStudioAbstractToggleComponent` · `FalconStudioAbstractSliderComponent` · `FalconStudioInternalControlRendererComponent` · `FalconStudioNestedPartPickerComponent` · `FalconStudioCommonActionsRailComponent` · `FalconStudioColorPanelComponent` · `FalconStudioAnimationPanelComponent` · `ABSTRACTION_MAP` + `moodPresets`/`togglesFor`/`slidersFor`/`findAbstractControl` + `AbstractControl/Type/View/Rail/MoodPreset/Toggle/Slider/ApplyServices/SliderLevel` · `FALCON_STUDIO_COMMON_ACTIONS` + `FALCON_STUDIO_UNIVERSAL_AXES` + `resolveTokenName`/`tokenPrefixFor` + axis types · component-example types (`FalconStudioCategory/CommonActionKey/NestedPartKey/StateKey/ColorRoleKey/AnimationPresetKey/ApplyScope/ComponentExample/ComponentRegistryEntry`). `[CODE]` `index.ts:143-201`.

### B.6 Selection / context-menu / popup / scope-chooser / custom-class (Waves 9B–10C)

`FalconStudioSelectionService` + `FalconStudioSelection/SelectArg` · `FalconStudioContextMenuService` + `FalconStudioContextMenuComponent` + `FalconStudioContextMenuState` · `FalconStudioSelectableDirective` · `FalconStudioComponentPopupService` + `FalconStudioComponentPopupComponent` + `FalconStudioPopupRequest/PopupScope` · `FalconStudioSmartTargetingService` + `FALCON_STUDIO_INTERNAL_TARGETS` + `ResolveTargetsArg/Result` · `FalconStudioScopeChooserService` + `FalconStudioScopeChooserComponent` + `FalconStudioScopeChoice/AskArgs/State` · `FalconStudioCustomClassRegistry` + `falconStudioIsValidCustomClassName`/`falconStudioNormalizeCustomClassName` + `FalconStudioCustomClassEntry` + `FalconStudioCustomClassComposerComponent`. `[CODE]` `index.ts:61-112`.

### B.7 Popup control matrix (Wave 8D / 10D / 12E)

`popupControlsFor`/`humanComponentName`/`internalControlsFor`/`hasInternalControls`/`internalControlsForPart`/`hasNestedParts`/`nestedPartsFor` + `FALCON_POPUP_BACKGROUND_PRESETS`/`FALCON_POPUP_CONTROL_LABELS`/`FALCON_POPUP_STATES`/`POPUP_CONTROL_MATRIX_SIZE`/`BASE_CONTROLS`/`INTERNAL_MATRIX_SIZE` + `FalconPopupControlKey/State/BackgroundPreset/Scope/NestedPart`. `[CODE]` `index.ts:114-139`.

### B.8 Synthetic preview + skeleton previews + stat-card

`FalconStudioCardPreviewComponent` (synthetic, no real wrapper) · `FalconStudioStatCardComponent` + `FalconStudioStatVariant/Trend` · `export * from './lib/components/skeletons'` — **~26 skeleton preview components** (`SkeletonAccordion/Button/Calendar/Card/Checkbox(-Group)/DatePicker/Dialog/Dropdown/EmailField/Input/MultiSelect/Otp(-SendDialog)/Paginator/PhoneField/Radio(-Group)/SingleUploader/StatCard/Stepper/Switch/Table/Tabs/Textarea/Toast/Tooltip/Tree(-Table)/ImageUploader/DocumentUploader`) for the gallery cards. `[CODE]` `index.ts:14-24,150,21`.

**Counts:** `@falcon/studio` barrel exports ≈**40 components + ~26 skeleton components**, ~14 services, ~8 registries/configs, dozens of types. `@falcon/studio-runtime` barrel exports **1 service** (`FalconLoaderService`) + **3 DI tokens** (`FALCON_LOADER_DEFAULTS`, `FALCON_DATA_TABLE_SKELETON_DEFAULTS`, `FALCON_UPLOADER_DEFAULTS`) + **7 `provide…` helpers** + **1 JSON default-export** + the loader config model (~30 types/enums + `FALCON_LOADER_MODULES` of 28 specs + 2 validators + the seed + brand-mark const).

## Studio-local components NOT in the barrel (internal)

`[CODE]` Several `falcon-studio` components are imported only internally and are NOT re-exported: `FalconStudioSliderComponent` (`falcon-studio-slider.component.ts` — the GAP-LIB-slider stopgap), `FalconStudioColorPickerComponent`, `FalconStudioColorChangeBadgeComponent` + its service, `FalconStudioUiBusService`, `color-conversions.ts`, the `demos/file-uploader-demo.component.ts`, `synthetic/card-preview` (this one IS exported), `registry/component-examples.registry.ts` examples (`container-nav/data-action/form/synthetic/overlay-feedback-examples.ts`), `registry/component-tokens.generated.ts`, `registry/animation-presets.config.ts`, `registry/color-palette.config.ts`, `registry/alignment-icons.ts`. These are editor-internal building blocks.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L09). Both `index.ts` barrels traced line-by-line; the leaf re-export confirmed at `falcon-studio/src/index.ts:244`. Loader config model + module registry + validator counts (88 overlay props / 30 inline groups / 28 modules) read from source. `FalconLoaderStudioComponent` export at `:254` traced to the live showcase route. Studio-local non-barrel components enumerated from `loader-studio.component.ts` + `studio-page.component.ts` import lists.
