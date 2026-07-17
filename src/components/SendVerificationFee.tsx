import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { getXlmBalance, sendXlmPayment } from '../lib/stellar';
import { isValidStellarAddress, isValidAmount } from '../utils/validation';
import { mapError } from '../utils/errors';
import { BlockchainString } from './BlockchainString';

export interface SendVerificationFeeProps {
  onSuccess?: () => void;
}

export function SendVerificationFee({ onSuccess }: SendVerificationFeeProps): React.JSX.Element {
  const { publicKey, isConnected } = useWallet();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!publicKey || !isConnected) {
      setErrorMsg('Wallet not connected.');
      setStatus('error');
      return;
    }

    // 1. Validate destination address
    if (!isValidStellarAddress(destination)) {
      setErrorMsg('Malformed address: destination must be a valid Stellar public key (starting with G).');
      setStatus('error');
      return;
    }

    // 2. Validate amount format
    if (!isValidAmount(amount)) {
      setErrorMsg('Invalid amount: please specify a positive number of XLM.');
      setStatus('error');
      return;
    }

    setStatus('pending');
    setErrorMsg(null);

    try {
      // 3. Validate balance against reserve (balance - amount must be >= 1 XLM)
      const balanceStr = await getXlmBalance(publicKey);
      const balance = Number(balanceStr ?? '0');
      const transferAmount = Number(amount);
      
      if (balanceStr === null || balance < transferAmount + 1) {
        setErrorMsg(`Insufficient balance: you need at least ${transferAmount + 1} XLM (includes 1 XLM network reserve).`);
        setStatus('error');
        return;
      }

      // 4. Send transaction
      const hash = await sendXlmPayment(publicKey, destination, amount);
      setTxHash(hash);
      setStatus('success');
      setDestination('');
      setAmount('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const appErr = mapError(err);
      setErrorMsg(appErr.message);
      setStatus('error');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 text-center">
        <p className="font-sans text-body text-on-surface-variant">
          Connect your wallet to execute the verification deposit test payment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 hover:shadow-card transition-all duration-200 text-left">
      <h3 className="font-sans font-bold text-title text-on-surface mb-2">
        Verification Deposit (Test Payment)
      </h3>
      <p className="font-sans text-label text-on-surface-variant mb-6">
        Submit a test payment in XLM to a verifier address to activate the geospatial auditing sequence.
      </p>

      {status === 'success' && txHash && (
        <div className="bg-primary-fixed text-primary p-5 rounded-lg mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Transaction Submitted Successfully!</span>
          </div>
          <div className="text-label-sm mt-1">
            Transaction Hash:{' '}
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-mono"
            >
              <BlockchainString value={txHash} truncate={true} copyable={true} />
            </a>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="self-start mt-2 border border-primary text-primary bg-transparent rounded font-sans font-semibold px-4 h-9 hover:bg-primary/10 transition-colors cursor-pointer text-label-sm"
          >
            Send Another Payment
          </button>
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="bg-error-container text-on-error-container p-5 rounded-lg mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined">error</span>
            <span>Transaction Failed</span>
          </div>
          <p className="text-label-sm leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="self-start mt-2 border border-on-error-container text-on-error-container bg-transparent rounded font-sans font-semibold px-4 h-9 hover:bg-on-error-container/10 transition-colors cursor-pointer text-label-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-tertiary-fixed text-tertiary p-8 rounded-lg mb-6 flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-[48px] animate-spin">
            sync
          </span>
          <div className="font-sans font-semibold text-body">
            Awaiting Wallet Signature & Confirmation...
          </div>
          <p className="text-label-sm text-outline max-w-xs text-center">
            Please approve the signature request in your connected browser extension (e.g. Freighter).
          </p>
        </div>
      )}

      {(status === 'idle' || status === 'pending') && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="destination" className="font-sans font-semibold text-label text-on-surface">
              Verifier Address (Stellar G-Address)
            </label>
            <input
              id="destination"
              type="text"
              required
              disabled={status === 'pending'}
              placeholder="e.g. GBBUYER7777777777777777777777777777777777777777777777777"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border border-outline-variant rounded bg-surface-lowest px-4 py-3 font-sans text-on-surface focus:border-primary-container focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="font-sans font-semibold text-label text-on-surface">
              Amount (XLM)
            </label>
            <input
              id="amount"
              type="number"
              step="0.0000001"
              required
              disabled={status === 'pending'}
              placeholder="e.g. 5.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-outline-variant rounded bg-surface-lowest px-4 py-3 font-sans text-on-surface focus:border-primary-container focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'pending'}
            className="bg-primary-container text-on-primary rounded font-sans font-semibold px-6 h-12 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Send Verification Deposit</span>
          </button>
        </form>
      )}
    </div>
  );
}
