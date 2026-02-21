import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  computeTwinBondHash(context: __compactRuntime.WitnessContext<Ledger, PS>,
                      imageTwinHash_0: Uint8Array,
                      digitalTwinHash_0: Uint8Array): [PS, Uint8Array];
  buildMerkleRootFromDocumentHashes(context: __compactRuntime.WitnessContext<Ledger, PS>,
                                    documentHashCollection_0: bigint): [PS, Uint8Array];
  getCurrentTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  registerDocument(context: __compactRuntime.CircuitContext<PS>,
                   documentContentHash_0: Uint8Array,
                   documentCategoryNumber_0: bigint,
                   originatorPublicKey_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  registerTwinBond(context: __compactRuntime.CircuitContext<PS>,
                   imageTwinContentHash_0: Uint8Array,
                   digitalTwinContentHash_0: Uint8Array,
                   ocrFidelityScorePercent_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  recordCustodyTransfer(context: __compactRuntime.CircuitContext<PS>,
                        documentContentHash_0: Uint8Array,
                        senderPartyPublicKey_0: Uint8Array,
                        receiverPartyPublicKey_0: Uint8Array,
                        transferTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  anchorProductionMerkleRoot(context: __compactRuntime.CircuitContext<PS>,
                             productionUniqueIdentifier_0: Uint8Array,
                             productionMerkleRootHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  anchorCaseRootSnapshot(context: __compactRuntime.CircuitContext<PS>,
                         caseUniqueIdentifier_0: Uint8Array,
                         caseRootMerkleHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyDocumentExistsInProduction(context: __compactRuntime.CircuitContext<PS>,
                                   documentContentHash_0: Uint8Array,
                                   productionUniqueIdentifier_0: Uint8Array,
                                   merkleProofPath_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyTwinBondIntegrity(context: __compactRuntime.CircuitContext<PS>,
                          expectedTwinBondHash_0: Uint8Array,
                          currentImageTwinHash_0: Uint8Array,
                          currentDigitalTwinHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerDocument(context: __compactRuntime.CircuitContext<PS>,
                   documentContentHash_0: Uint8Array,
                   documentCategoryNumber_0: bigint,
                   originatorPublicKey_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  registerTwinBond(context: __compactRuntime.CircuitContext<PS>,
                   imageTwinContentHash_0: Uint8Array,
                   digitalTwinContentHash_0: Uint8Array,
                   ocrFidelityScorePercent_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  recordCustodyTransfer(context: __compactRuntime.CircuitContext<PS>,
                        documentContentHash_0: Uint8Array,
                        senderPartyPublicKey_0: Uint8Array,
                        receiverPartyPublicKey_0: Uint8Array,
                        transferTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  anchorProductionMerkleRoot(context: __compactRuntime.CircuitContext<PS>,
                             productionUniqueIdentifier_0: Uint8Array,
                             productionMerkleRootHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  anchorCaseRootSnapshot(context: __compactRuntime.CircuitContext<PS>,
                         caseUniqueIdentifier_0: Uint8Array,
                         caseRootMerkleHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyDocumentExistsInProduction(context: __compactRuntime.CircuitContext<PS>,
                                   documentContentHash_0: Uint8Array,
                                   productionUniqueIdentifier_0: Uint8Array,
                                   merkleProofPath_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyTwinBondIntegrity(context: __compactRuntime.CircuitContext<PS>,
                          expectedTwinBondHash_0: Uint8Array,
                          currentImageTwinHash_0: Uint8Array,
                          currentDigitalTwinHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalProductionsCreated: bigint;
  productionMerkleRootByIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  latestCaseRootHashByCaseIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  caseRootAnchorTimestampByCaseIdentifier: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly totalDocumentsRegistered: bigint;
  immutableDocumentHashCommitments: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined
  };
  immutableProductionCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
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
