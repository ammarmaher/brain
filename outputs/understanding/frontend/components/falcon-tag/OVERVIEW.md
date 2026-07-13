# falcon-tag — OVERVIEW

## Purpose

Chip / tag with optional leading icon and optional dismiss `✕` button. Sibling of `<falcon-badge>` and `<falcon-status-badge>` (`[CODE]` falcon-tag.tsx:3 "Sibling to <falcon-badge> and <falcon-status-badge>. Wave 9.F"). Used wherever discrete labelled attributes appear — filter chips, multi-select selected-value chips, permission/severity tags, "shared-with" name chips.

## Business / UI use case

`[CODE]` Verified production use: "shared-with" name chips inside list cells + detail cards (contact-groups-list.component.html:123-135 `+N` overflow chips; contact-group-detail.component.html:157), share-dialog recipient chips, settings-tab attribute chips. Also filter chips, multi-select selected values, permission tags.

## When to use it

- Dismissible chips (`[dismissible]="true"` + `(falconDismiss)` event).
- Severity-tagged labels with the 7-value vocabulary (`success`, `info`, `warning`, `warn` legacy, `danger`, `secondary`, `contrast`).
- Multi-value cell content (a `@for` of `secondary` chips per row).

## When NOT to use it

- Workflow-state cells → `<falcon-status-badge>` (9 status enums, NOT the 7 generic severities).
- Generic count / feature-flag badges → `<falcon-badge>`.

## Status

**ACTIVE / ADOPTED.** Stencil Shadow + Light + Angular wrapper `<falcon-angular-tag>` with dual-render-path. Replaces status-purposed `<p-tag>`. Now genuinely adopted (9 app files / 18 occurrences — the prior "no consumers found" is **stale**).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tag/falcon-tag.component.ts` (101 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tag/falcon-tag.component.html` (29 ln; tag-switcher) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tag/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tag/falcon-tag.tsx` (87 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-tag/falcon-tag.css` (94 ln) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tag-tw/falcon-tag-tw.tsx` (67 ln, `shadow: false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-tag/falcon-tag.types.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/tag-tailwind-classes.ts` (47 ln) |
| Token file | `libs/falcon-ui-tokens/src/components/tag.tokens.css` (51 ln; `:where()` scoped — gate-12 compliant) |
| Stencil readme | `libs/falcon-ui-core/src/components/falcon-tag/readme.md` (auto-gen) |
| Spec / e2e | **NONE** — no `.spec.ts` for any layer (gap). |
| React proxy | `libs/falcon-ui-react/src/components.ts:1797-1811` (`FalconTag` + `FalconTagTw`, both expose `onFalconTagDismiss`) |
| Vue proxy | `libs/falcon-ui-vue/src/index.ts:2326-2344` (`FalconTag` + `FalconTagTw`) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-tag` |
| Stencil Shadow tag | `<falcon-tag>` |
| Stencil Light tag | `<falcon-tag-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-tag>` across `apps/` = **9 files / 18 occurrences**; **0** under `libs/falcon/`. (The prior dossier's "No direct use found / Wave-7 count 2" is **stale**.) Heaviest users — contact-groups "shared-with" chips:

- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` (4 each — sharedWith name chips + `+N` overflow, lines 123-135)
- `apps/{admin,management}-console/.../contact-groups/contact-group-detail/contact-group-detail.component.html` (1 each — sharedWith chips, line 157)
- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html` (2)
- `apps/management-console/.../contact-groups/create-contact-group/steps/share-group-step/share-group-step.component.html` (2)
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` (2)
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` (1 each)

See `USAGE.md` Consumer Sweep for the full enumerated list.

## Related components

- `<falcon-badge>` — semantic-bucket generic indicator (shares info=blue / success=green palette — collision risk on the same row)
- `<falcon-status-badge>` — workflow-state specialised (9 status enums)
- `<falcon-angular-multi-select>` — likely consumer for selected-chips visual

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Wave 9.F backfill. **The wrapper retains a legacy Tailwind-class `classes` computed signal (`[CODE]` ts:61-99) that is DEAD CODE — never bound in the template** (the template delegates to `<falcon-tag-tw>` / `<falcon-tag>`). FT-01 recommends removal.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10 sweep). Source-file table re-confirmed on disk; consumer list refreshed (9 app files / 18 occurrences, 0 in libs/falcon — corrects the prior "no consumers"/"2"). Stencil tag `shadow:true`, `-tw` `shadow:false`, token file `:where()`-scoped, dead `classes` computed all re-confirmed.
