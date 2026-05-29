# falcon-multiselect (LEGACY) — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.
> **⚠ LEGACY / DEPRECATED — and the source is no longer in the repository.**

## Legacy status (read first)
`[CODE]` Live-source check 2026-05-18: `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/` **does not exist**. A repo-wide search for `*multiselect*` (excluding `node_modules` / `dist`) returns nothing. The Wave 3 stub façade described by the existing 6 dossier files has been **deleted**. This file is a historical record.

## Owning backend module(s)
**None — and nothing remains to integrate.** `[BRAIN-OUT]` `OVERVIEW.md` — historically the *original* (pre-stub) `falcon-multiselect` had a `serverFilter` mode that implied a backend search endpoint, but the Wave 3 stub dropped server-filter entirely and the component is now deleted. No backend module owns data for it.

## Backend wiring
| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none) | — | — | — | — | `[CODE]` Component deleted. Historically the stub had `serverFilter` / `hasMore` / `scrollEnd` inputs/outputs but they were **silent no-ops** (`[BRAIN-OUT]` `API.md`) — no real wiring even in the stub. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | `[BRAIN-OUT]` `API.md` — the stub had **no CVA / Forms support** (two-way `[selectedIds]` only); no validation rule bound to it. Component now deleted. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none) | — | `[CODE]` No PES key. Component deleted. |

## State / signal pattern
`[BRAIN-OUT]` `API.md` — historically the stub exposed two-way binding via `[selectedIds]` + `(selectedIdsChange)` with **no `ControlValueAccessor`** — it could not be a Reactive Forms control. It embedded a `<falcon-angular-multi-select>` for the trivial single-list case. `[CODE]` None of this remains — the source is gone.

## Skeleton ↔ app-wrapper layering
`[BRAIN-OUT]` `OVERVIEW.md` — `falcon-multiselect` was a **bespoke Angular standalone component in `libs/falcon`** (the legacy shared-ui library), NOT part of the `falcon-ui-core` cross-framework library. It had no Stencil skeleton and no `falcon-angular-*` wrapper layering — it was a single Angular component. `[CODE]` It has now been removed from `libs/falcon` entirely.

## Integration gotchas
- `[CODE]` **The component does not exist** — importing `FalconMultiselectComponent` from `@falcon` will fail to compile. The existing `API.md` import snippet is stale.
- `[BRAIN-OUT]` `API.md` — even when the stub existed, ~25 of its inputs and several outputs (`serverFilter`, `hasMore`, `scrollEnd`, `selectAllLoading`, etc.) were **no-ops** — wiring them produced no behavior. This was a deliberate compile-compatibility shim, not a functional surface.
- `[INFERRED]` Any code or memory note still referencing `falcon-multiselect` is referencing a removed component — migrate to `<falcon-angular-multi-select>`.

## What it CAN do (integration)
- **Nothing — the component has been removed.** `[CODE]` Live-source check 2026-05-18.

## What it CANNOT do (integration)
- `[CODE]` It cannot be imported, instantiated, or wired — the source is deleted.
- `[BRAIN-OUT]` Historically it could not act as a CVA form control, could not really do server-filter / infinite-scroll (no-op stubs), and the stub could not do the dual-panel UX.

## Enhancement opportunities
- `[INFERRED]` **None for this component.** The migration target — `<falcon-angular-multi-select>` (in `falcon-ui-core`) — has its own `INTEGRATION_VALIDATION.md` with the live enhancement list (async options, method proxies, `maxSelected`, etc.).
- `[INFERRED]` If the original server-filter + infinite-scroll + cross-page Select-All capability is needed, raise it as enhancements on `<falcon-angular-multi-select>` (gaps G3 async-loading and a new dual-panel/paged variant), not as a revival here.

## Verification
🔴 INFERRED / historical. CODE-DERIVED CORRECTION: `[CODE]` live-source check 2026-05-18 confirms the component source directory and all files have been **deleted**; the existing 6 dossier files describe a Wave 3 stub that no longer ships. No integration surface remains.
