# send-credentials-popup (LEGACY) — DECISION

## Brain SK final recommendation

### Status
- **LEGACY-IN-USE.** Bespoke confirmation popup for credential delivery.
- Roadmap: migrate to `<falcon-angular-popup variant="custom">` once a slot-friendly variant lands.

### Use this component for
- Send-credentials confirmation flow after creating a new client / user.

### Avoid this component for
- Generic confirmation dialogs → use `<falcon-angular-popup>` (4 fixed variants) or `<falcon-angular-confirm-dialog>`.

### Preferred variant / render path
- N/A — pure Angular bespoke.

### Required upgrades before wider use
1. **Wait for `<falcon-angular-popup variant="custom">`** (P1 dependency).
2. **Translate `recipientLabel` default** (P1).
3. **Spinner inside Submit when loading** (P2).
4. **`showCancel` Input** (P2).
5. **Delete SCSS** during refactor (P0).

### Relationship to other components
- `<falcon-angular-dialog>` (composed today as shell).
- `<falcon-angular-radio>` (composed for the radio group).
- `<falcon-angular-button>` (Submit + close).
- Future replacement: `<falcon-angular-popup variant="custom">`.

### Exact rule for future implementation tasks
> "For credential-delivery confirmation flows, use `<falcon-send-credentials-popup>` today. When `<falcon-angular-popup>` gains a slot-friendly `custom` variant, migrate. For any OTHER credential flow (e.g., password reset), build a fresh component on `<falcon-angular-popup variant='custom'>` — do not extend this one."

---

## Dynamic capability assessment

### 1. What is static today?
- Single visual (no variants).
- English default for `recipientLabel`.
- No spinner inside Submit when loading.
- No Cancel button.

### 2. What is already dynamic through inputs/outputs?
- `[(visible)]`, `[accountOwnerName]`, `[phoneNumber]`, `[email]`, `[recipientLabel]`, `[loading]`.
- `(submit)`, `(visibleChange)`.

### 3. What is already dynamic through slots / ng-template?
- _None._

### 4. What is dynamic through token / theme overrides?
- Via composed Falcon UI core components (dialog, radio, button).

### 5. What is dynamic through Tailwind classes?
- Outer wrapper.

### 6. What is missing?
- Slot-friendly popup variant (depends on `<falcon-angular-popup>` upgrade).
- Spinner in Submit.
- `showCancel` Input + `(cancel)` Output.
- i18n key for `recipientLabel`.

### 7. What capability should be added to the shared component vs a one-off page hack?
- Migration to `<falcon-angular-popup variant="custom">` is the answer — single shared abstraction.

### 8. What flags / options / templates / slots would make it better?
- `showCancel?: boolean`.
- `(cancel)` Output.
- Loading spinner via token.
- i18n key fallback for `recipientLabel`.

### 9. What is the safest upgrade path?
1. Wait for `<falcon-angular-popup variant="custom">`.
2. Rebuild this popup using the new variant.
3. Migrate consumers (likely 1-2 templates).
4. Delete legacy folder.

### 10. What would be risky to change because other pages depend on it?
- Consumers expect `(submit)` to emit `DeliveryMethod`. Maintaining that contract during migration is essential.
- `[(visible)]` two-way pattern must be preserved.
