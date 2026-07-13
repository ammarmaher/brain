# falcon-unsaved-changes-host — TOKENS

> **Minimal by design.** This unit is a service + a no-op host — it has **no token contract of its own**, and (in Phase 5) renders nothing. This file says so explicitly per SWEEP-SPEC §7.

## Component token file

**None.** `[CODE]` listing 2026-06-03 — there is no `unsaved-changes.tokens.css`. The service is pure TS; the host's inline template renders `<falcon-angular-popup variant="unsaved">` only when `active()` fires (never, in Phase 5).

## What paints the visible output

Nothing paints from this unit in Phase 5. When `confirm()` is called, the visible leave-confirmation modal comes from:
- `FalconModalAdapterComponent` (orchestrator-bound) rendering the `action-required` message.
- That adapter composes `<falcon-angular-popup>` — so the visual tokens are **`falcon-popup`'s** (which itself has NO token file and uses Falcon palette tokens via Tailwind utilities + an inline `styles:` block — see `falcon-popup/TOKENS.md`, GAP G-TOKENS there).

The historical render path (when the host actually rendered) was `<falcon-angular-popup variant="unsaved">` directly — same popup, same (non-)token story. That path is dead now.

## Related Falcon theme tokens

Indirect only — whatever `falcon-popup` consumes (palette neutrals/teal/red for the action-required intent). This unit references none directly.

## Tailwind utility guidance

- The host element (`falcon-unsaved-changes-host`) renders nothing — utilities on it are pointless.
- Do NOT add classes to "style the unsaved host" — there is no surface. Style `falcon-popup` instead.

## Dark mode support

Inherited entirely from `falcon-popup` / theme tokens. This unit has no dark-mode rules.

## Density support

None directly.

## RTL support

Inherited from `falcon-popup` (logical-property layout). This unit contributes nothing.

## Static style risks

- `[CODE]` **NONE in this unit** — `falcon-unsaved-changes-host.component.ts` has an inline `template:` but NO `styles:` and no inline `style=` (only Tailwind-free structural markup binding `<falcon-angular-popup>`); the service is pure TS. Zero literal colors/px here. (Contrast with B18 sibling `falcon-completion-success-dialog`, which DOES carry an inline `styles:` block with literals; and `falcon-popup`, which the live render uses, which has its own inline styles.)

## No CSS / no SCSS guidance

- No token file, no `.css`, no SCSS — nothing to govern in this unit.
- To change the leave-confirmation modal's appearance, configure/restyle `falcon-popup` (the orchestrator modal-adapter renders it) — never patch this unit.

## Token usage by state

N/A — no states, no tokens. The unit is a confirm-routing service + an inert host.

## Verification
🟡 STRUCTURALLY-CHECKED 2026-06-03 (B18). Confirmed by Glob that no token file exists for this slug and by reading the host TS that no inline `styles:` exists. Live visual tokens delegate to `falcon-popup`. "Minimal TOKENS — say so" per SWEEP-SPEC §7 honored.
