# falcon-drawer — USAGE

## Real usage status (active codebase) — CRITICAL FINDING

`[CODE]` **As of 2026-06-03 there are ZERO live `<falcon-angular-drawer>` tag instances in the repo.** Every grep hit for `falcon-angular-drawer` (`apps/` = 8 files / 12 occurrences; `libs/falcon` = 0) is a **comment that NAMES the component to explain why it is deliberately NOT used**, plus a test asserting its absence:

- `[CODE]` `apps/admin-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.html:4-10` — comment: *"The Stencil drawer custom element wiped the projected default-slot body under the app's zoneless change detection, so the opened drawer painted with only its header + footer and an EMPTY body."* The shell is a native `<aside role="dialog">` + scrim instead.
- `[CODE]` `apps/{admin,management}-console/.../new-wallet-balance/.../wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.ts:5-23` — **ACCEPTED WAIVER (W11)**: the SPEC's primitive map says drawer → `<falcon-angular-drawer>`, but the shell is hand-rolled in Angular by design "(not to be 'fixed' back to `<falcon-angular-drawer>`)" because routing through the Stencil drawer "would re-introduce that empty-body bug = a behavior regression". Every FIELD inside is still a Falcon primitive (`falcon-angular-dropdown` ×4 / `-input-number` / `-textarea` / `-button` ×3); only the container + scrim are native + token-bound.
- `[CODE]` `apps/management-console/.../new-wallet-balance/__tests__/standards-drawer.spec.ts:102-106` — explicitly asserts `scanHtml.includes('<falcon-angular-drawer')).toBe(false)` (GAP-001 documented).

**Implication:** the drawer is functionally an **orphan in app code** — the canonical overlay primitive is being actively avoided because its slot projection breaks under Angular zoneless change detection (the platform is on `provideZonelessChangeDetection()` per `[MEMORY]`). This is a **library-level behavior bug**, not mere non-adoption. See `GAPS_AND_UPGRADES.md` G-ZONELESS-SLOT (🟠, HIGH-RISK-QUEUE) and `FINDINGS/B14.md`.

> The prior dossier framed this as "0 consumers / adoption unconfirmed". The 2026-06-03 sweep confirms the deeper truth: adoption is zero **because of an unresolved zoneless-CD slot-wipe defect**, and consumers have permanently routed around it with hand-rolled shells.

## Recommended usage pattern (when the zoneless-CD bug is fixed, or under non-zoneless CD)

```html
<falcon-angular-drawer
  [open]="open()"
  (openChange)="open.set($event)"
  position="right"
  size="md"
  [closable]="false"
  [modal]="true"
  rootClass="my-drawer">

  <div slot="header" class="flex flex-col gap-1">
    <h3 class="text-lg font-semibold m-0">{{ 'drawer.title' | translate }}</h3>
  </div>

  <div class="flex flex-col gap-4 p-6">
    <falcon-angular-input [label]="'Name'" [(ngModel)]="name" />
  </div>

  <div slot="footer" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-falcon-neutral-150">
    <falcon-angular-button variant="ghost" [label]="'common.cancel' | translate" (falconClick)="cancel()" />
    <falcon-angular-button [label]="'common.save' | translate" [loading]="saving()" (falconClick)="save()" />
  </div>
</falcon-angular-drawer>
```

Notes:
- `closable=false` — × hidden; consumer-owned Cancel button drives close (canonical for destructive-risk forms).
- `position="right"`, `size="md"` — canonical right-side detail drawer (480 px).
- **The footer carries NO built-in chrome on EITHER render path** — you supply `flex justify-end gap-2 px-6 py-4 border-t` yourself (unlike the dialog's `-tw` path which auto-wraps).
- `(openChange)` is sufficient for `[(open)]` two-way; do not also subscribe `(drawerHide)` for the same close.

## Reactive forms inside drawer
The drawer is just a container — the form uses its own bindings. `[CODE]` falcon-drawer.tsx:169 `render()` returns `null` when closed, so the body DOM + signal state inside it are destroyed on close. Lift state to the parent.

## ngModel example
N/A — drawer is not a form control.

## Tailwind-only usage
Body content gets layout utilities directly (`<div class="p-6">`). The panel's outer geometry (width / position / animation) comes from tokens — don't override on the host.

## Token override (per-instance)
```css
.add-user-drawer {
  --falcon-drawer-side-width-md: 560px;
  --falcon-drawer-panel-border-radius-right: 24px 0 0 24px;
  --falcon-drawer-overlay-blur: 8px;
}
```
> `[CODE]` Both render paths read the same `:where(falcon-drawer, falcon-drawer-tw, falcon-angular-drawer, .falcon-drawer, [data-falcon-drawer])` tokens. **But** the inner overlay bg/blur are neutralised on the wrapper host (`falcon-drawer.component.css:39-40`) so the native `::backdrop` (`rgba(13,63,68,0.18)`, blur 4px) supplies the dim — a per-instance `--falcon-drawer-overlay-bg` override on the host will be overridden to transparent.

## Bad usage to avoid
- Don't pass `[closable]="true"` AND project a Cancel button that ALSO closes — duplicate close paths confuse keyboard users.
- Don't wrap the drawer in `@if (open)` while ALSO binding `[open]` — redundant (the Stencil returns `null` when closed).
- Don't subscribe to multiple of `(drawerShow)` / `(drawerHide)` / `(openChange)` — pick one.
- Don't nest drawers inside drawers — focus-trap layering breaks (each runs its own global keydown listener).
- Don't use `position="bottom"` for a confirm prompt — wrong concept; use `falcon-angular-popup`.
- Don't copy `dismissible` (i-spelling) from a dialog template — the drawer prop is `dismissable` (a-spelling); the wrong spelling silently uses the default (GAP G-SPELL).
- Don't expect `[modal]="false"` to give a "show-backdrop-but-click-through" mode — it shows NO backdrop AND does not dismiss on outside click.

## Import requirements (standalone component)
```ts
import { FalconAngularDrawerComponent, FalconAngularButtonComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularDrawerComponent, FalconAngularButtonComponent],
  // CUSTOM_ELEMENTS_SCHEMA is declared on the wrapper internally.
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `slot="header"` for rich header | Pass `[header]` AND `slot="header"` (both render) |
| Supply your own footer chrome (no auto-wrap either path) | Assume the footer gets token padding/border |
| Use `[modal]="false"` for non-blocking inspectors | Expect `[modal]="false"` to keep outside-click dismiss |
| Bind `[(open)]` for state | Toggle DOM presence with `@if` AND `[open]` (redundant) |
| Use `dismissable` (a-spelling) | Copy `dismissible` from a dialog template |
| Verify the zoneless-CD slot-wipe is resolved before adopting | Adopt `<falcon-angular-drawer>` for a projected-body form under zoneless CD without testing |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-drawer` across `apps/` → **8 files / 12 occurrences**, **0 in `libs/falcon`**. **ALL 12 occurrences are comments/test-assertions, NOT live tag instances** — grep `<falcon-angular-drawer[\s>]` in `.html` returns **0 rendered tags repo-wide**. Files (all referencing the WAIVER):

- `apps/{admin,management}-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.{html,ts}` (comment: Stencil drawer wiped projected body).
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.{html,ts}` (W11 ACCEPTED WAIVER).
- `apps/management-console/.../new-wallet-balance/__tests__/standards-drawer.spec.ts` (asserts the tag is absent).

> `[CODE]` Net: **the drawer primitive has no live consumer.** The Wave-7 "0 consumers" finding holds, and the 2026-06-03 sweep adds the root cause (zoneless-CD slot wipe → deliberate hand-rolled shells).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). The zero-live-tag reality + WAIVER rationale confirmed against balance-transfer.component.html:4-10, wb-balance-transfer-drawer.component.ts:5-23, standards-drawer.spec.ts:102-106. Footer-no-chrome on both paths confirmed against falcon-drawer.tsx:222-224 + falcon-drawer-tw.tsx:222.
