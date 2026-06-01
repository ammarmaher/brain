---
name: Q-UM-* resolution claims require code verification, not policy verification
description: Past memory entries that claimed Q-UM-12 / Q-UM-13 were resolved by reading PRD enums were partly wrong — code did not match policy. Always pair PRD-confirmed resolutions with code mining before claiming RESOLVED.
type: feedback
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Lesson — Q-UM-* RESOLVED status requires code verification

**Why:** During Wave 14 code-mining (2026-05-18), I discovered that Q-UM-12 ("password security level — confirm 2-tier") and Q-UM-13 ("admin OTP path") were marked RESOLVED in prior memory entries based on PRD enum/text confirmation only. Code verification revealed:

- **Q-UM-12 (password tiers)** — enum exists with Normal=1, Advanced=2, but `PasswordPolicy.cs` applies **identical rules** to both. Advanced is a no-op. Memory entry overstated the resolution.
- **Q-UM-13 (per-tenant/admin OTP)** — no per-tenant OTP toggle in `TenantSettings`, no admin/user differentiation. Memory entry overstated the resolution.

**How to apply:** A question is only RESOLVED when:
1. The PRD answer is known AND
2. The CODE implements the answer AND
3. The CODE has been verified by reading file:line.

If only step 1 is done, mark the question as 🟡 PARTIAL or 🟡 PRD-RESOLVED-CODE-PENDING. Do NOT use 🟢 RESOLVED.

When future code-mining reveals a drift between PRD intent and code behavior, **re-open the question** and spawn a fix task — don't just update the memory entry.

**Examples of the drift class:**
- Enum value exists but enforcement is identical across values → no-op (Q-UM-12 case).
- Concept defined in BRD but no entity/field/handler exists in code → not implemented (Q-UM-13 case).
- Field exists but is loaded-but-never-read (e.g., `MaxSystemUserLimit`) → dead config.
- Webhook handler bypasses domain policy → security regression (the BUG §1 case).

**Trigger phrases to invoke this discipline:**
- Whenever a session about to write "Q-XX-NN RESOLVED" — pause, ask "did I verify this in code?"
- Whenever an Atlas volume is being written that depends on a "RESOLVED" question — add a code-verification addendum step.
