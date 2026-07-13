# falcon-loader-inline — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`. Cross-reference: the sibling `falcon-loader-overlay` dossier (B-CAL) — both share `FalconLoaderService`.

## Owning backend module(s)
**None.** The component is purely presentational and **binds to no backend endpoint, no DTO, no gateway.** `[CODE]` falcon-loader-inline.component.ts has no `inject()`, no HTTP, no service. Its only data input is the Loader Studio JSON config, a **client-side UI artifact** owned by `libs/falcon-studio-runtime` (registry/loader-studio), not a backend resource. Per doctrine §6 ("Library = Skeleton, App = API") the wrapper is a dumb skeleton; the App=API layer is `FalconLoaderService`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` the loader renders UI state only. The OPERATIONS it covers hit backends (do-payment → Charging; tree refresh → Commerce; login → Identity/Zitadel), but the loader itself fetches nothing — the FLOW does. |

> `[INFERRED]` The config could in principle be persisted (a tenant-themed loader), but **no such backend wiring exists today** — config is seeded from `FALCON_LOADER_DEFAULTS` (a DI token) and edited live in the Studio.

## Validation rules (V-*)
The loader runs **no form validation** — no CVA, no form control. The only input-quality concern is config robustness:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-loader-inline.tsx:311-325 | `config` (Shadow) | malformed JSON / non-object | `parseConfig` returns `{ ...DEFAULT_INLINE_CFG }` — never throws, silent. |
| `[CODE]` falcon-loader-inline-tw.tsx:319-333 | `config` (`-tw`) | malformed JSON | `applyConfig` keeps defaults; `catch {}` comment "invalid JSON is silently ignored" — silent (no `console.warn`, unlike loader-overlay's `-tw`). |
| `[CODE]` falcon-loader.service.ts:50-58 | service `setConfig()` | config fails `validateLoaderConfig()` | rejected → `console.error`, prior config retained. **The SERVICE validates; the ELEMENT does not.** |
| `[CODE]` falcon-loader-inline.tsx:327-348 | `starsCount`/`rippleCount`/`skeletonRows` | negative / fractional | Shadow CLAMPS via `Math.max(0, Math.floor(...))`. **The `-tw` twin does NOT clamp** — `refreshSeedsIfNeeded` loops `for (i<cfg.starsCount)` raw (falcon-loader-inline-tw.tsx:338-358); a negative count is a no-op (loop doesn't run) but a fractional count truncates inconsistently vs Shadow. (Milder than the loader-overlay B-CAL G2 RangeError, but a parity divergence — GAP G4.) |

## PES keys gating this component
**None.** `[CODE]` no permission check anywhere in the wrapper or tags. A loader's visibility is decided by `FalconLoaderService` counters / the host flow, never by a PES gate. There is no role/permission dimension to a busy indicator.

## State / signal pattern
- `[CODE]` **Wrapper:** classic `@Input()` (`config`/`visible`/`target`/`useTailwind`), no signals, `OnPush` (:46). Pure pass-through: `@Input()` → `[attr.*]` on the Stencil tag + re-emit the two visibility events.
- `[CODE]` **Upstream signal layer:** `FalconLoaderService` holds the live config as `signal<FalconLoaderConfig>` (`config` readonly Signal) + visibility as `overlayVisible: computed(() => overlayCount() > 0)` and a per-target cached `isInlineVisible(target): Signal<boolean>` (falcon-loader.service.ts:30-157). Consumers bind those signals; OnPush + the signal read drive CD.
- `[CODE]` **Element internal state:** both tags hold `@State() parsed: FalconLoaderInlineCfg` + memoised `@State()` particle arrays (`stars`/`ripples` Shadow; `starSeeds`/`rippleSeeds` `-tw`), re-seeded only when the count axis changes on `@Watch('config')` so re-renders don't reshuffle the field.
- `[CODE]` **Visibility events:** both tags emit `falcon-loader-shown`/`-hidden` on `@Watch('visible')` (falcon-loader-inline.tsx:299-307 / falcon-loader-inline-tw.tsx:303-310), with `{ target }` payload → wrapper re-emits typed `@Output`s.
- **No error pipeline** — nothing fetches, so nothing surfaces to the host's HTTP error toast.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-loader-inline>` (Shadow, `shadow:true`) / `<falcon-loader-inline-tw>` (Light DOM, `shadow:false`). Pure presentational; parse `config` → render 30 groups; emit `falcon-loader-shown`/`-hidden` on the `visible` watch.
- **Angular wrapper** — `<falcon-angular-loader-inline>`: forwards `config`/`visible`/`target` as attributes, re-emits the two events as typed `@Output`s, registers the Light-DOM tag via `defineFalconTwComponent('falcon-loader-inline')` in `ngOnInit` (:147-151), toggles render path via `useTailwind`. Injects nothing.
- **App=API layer** — `FalconLoaderService` (in `falcon-studio-runtime`, a singleton via the MF share) owns show/hide counters, the live config signal, and per-target inline counters. **This is where the only "logic" lives.** The wrapper deliberately knows nothing about it (component.ts:13-15 banner: "NO service injection. NO HTTP.").
- **Global mount** — `app.ts` is the App-level binding that wires `FalconLoaderService → <falcon-angular-loader-inline>` (the host wrapper per doctrine §6).

## Integration gotchas
- `[CODE]` **`visible=false` OMITS the attr** — the wrapper binds `[attr.visible]="visible ? '' : null"` (html:17). The token cascade matches `:not([visible])`; a literal `"false"` would be PRESENT → loader stays visible. Never hardcode the attr.
- `[CODE]` **Global loader = OVERLAY counter, NOT inline counter** — `app.ts:107` binds `[visible]="overlayVisible()"`. `showInline('x')` does NOT surface the global card; it flips a per-region loader bound to `isInlineVisible('x')`. Mixing the two is the most common confusion.
- `[CODE]` **Dispose your slice, don't force-hide** — `showOverlay`/`showInline` return disposers (counter-based). Calling `hideOverlay()`/`hideInline()` force-resets ALL holders. A leaked disposer = a loader that never hides.
- `[CODE]` **Config defaults are inlined in 3 places** — `DEFAULT_INLINE_CFG` in the Shadow `.tsx`, the `-tw` `.tsx`, AND the Studio `defaults.ts` (INLINE_DEFAULTS), kept in sync only by "KEEP IN SYNC" comments (the Stencil `rootDir` pin forbids value-imports from `@falcon/studio`). Editing one without the others drifts the defaults (GAP G8, same family as loader-overlay B-CAL G8).
- `[CODE]` **`customSvg` is injected via `innerHTML`** — Shadow via a `ref` callback `el.innerHTML = raw` (falcon-loader-inline.tsx:762-766), `-tw` via `innerHTML={cfg.customSvg}` (falcon-loader-inline-tw.tsx:684). Unsanitised SVG can carry `<script>`/event handlers (GAP G-SVG, same as loader-overlay B-CAL G3) — only the Studio editor feeds it today, so risk is low, but it is a raw HTML sink.
- `[CODE]` **MF singleton** — `FalconLoaderService` is `providedIn: 'root'` and shared as an MF singleton (eager) so all remotes read the same config + counters. A remote that re-provides it would fork the loader state.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B17 — NEW) — wrapper-injects-nothing (component.ts:13-15), service counter/disposer (falcon-loader.service.ts:68-157), `visible` attr-omit binding (html:17), the global-mount overlay-counter wiring (app.ts:107), and the silent config-fallback (no throw) all re-confirmed in live source. Backend-wiring/PES absence ✅ VERIFIED (no inject, no HTTP, no permission check). `-tw` count-clamp divergence (G4) + 3-way default duplication (G8) + customSvg sink (G-SVG) recorded.
