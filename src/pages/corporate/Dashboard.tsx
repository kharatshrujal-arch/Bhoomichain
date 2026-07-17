import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';

export function Dashboard(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col text-left">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-surface-container-lowest border-b border-outline-variant">
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
          <nav className="hidden md:flex gap-6">
            <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" to="/corporate/deals">
              Corporates
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" to="/farmer/home">
              Farmers
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" to="/verifier/queue">
              Verifiers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && publicKey ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-fixed rounded-full">
              <span className="material-symbols-outlined text-[20px] text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <BlockchainString value={publicKey} truncate={true} copyable={true} />
            </div>
          ) : (
            <button
              onClick={() => void connect()}
              disabled={isConnecting}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : t('common.connect_wallet')}
            </button>
          )}
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">
              account_balance_wallet
            </span>
            <button
              onClick={handleLanguageClick}
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary bg-transparent border-none p-0"
            >
              language
            </button>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-8 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              corporate_fare
            </span>
          </div>
          <div>
            <p className="text-label-md font-label-md font-bold text-primary mb-0">BhoomiChain</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-0">Institutional Registry</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all duration-200"
            to="/corporate/deals"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 rounded-full bg-primary-container text-on-primary-container font-bold transition-all duration-200"
            to="/corporate/deals"
          >
            <span className="material-symbols-outlined">map</span>
            <span className="font-label-md text-label-md">Active Deals</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all duration-200"
            to="/farmer/payout"
          >
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-label-md text-label-md">Wallet</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all duration-200"
            to="/verifier/queue"
          >
            <span className="material-symbols-outlined">gavel</span>
            <span className="font-label-md text-label-md">Legal Verifiers</span>
          </Link>
        </nav>
        <div className="px-4 mt-auto">
          <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-95 transition-opacity">
            <span className="material-symbols-outlined">add</span> Define New Region
          </button>
          <div className="space-y-1">
            <Link
              className="flex items-center gap-3 py-2 px-4 rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md"
              to="/settings/language"
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </Link>
            <a
              className="flex items-center gap-3 py-2 px-4 rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md"
              href="#"
            >
              <span className="material-symbols-outlined">help</span>
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-12 px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Solar Project - Kurnool District</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-0">
                Aggregation ID: #ST-KR-0042 • Phase 2 Consolidation
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-primary text-primary bg-transparent rounded-xl font-label-md text-label-md hover:bg-primary-fixed transition-colors cursor-pointer">
                Download Deeds (PDF)
              </button>
              <button className="px-6 py-3 bg-primary text-on-primary border-none rounded-xl font-label-md text-label-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                Fund Escrow
              </button>
            </div>
          </div>

          {/* Bento Dashboard */}
          <div className="bento-grid">
            {/* Main Map View (8 columns) */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-label-sm font-label-sm">Cleared</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></span>
                    <span className="text-label-sm font-label-sm">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error"></span>
                    <span className="text-label-sm font-label-sm">Disputed</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded bg-surface-container-highest hover:bg-outline-variant transition-colors border-none cursor-pointer flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">zoom_in</span>
                  </button>
                  <button className="p-1.5 rounded bg-surface-container-highest hover:bg-outline-variant transition-colors border-none cursor-pointer flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">zoom_out</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 relative bg-surface-container min-h-[400px]">
                <div
                  className="w-full h-full bg-cover bg-center opacity-80 mix-blend-multiply absolute inset-0"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFJF8rJ1OoJsi_RsTQoZYQ9ofrkn_eWfQgQKKOXqLtT1wTTtdzx8wvsIYCWyL66lvUogKguHQ_EQ42hnQ9xeNvcni8fICd6FJ2VkOJyheBgTaw-kI1un9ryunck50KgR2_ZzrK3xaOm04UaixCEh9QZzVC5omKH6FOIrq543SY0_KqGuFcWhM-Rs4GfRblkEPita7vWTs6gjnpJPD5B5-Xl77z6AXSf3QivVazXF4kfkRsI86MOUhOx9ZHyAR8bMTL8hxxYOXZvQo')`,
                  }}
                ></div>
                {/* Overlay Legend */}
                <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-outline-variant max-w-xs z-10 text-left">
                  <p className="font-label-md text-label-md font-bold mb-2">Parcel K-203 Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-label-sm font-label-sm gap-4">
                      <span className="text-on-surface-variant">Owner:</span>
                      <span className="text-on-surface font-semibold">Reddy Agriculture Ltd.</span>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-sm gap-4">
                      <span className="text-on-surface-variant">Area:</span>
                      <span className="text-on-surface font-semibold">12.4 Acres</span>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-sm gap-4">
                      <span className="text-on-surface-variant">Status:</span>
                      <span className="text-primary font-bold">Legally Attested</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress & Stats (4 columns) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Progress Ring Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center text-center">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-6">
                  {t('corporate.progress_title')}
                </h3>
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container-highest"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                    ></circle>
                    <circle
                      className="text-primary transition-all duration-1000 ease-out"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="currentColor"
                      strokeDasharray="251.2"
                      strokeDashoffset="55.26"
                      strokeWidth="8"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display-lg text-display-lg text-primary">78%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Acquired</span>
                  </div>
                </div>
                <p className="mt-6 font-body-md text-body-md text-on-surface mb-0">
                  <span className="font-bold">39.2 Acres</span> of target 50 acres cleared for on-chain deed minting.
                </p>
              </div>

              {/* Escrow Card */}
              <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl relative overflow-hidden text-left">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lock
                    </span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest opacity-80">
                      {t('corporate.escrow_card')}
                    </span>
                  </div>
                  <p className="font-display-lg text-display-lg text-on-primary-container mb-1">$1.2M</p>
                  <p className="font-body-md text-body-md opacity-90 mb-4">Locked in Smart Contract</p>
                  <div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
                    <div className="h-full bg-on-primary-container w-3/4"></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-label-sm font-label-sm">
                    <span className="font-mono">Vault: SD8F...9K21</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-on-primary-container animate-pulse"></span>
                      Synchronized
                    </span>
                  </div>
                </div>
                {/* Decorative blockchain pattern */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">hub</span>
                </div>
              </div>
            </div>

            {/* Timeline & Tasks (5 columns) */}
            <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-left">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-title-md text-title-md text-primary mb-0">{t('corporate.closing_timeline')}</h3>
                <div className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
                  Expected Closing: 14 Days
                </div>
              </div>
              <div className="space-y-6 relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-outline-variant"></div>
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-4 ring-white">
                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                  </div>
                  <p className="font-label-md text-label-md font-bold mb-0">Land Registry Identification</p>
                  <p className="text-label-sm text-on-surface-variant mb-0">Completed on May 12, 2024</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-4 ring-white">
                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                  </div>
                  <p className="font-label-md text-label-md font-bold mb-0">Verification &amp; Attestation</p>
                  <p className="text-label-sm text-on-surface-variant mb-0">Completed by 12 Verifiers</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 bg-primary-container rounded-full flex items-center justify-center ring-4 ring-white animate-pulse">
                    <span className="material-symbols-outlined text-on-primary-container text-[12px] animate-spin">sync</span>
                  </div>
                  <p className="font-label-md text-label-md font-bold text-primary mb-0">Final Escrow Settlement</p>
                  <p className="text-label-sm text-on-surface-variant mb-0">In Progress - 72% Verified</p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 bg-surface-container-highest rounded-full ring-4 ring-white"></div>
                  <p className="font-label-md text-label-md font-bold text-on-surface-variant mb-0">Deed Minting on Stellar</p>
                  <p className="text-label-sm text-on-surface-variant mb-0">Pending Closure</p>
                </div>
              </div>
            </div>

            {/* Active Deal List (7 columns) */}
            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden text-left">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-title-md text-title-md text-primary mb-0">{t('corporate.active_deals')}</h3>
                <button className="text-primary font-label-md text-label-md hover:underline bg-transparent border-none cursor-pointer">
                  View All
                </button>
              </div>
              <div className="divide-y divide-outline-variant">
                {/* Deal Item */}
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">eco</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md font-bold mb-0">Solar Project - Kurnool</p>
                    <p className="text-label-sm text-on-surface-variant mb-0">Andhra Pradesh • 78% Filled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md font-bold mb-0">$1.2M</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold uppercase">
                      Active
                    </span>
                  </div>
                </div>
                {/* Deal Item */}
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded bg-tertiary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-fixed-variant">water_drop</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md font-bold mb-0">Irrigation Cluster A-9</p>
                    <p className="text-label-sm text-on-surface-variant mb-0">Maharashtra • 45% Filled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md font-bold mb-0">$450K</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-bold uppercase">
                      Staging
                    </span>
                  </div>
                </div>
                {/* Deal Item */}
                <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed-variant">factory</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md font-bold mb-0">Industrial SEZ Phase 1</p>
                    <p className="text-label-sm text-on-surface-variant mb-0">Gujarat • 100% Filled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md font-bold mb-0">$3.8M</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold uppercase">
                      Settled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-highest text-on-surface-variant mt-auto border-t border-outline-variant">
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-label-md font-bold text-primary">BhoomiChain</span>
          <p className="font-body-md text-body-md text-label-sm font-label-sm mb-0">
            © 2024 BhoomiChain. Secured by Stellar/Soroban.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-opacity duration-200" href="#">
            Legal Documentation
          </a>
          <a className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-opacity duration-200" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-opacity duration-200" href="#">
            Smart Contract Audit
          </a>
          <button
            onClick={handleLanguageClick}
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-opacity duration-200 bg-transparent border-none cursor-pointer"
          >
            Language Settings
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
