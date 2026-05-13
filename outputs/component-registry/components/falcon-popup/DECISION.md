# falcon-popup — DECISION

## Brain SK final recommendation

### Use this component for
- The 4 canonical action-required flows: **error**, **delete**, **unsaved**, **save**.
- Delete confirmations on records (with `[name]`).
- Unsaved-changes warnings before navigation.
- Save / publish confirmations with optional summary hint.
- Generic error retry dialogs.

### Avoid this component for
- Confirmations that don't map to the 4 variants — use `<falcon-angular-confirm-dialog>`.
- Custom-shape modals — use `<falcon-angular-dialog>` (despite deprecation, still substrate).
- Non-blocking notifications — use `<falcon-angular-notification>`.
- Tooltips, drawers, menus — dedicated components.

### Preferred render path
Single render path (Angular template + composed `<falcon-button-tw>` for footer buttons). No `useTailwind` toggle here.

### Required upgrades before wider use
**Tier 0 (a11y blockers):**
1. Add focus trap + focus restore.
2. Add `loading` / `confirmDisabled` inputs to support async confirm work.

**Tier 1:**
3. Replace inline SVG icons with `<falcon-angular-icon>`.
4. Introduce `popup.tokens.css` for per-instance overrides.
5. Compose `<falcon-angular-dialog>` instead of re-implementing modal scaffolding.

**Tier 2:**
6. Add 5th variant slot (or accept a `customVariant` object).
7. Decouple `tone` from `variant`.
8. Add tertiary button for 3-way decisions.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-dialog` | Sibling (parallel implementation). Tier-1 upgrade would compose dialog instead. |
| `falcon-angular-confirm-dialog` | Alternative for non-canonical confirms. |
| `falcon-angular-button` | Composes `<falcon-button-tw>` (Stencil Light DOM) directly for footer buttons. |
| `falcon-angular-icon` | NOT used today (inline SVG). Should be used per Tier 1. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-popup>` for ANY of the 4 canonical decision flows. Pick the variant by intent: `delete` for destructive deletes, `unsaved` for navigation warnings, `save` for publish/save confirms, `error` for generic API error retry. Pass `[name]` for delete to interpolate the record name into the body. Use `[*Override]` only when the default copy doesn't match the page context. For decisions OUTSIDE the 4 variants (archive, restore, etc.), use `<falcon-angular-confirm-dialog>` with explicit accept/reject labels. Be aware: popup does NOT trap focus today — pair with a manual `setFocus` callback on confirm/cancel if a11y is critical.

### Status
**NEEDS-UPGRADE** for a11y. Production-ready for current usage (4 wizard flows) but the focus trap gap should land soon.

---

## Dynamic capability assessment

### 1. What is static today?
- The 4 variants — adding requires source changes.
- The icon set — 4 hardcoded inline SVG paths.
- The panel size (`max-w-md`).
- The min-height / max-height clamps.
- The keyframe animation.
- All copy strings (overridable but defaults are hardcoded).
- Footer always has exactly 2 buttons (Cancel + Confirm).
- No focus trap.

### 2. What is already dynamic through inputs/outputs?
- `open` (one-way).
- `variant` (one of 4).
- `name` (delete-only interpolation).
- `iconBg`, `iconColor`, `glossy` (visual sub-modes).
- 5 `*Override` props (title, body, hint, confirm label, cancel label).
- Outputs: `confirm`, `cancel`.

### 3. What is already dynamic through slots / ng-template?
**None.** Popup is fully prop-driven.

### 4. What is dynamic through token / theme overrides?
- ONLY at the palette level (Falcon theme). Per-instance not possible today.

### 5. What is dynamic through Tailwind classes?
- Caller can apply Tailwind to the host element but it doesn't reach inner content.

### 6. What is missing to make this component reusable across pages?
- Focus trap + restore (a11y).
- `loading` / `confirmDisabled` for async confirm.
- 5th variant support (extensibility).
- Per-instance token override.
- Tertiary button.
- Body slot for rich content (e.g. inline confirmation checkbox "I understand this is destructive").

### 7. What capability should be added to the shared component instead of a one-off page hack?
ALL items 6.

### 8. What flags / options / templates / slots would make it better?
- `[loading]`, `[confirmDisabled]`.
- `[tertiaryButton]` (3rd button).
- `<ng-content select="[slot=body]">` — projected rich content INSIDE the body region.
- `<ng-content select="[slot=footer-extra]">` — additional footer slot beside Cancel/Confirm.
- `[dismissible]` — block Esc / backdrop dismissal.
- `[size]` — beyond `max-w-md`.

### 9. What is the safest upgrade path?
1. Add `loading` + `confirmDisabled` inputs (additive, default `false`).
2. Add focus trap (no API change — purely internal).
3. Add focus restore (no API change).
4. Replace inline SVG with `<falcon-angular-icon>` (no API change).
5. Introduce token file (no API change — visual identical until consumers override).
6. Compose `<falcon-angular-dialog>` (internal refactor — no API change).
7. Add tertiary button + body slot (additive).

### 10. What would be risky to change because other pages depend on it?
- **The 4 variants' default copy.** Any change breaks consumers that depend on the default strings (which include `name` interpolation logic).
- **The 4 variants' confirm tones.** Changing `unsaved` confirm from danger to primary would silently change visual.
- **The empty-string-treated-as-no-override behavior.** Translation pipes returning empty string during init rely on this fallback. Changing would break i18n loading.
- **The `(confirm)` / `(cancel)` event names.** Consumers bind them.
- **The default `glossy: true`.** Flipping to flat would change every popup's look.
- **`name` interpolation for delete variant only.** Extending to other variants is additive; removing would break the delete variant.
