# falcon-image-uploader — API

## Selectors

- Angular: `falcon-angular-image-uploader`
- Stencil Shadow: `<falcon-image-uploader>` (tag `'falcon-image-uploader'`, `shadow: true`)
- Stencil Light: `<falcon-image-uploader-tw>` (tag `'falcon-image-uploader-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularImageUploaderComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-image-uploader';
// or via barrel:
import { FalconAngularImageUploaderComponent } from '@falcon/ui-core';
```

Add `FalconAngularImageUploaderComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally (`[CODE]` falcon-image-uploader.component.ts:42) — the host does NOT need it.

## Inputs (all on `FalconAngularImageUploaderComponent`, signal `input()` — NOT `@Input` decorators)

> `[CODE]` falcon-image-uploader.component.ts uses Angular **signal inputs** (`input<T>(default)`), so every binding is read as `name()` in the template. Most defaults are **DI-seeded** from `inject(FALCON_UPLOADER_DEFAULTS).image` (ts:76) so an app-wide `provideFalconUploader({ defaults: { image: {…} } })` flows in without per-instance binding; per-instance `[input]` always wins.

### Copy / labels

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | `[CODE]` ts:81 — title rendered **inside the row** (`.fu-label`), never a top form-`<label>`. |
| `helperText` | `string` | `''` | `[CODE]` ts:82 — sub-label under the title. |
| `buttonText` | `string` | `_defaults.buttonText` (`'Upload Photo'`) | `[CODE]` ts:83 / falcon-image-uploader.tsx:66. |
| `dragHintText` | `string` | `_defaults.dragHintText` (`'Drag a file here or'`) | `[CODE]` ts:84. |
| `ariaLabel` | `string \| undefined` | `undefined` | `[CODE]` ts:85 — feeds the native input + row `aria-label`. |

### Validation / behavior

| Name | Type | Default | Notes |
|---|---|---|---|
| `accept` | `string` | `'png,jpg,jpeg'` | `[CODE]` ts:88 — **bare extensions** (parsed by `parseExtList`), not MIME. |
| `maxSizeMB` | `number` | `2` | `[CODE]` ts:89 / falcon-image-uploader.tsx:73 — client-side size cap; rejection emits `fileError(code:'too-large')`. |
| `multiple` | `boolean` | `false` | `[CODE]` ts:90 — single-avatar by default. |
| `maxStackVisible` | `number` | `4` | `[CODE]` ts:91 — overlapping-circle stack cap (multi-file). |
| `dragDrop` | `boolean` | `true` | `[CODE]` ts:92. |
| `clickToBrowse` | `boolean` | `true` | `[CODE]` ts:93. |
| `required` | `boolean` | `false` | `[CODE]` ts:94 — sets native `required` (reflected on Stencil). |
| `disabled` | `boolean` | `false` | `[CODE]` ts:99 — **explicit input**, OR-combined with the CVA disabled-state via `effectiveDisabled` (ts:164). |

### Visual

| Name | Type | Default | Notes |
|---|---|---|---|
| `size` | `FalconFileUploaderSize` (`'sm'\|'md'\|'lg'`) | `'md'` | `[CODE]` ts:102 (reflected on Stencil). |
| `shape` | `FalconFileUploaderShape` (`'square'\|'rounded'\|'pill'\|'circle'`) | `'circle'` | `[CODE]` ts:103 (reflected). |
| `borderStyle` | `FalconFileUploaderBorderStyle` (`'dashed'\|'solid'\|'none'`) | `'dashed'` | `[CODE]` ts:104. |
| `progressMode` | `FalconFileUploaderProgressMode` (`'water'\|'bar'\|'laser'`) | `'water'` | `[CODE]` ts:105 — `laser` reinstated 2026-05-30. |
| `showWaves` | `boolean` | `true` | `[CODE]` ts:106. |
| `showPins` | `boolean` | `true` | `[CODE]` ts:107 — edit/delete corner pins. |
| `showBanner` | `boolean` | `true` | `[CODE]` ts:108 — success/error banner below row. |
| `showDragHint` | `boolean` | `true` | `[CODE]` ts:109. |

### Multi-file

| Name | Type | Default | Notes |
|---|---|---|---|
| `filterMode` | `FalconFileUploaderFilterMode` (`'all'\|'errors'\|'success'\|'uploading'`) | `'all'` | `[CODE]` ts:112. |
| `showSuccessRing` | `boolean` | `true` | `[CODE]` ts:113. |
| `showStatusBadge` | `boolean` | `true` | `[CODE]` ts:114. |
| `showErrorCode` | `boolean` | `true` | `[CODE]` ts:115 — T2-EXT/SIZE/NET chip. |
| `showCountBadge` | `boolean` | `true` | `[CODE]` ts:116. |
| `countBadgeClickable` | `boolean` | `true` | `[CODE]` ts:117. |
| `stackClickable` | `boolean` | `true` | `[CODE]` ts:118. |
| `autoCycle` | `boolean` | `false` | `[CODE]` ts:119 — auto-rotate the stack (multi only). |
| `autoCycleSpeed` | `number` | `3` | `[CODE]` ts:120 — seconds per rotation. |

### Error message + i18n templates (consumer feeds translated strings)

`[CODE]` ts:123-147 — `errorMessage` (override) plus 26 template strings: `extErrorTemplate`, `sizeErrorTemplate`, `networkErrorTemplate`, `successBannerTemplate`, `uploadingStatusText`, `successStatusText`, `addMoreText`, `retryText`, `retryAllText`, `removeText`, `replaceText`, `showFilesText`, `hideFilesText`, `noFilesMatchText`, `countFilesText`, `fileWord`, `filesWord`, `multiUploadingTemplate`, `multiMixedTemplate`, `multiAllSuccessTemplate`, `multiAllFailedTemplate`, `multiSubUploadingTemplate`, `multiSubFailedTemplate`, `multiSubSuccessTemplate`. Each accepts a placeholder set (`{exts}`, `{max}`, `{name}`, `{done}`, `{total}`, `{pct}`, `{ok}`, `{fail}`, `{n}`).

### Render-path switch + class extension

| Name | Type | Default | Notes |
|---|---|---|---|
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:150 — `true` → `<falcon-image-uploader-tw>` (Light DOM, **the default**); `false` → `<falcon-image-uploader>` (Shadow DOM). |
| `rootClass` | `string` | `''` | `[CODE]` ts:151 — forwarded as `[class]` on the inner Stencil element (BOTH paths). |

## Outputs (signal `output()`)

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `ReadonlyArray<FalconFileUploaderFile>` | `[CODE]` ts:154 — fires on the Stencil `falcon-change`; also drives CVA `onChange`. |
| `fileAdd` | `FalconFileUploaderAddDetail` (`{ file, nativeFile: File }`) | `[CODE]` ts:155 — fires for EVERY picked/dropped file; **carries the raw `File`** so the consumer drives the real upload (this is the BASE64-critical hook — see USAGE/INTEGRATION). |
| `fileRemove` | `FalconFileUploaderRemoveDetail` (`{ file }`) | `[CODE]` ts:156. |
| `fileRetry` | `FalconFileUploaderRetryDetail` (`{ file }`) | `[CODE]` ts:157. |
| `fileError` | `FalconFileUploaderErrorDetail` (`{ code: 'wrong-type'\|'too-large', file?, nativeFile? }`) | `[CODE]` ts:158 — client-side ext/size rejection. |

> `[CODE]` ts:217-219 — the Stencil `falcon-blur` is bound (`handleBlur`) and routed to CVA `onTouched()` ONLY; it is **not** re-emitted as an Angular `@Output` (parity note, not a defect — touched-tracking works).

## TypeScript types

`libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.types.ts` (re-exported via the wrapper's `index.ts`):

```ts
type FalconFileUploaderFileStatus = 'queued' | 'uploading' | 'success' | 'error';
type FalconFileUploaderVariant = 'image' | 'document';
type FalconFileUploaderSize = 'sm' | 'md' | 'lg';
type FalconFileUploaderShape = 'square' | 'rounded' | 'pill' | 'circle';
type FalconFileUploaderBorderStyle = 'dashed' | 'solid' | 'none';
type FalconFileUploaderProgressMode = 'water' | 'bar' | 'laser';
type FalconFileUploaderFilterMode = 'all' | 'errors' | 'success' | 'uploading';
type FalconFileUploaderErrorCode = 'wrong-type' | 'too-large';

interface FalconFileUploaderFile {
  readonly id: string; readonly name: string; readonly size: number; readonly type: string;
  readonly status: FalconFileUploaderFileStatus;
  readonly progress?: number; readonly errorMessage?: string;
  readonly errorCode?: 'extension' | 'size' | 'network';
  readonly url?: string; readonly previewUrl?: string;
}
interface FalconFileUploaderAddDetail { readonly file: FalconFileUploaderFile; readonly nativeFile: File; }
interface FalconFileUploaderChangeDetail { readonly files: ReadonlyArray<FalconFileUploaderFile>; }
interface FalconFileUploaderRemoveDetail { readonly file: FalconFileUploaderFile; }
interface FalconFileUploaderRetryDetail { readonly file: FalconFileUploaderFile; }
interface FalconFileUploaderErrorDetail { readonly code: FalconFileUploaderErrorCode; readonly file?: …; readonly nativeFile?: File; }
interface FalconFileUploaderBlurDetail { readonly files: ReadonlyArray<FalconFileUploaderFile>; }
```

## Reflected props (Stencil only)

`[CODE]` `disabled`, `required`, `size`, `shape` are `@Prop({ reflect: true })` on BOTH Stencil tags (falcon-image-uploader.tsx:77-82 / -tw:74-78) so CSS / token selectors can target `[size]`, `[shape]`, `[disabled]`. The remaining props are non-reflected.

## Mutable props (Stencil)

`[CODE]` `files: ReadonlyArray<FalconFileUploaderFile>` is `@Prop({ mutable: true })` on both tags (tsx:102 / -tw:96). The Angular wrapper drives it via the internal `files` signal (CVA) — bind via `[(ngModel)]`/`formControlName`, never set `[files]` directly on the wrapper (it has no public `files` input — `[CODE]` client-information-step.component.html:9 comment).

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor.** `[CODE]` ts:44-50 + 168-183:

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularImageUploaderComponent), multi: true }],
```

- `writeValue(value)` — `this.files.set(value ?? [])` (ts:172).
- `registerOnChange(fn)` — invoked on `falcon-change` (ts:185-191).
- `registerOnTouched(fn)` — invoked on `falcon-blur` (ts:217).
- `setDisabledState(isDisabled)` — sets `disabledSig`, OR-combined with the explicit `disabled` input (ts:181 + 164).

The **value is the file-descriptor array** (`FalconFileUploaderFile[]`), NOT a raw File. The raw `File` rides `fileAdd.nativeFile`.

## Signal compatibility

`[CODE]` Fully signals-first: signal `input()`/`output()`, internal `files`/`disabledSig` signals + `effectiveDisabled` `computed`, `OnPush`. Zoneless-safe.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `setFiles(next)` | Replace the entire file list + emit `falcon-change` (consumer drives progress). | BOTH tags `[CODE]` falcon-image-uploader.tsx:179 / -tw:168 |
| `openFileDialog()` | Programmatically open the native picker (no-op if disabled). | BOTH tags `[CODE]` tsx:186 / -tw:174 |
| `setFocus()` | Focus the inner native input. | BOTH tags `[CODE]` tsx:193 / -tw:180 |

> `[CODE]` The Angular wrapper does NOT proxy these methods — there is no Angular-side `setFiles()` / `setFocus()` on `FalconAngularImageUploaderComponent` (GAP G-method). The CVA value drives the file list in Angular; the methods exist for raw-tag consumers.

## Slots / template inputs

`[CODE]` **No `<slot>`s and no `ng-template` inputs.** Both Stencil tags render a self-contained row (native `<input type="file">` + `.fu-wrap` → row + banner + file-list). All copy/icons are prop-driven. The Angular wrapper's HTML binds every prop on both branches but projects no content.

## Supported sizes / states / shapes / progress modes

- Sizes: `sm` / `md` / `lg`.
- Shapes: `square` / `rounded` / `pill` / `circle` (default `circle`).
- Border styles: `dashed` (default) / `solid` / `none`.
- Progress modes: `water` (default, bottom-up fill) / `bar` (bottom edge) / `laser` (2px glowing pulsing edge).
- Per-file status: `queued` / `uploading` / `success` / `error` (consumer-driven).
- Error codes (client-side only): `wrong-type` / `too-large`.

## Constraints

- `[CODE]` **No mock upload** — the component only validates ext+size; the consumer MUST drive `status`/`progress`/`url` via the CVA value (or `setFiles()`). file-uploader.types.ts:6.
- `[CODE]` **`accept` is bare extensions** (`png,jpg,jpeg`), not MIME — parsed by `parseExtList`; the native `<input accept>` is built as `.png,.jpg,.jpeg` (tsx:339).
- `[CODE]` **No public `files` input on the wrapper** — drive the value via CVA; binding `[files]` is not exposed (client-information-step.component.html:9 comment).
- `[CODE]` **Shadow `handleRootClick` uses class selectors** (`.fu-list`, `.fu-banner`) while the `-tw` twin uses `[data-fu-part]` attribute selectors (tsx:224 vs -tw:211) — an internal render-detail divergence; public API parity holds.
- `[CODE]` **The DI-defaults gate (`definedTw`)** delays the `-tw` element until `customElements.define` resolves (ts:53-66) — load-bearing: without it, Angular sets element properties before upgrade and the component renders with its declared defaults, ignoring bindings.

## Accessibility

- `[CODE]` Native `<input type="file">` keeps `aria-label = ariaLabel ?? label ?? buttonText` (tsx:343 / -tw:330).
- `[CODE]` The clickable row is `role="button"`, `tabIndex = disabled ? -1 : 0`, with `aria-label`, `aria-disabled` (via `ariaBool`), and `aria-invalid` set when `errorMessage` is non-empty (tsx:362-367 / -tw:349-354).
- `[CODE]` Keyboard: Enter / Space on the row open the native picker, with a guard that ignores keys originating on inner buttons/tabbables (tsx:228-236 / -tw:215-223).
- `[CODE]` Drag-over uses `dropEffect = 'copy'` + a `dragOver` state for the active border (tsx:238-255).
- `[CODE]` `disabled` blocks open/drag/keyboard at every entry point (`openPicker`, `handleRootKeyDown`, `handleDrop`, `openFileDialog`).
- `[INFERRED]` The label renders inside the row only (no top `<label for>`); association relies on the row's `role="button"` + `aria-label` and the native input's own `aria-label` — flag A1 (no explicit `<label htmlFor>` element).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) against falcon-image-uploader.component.ts (220 ln), .component.html (136 ln), falcon-image-uploader.tsx (385 ln), falcon-image-uploader-tw.tsx (372 ln), file-uploader.types.ts (84 ln). Shadow + `-tw` prop/event/method sets compared line-by-line → 1:1 parity (only internal `handleRootClick` selector strategy differs). No `<slot>`s; CVA value = descriptor array; raw File via `fileAdd.nativeFile`.
