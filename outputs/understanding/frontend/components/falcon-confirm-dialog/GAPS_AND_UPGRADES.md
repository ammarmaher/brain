# falcon-confirm-dialog — GAPS AND UPGRADES

## Headline finding (2026-06-03, B15)

**The component is DORMANT and SUPERSEDED.** The Angular wrapper is 100% commented out (`[CODE]` falcon-confirm-dialog.component.ts:1-79, falcon-confirm-dialog.component.html:1-46), `index.ts` exports `export {}` (`[CODE]` :6-7), and there are **zero render consumers** (`[CODE]` grep across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/`). The confirm UX migrated to `FalconConfirmService.confirm()` → `<falcon-angular-popup variant="error">` (`[CODE]` falcon-confirm.service.ts:91-105, falcon-modal-adapter.component.ts:51-61). The Stencil tags + Tailwind helper + token file are dead code. This dominates the gap list below.

## Missing capabilities (active source verified)

### G1 — Dormant component: delete-or-revive decision needed (P1 — HIGH-RISK-QUEUE)

`[CODE]` The Stencil pair (`falcon-confirm-dialog` + `falcon-confirm-dialog-tw`), the dead Tailwind helper (`confirm-dialog-tailwind-classes.ts` — its two exported functions are never imported), and the token file (`confirm-dialog.tokens.css`) all exist with no live wrapper and no consumers. Keeping them costs build time + Stencil compile + a `:where()` token block + registration entries (stub-seeder, define-custom-elements) for nothing.

**Recommended fix (queued):** either (a) DELETE the trio + helper + token file + registration entries, or (b) consciously revive it with an owning decision and a documented niche distinct from `<falcon-popup>` and `<falcon-angular-alert-dialog>`. **HIGH-RISK-QUEUE** — touches the umbrella loader registration + token build; needs human sign-off (do not auto-fix this pass).

### G2 — Overlaps two live confirm surfaces (P1 — design)

Three components could each render an "are you sure?": this confirm-dialog (dormant), `<falcon-angular-popup variant="error">` (the live `FalconConfirmService` renderer), and `<falcon-angular-alert-dialog>` (the icon-led rich confirm). The confirm-dialog adds no capability the other two lack. Reviving it without a sharp differentiator perpetuates the overlap.

**Recommended fix:** fold any unique need into `<falcon-popup>` or `<falcon-angular-alert-dialog>`; do not maintain three confirm paths.

### G3 — Footer buttons are raw `<button>`, not `<falcon-angular-button>` (P2 — house rule)

`[CODE]` tsx:124-139 + tw.tsx:89-102 render raw `<button class="falcon-confirm-btn …">` / inlined-Tailwind `<button>`. Neither composes the design-system button primitive. Consequences: no `loading` (busy spinner), no `disabled` state, button-token contract diverges from `<falcon-angular-button>`. Falcon-component-over-native violation.

### G4 — Icon is a CSS-class string, not `<falcon-angular-icon>` (P2)

`[CODE]` tsx:113-115 / tw.tsx:81 render `<i class="falcon-confirm-icon {icon}">`. Bypasses the icon abstraction (same gap as the popup). Pass `"falcon-icon falcon-icon-X"`; an `<svg>` does not work.

### G5 — Shadow ↔ `-tw` token/parity break on the accept button (P2 — parity)

`[CODE]` Shadow CSS reads `--falcon-confirm-dialog-accept-bg` (`[CODE]` css:58) but the `-tw` twin's accept button reads `bg-[var(--falcon-teal-700,#124c52)]` (`[CODE]` tw.tsx:98) — a DIFFERENT var. So a consumer overriding `--falcon-confirm-dialog-accept-bg` retints the Shadow accept button but NOT the `-tw` accept button. The `-tw` reject button uses `bg-falcon-neutral-100` (utility) while Shadow uses `--falcon-confirm-dialog-reject-bg`. Severity also does not retint the `-tw` accept button. **Render-path drift.**

### G6 — No 3-button mode / tertiary action (P3)

`[CODE]` Only a fixed reject+accept pair (tsx:124-139). "Save / Discard / Cancel" patterns need a third button — not supported; the footer is not consumer-projectable.

### G7 — No `aria-describedby` from message → dialog (P2 — a11y)

`[CODE]` The message text (`.falcon-confirm-message`) has no `id` exposed for the composed dialog's `aria-describedby`. The confirm-dialog sets no `role`/`aria-label` of its own — it relies entirely on `<falcon-dialog>` for dialog semantics. A screen reader gets the heading via the dialog but the message body is not formally associated.

### G8 — Reject-first DOM order, no auto-focus control (P3 — a11y)

`[CODE]` Reject button renders FIRST (tsx:124), Accept SECOND (tsx:132) → keyboard Tab lands on Reject first. There is no `autoFocusButton: 'confirm' | 'cancel'` input. May be a safety-by-default choice for destructive confirms, but it diverges from "primary action focused first" and is not configurable.

## Missing tests

- `[CODE]` **No `.spec.ts` and no `.e2e.ts` on disk** for the confirm-dialog (verified 2026-06-03). The reject-on-all-dismissal contract, the self-close-on-accept behavior, and Shadow↔`-tw` parity are untested. (Contrast `<falcon-input>`, which ships both.) Given dormancy, the live confirm path's coverage lives in `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` instead.

## Missing Tailwind / token parity

- The dead `confirm-dialog-tailwind-classes.ts` helpers (`falconConfirmDialogAcceptClasses()` / `falconConfirmDialogRejectClasses()`) are NOT consumed by the `-tw` twin (the twin inlines its own classes) — orphaned code.
- Accept-button var mismatch (G5) is a genuine token-parity break.

## Performance risks

None — the component never renders.

## Visual / interaction risks

- Two render paths CAN drift (and already do on the accept-button color — G5).
- If revived without the G3/G4 fixes, async-accept flows would have no spinner and the icon would bypass the icon component.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | Delete-or-revive the dormant trio + helper + token file | P1 | HIGH-RISK-QUEUE |
| G2 | Resolve overlap with popup / alert-dialog | P1 | design (queue) |
| G3 | Compose `<falcon-angular-button>` in the footer | P2 | safe-local (only if revived) |
| G4 | Use `<falcon-angular-icon>` for the body icon | P2 | safe-local (only if revived) |
| G5 | Fix Shadow↔`-tw` accept-button token parity | P2 | safe-local (only if revived) |
| G7 | Link `aria-describedby` to the message | P2 | safe-local (only if revived) |
| G8 | `autoFocusButton` + review reject-first order | P3 | safe-local (only if revived) |
| G6 | Tertiary button | P3 | safe-local (only if revived) |

## Fix-shared-vs-per-page

All gaps belong in the shared component (or in the delete decision). There are no per-page hacks — there are no pages.

## Wave findings

- **Deletion flag:** YES — candidate for removal (G1). The component is dormant with zero consumers and a live replacement (`FalconConfirmService` → popup). Queue for an owning delete-or-revive decision.
- **Promotion flag:** none.

## Deep-Dive Sweep Findings (2026-06-03 — B15)

**Consumer count: 0** ([CODE] grep across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/`).

Drift corrected vs prior dossier:
- **Wrapper is dormant** (commented out) — prior dossier described it as live with a `client-settings-step` consumer (now stale/gone).
- **`FalconConfirmService` EXISTS** and is the live confirm path — prior `INTEGRATION_VALIDATION.md` claimed "no dedicated confirm service in the read sources." Corrected.
- **New gaps surfaced:** G1 (dormant/delete-or-revive), G5 (Shadow↔`-tw` accept-button token mismatch), dead Tailwind helper, no spec/e2e on disk.
- All actionable fixes are **only relevant if the component is revived**; the live recommendation is the G1 delete-or-revive decision. See FINDINGS/B15.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15) against all source layers. Dormancy + zero-consumers + the live `FalconConfirmService`→popup replacement re-confirmed. Deletion flag raised (G1). G5 token mismatch verified in source. No tests on disk verified.
