# falcon-stepper-legacy — Integration & Validation Layer

> Layer 3 of 3. 🔴 **DEPRECATED / DELETED COMPONENT.** Documents a component that no longer exists (deleted 2026-05-17, `[CODE]` libs/falcon/src/shared-ui/index.ts:11-13).

## Owning backend module(s)
**None — and never any.** Like the live stepper, the deleted bespoke component was presentational: it owned navigation state only, no HTTP. The flows it served (Add Client → Commerce, Add User → Identity) wired their own backends in the parent wizard.

## Backend wiring
N/A — no calls, then or now.

## Validation rules (V-*)
Navigation validation (which step is reachable) only — never field validation. The live equivalent is documented at **`falcon-stepper/INTEGRATION_VALIDATION.md`** (linear gate / forward-lock gate / disabled gate via `resolveNavigationBlock()`).

## PES keys gating this component
None of its own — a presentational primitive inherits the flow's PES posture. Unchanged in the live replacement.

## Integration continuity

➡️ All integration semantics moved to `<falcon-angular-stepper>` — see **`falcon-stepper/INTEGRATION_VALIDATION.md`**. The deleted component's directive-based content projection (`<falcon-step>`) was replaced by the `[steps]` array + `slot="content-{value}"` model; the bespoke linear gate by `mode="linear"` + `[forwardLockedFrom]` + the `(navigationBlocked)` Output.

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Zero backend surface (by design, then and now). Redirect → `falcon-stepper/INTEGRATION_VALIDATION.md`.
