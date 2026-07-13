# falcon-alert-dialog — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — `-tw` render path ignores per-instance `--falcon-alert-dialog-*` overrides (P1 — parity, NEW 2026-06-03)

`[CODE]` The Shadow CSS reads the component tokens (`--falcon-alert-dialog-confirm-bg`, `-icon-color`, `-cancel-bg`, etc. — `[CODE]` falcon-alert-dialog.css:126/120-123, severity overrides :32-46), but the `-tw` twin reads the **underlying theme vars directly** via Tailwind arbitrary values (`bg-[var(--falcon-teal-700,#124C52)]`, `fill-[var(--falcon-status-danger,#E63946)]`, `text-[var(--color-falcon-neutral-900,#111827)]` — `[CODE]` falcon-alert-dialog-tw.tsx:70-74, 105-108, 131/136/150). So a consumer setting `style="--falcon-alert-dialog-confirm-bg: …"` retints ONLY the Shadow Confirm button — the `-tw` (default) render path is unaffected. **Both live renderers (error-dialog-host + orchestrator) use `useTailwind=true`**, so the documented per-instance token-override mechanism does NOT work on the live render.

**Impact:** the per-instance theming guidance in TOKENS/USAGE is effectively Shadow-only; HIGH because it silently misleads.

**Recommended fix (P1):** in the `-tw` twin, read `var(--falcon-alert-dialog-confirm-bg, var(--falcon-teal-700, #124C52))` (and the icon/cancel equivalents) so the component-token layer wins on both paths. Mechanical, additive.

### G2 — Outer-`<dialog>` backdrop dim/blur is hardcoded, not token-driven (P2 — token discipline, NEW 2026-06-03)

`[CODE]` The Angular wrapper's native `::backdrop` uses raw literals: `background: rgba(13,63,68,0.45); backdrop-filter: blur(2px); animation … 160ms ease-out` (`[CODE]` falcon-alert-dialog.component.css:42-46). The platform `--falcon-dialog-backdrop-*` tokens exist (and `wb-confirm-save-modal` routed its scrim through them) but this wrapper does not use them. So a Studio/theme change to the dialog backdrop won't reach alert-dialog's outer scrim, and the value is a bare `rgba()`.

**Recommended fix (P2):** point the `::backdrop` at `var(--falcon-dialog-backdrop-bg, …)` / `var(--falcon-dialog-backdrop-blur, …)`. `safe-local`.

### G3 — Footer buttons are raw `<button>`, not `<falcon-angular-button>` (P2 — house rule)

`[CODE]` Cancel/Confirm are raw `<button class="falcon-alert-dialog__btn …">` (Shadow, `[CODE]` tsx:162-178) / inlined-Tailwind `<button>` (`-tw`, tw.tsx:147-164). No `loading`/`disabled` state → no async-confirm spinner. Falcon-component-over-native gap.

### G4 — No `confirmLoading` / async-confirm busy state (P2)

`[CODE]` The dialog closes optimistically on Confirm (`open=false` before emit, tsx:89-93). An async confirmed action (do-payment) has no in-dialog spinner — the dialog vanishes and the flow must show its own progress + route failures to the global error pipeline.

**Recommended fix:** add `[confirmLoading]` (disables Confirm + shows a token-driven spinner; keep the dialog open until the caller resolves).

### G5 — No 3-button "Save / Don't Save / Cancel" mode (P2)

`[CODE]` Only two buttons (tsx:160-178). Some SoT patterns need a tertiary action; today that is faked by composing two alert-dialogs (per prior dossier).

### G6 — Icon override is a CSS-class string, not `<falcon-angular-icon>` (P3)

`[CODE]` `icon` renders via `<i class={this.icon}>` (`[CODE]` tsx:150). Bypasses the icon abstraction (the severity SVG fallback is fine; the override path is the gap).

### G7 — No per-severity icon size + no enter/exit motion tokens (P3)

`[CODE]` One icon-size token (`--falcon-alert-dialog-icon-size`, 56px). No `--falcon-alert-dialog-enter-duration`/`-exit-*` — motion is inherited from the composed dialog (and the wrapper's `::backdrop` animation is hardcoded — G2).

### G8 — No explicit `aria-describedby` from subtitle/body → dialog (P3 — a11y)

`[INFERRED]` The dialog gets `aria-label` = `headingText` (`[CODE]` tsx:144) but the subtitle + body are not formally associated via `aria-describedby`. A screen reader announces the title but not the description automatically. (`role="alertdialog"` is correct for danger/warning — `[CODE]` tsx:134.)

## Missing tests

- `[CODE]` **No dedicated `.spec.ts` / `.e2e.ts`** in the alert-dialog folders (verified 2026-06-03). Severity→icon/role mapping, cancel-reason propagation, open-change events, the native-`<dialog>` open-sync bridges, and Shadow↔`-tw` parity are untested. The behavior is partially exercised via `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` (the modal-adapter path). **Gap:** add a wrapper spec covering severity→role, the four cancel reasons, `hideCancel`/`hideConfirm`, and `[(open)]` sync.

## Missing Tailwind / token parity

- G1 (per-instance override break on `-tw`) is the headline parity gap.
- `[CODE]` The `-tw` geometry uses bare-px arbitrary values (`w-[56px]`, `text-[18px]`, `px-[18px] py-[10px]`, `max-w-[460px]` — `[CODE]` tw.tsx:127-150) NOT tokens → `-tw` size/spacing can't be retuned via `--falcon-alert-dialog-*` tokens either. Parity-with-Shadow break.

## Performance risks

- None meaningful — passive presentational modal, signal-driven `OnPush`.

## Visual / interaction risks

- `severity="danger"` does NOT produce a red Confirm button (stays teal) — could under-signal danger; verify product intent.
- The two render paths can drift (G1 already a real divergence on per-instance overrides).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | `-tw` reads `--falcon-alert-dialog-*` tokens (per-instance override parity) | P1 | safe-local |
| G2 | Token-drive the wrapper `::backdrop` dim/blur | P2 | safe-local |
| G3 | Compose `<falcon-angular-button>` in the footer | P2 | safe-local |
| G4 | `[confirmLoading]` async-confirm state | P2 | safe-local |
| G5 | 3-button mode | P2 | safe-local |
| G6 | `<falcon-angular-icon>` for the icon override | P3 | safe-local |
| G8 | `aria-describedby` to subtitle/body | P3 | HIGH-RISK-QUEUE (a11y semantics) |

## Fix-shared-vs-per-page

All gaps belong in the shared component. There are no per-page hacks (the wb-confirm-save-modal correctly dropped to `<falcon-angular-dialog>` rather than hacking alert-dialog's header).

## Wave findings

- **Deletion flag:** none — alert-dialog is ACTIVE and is the live acknowledgement/error substrate.
- **Promotion flag:** none new (already a first-class B14-substrate component).

## Wave 7 Findings (2026-05-17)

**Consumer count: 2** (prior sweep) — settings-tab + client-settings-step. Both are now superseded (see Deep-Dive below).

## Deep-Dive Sweep Findings (2026-06-03 — B15)

**Consumer count: 12 files** ([CODE] grep `<falcon-angular-alert-dialog>` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/`). True live render consumers: the orchestrator modal-adapter + `falcon-error-dialog-host` (the prior `settings-tab`/`client-settings-step` are now superseded/commented references).

New gaps surfaced this pass (none in the prior dossier):
- **G1** — `-tw` ignores per-instance `--falcon-alert-dialog-*` overrides (the live render path) — P1 parity.
- **G2** — wrapper `::backdrop` raw `rgba(13,63,68,0.45)`/`blur(2px)` (not tokens) — P2 token discipline.
- **G3** — raw `<button>` footer (no busy state).
- **No `.spec.ts`/`.e2e.ts`** on disk.

All `safe-local` except G8 (a11y semantics → queue). No deletion/promotion flags. See FINDINGS/B15.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15) against all source layers. G1 (`-tw` token-override break) + G2 (raw-rgba backdrop) + G3 (raw buttons) verified in `falcon-alert-dialog-tw.tsx` + `falcon-alert-dialog.component.css`. Consumer count refreshed to 12 (live render = orchestrator + error-host). No tests on disk verified. Component stays ACTIVE.
