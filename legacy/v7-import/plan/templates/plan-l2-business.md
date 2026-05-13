<!-- *** plan-l2-business.md *** -->
<!-- *** L2 — Business detail. Rules, permissions, transitions, edges. <=80 lines. *** -->
<!-- *** Gate: user must approve this file before L3 is generated. *** -->

# L2 — Business Detail

- **Task ID:** {{task_id}}
- **Approved L1 at:** {{l1_approved_at}}
- **Author agent:** {{agent}}

## Business rules
| # | Rule | Source (PRD/Wiki) | Notes |
|---|------|-------------------|-------|
| 1 | {{rule_1}} | {{rule_1_source}} | {{rule_1_notes}} |
| 2 | {{rule_2}} | {{rule_2_source}} | {{rule_2_notes}} |

## Permission matrix
| Role | Can view | Can create | Can edit | Can delete |
|------|----------|------------|----------|------------|
| {{role_1}} | {{r1_view}} | {{r1_create}} | {{r1_edit}} | {{r1_delete}} |
| {{role_2}} | {{r2_view}} | {{r2_create}} | {{r2_edit}} | {{r2_delete}} |

## Status transitions
{{status_transitions}}

## Edge cases
- {{edge_1}}
- {{edge_2}}
- {{edge_3}}

## Validation rules
- {{validation_1}}
- {{validation_2}}

## UI states
- **Empty:** {{state_empty}}
- **Loading:** {{state_loading}}
- **Error:** {{state_error}}
- **Success:** {{state_success}}

## Regression risks
- {{regression_1}}
- {{regression_2}}

## Acceptance criteria
- [ ] {{ac_1}}
- [ ] {{ac_2}}
- [ ] {{ac_3}}
- [ ] {{ac_4}}

<!-- *** Approval: run `plan-gate.ps1 -TaskId {{task_id}} -Layer L2 -Action approve` *** -->
<!-- *** Rejection: run `plan-gate.ps1 -TaskId {{task_id}} -Layer L2 -Action reject -Reason "..."` *** -->
