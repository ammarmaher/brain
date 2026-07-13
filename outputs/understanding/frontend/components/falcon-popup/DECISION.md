# falcon-popup — DECISION

## Brain SK final recommendation

### Use this component for
- The 4 canonical action-required flows: **error**, **delete**, **unsaved**, **save**.
- Delete confirmations on records (with `[name]`).
- Unsaved-changes warnings before navigation (prefer `FalconUnsavedChangesService`).
- Save / publish confirmations with optional summary hint.
- Generic error retry / OK-only acknowledgements (prefer `FalconHttpErrorDialogService` for interceptor errors).

### Avoid this component for
- Confirmations that don't map to the 4 variants — use `<falcon-angular-confirm-dialog>`.
- Rich-body / form modals — use `<falcon-angular-dialog>` (popup has no slots).
- Non-blocking notifications — use `<falcon-angular-notification>`.
- Tooltips, drawers, menus — dedicated components.

### Preferred render path
Single render path — Angular template + native `<dialog falconOverlay="modal">` Top Layer + composed `<falcon-button-tw>` footer buttons. No `useTailwind` toggle.

### Required upgrades before wider use
**Tier 1 (quality, additive):**
1. `loading` / `confirmDisabled` inputs for async confirm work (G-LOADING).
2. Introduce `popup.tokens.css` for per-instance overrides + dark-mode-aware backdrop (G-TOKENS).
3. Replace inline SVG icons with `<falcon-angular-icon>` (G-ICONS).

**Tier 2:**
4. Drop the inner duplicate `role="dialog"` (A2). Add a hand-rolled Tab-cycle wrap + explicit focus-restore polish (G-FOCUS — native `showModal()` already covers the WCAG-critical containment).
5. 5th-variant extensibility (G-VARIANT); tertiary button (G-TERTIARY); `dismissible` (G-DISMISS).

> **Note (2026-06-03):** the prior dossier's Tier-0 "a11y blockers — add focus trap" is **downgraded** — the native `<dialog>.showModal()` migration already confines focus + inerts the page. Focus is no longer a release blocker.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-dialog` | Sibling (parallel pure-Angular vs Stencil impl). Same native-`<dialog falconOverlay="modal">` Top Layer pattern. Do NOT refactor popup onto dialog (dialog is itself @deprecated-for-direct-use). |
| `falcon-angular-confirm-dialog` | Alternative for non-canonical confirms. |
| `falcon-button-tw` (Stencil Light DOM) | Composed directly for footer buttons (event `(falcon-click)`). |
| `falcon-angular-icon` | NOT used today (inline SVG). Should be used per Tier 1 (G-ICONS). |
| `FalconHttpErrorDialogService` + host | Singleton OK-only error surface — the dominant real consumer. |
| `FalconUnsavedChangesService` + host | Singleton unsaved-changes guard — the dominant real consumer. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-popup>` for ANY of the 4 canonical decision flows. Pick the variant by intent. Pass `[name]` for delete. Use `[*Override]` only when the default copy doesn't fit; use `[hideCancel]`/`[hideConfirm]` for single-CTA modes. Bind `(confirm)`/`(cancel)` (component outputs) — NOT `(falconClick)` on the footer buttons. Close `[open]` AFTER async completes. For global error surfacing prefer `FalconHttpErrorDialogService.show(...)`; for dirty-form guards prefer `FalconUnsavedChangesService.confirm(...)`. For decisions OUTSIDE the 4, use `<falcon-angular-confirm-dialog>`. The native modal confines focus — you do NOT need to add a manual focus callback (that prior advice is obsolete).

### Status
**ACTIVE / PREFERRED** for the 4 canonical flows. Production-ready (templates wizard, wallet confirm-save, + platform-wide via the two hosts). Tier-1 upgrades (loading state, token file, icon abstraction) are quality, not blockers.

---

## Dynamic capability assessment

### 1. What is static today?
- The 4 variants — adding requires source changes.
- The icon set — 4 hardcoded inline SVG paths.
- Panel size (`max-w-md`), min/max height clamps.
- The `falconPopupIn` keyframe + the `::backdrop` literals (inline `styles:`).
- All copy strings (overridable; defaults hardcoded English).
- Footer ≤2 buttons (cancel + confirm, gated by `hideCancel`/`hideConfirm`).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **13 signal inputs** — `open` / `variant` / `name` / `iconBg` / `iconColor` / `glossy` (3 `undefined`-sentinel) / 5 `*Override` / `hideCancel` / `hideConfirm`.
- `[CODE]` **2 outputs** — `confirm` / `cancel` (`output<void>()`).

### 3. What is already dynamic through slots / ng-template?
**None.** Popup is fully prop-driven — no `<ng-content>`.

### 4. What is dynamic through token/theme overrides?
- ONLY at the palette level (Falcon theme). Per-instance not possible (no token file — G-TOKENS).

### 5. What is dynamic through Tailwind classes?
- The caller can apply Tailwind to the host element but it doesn't reach inner content.

### 6. What is missing to make this component reusable across pages?
- `loading` / `confirmDisabled` (async confirm).
- A token file (per-instance restyle + dark-aware backdrop).
- `<falcon-angular-icon>` icons.
- 5th-variant extensibility; tertiary button; body slot for rich content (e.g. "I understand" checkbox).

### 7. What capability should be added to the shared component (not a page hack)?
- All of item 6. (Focus is already handled by the native modal.)

### 8. What flags / options / templates / slots would make it better?
- `[loading]`, `[confirmDisabled]`, `[tertiaryButton]`, `[dismissible]`, `[size]`.
- `<ng-content select="[slot=body]">` for rich body content.

### 9. What is the safest upgrade path?
1. Add `loading` + `confirmDisabled` (additive, default `false`).
2. Introduce `popup.tokens.css` (no API change — visual-identical until consumers override).
3. Replace inline SVG with `<falcon-angular-icon>` (no API change).
4. Drop the inner duplicate `role="dialog"` (no API change; a11y tidy-up).
5. Add tertiary button + body slot (additive).

### 10. What is risky to change because other pages depend on it?
- **The 4 variants' default copy** — consumers depend on the default strings (incl. `[name]` interpolation).
- **The 4 variants' confirm tones** — changing `unsaved` confirm from danger to primary silently changes visual.
- **The empty-string-treated-as-no-override behavior** — i18n pipes returning empty during init rely on it.
- **The `(confirm)` / `(cancel)` event names** — consumers + both hosts bind them.
- **The `(falcon-click)` dash-event on footer buttons** — internal but load-bearing.
- **The native `<dialog>` Top-Layer shell** — reverting to a `.fixed` wrapper + HostListener would regress focus containment + stacking.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). Recommendation: ACTIVE/PREFERRED, stay standalone (do NOT refactor onto @deprecated dialog). Counts: 13 signal inputs, 2 outputs. The headline change is the Tier-0 a11y de-escalation (native `showModal()` confines focus) + the host-driven effective-reach note. The native Top-Layer shell is the load-bearing "risky to change" item.
