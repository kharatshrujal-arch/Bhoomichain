import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function Language(): React.JSX.Element {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApply = (): void => {
    setApplying(true);
    setSuccess(false);
    setTimeout(() => {
      setApplying(false);
      setSuccess(true);
      setTimeout(() => {
        void i18n.changeLanguage(selectedLang);
        localStorage.setItem('lng', selectedLang);
        setSuccess(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans max-w-md mx-auto border-x border-outline-variant pb-24 text-left">
      {/* Header bar */}
      <header className="h-16 px-4 border-b border-outline-variant bg-surface-lowest flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-surface-low rounded transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px] text-primary">
            arrow_back
          </span>
        </button>
        <h1 className="font-sans font-bold text-title text-on-surface">
          Language Settings
        </h1>
      </header>

      <div className="p-4 flex-grow flex flex-col gap-6">
        {/* Hero Card */}
        <div className="bg-surface-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">
              globe
            </span>
          </div>
          <div>
            <h2 className="font-sans font-bold text-body-lg text-on-surface">
              Regional Access
            </h2>
            <p className="font-sans text-label text-on-surface-variant">
              Translate land registries, valuation records, and escrow rules to your regional tongue.
            </p>
          </div>
        </div>

        {/* Radio List */}
        <div className="flex flex-col gap-3">
          {[
            { code: 'en', label: 'English', sub: 'Default' },
            { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'North India' },
            { code: 'te', label: 'తెలుగు (Telugu)', sub: 'Andhra & Telangana' },
            { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', sub: 'Karnataka' },
          ].map((lang) => (
            <label
              key={lang.code}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedLang === lang.code
                  ? 'bg-primary-fixed/20 border-primary-container'
                  : 'bg-surface-lowest border-outline-variant hover:bg-surface-low'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Real-time updating icon color */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    selectedLang === lang.code
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    translate
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-body">
                    {lang.label}
                  </span>
                  <span className="text-label-sm text-outline">
                    {lang.sub}
                  </span>
                </div>
              </div>
              <input
                type="radio"
                name="lang"
                value={lang.code}
                checked={selectedLang === lang.code}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-4 h-4 accent-primary-container"
              />
            </label>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-secondary-container/30 border border-secondary-container/50 rounded-xl p-5 text-on-secondary-container">
          <h3 className="font-sans font-bold text-body text-on-secondary-container mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              info
            </span>
            <span>Trust & Transparency</span>
          </h3>
          <p className="font-sans text-label leading-relaxed">
            All smart contracts compile in WebAssembly (WASM). Localizations are translated directly from the canonical on-chain records, ensuring no details are obscured.
          </p>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          disabled={applying || selectedLang === i18n.language}
          className="w-full bg-primary-container text-on-primary rounded font-sans font-semibold px-6 h-14 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50 mt-auto"
        >
          {applying ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">
                refresh
              </span>
              <span>Applying Changes...</span>
            </>
          ) : success ? (
            <>
              <span className="material-symbols-outlined text-[22px]">
                check_circle
              </span>
              <span>Successfully Applied!</span>
            </>
          ) : (
            <span>Apply Changes</span>
          )}
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-lowest border-t border-outline-variant h-16 px-4 flex items-center justify-around z-40">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center text-outline hover:text-primary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] font-label font-semibold">Home</span>
        </button>
        <button
          onClick={() => navigate('/farmer/home')}
          className="flex flex-col items-center justify-center text-outline hover:text-primary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">map</span>
          <span className="text-[10px] font-label font-semibold">Assets</span>
        </button>
        <button
          onClick={() => navigate('/settings/language')}
          className="flex flex-col items-center justify-center text-primary-container cursor-pointer"
        >
          <div className="bg-primary-container text-on-primary rounded-full px-4 py-0.5 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </div>
          <span className="text-[10px] font-label font-semibold mt-0.5">Settings</span>
        </button>
      </footer>
    </div>
  );
}
export default Language;
