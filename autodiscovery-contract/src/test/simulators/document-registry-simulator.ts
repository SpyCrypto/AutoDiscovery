import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";

import {
  Contract,
  type Ledger,
  ledger
} from "../../managed/document-registry/contract/index.js";
import {
  type DocumentRegistryPrivateState,
  createDocumentRegistryPrivateState,
  documentRegistryWitnesses
} from "../../witnesses/document-registry-witnesses.js";

import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
  CircuitResults,
  CoinPublicKey,
  emptyZswapLocalState,
  ContractAddress
} from "@midnight-ntwrk/compact-runtime";

const config = new LogicTestingConfig();
export const logger = await createLogger(config.logDir);

export const documentRegistryPlayer1 = Buffer.from("docregistry-player1", "ascii")
  .toString("hex")
  .padStart(64, "0");

export class DocumentRegistrySimulator {
  readonly contract: Contract<DocumentRegistryPrivateState>;
  circuitContext: CircuitContext<DocumentRegistryPrivateState>;
  userPrivateStates: Record<string, DocumentRegistryPrivateState>;
  updateUserPrivateState: (newPrivateState: DocumentRegistryPrivateState) => void;
  contractAddress: ContractAddress;

  constructor() {
    this.contract = new Contract<DocumentRegistryPrivateState>(documentRegistryWitnesses);
    this.contractAddress = sampleContractAddress();
    const initialPrivateState = createDocumentRegistryPrivateState();
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext(initialPrivateState, documentRegistryPlayer1)
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      currentQueryContext: new QueryContext(
        currentContractState.data,
        this.contractAddress
      ),
      costModel: CostModel.initialCostModel()
    };
    this.userPrivateStates = { ["p1"]: currentPrivateState };
    this.updateUserPrivateState = (newPrivateState: DocumentRegistryPrivateState) => {};
  }

  static deployContract(): DocumentRegistrySimulator {
    return new DocumentRegistrySimulator();
  }

  private buildTurnContext(
    currentPrivateState: DocumentRegistryPrivateState
  ): CircuitContext<DocumentRegistryPrivateState> {
    return {
      ...this.circuitContext,
      currentPrivateState
    };
  }

  private updateUserPrivateStateByName =
    (name: string) =>
    (newPrivateState: DocumentRegistryPrivateState): void => {
      this.userPrivateStates[name] = newPrivateState;
    };

  as(name: string): DocumentRegistrySimulator {
    const ps = this.userPrivateStates[name];
    if (!ps) {
      throw new Error(
        `No private state found for user '${name}'. Did you register it?`
      );
    }
    this.circuitContext = this.buildTurnContext(ps);
    this.updateUserPrivateState = this.updateUserPrivateStateByName(name);
    return this;
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): DocumentRegistryPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public getCircuitContext(): CircuitContext<DocumentRegistryPrivateState> {
    return this.circuitContext;
  }

  updateStateAndGetLedger<T>(
    circuitResults: CircuitResults<DocumentRegistryPrivateState, T>
  ): Ledger {
    this.circuitContext = circuitResults.context;
    this.updateUserPrivateState(circuitResults.context.currentPrivateState);
    return this.getLedger();
  }

  public registerDocument(
    documentContentHash: Uint8Array,
    documentCategoryNumber: bigint,
    originatorPublicKey: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; documentHash: Uint8Array } {
    const circuitResults = this.contract.impureCircuits.registerDocument(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      documentContentHash,
      documentCategoryNumber,
      originatorPublicKey
    );
    const documentHash = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, documentHash };
  }

  public registerTwinBond(
    imageTwinContentHash: Uint8Array,
    digitalTwinContentHash: Uint8Array,
    ocrFidelityScorePercent: bigint,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; bondHash: Uint8Array } {
    const circuitResults = this.contract.impureCircuits.registerTwinBond(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      imageTwinContentHash,
      digitalTwinContentHash,
      ocrFidelityScorePercent
    );
    const bondHash = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, bondHash };
  }

  public verifyTwinBondIntegrity(
    imageTwinContentHash: Uint8Array,
    currentDigitalTwinHash: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; isIntact: boolean } {
    const circuitResults = this.contract.impureCircuits.verifyTwinBondIntegrity(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      imageTwinContentHash,
      currentDigitalTwinHash
    );
    const isIntact = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, isIntact };
  }
}
