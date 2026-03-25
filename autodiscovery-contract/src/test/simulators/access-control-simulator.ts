import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";

import {
  Contract,
  type Ledger,
  ledger
} from "../../managed/access-control/contract/index.js";
import {
  type AccessControlPrivateState,
  createAccessControlPrivateState,
  accessControlWitnesses
} from "../../witnesses/access-control-witnesses.js";

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

export const accessControlPlayer1 = Buffer.from("accessctrl-player1", "ascii")
  .toString("hex")
  .padStart(64, "0");

export class AccessControlSimulator {
  readonly contract: Contract<AccessControlPrivateState>;
  circuitContext: CircuitContext<AccessControlPrivateState>;
  userPrivateStates: Record<string, AccessControlPrivateState>;
  updateUserPrivateState: (newPrivateState: AccessControlPrivateState) => void;
  contractAddress: ContractAddress;

  constructor() {
    this.contract = new Contract<AccessControlPrivateState>(accessControlWitnesses);
    this.contractAddress = sampleContractAddress();
    const initialPrivateState = createAccessControlPrivateState();
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext(initialPrivateState, accessControlPlayer1)
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
    this.updateUserPrivateState = (newPrivateState: AccessControlPrivateState) => {};
  }

  static deployContract(): AccessControlSimulator {
    return new AccessControlSimulator();
  }

  private buildTurnContext(
    currentPrivateState: AccessControlPrivateState
  ): CircuitContext<AccessControlPrivateState> {
    return {
      ...this.circuitContext,
      currentPrivateState
    };
  }

  private updateUserPrivateStateByName =
    (name: string) =>
    (newPrivateState: AccessControlPrivateState): void => {
      this.userPrivateStates[name] = newPrivateState;
    };

  as(name: string): AccessControlSimulator {
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

  public getPrivateState(): AccessControlPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public getCircuitContext(): CircuitContext<AccessControlPrivateState> {
    return this.circuitContext;
  }

  updateStateAndGetLedger<T>(
    circuitResults: CircuitResults<AccessControlPrivateState, T>
  ): Ledger {
    this.circuitContext = circuitResults.context;
    this.updateUserPrivateState(circuitResults.context.currentPrivateState);
    return this.getLedger();
  }

  public registerParticipantKey(
    participantPublicKeyHash: Uint8Array,
    assignedRoleEnum: bigint,
    sender?: CoinPublicKey
  ): Ledger {
    const circuitResults = this.contract.impureCircuits.registerParticipantKey(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      participantPublicKeyHash,
      assignedRoleEnum
    );
    return this.updateStateAndGetLedger(circuitResults);
  }

  public grantDocumentAccessToParticipant(
    documentContentHash: Uint8Array,
    recipientPublicKeyHash: Uint8Array,
    protectiveOrderTierEnum: bigint,
    sender?: CoinPublicKey
  ): Ledger {
    const circuitResults = this.contract.impureCircuits.grantDocumentAccessToParticipant(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      documentContentHash,
      recipientPublicKeyHash,
      protectiveOrderTierEnum
    );
    return this.updateStateAndGetLedger(circuitResults);
  }

  public verifyParticipantAccess(
    documentContentHash: Uint8Array,
    requesterPublicKeyHash: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; hasAccess: boolean } {
    const circuitResults = this.contract.impureCircuits.verifyParticipantAccess(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      documentContentHash,
      requesterPublicKeyHash
    );
    const hasAccess = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, hasAccess };
  }
}
