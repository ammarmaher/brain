# send-credentials-popup (LEGACY) — DECISION

> [!warning] REMOVED — do NOT use. Superseded by [[falcon-sending-credentials-dialog]] (`<falcon-angular-sending-credentials-dialog>`).
> The folder was deleted and the re-export removed. [CODE] `libs/falcon/src/shared-ui/index.ts:24-26`. The "wait for popup variant=custom" roadmap below never executed — a dedicated dialog shipped instead.

## Brain SK final recommendation

### Status
- **REMOVED (0 live consumers).** [CODE] `libs/falcon/src/shared-ui/index.ts:24-26`. The realized successor is `<falcon-angular-sending-credentials-dialog>` (a dedicated Falcon UI core component), NOT the `<falcon-angular-popup variant="custom">` the old dossier anticipated.

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
- **`<falcon-angular-sending-credentials-dialog>` ([[falcon-sending-credentials-dialog]]) — the realized replacement.**
- `<falcon-angular-wizard-finalization>` ([[falcon-wizard-finalization]]) — composes the sending-credentials dialog in the final wizard step.
- `<falcon-angular-dialog>` / `<falcon-angular-radio>` / `<falcon-angular-button>` — were composed by the old popup; equivalents are composed inside the successor.

### Exact rule for future implementation tasks
> "`<falcon-send-credentials-popup>` is DELETED — do not reference it. For credential-delivery confirmation use `<falcon-angular-sending-credentials-dialog>` (typically reached through `<falcon-angular-wizard-finalization>` on the final wizard step). See the [[falcon-sending-credentials-dialog]] dossier for its API."

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
- _Moot — the component is deleted and has 0 consumers._ The contract concerns (`(submit)` emitting `DeliveryMethod`, `[(visible)]` two-way) were resolved when consumers moved to `<falcon-angular-sending-credentials-dialog>`.

> _N.B. — §9's "safest upgrade path" executed: the legacy folder was deleted and consumers migrated to a dedicated dialog._

## Verification
🟢 code-verified (B23 reconcile 2026-06-03) — REMOVED confirmed via [CODE] `libs/falcon/src/shared-ui/index.ts:24-26`; realized successor `<falcon-angular-sending-credentials-dialog>` confirmed live via Glob + the `falcon-wizard-finalization` consumer.
