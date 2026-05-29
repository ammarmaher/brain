---
type: business-scenarios-atlas
volume: 31
title: "Falcon Business Scenarios Atlas — Volume 31: Error Catalog × Cause × Recovery Matrix"
purpose: "Every error code Falcon surfaces, what causes it, what the user sees, how to recover. Operations + support + engineering reference."
volume-31-error-classes: 8
---

# Falcon Business Scenarios Atlas — Volume 31: Error Catalog

> When something fails, the error message is just the start. This volume maps each error class to its causes + the UX shown + the recovery path.

---

## ERROR FORMAT (used throughout)

Each error documented as:
- **Code** (`FalconKeys.Error.*` if defined)
- **HTTP status** (4xx vs 5xx)
- **Cause** (what triggers it)
- **User-facing message** (what the FE displays)
- **Recovery path** (what user/admin should do)
- **Related rule** (BR-* citation if applicable)

---

## CLASS 1 — Authentication & Authorization Errors

### Code: `Identity.InvalidCredentials`
- HTTP: 401
- Cause: Wrong username or password
- UX: Generic "Invalid credentials" (don't reveal which field)
- Recovery: User retries; after 3 attempts → Locked
- Related: BR-UM-22, BR-UM-27

### Code: `Identity.IpNotAllowed`
- HTTP: 403
- Cause: Client IP not in Account.allowedIps[]
- UX: "Access denied from this network"
- Recovery: Coordinate with Account Owner to add IP to allowlist
- Related: BR-AM-10, BR-UM-24

### Code: `Identity.AccountLocked`
- HTTP: 423
- Cause: 3 wrong logins / 3 wrong OTPs
- UX: "Account locked. Contact your administrator."
- Recovery: Falcon admin must unlock (LCK → PEN); user then redoes First Login
- Related: BR-UM-25, BR-UM-27

### Code: `Identity.AccountSuspended`
- HTTP: 403
- Cause: User.status = Suspended
- UX: "Account suspended. Contact your administrator."
- Recovery: Admin (Falcon or AO/NA per scope) reactivates
- Related: BR-UM-08

### Code: `Identity.OtpExpired`
- HTTP: 410
- Cause: OTP not entered within 60-second window
- UX: "OTP expired. Click Resend." + Resend button visible
- Recovery: User clicks Resend; new OTP sent
- Related: BR-UM-26

### Code: `Identity.OtpInvalid` (LOGIN context)
- HTTP: 401
- Cause: Wrong OTP entered during login
- UX: "Invalid code" + attempts remaining
- Recovery: User retries up to 3 times; then Locked
- Related: BR-UM-27

### Code: (silent on wrong OTP — Forgot Password context)
- HTTP: 200 (no error returned)
- Cause: Wrong OTP entered during Forgot Password
- UX: Silent; UI shows "Continue" but new password not actually set
- Recovery: User can retry OTP infinitely (anti-DoS — BR-UM-32)
- Related: BR-UM-32 — INTENTIONAL asymmetry vs Login OTP

### Code: `Access.PermissionDenied`
- HTTP: 403
- Cause: PES authorize returned deny for (subject, resource, action)
- UX: Action button hidden OR generic "Permission denied" if attempted directly
- Recovery: Admin updates PermissionGroup or Role
- Related: BR-UM-42, BuiltInRoleCatalog.cs

### Code: `Identity.InvalidStage` (NEW — from Wave 5b security finding)
- HTTP: 403
- Cause: Endpoint called outside expected auth flow stage
- UX: Generic error or session re-init prompt
- Recovery: Restart auth flow
- Related: Wave 5b set-password fix recommendation (currently NOT enforced — security vuln)

---

## CLASS 2 — User Management Errors

### Code: `Identity.UsernameAlreadyExists`
- HTTP: 409
- Cause: Attempted username already in use
- UX: "This username is taken. Please choose another."
- Recovery: User picks different username
- Related: BR-UM-12

### Code: `Identity.UsernameImmutable`
- HTTP: 400
- Cause: Update request includes Username field
- UX: "Username cannot be changed"
- Recovery: Don't send Username in update payload
- Related: BR-UM-19

### Code: `Identity.MaxNormalUserLimitExceeded`
- HTTP: 422
- Cause: Account at maxNormalUserLimit; cannot create more Normal Users
- UX: "Cannot create user — account at user limit. Contact Falcon to increase."
- Recovery: Falcon admin raises maxNormalUserLimit
- Related: BR-UM-09, BR-UM-17, BR-UM-38

### Code: `Identity.MaxSystemUserLimitExceeded`
- Same pattern as above but for System Users
- Related: BR-AM-11

### Code: `Identity.EmailPhoneSimultaneousEdit` (NEW — should exist per BR-UM-21)
- HTTP: 400
- Cause: Update request modifies both email AND phone in same call
- UX: "Edit email and phone separately"
- Recovery: Submit one change at a time
- Related: BR-UM-21 — **Wave 5b found this validator is missing in current backend**

### Code: `Identity.InvalidStatusTransition`
- HTTP: 400
- Cause: Attempted status change not allowed (e.g., AO trying DEL → ACT)
- UX: "Cannot change status to that value"
- Recovery: Use appropriate authority (Falcon for DEL → ACT)
- Related: BR-UM-08, BR-UM-39

---

## CLASS 3 — Account + Hierarchy Errors

### Code: `Commerce.AccountNameAlreadyExists`
- HTTP: 409
- Cause: Account Name duplicate (must be globally unique)
- UX: "This account name is already in use"
- Recovery: Choose different name
- Related: BR-AM-03

### Code: `Commerce.MaxNodeLevelsExceeded`
- HTTP: 422
- Cause: Attempt to create sub-node beyond Account.maxNodeLevels
- UX: "Cannot add more sub-node levels (limit reached)"
- Recovery: Falcon admin raises limit
- Related: BR-AM-11

### Code: `Commerce.OwnerIdNotMatchWithTenantId`
- HTTP: 403
- Cause: Client user attempts to access another account's data
- UX: "Permission denied"
- Recovery: User accesses only their own account
- Related: Multi-tenant isolation (Wave 5a finding — AccountHierarchyController missing this check)

### Code: `Commerce.SettingsOnlyAllowedForMainNode`
- HTTP: 422
- Cause: Attempted settings change on sub-node (settings live at account/main-node level)
- UX: "Settings can only be changed at the main node"
- Recovery: Edit settings via Main Node, not sub-node
- Related: Settings tab visibility rules

---

## CLASS 4 — Wallet + Transfer Errors

### Code: `Charging.InsufficientFunds`
- HTTP: 422
- Cause: Wallet balance < required cost (for payment, transfer, or send)
- UX: `<insufficient-balance-warning-dialog>` — "Account doesn't have enough balance"
- Recovery: AO/Falcon transfers funds to wallet, OR negotiates new contract
- Related: BR-CC-32, BR-CC-33

### Code: `Charging.WalletNotConfigForTheNode`
- HTTP: 422
- Cause: WalletTypeConfig not set up for this account/node
- UX: `<insufficient-balance-warning-dialog>` — "Wallet topology not configured. Contact Falcon."
- Recovery: Falcon admin configures WalletTypeConfig
- Related: BR-AM-25, BR-AM-26

### Code: `Charging.CommChannelPriorityOrderRequired`
- HTTP: 422
- Cause: Multiple simultaneous CommChannel activations attempted with conflicting priority
- UX: `<insufficient-balance-priority-dialog>` — drag-drop dialog to specify which CommChannels get paid in what order
- Recovery: User specifies priority via the drag-drop dialog
- Related: Wave 4 finding W4-1 deep-dive on multi-contract priority

### Code: `Charging.TransferLimitExceeded`
- HTTP: 422
- Cause: Transfer amount > Balance Transfer Limit % cap
- UX: "Transfer exceeds your limit. Maximum: X SAR."
- Recovery: Smaller transfer OR Falcon admin raises limit
- Related: BR-AM-34

### Code: `Charging.SourceDestinationSame`
- HTTP: 400
- Cause: Wallet transfer source = destination
- UX: "Cannot transfer to the same wallet"
- Recovery: Choose different destination
- Related: Wallet transfer business rules

### Code: `Charging.CurrencyMismatch`
- HTTP: 422
- Cause: Source + destination wallets have different currencies
- UX: "Cannot transfer between different currency wallets"
- Recovery: Manual currency conversion off-platform
- Related: F-014 in DECISION-PROTOCOL (theoretical — SAR is universal today)

### Code: `Charging.InvalidChargeRequest`
- HTTP: 400
- Cause: Various — bad input or missing required fields
- UX: Generic error or specific per case
- Recovery: Validate input, retry
- Related: Wave 5c TestingCharging finding — used wrongly for "run not found"

---

## CLASS 5 — Contract Errors

### Code: `Commerce.InvalidStartDate`
- HTTP: 400
- Cause: startDate < today (00:00)
- UX: "Start date must be today or later"
- Recovery: Choose valid date
- Related: BR-CC-06

### Code: `Commerce.InvalidExpirationDate`
- HTTP: 400
- Cause: expirationDate ≤ startDate OR ≤ now
- UX: "Expiration date must be after start date and today"
- Recovery: Choose valid date
- Related: BR-CC-07

### Code: `Commerce.InvalidContractValue`
- HTTP: 400
- Cause: valueSar ≤ 0 OR > max limit
- UX: "Contract value must be a positive number"
- Recovery: Enter valid value
- Related: BR-CC-08

### Code: `Commerce.ContractLockedForEdit`
- HTTP: 422
- Cause: Attempt to edit locked field on Active/Expired contract (e.g., Name on Active)
- UX: "This field cannot be edited at the current status"
- Recovery: Cannot — by design. For Name: lock applies. For Value: also locked.
- Related: BR-CC-16

### Code: `Commerce.FarabiRefIdTooLong`
- HTTP: 400
- Cause: farabiRefId > 50 chars
- UX: "Reference ID must be 50 characters or less"
- Recovery: Shorten
- Related: BR-CC-04

### Code: `Commerce.InvalidPriceUnit`
- HTTP: 400
- Cause: Rate Card priceUnit not in predefined list
- UX: "Invalid pricing unit"
- Recovery: Pick from list
- Related: BR-CC-18, BR-CC-21

---

## CLASS 6 — CommChannel + Application Errors

### Code: `Commerce.InvalidEffectiveDateForPeriodicPricingChange`
- HTTP: 422
- Cause: Editing price type/value on Monthly/Yearly CommChannel without valid effectiveDate (must be ≥ renewDate - 1d, clamped to renewDate.Day - 1)
- UX: "Pricing change must be effective at least 1 day before next renewal"
- Recovery: Choose valid effective date
- Related: Brain Outputs Add Client / CommChannel pricing rules

### Code: `Commerce.VisibilityRequiresPricing`
- HTTP: 400
- Cause: Setting visibility=Show without pricingType + priceValueSar
- UX: "Pricing required when CommChannel is visible"
- Recovery: Set pricing fields
- Related: BR-AM-15

### Code: `Provisioning.CannotHideActiveChannel`
- HTTP: 422
- Cause: Attempted Hide on CommChannel with status ≠ InActive
- UX: "Cannot hide an active or pending channel"
- Recovery: Wait until status returns to InActive (Grace ends) OR disable + wait
- Related: BR-AM-14, canHide rule

---

## CLASS 7 — ContactGroup Errors

### Code: `ContactGroup.NameTooLong`
- HTTP: 400
- Cause: name > 50 chars
- UX: "Group name must be 50 characters or less"
- Recovery: Shorten
- Related: BR-CGM-02

### Code: `ContactGroup.FileSizeExceeded`
- HTTP: 413
- Cause: Uploaded file > AppSettings.maxFileSizeMB
- UX: "File too large. Max: X MB"
- Recovery: Split into smaller files OR Falcon admin increases limit
- Related: BR-CGM-04, BR-CGM-30 (limit value unstated in PRD)

### Code: `ContactGroup.UnsupportedFileType`
- HTTP: 400
- Cause: File not CSV/XLS/XLSX
- UX: "Only CSV, XLS, XLSX files supported"
- Recovery: Convert file
- Related: BR-CGM-04

### Code: `ContactGroup.InvalidColumnName`
- HTTP: 400
- Cause: Column name violates rules (non-English letters, special chars, >20 chars, duplicate)
- UX: "Column name invalid. Use English letters only, max 20 chars, no duplicates"
- Recovery: Rename in source file or via column-config step
- Related: BR-CGM-06

### Code: `ContactGroup.OnlyCreatorCanEdit`
- HTTP: 403
- Cause: Non-creator (AO/NA without creator-role) attempts edit
- UX: "Only the creator can edit this group"
- Recovery: Ask creator to make the change
- Related: BR-CGM-26

### Code: `ContactGroup.NormalUserCannotShare`
- HTTP: 403
- Cause: NU attempted share action
- UX: "Sharing requires Account Owner or Node Admin"
- Recovery: Ask AO/NA to share on NU's behalf
- Related: BR-CGM-12

---

## CLASS 8 — Templates Errors (when Template entity API exists)

### Code: `Templates.NameAlreadyExists`
- HTTP: 409
- Cause: Template name not unique per (WhatsApp Business Account + language)
- UX: "Template name already in use for this language"
- Recovery: Different name OR different language
- Related: BR-TM-04

### Code: `Templates.InvalidNameFormat`
- HTTP: 400
- Cause: Name has invalid chars (only a-z, 0-9, _ allowed; no uppercase or spaces)
- UX: "Name can only contain lowercase letters, digits, and underscores"
- Recovery: Reformat
- Related: BR-TM-05

### Code: `Templates.VariableCountExceeded`
- HTTP: 400
- Cause: Body variables > limit (20-30)
- UX: "Too many variables. Max: 30."
- Recovery: Consolidate
- Related: BR-TM-10

### Code: `Templates.VariableAtStartOrEnd`
- HTTP: 400
- Cause: {{var}} at start or end of body
- UX: "Variables must be within meaningful text"
- Recovery: Add surrounding text
- Related: BR-TM-07

### Code: `Templates.SequentialVariablesRequired`
- HTTP: 400
- Cause: Numeric variables not sequential from 1
- UX: "Use {{1}}, {{2}}, {{3}}... in order"
- Recovery: Renumber
- Related: BR-TM-08

### Code: `Templates.MetaApprovalPending`
- HTTP: 422 (when trying to use a Pending template)
- Cause: Send attempted on template still awaiting Meta approval
- UX: "Template not yet approved by Meta"
- Recovery: Wait for approval (≤24h typical)
- Related: BR-TM-18, BR-TM-28

### Code: `Templates.MetaPausedOrDisabled`
- HTTP: 422 (when trying to use a Paused/Disabled template)
- Cause: Send attempted on template with Meta state = Paused or Disabled
- UX: "This template is currently unavailable. Meta has paused it."
- Recovery: Use different template OR rework content + resubmit
- Related: BR-TM-27

---

## OPERATIONAL ERRORS (infrastructure-level)

### Service unavailable (any service)
- HTTP: 503
- Cause: Service down, Kafka unreachable, DB unreachable
- UX: Generic "Temporarily unavailable. Please try again."
- Recovery: Retry; if persistent, contact support
- Related: Vol 9 operational runbooks

### Database timeout
- HTTP: 504
- Cause: DB query exceeded timeout
- UX: "Request timed out. Please try again."
- Recovery: Retry; if persistent, ops investigates Mongo latency
- Related: Vol 17 scaling concerns

### Rate limit exceeded
- HTTP: 429
- Cause: Per-user or per-tenant request rate too high
- UX: "Too many requests. Wait a moment."
- Recovery: Backoff + retry
- Related: Identity throttle rules

---

## SECURITY EVENT CODES (logged but may not surface as user errors)

| Event | Logged where | Action |
|---|---|---|
| Cross-tenant access attempt | Auth log | Alert security |
| Webhook signature mismatch | Identity log | Alert + investigate |
| Privilege escalation attempt | PES log | Alert + investigate |
| Mass account access (suspicious) | Audit log | Alert security team |

---

## How to use this catalog

### In support tickets
1. Get the error code from the user's screenshot or browser console
2. Find it in this catalog
3. Apply the recovery path
4. If recovery doesn't work, escalate to engineering with the cause + related rule

### In incident response
1. Identify the error class
2. Check if multiple users are seeing it (systemic vs isolated)
3. Apply the appropriate runbook from Vol 9
4. Communicate per Vol 14 incident communication standards

### In FE development
1. When implementing a new endpoint, list all possible errors
2. Map each to a user-friendly UX response
3. Add automated tests covering each error path
4. Document in this catalog if new

---

## Continuous mining queue update

Volumes 1-31 = 171 entries (deep-dives + matrices + cascades + errors).

Atlas is now comprehensive across all major business + technical dimensions. Future mining = situational additions.

---

*Falcon Brain Forever-Wave · Vol 31 (Error Catalog) written 2026-05-18 · 8 error classes, ~60 specific error codes mapped to cause + UX + recovery.*
