# 🩺 MidnightVitals — Integration Guide

**Version**: 1.0  
**Last Updated**: Feb 22, 2026

---

## How to Add MidnightVitals to Your Midnight DApp

This guide walks you through integrating MidnightVitals into any React-based Midnight application.

---

## Prerequisites

- React 18+ (React 19 recommended)
- Tailwind CSS 4+
- Lucide React (for icons)
- A Midnight DApp with provider layer

---

## Step 1: Copy the Vitals Module

Copy the `src/vitals/` directory into your project's `src/` folder. The module is self-contained — no external dependencies beyond what's listed in prerequisites.

```
your-app/
├── src/
│   ├── vitals/          ← Copy this folder
│   ├── components/
│   ├── pages/
│   └── App.tsx
```

When we publish to npm (v1.0.0+), this becomes:
```bash
npm install @midnight-vitals/core @midnight-vitals/react
```

---

## Step 2: Wrap Your App with VitalsProvider

In your `App.tsx` or root component:

```tsx
import { VitalsProvider } from './vitals';

function App() {
  return (
    <VitalsProvider
      mode="mock"                    // "mock" for demo, "live" for real
      proofServerUrl="http://localhost:6300"
      indexerUrl="http://localhost:3085/api/"
      contracts={[                   // Your deployed contracts
        { id: 'my-contract', name: 'My Contract', address: '0x...' },
      ]}
    >
      {/* Your app content */}
    </VitalsProvider>
  );
}
```

### VitalsProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'mock' \| 'live'` | `'mock'` | Mock simulates data; live makes real HTTP calls |
| `proofServerUrl` | `string` | `'http://localhost:6300'` | Proof server endpoint |
| `indexerUrl` | `string` | `''` | Network indexer API endpoint |
| `contracts` | `ContractInfo[]` | `[]` | List of contracts to monitor |
| `checkInterval` | `number` | `20` | Seconds between automatic health checks |
| `maxLogEntries` | `number` | `500` | Maximum log entries before oldest are pruned |

---

## Step 3: Add the Toggle Button and Panel

In your layout component (wherever your header/toolbar is):

```tsx
import { VitalsToggleButton, VitalsPanel } from './vitals';

function MyLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-6">
        <h1>My DApp</h1>
        <div className="flex items-center gap-2">
          <VitalsToggleButton />   {/* The 🩺 button */}
        </div>
      </header>

      <main className="flex-1">
        {/* Your page content */}
      </main>

      <VitalsPanel />              {/* The slide-up diagnostic panel */}
    </div>
  );
}
```

---

## Step 4: Log Events from Your Components

Use the `useVitalsLogger` hook to log events from anywhere in your app:

```tsx
import { useVitalsLogger } from './vitals';

function CreateCaseButton() {
  const vitals = useVitalsLogger();

  const handleCreateCase = async () => {
    // Log that the user took an action
    vitals.log('action', 'You clicked "Create New Case."');

    // Log what's happening behind the scenes
    vitals.log('info',
      'We are now asking the Midnight blockchain to register a new case.',
      'This involves building a zero-knowledge proof on your machine. ' +
      'Your private case details stay local — only the proof gets sent to the network.'
    );

    try {
      // ... your actual contract call
      const result = await createCase(caseData);

      // Log success with details
      vitals.log('success',
        `Your new case has been created. Case ID: ${result.caseId}`,
        'The contract now shows the case on the public ledger. ' +
        'You can start adding discovery steps to this case.'
      );
    } catch (error) {
      // Log error with explanation and suggested fix
      vitals.logError(
        'The contract rejected this request.',
        `Reason: "${error.message}"`,
        'This usually means the proof server is not running or ' +
        'there was a problem with the transaction parameters.',
        'Make sure Docker is running and the proof server container is up. ' +
        'Then try again.'
      );
    }
  };

  return <button onClick={handleCreateCase}>Create Case</button>;
}
```

### Logger Methods

```typescript
// Simple log
vitals.log(level: LogLevel, message: string, detail?: string);

// Error with structured explanation
vitals.logError(
  message: string,      // What happened
  reason: string,       // Technical reason
  explanation: string,  // What it means in plain English
  suggestion: string    // What the user should do
);

// Convenience methods
vitals.action(message: string);    // Blue — user did something
vitals.info(message: string);      // Gray — informational
vitals.success(message: string);   // Green — something worked
vitals.warn(message: string);      // Amber — heads up
vitals.error(message: string);     // Red — something broke
```

---

## Step 5: Customize for Your Contracts (Optional)

If you want the monitor bar to show contract-specific health data, provide a contract checker:

```tsx
<VitalsProvider
  mode="live"
  contractChecker={async (contract) => {
    // Query your contract's public state via indexer
    const state = await queryContractState(contract.address);
    return {
      status: state ? 'healthy' : 'critical',
      message: state
        ? `${contract.name} is deployed and responding. ${state.totalItems} items registered.`
        : `${contract.name} is not reachable. It may not be deployed yet.`,
      responseTimeMs: state?.queryTime ?? null,
    };
  }}
/>
```

---

## Step 6: Customize Styling (Optional)

MidnightVitals uses Tailwind CSS classes that match typical dark-mode themes. You can override the panel styling by wrapping it:

```tsx
<div className="custom-vitals-theme">
  <VitalsPanel />
</div>
```

Or pass className props:

```tsx
<VitalsPanel
  className="border-t-2 border-blue-500"
  consoleClassName="font-mono text-xs"
/>
```

---

## Examples

### AutoDiscovery.legal Integration

AutoDiscovery.legal uses MidnightVitals with 6 smart contracts:

```tsx
<VitalsProvider
  mode={import.meta.env.VITE_AD_MODE === 'realdeal' ? 'live' : 'mock'}
  proofServerUrl={import.meta.env.VITE_PROOF_SERVER_URL}
  indexerUrl={import.meta.env.VITE_INDEXER_URL}
  contracts={[
    { id: 'discovery-core', name: 'Case Management', address: import.meta.env.VITE_CONTRACT_DISCOVERY_CORE },
    { id: 'document-registry', name: 'Document Registry', address: import.meta.env.VITE_CONTRACT_DOCUMENT_REGISTRY },
    { id: 'compliance-proof', name: 'Compliance Proofs', address: import.meta.env.VITE_CONTRACT_COMPLIANCE_PROOF },
    { id: 'jurisdiction-registry', name: 'Jurisdiction Rules', address: import.meta.env.VITE_CONTRACT_JURISDICTION_REGISTRY },
    { id: 'access-control', name: 'Access Control', address: import.meta.env.VITE_CONTRACT_ACCESS_CONTROL },
    { id: 'expert-witness', name: 'Expert Witnesses', address: import.meta.env.VITE_CONTRACT_EXPERT_WITNESS },
  ]}
/>
```

### Midnight Counter Example

For the simple counter example from Midnight's official repos:

```tsx
<VitalsProvider
  mode="live"
  contracts={[
    { id: 'counter', name: 'Counter Contract', address: counterAddress },
  ]}
/>
```

---

## Troubleshooting

### Panel doesn't appear
- Make sure `<VitalsPanel />` is inside the `<VitalsProvider>`
- Check that the toggle button is also inside the provider
- Verify no CSS is hiding the fixed-position panel

### Logs not showing
- Make sure you're calling `useVitalsLogger()` inside a component wrapped by `<VitalsProvider>`
- Check the browser console for React context errors

### Time wheels not updating
- The timer runs on `setInterval` — make sure your component isn't unmounting/remounting
- Check that `checkInterval` is set to a reasonable value (default: 20 seconds)

### Live mode pings failing
- Verify the proof server URL is correct and accessible from the browser (CORS)
- Check that Docker is running and the proof server container is up
- The indexer URL must include the `/api/` path suffix
