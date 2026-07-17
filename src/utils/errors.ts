export type AppErrorCode =
  // Wallet / Auth
  | 'WALLET_NOT_INSTALLED'
  | 'WALLET_REJECTED'
  | 'WALLET_WRONG_NETWORK'
  | 'WALLET_DISCONNECTED'
  | 'WALLET_SESSION_EXPIRED'
  // Contract Logic
  | 'CONTRACT_ERROR'
  | 'UNAUTHORIZED_CALLER'
  | 'ILLEGAL_TRANSITION'
  | 'PARCEL_NOT_FOUND'
  | 'VERIFIER_NOT_ACTIVE'
  | 'ALREADY_STAKED'
  | 'DOUBLE_VOTE'
  | 'THRESHOLD_NOT_MET'
  // Network / Infra
  | 'HORIZON_ERROR'
  | 'RPC_ERROR'
  | 'FRIENDBOT_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly details?: unknown;

  constructor(code: AppErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function mapError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as Error | undefined;
  const msg = err?.message ?? 'An unexpected error occurred';

  // Check Freighter/Wallet rejection messages
  if (msg.includes('User rejected') || msg.includes('declined') || msg.includes('rejection') || msg.includes('user cancel')) {
    return new AppError('WALLET_REJECTED', 'Transaction signature was rejected by user.', error);
  }

  if (msg.includes('network') || msg.includes('passphrase') || msg.includes('wrong network')) {
    return new AppError('WALLET_WRONG_NETWORK', 'Connected to the wrong Stellar network. Please use Testnet.', error);
  }

  // Soroban/RPC/Stellar SDK standard errors
  if (msg.includes('HostError') || msg.includes('ContractError') || msg.includes('contract error')) {
    if (msg.includes('illegal_status_transition') || msg.includes('illegal_transition')) {
      return new AppError('ILLEGAL_TRANSITION', 'This action is not allowed in the current status.', error);
    }
    if (msg.includes('unauthorized') || msg.includes('require_auth')) {
      return new AppError('UNAUTHORIZED_CALLER', 'You are not authorized to call this function.', error);
    }
    if (msg.includes('not_active') || msg.includes('verifier_not_active')) {
      return new AppError('VERIFIER_NOT_ACTIVE', 'The connected verifier is not active or staked.', error);
    }
    if (msg.includes('already_staked')) {
      return new AppError('ALREADY_STAKED', 'This verifier has already staked.', error);
    }
    if (msg.includes('double_vote')) {
      return new AppError('DOUBLE_VOTE', 'You have already voted on this case.', error);
    }
    return new AppError('CONTRACT_ERROR', `Smart Contract execution failed: ${msg}`, error);
  }

  // Network/Horizon errors
  if (msg.includes('Horizon') || msg.includes('horizon')) {
    return new AppError('HORIZON_ERROR', 'Stellar Horizon server connection failed. Please check network.', error);
  }
  if (msg.includes('Friendbot') || msg.includes('friendbot')) {
    return new AppError('FRIENDBOT_ERROR', 'Funding account via Friendbot failed.', error);
  }
  if (msg.includes('timeout') || msg.includes('Timeout')) {
    return new AppError('NETWORK_TIMEOUT', 'The network request timed out. Please retry.', error);
  }

  return new AppError('UNKNOWN_ERROR', msg, error);
}
