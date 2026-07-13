# falcon-shared-utils — USAGE

> Real codebase examples (cite file), recommended usage, Do/Don't, and the grep-verified Consumer Sweep.

## Real codebase examples

### Registry via DI (preferred in DI scope)

`[CODE]` `provideFalconValidations()` is registered in `admin-console/app.config.ts:72` + `management-console/app.config.ts:70`. Feature forms then resolve it. `[CODE]` `add-user-wizard/user-personal-step/validations/validations.ts:30` comment notes the resolved registry "is the one registered by host-shell's provideFalconValidations() and Angular DI" — i.e. forms inject `FALCON_VALIDATIONS` and read `.personName()` / `.userName()` / `.userNameUnique(...)`.

```ts
private v = inject(FALCON_VALIDATIONS);
form = this.fb.group({
  firstName: ['', [this.v.personName()]],
  username:  ['', [this.v.userName()], [this.v.userNameUnique(check, FALCON_RESERVED_USERNAMES, this.pending)]],
});
```

### Named-validator aliases (non-DI callers)

`[CODE]` `named-validators.ts:1-3` — for services/model helpers that can't resolve the token:
```ts
import { accountNameValidator, priceValueValidator, PRICE_VALUE_MAX_DIGITS } from '@falcon';
control.setValidators([accountNameValidator]);
// HTML mirror so keystrokes are refused at the browser layer:
// <falcon-angular-input [maxlength]="PRICE_VALUE_MAX_DIGITS">
```

### Generic primitives (reach for these over bespoke)

`[CODE]` `named-validators.ts:73-126` documents the reuse recipes:
```ts
integerInRangeValidator(0, 100, true)        // any closed integer range
numberInRangeValidator(0, 999_999_999, false)// decimals, conditional
enumValidator(new Set(['draft','published']), true)
lengthValidator(2, 50, true)                 // any string length band
startsWithLetterValidator                    // first char must be a letter
```

### `isFormValid` / per-field error computeds (signal-friendly helpers)

`[CODE]` `falcon-validations.ts:838-879` — `allFieldsValid` + `fieldErrorMessage` are built for `computed()` step hosts:
```ts
isStepValid = computed(() => allFieldsValid(this.value(), RULES));
firstNameError = computed(() =>
  fieldErrorMessage(this.value(), 'firstName', RULES, this.touched()));
```
(`fieldErrorMessage` applies the `LIVE_ERROR_KEYS` gate from `messages.ts` so e.g. `minLength` shows pre-touch.)

### Error-key → localized message (composes with @falcon language)

`[CODE]` `messages.ts` imports `TranslateService`. Pattern:
```ts
const msg = messageFor(control.errors);            // → { key:'hierarchy.validation.accountNameCharset' }
if (msg) this.errorText.set(this.i18n.translate(msg.key, msg.params as any));
// backend error:
this.notifier.error(this.i18n.translate(keyForBackendCode(serviceError.code)));
```
Both i18n bundles carry `hierarchy.validation` (43 keys, verified 2026-06-03).

### IP allowlist directive

`[CODE]` `libs/falcon/src/shared-ui/lib/directives/falcon-ip-address.directive.ts` (6 `isValidIp`/`detectMode`/`sanitize` uses) drives the allowlist input: `detectMode(typed)` → lock mode → `sanitize(value, mode)` on input → `isValidIp(value, mode)` on commit. The registry's `allowedIpList()` validates the resulting array.

### Synthetic-root guard on the wire

`[CODE]` org-hierarchy + contact-group + user-api services (12 files, 44 uses):
```ts
let params = new HttpParams();
params = appendNodeId(params, this.selectedNodeId());          // NodeId=<id> OR omitted for Falcon root
if (isRealNodeId(id)) { /* fire node-scoped read */ }
```
`[CODE]` `node-scope.util.ts:9-12` — the synthetic `FALCON_ROOT_NODE.id` is not a Mongo ObjectId; sending it would 400/500 the backend. Always guard before attaching.

### Contact-group DTO → table VM

`[CODE]` `contact-group-api.service.ts` (admin + mgmt, 5 uses each) calls `mapContactGroupsResponseToTableRows(dtos)` to turn the list endpoint into `FalconTable` rows (status chips + shared-with chips + dd/mm/yyyy formatting).

### `getCssVariable`

`[CODE]` `wallet-balance-management.component.ts` (admin 4, mgmt 2) + `settings-tab.component.ts` read theme tokens in TS, e.g. `getCssVariable('--color-falcon-teal-700', '#0f766e')`.

## Recommended new usage

1. **In DI scope?** `inject(FALCON_VALIDATIONS)` and call `.xxx()` (testable, overridable). **Outside DI?** import the named alias.
2. **Rule reduces to a shape?** Use a generic primitive (`integerInRange`/`enumOf`/`length`/…) — do NOT invent a bespoke validator (`named-validators.ts:75-77` mandate).
3. **Charset BEFORE length** is the registry convention — follow it if you ever add a field validator.
4. **Async unique?** Pass a `backendCheck: (v) => Observable<boolean>`; optionally a `pendingSignal` to gate the Next button.
5. **Error display?** `messageFor(errors)` → `translate(key, params)`. Backend error? `keyForBackendCode(code)`.
6. **Node-scoped request?** Always `appendNodeId(...)` / guard with `isRealNodeId(...)`.
7. **New validator that mirrors an xlsx field?** Annotate it against `Validations.xlsx` + note any superseded PRD rule (the registry's audit-trail convention).
8. **Never** import the legacy `falcon-validators.ts` symbols in new code (deprecated).

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `inject(FALCON_VALIDATIONS).accountName()` | `startWithLetterMax30Validator()` (deprecated shim) |
| `integerInRangeValidator(0,999,true)` for a range | Hand-roll a new `(c)=>{…}` range validator |
| `messageFor(errors)` → `translate(key)` | Show raw `JSON.stringify(errors)` or hardcoded English |
| `appendNodeId(params, id)` before a node read | `params.set('NodeId', selectedId)` (sends synthetic root → 500) |
| Use the `pendingSignal` of `userNameUnique` to disable Next | Re-implement debounce/uniqueness inline |
| `mapContactGroupsResponseToTableRows(dtos)` | Map DTO→row inline in the component |
| Override a rule via `provideFalconValidations({ registry })` | Fork the registry file per app |
| Keep `FalconHierarchyNode` structural | Import a feature's concrete `ClientNode` into the registry |

## Consumer Sweep (grep verified 2026-06-03)

- `[CODE]` `FALCON_VALIDATIONS` / `defaultFalconValidationsRegistry`: **13 files** —
  `admin-console/app.config.ts`, `management-console/app.config.ts` (provider wiring);
  `apps/{admin,management}-console/.../add-user-wizard/user-personal-step/validations/validations.ts`;
  `apps/{admin,management}-console/.../falcon-org-node-drawer.component.ts`;
  `libs/falcon/src/shared-features/service-pricing-table/validations/validations.ts`;
  + the 5 registry source files.
- `[CODE]` `provideFalconValidations()`: **admin-console + management-console app.config ONLY** (host-shell does not register it).
- `[CODE]` `isRealNodeId`/`appendNodeId`/`isFalconRootId`: **44 occ / 12 files** —
  `apps/host-shell/.../organization-hierarchy-tree/services/services.ts` (5);
  `apps/{admin,management}-console/.../org-hierarchy-page/services/services.ts` (5 ea);
  `.../org-hierarchy-page/services/state/users-state.signals.ts`;
  `.../settings-tab/services/settings.service.ts` (3 ea) + `settings-tab.signals.ts` (mgmt 4);
  `.../falcon-org-info-panel/services/information.service.ts` (2 ea);
  `apps/{admin,management}-console/.../contact-groups/services/contact-group-api.service.ts` (3–4);
  `apps/host-shell/.../core/user/user-api.service.ts` (3).
- `[CODE]` `isValidIp`/`detectMode`/`getCssVariable`/`mapContactGroup`: **47 occ / 15 files** —
  `libs/falcon/src/shared-ui/lib/directives/falcon-ip-address.directive.ts` (6, IP);
  `apps/{admin,management}-console/.../wallet-balance-management.component.ts` (4/2, getCssVariable);
  `apps/{admin,management}-console/.../settings-tab.component.ts` (2 ea);
  `apps/{admin,management}-console/.../contact-groups/services/contact-group-api.service.ts` (5 ea, mapper) + `models/models.ts`;
  `client-settings-step.component.{ts,html}`.
- `[CODE]` Legacy shim (`FALCON_PATTERNS` etc.): consumed by `falcon-form-validate.directive.ts` (the documented sole survivor reason).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Examples cite live files; all 4 consumer-group counts grep'd this pass; provider-wiring scope (admin/mgmt only) confirmed; error-key↔i18n compose path confirmed against `messages.ts` + the i18n bundle namespaces.
