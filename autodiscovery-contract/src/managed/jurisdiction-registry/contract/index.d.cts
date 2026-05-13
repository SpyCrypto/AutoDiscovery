import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
}

export type ImpureCircuits<T> = {
  registerNewJurisdiction(context: __compactRuntime.CircuitContext<T>,
                          jurisdictionCode_0: Uint8Array,
                          rulePackContentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  updateJurisdictionRulePack(context: __compactRuntime.CircuitContext<T>,
                             jurisdictionCode_0: Uint8Array,
                             updatedRulePackContentHash_0: Uint8Array,
                             updatedVersionNumber_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verifyRulePackHashMatchesExpected(context: __compactRuntime.CircuitContext<T>,
                                    jurisdictionCode_0: Uint8Array,
                                    expectedRulePackHash_0: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  registerNewJurisdiction(context: __compactRuntime.CircuitContext<T>,
                          jurisdictionCode_0: Uint8Array,
                          rulePackContentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  updateJurisdictionRulePack(context: __compactRuntime.CircuitContext<T>,
                             jurisdictionCode_0: Uint8Array,
                             updatedRulePackContentHash_0: Uint8Array,
                             updatedVersionNumber_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verifyRulePackHashMatchesExpected(context: __compactRuntime.CircuitContext<T>,
                                    jurisdictionCode_0: Uint8Array,
                                    expectedRulePackHash_0: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
}

export type Ledger = {
  readonly totalJurisdictionsRegistered: bigint;
  registeredJurisdictionCodes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  currentRulePackHashByJurisdictionCode: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  currentRulePackVersionByJurisdictionCode: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly registryAdministratorPublicKey: { bytes: Uint8Array };
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
