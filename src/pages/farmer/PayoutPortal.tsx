import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';
import { getParcels } from '../../utils/localRegistry';
import type { LandParcel } from '../../utils/localRegistry';

interface TxEvent {
  id: string;
  type: 'escrow_deposit' | 'attestation' | 'payout' | 'threshold_update';
  label: string;
  amount?: string;
  hash: string;
  time: string;
  status: 'confirmed' | 'pending' | 'failed';
}

const INITIAL_TXS: TxEvent[] = [
  {
    id: 'tx1',
    type: 'attestation',
    label: 'Title Verification – Verifier Attestation',
    hash: '0x7e8b9f1a2c3d4e5f',
    time: 'Oct 12, 2024 · 14:32',
    status: 'confirmed',
  },
  {
    id: 'tx2',
    type: 'escrow_deposit',
    label: 'Escrow Deposit from AgriCorp Ltd.',
    amount: '₹12,40,000',
    hash: '0x3f4a5b6c7d8e9f0a',
    time: 'Oct 14, 2024 · 09:15',
    status: 'confirmed',
  },
];

export function PayoutPortal(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();

  const [parcels, setParcels] = React.useState<LandParcel[]>([]);
  const [activeParcels, setActiveParcels] = React.useState<LandParcel[]>([]);
  const [currentPhase, setCurrentPhase] = React.useState<1 | 2 | 3>(2);
  const [clusterProgress, setClusterProgress] = React.useState(70);
  const [transactions, setTransactions] = React.useState<TxEvent[]>(INITIAL_TXS);
  const [showRelease, setShowRelease] = React.useState(false);
  const [releasePending, setReleasePending] = React.useState(false);
  const [releaseComplete, setReleaseComplete] = React.useState(false);

  React.useEffect(() => {
    const list = getParcels();
    setParcels(list);
    setActiveParcels(list.filter((p) => p.status === 'verified'));
  }, []);

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  const handleLanguageToggle = (lang: string): void => {
    void i18n.changeLanguage(lang);
    localStorage.setItem('lng', lang);
  };

  const handleAdvanceCluster = (): void => {
    const newProgress = Math.min(clusterProgress + 5, 85);
    setClusterProgress(newProgress);
    if (newProgress >= 85) {
      setCurrentPhase(3);
      const newTx: TxEvent = {
        id: 'tx' + Date.now(),
        type: 'threshold_update',
        label: 'Aggregation Threshold Reached – 85% Cluster Met',
        hash: '0x' + Math.random().toString(16).slice(2, 18),
        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleRequestRelease = (): void => {
    if (currentPhase < 3) {
      alert('Aggregation threshold not yet reached. Complete Phase 3 first.');
      return;
    }
    setShowRelease(true);
  };

  const handleConfirmRelease = (): void => {
    setReleasePending(true);
    setTimeout(() => {
      setReleasePending(false);
      setReleaseComplete(true);
      const newTx: TxEvent = {
        id: 'tx' + Date.now(),
        type: 'payout',
        label: 'Escrow Release → SBI Bank **** 8291',
        amount: '₹12,40,000',
        hash: '0x' + Math.random().toString(16).slice(2, 18),
        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setShowRelease(false);
    }, 2500);
  };

  const txIconMap: Record<TxEvent['type'], string> = {
    escrow_deposit: 'savings',
    attestation: 'verified_user',
    payout: 'payments',
    threshold_update: 'hub',
  };

  const txColorMap: Record<TxEvent['type'], string> = {
    escrow_deposit: 'text-primary',
    attestation: 'text-tertiary',
    payout: 'text-secondary',
    threshold_update: 'text-primary',
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col text-left">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all bg-transparent border-none cursor-pointer flex items-center justify-center"
            title="Go back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <Link to="/" className="text-title-md font-title-md font-black text-primary hover:opacity-95 transition-opacity">
            BhoomiChain
          </Link>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/corporate/deals">
            Corporates
          </Link>
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" to="/farmer/home">
            Farmers
          </Link>
          <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/verifier/queue">
            Verifiers
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && publicKey ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-fixed rounded-full text-label-sm">
              <span className="material-symbols-outlined text-[20px] text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <BlockchainString value={publicKey} truncate={true} copyable={true} />
            </div>
          ) : (
            <button
              onClick={() => void connect()}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-label-md text-label-md rounded-full hover:opacity-80 transition-opacity border-none cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span>{isConnecting ? 'Connecting...' : t('common.connect_wallet')}</span>
            </button>
          )}
          <button
            onClick={handleLanguageClick}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
            title="Language settings"
          >
            <span className="material-symbols-outlined">language</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Welcome Header */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">
                Payout Portal
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1 mb-0">
                Track your escrow releases and manage your verified land assets.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {activeParcels.length > 0 ? (
                <span className="inline-flex items-center px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm rounded-full">
                  <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  {activeParcels.length} Parcel{activeParcels.length > 1 ? 's' : ''} Legally Attested
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
                  <span className="material-symbols-outlined text-[16px] mr-1">pending</span>
                  Awaiting Attestation
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm rounded-full">
                <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hub
                </span>
                Stellar Testnet · LIVE
              </span>
            </div>
          </div>
        </section>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Primary Column */}
          <div className="lg:col-span-8 space-y-gutter">

            {/* Payout Phases */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl canvas-shadow text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-title-md text-title-md text-primary mt-0 mb-0">Payout Progress</h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  Phase {currentPhase} of 3 Active
                </span>
              </div>
              <div className="space-y-8">
                {/* Phase 1 — Done */}
                <div className="flex gap-4 relative">
                  <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="absolute left-4 top-8 w-[2px] h-10 bg-primary"></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-label-md text-label-md text-primary mb-0 mt-0">Phase 1: Title Verification</h4>
                      <span className="text-label-sm font-label-sm text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded">
                        Complete
                      </span>
                    </div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 mb-0">
                      Ancestral records audited and validated by Stellar network.
                    </p>
                  </div>
                </div>
                {/* Phase 2 — Done or Active */}
                <div className="flex gap-4 relative">
                  <div className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentPhase >= 2 ? 'bg-primary text-white' : 'border-2 border-outline text-outline'}`}>
                    <span className="material-symbols-outlined text-[18px]">{currentPhase >= 2 ? 'check' : 'hourglass_empty'}</span>
                  </div>
                  <div className={`absolute left-4 top-8 w-[2px] h-10 ${currentPhase >= 3 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-label-md text-label-md text-primary mb-0 mt-0">Phase 2: Buyer Escrow Funded</h4>
                      <span className="text-label-sm font-label-sm text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded">
                        {currentPhase >= 2 ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 mb-0">
                      Institutional buyer has locked ₹12,40,000 in smart contract.
                    </p>
                  </div>
                </div>
                {/* Phase 3 — Interactive */}
                <div className="flex gap-4">
                  <div className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentPhase >= 3 ? 'bg-primary text-white' : 'border-2 border-tertiary text-tertiary bg-white'}`}>
                    <span className="material-symbols-outlined text-[18px]">{currentPhase >= 3 ? 'check' : 'hourglass_empty'}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-label-md text-label-md mb-0 mt-0 ${currentPhase >= 3 ? 'text-primary' : 'text-tertiary'}`}>Phase 3: Aggregation Threshold</h4>
                      <span className="text-label-sm font-label-sm text-on-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded">
                        {clusterProgress}% / 85% Met
                      </span>
                    </div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 mb-2">
                      Finalizing neighbor parcel signatures for the solar farm cluster.
                    </p>
                    <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden relative mb-2">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-700 ease-out z-10"
                        style={{ width: `${clusterProgress}%` }}
                      ></div>
                      {clusterProgress < 85 && (
                        <div
                          className="absolute top-0 h-full progress-hatched z-0"
                          style={{ left: `${clusterProgress}%`, width: `${85 - clusterProgress}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        {clusterProgress}% Signed
                      </span>
                      <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">
                        Target: 85%
                      </span>
                    </div>
                    {clusterProgress < 85 && (
                      <button
                        onClick={handleAdvanceCluster}
                        className="px-4 py-2 bg-tertiary text-on-tertiary rounded-full text-label-sm font-label-sm font-bold hover:opacity-90 transition-opacity border-none cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Simulate Neighbor Signature (+5%)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Status Card (the one the user reported as invisible) */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl canvas-shadow text-left">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-title-md text-title-md text-primary mt-0 mb-0 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Transaction History
                </h3>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1 bg-primary-container text-on-primary-container rounded-full">
                  ON-CHAIN
                </span>
              </div>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-start gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                      <span className={`material-symbols-outlined ${txColorMap[tx.type]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {txIconMap[tx.type]}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-label-md text-label-md text-on-surface font-semibold mb-0 truncate">{tx.label}</p>
                        {tx.amount && (
                          <span className="text-label-md font-label-md text-primary font-bold whitespace-nowrap">{tx.amount}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-on-surface-variant truncate max-w-[160px]">{tx.hash}</span>
                        <span className="text-[10px] text-on-surface-variant">·</span>
                        <span className="text-[11px] text-on-surface-variant">{tx.time}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {tx.status === 'confirmed' ? (
                        <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          done_all
                        </span>
                      ) : tx.status === 'pending' ? (
                        <span className="material-symbols-outlined text-tertiary text-[22px] animate-spin">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-error text-[22px]">
                          error
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                    <p className="text-label-md font-label-md">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Action Column */}
          <div className="lg:col-span-4 space-y-gutter text-left">
            {/* Payout Summary Card */}
            <div className="bg-primary-container text-on-primary-container p-6 rounded-xl canvas-shadow flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-label-sm font-label-sm opacity-80 uppercase tracking-widest block">
                  Escrowed Amount
                </span>
                <div className="text-display-lg font-display-lg mt-2 text-white">₹12,40,000</div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="material-symbols-outlined text-white">account_balance</span>
                  <div>
                    <p className="text-label-sm font-label-sm leading-tight text-white mb-1">To Bank A/C</p>
                    <p className="text-label-md font-label-md font-bold text-white mb-0">SBI **** 8291</p>
                  </div>
                </div>
                {releaseComplete ? (
                  <div className="w-full py-4 bg-white text-primary font-bold font-label-md text-label-md rounded-full flex justify-center items-center gap-2 text-center">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Release Confirmed!
                  </div>
                ) : (
                  <button
                    onClick={handleRequestRelease}
                    className={`w-full py-4 font-bold font-label-md text-label-md rounded-full flex justify-center items-center gap-2 border-none cursor-pointer transition-colors ${currentPhase >= 3 ? 'bg-white text-primary hover:bg-surface' : 'bg-white/30 text-white/60 cursor-not-allowed'}`}
                    disabled={currentPhase < 3}
                  >
                    <span className="material-symbols-outlined">payments</span>
                    {currentPhase >= 3 ? 'Release to Bank' : 'Complete Phase 3 First'}
                  </button>
                )}
              </div>
            </div>

            {/* Trust Cues Card */}
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl">
              <h4 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2 mt-0">
                <span className="material-symbols-outlined text-[20px]">security</span>
                Farmer Assurance
              </h4>
              <ul className="space-y-3 pl-0 list-none m-0">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">no_accounts</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">
                    Zero Middlemen: Deal directly with institutional buyers.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">money_off</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">
                    No Fees: Platform costs are covered by the purchaser.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">
                    Smart Escrow: Payouts are automated via blockchain code.
                  </span>
                </li>
              </ul>
            </div>

            {/* My Land Assets quick view */}
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
              <h4 className="font-label-md text-label-md text-primary mb-3 flex items-center gap-2 mt-0">
                <span className="material-symbols-outlined text-[20px]">landscape</span>
                My Verified Parcels
              </h4>
              {activeParcels.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">No verified parcels yet</p>
                  <button
                    onClick={() => navigate('/farmer/documents')}
                    className="text-primary font-bold text-label-sm underline bg-transparent border-none cursor-pointer"
                  >
                    Submit Documents →
                  </button>
                </div>
              ) : (
                <ul className="space-y-2 list-none p-0 m-0">
                  {activeParcels.map((p) => (
                    <li key={p.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold mb-0">{p.name}</p>
                        <p className="text-[11px] text-on-surface-variant mb-0">{p.area} · {p.location.split(',')[0]}</p>
                      </div>
                      <span className="px-2 py-1 text-[10px] font-bold bg-primary-container text-on-primary-container rounded-full uppercase">
                        Verified
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Language Toggle */}
            <div className="flex justify-center pt-2">
              <div className="bg-surface-container rounded-full p-1 flex">
                <button
                  onClick={() => handleLanguageToggle('en')}
                  className={`px-4 py-1.5 font-bold text-label-sm font-label-sm rounded-full shadow-sm cursor-pointer border-none ${i18n.language === 'en' ? 'bg-white text-primary' : 'bg-transparent text-on-surface-variant'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageToggle('hi')}
                  className={`px-4 py-1.5 font-bold text-label-sm font-label-sm rounded-full shadow-sm cursor-pointer border-none ${i18n.language === 'hi' ? 'bg-white text-primary' : 'bg-transparent text-on-surface-variant'}`}
                >
                  हिन्दी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Context */}
        <section className="mt-gutter text-left">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden canvas-shadow">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-white">
              <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">map</span>
                Cluster Geospatial Context
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">Kurnool Cluster A-4</span>
            </div>
            <div className="h-64 w-full bg-surface-container relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvMZ1qY-JHNg_5Msx_veEgwubLfGjMw8ZPAtzsLsNgzmbjV3bfGQsK94hSR0S98kGoZ8TnH1PbEfeShPXp_3yRoyKiBhlnT8xdnr6koXjqVxaJFejZUMQiEtrP_F3U94WgMhIbYJZrbs5dJAUX5kgzTIamSOb5oWGPVH3ot5bccgwh7wxAYqz6Cid2qLENHbWpUMVD-OBeR3coxQpG2YuEql10cxcF-Uf2qjOVRNZeLIDXLfSCMzTUXa2He4Fx6oAFREa9c00Oe9I')`,
                }}
              ></div>
              <div className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur rounded-lg border border-outline-variant shadow-sm max-w-[200px]">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">Your Position</p>
                <p className="text-label-sm font-label-sm text-primary font-bold mb-0">15.8281° N, 78.0373° E</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-highest border-t border-outline-variant mt-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-label-md font-label-md font-bold text-primary">BhoomiChain</span>
          <span className="text-on-surface-variant font-label-sm text-label-sm">
            © 2024 BhoomiChain. Secured by Stellar/Soroban.
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-on-surface-variant text-label-sm font-label-sm hover:text-primary transition-opacity duration-200" href="#">
            Legal Documentation
          </a>
          <a className="text-on-surface-variant text-label-sm font-label-sm hover:text-primary transition-opacity duration-200" href="#">
            Privacy Policy
          </a>
          <button
            onClick={handleLanguageClick}
            className="text-primary font-bold underline text-label-sm font-label-sm bg-transparent border-none cursor-pointer"
          >
            Language Settings
          </button>
        </div>
      </footer>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-16 z-50">
        <Link to="/farmer/home" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link to="/farmer/payout" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <span className="text-[10px] font-bold uppercase">Payout</span>
        </Link>
        <Link to="/farmer/documents" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">folder</span>
          <span className="text-[10px] font-bold uppercase">Docs</span>
        </Link>
        <Link to="/settings/language" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </Link>
      </nav>

      {/* Escrow Release Confirmation Modal */}
      {showRelease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" onClick={() => !releasePending && setShowRelease(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-outline-variant text-center">
            {releasePending ? (
              <div className="py-6">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin block mb-4">progress_activity</span>
                <h3 className="font-title-md text-title-md text-primary mb-2 mt-0">Submitting to Soroban...</h3>
                <p className="text-body-md text-on-surface-variant mb-0">Broadcasting escrow release transaction to the Stellar network.</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <h3 className="font-title-md text-title-md text-primary mb-2 mt-0">Confirm Escrow Release</h3>
                <p className="text-body-md text-on-surface-variant mb-4">
                  ₹12,40,000 will be released from the Soroban smart contract to your SBI bank account **** 8291.
                </p>
                <div className="p-3 bg-error-container/30 border border-error/20 rounded-xl mb-6 text-left">
                  <p className="text-label-sm font-label-sm text-error mb-0">
                    ⚠ This action is irreversible once confirmed on-chain.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRelease(false)}
                    className="flex-grow py-3 border border-outline rounded-xl text-label-md font-label-md bg-transparent text-on-surface hover:bg-surface-container cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRelease}
                    className="flex-grow py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity border-none cursor-pointer"
                  >
                    Confirm Release
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PayoutPortal;
