import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { BlockchainString } from '../../components/BlockchainString';
import { addParcel } from '../../utils/localRegistry';

export function DocumentSubmission(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { publicKey, isConnected, isConnecting, connect } = useWallet();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [area, setArea] = React.useState('');
  const [value, setValue] = React.useState('');
  const [surveyNumber, setSurveyNumber] = React.useState('');

  const handleLanguageClick = (): void => {
    navigate('/settings/language');
  };

  const handleScanDocument = (): void => {
    // Autofill with some nice mock data and open the form
    setName('Agra Foothills Parcel B');
    setLocation('Agra, Uttar Pradesh');
    setArea('3.5 Hectares');
    setValue('₹95.0 Lakhs');
    setSurveyNumber('7729/B-4');
    setIsModalOpen(true);
  };

  const handleUploadCertificate = (): void => {
    // Clear and open the form
    setName('');
    setLocation('');
    setArea('');
    setValue('');
    setSurveyNumber('');
    setIsModalOpen(true);
  };

  const handleFixIssues = (): void => {
    // Autofill with the action required data
    setName('Survey Map Update (GIS)');
    setLocation('Kurnool, Andhra Pradesh');
    setArea('2.4 Hectares');
    setValue('₹82.5 Lakhs');
    setSurveyNumber('7729/B-4');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name || !location || !area || !value || !surveyNumber) {
      alert('Please fill out all fields');
      return;
    }
    // Add parcel to registry
    addParcel({
      name,
      location,
      area,
      value,
      status: 'pending',
      holder: 'Rajesh Kumar',
      surveyNumber,
      escrowStatus: 'PENDING ESCROW DEPOSIT',
    });
    setIsModalOpen(false);
    navigate('/farmer/home');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col text-left">
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
          <img
            alt="BhoomiChain Logo"
            className="h-10 w-10 object-contain"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsbobE9cInurrLkkntmhL7_fQ4orN6P_Q2uwSmQnVPI1ZVWy0m6DZ3Div2cvCvD-3CrqGSakgMbLIV9f6AHVFTHYERHbBOdcORQ2Jl9wtdPQ7m6yl_PKMi5CvrXE_ZRzE357BiiJ90h7uS9wTQU7ski8mhAJ1JOUzdGRNAZ1Lz9rl9ICH-V8hFKCjDOLiKLOHYpjKoUW518CKSdVjfP-DOB4a28mOaTGEbgY2wkw6sxyiTr4fzHbDHzVuc"
          />
          <Link to="/" className="text-title-md font-title-md font-black text-primary hover:opacity-95 transition-opacity">
            BhoomiChain
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md" to="/corporate/deals">
            Corporates
          </Link>
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 text-label-md font-label-md" to="/farmer/home">
            Farmers
          </Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md" to="/verifier/queue">
            Verifiers
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLanguageClick}
            className="hidden lg:flex items-center mr-4 text-on-surface-variant hover:text-primary gap-2 bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              language
            </span>
            <span className="text-label-md font-label-md font-semibold">Language</span>
          </button>
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
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer border-none disabled:opacity-50"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span>{isConnecting ? 'Connecting...' : t('common.connect_wallet')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex-grow">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Legal Document Submission</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mb-0">
              Upload or scan your property deeds and identity documents for on-chain attestation. Your assets are secured by Stellar/Soroban smart contracts.
            </p>
          </div>
          <button
            onClick={handleScanDocument}
            className="bg-primary-container text-on-primary px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-sm border-none cursor-pointer hover:opacity-90"
          >
            <span className="material-symbols-outlined text-2xl">document_scanner</span>
            <span className="font-bold text-title-md font-title-md">Scan Document</span>
          </button>
        </div>

        {/* Progress Bar Component */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl mb-10 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="text-label-md font-label-md text-primary font-bold">2 of 4 Documents Verified</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">50% Completed</span>
          </div>
          <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-primary transition-all duration-1000 ease-in-out"></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface-container-low">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <span className="text-label-sm font-label-sm text-primary font-semibold">Identity</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface-container-low">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <span className="text-label-sm font-label-sm text-primary font-semibold">Property Deed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-outline flex items-center justify-center border-4 border-surface-container-low animate-pulse">
                <span className="material-symbols-outlined text-lg">hourglass_empty</span>
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">Encumbrance</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-outline flex items-center justify-center border-4 border-surface-container-low">
                <span className="material-symbols-outlined text-lg">map</span>
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">GIS Survey</span>
            </div>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter text-left">
          {/* Card 1: Verified */}
          <div className="group bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl hover:border-primary transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary-fixed rounded-xl text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  Verified
                </span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-1 mt-0">Property Deed (Sale Agreement)</h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">
                Uploaded on Oct 14, 2023. Smart contract hash:{' '}
                <BlockchainString value="0x7e8b9f1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r" truncate={true} copyable={true} />
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex-grow border border-outline py-2.5 rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors cursor-pointer bg-transparent">
                View Document
              </button>
              <button className="p-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors cursor-pointer bg-transparent flex items-center justify-center">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="group bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl hover:border-primary transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary-container rounded-xl text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">badge</span>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">history</span>
                  Pending Review
                </span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-1 mt-0">Identity Proof (Aadhaar/PAN)</h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">
                Verification in progress by Government Authority (RRO).
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex-grow border border-primary text-primary py-2.5 rounded-lg text-label-md font-label-md hover:bg-primary-fixed transition-colors cursor-pointer bg-transparent">
                Re-upload
              </button>
              <button className="p-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors cursor-pointer bg-transparent flex items-center justify-center">
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
          </div>

          {/* Card 3: Not Started */}
          <div className="group bg-surface-container-lowest border border-dashed border-outline-variant p-6 rounded-2xl hover:border-primary transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-surface-container-highest rounded-xl text-outline flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">assignment</span>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-gray-100 text-gray-800 border border-gray-200">
                  Not Started
                </span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-1 mt-0">Encumbrance Certificate</h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">
                Required to prove the property is free from any legal or financial liability.
              </p>
            </div>
            <button
              onClick={handleUploadCertificate}
              className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity border-none cursor-pointer"
            >
              <span className="material-symbols-outlined">upload</span>
              Upload Certificate
            </button>
          </div>

          {/* Card 4: Action Required */}
          <div className="group bg-surface-container-lowest border-2 border-error-container p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-error-container rounded-xl text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Action Required
                </span>
              </div>
              <h3 className="text-title-md font-title-md text-primary mb-1 mt-0">Survey Map (GIS)</h3>
              <p className="text-body-md font-body-md text-error mb-6">
                Resolution too low. GPS coordinates must be visible in the survey plot.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleFixIssues}
                className="flex-grow bg-error text-on-error py-2.5 rounded-lg text-label-md font-label-md hover:bg-on-error-container transition-colors cursor-pointer border-none"
              >
                Fix Issues
              </button>
              <button className="p-2.5 border border-error-container rounded-lg text-error hover:bg-error-container transition-colors cursor-pointer bg-transparent flex items-center justify-center">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Integration Section */}
        <section className="mt-20 border-t border-outline-variant pt-16">
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-center text-primary mb-12">
            Supported Stellar Wallets
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter text-center">
            <div className="p-8 rounded-2xl hover:bg-surface-container-low transition-all duration-300 flex flex-col items-center group cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 transition-transform group-hover:scale-110">
                sailing
              </span>
              <span className="text-title-md font-title-md font-semibold">Freighter</span>
            </div>
            <div className="p-8 rounded-2xl hover:bg-surface-container-low transition-all duration-300 flex flex-col items-center group cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 transition-transform group-hover:scale-110">
                all_inclusive
              </span>
              <span className="text-title-md font-title-md font-semibold">Albedo</span>
            </div>
            <div className="p-8 rounded-2xl hover:bg-surface-container-low transition-all duration-300 flex flex-col items-center group cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 transition-transform group-hover:scale-110">
                construction
              </span>
              <span className="text-title-md font-title-md font-semibold">Lobstr</span>
            </div>
            <div className="p-8 rounded-2xl hover:bg-surface-container-low transition-all duration-300 flex flex-col items-center group cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 transition-transform group-hover:scale-110">
                token
              </span>
              <span className="text-title-md font-title-md font-semibold">xBull</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-highest border-t border-outline-variant mt-auto text-left">
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-label-md font-bold text-primary">BhoomiChain</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant mb-0">
            © 2024 BhoomiChain. Secured by Stellar/Soroban.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 text-label-sm font-label-sm" href="#">
            Legal Documentation
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 text-label-sm font-label-sm" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 text-label-sm font-label-sm" href="#">
            Smart Contract Audit
          </a>
          <button
            onClick={handleLanguageClick}
            className="text-on-surface-variant hover:text-primary transition-opacity duration-200 text-label-sm font-label-sm underline bg-transparent border-none cursor-pointer"
          >
            Language Settings
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant p-6 text-left">
            <h2 className="text-title-md font-headline-lg text-primary mb-4 mt-0">Submit New Land Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Land Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurnool East #02"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurnool, Andhra Pradesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Total Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2.4 Hectares"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Estimated Value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹82.5 Lakhs"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Khasra / Survey Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7729/B-4"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-3 border border-outline rounded-xl text-label-md font-label-md bg-transparent text-on-surface hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity border-none cursor-pointer"
                >
                  Submit to Attestation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentSubmission;
