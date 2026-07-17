/**
 * Validates a public Stellar G-address.
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-D2-7][A-Z2-7]{54}$/.test(address);
}

/**
 * Validates a Soroban Contract ID.
 */
export function isValidContractId(address: string): boolean {
  return /^C[A-D2-7][A-Z2-7]{54}$/.test(address);
}

/**
 * Validates a parcel ID is a valid non-negative integer representation.
 */
export function isValidParcelId(id: string): boolean {
  if (!id) return false;
  const num = Number(id);
  return !isNaN(num) && num >= 0 && Number.isInteger(num);
}

/**
 * Validates a transaction amount is a positive number.
 */
export function isValidAmount(amount: string): boolean {
  if (!amount) return false;
  const num = Number(amount);
  return !isNaN(num) && num > 0;
}
