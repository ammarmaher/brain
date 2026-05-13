*** Completion Sound Rules — test-case-authoring ***
*** When and how the low-high-low signature is played ***

# Completion Sound Rules

## Signature

```powershell
[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)
```

Pattern: low-high-low ("Peeep / PeeeP / Peeep").

## When to play

Emit ONLY after a **full** module test plan generation succeeds. "Full" means:
- `<module>.feature` is written
- `test-plan.md` is written with all 20 edge-case rows filled (or N/A)
- `coverage-matrix.md` is written
- Coverage written back to `module-catalog/modules/<slug>/coverage.md`

## When NOT to play

- Adding a single scenario to an existing feature
- Mid-generation status updates
- Validation runs without generation
- Errors / partial output

## Order of operations

1. Generate scenarios → write `.feature`
2. Write `test-plan.md` with edge-case checklist
3. Write `coverage-matrix.md`
4. Update `module-catalog/.../coverage.md`
5. Print completion report
6. **Then** emit sound

If any step fails, do not emit. Report the failure instead.

## Example shell call

```powershell
powershell -NoProfile -Command "[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)"
```
