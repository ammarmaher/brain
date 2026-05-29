---
type: page-flow
page: bsa-voice-ivr-send
module: 06-basic-send-application
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx §Voice (IVR) Module"
---

# BSA — Send IVR Voice Message Flow

> Voice IVR Module follows same architecture as WhatsApp Module with Voice-specific differences.

## TL;DR

Same lifecycle + flow as WhatsApp Send (see [[BSA-WhatsApp-Send]]) with these Voice-specific differences:
- Sender ID = Voice phone number linked to Voice CommChannel
- Template = Static IVR OR Dynamic IVR
- Preview = replay IVR nodes + variable replacements + call termination behavior
- Payload dispatched to SIP / Voice providers (not Meta)

## Steps

1. **Select Sender ID** — Voice phone number linked to Voice CommChannel
2. **Select IVR Template** — Static IVR OR Dynamic IVR; only Approved
3. **Add Recipients** — same as WhatsApp (Contact Groups + manual + variable mapping)
4. **Preview** — Preview IVR flow + play IVR nodes + hear variable replacements
5. **Schedule Sending** — same options
6. **Submit**

## Voice template types

- **Static IVR** — fixed audio for all recipients; no variables
- **Dynamic IVR** — supports Digits / Number / Date variables; personalized per recipient

## Voice send logic

Same engine as WhatsApp regarding balance deduction, batch processing, duplicate handling, variable replacement, transaction statuses. Payloads dispatched to SIP/Voice providers.

## Status FSM

Same as WhatsApp: `Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted}`

## Voice-specific transaction details

- IVR Name
- IVR Type (Static / Dynamic)
- Call statuses per recipient
- Send/Status dates
- Message cost
- Voice preview replays actual generated IVR call

## Source

- [[06-Basic-Send-Application]]
- [Atlas Vol 40 §4 W3](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)
- [[Create Template WhatsApp Flow]] (similar wizard; Voice template authoring → see Vol 41)

## Tags

#type/page-flow #module/bsa #flow/send-voice-ivr
