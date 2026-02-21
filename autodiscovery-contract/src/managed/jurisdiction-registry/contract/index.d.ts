import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  registerNewJurisdiction(context: __compactRuntime.CircuitContext<PS>,
                          jurisdictionCode_0: Uint8Array,
                          rulePackContentHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updateJurisdictionRulePack(context: __compactRuntime.CircuitContext<PS>,
                             jurisdictionCode_0: Uint8Array,
                             updatedRulePackContentHash_0: Uint8Array,
                             updatedVersionNumber_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyRulePackHashMatchesExpected(context: __compactRuntime.CircuitContext<PS>,
                                    jurisdictionCode_0: Uint8Array,
                                    expectedRulePackHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerNewJurisdiction(context: __compactRuntime.CircuitContext<PS>,
                          jurisdictionCode_0: Uint8Array,
                          rulePackContentHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updateJurisdictionRulePack(context: __compactRuntime.CircuitContext<PS>,
                             jurisdictionCode_0: Uint8Array,
                             updatedRulePackContentHash_0: Uint8Array,
                             updatedVersionNumber_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyRulePackHashMatchesExpected(context: __compactRuntime.CircuitContext<PS>,
                                    jurisdictionCode_0: Uint8Array,
                                    expectedRulePackHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
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

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
