# Rule Packs

Jurisdiction-specific discovery rule data stored as JSON.
Each file encodes every discovery rule, deadline, exemption, and sanction for a jurisdiction.

## Files

- `idaho-ircp.json` — **PRIMARY (MVP)** — Idaho Rules of Civil Procedure
- `federal-frcp.json` — Federal Rules baseline (for state→federal removal cases)

## Validation

**Every rule pack must be validated by Spy before use.**

Idaho rule pack will be drafted from IRCP research, then verified against:
- Spy's real-world paralegal experience
- Spy's response in `docs/SPY-RESPONSE-to-build-plan.md`
- Official IRCP text (Spy suggested uploading the actual rules)

## Schema

See `docs/BUILD_PLAN.md` § 2.2 for the full JSON schema specification.
