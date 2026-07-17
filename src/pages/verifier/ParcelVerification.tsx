import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';

export function ParcelVerification(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { parcelId } = useParams<{ parcelId: string }>();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();

  const displayParcelId = parcelId ? `#UP-${parcelId}-AGR` : '#UP-7729-AGR';

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  const handleReupload = (): void => {
    alert('Select new high-resolution tax receipt to upload...');
  };

  const handleRefreshState = (): void => {
    alert('Fetching latest API status from UP Bhulekh portal...');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col text-left">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 left-0 w-full z-50 h-20 flex justify-between items-center px-margin-desktop max-w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all bg-transparent border-none cursor-pointer flex items-center justify-center"
            title="Go back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <Link to="/" className="font-display-lg text-display-lg font-bold text-primary hover:opacity-95 transition-opacity">
            BhoomiChain
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors" to="/corporate/deals">
              Corporates
            </Link>
            <Link className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors" to="/farmer/home">
              Farmers
            </Link>
            <Link className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors" to="/verifier/queue">
              Verifiers
            </Link>
          </nav>
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
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md font-bold scale-95 active:opacity-80 transition-all border-none cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : t('common.connect_wallet')}
            </button>
          )}
          <button
            onClick={handleLanguageClick}
            className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary bg-transparent border-none p-0 flex items-center justify-center"
            title="Language settings"
          >
            language
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface-container-low w-64 pt-24 z-40 hidden md:flex">
        <div className="px-6 mb-8">
          <h2 className="font-title-md text-title-md font-bold text-primary mb-1">BhoomiChain</h2>
          <p className="font-label-md text-label-md text-on-surface-variant mb-0">Institutional Registry</p>
        </div>
        <nav className="flex-1">
          <Link
            className="text-on-surface-variant hover:bg-surface-container-highest rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all font-label-md text-label-md"
            to="/corporate/deals"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            className="bg-primary-container text-on-primary-container rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 font-label-md text-label-md"
            to="/farmer/home"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              map
            </span>
            <span>Land Registry</span>
          </Link>
          <Link
            className="text-on-surface-variant hover:bg-surface-container-highest rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all font-label-md text-label-md"
            to="/farmer/payout"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Transactions</span>
          </Link>
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={() => navigate('/corporate/deals')}
            className="w-full bg-primary text-on-primary px-4 py-3 rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform border-none cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span>
            New Aggregation
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="pt-24 md:pl-64 min-h-screen flex-grow">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          {/* Header & Breadcrumbs */}
          <section className="mb-10 text-left">
            <nav className="flex items-center gap-2 mb-2">
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/farmer/home">
                Registry
              </Link>
              <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Uttar Pradesh</span>
              <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
              <span className="font-label-sm text-label-sm text-primary font-bold">{displayParcelId}</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="font-headline-lg text-headline-lg text-primary mt-0 mb-0">
                Parcel Verification: {displayParcelId}
              </h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-label-sm text-label-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  In Governance Review
                </span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter text-left">
            {/* Left: Verification Timeline (Bento Style) */}
            <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 h-fit sticky top-24">
              <h3 className="font-title-md text-title-md text-primary mb-8 mt-0">Verification Journey</h3>
              <div className="relative space-y-12">
                {/* Vertical Connector Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant"></div>
                {/* Step 1: Completed */}
                <div className="relative flex gap-6 group">
                  <div className="z-10 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center border-4 border-surface-container-lowest">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">Document Submission</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Completed Oct 12, 2024</span>
                    <span className="mt-2 text-[10px] uppercase tracking-wider font-bold text-on-primary-container bg-primary-fixed-dim px-2 py-0.5 rounded w-fit">
                      Validated
                    </span>
                  </div>
                </div>
                {/* Step 2: Completed */}
                <div className="relative flex gap-6 group">
                  <div className="z-10 w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center border-4 border-surface-container-lowest">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">Title Search &amp; History</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Chain of custody verified</span>
                    <span className="mt-2 text-[10px] uppercase tracking-wider font-bold text-on-primary-container bg-primary-fixed-dim px-2 py-0.5 rounded w-fit">
                      On-Chain Ledger Match
                    </span>
                  </div>
                </div>
                {/* Step 3: In Progress */}
                <div className="relative flex gap-6 group">
                  <div className="z-10 w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary flex items-center justify-center border-4 border-surface-container-lowest ring-2 ring-tertiary-fixed-dim animate-pulse">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-tertiary-fixed-variant font-bold">
                      Survey &amp; GIS Mapping
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Satellite overlap check...</span>
                    <div className="mt-3 w-32 h-1.5 bg-outline-variant rounded-full overflow-hidden relative">
                      <div className="absolute left-0 top-0 h-full w-2/3 progress-line-active rounded-full"></div>
                    </div>
                  </div>
                </div>
                {/* Step 4: Pending */}
                <div className="relative flex gap-6 group opacity-50">
                  <div className="z-10 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border-4 border-surface-container-lowest">
                    <span className="material-symbols-outlined text-outline text-sm">gavel</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Legal Review</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Pending GIS completion</span>
                  </div>
                </div>
                {/* Step 5: Pending */}
                <div className="relative flex gap-6 group opacity-50">
                  <div className="z-10 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border-4 border-surface-container-lowest">
                    <span className="material-symbols-outlined text-outline text-sm">verified</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Final Approval</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Smart contract issuance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Document List & Detail View */}
            <div className="lg:col-span-8 flex flex-col gap-gutter">
              {/* Parcel Map Insight */}
              <div className="w-full h-48 rounded-xl overflow-hidden relative border border-outline-variant shadow-sm bg-surface-container">
                <div
                  className="bg-cover bg-center w-full h-full"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_0Hd8RbeSvFNUcfXzdDC6v8LZu5r0kQE4lbcHERH2gdOcgdqKurs7oNQa7mSUtoGa85igmSrDdjCoP_nVJB1dlde2GIwdD4Pf-u-ljjtwFjCVx16RNvmFSE9mFXlNIBWfh4TWVoycBu3RMy-GWrXkGKVTd01IA_EglufF-TSvfFx4oj-lS3fEc-__QLFV7CxmPdadBq-HjV1KXNHPKeGrtfwTtdhGbSQGEgEVuz62kVR5_bs8sltZ6a4QLZzKOsQ1cWc9fdLMSEM')`,
                  }}
                ></div>
                <div className="absolute top-4 left-4 bg-surface/95 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">satellite_alt</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">Live GIS View</span>
                </div>
              </div>

              {/* Document Table */}
              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                  <h3 className="font-title-md text-title-md text-primary mt-0 mb-0">Verification Documents</h3>
                  <button className="text-primary hover:bg-primary-fixed p-2 rounded-full transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low">
                        <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                          Document Name
                        </th>
                        <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                          Ref ID
                        </th>
                        <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant text-center">
                          Status
                        </th>
                        <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {/* Row 1: Verified */}
                      <tr className="hover:bg-surface-container transition-colors group">
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Ancestral Deed (1975)
                              </span>
                              <span className="text-[11px] text-on-surface-variant uppercase">
                                Original Parchment Scanned
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant font-mono">
                          DOC-29384-AD
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                            VERIFIED
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                            visibility
                          </button>
                        </td>
                      </tr>

                      {/* Row 2: Requires Action */}
                      <tr className="hover:bg-surface-container transition-colors group bg-error-container/10">
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-error">receipt_long</span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Recent Tax Receipt
                              </span>
                              <span className="text-[11px] text-error font-medium">Resolution needed: Signature blur</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant font-mono">
                          TAX-2023-902
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              error
                            </span>
                            ACTION REQUIRED
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <button
                            onClick={handleReupload}
                            className="bg-primary text-on-primary font-label-sm text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-widest font-bold border-none cursor-pointer hover:opacity-95"
                          >
                            Re-Upload
                          </button>
                        </td>
                      </tr>

                      {/* Row 3: Pending */}
                      <tr className="hover:bg-surface-container transition-colors group">
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-on-surface-variant">folder_open</span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Khasra/Khatauni Extract
                              </span>
                              <span className="text-[11px] text-on-surface-variant">Extracting from State API</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant font-mono">
                          API-UP-KH029
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[14px] animate-spin">schedule</span>
                            PENDING
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <button
                            onClick={handleRefreshState}
                            className="material-symbols-outlined text-outline hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                          >
                            refresh
                          </button>
                        </td>
                      </tr>

                      {/* Row 4: Verified */}
                      <tr className="hover:bg-surface-container transition-colors group">
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">assignment_ind</span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Owner Identity (Aadhar/PAN)
                              </span>
                              <span className="text-[11px] text-on-surface-variant uppercase">Biometric Verified</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant font-mono">
                          KYC-992-817
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                            VERIFIED
                          </div>
                        </td>
                        <td className="px-6 py-5 border-b border-outline-variant">
                          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                            verified
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Escrow Insight Card */}
              <div className="bg-primary-container text-on-primary-container rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined">lock_clock</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-white mb-1 mt-0">Smart Contract Escrow Status</h4>
                    <p className="font-label-sm text-label-sm opacity-80 mb-0">Pending Survey completion to release Stage 1 verification.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-label-sm text-label-sm opacity-70">Locked Value</span>
                    <span className="block font-title-md text-title-md font-bold text-white">0.45 ETH</span>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-tertiary-fixed-dim">shield</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-desktop bg-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant mt-auto md:pl-64 text-left">
        <div className="flex flex-col gap-2">
          <span className="font-title-md text-title-md font-black text-primary">BhoomiChain</span>
          <p className="font-label-sm text-label-sm text-on-secondary-container mb-0">
            © 2024 BhoomiChain. Secured by Smart Contracts.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors hover:underline underline-offset-4" href="#">
            Legal Terms
          </a>
          <a className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors hover:underline underline-offset-4" href="#">
            Smart Contract Audit
          </a>
          <a className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors hover:underline underline-offset-4" href="#">
            Privacy Policy
          </a>
          <button
            onClick={handleLanguageClick}
            className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors hover:underline underline-offset-4 bg-transparent border-none cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ParcelVerification;
