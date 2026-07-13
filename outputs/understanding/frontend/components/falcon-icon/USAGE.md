# falcon-icon — USAGE

## Real usage examples (active codebase)

### Example 1 — Glyph inside a button's icon-start slot (the heaviest consumer)

`[CODE]` `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts:187-199` — each action button projects a Falcon glyph via `@switch`:

```html
<falcon-angular-button [variant]="btnVariant(a.id)" size="md" (falconClick)="emit(a.id)">
  <span slot="icon-start" class="inline-flex items-center">
    @switch (a.id) {
      @case ('disable')   { <falcon-angular-icon name="ban" size="sm" /> }
      @case ('doPayment') { <falcon-angular-icon name="credit-card" size="sm" /> }
      @case ('enable')    { <falcon-angular-icon name="check" size="sm" /> }
    }
  </span>
  <span slot="label">{{ a.labelKey | translate }}</span>
</falcon-angular-button>
```

### Example 2 — Inline glyph in a label, color inherited from parent

`[CODE]` same file, the dates band (lines 110-127):

```html
<span class="inline-flex items-center gap-0.5 ... text-falcon-neutral-600">
  <falcon-angular-icon name="calendar" size="xs" class="shrink-0" />
  {{ item.firstActivationDate | date: 'M/d/yyyy' }}
</span>
```

> The glyph is `decorative=true` (default) — the adjacent date text carries the meaning. Color is inherited from the parent's `text-falcon-neutral-600` via `currentColor`.

### Example 3 — Meaningful icon with an accessible label

```html
<falcon-angular-icon
  name="exclamation-triangle"
  size="md"
  [decorative]="false"
  label="Warning"
  class="text-falcon-amber-700" />
```

### Example 4 — Color via the parent (recommended) or the token (per-instance)

```html
<span class="text-falcon-red-500"><falcon-angular-icon name="trash" size="md" /></span>

<!-- or set the token directly for one instance: -->
<falcon-angular-icon name="check" size="md" style="--falcon-icon-color: var(--color-falcon-green-500);" />
```

## Recommended usage for NEW Angular pages

```html
<!-- decorative (inside a labelled control) -->
<falcon-angular-icon name="pencil" size="sm" />

<!-- meaningful (icon IS the only content) -->
<falcon-angular-icon name="info-circle" size="md" [decorative]="false" label="More info" />
```

Defaults: `useTailwind=true`, `size='md'`, `decorative=true`. Pass `name` WITHOUT the `falcon-icon-` prefix.

## Reactive Forms / ngModel

**N/A** — icon captures no value.

## Tailwind-only usage

- **Color:** apply `text-falcon-{family}-{shade}` on the **parent** — the icon inherits via `currentColor`.
- **Margin / padding:** on the parent or via host `class=`.
- **Size:** use the `size` prop, NOT Tailwind `text-*` utilities.
- **Animation:** `class="animate-spin"` on the host until the `spin`/`pulse` GAP lands (or the font's own `.falcon-icon-spin`).

## Token usage (per-instance override pattern)

```css
.kpi-icon {
  --falcon-icon-color: var(--color-falcon-teal-500);
  --falcon-icon-size-md: 18px;   /* override md size for THIS instance */
}
```

```html
<falcon-angular-icon class="kpi-icon" name="check" size="md" />
```

## Bad usage to avoid

- **Do NOT** pass `name` WITH the prefix (`name="falcon-icon-trash"`) — pass just `"trash"`.
- **Do NOT** set `decorative=false` without a `label` — screen readers won't know what to announce.
- **Do NOT** size via Tailwind `text-lg` on the host — use `size`.
- **Do NOT** color the icon directly with `style="color: red"` — color the parent (or set the `--falcon-icon-color` token).
- **Do NOT** write a raw `<i class="falcon-icon falcon-icon-X">` in NEW code — use the wrapper for standardised size + a11y.
- **Do NOT** use a near-miss glyph because the exact one is missing — a wrong icon is a semantic defect; raise a registry addition.
- **Do NOT** use `<falcon-angular-icon>` for a non-Falcon glyph — use `<falcon-svg-icon>` (platform-owned exact SVG) or `<iconify-icon>` (third-party).
- **Do NOT** add `pi pi-*` icons — PrimeIcons are physically removed.

## Import requirements (standalone component)

```ts
import { FalconAngularIconComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularIconComponent],
  ...
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Pass `name="pencil"` (no prefix). | Pass `name="falcon-icon-pencil"`. |
| Use `decorative=true` (default) inside buttons/menus. | Set `decorative=false` for purely visual icons. |
| Set color on the parent `text-falcon-*`. | Set `style="color: red"` on the icon. |
| Use the `size` prop. | Use Tailwind `text-*` to size. |
| Provide `label` when `decorative=false`. | Forget the label. |
| Use `<falcon-angular-icon>` in net-new code. | Continue writing raw `<i class="falcon-icon …">`. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-icon` across `apps/` → **12 occurrences / 5 files**; plus shared use in `libs/falcon/`:

- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` — `name="calendar"` (×3 dates band), `name="ban"`/`"credit-card"`/`"check"` (action icons).
- `apps/admin-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.html` (3) · `apps/management-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.html` (2).
- `apps/admin-console/.../new-wallet-balance/components/wb-icons/wb-icons.component.ts` (3).
- `apps/management-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.html` (3) + `__tests__/standards-drawer.spec.ts` (1).

> The icon **FONT CLASS** (`<i class="falcon-icon falcon-icon-X">`) remains far more widespread than the wrapper (settings-tab buttons, drawer footers, etc.) — migrating those is the open adoption gap (GAPS_AND_UPGRADES P0).
> **Drift correction:** the prior Wave-7 sweep reported **0** wrapper consumers. That is stale — comm-mkt-view + wallet/new-wallet adopted it (same correction class as B10 status-badge/tag/card).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11). Examples 1-2 confirmed verbatim against comm-mkt-card.component.ts. Consumer Sweep re-run: 12 wrapper occurrences across 5 app files + comm-mkt-view in `libs/falcon`. Prior "0 consumers" corrected.
