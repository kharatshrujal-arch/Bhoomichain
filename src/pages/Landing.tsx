import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { BlockchainString } from '../components/BlockchainString';

export function Landing(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();

  const handleStartAggregation = (): void => {
    navigate('/corporate/deals');
  };

  const handleJoin = (): void => {
    navigate('/farmer/home');
  };

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-title-md font-black text-primary hover:opacity-95 transition-opacity">
            BhoomiChain
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              className="text-label-md font-label-md text-primary font-bold border-b-2 border-primary pb-1"
              to="/corporate/deals"
            >
              Corporates
            </Link>
            <Link
              className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
              to="/farmer/home"
            >
              Farmers
            </Link>
            <Link
              className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
              to="/verifier/queue"
            >
              Verifiers
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLanguageClick}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 cursor-pointer transition-colors bg-transparent border-none"
            title="Language Settings"
          >
            language
          </button>
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
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:opacity-80 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                account_balance_wallet
              </span>
              <span>{isConnecting ? 'Connecting...' : t('common.connect_wallet')}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-margin-mobile md:px-margin-desktop min-h-[auto] lg:min-h-[921px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 land-grid-pattern"></div>
        <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-gutter items-center relative z-10 w-full">
          <div className="text-left">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-lg text-label-sm font-label-sm mb-6 uppercase tracking-wider">
              {t('landing.badge')}
            </span>
            <h1 className="font-display-lg text-display-lg text-primary leading-tight mb-6">
              India's Land Acquisition, <span className="text-gradient-primary">Solved.</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-xl">
              Shift from 7-year manual processes to weeks of on-chain certainty. BhoomiChain automates trust, legal verification, and payments for large-scale land aggregation.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartAggregation}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-lg hover:shadow-lg transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>{t('landing.cta_start_deal')}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                onClick={handleJoin}
                className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-label-md text-lg hover:bg-primary-fixed transition-all cursor-pointer bg-transparent"
              >
                {t('landing.cta_join')}
              </button>
            </div>
            {/* Trust Logos */}
            <div className="mt-12 flex items-center gap-8 grayscale opacity-60">
              <div className="flex items-center gap-2">
                <span className="font-black text-title-md tracking-tighter text-on-surface">STELLAR</span>
              </div>
              <div className="w-px h-8 bg-outline-variant"></div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-title-md tracking-tighter italic text-on-surface">SOROBAN</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: Bento Layout showing land assets */}
          <div className="relative grid grid-cols-12 gap-4 h-[500px]">
            <div className="col-span-8 row-span-6 rounded-xl overflow-hidden shadow-xl border border-outline-variant">
              <div
                className="h-full w-full bg-surface-container bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBx9-MPd-uFQoZWXdx7FPNqARSXFTDPhjynYd0cpc3Gees6rnA3QrlLoWuM57q0EAChDGT6PXcemGzJ0hRSwSPlgWZKMq5Tx1lWUeA4f5ZMtkzxvoilh2T9cjs4KmgGkL1wP7kLwjmz-fTcarh2k8xpBp-tnlR_71s2yeNgeJyky6uKbexo00dBYdjWwheUnx18bF1UC2vd3pRX9FY3jcleJu_NPcah8NP07Y4z-g8PMPfFIAK5oDPknkrfzkcZ5VAU8wxzGalPDP0')`,
                }}
              ></div>
            </div>
            <div className="col-span-4 row-span-3 bg-white/80 backdrop-blur-md rounded-xl border border-outline-variant p-4 flex flex-col justify-center text-left">
              <span className="text-label-sm text-primary uppercase font-bold mb-1">Live Asset</span>
              <div className="text-headline-lg font-headline-lg text-primary">
                42.5<span className="text-body-md font-normal">Acres</span>
              </div>
              <div className="mt-2 h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%]"></div>
              </div>
              <div className="text-[10px] text-on-surface-variant mt-1">Aggregation Threshold (85%)</div>
            </div>
            <div className="col-span-4 row-span-3 rounded-xl overflow-hidden border border-outline-variant">
              <div
                className="h-full w-full bg-surface-container bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyUS13Ip-GwGQLMfKCWshl8aHYdCzeyS96cVD3GtPoYjadQxCR6J_rX16OlRndgBhxwPVCcgdTuVfelY4nkB0sUdVx91C_L-y-JsTkw1vsSJqzNMCSz4KT8QaSAwfNArfHBdLIH_okwXBBwYHgIeFF-LGTa3CmYso-1walNlgpgSeiHTNQFpPlMVyTtOXD9_kaCUL3a49F2G64C7Knwn4jWYNrYPYFkluMt5dsLpLyToS9GBnDsarMbezZos4e1AW94PC89Gx403Y')`,
                }}
              ></div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-primary text-on-primary p-6 rounded-2xl shadow-2xl z-20 flex items-center gap-4">
              <div className="p-3 bg-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <div className="text-left">
                <div className="text-label-md font-bold">Legally Attested</div>
                <div className="text-[12px] opacity-80 flex items-center gap-1 font-mono">
                  Contract ID: <BlockchainString value="CDPARCELTOKENXXXXXX123456789012345678901234567890123" truncate={true} copyable={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Bento Section */}
      <section className="py-24 px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">{t('landing.trust_title')}</h2>
            <p className="text-body-md text-on-surface-variant">We replace legacy bureaucratic delays with autonomous on-chain logic, ensuring fair value and legal finality.</p>
          </div>
          {/* Horizontal Feature Row — 4 cards */}
          <div className="flex flex-row gap-gutter overflow-x-auto no-scrollbar pb-2">
            {/* Card 1 — Tokenized Parcels */}
            <div className="min-w-[280px] flex-shrink-0 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-lg transition-all group text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">layers</span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-3">{t('landing.card_tokenized_title')}</h3>
              <p className="text-body-md text-on-surface-variant mb-4">{t('landing.card_tokenized_desc')}</p>
              <Link to="/farmer/home" className="inline-flex items-center text-primary text-label-md font-bold gap-1 group-hover:gap-2 transition-all font-sans">
                Explore Registry <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>
            {/* Card 2 — Atomic Escrow */}
            <div className="min-w-[280px] flex-shrink-0 bg-surface-container-lowest p-8 rounded-xl border-2 border-primary shadow-md group text-left">
              <div className="w-12 h-12 bg-primary text-on-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-3">{t('landing.card_escrow_title')}</h3>
              <p className="text-body-md text-on-surface-variant mb-4">{t('landing.card_escrow_desc')}</p>
              <div className="bg-surface-container p-3 rounded-lg mt-4 border border-outline-variant">
                <div className="flex justify-between text-label-sm mb-2">
                  <span>Current Aggregation</span>
                  <span className="font-bold">78% / 85%</span>
                </div>
                <div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[78%]"></div>
                </div>
              </div>
            </div>
            {/* Card 3 — Economic Honesty */}
            <div className="min-w-[280px] flex-shrink-0 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-lg transition-all group text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-3">{t('landing.card_honesty_title')}</h3>
              <p className="text-body-md text-on-surface-variant mb-4">{t('landing.card_honesty_desc')}</p>
              <Link to="/verifier/queue" className="inline-flex items-center text-primary text-label-md font-bold gap-1 group-hover:gap-2 transition-all font-sans">
                Verifier Metrics <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>
            {/* Card 4 — My Assets (NEW) */}
            <div className="min-w-[280px] flex-shrink-0 bg-primary text-on-primary p-8 rounded-xl hover:shadow-lg transition-all group text-left">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
              </div>
              <h3 className="text-title-md font-title-md mb-3">My Land Assets</h3>
              <p className="text-body-md mb-4 opacity-80">Register, track, and tokenize your agricultural land parcels. See live verification status and escrow progress.</p>
              <button
                onClick={() => navigate('/farmer/home')}
                className="inline-flex items-center text-white text-label-md font-bold gap-1 group-hover:gap-2 transition-all bg-transparent border-none cursor-pointer p-0"
              >
                View My Assets <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Direct-to-Bank Feature */}
          <div className="mt-gutter bg-primary text-on-primary p-12 rounded-2xl flex flex-col md:flex-row items-center gap-12 overflow-hidden relative text-left">
            <div className="flex-1 relative z-10">
              <h3 className="text-headline-lg font-headline-lg mb-4">{t('landing.direct_payout_title')}</h3>
              <p className="text-body-lg mb-8 opacity-90 max-w-xl">
                Using Stellar Anchors, we bypass traditional banking delays and middleman commissions. Farmers receive funds in their local accounts the second a deed is verified.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container bg-primary-fixed rounded-full p-1 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>{t('landing.direct_payout_bullet1')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container bg-primary-fixed rounded-full p-1 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>{t('landing.direct_payout_bullet2')}</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full relative z-10">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-2xl text-on-surface">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary-container"></div>
                    <span className="font-bold text-on-surface">Transaction Status</span>
                  </div>
                  <span className="text-label-sm text-primary font-bold bg-primary-fixed px-2 py-1 rounded">ON-CHAIN</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
                    <div className="text-label-md text-on-surface">Escrow Release</div>
                    <div className="text-label-md font-bold text-on-surface">₹12,40,000</div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
                    <div className="text-label-md text-on-surface">To Bank A/C</div>
                    <div className="text-label-md font-bold text-on-surface">**** 8291</div>
                  </div>
                  <div className="flex justify-between items-center text-primary">
                    <div className="text-label-md font-bold">Status</div>
                    <div className="flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MY ASSETS SECTION (NEW) ─── */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-lg text-label-sm font-bold mb-4 uppercase tracking-wider">My Assets</span>
              <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Your Land, On-Chain</h2>
              <p className="text-body-md text-on-surface-variant max-w-xl mb-0">
                Each parcel you register becomes a tokenized, legally-attested digital asset — visible on the Stellar blockchain in real time.
              </p>
            </div>
            <button
              onClick={() => navigate('/farmer/documents')}
              className="flex-shrink-0 flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md font-bold hover:opacity-90 transition-opacity border-none cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              Register New Asset
            </button>
          </div>

          {/* Asset Cards — Horizontal Row */}
          <div className="flex flex-row gap-gutter overflow-x-auto no-scrollbar pb-4">
            {/* Asset 1 — Verified */}
            <div className="min-w-[300px] flex-shrink-0 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7bb6FfP3ZdOQI-vyAGBNlI4IpbW-mmbaqxrVKDpWSNtERr1d8C54g37pFn61KFV10Ay5RIv2ustrH1ADvba1wkE4uQzVD4QQ6EkMlmHsYRcc97H8YydJwOXLSI9gDCQVeYUAVGvkmXxKmCoc5lyjWobOu-Vrk8vqWNQo2phjoJ_jhH1POTrP2vuuYf-dqsnC-67TRZ0rscP4-hwzCETlsoQvawP1xFf-aGst9VSe88zlO2OtmjR0mtpCozo8xYcL2e_1eqxbvzss')` }}></div>
                <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Legally Attested
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono text-on-surface-variant mb-1">STLR-BHO-7721-X</p>
                <h4 className="font-title-md text-title-md text-primary mb-1 mt-0">Kurnool Parcel #452</h4>
                <p className="text-label-sm text-on-surface-variant mb-4">Kurnool, Andhra Pradesh</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">Area</p>
                    <p className="font-bold text-primary">2.4 Hectares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant uppercase">Value</p>
                    <p className="font-bold text-primary">₹82.5 Lakhs</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Escrow Status</span>
                  <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">LOCKED IN SOROBAN</span>
                </div>
              </div>
            </div>

            {/* Asset 2 — Pending */}
            <div className="min-w-[300px] flex-shrink-0 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0ggBmppggD8GyKoVh3cMl9IPZwEoT87YObMO_xb2JntxEZm8ObVeN6L2LXzcea3sBRXCDwZH66ZRn1K0guWK-u55IQ76Nj6RncXEnpwx14rekBAzFDQtGS29HemYdJjfuTup4P1qDhlGFpWhLGhZFsySnuBxk6MVZ80W5FtaozSX2o4lLfLIMZgRgfoE8dUzqkcAxoCwxMBMj6BCoizgLip1frZqaxQtQsR7ZGvxDHtRbgj-5SdR5Gnr6hwVwk7gHkyFDo2P4SN8')` }}></div>
                <div className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">pending_actions</span>
                  Verification Pending
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono text-on-surface-variant mb-1">STLR-BHO-9012-Y</p>
                <h4 className="font-title-md text-title-md text-primary mb-1 mt-0">Nandyal West #109</h4>
                <p className="text-label-sm text-on-surface-variant mb-4">Nandyal, Andhra Pradesh</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">Area</p>
                    <p className="font-bold text-primary">1.8 Hectares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant uppercase">Value</p>
                    <p className="font-bold text-primary">₹62.0 Lakhs</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Escrow Status</span>
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded">PENDING DEPOSIT</span>
                </div>
              </div>
            </div>

            {/* Asset 3 — Action Required */}
            <div className="min-w-[300px] flex-shrink-0 bg-surface-container-lowest border-2 border-error-container rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaE18StdS3HGJWVsGqP3e-gdvC7atgrogvKXnEDdvWHxdVrRVYUMSr7az04w4blaCJaZFP1YIQaqWyH9Lc7fZT_ocaYij8H67B3irkjkcoavWRt-N7Cwcunhwt7_0UVaSZ6jqHQ401DHk18SBxmlK8ufTpIO3gjC-zPDcwAT2Em8vnMYMX_mOAGEGI-GjaM1b2cWtTLe4FzsLYld_LubG2MYBIuCJ999lm_Iw97H0bknQj368yc9YXCdH7YRjo--HXMqA8-WdtaQQ')` }}></div>
                <div className="absolute top-3 right-3 bg-error-container text-on-error-container px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  Action Required
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono text-on-surface-variant mb-1">STLR-BHO-8891-Z</p>
                <h4 className="font-title-md text-title-md text-primary mb-1 mt-0">Anantapur Zone C</h4>
                <p className="text-label-sm text-on-surface-variant mb-4">Anantapur, Andhra Pradesh</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">Area</p>
                    <p className="font-bold text-primary">3.2 Hectares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant uppercase">Value</p>
                    <p className="font-bold text-primary">₹1.1 Crores</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Escrow Status</span>
                  <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded">NOT LOCKED</span>
                </div>
              </div>
            </div>

            {/* Add new CTA card */}
            <div className="min-w-[260px] flex-shrink-0 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 gap-4 hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer group" onClick={() => navigate('/farmer/documents')}>
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
              </div>
              <p className="font-bold text-primary text-center">Register New Land Asset</p>
              <p className="text-label-sm text-on-surface-variant text-center">Submit documents for on-chain attestation</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-10 flex flex-row gap-4 overflow-x-auto no-scrollbar">
            {[
              { icon: 'landscape', value: '14,200+', label: 'Parcels Registered' },
              { icon: 'verified_user', value: '98.4%', label: 'Attestation Accuracy' },
              { icon: 'payments', value: '₹840 Cr', label: 'Escrow Settled' },
              { icon: 'timer', value: '< 14 Days', label: 'Avg. Deal Closure' },
            ].map((stat) => (
              <div key={stat.label} className="min-w-[160px] flex-shrink-0 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center">
                <span className="material-symbols-outlined text-primary text-3xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                <p className="font-display-lg text-display-lg text-primary mb-0" style={{ fontSize: '1.5rem' }}>{stat.value}</p>
                <p className="text-label-sm text-on-surface-variant mt-1 mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Land Parcel Card Showcase */}
      <section className="py-24 px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative max-w-md mx-auto">
                {/* Land Parcel Card */}
                <div className="bg-surface-container-lowest border-2 border-tertiary-container rounded-2xl shadow-xl overflow-hidden text-left">
                  <div className="h-48 w-full bg-surface-variant relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaE18StdS3HGJWVsGqP3e-gdvC7atgrogvKXnEDdvWHxdVrRVYUMSr7az04w4blaCJaZFP1YIQaqWyH9Lc7fZT_ocaYij8H67B3irkjkcoavWRt-N7Cwcunhwt7_0UVaSZ6jqHQ401DHk18SBxmlK8ufTpIO3gjC-zPDcwAT2Em8vnMYMX_mOAGEGI-GjaM1b2cWtTLe4FzsLYld_LubG2MYBIuCJ999lm_Iw97H0bknQj368yc9YXCdH7YRjo--HXMqA8-WdtaQQ')`,
                      }}
                    ></div>
                    <div className="absolute top-4 left-4 bg-surface-container-lowest/90 px-3 py-1 rounded text-label-sm font-bold shadow font-mono">
                      PARCEL ID: BHO-7721
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-title-md font-bold text-primary">Western Arable Zone A</h4>
                        <p className="text-label-sm text-on-surface-variant">Deoria District, Uttar Pradesh</p>
                      </div>
                      <span className="bg-primary-fixed text-on-primary-fixed text-[10px] px-2 py-1 rounded font-bold uppercase">
                        Legally Attested
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-surface-container rounded-lg">
                        <div className="text-[10px] text-on-surface-variant uppercase">Size</div>
                        <div className="font-bold">2.4 Hectares</div>
                      </div>
                      <div className="p-3 bg-surface-container rounded-lg">
                        <div className="text-[10px] text-on-surface-variant uppercase">Value</div>
                        <div className="font-bold">₹82.5 Lakhs</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-label-sm">
                        <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>7/7 KYC/AML Checks Passed</span>
                      </div>
                      <div className="flex items-center gap-2 text-label-sm">
                        <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>Encumbrance Certificate Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-tertiary text-on-tertiary flex justify-between items-center">
                    <span className="text-label-sm font-bold">Atomic Escrow Status</span>
                    <span className="text-label-sm bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded">
                      LOCKED IN SOROBAN
                    </span>
                  </div>
                </div>
                {/* Floating Verification Badge Overlay */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-outline-variant flex items-center gap-3 text-left">
                  <div className="p-2 bg-secondary-container rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">gavel</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-bold">Verifier Staked</div>
                    <div className="text-[10px] opacity-60">5,000 XLM Collateral</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-left">
              <h2 className="text-display-lg font-display-lg text-primary mb-6 leading-tight">Every Deed is a Digital Asset.</h2>
              <p className="text-body-lg text-on-surface-variant mb-8">
                We don't just digitize records; we transform land ownership into a liquid, verifiable, and programmable financial asset.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">history</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Immutable History</h4>
                    <p className="text-body-md text-on-surface-variant">Full provenance of ownership spanning decades, cryptographically sealed against tampering.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Instant Programmability</h4>
                    <p className="text-body-md text-on-surface-variant">Instantly bundle parcels into investment vehicles or aggregation pools for infrastructure projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-margin-desktop bg-primary text-on-primary overflow-hidden relative">
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <h2 className="text-display-lg font-display-lg mb-8">Ready to settle the ground?</h2>
          <p className="text-body-lg mb-12 max-w-2xl mx-auto opacity-80">
            Whether you're a corporate aggregator, a rural landowner, or a legal verifier, BhoomiChain is the new foundation for Indian real estate.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={handleStartAggregation}
              className="bg-surface-container-lowest text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-fixed transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>Start Your First Deal</span>
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            <button
              onClick={handleLanguageClick}
              className="bg-primary-container text-on-primary-container border border-on-primary-container/30 px-10 py-5 rounded-xl font-bold text-lg hover:bg-on-primary-fixed-variant transition-all cursor-pointer"
            >
              Speak to an Advisor
            </button>
          </div>
          <div className="mt-16 flex justify-center items-center gap-12 grayscale brightness-200 opacity-40 flex-wrap">
            <span className="text-label-md font-black">STEELE STRUCTURES</span>
            <span className="text-label-md font-black">BHARAT RENEWABLES</span>
            <span className="text-label-md font-black">INFRA TRUST</span>
            <span className="text-label-md font-black">URBAN GRID</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-highest text-left">
        <div className="flex flex-col gap-2">
          <div className="text-label-md font-bold text-primary">BhoomiChain</div>
          <p className="text-label-sm text-on-surface-variant max-w-[200px] mb-0">
            © 2024 BhoomiChain. Secured by Stellar/Soroban.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">
            Legal Documentation
          </a>
          <a className="text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">
            Privacy Policy
          </a>
          <a className="text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">
            Smart Contract Audit
          </a>
          <button
            onClick={handleLanguageClick}
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Language Settings
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleLanguageClick}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">public</span>
          </button>
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
