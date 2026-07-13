# falcon-stepper-legacy — Business Layer

> Layer 2 of 3. 🔴 **DEPRECATED / DELETED COMPONENT.** This dossier documents a component that **no longer exists in the codebase** (deleted 2026-05-17, `[CODE]` libs/falcon/src/shared-ui/index.ts:11-13).

## Business purpose (historical)

It was the progress-rail spine of the early org-hierarchy Add Client / Add User wizards — visualizing the ordered multi-step business process and (in linear mode) enforcing complete-in-order. That business role is unchanged; it simply moved to a different component.

## Business continuity

➡️ The SAME business rules now live on **`<falcon-angular-stepper>`** — see **`falcon-stepper/BUSINESS.md`**:
- Wizard steps must be completed in order (linear gate).
- Forward navigation is blocked while the current step is invalid (`forwardLockedFrom`).
- A completed step stays revisitable.
- Optional steps are marked, broken steps paint red.

No business capability was lost in the deletion — it was a like-for-like consolidation onto the dual-render Stencil component.

## Business gotchas

- The only deletion-era risk was the selector-string collision (`falcon-stepper` Angular bespoke vs `falcon-stepper` Stencil tag). Consolidating onto the namespaced `<falcon-angular-stepper>` removed that ambiguity — a net business-safety improvement (no chance of importing the wrong stepper).

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Business rules carried forward to the live component (no loss). Redirect → `falcon-stepper/BUSINESS.md`.
