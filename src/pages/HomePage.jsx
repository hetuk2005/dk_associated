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
  PhoneCall,
  MapPin,
  Clock,
  ChevronDown,
} from 'lucide-react';
import {
  fetchAdvocates,
  fetchLegalGuides,
  fetchLegalPackages,
  fetchPracticeAreas,
  fetchQuestions,
} from '../services/lawFirmService';
import { FIRM_CONTACT } from '../data/mockDatabase';
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

const FAQS = [
  {
    q: 'Where are DK Associated chambers located in Lucknow?',
    a: 'We operate across three prime court locations in Lucknow: (1) Chamber F-325, High Court, Lucknow; (2) Collectorate Compound, Lucknow Bar Association, Lucknow; and (3) Civil Court, Near Lockup, Central Bar Association, Lucknow.',
  },
  {
    q: 'How can I urgently reach Adv. Deepak Kumar Singh for bail or urgent court matters?',
    a: 'For urgent bail, FIR quashing, remand defense, or Advocate Commissioner enquiries, call +91 70522 22205 (Adv. Deepak Kumar Singh) or +91 88583 28256, or book an immediate slot via our consultation modal.',
  },
  {
    q: 'Do you handle High Court Lucknow writ petitions and Collectorate revenue cases?',
    a: 'Yes. Our Senior Counsel team handles Article 226/227 Writ Petitions, Criminal Quashing (Sec. 528 BNSS), Service & RERA matters at High Court Lucknow, and Revenue/Mutation/Title disputes at Collectorate Compound.',
  },
  {
    q: 'Can outstation or NRI clients consult without visiting Lucknow first?',
    a: 'Yes. You can book a Video Tele-Consult or Direct Phone Call in Hindi or English, share documents securely, receive stage-wise fee terms, and track hearing milestones online using your Case Reference ID.',
  },
];

export default function HomePage({ onOpenBooking, onSelectAdvocate }) {
  const navigate = useNavigate();
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [packages, setPackages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  const [triagePractice, setTriagePractice] = useState('All');
  const [triageCourt, setTriageCourt] = useState('All');
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
      setAdvocates(advRes.data || []);
      setPackages((pkgRes.data || []).slice(0, 3));
      setQuestions((qRes.data || []).slice(0, 3));
      setGuides((gRes.data || []).slice(0, 3));
    });
  }, []);

  const handleTriageSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (triagePractice !== 'All') params.set('practiceArea', triagePractice);
    if (triageCourt !== 'All') params.set('court', triageCourt);
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
                <span>High Court Lucknow (F-325) • Central Bar • Lucknow Bar Association</span>
              </div>
              <h1 className="hero-title">
                DK Associated — <em>Dedicated Counsel, Proven Courtroom Standing.</em>
              </h1>
              <p className="hero-subtitle">
                Led by <strong>Adv. Deepak Kumar Singh</strong> (Advocate Commissioner, Central Bar
                Lucknow) and <strong>Adv. Dileep Singh</strong> (Vice President, Lucknow Bar
                Association), our six-advocate chambers deliver decisive representation across High
                Court Lucknow, Civil Court, Collectorate, and Family Courts.
              </p>

              <div className="hero-cta-row">
                <button
                  type="button"
                  className="btn btn-brass"
                  onClick={() => onOpenBooking()}
                >
                  <Video size={17} />
                  Book Chamber / Video Consult
                </button>
                <a href="tel:+917052222205" className="btn btn-outline-light">
                  <PhoneCall size={16} />
                  Call +91 70522 22205
                </a>
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
                <h3>Connect with DK Associated Counsel</h3>
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
                  <label className="form-label">Court / Chamber Forum</label>
                  <select
                    className="form-control"
                    value={triageCourt}
                    onChange={(e) => setTriageCourt(e.target.value)}
                  >
                    <option value="All">All Lucknow & Pan-India Forums</option>
                    <option value="High Court">High Court, Lucknow Bench (F-325)</option>
                    <option value="Collectorate">Collectorate Compound (Lucknow Bar)</option>
                    <option value="Civil Court">Civil Court Near Lockup (Central Bar)</option>
                    <option value="Family Court">Family Court, Lucknow</option>
                    <option value="Consumer">Consumer Commission / UP RERA</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keyword or Advocate Name (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Bail, Sec 138, Mutation, Deepak Singh..."
                    value={triageSearch}
                    onChange={(e) => setTriageSearch(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Search size={16} />
                  Find Chambers Advocate
                </button>
              </form>

              <div className="triage-foot">
                <span>Direct Desk: +91 88583 28256</span>
                <Link to="/legal-hub">Ask a Free Question →</Link>
              </div>
            </div>
          </div>

          <div className="hero-stats-bar">
            <div className="stat-item">
              <strong>6 Advocates</strong>
              <span>High Court & Bar Leadership</span>
            </div>
            <div className="stat-item">
              <strong>3 Chambers</strong>
              <span>High Court F-325, Collectorate & Civil Court</span>
            </div>
            <div className="stat-item">
              <strong>5,900+</strong>
              <span>Matters, Writs & Commissions Handled</span>
            </div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Stage-Wise Transparent Legal Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TEAM & LEADERSHIP — ALL 6 ADVOCATES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Our Legal Team — DK Associated</span>
              <h2 className="section-title">Leadership & Chambers Advocates</h2>
              <p className="section-subtitle">
                Experienced advocates practicing across Allahabad High Court (Lucknow Bench),
                Central Bar Association, and Lucknow Bar Association.
              </p>
            </div>
            <Link to="/advocates" className="btn btn-outline">
              Filter & Compare Advocates <ArrowRight size={16} />
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

      {/* LUCKNOW CHAMBERS & DIRECT HELPLINES */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Three Lucknow Court Locations</span>
              <h2 className="section-title">Visit Our Chambers or Call Directly</h2>
              <p className="section-subtitle">
                Dedicated presence inside High Court Lucknow, Collectorate Compound, and Civil Court
                Near Lockup for swift filing and client coordination.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:+917052222205" className="btn btn-brass btn-sm">
                <PhoneCall size={15} /> +91 70522 22205 (Deepak Singh)
              </a>
              <a href="tel:+918858328256" className="btn btn-primary btn-sm">
                <PhoneCall size={15} /> +91 88583 28256
              </a>
            </div>
          </div>

          <div className="grid-3">
            {FIRM_CONTACT.offices.map((office) => (
              <div key={office._id} className="card chamber-card">
                <div className="chamber-top">
                  <span className="badge badge-brass">{office.badge}</span>
                  <MapPin size={18} color="var(--color-brass-600)" />
                </div>
                <h3>{office.title}</h3>
                <p className="chamber-address">{office.address}</p>
                <p className="chamber-focus">{office.focus}</p>
                <div className="chamber-foot">
                  <span>
                    <Clock size={13} /> {office.timings}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => onOpenBooking({ mode: 'Chamber Visit' })}
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Specialized Chambers</span>
              <h2 className="section-title">Practice Areas Across Courts & Tribunals</h2>
              <p className="section-subtitle">
                Comprehensive representation across criminal bail, High Court writs, Collectorate
                revenue matters, matrimonial settlements, and commercial recovery.
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

      {/* STAGE-WISE TRANSPARENCY & LIVE CASE TRACKER */}
      <section className="section section-muted">
        <div className="container">
          <div className="transparency-grid">
            <div>
              <span className="eyebrow">Predictable Case Governance</span>
              <h2 className="section-title">
                Stage-Wise Retainers & Live Milestone Tracking
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 24 }}>
                Every litigation or advisory mandate at DK Associated is structured into clear
                milestones you can track online 24×7 with full transparency.
              </p>

              <div className="pillar-list">
                <div className="pillar-item">
                  <div className="pillar-num">01</div>
                  <div>
                    <h4>Confidential Intake & Conflict Check</h4>
                    <p>
                      Share your brief anonymously, call +91 70522 22205 / +91 88583 28256, or visit
                      any of our three Lucknow chambers.
                    </p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-num">02</div>
                  <div>
                    <h4>Stage-Wise Milestone Fee Proposal</h4>
                    <p>
                      Clear stage-wise retainers from Notice & Drafting to Filing and Final
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
                    <span>Next Hearing: Dec 09, 2026 • Civil Court Lucknow</span>
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
                <span>Assigned: Adv. Deepak Kumar Singh</span>
                <Link to="/track-case?id=DK-2026-8412">Open Full Case View →</Link>
              </div>
            </div>
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

      {/* FAQ + CLIENT TESTIMONIALS */}
      <section className="section section-muted">
        <div className="container">
          <div className="faq-testimonials-grid">
            <div>
              <span className="eyebrow">Client Guidance</span>
              <h2 className="section-title" style={{ fontSize: '2.1rem', marginBottom: 18 }}>
                Frequently Asked Questions
              </h2>
              <div className="faq-list">
                {FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={item.q} className={`card faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-trigger"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      >
                        <span>{item.q}</span>
                        <ChevronDown size={18} className="faq-chevron" />
                      </button>
                      {isOpen && <p className="faq-answer">{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="eyebrow">Client Trust</span>
              <h2 className="section-title" style={{ fontSize: '2.1rem', marginBottom: 18 }}>
                Client & Business Voices
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card testimonial-card">
                  <Quote size={22} className="quote-icon" />
                  <p>
                    “Within 48 hours of contacting Adv. Deepak Kumar Singh, DK Associated filed our
                    petition at High Court Lucknow and tracked every hearing milestone cleanly.”
                  </p>
                  <div className="testimonial-author">
                    <strong>Saurabh Mishra</strong>
                    <span>Director, Awadh Infra Supplies (Lucknow)</span>
                  </div>
                </div>
                <div className="card testimonial-card">
                  <Quote size={22} className="quote-icon" />
                  <p>
                    “Their Collectorate Compound team verified our 30-year Khatauni & land title
                    chain before registration and saved us from an undisclosed dispute.”
                  </p>
                  <div className="testimonial-author">
                    <strong>Priya & Rohit Shukla</strong>
                    <span>Homebuyers (Gomti Nagar, Lucknow)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
