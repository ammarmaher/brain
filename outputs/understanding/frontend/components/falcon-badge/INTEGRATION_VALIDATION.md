# falcon-badge — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-badge.component.ts — the wrapper has no `inject()`, no HTTP, no service. What the badge *displays* is resolved by the host:
- A **count** — `[INFERRED]` a number the host already holds (a list `.length`, a `totalCount` from a paged response, an unread counter). The owning module is whatever module owns that list (Commerce / Charging / Provisioning / Identity).
- A **flag / label** — `[INFERRED]` usually a static literal (`Beta`, `New`) or a derived boolean. No backend.
- The **variant** — chosen by the host's own mapping logic; the badge does not derive it.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-badge.component.ts — no service injection. The host fetches the count; the badge only renders it. |

## Validation rules (V-*)
The badge runs **no validation** — no form control, no CVA (`[BRAIN-OUT]` API.md:55). There are no `V-*` rules. The only input-quality concerns are render-correctness:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-badge.tsx:51-57 | `iconName` | a name not in the Falcon icon font | empty `<i>` renders silently — host typo, not a validation failure. |
| `[INFERRED]` | projected count | host projects `0` | badge renders "0" — host must `*ngIf` to hide a zero count. |

## PES keys gating this component
**None.** `[CODE]` falcon-badge.component.ts — no permission check. A badge's visibility is decided by the host's PES gate on the surrounding element, never independently.

## State / signal pattern
`[CODE]` falcon-badge.component.ts:31-50 — the wrapper uses **classic `@Input()` decorators**, no signals, no internal state. Pure pass-through: `@Input()` → template → Stencil prop. `ChangeDetectionStrategy.OnPush` (`[CODE]` :28). `ngOnInit()` calls `defineFalconTwComponent('falcon-badge')` (`[CODE]` :52-54) to register the Light-DOM element on first render. No error pipeline — there is nothing that can fail.

`[CODE]` falcon-badge.component.ts — **the wrapper has 6 `@Input()`s** (`variant`, `appearance`, `size`, `dot`, `iconName`, `useTailwind`). The Stencil core has a 7th, `ariaLabel` (`[CODE]` falcon-badge.tsx:37), **not surfaced on the wrapper** — the documented `[BRAIN-OUT]` GAPS_AND_UPGRADES.md FB-01 gap, confirmed against source.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` falcon-badge.tsx (Shadow DOM, `shadow:true`) `<falcon-badge>` / `<falcon-badge-tw>` (Light DOM). Reflects `variant`/`appearance`/`size`/`dot` to host attributes (`[CODE]` :20-29, `reflect:true`) so `data-*` selectors and tokens cascade.
- **Angular wrapper** — `[CODE]` falcon-badge.component.ts `<falcon-angular-badge>`: dual-render-path (`useTailwind`, default `true` → Light DOM), `@HostBinding('class')` adds `inline-flex align-middle`.
- `[BRAIN-OUT]` API.md:50-51 — the wrapper template projects `<ng-content>` into both render paths, so `<falcon-angular-badge>3</falcon-angular-badge>` works.
- Per `feedback_library_skeleton_app_api`: there is no app-level badge wrapper because there is nothing to inject — the host resolves the count and passes it down.

## Integration gotchas
- `[CODE]` falcon-badge.component.ts vs falcon-badge.tsx:37 — **`ariaLabel` is reachable only on the Stencil `<falcon-badge>` core, not the Angular wrapper.** A dot-only badge (`dot=true`, no text) built via `<falcon-angular-badge>` cannot currently carry an accessible label — drop to the Stencil tag or raise FB-01.
- `[CODE]` falcon-badge.tsx:51-57 — `iconName` has no fallback or dev warning for an unknown glyph; verify the name against the Falcon icon font (see `falcon-icon` dossier).
- `[INFERRED]` The badge is `inline-flex` — placing it as an overlay on an icon (notification-count pattern) needs the *host* to add `relative`/`absolute` positioning; the badge has no built-in overlay mode (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md notes no overlay capability — it is a flow-inline pill).

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-badge.tsx + falcon-badge.component.ts. No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA in the wrapper. REFRESH 2026-06-03 — `ariaLabel` gap re-confirmed and found Shadow-only (the `-tw` twin at `[CODE]` falcon-badge-tw.tsx:19-27 also lacks it). The `<ng-content>` projection note (line 34) is correct — verified against `[CODE]` falcon-badge.component.html:11,20. `-tw` carries an extra `rootExtraClass` prop (`[CODE]` falcon-badge-tw.tsx:27) absent from Shadow.
