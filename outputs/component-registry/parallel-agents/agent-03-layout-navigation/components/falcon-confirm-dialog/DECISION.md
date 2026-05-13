# falcon-confirm-dialog — DECISION

## Brain SK final recommendation

### Use this component for
- Confirmations that DON'T map to the 4 `falcon-popup` canonical variants (Approve / Reject, Continue / Go back, Activate / Deactivate, etc.).
- OK / Cancel prompts with explicit accept/reject labels.
- Confirmations where `severity` should drive the accent (info / success / warning / danger).
- A specialised composed dialog without rolling your own.

### Avoid this component for
- The 4 canonical decision flows — use `<falcon-angular-popup>`.
- Form-bearing dialogs — use `<falcon-angular-dialog>`.
- Single-action acknowledgments ("Got it" only) — use `<falcon-angular-notification>`.

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1:**
1. Replace internal `<button>` with `<falcon-angular-button>` (or `<falcon-button-tw>` in Stencil).
2. Add `loading` / `acceptDisabled` / `rejectDisabled` inputs.
3. Replace `icon` CSS class with `<falcon-angular-icon>`.

**Tier 2:**
4. Add tertiary button slot.
5. Link `aria-describedby` to message.
6. Add `<ng-template falconConfirmDialogBody>` directive for richer body content.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-dialog` | **Composed internally.** Confirm-dialog wraps dialog with specialised accept/reject layout. |
| `falcon-angular-popup` | Alternative for the 4 canonical decision flows. |
| `falcon-angular-button` | Should be composed for accept/reject (today they're raw `<button>`). |
| `falcon-angular-icon` | Should be used for the body icon (today it's a CSS class). |

### Exact rule for future implementation tasks
> Use `<falcon-angular-confirm-dialog>` for non-canonical Approve/Reject style confirmations. Set `severity` to match the action intent. Pass `acceptLabel` and `rejectLabel` explicitly. Treat the `(reject)` event as the universal cancel handler — it fires for all dismissal paths (backdrop, Esc, ×, reject button). Use the projected body slot for additional context (date pickers, inline notes). Be aware: today's implementation uses raw `<button>` elements internally — async accept actions won't have built-in spinner support until the Tier-1 upgrade lands.

### Status
**READY but UNDER-LEVERAGED.** Production-grade for static confirmations. Needs Tier-1 upgrades before async / loading-aware flows can use it.

---

## Dynamic capability assessment

### 1. What is static today?
- The 2-button layout (accept + reject).
- The button DOM (raw `<button>`).
- The icon rendering path (`<i class="...">`).
- The text-only message body.
- The substrate is always `<falcon-dialog>`.

### 2. What is already dynamic through inputs/outputs?
- `open`, `title`, `message`, `icon`, `acceptLabel`, `rejectLabel`, `severity`, `size`, `position`, `closable`, `closeOnBackdrop`, `closeOnEsc`.
- `useTailwind`, `rootClass`.
- Outputs: `accept`, `reject`, `openChange`.

### 3. What is already dynamic through slots / ng-template?
- (default) — additional body content projected below the message.

### 4. What is dynamic through token / theme overrides?
- Button colors, padding, radius.
- Body gap / padding.
- Icon size.
- Message font / color.
- Action gap.

### 5. What is dynamic through Tailwind classes?
- Inside the projected body slot.
- Not on the host or footer buttons.

### 6. What is missing to make this component reusable across pages?
- Loading state for async accept.
- Disabled states for accept / reject independently.
- Tertiary button.
- Button composition with `<falcon-angular-button>` for token alignment.
- Icon composition with `<falcon-angular-icon>`.
- Richer body content via dedicated slot.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[loading]`, `[acceptDisabled]`, `[rejectDisabled]`.
- `[tertiaryButton]` config.
- `<ng-content select="[slot=body-extra]">` for context content.
- `[iconName]` (using falcon-angular-icon).
- `[aria-describedby-id]` for explicit a11y wiring.

### 9. What is the safest upgrade path?
1. Compose `<falcon-angular-button>` internally (preserves API; visible visual change to button geometry).
2. Add `loading` / `disabled` inputs (additive).
3. Add `iconName` input alongside the legacy `icon` (gradual migration).
4. Add tertiary button (additive).

### 10. What would be risky to change because other pages depend on it?
- **No production consumers today** — risk is low. This is the right time for structural fixes.
- BUT: `acceptLabel`/`rejectLabel` defaults of `'OK'` / `'Cancel'` are conventional. Don't change defaults.
- The `(reject)` event firing for ALL dismissal reasons is the documented contract.
- The wrapper's `title` (vs Stencil's `heading`) is the public API — don't rename back.
