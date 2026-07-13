# Task history — Edit node name `&` validation bug investigation (2026-06-10)

**Type:** read-only investigation · **Status:** completed · **No commits, no code changes.**

## Question
QA (QATM) bug: "Edit node name does not allow `&` — not following the validation." Is it a real issue? Should `&` be allowed per the Node-name SoT?

## Verdict
- **`&` SHOULD be allowed.** [XLSX SoT] `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx` → "Add Client - Step 1" Account Name: Allowed Special Char = `Space between words | & | Allow apostroph | Allow hyphens`; node name mirrors account name 1:1 per BUG-08 (2026-05-29) parity decision ([BRAIN-OUT] 06-validation-by-feature/MATRIX.md §4b.2) — and the backend's own code comment + PR 42045 claim the same xlsx parity intent.
- **REAL BUG, backend-side.** [CODE] `falcon-core-commerce-svc/src/Falcon.Commerce.Domain/ValueObjects/Node/NodeName.cs:15-16` regex `^[A-Za-z0-9؀-ۿ][A-Za-z0-9؀-ۿ _-]*$` omits `&` (and `'`), wrongly allows `_`, and forces first char letter/digit. Throws `InvalidNodeFormat` → 400 "Invalid Node name format". Identical on commerce `origin/main` (QATM).
- **FE is NOT at fault.** [CODE] `falcon-web-platform-ui/libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:505` `nodeName()` uses `ACCOUNT_NAME_CHARSET=/^[\p{L}\p{N} &'-]+$/u` (allows `&`); both consoles' node-drawer wire `nodeNameValidator`. FE origin/main has NO charset rule at all. Symptom = FE says valid → BE 400.

## Blast radius (single VO, 4 handlers)
ChangeNodeName (Edit node — reported) · CreateSubNode (Add Node) · CreateMainNode (Add Client **account name**) · UpdateMainNodeInfo (Edit account). `NodeNameTests.cs` encodes the wrong charset.

## Proposed fix (awaiting approval — NOT applied)
Regex → `^[\p{L}\p{N}&'-][\p{L}\p{N} &'-]*$` (or minimal-diff Latin+Arabic variant), drop `_`, update tests. Decision needed on `_` removal (legacy `_` names can't be re-saved verbatim) and consecutive-space parity.
