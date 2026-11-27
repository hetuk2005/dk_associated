import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Search,
  ShieldCheck,
  ArrowRight,
  Users,
  Building2,
  ShieldAlert,
  Briefcase,
  FileCheck2,
  Award,
  Landmark,
  CheckCircle2,
  Video,
  Lock,
  Layers,
  MessageSquareText,
  BookOpen,
  Quote,
} from 'lucide-react';
import {
  fetchAdvocates,
  fetchLegalGuides,
  fetchLegalPackages,
  fetchPracticeAreas,
  fetchQuestions,
} from '../services/lawFirmService';
import AdvocateCard from '../components/AdvocateCard';
import './HomePage.css';

const ICON_MAP = {
  Users,
  Building2,
  ShieldAlert,
  Briefcase,
  FileCheck2,
  Award,
  Scale,
  Landmark,
};

export default function HomePage({ onOpenBooking, onSelectAdvocate }) {
  const navigate = useNavigate();
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [packages, setPackages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [guides, setGuides] = useState([]);

  const [triagePractice, setTriagePractice] = useState('All');
  const [triageCity, setTriageCity] = useState('All');
  const [triageSearch, setTriageSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetchPracticeAreas(),
      fetchAdvocates({}),
      fetchLegalPackages('All'),
      fetchQuestions('All'),
      fetchLegalGuides(''),
    ]).then(([paRes, advRes, pkgRes, qRes, gRes]) => {
      setPracticeAreas(paRes.data || []);
      setAdvocates((advRes.data || []).slice(0, 3));
      setPackages((pkgRes.data || []).slice(0, 3));
      setQuestions((qRes.data || []).slice(0, 3));
      setGuides((gRes.data || []).slice(0, 3));
    });
  }, []);

  const handleTriageSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (triagePractice !== 'All') params.set('practiceArea', triagePractice);
    if (triageCity !== 'All') params.set('city', triageCity);
    if (triageSearch.trim()) params.set('search', triageSearch.trim());
    navigate(`/advocates?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-kicker">
                <ShieldCheck size={15} />
                <span>Supreme Court • 14 High Courts • Pan-India Digital Chambers</span>
              </div>
              <h1 className="hero-title">
                Authoritative Legal Counsel, <em>Accessible Anywhere.</em>
              </h1>
              <p className="hero-subtitle">
                DK Associated unites veteran litigation partners with modern legal-tech
                transparency—consult verified advocates via Video, Phone, or In-Chamber, track
                stage-wise milestones, and engage fixed-fee legal services with complete
                confidentiality.
              </p>

              <div className="hero-cta-row">
                <button
                  type="button"
                  className="btn btn-brass"
                  onClick={() => onOpenBooking()}
                >
                  <Video size={17} />
                  Book Tele-Consultation
                </button>
                <Link to="/track-case" className="btn btn-outline-light">
                  <Lock size={16} />
                  Post Confidential Case
                </Link>
              </div>
            </div>

            <div className="hero-card-panel">
              <div className="triage-header">
                <span className="eyebrow" style={{ marginBottom: 4 }}>
                  Quick Counsel Finder
                </span>
                <h3>Match with a Verified Specialist</h3>
              </div>

              <form onSubmit={handleTriageSubmit} className="triage-form">
                <div className="form-group">
                  <label className="form-label">Legal Matter / Practice Area</label>
                  <select
                    className="form-control"
                    value={triagePractice}
                    onChange={(e) => setTriagePractice(e.target.value)}
                  >
                    <option value="All">All Practice Areas</option>
                    {practiceAreas.map((pa) => (
                      <option key={pa._id} value={pa.title}>
                        {pa.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City / Court Jurisdiction</label>
                  <select
                    className="form-control"
                    value={triageCity}
                    onChange={(e) => setTriageCity(e.target.value)}
                  >
                    <option value="All">Pan-India (All Chambers)</option>
                    <option value="New Delhi">New Delhi (Supreme Court / DHC)</option>
                    <option value="Mumbai">Mumbai (Bombay HC / NCLT)</option>
                    <option value="Bengaluru">Bengaluru (Karnataka HC / RERA)</option>
                    <option value="Ahmedabad">Ahmedabad (Gujarat HC)</option>
                    <option value="Chandigarh">Chandigarh (P&H High Court)</option>
                    <option value="Chennai">Chennai (Madras High Court)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keyword (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Bail, Sec 138, Mutual Divorce, RERA..."
                    value={triageSearch}
                    onChange={(e) => setTriageSearch(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Search size={16} />
                  Find Specialist Advocates
                </button>
              </form>

              <div className="triage-foot">
                <span>Need urgent advice?</span>
                <Link to="/legal-hub">Ask a Free Question →</Link>
              </div>
            </div>
          </div>

          <div className="hero-stats-bar">
            <div className="stat-item">
              <strong>19+ Yrs</strong>
              <span>Chambers Litigation Legacy</span>
            </div>
            <div className="stat-item">
              <strong>5,900+</strong>
              <span>Cases & Notices Handled</span>
            </div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Stage-Wise Fee Transparency</span>
            </div>
            <div className="stat-item">
              <strong>6 Languages</strong>
              <span>English, Hindi & Vernacular Desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Specialized Chambers</span>
              <h2 className="section-title">Practice Areas Across Indian Courts</h2>
              <p className="section-subtitle">
                Dedicated partner-led teams covering civil, criminal, family, real estate, and
                venture advisory with statutory clarity.
              </p>
            </div>
            <Link to="/services" className="btn btn-outline">
              Explore Fixed-Fee Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {practiceAreas.map((area) => {
              const Icon = ICON_MAP[area.iconName] || Scale;
              return (
                <Link
                  key={area._id}
                  to={`/advocates?practiceArea=${encodeURIComponent(area.title)}`}
                  className="card card-hover practice-card"
                >
                  <div className="practice-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{area.title}</h3>
                  <p>{area.shortDesc}</p>
                  <div className="practice-meta">
                    <span className="mono">{area.statutes[0]}</span>
                    <span className="practice-count">{area.mattersHandled}+ matters</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* STAGE-WISE TRANSPARENCY & TELE-LAW MODEL */}
      <section className="section section-muted">
        <div className="container">
          <div className="transparency-grid">
            <div>
              <span className="eyebrow">Predictable Case Governance</span>
              <h2 className="section-title">
                Stage-Wise Retainers & Live Milestone Tracking
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 24 }}>
                Inspired by modern legal transparency—never pay opaque lump sums upfront. Every
                litigation or advisory mandate is structured into clear milestones you can track
                online 24×7.
              </p>

              <div className="pillar-list">
                <div className="pillar-item">
                  <div className="pillar-num">01</div>
                  <div>
                    <h4>Confidential Intake & Conflict Check</h4>
                    <p>
                      Share your brief anonymously or via tele-consultation. Receive a conflict-free
                      partner assignment within hours.
                    </p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-num">02</div>
                  <div>
                    <h4>Stage-Wise Milestone Fee Proposal</h4>
                    <p>
                      Pay in transparent stages—from Notice & Drafting to Filing and Final
                      Arguments—backed by written engagement terms.
                    </p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-num">03</div>
                  <div>
                    <h4>Digital Case Tracker & Hearing Alerts</h4>
                    <p>
                      Monitor court dates, uploaded filings, and partner notes in real time using
                      your Case Reference ID.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/track-case" className="btn btn-primary">
                  Try Live Case Tracker <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onOpenBooking()}
                >
                  Schedule Strategy Call
                </button>
              </div>
            </div>

            <div className="card tracker-preview-card">
              <div className="tracker-preview-head">
                <div>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-brass-700)' }}>
                    LIVE PORTAL PREVIEW • CASE #DK-2026-8412
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.35rem' }}>
                    Sec. 138 NI Act Recovery — Milestone Progress
                  </h3>
                </div>
                <span className="badge badge-verified">Active Hearing Stage</span>
              </div>

              <div className="preview-milestones">
                <div className="pm-item done">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Stage 1: Dishonoured Cheque & Memo Audit</strong>
                    <span>Completed • Oct 04, 2026</span>
                  </div>
                </div>
                <div className="pm-item done">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Stage 2: Statutory Demand Notice Dispatched</strong>
                    <span>Completed • Oct 09, 2026</span>
                  </div>
                </div>
                <div className="pm-item current">
                  <Layers size={18} />
                  <div>
                    <strong>Stage 3: Magistrate Complaint & Summons Issued</strong>
                    <span>Next Hearing: Dec 09, 2026 • Ballard Pier Court</span>
                  </div>
                </div>
                <div className="pm-item pending">
                  <div className="pm-dot" />
                  <div>
                    <strong>Stage 4: Sec. 143A Interim Relief & Settlement</strong>
                    <span>Upcoming Milestone</span>
                  </div>
                </div>
              </div>

              <div className="tracker-preview-foot">
                <span>Assigned: Adv. Kavita Parekh</span>
                <Link to="/track-case?id=DK-2026-8412">Open Full Case View →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ADVOCATES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Verified Chambers Leadership</span>
              <h2 className="section-title">Senior Partners & Specialist Advocates</h2>
              <p className="section-subtitle">
                Every advocate at DK Associated is Bar Council verified with proven court appearances.
              </p>
            </div>
            <Link to="/advocates" className="btn btn-outline">
              View All Advocates <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {advocates.map((adv) => (
              <AdvocateCard
                key={adv._id}
                advocate={adv}
                onViewProfile={onSelectAdvocate}
                onBook={(a) => onOpenBooking({ advocate: a })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FIXED-FEE PACKAGES */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Transparent Legal Services</span>
              <h2 className="section-title">Popular Fixed-Fee Legal Packages</h2>
              <p className="section-subtitle">
                Predetermined professional fees with clear deliverables and turnaround guarantees.
              </p>
            </div>
            <Link to="/services" className="btn btn-outline-light">
              View All Packages <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {packages.map((pkg) => (
              <div key={pkg._id} className="pkg-dark-card">
                <div className="pkg-dark-top">
                  <span className="badge badge-brass">{pkg.category}</span>
                  <span className="mono pkg-turnaround">{pkg.turnaround}</span>
                </div>
                <h3>{pkg.title}</h3>
                <p>{pkg.summary}</p>
                <ul className="pkg-check-list">
                  {pkg.inclusions.slice(0, 3).map((inc) => (
                    <li key={inc}>
                      <CheckCircle2 size={14} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <div className="pkg-dark-footer">
                  <div>
                    <span className="pkg-price-label">Fixed Professional Fee</span>
                    <div className="pkg-price">₹{pkg.price.toLocaleString('en-IN')}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-brass btn-sm"
                    onClick={() => onOpenBooking({ pkg })}
                  >
                    Engage Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A + LAW GUIDES PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 32 }}>
            <div>
              <div className="eyebrow">
                <MessageSquareText size={14} /> Free Legal Advice Desk
              </div>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 16 }}>
                Recent Citizen Queries Answered
              </h2>
              <div className="qa-preview-list">
                {questions.map((q) => (
                  <div key={q._id} className="card qa-preview-item">
                    <div className="qa-meta">
                      <span className="badge">{q.category}</span>
                      <span>{q.city}</span>
                    </div>
                    <h4>{q.title}</h4>
                    <p>{q.answer}</p>
                    <div className="qa-by">Answered by {q.answeredBy}</div>
                  </div>
                ))}
              </div>
              <Link to="/legal-hub" className="btn btn-outline" style={{ marginTop: 16 }}>
                Ask a Free Legal Question <ArrowRight size={15} />
              </Link>
            </div>

            <div>
              <div className="eyebrow">
                <BookOpen size={14} /> Bare Acts & Legal Library
              </div>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 16 }}>
                Practical Indian Law Guides
              </h2>
              <div className="qa-preview-list">
                {guides.map((g) => (
                  <Link key={g._id} to="/legal-hub?tab=guides" className="card card-hover guide-preview-item">
                    <div className="qa-meta">
                      <span className="mono badge badge-brass">{g.statuteTag}</span>
                      <span>{g.readTime}</span>
                    </div>
                    <h4>{g.title}</h4>
                    <p>{g.summary}</p>
                  </Link>
                ))}
              </div>
              <Link to="/legal-hub?tab=guides" className="btn btn-primary" style={{ marginTop: 16 }}>
                Browse Full Law Library <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Client Trust</span>
              <h2 className="section-title">What Clients & Founders Say</h2>
            </div>
          </div>
          <div className="grid-3">
            <div className="card testimonial-card">
              <Quote size={24} className="quote-icon" />
              <p>
                “Within 48 hours of our video consult, DK Associated dispatched a sharp Sec. 138 notice
                and tracked the magistrate summons online. We recovered our full ₹14L invoice.”
              </p>
              <div className="testimonial-author">
                <strong>Saurabh Jain</strong>
                <span>Director, MedTech Supplies (Ahmedabad)</span>
              </div>
            </div>
            <div className="card testimonial-card">
              <Quote size={24} className="quote-icon" />
              <p>
                “The 30-year title due diligence flagged an undisclosed mortgage charge before we
                paid the ₹25 lakh token amount. Saved our family from years of litigation.”
              </p>
              <div className="testimonial-author">
                <strong>Priya & Rohit Kulkarni</strong>
                <span>Homebuyers (Mumbai)</span>
              </div>
            </div>
            <div className="card testimonial-card">
              <Quote size={24} className="quote-icon" />
              <p>
                “Their stage-wise startup legal kit gave us clean IP assignment and vesting terms
                that cleared institutional investor diligence in one go.”
              </p>
              <div className="testimonial-author">
                <strong>Arjun Nair</strong>
                <span>Co-Founder, FinLedger SaaS (Bengaluru)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
