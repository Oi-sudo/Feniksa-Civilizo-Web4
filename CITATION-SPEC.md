# Feniksa Civilizo Web4 Citation Specification

Version: 0.1-alpha

This document defines the citation rules already implemented in the Web4 archive and passport interfaces. It is a maintenance specification, not a public certification scheme.

## 1. Core principles

- Citation text is stable across ZH / EO / EN interfaces.
- Human-facing labels may be localized; citation type codes remain fixed.
- Public and personal records use separate dossier prefixes.
- Short references use the first 8 hexadecimal characters of the UUID after removing hyphens.
- Full internal database IDs are not displayed in citation text.
- Citation dates come from stable record-identity dates such as creation, finalization, joining, or event occurrence. They must not use a mutable update timestamp when a stable identity date exists.
- "Last updated" may be displayed separately from the citation date.
- Printing or saving as PDF preserves citation text but hides interactive copy/navigation buttons.
- A citation is a locator for a record. It is not a financial certificate, religious attainment certificate, project score, or governance credential.

## 2. Dossier prefixes

### Learning passport
Format:
`Phoenix Passport · <TYPE> · <SHORT_ID> · YYYY-MM-DD`

Current type codes:
- EST
- BUD
- PROJECT
- WORK

PROJECT dates use the member's real `joined_at` date.

### Public project dossier
Format:
`Phoenix Project Dossier · <TYPE> · <SHORT_ID> · YYYY-MM-DD`

Current type codes:
- PROJECT
- MILESTONE
- OUTPUT
- RISK
- STATUS
- BUDGET

Stable date sources:
- PROJECT: project `created_at`
- MILESTONE: milestone `created_at`
- OUTPUT: output `created_at`
- RISK: risk `created_at`
- STATUS: status-event `created_at`
- BUDGET: budget-event `created_at`

### DAD proposal dossier
Format:
`Phoenix DAD Proposal Dossier · <TYPE> · <SHORT_ID> · YYYY-MM-DD`

Current type codes:
- PROPOSAL
- DECISION
- PROPOSAL-STATUS

Stable date sources:
- PROPOSAL: proposal `created_at`
- DECISION: decision `finalized_at`
- PROPOSAL-STATUS: status-event `created_at`

Only aggregated decision data is public. Individual votes are not published.

### DAD governance timeline
Format:
`Phoenix DAD Governance Timeline · GOV-EVENT · <SHORT_ID> · YYYY-MM-DD`

Current type codes:
- GOV-EVENT

Stable date source:
- GOV-EVENT: public governance event occurrence time, derived from the underlying proposal, decision, project-status, or milestone record.

The visible GOV-EVENT short reference is deterministic for the underlying event and is used only as a public locator. It does not publish individual ballots, private membership data, or internal comments.

### Personal project passport
Format:
`Phoenix Personal Project Passport · <TYPE> · <SHORT_ID> · YYYY-MM-DD`

Current type codes:
- PERSONAL-PROJECT
- MEMBERSHIP
- MEMBERSHIP-END
- EST
- BUD

Stable date sources:
- PERSONAL-PROJECT: member `joined_at`
- MEMBERSHIP: member `joined_at`
- MEMBERSHIP-END: member `left_at`
- EST: personal EST record `created_at`
- BUD: personal BUD record `created_at`

Personal project passport records require sign-in. Their locators are stable inside the user's own passport context but are not public record URLs.

## 3. Permanent locators

Current locator patterns include:
- `project-<SHORT_ID>`
- `milestone-<SHORT_ID>`
- `output-<SHORT_ID>`
- `risk-<SHORT_ID>`
- `status-event-<SHORT_ID>`
- `budget-event-<SHORT_ID>`
- `proposal-<SHORT_ID>`
- `decision-<SHORT_ID>`
- `proposal-status-<SHORT_ID>`
- `gov-event-<SHORT_ID>`
- `personal-project-passport-<SHORT_ID>`
- `personal-project-membership-<SHORT_ID>`
- `personal-project-membership_end-<SHORT_ID>`
- `personal-project-est-<SHORT_ID>`
- `personal-project-bud-<SHORT_ID>`

Locators identify a record position in the current application route. They do not by themselves change the record's public/private access level.

## 4. Copy action

The reusable client component:
`components/archive/CopyCitationButton.tsx`

copies only the already-rendered citation text to the clipboard. It does not query the database and does not expose full internal IDs.

## 5. Privacy and interpretation boundary

Public dossier citations may point to public project, proposal, decision, execution, and audit records.

Personal passport citations remain inside authenticated personal views. Personal EST/BUD detail is not made public merely because a public project has an aggregate EST/BUD summary.

EST and BUD remain separate record dimensions:
- EST: learning / knowledge contribution
- BUD: service / vow-in-action contribution

They are not interchangeable, are not project scores, and do not automatically confer governance rights.

## 6. Maintenance rule

When adding a new citable record type:
1. Reuse the relevant dossier prefix.
2. Add a fixed uppercase type code.
3. Use a stable source date.
4. Use only the short 8-character public reference.
5. Add a stable anchor.
6. Keep public/private access unchanged.
7. Support print/PDF without interactive controls.
8. Use the shared copy-citation component when a copy action is appropriate.
