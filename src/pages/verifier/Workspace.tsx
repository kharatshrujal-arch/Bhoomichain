import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';
import { getParcels, updateParcelStatus } from '../../utils/localRegistry';
import type { LandParcel } from '../../utils/localRegistry';

type TabType = 'scan' | 'gis' | 'chain';

export function Workspace(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('scan');

  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);

  React.useEffect(() => {
    const list = getParcels();
    setParcels(list);
    const initial = list.find(p => p.status === 'pending' || p.status === 'action_required') || list[0] || null;
    setSelectedParcel(initial);
  }, []);

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  const handleAttest = (): void => {
    if (!selectedParcel) {
      alert('Please select a parcel to attest.');
      return;
    }
    const mockHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    updateParcelStatus(selectedParcel.id, 'verified', mockHash);
    alert('Attestation transaction sent to Soroban contract for signature! Transaction Hash: ' + mockHash);
    
    // Refresh list
    const list = getParcels();
    setParcels(list);
    // Find next pending or keep current
    const next = list.find(p => p.status === 'pending' || p.status === 'action_required') || list.find(p => p.id === selectedParcel.id) || null;
    setSelectedParcel(next);
  };

  const handleDispute = (): void => {
    if (!selectedParcel) return;
    updateParcelStatus(selectedParcel.id, 'action_required');
    alert('Dispute reported! Case filed to Dispute DAO on-chain...');
    
    // Refresh list
    const list = getParcels();
    setParcels(list);
    const updatedSelected = list.find(p => p.id === selectedParcel.id) || null;
    setSelectedParcel(updatedSelected);
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col text-left">
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
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" to="/corporate/deals">
              Corporates
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" to="/farmer/home">
              Farmers
            </Link>
            <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" to="/verifier/queue">
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
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity border-none cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <span>{isConnecting ? 'Connecting...' : t('common.connect_wallet')}</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-on-surface-variant">
            <button
              onClick={handleLanguageClick}
              className="material-symbols-outlined cursor-pointer hover:text-primary bg-transparent border-none p-0 flex items-center justify-center"
              title="Language settings"
            >
              language
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="Verifier Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtcVSDZf3uqMnQguu-eVF1Z0AeR5BJwoRnZipkEld9afYYlmb9o00LdVCfMDFFErkYQ6h4VobeTicJFDAz4OpO_jp7wWWSlqXeozi_XcKlLshYkum6oI8We8eTN8jxMt0jWcB7R4-zN117n_NkZsoHLvaOlDvvIdwGObg567YlhKATFdhJ5qTpleXKokCNiQQhnaVh9E1QOSw0MQxlGb5UntLqqWGjpxjoU4zvGiJWvlq4tyUU_ogDU88pjS1dkQO01CPG1nWkcls"
              />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-8 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <div className="font-title-md text-label-md font-black text-primary">BhoomiChain</div>
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Institutional Registry
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all duration-200"
            to="/corporate/deals"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 bg-primary-container text-on-primary-container font-bold rounded-full transition-all duration-200"
            to="/verifier/queue"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              layers
            </span>
            <span className="font-label-md text-label-md font-semibold">Verification Queue</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all duration-200"
            to="/farmer/home"
          >
            <span className="material-symbols-outlined">map</span>
            <span className="font-label-md text-label-md">Land Registry</span>
          </Link>
          <Link
            className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all duration-200"
            to="/farmer/payout"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-md text-label-md">Transactions</span>
          </Link>
        </nav>
        <div className="mt-auto px-4">
          <button className="w-full py-3 bg-tertiary text-on-tertiary rounded-xl font-label-md text-label-md mb-6 hover:shadow-lg transition-all border-none cursor-pointer">
            {t('verifier.gov_button')}
          </button>
          <div className="flex flex-col gap-1">
            <Link
              className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
              to="/settings/language"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Settings</span>
            </Link>
            <a
              className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 px-margin-desktop pb-12 flex-grow">
        <div className="max-w-container-max mx-auto">
          {/* Dashboard Header & Stats */}
          <section className="mb-10 mt-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-0 mb-1">
                  {t('verifier.workspace_title')}
                </h2>
                <p className="text-on-surface-variant font-body-md mb-0">
                  Official attestation portal for verified legal practitioners.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 min-w-[200px] flex-1 lg:flex-none">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">
                      {t('verifier.total_staked')}
                    </div>
                    <div className="font-title-md text-title-md font-bold">50,000 XLM</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 min-w-[200px] flex-1 lg:flex-none">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">
                      {t('verifier.titles_cleared')}
                    </div>
                    <div className="font-title-md text-title-md font-bold">124</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 min-w-[200px] flex-1 lg:flex-none">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                    <span className="material-symbols-outlined">stars</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">
                      {t('verifier.reputation')}
                    </div>
                    <div className="font-title-md text-title-md font-bold">98.4%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Layout Workspace */}
            <div className="grid grid-cols-12 gap-gutter">
              {/* Work Queue */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col h-[680px]">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
                  <h3 className="font-title-md text-title-md text-primary mt-0 mb-0">
                    {t('verifier.pending_queue')}
                  </h3>
                  <span className="bg-primary-container text-on-primary px-2 py-1 rounded-md text-[12px] font-bold">
                    8 New
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {parcels.map((parcel) => (
                    <div
                      key={parcel.id}
                      onClick={() => setSelectedParcel(parcel)}
                      className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col gap-3 ${
                        selectedParcel?.id === parcel.id
                          ? 'bg-surface-container-low border-2 border-tertiary'
                          : 'hover:bg-surface-container hover:border-outline border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`text-label-sm font-bold mb-1 ${selectedParcel?.id === parcel.id ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                            #{parcel.id.replace('STLR-BHO-', '')}
                          </div>
                          <div className="font-title-md text-label-md text-on-surface font-semibold">
                            {parcel.name}
                          </div>
                        </div>
                        <span className={`material-symbols-outlined ${selectedParcel?.id === parcel.id ? 'text-tertiary' : 'text-outline'}`}>
                          {selectedParcel?.id === parcel.id ? 'arrow_forward_ios' : 'more_vert'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant uppercase">
                          {parcel.location.split(',')[0]}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          parcel.status === 'verified'
                            ? 'bg-primary-container text-on-primary-container'
                            : parcel.status === 'pending'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-error-container text-on-error-container'
                        }`}>
                          {parcel.status === 'verified' ? 'Attested' : parcel.status === 'pending' ? 'Pending' : 'Disputed'}
                        </span>
                      </div>
                      <div className="text-[12px] text-on-surface-variant">Submitted: {parcel.submittedAt} by {parcel.holder}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Canvas */}
              <div className="col-span-12 lg:col-span-8 space-y-gutter">
                {/* Alert Banner */}
                <div className="bg-error-container border border-error/20 p-4 rounded-xl flex items-start gap-4">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                  <p className="text-on-error-container font-label-md text-label-md mb-0">
                    <strong>{t('verifier.warning')}</strong> Your stake will be slashed by 10,000 XLM if this title is found fraudulent by the DAO consensus mechanism.
                  </p>
                </div>

                {/* Main Editor */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[568px]">
                  <div className="flex border-b border-outline-variant">
                    <button
                      onClick={() => setActiveTab('scan')}
                      className={`flex-1 py-4 text-center text-label-md font-bold cursor-pointer border-none ${
                        activeTab === 'scan' ? 'text-primary border-b-4 border-primary' : 'text-on-surface-variant bg-transparent hover:bg-surface-container-low'
                      }`}
                    >
                      Physical Title (Scan)
                    </button>
                    <button
                      onClick={() => setActiveTab('gis')}
                      className={`flex-1 py-4 text-center text-label-md font-bold cursor-pointer border-none ${
                        activeTab === 'gis' ? 'text-primary border-b-4 border-primary' : 'text-on-surface-variant bg-transparent hover:bg-surface-container-low'
                      }`}
                    >
                      GIS &amp; Survey Data
                    </button>
                    <button
                      onClick={() => setActiveTab('chain')}
                      className={`flex-1 py-4 text-center text-label-md font-bold cursor-pointer border-none ${
                        activeTab === 'chain' ? 'text-primary border-b-4 border-primary' : 'text-on-surface-variant bg-transparent hover:bg-surface-container-low'
                      }`}
                    >
                      Ownership Chain
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden h-full">
                    {/* Document Viewer */}
                    <div className="border-r border-outline-variant bg-surface-dim/20 p-6 flex flex-col gap-4 overflow-hidden h-full">
                      <div className="flex justify-between items-center">
                        <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                          Document Preview
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 bg-surface-container-lowest border border-outline-variant rounded hover:bg-surface-variant transition-colors flex items-center justify-center cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                          </button>
                          <button className="p-2 bg-surface-container-lowest border border-outline-variant rounded hover:bg-surface-variant transition-colors flex items-center justify-center cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 rounded-lg border border-outline-variant bg-white relative overflow-hidden group">
                        <img
                          className="w-full h-full object-cover"
                          alt="Physical Deed Scan"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6DTp80EC7pnBWUKUjFCvfZY4JmHBhlVm8u4WV9K9NKq8hDuPyeXcRLTlrvKs9BxaSkhSMrwuT3rMm9Qnxvm0bLYz7s_OfGHt6zGJCzYSlEPDFrOwayujpa3O3xCWkjDgrZx5jL56bjuhrpK6c9lAab3smmmUZvdHxv4d8AAsAvVDyEkst1HT7_Fy-wmzF50e3aCzSL-gCDBn2RAS0KN7lWXf5hv9MJJpPoDofUCw2Hfqma9lYUmhQgoxKHJyy_nPR9oDc98tx4uM"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
                      </div>
                    </div>

                    {/* Verification Form */}
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar h-full">
                      <div>
                        <h4 className="font-title-md text-title-md text-primary mb-2 mt-0">Attestation Review</h4>
                        <p className="text-on-surface-variant text-body-md mb-0">
                          Verify the following details against the uploaded deed scan.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                          <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">
                            Title Holder
                          </label>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{selectedParcel?.holder || 'Rahul Satyendra Yadav'}</span>
                            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                          <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">
                            Survey Number / Khasra
                          </label>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{selectedParcel?.surveyNumber || '7729/B-4'}</span>
                            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                          <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">
                            Land Area
                          </label>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{selectedParcel?.area || '12.45 Acres'}</span>
                            <span className="text-error font-bold text-label-sm underline cursor-pointer">
                              Verify Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto pt-6 flex gap-4">
                        <button
                          onClick={handleAttest}
                          className="flex-1 py-4 bg-primary text-on-primary border-none rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined">verified_user</span>
                          Attest to Title
                        </button>
                        <button
                          onClick={handleDispute}
                          className="flex-1 py-4 bg-surface-container-highest text-on-surface border border-outline-variant rounded-xl font-bold hover:bg-error/10 hover:text-error hover:border-error transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined">report_problem</span>
                          Report Dispute
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Section: Activity & Global Ledger */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-8">
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant hatched-bg text-left">
              <h4 className="font-title-md text-title-md text-primary mb-4 flex items-center gap-2 mt-0">
                <span className="material-symbols-outlined">timeline</span>
                {t('verifier.stake_health')}
              </h4>
              <div className="h-4 bg-surface-container-high rounded-full overflow-hidden mb-4">
                <div className="h-full bg-primary" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-label-sm font-label-sm">
                <span className="text-on-surface-variant">Current Confidence</span>
                <span className="font-bold text-primary">85% Solid</span>
              </div>
              <p className="mt-4 text-label-sm text-on-surface-variant leading-relaxed mb-0">
                Staked 50k XLM is generating 4.2% APY in the Bhoomi Insurance Pool.
              </p>
            </div>
            <div className="col-span-1 md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden text-left">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-bold text-label-sm text-on-surface-variant uppercase">Recent History</th>
                    <th className="px-6 py-4 font-bold text-label-sm text-on-surface-variant uppercase">Status</th>
                    <th className="px-6 py-4 font-bold text-label-sm text-on-surface-variant uppercase">Fee Earned</th>
                    <th className="px-6 py-4 font-bold text-label-sm text-on-surface-variant uppercase">Stellar Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">#UP-6612-HRY</div>
                      <div className="text-[12px] text-on-surface-variant">Haryana Cluster A</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-[12px] font-bold">
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">120 XLM</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-on-surface-variant">
                      <BlockchainString value="0x7a2b9f32" truncate={false} copyable={false} />
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">#UP-0021-RAJ</div>
                      <div className="text-[12px] text-on-surface-variant">Jaipur Bypass Site</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[12px] font-bold">
                        Disputed
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">0 XLM</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-on-surface-variant">
                      <BlockchainString value="0xb41a9eef" truncate={false} copyable={false} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-desktop bg-surface-container-highest border-t border-outline-variant mt-auto text-left lg:pl-64">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-gutter w-full">
          <div className="flex flex-col gap-2">
            <div className="text-label-md font-label-md font-bold text-primary">BhoomiChain</div>
            <div className="text-body-md font-body-md text-on-surface-variant">
              © 2024 BhoomiChain. Secured by Stellar/Soroban.
            </div>
          </div>
          <div className="flex gap-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">
              Legal Documentation
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">
              Privacy Policy
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">
              Smart Contract Audit
            </a>
            <button
              onClick={handleLanguageClick}
              className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm bg-transparent border-none cursor-pointer"
            >
              Language Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Workspace;
