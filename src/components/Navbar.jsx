import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Scale, PhoneCall, Globe, Menu, X, CalendarCheck, Lock } from 'lucide-react';
import './Navbar.css';

const LANGUAGES = ['English', 'हिन्दी', 'ગુજરાતી', 'मराठी', 'தமிழ்'];

export default function Navbar({ onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="utility-left">
            <span className="utility-item">
              <PhoneCall size={13} />
              <span>
                <span className="utility-desk-label">24×7 Chambers Desk: </span>
                <strong>+91 11 4089 2210</strong>
              </span>
            </span>
            <span className="utility-divider">|</span>
            <span className="utility-item utility-cities">
              New Delhi • Mumbai • Bengaluru • Ahmedabad • Chennai
            </span>
          </div>

          <div className="utility-right">
            <label className="lang-picker" aria-label="Preferred consultation language">
              <Globe size={13} />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="lang-select"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </label>
            <Link to="/track-case" className="utility-link" onClick={closeMenu}>
              <Lock size={12} />
              <span>Client Portal</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="main-nav" aria-label="Primary Navigation">
        <div className="container nav-inner">
          <Link to="/" className="brand-lockup" onClick={closeMenu}>
            <div className="brand-mark">
              <Scale size={20} />
            </div>
            <div className="brand-text">
              <div className="brand-name">DK ASSOCIATED</div>
              <div className="brand-sub">ADVOCATES & SOLICITORS</div>
            </div>
          </Link>

          <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/advocates" onClick={closeMenu}>
              Advocates
            </NavLink>
            <NavLink to="/services" onClick={closeMenu}>
              Practice & Fees
            </NavLink>
            <NavLink to="/legal-hub" onClick={closeMenu}>
              Q&A & Law Library
            </NavLink>
            <NavLink to="/track-case" onClick={closeMenu}>
              Track Case
            </NavLink>

            <div className="nav-mobile-actions">
              <button
                type="button"
                className="btn btn-brass nav-cta-mobile"
                onClick={() => {
                  closeMenu();
                  onOpenBooking();
                }}
              >
                <CalendarCheck size={16} />
                Book Consultation
              </button>
            </div>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-brass btn-sm nav-cta-desktop"
              onClick={() => onOpenBooking()}
            >
              <CalendarCheck size={15} />
              <span>Book Consultation</span>
            </button>
            <button
              type="button"
              className="mobile-toggle"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
