/**
 * AggregationDeal — Frontend SDK interface.
 * All calls to the aggregation-deal Soroban contract live here.
 * Components and hooks MUST NOT import from @stellar/stellar-sdk directly.
 */
import { getSorobanServer } from './soroban';
import { CONTRACT_IDS } from '../config/stellar';
import { AppError } from '../utils/errors';
import type { DealRecord } from '../types';

/**
 * Fetches a deal record from the aggregation-deal contract.
 *
 * @param dealId - The numeric deal ID.
 * @returns DealRecord domain object, or null if not found.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getDealRecord(dealId: bigint): Promise<DealRecord | null> {
  try {
    const server = getSorobanServer();
    void server;
    void dealId;
    // Stub: returns null until contract is deployed
    return null;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch deal record for ID ${dealId}.`,
      err
    );
  }
}

/**
 * Fetches all deals associated with a given buyer address.
 *
 * @param buyerAddress - Stellar public key of the corporate buyer.
 * @returns Array of DealRecord objects.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getDealsByBuyer(buyerAddress: string): Promise<DealRecord[]> {
  try {
    const server = getSorobanServer();
    void server;
    void buyerAddress;
    // Stub: returns empty array until contract is deployed
    return [];
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch deals for buyer ${buyerAddress}.`,
      err
    );
  }
}

/** Contract ID reference for external use */
export const AGGREGATION_DEAL_CONTRACT_ID = CONTRACT_IDS.aggregationDeal;
