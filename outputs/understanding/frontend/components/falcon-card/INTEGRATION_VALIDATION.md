# falcon-card — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-card.component.ts — the wrapper has no `inject()`, no HTTP, no service. The card is a *layout container*; whatever data appears *inside* it (in the body slot) is fetched and owned by the host feature and its module (Commerce / Charging / Provisioning / Identity). The card itself integrates with nothing.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-card.component.ts — no service injection. The card frames content; it never fetches. |

## Validation rules (V-*)
The card runs **no validation** — no form control, no CVA (`[BRAIN-OUT]` API.md:56). There are no `V-*` rules. The only correctness concern is the header footgun:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-card.tsx:48-63 | `header` + `slot="header"` | both supplied | **both render** — duplicate section title. Host must leave `header` empty when projecting a slot. |
| `[CODE]` falcon-card.component.ts:30-48 | `header`/`subheader`/`footer` | `null`/`undefined` passed | coerced to `''` by the signal setters — safe for `[header]="x | translate"`. |

## PES keys gating this component
**None.** `[CODE]` falcon-card.component.ts — no permission check. A card's visibility is decided by the host's PES gate on the section it represents, never independently. (In a PES-gated detail page, the *host* `*ngIf`s the whole card; the card has no gate of its own.)

## State / signal pattern
`[CODE]` falcon-card.component.ts:30-48 — the wrapper uses **signal-backed `@Input()` setters** for `header`/`subheader`/`footer`: each `@Input() set` writes a `signal<string>('')`, the getter reads it, and `null`/`undefined` coerce to `''`. `variant`/`size`/`rootClass`/`useTailwind` are plain `@Input()`s. `ChangeDetectionStrategy.OnPush` (`[CODE]` :25).

`[CODE]` falcon-card.component.ts:60-85 — the wrapper also declares **legacy `computed()` class helpers** (`classes`, `bodyClasses`, `headerClasses`, `footerClasses`). `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:69-70 — these are **dead code**: the modern dual-render template drives styling through `<falcon-card-tw>`, not these helpers. They are a documented cleanup opportunity, not active behaviour.

`[CODE]` falcon-card.component.ts:87-89 — `ngOnInit()` calls `defineFalconTwComponent('falcon-card')`. No error pipeline — nothing can fail.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` falcon-card.tsx (Shadow DOM, `shadow:true`) `<falcon-card>` / `<falcon-card-tw>` (Light DOM). Reflects `variant`/`size` to host attributes (`[CODE]` :15-18, `reflect:true`).
- **Angular wrapper** — `[CODE]` falcon-card.component.ts `<falcon-angular-card>`: dual-render-path (`useTailwind`, default `true` → Light DOM, Tailwind utilities; `false` → Shadow DOM, token-driven). `@HostBinding('class.falcon-angular-card')`.
- Per `feedback_library_skeleton_app_api`: there is no app-level card wrapper because there is nothing to inject — the host fetches the section data and projects it into the body slot.

## Integration gotchas
- `[CODE]` falcon-card.tsx:48-63 — **header double-render**: prop `header` + `slot="header"` both render. Pick one path.
- `[CODE]` falcon-card.component.ts:60-85 — the wrapper's `computed()` class helpers are unused dead code; do not rely on them — styling comes from the Stencil layer.
- `[BRAIN-OUT]` OVERVIEW.md:23, API.md:28 — **registry-vs-source mismatch**: the component registry lists `interactive`/`selected`/`padding`/`falcon-click` — the live `[CODE]` falcon-card.tsx + falcon-card.component.ts have **none of them**. Treat the source as truth; the card is fully passive.
- `[CODE]` falcon-card.component.ts:52-53 — `useTailwind=false` switches to the Shadow path; token overrides then only pierce via the documented CSS-var tokens.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-card.tsx + falcon-card.component.ts. No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA in the wrapper. The dead `computed()` helpers and registry mismatch are ✅ VERIFIED against source and documented here (old 6 files unedited).
