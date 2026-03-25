import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";

import {
  Contract,
  type Ledger,
  ledger
} from "../../managed/jurisdiction-registry/contract/index.js";
import {
  type RegistryPrivateState,
  createRegistryPrivateState,
  registryWitnesses
} from "../../witnesses/registry-witnesses.js";

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

export const jurisdictionRegistryPlayer1 = Buffer.from("registry-player1", "ascii")
  .toString("hex")
  .padStart(64, "0");

export class JurisdictionRegistrySimulator {
  readonly contract: Contract<RegistryPrivateState>;
  circuitContext: CircuitContext<RegistryPrivateState>;
  userPrivateStates: Record<string, RegistryPrivateState>;
  updateUserPrivateState: (newPrivateState: RegistryPrivateState) => void;
  contractAddress: ContractAddress;

  constructor() {
    this.contract = new Contract<RegistryPrivateState>(registryWitnesses);
    this.contractAddress = sampleContractAddress();
    const initialPrivateState = createRegistryPrivateState();
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext(initialPrivateState, jurisdictionRegistryPlayer1)
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
    this.updateUserPrivateState = (newPrivateState: RegistryPrivateState) => {};
  }

  static deployContract(): JurisdictionRegistrySimulator {
    return new JurisdictionRegistrySimulator();
  }

  private buildTurnContext(
    currentPrivateState: RegistryPrivateState
  ): CircuitContext<RegistryPrivateState> {
    return {
      ...this.circuitContext,
      currentPrivateState
    };
  }

  private updateUserPrivateStateByName =
    (name: string) =>
    (newPrivateState: RegistryPrivateState): void => {
      this.userPrivateStates[name] = newPrivateState;
    };

  as(name: string): JurisdictionRegistrySimulator {
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

  public getPrivateState(): RegistryPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public getCircuitContext(): CircuitContext<RegistryPrivateState> {
    return this.circuitContext;
  }

  updateStateAndGetLedger<T>(
    circuitResults: CircuitResults<RegistryPrivateState, T>
  ): Ledger {
    this.circuitContext = circuitResults.context;
    this.updateUserPrivateState(circuitResults.context.currentPrivateState);
    return this.getLedger();
  }

  public registerNewJurisdiction(
    jurisdictionCode: Uint8Array,
    rulePackContentHash: Uint8Array,
    sender?: CoinPublicKey
  ): Ledger {
    const circuitResults = this.contract.impureCircuits.registerNewJurisdiction(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      jurisdictionCode,
      rulePackContentHash
    );
    return this.updateStateAndGetLedger(circuitResults);
  }

  public updateJurisdictionRulePack(
    jurisdictionCode: Uint8Array,
    updatedRulePackContentHash: Uint8Array,
    updatedVersionNumber: bigint,
    sender?: CoinPublicKey
  ): Ledger {
    const circuitResults = this.contract.impureCircuits.updateJurisdictionRulePack(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      jurisdictionCode,
      updatedRulePackContentHash,
      updatedVersionNumber
    );
    return this.updateStateAndGetLedger(circuitResults);
  }

  public verifyRulePackHashMatchesExpected(
    jurisdictionCode: Uint8Array,
    expectedRulePackHash: Uint8Array,
    sender?: CoinPublicKey
  ): { ledgerState: Ledger; matches: boolean } {
    const circuitResults = this.contract.impureCircuits.verifyRulePackHashMatchesExpected(
      {
        ...this.circuitContext,
        currentZswapLocalState: sender
          ? emptyZswapLocalState(sender)
          : this.circuitContext.currentZswapLocalState
      },
      jurisdictionCode,
      expectedRulePackHash
    );
    const matches = circuitResults.result;
    const ledgerState = this.updateStateAndGetLedger(circuitResults);
    return { ledgerState, matches };
  }
}
