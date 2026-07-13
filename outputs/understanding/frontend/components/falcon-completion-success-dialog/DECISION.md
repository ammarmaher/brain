# falcon-completion-success-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY / ACTIVE. The canonical branded success-ack dialog for creation-finalization flows. Deliberately KEPT inline (NOT orchestrator-routed). Prefer composing it via `<falcon-angular-wizard-finalization>`.**

## Use this component for

- A large, branded, **passive** success confirmation at the end of a creation / send flow (client created + credentials sent; user created + credentials sent).
- The success terminus of a `<falcon-angular-wizard-finalization>` flow (its primary, intended use).
- Any "you're done" milestone that should feel celebratory, auto-dismiss, and never block the operator.

## Avoid this component for

- **Decisions / confirmations** (OK/Cancel) → `<falcon-angular-popup variant="save">` / `FalconConfirmService`.
- **Transient corner feedback** → `FalconMessageOrchestratorService.show({category:'success'})`.
- **Passive notification with countdown** → `FalconNotificationService` + `<falcon-angular-notification-stack>`.
- **Errors / warnings** → orchestrator `business-error`/`warning` toast or `<falcon-angular-popup variant="error">`.
- **Content the user must read/copy** → it dismisses on any click.

## Preferred variant / render path

Single fixed visual — no variants. Pure-Angular native-`<dialog>` Top Layer via `[falconOverlay]`. There is no Shadow/`-tw` choice (no twin exists).

## Required upgrades before wider use

None block usage. Improvements: reconsider `role="alertdialog"` (G-ROLE, HIGH-RISK-QUEUE), mint backdrop/radius/shadow tokens (G-TOKENS), map arbitrary-px (G-PX). All additive.

## Relationship to other components

| Component | Relationship |
|---|---|
| `<falcon-angular-wizard-finalization>` | **Composes this** as its success ack (alongside `<falcon-angular-sending-credentials-dialog>`). The intended entry point. |
| `[falconOverlay]` directive + `FalconStackingService` | Substrate (shared with popup/dialog/drawer). |
| `<falcon-angular-popup variant="save">` | Sibling for success **decisions** (has buttons). |
| `FalconMessageOrchestratorService` success toast | Sibling for **transient** success (corner card). |
| (NOT) the orchestrator modal-adapter | Explicitly NOT used — the Phase 3 route was reverted (wrong visual). |

## Exact rule for future implementation tasks

1. **Branded "creation done / credentials sent" ack?** Use this dialog — preferably via `<falcon-angular-wizard-finalization>` (channel picker → submit → this ack).
2. **Pass pre-translated** `[title]` / `[subtitle]` / `[closeAriaLabel]` (no i18n hook in `@falcon/ui-core`).
3. **Bind `(closed)`** to reset your `open` signal + navigate/reset. The `[open]` input is one-way.
4. **Set `[autoDismissMs]=0`** only if the ack must stay until manually dismissed.
5. **Never** add a confirm button (wrong component), route it through the orchestrator modal, or put copy-me text in it.
6. **Do not** expect a token override — there is no token file (mint one via G-TOKENS if needed).

---

## Dynamic capability assessment

### 1. What is static today?
- The inlined illustration SVG (clipboard + sparkles) — fixed markup, no slot.
- The panel geometry (`max-w-[560px]`, `rounded-[18px]`, padding) — arbitrary literals.
- The backdrop dim/blur + open/close animations — inline-style literals.
- The single fixed visual (no size/state/variant axis).
- English default copy (`'Completed successfully'` / `'Credentials sent to the user'` / `'Close'`).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **6 signal inputs:** `open`, `title`, `subtitle`, `autoDismissMs`, `dismissOnOverlayClick`, `closeAriaLabel`.
- `[CODE]` **1 output:** `(closed)` (void) — fires on every dismissal path (timer / backdrop / panel / × / ESC).

### 3. What is already dynamic through slots / ng-template?
- **None.** No `<ng-content>` / `ng-template`. Title/subtitle are prop-driven; the illustration is hardcoded.

### 4. What is dynamic through token/theme overrides?
- Only the palette-token text/surface utilities (`bg-falcon-neutral-0`, `text-falcon-neutral-*`) follow the theme. The radius/shadow/backdrop/animation/SVG are literals — NOT overridable (G-TOKENS).

### 5. What is dynamic through Tailwind classes?
- Nothing caller-facing — there is no `class`/`wrapperClass` hook. The template's utilities are internal.

### 6. What is missing to make this component reusable across pages?
- A content slot (for richer body than title/subtitle) — none exists.
- A token contract (to re-theme dim/radius/shadow) — G-TOKENS.
- An i18n-less default that doesn't ship English — or just enforce caller-translation (current).
- A way to swap/hide the illustration — none.

### 7. What capability should be added to the shared component (not a page hack)?
- Tokens for backdrop/radius/shadow (G-TOKENS) — every consumer benefits.
- A `role` decision (G-ROLE) — a11y correctness, shared.
- Optionally a `[bodyTemplate]` / `ng-content` for variants that need more than title+subtitle.

### 8. What flags / options / templates / slots would make it better?
- `@Input() illustration?: 'credentials' | 'generic' | TemplateRef` — to vary the art.
- `@Input() lockPanelClick?: boolean` — to disable click-anywhere dismiss for copy-able content (G-CLICK-ANYWHERE).
- A token-driven `--falcon-completion-success-*` set (G-TOKENS).

### 9. What is the safest upgrade path?
1. **Phase A (a11y, queued):** decide `role` (G-ROLE) with screen-reader validation.
2. **Phase B (tokens, additive):** mint backdrop/radius/shadow tokens + reference them from the inline block; map arbitrary-px (G-PX). Zero visual change if values match.
3. **Phase C (optional):** add `lockPanelClick` + a content slot for reuse beyond credentials.
4. **Phase D (cosmetic):** token-ize / dark-mode the SVG (G-SVG-LITERALS).

### 10. What is risky to change because other pages depend on it?
- **The `(closed)` single-output contract** — `falcon-wizard-finalization` relies on `(closed)` → `finalized`. Adding a separate confirm output is fine; removing/renaming `closed` breaks it.
- **The click-anywhere dismiss** — the spec asserts it (`spec.ts:129`); changing it would fail the test + the React-parity expectation. Gate behind a new input instead.
- **The default `autoDismissMs=10000`** — flows that rely on the 10s window would shift if the default changed.
- **The `[open]` one-way contract** — flipping to two-way `model()` would change the consumer contract (`falcon-wizard-finalization` resets it manually).
- **The inlined illustration** — anything visually snapshot-testing the dialog would break if the SVG changes.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). Recommendation: READY / ACTIVE / kept-inline. 6 inputs + 1 output + no-slots + no-token-file confirmed in source. G-ROLE queued (a11y); G-TOKENS/G-PX additive. Relationship to `falcon-wizard-finalization` + the reverted-orchestrator decision anchored to `[CODE]`.
