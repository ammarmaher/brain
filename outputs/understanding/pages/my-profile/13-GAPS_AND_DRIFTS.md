*** My Profile — Gaps & drifts ***
*** 2026-05-18 ***

# My Profile — Gaps & Drifts

## Inherits Edit User gaps

Most anti-patterns from Edit User apply:
- GAP-MP-NGMODEL (template-driven NgForm)
- GAP-MP-PRIMENG (PrimeNG components)
- GAP-MP-SCSS (heavy SCSS)
- GAP-MP-OTP-EXPIRY-DRIFT (60s vs 120s)

## My-Profile-specific

### GAP-MP-COMPONENT-REUSE-CONFUSION — Shared component, conditional tabs

[CODE] `UserProfileComponent` is reused for both My Profile (`/profile`) and Edit User (`/profile/:nodeId`). The component checks `!!nodeId` to determine mode. New UI should split into separate components for clarity.

### Q-MP-AVATAR-DELETE-DOUBLE-CONFIRM — Is the confirm dialog necessary for own profile?

Edit User has confirm dialog for delete (likely because admin shouldn't accidentally delete subordinate's photo). For My Profile, single confirm may suffice OR even no confirm (user is editing own data).

Decide.

### Q-MP-BACK-TO-DASHBOARD — Where does Cancel go?

Edit User cancel goes back to org-hierarchy list. My Profile cancel goes... where? Dashboard? Previous page? Stay on My Profile in read-only mode?

## See also

- `../edit-user/13-GAPS_AND_DRIFTS.md` · [00-OVERVIEW](00-OVERVIEW.md)
