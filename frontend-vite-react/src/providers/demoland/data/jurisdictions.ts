export interface JurisdictionRule {
  id: string;
  ruleNumber: string;
  title: string;
  summary: string;
  deadline?: string;
  keyDifference?: string;
  category: 'interrogatories' | 'rfa' | 'rfp' | 'depositions' | 'disclosure' | 'expert' | 'esi' | 'privilege' | 'sanctions' | 'general';
}

export interface Jurisdiction {
  code: string;
  name: string;
  fullName: string;
  ruleSetName: string;
  color: string;
  rules: JurisdictionRule[];
}

export const jurisdictions: Record<string, Jurisdiction> = {
  ID: {
    code: 'ID',
    name: 'Idaho',
    fullName: 'State of Idaho',
    ruleSetName: 'IRCP',
    color: '#60a5fa',
    rules: [
      { id: 'id-26b', ruleNumber: 'IRCP 26(b)', title: 'Scope of Discovery', summary: 'Parties may obtain discovery of any nonprivileged matter relevant to any party\'s claim or defense, proportional to the needs of the case.', category: 'general' },
      { id: 'id-26f', ruleNumber: 'IRCP 26(f)', title: 'Discovery Planning', summary: 'Parties must confer at least 21 days before scheduling conference to develop a discovery plan.', deadline: '21 days before scheduling conf.', category: 'general' },
      { id: 'id-30', ruleNumber: 'IRCP 30(a)', title: 'Depositions — Oral', summary: 'Limited to 10 depositions per side. Each deposition limited to 7 hours on the record.', deadline: '7 hours max', category: 'depositions' },
      { id: 'id-33', ruleNumber: 'IRCP 33(a)', title: 'Interrogatories', summary: 'No more than 40 interrogatories including subparts. Must be answered within 30 days.', deadline: '30 days to respond', keyDifference: '40 limit (vs 25 federal)', category: 'interrogatories' },
      { id: 'id-34', ruleNumber: 'IRCP 34(b)', title: 'Production of Documents', summary: 'Response due within 30 days. Must produce documents as kept in usual course of business or organized by category.', deadline: '30 days to respond', category: 'rfp' },
      { id: 'id-36', ruleNumber: 'IRCP 36(a)', title: 'Requests for Admission', summary: 'No limit on number. Must respond within 30 days or matters are deemed admitted.', deadline: '30 days (deemed admitted)', keyDifference: 'No limit on number', category: 'rfa' },
      { id: 'id-26a', ruleNumber: 'IRCP 26(a)', title: 'Initial Disclosures', summary: 'Must provide names/addresses of witnesses, copies of documents, computation of damages, and insurance agreements within 14 days of Rule 26(f) conference.', deadline: '14 days after 26(f) conf.', category: 'disclosure' },
      { id: 'id-26b4', ruleNumber: 'IRCP 26(b)(4)', title: 'Expert Discovery', summary: 'Expert disclosures due at least 90 days before trial. Rebuttal experts 60 days after. Expert depositions permitted.', deadline: '90 days before trial', category: 'expert' },
      { id: 'id-26b5', ruleNumber: 'IRCP 26(b)(5)', title: 'Privilege Log', summary: 'When withholding on privilege grounds, must describe nature of documents not produced in manner sufficient to assess applicability.', category: 'privilege' },
      { id: 'id-37', ruleNumber: 'IRCP 37(a)', title: 'Motion to Compel', summary: 'Party may move to compel after good faith meet-and-confer. Court may award expenses for successful motion.', category: 'sanctions' },
      { id: 'id-esi', ruleNumber: 'IRCP 34(b)(1)(C)', title: 'ESI Production', summary: 'If ESI form not specified, must produce in form ordinarily maintained or reasonably usable form. Not required to produce in more than one form.', keyDifference: 'Follows federal ESI framework', category: 'esi' },
    ],
  },
  WA: {
    code: 'WA',
    name: 'Washington',
    fullName: 'State of Washington',
    ruleSetName: 'CR',
    color: '#34d399',
    rules: [
      { id: 'wa-26b', ruleNumber: 'CR 26(b)', title: 'Scope of Discovery', summary: 'Discovery of any unprivileged matter relevant to subject matter. Broader than federal — includes subject matter relevance.', keyDifference: 'Subject matter scope (broader than ID)', category: 'general' },
      { id: 'wa-30', ruleNumber: 'CR 30(a)', title: 'Depositions — Oral', summary: 'No numerical limit on depositions (unlike federal 10-per-side). Each deposition limited to 7 hours.', keyDifference: 'No limit on number (vs ID: 10)', category: 'depositions' },
      { id: 'wa-33', ruleNumber: 'CR 33(a)', title: 'Interrogatories', summary: 'No more than 40 interrogatories without subparts. Must be answered within 30 days.', deadline: '30 days to respond', keyDifference: '"Without subparts" interpretation differs', category: 'interrogatories' },
      { id: 'wa-34', ruleNumber: 'CR 34(b)', title: 'Production of Documents', summary: 'Response due within 30 days. Written response required specifying whether inspection will be permitted.', deadline: '30 days', category: 'rfp' },
      { id: 'wa-36', ruleNumber: 'CR 36(a)', title: 'Requests for Admission', summary: 'No limit. Must respond within 30 days. Deemed admitted if not timely responded to.', deadline: '30 days', category: 'rfa' },
      { id: 'wa-26a', ruleNumber: 'CR 26(a)', title: 'Initial Disclosures', summary: 'Washington does NOT require mandatory initial disclosures — parties must affirmatively seek discovery.', keyDifference: 'NO initial disclosures (vs ID: required)', category: 'disclosure' },
      { id: 'wa-26b4', ruleNumber: 'CR 26(b)(5)', title: 'Expert Discovery', summary: 'Expert disclosure 90 days before trial. Reports must include opinions, bases, data, qualifications, compensation. Depositions allowed.', deadline: '90 days before trial', category: 'expert' },
      { id: 'wa-37', ruleNumber: 'CR 37(a)', title: 'Motion to Compel', summary: 'Requires certification of good faith meet-and-confer. Court shall impose sanctions on losing party absent substantial justification.', keyDifference: 'Mandatory sanctions vs discretionary', category: 'sanctions' },
    ],
  },
  UT: {
    code: 'UT',
    name: 'Utah',
    fullName: 'State of Utah',
    ruleSetName: 'URCP',
    color: '#f59e0b',
    rules: [
      { id: 'ut-26', ruleNumber: 'URCP 26(a)', title: 'Tiered Discovery', summary: 'Utah uses a UNIQUE 3-tier discovery system based on amount in controversy. Tier 1: ≤$50K, Tier 2: $50K–$300K, Tier 3: >$300K. Each tier has different limits.', keyDifference: 'TIERED system — unique among target states', category: 'general' },
      { id: 'ut-33', ruleNumber: 'URCP 33', title: 'Interrogatories', summary: 'Tier 1: 0 interrogatories. Tier 2: 10. Tier 3: 20. Dramatically fewer than Idaho or Washington.', deadline: '30 days', keyDifference: 'Tier 1: ZERO. Tier 3: max 20 (vs ID: 40)', category: 'interrogatories' },
      { id: 'ut-30', ruleNumber: 'URCP 30', title: 'Depositions', summary: 'Tier 1: 0 fact depositions. Tier 2: 4 (4 hrs each). Tier 3: 10 (7 hrs each).', keyDifference: 'Tier-limited depositions', category: 'depositions' },
      { id: 'ut-34', ruleNumber: 'URCP 34', title: 'Production of Documents', summary: 'Tier 1: 0 requests. Tier 2: 10. Tier 3: 20. Response within 28 days.', deadline: '28 days (not 30)', keyDifference: '28-day deadline (vs 30 everywhere else)', category: 'rfp' },
      { id: 'ut-36', ruleNumber: 'URCP 36', title: 'Requests for Admission', summary: 'Tier 1: 5. Tier 2: 10. Tier 3: 20. Dramatically limited compared to Idaho\'s unlimited.', keyDifference: 'Capped (vs ID: unlimited)', category: 'rfa' },
      { id: 'ut-26a', ruleNumber: 'URCP 26(a)(1)', title: 'Initial Disclosures', summary: 'Mandatory initial disclosures within 14 days of first discovery request. Includes witness lists, documents, damages computation.', deadline: '14 days after first request', category: 'disclosure' },
      { id: 'ut-expert', ruleNumber: 'URCP 26(a)(4)', title: 'Expert Discovery', summary: 'Expert disclosures 28 days before close of fact discovery. Must include report with opinions, bases, and qualifications.', deadline: '28 days before discovery close', keyDifference: 'Tied to discovery close, not trial', category: 'expert' },
      { id: 'ut-esi', ruleNumber: 'URCP 26(b)(6)', title: 'ESI — Proportionality', summary: 'ESI discovery must be proportional to needs. Accessible vs not-reasonably-accessible distinction. Cost-shifting available.', keyDifference: 'Strong proportionality emphasis', category: 'esi' },
    ],
  },
  NY: {
    code: 'NY',
    name: 'New York',
    fullName: 'State of New York',
    ruleSetName: 'CPLR',
    color: '#a78bfa',
    rules: [
      { id: 'ny-3101', ruleNumber: 'CPLR 3101(a)', title: 'Scope of Discovery', summary: 'Full disclosure of all matter material and necessary to defense or prosecution. Interpreted liberally by NY courts.', keyDifference: '"Material and necessary" standard (unique)', category: 'general' },
      { id: 'ny-3130', ruleNumber: 'CPLR 3130', title: 'Interrogatories', summary: 'No more than 25 interrogatories. In Commercial Division: 25 unless modified by court.', deadline: '20 days', keyDifference: '25 limit + 20-day deadline (fastest)', category: 'interrogatories' },
      { id: 'ny-3120', ruleNumber: 'CPLR 3120', title: 'Document Requests', summary: 'Served after commencement of action. Response within 20 days. Must produce or state objections.', deadline: '20 days (not 30)', keyDifference: '20-day deadline — faster than all others', category: 'rfp' },
      { id: 'ny-3123', ruleNumber: 'CPLR 3123', title: 'Requests for Admission', summary: 'No numerical limit. Deemed admitted after 20 days if not responded to.', deadline: '20 days', keyDifference: '20-day deemed-admitted window', category: 'rfa' },
      { id: 'ny-3110', ruleNumber: 'CPLR 3110', title: 'Depositions', summary: 'No specific limit in CPLR. Commercial Division: 10 per side, 7 hours each. Priority rules apply — first to notice goes first.', keyDifference: 'Priority rules for depo scheduling', category: 'depositions' },
      { id: 'ny-3101d', ruleNumber: 'CPLR 3101(d)(1)(i)', title: 'Expert Disclosure', summary: 'Must disclose expert witness identity, qualifications, opinions, and bases upon demand. No formal report requirement like federal rules.', keyDifference: 'No written report required (vs ID: required)', category: 'expert' },
      { id: 'ny-3126', ruleNumber: 'CPLR 3126', title: 'Sanctions / Penalties', summary: 'Court may issue conditional orders, strike pleadings, or enter default judgment for failure to disclose. Progressive penalty system.', keyDifference: 'Progressive sanction system', category: 'sanctions' },
      { id: 'ny-comm', ruleNumber: 'Commercial Division Rules', title: 'ESI / E-Discovery', summary: 'Commercial Division has specific e-discovery rules requiring meet-and-confer on ESI, search terms, and production format before motion practice.', keyDifference: 'Commercial Division ESI rules', category: 'esi' },
    ],
  },
  CA: {
    code: 'CA',
    name: 'California',
    fullName: 'State of California',
    ruleSetName: 'CCP',
    color: '#fb923c',
    rules: [
      { id: 'ca-2017', ruleNumber: 'CCP §2017.010', title: 'Scope of Discovery', summary: 'Any matter not privileged that is relevant to the subject matter. Any party may obtain discovery regarding any nonprivileged matter.', category: 'general' },
      { id: 'ca-2030', ruleNumber: 'CCP §2030.030', title: 'Interrogatories', summary: '35 specially prepared interrogatories. Unlimited form interrogatories using Judicial Council forms. Must respond in 30 days.', deadline: '30 days', keyDifference: '35 special + UNLIMITED form interros', category: 'interrogatories' },
      { id: 'ca-2025', ruleNumber: 'CCP §2025.010', title: 'Depositions', summary: 'Limited to one per natural person. No overall numerical limit per side. 7 hours per deposition.', keyDifference: 'One per person (no per-side limit)', category: 'depositions' },
      { id: 'ca-2031', ruleNumber: 'CCP §2031.030', title: 'Production of Documents', summary: '35 requests per set. Unlimited sets. Response within 30 days. Must respond to each item individually.', deadline: '30 days', keyDifference: '35 per set but unlimited sets', category: 'rfp' },
      { id: 'ca-2033', ruleNumber: 'CCP §2033.010', title: 'Requests for Admission', summary: '35 per set. Unlimited sets. Must respond within 30 days or deemed admitted.', deadline: '30 days', keyDifference: '35-per-set cap (vs ID: unlimited)', category: 'rfa' },
      { id: 'ca-expert', ruleNumber: 'CCP §2034.210', title: 'Expert Exchange', summary: 'SIMULTANEOUS expert witness exchange 70 days before trial. Must include expert declarations with opinions, bases, and documents.', deadline: '70 days before trial (simultaneous)', keyDifference: 'Simultaneous exchange (not sequential)', category: 'expert' },
      { id: 'ca-esi', ruleNumber: 'CCP §2031.280', title: 'ESI Production', summary: 'Must produce ESI in form requested or form in which it is ordinarily maintained. Source code protections available.', category: 'esi' },
      { id: 'ca-sanctions', ruleNumber: 'CCP §2023.010', title: 'Discovery Sanctions', summary: 'Misuse of discovery process includes failing to respond, providing evasive responses, or making unmeritorious objections. Monetary + issue + evidence + terminating sanctions.', keyDifference: 'Four-tier sanction escalation', category: 'sanctions' },
    ],
  },
};

export type JurisdictionCode = keyof typeof jurisdictions;

export function getComparativeRules(
  primaryCode: JurisdictionCode,
  category: JurisdictionRule['category'],
): { primary: JurisdictionRule | undefined; comparisons: { jurisdiction: Jurisdiction; rule: JurisdictionRule }[] } {
  const primary = jurisdictions[primaryCode];
  const primaryRule = primary?.rules.find((r) => r.category === category);

  const comparisons = Object.values(jurisdictions)
    .filter((j) => j.code !== primaryCode)
    .map((j) => ({ jurisdiction: j, rule: j.rules.find((r) => r.category === category)! }))
    .filter((c) => c.rule);

  return { primary: primaryRule, comparisons };
}
