/**
 * DisputeDao — Frontend SDK interface.
 * All calls to the dispute-dao Soroban contract live here.
 * Components and hooks MUST NOT import from @stellar/stellar-sdk directly.
 */
import { getSorobanServer } from './soroban';
import { CONTRACT_IDS } from '../config/stellar';
import { AppError } from '../utils/errors';
import type { DisputeCase } from '../types';

/**
 * Fetches a dispute case from the dispute-dao contract.
 *
 * @param disputeId - The numeric dispute ID.
 * @returns DisputeCase domain object, or null if not found.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getDisputeCase(disputeId: bigint): Promise<DisputeCase | null> {
  try {
    const server = getSorobanServer();
    void server;
    void disputeId;
    // Stub: returns null until contract is deployed
    return null;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch dispute case for ID ${disputeId}.`,
      err
    );
  }
}

/**
 * Fetches all open disputes for a given parcel.
 *
 * @param parcelId - The numeric parcel ID.
 * @returns Array of DisputeCase objects.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getDisputesByParcel(parcelId: bigint): Promise<DisputeCase[]> {
  try {
    const server = getSorobanServer();
    void server;
    void parcelId;
    // Stub: returns empty array until contract is deployed
    return [];
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch disputes for parcel ${parcelId}.`,
      err
    );
  }
}

/** Contract ID reference for external use */
export const DISPUTE_DAO_CONTRACT_ID = CONTRACT_IDS.disputeDao;
