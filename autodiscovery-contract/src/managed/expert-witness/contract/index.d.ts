import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  computeExpertIdentifierHash(context: __compactRuntime.WitnessContext<Ledger, PS>,
                              expertCredentialData_0: bigint): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  registerExpertWitness(context: __compactRuntime.CircuitContext<PS>,
                        expertQualificationProofHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyExpertIsRegistered(context: __compactRuntime.CircuitContext<PS>,
                           expertIdentifierHashToVerify_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerExpertWitness(context: __compactRuntime.CircuitContext<PS>,
                        expertQualificationProofHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyExpertIsRegistered(context: __compactRuntime.CircuitContext<PS>,
                           expertIdentifierHashToVerify_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalExpertsRegistered: bigint;
  registeredExpertIdentifierHashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  qualificationProofHashByExpertIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
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
