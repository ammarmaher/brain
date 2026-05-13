# falcon-select — DECISION

## Brain SK final recommendation

**STATUS: ALIAS / READY.** Use as a TS class alias only. HTML tag stays `<falcon-angular-dropdown>`.

## Use this component for

- Same as dropdown — see `../falcon-dropdown/DECISION.md`.
- Specifically: when spec-aligned naming ("Select") in TS imports is desired.

## Avoid this component for

- Anything dropdown shouldn't be used for.

## Preferred render path

`useTailwind=true` — same as dropdown.

## Required upgrades

None blocking. Optionally G1 (add HTML selector for full naming alignment) — P3.

## Relationship

- IDENTICAL to `<falcon-angular-dropdown>`.

## Exact rule for future implementation

1. Need a select / dropdown? → use `<falcon-angular-dropdown>` HTML tag.
2. Prefer the class name `FalconAngularSelectComponent` in TS imports for spec alignment.
3. All behaviour, inputs, outputs, tokens, gaps — see dropdown docs.

---

## Dynamic capability assessment

See `../falcon-dropdown/DECISION.md` Dynamic capability assessment — identical.

### Alias-specific notes

- The alias is a zero-cost convenience.
- If `<falcon-angular-dropdown>` is renamed or split in future, the alias must follow.
- Adding an HTML selector for `falcon-angular-select` is the only meaningful upgrade option, and it's optional.
