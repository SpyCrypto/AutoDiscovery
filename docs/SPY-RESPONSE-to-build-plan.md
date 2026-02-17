# Spy's Response to Build Plan

> **Instructions**: Spy, please fill in your responses below. Add, edit, or delete sections as needed. Bullet points, notes, corrections — anything helps. John will read this before starting to build.
The medical malpractice process in Idaho and Ohio is not the same. While both states share the general goal of proving negligence, they differ significantly in their specific laws, timelines, damages caps, and pre-litigation requirements. 
Here is a breakdown of the key differences:
1. Statute of Limitations (Time Limits to File)
Idaho: Generally, you have two years from the date of the injury to file a lawsuit, though exceptions exist for discovery. Key limitations and exceptions include:
Government Entities: Claims against a government entity require a notice of claim within 180 days.
Medical Malpractice: Generally two years from the date of the act or omission.
Minors: If the victim is a minor, the statute of limitations may not start running until they turn 18, but it is generally delayed no more than six years.
Written Contracts: 5 years.
Oral Contracts: 4 years.
Ohio: The deadline is generally much tighter—usually one year from when the cause of action accrued (when the malpractice occurred or was discovered), with specific rules for extensions. 
2. Damages Caps (Limits on Compensation)
Both states limit non-economic damages (pain and suffering), but the calculations differ: 
Idaho: As of July 1, Idaho’s 2025 non-economic damage cap is $509,013.28.
Ohio: Limits non-economic damages to the greater of $250,000 or three times economic losses, with a maximum of $350,000 per plaintiff and $500,000 per occurrence. 
3. Procedural Differences
Idaho: Known for having very structured requirements, including the potential for mandatory prelitigation panels and specific expert testimony needs.
Ohio: Requires an "Affidavit of Merit" along with the complaint to confirm the case has basis. 
Key Similarities
Both require expert testimony to prove a breach of the standard of care.
Both use a "discovery rule" allowing timeframes to start when the injury is found, not just when it occurred.
Both are "modified comparative negligence" states, meaning your compensation can be reduced if you are found partially at fault. 
---

## Idaho IRCP Rules (26-37) — Corrections & Confirmations   SPY Suggest to upload the rules 

### Initial Disclosures
- [Y] Accurate? (yes/no)
- Notes:

### Interrogatories
- [Y] Accurate? (yes/no)
- Limit in Idaho:
- Response window:
- Notes:

### Request for Production
- [Y] Accurate? (yes/no)
- Notes:

### Depositions
- [Y] Accurate? (yes/no)
- Limit per side:
- Duration cap:
- Notes:

### Request for Admissions
- [Y] Accurate? (yes/no)
- Limit:
- Deemed-admitted rule:
- Notes:

### Expert Witness Disclosure
- [Y] Accurate? (yes/no)
- Deadline:
- Notes:

### Privilege Log
- [Y] Accurate? (yes/no)
- Notes:

### E-Discovery
- Any Idaho-specific rules?
- Notes: INCLUDED RULE 34

### Sanctions (IRCP Rule 37)
- Notes:

---

## Medical Malpractice — Idaho Specifics

### Affidavit of Merit
- Required in Idaho? NO
- If yes, when? At filing? Later?
- Must it name each defendant specifically?
- Notes:

### Med-Mal Discovery Exemptions
- Are initial disclosures exempted for med-mal (like Ohio)?
- Other exemptions: 

### Expert Witness Requirements (Med-Mal)
- Qualifications required: SAME AS EXPERT SUPPORTING 
- Standard of Care documentation: YES
- Notes:

---

## Local Court Rules

### Ada County
- Any local rules overriding IRCP? NO
- Notes:

### Canyon County
- Notes: SAME IRCP

### Other Counties
- Notes: SAME IRCP

### Judge-Specific Patterns
- Any scheduling order patterns you've seen repeatedly?
- Notes: NO

---

## Edge Cases & Real-World Experience

### Multi-Jurisdiction Cases
- Examples you've encountered: NONE

### Interstate Subpoenas (UIDDA)
- Has Idaho adopted UIDDA? Idaho adopted the Uniform Interstate Depositions and Discovery Act (UIDDA) under Idaho Rules of Civil Procedure 45(j), streamlining out-of-state discovery. Litigants submit a foreign subpoena to an Idaho court clerk, who issues a local subpoena for service without needing local counsel or pro hac vice admission, provided no court intervention is required.
- How does it work in practice? Typically use a third-party that only does service

### State-to-Federal Removal
- Common in Idaho? Only if jurisdiction determines Federal (for example higher $$$ requested)
- What changes in the discovery process? Federal Rules

### Discovery Pitfalls
- Things you've seen attorneys get wrong: missed deadlines, incorrect patient during records submission, incorrect filing used, incorrect number for First Set when collecting various supplementation to records either by way of unfullied request or new information obtained from prodction
---

## Feedback on the Data Model & Schema

### Does the 6-entity model make sense?
- Case:
- DiscoveryStep:
- JurisdictionRulePack:
- Document:
- Party:
- ComplianceAttestation:

### Missing Discovery Steps?
- Anything we're not tracking that should be tracked? I want to be able to track the discovery disposition data and the end of the case/appeal to determine if any Discovery interferred with the case. Two reason obvisouly to adjust anything on our end but to also ackowledge potential reform to the Discovery process.

### Automation Triggers — Realistic?
- Is the trigger → deadline → warning → escalation model realistic? I would do start with the trigger with warning → dealine → escalation
- Would paralegals actually use this? yes, yes I always had at least 10 cases working for numerous attorneys at once in different phases of the process. Then someone is always out sick-vacation-babies-weddings-funerals-family; and when you're in trial, others cover your cases.

---

## Anything Else?
- Additional thoughts, concerns, or ideas:  I believe the liability (insurance carriers of medical malpractice insurance like MedPro TheDoctorsGroup MIEC Medical Ins Exchange Comp) would welcome this risk infrastructure adoption.

---

*Thank you, Spy! This is invaluable. — John & Penny*
