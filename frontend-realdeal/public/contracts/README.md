# Contract ZK Assets

This directory holds circuit keys and ZKIR files for the 6 ADL contracts,
served as static assets by Vite for the `BrowserZkConfigProvider`.

## Structure

```
contracts/
  discovery-core/
    keys/       ← prover + verifier keys per circuit
    zkir/       ← zero-knowledge intermediate representation
  document-registry/
    keys/
    zkir/
  compliance-proof/
    keys/
    zkir/
  jurisdiction-registry/
    keys/
    zkir/
  access-control/
    keys/
    zkir/
  expert-witness/
    keys/
    zkir/
```

## Regeneration

These files are **derived** from compiled Compact contracts (~12 MB total).
They are `.gitignore`d and must be regenerated after contract compilation:

```bash
# From the frontend-realdeal directory:
npm run copy-contracts

# Or from the repository root:
cd frontend-realdeal && npm run copy-contracts
```

The CI pipeline handles this automatically after the `test-compile` job.
