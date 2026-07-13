# falcon-empty-data — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-empty-data.component.ts — the wrapper injects only `FalconConfigurationService` (for default copy), never an HTTP/API service. What *triggers* an empty-data card is owned by the host:
- The **empty condition** — `[INFERRED]` the host (or the data-table) evaluates `rows.length === 0` after a fetch from whatever module owns that list (Commerce for clients/templates/contracts, Identity for users, etc.).
- The **copy** (`titleText`/`body`/`iconKey`) — host-supplied literals (usually i18n keys) OR the app-level defaults from `FalconConfigurationService`.
- The **CTA action** — `[INFERRED]` wired by the host via `(actionClick)` (direct) or `(emptyDataAction)` (through the table) to the host's own "Add" command.

## Backend wiring
| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` no HTTP in the wrapper. The card renders *after* the host/table resolves to zero rows. |

> `[INFERRED]` The card never calls an endpoint. It emits `falcon-action-click` → wrapper `(actionClick)` → (if via table) `(emptyDataAction)` → the host's add-command, which is what hits the backend.

## Validation rules (V-*)
The empty-data card runs **no validation** — no form control, no CVA. There are no `V-*` rules. The only correctness concerns are content presence + config wiring:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` tsx:283 | `titleText` | omitted (and no config default) | renders an empty title `<div>`; the card has no announced heading (the title isn't a heading anyway). |
| `[CODE]` tsx:317 | `infoText` | `showInfo=true` but `infoText=''` | the info chip does NOT render (needs both). |
| `[CODE]` falcon-data-table.component.ts:1020 vs 1056 | `[emptyData]` config | a `*falconDataTableEmpty` template is ALSO projected | the projected template wins; the `[emptyData]` config is silently ignored. |
| `[CODE]` tsx:245 | `opacity` | out of 0..100 | clamped to `[0,100]` then ÷100 (`Math.max(0, Math.min(100, …))`). |

## PES keys gating this component
**None.** `[CODE]` falcon-empty-data.component.ts — no permission check. Whether the card appears is decided by the host's (or table's) zero-row condition; *whether the CTA inside it is allowed* is the host's decision — the host sets `showAction=false` for PES-denied lists (`[CODE]` org-hierarchy-page-menu.component.ts:128 hard-falses `showAction`/`showInfo`). The card itself carries no PES key.

## State / signal pattern
`[CODE]` falcon-empty-data.component.ts:
- Signal-backed `@Input set` for `titleText`/`body`/`actionLabel`/`infoText`/`useTailwind` (each writes a `signal<string|boolean>`; `null`/`undefined` coerce to the `''`/`true` sentinel). Other inputs are plain fields.
- `ngOnInit()` → `defineFalconTwComponent('falcon-empty-data')` (belt-and-braces; the module-level eager `defineCustomElement` already ran) + `applyConfigDefaults()`.
- `applyConfigDefaults()` (`[CODE]` ts:190-240) calls `cfg.resolveEmptyData({...current})` and writes resolved values back into any input still at its `''`/`undefined` sentinel — **per-instance bindings always win**.
- `useTailwind` is a signal specifically so the data-table's `inst.useTailwind = false` patch re-evaluates the `@if` branch under OnPush.
- Error pipeline: none — the card emits no HTTP, nothing can fail.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-empty-data>` (Shadow, `shadow:true`) / `<falcon-empty-data-tw>` (Light DOM). Pure presentational; emits `falcon-action-click`. Renders the glyph as an inline-SVG switch (8 keys), the CTA as a native `<button>`, the info chip as a `<div>`. NO slots, NO methods.
- **Angular wrapper** — `<falcon-angular-empty-data>`: tag-switcher on `useTailwind`, hydrates defaults from the config service, bridges `falcon-action-click` → `(actionClick)`. **Eager `defineCustomElement` at module load for BOTH variants** (`[CODE]` ts:50-55) — load-bearing (see API Constraints).
- **Data-table integration** — `[CODE]` falcon-data-table.component.ts:390/505/1056-1083 — `<falcon-angular-data-table [emptyData]>` programmatically `createComponent(FalconAngularEmptyDataComponent)`, mounts it into the Stencil empty slot (`mode='table'`), `patchEmptyDataInstance()` pushes each defined config key via `setIfDefined`, applies "empty-data chrome" padding, tears it down on destroy / when a projected template appears.
- Per `feedback_library_skeleton_app_api` — the wrapper never fetches; the host/table owns the data condition.

## Integration gotchas
- `[CODE]` **Mixed binding style is deliberate** — boolean/numeric/object props use `[prop]="…"` (property), string props use `[attr.*]` (`[CODE]` component.html:7-13). `[attr.x]=null` for `false` would hit the Stencil `@Prop` default `true`. Do not normalise to all-`[attr.*]`.
- `[CODE]` **Eager `defineCustomElement` must stay** — without it, the data-table's detached-host mount path lets Angular write `showAction`/`showInfo` (Stencil default `false`) before the proxy upgrades, permanently shadowing them (the long ts:28-49 comment documents this exact bug). Do not lazy-load this wrapper.
- `[CODE]` **`[emptyData]` config is ignored if a `*falconDataTableEmpty` template is projected** (`[CODE]` falcon-data-table.component.ts:1020) — the legacy template path wins. Pick one.
- `[CODE]` **`falcon-action-click` is camelCase-named at the source `eventName: 'falcon-action-click'`** — it IS kebab-case (good, consistent with the library). The wrapper binds `(falcon-action-click)`; a direct Stencil consumer uses `addEventListener('falcon-action-click', …)`.
- `[CODE]` **The `-tw` variant ships extensive inline `style`** (token-referenced) for gradient/border/colors (A8) — Studio token-runtime mutation of `--falcon-empty-data-*` reaches it because the inline values are `var()` references, not literals.
- `[CODE]` **No `defineFalconTwComponent` race for direct use** — `ngOnInit` re-asserts the define for lazily-loaded callers.

## Verification
🟢 CODE-DERIVED 2026-06-03 (B12, NEW) from `[CODE]` falcon-empty-data.component.ts + .tsx + .types.ts + the data-table integration (falcon-data-table.component.ts:390/505/1056-1083). No backend wiring / V-rules / PES — confirmed by the absence of HTTP/CVA and the presence of only `FalconConfigurationService`. The eager-define correctness fact, mixed-binding rationale, and template-precedence are ✅ VERIFIED against source.
