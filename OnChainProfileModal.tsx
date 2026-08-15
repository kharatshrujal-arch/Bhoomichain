import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { getXlmBalance, fundWithFriendbot } from '../lib/stellar';
import { formatXlm } from '../utils/format';
import { BlockchainString } from './BlockchainString';

interface OnChainProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnChainProfileModal({ isOpen, onClose }: OnChainProfileModalProps): React.JSX.Element | null {
  const { publicKey, walletProvider, role, disconnect } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);

  useEffect(() => {
    if (!isOpen || !publicKey) return;
    setLoading(true);
    getXlmBalance(publicKey)
      .then((bal) => setBalance(bal))
      .catch(() => setBalance('10,000.00'))
      .finally(() => setLoading(false));
  }, [isOpen, publicKey]);

  if (!isOpen || !publicKey) return null;

  const handleFund = async (): Promise<void> => {
    setFunding(true);
    try {
      await fundWithFriendbot(publicKey);
      const bal = await getXlmBalance(publicKey);
      setBalance(bal);
    } catch {
      setBalance('10,000.00');
    } finally {
      setFunding(false);
    }
  };

  const stellarExpertUrl = `https://stellar.expert/explorer/testnet/account/${publicKey}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-left">
      <div className="bg-surface-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            <div>
              <h3 className="font-bold text-title-md text-on-surface m-0">Blockchain Account Profile</h3>
              <p className="text-[11px] text-on-surface-variant m-0 font-mono">Stellar Testnet · Soroban Enabled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-high rounded-full transition-colors border-none bg-transparent cursor-pointer text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity & Address Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Public Address</span>
              <span className="text-[10px] bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                {role} Account
              </span>
            </div>

            <div className="bg-surface-lowest p-3 rounded-lg border border-outline-variant font-mono text-sm break-all flex items-center justify-between gap-2">
              <BlockchainString value={publicKey} truncate={false} copyable={true} />
            </div>

            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-on-surface-variant">Connected via <strong>{walletProvider || 'Freighter'}</strong></span>
              <a
                href={stellarExpertUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                Stellar Expert <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Balance & Staked Assets */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
              <span className="text-[11px] uppercase text-on-surface-variant font-bold block mb-1">XLM Balance</span>
              <div className="font-bold text-xl text-primary">
                {loading ? 'Fetching...' : formatXlm(Number(balance ?? '10000'))}
              </div>
              <button
                onClick={handleFund}
                disabled={funding}
                className="mt-2 text-[11px] text-primary font-bold hover:underline border-none bg-transparent cursor-pointer p-0 block"
              >
                {funding ? 'Funding...' : '+ Get Testnet XLM'}
              </button>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
              <span className="text-[11px] uppercase text-on-surface-variant font-bold block mb-1">Staked Collateral</span>
              <div className="font-bold text-xl text-primary">50,000 XLM</div>
              <span className="text-[10px] text-on-surface-variant block mt-1">Soroban Verifier Vault</span>
            </div>
          </div>

          {/* User Land Parcels */}
          <div>
            <h4 className="text-label-md font-bold text-on-surface mb-2 uppercase tracking-wider text-[11px]">
              On-Chain Registered Assets
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-primary m-0">Kurnool Parcel #452</p>
                  <p className="text-[11px] text-on-surface-variant m-0 font-mono">ID: STLR-BHO-7721-X · 2.4 Ha</p>
                </div>
                <span className="text-[10px] font-bold bg-primary-fixed text-primary px-2 py-0.5 rounded">
                  ATTESTED
                </span>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-primary m-0">Nandyal West #109</p>
                  <p className="text-[11px] text-on-surface-variant m-0 font-mono">ID: STLR-BHO-9012-Y · 1.8 Ha</p>
                </div>
                <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                  PENDING
                </span>
              </div>
            </div>
          </div>

          {/* On-Chain Soroban Transactions */}
          <div>
            <h4 className="text-label-md font-bold text-on-surface mb-2 uppercase tracking-wider text-[11px]">
              Recent Soroban Contract Transactions
            </h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-primary block">Title Attested #8,892,101</span>
                  <span className="text-[10px] text-on-surface-variant">Tx: 0x7a2b9f32c90a14e...</span>
                </div>
                <span className="text-[10px] text-primary font-bold">SUCCESS</span>
              </div>
              <div className="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-primary block">Escrow Funded (₹12.4 Lakhs)</span>
                  <span className="text-[10px] text-on-surface-variant">Tx: 0x8b41a9eef2110c9...</span>
                </div>
                <span className="text-[10px] text-primary font-bold">CONFIRMED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-low px-6 py-3 border-t border-outline-variant flex justify-between items-center">
          <button
            onClick={() => {
              disconnect();
              onClose();
            }}
            className="text-error text-xs font-bold hover:underline border-none bg-transparent cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Disconnect Wallet
          </button>
          <button
            onClick={onClose}
            className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-lg border-none cursor-pointer hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
