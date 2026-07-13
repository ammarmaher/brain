# falcon-shared-utils — SURFACE (full public API / export inventory)

> Every exported symbol of `@falcon` `shared-utils`, source-prefixed with signature + one-line purpose. Barrel: `libs/falcon/src/shared-utils/index.ts` (re-exports utils, the validations sub-barrel, and a curated legacy shim).

## Barrel order + collision note

`[CODE]` `index.ts`: utils (4 files) → `./lib/validations` (FIRST, so the new `emailValidator` **const** wins) → legacy shim (explicit named re-exports, `emailValidator` deliberately OMITTED to resolve the name collision with the registry alias). The barrel comment documents this precedence explicitly (`index.ts:7-26`).

---

## 1. Utils — `lib/utils/`

### `ip-utils.ts` (142 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `IpMode` | `type = 'unknown' \| 'ipv4' \| 'ipv6'` | Active IP-entry mode. | `:4` |
| `detectMode` | `(value: string): IpMode` | `:`→ipv6, `.`(no `:`)→ipv4, else unknown. | `:7-12` |
| `sanitize` | `(value: string, mode: IpMode): string` | Strip disallowed chars per mode (ipv4 = `[0-9./]`; ipv6 = `[0-9a-fA-F:.%/]`). | `:17-28` |
| `isWrongFormat` | `(value: string, mode: IpMode): boolean` | True if value is wrong-shape for a LOCKED mode (used to refuse paste). | `:31-36` |
| `isValidIpv4` | `(value: string): boolean` | 4 octets 0–255 + optional `/0..32` CIDR. | `:59-67` |
| `isValidIpv6` | `(value: string): boolean` | Full / `::`-compressed / IPv4-mapped tail / loopback / unspecified + optional `%zone` + `/0..128`. Rejects bracketed `[…]`. | `:73-107` |
| `isValidIp` | `(value: string, mode: IpMode): boolean` | Mode-aware: ipv4→`isValidIpv4`, ipv6→`isValidIpv6`, unknown→either. | `:133-141` |

*Private (not exported):* `stripCidr`, `stripZoneId`, `checkHexIpv6Shape`, `isHexGroup` (`:39-130`).

### `theme-utils.ts` (13 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `getCssVariable` | `(variable: string, fallback = ''): string` | Read a computed CSS custom property off `document.documentElement`; SSR-safe (returns `fallback` when `document` undefined). | `:6-12` |

### `contact-group.mapper.ts` (92 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `mapContactGroupDtoToTableRow` | `(dto: ContactGroupListItemDto): ContactGroupTableRowVm` | One DTO → table row VM (date/time format, shared-with chips, status normalize; `processedRows/totalRows`=0 until backend exposes progress). | `:17-42` |
| `mapContactGroupsResponseToTableRows` | `(dtos: ContactGroupListItemDto[]): ContactGroupTableRowVm[]` | Array map over the above. | `:47-51` |

*Private:* `buildSharedUserDisplayName`, `buildSharedWithChips`, `formatDate` (dd/mm/yyyy), `formatTime` (hh:mm am/pm) (`:56-91`). *Imports* `ContactGroup*` types + `CONTACT_GROUP_STATUS_LABELS`/`normalizeContactGroupStatus` from `@falcon` shared-types.

### `node-scope.util.ts` (45 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `isRealNodeId` | `(id: string \| null \| undefined): id is string` | Type-guard: truthy AND not `FALCON_ROOT_NODE.id`. | `:13-15` |
| `isFalconRootId` | `(id: string \| null \| undefined): boolean` | True iff id IS the synthetic root id (distinct from "no node selected"). | `:22-24` |
| `appendNodeId` | `(params: HttpParams, id, key = 'NodeId'): HttpParams` | Set `key=id` ONLY when `isRealNodeId(id)`; else return params unchanged (never send synthetic root on the wire). Immutable — must use return value. | `:38-44` |

*Imports* `FALCON_ROOT_NODE` from `@falcon` shared-types `globals`.

---

## 2. Validations registry — `lib/validations/`

### `falcon-validation.token.ts` (24 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `FalconFieldRules<T>` | `type = { readonly [K in keyof T]?: ReadonlyArray<ValidatorFn \| AsyncValidatorFn> }` | Type-safe per-field rule map (key suggestions from the form-value shape). | `:11-13` |
| `FALCON_VALIDATIONS` | `InjectionToken<FalconValidationsRegistry>` | Root DI token consumers resolve. | `:16` |
| `FALCON_RESERVED_USERNAMES` | `ReadonlySet<string>` = `{admin,root,system,falcon,test}` | Default reserved-usernames seed for `userNameUnique`. | `:21-23` |

### `provide-falcon-validations.ts` (24 ln)

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `ProvideFalconValidationsOptions` | `interface { readonly registry?: FalconValidationsRegistry }` | Optional override to swap factories. | `:9-12` |
| `provideFalconValidations` | `(opts?: ProvideFalconValidationsOptions): EnvironmentProviders` | `makeEnvironmentProviders([{ provide: FALCON_VALIDATIONS, useValue: opts.registry ?? defaultFalconValidationsRegistry }])`. | `:14-23` |

### `falcon-validations.ts` (880 ln) — the registry

**Exported types/interfaces:**

| Symbol | Definition | Source |
|---|---|---|
| `FalconPasswordSecurityLevel` | `type = 'normal' \| 'advanced' \| 1 \| 2` (string union OR numeric enum for back-compat). | `:118` |
| `FalconRoleAssignmentOptions` | `interface { validRoleKeys?; adminRoleKeys?; callerRole? }` (all `ReadonlySet<string>`/`string`). | `:143-147` |
| `FalconValidationsRegistry` | `interface` — the 30 factory methods below. | `:219-371` |
| `FalconHierarchyNode` | `interface { id; type?; children?; accountSettings?:{maxNodeLevel?} }` (structural — no concrete tree import). | `:376-381` |

**Exported values:**

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `defaultFalconValidationsRegistry` | `FalconValidationsRegistry` | The concrete registry literal (all factories). | `:386-792` |
| `allFieldsValid` | `<T>(value: T, rules: FalconFieldRules<T>): boolean` | True iff every field passes every SYNC rule (async skipped). For `isFormValid` computeds. | `:838-855` |
| `fieldErrorMessage` | `<T>(value: T, field: keyof T, rules: FalconFieldRules<T>, touched: ReadonlySet<string>): ValidationMessage \| null` | One field's current error using rule array + `LIVE_ERROR_KEYS` gate + touched-set (async skipped). | `:860-879` |

**`FalconValidationsRegistry` methods** (each returns a `ValidatorFn`/`AsyncValidatorFn`; `r = defaultFalconValidationsRegistry`):

*Semantic (xlsx-named) validators:*
- `required()` — string OR number non-empty (`:387-392`).
- `lettersAndDigits()` — Unicode letters/digits/whitespace; empty passes (`:394-398`).
- `lettersDigitsOrEmail()` — letters+digits OR full email (`:400-404`).
- `nationalId()` — optional; if present exactly 10 digits (`:406-412`).
- `anyString(min?,max?,required=true)` — trimmed required, RAW-length min/max (Wave E "space counts") (`:414-431`).
- `accountName()` — xlsx 2–30, charset `[\p{L}\p{N} &'-]`, charset-before-length, no starts-with-letter (BR-AM-03 superseded) (`:433-460`).
- `accountNameUnique(backendCheck, debounceMs=250)` — async `timer→switchMap→duplicateAccountName` (`:462-469`).
- `nodeName()` — BUG-08: identical to `accountName()` (charset+2–30) (`:471-489`).
- `personName()` — xlsx 2–50, edge-whitespace rejected, charset `[\p{L}\p{N} '-]` (no `&`) (`:491-519`).
- `userName()` — xlsx 2–30, charset `[\p{L}\p{N}._+-]`-or-email, EN only (`:521-545`).
- `userNameUnique(backendCheck, reservedSet?, pendingSignal?, debounceMs=250)` — async; reserved-set short-circuit; `pendingSignal` toggled via `untracked()` (NG0600 fix) (`:547-577`).
- `email()` — required + RFC + max 50 (`:579-586`).
- `phone()` — E.164, all-whitespace stripped (`:588-595`).
- `saudiPhone()` — `+966` + 9 digits (`:597-602`).
- `password(level='normal')` — Normal(8/U/L/D) vs Advanced(12/U/L/D/special) rule set (`:604-615`).
- `roleAssignment(opts?)` — valid-role + admin-elevation guard (`:617-628`).
- `permissionGroup()` — required only (BR-UM-42) (`:630-635`).
- `maxNodeLevels()` / `userLimit()` — `integerInRangeFn(0, 999, true)` (`:641-642`).
- `allowedIpList()` — array of IPv4/IPv6/CIDR strings (`CIDR_OR_IP`) (`:644-655`).
- `priceValue(required=false)` — `integerInRangeFn(0, 999_999_999_999_999, required)` (`:663`).
- `digitsOnly(min?,max?,required=false)` — `\d+` charset-before-length on RAW value (`:665-680`).
- `passwordSecurityLevel()` — `enumFn({'normal','advanced'}, true)` (`:684`).

*Generic primitives (Wave C — reach for these first):*
- `integerInRange(min?,max?,required=true)` (`:687`).
- `numberInRange(min?,max?,required=false)` — decimals allowed (`:688`).
- `enumOf<T>(allowed: ReadonlySet<T>, required=true)` (`:689`).
- `lettersAndDigitsOnly()` — strict no-spaces Unicode letters+digits; empty passes (`:691-697`).
- `startsWithLetter()` — first char `\p{L}`; empty passes (`:699-704`).
- `whitespace(mode: 'no-edges' | 'none')` — edge-trim vs any-whitespace guard (xlsx "Allow Spaces?") (`:706-720`).

*Group-level (cross-field, hierarchy-aware — take a `treeProvider`):*
- `hierarchyDepthGuard<TNode>(treeProvider, parentIdField='parentId')` — relative depth vs `accountSettings.maxNodeLevel` (fallback 999) (`:722-737`).
- `passwordsMatch(newField='newPassword', confirmField='confirmPassword')` (`:739-746`).
- `parentMustExist<TNode>(treeProvider, parentIdField='parentId')` (`:748-758`).
- `cannotMoveUnderSelf<TNode>(treeProvider, idField='id', newParentField='parentId')` (`:760-782`).

*Helper:*
- `runValidators(control, ...vs): ValidationErrors | null` — run + merge sync validators (`:784-791`).

*Private (not exported):* regex/length constants (`:24-111`), `passwordRuleFor`, `sval`/`nval`, `integerInRangeFn`/`numberInRangeFn`/`enumFn` (`:178-214`), tree helpers `findNodeById`/`pathToNode`/`depthOf`/`findAccountAncestor` (`:798-831`).

### `named-validators.ts` (173 ln) — aliases over `defaultFalconValidationsRegistry`

> For non-DI callers (services, model helpers). DI callers should prefer `inject(FALCON_VALIDATIONS)` (testability/override).

**Const `ValidatorFn`s (bound once):** `lettersAndDigits`, `lettersDigitsOrEmail`, `nationalIdValidator`, `accountNameValidator`, `nodeNameValidator`, `personNameValidator`, `userNameValidator`, `emailValidator` (the const that WINS the barrel collision), `phoneValidator`, `saudiPhoneValidator`, `permissionGroupValidator`, `userLimitValidator`, `allowedIpListValidator`, `passwordSecurityLevelValidator`, `requiredValidator`, `startsWithLetterValidator`, `lettersAndDigitsOnlyValidator` (`:26-98`).

**Factory fns:** `anyStringValidator(min?,max?,required?)`, `digitsOnlyValidator(min?,max?,required?)`, `priceValueValidator(required?)`, `whitespaceValidator(mode)`, `lengthValidator(min?,max?,required?)` (aliases `anyString`), `integerInRangeValidator`, `numberInRangeValidator`, `enumValidator<T>(allowed,required?)`, `passwordValidator(level?)`, `roleAssignmentValidator(opts?)`, `maxNodeLevelsValidator(_hardCap?)` (arg ignored — BR-AM-11), `passwordsMatch(newField?,confirmField?)`, `accountNameUniqueValidator(backendCheck,debounceMs?)`, `userNameUniqueValidator(backendCheck,reservedSet?,pendingSignal?,debounceMs?)`, `hierarchyDepthGuard<TNode>(...)`, `parentMustExist<TNode>(...)`, `cannotMoveUnderSelf<TNode>(...)` (`:44-170`).

**Constants:** `PRICE_VALUE_MAX_DIGITS = 15`, `USER_LIMIT_MAX_DIGITS = 3` (HTML `maxlength` mirrors) (`:63,71`).

**Bound helper:** `runValidators = r.runValidators.bind(r)` (`:172`).

### `messages.ts` (150 ln) — error-key → i18n-key catalog

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `ValidationMessage` | `interface { readonly key: string; readonly params? }` | A resolvable i18n key + optional params. | `:7-10` |
| `hasLiveError` | `(errs): boolean` | True if any error is in `LIVE_ERROR_KEYS` (show immediately, pre-touch). | `:89-93` |
| `messageFor` | `(errors): ValidationMessage \| null` | First matching error → message (or `${KEY}.unknown`). | `:95-102` |
| `messagesFor` | `(errors): readonly ValidationMessage[]` | ALL errors → messages. | `:104-109` |
| `BACKEND_ERROR_KEY` | `Readonly<Record<string,string>>` | Backend `FalconKeys.Error` code → `hierarchy.validation.*` key (≈35 entries). | `:111-139` |
| `ServiceErrorEnvelope` | `interface { code; message }` | Service-error shape. | `:141-144` |
| `toServiceErrors` | `(errors): readonly ServiceErrorEnvelope[]` | Errors → `{code,message}[]`. | `:146-147` |
| `keyForBackendCode` | `(code: string): string` | `BACKEND_ERROR_KEY[code] ?? '${KEY}.unknown'`. | `:149` |

*Private:* `KEY = 'hierarchy.validation'` (`:12`), `VALIDATOR_KEYS` factory map (~50 keys) (`:14-67`), `LIVE_ERROR_KEYS` Set (`:69-87`).

---

## 3. Legacy shim — `lib/validators/falcon-validators.ts` (191 ln, `@deprecated v1.2.0`)

Re-exported by name from the barrel (`emailValidator` excluded):

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `FALCON_PATTERNS` | `{ EMAIL, PHONE, PHONE_STRING, EMAIL_STRING }` (RegExp + string forms) | Legacy regexes for HTML `pattern=`. | `:12-37` |
| `FALCON_VALIDATION_MESSAGES` | `Record<string,string>` | Static fallback message text (not i18n). | `:43-58` |
| `startWithLetterValidator()` | `(): ValidatorFn` | `[A-Za-z]` first char. | `:64-75` |
| `lettersAndDigitsMaxValidator(max)` | `(max: number): ValidatorFn` | `[A-Za-z0-9]+` + max-length. | `:80-90` |
| `usernameFormatValidator(max)` | `(max: number): ValidatorFn` | `[A-Za-z0-9._%+\-@]+` + max. | `:95-105` |
| `startWithLetterMax30Validator()` | `(): ValidatorFn` | Starts-with-letter AND ≤30. | `:111-129` |
| `phoneNumberValidator()` | `(): ValidatorFn` | Lenient non-E.164 phone. | `:135-146` |
| `getValidationErrorMessage(control)` | `(control: AbstractControl): string \| null` | Map control errors → static `FALCON_VALIDATION_MESSAGES` text. | `:152-190` |

> The barrel-omitted `emailValidator` legacy FUNCTION is shadowed by the registry's `emailValidator` CONST — the documented collision resolution (`index.ts:14-16`).

## Export count summary

- **Utils:** 3 fns + 1 type (`ip-utils` has 6 fns + `IpMode`; +`getCssVariable`; +2 contact-group mappers; +3 node-scope fns) → **12 value/type exports**.
- **Validations registry:** 4 types/interfaces + `defaultFalconValidationsRegistry` + `FALCON_VALIDATIONS` + `FALCON_RESERVED_USERNAMES` + `FalconFieldRules` + `provideFalconValidations` + `ProvideFalconValidationsOptions` + `allFieldsValid` + `fieldErrorMessage` + **~36 named-validator aliases/constants** + 8 `messages.ts` symbols → **~60 exports**.
- **Legacy shim:** 8 exported symbols (`emailValidator` fn deliberately not re-exported).
- **Registry surface depth:** `FalconValidationsRegistry` declares **30 factory methods** (`defaultFalconValidationsRegistry` implements all).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Every signature + line number lifted from source; the barrel `emailValidator` collision resolution and the named-validator↔registry binding traced; counts derived from the read files. No source edited.
