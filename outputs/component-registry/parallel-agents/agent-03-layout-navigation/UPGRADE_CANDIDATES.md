# Agent 3 — Upgrade Candidates Backlog

Cross-component reusable-upgrade backlog. Each entry is a concrete proposal; one entry per upgrade.

---

## UP-3-01 — Replace `falconTabActions` MutationObserver lift with a real Stencil slot

**Motivation:** The current implementation in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tabs/falcon-tabs.component.ts` uses a MutationObserver to physically move an Angular-projected `<ng-template>` content into the Stencil `<div role="tablist">` so the actions sit on the same baseline as the tab buttons. This is fragile to orientation changes, `overflow:hidden` parents, and Stencil re-renders. It's the largest source of integration risk in Agent 3's scope.

**Scope:** `falcon-tabs` (Stencil Shadow + Light sources) + `falcon-tabs` (Angular wrapper) + `falcon-tab-actions.directive.ts`.

**Proposed API:**
```tsx
// Stencil source — add slot to render() inside the tablist
<div class="falcon-tabs-tablist" role="tablist">
  {tabs.map(...)}
  <span class="falcon-tabs-indicator" />
  <span class="falcon-tabs-actions-slot">
    <slot name="header-end" />
  </span>
</div>
```
```ts
// Angular wrapper — project the active falconTabActions template via *ngTemplateOutlet
@if (activeActionsTpl(); as tpl) {
  <div slot="header-end">
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  </div>
}
```
The `FalconTabActionsDirective` keeps the same selector and `tabKey` input — only the wrapper rendering changes from MutationObserver to slot projection.

**Risk:** Moderate. The slot's flex alignment within the tablist needs token-level styling. Existing consumers' visual output should be byte-identical.

**Priority:** P0 (largest fragility in current scope).

---

## UP-3-02 — Compose `<falcon-angular-dialog>` inside `<falcon-angular-popup>`

**Motivation:** Popup currently duplicates the modal scaffold (backdrop, ARIA, scale-in animation, Esc handling) in its own Angular inline template, despite a perfectly functional `<falcon-angular-dialog>` substrate that already provides focus trap + focus restore + ARIA wiring. This duplication ALSO causes popup to LACK a focus trap (P0 a11y violation — verified in source).

**Scope:** `falcon-popup.component.ts`.

**Proposed approach:**
```html
<falcon-angular-dialog
  [open]="open()"
  [title]="resolvedTitle()"
  [closable]="false"
  [closeOnEsc]="true"
  [closeOnBackdrop]="true"
  size="sm"
  [severity]="content().intent"
  (falconClose)="onCancel()">
  
  <!-- variant-specific icon + body -->
  <div class="text-center grid gap-2">
    <span [ngClass]="iconChipClasses()" class="grid place-items-center h-7 w-7 rounded-md mx-auto">
      <falcon-angular-icon [name]="content().iconName" size="md" />
    </span>
    <p class="text-sm">{{ resolvedBody() }}</p>
    @if (hint()) { <p class="text-xs">{{ hint() }}</p> }
  </div>
  
  <div slot="footer" class="flex justify-end gap-2.5">
    <falcon-angular-button variant="secondary" [label]="resolvedCancelLabel()" (falconClick)="onCancel()" />
    <falcon-angular-button [variant]="confirmFalconVariant()" [label]="resolvedConfirmLabel()" [loading]="loading()" (falconClick)="onConfirm()" />
  </div>
</falcon-angular-dialog>
```

**Benefits:**
- Inherits focus trap (P0 fix).
- Inherits focus restore (P0 fix).
- Inherits aria-describedby / aria-labelledby idioms.
- Consolidates motion / blur tokens.
- Popup becomes a thin layer of variant config + content composition.

**Risk:** Moderate. Visual output may shift slightly (dialog token defaults vs popup hardcoded Tailwind). Mitigate by adding popup-specific dialog overrides via token file.

**Priority:** P0.

---

## UP-3-03 — Implement `appendTo="body"` portal mode on `<falcon-angular-menu>`

**Motivation:** The `FalconMenuAppendTo` type allows `'host' | 'body'`, but the implementation only handles `'host'`. Result: menus inside `overflow:hidden` containers (data table cells, tree-panel chrome) get clipped. Common shipping bug.

**Scope:** `falcon-menu.tsx` + `falcon-menu-tw.tsx`.

**Proposed implementation:**
- When `appendTo === 'body'`, render the panel via a portal to `document.body` using a teleport pattern.
- Continue using `position: fixed` (same as current external-anchor mode) but parent it to `document.body`.
- Clean up the portal on `disconnectedCallback`.

**Risk:** Low — additive, default remains `'host'`.

**Priority:** P1 (high-leverage).

---

## UP-3-04 — Add `interactive` / `selected` / `falconClick` to `<falcon-angular-card>`

**Motivation:** The registry incorrectly lists these as supported; the actual source has only `variant`, `size`, `header`, `subheader`, `footer`, `rootClass`. Selectable card patterns (billing plan tiles, dashboard widget selection) are common and currently require hand-rolled `<button>` wrappers.

**Scope:** `falcon-card.tsx`, `falcon-card-tw.tsx`, Angular wrapper.

**Proposed API:**
```ts
@Input() interactive = false;   // hover-lift + focus-ring + cursor-pointer
@Input() selected = false;       // selected ring + accent border
@Output() falconClick = new EventEmitter<MouseEvent>();
```
When `interactive=true`, render as `<button>` (or wrap inner content in one) for native keyboard accessibility.

**Risk:** Low — additive. Card has zero production consumers today.

**Priority:** P1.

---

## UP-3-05 — Add `href` / `target` / `rel` polymorphic rendering to `<falcon-angular-button>`

**Motivation:** Every "navigate to detail" button is currently hand-rolled via `(falconClick)="router.navigate(...)"`, losing right-click → "Open in new tab" + losing native anchor semantics for screen readers. The `link` variant looks like a link but renders `<button>`.

**Scope:** `falcon-button.tsx` + `falcon-button-tw.tsx` + Angular wrapper.

**Proposed API:**
```ts
@Input() href?: string;
@Input() target?: '_blank' | '_self' | '_parent' | '_top';
@Input() rel?: string;          // auto-defaults to 'noopener' when target=_blank
```
When `href` is truthy, render `<a>` instead of `<button>`. Type prop is ignored. Existing focus halo and visual treatment apply identically.

**Risk:** Low — additive. Default behavior unchanged.

**Priority:** P1.

---

## UP-3-06 — Expose `closeAriaLabel` in `<falcon-angular-drawer>` and `<falcon-angular-dialog>` wrappers

**Motivation:** Both Stencil sources accept `closeAriaLabel` (default `'Close'`), but the Angular wrappers don't bridge it to consumers. For i18n, the × button label is stuck as "Close" — not translated.

**Scope:** `falcon-drawer.component.ts`, `falcon-dialog.component.ts`.

**Proposed API:**
```ts
@Input() closeAriaLabel = 'Close';
// then forward to the Stencil tag's [attr.close-aria-label]
```

**Risk:** Trivial.

**Priority:** P1 (a11y / i18n).

---

## UP-3-07 — Add JSDoc `@deprecated` to `<falcon-angular-dialog>` and `<falcon-angular-toast>` wrappers + Stencil sources

**Motivation:** Both components are documented-deprecated in project memory + registry but lack any `@deprecated` annotation in source. TypeScript LSP / VSCode shows no strikethrough; ESLint can't flag direct usage.

**Scope:** Both wrappers + their Stencil sources.

**Proposed annotation:**
```ts
/**
 * @deprecated For action-required modals, use <falcon-angular-popup>.
 * For OK/Cancel prompts, use <falcon-angular-confirm-dialog>.
 * <falcon-angular-dialog> remains the underlying composition primitive only.
 */
```
```ts
/**
 * @deprecated For new business-status messages, use <falcon-angular-notification>.
 * <falcon-angular-toast> remains the substrate for the FalconMessageService PrimeNG-compat queue.
 */
```

**Risk:** None.

**Priority:** P1.

---

## UP-3-08 — Migrate item icons from CSS class strings to `<falcon-angular-icon>` composition

**Motivation:** `falcon-menu`, `falcon-tabs`, `falcon-accordion`, `falcon-confirm-dialog`, `falcon-popup`, `falcon-notification`, `falcon-avatar` all accept icon information as either a CSS class string (`icon: 'falcon-icon falcon-icon-pencil'`) or an inline SVG. None use `<falcon-angular-icon>` as the composition primitive. This bypasses the icon abstraction layer and prevents a future Iconify fallback.

**Scope:** All 7 components above.

**Proposed:** Add `iconName?: string` field to item descriptors (alongside the legacy `icon` field) that consumers populate with the icon NAME (no class prefix). Internal rendering composes `<falcon-angular-icon [name]="item.iconName">`.

**Risk:** Moderate. Backwards compatibility via dual support (`icon` OR `iconName`).

**Priority:** P1 (design system consistency).

---

## UP-3-09 — Collision-aware flip placement on `<falcon-angular-tooltip>`

**Motivation:** When the requested placement overflows the viewport, the tooltip is invisible offscreen. Modern UI libraries (Floating UI, Radix) implement auto-flip.

**Scope:** `falcon-tooltip.tsx` + `falcon-tooltip-tw.tsx` + `falcon-tooltip.utils.ts`.

**Proposed API:**
```ts
@Input() flipPlacement?: FalconTooltipPlacement[];   // try in order; falls back to base placement
@Input() placement: FalconTooltipPlacement | 'auto' = 'top';   // 'auto' picks best fit
```
Inside `measurePanel()`, when `flipPlacement` is provided or `placement === 'auto'`, iterate over placements and pick the first that fits within the viewport.

**Risk:** Moderate. Visual jumps when content size changes can be jarring. Mitigate with motion transition.

**Priority:** P1.

---

## UP-3-10 — Introduce token files for `<falcon-angular-popup>` and `<falcon-angular-notification>`

**Motivation:** Both components are the only Falcon UI components WITHOUT a dedicated `<name>.tokens.css` file. All visual values are inline Tailwind utilities referencing palette tokens. Result: per-instance customisation impossible.

**Scope:** New files at `libs/falcon-ui-tokens/src/components/popup.tokens.css` and `notification.tokens.css`. Refactor inline templates to consume tokens via Tailwind arbitrary value syntax (`bg-[var(--falcon-popup-panel-bg)]`).

**Proposed token shape — popup:**
```css
:where(falcon-angular-popup, .falcon-popup, [data-falcon-popup]) {
  --falcon-popup-backdrop-bg: var(--color-falcon-teal-alpha-18);
  --falcon-popup-backdrop-blur: 12px;
  --falcon-popup-panel-bg: var(--color-falcon-neutral-0);
  --falcon-popup-panel-radius: 8px;
  --falcon-popup-panel-shadow: var(--shadow-falcon-xl);
  --falcon-popup-icon-chip-size: 28px;
  /* per-intent danger/warning/success/primary tokens */
}
```

**Risk:** Moderate. Refactor surface is non-trivial; visual output should be identical.

**Priority:** P1.

---

## UP-3-11 — Add `loading` / `confirmDisabled` to `<falcon-angular-popup>`

**Motivation:** After the user clicks "Delete", popup stays open and the button is clickable again. No built-in spinner or button-disable during async work. Consumers either close optimistically (loses retry on failure) or manage parallel state.

**Scope:** `falcon-popup.component.ts`.

**Proposed API:**
```ts
readonly loading = input<boolean>(false);
readonly confirmDisabled = input<boolean>(false);
```
When `loading=true`, set `[loading]="true"` on the confirm `<falcon-button-tw>` and disable both Cancel + Confirm.

**Risk:** Low — additive.

**Priority:** P1.

---

## UP-3-12 — Hover-pause auto-dismiss on `<falcon-angular-notification>`

**Motivation:** Toast has hover-pause; notification does not. Users hovering to read longer messages get them dismissed mid-read.

**Scope:** `falcon-notification.component.ts`.

**Proposed:** Add `pointerenter` / `pointerleave` listeners that pause + resume the timer. Mirror the pattern from `falcon-toast.tsx` lines 87-98.

**Risk:** Low — additive default-on UX improvement.

**Priority:** P1.

---

## UP-3-13 — Image-load-error runtime fallback for `<falcon-angular-avatar>`

**Motivation:** When `src` is set but the image 404s, the broken-image graphic shows. The component does NOT automatically fall back to `initials` → `iconName`. Common production UX failure.

**Scope:** `falcon-avatar.tsx` + `falcon-avatar-tw.tsx`.

**Proposed:** Listen for `<img onerror>` and swap render mode to initials/icon at runtime.

**Risk:** Low — additive, internal-only change.

**Priority:** P1.

---

## UP-3-14 — Companion `<falcon-angular-avatar-group>` with overflow pill

**Motivation:** Common UX: "Members: [avatar1] [avatar2] [avatar3] +5 more". Today every consumer needing an avatar list hand-rolls the overlap and pill rendering.

**Scope:** New component at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar-group/`.

**Proposed API:**
```ts
@Component({ selector: 'falcon-angular-avatar-group', ... })
export class FalconAngularAvatarGroupComponent {
  @Input() avatars: FalconAvatarData[] = [];
  @Input() max: number = 5;       // shows +N pill if exceeded
  @Input() size: FalconAvatarSize = 'md';
  @Input() spacing: 'tight' | 'normal' = 'normal';
}
```

**Risk:** Low — new component, additive.

**Priority:** P1.

---

## UP-3-15 — Per-tab header slot for `<falcon-angular-accordion>`

**Motivation:** Today the accordion item header is built from `FalconAccordionItem` props (label, description, icon) — no slot for rich content (status badges, action buttons, sub-info beyond `description`).

**Scope:** `falcon-accordion.tsx` + `falcon-accordion-tw.tsx`.

**Proposed:** `<slot name="header-<value>">` per item (matching the existing `content-<value>` pattern).

**Risk:** Low — additive.

**Priority:** P1.

---

## UP-3-16 — `single-locked` accordion mode

**Motivation:** `mode="single"` allows collapsing the open item to zero. For always-1-open UX (sidebar-style nav, tabbed-like settings), no built-in option.

**Scope:** `falcon-accordion.tsx`.

**Proposed:** Add `'single-locked'` to `FalconAccordionMode` union. In this mode, clicking the open item is a no-op.

**Risk:** Low — additive new mode.

**Priority:** P1.

---

## UP-3-17 — `<falcon-angular-button>` composition in `<falcon-angular-confirm-dialog>` footer

**Motivation:** Confirm-dialog's accept / reject buttons are raw `<button class="falcon-confirm-btn">` in both Stencil source and Angular template. They bypass the design-system button primitive — no `loading` state, no `disabled` aria, no shared token semantics.

**Scope:** `falcon-confirm-dialog.tsx` + `falcon-confirm-dialog.component.html`.

**Proposed:** Replace inline `<button>` with `<falcon-angular-button>` (Angular template) / `<falcon-button-tw>` (Stencil) for the accept/reject pair.

**Risk:** Low — geometry may shift slightly (falcon-button has 38px height vs current hardcoded padding).

**Priority:** P1.

---

## UP-3-18 — `maxStack` cap on `FalconMessageService`

**Motivation:** Service has no upper bound. A flaky API firing 100 error toasts overwhelms the viewport.

**Scope:** `falcon-message-service.ts` + `falcon-message-host.component.ts`.

**Proposed API:**
```ts
service.configure({ maxStack: 5 });
// or via host input
<falcon-angular-message-host [maxStack]="5" />
```

**Risk:** Low — additive. Default unlimited preserves current behavior.

**Priority:** P1.

---

## UP-3-19 — Migration adapter from `FalconMessageService` to `FalconNotificationService`

**Motivation:** Long-term, the platform should consolidate on the modern signal-based `FalconNotificationService`. An adapter that forwards `FalconMessageService.add()` calls to `FalconNotificationService.push()` lets consumers retire toast without changing call sites.

**Scope:** `falcon-message-service.ts`.

**Proposed:**
```ts
@Injectable({ providedIn: 'root' })
export class FalconMessageService {
  private readonly notif = inject(FalconNotificationService);
  
  add(msg: FalconMessage): void {
    this.notif.push({
      intent: (msg.severity === 'warn' ? 'warning' : msg.severity) ?? 'info',
      title: msg.summary ?? '',
      subtitle: msg.detail,
      dismissMode: msg.life === 0 ? 'manual' : 'auto',
      dismissDuration: (msg.life ?? 5000) / 1000,
    });
  }
}
```

**Risk:** Moderate. Visual change (toast → notification) is significant. Gate behind a feature flag or release announcement.

**Priority:** P2 (long-term).

---

## UP-3-20 — Spin / pulse animation props on `<falcon-angular-icon>`

**Motivation:** Common need for loading indicators inline. Today consumers add `class="animate-spin"` (Tailwind) on the host — but that doesn't compose cleanly with the wrapper.

**Scope:** `falcon-icon.tsx` + `falcon-icon-tw.tsx` + Angular wrapper.

**Proposed API:**
```ts
@Input() spin = false;
@Input() pulse = false;
```
Apply rotation / opacity-pulse CSS keyframes via token-driven motion.

**Risk:** Low — additive.

**Priority:** P1.

---

## UP-3-21 — Unified icon API: auto-route between Falcon font and Iconify

**Motivation:** Two icon sources exist (vendored Falcon font + `iconify-icon`). Currently developers pick whichever is convenient. A unified `<falcon-angular-icon>` that auto-detects by name prefix (`solar:` → Iconify, no prefix → Falcon font) consolidates the pattern.

**Scope:** `falcon-icon.tsx` + Angular wrapper.

**Proposed:**
```ts
render() {
  const isIconify = this.name.includes(':');
  if (isIconify) {
    return <iconify-icon icon={this.name} />;
  }
  return <i class={`falcon-icon falcon-icon-${this.name}`} />;
}
```

**Risk:** Moderate. Requires the iconify-icon custom element to be registered before render.

**Priority:** P1.

---

## Summary — by priority

| Priority | Count |
|---|---|
| P0 | 2 (UP-3-01 tabs slot, UP-3-02 popup composition) |
| P1 | 18 (most others) |
| P2 | 1 (UP-3-19 migration adapter) |
| P3 | 0 (P3 items deferred from per-component gaps) |

## Summary — by component

| Component | Upgrade items |
|---|---|
| tabs | UP-3-01 |
| popup | UP-3-02, UP-3-10 (tokens), UP-3-11 (loading) |
| menu | UP-3-03 |
| card | UP-3-04 |
| button | UP-3-05 |
| drawer + dialog | UP-3-06, UP-3-07 |
| Multiple (menu/tabs/accordion/confirm-dialog/popup/notification/avatar) | UP-3-08 (icon composition) |
| tooltip | UP-3-09 |
| notification | UP-3-10 (tokens), UP-3-12 (hover-pause) |
| avatar | UP-3-13, UP-3-14 |
| accordion | UP-3-15, UP-3-16 |
| confirm-dialog | UP-3-17 |
| message-host | UP-3-18, UP-3-19 |
| icon | UP-3-20, UP-3-21 |
