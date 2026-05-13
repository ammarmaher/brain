<!-- *** plan-l3-technical.md *** -->
<!-- *** L3 — Technical deep dive. File-by-file, patterns, tests, rollback. <=200 lines. *** -->
<!-- *** Gate: user must approve this file before any code is written. *** -->

# L3 — Technical Deep Dive

- **Task ID:** {{task_id}}
- **Approved L2 at:** {{l2_approved_at}}
- **Author agent:** {{agent}}
- **Target project(s):** {{target_projects}}

## Summary of approach
{{approach_summary}}

## File-by-file change list
| # | File path | Action | Purpose |
|---|-----------|--------|---------|
| 1 | {{file_1_path}} | {{file_1_action}} | {{file_1_purpose}} |
| 2 | {{file_2_path}} | {{file_2_action}} | {{file_2_purpose}} |
| 3 | {{file_3_path}} | {{file_3_action}} | {{file_3_purpose}} |
| 4 | {{file_4_path}} | {{file_4_action}} | {{file_4_purpose}} |

## Patterns / libraries to use
- **Pattern:** {{pattern_main}}
- **Libraries:** {{libraries}}
- **Folder shape:** {{folder_shape}}
- **Component/service split:** {{component_split}}

## Best-practice notes
- {{bp_1}}
- {{bp_2}}
- {{bp_3}}

## Data / contract changes
- **DTOs:** {{dto_changes}}
- **API endpoints:** {{api_changes}}
- **Storage:** {{storage_changes}}
- **Events:** {{event_changes}}

## Test plan
| Layer | Test type | Files | Owner |
|-------|-----------|-------|-------|
| Unit | {{unit_what}} | {{unit_files}} | {{unit_owner}} |
| Integration | {{int_what}} | {{int_files}} | {{int_owner}} |
| E2E / Gherkin | {{e2e_what}} | {{e2e_files}} | {{e2e_owner}} |

## Roll-back plan
- **Trigger:** {{rollback_trigger}}
- **Steps:** {{rollback_steps}}
- **Data backfill:** {{rollback_data}}

## Validation commands
```
{{validation_commands}}
```

## Out of scope (explicit)
- {{oos_1}}
- {{oos_2}}

<!-- *** Approval: run `plan-gate.ps1 -TaskId {{task_id}} -Layer L3 -Action approve` *** -->
<!-- *** Rejection: run `plan-gate.ps1 -TaskId {{task_id}} -Layer L3 -Action reject -Reason "..."` *** -->
<!-- *** Approval of L3 unlocks code-writing phase (.l3-approved + .ready-to-code markers). *** -->
