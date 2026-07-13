# falcon-info-card — USAGE

## Real usage examples (active codebase)

### Example 1 — Templates details: 4-column grid + projected non-text cells (admin & mgmt)

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:82-110` (identical in mgmt):

```html
<!-- Info card — shared <falcon-info-card> (header + 4-col grid chrome).
     Plain fields are data-fed via [fields]; the Status chip + full-width
     Shared-With multi-select are non-text → projected as <ng-content> cells. -->
<falcon-info-card
  class="px-5"
  [title]="'templates.details.title' | translate"
  [fields]="infoFields(tpl)"
  [columns]="4">

  <!-- Status — shared <falcon-status-chip>, wrapped to match the grid cell -->
  <div class="flex flex-col gap-1">
    <span class="text-2xs text-falcon-neutral-500 dark:text-falcon-neutral-400">
      {{ 'templates.details.fields.status' | translate }}
    </span>
    <falcon-status-chip [status]="tpl.status" variant="filled" />
  </div>
  <!-- … Falcon Status chip + Shared-With multi-select projected similarly … -->
</falcon-info-card>
```

`[CODE]` The `[fields]` builder (`templates-details.component.ts:189-213`) shows the canonical pattern — **translation + formatting happen in the TS**, the component receives plain strings:

```ts
protected infoFields(tpl: Template): FalconInfoCardField[] {
  const t = (k: string): string => this.i18n.translate(k);
  return [
    { label: t('templates.details.fields.templateName'), value: tpl.name },
    { label: t('templates.details.fields.templateId'),   value: tpl.id },
    { label: t('templates.details.fields.language'),     value: tpl.language },
    { label: t('templates.details.fields.creationDate'),
      value: `${tpl.creationDate} · ${tpl.creationTime}` },   // pre-formatted
    { label: t('templates.details.fields.subCategory'),  value: tpl.subCategory ?? '---' },
    // … ~14 fields total …
  ];
}
```

> Note `[title]` here IS piped through `| translate` in the template (html:84) — that also produces a resolved string before it reaches the component. Either approach works; the rule is "the component receives an already-resolved string."

### Example 2 — Templates wizard Step 3: 2-column data-only review (admin & mgmt)

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step3-share-submit.component.html:8-13` (identical in mgmt):

```html
<div class="bg-falcon-neutral-50 px-7 pb-6 pt-4 flex flex-col gap-3 rounded-md">
  <falcon-info-card
    [title]="reviewTitle()"
    [fields]="reviewFields()"
    [columns]="2" />
  <!-- + a policy-readiness note below -->
</div>
```

`[CODE]` `reviewTitle()` / `reviewFields()` are signals on the step (`step3-share-submit.component.ts:51` "Read-only review of Steps 1-2 for the shared `<falcon-info-card>`"). No projected cells here — a pure data-only review card.

## Recommended usage for NEW Angular pages

```ts
import { FalconInfoCardComponent, type FalconInfoCardField } from '@falcon';

@Component({
  selector: 'app-entity-details',
  imports: [FalconInfoCardComponent],
  template: `
    <falcon-info-card
      [title]="title()"
      [fields]="fields()"
      [columns]="3" />
  `,
})
export class EntityDetailsComponent {
  private readonly i18n = inject(TranslateService);
  readonly title = computed(() => this.i18n.translate('entity.details.title'));
  readonly fields = computed<FalconInfoCardField[]>(() => [
    { label: this.i18n.translate('entity.fields.name'), value: this.entity().name },
    { label: this.i18n.translate('entity.fields.note'), value: this.entity().note, fullWidth: true },
  ]);
}
```

For a mix of plain + non-text cells, project the non-text ones, wrapped to match the grid cell:

```html
<falcon-info-card [title]="title()" [fields]="fields()" [columns]="4">
  <div class="flex flex-col gap-1">
    <span class="text-2xs text-falcon-neutral-500 dark:text-falcon-neutral-400">{{ 'fields.status' | translate }}</span>
    <falcon-status-chip [status]="status()" variant="filled" />
  </div>
</falcon-info-card>
```

## Field-builder rules

- `[CODE]` **Translate/format in the TS** (or pipe `[title]` in the template). The component does NOT translate — pass resolved strings (`templates-details.component.ts:190` `const t = (k) => this.i18n.translate(k)`).
- `[CODE]` **Unique labels per card** — `@for` tracks `f.label` (html:17). Duplicate labels break tracking.
- `[CODE]` **Use `fullWidth: true`** for long values (addresses, notes) that should span all columns (→ `col-span-full`, html:18).
- `[CODE]` **Wrap each projected cell** in `<div class="flex flex-col gap-1">` + a `text-2xs text-falcon-neutral-500` label `<span>` to match the plain-field look (ts:11-17 + the live templates-details cells).

## Choosing `columns`

| Field count / context | `columns` |
|---|---|
| Dense details view (many short fields) | `4` (the templates-details default) |
| Wizard review / fewer fields | `2` (the step3 review) |
| Medium | `3` |

> Below the `lg` breakpoint the grid always collapses to 1 (mobile) / 2 (small) columns regardless of `columns` (ts:54-62) — so `columns` only sets the wide-screen layout.

## Tailwind-only / token override

`[CODE]` No token file, no `wrapperClass`/`headerClass` inputs. Layout utilities (e.g. `class="px-5"` as in templates-details) flow to the host `block` element. The card chrome (border, radius, header bar) is fixed inline Tailwind; deeper customization requires a token contract (GAP G6). Do NOT add consumer CSS targeting the inner card.

## Do / Don't

| Do | Don't |
|---|---|
| Build `[fields]` with translation/formatting done in TS. | Pass i18n keys as `value`/`label`/`title` (no internal translate). |
| Project non-text cells wrapped to match the grid. | Drop a bare `<falcon-status-chip>` as `<ng-content>` (no cell layout/label). |
| Use unique field labels per card. | Reuse a label twice in one card (breaks `track`). |
| Use `fullWidth` for long values. | Stretch a long value across a normal cell (clips/awkward). |
| Use it for read-only details/review. | Use it to edit (no CVA / no inputs). |
| Use `<falcon-node-details-section>` for an avatar+name header. | Misuse info-card as a header (it has no avatar/actions). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-info-card[\s>]` across `apps/` returned **4 render sites**; across `libs/falcon/` **0** (only the component's own source). TS imports of `FalconInfoCardComponent`: 4 (templates-details + step3-share-submit in both apps).

Full render list:
- `apps/admin-console/.../templates-page/components/templates-details/templates-details.component.html:82` (4-col + projected chips/multi-select)
- `apps/admin-console/.../templates-page/components/templates-wizard/steps/step3-share-submit.component.html:9` (2-col review)
- `apps/management-console/.../templates-page/components/templates-details/templates-details.component.html:82`
- `apps/management-console/.../templates-page/components/templates-wizard/steps/step3-share-submit.component.html:9`

> `[INFERRED]` Adoption is Templates-only because the details/review-card pattern is currently unique to the Templates feature. The component is generic enough that any future "entity details" or "wizard review" surface SHOULD reuse it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Example 1 (4-col + projected cells + `infoFields()` builder) and Example 2 (2-col review) confirmed against live source. Consumer Sweep re-run (`<falcon-info-card[\s>]` → 4 app render sites, 0 in `libs/falcon`).
