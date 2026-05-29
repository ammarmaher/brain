# falcon-icon — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-icon.component.ts — the wrapper has no `inject()`, no HTTP, no service. Its only "integration" is with a **build-time asset**, not a backend:
- `[CODE]` `libs/falcon-theme/src/styles/falcon-icons.css` — the icon-font registry CSS (the glyph names).
- `[CODE]` `libs/falcon-theme/src/assets/fonts/falcon-icons/` — the `.woff`/`.ttf` font asset.

No backend module owns icon data. The `name` input is a literal chosen by the developer at authoring time.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-icon.component.ts — no service injection. The icon is a font glyph, not a fetched resource. |

## The registry integration (build-time)
`[CODE]` falcon-icon.tsx:34-35 — the integration the component *does* have is with the **central icon-font registry**:
- The component renders `class="falcon-icon falcon-icon-{name}"`.
- `falcon-icons.css` defines a `@font-face` (the `falcon-icons` font) and one `.falcon-icon-{name}::before { content: "\eXXX" }` rule per glyph.
- `[CODE]` falcon-icon.tsx:2-3 — the font CSS is **loaded once globally**; `[BRAIN-OUT]` API.md:67 — the font-face "cascades through Shadow boundaries naturally; no per-component font loading."
- **Contract:** the component is decoupled from the registry — it never imports it; it relies on `falcon-icons.css` being present in the global stylesheet chain. If the registry is not loaded, *every* icon on the page is blank.

## Validation rules (V-*)
The icon runs **no validation** — no form control, no CVA (`[BRAIN-OUT]` API.md:46). There are no `V-*` rules. The only correctness concerns are registry-resolution and a11y posture:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-icon.tsx:34-35 | `name` | name not in `falcon-icons.css` | empty `<i>` renders silently. |
| `[CODE]` falcon-icon.tsx:15 | `name` | omitted | empty `<i>` — `name` is required. |
| `[CODE]` falcon-icon.tsx:28-31 | `label` | `decorative=false` with no `label` | `aria-label` left `undefined` — meaningful icon un-announced. |

## PES keys gating this component
**None.** `[CODE]` falcon-icon.component.ts — no permission check. An icon's visibility is decided by the host's PES gate on the surrounding control, never independently.

## State / signal pattern
`[CODE]` falcon-icon.component.ts:33-54 — the wrapper uses **signal-backed `@Input()` setters** for `name` and `label`: each `@Input() set` writes a `signal<string>('')`, the getter reads it, `null`/`undefined` coerce to `''`. `size`/`decorative`/`useTailwind` are plain `@Input()`s. `ChangeDetectionStrategy.OnPush` (`[CODE]` :28). `ngOnInit()` calls `defineFalconTwComponent('falcon-icon')` (`[CODE]` :63-65). No error pipeline — nothing can fail.

`[BRAIN-OUT]` GAPS_AND_UPGRADES.md:69-71 — performance note: each `<falcon-angular-icon>` is a small component instance; for hot paths with >200 icons (table rows × icons) the bare `<i class="falcon-icon …">` is cheaper. This is a documented integration trade-off.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` falcon-icon.tsx (Shadow DOM, `shadow:true`) `<falcon-icon>` / `<falcon-icon-tw>` (Light DOM). Reflects `size`/`decorative` to host attributes (`[CODE]` :19-23, `reflect:true`); `data-size` on host.
- **Angular wrapper** — `[CODE]` falcon-icon.component.ts `<falcon-angular-icon>`: dual-render-path (`useTailwind`, default `true` → Light DOM Tailwind utilities consuming per-size tokens; `false` → Shadow DOM). `@HostBinding('class')` adds `inline-flex align-middle`.
- Per `feedback_library_skeleton_app_api`: there is no app-level icon wrapper — there is nothing to inject; the glyph name is a static literal.

## Integration gotchas
- `[CODE]` falcon-icon.tsx:34-35 — **registry coupling**: `falcon-icons.css` must be in the global stylesheet chain or every icon is blank. Verify the theme stylesheet is imported at app bootstrap.
- `[CODE]` falcon-icon.tsx — **colour is `currentColor`** — the icon has no `color` input. To colour it, set `text-falcon-*` on the parent. `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:74 — `currentColor` breaks under gradient-text parents (gradients do not apply to glyphs) — acceptable, but a known limit.
- `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:28-34 — the platform also has **Iconify** (`iconify-icon` package) for non-Falcon glyphs. The two icon systems are not unified — a proposed `name`-prefix router (`solar:pencil-bold` → Iconify) is a `GAP`. Today: Falcon glyphs → `<falcon-angular-icon>`; everything else → `<iconify-icon>`.
- `[CODE]` falcon-icon.tsx — no `spin`/`pulse` animation; consumers add Tailwind `animate-spin` on the host (`GAPS_AND_UPGRADES.md` P1).

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-icon.tsx + falcon-icon.component.ts + the verified `falcon-icons.css` registry (~322 declarations). No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA in the wrapper. Registry-coupling contract ✅ VERIFIED against source.
