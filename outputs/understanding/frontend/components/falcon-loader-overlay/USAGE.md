# falcon-loader-overlay — USAGE

## Real usage examples (active codebase)

### Example 1 — Loader Studio editor preview (the only live render site)

`libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.html:191-208`:

```html
<!-- The 4 arbitrary Tailwind descendant variants override the stencil's hardcoded
     fullscreen positioning by targeting the inner <falcon-loader-overlay-tw>
     with class-descendant specificity (0,1,1) — beats tokens.css :where() (0,0,1). -->
<div class="relative flex-1 min-h-0 w-full rounded-xl overflow-hidden flex items-center justify-center
            [&_falcon-loader-overlay-tw]:[--falcon-loader-overlay-position:absolute]
            [&_falcon-loader-overlay-tw]:[--falcon-loader-overlay-z-index:0]
            [&_[data-fl-part=stage]]:!min-h-0">
  <falcon-angular-loader-overlay
    class="block w-full h-full"
    [config]="previewConfigJson()"
    [visible]="true">
  </falcon-angular-loader-overlay>
</div>
```

> Two things to learn from this: (1) the overlay's default `--falcon-loader-overlay-position: fixed` + `z-index: 100002` must be **token-overridden to `absolute` / `0`** to contain it inside a preview card; (2) the stage's `min-height: 100vh` (`-tw` path, `[CODE]` falcon-loader-overlay-tw.tsx:1122) must be neutralised via `[&_[data-fl-part=stage]]:!min-h-0` or it blows out the card.

### Example 2 — Driving it from `FalconLoaderService` (the App=API pattern)

The wrapper injects nothing (doctrine §6). Visibility + config come from the service. A consumer that wanted to mount the fullscreen overlay as the global loader would write:

```ts
import { Component, computed, inject } from '@angular/core';
import { FalconLoaderService } from '@falcon/studio/runtime';
import { FalconAngularLoaderOverlayComponent } from '@falcon/ui-core';

@Component({
  selector: 'app-shell-loader',
  standalone: true,
  imports: [FalconAngularLoaderOverlayComponent],
  template: `
    <falcon-angular-loader-overlay
      [config]="overlayConfig()"
      [visible]="visible()">
    </falcon-angular-loader-overlay>
  `,
})
export class ShellLoaderComponent {
  private readonly loader = inject(FalconLoaderService);
  protected readonly visible = this.loader.overlayVisible;
  protected readonly overlayConfig = computed(() => this.loader.config().overlay);
}
```

…and elsewhere any caller does `const done = loader.showOverlay('route-transition'); /* … */ done();` (counter-based, composes across concurrent callers — `[CODE]` falcon-loader.service.ts:68-86).

### Example 3 — Scoped "close-able" fullscreen veil

```html
<falcon-angular-loader-overlay
  [config]="{ ...overlayCfg, showBehind: false }"
  [visible]="busy()"
  (falconLoaderOverlayClose)="busy.set(false)">
</falcon-angular-loader-overlay>
```

> `showBehind: false` makes the stage capture pointer-events and renders the close button; the overlay does **not** self-close — you flip `visible` in the `(falconLoaderOverlayClose)` handler so you can veto. (`falconLoaderShown`/`falconLoaderHidden` are unreliable today — see GAPS G1.)

## Recommended usage for NEW Angular pages

Prefer the **inline** loader for in-app busy states (it is the project default since 2026-05-19). Reach for `<falcon-angular-loader-overlay>` only for a genuinely fullscreen, brand-grade boot / route-transition / blocking veil. When you do:

```html
<falcon-angular-loader-overlay
  [config]="loader.config().overlay"
  [visible]="loader.overlayVisible()" />
```

Defaults: `useTailwind=true` (Light DOM, canonical), `config=null` (→ Stencil applies `DEFAULT_OVERLAY_CFG`: teal gradient stage, heartbeat Falcon mark, spin ring, bubbles, indeterminate progress, "Welcome to Falcon" caption).

## Reactive Forms / ngModel

**N/A** — not a form control. No CVA. Do not bind `[(ngModel)]` / `formControlName`.

## Tailwind-only usage

Layout utilities flow through the host `class=` (e.g. the Studio preview adds `class="block w-full h-full"`). There is **no `wrapperClass` / `inputClass`** input. To re-scope or contain the overlay, override its tokens via descendant arbitrary-variants on a wrapping element (Example 1) — never hand-roll competing positioning on the host, because the token cascade sets `position`/`inset`/`z-index` on the inner Stencil host.

## Token usage (per-instance override pattern)

The overlay's geometry tokens are the override surface. To contain it inside a card (the Studio pattern):

```css
.loader-preview-card falcon-loader-overlay-tw {
  --falcon-loader-overlay-position: absolute; /* not fixed */
  --falcon-loader-overlay-z-index: 0;         /* stay in local stacking context */
}
```

Or, equivalently, via Tailwind arbitrary variants on a wrapping div:

```
[&_falcon-loader-overlay-tw]:[--falcon-loader-overlay-position:absolute]
[&_falcon-loader-overlay-tw]:[--falcon-loader-overlay-z-index:0]
```

> Note: visual values (colours, sizes, durations) are normally driven by the **JSON `config`**, which writes inline CSS vars at render time and WINS over the `loader-overlay.tokens.css` defaults. Override tokens only for geometry/containment; override the JSON for appearance.

## Admin-console / management-console example

**None.** Neither console mounts this component. The only live render site is the Loader Studio editor in `libs/falcon-studio` (Example 1). See the Consumer Sweep below.

## Bad usage to avoid

- **Do NOT** use this as the in-app global / inline loader — that is `<falcon-angular-loader-inline>` since 2026-05-19 (`[CODE]` app.ts:58-65). Mounting both fullscreen overlay AND inline as global loaders double-veils the app.
- **Do NOT** forward `visible="false"` — it is presence-only; the cascade keys off attribute presence, so `"false"` would (wrongly) read as "visible".
- **Do NOT** rely on `(falconLoaderShown)` / `(falconLoaderHidden)` firing — the wrapper listens for kebab event names the Stencil tags do not emit (GAPS G1). Drive lifecycle off `visible` yourself, or off `FalconLoaderService.overlayReasons()`.
- **Do NOT** expect content projection — there is no `<ng-content>`/`<slot>`. Logo/caption/custom SVG come from `config`.
- **Do NOT** pass untrusted markup in `config.customSvg` — it is injected via `innerHTML` (GAPS G3).
- **Do NOT** mount it without overriding `position`/`z-index` if you need it region-bound — it defaults to `fixed` + `z-index: 100002` (top of the z-ladder) and will cover the whole viewport.
- **Do NOT** use `*ngIf` / `*ngFor` in the surrounding template — use `@if` / `@for` per project rule (the wrapper itself already uses `@if`).

## Import requirements (standalone component)

```ts
import { FalconAngularLoaderOverlayComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularLoaderOverlayComponent],
  ...
})
```

No `FormsModule` needed (not a form control). `CUSTOM_ELEMENTS_SCHEMA` is internal to the wrapper.

## Do / Don't

| Do | Don't |
|---|---|
| Use the **inline** loader for in-app busy states. | Use the fullscreen overlay as the global loader. |
| Drive `[config]` + `[visible]` from `FalconLoaderService`. | Inject services into the wrapper / fetch in it. |
| Override geometry tokens to contain it in a card. | Hand-roll competing `position`/`z-index` on the host. |
| Supply logo/caption/SVG via the JSON `config`. | Expect `<ng-content>` / slots. |
| Flip `visible` yourself in the close handler. | Rely on `falconLoaderShown/Hidden` events (G1). |
| Sanitise any `config.customSvg`. | Pass untrusted SVG markup (innerHTML sink, G3). |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-loader-overlay>` / `<falcon-loader-overlay-tw>` / `<falcon-loader-overlay>` across `apps/` + `libs/` returned **1 live render-site consumer** as of 2026-06-03:

- `libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.html:207` — Loader Studio editor "Test Fullscreen" preview (renders `<falcon-angular-loader-overlay>`).

Comment-only / non-render references (NOT consumers):
- `apps/host-shell/src/app/app.ts:63` — comment explaining the overlay is NOT the global loader.
- `apps/host-shell/src/app/app.config.ts:160` — comment on `FalconLoaderService` provider wiring.
- `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.html:31` — comment: drives `showOverlay()` but mounts no element.

Across `apps/` (admin-console, management-console, host-shell) the overlay tag is rendered in **0** feature templates. Net live render sites: **1** (Studio editor, a library, not an app feature).

## Verification
🟢 code-verified — Consumer Sweep is a direct grep of `apps/` + `libs/` on 2026-06-03; the Studio editor snippet is quoted from `loader-studio.component.html`. The `FalconLoaderService`-driven Example 2 is the documented App=API pattern (`[CODE]` falcon-loader.service.ts), not a live mount. NOT runtime-verified.
