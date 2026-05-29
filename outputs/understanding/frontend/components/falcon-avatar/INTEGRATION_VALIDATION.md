# falcon-avatar — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational — it owns no data and binds to no endpoint.** Its three inputs are resolved by the host feature:
- `src` — an image URL. `[INFERRED]` For a node logo / user photo this is a field on a Commerce node record or an Identity user record, surfaced through the gateway the host page already uses. `[MEMORY]` project_info_panel_backend_integration_wave15 — the org-hierarchy info panel carries a `ProfilePicture` field on `GetMainNodeInfoResponse` (Commerce, via System Gateway) — that is the natural `src` source.
- `initials` — a string computed *in the host component* from a name (`[BRAIN-OUT]` USAGE.md:19-22). No backend call.
- `iconName` — a Falcon-icon-font glyph name (see `falcon-icon` dossier). No backend call.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` falcon-avatar.component.ts — wrapper has no `inject()`, no HTTP. The host page fetches the record; the avatar only renders `src`/`initials`/`iconName`. |
| `[INFERRED]` `commerce/information?NodeId=` | GET | Commerce | `GetMainNodeInfoResponse.ProfilePicture` | System Gateway | `[MEMORY]` Wave 15 — the info-panel record that would feed a node `src`. |

## Validation rules (V-*)
The avatar runs **no validation** — it has no form control, no CVA (`[BRAIN-OUT]` API.md:53). The only input-quality concerns are render-correctness, not V-rules:
| Concern | Field | Trigger | Effect |
|---|---|---|---|
| `[BRAIN-OUT]` Long initials overflow | `initials` | 3+ characters passed | Letters overflow the disc — `GAPS_AND_UPGRADES.md` notes max 2 chars. Host must trim. |
| `[BRAIN-OUT]` Empty-string src trap | `src` | `src=""` passed (vs `undefined`) | `[CODE]` falcon-avatar.tsx:40 `!!this.src` is `false` for `""`, so it correctly falls to initials — *but* `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:75 flags a residual `<img src="">` risk on the legacy path. Host should pass `undefined`, never `""`. |

## PES keys gating this component
**None.** `[CODE]` falcon-avatar.component.ts — no permission check. Visibility of an avatar is decided entirely by the host page's own PES gate on the surrounding section/row; the avatar itself is never independently gated.

## State / signal pattern
`[CODE]` falcon-avatar.component.ts:30-54 — the wrapper uses **classic `@Input()` decorators**, no signals (contrast: `falcon-card`/`falcon-icon`/`falcon-empty-state` wrappers use signal-backed input setters). It is a pure pass-through: `@Input()` → template binding → Stencil prop. No `OnChanges`, no internal state, no error pipeline. `ChangeDetectionStrategy.OnPush` (`[CODE]` :27).

`[CODE]` falcon-avatar.component.ts:57-59 — `ngOnInit()` calls `defineFalconTwComponent('falcon-avatar')` to lazily register the Light-DOM custom element on first render.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` falcon-avatar.tsx (Shadow DOM, `shadow:true`) `<falcon-avatar>` / `<falcon-avatar-tw>` (Light DOM). Pure presentational; reflects `size`/`shape`/`status` to host attributes (`[CODE]` :28-34, `reflect:true`).
- **Angular wrapper** — `[CODE]` falcon-avatar.component.ts `<falcon-angular-avatar>`: dual-render-path (`useTailwind` switch, default `true` → Light DOM), `@HostBinding('class')` adds `inline-flex align-middle`.
- Per `feedback_library_skeleton_app_api`: the avatar never fetches — the **app/state layer resolves `src` and computes `initials`**, then passes them down. There is no app-level avatar wrapper because there is nothing to inject.

## Integration gotchas
- `[CODE]` falcon-avatar.tsx:40-42 — **no `<img onerror>` handler.** A 404'd `src` shows the browser broken-image graphic; the component does NOT fall back to initials at runtime. The host must validate the URL upstream or accept the broken graphic until the `GAPS_AND_UPGRADES.md` P1 fix lands.
- `[CODE]` falcon-avatar.component.ts:52-53 — `useTailwind` defaults `true` → renders `<falcon-avatar-tw>` (Light DOM). Token overrides on Light DOM cascade normally; on the Shadow path (`useTailwind=false`) only the documented CSS-var tokens pierce the boundary.
- `[INFERRED]` Setting `[status]` requires a presence data source Falcon does not yet emit (see `BUSINESS.md`) — wiring it to a static value produces a permanently-stale dot.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-avatar.tsx + falcon-avatar.component.ts. No backend wiring, no V-rules, no PES — confirmed by the absence of `inject()`/HTTP/CVA in the wrapper source. Info-panel `ProfilePicture` link is `[INFERRED]` from `[MEMORY]`.
