# falcon-toast — DECISION

## Brain SK final recommendation

### Use this component for
- **Almost never directly.** Use `<falcon-angular-notification>` for new business-status feedback.
- Toast remains for `FalconMessageService.add({...})` PrimeNG-compat substrate. Mount `<falcon-angular-message-host>` once at the app shell and let the service drive toasts.

### Avoid this component for
- Net-new code (use notification).
- Must-acknowledge errors (use popup / dialog).
- Persistent messages (toasts auto-dismiss).
- Tooltips, drawers, dialogs — wrong concept.

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 0 (guard rail):**
1. Add `@deprecated` JSDoc to wrapper + Stencil sources.
2. Dev-mode `console.warn` when used outside `<falcon-angular-message-host>`.

**Tier 1 (substrate quality-of-life):**
3. `<falcon-angular-icon>` composition for severity icons.
4. `persistent` flag (replaces `duration=0`).
5. Replace info-severity hardcoded hex with a palette token.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-notification` | **PREFERRED** alternative for new code. |
| `falcon-angular-message-host` | Composes this internally — drop-in for PrimeNG `<p-toast>`. |
| `FalconMessageService` | Drives the message-host stream — PrimeNG `MessageService` API parity. |
| `falcon-angular-toast-host` | Stack positioner — independent component. |

### Exact rule for future implementation tasks
> Do NOT use `<falcon-angular-toast>` directly in net-new code. For new business-status messages, use `<falcon-angular-notification>` + `FalconNotificationService.push()`. For PrimeNG-MessageService migration, use `FalconMessageService.add({severity, summary, detail})` + mount `<falcon-angular-message-host>` once at the app shell. The toast substrate stays for compatibility; new features go on the notification path.

### Status
**DEPRECATED** (per registry + memory). Functional for substrate use; not for direct new code.

---

## Dynamic capability assessment

### 1. What is static today?
- Severity set fixed at 4.
- Severity icons hardcoded inline SVG.
- Host positions fixed at 6.
- Auto-dismiss timer logic is internal — no callbacks during ticking.
- No progress bar.
- No grouping.
- Info-severity colors hardcoded.

### 2. What is already dynamic through inputs/outputs?
- `severity`, `title`, `message`, `duration`, `dismissible`, `icon`, `actionLabel`, `actionHref`.
- Host: `position`, `gap`, `maxToasts`.
- Outputs: `falconDismiss`, `falconActionClick`.
- Method: `dismiss()`.

### 3. What is already dynamic through slots / ng-template?
- (default) — additional content below message.
- `slot="action"` — custom action button.

### 4. What is dynamic through token / theme overrides?
- Surface (bg, border, radius, shadow, padding).
- Per-severity icon colors (with one hex hardcode exception).
- Title / message font.
- Dismiss / action button styling.
- Motion.
- Z-index.

### 5. What is dynamic through Tailwind classes?
- Action slot — full freedom.
- Default slot — full freedom.

### 6. What is missing to make this component reusable across pages?
- N/A — component is deprecated. Investment should go into notification.

### 7. What capability should be added to the shared component instead of a one-off page hack?
- Only the guard-rail items (deprecation enforcement).

### 8. What flags / options / templates / slots would make it better?
- Only minor: `persistent`, icon component composition.

### 9. What is the safest upgrade path?
- Don't grow this component. Focus on notification + migration adapter.

### 10. What would be risky to change because other pages depend on it?
- **`FalconMessageService` API** — production code uses `add()`, `addAll()`, `remove()`, `clear()`. Changing signatures breaks PrimeNG migration consumers.
- **The 6-position host** — relocating tokens would shift every toast.
- **The auto-dismiss default 5000ms.**
- **The aria-live mapping** (`assertive` for warning/error, `polite` for info/success). Removing would degrade a11y.
- **`<falcon-angular-message-host>` composition** — `falcon-toast.component.html` + `falcon-toast-host` + `falcon-message-host` — the chain is established; breaking any link breaks the substrate.
