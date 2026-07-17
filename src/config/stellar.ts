export const STELLAR_NETWORK = {
  horizonUrl: 'https://horizon-testnet.stellar.org',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
};

// Initial contract IDs (to be updated after deployment in Phase 4)
export const CONTRACT_IDS = {
  verifierRegistry: 'CVERIFIERREGISTRYXXXXXX123456789012345678901234567890123',
  parcelToken: 'CPARCELTOKENXXXXXX123456789012345678901234567890123',
  aggregationDeal: 'CAGGREGATIONDEALXXXXXX123456789012345678901234567890123',
  disputeDao: 'CDISPUTEDAOxXXXXX123456789012345678901234567890123',
};

// Mock public keys for role matching in Phase 1
export const MOCK_ROLES: Record<string, 'corporate' | 'farmer' | 'verifier' | 'admin'> = {
  'GBBUYER7777777777777777777777777777777777777777777777777': 'corporate',
  'GBFARMER8888888888888888888888888888888888888888888888888': 'farmer',
  'GBVERIFIER99999999999999999999999999999999999999999999999': 'verifier',
  'GBADMIN11111111111111111111111111111111111111111111111111': 'admin',
};

/**
 * Resolves a role for a connected public key.
 * If not matching MOCK_ROLES, checks if stored in sessionStorage (for easy switching during tests),
 * otherwise defaults to 'farmer'.
 */
export function getRoleForAddress(address: string): 'corporate' | 'farmer' | 'verifier' | 'admin' {
  const sessionRole = sessionStorage.getItem(`role_${address}`);
  if (sessionRole === 'corporate' || sessionRole === 'farmer' || sessionRole === 'verifier' || sessionRole === 'admin') {
    return sessionRole;
  }
  return MOCK_ROLES[address] ?? 'farmer';
}
