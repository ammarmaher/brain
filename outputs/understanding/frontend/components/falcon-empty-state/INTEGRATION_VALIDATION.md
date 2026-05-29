# falcon-empty-state — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** `[CODE]` falcon-empty-state.component.ts — the wrapper has no `inject()`, no HTTP, no service. What *triggers* an empty-state is owned by the host:
- The **empty condition** — `[INFERRED]` the host evaluates `rows.length === 0` (or a paged-response `totalCount === 0`) after a fetch from whatever module owns that list (Commerce / Charging / Provisioning / Identity).
- The **copy** (`titleText`, `descriptionText`) — `[INFERRED]` host-supplied literals, usually i18n keys.
- The **action** — `[INFERRED]` a button the host projects into `slot="action"`, wired to the host's own command.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-empty-state.component.ts — no service injection. The empty-state renders *after* the host's fetch resolves to zero rows. |

## Validation rules (V-*)
The empty-state runs **no validation** — no form control, no CVA (`[BRAIN-OUT]` API.md:48). There are no `V-*` rules. The only correctness concerns are content presence:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[CODE]` falcon-empty-state.tsx:17-18,46 | `titleText` | omitted | the `<h3>` is not rendered (`[CODE]` :46 guards on `this.titleText`) and `aria-label` falls to `''` → `undefined` (`[CODE]` :39) — the placeholder has no announced name. |
| `[CODE]` falcon-empty-state.tsx:41 | `iconName` | not in the Falcon icon font | empty `<i>` renders inside the icon container — see `falcon-icon` registry contract. |

## PES keys gating this component
**None.** `[CODE]` falcon-empty-state.component.ts — no permission check. Whether an empty-state appears is decided by the host's data condition; *whether the action inside it is allowed* is gated by the **action button's own PES key**, not the empty-state. A PES-denied user may see the empty-state but not its CTA — the host conditionally projects (or omits) the `slot="action"` button.

## State / signal pattern
`[CODE]` falcon-empty-state.component.ts:29-53 — the wrapper uses **signal-backed `@Input()` setters** for `iconName`, `titleText`, `descriptionText`: each `@Input() set` writes a `signal<string>('')`, the getter reads it, `null`/`undefined` coerce to `''`. `size`/`useTailwind` are plain `@Input()`s. `ChangeDetectionStrategy.OnPush` (`[CODE]` :24). `ngOnInit()` calls `defineFalconTwComponent('falcon-empty-state')` (`[CODE]` :63-65). No error pipeline — nothing can fail.

`[INFERRED]` In the org-hierarchy state pattern (`[MEMORY]` SettingsTabStateSlice / Wave 14), a tab state slice exposes a `mode` signal (`loading | view | error | …`); the host renders the empty-state only in the resolved-but-zero-rows branch — the empty-state itself holds no mode.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` falcon-empty-state.tsx (Shadow DOM, `shadow:true`) `<falcon-empty-state>` / `<falcon-empty-state-tw>` (Light DOM). Reflects `size` to a host attribute (`[CODE]` :24, `reflect:true`). Declares one `<slot name="action">` (`[CODE]` :57).
- **Angular wrapper** — `[CODE]` falcon-empty-state.component.ts `<falcon-angular-empty-state>`: dual-render-path (`useTailwind`, default `true` → Light DOM). `@HostBinding('class')` adds `block`. `[BRAIN-OUT]` API.md:41-42 — the wrapper template projects `<ng-content select="[slot=action]">` into both render paths.
- Per `feedback_library_skeleton_app_api`: there is no app-level empty-state wrapper — the host evaluates the empty condition and projects copy + action.

## Integration gotchas
- `[CODE]` falcon-empty-state.tsx:56-58 — the action region is `<slot name="action">`. To place a button, the consumer must pass `<falcon-angular-button slot="action">…</falcon-angular-button>` — `[BRAIN-OUT]` API.md:61-62 — the `slot="action"` attribute is required on the projected element, especially on the Light-DOM `-tw` path.
- `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:6-7 (FES-01) — `<falcon-table>` core does **not** auto-compose this — a rich table empty-state needs an explicit `<ng-template falconDataTableEmpty>` projection.
- `[CODE]` falcon-empty-state.component.ts vs falcon-empty-state.tsx:26-28 — **`ariaLabel` is reachable only on the Stencil core, not the Angular wrapper** (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md FES-05). To make an empty-state fully presentational (`ariaLabel=""`) you must drop to the Stencil tag.
- `[CODE]` falcon-empty-state.tsx:41 — `iconName` resolves against the Falcon icon font; an unknown name renders an empty glyph (see `falcon-icon` dossier).

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-empty-state.tsx + falcon-empty-state.component.ts. No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA in the wrapper. The `ariaLabel`-wrapper-gap (FES-05) and FES-01 table-composition gap ✅ VERIFIED against source + `[BRAIN-OUT]`.
