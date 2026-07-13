---
name: project_contact_group_share_all_users_multiselect_hydration_2026_06_20
description: "Contact-group detail share editor showed an EMPTY multi-select when re-editing a \"shared with all users\" group; FIXED FE-only by modeling all-users as an explicit mode"
metadata: 
  node_type: memory
  type: project
  originSessionId: 647e5b35-c065-4611-93b3-c21d05bfe1d5
---

Contact-group **detail share editor** (management-console `contact-group-detail.component.ts`) showed an EMPTY multi-select when re-opening Share on a group saved with `sharedWithAllUsers:true`.

**Root cause:** all-users persists as the boolean + an **empty `sharedUsers[]`** (mutex), so `seedShareEditor` had nothing to pre-tick and set `sharedUserIds=[]`; the real user list arrives **async** via the picker search (`shareSearch$ → mergeShareUsers`) but was never re-selected. Save also inferred all-users from "every option ticked" (`sharedUserIds.length === optionCount`) → with an empty box it could **silently DOWNGRADE** an all-users group to a subset on re-save.

**FIX (FE-only, 5 edits, UNCOMMITTED, `nx build management-console` GREEN hash 040ad4f2):** model all-users as an explicit MODE, not an inferred count.
- New `isAllUsersMode` flag + `shareOriginalAllUsers` baseline + `shareSelectionTouched`.
- New `syncAllUsersSelection()` called from `mergeShareUsers` — ticks every loaded option as the async pool grows, while in all-users mode and untouched.
- `onSharedChange` re-derives the flag (all options ticked ⇔ all-users) + sets touched (so auto-sync backs off on a deliberate subset).
- `isShareDirty` is mode-aware: when either side is all-users, dirty only if the flag flips (no false "discard?" prompt, no false clean).
- `persistShare` uses `isAllUsersMode` as the single source of truth → no silent downgrade even if the picker pool only partially loaded.

Scope: management-console detail only (admin detail is read-only; create wizard handles all-users separately → no change). Live-UI verify user-gated. **LESSON:** a boolean-flag + empty-list round-trip (any "all of X" / select-all) must be **hydrated as an explicit mode**, never inferred from `selection.length === options.length` against an async-loaded option pool. Related [[project_contact_group_share_403_pes_baseurl_fix_2026_06_20]].
