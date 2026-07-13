# falcon-card-status — USAGE

## Real usage example (active codebase — the sole consumer)

`[CODE]` `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts:54-204` — the SoT service/app grid card. All five slots are used:

```html
<falcon-angular-card-status [status]="cardStatus()">
  <!-- TOP: media | title | status+price -->
  <app-comm-mkt-service-icon slot="media" class="… self-start" [kind]="iconKey()" [size]="24" />

  <div slot="title" class="self-start text-sm font-bold leading-snug text-falcon-neutral-900">
    <div>{{ titleMain() }}</div>
    @if (titleSub()) { <div>{{ titleSub() }}</div> }
  </div>

  <div slot="status" class="inline-flex flex-col items-end gap-1.5 self-start">
    <falcon-angular-status-badge [severity]="severity()" [label]="statusLabel()" size="md" />
    @if (showsPrice() && price() !== null) {
      <div class="inline-flex items-baseline gap-1 …">
        <falcon-svg-icon name="currency-sar" [size]="13" />
        <strong class="…">{{ price()! | number: '1.2-2' }}</strong>
      </div>
    }
  </div>

  <!-- BODY (default slot): description + dates band + pending band -->
  @if (descriptionText()) {
    <div class="line-clamp-3 min-h-[3lh] …">{{ descriptionText() }}</div>
  }
  @if (item.firstActivationDate) { <div class="grid grid-cols-3 …"> … </div> }
  @if (item.pending) { <div class="grid grid-cols-3 …"> … </div> }

  <!-- ACTIONS: guaranteed bottom-right slot -->
  <div slot="actions" class="flex flex-nowrap items-center gap-2">
    @for (a of actions(); track a.id) {
      <falcon-angular-button [variant]="btnVariant(a.id)" size="md" [disabled]="busy" (falconClick)="emit(a.id)">
        <span slot="icon-start">
          @switch (a.id) {
            @case ('disable')   { <falcon-angular-icon name="ban" size="sm" /> }
            @case ('doPayment') { <falcon-angular-icon name="credit-card" size="sm" /> }
            @case ('enable')    { <falcon-angular-icon name="check" size="sm" /> }
          }
        </span>
        <span slot="label">{{ a.labelKey | translate }}</span>
      </falcon-angular-button>
    }
  </div>
</falcon-angular-card-status>
```

### The domain → bucket mapping (caller-owned)

`[CODE]` comm-mkt-card.component.ts:233-244 — the caller maps its domain `FalconItemStatus` down to one of the card's 4 presentation buckets:

```ts
protected cardStatus(): FalconCardStatusType {
  switch (this.item.status) {
    case FalconItemStatus.Active:   return 'active';
    case FalconItemStatus.Expired:  return 'expired';
    case FalconItemStatus.Disabled: return 'disabled';
    default:                        return 'inactive';   // InActive / Pending* → inactive
  }
}
```

> This is THE pattern: the card knows nothing about `FalconItemStatus`; the caller translates. The card only paints a border tone.

## Recommended usage for NEW Angular pages

```html
<falcon-angular-card-status [status]="presentationBucket()">
  <my-icon slot="media" />
  <div slot="title">{{ title }}</div>
  <div slot="status"><falcon-angular-status-badge … /></div>

  <!-- body: any content, projected into the default slot -->
  <p>{{ description }}</p>

  <div slot="actions">
    <falcon-angular-button (falconClick)="onAction()"> … </falcon-angular-button>
  </div>
</falcon-angular-card-status>
```

Defaults: `status='inactive'`, `size='md'`. Map your domain status to a bucket in the caller; project all interactive controls into the slots.

## Reactive Forms / ngModel

**N/A** — the card captures no value.

## Tailwind-only usage

- Host layout: the host is `block h-full` (fills its grid cell) — add `class=` on the host for column placement.
- Per-slot layout (alignment, `self-start`, gaps) is the **caller's** responsibility on the projected elements (see the `self-start` on each top slot in comm-mkt-card to top-align icon/title/badge).
- Do NOT restyle the card chrome with Tailwind on the host — use tokens or `rootClass`.

## Token usage (per-instance override)

Two routes:

**(a) `rootClass` input** (appended to the computed root classes) — best for arbitrary-utility tweaks:

```html
<falcon-angular-card-status [status]="bucket()" rootClass="shadow-none" />
```

**(b) Host-class token override** — best for re-pointing the design tokens:

```css
.dense-card {
  --falcon-card-status-padding: 12px 14px;
  --falcon-card-status-radius: 10px;
  --falcon-card-status-active-border: var(--color-falcon-teal-700);
}
```

```html
<falcon-angular-card-status class="dense-card" [status]="'active'" />
```

## Bad usage to avoid

- **Do NOT** expect the card to own button behaviour — project your buttons into `slot="actions"`; the card owns only their placement.
- **Do NOT** pass a domain enum to `[status]` — pass one of `active`/`expired`/`disabled`/`inactive`; map in the caller.
- **Do NOT** try to mount the Stencil `<falcon-card-status>` in Angular or look for a `useTailwind` input — the Angular path renders its own chrome on purpose (mounting the `-tw` element re-breaks interactive button projection under zoneless CD).
- **Do NOT** hardcode hex/px in the consumer's CSS to restyle the card — use `--falcon-card-status-*` tokens or `rootClass`.
- **Do NOT** rely on `[data-status]` as a CSS selector for the tone — the tone comes from the computed Tailwind border class, not a `[data-status]` rule.
- **Do NOT** use this for a non-status content card → `<falcon-angular-card>`; or for a status pill → `<falcon-angular-status-badge>`.

## Import requirements (standalone component)

```ts
import { FalconAngularCardStatusComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularCardStatusComponent /*, your projected components */],
  // NO CUSTOM_ELEMENTS_SCHEMA needed — the wrapper renders plain Angular chrome.
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Map a domain status → a 4-bucket `[status]` in the caller. | Pass the raw domain enum. |
| Project interactive buttons into `slot="actions"`. | Expect the card to own button behaviour. |
| Use `rootClass` / `--falcon-card-status-*` tokens for tweaks. | Hardcode hex/px in consumer CSS. |
| Top-align top-row slots via `self-start` on the projected els. | Assume the card aligns slot content for you (it uses `items-center`). |
| Use `<falcon-angular-card-status>` (Angular path). | Mount the Stencil `<falcon-card-status>` in Angular. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-card-status` across `apps/` + `libs/falcon/` → **1 live consumer**:

- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` (`app-comm-mkt-card`).

The Stencil `<falcon-card-status>` additionally appears only inside `libs/falcon-ui-core` (generated `components.d.ts`, `web-types.json`, the wrapper, the barrel, the token file) — non-render. **No `apps/` consumer uses the component directly** — they consume it transitively via `<app-comm-mkt-card>` in the comm-mkt-view shared feature (rendered by the comm-channels / applications pages in both consoles).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11). The comm-mkt-card example + `cardStatus()` mapping confirmed verbatim against live source. Consumer Sweep: 1 direct consumer (comm-mkt-card), consumed transitively by the comm-mkt-view pages.
