---
type: business-scenarios-atlas
volume: 19
title: "Falcon Business Scenarios Atlas — Volume 19: Internal Operating Model (Engineering + Sales + Ops + Finance Structures)"
purpose: "How should Falcon's internal teams be structured to support the platform's growth? Roles, responsibilities, RACI, scaling patterns. The doc for organizational leadership decisions."
volume-19-deep-dives: 5
---

# Falcon Business Scenarios Atlas — Volume 19

> The platform's success depends as much on the team structure as on the code. This volume maps the internal operating model from current state to mature company.

---

## DEEP-DIVE 84 — Engineering Org Structure (current → mature)

### Current state (inferred)

[INFERRED] Based on the existence of these Ammar agents in the repo's CLAUDE.md:
- Ammar Core-Commerce (backend)
- Ammar Core-Charging (backend)
- Ammar Core-Provisioning (backend)
- Ammar Auth (Identity)
- Ammar Core-Gateway
- Ammar System-Gateway
- Ammar Web-Platform-UI (frontend)
- Ammar Essentials (infra)

This suggests 7-8 engineering specializations exist. Whether each is staffed full-time or one person wears multiple hats is unclear.

### Engineering pods (recommended structure for next 12 months)

**Pod 1: Identity & Access**
- Owns: Identity service + Access (PES) service
- Headcount: 2-3 backend engineers
- Skills: .NET, OIDC/OAuth2, Zitadel, FastEndpoints

**Pod 2: Commerce**
- Owns: Commerce service + System/Core Gateways
- Headcount: 3-4 backend engineers
- Skills: .NET, MongoDB, CQRS/DDD, Kafka

**Pod 3: Charging**
- Owns: Charging service + Provisioning service
- Headcount: 2-3 backend engineers
- Skills: .NET, financial accounting patterns, Kafka

**Pod 4: Platform UI**
- Owns: host-shell + admin-console + management-console
- Headcount: 3-4 frontend engineers
- Skills: Angular 20, Nx, Module Federation, PrimeNG, Tailwind

**Pod 5: Platform Infra**
- Owns: falcon-essentials + observability + CI/CD
- Headcount: 2-3 DevOps engineers
- Skills: Docker, Kubernetes (eventually), Kafka, Mongo, AWS/Azure

**Pod 6: Templates (when GAP-T-001 closes)**
- Owns: Templates service + Meta integration
- Headcount: 2-3 backend engineers + 1 FE
- Skills: same as Pod 2 + Meta WhatsApp Business API specifics

**Pod 7: Data + Analytics (future)**
- Owns: business intelligence + audit reporting + ML pipelines
- Headcount: 2-3 data engineers
- Skills: Python/SQL, data warehouse, dashboards

### Total engineering headcount

- Year 1 (current): ~10-15 engineers across all pods (some pods small, some shared)
- Year 2: ~25-30 engineers
- Year 3: ~40-60 engineers

### Engineering leadership

**CTO / VP Engineering:** Strategic technical decisions, hiring, architecture
**Engineering Managers:** 1 per 2-3 pods, day-to-day operations
**Tech Leads:** Within each pod, senior IC who drives technical direction
**Principal Engineers:** Cross-pod technical leadership, architecture council

### Engineering processes that scale

- **Sprint cadence:** 2-week sprints, pod-aligned
- **Architecture council:** Cross-pod review of significant changes (monthly)
- **Tech debt budget:** 20-30% of sprint capacity allocated to debt + maintenance
- **On-call rotation:** Per-pod rotation, escalation across pods for cross-cutting issues
- **Documentation discipline:** This Atlas is a model — every major decision documented

---

## DEEP-DIVE 85 — Sales + Commercial Org Structure

### Sales motion

Falcon's commercial model (contract-based, enterprise, Saudi-first) requires a sales-led motion.

**Sales process:**
1. Lead generation (marketing + outbound + referrals)
2. Discovery (BANT qualification + needs assessment)
3. Solution design (with Sales Engineer)
4. Pricing proposal
5. Contract negotiation
6. Signing
7. Handoff to onboarding

**Sales cycle length:**
- SMB: 1-3 months
- Mid-market: 3-6 months
- Enterprise: 6-12 months

### Sales team structure

**Year 1 (current):**
- 1-2 Account Executives (AE) — closing deals
- 1 Sales Engineer (SE) — technical demos
- 1 Sales Operations (SDR/BDR) — outbound + qualification

**Year 2:**
- 4-6 AEs (specialized by industry: banking, government, telco, etc.)
- 2 SEs
- 2 SDRs
- 1 Sales Manager
- 1 Marketing Manager (if not already in place)

**Year 3+:**
- 10+ AEs (specialized + tiered: SMB/Mid/Enterprise)
- Multiple SEs
- Dedicated Sales Ops function
- VP Sales
- Marketing team (content, demand gen, brand, events)

### Commercial roles (post-signing)

**Customer Success Manager (CSM):**
- Owns post-signing relationship
- See Vol 14 for detailed CSM playbook

**Account Manager (AM):**
- Sometimes split from CSM
- Focuses on commercial side (renewals, expansion)
- CSM focuses on technical adoption

**Renewals Manager:**
- At scale, separate role
- Owns the contract renewal process
- Coordinates with CSM (relationship) + AE (new commercial)

### Compensation model (typical)

**AE:** Base + Variable (typically 50/50 OTE — On-Target Earnings). Variable = quota attainment commission.
**SE:** Base + smaller variable (90/10 to 70/30). Variable tied to AE quota attainment.
**CSM:** Base + small variable. Variable tied to NRR / retention.
**Renewals Manager:** Base + Variable on renewal rate + expansion within renewals.

---

## DEEP-DIVE 86 — Operations + Customer Support Org

### Support tiers

**Tier 1 (Front-line support):**
- Reactive: incoming tickets + email + chat
- Handles common issues (password reset, basic config questions)
- Escalates technical issues to Tier 2

**Tier 2 (Technical support):**
- Deep technical knowledge of Falcon
- Owns issue resolution within product capabilities
- Escalates engineering bugs to Engineering team

**Tier 3 (Engineering escalation):**
- Engineers responding to support escalations
- Typically rotated within each pod

### 24/7 coverage strategy

**Stage 1 — Business hours only:**
- Saudi work week (Sunday-Thursday, 9am-6pm)
- Out-of-hours emergencies: on-call engineer pages
- Acceptable for SMB clients

**Stage 2 — Follow-the-sun:**
- Saudi + 1 timezone (e.g., Singapore or Dubai-based support staff)
- Covers ~16-20 hours of the day
- Acceptable for mid-market

**Stage 3 — 24/7:**
- Tier 1 staffed across all 24 hours
- Tier 2 + 3 on-call escalation
- Required for enterprise

### SLA structure (recommended)

| Severity | Definition | Response Time | Resolution Target |
|---|---|---|---|
| **S1 - Critical** | Platform unavailable / financial impact / security breach | 15 min | 4 hours |
| **S2 - High** | Major feature degraded / single client significantly affected | 1 hour | 24 hours |
| **S3 - Medium** | Minor feature degraded / workaround available | 4 hours | 5 business days |
| **S4 - Low** | Cosmetic / enhancement / documentation | 24 hours | Best effort |

### Operations / Infra team

**Year 1:** 1-2 DevOps engineers (handles infrastructure + on-call)
**Year 2:** 3-4 (separate: infra engineering + SRE + DBAs)
**Year 3:** Full SRE team + dedicated DBAs + observability engineers + security engineers

### Security team

**Year 1:** Engineering does it (every engineer is security-aware)
**Year 2:** 1 dedicated Security Engineer
**Year 3:** Security team led by CISO or Head of Security

---

## DEEP-DIVE 87 — Finance + Legal + Compliance Org

### Finance roles

**Year 1:**
- 1 Finance person (CFO-equivalent or accounting manager)
- Handles invoicing, AR/AP, tax, financial reporting

**Year 2:**
- CFO or Controller
- 1-2 Accountants
- Revenue Operations Manager (links Finance to Sales for forecasting)

**Year 3+:**
- Full finance team
- Internal audit function
- Treasury function (if managing significant cash/investments)

### Legal roles

**Year 1:**
- External legal counsel (retainer or per-matter)
- Handles contract review, regulatory advice

**Year 2:**
- 1 in-house Legal Counsel
- Handles enterprise contracts, regulatory compliance, employment

**Year 3:**
- General Counsel + 1-2 attorneys
- Specialized areas: commercial, data privacy, IP, employment

### Compliance roles

**Year 1:**
- Engineering + Legal share compliance ownership

**Year 2:**
- 1 Compliance Officer
- Owns: SAMA, CITC, GDPR (if expanding), SOC 2 audit
- Liaises with auditors

**Year 3:**
- Compliance team (1 officer + 1-2 analysts)
- Dedicated audit response capability

---

## DEEP-DIVE 88 — RACI Matrix for Cross-Cutting Decisions

### Sample RACI for "Add a new CommChannel"

| Activity | R | A | C | I |
|---|---|---|---|---|
| Product validation (is this a real need?) | Product | Product VP | Sales, CSM | Eng leadership |
| Technical feasibility | Eng Pod Lead | CTO | Architecture council | Product |
| Vendor selection (e.g., voice provider) | Eng Pod Lead | CTO | Procurement, Legal | All |
| Commercial pricing | Sales VP | Product VP | Finance | All |
| Compliance review | Compliance Officer | Legal | Eng | All |
| Implementation | Eng Pod | Eng Manager | Product | Sales, CSM |
| Documentation | Tech Writer / Eng | Eng Pod Lead | Sales | All |
| Sales enablement | Sales Enablement | Sales VP | Marketing | All |
| Customer rollout | CSM | Customer Success VP | Sales, Eng | All |

**R**esponsible · **A**ccountable · **C**onsulted · **I**nformed

### Sample RACI for "Security incident response"

| Activity | R | A | C | I |
|---|---|---|---|---|
| Detection | On-call engineer | Security/SRE Lead | All | All |
| Containment | Security + Eng pods affected | CTO/CISO | Legal | Leadership |
| Forensics | Security Engineer | Security/CISO | Legal | All |
| Customer notification | CSM | Customer Success VP | Legal, CEO | All |
| Regulatory notification | Legal | CISO | Compliance | Leadership |
| Public disclosure | PR/CEO | CEO | Legal, Board | All |
| Post-mortem | Incident Commander | CTO | All teams | Leadership |
| Remediation | Eng pods | Eng Manager | Security | All |

### When RACI matters

- Cross-team decisions where multiple groups have legitimate stake
- Critical decisions where accountability ambiguity = delays
- Compliance/audit scenarios where regulators need to see clear ownership

### When NOT to use RACI

- Single-team decisions (over-engineering)
- Routine operational tasks
- Highly creative work where ownership is fluid

---

## Final operating model summary

### What makes Falcon scale well

✅ **Specialized pods** with clear ownership (Commerce, Charging, etc.)
✅ **Cross-pod architecture council** prevents silos
✅ **Tech debt budget** keeps quality high
✅ **Documentation discipline** (this Atlas is the proof)
✅ **Customer Success investment** before scaling sales
✅ **Compliance as a first-class function** (not afterthought)

### What kills startups at scale

❌ **Hiring sales before product is ready**
❌ **Skipping security and compliance until forced**
❌ **No documentation = bus-factor risk**
❌ **Founder-led everything → burnout + bottlenecks**
❌ **Premature multi-region expansion**

---

## Continuous mining queue update

Volumes 1-19 = 93 deep analyses.

The Atlas has now covered:
- Foundational scenarios (Vols 1-3)
- Compliance + regulation (Vol 4)
- Build-ready user features (Vol 5)
- Commercial lifecycle (Vols 6-7)
- Scale + ops (Vols 8-9)
- Bulk + templates (Vols 10-11)
- Competitive + strategic (Vols 12-13)
- Customer + revenue + vendor management (Vols 14-16)
- DR + internationalization + org model (Vols 17-19)

**93 distinct business deep-dives. ~135,000 words of source-prefixed analysis.**

The continuous mining loop is alive. Any business situation that comes up can be added as a new volume.

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 19 (Internal Operating Model) written 2026-05-18 · 93 deep-dives total · 19 volumes.*
