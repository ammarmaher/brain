# falcon-image-uploader — DECISION

## Brain SK final recommendation

**STATUS: READY / PREFERRED. Use for all avatar / profile-photo / logo capture in new Angular code.** It is the production replacement for the legacy `<falcon-photo-uploader>` (deleted from disk) and is already live in both consoles' org-hierarchy wizards/panels + templates wizards.

## Use this component for

- Circular / shaped avatar, profile-photo, or logo capture (single file).
- Image-only uploads where the consumer drives the real upload and reads the raw File from `fileAdd.nativeFile`.
- Fields needing client-side ext + size validation with a token-themed avatar-row look.
- Multi-image capture with an overlapping stack (`multiple=true`) when a stack UI is acceptable.

## Avoid this component for

- Document attachments (PDF / docx / multi-format) → `<falcon-angular-document-uploader>`.
- Square single-file tile with edit/replace/delete overlays → `<falcon-angular-single-uploader>`.
- Display-only avatars → `<falcon-angular-avatar>`.
- Server-validated images where the component must enforce dimensions/aspect — validate in `(fileAdd)` / backend (GAP G4).

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM `<falcon-image-uploader-tw>`. Best for Studio token-runtime mutation, cross-framework parity, and Tailwind `rootClass` overrides.

**`useTailwind=false`** (Shadow `<falcon-image-uploader>`) — switch only when you need style isolation from a noisy parent stylesheet. There is **no feature gap** between the paths (1:1 prop/event/method parity), so the default is almost always right.

## Required upgrades before wider use

None. The component is production-quality and already in production. The gaps in `GAPS_AND_UPGRADES.md` (method proxies, `(blur)` output, richer validation, hidden label, specs) are improvements, not blockers.

## Relationship to other components

- **Twin (shared contract):** `<falcon-angular-document-uploader>` — same `file-uploader-shared` render/behavior/types/tokens; only DEFAULTS differ.
- **Siblings:** `<falcon-angular-single-uploader>` (square tile, separate token file), `<falcon-angular-avatar>` (display-only).
- **Composed with (in consumers):** `<falcon-angular-input>` (name fields beside the avatar in wizard steps).
- **Replaces:** legacy `<falcon-photo-uploader>` + `<falcon-uploader>` (both removed from disk).

## Exact rule for future implementation tasks

1. **Avatar / profile-photo / logo capture?** Use `<falcon-angular-image-uploader>` with `useTailwind=true` (default).
2. **Bind the value via `[(ngModel)]` / `formControlName`** (the CVA value is the descriptor array). Never bind `[files]` (no such input).
3. **Read the raw File from `(fileAdd)`** → `detail.nativeFile`; build the base64 payload there (`{extension, fileBase64String}` for the Commerce profile-picture contract).
4. **Set `accept` as bare extensions** (`png,jpg,jpeg`) + `[maxSizeMB]` for the size guardrail.
5. **If you suppress the built-in banner** (`[showBanner]="false"`), supply your own `role="alert"` error line gated on `(fileError)`.
6. **Override visuals via `--falcon-file-uploader-*` tokens** (host class + `rootClass`). Never hardcode hex/px or write SCSS.
7. **Documents → `<falcon-angular-document-uploader>`**, square tile → `<falcon-angular-single-uploader>`.

---

## Dynamic capability assessment

### 1. What is static today?
- The avatar-row layout (well + label/hint + button) and the placeholder icon set (variant-derived).
- The clear/edit/delete pin SVGs (from `file-uploader.icons.tsx`).
- The two render modules (Shadow render vs `-tw` render) — selected by `useTailwind`, not composable.
- No `<slot>`s — content is entirely prop/icon-driven.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **~50 wrapper inputs** (signal `input()`): label/helperText/buttonText/dragHintText/ariaLabel + accept/maxSizeMB/multiple/maxStackVisible/dragDrop/clickToBrowse/required/disabled + size/shape/borderStyle/progressMode + 8 `show*`/decoration flags + 9 multi-file flags + 26 i18n templates + useTailwind/rootClass.
- `[CODE]` **5 outputs** (signal `output()`): `valueChange`, `fileAdd` (carries raw `File`), `fileRemove`, `fileRetry`, `fileError`.
- Full CVA: `writeValue`/`registerOnChange`/`registerOnTouched`/`setDisabledState`; `effectiveDisabled` OR of explicit + CVA disabled.
- DI-seeded defaults via `FALCON_UPLOADER_DEFAULTS.image`.

### 3. What is already dynamic through slots / ng-template?
- **Nothing** — no `<slot>`s, no `ng-template` inputs. (GAP if a design needs custom in-row content.)

### 4. What is dynamic through token/theme overrides?
- Every visual axis (~13 token categories of `--falcon-file-uploader-*`). Host-class + `rootClass` scope and per-instance scope both supported via the shared `:where()` selector.
- RTL pin-mirroring + `prefers-reduced-motion` gating ship in the token file.

### 5. What is dynamic through Tailwind classes?
- `rootClass` flows to the inner Stencil element (`[class]`) for layout (`max-w-*`, spacing) — BOTH paths.
- Tailwind utilities could override token-driven visuals, but discipline says — override tokens instead.

### 6. What is missing to make this component reusable across pages?
- Angular method proxies (`openFileDialog()`/`setFocus()`) — G1.
- Richer validation (`maxFiles`/dimensions) — G4.
- A public `(blur)` Output — G2.
- Optional in-row content slot for bespoke designs.

### 7. What capability should be added to shared component (not page hack)?
- Method proxies + `maxFiles`/dimension validation belong in the shared wrapper / `file-uploader-shared`, NOT per-page handlers.
- A Shadow-vs-`-tw` parity test to stop the two render modules drifting.

### 8. What flags / options / templates / slots would make it better?
- `@Input() maxFiles?` + `@Input() maxDimensionPx?` (validation).
- `@Output() blur` on the wrapper (G2).
- Async method proxies `openFileDialog()` / `setFocus()` (G1).
- An optional content slot for custom in-row affordances.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** add Angular method proxies (`openFileDialog`/`setFocus`) + `@Output() blur`. No DOM/behavior change.
2. **Phase B (validation):** add `maxFiles`/`maxDimensionPx` inputs + extend `fileError` codes in `file-uploader.behavior.ts` (shared — touches both image + document; gate with a parity test).
3. **Phase C (a11y):** add a hidden associated `<label htmlFor>` + an `aria-live` add/remove/error announcer.
4. **Phase D (tests):** Stencil spec + wrapper spec + Shadow-vs-`-tw` parity spec.

All phases are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- The CVA value contract (descriptor array, NOT raw File) — Add Client / Add User / Info-panel all depend on `[(ngModel)]`/`formControlName` driving the list and reading `fileAdd.nativeFile`.
- The `accept`-as-bare-extensions convention — consumers pass `png,jpg,jpeg`; switching to MIME would break every picker filter.
- The shared `file-uploader-shared` module — any change ripples to `<falcon-document-uploader>` too; never edit one render module without mirroring.
- The `definedTw` upgrade gate — removing it reintroduces the property-shadowing bug (component renders defaults, ignores bindings).
- The default `useTailwind=true` — flipping it changes DOM structure (Light ↔ Shadow) and would break consumers + the SoT parity.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier). Recommendation READY/PREFERRED; counts confirmed (~50 inputs, 5 outputs, 3 Stencil methods un-proxied). Supersession of legacy uploaders confirmed by `Test-Path`. Gaps are additive improvements, not blockers.
