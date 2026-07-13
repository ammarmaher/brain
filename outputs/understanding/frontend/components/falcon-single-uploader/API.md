# falcon-single-uploader — API

## Selectors

- Angular: `falcon-angular-single-uploader`
- Stencil Shadow: `<falcon-single-uploader>` (tag `'falcon-single-uploader'`, `shadow: true`)
- Stencil Light: `<falcon-single-uploader-tw>` (tag `'falcon-single-uploader-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularSingleUploaderComponent } from '@falcon/ui-core/angular';
import type {
  FalconSingleUploaderFile,
  FalconSingleUploaderPreviewMode,
  FalconSingleUploaderSize,
  FalconSingleUploaderFileStatus,
  FalconSingleUploaderChangeDetail,
  FalconSingleUploaderUploadDetail,
  FalconSingleUploaderDeleteDetail,
  FalconSingleUploaderEditDetail,
  FalconSingleUploaderErrorDetail,
  FalconSingleUploaderBlurDetail,
} from '@falcon/ui-core/angular';
```

Add `FalconAngularSingleUploaderComponent` to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` ts:38) — the host does NOT need it.

> `[CODE]` The wrapper still uses **legacy `@Input`/`@Output` decorators** (NOT signal `input()/output()`), with internal `signal()` state + `OnPush`. (Contrast the document-uploader wrapper, which is signal-based.)

## Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` (+ CVA) | `FalconSingleUploaderFile \| null \| undefined` | `null` | `[CODE]` ts:87-93 — `@Input set value` writes the `file` signal; also driven by `[(ngModel)]`/`formControlName`. Getter returns `file()`. |
| `accept` | `string?` | `undefined` | `[CODE]` ts:54 — native `<input accept>`. |
| `maxSize` | `number?` | `undefined` | `[CODE]` ts:55 — browser hint only; full validation is the consumer's. |
| `required` | `boolean` | `false` | `[CODE]` ts:56 — renders `*` after the label. |
| `helperText` | `string?` | `undefined` | `[CODE]` ts:57 — below the tile when no error. |
| `errorMessage` | `string?` | `undefined` | `[CODE]` ts:58 — renders `<p role="alert">`; sets the error visual (`hasError`). |
| `label` | `string?` | `undefined` | `[CODE]` ts:59 — above the tile. |
| `placeholder` | `string` | `'Click to browse or drop here'` | `[CODE]` ts:60 — empty-state text. |
| `placeholderHint` | `string?` | `undefined` | `[CODE]` ts:61 — smaller hint line. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `[CODE]` ts:62 — tile size (96/128/176px). |
| `previewMode` | `'thumbnail' \| 'icon-only' \| 'compact'` | `'thumbnail'` | `[CODE]` ts:63 — `thumbnail`=image; `icon-only`=doc icon even for images; `compact`=row (icon + name + size). |
| `ariaLabel` | `string?` | `undefined` | `[CODE]` ts:64 — fallback aria-label for the dropzone/native input. |
| `disabled` (+ CVA) | `boolean` | `false` | `[CODE]` ts:95-101 — `@Input set disabled` writes `disabledSig`; CVA `setDisabledState` writes the same signal. |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:67 — render-path switch: `true` → `<falcon-single-uploader-tw>` (Light); `false` → `<falcon-single-uploader>` (Shadow). |
| `rootClass` | `string` | `''` | `[CODE]` ts:68 — forwarded as `[class]` on the inner Stencil element (BOTH paths). |

## Outputs (Angular wrapper)

`[CODE]` Five `@Output`s; the wrapper binds SIX Stencil events (`falcon-change`/`-upload`/`-delete`/`-edit`/`-error`/`-blur`) and routes them (`falcon-blur` → CVA `onTouched`, not re-emitted).

| Name | Payload | Notes |
|---|---|---|
| `(valueChange)` | `FalconSingleUploaderFile \| null` | `[CODE]` ts:71, emitted by `handleChange` (from `falcon-change`) — also drives CVA `onChange`. |
| `(fileUpload)` | `FalconSingleUploaderUploadDetail` | `[CODE]` ts:72 + handleUpload (ts:125-129) — fires once when a fresh file is picked/dropped (from `falcon-upload`). |
| `(fileDelete)` | `FalconSingleUploaderDeleteDetail` | `[CODE]` ts:73 + handleDelete (ts:131-135) — when the × is clicked (from `falcon-delete`). |
| `(fileEdit)` | `FalconSingleUploaderEditDetail` | `[CODE]` ts:74 + handleEdit (ts:137-141) — when edit is clicked (the native picker also re-opens) (from `falcon-edit`). |
| `(fileError)` | `FalconSingleUploaderErrorDetail` | `[CODE]` ts:75 + handleError (ts:143-147) — **IS wired** from `falcon-error`. (Correction vs prior dossier, which said "not emitted from core today." The Stencil core declares `falcon-error` but does not currently emit it from internal validation — the channel exists end-to-end and a consumer/Stencil emission flows through.) |
| `falcon-blur` | (no `@Output`) | `[CODE]` handleBlur (ts:149-153) routes `falcon-blur` → CVA `onTouched()`; it is NOT re-emitted as an Angular output. |

## TypeScript types

`[CODE]` `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.types.ts`:

```ts
type FalconSingleUploaderFileStatus = 'queued' | 'uploading' | 'success' | 'error';
type FalconSingleUploaderPreviewMode = 'thumbnail' | 'icon-only' | 'compact';
type FalconSingleUploaderSize = 'sm' | 'md' | 'lg';

interface FalconSingleUploaderFile {
  readonly name: string; readonly size: number; readonly type: string;
  readonly url?: string; readonly status?: FalconSingleUploaderFileStatus;
  readonly progress?: number; readonly errorMessage?: string;
}
// + Change/Upload/Delete/Edit/Error/Blur detail interfaces.
// ErrorDetail.code: 'too-large' | 'wrong-type' | 'custom'.
```

> `[CODE]` This type set is **distinct** from the `file-uploader-shared` `FalconFileUploaderFile` (which has `id` + `errorCode` + `previewUrl`). The two uploader families do NOT share a model.

## Reflected props (Stencil only)

`[CODE]` On BOTH tags: `disabled`, `required`, `size`, `preview-mode` (kebab attr) are `@Prop({reflect:true})` so `:host([disabled])` / `[preview-mode]` CSS can target them (falcon-single-uploader.tsx:53-62, -tw.tsx:71-80).

## Mutable props (Stencil)

`[CODE]` `file: FalconSingleUploaderFile | null` is `@Prop({mutable:true})` on both tags (`.tsx:50`, `-tw.tsx:68`). The Angular wrapper drives it via `[file]="file()"` from its CVA signal — do not bind it directly alongside `[(ngModel)]`.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor.** `[CODE]` ts:39-45 provides `NG_VALUE_ACCESSOR` + `forwardRef`.
- `writeValue(value)` → `file.set(value ?? null)` (ts:103-105).
- `registerOnChange` (ts:106-108) — invoked by `handleChange`.
- `registerOnTouched` (ts:109-111) — invoked by `handleBlur` (from `falcon-blur`).
- `setDisabledState` (ts:112-114) → `disabledSig`.

`[(ngModel)]`, `formControl`, `formControlName` all carry a `FalconSingleUploaderFile | null`.

## Signal compatibility

`[CODE]` Internal state is signals (`file`, `disabledSig`, ts:80-81) + `OnPush`. External binding is via `@Input`s + `(valueChange)`/CVA — no signal-input variant.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `openFileDialog()` | `[CODE]` opens the native picker (no-op if disabled). | BOTH tags (.tsx:90-94 / -tw.tsx:105-109) |
| `setFocus()` | `[CODE]` focuses the native input. | BOTH tags (.tsx:97-100 / -tw.tsx:111-114) |
| `setFile(next)` | `[CODE]` replaces the file + emits `falcon-change`. | BOTH tags (.tsx:103-107 / -tw.tsx:116-120) |

> `[CODE]` The Angular wrapper does NOT proxy these — reach the inner Stencil element via `ViewChild`/`nativeElement` (GAP G2).

## Slots / template inputs

`[CODE]` Both wrapper render branches project a single default `<ng-content />` into the Stencil tag (html:27 / html:52). `[CODE]` However the Stencil components render no `<slot>` element — so projected content has no rendered placement (a latent no-op; see GAPS). (Correction vs prior dossier "no slots observed": the WRAPPER has `<ng-content>`, but it goes nowhere in the current Stencil templates.) No `ng-template` inputs.

## Supported sizes / states / variants / appearances

- Sizes: `sm` (96px tile), `md` (128px), `lg` (176px).
- Preview modes: `thumbnail`, `icon-only`, `compact`.
- File statuses (consumer-driven, `file.status`): `queued`, `uploading` (shows progress bar), `success`, `error` (red tile border).
- Render path: Shadow / Light via `useTailwind`.

## Constraints

- `[CODE]` **Drag-drop in filled state REPLACES the file** (acceptIncoming overwrites `file`; .tsx:113-134). No merge, no multi.
- `[CODE]` **Edit reopens the picker AND emits `falcon-edit`** (handleEdit, .tsx:198-203) — there is no `preventDefault`/`(beforeEdit)` to intercept before the picker opens (GAP).
- `[CODE]` **`maxSize` is a hint, not enforced** — `acceptIncoming` does not check size; the consumer drives `errorMessage`/`status`.
- `[CODE]` **A picked image gets a `blob:` `URL.createObjectURL` preview**, revoked on delete (.tsx:121, .tsx:190-192).
- `[CODE]` **`<ng-content>` is a no-op** in the current Stencil templates (no `<slot>`).

## Accessibility

- `[CODE]` **Empty dropzone:** `role="button"`, `aria-label` (= ariaLabel ?? placeholder), `aria-disabled`, `aria-invalid` (.tsx:218-226). **Shadow** sets `tabIndex={disabled ? -1 : 0}` (.tsx:222) so the dropzone is keyboard-focusable; the **`-tw` twin hardcodes `tabindex={-1}`** (-tw.tsx:229) — a Shadow↔`-tw` a11y DIVERGENCE (the Tailwind dropzone is NOT keyboard-reachable; you reach the picker via the focusable native input). GAP A1.
- `[CODE]` Keyboard activate: Enter/Space → picker (handleDropzoneKeyDown, both).
- `[CODE]` Native `<input type="file">` is visually hidden but focusable, with its own `aria-label` (.tsx:338-350).
- `[CODE]` Action buttons carry `aria-label` ("Delete uploaded file" / "Replace file") + `disabled` attr; progress bar is `role="progressbar"` + `aria-valuemin/max/now` (.tsx:285-314).
- `[CODE]` Required asterisk + the cloud/icon glyphs are `aria-hidden="true"`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-single-uploader.component.ts (154 ln), .component.html (54 ln), falcon-single-uploader.tsx (363 ln), -tw.tsx (371 ln), .types.ts. Drift corrected: `(fileError)` IS wired; `falcon-blur`→onTouched; `<ng-content>` present (no-op, no `<slot>`); `-tw` dropzone `tabindex={-1}` vs Shadow `0` (a11y divergence). Wrapper uses legacy `@Input/@Output` (not signals).
