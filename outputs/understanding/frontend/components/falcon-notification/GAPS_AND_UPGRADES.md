# falcon-notification — GAPS AND UPGRADES

## Missing capabilities

### P1 — No icon component composition
Like popup, notification renders inline `<svg>` for the 4 intent icons. Should use `<falcon-angular-icon>`.

**Priority: P1**

### P1 — No hover-pause on auto-dismiss
Unlike `<falcon-angular-toast>`, the notification's auto-dismiss timer doesn't pause on hover. Users who hover to read longer messages get them dismissed mid-read.

**Priority: P1** — UX expectation.

### P1 — No body slot / rich content
Notification supports `title` (required) and `subtitle` (string). No way to project rich content (formatted text, links, inline icons).

**Proposed:**
- `<ng-content>` for rich body (replacing `subtitle` when projected).

**Priority: P1**

### P1 — Stack position is fixed
Stack mounts at `top-[4.75rem] right-6` — hardcoded in the inline template. Other positions (bottom-right, top-center, etc.) require a fork.

**Proposed:** `[position]="FalconToastHostPosition"` on the stack — parity with toast-host.

**Priority: P1**

### P2 — No action button
Toast has `actionLabel` + `actionHref`. Notification has no action affordance — users can only dismiss.

**Proposed:** `actionLabel` + `actionHref` + `actionClick` output.

**Priority: P2**

### P2 — No `warning` icon (uses `info` icon)
Looking at the source:
```ts
warning: { icon: 'info', ... }   // line 49
```
The warning intent uses the SAME icon as info, just with amber colors. Should use the `'alert'` icon (already declared in the IconKey union).

**Priority: P2** — visual ambiguity.

### P2 — No token CSS file
Like popup, no `libs/falcon-ui-tokens/src/components/notification.tokens.css`. All visual values are inline Tailwind utilities.

**Priority: P2** — per-instance customisation impossible.

### P2 — No `aria-live="assertive"` for error / warning
Always `polite`. Toast intelligently swaps to `assertive` for warning/error. Notification doesn't.

**Priority: P2** — a11y.

### P3 — No swipe-to-dismiss on mobile
Standard mobile UX.

### P3 — No grouping / collapsing of multiple simultaneous notifications
For 10+ simultaneous, viewport fills up.

## Missing ng-template / template slots
- No body / footer slots.
- No icon override slot.

## Missing flags / options / states
- Hover-pause.
- Stack position.
- Action button.
- Action callback.
- Aria-live switch per severity.
- Grouping.

## Missing accessibility features
- See P2 (no aria-live switch).
- Dismiss button is the only focusable element — Tab through notification reaches only the × button.

## Missing tests
- No `.spec.ts`.
- No e2e for the auto-dismiss + manual dismiss flows.

## Missing Tailwind / token parity
N/A — Tailwind-direct.

## Performance risks
- Backdrop-blur is heavy.
- Each notification renders independently via `@for` in the stack — fine for typical counts.
- Auto-dismiss timer is per-notification — clean.

## Visual / interaction risks
- The countdown bar is subtle (1px height by default) — easy to miss as a "time left" cue.
- `glossy=true` (default) requires capable GPU for backdrop-blur. Low-end devices show without blur.
- The stack is `position: fixed` at top-right with hardcoded offset — header height changes won't reflow.

## Reusable upgrades needed
1. **Hover-pause auto-dismiss** (P1).
2. **`<falcon-angular-icon>` composition** (P1).
3. **Body slot for rich content** (P1).
4. **Stack position config** (P1).
5. **Action button** (P2).
6. **`alert` icon for warning intent** (P2).
7. **`notification.tokens.css`** (P2).
8. **aria-live per severity** (P2).

## Priority: page-level vs shared
All shared.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-notification', ... })
export class FalconAngularNotificationComponent implements OnDestroy {
  readonly open = input<boolean>(true);
  readonly intent = input<FalconNotificationIntent>('info');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  
  // NEW
  readonly hoverPause = input<boolean>(true);
  readonly actionLabel = input<string>('');
  readonly actionHref = input<string>('');
  readonly iconName = input<string>('');           // new — overrides intent default icon
  
  // ...existing visual props
  
  readonly dismiss = output<void>();
  readonly actionClick = output<void>();           // new
}

// Stack additions
@Component({ selector: 'falcon-angular-notification-stack', ... })
export class FalconAngularNotificationStackComponent {
  readonly position = input<FalconToastHostPosition>('top-right');  // new
  // ...
}

// Service additions
push(args: FalconNotificationPushArgs & {
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}): number;
```

## Future-proof recommendation
Notification is the preferred passive-message component going forward — invest in the Tier-1 upgrades (hover-pause, body slot, action button) to make it a full replacement for toast in business-status use cases. Once feature parity is reached, the toast component can fade entirely to its PrimeNG-substrate role.
