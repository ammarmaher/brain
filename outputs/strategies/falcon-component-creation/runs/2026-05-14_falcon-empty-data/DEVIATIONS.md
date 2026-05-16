# Deviations from doctrine — `falcon-empty-data` (2026-05-14)

> Every departure from strategy v1.0 canonical pattern is recorded here. Each entry includes: what happened, why, mitigation applied, and the suggested addition to [08-COMMON_PITFALLS.md](../../08-COMMON_PITFALLS.md).
> Source prefixes: `[CODE]` = `C:\Falcon\Falcon\falcon-web-platform-ui`; `[BRAIN-OUT]` = `C:\Falcon\Brain Outputs\…`; `[INFERRED]` = author reasoning.

---

## Summary

| # | Deviation | Severity | Impact on score | Mitigation | Doctrine update needed |
|---:|---|---|---:|---|---|
| 1 | Two-pass bootstrap of Stencil build (loader chicken-egg) | Medium | Dim #8 −10, Dim #14 +10 (net +0, but cost ~30 s) | Comment loader entry → build → uncomment → rebuild | **YES** — pitfall #11 in `08-COMMON_PITFALLS.md` |
| 2 | `title` → `titleText` prop rename (HTMLElement reserved-name clash) | Low | Dim #11 −5 | Renamed across types, both Stencil components, Angular wrapper, consumers | **YES** — pitfall #12 (or extend existing reserved-name pitfall) |
| 3 | No `.utils.ts` created (no pure helper logic to extract) | None | 0 | Documented as conformant with doctrine "optional" rule | NO — already covered by doctrine |

**Net effect on score:** −1.6 pp vs prediction (97.8% → 96.2%). All deviations were caught in-flight; none required code revert.

---

## Deviation 1 — Two-pass bootstrap of Stencil build

### What happened

On the first attempt at `nx build falcon-ui-core`, TypeScript rejected the loader entry in `[CODE]` `libs/falcon-ui-core/src/define-falcon-tw-component.ts`:

```
TS2307: Cannot find module '../dist/components/falcon-empty-data-tw'
or its corresponding type declarations.
```

The new entry pointed at a path that Stencil **emits during** this very build but TypeScript validates **before** Stencil runs. Classic chicken-egg: the file you're about to produce is the file the type-check needs to find.

### Why

Strategy v1.0 §06 (Execution Protocol) and §07 (Integration Points) describe adding the loader entry as a single edit. They do **not** call out that on a first-time component scaffold the `dist/` artefact does not exist yet, so the build can't even start.

This is invisible on iterations 2+ for the same component (the dist is already present from a prior build), which is why prior runs of doctrine on existing components never surfaced it. The first calibration run is exactly where it surfaces.

### Mitigation applied

Two-pass bootstrap:

1. Commented out the new `falcon-empty-data-tw` mapping in `define-falcon-tw-component.ts`.
2. Ran `nx build falcon-ui-core` → GREEN. Stencil emitted:
   - `[CODE]` `libs/falcon-ui-core/dist/components/falcon-empty-data.{js,d.ts,js.map}`
   - `[CODE]` `libs/falcon-ui-core/dist/components/falcon-empty-data-tw.{js,d.ts,js.map}`
3. Uncommented the mapping.
4. Ran `nx build falcon-ui-core` again → GREEN. Loader resolves correctly.

Cost: ~30 s extra wall-clock. Zero net-new code; only a temporary comment toggle.

### Suggested addition to `08-COMMON_PITFALLS.md`

> **Pitfall #11 — Loader entry chicken-egg on first-time component scaffold**
>
> **Symptom:** First `nx build falcon-ui-core` after adding a new `<falcon-*-tw>` component fails with `TS2307: Cannot find module '../dist/components/falcon-*-tw'`.
>
> **Cause:** TypeScript validates `define-falcon-tw-component.ts` imports BEFORE Stencil emits the dist on the same build. The dist file does not exist on first run.
>
> **Fix (two-pass bootstrap):**
>
> 1. Comment out the new entry in `define-falcon-tw-component.ts`.
> 2. Run `nx build falcon-ui-core` once. Stencil emits the dist.
> 3. Uncomment the entry.
> 4. Run `nx build falcon-ui-core` again — GREEN.
>
> **Pre-flight check to skip the detour entirely:** before adding the loader entry, run `nx build falcon-ui-core` once with the new Stencil .tsx files but without the loader edit. Add the entry after the dist exists.

### Impact

- Dim #8 (Loader registration) dropped from predicted 100% → actual 90%.
- Dim #14 (Build pipeline) recovered from predicted 80% → actual 90% (the doctrine's M1 baseline-verify mitigation absorbed the cost).
- Weighted total cost: ~0.6 pp.

---

## Deviation 2 — `title` → `titleText` prop rename

### What happened

Stencil's compile-time check flagged `@Prop() title` as a reserved member of the `HTMLElement` prototype:

```
[ ERROR ] @Prop() "title" conflicts with a property on the HTMLElement
prototype. Choose a different name (e.g. "titleText").
```

`HTMLElement.title` is the browser-defined tooltip attribute; Stencil refuses to shadow it.

### Why

The initial type contract in the pre-flight pass used `title: string` based on the prior "15th iter" attempt's signature. That attempt was deleted in Phase 0 specifically because it was corrupted — and corrupted in this exact way. The repeat happened because the type lock-down used the broken file as a reference.

### Mitigation applied

Renamed throughout:

| Layer | File | Change |
|---|---|---|
| Types SSOT | `[CODE]` `falcon-empty-data.types.ts` | `title: string` → `titleText: string` |
| Stencil Shadow | `[CODE]` `falcon-empty-data.tsx` | `@Prop() title` → `@Prop() titleText`; template `{title}` → `{titleText}` |
| Stencil Light | `[CODE]` `falcon-empty-data-tw.tsx` | Same as Shadow |
| Angular wrapper | `[CODE]` `falcon-empty-data.component.ts` | `@Input() title` → `@Input() titleText`; signal `title()` → `titleText()`; getter/setter renamed |
| Angular template | (inline) | `[attr.title]="title"` → `[attr.title-text]="titleText()"` |
| Data-table integration | `[CODE]` `falcon-data-table.component.ts` | `titleText:` in `emptyDataConfig` literal |
| Showcase | `[CODE]` `empty-data-section.component.ts` | Demo configs use `titleText:` |
| Admin-console consumer | `[CODE]` `org-hierarchy-page-menu.component.ts` | `usersEmptyDataConfig` literal `title:` → `titleText:` |

Result matches the convention already used by sibling `<falcon-empty-state>` (which had the same clash and resolved it the same way long ago).

### Suggested addition to `08-COMMON_PITFALLS.md`

Either:

- **Pitfall #12 — `@Prop() title` is forbidden by Stencil** (with a small grep-gate snippet showing how to scan for `@Prop\(\)\s+title\b` before parallel agent dispatch), or
- **Extend the existing reserved-name pitfall** with the explicit blocklist: `title`, `id`, `dir`, `lang`, `tabIndex`, `scrollHeight`, `scrollWidth`, `offsetHeight`, `offsetWidth`, `style`, `hidden`, `slot`, `inert`. Stencil errors on any of these. Recommended convention: append `Text` for label-style props (`titleText`), `Index` for numeric (`tabIndexValue`), `Hidden` is fine if you really mean the boolean.

### Impact

- Dim #11 (HTML wrapper template) dropped from predicted 100% → actual 95% because the `[attr.title-text]="…"` attribute form is slightly more verbose than a clean kebab-case prop.
- Net cost: ~0.2 pp.

---

## Deviation 3 — No `.utils.ts` created

### What happened

The strategy's canonical pattern (§02 Folder Structure) lists `<component>.utils.ts` as **optional**: "create only when there is pure-function logic to extract".

For `<falcon-empty-data>`, the helpers needed are:

- Variant → CSS class mapping → lives in `[CODE]` `src/tailwind/empty-data-tailwind-classes.ts` (already a separate file for the Light DOM render path).
- Icon name → token mapping → handled inline (single string lookup).
- No date-formatting, no string manipulation, no a11y-label composition needed beyond the simple `aria-label` already inline.

So there was nothing to extract. The empty `.utils.ts` would have been pure ceremony.

### Why

Doctrine permits this explicitly. Recording it as a "deviation" only because a strict reading of the folder template might suggest "one file per type-folder" (per `feedback_folder_structure_pattern.md`). That feedback file applies to **feature-level** folders, not the component-internal utility file which the strategy marks as opt-in.

### Mitigation applied

None needed — this is conformant. Documented for traceability only.

### Suggested addition to `08-COMMON_PITFALLS.md`

None. The doctrine is already clear that `.utils.ts` is optional. No update needed.

### Impact

Zero. Not counted against any dimension.

---

## Roll-up: what propagates back to the strategy

| Strategy file | Update needed | Reason |
|---|---|---|
| `08-COMMON_PITFALLS.md` | **YES — append pitfall #11** | Loader chicken-egg (Deviation 1) |
| `08-COMMON_PITFALLS.md` | **YES — append/extend pitfall #12** | Reserved HTMLElement prop names (Deviation 2) |
| `06-EXECUTION_PROTOCOL.md` | Optional — add a pre-flight grep gate before parallel agent dispatch: `grep -nE '@Prop\(\)\s+(title|id|dir|lang|tabIndex|scrollHeight|scrollWidth|offsetHeight|offsetWidth|style|hidden|slot|inert)\b' <component>.tsx` | Hardens against Deviation 2 |
| `09-CHANGELOG.md` | **YES** — log calibration run + the two pitfalls promoted from this run | Versioning hygiene |

---

_Last updated: 2026-05-14 — Run: 2026-05-14_falcon-empty-data — Strategy: v1.0 — Author: Adnan (auto)_
