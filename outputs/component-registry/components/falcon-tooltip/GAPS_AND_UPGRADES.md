# falcon-tooltip — GAPS AND UPGRADES

## Missing capabilities

### P1 — No flip / collision-aware placement
When the user requests `placement="right"` and there's no room on the right of the trigger, the tooltip overflows the viewport. There's no auto-flip to a different placement.

**Proposed:** Add `flipPlacement` array (e.g. `['right', 'left', 'top']` — try each in order) or `auto` mode that picks the best fit.

**Priority: P1**

### P1 — No `disabled` Watch
The Stencil source's `disabled` prop has no `@Watch` — toggling `disabled=true` while the tooltip is OPEN doesn't close it. Consumer has to manually call `close()`.

**Priority: P1** — a11y / unexpected behavior.

### P2 — Hide delay hardcoded
`scheduleHide()` uses a fixed 80ms timeout (line 109). Show delay is configurable via `delay` prop; hide is not. Some consumers want longer hide delay for hover-to-link flows.

**Proposed:** `hideDelay` input.

**Priority: P2**

### P2 — `<falcon-angular-icon>` should be used for trigger icons in examples
Today examples use raw `<i class="falcon-icon ...">`. Document the icon-component pattern.

**Priority: P2** — docs.

### P2 — Trigger gets `tabIndex=0` unconditionally
This makes any wrapped element keyboard-focusable. For a tooltip wrapping a non-interactive span (e.g. a status badge), the badge becomes a focus stop. May surprise consumers.

**Proposed:** `[focusableTrigger]="false"` to opt out.

**Priority: P2**

### P3 — No animation on show / hide
Tooltip shows by appearing in DOM and applying transform. No fade-in / scale-in. Visually abrupt.

**Proposed:** add motion tokens for show/hide opacity transition.

**Priority: P3**

### P3 — No max-height (only max-width)
For very long tooltip content, the panel can grow tall without bound. `maxHeight` input would help.

**Priority: P3**

## Missing ng-template / template slots
- No `<ng-template falconTooltipContent>` directive — rich content uses `<slot name="content">` only.

## Missing flags / options / states
- `flipPlacement` / `auto` placement.
- `hideDelay`.
- `[focusableTrigger]`.
- `maxHeight`.
- `arrow` toggle (currently arrow is always rendered as a `<span class="falcon-tooltip-arrow">`).
- `showOnFocus` toggle (currently always on).

## Missing accessibility features
- The trigger `tabIndex=0` may be undesirable for non-interactive wrapping (e.g. a status text label that shouldn't be a focus stop).
- No `aria-describedby` linking the trigger to the tooltip's panel id at all times — it's only set WHILE the tooltip is showing. WAI-ARIA APG suggests setting it persistently.
- No keyboard shortcut to dismiss (Esc) — only blur / pointer-leave.

## Missing tests
- No `.spec.ts`.
- No e2e for collision detection (because there isn't any).

## Missing Tailwind / token parity
- Light + Shadow renderers should match.

## Performance risks
- `computeOffset()` runs in `requestAnimationFrame` after `panelEl` mounts. Cheap.
- The Stencil source's `parseOffset()` does `getComputedStyle().getPropertyValue()` per show — micro-cost. Acceptable.
- Pointer-enter / pointer-leave listeners are local to the trigger span — no global cost.

## Visual / interaction risks
- No collision avoidance — tooltips can overflow viewport.
- No animation — abrupt appearance.
- `interactive=true` requires the user to move pointer from trigger to panel without crossing a gap — the 8px offset is the gap. For touch / coarse pointer users this is finicky.

## Reusable upgrades needed
1. **Collision-aware flip placement** (P1).
2. **`disabled` Watch** to auto-close (P1).
3. **`hideDelay` input** (P2).
4. **`focusableTrigger` opt-out** (P2).
5. **Show/hide animation** (P3).

## Priority: page-level vs shared
All belong in the shared component.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-tooltip', ... })
export class FalconAngularTooltipComponent {
  @Input() content?: string;
  @Input() placement: FalconTooltipPlacement = 'top';
  @Input() delay = 100;
  @Input() hideDelay = 80;                                          // new
  @Input() disabled = false;
  @Input() interactive = false;
  @Input() maxWidth?: string;
  @Input() maxHeight?: string;                                       // new
  @Input() flipPlacement?: FalconTooltipPlacement[];                 // new
  @Input() focusableTrigger = true;                                  // new
  @Input() showOnFocus = true;                                       // new
  @Input() arrow = true;                                             // new

  // Outputs
  @Output() falconShow = new EventEmitter<FalconTooltipShowDetail>();
  @Output() falconHide = new EventEmitter<FalconTooltipHideDetail>();
}
```

Stencil source:
- Add `@Watch('disabled')` to close on disable.
- Implement collision detection in `measurePanel()`.
- Wire show/hide CSS transition via panel `data-state="visible"` attribute + tokens.

## Future-proof recommendation
Collision-aware flip is the most-asked tooltip feature in modern UI libraries (Radix UI, Floating UI). The current `computeOffset()` already returns x/y — extending it to try alternative placements is a moderate refactor with high payoff.
