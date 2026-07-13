# falcon-select — DECISION

> Sweep-refreshed 2026-06-03 (B04).

## Brain SK final recommendation

**STATUS: DEAD CANDIDATE / ALIAS.** `[CODE]` `falcon-select/index.ts:1` is flagged "DEAD CANDIDATE - flagged Night Shift 2026-05-16 - verify before removal", and grep 2026-06-03 confirms **0 real consumers**. For all single-select work use `<falcon-angular-dropdown>` directly. Do not add new `FalconAngularSelectComponent` imports.

## Use this component for

- Nothing new. It is a spec-name alias of `<falcon-angular-dropdown>` — use the dropdown.

## Avoid this component for

- Anything dropdown shouldn't be used for, AND avoid the alias name itself (flagged for removal).

## Preferred render path

`useTailwind=true` — same as dropdown (it IS the dropdown class).

## Required upgrades

None. The only open decision is **remove vs promote** (see GAPS): either delete the dead-candidate re-export (`safe-local`, no UI change) or promote it to a real `falcon-angular-select` selector (G1). The current alias+dead-flag+0-use state should be resolved.

## Relationship

- IDENTICAL to `<falcon-angular-dropdown>` (re-exported class).
- Siblings: `<falcon-angular-multi-select>`, `<falcon-angular-combobox>`.

## Exact rule for future implementation tasks

1. Need a select / dropdown? → use the `<falcon-angular-dropdown>` HTML tag and the `FalconAngularDropdownComponent` class.
2. Do NOT import `FalconAngularSelectComponent` in new code — it is a DEAD CANDIDATE.
3. All behaviour, inputs, outputs, tokens, gaps — see `../falcon-dropdown/` (9 files).

---

## Dynamic capability assessment

See `../falcon-dropdown/DECISION.md` Dynamic capability assessment — identical (same class).

### Alias-specific notes

- The alias is a zero-cost re-export, but unused and flagged for removal.
- If `<falcon-angular-dropdown>` is renamed/split in future, the alias must follow — but it should likely just be deleted.
- The only meaningful (and optional) upgrade is promoting it to a real `falcon-angular-select` selector; otherwise remove it. `risk-class safe-local`.

## Verification
🟢 code-verified DEAD-CANDIDATE flag + 0-consumer status (2026-06-03). Capability inherited from `../falcon-dropdown/DECISION.md`. 🟢 RE-VERIFIED 2026-06-03 (W1-b) — no change.
