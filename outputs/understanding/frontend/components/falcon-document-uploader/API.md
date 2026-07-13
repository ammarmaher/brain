# falcon-document-uploader — API

## Selectors

- Angular: `falcon-angular-document-uploader`
- Stencil Shadow: `<falcon-document-uploader>` (tag `'falcon-document-uploader'`, `shadow: true`)
- Stencil Light: `<falcon-document-uploader-tw>` (tag `'falcon-document-uploader-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularDocumentUploaderComponent } from '@falcon/ui-core/angular';
import type {
  FalconFileUploaderFile,
  FalconFileUploaderAddDetail,
  FalconFileUploaderChangeDetail,
  FalconFileUploaderRemoveDetail,
  FalconFileUploaderRetryDetail,
  FalconFileUploaderErrorDetail,
  FalconFileUploaderSize,
  FalconFileUploaderShape,
  FalconFileUploaderBorderStyle,
  FalconFileUploaderProgressMode,
  FalconFileUploaderFilterMode,
} from '@falcon/ui-core/angular'; // shared types (re-exported via the image-uploader barrel)
```

Add `FalconAngularDocumentUploaderComponent` to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` ts:42). `[CODE]` The wrapper uses the modern **signal `input()/output()` API**, `OnPush`, and `inject()` (contrast single-uploader's legacy decorators).

> `[CODE]` **DI-seeded defaults:** most input defaults read from `inject(FALCON_UPLOADER_DEFAULTS).document` (ts:73) so an app can retune document-uploader defaults platform-wide via `provideFalconUploader({...})`. Per-instance `[input]` bindings always win.

## Inputs (Angular wrapper, all signal `input()`)

### Copy / labels
| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | `[CODE]` ts:76. Rendered INSIDE the row only (no separate top `<label>`); native input keeps `aria-label`. |
| `helperText` | `string` | `''` | `[CODE]` ts:77. |
| `buttonText` | `string` | `_defaults.buttonText` (`'Upload File'`) | `[CODE]` ts:78. Right-side upload button text. |
| `dragHintText` | `string` | `_defaults.dragHintText` (`'Drag a file here or'`) | `[CODE]` ts:79. |
| `ariaLabel` | `string \| undefined` | `undefined` | `[CODE]` ts:80. Fallback aria-label for the row + native input. |

### Validation / behavior
| Name | Type | Default | Notes |
|---|---|---|---|
| `accept` | `string` | `_defaults.accept` (`'xlsx,xls,csv,pdf,docx'`) | `[CODE]` ts:83. Comma list of bare exts; converted to `.xlsx,.xls,…` on the native input. |
| `maxSizeMB` | `number` | `_defaults.maxSizeMB` (`10`) | `[CODE]` ts:84. Client-side size cap (enforced → `falcon-error` code `too-large`). |
| `multiple` | `boolean` | `_defaults.multiple` (`false`) | `[CODE]` ts:85. Single vs multi-file. |
| `maxStackVisible` | `number` | `_defaults.maxStackVisible` (`4`) | `[CODE]` ts:86. Overlapping-circle stack cap (multi). |
| `dragDrop` | `boolean` | `_defaults.dragDrop` (`true`) | `[CODE]` ts:87. |
| `clickToBrowse` | `boolean` | `_defaults.clickToBrowse` (`true`) | `[CODE]` ts:88. |
| `required` | `boolean` | `false` | `[CODE]` ts:89. |
| `disabled` | `boolean` | `false` | `[CODE]` ts:94. OR-combined with the CVA `disabledSig` via `effectiveDisabled` (ts:159-161) so template `[disabled]` and `setDisabledState` never un-disable each other. |

### Visual
| Name | Type | Default | Notes |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `_defaults.size` | `[CODE]` ts:97. |
| `shape` | `'square' \| 'rounded' \| 'pill' \| 'circle'` | `_defaults.shape` (`'rounded'`) | `[CODE]` ts:98. |
| `borderStyle` | `'dashed' \| 'solid' \| 'none'` | `_defaults.borderStyle` (`'dashed'`) | `[CODE]` ts:99. |
| `progressMode` | `'water' \| 'bar' \| 'laser'` | `_defaults.progressMode` (`'water'`) | `[CODE]` ts:100. |
| `showWaves` / `showPins` / `showBanner` / `showDragHint` | `boolean` | `_defaults.*` (all `true`) | `[CODE]` ts:101-104. Decoration toggles. |

### Multi-file controls
| Name | Type | Default | Notes |
|---|---|---|---|
| `filterMode` | `'all' \| 'errors' \| 'success' \| 'uploading'` | `_defaults.filterMode` (`'all'`) | `[CODE]` ts:107. |
| `showSuccessRing` / `showStatusBadge` / `showErrorCode` / `showCountBadge` | `boolean` | `_defaults.*` (`true`) | `[CODE]` ts:108-111. |
| `countBadgeClickable` / `stackClickable` | `boolean` | `_defaults.*` (`true`) | `[CODE]` ts:112-113. |
| `autoCycle` | `boolean` | `_defaults.autoCycle` (`false`) | `[CODE]` ts:114. Auto-rotate the focused file in multi (timer in `syncAutoCycle`). |
| `autoCycleSpeed` | `number` | `_defaults.autoCycleSpeed` (`3`) | `[CODE]` ts:115. Seconds. |

### Controlled state + i18n templates
| Name | Type | Default | Notes |
|---|---|---|---|
| `errorMessage` | `string` | `''` | `[CODE]` ts:118. Consumer error override (banner). |
| `extErrorTemplate` / `sizeErrorTemplate` / `networkErrorTemplate` | `string` | (English templates) | `[CODE]` ts:119-121. `{exts}` / `{max}` placeholders — feed translated strings. |
| `successBannerTemplate` | `string` | `'Uploaded · {name}'` | `[CODE]` ts:122. |
| `uploadingStatusText` / `successStatusText` / `addMoreText` / `retryText` / `retryAllText` / `removeText` / `replaceText` / `showFilesText` / `hideFilesText` / `noFilesMatchText` / `countFilesText` / `fileWord` / `filesWord` | `string` | (English defaults) | `[CODE]` ts:123-135. i18n copy strings. |
| `multiUploadingTemplate` / `multiMixedTemplate` / `multiAllSuccessTemplate` / `multiAllFailedTemplate` / `multiSubUploadingTemplate` / `multiSubFailedTemplate` / `multiSubSuccessTemplate` | `string` | (English templates) | `[CODE]` ts:136-142. Multi-file summary copy with `{done}/{total}/{ok}/{fail}/{pct}/{n}` placeholders. |

### Value + render path
| Name | Type | Default | Notes |
|---|---|---|---|
| `files` (CVA value) | `ReadonlyArray<FalconFileUploaderFile>` | `[]` | `[CODE]` CVA value (writeValue ts:167-169). Bind via `formControlName` / `[(ngModel)]`. The Stencil `files` prop is `@Prop({mutable:true})`. |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:145. `true` → `<falcon-document-uploader-tw>` (Light); `false` → `<falcon-document-uploader>` (Shadow). |
| `rootClass` | `string` | `''` | `[CODE]` ts:146. Forwarded as `[class]` on the inner Stencil element. |

## Outputs (Angular wrapper, signal `output()`)

| Name | Payload | Notes |
|---|---|---|
| `(valueChange)` | `ReadonlyArray<FalconFileUploaderFile>` | `[CODE]` ts:149 + handleChange (ts:180-186) — from `falcon-change`; drives CVA `onChange`. |
| `(fileAdd)` | `FalconFileUploaderAddDetail` (`{ file, nativeFile: File }`) | `[CODE]` ts:150 + handleAdd (ts:188-192) — from `falcon-add`. **Carries the RAW `File` (`nativeFile`)** so the consumer drives the real upload (closes FLAG B-CG-2). Fires for EVERY picked/dropped file (pass or fail validation). |
| `(fileRemove)` | `FalconFileUploaderRemoveDetail` | `[CODE]` ts:151 + handleRemove (ts:194-198) — from `falcon-remove`. |
| `(fileRetry)` | `FalconFileUploaderRetryDetail` | `[CODE]` ts:152 + handleRetry (ts:200-204) — from `falcon-retry`. |
| `(fileError)` | `FalconFileUploaderErrorDetail` (`{ code: 'wrong-type' \| 'too-large', file?, nativeFile? }`) | `[CODE]` ts:153 + handleError (ts:206-210) — from `falcon-error`. Client-side ext/size rejection. |
| `falcon-blur` | (no `@Output`) | `[CODE]` handleBlur (ts:212-214) routes `falcon-blur` → CVA `onTouched()`; NOT re-emitted. |

> `[CODE]` The Stencil tags ALSO emit `falcon-change` for `setFiles()`; the wrapper does NOT surface a separate `(fileChange)` — `(valueChange)` is the change channel.

## TypeScript types

`[CODE]` `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.types.ts` (SHARED with `<falcon-image-uploader>`):

```ts
type FalconFileUploaderFileStatus = 'queued' | 'uploading' | 'success' | 'error';
type FalconFileUploaderVariant = 'image' | 'document';      // fixed per concrete component
type FalconFileUploaderSize = 'sm' | 'md' | 'lg';
type FalconFileUploaderShape = 'square' | 'rounded' | 'pill' | 'circle';
type FalconFileUploaderBorderStyle = 'dashed' | 'solid' | 'none';
type FalconFileUploaderProgressMode = 'water' | 'bar' | 'laser';
type FalconFileUploaderFilterMode = 'all' | 'errors' | 'success' | 'uploading';
type FalconFileUploaderErrorCode = 'wrong-type' | 'too-large';

interface FalconFileUploaderFile {
  readonly id: string; readonly name: string; readonly size: number; readonly type: string;
  readonly status: FalconFileUploaderFileStatus; readonly progress?: number;
  readonly errorMessage?: string; readonly errorCode?: 'extension' | 'size' | 'network';
  readonly url?: string; readonly previewUrl?: string;
}
interface FalconFileUploaderAddDetail { readonly file: FalconFileUploaderFile; readonly nativeFile: File; }
// + Change/Remove/Retry/Error/Blur detail interfaces.
```

> `[CODE]` This shared model HAS `id` + `errorCode` + `previewUrl` — distinct from `<falcon-single-uploader>`'s `FalconSingleUploaderFile` (no `id`). The `variant` is fixed `'document'` here (`readonly variant = 'document' as const`, .tsx:152).

## Reflected props (Stencil only)

`[CODE]` On BOTH tags: `disabled`, `required`, `size`, `shape` are `@Prop({reflect:true})` (.tsx:76-81, -tw.tsx:73-77) so CSS can target `[size]`/`[shape]`/`:host([disabled])`.

## Mutable props (Stencil)

`[CODE]` `files: ReadonlyArray<FalconFileUploaderFile>` is `@Prop({mutable:true})` on both tags (.tsx:101 / -tw.tsx:95). The wrapper drives it via `[files]="files()"` from CVA.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor.** `[CODE]` ts:44-50 provides `NG_VALUE_ACCESSOR` + `forwardRef`.
- `writeValue(value)` → `files.set(value ?? [])` (ts:167-169).
- `registerOnChange`/`registerOnTouched` (ts:170-175) — change from `handleChange`, touched from `handleBlur`.
- `setDisabledState` → `disabledSig` (ts:176-178); OR-combined into `effectiveDisabled`.

The control value is a `ReadonlyArray<FalconFileUploaderFile>`.

## Signal compatibility

`[CODE]` Fully signal-based: every prop is `input()`, outputs are `output()`, internal `files`/`disabledSig` are `signal()`, `effectiveDisabled` is `computed()`, `definedTw` is `signal()`. `OnPush`.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `setFiles(next)` | `[CODE]` replace the entire file list + emit `falcon-change` (consumer drives progress/status). | BOTH tags (.tsx:178-182 / -tw.tsx:167-171) |
| `openFileDialog()` | `[CODE]` open the native picker (no-op if disabled). | BOTH tags (.tsx:185-189 / -tw.tsx:173-177) |
| `setFocus()` | `[CODE]` focus the native input. | BOTH tags (.tsx:192-195 / -tw.tsx:179-182) |

> `[CODE]` The Angular wrapper does NOT proxy these — reach the inner Stencil element via `ViewChild`/`nativeElement`. (`setFiles` is the typical way a consumer pushes upload progress back when NOT using the CVA value.)

## Slots / template inputs

`[CODE]` **None** — neither the wrapper nor the Stencil tags expose `<ng-content>` / `<slot>`. All copy is prop-driven; the label renders inside the row (`buildRowInner`/`buildTwRowInner`), never as a separate top `<label>` (.tsx:330-332, -tw.tsx:317-319). No `ng-template` inputs.

## Supported sizes / states / variants / appearances

- Sizes: `sm` / `md` / `lg`. Shapes: `square` / `rounded` (default) / `pill` / `circle`. Border: `dashed` (default) / `solid` / `none`. Progress: `water` (default) / `bar` / `laser`.
- Variant: fixed `'document'` (not an input — the component IS the document variant).
- File statuses (consumer-driven): `queued` / `uploading` / `success` / `error`; multi-file filter modes: `all`/`errors`/`success`/`uploading`.

## Constraints

- `[CODE]` **`(fileAdd)` is the upload hook** — it carries the raw `File`; the consumer must run the actual upload and push progress/status back (via `setFiles()` or the bound value). The component performs NO upload.
- `[CODE]` **Only ext + size validation is client-side** — `ingestFiles` (shared behavior) rejects wrong-type/too-large → `falcon-error`; everything else (incl. network errors) is the consumer's, surfaced via `errorCode='network'` on a file + `networkErrorTemplate`.
- `[CODE]` **The `-tw` (default) path renders ONLY after `customElements.define` resolves** — the wrapper gates it behind `@if (definedTw())` (html:70) because binding properties before upgrade would shadow Stencil's accessors and the element would render with its DEFAULTS, ignoring bindings (ts:53-58 — a documented load-bearing fix). The Shadow `<falcon-document-uploader>` is NOT registered in most apps and renders BLANK if `useTailwind=false` without registering it (`[CODE]` contact-groups html:50-52).
- `[CODE]` **`accept` is a bare-ext list** (`'xlsx,xls,csv,pdf,docx'`), converted to `.xlsx,…` for the native input.

## Accessibility

- `[CODE]` **Row:** `role="button"`, `[attr.aria-label]` (= ariaLabel ?? label ?? buttonText), `aria-disabled`, `aria-invalid` (= `!!errorMessage`), `tabIndex={disabled ? -1 : 0}` (keyboard-focusable in BOTH paths — .tsx:361-366, -tw.tsx:348-353). Enter/Space → picker (handleRootKeyDown, skips clicks on inner buttons).
- `[CODE]` Native `<input type="file">` is visually hidden (`fu-native`) but focusable, with its own `aria-label` (.tsx:333-345, -tw.tsx:320-332).
- `[CODE]` `aria-disabled`/`aria-invalid` via `ariaBool()`.
- `[CODE]` **B19 a11y note:** unlike single-uploader, the row IS keyboard-focusable in both render paths (no `tabindex={-1}` divergence). Per-file list buttons (remove/retry) are real `<button>`s.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-document-uploader.component.ts (216 ln), .component.html (137 ln), falcon-document-uploader.tsx (383 ln), -tw.tsx (371 ln), file-uploader-shared/file-uploader.types.ts, readme.md. Signal API + DI defaults + `effectiveDisabled` + the `definedTw` upgrade gate + the raw-`File` `(fileAdd)` + shared `FalconFileUploaderFile` (with `id`) all read from live source. Shadow↔`-tw` prop/event/method parity is 1:1 (both delegate to `file-uploader-shared`).
