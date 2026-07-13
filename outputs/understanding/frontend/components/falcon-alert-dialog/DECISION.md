# falcon-alert-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY / ACTIVE.** Use `<falcon-angular-alert-dialog>` for icon-led, read-this-first decision modals and rich acknowledgements (error lists, config-locked notices). It is the **acknowledgement/advisory half of the B14 dialog substrate** (the decision half being `<falcon-angular-popup>`). Prefer reaching it via the host/service indirection (`ErrorDialogService` for error lists, the message-orchestrator for config acknowledgements) — direct page mounts are for bespoke icon-led decisions with a custom body.

## Use this component for

- A centered icon + title + subtitle + custom body + Cancel/Confirm decision (the SoT "Insufficient Balance" shape).
- Acknowledgement-only callouts (`hideCancel`) — e.g. an error-message list or a configuration-locked notice.
- As the substrate that `ErrorDialogService` / the orchestrator render.

## Avoid this component for

- A generic editing modal / form / date picker → `<falcon-angular-dialog>` (or `<falcon-angular-drawer>`).
- A design needing a custom header (badge above title) or custom footer → `<falcon-angular-dialog>` (alert-dialog's header/footer are fixed — `[CODE]` wb-confirm-save-modal.component.ts:17-23).
- One of the 4 canonical action-required flows → `<falcon-angular-popup>`.
- A simple imperative yes/no from code → `FalconConfirmService.confirm()` (renders `<falcon-popup>`).
- Post-action "saved!" feedback → toast.

## Preferred variant / render path

**`useTailwind=true` (default, Light DOM)** — what the live renderers (error-host + orchestrator) use. ⚠️ Note the `-tw` per-instance token-override break (GAP G1): on the default path, per-instance `--falcon-alert-dialog-*` overrides are ignored — fix G1 before relying on per-instance retinting, or override the underlying theme vars. Use `useTailwind=false` (Shadow) only for token-isolation from a noisy parent stylesheet (and to make per-instance token overrides work today).

## Required upgrades before wider use

None blocking — the component is production-quality and is the live error/acknowledgement substrate. The improvements are: G1 (`-tw` reads `--falcon-alert-dialog-*` tokens — P1 parity), G2 (token-drive the wrapper backdrop), G3 (`<falcon-angular-button>` footer), G4 (`[confirmLoading]`), plus a wrapper `.spec.ts` (none exists).

## Relationship to other components

| Component | Relationship |
|---|---|
| `<falcon-dialog>` / `<falcon-dialog-tw>` | **Composed internally** as the chrome substrate (focus-trap / backdrop / esc / tokens). |
| `<falcon-angular-popup>` | Sibling B14 substrate — the *decision* modal (4 canonical variants) + the renderer for `FalconConfirmService`. alert-dialog is the *acknowledgement/advisory* substrate. |
| `ErrorDialogService` + `<falcon-angular-error-dialog-host>` | Renders alert-dialog for backend error-message lists (libs/falcon). |
| `FalconMessageOrchestratorService` + `FalconModalAdapterComponent` | Renders alert-dialog for `configuration-required`-no-`actionCallback`. |
| `<falcon-angular-confirm-dialog>` | **DORMANT, unrelated** — a separate Stencil confirm component (not a migration target, not deprecated-in-favour-of-this; it's simply dead). |
| App wrappers (`do-payment-priority-popup`, `wb-confirm-save-modal`) | Compose alert-dialog (or the base dialog) + inject services. |

## Exact rule for future implementation tasks

1. **Icon-led decision / advisory modal?** Use `<falcon-angular-alert-dialog>` — prefer `ErrorDialogService` (error lists) or the orchestrator (config acknowledgements) where they fit.
2. **Bind `[(open)]` + `(falconConfirm)` / `(falconCancel)`.** Treat all four cancel `reason`s as "declined".
3. **Use `[hideCancel]` / `[hideConfirm]` for single-CTA;** never both.
4. **Pass `title`/`subtitle` as plain text;** put rich content in the body slot.
5. **Need a custom header/footer?** Drop to `<falcon-angular-dialog>`.
6. **Per-instance retint?** Be aware the `-tw` path ignores `--falcon-alert-dialog-*` (GAP G1) — use Shadow path or fix G1.
7. **Simple imperative confirm?** Use `FalconConfirmService` instead (renders `<falcon-popup>`).

---

## Dynamic capability assessment

### 1. What is static today?

- The severity-default SVG icon set (triangle / circle-check / circle-i), the centered header layout, the right-aligned 2-button footer (raw `<button>`s), the white SVG foreground, the wrapper's hardcoded `::backdrop` dim/blur (`rgba(13,63,68,0.45)`/`blur(2px)`).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` Inputs: `open` / `title` / `subtitle` / `severity` / `icon` / `confirmLabel` / `cancelLabel` / `hideConfirm` / `hideCancel` / `size` / `position` / `closable` / `closeOnBackdrop` / `closeOnEsc` / `useTailwind` (`[CODE]` component.ts:61-85).
- Outputs: `(falconConfirm)` `{severity}`, `(falconCancel)` `{severity, reason}`, `(openChange)` boolean.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` ONE default body slot (`<ng-content>` → Stencil `<slot>`). Header + footer are NOT projectable. No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?

- `[CODE]` 21 `--falcon-alert-dialog-*` tokens + 4 severity overrides (Shadow path). ⚠️ The `-tw` (default) path reads theme vars directly → per-instance component-token overrides DON'T apply there (G1). Chrome tokens inherited from `dialog.tokens.css`. Dark mode via theme-var flip.

### 5. What is dynamic through Tailwind classes?

- Body-slot content classes (consumer-supplied). The `-tw` twin's own utilities are internal + bare-px arbitrary values (not retunable via component tokens — G1/parity).

### 6. What is missing to make this component reusable across pages?

- `-tw` honoring `--falcon-alert-dialog-*` (G1), `[confirmLoading]` (G4), 3-button mode (G5), `<falcon-angular-button>` footer (G3), `<falcon-angular-icon>` override (G6), token-driven wrapper backdrop (G2), `aria-describedby` (G8).

### 7. What capability should be added to shared component (not page hack)?

- All of §6 — into the shared component. The `wb-confirm-save-modal` correctly avoided a page hack by dropping to `<falcon-angular-dialog>` for its custom-header need.

### 8. What flags / options / templates / slots would make it better?

- `[confirmLoading]`, a tertiary-button slot/input, per-severity `--falcon-alert-dialog-icon-size-*`, `[iconName]` (falcon-icon), enter/exit motion tokens, an `aria-describedby` wiring for the subtitle/body.

### 9. What is the safest upgrade path?

1. **G1 (P1, additive):** `-tw` reads `var(--falcon-alert-dialog-confirm-bg, var(--falcon-teal-700,…))` etc. — makes per-instance overrides work on the live path with no API change.
2. **G2 (additive):** token-drive the wrapper `::backdrop`.
3. **G3/G4 (additive):** compose `<falcon-angular-button>` + add `[confirmLoading]`.
4. **G5/G6/G8:** tertiary slot, icon component, `aria-describedby`.
5. Add a wrapper `.spec.ts`. All phases additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- **The event contract** (`falcon-alert-confirm` `{severity}` / `falcon-alert-cancel` `{severity, reason}`) — `ErrorDialogService` + the orchestrator + app wrappers depend on it.
- **`title`→`heading-text` rename** — don't rename back (the `HTMLElement.title` clash is why it exists).
- **`closable` default `false`** — flipping it would add an X to every error-list modal.
- **The native-`<dialog falconOverlay>` Top-Layer wrapping** — anything depending on the modal escaping ancestor stacking contexts would regress if removed.
- **`useTailwind=true` default** — flipping it changes DOM (Light↔Shadow) + breaks per-instance-token assumptions differently.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). DECISION rewritten from the prior "decision record" (why-we-built-it) to the gold-standard recommendation + 10-axis assessment. STATUS READY/ACTIVE; positioned as the acknowledgement/advisory half of the B14 substrate (popup = decision half). G1 (`-tw` token-override break) flagged as the one P1 improvement; confirm-dialog cross-link corrected (dormant, not a migration source).
