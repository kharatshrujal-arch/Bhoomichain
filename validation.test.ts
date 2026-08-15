import { describe, it, expect } from 'vitest';
import {
  isValidStellarAddress,
  isValidContractId,
  isValidParcelId,
  isValidAmount,
} from './validation';

describe('Validation Utilities', () => {
  it('validates Stellar G-addresses correctly', () => {
    const validGAddress = 'GA222222222222222222222222222222222222222222222222222222';
    const invalidAddress = '12345InvalidAddress';
    expect(isValidStellarAddress(validGAddress)).toBe(true);
    expect(isValidStellarAddress(invalidAddress)).toBe(false);
  });

  it('validates Soroban C-contract IDs correctly', () => {
    const validCContract = 'CA222222222222222222222222222222222222222222222222222222';
    const invalidContract = 'GINVALIDCONTRACT';
    expect(isValidContractId(validCContract)).toBe(true);
    expect(isValidContractId(invalidContract)).toBe(false);
  });

  it('validates parcel IDs', () => {
    expect(isValidParcelId('101')).toBe(true);
    expect(isValidParcelId('0')).toBe(true);
    expect(isValidParcelId('-5')).toBe(false);
    expect(isValidParcelId('abc')).toBe(false);
  });

  it('validates transaction amounts', () => {
    expect(isValidAmount('100.50')).toBe(true);
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('-10')).toBe(false);
    expect(isValidAmount('invalid')).toBe(false);
  });
});
