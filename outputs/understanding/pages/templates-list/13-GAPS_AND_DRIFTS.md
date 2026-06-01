*** Templates List — Gaps & drifts ***
*** GAP-T-001 critical · 2026-05-18 ***

# Templates List — Gaps & Drifts

## CRITICAL: GAP-T-001 — Template CRUD endpoints MISSING

[BRAIN-OUT] Backend has only 3 communication-channel-config endpoints. Template CRUD (list, get, create, edit, submit, approve, reject, delete, Meta webhook) does NOT exist.

**Status:** Blocks all Template UI work until backend ships.

**Per F-019:** "Document as GAP, continue." — done.

## High-severity gaps

### Q-TM-CHECKER-ROLE — How is Checker assigned?

PRD silent on whether Checker is:
- A global role
- Per-account permission group
- Per-CommChannel permission

→ Flag for product clarification.

### Q-TM-04 — Voice template wizard structure unknown

PRD-05 only mined head (250 lines of 982). Voice + AI wizard details deferred.

### Q-TM-PRD-COVERAGE — PRD only 25% mined

Many rules deferred — needs deep-mining of PRD-05 latest.

### GAP-T-LIST-NO-OLD-UI — No old-UI source

The templates feature does not appear in old-UI extracted dossiers. Either:
- It lives in management-console (not yet extracted)
- It does not exist in old UI yet
- It's inside marketplace-applications (need to verify)

## Medium

### Q-TM-LIST-PAGINATION — pageNumber/pageSize shape?

Standard backend Falcon pagination is `pageNumber=&pageSize=`. Confirm.

### Q-TM-FILTERS — Which filter dimensions are required by product?

Mentioned: status, channel, category, language. Confirm "Created By" filter is required.

## Low

(NEW UI standard anti-patterns apply.)

## See also

- [README](README.md) · [08-BACKEND_API](08-BACKEND_API.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
