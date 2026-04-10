import { describe, it, expect } from 'vitest';
import {
  AutoDiscoveryError,
  ChainConnectionError,
  WalletNotConnectedError,
  ContractCallError,
  ProviderNotAvailableError,
  ValidationError,
} from '../errors';

describe('AutoDiscoveryError', () => {
  it('creates base error with code and message', () => {
    const err = new AutoDiscoveryError('TEST_CODE', 'test message');
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('test message');
    expect(err.name).toBe('AutoDiscoveryError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('ChainConnectionError', () => {
  it('stores url and status details', () => {
    const err = new ChainConnectionError('Indexer down', {
      url: 'https://indexer.example.com',
      status: 503,
    });
    expect(err.code).toBe('CHAIN_CONNECTION_ERROR');
    expect(err.url).toBe('https://indexer.example.com');
    expect(err.httpStatus).toBe(503);
    expect(err.name).toBe('ChainConnectionError');
    expect(err).toBeInstanceOf(AutoDiscoveryError);
  });

  it('works without details', () => {
    const err = new ChainConnectionError('Connection refused');
    expect(err.url).toBeUndefined();
    expect(err.httpStatus).toBeUndefined();
  });
});

describe('WalletNotConnectedError', () => {
  it('has default message', () => {
    const err = new WalletNotConnectedError();
    expect(err.code).toBe('WALLET_NOT_CONNECTED');
    expect(err.message).toContain('Wallet not connected');
    expect(err).toBeInstanceOf(AutoDiscoveryError);
  });

  it('accepts custom message', () => {
    const err = new WalletNotConnectedError('Custom message');
    expect(err.message).toBe('Custom message');
  });
});

describe('ContractCallError', () => {
  it('wraps circuit name and cause', () => {
    const cause = new Error('out of gas');
    const err = new ContractCallError('createNewCase', cause);
    expect(err.code).toBe('CONTRACT_CALL_ERROR');
    expect(err.circuitName).toBe('createNewCase');
    expect(err.message).toContain('createNewCase');
    expect(err.message).toContain('out of gas');
    expect(err.cause).toBe(cause);
  });

  it('handles non-Error cause', () => {
    const err = new ContractCallError('registerDocument', 'string error');
    expect(err.message).toContain('string error');
    expect(err.cause).toBeUndefined();
  });

  it('handles undefined cause', () => {
    const err = new ContractCallError('attestStepLevelCompliance');
    expect(err.message).toContain('unknown');
  });
});

describe('ProviderNotAvailableError', () => {
  it('stores provider and method names', () => {
    const err = new ProviderNotAvailableError('RealAIProvider', 'generateSynopsis');
    expect(err.code).toBe('PROVIDER_NOT_AVAILABLE');
    expect(err.providerName).toBe('RealAIProvider');
    expect(err.methodName).toBe('generateSynopsis');
    expect(err.message).toContain('RealAIProvider');
    expect(err.message).toContain('generateSynopsis');
  });
});

describe('ValidationError', () => {
  it('stores field name', () => {
    const err = new ValidationError('Case number required', 'caseNumber');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.field).toBe('caseNumber');
    expect(err.message).toBe('Case number required');
  });

  it('works without field', () => {
    const err = new ValidationError('Invalid input');
    expect(err.field).toBeUndefined();
  });
});
