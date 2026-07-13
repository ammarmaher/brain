# falcon-document-uploader — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — Shadow tag unregistered in apps → blank if `useTailwind=false` (P1, footgun)

`[CODE]` Only `<falcon-document-uploader-tw>` self-registers (via `defineFalconTwComponent('falcon-document-uploader')`); the Shadow `<falcon-document-uploader>` is NOT registered in the consuming apps, so `useTailwind=false` renders BLANK (upload-group-details-step.html:50-52 documents this; the wrapper gates `-tw` behind `@if (definedTw())` but does NOT gate/register the Shadow branch). The `useTailwind=false` branch is effectively a trap.

**Recommended fix (P1):** either register the Shadow variant in the umbrella loader too, or have the wrapper warn/guard when `useTailwind=false` and the Shadow tag is undefined. `safe-local` (registration/loader surface — verify against `stub-seeder.cjs` / `define-custom-elements`).

### G2 — Angular wrapper does not proxy Stencil methods (P1)

`[CODE]` `setFiles()` / `openFileDialog()` / `setFocus()` are `@Method`s on both tags but the wrapper exposes none. Consumers pushing upload progress must either reach `ViewChild.nativeElement` or round-trip through the CVA value. Add Angular-side proxies (esp. `setFiles()` — the canonical "push progress back" API).

**Recommended fix:** `@ViewChild('el') ` + `async setFiles(next)`, `async openFileDialog()`, `async setFocus()`. `safe-local`.

### G3 — Huge prop surface, all string copy as inputs (P2, ergonomics)

`[CODE]` ~50 inputs, ~30 of them i18n copy templates (tsx:104-128 / ts:119-142). Every consumer must wire (or accept English) a long list of `*Template`/`*Text` inputs. There is no `[copy]` object-input or DI-seeded i18n bundle (only the visual/behavior defaults are DI-seeded; the copy defaults are English literals in the wrapper).

**Recommended fix (P2):** accept a single `[copy]` object (or extend `FALCON_UPLOADER_DEFAULTS` with a per-variant `copy` block resolved from i18n) so consumers don't bind 30 strings. `safe-local`.

### G4 — `(valueChange)` is the only change channel; no per-event granularity beyond add/remove/retry/error (P3)

`[CODE]` `setFiles()` emits `falcon-change` but the wrapper surfaces it only as `(valueChange)`. Fine for CVA, but a consumer wanting "a file finished uploading" must diff the array. Consider a `(fileStatusChange)` convenience. `safe-local`.

### G5 — No dedicated wrapper/Stencil unit spec (P2, test)

`[CODE]` The only test on disk is a **consumer-level** spec (`apps/management-console/tests/contact-groups/upload-group-details-step.component.spec.ts`). There is NO `falcon-document-uploader.component.spec.ts` (wrapper) and NO Stencil `.spec.ts`/`.e2e.ts` in the component folders (verified 2026-06-03). GAP: add a wrapper spec (CVA writeValue / `effectiveDisabled` OR-logic / the `definedTw` gate / the 5 outputs / `(fileAdd).nativeFile`) + shared-engine specs.

### G6 — `file-uploader.shadow.css` not literal-scanned this pass (P3, audit-completeness)

`[CODE]` The shared Shadow CSS is large; this pass spot-checked the token file + header (SSOT token discipline asserted) but did NOT line-scan `file-uploader.shadow.css` for stray hex/px. `[INFERRED]` likely clean (the family is token-disciplined), but flag for a deeper static-scan. `safe-local`.

### G7 — Shared token block retints BOTH uploaders (P3, theming foot-gun)

`[CODE]` `file-uploader.tokens.css` `:where(...)` lists both image + document tags; a per-app override on a class both match retints both. Document the scoping requirement (done in TOKENS) or split into per-variant token blocks if independent theming is ever needed. `safe-local`.

## Missing accessibility features

- **A1 (P3):** the row is keyboard-focusable in both paths (good — no `tabindex` divergence, unlike single-uploader). The per-file list remove/retry are real `<button>`s. Verify `aria-live` on the banner so status changes announce. `[INFERRED]` not confirmed this pass.
- **A2 (P3):** the label renders inside the row (not a top `<label htmlFor>`); the association relies on the native input's `aria-label`. Acceptable but worth a doc note (the source flags it as intentional SoT parity, tsx:330-332).

## Missing tests

- See G5 — no wrapper/Stencil spec; only a consumer spec.

## Missing Tailwind / token parity

- `[CODE]` Shadow + `-tw` share the engine AND the token file (SSOT) — parity is structural (both call `file-uploader-shared`). The only parity caveat is the shared-block retint (G7). The 1:1 image-twin claim (tsx:3-6) means image-uploader parity must be kept in lockstep — a change to the shared engine affects both. **Parity OK.**

## Performance risks

- `[CODE]` `autoCycle` runs a `setInterval` (`syncAutoCycle`, tsx:197-207) cleared in `disconnectedCallback`/on re-render — multi-file only, off by default. No leak (timer cleared). The progress geometry is an inline CSS var (data-driven). `OnPush` + signals. No real risk.
- `[CODE]` Large prop surface = many `input()` signals, but each is cheap; `OnPush` limits CD. Negligible.

## Visual / interaction risks

- **G1 blank-Shadow trap** is the main risk — always use `useTailwind=true`.
- The 1:1 image-twin coupling means a visual regression in the shared engine hits both uploaders — guard with parity tests.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | register Shadow tag / guard `useTailwind=false` | P1 | safe-local (loader surface) |
| G2 | proxy `setFiles`/`openFileDialog`/`setFocus` on the wrapper | P1 | safe-local |
| G3 | `[copy]` object / DI i18n bundle (reduce 30-string surface) | P2 | safe-local |
| G5 | wrapper + Stencil specs | P2 | safe-local |
| G7 | document/split shared token block | P3 | safe-local |
| G6 | deep static-scan of `file-uploader.shadow.css` | P3 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the shared component / the `file-uploader-shared` engine (the engine + token file are shared with image-uploader — fix once, both benefit). G1's loader fix is a build/registration concern.

## Workarounds (if upgrade blocked)

- For G1 today: always set `[useTailwind]="true"` (the documented norm).
- For G2 today: push progress back via the bound CVA value (re-set the `files` array) instead of `setFiles()`.
- For G3 today: bind the copy inputs you need; the rest fall back to English defaults.

## Deep-Dive Sweep Findings (2026-06-03 — B19)

**Consumer count: 4 render sites** (3 production features — contact-groups CSV import + templates media step in BOTH consoles — + 1 showcase). Genuine production reach.

- **NEW dossier created** (no prior dossier under this slug).
- **Supersession:** see RECONCILE — the OLD generic `falcon-uploader` / `falcon-photo-uploader` dossiers likely predate this `file-uploader-shared` family. This unit does NOT supersede `falcon-single-uploader` (different family). The `falcon-uploader` dossier (older multi-file lineage) and any stale "uploader" dossier should be reconciled against the live `file-uploader-shared` pair — **flag for B23** (image-uploader is B20). Do NOT edit those dossiers this pass.
- **No deletion/promotion flag** for this component — ACTIVE/PREFERRED with real consumers.
- Findings (see `FINDINGS/B19.md`): G1 (Shadow-blank trap), G2 (no method proxies), G3 (30-string copy surface), G5 (no wrapper spec), G7 (shared token retint), G6 (deferred CSS scan). All `safe-local`. No `pi pi-*`; row keyboard a11y is correct in both paths (unlike single-uploader).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) against falcon-document-uploader.component.ts (216 ln), .tsx (383 ln), -tw.tsx (371 ln), file-uploader-shared types/behavior, contact-group-api.service.ts. G1 Shadow-blank trap (html:50-52 + wrapper gate), G2 no-proxy, G3 prop surface, G5 no wrapper spec all confirmed. NEW dossier; `falcon-uploader`/legacy-uploader reconciliation flagged for B23. No deletion/promotion flag.
