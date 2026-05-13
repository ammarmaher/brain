# Falcon Wrapper & Render-Path Report

*** Brain SK canonical — Agent 7 merge, 2026-05-13 ***
*** Stencil Shadow ↔ Stencil Light ↔ Angular wrapper architecture ***

## 1. The dual-render pattern

Falcon UI ships every component in TWO Stencil tags backed by ONE Angular wrapper:

| Layer | Tag | Encapsulation | Why |
|---|---|---|---|
| **Stencil Shadow** | `<falcon-X>` (`shadow: true`) | Shadow DOM with scoped CSS | Cross-framework default. Encapsulated styles + slots. Studio-mutable tokens cascade through. |
| **Stencil Light** | `<falcon-X-tw>` (`shadow: false`) | Light DOM | Consumer's Tailwind v4 utilities cascade in. Same `falconXClasses()` helpers as Shadow. |
| **Angular wrapper** | `<falcon-angular-X>` | n/a (Angular component) | Bridges Stencil events to Angular `@Output`, mirrors `@Input`s, registers `ControlValueAccessor` where applicable. |

The two Stencil tags are paired — every modern Falcon UI core component has both. The Angular wrapper template conditionally renders one or the other based on `useTailwind` input.

## 2. The `useTailwind` toggle convention

Every dual-render Angular wrapper exposes:

```ts
@Input() useTailwind = true;  // default-on
```

In the template:

```html
@if (useTailwind) {
  <falcon-X-tw
    [class]="classes()"
    [value]="value()"
    (falcon-change)="onChange($event)"
  />
} @else {
  <falcon-X
    [value]="value()"
    [size]="size()"
    [state]="state()"
    (falcon-change)="onChange($event)"
  />
}
```

**Default is Light DOM** (`useTailwind=true`). Consumer Tailwind utilities flow into the component; Tailwind helpers from `libs/falcon-ui-core/src/tailwind/` produce the class string.

**Shadow path used for:**
- Components needing slot-based prefix/suffix (`<falcon-angular-input>` prefix/suffix slots — Shadow only — UP gap #18).
- Cross-framework consumers (React + Vue auto-emitted wrappers).
- Scoped-style consumers who can't risk Tailwind cascade conflicts.

## 3. The `falconXClasses()` helper pattern

Source: `libs/falcon-ui-core/src/tailwind/falcon-X-tailwind-classes.ts` per component (46 helpers + 1 barrel).

Each helper exports `getFalconXClasses(props) => string` — the SAME class string generator used by:

1. The Stencil Light tag (`<falcon-X-tw>`) during render.
2. The Angular wrapper's `classes()` method passed to Light tag's `[class]` binding.
3. The auto-generated React wrapper.
4. The auto-generated Vue 3 wrapper.

This is the cross-framework consistency hinge: every framework binds the same class output to the same rendered DOM.

```ts
// libs/falcon-ui-core/src/tailwind/falcon-input-tailwind-classes.ts (excerpt)
export function getFalconInputContainerClasses(props: FalconInputClassProps): string {
  return [
    'falcon-input',
    `falcon-input-${props.size}`,
    `falcon-input-${props.state}`,
    props.disabled && 'falcon-input--disabled',
    // ... 30+ conditional classes
  ].filter(Boolean).join(' ');
}
```

These class strings reference Tailwind utilities that map to component tokens via `@theme`. The helper itself is pure — no DOM, no signals — so it works identically inside Stencil JSX, Angular template binding, and React/Vue auto-emitted wrappers.

### Barrel coverage gaps

`libs/falcon-ui-core/src/tailwind/index.ts` re-exports 43 helpers. **3 helpers are NOT in the barrel** (Agent 5 finding): `menu-tailwind-classes.ts`, `single-uploader-tailwind-classes.ts`, `drawer-tailwind-classes.ts` — reachable only by deep import. UP-05 plus UP-07 component-token shape lint would catch and fix.

## 4. `CUSTOM_ELEMENTS_SCHEMA` requirement

Every Angular wrapper that renders Stencil custom elements must register the schema:

```ts
@Component({
  selector: 'falcon-angular-input',
  standalone: true,
  imports: [...],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './falcon-input.component.html',
  styleUrl: './falcon-input.component.css',
})
export class FalconAngularInputComponent implements ControlValueAccessor { ... }
```

Without `CUSTOM_ELEMENTS_SCHEMA` Angular treats `<falcon-X>` and `<falcon-X-tw>` as unknown elements and either errors out (strict mode) or silently drops binding. Every wrapper sampled has this schema.

## 5. Stencil slots vs Angular ng-template projection

Stencil components use HTML `<slot>` for content projection (browser-native):

```tsx
// libs/falcon-ui-core/src/components/falcon-button/falcon-button.tsx (excerpt)
<button class={classes}>
  <slot name="icon-start" />
  <span class="falcon-button__label">{this.label}</span>
  <slot name="icon-end" />
</button>
```

Angular wrapper template projects content into the slot:

```html
<!-- libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.html -->
<falcon-button-tw [class]="classes()">
  <ng-content select="[slot=icon-start]" />
  <ng-content />
  <ng-content select="[slot=icon-end]" />
</falcon-button-tw>
```

Consumer usage:

```html
<falcon-angular-button label="Save">
  <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
</falcon-angular-button>
```

### Slot inventory across the library

| Component | Slots | Notes |
|---|---|---|
| button | `icon-start`, `icon-end` | Plus default for label override |
| card | `header`, `default`, `footer` | Standard 3-slot card |
| drawer | `header`, `default`, `footer` | Standard 3-slot drawer |
| dialog | `header`, `default`, `footer` | Standard 3-slot dialog |
| tabs | `panel-{value}` per tab + actions (currently via MutationObserver — UP-3-01 to replace with `header-end` slot) | Per-panel content |
| wizard | `step-{i}` per step + `footer-extra` | Multi-step |
| input | `prefix`, `suffix` (Shadow only!) | Light path slot gap — UP-18 |
| empty-state | `icon`, `title`, `description`, `actions` | All optional |
| menu | `trigger`, `default` (custom items) | Trigger override |
| tooltip | `trigger` | Trigger element |
| filter-panel | `default` (custom filter renderers) | Compose-friendly |
| badge | default (ng-content for label override) | Verified in wrapper template |
| accordion | per-item `content-{value}` (no `header-{value}` slot — gap UP-3-15) | One-direction projection |
| popup | None (4 canonical variants only) | Add `'custom'` variant (UC-W03) |
| notification | None | Add slot for rich body |
| tree | None (row + actions slot gap — UC-W01) | P0 upgrade |
| dropdown | `options` (Shadow only) | Light path gap — see U1 |

## 6. The `FalconDataTableCellDirective` deep-dive (the only Strategy E exemplar)

Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts`

```ts
@Directive({
  selector: '[falconDataTableCell]',
  standalone: true,
})
export class FalconDataTableCellDirective {
  @Input('falconDataTableCell') field!: string;
  readonly template = inject(TemplateRef);
}
```

In the wrapper component:

```ts
export class FalconAngularDataTableComponent {
  @ContentChildren(FalconDataTableCellDirective)
  cellTemplates!: QueryList<FalconDataTableCellDirective>;

  // Listen for the Stencil core event emitted when mount-points are ready
  @HostListener('falcon-cells-mounted', ['$event'])
  onCellsMounted(event: CustomEvent<FalconCellsMountedDetail>) {
    for (const mount of event.detail.mounts) {
      const directive = this.cellTemplates.find(d => d.field === mount.field);
      if (!directive) continue;

      // Create or reuse the embedded view, append to the mount-point element
      const viewRef = directive.template.createEmbeddedView({
        $implicit: mount.row,
        index: mount.rowIndex,
      });
      viewRef.detectChanges();
      mount.element.replaceChildren(...viewRef.rootNodes);
      this.activeViews.set(mount.id, viewRef);
    }
  }
}
```

Consumer usage:

```html
<falcon-angular-data-table [data]="rows" [columns]="columns">
  <ng-template [falconDataTableCell]="'status'" let-row>
    <falcon-angular-status-badge [severity]="row.status" />
  </ng-template>
  
  <ng-template [falconDataTableCell]="'actions'" let-row>
    <falcon-angular-button label="Edit" size="sm" (falconClick)="edit(row)" />
    <falcon-angular-button label="Delete" severity="danger" size="sm" (falconClick)="delete(row)" />
  </ng-template>
</falcon-angular-data-table>
```

Strategy E is the standout reusability pattern in the library. Replicate for tree-table (UC-P1-01), tree (UC-W01), dropdown / multi-select / combobox per-option templates (P1-01), tabs panelHeader/panelFooter (P2-22), data-table global-filter (UC-P2-10).

## 7. React + Vue wrapper auto-emission

### React (`stencil.config.ts` reactOutputTarget)

Source: `libs/falcon-ui-core/stencil.config.ts:44-47`:

```ts
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  // ...
  outputTargets: [
    { type: 'dist' },
    { type: 'dist-custom-elements' },
    { type: 'docs-readme' },
    reactOutputTarget({
      outDir: '../falcon-ui-react/src/',
    }),
  ],
};
```

Result: every `<falcon-X>` Stencil tag automatically gets a React binding at `libs/falcon-ui-react/src/components/FalconX.ts`:

```tsx
// Auto-generated
export const FalconInput: ReactComponent<JSX.FalconInput> = createReactComponent('falcon-input');
```

Consumer (React):

```tsx
import { FalconInput } from '@falcon/ui-react';
<FalconInput value="hello" onFalconChange={(e) => ...} />
```

### Vue 3 wrappers (custom script)

Source: `libs/falcon-ui-core/generate-vue-proxies.cjs` — a Node script that walks `dist-custom-elements/` output, parses each `<falcon-X>` definition, and emits a Vue 3 component proxy at `libs/falcon-ui-vue/src/components/FalconX.ts`:

```ts
// Auto-generated
export const FalconInput = defineCustomElement('falcon-input', {
  props: { ... },
  emits: ['falcon-change', 'falcon-blur', ...]
});
```

Run via `npm run generate-vue-proxies` (and as part of the Stencil build pipeline).

### Why no React + Vue wrapper for Angular-only components

The 4 Angular-only components (`<falcon-angular-popup>`, `<falcon-angular-notification>`, `<falcon-angular-message-host>`, plus 8 legacy bespoke) have no Stencil core — so no React or Vue wrapper. Memory note `feedback_angular_only_scope.md` (LOCKED 2026-05-08): "Falcon UI Wave 3+ targets Angular wrapper only. SKIP React + Vue work for now."

## 8. The 4 wrapper categories

### Category A — Dual-render (the majority — 45 of 49 wrappers)
- Shadow + Light Stencil siblings.
- `useTailwind` toggle.
- CVA where applicable.
- Cross-framework (React + Vue auto-emitted).

Examples: input, dropdown, multi-select, textarea, password, button, card, dialog, drawer, tabs, table, tree, paginator, accordion, etc.

### Category B — Angular-only composers (4 wrappers)
- No Stencil core.
- Composes other Falcon Angular wrappers.
- Lives only in `libs/falcon-ui-core/src/angular-wrapper/components/`.

| Wrapper | Composes | Why no Stencil core |
|---|---|---|
| `<falcon-angular-popup>` | Hand-rolled modal (should compose `<falcon-angular-dialog>` — UP-3-02) | Variant-driven (`error/delete/unsaved/save`) — too app-specific for Stencil |
| `<falcon-angular-notification>` | None directly; composed by `<falcon-angular-notification-stack>` | Modern signal-based — wraps notification primitives |
| `<falcon-angular-notification-stack>` | `<falcon-angular-notification>` | Service-driven queue |
| `<falcon-angular-message-host>` | `<falcon-angular-toast>` queue | PrimeNG-compat substrate via `FalconMessageService` |

### Category C — Legacy bespoke (8 components under `libs/falcon/src/shared-ui/`)
- Pre-Stencil Angular components.
- SCSS rule violations (UP-03 hardening target).
- Migration targets — see relationship map § 6 / 7.

Components: `falcon-calendar` (facade), `falcon-form-field`, `falcon-mobile-number` (facade), `falcon-multiselect` (stub), `falcon-photo-uploader`, `falcon-stepper` (legacy bespoke with `FalconStepDirective` + `FalconStepperFooterDirective`), `falcon-tree-panel`, `send-credentials-popup`.

### Category D — Stencil-direct (1 component)
- No Angular wrapper. Used directly as the Stencil tag from Angular templates.

| Component | Why no Angular wrapper |
|---|---|
| `<falcon-organization-hierarchy-tree-tw>` | Light-DOM only, no Shadow companion. Bespoke org-hierarchy tree. Promotion candidate (UC-P1-05) for paired Shadow + Light + Angular wrapper. |

### Plus: 1 TypeScript alias
- `<falcon-angular-select>` — pure `index.ts` re-export of `<falcon-angular-dropdown>`. Soft-deprecate or document alias purpose.

## 9. The Angular wrapper's role (sample anatomy)

Reference implementation: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts`.

```ts
@Component({
  selector: 'falcon-angular-input',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './falcon-input.component.html',
  styleUrl: './falcon-input.component.css',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularInputComponent), multi: true },
  ],
})
export class FalconAngularInputComponent implements ControlValueAccessor {
  // --- 27 props mirror Stencil component ---
  @Input() value = '';
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' = 'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() state: 'default' | 'error' | 'success' | 'warning' = 'default';
  @Input() variant: 'form' | 'search' | 'grid' = 'form';
  @Input() appearance: 'default' | 'filled' | 'ghost' = 'default';
  @Input() disabled = false;
  // ... feature toggles, naming inputs, autocomplete, etc.

  // --- Angular-only inputs ---
  @Input() useTailwind = true;     // toggles Shadow vs Light render
  @Input() wrapperClass?: string;  // adds host class
  @Input() inputClass?: string;
  @Input() labelClass?: string;

  // --- 5 Stencil events re-emitted as Angular outputs ---
  @Output() falconInput = new EventEmitter<string>();
  @Output() falconChange = new EventEmitter<string>();
  @Output() falconFocus = new EventEmitter<FocusEvent>();
  @Output() falconBlur = new EventEmitter<FocusEvent>();
  @Output() falconClear = new EventEmitter<void>();

  // --- Internal signal state ---
  private _value = signal('');
  private _disabled = signal(false);

  // --- CVA implementation ---
  writeValue(v: string): void { this._value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled.set(isDisabled); }

  private onChange = (_: string) => {};
  private onTouched = () => {};

  // --- Methods (not computed) — comment in source explains why:
  // Methods re-run on every CD cycle (which OnPush triggers when @Input ref changes).
  // computed() would only track signal deps, not @Input props.
  classes(): string {
    return getFalconInputContainerClasses({
      size: this.size,
      state: this.state,
      // ...
    });
  }
}
```

### Five jobs of every Angular wrapper

1. **Mirror Stencil props as `@Input`**. Plus Angular-only inputs like `useTailwind`, `wrapperClass`.
2. **Re-emit Stencil events as `@Output`**. (Gap on textarea — U10. Audit recommended.)
3. **Register `ControlValueAccessor`** for form controls. (Gap on calendar / date-picker / search-input / grid-input — U4.)
4. **Compute Tailwind class string via `falconXClasses()` helper** for the Light path.
5. **Provide method proxies for `setFocus()` / `clear()` / `openPanel()` / `closePanel()`** (gap — U3 method-proxy harmonization).

### Why methods, not `computed()` for class strings

Comment in `falcon-input.component.ts:106-108`:

```ts
// Methods (not computed) drive class strings on purpose:
// methods re-run on every change-detection cycle (which OnPush triggers when @Input ref changes),
// while computed() would only track signal deps — not @Input ref changes.
```

This is critical for OnPush components reading `@Input` props. Signals + `effect()` + `computed()` would miss `@Input` ref changes; methods called from the template re-execute on every CD pass.

## 10. The Stencil emit pipeline (cross-framework parity)

`libs/falcon-ui-core/stencil.config.ts` declares these output targets:

| Target | Purpose |
|---|---|
| `dist` | Legacy ESM loader (registers custom elements on import). |
| `dist-custom-elements` | Eager-tree-shakeable custom elements. The preferred target for Angular consumers. |
| `docs-readme` | Auto-generates `readme.md` per component folder with Props/Events/Slots tables. |
| `reactOutputTarget` | Emits React wrappers into `libs/falcon-ui-react/src/`. |

PostCSS chain:

| Plugin | Role |
|---|---|
| `postcss-import` | Resolve `@import`, skipping `tailwindcss/*` URLs so Tailwind handles its own. |
| `@tailwindcss/postcss` | Tailwind v4 Oxide native scanner. |
| `autoprefixer` | Browser prefix handling. |

Constraints:
- `taskQueue: 'immediate'` — `writeTask` runs synchronously so `@State` changes drive re-renders even when `document.visibilityState === 'hidden'` (preview / test rigs).
- `maxConcurrentWorkers: 1` — serializes PostCSS workers as a Windows EMFILE workaround.

## 11. Production verified architecture clean

Memory + Agent 6 verification:
- **0** `*ngIf` / `*ngFor` matches across `apps/`.
- **0** PrimeNG imports.
- **0** PrimeIcons `pi pi-*` in feature templates (1 violation in Stencil `<falcon-table>` — P0-03; 4 in uploaders — P0-04).
- **0** direct Zitadel calls. All auth through `auth-api.service.ts` → Identity Gateway.
- **1** raw `style=` attribute (applications-table inline SVG vertical-align).
- **Multiple** Tailwind arbitrary `bg-[#hex]` / `border-[#hex]` / `rounded-[Npx]` in feature templates — P1-41 to sweep.

## 12. The Angular bootstrap to Stencil mount sequence

For host-shell:

1. `main.ts` → `import('./bootstrap')` (async MF boundary).
2. `bootstrap.ts` registers Stencil custom elements: `import { defineCustomElements } from '@falcon/ui-core/loader'; defineCustomElements();`.
3. `await remoteRouteService.reloadRemotes()` — Wave 8 pluggable manifest provider fetches remote routes BEFORE `router.initialNavigation()`.
4. `bootstrapApplication(App, appConfig)` — `app.config.ts` providers: `provideZonelessChangeDetection()`, `provideRouter(appRoutes, withDisabledInitialNavigation())`, `provideHttpClient(withFetch(), withInterceptorsFromDi())`, `provideAnimationsAsync()`, `provideFalconFacades({ ... })`.
5. `router.initialNavigation()` activates the first matching route.

For remote apps (admin-console / management-console):

1. Same flow, simpler — they register `provideFalconFallbackFacades()` for standalone-dev mode (`apps/admin-console/mocks/falcon-fallback.providers.ts`).
2. `loadRemoteModule('admin_console', './admin-console')` is the host-shell-initiated path.

Stencil components are eagerly registered at boot (post-async-boundary) so the first Angular render finds them defined.
