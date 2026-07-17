import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/corporate/Dashboard';
import Home from './pages/farmer/Home';
import DocumentSubmission from './pages/farmer/DocumentSubmission';
import PayoutPortal from './pages/farmer/PayoutPortal';
import Workspace from './pages/verifier/Workspace';
import ParcelVerification from './pages/verifier/ParcelVerification';
import Language from './pages/settings/Language';

export function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Corporate Routes */}
        <Route path="/corporate/deals" element={<Dashboard />} />
        <Route path="/corporate/deals/:dealId" element={<Dashboard />} />
        
        {/* Farmer Routes */}
        <Route path="/farmer/home" element={<Home />} />
        <Route path="/farmer/documents" element={<DocumentSubmission />} />
        <Route path="/farmer/payout" element={<PayoutPortal />} />
        
        {/* Verifier & Registry Routes */}
        <Route path="/verifier/queue" element={<Workspace />} />
        <Route path="/registry/parcel/:parcelId" element={<ParcelVerification />} />
        
        {/* Settings Routes */}
        <Route path="/settings/language" element={<Language />} />
      </Routes>
    </Router>
  );
}

export default App;
