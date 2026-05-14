# Validation Rules — Organization Hierarchy

> Granularity: field/flow level. Status taxonomy per [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md).

## Quick stats

| Total | Applied | Not Applied | Applicable | Not Applicable | Unknown |
|---|---|---|---|---|---|
| 9 | 0 | 4 | 4 | 0 | 1 |

**Dimension score: 0%** = 0 / (0 + 4 + 4) × 100 = 0%
(Capped to 5% in PAGE_SCORECARD to reflect partial knowledge of source rules)

---

## Add Client wizard — Step 1 (Client Information)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| VAL-001 | Account Name required + "Start with letter · Max 30 Characters" | HTML §12 step 1 | unknown | not_applied | Wizard exists but validation rules not wired | Add `Validators.required` + pattern + maxLength | 2026-05-14 |
| VAL-002 | Finance ID required (text) | HTML §12 step 1 | unknown | not_applied | Same as above | Add `Validators.required` | 2026-05-14 |
| VAL-003 | Error message format: `*Please fill this field` (red, below field) | HTML §12 | unknown | applicable | Error styling pattern needs implementation | Define error template | 2026-05-14 |

## Add User wizard — Step 1 (Personal Information)

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| VAL-004 | First Name + Last Name + User Name all required | HTML §13 step 1 | unknown | not_applied | Validators not confirmed | Verify or add | 2026-05-14 |
| VAL-005 | Phone Number required AND must pass OTP verification before save | HTML §13 + §14 | unknown | applicable | OTP component exists; "must verify before save" rule not wired | Wire `cannot_save_until_verified` | 2026-05-14 |
| VAL-006 | Email Address required AND must pass OTP verification before save | HTML §13 + §14 | unknown | applicable | Same as above | Same | 2026-05-14 |

## OTP

| ruleId | Title | Source | Destination | Status | Reason | Next action | Last checked |
|---|---|---|---|---|---|---|---|
| VAL-007 | OTP accept rule: ALL-ZEROS pass (per Brain SK task spec) | Brain SK task spec | `OtpMockService` (already in code) | applied | Reported in `gaps-and-next-actions.md` D-W17.01-01 | — | 2026-05-14 |
| VAL-008 | OTP non-zeros fail (per Brain SK task spec) | Brain SK task spec | `OtpMockService` | applied | Same | — | 2026-05-14 |
| VAL-009 | OTP expires after 60 seconds → "Code expired — please resend" | HTML §14 | unknown | unknown | Timer behavior not verified live | Live test | 2026-05-14 |

## Cross-cutting validation patterns NOT yet documented

These are gaps in our validation knowledge — listed so we know what to ask about:
- Settings tab IPs: format validation (IPv4 / IPv6)?
- Settings tab limits: min/max bounds for Max Normal/System User counts?
- Add Client step 1: Postal Code format (numeric? country-specific?)?
- Add Client step 5 (Account Owner): Password rules? National ID/Iqama format?
- Add Node drawer: Node Name uniqueness within parent?
- Disabled-state rules: when is "User Status" disabled (always per source code, but is it ever enabled by role)?

All of the above are tracked in [`GAP_REGISTRY.md`](GAP_REGISTRY.md).

## Source-of-truth notes

- React source `admin/otp-verify.jsx` defines the OTP code rule: `joined === '150999'` is invalid, everything else is valid. Brain SK task spec inverts this (all-zeros pass). Brain SK spec wins per protocol.
- React source uses HTML `<input required>` for most required fields; Angular implementation likely needs `Validators.required` to match.
- No explicit phone/email regex captured from React — Angular implementation may use Falcon library validators or add custom.
