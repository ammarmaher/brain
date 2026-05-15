*** /learn-screenshot — force screenshot intake on the latest image ***

# /learn-screenshot

Force a screenshot intake pass on the most recent image Ammar dropped, even if auto-detection skipped it.

Behavior:

1. Resolve the page + section (ask if ambiguous).
2. Save the original under `Brain Outputs/understanding/pages/<page>/evidence/<learningId>/source.png`.
3. Scan for visual markers:
   - red border / box → `sourceType: bug`, category `uiux`, status `pending`
   - red X / cross → proposed wrong/rejected pattern, status `pending` (NOT auto-rejected)
   - green tick / check → proposed approved pattern, status `pending` (NOT auto-approved)
4. If readable text present, transcribe verbatim to `evidence/<learningId>/SCREENSHOT_NOTES.md`.
5. Append a fully-populated event to `LIGHT_LEARNING_EVENTS.md` with status `pending`.
6. Append to `EVIDENCE_INDEX.md`.
7. Cross-link any matching Falcon Eyes report folder.
8. Echo a 1–3 line acknowledgement.

Hard rule: screenshot annotations propose status, never set it. Ammar's words set status.

Skill: `domains/frontend/page-learning/SKILL.md`.
