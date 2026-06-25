import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StepPage from './pages/StepPage';
import PrivacyPage from './pages/PrivacyPage';
import EmailPrivacyPage from './pages/EmailPrivacyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/step/:stepId" element={<StepPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/emailPrivacy" element={<EmailPrivacyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;