// =============================================================================
// RealDeal Providers
// =============================================================================
// Assembles the live Providers bundle.
// Auth: Midnight Lace wallet (live)
// All others: stub → will be replaced as each contract is deployed
// =============================================================================

import type { Providers } from '../types';
import { RealAuthProvider } from './real-auth';
import { RealJurisdictionProvider } from './real-jurisdiction';
import { RealCaseProvider } from './real-cases';
import { RealDocumentProvider } from './real-documents';
import { RealComplianceProvider } from './real-compliance';
import { createDemoProviders } from '../demoland';

export function createRealProviders(): Providers {
  const demoFallback = createDemoProviders();
  const auth = new RealAuthProvider();

  return {
    auth,
    jurisdiction: new RealJurisdictionProvider(),
    cases: new RealCaseProvider(auth),
    documents: new RealDocumentProvider(auth),
    compliance: new RealComplianceProvider(auth),
    // Demo stubs remaining — Phase 2 work:
    // accessControl → AccessControlProvider (access-control.compact)
    // expertWitness → ExpertWitnessProvider (expert-witness.compact)
    ai: demoFallback.ai,
    contacts: demoFallback.contacts,
    emailSafety: demoFallback.emailSafety,
    accessControl: demoFallback.accessControl,
    expertWitness: demoFallback.expertWitness,
  };
}
