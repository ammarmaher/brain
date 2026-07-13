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

`[CODE]` falcon-card.component.ts:63-95 — the wrapper declares `computed()` class helpers (`classes`, `bodyClasses`, `headerClasses`, `footerClasses`). **CORRECTION (2026-06-03): these are the LIVE render path, NOT dead code** — they are bound in the template (`[class]="classes()"` html:15, `headerClasses()` :17, `bodyClasses()` :28, `footerClasses()` :33). The prior "dead code, styling comes from `<falcon-card-tw>`" claim is **retracted**. The Angular wrapper renders pure-Angular `<div>` chrome (Defect A FIX); it never instantiates the Stencil element.

`[CODE]` There is **no `ngOnInit` / `defineFalconTwComponent` call** in the wrapper (it renders plain Angular `<div>`s — there is no custom element to register). No error pipeline — nothing can fail.

## Skeleton ↔ app-wrapper layering
- **Angular render (LIVE)** — `[CODE]` falcon-card.component.ts + .component.html `<falcon-angular-card>`: pure-Angular `<div>`/`<header>`/`<footer>` + native `<ng-content>` (body default / `[slot=header]` / `[slot=footer]`). `@HostBinding('class.falcon-angular-card')`. `useTailwind` is a **no-op** (always Angular chrome — Defect A FIX).
- **Stencil skeleton (React/Vue ONLY)** — `[CODE]` falcon-card.tsx (`shadow:true`) `<falcon-card>` / falcon-card-tw.tsx (`scoped:true`) `<falcon-card-tw>`. Reflects `variant`/`size` (`reflect:true`). The Angular app never renders these.
- Per `feedback_library_skeleton_app_api`: no app-level card wrapper because there is nothing to inject — the host fetches section data and projects it into the body slot.

## Integration gotchas
- `[CODE]` falcon-card.component.html:16-26/32-37 — **header/footer double-render**: prop `[header]` + `[slot=header]` both render (Angular-template `<ng-content select>`, not Stencil-slot). Pick one path.
- `[CODE]` falcon-card.component.ts:63-95 — the `computed()` class helpers are **LIVE** (bound in template) — do NOT remove them (prior "dead code" claim retracted).
- `[BRAIN-OUT]` OVERVIEW / API — **registry-vs-source mismatch**: the registry lists `interactive`/`selected`/`padding`/`falcon-click` — the live source has **none**. The card is fully passive.
- `[CODE]` falcon-card.component.ts:58 — `useTailwind` is a **no-op**; it does NOT switch to a Shadow path. `--falcon-card-*` token overrides do NOT affect the Angular wrapper (only the Shadow path / React-Vue). Use `rootClass` for per-instance Angular-path overrides (FC-TOKEN-1).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B10) from `[CODE]` falcon-card.component.ts (104 ln) + .component.html (38 ln) + falcon-card.tsx. No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA. **Corrected:** the `computed()` helpers are LIVE (not dead); the wrapper renders Angular chrome (not `<falcon-card-tw>`); `useTailwind` is a no-op; token overrides don't reach the Angular path.
