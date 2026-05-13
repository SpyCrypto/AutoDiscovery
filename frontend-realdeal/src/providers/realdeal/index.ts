/**
 * RealDeal Provider Bundle
 *
 * These providers connect to the actual Midnight blockchain (preprod/mainnet),
 * real smart contracts, and real AI services. Each provider wraps the
 * corresponding contract's TypeScript SDK generated from the Compact source.
 *
 * Contract mapping:
 *   - cases       → discovery-core.compact
 *   - documents   → document-registry.compact
 *   - compliance  → compliance-proof.compact
 *   - accessControl → access-control.compact
 *   - jurisdiction  → jurisdiction-registry.compact
 *   - expertWitness → expert-witness.compact
 *   - auth        → Midnight wallet + DID integration
 *   - ai          → External AI service (synopsis, obfuscation detection)
 *   - contacts    → Off-chain service / local storage
 *   - emailSafety → Off-chain email gateway
 */

import type { Providers } from '../types';
import { RealCaseProvider } from './real-case';
import { RealDocumentProvider } from './real-document';
import { RealComplianceProvider } from './real-compliance';
import { RealAccessControlProvider } from './real-access-control';
import { RealJurisdictionProvider } from './real-jurisdiction';
import { RealExpertWitnessProvider } from './real-expert-witness';
import { RealAuthProvider } from './real-auth';
import { RealAIProvider } from './real-ai';
import { RealContactProvider } from './real-contacts';
import { RealEmailSafetyProvider } from './real-email-safety';

export function createRealProviders(): Providers {
  return {
    auth: new RealAuthProvider(),
    cases: new RealCaseProvider(),
    documents: new RealDocumentProvider(),
    compliance: new RealComplianceProvider(),
    ai: new RealAIProvider(),
    contacts: new RealContactProvider(),
    emailSafety: new RealEmailSafetyProvider(),
    accessControl: new RealAccessControlProvider(),
    jurisdiction: new RealJurisdictionProvider(),
    expertWitness: new RealExpertWitnessProvider(),
  };
}
