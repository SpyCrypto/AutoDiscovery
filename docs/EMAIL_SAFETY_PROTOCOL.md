# Email Safety Protocol — Design Document

**Created:** February 15, 2026  
**Author:** Cassie (AI pair programmer) with John  
**Status:** v1.0 — Core protocol implemented in demoLand

---

## Overview

The Email Safety Protocol is a multi-layered protection system that prevents accidental disclosure of privileged, confidential, or inappropriate content to opposing counsel, judges, and external parties. It integrates directly with the Case Contacts system to provide real-time recipient identification, threat-level classification, attachment scanning with metadata warnings, preview-before-send capabilities, and a tandem approval workflow for sensitive communications.

## The Problem

In litigation, accidental emails to the wrong party can:
- **Waive attorney-client privilege** (inadvertent disclosure to opposing counsel)
- **Create ex parte communication violations** (direct contact with a judge)
- **Expose work product** (strategy documents sent to opponents)
- **Violate protective orders** (confidential documents sent outside approved recipients)
- **Leak metadata** (GPS location in photos, tracked changes in Word docs, hidden PDF layers)

One wrong attachment can lose a case. This protocol makes it mechanically difficult to make these mistakes.

## Threat Levels

| Level        | Color  | Triggers                                                    | Required Actions                         |
|--------------|--------|-------------------------------------------------------------|------------------------------------------|
| **SAFE**     | Green  | All recipients are on our team                              | Standard send                            |
| **CAUTION**  | Amber  | Court staff, neutral parties, or unknown recipients         | Review content, verify no privileged info |
| **DANGER**   | Red    | Opposing counsel, their associates/paralegals, or defendants| Attachment review required, tandem recommended |
| **CRITICAL** | Red++  | Judicial officer (judge, magistrate)                        | Tandem approval **REQUIRED** (2 approvers) |

### Threat Escalation Rules

- Any recipient flagged as `judge` → automatically **CRITICAL**
- Any opposing team recipient → at minimum **DANGER**
- Opposing team + attachments → **DANGER** with mandatory attachment review
- Court staff or unknown recipients → **CAUTION**
- Risky file metadata on external emails → **CAUTION** (minimum)

## Recipient Safety Check

When composing an email, every recipient address is cross-referenced against the Case Contacts database:

### Matching Logic

1. **Case-level match**: Check against contacts for the current case
2. **Cross-case match**: Check against ALL contacts across all cases (with warning about different case context)
3. **Unknown**: Email not found in any contact database → `CAUTION` flag

### Recipient Flags

| Flag                 | Team           | Warning Level | Description                                      |
|----------------------|----------------|---------------|--------------------------------------------------|
| `judge`              | Court          | CRITICAL      | Direct email may be ex parte communication       |
| `court_staff`        | Court          | CAUTION       | No substantive arguments                         |
| `opposing_counsel`   | Opposing Team  | DANGER        | All attachments reviewed for privilege            |
| `opposing_associate` | Opposing Team  | DANGER        | Treated same as lead counsel                     |
| `opposing_paralegal` | Opposing Team  | DANGER        | Content may be forwarded to opposing counsel      |
| `opposing_party`     | Opposing Team  | DANGER        | May violate Rule 4.2 if represented              |
| `neutral_party`      | Neutral        | CAUTION       | Verify no confidential material                  |
| `our_team`           | Our Team       | SAFE          | Standard protocols                               |

### Ethics Rules Referenced

- **Rule 4.2 (ABA)**: Communication with represented persons — cannot contact a represented opposing party directly
- **Ex parte communication**: Direct communication with a judge outside proper court channels is prohibited
- **Rule 1.6**: Duty of confidentiality — must not inadvertently disclose client information

## Attachment Safety System

### Metadata Scanning

Every attachment is scanned for potential metadata risks:

| File Type          | Metadata Risks                                                    |
|--------------------|-------------------------------------------------------------------|
| **Images** (jpg, png, heic) | EXIF data: GPS location, device info, timestamps, camera model |
| **Word** (doc, docx)        | Tracked changes, comments, author metadata, revision history   |
| **PDF**                     | Hidden layers, annotations, embedded metadata, form fields     |
| **Excel** (xls, xlsx)       | Hidden sheets, named ranges, calculation history               |
| **Large files** (>10MB)     | Recommend secure file transfer instead of email attachment      |

### Preview-Before-Send

- **Image attachments**: Full visual preview rendered in the dialog
- **All attachments**: File name, size, MIME type displayed
- **Metadata warnings**: Orange warning badges with specific risks listed
- **Remove button**: One-click removal of problematic attachments

### The "Sexy Pic" Scenario 😄

This is exactly why the preview system exists. Before any attachment goes to opposing counsel or a judge:
1. **Visual preview** shows exactly what's attached
2. **Metadata warnings** flag GPS data in photos
3. **Tandem approval** means someone else sees it before it sends
4. **Double-check confirmation** at the review step

## Tandem Email Approval

### Concept

A "tandem" approval means N sets of eyes must explicitly sign off before a sensitive email can be sent. Think of it as a two-person rule for nuclear launch codes, but for emails.

### When Required

| Scenario                                  | Required Approvers |
|-------------------------------------------|-------------------|
| Email to judge (CRITICAL)                 | 2 mandatory       |
| Opposing counsel + attachments (DANGER)   | 1 recommended     |
| Our team only (SAFE)                      | 0 (optional)      |

### Workflow

```
1. Compose email → recipients checked → threat level calculated
2. If DANGER/CRITICAL → "Review & Send" step
3. Review step shows all warnings, attachment previews, recipient flags
4. If tandem required → "Request N Approval(s)" button
5. Approval request created with 24-hour expiration
6. Approvers see the full email draft and can:
   - ✅ Approve (with optional comment)
   - ❌ Reject (with mandatory reason)
7. Once all approvals received → "Send Approved Email" unlocked
8. If any approver rejects → email is blocked, compose returns to draft
```

### Approver States

- **Pending**: Awaiting review
- **Approved**: Approver signed off
- **Rejected**: Approver flagged an issue (blocks send)
- **Expired**: 24-hour window passed without sufficient approvals

## UI Integration

### Contact Card Email Button

- **Our team contacts**: Muted email link → opens compose with SAFE level
- **Opposing/court contacts**: Amber-colored email link with ⚠ triangle → opens compose with appropriate threat level pre-applied
- Clicking any contact's email address opens the Email Safety Dialog pre-filled

### Email Safety Dialog

Three-step modal:
1. **Compose**: Recipients, subject, body, attachments with inline warnings
2. **Review**: Full safety summary — threat banner, recipient verification, attachment double-check
3. **Approval** (when required): Tandem approval tracker with approver status

### Color-Coded Threat Banner

The entire dialog header changes color based on threat level:
- Green header → SAFE
- Amber header → CAUTION  
- Red header → DANGER
- Dark red header → CRITICAL

## File Locations

| File | Purpose |
|------|---------|
| `src/providers/types.ts` | `EmailThreatLevel`, `EmailRecipientCheck`, `EmailAttachment`, `TandemApproval`, `EmailDraft`, `IEmailSafetyProvider` |
| `src/providers/demoland/mock-email-safety.ts` | Mock provider with recipient matching, metadata scanning, threat calculation, approval workflow |
| `src/components/email-safety-dialog.tsx` | Full compose/review/approval dialog component |
| `src/pages/case-contacts/index.tsx` | Contact cards with safety-aware email buttons |

## Future Enhancements

### Phase 2 — Smart Content Scanning
- AI-powered body text analysis: flag if email body mentions privileged conversations
- Auto-detect case numbers, client names, or strategy keywords in attachments
- OCR scanning of image attachments for sensitive text content

### Phase 3 — Metadata Stripping
- Built-in EXIF stripper for images before attachment
- Word document sanitizer (remove tracked changes, comments, author info)
- PDF sanitizer (flatten annotations, remove hidden layers)
- "Clean & Attach" one-click workflow

### Phase 4 — Audit Trail
- Every email sent through the system logged with full threat assessment
- Compliance report: "All opposing-counsel communications reviewed by N approvers"
- Integration with case compliance scoring
- ZK attestation of review process (ties into AutoDiscovery's blockchain attestation system)

### Phase 5 — Real-Time Integration
- IMAP/SMTP integration for actual email sending
- Microsoft 365 / Google Workspace OAuth
- Calendar-aware: flag if emailing a judge during hearing blackout periods
- Auto-CC lead attorney on all opposing communications

---

*Don't send that sexy pic to the judge, John. That's what tandem approval is for.* 😄💛
