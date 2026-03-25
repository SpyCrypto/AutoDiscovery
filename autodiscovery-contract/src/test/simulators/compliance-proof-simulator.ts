import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";

import {
  Contract,
  type Ledger,
  ledger
} from "../../managed/compliance-proof/contract/index.js";
import {
  type CompliancePrivateState,
  createCompliancePrivateState,
  complianceWitnesses
} from "../../witnesses/compliance-witnesses.js";

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

export const compliancePlayer1 = Buffer.from("compliance-player1", "ascii")
  .toString("hex")
  .padStart(64, "0");

export class ComplianceProofSimulator {
  readonly contract: Contract<CompliancePrivateState>;
  circuitContext: CircuitContext<CompliancePrivateState>;
  userPrivateStates: Record<string, CompliancePrivateState>;
  updateUserPrivateState: (newPrivateState: CompliancePrivateState) => void;
  contractAddress: ContractAddress;

  constructor() {
    this.contract = new Contract<CompliancePrivateState>(complianceWitnesses);
    this.contractAddress = sampleContractAddress();
    const initialPrivateState = createCompliancePrivateState();
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext(initialPrivateState, compliancePlayer1)
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
    this.updateUserPrivateState = (newPrivateState: CompliancePrivateState) => {};
  }

  static deployContract(): ComplianceProofSimulator {
    return new ComplianceProofSimulator();
  }

  private buildTurnContext(
    currentPrivateState: CompliancePrivateState
  ): CircuitContext<CompliancePrivateState> {
    return {
      ...this.circuitContext,
      currentPrivateState
    };
  }

  private updateUserPrivateStateByName =
    (name: string) =>
    (newPrivateState: CompliancePrivateState): void => {
      this.userPrivateStates[name] = newPrivateState;
    };

  as(name: string): ComplianceProofSimulator {
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

  public getPrivateState(): CompliancePrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public getCircuitContext(): CircuitContext<CompliancePrivateState> {
    return this.circuitContext;
  }

  updateStateAndGetLedger<T>(
    circuitResults: CircuitResults<CompliancePrivateState, T>
  ): Ledger {
    this.circuitContext = circuitResults.context;
    this.updateUserPrivateState(circuitResults.context.currentPrivateState);
    return this.getLedger();
  }

  public attestStepLevelCompliance(
    caseIdentifier: bigint,
    stepHash: bigint,
    stepDeadlineTimestamp: bigint,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; attestationHash: Uint8Array } {
    const circuitResults = this.contract.impureCircuits.attestStepLevelCompliance(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      caseIdentifier,
      stepHash,
      stepDeadlineTimestamp
    );
    const attestationHash = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, attestationHash };
  }

  public verifyAttestationExists(
    attestationHash: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; exists: boolean } {
    const circuitResults = this.contract.impureCircuits.verifyAttestationExists(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      attestationHash
    );
    const exists = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, exists };
  }
}
