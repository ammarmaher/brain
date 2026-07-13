# falcon-loader-overlay — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None.** The component is purely presentational and **binds to no backend endpoint, no DTO, no gateway.** `[CODE]` falcon-loader-overlay.component.ts — the wrapper has no `inject()`, no HTTP, no service. Its only data input is the Loader Studio JSON config, which is a **client-side UI artifact** owned by `libs/falcon-studio-runtime` (registry/loader-studio), not a backend resource. Per doctrine §6 ("Library = Skeleton, App = API") the wrapper is a dumb skeleton; the App=API layer is `FalconLoaderService`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-loader-overlay.component.ts — no service injection, no fetch. The loader renders UI state only. |

> The JSON config could in principle be persisted (a tenant-themed boot loader), but **no such backend wiring exists today** — the config is seeded from `FALCON_LOADER_DEFAULTS` (a DI token) and edited live in the Studio. `[INFERRED]` any future "save my loader theme" feature would add a Commerce/Identity settings endpoint; none is present now.

## Validation rules (V-*)
The overlay runs **no form validation** — no CVA, no form control (`API.md` "CVA/ngModel"). There are no `V-*` rules. The only input-quality concern is config robustness:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-loader-overlay.tsx:265-277 | `config` (Shadow) | malformed JSON | swallowed silently → falls back to `DEFAULT_OVERLAY_CFG` (never throws). |
| `[CODE]` falcon-loader-overlay-tw.tsx:382-387 | `config` (`-tw`) | malformed JSON | caught → `console.warn` + falls back to defaults. **Divergence:** `-tw` logs, Shadow is silent (GAPS G2). |
| `[CODE]` falcon-loader.service.ts:50-58 | service `setConfig()` | config fails `validateLoaderConfig()` | rejected → `console.error`, prior config retained. The *service* validates; the *element* does not. |
| `[CODE]` falcon-loader-overlay.tsx:282,292,301 | `bubbleCount`/`sparkleCount`/`starsCount` | negative / fractional | clamped via `Math.max(0, Math.floor(...))` so the particle loops can't blow up. **Shadow clamps; `-tw` does NOT** (`[CODE]` falcon-loader-overlay-tw.tsx:392-411 uses raw `cfg.bubbleCount`) — GAPS G2 (a negative count in `-tw` → `Array.from({length:-1})` throws RangeError). |

> The real config validation (`validateLoaderConfig` / `freezeLoaderConfig`) lives in `libs/falcon-studio-runtime` and is invoked by `FalconLoaderService.setConfig()`, NOT by the element. The element trusts its `config` string and only guards against parse failure.

## PES keys gating this component
**None.** `[CODE]` falcon-loader-overlay.component.ts — no permission check. A loader's visibility is decided by `FalconLoaderService` counters / the host's own flow logic, never by a PES gate. There is no role/permission dimension to a boot splash.

## State / signal pattern
`[CODE]` the wrapper uses **classic `@Input()` decorators** (`config`, `visible`, `useTailwind`), no signals, `OnPush` (`[CODE]` :34). Pure pass-through: `@Input()` → `configJson()` → `[attr.config]` on the Stencil tag.
- **Upstream signal layer:** `FalconLoaderService` (`[CODE]` falcon-loader.service.ts) holds the live config as a `signal<FalconLoaderConfig>` and visibility as a computed `overlayVisible: Signal<boolean>` over a counter. Consumers bind `[config]="loader.config().overlay"` + `[visible]="loader.overlayVisible()"`; OnPush + the signal read drive CD.
- **Element internal state:** both Stencil tags hold `@State() parsed: FalconLoaderOverlayCfg` + memoised `@State()` particle arrays (`bubbles`/`sparkles`/`stars`), re-seeded only on `@Watch('config')` so paints don't reshuffle the field (`[CODE]` falcon-loader-overlay.tsx:225-308).
- **No error pipeline** — there is nothing that fetches, so nothing surfaces to the host's HTTP error toast.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-loader-overlay>` (Shadow, `shadow:true`) / `<falcon-loader-overlay-tw>` (Light DOM, `shadow:false`). Pure presentational; parse `config` → render 21 groups; emit `falconLoaderShown`/`falconLoaderHidden` (on `visible` watch) + `falcon-loader-overlay-close` (on close click).
- **Angular wrapper** — `<falcon-angular-loader-overlay>`: forwards `config`/`visible` as attributes, re-emits the three events as `@Output`s, registers the Light-DOM tag via `defineFalconTwComponent('falcon-loader-overlay')` in `ngOnInit` (`[CODE]` :102-106), toggles render path via `useTailwind`. Injects nothing.
- **App=API layer** — `FalconLoaderService` (in `falcon-studio-runtime`, a singleton via the MF share) owns show/hide counters, the live config signal, and per-target inline counters. **This is where the only "logic" lives.** The wrapper deliberately knows nothing about it (`[CODE]` falcon-loader-overlay.component.ts:10-12 banner).

## Integration gotchas
- `[CODE]` falcon-loader-overlay.component.html:13-16 vs falcon-loader-overlay.tsx:234-239 — **event-name mismatch:** wrapper listens `(falcon-loader-shown)`/`(falcon-loader-hidden)`, Stencil emits `falconLoaderShown`/`falconLoaderHidden`. The two `@Output`s likely never fire from a DOM event. Only `falcon-loader-overlay-close` matches. **GAPS G1 — HIGH-RISK-QUEUE (behavior).** Integrators must NOT depend on `(falconLoaderShown)`/`(falconLoaderHidden)`.
- `[CODE]` falcon-loader-overlay-tw.tsx:392-411 — **`-tw` particle counts are unclamped** while Shadow clamps. A config with a negative `bubbleCount`/`sparkleCount`/`starsCount` throws `RangeError` in the `-tw` (default) path but renders fine in Shadow. **GAPS G2.**
- `[CODE]` falcon-loader-overlay-tw.tsx:373-379 vs falcon-loader-overlay.tsx:269 — **config-envelope divergence:** `-tw` unwraps `{ overlay: {...} }`; Shadow merges the raw object. Pass the SAME shape and the two paths disagree on what they read. **GAPS G2.**
- `[CODE]` falcon-loader-overlay.tsx:794-796 / falcon-loader-overlay-tw.tsx:933-938 — **`customSvg` → `innerHTML`** in both paths. No sanitisation. If a tenant/untrusted Studio export supplies `customSvg`, that is a stored-markup / XSS-adjacent exposure. **GAPS G3 — HIGH-RISK-QUEUE (security).**
- `[CODE]` falcon-loader-overlay-tw.tsx:1122 — **`min-height: 100vh`** on the `-tw` stage breaks containment; consumers must override with `!min-h-0`. **GAPS G7.**
- `[CODE]` loader-overlay.tokens.css:255-271 — the **Angular wrapper host is intentionally excluded** from the `:not([visible])` display:none rule (only the inner Stencil tags are targeted) because `@Input() visible` does NOT reflect to the wrapper host attribute. Integrators must rely on the inner tag's visibility, not the wrapper host's — documented in the token file comment.

## Verification
🟢 code-verified — backend-absence, no-CVA, no-PES, and the App=API layering are confirmed by the absence of `inject()`/HTTP/CVA in the wrapper and the presence of `FalconLoaderService`. Event-name mismatch (G1), `-tw` unclamped counts (G2), and `customSvg` innerHTML (G3) are 🟢 code-verified by direct line citation; the *runtime* impact of G1 is 🟡 code-derived (not reproduced in a browser this pass).
