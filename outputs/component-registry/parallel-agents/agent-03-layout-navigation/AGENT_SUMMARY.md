# Agent 3 — Summary

## Scope
Investigated **15 layout / navigation / overlay components** of the Falcon UI library, in `C:\Falcon\Falcon\falcon-web-platform-ui`. Per-component output is the standard 6-files-per-component contract under `components/<name>/`.

## Components investigated

| # | Component | Status |
|---|---|---|
| 1 | falcon-button | READY (flagship) |
| 2 | falcon-tabs | READY (with `falconTabActions` directive) |
| 3 | falcon-card | NEEDS-UPGRADE (no `interactive`/`selected`) |
| 4 | falcon-drawer | READY |
| 5 | falcon-dialog | DEPRECATED (substrate only) |
| 6 | falcon-popup | NEEDS-UPGRADE (focus trap missing) |
| 7 | falcon-confirm-dialog | READY but UNDER-LEVERAGED |
| 8 | falcon-accordion | READY but UNDER-LEVERAGED |
| 9 | falcon-menu | READY (with external-anchor pattern) |
| 10 | falcon-tooltip | READY (no collision flip) |
| 11 | falcon-icon | READY (under-leveraged — many consumers use raw `<i>`) |
| 12 | falcon-avatar | READY but UNDER-LEVERAGED |
| 13 | falcon-toast | DEPRECATED (substrate for FalconMessageService) |
| 14 | falcon-notification | READY (preferred over toast for new code) |
| 15 | falcon-message-host | ACTIVE substrate |

## Totals

- **Components investigated:** 15
- **Component folders created:** 15
- **Total markdown files written:** 90 (6 per component) + 3 agent-root files = 93
- **Source files read per component:** typically 4-7 (Stencil source + types + utils where present + Angular wrapper .ts + .html + token CSS + 1-2 consumer files).

## Top 5 dynamic-capability findings

### 1. `falcon-tabs` has a clever-but-fragile `falconTabActions` directive
The Angular wrapper uses a MutationObserver to lift per-tab action templates into the Stencil tablist row. Works today, but breaks on orientation switches and `overflow:hidden` parents. Replace with a real Stencil `<slot name="header-end">` slot — wraps the same pattern in a stable mechanism.

### 2. `falcon-button` is the flagship — but `<falcon-angular-icon>` is under-used inside it
Every consumer uses `<i slot="icon-start" class="falcon-icon falcon-icon-pencil">` instead of `<falcon-angular-icon slot="icon-start" name="pencil">`. The icon wrapper exists but adoption is patchy. ESLint codemod opportunity.

### 3. `falcon-popup` duplicates `<falcon-angular-dialog>` instead of composing it
Popup re-implements the modal scaffold (backdrop, ARIA, animation, Esc handling) entirely in its own Angular template. Composing dialog would inherit focus trap (P0 a11y fix), focus restore, and consolidate motion tokens. Single highest-leverage refactor in this set.

### 4. `falcon-menu` external-anchor `showAt()` pattern is the cleanest reusable overlay-positioning abstraction in the library
PrimeNG `Menu.toggle(event)` parity. Single shared menu instance, dynamic items per-row, viewport-fixed positioning, flip-up on overflow, auto-toggle on re-anchor. Worth promoting as the standard for any future shared overlay component.

### 5. Notification + Toast are dual-track messaging — both real, but `notification` is preferred
Two parallel paths exist: `FalconMessageService.add()` (PrimeNG-compat → toast) and `FalconNotificationService.push()` (modern signal-based → notification). Both are used in production. Eventually the toast can fade to substrate-only as notification gains parity (hover-pause, action button).

## Top 5 reusable-upgrade ideas

### 1. Replace `falconTabActions` MutationObserver lift with a real Stencil slot
Adds `<slot name="header-end">` (and `<slot name="header-start">`) to `<falcon-tabs>`. Angular wrapper projects per-tab `<ng-template>` into that slot via `*ngTemplateOutlet` instead of DOM-shifting. Removes the largest source of integration fragility in Agent 3's scope.

### 2. `<falcon-angular-button>` polymorphic rendering (`href` / `target` / `selected`)
Today every "navigate to detail" button is hand-rolled with `(falconClick)="router.navigate(...)"`. Adding `href` makes the button render an `<a>` for true navigation semantics. Also `selected` for toggle-button patterns.

### 3. Focus trap on `<falcon-angular-popup>` (P0)
Popup currently lacks focus trap + focus restore (verified in source). Compose `<falcon-angular-dialog>` internally to inherit those for free.

### 4. `appendTo="body"` portal mode on `<falcon-angular-menu>` (P1)
The type allows it; the implementation doesn't honor it. Without it, menus inside `overflow:hidden` containers get clipped. Highest-leverage menu fix.

### 5. Unified icon API: `<falcon-angular-icon>` auto-routing between Falcon font and Iconify
Today the platform has two icon sources (vendored Falcon font + `iconify-icon`). A unified API that auto-detects by name prefix (`name="solar:pencil"` → Iconify, `name="pencil"` → Falcon) consolidates the pattern.

## Cross-cutting observations

### a11y posture
- Drawer + dialog have focus traps. Popup does NOT (P0).
- Tooltip's trigger gets `tabIndex=0` unconditionally — may be undesirable for non-interactive wrapping.
- Confirm-dialog reject button is rendered before accept — verify against WAI-ARIA APG conventions.
- Notification is always `aria-live="polite"`; toast intelligently swaps polite/assertive per severity.

### Token coverage
- 13 of 15 components have dedicated `<name>.tokens.css` files.
- `falcon-popup` and `falcon-notification` have NO token file — they use Falcon palette tokens directly via Tailwind utilities. Both should gain token contracts.
- `falcon-message-host` rightly has no own tokens (it composes toast).

### Dual-render path
- 12 components support `useTailwind` Shadow/Light toggle.
- `falcon-popup`, `falcon-notification`, `falcon-message-host` are Angular-only (no Stencil tag).

### Deprecated-but-needed
- `falcon-dialog` and `falcon-toast` are both documented-deprecated per registry but lack `@deprecated` annotation in source. Both remain as composition substrates for other components. Add JSDoc + dev warnings.

### Composition relationships
- `confirm-dialog` composes `dialog` (template-level).
- `popup` does NOT compose dialog (duplicates the scaffold).
- `message-host` composes toast + toast-host (template-level).
- `notification-stack` composes notification (template-level).
- `falcon-tree-panel` (Agent 4 scope) composes `menu` for tree-row actions.

### Production adoption gap
- Heavy usage: `button`, `tabs`, `drawer`, `popup`, `menu` (via tree/table composers), `message-host`.
- Zero/minimal direct usage: `card`, `confirm-dialog`, `accordion`, `avatar`, `dialog` (direct).
- Mid usage: `tooltip` (only showcase), `notification` (only showcase + interceptors).

## Files of note (absolute paths)

- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-tabs\falcon-tab-actions.directive.ts` — the MutationObserver-based per-tab actions slot (clever-but-fragile pattern).
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\components\falcon-menu\falcon-menu.tsx` lines 120-138 — the `showAt()` external-anchor mode (reusable overlay-positioning abstraction).
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-popup\falcon-popup.component.ts` — Angular-only modal re-implementing the scaffold (should compose `<falcon-angular-dialog>`).
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\components\falcon-dialog\falcon-dialog.tsx` lines 142-166 — the focus-trap pattern (shared between dialog + drawer, missing from popup).
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-message-service\falcon-message-service.ts` — `FalconMessageService` with PrimeNG `MessageService` parity.
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-notification\falcon-notification.service.ts` — `FalconNotificationService` signal-based queue.
