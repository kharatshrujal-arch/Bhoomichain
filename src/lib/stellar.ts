import { Horizon, TransactionBuilder, Operation, Asset, TimeoutInfinite } from '@stellar/stellar-sdk';
import { AppError } from '../utils/errors';
import { walletKit } from './walletKit';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

/**
 * Exposes the active Horizon server instance.
 */
export function getHorizonServer(): Horizon.Server {
  return server;
}

/**
 * Loads account details from Horizon for a given public key.
 * Returns the XLM balance, or null if the account does not exist (404).
 */
export async function getXlmBalance(publicKey: string): Promise<string | null> {
  try {
    const account = await server.loadAccount(publicKey);
    const balance = account.balances.find((b) => b.asset_type === 'native');
    return balance ? balance.balance : '0.0000000';
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null; // Unfunded account
    }
    throw new AppError('HORIZON_ERROR', 'Failed to retrieve balance from Stellar network.', err);
  }
}

/**
 * Requests 10,000 XLM from Stellar Testnet Friendbot for the specified public key.
 */
export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
    if (!response.ok) {
      throw new Error(`Friendbot responded with status ${response.status}`);
    }
    return true;
  } catch (err: any) {
    throw new AppError('FRIENDBOT_ERROR', 'Stellar Friendbot funding failed. Please try again.', err);
  }
}

/**
 * Compiles, signs (via walletKit), and submits an XLM payment transaction.
 */
export async function sendXlmPayment(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<string> {
  try {
    const sourceAccount = await server.loadAccount(fromAddress);
    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100', // stroops
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        Operation.payment({
          destination: toAddress,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(TimeoutInfinite)
      .build();

    const unsignedXdr = tx.toXDR();
    const result = await walletKit.sign({
      xdr: unsignedXdr,
      publicKey: fromAddress,
    });

    const signedTx = TransactionBuilder.fromXDR(
      result.signedXDR,
      'Test SDF Network ; September 2015'
    );
    const response = await server.submitTransaction(signedTx);
    return response.hash;
  } catch (err: any) {
    // If error is already an AppError, rethrow
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError('CONTRACT_ERROR', err?.message ?? 'Transaction submission failed.', err);
  }
}

