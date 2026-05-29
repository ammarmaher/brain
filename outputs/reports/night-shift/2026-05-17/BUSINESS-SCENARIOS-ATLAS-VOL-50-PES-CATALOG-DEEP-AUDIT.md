# Volume 50 — PES Catalog Deep Audit

> **Specialist depth:** The authoritative audit of Falcon's Permission Enforcement System — the 6 canonical roles, the 58-key factory inventory (vs PRD-stated 47), the 412-seeded-p-rules grid, the 9 orphan keys, the 12 PRD↔code drifts, and the architectural boundary of "what PES enforces vs what handlers enforce".
>
> **Source of truth:** Wave 17 code-mining agent. Files cited verbatim from `BuiltInRoleCatalog.cs` + `falcon-access.registry.ts` + `REGISTRY-RAW.md`.
>
> **Q-AM-16 closure:** This volume CONFIRMS the PES↔PRD drift hypothesis and quantifies it.

---

## §1 — The 6 Canonical Roles

### §1.1 The catalog (BuiltInRoleCatalog.cs:77-290)

| Tier | Role key | Display | File:line |
|---|---|---|---|
| **Falcon** | `sys-admin` | System Administrator | `BuiltInRoleCatalog.cs:77-` |
| **Falcon** | `sys-ops` | System Operations | `BuiltInRoleCatalog.cs:` |
| **Falcon** | `sys-products` | System Products | `BuiltInRoleCatalog.cs:` |
| **Client** | `acc-owner` | Account Owner (AO) | `BuiltInRoleCatalog.cs:` |
| **Client** | `acc-admin` | Node Admin (NA) | `BuiltInRoleCatalog.cs:` |
| **Client** | `acc-user` | Normal User (NU) | `BuiltInRoleCatalog.cs:` |

### §1.2 No type inheritance

The 6 roles have **no class-level inheritance** (sys-admin is NOT a superclass of sys-ops). Each role is a standalone seed of `p`-rules.

### §1.3 Hierarchy encoded as a matrix

The "AO can edit NA can edit NU" hierarchy lives in **`OtherRoleEditMatrix`** at `BuiltInRoleCatalog.cs:18-75` — NOT as type-level inheritance. The matrix is a (role × role) grid that says "can role A edit role B's permissions?".

**Implication:** Adding a new role doesn't auto-inherit existing permissions. The seed for the new role must be explicit.

### §1.4 Falcon-staff vs Client distinction (deeper than just role names)

The PES subject contract distinguishes via the namespace prefix in the JWT `sub` claim:
- Falcon-tier: subject `u:<userId>@<falcon-namespace>`
- Client-tier: subject `u:<userId>@<tenant-id>`

The `PolicySubjectContract` enforces this distinction (per Brain SK CLAUDE.md non-negotiable rule).

---

## §2 — The 58-Key Factory Inventory (vs PRD-Stated 47)

### §2.1 Drift D — the count

Prior brain entries said "**47 PES keys**". Code says **58 strict factory signatures**. The "47" in `REGISTRY-RAW.md` frontmatter was a collapsed/legacy count.

**Q-PES-01 (NEW):** Reconcile the 11-key discrepancy — are 11 keys legitimately new since the count was set, or did the collapse drop them by mistake?

### §2.2 Factory inventory by module

The factories live in `falcon-access.registry.ts`. Grouped by module:

| Module | Factory count | Sample keys |
|---|---|---|
| Account Management | TBD | `sys.account/*`, `acc.account/*` |
| User Management | TBD | `sys.user/*`, `acc.user/*` |
| Contract & Cost | TBD | `acc.contract/*` (Falcon-side MISSING — see §5) |
| Contact Group | TBD | `sys.contact-group/*`, `acc.contact-group/*` |
| Templates | **ZERO** (HIGH drift — see §5) | NONE — Template module is entirely PES-blind |
| BSA | TBD | `acc.bsa/*` |
| Wallet | TBD | `wallet.*` |
| System-level | TBD | `dashboard/view` (orphan), `auth_view/view` (orphan), `user_profile/view` (orphan), `microapp.*/view` (orphan) |

Total: **58 strict factory signatures**.

### §2.3 Naming convention

Pattern: `{tier}.{resource}/{action}`
- Tier: `sys` (Falcon-side) | `acc` (Client-side) | bare (system-wide e.g., `dashboard/view`)
- Resource: kebab-case noun (e.g., `contact-group`, `user-permission-group`)
- Action: kebab-case verb (e.g., `add`, `view`, `view-shared`, `share-other`)

---

## §3 — The Seeded P-Rule Grid (412 total)

### §3.1 Per-role seed counts

| Role | Seeded `p`-rules |
|---|---|
| sys-admin | **68** |
| sys-ops | **56** |
| sys-products | **67** |
| acc-owner | **74** |
| acc-admin | **72** |
| acc-user | **75** |
| **TOTAL** | **412** |

### §3.2 What the seed numbers mean

A "seeded `p`-rule" = a row in `BuiltInRoleCatalog.cs` that grants role R access to key K with optional policy expression. The count is the cardinality of `(role × granted-key)`.

Average per role = **68.7 keys** out of **58 factory signatures**. Counts can exceed factory count because a single factory may have multiple expressions per role (e.g., view-with-condition AND view-without-condition).

### §3.3 acc-user has MORE seeded rules than acc-owner — why?

acc-user = 75, acc-owner = 74. Counterintuitive (you'd expect AO to have more authority).

**Hypothesis:** acc-user has more **self-only** rules (e.g., `acc.user-profile/edit` with `r.obj.userid == r.sub.userid`), inflating the count. AO has broader rules but fewer of them.

**Q-PES-02 (NEW):** Audit the rule list to confirm — verify acc-user's extra rules are self-only conditional grants.

---

## §4 — Orphan Keys (9 keys with no seed)

These are factories whose key exists in the registry but **NO role has them seeded**. The factory is dead until a seed is added.

| Key | Module | Severity | Notes |
|---|---|---|---|
| `sys.user/add` | User Mgmt | **HIGH** | Wave 1.3 — blocks Add-User wizard for Falcon side |
| `sys.user-permission-group/assign` | User Mgmt | **HIGH** | Wave 1.3 — blocks permission-group assignment |
| `sys.user-profile-picture/upload` | User Mgmt | **HIGH** | Wave 1.3 — blocks profile-pic upload |
| `sys.contact-group/share-other` | Contact Group | MED | Falcon-side share-with-another-user |
| `acc.contact-group/share-other` | Contact Group | MED | Client-side share-with-another-user |
| `dashboard/view` | System | MED | No role can see the dashboard — UI may dev-bypass |
| `auth_view/view` | System | MED | No role can see auth views |
| `user_profile/view` | System | MED | No role can see user profiles via this key |
| `microapp.*/view` | System | MED | Module Federation micro-app visibility |

### §4.1 Implication for Wave 1.3 wizards

If the Add-User wizard requires `sys.user/add`, `sys.user-permission-group/assign`, or `sys.user-profile-picture/upload`, the wizard is **silently broken** on the Falcon side — no Falcon role can use it because no role has these keys seeded.

**Q-PES-03 (NEW):** Confirm if the Add-User wizard is currently broken on the Falcon side (or if dev-bypass / hardcoded role check covers).

### §4.2 Zero Ghost Permissions

In contrast — **every seed traces to a factory**. No role has been granted a key that doesn't exist. This is the simpler win — the registry is the gate.

---

## §5 — Q-AM-16 CLOSURE: 12 PRD↔Code Drifts

### §5.1 Summary

**Q-AM-16 (long-open):** "PES catalog ↔ PRD sheet drift audit."

**Answer: CONFIRMED — 12 distinct drifts found.**

### §5.2 The drift table

| # | Drift | Severity | Resolution |
|---|---|---|---|
| 1 | Template module entirely PES-blind — no factories, no seeds | **HIGH** | Add `*.template/*` factory family + seed for all 6 roles |
| 2 | Contract & Cost has `acc-*` only — PRD says sys roles should view | **HIGH** | Add `sys.contract/view` factory + seed for all 3 Falcon roles |
| 3 | `sys.user/add` orphan blocks Add-User wizard | **HIGH** | Seed for sys-admin + sys-products |
| 4 | `sys.user-permission-group/assign` orphan | **HIGH** | Seed for sys-admin |
| 5 | `sys.user-profile-picture/upload` orphan | **HIGH** | Seed for self + sys-admin |
| 6 | `sys.contact-group/share-other` orphan | MED | Seed for sys-products (per PRD) |
| 7 | `acc.contact-group/share-other` orphan | MED | Seed for AO, NA (per Vol 44 CG-TT-04) |
| 8 | `dashboard/view` orphan | MED | Seed for all 6 roles |
| 9 | `auth_view/view` orphan | MED | Seed for all 6 roles |
| 10 | `user_profile/view` orphan | MED | Seed for all 6 roles |
| 11 | `microapp.*/view` orphan | MED | Seed per micro-app (depends on which micro-app) |
| 12 | `acc.contact-group/view-shared` only seeded for acc-user — should be all 3 client roles | MED | Seed for AO + NA |

### §5.3 Remediation priority

**HIGH (5 drifts)** — blocks user-facing features. Must fix before Add-User wizard ships.

**MED (7 drifts)** — UX gaps / non-blocking but degraded experience.

### §5.4 Spawn-task recommendation

The 5 HIGH drifts should each become a separate dev task in the next sprint. The 7 MED drifts can be bundled.

---

## §6 — Status-Conditional Gating — NOT in PES

### §6.1 The architectural choice

PES is **status-blind**. The 412 seeded `p`-rules contain **zero policy expressions** that reference user status (Pending / Active / Suspended / Locked / Deleted).

### §6.2 Where status-gating lives instead

Status is enforced at the **command-handler / domain-policy layer**:

| Concern | File |
|---|---|
| Status transitions | `UserStatusTransitionPolicy.cs:16-40` |
| Login eligibility | `LoginEligibilityPolicy.cs:14-26` |
| Forget-password gate | `ForgotPasswordProcess.cs:35-36` |

### §6.3 Implication for Vol 47 (User Lifecycle Specialist)

The "every mutation requires Active status" axiom (Vol 47 §9.1) is enforced **per command handler**, NOT by PES. A future audit should verify every mutation handler has the check; absence is a real risk.

**Q-PES-04 (NEW):** Cross-check all command handlers for status-gating consistency. Are any handlers missing the Active check?

### §6.4 Why this architecture?

- **PES = WHO (role-based).** Static and seedable.
- **Handler-layer = WHEN (state-based).** Dynamic and context-aware.

Mixing them in PES would require state-aware policy expressions (which Casbin / matrix-PES doesn't really support well). The separation is a deliberate concern boundary.

---

## §7 — Creator-Gated Rules — Confined to Contact Group

### §7.1 The 7 creator-gated rules

| File:line | Rule |
|---|---|
| `BuiltInRoleCatalog.cs:205` | sys-* contact-group creator-edit |
| `:206` | sys-* contact-group creator-delete |
| `:243` | acc-* contact-group creator-edit (AO) |
| `:244` | acc-* contact-group creator-delete (AO) |
| `:283` | acc-* contact-group creator-edit (NA) |
| `:284` | acc-* contact-group creator-delete (NA) |
| `:285` | acc-* contact-group creator-share (NU) |

### §7.2 The policy expression

```
r.obj.createdby == r.sub.userid
```

Reads: "request's resource was created by the requesting subject." Enforced at PES layer (server-side).

### §7.3 FE bypass

The FE marks creator-gated rules with `ignoreExpression: true` — meaning FE doesn't try to pre-filter the UI based on expression. The server is the authority; FE shows actions optimistically and the server denies if the creator-gate fails.

### §7.4 Implication for Vol 48 (Contact Group Specialist)

§4.1 of Vol 48 (creator-gate enforcement) is now CODE-VERIFIED. The CG-TT-02 tautology is enforced via PES policy expressions, NOT via handler logic.

### §7.5 Why only Contact Group?

Vol 44 §5 makes creator-gating central for CG. Other resources rely on role-only authorization. Templates use Vol 49 maker/checker (a different pattern). Users have no "creator" concept. Wallets have account-only auth.

---

## §8 — Hierarchy / Node-Scope — OFF the PES Surface

### §8.1 PES is hierarchy-blind

**Zero PES policy expressions reference** `nodeId`, `nodePath`, or sub-tree scope. Examples that would NOT be in PES:
- "AO can edit users in their account" (handled in handler)
- "NA can edit users only in their sub-hierarchy" (handled in handler via `User.Path`)
- "Falcon can edit users in any account" (handled via tenant-namespace check)

### §8.2 Where it lives instead

The `User.Path` field (a slash-separated hierarchy path, e.g., `/account/node-a/node-b`) is used at the handler layer:

```
if (!caller.Path.IsAncestorOf(target.Path)) {
    throw new FalconException(FalconError.NotInScope);
}
```

### §8.3 Implication

PES answers **"WHO is allowed to do action X?"** (role-based, tenant-isolated).

Handler answers **"is the target IN scope?"** (path-based, hierarchy-aware).

Combined: PES first (cheap), then handler (expensive). If PES denies → fast 403. If PES allows → handler checks scope → may still 403.

---

## §9 — Tenant Boundary — IS in PES

### §9.1 The boundary

PES subjects are namespaced: `u:<userId>@<tenant-namespace>`. The `PolicySubjectContract` requires the namespace to match the JWT's tenant claim.

### §9.2 Why this is special

This is the ONE state-related thing PES knows: which tenant the user belongs to. The check happens at every PES evaluation — "is the subject's namespace the same as the resource's expected tenant?"

### §9.3 Multi-tenant safety

Falcon's multi-tenancy security relies on this. A Falcon admin (cross-tenant) has subject `u:<id>@<falcon-namespace>` — they can access ANY tenant. A client user has subject `u:<id>@<tenant-N>` — they cannot access tenant-M.

### §9.4 Implication

Q-PES-05: What's the impact if `PolicySubjectContract` is bypassed (e.g., JWT claim is forged)? This is a **CRITICAL** security boundary — needs a regression test.

---

## §10 — Mental Model: PES vs Handler Authority

### §10.1 The 3-layer enforcement stack

```
Request arrives
   │
   ▼
[Layer 1: Authentication] — JWT valid? Tenant namespace matches?
   │ Otherwise → 401
   ▼
[Layer 2: PES authorization] — Does role have the key? Creator-gate (if applicable)?
   │ Otherwise → 403 (not authorized)
   ▼
[Layer 3: Handler / Domain Policy] — Status=Active? Target in scope? Other invariants?
   │ Otherwise → 422 (business rule violation)
   ▼
Execute command
```

### §10.2 What goes in each layer

| Concern | Layer | Example |
|---|---|---|
| "Is this a valid user session?" | 1 (Auth) | JWT validation |
| "Which tenant?" | 1 (Auth) | Namespace match |
| "Can this role do this action?" | 2 (PES) | sys-admin can `sys.user/add`? |
| "Did I create this resource?" | 2 (PES with expr) | CG creator-gate |
| "Am I logged in as Active?" | 3 (Handler) | Status check |
| "Is the target in my hierarchy?" | 3 (Handler) | Path check |
| "Last-admin guard" | 3 (Handler) | Account invariant |

### §10.3 Test-coverage implication

Each layer needs its own tests:
- Layer 1: JWT validation tests.
- Layer 2: PES seed tests (does role have key?).
- Layer 3: Handler tests (status, scope, invariants).

A bug in any layer is potentially exploitable; defense-in-depth matters.

---

## §11 — PR Review Checklist (PES-touching changes)

- [ ] Is the new key a factory in `falcon-access.registry.ts`?
- [ ] Are all 6 roles' seeds updated in `BuiltInRoleCatalog.cs` (even if the seed is "denied for this role")?
- [ ] If creator-gated, is the policy expression `r.obj.createdby == r.sub.userid` correct?
- [ ] Is the tenant namespace check still happening (via `PolicySubjectContract`)?
- [ ] Are status-conditional checks in the handler layer (NOT in PES)?
- [ ] Are hierarchy-scope checks in the handler layer (NOT in PES)?
- [ ] Is the FE registry updated with the new key (so UI knows about it)?
- [ ] Are tests added for each layer (auth + PES + handler)?
- [ ] If the key is system-level (no `sys.`/`acc.` prefix), is it seeded for ALL 6 roles?
- [ ] Is there a corresponding PRD line item that justifies the key? (avoid undocumented permissions)

---

## §12 — Cross-References

- Vol 44 §3 — User status truth (status-gating in handlers, not PES)
- Vol 44 §5 — Contact Group permission matrix (creator-gate enforced via PES expressions)
- Vol 47 §9 — User Lifecycle PES interactions
- Vol 48 §10 — Contact Group PES interactions (creator-gate)
- Vol 51 §1 — Service ownership (tenant boundary at PES; node-scope at handler)
- WAVE-17-CODE-MINING-PES-CATALOG.md — full agent report (15 sections, ~510 lines)
- `BuiltInRoleCatalog.cs:77-290` — the 6 roles + seeds
- `falcon-access.registry.ts:1-185` — the 58 key factories
- `Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md` — historical (47 collapsed count)
- `Permission-List-Jawad.txt` — Jawad's PRD spreadsheet (the drift source)

---

## §13 — Open Questions Surfaced

| ID | Question | Owner | Severity |
|---|---|---|---|
| Q-PES-01 | Reconcile 47-vs-58 key count drift | Platform | LOW |
| Q-PES-02 | Audit acc-user vs acc-owner seed delta (self-only rules?) | Module 02 | LOW |
| Q-PES-03 | Confirm if Add-User wizard is currently broken on Falcon side (orphan keys) | Module 02 + FE | **HIGH** |
| Q-PES-04 | Cross-check all command handlers for status-gating consistency | All modules | MED |
| Q-PES-05 | What happens if `PolicySubjectContract` is bypassed? Regression test | Security | **CRITICAL** |
| Q-PES-06 (NEW) | Template module PES family — design + seed | Module 05 | **HIGH** |
| Q-PES-07 (NEW) | `sys.contract/view` keys — design + seed | Module 03 | **HIGH** |

---

## §14 — Q-AM-16 Final Status

**Q-AM-16: CLOSED 2026-05-18** — PES↔PRD drift CONFIRMED with 12 specific items (§5.2). 5 HIGH-priority drifts identified for immediate remediation. Spawn-task recommendation: 5 separate dev tasks + 1 bundled MED task.

Subsequent waves should:
1. Open dev tickets for each HIGH drift.
2. Schedule a PES seed audit follow-up after fixes land.
3. Add a regression test for `PolicySubjectContract` (Q-PES-05).

---

**End of Volume 50 — PES Catalog Deep Audit**
**Authored:** 2026-05-18 (night-shift continuation)
**Authority:** Wave 17 code-mining agent + BuiltInRoleCatalog.cs + falcon-access.registry.ts + Permission-List-Jawad.txt
**Closes:** Q-AM-16 (long-standing audit gap)
**Spawns:** 5 HIGH-priority drift dev tasks + 1 critical security regression test
