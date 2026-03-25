import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";

import {
  Contract,
  type Ledger,
  ledger
} from "../../managed/discovery-core/contract/index.js";
import {
  type DiscoveryCorePrivateState,
  createDiscoveryCorePrivateState,
  discoveryCoreWitnesses
} from "../../witnesses/discovery-witnesses.js";

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

export const discoveryCorePlayer1 = Buffer.from("discovery-player1", "ascii")
  .toString("hex")
  .padStart(64, "0");

export class DiscoveryCoreSimulator {
  readonly contract: Contract<DiscoveryCorePrivateState>;
  circuitContext: CircuitContext<DiscoveryCorePrivateState>;
  userPrivateStates: Record<string, DiscoveryCorePrivateState>;
  updateUserPrivateState: (newPrivateState: DiscoveryCorePrivateState) => void;
  contractAddress: ContractAddress;

  constructor() {
    this.contract = new Contract<DiscoveryCorePrivateState>(discoveryCoreWitnesses);
    this.contractAddress = sampleContractAddress();
    const initialPrivateState = createDiscoveryCorePrivateState();
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext(initialPrivateState, discoveryCorePlayer1)
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
    this.updateUserPrivateState = (newPrivateState: DiscoveryCorePrivateState) => {};
  }

  static deployContract(): DiscoveryCoreSimulator {
    return new DiscoveryCoreSimulator();
  }

  private buildTurnContext(
    currentPrivateState: DiscoveryCorePrivateState
  ): CircuitContext<DiscoveryCorePrivateState> {
    return {
      ...this.circuitContext,
      currentPrivateState
    };
  }

  private updateUserPrivateStateByName =
    (name: string) =>
    (newPrivateState: DiscoveryCorePrivateState): void => {
      this.userPrivateStates[name] = newPrivateState;
    };

  as(name: string): DiscoveryCoreSimulator {
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

  public getPrivateState(): DiscoveryCorePrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public getCircuitContext(): CircuitContext<DiscoveryCorePrivateState> {
    return this.circuitContext;
  }

  updateStateAndGetLedger<T>(
    circuitResults: CircuitResults<DiscoveryCorePrivateState, T>
  ): Ledger {
    this.circuitContext = circuitResults.context;
    this.updateUserPrivateState(circuitResults.context.currentPrivateState);
    return this.getLedger();
  }

  public createNewCase(
    caseNumber: Uint8Array,
    jurisdictionCode: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; caseId: bigint } {
    const circuitResults = this.contract.impureCircuits.createNewCase(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      caseNumber,
      jurisdictionCode
    );
    const caseId = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, caseId };
  }

  public addDiscoveryStepToCase(
    caseId: bigint,
    ruleRef: Uint8Array,
    deadline: bigint,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; stepHash: bigint } {
    const circuitResults = this.contract.impureCircuits.addDiscoveryStepToCase(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      caseId,
      ruleRef,
      deadline
    );
    const stepHash = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, stepHash };
  }

  public markDiscoveryStepAsCompleted(
    caseId: bigint,
    stepHash: bigint,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; attestationHash: bigint } {
    const circuitResults = this.contract.impureCircuits.markDiscoveryStepAsCompleted(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      caseId,
      stepHash
    );
    const attestationHash = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, attestationHash };
  }

  public checkCaseComplianceStatus(
    caseId: bigint,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; isCompliant: boolean } {
    const circuitResults = this.contract.impureCircuits.checkCaseComplianceStatus(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      caseId
    );
    const isCompliant = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, isCompliant };
  }
}
