# <component> — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
<Which backend service owns the data this component reads/writes: Commerce / Charging / Provisioning / Identity. "None" if presentational-only.>

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|

## State / signal pattern
<State slice, signals consumed/produced, error-pipeline behavior, loading/disabled wiring.>

## Skeleton ↔ app-wrapper layering
<Library skeleton (presentational) vs app-level wrapper (injects services) — per `feedback_library_skeleton_app_api`. Name both layers if they exist.>

## Integration gotchas
<HttpContext clobber, camelCase wire, race conditions, re-mount traps, etc.>

## Verification
<✅ VERIFIED | 🟡 CODE-DERIVED | 🔴 INFERRED — and against what.>
