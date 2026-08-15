import { describe, it, expect } from 'vitest';
import { formatXlm, formatInr, truncateAddress } from './format';

describe('Format Utilities', () => {
  it('formats XLM stroops correctly', () => {
    expect(formatXlm(100000000n)).toContain('10.00');
    expect(formatXlm(50)).toContain('50.00');
  });

  it('formats INR values into Lakhs and Crores', () => {
    expect(formatInr(500000)).toBe('₹5.00 Lakh');
    expect(formatInr(12500000)).toBe('₹1.25 Crore');
  });

  it('truncates Stellar addresses correctly', () => {
    const fullAddress = 'GBBUYER7777777777777777777777777777777777777777777777777';
    expect(truncateAddress(fullAddress)).toBe('GBBUYE...7777');
    expect(truncateAddress('SHORT')).toBe('SHORT');
  });
});
