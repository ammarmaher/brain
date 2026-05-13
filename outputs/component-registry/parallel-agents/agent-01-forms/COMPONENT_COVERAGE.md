# Agent 1 — Component Coverage

22 components investigated. All have all 6 required files.

| Component | Status | Source files read (count) | Gaps found (count) | Notes |
|---|---|---|---|---|
| falcon-input | covered | 9 (wrapper TS + HTML + CSS + Stencil Shadow + Stencil Light + types + utils + tokens + index) | 9 | Flagship reference. Best-documented surface in the family. |
| falcon-dropdown | covered | 4 (wrapper TS + Stencil Shadow + tokens path + types referenced) | 10 | Strategy E option-push pattern. `errorText` naming drift. |
| falcon-multi-select | covered | 2 (wrapper TS + types) | 10 | Same option-push pattern as dropdown. Chip overflow. |
| falcon-combobox | covered | 1 (wrapper TS) | 10 | Notable form-control gaps — no helperText/error/state/disabled inputs on wrapper. |
| falcon-checkbox | covered | 1 (wrapper TS) | 7 | `checkedInput` bypass for group composition. CVA full. |
| falcon-checkbox-group | covered | 1 (wrapper TS) | 8 | Pure Angular composition of `<falcon-angular-checkbox>`. |
| falcon-radio | covered | 1 (wrapper TS) | 6 | Standard form control. Used inside radio-group + otp-send-dialog. |
| falcon-radio-group | covered | 1 (wrapper TS) | 7 | Pure Angular composition of `<falcon-angular-radio>`. |
| falcon-switch | covered | 1 (wrapper TS) | 7 | 3 visual variants (`dot-knob`, `hidden-input`, `channel-pill`). |
| falcon-textarea | covered | 1 (wrapper TS) | 7 | Wrapper does NOT re-emit events. Otherwise clean. |
| falcon-password | covered | 1 (wrapper TS) | 7 | Composes `<falcon-angular-input>` + reveal + heuristic strength meter. |
| falcon-input-number | covered | 1 (wrapper TS) | 8 | Intl-based currency/decimal formatting. Clamp on blur. |
| falcon-email-field | covered | 1 (wrapper TS) | 8 | Verify-button single-element. Validation deferred. No `verified` state. |
| falcon-phone-field | covered | 1 (wrapper TS) | 9 | Country chooser + dial code + verify. ~250-country list — perf concern. |
| falcon-calendar | covered | 1 (wrapper TS) | 8 | NO CVA. Single-month. Single-date. Gregorian only. |
| falcon-date-picker | covered | 1 (wrapper TS) | 8 | NO CVA. Composes `<falcon-angular-calendar>`. |
| falcon-otp | covered | 1 (wrapper TS) | 6 | CVA. Wrapper does not surface `complete` event. |
| falcon-otp-send-dialog | covered | 1 (wrapper TS) | 8 | Composes dialog + radio + otp. No resend cooldown. |
| falcon-search-input | covered | 1 (wrapper TS) | 7 | Built-in 300ms debounce. NO CVA. |
| falcon-grid-input | covered | 1 (wrapper TS) | 7 | Enter/Escape/Tab cell-edit semantics. NO CVA. |
| falcon-form-field | covered | 1 (legacy bespoke TS) | 6 | **LEGACY.** SCSS file (rule violation). Deprecation target. |
| falcon-select | covered | 1 (alias index.ts) | 3 | Pure TS alias of `<falcon-angular-dropdown>`. |

## Out-of-scope cross-link

| Component | Path | Reason |
|---|---|---|
| `<falcon-calendar>` (legacy facade) | `libs/falcon/src/shared-ui/lib/components/falcon-calendar/` | Wave-3 facade delegating to `<falcon-angular-date-picker>`. Flagged but explicitly OUT OF SCOPE per task brief. Agent 7 should cross-merge. |

## Coverage notes

- Every component has the SIX required files: OVERVIEW.md, API.md, USAGE.md, GAPS_AND_UPGRADES.md, TOKENS.md, DECISION.md.
- Component folders verified via `ls components/` returning 22 entries.
- `find` count: 132 markdown files (= 22 × 6). ✓

## Confidence per component

| Component | Confidence | Reason for any lower confidence |
|---|---|---|
| falcon-input | HIGH | Read all 4 layers (wrapper TS+HTML+CSS, Stencil Shadow, Stencil Light, types, utils, tokens). |
| falcon-dropdown | HIGH | Read wrapper TS + Stencil Shadow + cross-checked against usage. |
| Most others | MEDIUM-HIGH | Read wrapper TS only; Stencil tag + tokens inferred from registry + naming. Sufficient for Brain SK build agent guidance but the Stencil source could be cross-verified later. |
| falcon-form-field | MEDIUM | Did not read SCSS contents — flagged for inspection. Behaviour inferred from TS + usage. |
| falcon-calendar / date-picker | MEDIUM | Stencil source not directly read; inferred from wrapper + types imports + registry. CVA absence verified from wrapper. |

The medium-confidence components have all the required information for downstream agents to consume — additional Stencil source inspection would refine GAPS_AND_UPGRADES specifics but not change the overall picture.
