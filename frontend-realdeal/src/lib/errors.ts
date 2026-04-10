// ============================================================================
// AutoDiscovery Error Hierarchy
// ============================================================================
//
// Structured error classes for consistent error handling across all providers.
// Each error type maps to a specific failure mode in the ADL system.
//
// Usage:
//   throw new WalletNotConnectedError('Cannot sign transaction');
//   throw new ContractCallError('createNewCase', error);
//   throw new ChainConnectionError('Indexer unreachable', { url, status });
// ============================================================================

/**
 * Base error class for all AutoDiscovery errors.
 * Provides a consistent `code` property for programmatic handling.
 */
export class AutoDiscoveryError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AutoDiscoveryError';
    this.code = code;
  }
}

/**
 * Thrown when the indexer or proof server is unreachable.
 */
export class ChainConnectionError extends AutoDiscoveryError {
  readonly url?: string;
  readonly httpStatus?: number;

  constructor(message: string, details?: { url?: string; status?: number }, options?: ErrorOptions) {
    super('CHAIN_CONNECTION_ERROR', message, options);
    this.name = 'ChainConnectionError';
    this.url = details?.url;
    this.httpStatus = details?.status;
  }
}

/**
 * Thrown when a wallet is required but not connected.
 */
export class WalletNotConnectedError extends AutoDiscoveryError {
  constructor(message = 'Wallet not connected. Connect your Lace wallet to perform this action.') {
    super('WALLET_NOT_CONNECTED', message);
    this.name = 'WalletNotConnectedError';
  }
}

/**
 * Thrown when a circuit call (callTx.*) fails.
 */
export class ContractCallError extends AutoDiscoveryError {
  readonly circuitName: string;

  constructor(circuitName: string, cause?: unknown) {
    const causeMessage = cause instanceof Error ? cause.message : String(cause ?? 'unknown');
    super(
      'CONTRACT_CALL_ERROR',
      `Contract circuit "${circuitName}" failed: ${causeMessage}`,
      cause instanceof Error ? { cause } : undefined,
    );
    this.name = 'ContractCallError';
    this.circuitName = circuitName;
  }
}

/**
 * Thrown when a provider feature is not yet implemented / wired.
 */
export class ProviderNotAvailableError extends AutoDiscoveryError {
  readonly providerName: string;
  readonly methodName: string;

  constructor(providerName: string, methodName: string) {
    super(
      'PROVIDER_NOT_AVAILABLE',
      `[${providerName}] ${methodName} is not yet available. This feature requires additional configuration.`,
    );
    this.name = 'ProviderNotAvailableError';
    this.providerName = providerName;
    this.methodName = methodName;
  }
}

/**
 * Thrown when user input fails validation.
 */
export class ValidationError extends AutoDiscoveryError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super('VALIDATION_ERROR', message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
