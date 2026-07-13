# falcon-confirm-dialog-host — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` This host+service pair is the **single platform-canonical gate for imperative yes/no decisions**. In business terms it is the moment Falcon stops a user mid-action and says "are you sure?" before committing something the user might regret — deleting a contact group, abandoning a half-filled wizard, acknowledging that a payment failed. Centralizing it as ONE service + ONE host means every such gate looks and behaves identically across host-shell, admin-console, and management-console, and that a confirm cannot be silently skipped per-feature.

`[CODE]` The service returns an `Observable<boolean>` (`[CODE]` falcon-confirm.service.ts:65) — the business action runs only on `true`; `false` (cancel / × / ESC / backdrop / superseded) aborts it. This is the binary operational decision contract.

## PRD / business rules touched

| Rule | Source | How this enforces / surfaces it |
|---|---|---|
| No native `window.confirm()` — use the platform confirm | `[CODE]` contact-groups-list.component.ts:379 ("Wave 15 … replaces native window.confirm per audit §6.8 patch #11, resolves FLAG B-9") | The delete-contact-group flow routes through `FalconConfirmService` so the confirm is branded, translatable, and Top-Layer-safe. |
| Confirm before deleting a contact group / member | `[CODE]` contact-groups-list.component.ts:382, contact-group-detail.component.ts:346 | DELETE is sent only after `accepted === true`. |
| Confirm before abandoning a dirty wizard | `[CODE]` add-client-wizard.component.ts:361, add-user-wizard.component.ts:404 (+ mgmt mirrors) | The wizard closes only on confirm. |
| Acknowledge a failed/blocked payment | `[CODE]` do-payment-priority-popup.component.ts:602 (`hideCancel: true`) | A single-CTA acknowledgement popup — the operator must read + acknowledge the failure. |

## Business constraints baked in

- `[CODE]` falcon-confirm.service.ts:67-72 — **one confirm at a time.** A new `confirm()` while one is open resolves the previous as `false` first. Business meaning: the system never shows two competing "are you sure?" prompts; the latest decision wins and the earlier is treated as declined.
- `[CODE]` :98, :109-114 — **every non-confirm path is a business "no".** Cancel, ×, ESC, backdrop, supersession, and component-teardown all resolve `false`. A flow must never proceed unless it received an explicit `true`.
- `[CODE]` :103 — **`hideCancel` enables a single-CTA acknowledgement.** Some business events (a hard failure) are not a choice — the user can only acknowledge. The Cancel button is hidden, but ×/ESC/backdrop still resolve `false` (so dismissing equals "didn't proceed").
- `[CODE]` app.ts:49-52 — **one host, one queue, all remotes.** Because `@falcon/ui-core` is an MF singleton share, a confirm requested in admin-console and one in management-console share the same queue — they cannot overlap. Business consistency across micro-frontends is guaranteed by construction.

## Business flows using this component

| Flow | Page / app | Role of the confirm |
|---|---|---|
| Delete contact group | contact-groups list (mgmt) | Gate the DELETE; danger-styled prompt. |
| Delete contact-group member | contact-group detail (mgmt) | Gate the member removal. |
| Abandon Add Client wizard | org-hierarchy (admin + mgmt) | Confirm discarding the in-progress client. |
| Abandon Add User wizard | org-hierarchy (admin + mgmt) | Confirm discarding the in-progress user. |
| Acknowledge payment failure | do-payment-priority-popup (host-shell) | Single-CTA acknowledgement (`hideCancel`). |
| Org-hierarchy state-service confirms | org-hierarchy services (admin + mgmt) | Various gate points. |

## Business gotchas

- `severity` is a business signal of gravity (`danger` for destructive), but in Phase 5 it does **not** change the rendered popup's color (the orchestrator always uses `variant="error"` for `action-required` — `[CODE]` falcon-modal-adapter.component.ts:108). A builder must not assume a `severity: 'info'` confirm looks calmer than a `severity: 'danger'` one — both render the same error-styled popup. (If a softer/blue confirm is genuinely needed, that is a GAP — see `GAPS_AND_UPGRADES.md`.)
- The two confirm services look alike but are NOT interchangeable: `FalconConfirmService` (generic yes/no) vs `FalconUnsavedChangesService` (route-leave "unsaved changes" gate, different request shape). Using the wrong one ships the wrong copy/affordance (`[CODE]` hierarchy-page-state.service.ts:236-243).
- A confirmed business action that then fails async has no in-modal error — the global HTTP error pipeline surfaces it (`[MEMORY]` 400→toast / 5xx→popup). The confirm only gates; it does not report the action's outcome.
- The HOST element itself carries no business behavior in Phase 5 (it renders nothing) — the business value lives entirely in the SERVICE. Removing the host mount (a queued follow-up) would not change any flow.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Business rules cross-referenced to live caller source (contact-groups delete `window.confirm`-replacement FLAG B-9, wizard discards, do-payment `hideCancel` acknowledgement). One-at-a-time + all-dismissals-are-no + MF-singleton-queue constraints re-confirmed in `falcon-confirm.service.ts`. The `severity`-inert-in-Phase-5 gotcha verified against the modal-adapter.
