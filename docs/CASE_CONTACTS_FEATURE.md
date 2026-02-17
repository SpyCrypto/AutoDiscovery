# Case Contacts Feature — Design Document

**Created:** February 15, 2026  
**Author:** Cassie (AI pair programmer) with John  
**Status:** v1.0 — Initial implementation in demoLand

---

## Overview

The Case Contacts feature provides a per-case contact management system with team-based visual separation, precedence ranking, first-year associate indicators, drag-to-reorder functionality, and connected-contact hover highlighting.

## Visual Design

### Team Color Coding (Brand-Aligned)

| Team                    | Color Family        | Header Gradient            | Card Border      |
|-------------------------|---------------------|----------------------------|------------------|
| **Our Team**            | Emerald/Green       | `emerald-500/15 → 5`      | `emerald-500/20` |
| **Opposing Counsel**    | Red                 | `red-500/15 → 5`          | `red-500/20`     |
| **The Court**           | Gold/Amber (brand)  | `amber-500/15 → 5`        | `ad-gold/20`     |
| **Neutral / 3rd Party** | Blue                | `blue-500/15 → 5`         | `blue-500/20`    |

### Layout

- **Two-column split** at desktop: Our Team (left, green) | Opposing Team (right, red)
- **Below:** Court (gold) | Neutral (blue) — also two-column
- Each section has a colored header with contact count and newbie count
- Contact cards expand on hover to reveal full details (email, phone, bar #, notes)

## Contact Data Model

```typescript
interface CaseContact {
  id: string;
  caseId: string;
  name: string;
  team: 'our_team' | 'opposing_team' | 'court' | 'neutral';
  role: ContactRole;           // 20+ role types
  description: string;         // e.g. "Lead counsel for Plaintiff"
  firm?: string;
  email?: string;
  phone?: string;
  barNumber?: string;
  stars: 0 | 1 | 2 | 3;       // Precedence rating
  isFirstYearAssociate?: boolean;
  connectedContactIds: string[]; // IDs of related contacts
  notes?: string;
  sortOrder: number;           // For drag-to-reorder
}
```

## Features

### 1. Star Precedence System (3-star)

- **3 stars**: Highest precedence — lead attorneys, key parties, judges, primary experts
- **2 stars**: Important — senior associates, co-counsel, corporate defendants
- **1 star**: Standard — paralegals, custodians, support staff
- **0 stars**: Low / unrated — typically brand-new 1st-year associates

Stars are clickable: click to set, click same star again to reduce by one. Gold-filled stars match the brand palette.

### 2. First-Year Associate Indicator ("Newbie")

- Purple badge with baby icon: `👶 1st Year`
- Appears on the contact card next to the role badge
- Section headers show total newbie count: `👶 2 newbies`
- Purpose: Quick visual identification of inexperienced counsel on either side

### 3. Drag-to-Reorder

- Contacts are draggable within their team section
- Grip handle appears on hover (left side of card)
- Reordering is team-scoped: you can't drag an opposing contact into our team
- Order persists via `sortOrder` field on `CaseContact`

### 4. Connected Contact Glow

When hovering over a contact, all contacts listed in their `connectedContactIds` glow with their team color:

- **Our team connections**: Emerald ring + shadow
- **Opposing team connections**: Red ring + shadow
- **Court connections**: Gold ring + shadow

This visually maps the relationship graph — e.g., hovering over lead attorney Sarah Mitchell highlights her associates, paralegal, client, and expert witness.

**Connection Logic (current mock data):**
- Lead attorney → all their team members they supervise
- Associates → their supervising partner + peers
- Client/victim → their lead attorney
- Expert witness → the attorney who retained them
- Defense counsel → their associates + defendants they represent
- Judge → court reporter
- Insurance → the defense co-counsel handling coverage + the insured defendant

**Future metrics to discuss:**
- Frequency of interaction (email/filing count)
- Deposition/testimony links
- Document originator overlap
- Communication sentiment (from AI provider)

### 5. Navigation

- **Sidebar nav**: "Contacts" item appears dynamically when viewing any case (`/cases/:id`)
  - Uses emerald accent (matching our-team color)
  - Green active indicator bar
- **Route**: `/cases/:caseId/contacts`
- **Back link**: Arrow to return to case view

## Demo Data Summary

### Case 001: Smith v. Acme Medical Center
- **Our Team (6)**: Sarah Mitchell (lead), James Park (assoc), Emily Nguyen (1st yr), Diana Flores (paralegal), John Smith (victim), Dr. Alan Reeves (expert)
- **Opposing (6)**: Robert Chen (lead), Lisa Whitfield (co-counsel), Tyler Brooks (1st yr), Karen Wu (paralegal), Acme Medical (defendant), Dr. Jane Wilson (defendant)
- **Court (2)**: Hon. Margaret Torres (judge), Patricia Simmons (reporter)
- **Neutral (2)**: Idaho Medical Records Dept., MedPro Group (insurer)

### Case 002: Rivera v. Mountain View Orthopedics
- **Our Team (4)**: Sarah Mitchell, James Park, Maria Rivera (victim), Dr. Susan Chang (expert)
- **Opposing (4)**: David Park, Amanda Torres (1st yr), Mountain View Ortho (defendant), Dr. Marcus Webb (defendant)
- **Court (1)**: Hon. Richard Koehler

### Case 003: Dawson v. St. Luke's Regional
- **Our Team (4)**: Karen Wolfe (lead), Marcus Barrett (co-counsel), Rachel Kim (1st yr), Thomas Dawson (victim)
- **Opposing (4)**: Jennifer Hale (lead), Andrew Morrison (co-counsel), Priya Sharma (1st yr), St. Luke's Regional (defendant)
- **Court (1)**: Hon. David Kessler

## File Locations

| File | Purpose |
|------|---------|
| `src/providers/types.ts` | `CaseContact`, `ContactTeam`, `ContactRole`, `IContactProvider` types |
| `src/providers/demoland/data/contacts.ts` | Mock contact data for all 3 demo cases |
| `src/providers/demoland/mock-contacts.ts` | Mock provider implementation |
| `src/providers/demoland/index.ts` | Wires contacts into the provider bundle |
| `src/pages/case-contacts/index.tsx` | CaseContacts page component |
| `src/layouts/ad-layout.tsx` | Dynamic "Contacts" nav item in sidebar |
| `src/App.tsx` | Route: `/cases/:caseId/contacts` |

## Future Enhancements (To Discuss)

1. **Connection metrics**: Define what makes contacts "connected" beyond explicit links
   - Shared document origination
   - Co-deposition appearances
   - Communication thread overlap
   - AI-detected entity co-occurrence
2. **Contact import**: CSV/vCard import from existing case management systems
3. **Real-time updates**: WebSocket-based contact status (online, in-deposition, etc.)
4. **Access control**: Role-based visibility of opposing team details
5. **Cross-case contacts**: Sarah Mitchell appears on cases 001 and 002 — surface this
6. **Contact timeline**: When was this person deposed? When did they produce docs?
7. **Conflict of interest detection**: Flag if a contact appears on both sides across cases

---

*Tell Spy I said thank you — her shock is the highest compliment. 💛*
