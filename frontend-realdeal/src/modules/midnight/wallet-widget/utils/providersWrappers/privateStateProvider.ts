import type {
  PrivateStateProvider,
  PrivateStateId,
  PrivateStateExport,
  ExportPrivateStatesOptions,
  ImportPrivateStatesOptions,
  ImportPrivateStatesResult,
  SigningKeyExport,
  ExportSigningKeysOptions,
  ImportSigningKeysOptions,
  ImportSigningKeysResult,
} from '@midnight-ntwrk/midnight-js-types';
import type { ContractAddress } from '@midnight-ntwrk/compact-runtime';

type Logger = { trace: (msg: string) => void };

export class WrappedPrivateStateProvider<PSI extends PrivateStateId = PrivateStateId, PS = any>
  implements PrivateStateProvider<PSI, PS>
{
  constructor(
    private readonly privateDataProvider: PrivateStateProvider<PSI, PS>,
    private readonly logger?: Logger,
  ) {}

  set(privateStateId: PSI, state: PS): Promise<void> {
    this.logger?.trace(`Setting private state for key: ${privateStateId}`);
    return this.privateDataProvider.set(privateStateId, state);
  }

  get(privateStateId: PSI): Promise<null | PS> {
    this.logger?.trace(`Getting private state for key: ${privateStateId}`);
    return this.privateDataProvider.get(privateStateId);
  }

  remove(privateStateId: PSI): Promise<void> {
    this.logger?.trace(`Removing private state for key: ${privateStateId}`);
    return this.privateDataProvider.remove(privateStateId);
  }

  clear(): Promise<void> {
    this.logger?.trace('Clearing private state');
    return this.privateDataProvider.clear();
  }

  setSigningKey(address: string, signingKey: string): Promise<void> {
    this.logger?.trace(`Setting signing key for key: ${address}`);
    return this.privateDataProvider.setSigningKey(address, signingKey);
  }

  getSigningKey(address: string): Promise<null | string> {
    this.logger?.trace(`Getting signing key for key: ${address}`);
    return this.privateDataProvider.getSigningKey(address);
  }

  removeSigningKey(address: string): Promise<void> {
    this.logger?.trace(`Removing signing key for key: ${address}`);
    return this.privateDataProvider.removeSigningKey(address);
  }

  clearSigningKeys(): Promise<void> {
    this.logger?.trace('Clearing signing keys');
    return this.privateDataProvider.clearSigningKeys();
  }

  setContractAddress(address: ContractAddress): void {
    return this.privateDataProvider.setContractAddress(address);
  }

  exportPrivateStates(options?: ExportPrivateStatesOptions): Promise<PrivateStateExport> {
    return this.privateDataProvider.exportPrivateStates(options);
  }

  importPrivateStates(
    exportData: PrivateStateExport,
    options?: ImportPrivateStatesOptions,
  ): Promise<ImportPrivateStatesResult> {
    return this.privateDataProvider.importPrivateStates(exportData, options);
  }

  exportSigningKeys(options?: ExportSigningKeysOptions): Promise<SigningKeyExport> {
    return this.privateDataProvider.exportSigningKeys(options);
  }

  importSigningKeys(
    exportData: SigningKeyExport,
    options?: ImportSigningKeysOptions,
  ): Promise<ImportSigningKeysResult> {
    return this.privateDataProvider.importSigningKeys(exportData, options);
  }
}