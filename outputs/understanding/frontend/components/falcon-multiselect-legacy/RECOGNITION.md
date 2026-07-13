# falcon-multiselect (LEGACY) — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify the right Falcon component.
> **⚠ LEGACY / DEPRECATED — the source is no longer in the repository. This component is NEVER a recognition target.**

## Legacy status (read first)
`[CODE]` Live-source check 2026-05-18: `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/` **does not exist**; no `*multiselect*` source file is in the repo. The Wave 3 stub façade has been **deleted**. **No design, screenshot, or snippet should ever resolve to `falcon-multiselect`.** It is recorded here only so an agent that encounters the old name in legacy code or memory knows what to do.

## Visual fingerprint (historical)
`[BRAIN-OUT]` `OVERVIEW.md` — The *original* (pre-stub) `falcon-multiselect` rendered a **dual-panel** layout: a left panel with a search box + a checkbox list of options shown as chips, and a right panel listing the **confirmed "Selected"** items. It supported infinite scroll and a Select-All that persisted across server-filtered pages. `[INFERRED]` This is the visual of a "transfer list" / "dual list box" pattern. The Wave 3 stub dropped all of that and rendered only a plain `<falcon-angular-multi-select>`.

## Cross-library equivalents
If a design shows the **dual-panel "transfer list"** pattern (available list ⇄ selected list):
| Library | Their component | What to use in Falcon instead |
|---|---|---|
| MUI | "Transfer List" composition (two `<List>`s) | no direct Falcon component — see "Composition recipe" |
| PrimeNG | `<p-pickList>` | no direct Falcon component |
| Ant Design | `<Transfer>` | no direct Falcon component |
| Bootstrap | dual-listbox plugin | no direct Falcon component |
| shadcn / Radix | community transfer-list | no direct Falcon component |
| plain HTML | two `<select multiple>` + move buttons | no direct Falcon component |

For an **ordinary multi-value picker** (chips in one field): that is `<falcon-angular-multi-select>` — never this legacy component.

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| **anything at all** | a current component — see right column | `falcon-multiselect` (deleted — never selectable) |
| multiple values as chips in a single field | `<falcon-angular-multi-select>` | falcon-multiselect |
| an always-visible checkbox list | `<falcon-angular-checkbox-group>` | falcon-multiselect |
| a single closed-list pick | `<falcon-angular-dropdown>` / `<falcon-angular-select>` | falcon-multiselect |
| a typed input with suggestions / create-new | `<falcon-angular-combobox>` | falcon-multiselect |
| a genuine **dual-panel transfer list** | no Falcon component exists — raise a feature request (see recipe) | falcon-multiselect (deleted; do not revive) |

## Composition recipe to reach parity
There is **no component to compose** — it is deleted. If a design genuinely requires the dual-panel transfer-list UX the original `falcon-multiselect` had:
1. **First choice** — challenge the design: a standard `<falcon-angular-multi-select>` with chips + search + Select-all covers the great majority of multi-assignment needs without a second panel.
2. **If the explicit "Selected" review panel is essential** — this is a **library GAP**. Raise it as an enhancement on `<falcon-angular-multi-select>` (a `dual-panel` / transfer-list variant), per `feedback_falcon_custom_library_mandatory` — do **not** hand-roll a one-off in app code and do **not** resurrect the legacy component.
3. **Server-filter + infinite scroll** for large catalogues is the `falcon-multi-select` `GAPS_AND_UPGRADES.md` G3 async-options gap — raise it there.

## Anti-patterns
- Resolving any design to `falcon-multiselect` — it does not exist.
- Importing `FalconMultiselectComponent` from `@falcon` — the export is gone; the existing `API.md` import snippet is stale.
- Reviving the legacy component to get the dual-panel UX — raise it as a `falcon-multi-select` enhancement instead.
- Hand-rolling a bespoke transfer list in an app — banned (`feedback_falcon_ui_library_only_no_native`); raise the gap.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) — deletion RE-CONFIRMED (Glob empty; 0 grep hits repo-wide). Upgrades the prior 🔴/2026-05-18 historical correction. This recognition file exists only to redirect any encounter with the legacy name to the live `<falcon-angular-multi-select>`. Never a recognition target.
