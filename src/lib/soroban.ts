/**
 * Soroban RPC client singleton for BhoomiChain.
 * All contract simulation and invocation calls route through this module.
 */
import { SorobanRpc } from '@stellar/stellar-sdk';
import { STELLAR_NETWORK } from '../config/stellar';
import { AppError } from '../utils/errors';

const rpcClient = new SorobanRpc.Server(STELLAR_NETWORK.rpcUrl, {
  allowHttp: false,
});

/**
 * Returns the singleton Soroban RPC server instance.
 */
export function getSorobanServer(): SorobanRpc.Server {
  return rpcClient;
}

/**
 * Fetches the current ledger sequence number from the RPC server.
 *
 * @returns The latest closed ledger sequence number.
 * @throws {AppError} HORIZON_ERROR if the RPC call fails.
 */
export async function getLatestLedger(): Promise<number> {
  try {
    const ledger = await rpcClient.getLatestLedger();
    return ledger.sequence;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      'Failed to fetch latest Stellar ledger from Soroban RPC.',
      err
    );
  }
}

/**
 * Fetches events from Soroban RPC for a given contract ID and topic filters.
 *
 * @param contractId - The contract ID to filter events for.
 * @param topics - Array of topic strings to filter.
 * @param startLedger - The earliest ledger to search from.
 * @returns Array of raw Soroban events.
 * @throws {AppError} RPC_ERROR if the request fails.
 */
export async function getContractEvents(
  contractId: string,
  topics: string[],
  startLedger: number
): Promise<SorobanRpc.Api.GetEventsResponse['events']> {
  try {
    const response = await rpcClient.getEvents({
      startLedger,
      filters: [
        {
          type: 'contract',
          contractIds: [contractId],
          topics: topics.map((t) => [t]),
        },
      ],
    });
    return response.events;
  } catch (err: unknown) {
    throw new AppError(
      'RPC_ERROR',
      `Failed to fetch events for contract ${contractId}.`,
      err
    );
  }
}
