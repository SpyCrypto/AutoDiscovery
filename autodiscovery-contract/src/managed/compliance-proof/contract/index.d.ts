import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getCurrentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  computeUniqueAttestationHash(context: __compactRuntime.WitnessContext<Ledger, PS>,
                               caseIdentifier_0: bigint,
                               stepOrPhaseHash_0: bigint,
                               attestationTimestamp_0: bigint): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  attestStepLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint,
                            stepUniqueHash_0: bigint,
                            stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  attestPhaseLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                             caseUniqueIdentifier_0: bigint,
                             discoveryPhaseIdentifier_0: bigint,
                             totalStepsInPhase_0: bigint,
                             completedStepsInPhase_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  attestCaseLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyAttestationExists(context: __compactRuntime.CircuitContext<PS>,
                          attestationHashToVerify_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  revealAttestationCaseIdentifier(context: __compactRuntime.CircuitContext<PS>,
                                  attestationHashToReveal_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  attestStepLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint,
                            stepUniqueHash_0: bigint,
                            stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  attestPhaseLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                             caseUniqueIdentifier_0: bigint,
                             discoveryPhaseIdentifier_0: bigint,
                             totalStepsInPhase_0: bigint,
                             completedStepsInPhase_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  attestCaseLevelCompliance(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyAttestationExists(context: __compactRuntime.CircuitContext<PS>,
                          attestationHashToVerify_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  revealAttestationCaseIdentifier(context: __compactRuntime.CircuitContext<PS>,
                                  attestationHashToReveal_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  readonly totalAttestationsGenerated: bigint;
  registeredAttestationHashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  attestationGeneratedTimestampByHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  attestationScopeLevelByHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
