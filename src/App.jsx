import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import AdvocateModal from './components/AdvocateModal';
import HomePage from './pages/HomePage';
import AdvocatesPage from './pages/AdvocatesPage';
import ServicesPage from './pages/ServicesPage';
import LegalHubPage from './pages/LegalHubPage';
import TrackCasePage from './pages/TrackCasePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [bookingModal, setBookingModal] = useState({ open: false, prefill: {} });
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);

  const openBooking = (prefill = {}) => {
    setBookingModal({ open: true, prefill });
  };

  const closeBooking = () => {
    setBookingModal({ open: false, prefill: {} });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onOpenBooking={openBooking} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onOpenBooking={openBooking}
                  onSelectAdvocate={setSelectedAdvocate}
                />
              }
            />
            <Route
              path="/advocates"
              element={
                <AdvocatesPage
                  onOpenBooking={openBooking}
                  onSelectAdvocate={setSelectedAdvocate}
                />
              }
            />
            <Route
              path="/services"
              element={<ServicesPage onOpenBooking={openBooking} />}
            />
            <Route
              path="/legal-hub"
              element={<LegalHubPage onOpenBooking={openBooking} />}
            />
            <Route path="/track-case" element={<TrackCasePage />} />
          </Routes>
        </main>
        <Footer onOpenBooking={openBooking} />

        <ConsultationModal
          isOpen={bookingModal.open}
          onClose={closeBooking}
          prefill={bookingModal.prefill}
        />

        <AdvocateModal
          advocate={selectedAdvocate}
          onClose={() => setSelectedAdvocate(null)}
          onBook={(adv) => openBooking({ advocate: adv })}
        />
      </div>
    </BrowserRouter>
  );
}
