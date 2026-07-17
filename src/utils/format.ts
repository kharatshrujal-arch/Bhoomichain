/**
 * Formats a Stellar balance (stroops as bigint or raw number) to human readable XLM format.
 */
export function formatXlm(amount: bigint | number): string {
  const val = typeof amount === 'bigint' ? Number(amount) / 10_000_000 : amount;
  return `${val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  })} XLM`;
}

/**
 * Formats a currency value in Indian Rupees (INR), formatting to Lakhs/Crores if needed.
 */
export function formatInr(rupees: number): string {
  if (rupees >= 10_000_000) {
    return `₹${(rupees / 10_000_000).toFixed(2)} Crore`;
  }
  if (rupees >= 100_000) {
    return `₹${(rupees / 100_000).toFixed(2)} Lakh`;
  }
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Formats a Unix timestamp (seconds) into a readable Indian date format.
 */
export function formatDate(timestamp: number | bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncates a Stellar address/contract ID to first 6 and last 4 characters.
 */
export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
