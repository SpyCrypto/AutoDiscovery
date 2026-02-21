import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  computeUniqueCaseIdentifier(context: __compactRuntime.WitnessContext<Ledger, PS>,
                              caseNumber_0: Uint8Array,
                              jurisdictionCode_0: Uint8Array): [PS, bigint];
  computeUniqueStepHash(context: __compactRuntime.WitnessContext<Ledger, PS>,
                        caseIdentifier_0: bigint,
                        jurisdictionRuleReference_0: Uint8Array): [PS, bigint];
  getCurrentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  createNewCase(context: __compactRuntime.CircuitContext<PS>,
                caseNumber_0: Uint8Array,
                jurisdictionCode_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  addDiscoveryStepToCase(context: __compactRuntime.CircuitContext<PS>,
                         caseUniqueIdentifier_0: bigint,
                         jurisdictionRuleReference_0: Uint8Array,
                         stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  markDiscoveryStepAsCompleted(context: __compactRuntime.CircuitContext<PS>,
                               caseUniqueIdentifier_0: bigint,
                               stepUniqueHash_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  checkCaseComplianceStatus(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createNewCase(context: __compactRuntime.CircuitContext<PS>,
                caseNumber_0: Uint8Array,
                jurisdictionCode_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  addDiscoveryStepToCase(context: __compactRuntime.CircuitContext<PS>,
                         caseUniqueIdentifier_0: bigint,
                         jurisdictionRuleReference_0: Uint8Array,
                         stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  markDiscoveryStepAsCompleted(context: __compactRuntime.CircuitContext<PS>,
                               caseUniqueIdentifier_0: bigint,
                               stepUniqueHash_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  checkCaseComplianceStatus(context: __compactRuntime.CircuitContext<PS>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalCasesCreated: bigint;
  caseStatusByCaseIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  jurisdictionCodeByCaseIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  isStepCompletedByStepHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
  completionAttestationHashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
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
