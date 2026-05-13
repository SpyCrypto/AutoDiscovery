import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  computeUniqueCaseIdentifier(context: __compactRuntime.WitnessContext<Ledger, T>,
                              caseNumber_0: Uint8Array,
                              jurisdictionCode_0: Uint8Array): [T, bigint];
  computeUniqueStepHash(context: __compactRuntime.WitnessContext<Ledger, T>,
                        caseIdentifier_0: bigint,
                        jurisdictionRuleReference_0: Uint8Array): [T, bigint];
  getCurrentTimestamp(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
}

export type ImpureCircuits<T> = {
  createNewCase(context: __compactRuntime.CircuitContext<T>,
                caseNumber_0: Uint8Array,
                jurisdictionCode_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  addDiscoveryStepToCase(context: __compactRuntime.CircuitContext<T>,
                         caseUniqueIdentifier_0: bigint,
                         jurisdictionRuleReference_0: Uint8Array,
                         stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<T, bigint>;
  markDiscoveryStepAsCompleted(context: __compactRuntime.CircuitContext<T>,
                               caseUniqueIdentifier_0: bigint,
                               stepUniqueHash_0: bigint): __compactRuntime.CircuitResults<T, bigint>;
  checkCaseComplianceStatus(context: __compactRuntime.CircuitContext<T>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  createNewCase(context: __compactRuntime.CircuitContext<T>,
                caseNumber_0: Uint8Array,
                jurisdictionCode_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  addDiscoveryStepToCase(context: __compactRuntime.CircuitContext<T>,
                         caseUniqueIdentifier_0: bigint,
                         jurisdictionRuleReference_0: Uint8Array,
                         stepDeadlineTimestamp_0: bigint): __compactRuntime.CircuitResults<T, bigint>;
  markDiscoveryStepAsCompleted(context: __compactRuntime.CircuitContext<T>,
                               caseUniqueIdentifier_0: bigint,
                               stepUniqueHash_0: bigint): __compactRuntime.CircuitResults<T, bigint>;
  checkCaseComplianceStatus(context: __compactRuntime.CircuitContext<T>,
                            caseUniqueIdentifier_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
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

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
