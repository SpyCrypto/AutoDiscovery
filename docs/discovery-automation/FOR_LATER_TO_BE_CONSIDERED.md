# For Later — To Be Considered

> **Date**: February 15, 2026
> **Authors**: Cassie (with John's oversight)
> **Status**: Parking lot — ideas to revisit as we build

---

## 1. Privilege Log Automation

When a party withholds a document, they must log *why* (attorney-client privilege, work product, etc.). This is currently a manual, error-prone spreadsheet task. AutoDiscovery could:
- Auto-generate privilege log entries when a document is marked "withheld"
- Require a privilege basis from a picklist (not free text — prevents vague claims)
- Track challenges to privilege claims and their outcomes
- **ZK angle**: Prove a document exists and was withheld for a stated reason, without revealing its content

## 2. Redaction Tracking

Documents often get redacted before production. Currently there's no standard way to track:
- What was redacted
- By whom
- Under what legal basis (privilege, protective order, irrelevance)
- Whether the unredacted version exists in escrow for potential in camera review

AutoDiscovery could maintain a **redaction registry** — hash of original, hash of redacted version, basis for redaction.

## 3. Version Control / Supplementation

Discovery is not a one-time dump. Parties **supplement** their productions:
- New documents found
- Court orders additional production
- Corrections to prior productions

We need Git-like versioning: "Supplemental Production #2 in response to RFP #3, adding 47 documents not previously identified." Each supplement gets its own origination record, linked to the original request.

## 4. Cross-Reference Mapping

Which documents respond to which discovery requests? Currently tracked manually. AutoDiscovery should maintain a **request ↔ document matrix**:

```
         RFP#1  RFP#2  RFP#3  Interrog#1  Subpoena#1
Doc 001:  ✓                      ✓
Doc 002:         ✓      ✓
Doc 003:                ✓                    ✓
```

This instantly shows: "RFP #2 received only 1 document — is that complete?"

## 5. Deadline Cascade Logic

When one deadline moves, others may shift. Example:
- Court grants a 30-day extension on expert reports
- That pushes back the expert deposition deadline
- Which pushes back the rebuttal expert deadline
- Which may push back trial

AutoDiscovery should model **deadline dependencies** — move one, and the cascade auto-calculates. This is jurisdiction-specific (IRCP vs. FRCP timelines differ).

## 6. Protective Order Management

Some documents have restricted access:
- **Confidential**: Only attorneys, not clients
- **Attorneys' Eyes Only**: Only counsel, no paralegals
- **Sealed**: Judge only

AutoDiscovery should enforce access control per protective order tier. The ZK layer is perfect here — prove you have access without revealing the content.

## 7. Clawback Protocol (FRE 502(d))

If a party accidentally produces a privileged document, they can "claw it back." But:
- The receiving party may have already reviewed it
- There's a dispute about whether it was truly accidental
- The clock is ticking (must notify promptly)

AutoDiscovery could:
- Track the moment a document is accessed by the receiving party
- Enable instant clawback notifications
- Log whether the document was opened before the clawback request
- Provide ZK proof of the timeline for the inevitable dispute

## 8. ESI Format Disputes

Parties fight constantly about what *format* electronic evidence should be in:
- Native format (original .xlsx, .pst, .docx) — preserves metadata
- TIFF/PDF — searchable but loses metadata
- Load files — industry standard for litigation support

AutoDiscovery should define **format requirements per category** that align with jurisdiction rules and flag non-compliant formats at intake.

## 9. Proportionality Analysis

FRCP Rule 26(b)(1) requires discovery to be "proportional to the needs of the case." A $50,000 contract dispute shouldn't require $500,000 in discovery costs. AutoDiscovery could:
- Track cumulative discovery costs per party
- Flag when costs exceed a threshold relative to the amount in controversy
- Generate proportionality reports for court submissions

## 10. Bates Numbering Integration

Legal documents are stamped with sequential "Bates numbers" (e.g., DEF-000001 through DEF-047382). AutoDiscovery should:
- Auto-assign Bates numbers at intake
- Maintain a global Bates registry per case
- Prevent gaps or duplicates in numbering
- Map Bates ranges to submissions and categories

## 11. Multi-Jurisdiction Complications

When parties are in different states, which rules govern?
- Federal diversity cases: FRCP + local rules
- State cases with out-of-state parties: forum state rules
- Multi-district litigation (MDL): consolidated rules

AutoDiscovery's jurisdiction rule pack system handles this — but we need to handle the edge case where a single case has **multiple rule packs active simultaneously**.

## 12. In Camera Review Workflow

When privilege is disputed, the judge reviews documents privately. AutoDiscovery could:
- Create a secure, judge-only access channel
- Track which documents are under in camera review
- Record the judge's ruling (privileged / not privileged)
- Auto-release non-privileged documents to the requesting party
- All with ZK proofs that the process was followed

## 13. Litigation Hold Integration

Before discovery even starts, parties must **preserve** potentially relevant evidence (litigation hold). AutoDiscovery could:
- Issue and track litigation hold notices
- Record acknowledgments from custodians
- Monitor for destruction events (the Sanders v. University of Idaho problem)
- Prove hold compliance on-chain

## 14. AI-Assisted Categorization (Future Phase)

For the data dump problem: AI could help categorize uncategorized documents and flag potential relevance. But this raises questions:
- Can AI review be used as evidence of good faith compliance?
- What if the AI miscategorizes a privileged document?
- Liability for AI-driven categorization errors

**Park this for Phase 2+.** Get the manual protocol right first, then layer in AI assistance.

## 15. Insurance Integration

AutoDiscovery's compliance proofs could integrate with malpractice insurers:
- Continuous compliance = lower premiums
- Compliance score per case = risk assessment
- Automated compliance certificates for renewals
- This is a **revenue channel** — insurers would pay for the data

---

*This file is a parking lot. Items will be promoted to the main design doc or to specific feature specs as we're ready to tackle them.*
