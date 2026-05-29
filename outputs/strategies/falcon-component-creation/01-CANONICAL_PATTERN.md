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
| **Library component injecting an HTTP service** | [MEMORY] `feedback_library_skeleton_app_api.md` 2026-05-15 (Wave 16). Library components are SKELETONS — they take inputs, emit outputs, never inject anything that calls a backend. The API talk lives in an app-level **wrapper** component (see §6). |

## 6. Library = Skeleton, App = API — Architectural rule (2026-05-15)

> **Doctrine.** Every Falcon component lives in one of TWO layers:
>
> 1. **Library skeleton** (`libs/falcon-ui-core/...`) — pure presentational. Accepts data via `@Prop`/`@Input`, emits events. Knows NOTHING about backends, HTTP, or domain APIs. Works with default/passed-in data.
> 2. **App-level wrapper** (`apps/host-shell/src/app/shared-components/<name>/`) — uses the library skeleton **as a tag** in its template, injects backend services, owns the API orchestration. This is the layer where data goes live.

### 6.1 When to author a wrapper

You need a wrapper whenever the feature touches the backend:
- HTTP fetch / submit
- Polling
- Event-stream subscription
- Cross-app state coordination

If the feature is purely presentational (button, badge, accordion, calendar, dialog chrome) — you DON'T need a wrapper. The library skeleton is the end product.

### 6.2 Wrapper anatomy

Path: `apps/host-shell/src/app/shared-components/<verb-noun>-popup/` (or `-modal`, `-panel`, `-flow` — name the verb the user performs).

Files:
- `<name>.component.ts` — standalone, OnPush; injects services; orchestrates flow
- `<name>.component.html` — composes the library skeleton tag + binds inputs/outputs
- `index.ts` — public surface (component + types only; services are private)

Consumer surface (rule of thumb):
- ONE `@Input() trigger: SomeTriggerShape | null` — caller sets to fire the flow
- TWO `@Output()`s: `succeeded` + `failed` — caller reacts to terminal state
- Visual config (e.g. `showGlossy`, `showIconColor`) optional — forwarded to skeleton

### 6.3 Cross-app consumption

TypeScript path alias in `tsconfig.base.json`:
```json
"@host-shell/shared/*": ["./apps/host-shell/src/app/shared-components/*/index.ts"]
```

Consumer apps import:
```ts
import { MyPopupComponent } from '@host-shell/shared/my-popup';
```

This is build-time bundling — each MF app gets its own copy of the wrapper code. Stateless HTTP services duplicate fine. For shared state (auth, theme, language), the existing `falcon-facades/` + DI-token pattern remains the right answer.

### 6.4 What stays in libs

- ✅ Library skeleton components (Shadow + Light/TW + Angular wrapper) — no service injection
- ✅ Pure utility services (no HTTP) — e.g. `SimplePollService`, `HttpService` (low-level wrapper), formatters, validators
- ✅ Type definitions (request/response DTOs, enums) — `DoPaymentCommunicationChannelRequest`, `OrderFailureReason`, etc.
- ✅ Tokens, theme, i18n keys

What MAY stay in libs (grandfathered, but new code goes app-level):
- ⚠️ Domain HTTP services authored before Wave 16 (e.g. `CommChannelPaymentService`, `OrderStatusService`). These work, but new domain-API services should be authored at the app level per §6.1.

### 6.5 Example — `<app-do-payment-priority-popup>` (Wave 16 reference)

The library skeleton:
```html
<!-- libs/falcon-ui-core/.../falcon-insufficient-balance-dialog.component.html -->
<falcon-insufficient-balance-dialog-tw
  [items]="items"
  [open]="open"
  ... />
```

The app-level wrapper:
```ts
// apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts
@Component({
  selector: 'app-do-payment-priority-popup',
  imports: [FalconAngularInsufficientBalanceDialogComponent],
  templateUrl: './do-payment-priority-popup.component.html',
})
export class DoPaymentPriorityPopupComponent {
  @Input() set trigger(t: DoPaymentPriorityTrigger | null) { ... }
  @Output() succeeded = new EventEmitter<DoPaymentPrioritySuccess>();
  @Output() failed = new EventEmitter<DoPaymentPriorityFailure>();

  private payment = inject(CommChannelPaymentService);
  private orderStatus = inject(OrderStatusService);
  private poll = inject(SimplePollService);

  // doPayment → poll → getVisibleCommChannels → dialog → resubmit → terminal
}
```

The consumer (admin-console):
```html
<!-- apps/admin-console/.../applications-table.component.html -->
<app-do-payment-priority-popup
  [trigger]="ibTrigger()"
  (succeeded)="onIbSucceeded($event)"
  (failed)="onIbFailed($event)" />
```

```ts
import { DoPaymentPriorityPopupComponent } from '@host-shell/shared/do-payment-priority-popup';

// Just set the trigger — popup owns the rest.
protected ibTrigger = signal<DoPaymentPriorityTrigger | null>(null);

case 'doPayment':
  this.ibTrigger.set({ commChannelId: row.id, accountId, nodeId });
  return;
```

Library skeleton sees `items` + emits `orderedIds`. Wrapper sees `trigger` + emits `succeeded`/`failed`. Caller sees a 3-line interaction. Three layers, three concerns, zero leakage.

## 7. Feature components + validation contract

> **Doctrine.** A *feature component* is anything app-level that isn't a Falcon library primitive — wizard step, drawer panel, page-pool form, host-shell shared-component. Every feature component follows the same folder shape and consumes validations from the shared `FALCON_VALIDATIONS` registry. Locked 2026-05-16 (Strategy v1.2.0).

### 7.1 — Folder pattern

```
<feature-component-name>/
  <feature-component-name>.component.ts
  <feature-component-name>.component.html
  index.ts                              # public barrel
  models/
    models.ts                           # ONE file holding the component's interfaces / form values / helpers
  services/
    <domain>.service.ts                 # ONE file per primary service class — name reflects the domain
  validations/
    validations.ts                      # field-rule map + InjectionToken + <name>RulesProvider() factory
```

`<domain>` is the entity the component owns (`user.service.ts` for an Add User wizard, `client.service.ts` for an Add Client wizard, `wallet.service.ts` for a wallet panel). Inside the file: one class named after the domain (`UserService`, `ClientService`, `WalletService`) — NOT after the wizard chrome.

This clarifies the prior rule "ONE file per type-folder" — the type folder remains (`services/`), but when only one service class lives there, the file name and class name reflect the domain, not the type. Multiple services collapse into the same file's exports if their concerns are tightly coupled, or split into `services/<domain-a>.service.ts` + `services/<domain-b>.service.ts`.

### 7.2 — Wizards: each step is a self-contained feature component

A wizard chrome (`add-user-wizard.component.ts`) imports each step component as a child. Every step folder is itself a feature component with the exact same shape:

```
add-user-wizard/
  add-user-wizard.component.{ts,html}
  index.ts
  models/models.ts
  services/user.service.ts             # owns Identity user lifecycle calls
  user-personal-step/                  # step is a feature component
    user-personal-step.component.{ts,html}
    index.ts
    validations/validations.ts         # step-local rules
  user-role-status-step/               # ...same shape
  user-permissions-step/
```

The wizard chrome only knows about step VALUE + step VALID + step DIRTY signals. Per-field rules live with each step. The chrome never reaches into a step's validation map.

### 7.3 — `validations/validations.ts` shape

Every feature component declares its rules in `validations/validations.ts` as a `FalconFieldRules<TFormValue>` map exposed via a per-component `InjectionToken` plus a `*RulesProvider()` factory:

```typescript
import { InjectionToken, Provider, inject } from '@angular/core';
import { FALCON_VALIDATIONS, FalconFieldRules } from '@falcon';
import { MyFormValue } from '../../models/models';

export const MY_FORM_VALIDATIONS = new InjectionToken<FalconFieldRules<MyFormValue>>(
  'MY_FORM_VALIDATIONS',
);

export const myFormRulesProvider = (): Provider => ({
  provide: MY_FORM_VALIDATIONS,
  useFactory: (): FalconFieldRules<MyFormValue> => {
    const v = inject(FALCON_VALIDATIONS);
    return {
      firstName: [v.personName()],
      email: [v.email()],
      /* ... */
    };
  },
});
```

The component declares `providers: [myFormRulesProvider()]` and reads the rules via `inject(MY_FORM_VALIDATIONS)`. Two helper functions in `@falcon` make consumption a one-liner:

- `allFieldsValid(value, rules)` — runs every sync rule against current values. Returns true iff none fail.
- `fieldErrorMessage(value, field, rules, touched)` — runs the rule array for a single field. Returns a `ValidationMessage` (i18n key + params) or null if no error is visible (per `LIVE_ERROR_KEYS` + touched-set semantics).

### 7.4 — Cross-reference to §6 — host-shell shared components

Library-side skeletons in `libs/falcon-ui-core/` are pure (no DI). App-level wrappers in `apps/host-shell/src/app/shared-components/` follow §7 EXACTLY — they have `<name>/models/`, `<name>/services/`, and `<name>/validations/` whenever they own form input. The validation contract is the same as for page-pool wizards.

### 7.5 — Anti-patterns

| Anti-pattern | Why it's wrong | Fix |
|---|---|---|
| `services/services.ts` exporting `AddUserApiService` | The file name and class name are dialectally circular ("services/services" exporting a service named after the chrome) | `services/user.service.ts` exporting `UserService` |
| Direct `ValidatorFn` imports across feature folders | Cross-feature coupling; hard to swap rules per route; impossible to override in tests | Inject `FALCON_VALIDATIONS` from `@falcon` and compose per component |
| Per-field hand-rolled `computed()` block per error | Boilerplate that re-implements the touched-set + LIVE_ERROR_KEYS gate every step | `fieldErrorMessage(value(), 'field', this.rules, this.touched())` |
| Stuffing every validator factory into `services/validators.ts` next to HTTP services | Two unrelated concerns in one folder; validators end up coupled to that feature's mock-tree | Page-pool feature has NO `services/validators.ts`; rules live in each component's `validations/validations.ts` |
| App-level wrapper injecting a service inside the LIBRARY skeleton | §6 violation — library stays pure | Service injection happens in the wrapper only |

See `10-VALIDATION_CONVENTION.md` for the full contract, override semantics, and the migration cookbook.

### 7.6 — Backend errors, success toasts, and PES gating (v1.3.0)

Added 2026-05-16 (Strategy v1.3.0) when the Add User wizard became the first reference flow with full backend + PES integration. Three rules every feature component owning a submit-flow must follow:

**Rule A — Backend errors land in the popup, not the global toaster.** When a feature submits to the backend and gets a non-success envelope (`isSuccessful: false`) or throws an `HttpErrorResponse`:

1. Set the `notShowToaster: 'true'` header on the request so the global response-interceptor's toast stays silent.
2. Inject `ErrorDialogService` from `@falcon` and call `errorDialog.openError({ httpStatus, errorMessages })`. The host (`<falcon-angular-error-dialog-host>`, mounted ONCE in `apps/host-shell/src/app/app.ts`) renders the dialog automatically.
3. Map backend codes to HTTP status via a feature-local helper (`inferStatus(errs)`). Map known business-rule codes (`NormalUserLimitReached → 422`, `DuplicateUsername → 409`, etc.) to their HTTP semantics; default to `400` for validation. HTTP `401` is suppressed by the service — the global interceptor owns re-auth.
4. For multi-step wizards: ALSO store the error envelopes in a `wizardBackendErrors` signal on the page-state service. The wizard reads it via `[backendErrors]` input + an `effect()` that jumps to the offending step via `FIELD_LEVEL_ERROR_MAP` and calls `revealErrors()`. The popup runs in parallel; the in-wizard jump is for field-level guidance.

**Rule B — Success toasts use `FalconMessageService`, not `FalconNotifierFacade`.** The toast host (`<falcon-angular-message-host>`) lives in the app shell so toasts survive wizard-close + navigation. After a successful submit:

```typescript
this.messageService.add({
  severity: 'success',
  summary: this.i18n.translate('hierarchy.addUser.success.title'),
  detail: this.i18n.translate('hierarchy.addUser.success.detail').replace('{userName}', payload.username),
  life: 10000,
});
```

i18n keys for success messages use `<feature>.success.{title,detail}` shape; `{paramName}` literal tokens are interpolated by the caller via `.replace()`.

**Rule C — PES gating uses `AccessControlFacade.resolveFlags()` batched at mount time.** Feature components that need PES gating do NOT call `AccessControlFacade.check()` per field. Instead, in `ngOnInit`:

```typescript
forkJoin({
  flags: from(this.accessControl.resolveFlags({
    addUser:         FalconAccess.adminConsole.user.add(),
    assignPermGroup: FalconAccess.adminConsole.userPermissionGroup.assign(),
    uploadPhoto:     FalconAccess.adminConsole.userProfilePicture.upload(),
    /* ... per-role grant flags via FalconAccess.userRole.other(currentRole, target) */
  })),
  settings: this.commerceSettingsApi.getSettings(),
}).subscribe(({ flags, settings }) => { /* ... */ });
```

Component renders a token-styled skeleton while `loading()` is true. PES-denied flags drive a DISABLED state on the gated control + an `[attr.title]` tooltip explaining the denial (per D2). Hard denials (e.g. `canAddUser=false`) render an empty-state instead of the form body.

**Cross-reference table — Wave-3 work landed by feature:**

| Component / Service | File | Role |
|---|---|---|
| `ErrorDialogService` | `libs/falcon/src/shared-data-access/lib/services/error-dialog.service.ts` | Backend error popup state |
| `FalconAngularErrorDialogHostComponent` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-error-dialog-host/` | Renders the popup |
| `CommerceSettingsService` | `libs/falcon/src/shared-data-access/lib/services/commerce-settings.service.ts` | Settings hydrate |
| `FalconAccess.adminConsole.{user,userPermissionGroup,userProfilePicture}` | `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` | PES query factories |
| `FIELD_LEVEL_ERROR_MAP` | `apps/admin-console/.../add-user-wizard/models/models.ts` | Code → step+field map |
| `userNameUnique(... pendingSignal)` | `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` | Wave 6 async-pending gate |

_Last updated: 2026-05-16 — Strategy v1.3.0 — Author: Ammar (auto). v1.3.0 added §7.6 (backend errors / success toasts / PES gating)._
