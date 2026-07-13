# falcon-loader-inline — USAGE

## Real usage examples (active codebase)

### Example 1 — THE global app loader (canonical, highest-traffic)

`apps/host-shell/src/app/app.ts:58-78` — the inline engine IS the default global loader (2026-05-19):

```html
<!-- Global app loader — the INLINE loader engine (not the full-screen overlay).
     Centered card on a dim Falcon-teal backdrop, pinned to the viewport. -->
<div
  class="fixed inset-0 z-[2000] items-center justify-center bg-[color:rgba(...teal...)]"
  [class.flex]="overlayVisible()"
  [class.hidden]="!overlayVisible()"
  role="status">
  <falcon-angular-loader-inline
    class="flex"
    [config]="inlineConfig()"
    [visible]="overlayVisible()">
  </falcon-angular-loader-inline>
</div>
```
```ts
private readonly loader = inject(FalconLoaderService);
protected readonly overlayVisible = this.loader.overlayVisible;          // global show/hide counter
protected readonly inlineConfig   = computed(() => this.loader.config().inline);  // inline slice of live config
```

> **Key nuance:** the global mount binds `[visible]` to `overlayVisible()` (the OVERLAY counter), NOT to a per-target inline counter — so any `showOverlay()` caller surfaces this single global inline card. The `role="status"` lives on the OUTER `<div>`, compensating for the `-tw` host's missing live-region (API a11y note / GAP G1).

### Example 2 — driving it programmatically (the normal consumer pattern)

`apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.ts:248` (+ service-pricing, org-hierarchy-tree, login-transition):

```ts
private readonly loader = inject(FalconLoaderService);
private loaderDismiss?: FalconLoaderDismiss;

// show the GLOBAL inline loader (never a full-screen overlay)
this.loaderDismiss = this.loader.showOverlay('do-payment-priority-popup');
// …later, when work completes:
this.loaderDismiss?.();   // counter-based: closes only when ALL holders dismiss
```

> Consumers do NOT mount `<falcon-angular-loader-inline>` themselves for the global loader — they call `FalconLoaderService.showOverlay(reason)` and the `app.ts` mount renders it. `showOverlay` returns a disposer; concurrent callers compose cleanly (the loader hides when the counter hits 0).

### Example 3 — Loader Studio mini-previews (per-region, `[visible]="true"`)

`libs/falcon-studio/.../loader-studio/loader-studio.component.html:230-236`:

```html
<falcon-angular-loader-inline class="block w-full h-full"
  [config]="state.draftInline()" [visible]="true" [useTailwind]="true" target="studio-mini-light" />
<falcon-angular-loader-inline class="block w-full h-full"
  [config]="state.draftInline()" [visible]="true" [useTailwind]="true" target="studio-mini-dark" />
```

> The only LIVE per-`target` usage — each preview is permanently visible (`[visible]="true"`) and bound to the editor's draft config so changes render instantly.

## Recommended usage for NEW per-region loaders

```ts
// In the component that owns a loadable card/section:
private readonly loader = inject(FalconLoaderService);
protected readonly cardLoading = this.loader.isInlineVisible('my-card');   // cached Signal<boolean>

loadCard(): void {
  const done = this.loader.showInline('my-card');
  this.api.fetch().subscribe({ next: …, complete: () => done() });
}
```
```html
<div class="relative min-h-40">
  <!-- content … -->
  <falcon-angular-loader-inline
    [config]="loader.config().inline"
    [visible]="cardLoading()"
    target="my-card" />
</div>
```

Defaults: `useTailwind=true` (Light DOM, canonical), `config=null` (→ Stencil defaults), `visible=false`, `target=''`.

## Reactive Forms / ngModel

Not applicable — the loader is a presentational toggle, no form control.

## Tailwind-only usage

The `-tw` twin is Light DOM, so consumer Tailwind utilities + the `--falcon-loader-inline-*` token cascade drive every visual. Add host layout utilities via `class=` (e.g. `class="block w-full h-full"` in the Studio previews). Do NOT hand-roll the loader's internal layout — it is fully config + token driven.

## Per-instance token override

```css
.compact-region-loader {
  --falcon-loader-inline-position: static;   /* inline-flow instead of absolute cover */
}
```
```html
<falcon-angular-loader-inline class="compact-region-loader" [visible]="loading()" target="x" />
```

> Most visual tuning happens through the JSON `config` (30 groups), NOT tokens — tokens cover the host/visibility/skeleton/dots chrome; per-instance colours/geometry/animation ride in `config`.

## Do / Don't

| Do | Don't |
|---|---|
| Call `FalconLoaderService.showOverlay()` for the global loader | Mount a second `<falcon-angular-loader-inline>` for the global state |
| Bind `[visible]` to a service Signal | Set `[attr.visible]="'false'"` manually (literal "false" keeps it VISIBLE) |
| Give each per-region loader a unique `target` | Share one `target` across unrelated regions |
| Pass `config` as the `.inline` slice of the live config | Pass an unvalidated user string and expect an error (it silently defaults) |
| Wrap a per-region loader in a `position:relative` parent | Drop it into a static-flow parent and expect it to fill (it's `absolute` by default) |
| Add `role="status"` on your wrapper when using `useTailwind` | Assume the `-tw` host announces to AT (it does NOT — G1) |

## Consumer Sweep (2026-06-03)

[CODE] `<falcon-angular-loader-inline>` renders at **4 sites / 2 files**:
- `apps/host-shell/src/app/app.ts:72` — the global app-loader mount (the canonical consumer).
- `libs/falcon-studio/.../loader-studio/loader-studio.component.html:213,230,233,236` — Studio editor preview + 3 mini-previews.

[CODE] **6 files inject `FalconLoaderService`** and drive the loader programmatically (no tag render): `app.ts` (`overlayVisible`/`inlineConfig`), `do-payment-priority-popup.component.{ts,html}` (`showOverlay`), `service-pricing.component.ts` (`showOverlay`), `organization-hierarchy-tree.component.ts` (`showOverlay`), `login-transition.service.ts` (`showOverlay`).

> `[CODE]` No app uses the per-target `showInline(target)` path outside the Studio previews — the global loader uses the overlay COUNTER (`overlayVisible()`). The `-tw` raw tag `<falcon-loader-inline-tw>` appears only inside the wrapper template; `<falcon-loader-inline>` (Shadow) only in the wrapper's `@else` branch.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 — NEW). Examples 1-3 confirmed against live source (app.ts:58-78, do-payment popup :248, loader-studio.component.html:230-236); 4 render sites + 6 service-consumer files grep-verified; the overlay-counter-vs-inline-counter nuance documented from app.ts:106-107.
