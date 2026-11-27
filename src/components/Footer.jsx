import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer({ onOpenBooking }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Scale size={22} className="footer-brand-icon" />
              <div>
                <div className="footer-brand-name">DK ASSOCIATED</div>
                <div className="footer-brand-tag">Advocates, Solicitors & Digital Counsel</div>
              </div>
            </div>
            <p className="footer-desc">
              Combining Supreme Court & High Court litigation pedigree with transparent
              stage-wise legal pricing, tele-consultation access, and real-time case
              tracking across India.
            </p>
            <button
              type="button"
              className="btn btn-brass btn-sm"
              onClick={() => onOpenBooking()}
            >
              Schedule Confidential Consult
            </button>
          </div>

          <div>
            <h4 className="footer-heading">Practice Pillars</h4>
            <ul className="footer-list">
              <li><Link to="/services">Family & Matrimonial Law</Link></li>
              <li><Link to="/services">Property & RERA Disputes</Link></li>
              <li><Link to="/services">Criminal Defence & Bail</Link></li>
              <li><Link to="/services">Corporate & Startup Advisory</Link></li>
              <li><Link to="/services">Sec. 138 Cheque Bounce</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Client Resources</h4>
            <ul className="footer-list">
              <li><Link to="/advocates">Find a Verified Advocate</Link></li>
              <li><Link to="/services">Fixed-Fee Legal Packages</Link></li>
              <li><Link to="/legal-hub">Free Legal Q&A Desk</Link></li>
              <li><Link to="/legal-hub">BNS & Bare Act Guides</Link></li>
              <li><Link to="/track-case">Live Case Milestone Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Principal Chambers</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={15} />
                <span>Chamber 412, Lawyers Chambers Block II, Tilak Marg, New Delhi 110001</span>
              </li>
              <li>
                <MapPin size={15} />
                <span>Nariman Bhavan, Suite 904, Nariman Point, Mumbai 400021</span>
              </li>
              <li>
                <Phone size={15} />
                <span>+91 11 4089 2210 / +91 22 6741 8890</span>
              </li>
              <li>
                <Mail size={15} />
                <span>counsel@dkassociated.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-disclaimer">
          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <p>
            <strong>Bar Council Compliance Notice:</strong> As per the rules of the Bar
            Council of India, law firms are not permitted to solicit work or advertise.
            This portal serves solely as an informational chambers resource and
            client-initiated consultation desk. Communication on this platform does not
            constitute solicitation or create an advocate-client relationship until formal
            Vakalatnama / Engagement execution.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DK Associated. All Rights Reserved.</span>
          <span>MERN-Ready Frontend Architecture • Pro Bono Tele-Law Partner Desk</span>
        </div>
      </div>
    </footer>
  );
}
