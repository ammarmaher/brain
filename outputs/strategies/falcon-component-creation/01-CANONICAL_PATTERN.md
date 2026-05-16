# 01 — Canonical Pattern

> **Doctrine.** Every Falcon UI component is THREE artefacts backed by ONE token contract.
> Deviating from this pattern requires an explicit RFC + rubric exception.

## 1. The three artefacts

[CODE] [BRAIN-OUT] Verified against `libs/falcon-ui-core/src/components/falcon-empty-state/` (reference 2026-05-14) and `falcon-accordion/` (reference 2026-05-08).

| # | Artefact | Tag | Encapsulation | File path |
|---|---|---|---|---|
| 1 | **Stencil Shadow** | `<falcon-X>` | Shadow DOM (`shadow: true`) | `libs/falcon-ui-core/src/components/falcon-X/falcon-X.tsx` |
| 2 | **Stencil Light / TW** | `<falcon-X-tw>` | Light DOM (`shadow: false`) | `libs/falcon-ui-core/src/components/falcon-X-tw/falcon-X-tw.tsx` |
| 3 | **Angular wrapper** | `<falcon-angular-X>` | n/a (Angular component) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/falcon-X.component.ts` |

Plus the token contract:

| 4 | **Token file** | n/a | CSS `:where()` cascade scope | `libs/falcon-ui-tokens/src/components/X.tokens.css` |

[INFERRED] React + Vue wrappers emit automatically from the Stencil `dist-custom-elements` output target — no manual artefact required (see `07-INTEGRATION_POINTS.md`).

## 2. Per-layer responsibilities

### 2.1 Shadow layer — `<falcon-X>`

[CODE] `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.tsx`

```tsx
@Component({
  tag: 'falcon-X',
  styleUrl: 'falcon-X.css',
  shadow: true,
})
export class FalconX {
  @Prop({ reflect: true }) size: FalconXSize = 'md';
  // ...
  render() {
    return (
      <Host>
        <div class="falcon-X-root" part="root" data-size={this.size}>
          {/* slots, parts, role, aria */}
        </div>
      </Host>
    );
  }
}
```

**Responsibilities:**
- Encapsulated, tokens-only CSS — every visual value via `var(--falcon-X-*)`.
- Scoped class chain: `.falcon-X-{root,header,body,footer,...}`.
- `part="..."` attributes on every named slot owner so callers can pierce shadow.
- `:host { display: block }` (or `inline-block` for inline components).
- ARIA + slots first-class: name slots semantically (`name="action"` not `name="slot1"`).
- Stencil events: `@Event({ eventName: 'falcon-<verb>-<noun>', bubbles: true, composed: true })`.

### 2.2 Light / TW layer — `<falcon-X-tw>`

[CODE] `libs/falcon-ui-core/src/components/falcon-accordion-tw/falcon-accordion-tw.tsx`

```tsx
@Component({
  tag: 'falcon-X-tw',
  shadow: false,
})
export class FalconXTw {
  // SAME Props as <falcon-X>
  // SAME Events as <falcon-X>
  render() {
    return (
      <Host>
        <div class={falconXRootClasses({ size: this.size })}>
          {/* identical structure to Shadow, classes via helper functions */}
        </div>
      </Host>
    );
  }
}
```

**Responsibilities:**
- **No `styleUrl`** — consumer Tailwind v4 utilities cascade in from the host app.
- Class strings sourced from `libs/falcon-ui-core/src/tailwind/X-tailwind-classes.ts` (pure functions).
- **Identical Props/Events to Shadow variant** — types come from the SAME `.types.ts` file.
- **Identical structure to Shadow variant** — same nesting, same `data-*`, same ARIA.
- Pure helpers (utils.ts) imported from the Shadow component dir — never duplicated.

### 2.3 Angular wrapper — `<falcon-angular-X>`

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/falcon-empty-state.component.ts` + `.component.html`

```ts
@Component({
  selector: 'falcon-angular-X',
  standalone: true,
  imports: [],
  templateUrl: './falcon-X.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FalconAngularXComponent implements OnInit {
  @Input() size: FalconXSize = 'md';
  @Input() useTailwind = true;  // default-on
  ngOnInit(): void { void defineFalconTwComponent('falcon-X'); }
}
```

```html
@if (useTailwind) {
  <falcon-X-tw [attr.size]="size" />
} @else {
  <falcon-X [attr.size]="size" />
}
```

**Responsibilities:**
- `selector: 'falcon-angular-X'` — NEVER `falcon-X` (collides with Stencil tag).
- `schemas: [CUSTOM_ELEMENTS_SCHEMA]` — required so Angular doesn't reject `<falcon-X-tw>`.
- `ChangeDetectionStrategy.OnPush` — non-negotiable.
- `ngOnInit() → defineFalconTwComponent('falcon-X')` — registers the `-tw` custom element on demand.
- Template-only render-path switch: `@if (useTailwind) { -tw } @else { shadow }`.
- Mirrors every Stencil `@Prop` as `@Input`, every Stencil `@Event` as `@Output`.
- Forms-aware components additionally implement `ControlValueAccessor` + `NG_VALUE_ACCESSOR` multi-provider.

## 3. Critical contracts

| # | Contract | Source | Why |
|---|---|---|---|
| C1 | Shared `*.types.ts` lives in the **Shadow component dir** — imported by all 3 layers | [CODE] `components/falcon-empty-state/falcon-empty-state.types.ts` imported by `falcon-empty-state-tw.tsx` AND wrapper `.component.ts` | Single source of truth for Props / Events / unions |
| C2 | Token file lives in `libs/falcon-ui-tokens/src/components/X.tokens.css` and is imported by `libs/falcon-ui-tokens/src/index.css` | [CODE] `libs/falcon-ui-tokens/src/index.css` lines 21-67 — every component listed | One import = whole library tokens |
| C3 | Stencil events use `falcon-<verb>-<noun>` kebab-case with `bubbles: true, composed: true` | [CODE] `falcon-accordion.tsx` lines 57-62 | Composed events cross Shadow boundary; consumers don't need to listen on the host |
| C4 | Tag in Stencil = `falcon-X` (no `falcon-angular-` prefix); Angular wrapper selector = `falcon-angular-X` | [CODE] `falcon-empty-state.tsx` tag + `falcon-empty-state.component.ts` selector | Stencil tag is cross-framework; `falcon-angular-` prefix marks the Angular-only consumer surface |
| C5 | Cross-framework via Stencil output targets: `dist-custom-elements` (Angular) + `reactOutputTarget` (React auto-emitted) + Vue proxy script (auto-generated) | [CODE] `stencil.config.ts` lines 27-48 | New components are React/Vue-consumable with zero extra work |
| C6 | Stencil Light tag (`-tw`) is registered **on demand** via `defineFalconTwComponent('falcon-X')` — NEVER eagerly | [CODE] `define-falcon-tw-component.ts` `twLoaders` map | Webpack chunk-splits each `-tw` variant; apps that never use the Shadow render path ship zero Shadow chunks |
| C7 | Token cascade selector chain: `:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])` | [CODE] `empty-state.tokens.css` line 15 | Tokens reach Shadow + Light + Angular host + utility class + data-attr forms — single declaration powers all five surfaces |
| C8 | Angular template uses `@attr.<prop>` binding for Stencil attributes — NEVER `[<prop>]` directly | [CODE] `falcon-empty-state.component.html` lines 6-10 | Stencil Props compile to HTML attributes for primitive types; `[prop]` would attempt Angular property binding which fails for custom elements |
| C9 | Stencil events bind to wrapper outputs via the **kebab-case event name in template** (`(falcon-change)="..."`), and wrapper re-emits as Angular `@Output() falconChange` | [BRAIN-OUT] `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` §9 | Stencil emits kebab; Angular `@Output()` uses camel; binding bridges both |

## 4. Decision tree for component authors

### Q1 — Does my component need internal state beyond props?
- **Yes** → add `@State() ...` fields. Stencil triggers re-render on `@State` set. Reference: `falcon-accordion.tsx:55 (resolvedId)`.
- **No** → all data flows via `@Prop`. Keep the component "controlled" — the consumer owns state.

### Q2 — Does my component need helper functions (computation, key-handling, ID formatting)?
- **Yes** → create `falcon-X.utils.ts` in the Shadow component dir. Pure functions only — no DOM, no Stencil decorators. The Light-TW variant imports the SAME utils.
- **No** → omit. Most simple display components (badge, avatar, status) have no utils.

### Q3 — Does my component need a property that mutates from inside (e.g. expanded list)?
- **Yes** → `@Prop({ mutable: true }) expandedValues: ... = []` AND emit a `falcon-change` event so the consumer can mirror.
- **No** → plain `@Prop()`.

### Q4 — Does the property need to reflect to a host attribute (so CSS can target `:host([size='lg'])`)?
- **Yes** → `@Prop({ reflect: true })`. Required for size / variant / state / mode props that participate in CSS selector matching. Reference: `falcon-empty-state.tsx:24`.
- **No** → plain `@Prop()`.

### Q5 — Does my component need methods callable from Angular (`elementRef.nativeElement.focusFirst()`)?
- **Yes** → `@Method() async focusFirst(): Promise<void> { ... }`. ALL Stencil methods must be `async`. Reference: `falcon-accordion.tsx:79-90`.
- **No** → keep behavior internal.

### Q6 — Does my component participate in Angular forms?
- **Yes** → wrapper implements `ControlValueAccessor`, adds `providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularXComponent), multi: true }]`. Reference: `FalconAngularInputComponent` (see FALCON_WRAPPER_AND_RENDER_PATH_REPORT §9).
- **No** → no provider needed. Display components (empty-state, badge, avatar, status-badge) skip CVA.

### Q7 — Does my component project content?
- **Yes via single slot** → use the Stencil default slot: `<slot />` on the Shadow side, `<ng-content />` on the Angular wrapper template.
- **Yes via named slots** → use `<slot name="X" />` in Stencil, and `<ng-content select="[slot=X]" />` in the Angular wrapper. ALL named slot names must be lowercase-kebab.
- **No** → no slots.

### Q8 — Do I need a custom directive for `ng-template` projection (Strategy E)?
- **Yes** → write a `Falcon<X>CellDirective` and a `falcon-cells-mounted` Stencil event with mount-point payload. Reference: `falcon-data-table-cell.directive.ts` (FALCON_WRAPPER_AND_RENDER_PATH_REPORT §6).
- **No** → static slot projection covers most cases.

## 5. What you DO NOT add

| Anti-pattern | Why forbidden |
|---|---|
| Hardcoded color / pixel / radius in component CSS | [MEMORY] `feedback_no_inline_styles_tokens_only.md` HARDENED 2026-05-05. All visuals via `--falcon-X-*` tokens |
| SCSS file (`.scss`) | [MEMORY] `feedback_brain_skills_primeng_purge.md` 2026-05-11 — Tailwind v4 utilities only, no SCSS, no component CSS outside Stencil Shadow `.css` |
| PrimeNG / PrimeIcons import | [MEMORY] `project_falcon_primeng_total_removal_complete.md` 2026-05-10 — zero PrimeNG. ESLint flat-block enforces |
| `*ngIf` / `*ngFor` in wrapper template | [BRAIN-OUT] FALCON_WRAPPER_AND_RENDER_PATH_REPORT §11 — verified 0 matches. Use `@if` / `@for` (Angular 20 control flow) |
| `[prop]` Angular property binding on Stencil tag for primitive props | [CODE] Wrapper template uses `[attr.icon-name]` not `[iconName]` — see Contract C8 |
| Eager `defineCustomElements()` of Light variants | [CODE] `define-falcon-tw-component.ts` is on-demand — see Contract C6 |
| Re-emitting Stencil event without `bubbles: true, composed: true` | Composed events traverse Shadow boundary; without them Angular wrapper `(falcon-change)` listener never fires |

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
