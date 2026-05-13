# falcon-message-host — DECISION

## Brain SK final recommendation

### Use this component for
- PrimeNG `MessageService` migration substrate (drop-in for `<p-toast>` + `MessageService`).
- Centralised toast stack across the app driven by `FalconMessageService.add()`.
- Cross-feature messaging (HTTP interceptor fires toasts; feature components fire toasts).

### Avoid this component for
- New code where `FalconNotificationService.push()` would work — prefer the modern signal-based path.
- Action-required messages (use `<falcon-angular-popup>`).
- One-off standalone messages where no queue is needed.

### Preferred render path
`useTailwind=true` (default — forwards to inner toast-host and toast).

### Required upgrades before wider use
**Tier 1:**
1. Add `maxStack` cap to prevent viewport flooding.
2. Add dedup by `key` field.

**Tier 2:**
3. Action button passthrough in `FalconMessage`.
4. Validation in `service.add()`.
5. Migration adapter from `FalconMessageService` to `FalconNotificationService`.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-toast` | Composed per message. |
| `falcon-angular-toast-host` | Composed as the stack container. |
| `FalconMessageService` | The queue API — PrimeNG `MessageService` parity. |
| `falcon-angular-notification-stack` / `FalconNotificationService` | Sibling for new code. Eventually a migration adapter could bridge. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-message-host>` ONLY for PrimeNG migration substrate or when `FalconMessageService.add()` semantics are explicitly needed. Mount once at the app shell. Inject `FalconMessageService` in HTTP interceptors / feature components and call `add({severity, summary, detail})`. Use `severity: 'warn'` for PrimeNG compat (auto-mapped to `'warning'`). For brand-new business-status feedback in net-new code, prefer `<falcon-angular-notification-stack>` + `FalconNotificationService.push()`.

### Status
**ACTIVE substrate** — production usage in host-shell verified. The underlying toast IS deprecated for new code; the message-host remains as the PrimeNG-compat substrate.

---

## Dynamic capability assessment

### 1. What is static today?
- The rendered child is always `<falcon-angular-toast>`.
- The stack container is always `<falcon-angular-toast-host>`.
- No `maxStack` cap.
- No dedup.
- `severity: 'warn'` is mapped to `'warning'` (compat shim).
- No action button passthrough.
- No validation in `add()`.

### 2. What is already dynamic through inputs/outputs?
- Host: `position`, `useTailwind`.
- Service: `add()`, `addAll()`, `remove(id)`, `clear()`, `messages$` observable.
- Message: `id`, `severity`, `summary`, `detail`, `life`, `closable`, `icon`.

### 3. What is already dynamic through slots / ng-template?
None.

### 4. What is dynamic through token / theme overrides?
- Inherits all toast tokens (no host-specific tokens).

### 5. What is dynamic through Tailwind classes?
N/A.

### 6. What is missing to make this component reusable across pages?
- `maxStack` cap.
- Dedup by `key`.
- Action button passthrough.
- Per-message validation.
- Migration adapter to notification.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[maxStack]` input.
- `[dedup]` input.
- `FalconMessage.key` field.
- `FalconMessage.actionLabel` / `actionHref` / `onAction` fields.
- Migration adapter that internally routes to `FalconNotificationService.push()`.

### 9. What is the safest upgrade path?
1. Add `maxStack` (additive, default unlimited).
2. Add `dedup` + `key` (additive, default off).
3. Add action button fields (additive).
4. Add validation in `add()` (additive — log warning, don't throw).
5. Build migration adapter (long-term).

### 10. What would be risky to change because other pages depend on it?
- **`FalconMessageService.add({severity, summary, detail, life, closable, icon})` API** — production usage relies on this exact shape.
- **The `severity: 'warn'` → `'warning'` mapping** — removing breaks PrimeNG migration code paths.
- **The `providedIn: 'root'` singleton** — flipping to module-scoped would break shared usage.
- **The auto-id generation pattern (`falcon-msg-<N>`)** — consumers might be inspecting ids.
- **The `messages$` observable** — feature code MAY be subscribing to it externally for analytics.
