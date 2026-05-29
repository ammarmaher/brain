---
type: business-scenarios-atlas
volume: 14
title: "Falcon Business Scenarios Atlas — Volume 14: Customer Success Playbook (Lifecycle Health, Churn Signals, Expansion)"
purpose: "Once a client is live, how do we keep them happy + grow the relationship? Health metrics, churn signals, expansion patterns. The doc for Customer Success Managers."
volume-14-deep-dives: 5
---

# Falcon Business Scenarios Atlas — Volume 14

> Vol 1 covered onboarding. Vol 7 covered off-boarding. This volume covers everything between: keeping clients healthy, spotting trouble before they leave, and growing the relationship.

---

## DEEP-DIVE 63 — Client Health Metrics (what to track, what they mean)

### The 8 core health metrics

For each active client, track:

**1. Wallet Burn Rate (SAR/day)**
- `valueSar_used_last_30d / 30`
- Healthy: stable or increasing month-over-month
- 🟡 Warning: -25% MoM (declining usage)
- 🔴 Critical: -50% MoM (potential churn)
- 🚨 Alert: Master Wallet < expected burn × 30 days (running out)

**2. Active User Count (concurrent users)**
- Unique users who logged in within last 7 days
- Healthy: stable percentage of total user count
- 🟡 Warning: <30% of total user count (under-utilization)
- 🔴 Critical: <10% (account dormant)

**3. Send Transaction Volume (msgs/day)**
- Daily message count
- Compare to historical baseline + contract committed volume
- 🟡 Warning: <50% of historical
- 🔴 Critical: zero sends for 7+ days

**4. Contract Utilization Rate**
- `valueSar_used / valueSar_total` per contract
- Healthy: linear consumption (e.g., 50% used at 50% of duration)
- 🟡 Warning: <30% consumption at 75% duration (will lose money on expiry)
- 🔴 Critical: 100% used before 50% duration (will need to add value mid-contract)

**5. Failed Send Rate**
- `failed_sends / total_sends` (per day)
- Healthy: <1%
- 🟡 Warning: 5-10% (template/wallet/config issue)
- 🔴 Critical: >10%

**6. Template Status Drift**
- Count of templates with Meta state: Low Quality, Paused, Disabled
- Healthy: <10% in negative states
- 🟡 Warning: 20-30% degraded
- 🔴 Critical: >50% (sender reputation compromised)

**7. Permission Group Distribution**
- Distribution of users across permission groups
- Healthy: aligned with org structure
- 🟡 Warning: >80% users in one group (under-utilizing PBAC)
- 🟢 Note: not a numeric signal but a discovery prompt

**8. Support Ticket Frequency**
- Open tickets per month
- Healthy: <2/month
- 🟡 Warning: >5/month (friction increasing)
- 🔴 Critical: >10/month (unhappiness signal)

### Composite Health Score

Simple weighted formula:
```
HealthScore = 25 × (1 - wallet_burn_trend_decline) +
              20 × (active_users / total_users) +
              15 × (1 - failed_send_rate) +
              15 × (contract_utilization_consistency) +
              15 × (1 - degraded_templates / total_templates) +
              10 × (1 - log10(support_tickets))
```

Range: 0-100.
- 80-100: Healthy
- 60-79: Watch
- 40-59: At risk
- <40: Critical

### Where this data lives in Falcon

| Metric | Source | Query effort |
|---|---|---|
| Wallet burn | Charging WalletRecord aggregation | Easy |
| Active users | Identity Session table | Easy |
| Send volume | Charging or Application service | Medium (depends on integration) |
| Contract utilization | Commerce Contract.remainingValueSar | Easy |
| Failed sends | Need a "failure event" capture (gap?) | 🟡 May not be tracked formally |
| Template status | Templates service (when built) | 🔴 Blocked on GAP-T-001 |
| Permission distribution | Identity User aggregation by permissionGroupId | Easy |
| Support tickets | External (Zendesk / CRM) | External integration needed |

### Business implications

| Question | Answer |
|---|---|
| "Do we have a single Health Score per client today?" | **No — not yet.** Build it. The data is mostly available; integration + dashboard is the missing piece. |
| "What's the most predictive single signal of churn?" | **Wallet burn rate decline** — clients reduce usage 60-90 days before formal termination. Watch for sustained 25%+ MoM declines. |
| "How often should CSM review health?" | Weekly for top-tier accounts. Monthly for SMB. Quarterly business review for all. |
| "What's the action threshold?" | Health Score <60 triggers a CSM-led conversation. <40 triggers escalation to leadership. |

---

## DEEP-DIVE 64 — Churn Signals (the early warning list)

### Quantitative churn signals (data-driven)

1. **Wallet burn rate declining 3+ consecutive months** — strongest signal
2. **Contract approaching expiry without renewal conversation** — operational signal
3. **Active users <30% of total for 2+ months** — utilization signal
4. **Support tickets spiking** — friction signal
5. **High failed-send rate persisting** — technical issue not getting resolved
6. **Account Owner inactive 30+ days** — relationship-level signal
7. **No new templates / contact groups created in 60+ days** — stagnation signal

### Qualitative churn signals (relationship-driven)

8. **Decision-maker turnover at client** — new CIO/CTO often re-evaluates vendors
9. **Client mergers/acquisitions** — consolidation often kills smaller vendor contracts
10. **Public competitor wins at adjacent clients** — copycat behavior likely
11. **Negative QBR feedback** — "we expected more from this engagement"
12. **Pricing renegotiation requests** — often a precursor to leaving
13. **Sandbox / POC requests for competitor** — direct shopping signal

### Operational churn signals (relationship process)

14. **Contract renewal conversation not started 90 days before expiry**
15. **CSM hasn't had a meeting in 45+ days**
16. **Client hasn't logged into management-console in 30+ days**
17. **Falcon admin frequently asked to do tasks the client could self-serve** — UX friction

### Churn response playbook

When 2+ signals fire:

**Phase 1 — Investigate (week 1)**
- CSM does a "no-agenda" call with AO
- Listen for unspoken concerns
- Review usage data together
- Document concerns + commitments

**Phase 2 — Co-create solutions (week 2-3)**
- Address technical issues
- Propose pricing/contract adjustments if pricing came up
- Schedule executive sponsor call if needed

**Phase 3 — Commitment + monitor (week 4+)**
- Mutual action plan with dates
- Weekly check-ins until health restored
- Escalate if no improvement in 30 days

### Business implications

| Question | Answer |
|---|---|
| "What's the typical lead time on churn signals?" | 60-120 days. Plenty of time to react if you're watching. |
| "How do we automate churn detection?" | Build a dashboard with the 8 health metrics + alert rules. Manual review of qualitative signals stays human. |
| "Who owns churn prevention?" | CSM with executive sponsor backup. Engineering owns the technical signals (failed sends, template drift). |

---

## DEEP-DIVE 65 — Expansion Patterns (turn small clients into big ones)

### The natural expansion ladder

```
Pilot → Pilot Success → Single CommChannel Production → 
   Multi-channel → Multi-account → Enterprise tier → 
   Strategic partnership
```

### Triggers for each expansion step

**Pilot → Production:**
- 100% successful pilot transactions (no failed sends)
- Stakeholder buy-in confirmed
- Contract signed (typical: 6-12 month initial term)

**Single-channel → Multi-channel:**
- Established usage pattern on the first channel
- Business case for the second channel (e.g., "we want Voice for IVR notifications in addition to WhatsApp")
- Often a separate contract for the new channel

**Multi-channel → Multi-account:**
- Different business units adopting Falcon separately
- Or: hierarchical management requirement (e.g., parent + subsidiaries)
- Falcon's hierarchical model is a strong fit

**Standard tier → Enterprise tier:**
- Volume crosses 1M msgs/day threshold
- SLA requirements increase
- Custom integration or compliance needs

**Enterprise → Strategic:**
- Reference client / case study
- Co-marketing opportunities
- Joint product development (e.g., Saudi-specific features)
- Multi-year contracts with TCV >5M SAR

### Expansion playbook (CSM-driven)

**At 6-month mark of any contract:**
1. CSM presents usage analytics + ROI estimate
2. Discuss roadmap fit (any new channels or features the client wants)
3. Identify other business units that could benefit

**At contract renewal time (-90 to -30 days):**
1. CSM + sales partner present:
   - Renewal proposal (extend at same terms, or step up)
   - Expansion proposal (additional channels / accounts / users)
   - Strategic upgrade proposal (enterprise tier, premium support)
2. Negotiate with the executive sponsor

### What doesn't work for expansion

❌ Cold "upsell" pitches without ROI evidence
❌ Pushing channels client doesn't need
❌ Discounting before the client asks (signals desperation)
❌ Ignoring the client's strategic priorities

### Specific Falcon expansion plays

**Play 1 — "From WhatsApp-only to Multi-channel"**
- Pitch: "You're sending 100k WhatsApp messages/day. Adding Voice for high-priority notifications would let you reach the 20% of recipients who don't read WhatsApp within 1 hour."
- Expected uplift: +30-50% contract value

**Play 2 — "From Production to Multi-account"**
- Pitch: "Your sister subsidiary [Y] would benefit from the same platform. We can configure their own account under your parent organization."
- Operational fit: Falcon's hierarchical model
- Expected uplift: +100% for new account

**Play 3 — "From Standard to Enterprise SLA"**
- Pitch: "At your volume, an enterprise tier with 99.99% SLA and dedicated CSM is appropriate."
- Expected uplift: +50% in service fees

**Play 4 — "Strategic Partnership"**
- Pitch: "Become a reference client. We'll feature you, you get [credit / co-marketing / early access]."
- Expected uplift: long-tail relationship lock-in + market validation

### Business implications

| Question | Answer |
|---|---|
| "What's the typical expansion timeline?" | 6-month review surfaces expansion opportunities. Negotiation happens at 9-12 month mark (before renewal). |
| "Which expansion play has highest hit rate?" | Multi-account (Play 2) — Falcon's hierarchy is a strong fit and sister subsidiaries are easier sales (warm referral). |
| "How much of growth comes from expansion vs new logos?" | [INFERRED] — strong SaaS companies see 30-50% NRR from expansion. Set this as a target. |

---

## DEEP-DIVE 66 — QBR (Quarterly Business Review) Template

### The 60-90 minute QBR meeting structure

**Pre-meeting (CSM prep, 1-2 hours)**

Pull from Falcon's data:
- Last quarter's usage stats
- Health score trend
- Open tickets + resolutions
- Renewal status / upcoming contract dates
- Industry/regulatory updates

**Meeting agenda**

| Time | Topic | Owner |
|---|---|---|
| 0-5 min | Welcome + intros (if new faces) | CSM |
| 5-15 min | Usage review (data + visuals) | CSM presents |
| 15-30 min | What went well + what could be better | Client speaks |
| 30-45 min | Roadmap preview (Falcon side) | CSM or product partner |
| 45-60 min | Client roadmap (their plans) | Client shares |
| 60-75 min | Action items + commitments | Both sides |
| 75-90 min | Open Q&A | Both sides |

### What to bring to the QBR

**Slides (max 10):**
1. Title slide: "Q[N] [YEAR] Business Review — Client Name × Falcon"
2. Executive Summary (1-line state of the relationship)
3. Usage by channel (chart)
4. Wallet burn vs contract value (chart)
5. Top 5 templates by send volume + their state
6. Open tickets + resolution times
7. Health Score (trend)
8. Falcon roadmap items relevant to this client
9. Client opportunities (expansion ideas, but soft)
10. Action items + next steps

**Don't bring:**
- Internal-only metrics
- Other clients' data
- Premature roadmap commitments
- Pricing negotiations (separate meeting)

### Common QBR failure modes

| Failure | Mitigation |
|---|---|
| Client side has the wrong people in the room | Confirm attendees + roles 1 week before |
| Data is wrong / outdated | Triple-check Falcon DB queries day-of |
| No clear action items at end | Force-rank with mutual ownership |
| Client doesn't show up | This IS the churn signal — escalate |
| Going long on technical issues | Park them; sales-relationship is the focus |

### Business implications

| Question | Answer |
|---|---|
| "How often should we run QBRs?" | Quarterly for top accounts, semi-annually for mid-tier, annually for SMB. |
| "Who attends from Falcon side?" | CSM always. Sales for renewal/expansion conversations. Product or engineering only if there's a roadmap conversation. Never solo engineering. |
| "What's the success metric of a QBR?" | Health score maintained or improved. Action items closed by next QBR. Client engagement (do they show up prepared?). |

---

## DEEP-DIVE 67 — Customer Success Org Design

### CSM structure (when to scale)

**Stage 1 — Founder-led (1-20 clients):**
- Sales + CSM = same person
- High-touch, low scale
- Works until ~20 clients

**Stage 2 — Pooled CSM (20-100 clients):**
- 1-2 dedicated CSMs
- Each owns 30-50 accounts
- Mix of high-touch (top 10) and low-touch (rest)

**Stage 3 — Tiered CSM (100-500 clients):**
- Enterprise CSMs (dedicated, 10-15 accounts each)
- Mid-market CSMs (20-30 accounts each)
- SMB CSMs (50-80 accounts each via mostly-digital touch)

**Stage 4 — Specialized (500+ clients):**
- Technical Account Managers (TAMs) for top accounts
- Customer Success Engineers for technical issues
- Onboarding specialists (separate from steady-state CSMs)
- Customer Marketing (case studies, references)

### Key CSM-adjacent roles

**Sales Engineer (SE):**
- Pre-sales technical demos
- POC support
- Hands-off to CSM at signed contract

**Customer Success Engineer (CSE):**
- Technical deep-dive issues
- Integration troubleshooting
- Hands product knowledge that CSM doesn't have

**Implementation Specialist:**
- Owns Add Client wizard execution
- Initial Contract Details matrix setup
- Hands-off to CSM at go-live

**Renewals Manager:**
- Owns contract renewals
- Coordinates with CSM (relationship) + Sales (commercial)
- Separate from CSM at scale (different incentives)

### Falcon's current CS state

[INFERRED] — Likely founder-led or early Stage 2. Recommend:
- Stand up first dedicated CSM role by Year 2 (when client count reaches ~30)
- Standardize QBR template + Health Score before scaling CSM
- Build self-service onboarding to reduce Stage 1 burnout

### Business implications

| Question | Answer |
|---|---|
| "When do we hire our first CSM?" | When founder/sales-leader can no longer dedicate 20% time per top-10 client. Typically client count 20-30. |
| "What's the CSM-to-client ratio?" | Enterprise: 10-15 accounts. Mid: 20-30. SMB: 50-80. Adjust per touch model. |
| "How does CSM measure success?" | Composite: Net Retention Rate (NRR) for assigned accounts + Health Score trend + Customer Satisfaction (NPS / CSAT). |

---

## Continuous mining queue update

Volumes 1-14 = 72 deep analyses.

Remaining queue:
- **Vol 15:** Revenue Operations + Forecasting
- **Vol 16:** Vendor Management (Meta + Zitadel + voice providers)
- **Vol 17:** Disaster Recovery + BCP Full Playbook
- **Vol 18:** Internationalization Roadmap (MENA + EU)
- **Vol 19:** Internal Operating Model (eng + sales + ops)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 14 (Customer Success Playbook) written 2026-05-18 · 72 deep-dives total.*
