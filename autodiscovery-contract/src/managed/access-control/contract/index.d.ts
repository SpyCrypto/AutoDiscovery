import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getCurrentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  computeSharingEventProofHash(context: __compactRuntime.WitnessContext<Ledger, PS>,
                               documentHash_0: Uint8Array,
                               recipientPublicKeyHash_0: Uint8Array,
                               sharingTimestamp_0: bigint): [PS, Uint8Array];
  lookupRoleCommitmentMerklePath(context: __compactRuntime.WitnessContext<Ledger, PS>,
                                 publicKeyHash_0: Uint8Array): [PS, __compactRuntime.MerkleTreePath<Uint8Array> | undefined];
}

export type ImpureCircuits<PS> = {
  registerParticipantKey(context: __compactRuntime.CircuitContext<PS>,
                         participantPublicKeyHash_0: Uint8Array,
                         assignedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  assignRoleForCase(context: __compactRuntime.CircuitContext<PS>,
                    caseUniqueIdentifier_0: Uint8Array,
                    participantPublicKeyHash_0: Uint8Array,
                    assignedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  grantDocumentAccessToParticipant(context: __compactRuntime.CircuitContext<PS>,
                                   documentContentHash_0: Uint8Array,
                                   recipientPublicKeyHash_0: Uint8Array,
                                   protectiveOrderTierEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  revokeDocumentAccessFromParticipant(context: __compactRuntime.CircuitContext<PS>,
                                      documentContentHash_0: Uint8Array,
                                      revokedPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveParticipantHasRole(context: __compactRuntime.CircuitContext<PS>,
                          caseUniqueIdentifier_0: Uint8Array,
                          claimedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  shareDocumentWithParticipant(context: __compactRuntime.CircuitContext<PS>,
                               documentContentHash_0: Uint8Array,
                               recipientPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyParticipantAccess(context: __compactRuntime.CircuitContext<PS>,
                          documentContentHash_0: Uint8Array,
                          requesterPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerParticipantKey(context: __compactRuntime.CircuitContext<PS>,
                         participantPublicKeyHash_0: Uint8Array,
                         assignedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  assignRoleForCase(context: __compactRuntime.CircuitContext<PS>,
                    caseUniqueIdentifier_0: Uint8Array,
                    participantPublicKeyHash_0: Uint8Array,
                    assignedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  grantDocumentAccessToParticipant(context: __compactRuntime.CircuitContext<PS>,
                                   documentContentHash_0: Uint8Array,
                                   recipientPublicKeyHash_0: Uint8Array,
                                   protectiveOrderTierEnum_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  revokeDocumentAccessFromParticipant(context: __compactRuntime.CircuitContext<PS>,
                                      documentContentHash_0: Uint8Array,
                                      revokedPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveParticipantHasRole(context: __compactRuntime.CircuitContext<PS>,
                          caseUniqueIdentifier_0: Uint8Array,
                          claimedRoleEnum_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  shareDocumentWithParticipant(context: __compactRuntime.CircuitContext<PS>,
                               documentContentHash_0: Uint8Array,
                               recipientPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyParticipantAccess(context: __compactRuntime.CircuitContext<PS>,
                          documentContentHash_0: Uint8Array,
                          requesterPublicKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  authorizedRoleCommitments: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined
  };
  readonly totalSharingEventsRecorded: bigint;
  sharingEventProofHashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  participantRoleByPublicKeyHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  partyListReferenceByCaseIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  permittedAccessReferenceByDocumentHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  protectiveOrderTierByDocumentHash: {
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
