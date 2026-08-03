import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StepPage from './pages/StepPage';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/step/:stepId" element={<StepPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;