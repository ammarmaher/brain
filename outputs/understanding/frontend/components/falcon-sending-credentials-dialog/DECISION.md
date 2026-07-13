# falcon-sending-credentials-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY (domain composite). Use via `<falcon-angular-wizard-finalization>` for the standard Add Client / Add User credential-send confirmation. It is the live successor of the deleted `send-credentials-popup`.**

## Use this component for

- Confirming **how** a newly created account's initial credentials are delivered to the owner (Email / SMS / Both) at the end of an Add Client / Add User wizard.
- Any future create-account flow that needs an out-of-band credential-delivery confirm — preferably reached through `<falcon-angular-wizard-finalization>`.

## Avoid this component for

- Generic confirm / OK / cancel → orchestrator (`FalconMessageOrchestratorService.show()` → `<falcon-angular-popup>`).
- Destructive-action acknowledgement → `<falcon-angular-alert-dialog>`.
- Success acknowledgement → `<falcon-angular-completion-success-dialog>`.
- Arbitrary form-in-dialog → a domain dialog over `<falcon-angular-dialog>`.

## Preferred variant / render path

**N/A — single render path.** This is a pure Angular composite (no Stencil Shadow/`-tw` split, no `useTailwind` toggle). It composes the Light-DOM `<falcon-button-tw>` for its footer and a native `<dialog>` (Top Layer) via `[falconOverlay]`.

**Preferred entry point:** `<falcon-angular-wizard-finalization>` (which pairs this dialog with the success dialog + orchestrator toasts). Use the bare `<falcon-angular-sending-credentials-dialog>` only for a non-wizard credential-send path.

## Required upgrades before wider use

- **G1 (radiogroup a11y)** before promoting it to a reusable cross-app dialog: add `role="radiogroup"` + roving-tabindex. For the current single-consumer wizard use it is acceptable (Space/Enter pick works).
- None of the other gaps block current use; they are improvements (dark-mode SVG fills, token file, SMS gating, send spinner).

## Relationship to other components

- **Composed BY:** `<falcon-angular-wizard-finalization>` (its sole consumer; pairs it with `<falcon-angular-completion-success-dialog>`).
- **Composes:** `<falcon-button-tw>` (footer), `FalconOverlayDirective` (native `<dialog>` Top Layer + stacking).
- **Sibling terminal dialog:** `<falcon-angular-completion-success-dialog>` (same composite, same `[falconOverlay]` + inline-`styles` Top-Layer pattern).
- **Superseded:** legacy `send-credentials-popup` (deleted) — old dossier flagged orphan for B23.

## Exact rule for future implementation tasks

1. **"Confirm how to send a new account's credentials"?** Use `<falcon-angular-wizard-finalization>` (it wires this dialog). Only drop the bare `<falcon-angular-sending-credentials-dialog>` if you must skip the wizard composite.
2. **Bind `[open]` one-way**; flip it to `false` in your `(send)`/`(cancel)` handlers (no `[(open)]`).
3. **Read the chosen method from `(send)`** (a `FalconCredentialDeliveryMethod`); map it to the backend delivery enum in your wire-builder. `(send)` ≠ "delivered" — perform the API send yourself, keeping `[disableSend]` true until it resolves.
4. **Feed pre-translated label strings** (the component does not translate).
5. **Do not** reach for it as a generic confirm — use the orchestrator / alert-dialog.
6. **Do not** import the deleted `<falcon-send-credentials-popup>`.

---

## Dynamic capability assessment

### 1. What is static today?

- The 3 delivery methods (`email` / `sms` / `both`) — fixed union; you cannot add a 4th channel via inputs.
- The 3 inlined illustration SVGs (hardcoded paths + hex fills).
- The panel geometry (`max-w-[880px]`, paddings, radii) and the owner-summary 3-column layout.
- The radio-card visual structure (dot + label + illustration).
- The inline `styles:` Top-Layer reset + backdrop scrim (hardcoded rgba/px).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **21 signal `input()`s** — `open`, `ownerName`/`Phone`/`Email`, `defaultDelivery`, `disableSend`, all copy labels (title/subtitle/deliveryLabel/3 summary keys/sendLabel/cancelLabel/closeAriaLabel/3 method labels), `closeOnBackdrop`, `closeOnEsc`.
- `[CODE]` **2 signal `output()`s** — `(send)` (method payload), `(cancel)` (void).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **None** — no `<ng-content>`, no `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?

- `[CODE]` **None for the dialog chrome** (no token file — G3). Only the footer `<falcon-button-tw>` buttons are token-driven (button.tokens.css). Palette utilities flip under `.app-dark`, but the inline-`styles` scrim + the SVG hex fills do NOT (G2).

### 5. What is dynamic through Tailwind classes?

- `[CODE]` Internal template utilities only; there is no `rootClass`/`wrapperClass` input, so a consumer cannot add host classes meaningfully.

### 6. What is missing to make this component reusable across pages?

- radiogroup container + roving-tabindex (G1).
- A token file for theming (G3).
- Dark-mode-aware SVG fills + token-driven geometry (G2).
- Owner-contact gating for SMS/Both (G4).
- Optional i18n-aware mode (G5) + `[sendLoading]` spinner (G6).

### 7. What capability should be added to shared component (not page hack)?

- All of the above — it is a `libs/falcon-ui-core` composite; the a11y + token work must be central, not per-page.

### 8. What flags / options / templates / slots would make it better?

- `role="radiogroup"` wrapper (G1).
- `@Input() sendLoading?: boolean` (G6).
- `[disableSms]` / `[disableBoth]` or derive-from-empty-owner (G4).
- An optional `slot="illustration-*"` to override the decorative SVGs.
- A `--falcon-sending-credentials-*` token surface (G3).

### 9. What is the safest upgrade path?

1. **Phase A (token-discipline, low risk):** map SVG fills to tokens/`currentColor`, replace raw rgba/px with `--falcon-radius-*`/`--falcon-spacing-*`/shadow tokens, optionally introduce a token file (G2/G3). Verify pixel-parity with the React SoT.
2. **Phase B (a11y, queued):** add `role="radiogroup"` + roving-tabindex + `aria-describedby` subtitle (G1/A2). Test with AT.
3. **Phase C (additive):** `[sendLoading]`, `[disableSms]`/`[disableBoth]` (G4/G6).

All additive except Phase B (a11y semantics — verify no regression to the wizard flow).

### 10. What is risky to change because other pages depend on it?

- The inline `dialog.falcon-sc-dialog` Top-Layer reset (ts:56-86) — removing/altering it re-breaks centring (documented regression).
- The `(send)` payload type `FalconCredentialDeliveryMethod` — the wizard's `wire-builders.ts` maps it; changing the union breaks the create payload.
- The one-way `open` contract — wizard-finalization owns the open/close lifecycle; switching to `[(open)]` would change that ownership.
- The `<falcon-button-tw>` `(falcon-click)` + `[attr.disabled]` footer pattern — used by the wizard's submit gating.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Recommendation: READY as a domain composite via wizard-finalization; G1 (radiogroup a11y) recommended before standalone reuse. Counts: 21 `input()`, 2 `output()`, no slots, no token file. Supersedes the deleted `send-credentials-popup`.
