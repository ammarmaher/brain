*** Falcon Eyes — Semantic Mismatch Template ***
*** Path: tools/falcon-eyes/semantic-mismatch-template.md ***
*** Created: 2026-05-15 ***

# Single Mismatch Record — Template

> Copy this block once per visible defect into `SEMANTIC_MISMATCH_BACKLOG.md` AND into the section-specific `sections/<section>/SEMANTIC_MISMATCHES.md`. Pixel diff is just evidence; this block carries the **semantic** understanding.
>
> **Reporting contract:** every Falcon Eyes run produces one report per screenshot section under `sections/<section-name>/`, one combined run report (`ALL_SCREENSHOTS_SUMMARY_REPORT.md`), one screenshot index (`ALL_SCREENSHOTS_INDEX.md`), one semantic mismatch backlog (`SEMANTIC_MISMATCH_BACKLOG.md`), and one Falcon component repair map (`FALCON_COMPONENT_REPAIR_MAP.md`). No exceptions.

---

### Mismatch `FE-<YYYY-MM-DD-HHmm>-<section>-<n>`

| Field | Value |
|---|---|
| Section | `tabs-header` / `comm-channels-tab` / ... |
| Source screenshot | `source/<section>.png` |
| Destination screenshot | `destination/<section>.png` |
| Diff screenshot | `diff/<section>.diff.png` |
| Expected (source) | *Describe the source UI literally — e.g. "Compact header, 40px row, neutral-100 surface, right-aligned actions"* |
| Actual (destination) | *Describe the destination UI literally — e.g. "Header is 56px, surface is neutral-200, actions wrapped to second line"* |
| Category | `component structure` / `layout` / `spacing` / `alignment` / `typography` / `color/token` / `border/radius` / `shadow/elevation` / `row height` / `column width` / `table header style` / `table body style` / `cell rendering` / `action placement` / `hover state` / `active/selected state` / `validation state` / `missing component` / `wrong component` / `missing action` / `wrong data` / `wrong interaction` / `missing dynamic API` / `missing shared component upgrade` / `accessibility issue` / `unknown/source unclear` |
| Severity | `P0` blocker / `P1` major / `P2` medium / `P3` polish |
| Likely cause | *Token / density / template / slot / wrong component / etc.* |
| Related Falcon component | `falcon-table` / `falcon-tabs` / `falcon-button` / `falcon-dialog` / ... |
| Source-expected behavior | *Interaction or visual behavior expected from the reference UI* |
| Destination-actual behavior | *What the destination actually does today* |
| Required Falcon repair | *Specific input / template / slot / token / upgrade — see customization order* |
| Tailwind / token fix | *Token names + Tailwind classes only — no inline styles, no SCSS, no hardcoded values* |
| Likely file to change | *e.g. `apps/admin-console/src/app/.../comm-channels.html`* |
| Test / screenshot proof | *e.g. `diff/<section>.diff.png` ≤ 2 % after fix; new automated screenshot test* |
| Status | `open` / `fixed` / `deferred` / `blocked` |

### Customization order applied

Tick which option the repair uses (first applicable wins):

- [ ] 1. Existing Falcon component **inputs / config**
- [ ] 2. Existing Falcon **`ng-template`** support
- [ ] 3. Existing Falcon **slots / content projection**
- [ ] 4. Existing Falcon **Tailwind / token** variants
- [ ] 5. Shared Falcon component **upgrade** (new input / slot / template)
- [ ] 6. **New reusable** Falcon component in the library
- [ ] 7. Feature-local wrapper (page-specific only)
- [ ] 8. Raw implementation (last resort — document as GAP in component `GAPS_AND_UPGRADES.md`)

### Falcon component dossier check

- [ ] Read `Brain Outputs/understanding/frontend/components/<component>/API.md`
- [ ] Read `Brain Outputs/understanding/frontend/components/<component>/USAGE.md`
- [ ] Read `Brain Outputs/understanding/frontend/components/<component>/TOKENS.md`
- [ ] Read `Brain Outputs/understanding/frontend/components/<component>/GAPS_AND_UPGRADES.md`
- [ ] Read `Brain Outputs/understanding/frontend/components/<component>/DECISION.md`
- [ ] If a new token / slot / input is required, add it to `GAPS_AND_UPGRADES.md` for the owning component

### Notes

*Free-form notes — RTL implications, a11y impact, expected delta on the section scorecard, related mismatches, etc.*
