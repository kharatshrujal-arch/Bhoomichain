/**
 * ParcelToken — Frontend SDK interface.
 * All calls to the parcel-token Soroban contract live here.
 * Components and hooks MUST NOT import from @stellar/stellar-sdk directly.
 */
import { getSorobanServer } from './soroban';
import { CONTRACT_IDS } from '../config/stellar';
import { AppError } from '../utils/errors';
import type { ParcelRecord } from '../types';

/**
 * Fetches a parcel's on-chain record by its numeric ID.
 *
 * @param parcelId - The numeric parcel ID allocated by the contract.
 * @returns ParcelRecord domain object, or null if not found.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getParcelRecord(parcelId: bigint): Promise<ParcelRecord | null> {
  try {
    const server = getSorobanServer();
    void server;
    void parcelId;
    // Stub: returns null until contract is deployed
    return null;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch parcel record for ID ${parcelId}.`,
      err
    );
  }
}

/**
 * Fetches all parcels owned by a given address.
 *
 * @param ownerAddress - Stellar public key of the owner.
 * @returns Array of ParcelRecord objects owned by the address.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getParcelsByOwner(ownerAddress: string): Promise<ParcelRecord[]> {
  try {
    const server = getSorobanServer();
    void server;
    void ownerAddress;
    // Stub: returns empty array until contract is deployed
    return [];
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch parcels for owner ${ownerAddress}.`,
      err
    );
  }
}

/** Contract ID reference for external use */
export const PARCEL_TOKEN_CONTRACT_ID = CONTRACT_IDS.parcelToken;
