---
type: anti-patterns
cluster: 15-implementation-pitfalls
purpose: "Answers 'which 13 anti-patterns from the old UI MUST NOT be ported to the new theme (SCSS, PrimeNG, *ngIf, @Input, alert())'. Open before copying any old-UI .ts/template/style."
extracted: 2026-05-16
---

# Anti-Patterns — What NOT to port from the old UI

> [!tldr]
> The old UI (`apps/admin-console` and `apps/management-console` as they exist on `origin/main`) works against the live backend — every endpoint, DTO, PES key, and validator is proven. **But its rendering layer is fully PrimeNG-bound + SCSS-bound + legacy-template-syntax.** When you port a feature to the new theme, copy the .ts logic (services, mappers, signal-flows) but reject every entry in §2 below. The new theme rebuilds the template + style layers from scratch on Falcon UI Core + Tailwind + signals.

## 1. Context

This file is the consolidated anti-pattern list distilled from three [BRAIN-OUT] sources:

- `datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/08-RULES-APPLIED.md` (the canonical 13-item list — lines 89-103)
- `datasets/old-ui-dataset/10-pages/admin-console/contact-groups/08-RULES-APPLIED.md` (lines 50-59)
- `datasets/old-ui-dataset/10-pages/admin-console/wallet-balance-management/08-RULES-APPLIED.md` (lines 58-69)

The three pages together touch every anti-pattern in the dataset. Each anti-pattern below cites the most concrete example.

## 2. The 13 anti-patterns

---

### AP-01 · SCSS files everywhere

- **What it looks like:** Each component has a `.scss` companion. Hand-rolled BEM-ish class names (`oh-skeleton__row`, `wb-card__title`, `bt-form__field`).
- **Why it's wrong:** Standing rule [MEMORY] `feedback_no_inline_styles_tokens_only`, `angular-tailwind-skill`, `project_brain_skills_primeng_purge` — **Tailwind utilities only — no SCSS, no component CSS**. The canonical theme entry is the sole CSS file allowed.
- **Evidence:**
  - `organization-hierarchy.component.scss`, `tabs-layout.component.scss`, every tab `.scss`, every wizard step `.scss` (full SCSS footprint per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:45`)
  - `contact-groups.component.scss` 138 lines + `contact-group-details.component.scss` 227 lines per [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:20`
  - `wallet-balance-management.component.scss` + `balance-transfer.component.scss` totaling **1,616 lines** of hand-rolled BEM per [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:22`

---

### AP-02 · PrimeNG components + PrimeIcons strings

- **What it looks like:** `<p-tabs>`, `<p-confirmDialog>`, `<p-select>`, `<p-skeleton>`, `<p-tablist>`, `<p-tabpanel>`, `<p-radioButton>`, `<p-checkbox>`, `<p-chip>`, `<p-password>`, `<p-button>`, `<p-toggleSwitch>`, `<p-inputNumber>` PLUS `pi pi-sitemap`, `pi pi-eye`, `pi pi-trash`, `pi pi-pencil`, etc.
- **Why it's wrong:** Platform-wide removal is COMPLETE per [MEMORY] `project_falcon_primeng_total_removal_complete` — **ZERO PrimeNG. ZERO PrimeIcons.** 7 packages physically uninstalled. 122 `pi pi-*` icons replaced via vendored Falcon icon font. ESLint flat-block live-fire confirmed (3/3 disallowed imports error).
- **Evidence:**
  - `<i class="pi pi-sitemap">`, `<i class="pi pi-plus-circle">` at [CODE] `organization-hierarchy.component.html:142, 151, 166, 180`
  - `'pi pi-eye'` icon string at [CODE] `hierarchy-tab.component.ts:125`
  - Direct use of `<p-tabs>`, `<p-tablist>`, `<p-tab>`, `<p-skeleton>`, `<p-toast>`, `pButton`, `pInputText` in contact-groups [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:21`
  - `primeng/autocomplete`, `primeng/select`, `primeng/inputtext`, `primeng/inputnumber`, `primeng/textarea` + `pi-wallet`, `pi-building`, `pi-spinner`, `pi-chevron-right` in wallet [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:23-27`

---

### AP-03 · `@Input` / `@Output` decorators

- **What it looks like:** `@Input() label!: string;` + `@Output() valueChange = new EventEmitter<string>();`
- **Why it's wrong:** Under Angular v20+ idioms these should be the signal-based `input()` / `output()` factory functions. The decorator form is legacy.
- **Evidence:**
  - Every component in organization-hierarchy uses the legacy decorator syntax per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:37`. Examples: `tabs-layout.component.ts:35-68`, `hierarchy-tab.component.ts:50-65`
  - `balance-transfer.component.ts:62-69` declares `@Input` / `@Output` + uses `EventEmitter` per [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:31-32`

---

### AP-04 · `*ngIf` / `*ngFor` instead of `@if` / `@for`

- **What it looks like:** `<div *ngIf="!hasSelectedNode">...</div>`, `<tr *ngFor="let row of rows">...</tr>`
- **Why it's wrong:** Angular v17+ introduced built-in `@if` / `@for` / `@switch` control flow. The structural-directive form is legacy + heavier + harder to optimize.
- **Evidence:**
  - `organization-hierarchy.component.html` uses `*ngIf` at lines 30, 32, 59, 70, 124, 139, 159, 191 + `*ngFor` at line 59 per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:36`
  - Contact-groups list template uses `@if` / `@else` ONCE (line 99) but every other conditional uses `*ngIf` per [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:18`
  - 30+ `*ngIf` / `*ngFor` instances across wallet-balance HTML (admin lines 33-439 + balance-transfer lines 17-205) per [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:28`

---

### AP-05 · Hand-rolled HTML strings in render functions

- **What it looks like:** `renderUsernameWithAvatar(row): string { return \`<div class="user-avatar">...\`; }`
- **Why it's wrong:** Returns raw HTML strings with class names (`user-avatar`, `username-text`, `status-badge`, `status-dot--active`) tightly coupled to SCSS. Bypasses Angular's renderer abstraction; would not run on SSR; defeats sanitization.
- **Evidence:**
  - `renderUsernameWithAvatar`, `renderStatusBadge` at [CODE] `hierarchy-tab.component.ts:157-188` return raw HTML strings per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:46`
  - **Replacement:** Use `<ng-template>` or component projection

---

### AP-06 · `alert()` calls

- **What it looks like:** `alert('Please select an image file.');` and `alert(\`Error: ${errorMessage}\`);`
- **Why it's wrong:** Native browser dialog — un-themable, un-localized, un-testable, can't dismiss programmatically, blocks the main thread. Standing rule: every user-facing message goes through `MessageService` (or a Falcon toast) or a dialog component.
- **Evidence:**
  - Image upload `alert('Please select an image file.')` + `alert('The file is too large...')` at [CODE] `information-client-step.component.ts:351, 357` + `account-owner-step.component.ts:148, 154` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:51`
  - `alert(\`Error: ${errorMessage}\`)` at [CODE] `create-client-wizard.component.ts:372, 380` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:73`

---

### AP-07 · PascalCase request bodies

- **What it looks like:** Backend GET returns `{ extension, fileBase64String }`. FE PUT sends `{ Extension, FileBase64String }`. Other endpoints send `Page`/`PageSize`/`PageNumber`/`pageSize` — every casing on the same surface.
- **Why it's wrong:** Either backend should normalize casing on its serializer, OR a uniform FE serializer should handle the conversion. Mixed casing per-method is a maintenance trap.
- **Evidence:**
  - `AccountInformationModel.profilePicture` round-trips through `{ Extension, FileBase64String }` per [CODE] `information.service.ts:31-50` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:61`
  - Mixed casing across contact-groups endpoints — `page`/`pageSize`, `Page`/`PageSize`, `PageNumber`/`PageSize` in three sibling methods of the same service per [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:37`

---

### AP-08 · Silent `return of([])` after delay

- **What it looks like:** `getRootNodes(): Observable<Node[]> { return this.http.get<Node[]>(...).pipe(catchError(() => of([]).pipe(delay(500)))); }`
- **Why it's wrong:** Designed for backend-down dev (renders empty state instead of error). In production this silently hides API failures from the user, masks real bugs in monitoring, and disables retry. **Do NOT port.**
- **Evidence:**
  - `OrgHierarchyApiService.getRootNodes()` at [CODE] `org-hierarchy.api.service.ts:63-68` + `.getChildren()` at lines 93-96 — both catch all errors and `return of([]).pipe(delay(500))` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:56`
  - `AppsServicesService.updatePriceType/updatePriceValue` + `CommChannelsServicesService.updatePriceType/updatePriceValue` at [CODE] `apps-services.service.ts:55-99` + `comm-channels-services.service.ts:61-105` have `catchError(() => of({ id, pricingType, effectiveDate }))` — **return the request as if it succeeded on network failure** per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:57`

---

### AP-09 · Magic-string defaults

- **What it looks like:** Hard-coded IP list `['192.168.0.1', '95.158.55.17']`, magic `9999999` "select all" page size, `'EMPTY'` literal as a TreeNode key, `maxlength="32"` on a name field.
- **Why it's wrong:** Magic values can't be configured per environment, can't be unit-tested in isolation, and breed silently when copy-pasted. Either named constants or backend-served config.
- **Evidence:**
  - `CreateClientSettingsStepComponent.applyDefaults` at [CODE] `client-settings-step.component.ts:111-118` hard-codes IPs + limits + level per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:68`
  - `IP-input maxlength="32"` on node-name at [CODE] `organization-hierarchy.component.html:118` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:69`
  - `LIST_PAGE_SIZE = 100`, `SELECT_ALL_PAGE_SIZE = 9999999` in contact-groups per [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:25-27`
  - `'EMPTY'` literal as TreeNode key when `node.id === null` at [CODE] `org-hierarchy.mapper.ts:13` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:65`

---

### AP-10 · Sibling components reaching across feature boundaries

- **What it looks like:** `import { InsufficientBalancePriorityDialogComponent } from '../../../shared/components/insufficient-balance-priority-dialog';` — a 6-level relative path crossing feature boundaries.
- **Why it's wrong:** Implicit, undiscoverable contract between sibling features. Refactoring the source feature silently breaks the consumer. The dialog should live in `libs/falcon/*` (shared) OR inside the feature (private). Either, not both.
- **Evidence:**
  - `InsufficientBalancePriorityDialogComponent` lives in `apps/admin-console/src/app/shared/components/` and is consumed by org-hierarchy tabs via 6-level relative import per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:100`
  - Mgmt-side `contracts-cost-management` imports 3 admin-console components via `../../../../../admin-console/...` relative paths — *architecturally fragile* per [BRAIN-OUT] `04-feature-parity-matrix/contracts-cost-management.compare.md:42`

---

### AP-11 · `as any` casts for response shapes

- **What it looks like:** `(this as any).fooField = (res.result as any).something;`
- **Why it's wrong:** Defeats type safety. Accommodates response-shape uncertainty by hiding it. When the BE shape changes, no compile error — just a runtime undefined.
- **Evidence:**
  - `(this as any)` + `(res.result as any)` casts at [CODE] `apps-services-tab.component.ts:876`, `create-client-wizard.component.ts:368-372` per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:74`
  - `getOperationErrorMessage()` reads `errorCodes` field that's never declared in the response type at [CODE] `wallet-balance-management.component.ts:867-874` per [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:42`

---

### AP-12 · Mixed template-driven + reactive forms

- **What it looks like:** Settings tab uses `NgForm` (template-driven) for the main fields AND `FormGroup` (reactive) for the IP input — both in the same component.
- **Why it's wrong:** Two form models with different APIs, different validation surfaces, different change-detection patterns. Maintenance overhead doubles. Cross-form validation requires bridge code.
- **Evidence:**
  - Settings tab + wizard step 1 use mixed forms — `~30% reactive` per the [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:111` digest score
  - `viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]` at [CODE] `information.component.ts:55` — "child form participates in parent NgForm" workaround that reactive forms compose more cleanly per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:40`
  - Template-driven balance-transfer form with NO `Validators` imported + custom `get isFormValid` getter at [CODE] `balance-transfer.component.ts:134-167` — "no errors are surfaced to a FormControl.errors map; the form is just disabled" per [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:35`

---

### AP-13 · Cross-app deep-link via raw `router.navigate`

- **What it looks like:** Inside admin-console, calling `this.router.navigate(['/profile'], { state: { mode: 'add-wizard' } })` — where `/profile` actually lives in host-shell.
- **Why it's wrong:** Implicit cross-app contract. The dependency is undiscoverable; type-safety doesn't span apps; `window.history.state` is the actual contract surface. Breaks when host routes move.
- **Evidence:**
  - `router.navigate(['/profile'], ...)` for cross-app deep-link from admin-console code per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:103`
  - `window.history.state` cross-page contracts per [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:95`
  - **Replacement:** typed cross-app navigation helper (typed routes / config-driven targets) so the dependency becomes explicit

---

## 3. Use-this-not-that replacement table

| # | Anti-pattern | Replace with |
|---|---|---|
| AP-01 | SCSS files everywhere | **Tailwind utilities only.** Theme tokens via `falcon-{family}-{shade}` naming. Component CSS forbidden. |
| AP-02 | PrimeNG `<p-*>` + `pi pi-*` icons | **Falcon UI Core `<falcon-*>`** components (button, input, dropdown, table, tabs, drawer, dialog, etc.) + `<falcon-icon>` / `<falcon-svg-icon>` from the vendored Falcon icon font |
| AP-03 | `@Input() / @Output()` decorators + `EventEmitter` | **Signal `input()` / `output()`** factory functions from `@angular/core` |
| AP-04 | `*ngIf` / `*ngFor` / `*ngSwitch` | **`@if` / `@for` / `@switch`** built-in control flow (Angular v17+) |
| AP-05 | Hand-rolled HTML strings in render functions | **`<ng-template>` + component projection** — never return raw HTML from a TS function |
| AP-06 | `alert(...)` calls | **`MessageService` toast** (or `<falcon-toast>` / a Falcon dialog component). NEVER native `alert()`. |
| AP-07 | PascalCase request bodies (or mixed casing) | **Uniform camelCase wire format** — bake a serializer at the gateway boundary so handlers receive consistent shape |
| AP-08 | Silent `return of([])` after delay | **Propagate errors via `ServiceOperationResult` error path** — log + surface a user-facing error UI. Never silently empty-array. |
| AP-09 | Magic-string / magic-number defaults | **Named constants in a shared file** OR **backend-served config** (e.g. `GET /upload-config` for file caps) |
| AP-10 | Sibling components reaching across feature boundaries | **Promote to `libs/falcon`** (or app-level `libs/<app>/shared`) if reused, OR **keep inside the feature** if private. Never cross-feature relative imports. |
| AP-11 | `as any` casts for response shapes | **Fully type response DTOs** matching backend `ServiceOperationResult<T>` shape. Use `unknown` + a type guard if the shape really is variable. |
| AP-12 | Mixed template-driven + reactive forms | **Reactive forms throughout.** `FormBuilder` + `Validators` + `FormGroup` + per-component validation injection token (see [MEMORY] `project_falcon_component_validation_convention`). |
| AP-13 | Cross-app deep-link via raw `router.navigate` | **Typed cross-app navigation helper** — config-driven targets so the dependency is explicit. Optionally a thin `NavigationService` in `@host-shell/shared/*`. |

## 4. Pre-port grep checklist

Before porting ANY feature from the old UI to the new theme, run these greps on the source folder. Every hit is an anti-pattern that needs explicit handling (rewrite OR strip).

```bash
# AP-01 — SCSS files
find apps/<app>/src/app/features/<feature>/ -name "*.scss"

# AP-02 — PrimeNG components and PrimeIcons
grep -rE "<p-[a-z]" apps/<app>/src/app/features/<feature>/
grep -rE "primeng/" apps/<app>/src/app/features/<feature>/
grep -rE "'pi pi-|\"pi pi-" apps/<app>/src/app/features/<feature>/
grep -rE 'pButton|pInputText' apps/<app>/src/app/features/<feature>/

# AP-03 — @Input / @Output decorators
grep -rE "@Input\(|@Output\(" apps/<app>/src/app/features/<feature>/
grep -rE "EventEmitter" apps/<app>/src/app/features/<feature>/

# AP-04 — *ngIf / *ngFor / *ngSwitch / [ngClass]
grep -rE "\*ngIf|\*ngFor|\*ngSwitch|\[ngClass\]|\[ngStyle\]" apps/<app>/src/app/features/<feature>/

# AP-05 — Hand-rolled HTML strings (heuristic: return inside a method returning a template literal)
grep -rEn "return \`<" apps/<app>/src/app/features/<feature>/

# AP-06 — alert() calls
grep -rE "\balert\(" apps/<app>/src/app/features/<feature>/

# AP-07 — PascalCase request body (heuristic: object keys starting with capital then lowercase)
grep -rEn "Extension|FileBase64String|PageNumber|PageSize" apps/<app>/src/app/features/<feature>/

# AP-08 — Silent return of([]) error swallowing
grep -rE "of\(\[\]\)\.pipe\(delay" apps/<app>/src/app/features/<feature>/
grep -rE "catchError\(\(\) => of\(\{" apps/<app>/src/app/features/<feature>/

# AP-09 — Magic-string / magic-number defaults
grep -rEn "(maxlength=\"[0-9]+\")|PAGE_SIZE = [0-9]+|192\.168\.0\.1|9999999|'EMPTY'" apps/<app>/src/app/features/<feature>/

# AP-10 — Sibling cross-feature imports (>= 4 levels of "../")
grep -rEn "from ['\"]\.\./\.\./\.\./\.\./" apps/<app>/src/app/features/<feature>/

# AP-11 — `as any` casts
grep -rE " as any" apps/<app>/src/app/features/<feature>/

# AP-12 — Mixed forms (presence of both NgForm + FormGroup in same feature)
grep -rE "ngForm|NgForm" apps/<app>/src/app/features/<feature>/
grep -rE "FormGroup|FormBuilder" apps/<app>/src/app/features/<feature>/

# AP-13 — Cross-app deep-links via router.navigate (heuristic: navigate to /profile, /home, /unauthorized)
grep -rEn "router\.navigate\(\[['\"]/profile['\"]" apps/<app>/src/app/features/<feature>/
grep -rEn "window\.history\.state" apps/<app>/src/app/features/<feature>/
```

If any of these return hits, address them BEFORE writing the new theme implementation — don't carry them forward.

## 5. Sibling anti-pattern observations (from old-ui dataset, not in the canonical 13)

These are observations the old-ui dataset flagged but that didn't make the canonical 13-item list. Worth knowing:

| Observation | Source | Replacement |
|---|---|---|
| `JSON.parse(JSON.stringify(...))` for deep clone (loses Dates, Sets, Maps, RegExps) | [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:30` (lines 594, 615 of detail) | `structuredClone(value)` (Angular v15+ runtime) |
| `setTimeout(..., 0)` / `queueMicrotask(...)` to force CD ordering | [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:42` | Use signals + zoneless — most of these vanish |
| Manual `Subject<void>` + `destroy$.next() / .complete()` coexisting with `takeUntilDestroyed(this.destroyRef)` | [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:41` | Pick `takeUntilDestroyed(destroyRef)` ONLY |
| `BehaviorSubject` for component-local state (`isLoading$`, `isSaving$`) | [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:34` | Signals (`signal<boolean>(false)`) |
| `document.createElement('a').click()` for downloads | [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:32` | Service abstraction via `Renderer2` (also SSR-safe) |
| Inline 119-line SVG markup in template | [BRAIN-OUT] `wallet-balance-management/08-RULES-APPLIED.md:36` | `<falcon-svg-icon>` / `<falcon-illustration>` component |
| Translation key fallback strings (`\|\| 'Failed to load applications'`) | [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:52` | Drop the fallback — let the translate pipe handle missing keys via Brain SK `domain-glossary` skill |
| `console.error(...)` in production catch blocks | [BRAIN-OUT] `organization-hierarchy/08-RULES-APPLIED.md:72` | Route through a proper logger / telemetry service |
| `[ngClass]="{ 'foo': cond1, 'bar': cond2 }"` | [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:19` | `[class.foo]="cond1"` + `[class.bar]="cond2"` |
| Inline `style="..."` attributes (`style="min-height: 400px"`) | [BRAIN-OUT] `contact-groups/08-RULES-APPLIED.md:23` | Tailwind utility class (`min-h-[400px]`) or design-token-driven class |

## 6. Cross-references

- [[PITFALLS]] — the operational pitfalls (mindsets, severity, mitigations)
- [[_INDEX]] — cluster index
- [BRAIN-OUT] `datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/08-RULES-APPLIED.md` — the canonical 13-item list (lines 89-103)
- [BRAIN-OUT] `datasets/old-ui-dataset/10-pages/admin-console/contact-groups/08-RULES-APPLIED.md` — sibling list (lines 50-59)
- [BRAIN-OUT] `datasets/old-ui-dataset/10-pages/admin-console/wallet-balance-management/08-RULES-APPLIED.md` — sibling list (lines 58-69)
- [MEMORY] `project_falcon_primeng_total_removal_complete` — the removal program that closed AP-02
- [MEMORY] `feedback_no_inline_styles_tokens_only` — the standing rule that closes AP-01
- [MEMORY] `project_falcon_component_validation_convention` — replacement architecture for AP-12
- [MEMORY] `project_brain_skills_primeng_purge` — brain-skills cleanup matching AP-02
- [MEMORY] `feedback_pes_g_link_uses_zitadel_id` — the standing rule on session subject (related to P-14 in PITFALLS)
- [BRAIN-OUT] `brain-skills/Front-End-skills/angular-tailwind-skill/` — the Falcon stack contract enforced by the new theme
