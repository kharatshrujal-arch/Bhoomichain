import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../hooks/useWallet';
import { getXlmBalance, fundWithFriendbot } from '../lib/stellar';
import { truncateAddress, formatXlm } from '../utils/format';
import { mapError } from '../utils/errors';
import type { Role } from '../types';

export function WalletButton(): React.JSX.Element {
  const { publicKey, isConnected, isConnecting, walletProvider, role, connect, disconnect, setRole } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (): void => setShowDropdown((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;
    const handleOutsideClick = (): void => setShowDropdown(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showDropdown]);

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="bg-primary-container text-on-primary rounded font-sans font-semibold px-6 h-12 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={toggleDropdown}
        className="border border-outline-variant hover:border-primary text-on-surface bg-surface-lowest rounded font-sans font-semibold px-4 h-12 flex items-center justify-center gap-2 hover:bg-surface-low transition-all duration-150 cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed" />
        <span>{truncateAddress(publicKey ?? '')}</span>
        <span className="text-label-sm bg-primary-fixed text-primary px-2 py-0.5 rounded capitalize">
          {role}
        </span>
        <span className="material-symbols-outlined text-[18px] text-outline">
          arrow_drop_down
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-lowest border border-outline-variant rounded-lg shadow-card p-4 z-50 animate-fade-in">
          <div className="border-b border-outline-variant pb-3 mb-3">
            <div className="text-label-sm text-outline uppercase tracking-wider mb-1">
              Connected via {walletProvider}
            </div>
            <div className="font-mono text-label text-on-surface select-all break-all">
              {publicKey}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-label-sm text-outline uppercase tracking-wider mb-2">
              Select Role (Testing Only)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['farmer', 'verifier', 'corporate', 'admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowDropdown(false);
                  }}
                  className={`px-2.5 py-1.5 rounded text-label-sm capitalize font-semibold cursor-pointer border text-center transition-colors ${
                    role === r
                      ? 'bg-primary-container text-on-primary border-primary-container'
                      : 'bg-surface-lowest text-on-surface-variant border-outline-variant hover:bg-surface-low'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full bg-error text-on-error rounded font-sans font-semibold px-4 h-10 hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}

export interface BalanceCardProps {
  publicKey: string | null;
}

export function BalanceCard({ publicKey }: BalanceCardProps): React.JSX.Element {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchBalance = useCallback(async (showLoading = true): Promise<void> => {
    if (!publicKey) return;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const bal = await getXlmBalance(publicKey);
      setBalance(bal);
      setLastRefreshed(new Date());
    } catch (err: any) {
      const appErr = mapError(err);
      setError(appErr.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    void fetchBalance();
  }, [fetchBalance]);

  const handleFund = async (): Promise<void> => {
    if (!publicKey) return;
    setFunding(true);
    setError(null);
    try {
      await fundWithFriendbot(publicKey);
      // Wait slightly for ledger ingestion, then refresh
      setTimeout(() => {
        void fetchBalance();
        setFunding(false);
      }, 2000);
    } catch (err: any) {
      const appErr = mapError(err);
      setError(appErr.message);
      setFunding(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 text-center">
        <p className="font-sans text-body text-on-surface-variant">
          Connect your wallet to view balance information.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-sans font-bold text-title text-on-surface">Stellar Wallet Balance</span>
          <button
            onClick={() => void fetchBalance()}
            disabled={loading || funding}
            className="p-1.5 hover:bg-surface-high rounded-full transition-colors inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Refresh balance"
          >
            <span className={`material-symbols-outlined text-[20px] text-outline ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded text-label-sm font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4">
          {balance === null && !loading && !funding ? (
            <div className="flex flex-col gap-2">
              <div className="text-body text-on-surface-variant font-semibold text-left">
                Account Unfunded / Not Found
              </div>
              <p className="text-label text-outline text-left">
                This account does not exist on Testnet yet. You must fund it with Friendbot to activate it.
              </p>
            </div>
          ) : balance === '0.0000000' && !loading ? (
            <div className="flex flex-col gap-1">
              <span className="font-sans font-bold text-display text-error">
                0.00 XLM
              </span>
              <span className="text-label text-outline text-left">
                Your account is activated but has no funds.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {loading && balance === null ? (
                <span className="font-sans font-bold text-display text-on-surface-variant animate-pulse">
                  --- XLM
                </span>
              ) : (
                <span className="font-sans font-bold text-display text-primary-container text-left">
                  {formatXlm(Number(balance ?? '0'))}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-label-sm text-outline text-left">
          {lastRefreshed
            ? `Refreshed: ${lastRefreshed.toLocaleTimeString()}`
            : 'Not refreshed yet'}
        </span>

        {balance === null && (
          <button
            onClick={handleFund}
            disabled={funding}
            className="bg-tertiary-container text-on-tertiary-container rounded font-sans font-semibold px-4 h-10 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            <span>{funding ? 'Funding Account...' : 'Fund via Friendbot'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
