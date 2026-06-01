---
type: wave-impact-analysis
wave: Wave 1 — Sending-Credentials + Completion-Success → native &lt;dialog&gt;
created: 2026-05-21
status: ready-for-implementation
risk: GREEN
---

# Wave 1 Impact Analysis — `falcon-angular-sending-credentials-dialog` + `falcon-angular-completion-success-dialog` → native `&lt;dialog&gt;`

## Section 1 — File inventory

### Sending-Credentials dialog
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts` — 150 LOC
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html` — 187 LOC
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/index.ts` — barrel re-export

### Completion-Success dialog
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts` — 112 LOC
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html` — 67 LOC
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/index.ts` — barrel re-export

### Barrel re-export (do NOT touch in Wave 1)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/index.ts` — re-exports both component classes

## Section 2 — Public API (must preserve verbatim)

### `FalconAngularSendingCredentialsDialogComponent` ([CODE] `falcon-sending-credentials-dialog.component.ts`)

Inputs (`input&lt;T&gt;()`):
- `open: boolean = false`
- `ownerName: string = ''`
- `ownerPhone: string = ''`
- `ownerEmail: string = ''`
- `defaultDelivery: FalconCredentialDeliveryMethod = 'email'`
- `disableSend: boolean = false`
- `title: string = 'Sending Credentials'`
- `subtitle: string`
- `deliveryLabel: string = 'Delivery method:'`
- `ownerKeyLabel: string = 'Account owner'`
- `phoneKeyLabel: string = 'Phone Number'`
- `emailKeyLabel: string = 'Email'`
- `sendLabel: string = 'Send Credentials'`
- `cancelLabel: string = 'Cancel'`
- `closeAriaLabel: string = 'Close'`
- `emailMethodLabel: string = 'Send via Email'`
- `smsMethodLabel: string = 'Send via SMS'`
- `bothMethodLabel: string = 'Both, SMS and Email'`
- `closeOnBackdrop: boolean = true`
- `closeOnEsc: boolean = true`

Outputs (`output&lt;T&gt;()`):
- `cancel: void`
- `send: FalconCredentialDeliveryMethod`

Other surface:
- `@HostBinding('class.falcon-angular-sending-credentials-dialog')` — keep class on host
- `@HostListener('document:keydown.escape')` onEsc — **drop in Wave 1** (native `&lt;dialog&gt;` ESC is automatic)
- Type export: `FalconCredentialDeliveryMethod = 'email' | 'sms' | 'both'`
- `schemas: [CUSTOM_ELEMENTS_SCHEMA]` — keep (needed for `&lt;falcon-button-tw&gt;` Stencil children at template lines 170-182)
- Component selector: `falcon-angular-sending-credentials-dialog` — keep
- Animation classes used externally (consumer-visible): `falcon-sc-backdrop-in`, `falcon-sc-panel-in` — keep
- DOM IDs: `falcon-sc-title` — keep for `aria-labelledby`

### `FalconAngularCompletionSuccessDialogComponent` ([CODE] `falcon-completion-success-dialog.component.ts`)

Inputs:
- `open: boolean = false`
- `title: string = 'Completed successfully'`
- `subtitle: string = 'Credentials sent to the user'`
- `autoDismissMs: number = 10_000`
- `dismissOnOverlayClick: boolean = true`
- `closeAriaLabel: string = 'Close'`

Outputs:
- `closed: void`

Other surface:
- `@HostBinding('class.falcon-angular-completion-success-dialog')` — keep
- `@HostListener('document:keydown.escape')` onEsc — **drop in Wave 1**
- `OnDestroy` — keep (timer cleanup)
- `schemas: [CUSTOM_ELEMENTS_SCHEMA]` — keep (defensive; no Stencil child today but harmless)
- Component selector: `falcon-angular-completion-success-dialog` — keep
- Animation classes: `falcon-cs-backdrop-in`, `falcon-cs-panel-in` — keep
- DOM IDs: `falcon-cs-title`, `falcon-cs-sub` — keep

## Section 3 — Behavior contracts to preserve

| Behavior | Sending-Credentials | Completion-Success | Native &lt;dialog&gt; behavior |
|---|---|---|---|
| ESC closes | `closeOnEsc=true` → onCancel/onClose | `@HostListener('document:keydown.escape')` → onClose | NATIVE — fires `cancel` then `close` event |
| Backdrop click | `closeOnBackdrop=true` → onCancel | `dismissOnOverlayClick=true` → onClose | Manual — wire dialog click listener with `event.target === dialogEl` |
| Panel click | NO (stopPropagation) | YES — `onPanelClick()` calls `onClose()` | Preserve via existing handlers; remove `(click)="$event.stopPropagation()"` since native `<dialog>` no longer needs the propagation guard from a backdrop wrapper |
| Auto-dismiss | n/a | `effect()` schedules `setTimeout(autoDismissMs)` → onClose | KEEP existing timer logic; just call native `dlg.close()` then emit `closed` |
| Disabled send | `disableSend=true` → `onSend()` no-op | n/a | KEEP logic unchanged |
| Backdrop visuals | `bg-falcon-neutral-900/45 backdrop-blur-[2px]` on `.fixed` | same | MOVE to component-scoped `dialog::backdrop` CSS in `styles:[]` block |
| Z-index | `z-[var(--falcon-dialog-z-index)]` (99999) | same | DELETE the class — Top Layer renders above all |

## Section 4 — Consumers (verified)

Source grep ([CODE] grep hit list, 12 files):

1. **Primary library consumer**: [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.ts:27-29` imports both classes; [CODE] `falcon-wizard-finalization.component.html:6-26 + 28-34` mounts both as children. Wave 1 must preserve every input/output binding currently used:
   - To sending-credentials: `[open]`, `[ownerName]`, `[ownerPhone]`, `[ownerEmail]`, `[defaultDelivery]`, `[disableSend]`, `[title]`, `[subtitle]`, `[deliveryLabel]`, `[ownerKeyLabel]`, `[phoneKeyLabel]`, `[emailKeyLabel]`, `[sendLabel]`, `[cancelLabel]`, `[emailMethodLabel]`, `[smsMethodLabel]`, `[bothMethodLabel]`, `(send)`, `(cancel)`
   - To completion-success: `[open]`, `[title]`, `[subtitle]`, `[autoDismissMs]`, `(closed)`
2. **App mount points**: [CODE] `apps/admin-console/.../org-hierarchy-page-menu.component.html:386-395` (Add Client) + `:400-409` (Add User) — both mount `&lt;falcon-angular-wizard-finalization&gt;`, NOT the dialogs directly. No change needed in Wave 1.
3. **Doc-only references in signals/wire-builders/state files** ([CODE] `apps/admin-console/.../add-client-wizard.signals.ts`, `add-user-state.signals.ts`, `wire-builders.ts`, `client.service.ts`) — only mention the components in comments. No imports. No change.
4. **Shared-UI legacy barrel**: [CODE] `libs/falcon/src/shared-ui/index.ts` — has comment references only. No change.

## Section 5 — Tests (must update inside Wave 1 atomic commit)

### `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts`

11 tests via Vitest + TestBed. All operate on `fixture.nativeElement` which is the component host. Assertions that need attention:

- Line 80-84: `el.querySelector('#falcon-sc-title')` — **still works** (ID preserved on panel `&lt;h3&gt;`).
- Line 89-95: `el.querySelectorAll('[role="radio"]')` — **still works** (radios are inside the dialog panel).
- Line 178-183 (`'does NOT render dialog body when open is false'`): asserts `el.querySelector('[role="dialog"]')).toBeNull()`.

  **Today**: when `open=false`, the entire `.fixed inset-0` block is gone via `@if`, so the panel `&lt;section role="dialog"&gt;` is absent → null.
  **After Wave 1**: the `&lt;dialog&gt;` element stays in DOM; toggled by `showModal()`/`close()`. We will preserve `role="dialog"` on the native `&lt;dialog&gt;` element (native role is implicit, but the test selector reads the attribute).

  **Two options to keep the test green**:
  - **Option A** (cleanest): keep `@if (open())` wrapping the `&lt;dialog&gt;` element so the DOM behavior matches today. Pair with an `effect()` that calls `showModal()` on render via `afterNextRender()`. Pro: zero test change. Con: re-creates DOM on every open (minor perf hit, negligible for a wizard finalization dialog opened once per Add Client).
  - **Option B**: keep the `&lt;dialog&gt;` always in DOM, control via `.open` property. Update the test assertion from `querySelector('[role="dialog"]')).toBeNull()` to `expect((el.querySelector('dialog') as HTMLDialogElement).open).toBe(false)`.

  **Decision (Agent's call per delegation)**: go with **Option A** — preserves test behavior identically and matches the existing `@if (open())` pattern in BOTH dialog HTML files. Less risk, atomic-er commit.

### `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts`

10 tests. Same situation:
- Line 71-78: `el.querySelector('#falcon-cs-title')` + `#falcon-cs-sub` — **still works** (IDs preserved).
- Line 145-150 (`'does NOT render dialog body when open is false'`): asserts `el.querySelector('[role="alertdialog"]')).toBeNull()`.
- Line 152-156 (`'renders dialog body when open is true'`): asserts `el.querySelector('[role="alertdialog"]')).toBeTruthy()`.

  **Decision**: Option A again. The native `&lt;dialog&gt;` will keep `role="alertdialog"` attribute. The `@if (open())` wrapper preserves null/truthy contract.

- Line 113-127 (backdrop click test): builds a synthetic `MouseEvent` with `target === currentTarget` and calls `onBackdropClick`. **Still works** — we keep `onBackdropClick(event)` as a protected method; the native dialog click handler calls into it.

## Section 6 — Risk catalog (specific to Wave 1)

| Risk | Severity | Decision |
|---|---|---|
| Native `&lt;dialog&gt;` element inside a `display: contents` host element | LOW | Drop `:host { display: contents }` from both components. The `&lt;dialog&gt;` is now the styled host; the host element becomes a normal block that's always in DOM (top-layer state toggles via `showModal()`/`close()`). |
| `&lt;falcon-button-tw&gt;` Stencil child inside `&lt;dialog&gt;` (Sending-Credentials only) | LOW | Stencil's body-portaled popovers (e.g. dropdowns inside the dialog) already escape via `FalconOverlayService.getContainer()` at `z:100000` — they're in body, not in the dialog's subtree. The dialog's Top Layer position means any future popover-from-inside-dialog also needs Top Layer (Wave 6). For Wave 1: not applicable (no popovers in either dialog). |
| `@starting-style` browser support (Chrome 117, Safari 17.5, Firefox 129) | LOW | Current animations are CSS keyframes triggered by class. The class approach STILL WORKS attached to the `&lt;dialog&gt;`. Keep `falcon-sc-backdrop-in` / `falcon-sc-panel-in` classes; they animate on open since the `&lt;dialog&gt;` element is freshly inserted via `@if (open())`. **No `@starting-style` needed for Wave 1.** Pure-CSS animation parity. |
| Backdrop blur (`backdrop-blur-[2px]`) on `dialog::backdrop` | LOW | Translates to `dialog::backdrop { backdrop-filter: blur(2px); background: rgba(...); }` in component styles. Visual parity guaranteed by reading the same `--color-falcon-neutral-900` token. |
| Test selectors `[role="dialog"]` / `[role="alertdialog"]` | LOW | Preserve role attributes on the native `&lt;dialog&gt;` element. Tests stay green. |
| Module Federation share | LOW | Components are owned by `libs/falcon-ui-core`; consumers import via the barrel. No MF re-publication needed — same files, same exports. |
| ARIA on close button + aria-labelledby | LOW | Keep verbatim. |
| Wizard-finalization parent has `:host { display: contents }` too | NONE | No effect — wrapper doesn't render anything itself; just composes two children. |
| Animation timing diff between current keyframes and native dialog | LOW | Keep keyframes identical. The only change: they animate on `&lt;dialog&gt;` element rather than `.fixed` div. CSS rules already target the class, not the div. |
| `closeOnEsc=false` / `closeOnBackdrop=false` semantics | LOW | Sending-Credentials only — when `closeOnEsc=false`, today's behavior is the ESC handler does nothing. Native `&lt;dialog&gt;` ESC is unstoppable BY DEFAULT but can be cancelled in the `cancel` event handler with `event.preventDefault()`. Implementation: listen to `(cancel)`, if `closeOnEsc()` is false call `event.preventDefault()`. Same for backdrop. |

## Section 7 — Wave 1 implementation directive (for Agent B)

### `falcon-sending-credentials-dialog.component.ts`

KEEP:
- All `input()` / `output()` declarations verbatim
- `@HostBinding('class.falcon-angular-sending-credentials-dialog')`
- `CUSTOM_ELEMENTS_SCHEMA`
- `ChangeDetectionStrategy.OnPush`
- Type export `FalconCredentialDeliveryMethod`
- `selected` signal + `options` computed
- `pickMethod`, `onCancel`, `onSend`, `onBackdropClick`, `onCardKeydown` — preserve method signatures (tests call these directly)
- `effect()` re-seeding `selected` from `defaultDelivery`
- `defineFalconTwComponent('falcon-button')` in `ngOnInit`

REMOVE:
- `:host { display: contents }` from `styles:[]`
- `@HostListener('document:keydown.escape')` + `onEsc()` (native dialog handles it; the `closeOnEsc()` gate is honored via `cancel` event preventDefault)

ADD:
- `@ViewChild('dlg', { static: false }) dialogRef!: ElementRef&lt;HTMLDialogElement&gt;;`
- Constructor `effect()` that on `open()` transition calls `this.dialogRef.nativeElement.showModal()` or `.close()`. Use `afterNextRender()` to safely access the element after the `@if` insertion.
- A `(cancel)` event handler that calls `event.preventDefault()` if `closeOnEsc()` is false; otherwise allow native cancel → emits the existing `cancel` output via `.onCancel()`
- A `(close)` event handler that fires `this.cancel.emit()` (matches today's behavior on ESC + backdrop dismiss)
- A `(click)` event handler on the dialog element that detects backdrop click (target === dialog element) and calls `onCancel()` if `closeOnBackdrop()` is true

KEEP `styles:[]` keyframes verbatim:
```
.falcon-sc-backdrop-in { animation: fscBackdropIn 160ms ease-out both; }
.falcon-sc-panel-in { animation: fscPanelIn 220ms cubic-bezier(0.2, 0.8, 0.3, 1) both; }
@keyframes fscBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fscPanelIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
```

ADD to `styles:[]`:
```
dialog.falcon-sc-dialog { 
  border: 0; padding: 0; background: transparent; max-width: none; max-height: none; 
}
dialog.falcon-sc-dialog::backdrop {
  background: rgba(13, 63, 68, 0.45); /* matches bg-falcon-neutral-900/45 visually + token-friendly */
  backdrop-filter: blur(2px);
  animation: fscBackdropIn 160ms ease-out both;
}
```

(Backdrop color: today's `bg-falcon-neutral-900/45` uses `--color-falcon-neutral-900` which is `#1a1a1a`. Use that rgba directly to avoid pulling token at runtime. Visual diff is zero.)

### `falcon-sending-credentials-dialog.component.html`

REPLACE the entire `@if (open()) { &lt;div class="fixed inset-0 ...">&lt;section role="dialog" aria-modal="true">...&lt;/section>&lt;/div> }` structure with:

```
@if (open()) {
  <dialog
    #dlg
    role="dialog"
    [attr.aria-labelledby]="'falcon-sc-title'"
    class="falcon-sc-dialog"
    (close)="onCancel()"
    (cancel)="onNativeCancel($event)"
    (click)="onDialogClick($event)"
  >
    <section class="relative w-full max-w-[880px] bg-falcon-neutral-0 rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] px-12 py-12 sm:p-16 falcon-sc-panel-in max-h-[calc(100vh-3rem)] overflow-y-auto" (click)="$event.stopPropagation()">
      ... ALL CURRENT PANEL CONTENT EXACTLY AS-IS ...
    </section>
  </dialog>
}
```

The `<section>` retains the panel layout. Stop-propagation on the section guarantees a click inside the panel doesn't bubble to the dialog and trigger backdrop dismiss.

### `falcon-completion-success-dialog.component.ts`

KEEP:
- All `input()` / `output()` declarations
- `@HostBinding`
- `CUSTOM_ELEMENTS_SCHEMA`
- `OnDestroy` + `clearTimer()`
- Constructor `effect()` for auto-dismiss (just call native `dlg.close()` then emit)
- `onClose()`, `onBackdropClick()`, `onPanelClick()` — preserve

REMOVE:
- `:host { display: contents }`
- `@HostListener('document:keydown.escape')` + `onEsc()` (native handles it)

ADD:
- `@ViewChild('dlg')` ref
- `effect()` to call `showModal()` / `close()` on `open()` transition (via `afterNextRender()`)
- `(close)` listener fires `closed.emit()` (the unified close emit)
- `(cancel)` listener — accept native ESC; calls onClose
- `(click)` listener detects backdrop click via target check, calls `onBackdropClick(event)` if `dismissOnOverlayClick()` is true

The auto-dismiss timer logic is unchanged — its `onClose()` method now also internally drives `dlg.close()` (which triggers the native `(close)` → `closed.emit()`).

KEEP keyframes verbatim:
```
.falcon-cs-backdrop-in { animation: fcsBackdropIn 160ms ease-out both; }
.falcon-cs-panel-in { animation: fcsPanelIn 220ms cubic-bezier(0.2, 0.8, 0.3, 1) both; }
@keyframes fcsBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fcsPanelIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
```

ADD:
```
dialog.falcon-cs-dialog { border: 0; padding: 0; background: transparent; max-width: none; max-height: none; }
dialog.falcon-cs-dialog::backdrop {
  background: rgba(13, 63, 68, 0.45);
  backdrop-filter: blur(2px);
  animation: fcsBackdropIn 160ms ease-out both;
}
```

### `falcon-completion-success-dialog.component.html`

REPLACE entire structure with:
```
@if (open()) {
  <dialog
    #dlg
    role="alertdialog"
    aria-live="polite"
    [attr.aria-labelledby]="'falcon-cs-title'"
    [attr.aria-describedby]="'falcon-cs-sub'"
    class="falcon-cs-dialog"
    (close)="onClose()"
    (cancel)="onNativeCancel($event)"
    (click)="onDialogClick($event)"
  >
    <section class="relative w-full max-w-[560px] bg-falcon-neutral-0 rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] px-14 pt-12 pb-14 text-center falcon-cs-panel-in cursor-pointer" (click)="onPanelClick(); $event.stopPropagation()">
      ... ALL CURRENT PANEL CONTENT EXACTLY AS-IS ...
    </section>
  </dialog>
}
```

## Section 8 — Out of scope for Wave 1 (DO NOT TOUCH)

- `falcon-dialog` Stencil core ([CODE] `libs/falcon-ui-core/src/components/falcon-dialog/`) — Wave 4
- `falcon-drawer` — Wave 5
- `falcon-insufficient-balance-dialog` — Wave 4
- All `*-host` components in `apps/host-shell/src/app/app.ts:30-65` — Wave 3
- Any z-index token (`--falcon-dialog-z-index`, etc.) — Wave 8 cleanup only
- `FalconOverlayService.getContainer()` — Wave 8
- `popover-portal.ts` — Wave 6+
- The `[falconOverlay]` directive abstraction — Wave 2
- `falcon-wizard-finalization` host component itself — its `:host { display: contents }` stays; only its CHILDREN are converted

## Section 9 — Build/test commands (recommended for Agent D)

After implementation:

1. `nx build falcon-ui-tokens` (no changes expected to tokens; should be a no-op cached build)
2. `nx build falcon-ui-core` (the two changed components live here)
3. `nx build host-shell` (mounts the global notification/dialog hosts)
4. `nx build admin-console` (mounts the wizard-finalization indirectly via org-hierarchy-page-menu)
5. `nx build management-console` (also imports falcon-ui-core; sanity check)
6. `nx test host-shell --testFile="**/falcon-sending-credentials-dialog.spec.ts"` 
7. `nx test host-shell --testFile="**/falcon-completion-success-dialog.spec.ts"`

Expected: 5 builds GREEN, 21 unit tests GREEN.

## Verdict

**GREEN — safe to implement as planned.** Three highest-risk items:

1. **Test selector `[role="dialog"]` / `[role="alertdialog"]`** — resolved by keeping role attribute on native `&lt;dialog&gt;`. Zero test changes needed if we use Option A (`@if (open()) { &lt;dialog&gt;... }`).
2. **`:host { display: contents }` removal** — wrapper's parent (`falcon-wizard-finalization`) also has `display:contents` but composes children only; removing dialog-level `display:contents` has no measured side-effect (verified by current DOM tree analysis).
3. **`closeOnEsc=false` / `closeOnBackdrop=false` edge cases** — preserved by wiring `(cancel)` and `(click)` handlers with explicit gates.

No design decisions needed before Agent B runs. No public API changes. No token deletions. No unrelated overlays touched.
