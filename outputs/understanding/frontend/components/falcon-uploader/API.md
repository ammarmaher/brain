# falcon-angular-uploader — API

## Selectors
- **Angular wrapper:** `<falcon-angular-uploader>`
- **Shadow tag:** `<falcon-uploader>`
- **Light tag:** `<falcon-uploader-tw>`

## Import path
```ts
import { FalconAngularUploaderComponent } from '@falcon/ui-core/angular';
import type {
  FalconUploaderFile,
  FalconUploaderMode,
  FalconUploaderFileStatus,
  FalconUploaderErrorCode,
  FalconUploaderChangeDetail,
  FalconUploaderAddDetail,
  FalconUploaderRemoveDetail,
  FalconUploaderErrorDetail,
  FalconUploaderBlurDetail,
} from '@falcon/ui-core/angular';
```

## TypeScript types involved
```ts
// libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.types.ts
export type FalconUploaderMode = 'button' | 'dropzone' | 'inline-list';
export type FalconUploaderFileStatus = 'queued' | 'uploading' | 'success' | 'error';
export type FalconUploaderErrorCode = 'too-large' | 'wrong-type' | 'too-many' | 'custom';

export interface FalconUploaderFile {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly status: FalconUploaderFileStatus;
  readonly progress?: number;       // 0..100
  readonly errorMessage?: string;
  readonly url?: string;            // remote URL after upload
  readonly previewUrl?: string;     // local blob: URL (image preview)
}

export interface FalconUploaderChangeDetail { readonly files: ReadonlyArray<FalconUploaderFile>; }
export interface FalconUploaderAddDetail    { readonly file: FalconUploaderFile; }
export interface FalconUploaderRemoveDetail { readonly file: FalconUploaderFile; }
export interface FalconUploaderErrorDetail  { readonly file?: FalconUploaderFile; readonly code: FalconUploaderErrorCode; readonly message: string; }
export interface FalconUploaderBlurDetail   { readonly files: ReadonlyArray<FalconUploaderFile>; }
```

## @Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` / CVA | `ReadonlyArray<FalconUploaderFile> \| null` | `[]` | Two-way via `[(ngModel)]` / `formControlName`. |
| `mode` | `'dropzone' \| 'button' \| 'inline-list'` | `'dropzone'` | Toggles the trigger UI. |
| `accept` | `string?` | — | Forwarded to native `<input type="file" accept="…">`. |
| `maxSize` | `number?` | — | Browser-enforced via `<input>` only when set; rich validation is consumer's job. |
| `maxFiles` | `number?` | — | Same — consumer enforces. |
| `multiple` | `boolean` | `true` | Native multi-select. |
| `required` | `boolean` | `false` | Native required attribute on the input. |
| `helperText` | `string?` | — | Shown below the dropzone when no error. |
| `errorMessage` | `string?` | — | Top-level error, renders as `<p role="alert">`. |
| `label` | `string?` | — | Block label above the dropzone (with `*` indicator if `required`). |
| `placeholder` | `string` | `'Drop files here or click to browse'` | Empty-state text. |
| `placeholderHint` | `string?` | — | Smaller hint below the placeholder. |
| `showProgress` | `boolean` | `true` | Renders progress bar on `'uploading'` rows. |
| `showPreview` | `boolean` | `true` | Renders thumbnail for image files when `previewUrl`/`url` is set. |
| `ariaLabel` | `string?` | — | Fallback for the dropzone aria-label. |
| `buttonLabel` | `string` | `'Upload'` | Label for the `mode="button"` trigger. |
| `disabled` | `boolean` | `false` | Setter writes to internal `disabledSig` signal. |
| `readonly` | `boolean` | `false` | Setter writes to internal `readonlySig` signal. |
| `useTailwind` | `boolean` | `true` | Light vs Shadow render. |
| `rootClass` | `string` | `''` | Outer class extension. |

## @Outputs (Angular wrapper)

| Name | Payload | Description |
|---|---|---|
| `valueChange` | `ReadonlyArray<FalconUploaderFile>` | Emitted when the file list changes (add/remove). |
| `fileAdd` | `FalconUploaderAddDetail` | Emitted once per file added. |
| `fileRemove` | `FalconUploaderRemoveDetail` | Emitted once per file removed (× button). |
| `fileError` | `FalconUploaderErrorDetail` | Emitted by the component when an error occurs (currently not emitted from the Stencil core; consumer typically emits it via custom logic). |

## Reflected props
- Stencil Shadow reflects: `mode`, `disabled`, `readonly`, `required`.

## Stencil `@Method`s
- `openFileDialog(): Promise<void>` — programmatically opens the native file picker.
- `setFocus(): Promise<void>` — focuses the native input.
- `setFiles(next): Promise<void>` — replaces the file list (used when an upload finishes).

## CVA / Forms support
- `NG_VALUE_ACCESSOR` provided.
- `writeValue(value)` writes the files array to the internal signal.
- `setDisabledState(isDisabled)` writes to `disabledSig`.
- `onTouched()` fires on `falcon-blur`.

## Slots / ng-template inputs
- `slot="placeholder"` — replaces the default placeholder text inside the empty dropzone.
- `slot="hint"` — extra hint area below the placeholder + dropzone (when empty).

## Supported sizes / variants / appearances
- **mode:** 3 modes (`dropzone` / `button` / `inline-list`).
- **No size scale** — single visual size (consumer can override via tokens).

## Lazy / server mode
- _None observed in active source._ The component is purely visual; the upload mechanism (XHR / fetch) lives in the consumer.

## Important constraints
- `files` is a Prop AND mutable inside Stencil — when the user drops/picks files, the component mutates `this.files` and emits `falcon-change`. Consumer must update its CVA value via the change handler — Angular wrapper does this automatically.
- `previewUrl` for image files is auto-generated via `URL.createObjectURL(f)` and revoked on remove. Consumer should NOT manually revoke.
- File validation hooks are deferred to the consumer.
- The native input value is reset after every change (`input.value = ''`) so picking the same file again still fires `change`.
- **Bug/Gap noted:** `falcon-uploader.tsx` line 319 + 361 still uses `<i class="pi pi-cloud-upload" />` (PrimeIcons class). Per Wave PR-8, PrimeIcons should be replaced by the vendored Falcon icon font. See `GAPS_AND_UPGRADES.md`.

## Accessibility
- Native `<input type="file">` is visually hidden but focusable + keyboard-operable.
- Dropzone: `role="button"`, `tabindex={disabled ? -1 : 0}`, `aria-label`, `aria-disabled`, `aria-invalid`.
- Each list row: `role="listitem"`, `aria-busy={status === 'uploading'}`, `tabindex={0}`, `onKeyDown` listens for `Delete` / `Backspace` to remove.
- Progress bar: `role="progressbar"`, `aria-valuemin/max/now`.
- Remove button: `aria-label="Remove {file.name}"`.
