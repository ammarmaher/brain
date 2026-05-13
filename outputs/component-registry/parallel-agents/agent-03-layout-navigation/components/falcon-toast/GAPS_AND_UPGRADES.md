# falcon-toast — GAPS AND UPGRADES

## Missing capabilities

### P0 — Deprecation not enforced at API surface
Per registry: `@deprecated — prefer <falcon-angular-notification>`. But the Stencil + Angular wrapper sources have NO `@deprecated` JSDoc, NO console warning, NO ESLint rule.

**Fix:**
1. Add JSDoc `@deprecated Use <falcon-angular-notification> for new business-status messages. Toast remains for FalconMessageService PrimeNG-compat substrate.`
2. Add a one-time `console.warn` in non-production builds when the wrapper is used directly outside `<falcon-angular-message-host>` composition.

**Priority: P0** — design system guard rail.

### P1 — `<falcon-angular-toast>` not wired to `<falcon-angular-icon>`
Toast icons are hardcoded inline SVG paths in `renderSeverityIcon()` (lines 109-129 of `falcon-toast.tsx`). Should use the icon component.

**Priority: P1**

### P1 — No way to opt out of auto-dismiss without setting `duration=0`
A `[persistent]="true"` prop would be clearer than `duration=0`.

**Priority: P1**

### P1 — `<falcon-angular-toast-host>` position is fixed at mount time
Changing `position` while toasts are stacked doesn't re-stack — the new toasts mount at the new position but existing ones may overlap.

**Priority: P1**

### P2 — No "show progress bar" mode
For long-running async toasts ("Uploading...50%"), no built-in progress visual.

**Priority: P2**

### P2 — No grouping / collapsing
For 10 simultaneous error toasts, no grouping ("3 errors — view all").

**Priority: P2**

### P2 — `FalconMessageService.add({...})` doesn't queue when host isn't mounted
If `add()` is called before the host mounts, the message sits in the BehaviorSubject and renders on host mount — generally fine, but a "max queue length" would prevent unbounded growth.

**Priority: P2**

### P3 — No swipe-to-dismiss on mobile
Standard mobile UX. Not currently supported.

**Priority: P3**

## Missing ng-template / template slots
- No `<ng-template falconToastBody>` for rich body content.
- No per-severity icon override slot.

## Missing flags / options / states
- `persistent`.
- Progress bar mode.
- Grouping.
- Swipe-to-dismiss.

## Missing accessibility features
- `aria-atomic` not set on the toast — for screen readers, content changes may not re-announce.
- The dismiss × button has `aria-label="Dismiss"` but no i18n bridge.

## Missing tests
- No `.spec.ts`.
- No e2e for hover-pause / focus-pause auto-dismiss behavior.

## Missing Tailwind / token parity
- Light + Shadow renderers should mirror.

## Performance risks
- Hover/focus timer pause is per-toast — fine.
- Many simultaneous toasts (>20) could cost render time.

## Visual / interaction risks
- The auto-dismiss timer is invisible — users don't know how much time remains. The notification component has a countdown bar — toast doesn't.
- Hover-pause resets aren't communicated to the user (subtle).

## Reusable upgrades needed
1. **`@deprecated` JSDoc + dev warning** (P0).
2. **`<falcon-angular-icon>` composition for severity icons** (P1).
3. **`persistent` flag** (P1).
4. **Repositioning support on host position change** (P1).
5. **Countdown bar** (P2) — borrow from notification.
6. **Progress bar mode** (P2).
7. **Grouping** (P2).
8. **Migration path to notification** — document clearly.

## Priority: page-level vs shared
All shared.

## Recommended upgrade API (proposed)

```ts
/**
 * @deprecated Use <falcon-angular-notification> for new business-status messages.
 * <falcon-angular-toast> remains the substrate for the FalconMessageService PrimeNG-compat queue.
 */
@Component({ selector: 'falcon-angular-toast', ... })
export class FalconAngularToastComponent {
  // ... existing inputs
  @Input() persistent = false;         // new — explicit replacement for duration=0
  @Input() showProgress = false;       // new — countdown bar
  @Input() progress?: number;          // new — for "Uploading 50%" style
}
```

## Future-proof recommendation
**Don't add new features to toast.** The component is documented-deprecated. Investment should go into:
1. Documenting the deprecation in code.
2. Building the migration path from `FalconMessageService.add()` to `FalconNotificationService.push()`.
3. Eventually phasing out the toast component in favor of notification + a `FalconNotificationService.fromMessageService(service)` adapter.

The toast remains the PrimeNG substrate — keep it functional but don't grow its API.
