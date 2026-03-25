import { DiscoveryCore, type DiscoveryCorePrivateState } from '@autodiscovery/contract';
import type { ImpureCircuitId, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

export type DiscoveryCoreCircuits = ImpureCircuitId<DiscoveryCore.Contract<DiscoveryCorePrivateState>>;

export const DiscoveryCorePrivateStateId = 'discoveryCorePrivateState';

export type DiscoveryCoreProviders = MidnightProviders<DiscoveryCoreCircuits, typeof DiscoveryCorePrivateStateId, DiscoveryCorePrivateState>;

export type DiscoveryCoreContract = DiscoveryCore.Contract<DiscoveryCorePrivateState>;

export type DeployedDiscoveryCoreContract = DeployedContract<DiscoveryCoreContract> | FoundContract<DiscoveryCoreContract>;

export type UserAction = {
  createNewCase: string | undefined;
  addDiscoveryStepToCase: string | undefined;
  markDiscoveryStepAsCompleted: string | undefined;
};

export type DerivedState = {
  readonly totalCasesCreated: DiscoveryCore.Ledger["totalCasesCreated"];
};

export const emptyState: DerivedState = {
  totalCasesCreated: 0n,
};
