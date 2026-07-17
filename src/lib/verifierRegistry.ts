/**
 * VerifierRegistry — Frontend SDK interface.
 * All calls to the verifier-registry Soroban contract live here.
 * Components and hooks MUST NOT import from @stellar/stellar-sdk directly.
 */
import { getSorobanServer } from './soroban';
import { CONTRACT_IDS } from '../config/stellar';
import { AppError } from '../utils/errors';
import type { VerifierRecord } from '../types';

/**
 * Checks whether a given address is an active verifier on-chain.
 *
 * @param address - Stellar public key of the verifier.
 * @returns True if active, false otherwise.
 * @throws {AppError} RPC_ERROR if the RPC call fails.
 */
export async function isVerifierActive(address: string): Promise<boolean> {
  try {
    const server = getSorobanServer();
    // TODO: Replace with actual contract invocation once deployed
    // const result = await server.simulateTransaction(...)
    void server;
    void address;
    // Stub: returns false until contract is deployed
    return false;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to check verifier status for ${address}.`,
      err
    );
  }
}

/**
 * Fetches the full verifier record from the registry contract.
 *
 * @param address - Stellar public key of the verifier.
 * @returns VerifierRecord domain object, or null if not registered.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getVerifierRecord(address: string): Promise<VerifierRecord | null> {
  try {
    const server = getSorobanServer();
    void server;
    void address;
    // Stub: returns null until contract is deployed
    return null;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch verifier record for ${address}.`,
      err
    );
  }
}

/** Contract ID reference for external use */
export const VERIFIER_REGISTRY_CONTRACT_ID = CONTRACT_IDS.verifierRegistry;
