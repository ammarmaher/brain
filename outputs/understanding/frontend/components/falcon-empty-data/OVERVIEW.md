# falcon-empty-data — OVERVIEW

## Component purpose

The **themed empty-state card** — the richer, fully-decorated sibling of `<falcon-empty-state>`. A dashed-border card with a glossy teal gradient, a tinted glyph disc (inline SVG, 8 keys), a title + body, an optional Add-style CTA button (3 sizes × 3 borders) and an optional info chip. `[CODE]` falcon-empty-data.tsx:1-7 calls itself *"Themed empty-state card … Distinct from `<falcon-empty-state>` (the minimal icon+title+description placeholder)."* It is the canonical empty visual that `<falcon-angular-data-table>` auto-mounts when its rows are empty.

## Business / UI use case

- The empty state shown **inside a data-table** when a list returns zero rows ("No data found / there is no data found to be previewed"). This is its dominant use — the data-table auto-mounts it from the `[emptyData]` shorthand config.
- A **page-level** zero-state hero (`mode="page"`) with a call-to-action ("No clients yet — Add client").
- An info-only empty marker (CTA + info chip both off) inside org-hierarchy menus, templates lists, contracts/cost management, contact-groups lists.

## When to use it / when NOT to use it

**Use it for:**
- The empty render of any `<falcon-angular-data-table>` — pass `[emptyData]="config"` and the table auto-mounts this component (`[CODE]` falcon-data-table.component.ts:390).
- A decorated page-level zero-state where you want the card chrome + a CTA + an info chip.
- Any empty list/dashboard where the richer "card" treatment (gradient, disc, button) is wanted over the bare `<falcon-empty-state>` stack.

**Do NOT use it for:**
- A **minimal** centred icon+title+description placeholder with NO card chrome → use `<falcon-empty-state>` (the lighter sibling).
- A loading state (use the table `[loading]` skeleton).
- An error placeholder — there is no `error` variant; `context.feedbackLevel='destructive'` only changes `role`/`aria-live`, not the visual.
- A single form field's empty value (that is just an empty input).

## Status

**ACTIVE / PREFERRED for table & page empty-states.** Wave 19 (16th–20th iter, 2026-05-14) — `[CODE]` falcon-empty-data.component.ts:3. The data-table's `[emptyData]` integration makes it the most-adopted empty visual in the platform. NEW dossier created 2026-06-03 (B12 sweep — it had no prior dossier).

## Replaces

- Bare text empty cells in data-tables (the pre-Wave-19 `<td>{emptyMessage}</td>` path; `[CODE]` falcon-data-table.component.ts:1020 — the legacy text path still wins if a `*falconDataTableEmpty` template is projected).
- Hand-rolled "No data" card markup in feature pages.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/falcon-empty-data.component.ts` (248 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/falcon-empty-data.component.html` (68 ln — pure tag-switcher) |
| Angular wrapper CSS | _none_ — `[CODE]` no `.component.css` exists for this wrapper (host class only, via `@HostBinding`) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.tsx` (343 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.css` (244 ln — token-driven) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-empty-data-tw/falcon-empty-data-tw.tsx` (424 ln) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-empty-data-tw/falcon-empty-data-tw.css` (6 ln — `:host{display:block}` only) |
| Types | `libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.types.ts` (80 ln) |
| Utils | _none_ — no `.utils.ts` (glyph SVG switch lives inline in each `.tsx`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/empty-data-tailwind-classes.ts` (199 ln) |
| Component token file | `libs/falcon-ui-tokens/src/components/empty-data.tokens.css` (130 ln) |
| Config defaults | `libs/falcon-ui-core/src/configurations/falcon-defaults.json` + `falcon-configuration.service.ts` (`resolveEmptyData()`) + `falcon-configuration.types.ts` |
| Data-table integration | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (`[emptyData]` input + `patchEmptyDataInstance` + auto-mount via `createComponent`) |
| Unit spec | _none found_ — `[CODE]` no `*.spec.ts` / `*.e2e.ts` for this component (GAP G7) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-empty-data` |
| Stencil Shadow tag | `<falcon-empty-data>` |
| Stencil Light tag | `<falcon-empty-data-tw>` |

> `[CODE]` empty-data.tokens.css:24-27 ALSO lists a `falcon-empty-data-shadow` selector and the token header (line 12) names `<falcon-empty-data-shadow>` — but **no such Stencil component exists on disk** (only `falcon-empty-data` + `falcon-empty-data-tw`). Stale token comment — see GAPS_AND_UPGRADES G6.

## Known consumers (grep verified 2026-06-03)

`[CODE]` Direct `<falcon-angular-empty-data` render: **1 file** (host-shell showcase). `[CODE]` Indirect via the data-table `[emptyData]` shorthand config: **9 files** across both consoles + showcase. `[CODE]` Re-exported from `libs/falcon/src/shared-ui/index.ts:220-227` (`FalconAngularEmptyDataComponent` + `FalconEmptyDataConfig`/icon-key/mode/border/size types).

Representative consumers:
- `apps/host-shell/.../falcon-ui-showcase/library-section/empty-data-section.component.ts` — the ONLY direct `<falcon-angular-empty-data>` render (live preview, dual-mode demo).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.{ts,html}` — `[emptyData]` config on the user list table (`[CODE]` org-hierarchy-page-menu.component.ts:125-128 — message-only, `showAction`/`showInfo` hard-false).
- `apps/{admin,management}-console/.../templates-page/components/templates-list.component.{ts,html}` (`[CODE]` templates-list.component.ts:232/241 — "data-table auto-mounts `<falcon-empty-data>`").
- `apps/{admin,management}-console/.../contracts-cost-management/contracts-cost-management.component.html` — `[emptyData]` config.
- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` — `[emptyData]` config.

See `USAGE.md` Consumer Sweep for the full enumerated list.

## Related components

- **Lighter sibling:** `<falcon-empty-state>` — minimal icon-font + title + description + action *slot*, no card chrome, no CTA-button-with-event, no info chip, no modes. The two are NOT duplicates — different fidelity tiers (see GAPS_AND_UPGRADES G1 reconcile note + RECOGNITION).
- **Primary host:** `<falcon-angular-data-table>` — auto-mounts this via `[emptyData]` (`[CODE]` falcon-data-table.component.ts:390/505/1056-1083).
- **Config provider:** `FalconConfigurationService.resolveEmptyData()` supplies per-app default copy/icon when the consumer omits inputs.
- The CTA button + info chip are rendered **internally** (native `<button>` + inline SVG) — this component does NOT compose `<falcon-angular-button>` (GAP G2).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework Stencil core + Angular wrapper). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`. Default copy/icon defaults owned by `FalconConfigurationService` (per-app `falcon-defaults.json` + `registerEmptyDataOverride`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 sweep, NEW dossier). Source-file table confirmed on disk; consumer split (1 direct render + 9 `[emptyData]` config files + 1 lib re-export) grep-verified; `falcon-empty-data-shadow` confirmed NON-EXISTENT (stale token comment).
