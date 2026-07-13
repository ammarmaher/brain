# falcon-status-chip — USAGE

## Real usage examples (active codebase)

### Example 1 — Filled status pill inside a data-table cell

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html:215-222`:

```html
<!-- *** Status pill — shared <falcon-status-chip> from @falcon. *** -->
<ng-template falconDataTableCell="status" let-row="row">
  @if (row) {
    <falcon-status-chip
      [status]="row.status"
      variant="filled" />
  }
</ng-template>
```

The chip is projected into a `<falcon-angular-data-table>` cell template via the `falconDataTableCell` directive. `row.status` is typed `FalconStatusChipStatus`.

### Example 2 — Bare italic status text for a maker/checker sub-line (no dot)

`[CODE]` `templates-list.component.html:226-240`:

```html
<!-- *** Checker L1 — name (top) + italic status text via <falcon-status-chip variant="text">. *** -->
<ng-template falconDataTableCell="checker1" let-row="row">
  @if (row) {
    @if (row.checker1; as c) {
      <span class="text-falcon-neutral-900 dark:text-falcon-neutral-0">{{ c.name }}</span>
      <falcon-status-chip
        [status]="c.status"
        variant="text"
        [showDot]="false" />
    }
  }
</ng-template>
```

`variant="text"` + `[showDot]="false"` gives a compact italic colored status under the name — no pill chrome.

### Example 3 — Domain-specific label override via `[labelKey]`

`[CODE]` `templates-list.component.html:335-340`:

```html
<ng-template falconDataTableCell="falconStatus" let-row="row">
  @if (row) {
    <falcon-status-chip
      [status]="falconChipColor(row)"
      [labelKey]="falconChipLabelKey(row)"
      variant="filled" />
  }
</ng-template>
```

`falconChipColor(row)` maps the domain status to one of the six `FalconStatusChipStatus` color buckets; `falconChipLabelKey(row)` supplies the i18n key — so the same chip shows a domain-specific word in the right color family.

## Recommended usage for NEW Angular pages

```html
<falcon-status-chip [status]="row.status" />
```

Defaults are tuned for table cells: `variant='filled'`, `showDot=true`, `size='md'`, `labelKey=null` (uses the per-status default key). For a compact inline sub-line, use:

```html
<falcon-status-chip [status]="row.status" variant="text" [showDot]="false" size="sm" />
```

> **Before reaching for this chip, check the status vocabulary.** If your status is an account/user lifecycle state (`active`/`suspended`/`locked`/`inactive`/`paid`/`expired`/`disabled`), use `<falcon-angular-status-badge>` — `falcon-status-chip` only knows the six templates-domain statuses. See `RECOGNITION.md`.

## Reactive Forms

N/A — not a form control. The chip displays a value; it never binds one.

## ngModel

N/A — display-only.

## Tailwind-only

`[CODE]` The chip IS Tailwind-only — its classes are computed Tailwind utility strings (`filledClasses()` / `textClasses()` / `dotClasses()`). For host-side layout (alignment inside a cell), add utilities via the host `class=`:

```html
<falcon-status-chip class="ms-2" [status]="row.status" />
```

There is **no `wrapperClass` / `inputClass` input** — host `class=` is the only utility hook (the host is `inline-flex`).

## Token usage (per-instance override pattern)

**Not supported.** `[CODE]` Unlike the gold `falcon-input` (which exposes `--falcon-input-*` tokens overridable per-instance), `falcon-status-chip` has **no token file** and resolves color by reading hardcoded `bg-falcon-*` / `text-falcon-*` utilities from `STATUS_TOKENS`. To change a status color you must edit the record (a shared change affecting every consumer) — there is no `.brand-chip { --falcon-status-chip-* }` pattern (G2). Do NOT try to recolor via arbitrary host utilities (`bg-…` on the host won't reach the inner pill `<span>`).

## Do / Don't

| Do | Don't |
|---|---|
| Map your domain status into one of the six `FalconStatusChipStatus` buckets upstream. | Pass an arbitrary string to `[status]` — it is a strict union; unknown values won't compile / won't color. |
| Use `variant="text"` + `[showDot]="false"` for dense sub-lines. | Use a `filled` pill inside an already-busy cell where text suffices. |
| Override the word with `[labelKey]` (an i18n key). | Pass an already-translated string to `[labelKey]`. |
| Use `<falcon-angular-status-badge>` for account/user lifecycle states. | Force account statuses through this chip — wrong vocabulary (G1). |
| Add layout utilities via host `class=`. | Try to recolor via host `bg-*` utilities or expect a token override. |
| Use `@if`/`@for` around the chip in templates. | Use `*ngIf`/`*ngFor` (project rule). |

## Import requirements (standalone component)

```ts
import { FalconStatusChipComponent } from '@falcon';

@Component({
  standalone: true,
  imports: [FalconStatusChipComponent /* + FalconAngularDataTableComponent etc. */],
  ...
})
```

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-status-chip[\s>]` across the repo → **28 occurrences / 8 files**. Element usages live in 4 HTML templates; the other 4 hits are TS imports of `FalconStatusChipComponent` / the `FalconStatusChipStatus` type. Full list:

- `apps/admin-console/.../templates-page/components/templates-list.component.html` (6 occ) + `.../templates-list.component.ts` (import).
- `apps/admin-console/.../templates-page/components/templates-details/templates-details.component.html` (6 occ) + `.../templates-details.component.ts` (import).
- `apps/management-console/.../templates-page/components/templates-list.component.html` (6 occ) + `.../templates-list.component.ts` (import).
- `apps/management-console/.../templates-page/components/templates-details/templates-details.component.html` (6 occ) + `.../templates-details.component.ts` (import).
- `apps/{admin,management}-console/.../templates-page/models/template.model.ts` — `FalconStatusChipStatus` type reference (non-render).

> All element consumers are the Templates list + details pages, mirrored across both consoles. The component is **templates-scoped despite its "platform SoT" header comment** — no account/user/wallet page consumes it (those use `<falcon-status-badge>`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Examples 1-3 quoted verbatim from `templates-list.component.html` (lines cited). Consumer sweep re-run (`<falcon-status-chip[\s>]` → 28 occ / 8 files; 4 HTML + 4 TS). The "no token override / no wrapperClass" constraints 🟢 confirmed from the component source (no token file, no such inputs).
