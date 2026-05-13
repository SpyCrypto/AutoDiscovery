# AutoDiscovery — UI Design Notes

> Design guidelines and requirements for frontend development.

---

## Field Requirements

### Outlier & Explanation Fields

**Requirement:** Every data input form must include additional fields for:

1. **Outlier Flag** — Boolean/toggle to mark edge cases or exceptions
2. **Explanation Field** — Free-text area for context when:
   - Data doesn't fit standard categories
   - Jurisdiction has unique requirements
   - User needs to document reasoning

### Implementation Guidelines

```
┌─────────────────────────────────────────────────────────────┐
│  [Standard Input Field]                                     │
├─────────────────────────────────────────────────────────────┤
│  ☐ Mark as outlier/exception                                │
├─────────────────────────────────────────────────────────────┤
│  Explanation (optional):                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │  [Multi-line text area]                                 ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Use Cases

| Scenario | Why Outlier/Explanation Needed |
|----------|-------------------------------|
| **Jurisdiction quirk** | Idaho has unique local rules not in standard IRCP |
| **Case-specific exception** | Court granted extension or modified standard timeline |
| **Data doesn't fit categories** | Expert witness has unusual credentials |
| **Compliance override** | Manual override of automated rule with documented reasoning |
| **Multi-jurisdiction conflict** | Case spans states with conflicting requirements |

### Component Requirements

- **Collapsible by default** — Don't clutter UI for standard cases
- **Expand on outlier check** — Auto-expand explanation when flagged
- **Persist to audit log** — All outlier explanations become part of immutable record
- **Searchable** — Explanations should be indexed for case review

---

## Target Jurisdictions

| Jurisdiction | Abbreviation | Notes |
|--------------|--------------|-------|
| Idaho | ID | Spy's primary jurisdiction |
| Washington | WA | Pacific Northwest |
| Utah | UT | Tiered discovery rules |
| New York | NYC | Commercial Division complexity |
| California | CA | Largest state market |

---

## Design Principles

1. **Legal professionals are risk-averse** — Every action should feel safe and reversible
2. **Audit trail visibility** — Users should always see what's being recorded
3. **Jurisdiction clarity** — Always display which rules are currently applied
4. **Error prevention > error correction** — Warn before, not after

---

*Updated: February 2026*
