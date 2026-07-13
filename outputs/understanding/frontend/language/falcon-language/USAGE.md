# falcon-language — USAGE

> Real codebase examples (cite file), recommended usage, Do/Don't, and the grep-verified Consumer Sweep. Mirror falcon-input USAGE tone.

## Real codebase examples

### Template pipe (the dominant pattern — 1314 occurrences)

`[CODE]` `apps/admin-console/.../org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` (40 `| translate` uses):
```html
{{ 'hierarchy.infoPanel.title' | translate }}
```

`[CODE]` `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.html`, `change-password.component.html` (14), `forgot-password-flow.component.html` (22) — auth-flow copy all via `| translate`.

### Pipe with interpolation params

`[CODE]` `translate.pipe.ts:9-12` documents:
```html
<span>{{ 'welcome' | translate: { name: 'John' } }}</span>
```
Resolves `"Welcome, {{name}}!"` → `"Welcome, John!"` via `interpolate()`.

### Programmatic (service) lookup in TS

`[CODE]` `apps/admin-console/.../templates-page/services/templates-page-state.service.ts`, `node-drawer-state.signals.ts:1`, `add-user-wizard.component.ts:1` inject `TranslateService` and call `translate('key', params)` for toast text / computed labels.

### Reactive labels that survive late bundle load (signal pattern)

`[CODE]` The service's `translations` signal (`translate.service.ts:32-34`) is designed for `computed()` option arrays. Recommended new usage:
```ts
private i18n = inject(TranslateService);
// re-computes when the bundle loads or language flips:
statusOptions = computed(() => {
  this.i18n.translations();                       // dependency trigger
  return STATUS_CODES.map(c => ({ value: c, label: this.i18n.translate(`status.${c}`) }));
});
```
Without the `.translations()` read, an array built eagerly in a field initializer would freeze with raw keys if the JSON arrives after construction (the MF remote-embed timing case the source comment calls out, `:25-31`).

### Backend-error-key → localized message (compose with shared-utils)

`[CODE]` `libs/falcon/src/shared-utils/lib/validations/messages.ts` imports `TranslateService` and maps `FalconKeys.Error` codes → `hierarchy.validation.*` keys (`keyForBackendCode`, `:149`). Consumer pattern:
```ts
const key = keyForBackendCode(serviceError.code);   // → 'hierarchy.validation.duplicateUsername'
this.notifier.error(this.i18n.translate(key));
```
Both bundles carry the `hierarchy.validation` namespace (43 keys, verified 2026-06-03), so these keys resolve.

### Bootstrap wiring (all 3 apps)

`[CODE]` `apps/host-shell/src/app/app.config.ts:50,118` — import + spread `translateInitializerProvider` into `providers[]`. Identical in `admin-console/app.config.ts:22,50` and `management-console/app.config.ts:21,46`. This is the ONLY wiring required; the service self-bootstraps its bundle fetch on first injection (which the initializer forces).

## Recommended new usage

1. **Template strings** → `{{ 'namespace.key' | translate }}`. Add the key to BOTH `en.json` and `ar.json` (house rule + parity — AUDIT F1).
2. **Params** → `{{ 'key' | translate: { name: x() } }}` (flat `{{param}}` only; no plural/ICU).
3. **TS strings** → `inject(TranslateService).translate('key', params)` for one-shot; `.get('key')` (observable) only if you need to pipe it.
4. **Computed label arrays** → read `i18n.translations()` inside the `computed()` so it re-derives on language change / late load.
5. **Never** hardcode a user-visible literal; never read the bundle JSON directly — always go through the service/pipe.
6. **New namespace?** Add a top-level key in both bundles; keep nesting shallow and dot-addressable.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `{{ 'login.title' \| translate }}` | `<h1>Login</h1>` (hardcoded literal) |
| Add every new key to `en.json` AND `ar.json` | Add to `en.json` only (silent en-fallback hides the gap → AUDIT F1) |
| `i18n.translate('k', { name })` for `{{name}}` | Expect `{count, plural, …}` — unsupported (`interpolate` is flat) |
| Read `i18n.translations()` in a `computed()` for option arrays | Build label arrays in a field initializer (freezes with raw keys on late load) |
| Use `keyForBackendCode()` + `translate()` for API errors | `notifier.error(serviceError.message)` (raw, unlocalized) |
| Rely on `translateInitializerProvider` for boot-blocking | Call `translate()` before bootstrap and assume it's populated (returns key if not yet loaded) |
| Set `dir="rtl"` in the theme/layout layer | Expect this service to flip text direction (it doesn't — AUDIT F2) |

## Consumer Sweep (grep verified 2026-06-03)

- `[CODE]` `| translate` (template pipe): **1314 occurrences / 122 files** (excl. `dist/`).
- `[CODE]` `TranslateService` (import/inject): **122 files** (excl. `dist/`).
- `[CODE]` `translateInitializerProvider`: **3 app configs** (host-shell, admin, mgmt) + the definition.

Representative consumer files (not exhaustive — see grep):
- **Auth (host-shell):** `login-layout`, `get-started`, `enter-otp`, `change-password`, `forgot-password-flow`, `topbar`, `sidebar`.
- **Org-hierarchy (admin + mgmt):** `falcon-org-info-panel.component.html` (40 each), `settings-tab` (25/34), add-client wizard steps, add-user wizard steps, `org-hierarchy-page-menu`, `falcon-org-node-header`, `falcon-org-chart`/`falcon-chart-toolbar`/`falcon-chart-card`.
- **Templates (admin + mgmt):** `templates-wizard` + `step1/step2(72)/step3`, `flow-editor`/`flow-card`/`flow-type-modal`, `templates-list`, `templates-details`, `whatsapp-preview`, `button-card`.
- **Contracts-cost-management (admin + mgmt):** `contracts-add-wizard` + steps, `contracts-view/edit-contract`, `contracts-rate-card-section`, `contracts-contract-details-section`, `contracts-addons-section`.
- **Contact-groups (admin + mgmt):** `contact-groups-list`, `contact-group-detail`, `create-contact-group` + steps, `share-dialog`.
- **Wallet (admin + mgmt):** `wallet-balance-management` + `balance-transfer`, `new-wallet-balance` + `wb-settings-card`/`wb-allocation-table`/`wb-balance-transfer-drawer`/`wb-client-view`/`wb-confirm-save-modal`.
- **Shared `libs/falcon`:** `shared-features/user-details/.../user-details-page.component.html:61`, `comm-mkt-view` + card/view-toggle, `service-pricing-table`, `shared-ui` `otp-dialog`, `falcon-view-toggle`, `falcon-tree-panel`, `falcon-status-chip`, `falcon-form-field`, `falcon-org-node-header`, plus `shared-utils/.../messages.ts`.
- **Other host-shell:** `do-payment-priority-popup`, `service-pricing`, `app.ts`.
- **`libs/falcon-ui-core`:** `falcon-data-table.component.ts:1`, `falcon-table-tw.tsx:1`, `falcon-unsaved-changes.service.ts` (the Stencil/wrapper layer also consults translations).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Examples cite live files; pipe-vs-service counts grep'd this pass; backend-error-key compose path confirmed against shared-utils `messages.ts`. The `dir="rtl"` Don't is `[INFERRED]` for this layer (no direction code in `libs/falcon/src/language`).
