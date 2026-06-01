---
name: project-uploader-document-show-port-2026-05-30
description: Uploader + Document-Show SoT port — falcon-photo-uploader viewMode now renders SoT .info-client-pic shape (84px ring); uploader config trio (token+provider+helper) at libs/falcon-studio/src/lib/services/; 3 wrappers (photo+image+document) DI-seed input() defaults via FALCON_UPLOADER_DEFAULTS; all 3 apps build green; resync script idempotent; no commits.
metadata: 
  node_type: memory
  type: project
  originSessionId: 64483042-b1fa-460a-84a4-d08468cd234c
---

# Uploader + Document-Show SoT Port — 2026-05-30

**Status:** ✅ DONE all 6 phases, build-green host+admin+mgmt dev (3 final-pass builds exit 0), NOT runtime-verified, NO COMMITS. Branch `polishing-v0.4`, working tree.

**Why:** user asked for visual parity to React SoT for falcon-image-uploader + falcon-document-uploader + falcon-photo-uploader **plus** document-show surfaces, with reusable scraper, config injection in the canonical place (loader pattern), preserving every save/payload contract.

**How to apply:** 
- For uploader defaults override, edit `apps/host-shell/falcon-facades/host-component-configuration.facade.ts` `static readonly uploader = { defaults: { image: {...}, document: {...}, photo: {...} } }`.
- For per-instance override, bind `[input]="..."` on the consumer template — always wins over DI default.
- To resync SoT defaults: `node plans/uploader-document-show-port/scripts/resync-uploader-document-show-defaults.js`. CI gate: `--check`.

## Headlines

**Phase 0** — 5 deliverables under `plans/uploader-document-show-port/`: `PLAN.md`, `uploader-and-document-show-extraction-spec.md` (14 sections, every value cited per `file:line`), `uploader-document-show.defaults.json` (33KB deterministic), `scripts/resync-uploader-document-show-defaults.js` (Node CLI, `--check`/`--print`, strips JS comments, handles `{...spread}` doc-config inheritance), `CONSUMER-MAP.md`, `REPORT.md`.

**Phase 1** — `nx build falcon-ui-core --skip-nx-cache` cold rebuild (44s). Regenerated `dist/components/falcon-image-uploader{,-tw}.js` + `falcon-document-uploader{,-tw}.js` + `components.d.ts` + 108-tag React/Vue wrappers + web-types allowlist. **Pre-existing** warnings on `falcon-dialog`/`falcon-table` reserved-name props (NOT introduced this pass).

**Phase 2** — file-uploader-shared audit passed; yesterday's 2026-05-29 port was already SoT-faithful (`formatBytes` utils.ts:19; COMPLETED `labelSubText` render.tsx:249-255 → `${name} · ${formatBytes(size)}`; success banner template tpl call at :300; reduced-motion gates in BOTH shadow CSS line 507 + Tailwind `motion-reduce:` variants at file-uploader-tailwind-classes.ts:98,148,222,231,314; `fuWave`/`fuBob`/`fuSpin` keyframes at shadow.css:127,158,170). **No edits.**

**Phase 3** — `falcon-photo-uploader.component.html` view-mode now renders SoT `.info-client-pic`: 84×84 ring (`rgba(13,63,68,0.06)` bg + `3px solid rgba(13,63,68,0.10)` border + `0 2px 8px rgba(13,63,68,0.10)` shadow) + 17px font-bold name + 13px font-medium sub-label + `pb-6 border-b border-falcon-neutral-200` separator. Used by Org Info Panel admin+mgmt (both already pass `[labelText]=nodeName` + `subLabelKey="hierarchy.info.clientPicture"`). Edit-mode chrome unchanged. Public API + emit contracts (`pictureChange`/`fileSelected`/`[(photo)]`) preserved verbatim — wire-builders (`profilePictureInfo`) unchanged.

**Phase 4** — Config trio (3 new files) at `libs/falcon-studio/src/lib/services/`:
- `uploader-defaults.token.ts` — `FalconUploaderDefaultsConfig {image, document, photo}` interface + frozen `BUILT_IN_FALCON_UPLOADER_DEFAULTS` (every value SoT-extracted) + `FALCON_UPLOADER_DEFAULTS` `InjectionToken` with `providedIn:'root'` factory.
- `uploader-defaults.provider.ts` — `provideFalconUploaderDefaults(override?)` + shallow-per-variant `mergeUploaderConfig`.
- `provide-falcon-uploader.ts` — `provideFalconUploader(options)` one-call helper.

Exported from BOTH `libs/falcon-studio/src/index.ts` AND `libs/falcon-studio/src/runtime.ts` (bootstrap-safe subpath; same shape as loader/data-table-skeleton). Registered in all 3 `app.config.ts` (host via facade; admin/mgmt without override for standalone-serve). Facade gains `static readonly uploader = { defaults: {} }` block.

3 wrappers DI-seeded:
- `falcon-photo-uploader.component.ts` — `inject(FALCON_UPLOADER_DEFAULTS).photo` → 6 inputs.
- `falcon-angular-image-uploader.component.ts` — `.image` → 24 inputs.
- `falcon-angular-document-uploader.component.ts` — `.document` → 24 inputs.

**Per-instance `[input]` bindings ALWAYS win** (Angular `input(default)` only uses default when no binding present). `providedIn:'root'` factory keeps BUILT_IN as fallback even without `provideFalconUploader()`.

**Phase 5** — `gallery-defaults.ts` entries already aligned with `BUILT_IN_FALCON_UPLOADER_DEFAULTS`; added header comment documenting drift-detection via resync `--check`. Studio demo's literal defaults already match SoT; no edit needed.

**Phase 6** — all 3 apps green dev config (2 final-pass cycles × 3 apps × 6 builds, every exit 0). REPORT.md written.

## Risks / Gaps

1. **Live-capture pending** — 10 SoT-detail items in extraction spec §11 (status badge vs pin collision, hover rules, portrait crop, reduced-motion runtime) need browser pass on `http://localhost:5173/?focus=uploader` + Studio + Org Info Panel + Add Client + Contact Group. Not done.
2. **Hand-rolled migration candidates NOT touched** per scope: User Details 96×96 hero avatar (`libs/falcon/src/shared-features/user-details/.../user-details-page.component.html:136`), Templates wizard Step 2 media tile (admin + mgmt). Documented as follow-up.
3. **`libs/falcon` now imports `@falcon/studio/runtime`** for `FALCON_UPLOADER_DEFAULTS` — pre-existing pattern (falcon-ui-core wrappers already do this).

## Decisions inherited from [[project_uploader_falcon_port_2026_05_29]]

Locked, not re-litigated: two separate Family B components · production-sensible subset (drop `laser`/`pulse`) · color knobs → CSS tokens not props · drop `autoRetry` (dead in SoT) · drop polymorphic `as` · `mockResult`/`uploadDuration` showcase-only · Contact-Group `progressMode='water'` · success color → Falcon green token · showcase grouping → File upload · tags `falcon-image-uploader` / `falcon-document-uploader`.

## File diff summary

19 files total:
- 5 plan deliverables (new, `plans/uploader-document-show-port/`)
- 3 new TS in `libs/falcon-studio/src/lib/services/`
- 11 edits (2 barrels, 1 facade, 3 app.config, 3 wrappers, 1 photo-uploader html, 1 gallery-defaults header)

## Related

- [[project_uploader_falcon_port_2026_05_29]] (yesterday's Family-B SPEC; locked decisions)
- [[reference_settings_tab_edit_authority_and_failopen_bug_2026_05_30]] (concurrent session, NOT touched)
- [[project_polishing_v04_consolidation_2026_05_30]] (this work sits on top of, no commits added)
