# falcon-notification — DECISION

## Brain SK final recommendation

### Use this component for
- Async-action results ("Saved", "Failed to publish").
- Validation feedback ("Email already in use").
- Business-status messages (**PREFERRED** over toast for these).
- Platform-wide stack via `FalconNotificationService.push()`.

### Avoid this component for
- Action-required decisions — use `<falcon-angular-popup>`.
- PrimeNG `MessageService` migration substrate — use `<falcon-angular-toast>` + `FalconMessageService`.
- Tooltips / drawers / dialogs — dedicated components.

### Preferred render path
Single render path (Angular template). No `useTailwind` toggle here.

### Required upgrades before wider use
**Tier 1:**
1. Hover-pause auto-dismiss.
2. `<falcon-angular-icon>` composition for intent icons.
3. Body slot for rich content.
4. Stack position configuration.

**Tier 2:**
5. Action button (label + href + callback).
6. `alert` icon for warning intent (currently uses info icon).
7. Introduce `notification.tokens.css`.
8. aria-live switch per severity.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-toast` | Sibling for PrimeNG-compat. Notification is preferred for new code. |
| `falcon-angular-notification-stack` | Companion queue container. Mount ONCE per app. |
| `FalconNotificationService` | Signal-based queue service (modern alternative to `FalconMessageService`). |

### Exact rule for future implementation tasks
> Use `<falcon-angular-notification>` + `FalconNotificationService.push()` for ALL business-status feedback in net-new code. Mount `<falcon-angular-notification-stack>` once at the app shell. Pass `intent` matching the message semantics (success / info / warning / error), provide `title` (required) and `subtitle`. Use `dismissMode="manual"` for critical errors that require acknowledgement. Use `dismissMode="auto"` (default) for transient feedback. Be aware: no hover-pause exists today — long messages get dismissed mid-read.

### Status
**READY** for production. Tier-1 upgrades (hover-pause + body slot + icon composition) would close the feature gap with toast.

---

## Dynamic capability assessment

### 1. What is static today?
- 4 intents.
- 4 hardcoded inline SVG icons (and warning uses info icon — visual ambiguity).
- Stack position is fixed at top-right with hardcoded offset.
- aria-live is always polite.
- No hover-pause.
- No body slot.
- No action button.

### 2. What is already dynamic through inputs/outputs?
- `open`, `intent`, `title` (required), `subtitle`.
- 14 visual knobs (iconBg, glossy, dismissMode, dismissDuration, countdownHeight, countdownBarBottom/Top/Glossy, borderWidth, leftAccent, rightAccent, radius).
- Output: `dismiss`.

### 3. What is already dynamic through slots / ng-template?
None.

### 4. What is dynamic through token / theme overrides?
- Only at the global palette level. Per-instance not possible.

### 5. What is dynamic through Tailwind classes?
- Caller can apply Tailwind to the host but it doesn't penetrate.

### 6. What is missing to make this component reusable across pages?
- Hover-pause.
- Body slot.
- Icon component composition.
- Stack position config.
- Action button.
- Per-instance tokens.
- aria-live per severity.
- `alert` icon for warning.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `[hoverPause]="true"`.
- `<ng-content>` for rich body.
- `[iconName]` override.
- `[actionLabel]` / `[actionHref]` / `(actionClick)`.
- `[position]` on stack.
- Token file.

### 9. What is the safest upgrade path?
1. Add `hoverPause` (additive, default true).
2. Use `<falcon-angular-icon>` for icons (internal — visual identical).
3. Add `<ng-content>` for body (additive — falls back to subtitle when not projected).
4. Add `[position]` on stack (additive, default top-right).
5. Add action button props (additive).
6. Swap warning icon to `alert` (visual change — gate behind major version OR add `[icon]` override and migrate).
7. Introduce token file (additive — refactor template to consume tokens).

### 10. What would be risky to change because other pages depend on it?
- **The 14 input names + defaults** — appearance signatures are tuned to the T2 reference; changing defaults shifts visual.
- **`title` required** — flipping to optional would relax the contract.
- **`dismissMode="auto"` + `dismissDuration=12`** — flipping default to `manual` would persist all notifications.
- **The signal-based service API** — `push()` returns a numeric id consumers may store.
- **The `(dismiss)` event firing for all dismissal paths** (auto + user + programmatic) — splitting into separate outputs would break existing handlers.
