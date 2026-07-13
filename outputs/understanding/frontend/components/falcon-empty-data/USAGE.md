# falcon-empty-data — USAGE

## Real usage examples (active codebase)

### Example 1 — Data-table auto-mount via `[emptyData]` shorthand (the dominant pattern)

`[CODE]` `apps/admin-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.ts:124-128` + its `.html`:

```ts
/*** When users.length === 0 the data-table auto-mounts <falcon-empty-data> with this
 *** config (translated labels). showAction / showInfo are hard-false (message-only) and
 *** the action label/size/border are still supplied for when a flow opts the CTA on. ***/
readonly emptyData: FalconEmptyDataConfig = {
  iconKey: 'users',
  titleText: this.t('hierarchy.list.empty.title'),
  body: this.t('hierarchy.list.empty.body'),
  showAction: false,
  showInfo: false,
};
```

```html
<falcon-angular-data-table
  [data]="users()"
  [columns]="cols"
  [emptyData]="emptyData"
  (emptyDataAction)="onAddUser()">
</falcon-angular-data-table>
```

> The table mounts `<falcon-angular-empty-data mode="table">` into its Stencil empty slot only when `data.length === 0` AND no `*falconDataTableEmpty` template is projected (`[CODE]` falcon-data-table.component.ts:1056-1083). The legacy projected template still takes precedence (`[CODE]` :1020).

### Example 2 — Direct render, dual-mode (showcase)

`[CODE]` `apps/host-shell/.../falcon-ui-showcase/library-section/empty-data-section.component.ts:109-112` — the ONLY direct `<falcon-angular-empty-data>` render in the codebase:

```html
<!-- Wave 19 (16th iter): canonical Angular wrapper <falcon-angular-empty-data> -->
<!-- switches between <falcon-empty-data-tw> (Light DOM) and <falcon-empty-data> -->
<falcon-angular-empty-data
  [iconKey]="iconKey()"
  [titleText]="titleText()"
  [body]="bodyText()"
  [showAction]="showAction()"
  [actionLabel]="actionLabel()"
  [actionSize]="actionSize()"
  [actionBorder]="actionBorder()"
  [showInfo]="showInfo()"
  [infoText]="infoText()"
  [mode]="mode()"
  [containerFit]="containerFit()"
  [useTailwind]="useTailwind()"
  (actionClick)="onAction($event)">
</falcon-angular-empty-data>
```

### Example 3 — Page-level hero zero-state

```html
<falcon-angular-empty-data
  mode="page"
  containerFit="mini"
  iconKey="folder"
  [titleText]="'clients.empty.title' | translate"
  [body]="'clients.empty.body' | translate"
  [showAction]="true"
  [actionLabel]="'clients.empty.addClient' | translate"
  actionSize="md"
  actionBorder="solid"
  (actionClick)="openAddClient()">
</falcon-angular-empty-data>
```

## Recommended usage for NEW Angular pages

- **Inside a table?** Always prefer the `[emptyData]="config"` shorthand on `<falcon-angular-data-table>` — let the table auto-mount + tear down the component. Wire `(emptyDataAction)` for the CTA.
- **Standalone page zero-state?** Render `<falcon-angular-empty-data mode="page">` directly. Pick `containerFit` (`fill`/`mini`/`fit`).
- **Message-only (no CTA)?** Leave `showAction`/`showInfo` at their config defaults or set `false`.
- Defaults are tuned for tables: `useTailwind=true`, `mode='table'`, `containerFit='fill'`, `iconKey='users'`, `cardBackground/glossyGradient/iconBackground/coloredIcon/iconOpacityOn=true`, `showAction/showInfo=false`.

## App-level default copy (config service)

`[CODE]` Unbound inputs hydrate from `FalconConfigurationService.resolveEmptyData()` (`falcon-defaults.json` + `registerEmptyDataOverride()`). To change the default empty copy/icon platform-wide, edit `falcon-defaults.json` or call `registerEmptyDataOverride({ titleText, body, iconKey })` at app bootstrap — do NOT hardcode per page. Per-instance `[input]` always overrides the config default.

## Tailwind-only usage

There are no `wrapperClass`/`inputClass` inputs on this wrapper (unlike `falcon-input`/`falcon-filter-panel`). For host-side layout utilities, apply them on the host element via `class=`:

```html
<falcon-angular-empty-data class="my-8" [titleText]="'…'" />
```

For visual changes, override tokens (see TOKENS.md) — never hand-roll Tailwind colors.

## Token usage (per-instance override pattern)

```css
.dashboard-empty {
  --falcon-empty-data-card-radius: 12px;
  --falcon-empty-data-glyph-bg: var(--color-falcon-teal-50);
  --falcon-empty-data-btn-bg: var(--color-falcon-teal-700);
}
```

> Both Stencil variants resolve `--falcon-empty-data-*` through the `:where(falcon-empty-data, falcon-empty-data-tw, falcon-empty-data-shadow, .falcon-empty-data, [data-falcon-empty-data])` selector chain (`[CODE]` empty-data.tokens.css:24-27). Shadow inherits the override through the boundary; the Light variant reads the same vars (some inline).

## Do / Don't

| Do | Don't |
|---|---|
| Use `[emptyData]` config on the data-table for table empties. | Project a `*falconDataTableEmpty` template AND set `[emptyData]` (the template wins, the config is ignored). |
| Bind `(actionClick)` (direct) / `(emptyDataAction)` (via table) for the CTA. | Try to project a custom `<falcon-angular-button>` — there is no action slot (GAP G2). |
| Set default copy/icon via the config service. | Hardcode the same "No data found" string in every feature. |
| Override visuals via `--falcon-empty-data-*` tokens. | Hardcode hex/px inline in consumer CSS. |
| Use `mode="page"` for page heroes, `mode="table"` (default) inside tables. | Use this for a minimal placeholder — that's `<falcon-empty-state>`. |
| Leave the wrapper's mixed `[prop]`/`[attr.*]` binding style alone. | "Fix" the boolean bindings to `[attr.*]` — breaks Stencil defaults. |

## Bad usage to avoid

- **Do NOT** use this for a loading state — use the table `[loading]` skeleton.
- **Do NOT** expect an `error` look — `context.feedbackLevel='destructive'` changes only `role`/`aria-live`, not the visual (no red error variant — GAP G5).
- **Do NOT** rely on `context.dismissable` to show a close button — it's a data-hook only, no dismiss UI renders (GAP G4).
- **Do NOT** import `FalconAngularEmptyDataComponent` AND set `CUSTOM_ELEMENTS_SCHEMA` on the host — the wrapper declares it internally.
- **Do NOT** use `*ngIf` / `*ngFor` around it — use `@if` / `@for` per project rule.

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-empty-data` across `apps/` → **1 file** (direct render). grep the `[emptyData]` shorthand config → **9 files**. Plus **1** re-export in `libs/falcon`.

**Direct render (1):**
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts`

**Via `<falcon-angular-data-table [emptyData]>` config (9):**
- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html` (config in the `.ts`)
- `apps/{admin,management}-console/.../templates-page/components/templates-list.component.html` (config in the `.ts`)
- `apps/{admin,management}-console/.../contracts-cost-management/contracts-cost-management.component.html`
- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html`
- `apps/host-shell/.../falcon-ui-showcase/library-section/empty-data-section.component.ts` (also drives a `[emptyData]` binding in its "Inside table" demo)

**Re-export (1, non-render):**
- `libs/falcon/src/shared-ui/index.ts:220-227` — `export { FalconAngularEmptyDataComponent }` + `FalconEmptyDataConfig`/`IconKey`/`Mode`/`ActionBorder`/`ActionSize` types.

> `[INFERRED]` Real adoption is far higher than the 1 direct render suggests — the `[emptyData]` shorthand is the canonical path, so every data-table that sets it renders this component. The component is **well-adopted**, almost entirely indirectly.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12, NEW). Example 1/2 confirmed against org-hierarchy-page-menu.component.ts:124-128 + empty-data-section.component.ts:109-112; data-table auto-mount confirmed at falcon-data-table.component.ts:1056-1083; Consumer Sweep (1 direct + 9 config + 1 re-export) grep-verified.
