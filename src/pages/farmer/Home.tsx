import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';
import { getParcels } from '../../utils/localRegistry';
import type { LandParcel } from '../../utils/localRegistry';

export function Home(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();
  const [parcels, setParcels] = React.useState<LandParcel[]>([]);

  React.useEffect(() => {
    setParcels(getParcels());
  }, []);

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  const handleExportPDF = (): void => {
    alert('Generating Ownership Proof PDF...');
  };

  const handleAddAsset = (): void => {
    navigate('/farmer/documents');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-24 text-left flex flex-col justify-between">
      <div>
        {/* Top Navigation Anchor */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-lowest border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all bg-transparent border-none cursor-pointer flex items-center justify-center"
              title="Go back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <Link to="/" className="text-primary font-black text-title-md font-title-md tracking-tight hover:opacity-90 transition-opacity">
              BhoomiChain
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && publicKey ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-fixed rounded-full text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance_wallet
                </span>
                <BlockchainString value={publicKey} truncate={true} copyable={false} />
              </div>
            ) : (
              <button
                onClick={() => void connect()}
                disabled={isConnecting}
                className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-md text-label-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                <span>{isConnecting ? '...' : 'Connect'}</span>
              </button>
            )}
            <button
              onClick={handleLanguageClick}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
              title="Language"
            >
              <span className="material-symbols-outlined">language</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center border border-outline-variant overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Rajesh profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC809CLGjE_nPKxS873qw8nwsgQu-neSIao3s8vQsQ7Keg7PpOZAGcm-ArQ6MHetKGLXR1TnmxNYt8DF9RyyxzE8bcNbfHlFyPHO1lp3G24OXDgn6hKWcb0UugGe6kDrdwcVBFRRi3bzJekk4u2CBz18g3Al-MBKtybXuUD895L6HQOF2U-5JB6X9rdWic9FIBQZwz0FJ7b2FJYBa2GjY9o8anoriEOZQ_ASQ8ITSsyn-zl0ks-dIIO6c5pmo0Pi6w2MCWMD1qfaIo"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex-grow">
          {/* Welcome Header */}
          <section className="mb-6 mt-4">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-1">
              {t('farmer.greeting', { name: 'Rajesh' })}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-0">
              {parcels.length} land asset{parcels.length !== 1 ? 's' : ''} registered · {parcels.filter(p => p.status === 'verified').length} verified
            </p>
          </section>

          {/* Summary Stats Row */}
          <section className="mb-6 grid grid-cols-3 gap-3">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
              <p className="text-display-lg font-display-lg text-primary mb-0">{parcels.length}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 mb-0">Total Parcels</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
              <p className="text-display-lg font-display-lg text-primary mb-0">{parcels.filter(p => p.status === 'verified').length}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 mb-0">Verified</p>
            </div>
            <div className="bg-primary-container rounded-xl p-4 text-center">
              <p className="text-display-lg font-display-lg text-on-primary-container mb-0">{parcels.filter(p => p.status === 'pending').length}</p>
              <p className="text-label-sm font-label-sm text-on-primary-container mt-1 mb-0 opacity-80">Pending</p>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="mb-8 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/farmer/documents')}
              className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer text-left"
            >
              <span className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
              </span>
              <div>
                <p className="text-label-md font-label-md text-on-surface font-semibold mb-0">Submit Docs</p>
                <p className="text-[11px] text-on-surface-variant mb-0">Upload deeds</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/farmer/payout')}
              className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer text-left"
            >
              <span className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">payments</span>
              </span>
              <div>
                <p className="text-label-md font-label-md text-on-surface font-semibold mb-0">Payout Portal</p>
                <p className="text-[11px] text-on-surface-variant mb-0">Track escrow</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/verifier/queue')}
              className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer text-left"
            >
              <span className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container text-[20px]">verified_user</span>
              </span>
              <div>
                <p className="text-label-md font-label-md text-on-surface font-semibold mb-0">Verifier Queue</p>
                <p className="text-[11px] text-on-surface-variant mb-0">Check status</p>
              </div>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer text-left"
            >
              <span className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">picture_as_pdf</span>
              </span>
              <div>
                <p className="text-label-md font-label-md text-on-surface font-semibold mb-0">Export PDF</p>
                <p className="text-[11px] text-on-surface-variant mb-0">Ownership proof</p>
              </div>
            </button>
          </section>

          {/* Horizontal Scrollable Cards */}
          <section className="mb-8">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible gap-gutter no-scrollbar pb-4 snap-x">
              {parcels.map((parcel) => (
                <div key={parcel.id} className="min-w-[85vw] md:min-w-[400px] snap-center bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="h-32 bg-surface-container relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${parcel.status === 'verified'
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7bb6FfP3ZdOQI-vyAGBNlI4IpbW-mmbaqxrVKDpWSNtERr1d8C54g37pFn61KFV10Ay5RIv2ustrH1ADvba1wkE4uQzVD4QQ6EkMlmHsYRcc97H8YydJwOXLSI9gDCQVeYUAVGvkmXxKmCoc5lyjWobOu-Vrk8vqWNQo2phjoJ_jhH1POTrP2vuuYf-dqsnC-67TRZ0rscP4-hwzCETlsoQvawP1xFf-aGst9VSe88zlO2OtmjR0mtpCozo8xYcL2e_1eqxbvzss'
                          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0ggBmppggD8GyKoVh3cMl9IPZwEoT87YObMO_xb2JntxEZm8ObVeN6L2LXzcea3sBRXCDwZH66ZRn1K0guWK-u55IQ76Nj6RncXEnpwx14rekBAzFDQtGS29HemYdJjfuTup4P1qDhlGFpWhLGhZFsySnuBxk6MVZ80W5FtaozSX2o4lLfLIMZgRgfoE8dUzqkcAxoCwxMBMj6BCoizgLip1frZqaxQtQsR7ZGvxDHtRbgj-5SdR5Gnr6hwVwk7gHkyFDo2P4SN8'
                        }')`,
                      }}
                    ></div>
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 z-10 text-label-sm font-label-sm ${
                      parcel.status === 'verified'
                        ? 'bg-primary-container text-on-primary-container'
                        : parcel.status === 'pending'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-error-container text-on-error-container'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {parcel.status === 'verified' ? 'verified' : parcel.status === 'pending' ? 'pending_actions' : 'warning'}
                      </span>
                      <span>
                        {parcel.status === 'verified'
                          ? 'Legally Attested'
                          : parcel.status === 'pending'
                            ? 'Verification Pending'
                            : 'Action Required'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-title-md text-title-md text-primary mb-1 mt-0">{parcel.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 font-mono">
                      ID: {parcel.id}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Total Area</p>
                        <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-0">{parcel.area}</p>
                      </div>
                      {parcel.status === 'verified' ? (
                        <button
                          onClick={() => navigate(`/registry/parcel/${parcel.id.replace('STLR-BHO-', '')}`)}
                          className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 cursor-pointer border-none hover:opacity-90"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          View Journey
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/farmer/documents?parcelId=${parcel.id}`)}
                          className="bg-outline text-on-surface px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 border-none cursor-pointer hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-[18px]">upload_file</span>
                          Fix/Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Secondary Action */}
          <section className="mb-8">
            <button
              onClick={handleExportPDF}
              className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-primary-fixed transition-colors bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              <span className="font-label-md text-label-md">Export Ownership Proof (PDF)</span>
            </button>
          </section>

          {/* Transaction History */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-title-md text-title-md text-primary mb-0">Transaction History</h2>
              <button
                onClick={() => navigate('/farmer/payout')}
                className="text-primary font-label-md text-label-md underline bg-transparent border-none cursor-pointer"
              >
                See All
              </button>
            </div>
            <div className="space-y-4">
              {/* Transaction Item 1 */}
              <div className="flex items-start gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold mb-0">Title Attested</h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Oct 12, 2024</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                    Block #8,892,101 • Kurnool #452
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Successful</span>
                  </div>
                </div>
              </div>

              {/* Transaction Item 2 */}
              <div className="flex items-start gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0 text-on-tertiary-container">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold mb-0">Escrow Funded</h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Oct 08, 2024</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                    Aggregation Hub-A2 • Soroban Contract
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Transaction Item 3 */}
              <div className="flex items-start gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-on-secondary-container">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold mb-0">Tax Record Updated</h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sep 28, 2024</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                    FY24 Property Tax • Andhra Pradesh
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Immutable</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      <div>
        <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest h-16 flex items-center justify-around px-4 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] md:hidden z-50">
          <Link to="/farmer/home" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              home
            </span>
            <span className="font-label-sm text-label-sm">Home</span>
          </Link>
          <Link to="/farmer/documents" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">map</span>
            <span className="font-label-sm text-label-sm">Assets</span>
          </Link>
          <Link to="/farmer/payout" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">payments</span>
            <span className="font-label-sm text-label-sm">Payout</span>
          </Link>
          <Link to="/settings/language" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-sm text-label-sm">Settings</span>
          </Link>
        </nav>

        {/* Floating Action Button - Only for Primary View */}
        <button
          onClick={handleAddAsset}
          className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-40 border-none cursor-pointer hover:opacity-95"
          title="Add Asset"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
