import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  FileText,
  Calendar,
  UserCheck,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  fetchAllDemoCaseIds,
  submitCaseInquiry,
  trackCaseById,
} from '../services/lawFirmService';
import './Pages.css';

const PRACTICE_OPTIONS = [
  'Cheque Bounce & Recovery',
  'Property & Real Estate',
  'Family & Matrimonial Law',
  'Criminal Defence & Bail',
  'Corporate & Startup Counsel',
  'Intellectual Property (IPR)',
  'Labour & Employment',
  'Consumer & Appellate Writs',
];

export default function TrackCasePage() {
  const [searchParams] = useSearchParams();
  const [lookupId, setLookupId] = useState(searchParams.get('id') || 'DK-2026-8412');
  const [activeCase, setActiveCase] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [demoIds, setDemoIds] = useState([]);

  const [caseForm, setCaseForm] = useState({
    clientName: '',
    phone: '',
    city: 'New Delhi',
    practiceArea: PRACTICE_OPTIONS[0],
    court: '',
    urgency: 'Standard (Within 48 hrs)',
    summary: '',
    anonymous: true,
    hasDocuments: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdBanner, setCreatedBanner] = useState('');

  const handleLookup = async (idToFetch) => {
    setLookupError('');
    try {
      const res = await trackCaseById(idToFetch);
      setActiveCase(res.data);
    } catch (err) {
      setActiveCase(null);
      setLookupError(err.message);
    }
  };

  useEffect(() => {
    handleLookup(lookupId);
    fetchAllDemoCaseIds().then((res) => setDemoIds(res.data || []));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleLookup(lookupId);
  };

  const handleCasePost = async (e) => {
    e.preventDefault();
    if (!caseForm.phone.trim() || !caseForm.summary.trim()) return;
    setSubmitting(true);
    setCreatedBanner('');
    try {
      const res = await submitCaseInquiry(caseForm);
      const created = res.data;
      setLookupId(created.caseId);
      setActiveCase(created);
      setCreatedBanner(
        `Confidential Case Registered! Your tracking ID is ${created.caseId}. Loaded in the tracker.`
      );
      fetchAllDemoCaseIds().then((d) => setDemoIds(d.data || []));
      setCaseForm((prev) => ({ ...prev, summary: '', court: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--color-brass-500)' }}>
            Client Portal & Confidential Case Evaluation
          </span>
          <h1>Track Case Milestones or Post a New Case</h1>
          <p>
            Monitor stage-wise court progress, next hearing dates, and verified filings—or submit a
            confidential matter brief for partner assignment and fee estimation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tracker-layout">
            {/* LEFT: LIVE TRACKER */}
            <div>
              <div className="card tracker-search-box">
                <span className="eyebrow" style={{ marginBottom: 4 }}>
                  Live Case Status Lookup
                </span>
                <h2 style={{ margin: 0, fontSize: '1.55rem' }}>Enter Case Reference ID</h2>

                <form onSubmit={handleSearchSubmit} className="tracker-input-row">
                  <input
                    type="text"
                    className="form-control mono"
                    placeholder="e.g., DK-2026-8412"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    <Search size={16} /> Track Case
                  </button>
                </form>

                <div className="demo-chips">
                  <span>Quick Lookup:</span>
                  {demoIds.map((d) => (
                    <button
                      key={d.caseId}
                      type="button"
                      className="chip-btn"
                      onClick={() => {
                        setLookupId(d.caseId);
                        handleLookup(d.caseId);
                      }}
                    >
                      {d.caseId}
                    </button>
                  ))}
                </div>
              </div>

              {lookupError && <div className="form-error">{lookupError}</div>}

              {activeCase && (
                <div className="card case-detail-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                      flexWrap: 'wrap',
                      paddingBottom: 16,
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <span className="mono badge badge-brass">{activeCase.caseId}</span>
                      <h3 style={{ margin: '8px 0 0', fontSize: '1.45rem' }}>
                        {activeCase.title}
                      </h3>
                    </div>
                    <span className="badge badge-verified">{activeCase.practiceArea}</span>
                  </div>

                  <div className="grid-2" style={{ gap: 12 }}>
                    <div className="adv-meta-box">
                      <span>
                        <UserCheck size={12} /> Assigned Counsel
                      </span>
                      <strong>{activeCase.assignedAdvocate}</strong>
                    </div>
                    <div className="adv-meta-box">
                      <span>
                        <Calendar size={12} /> Next Hearing / Action
                      </span>
                      <strong>{activeCase.nextHearingDate}</strong>
                    </div>
                    <div className="adv-meta-box">
                      <span>
                        <Landmark size={12} /> Court / Forum
                      </span>
                      <strong>{activeCase.court}</strong>
                    </div>
                    <div className="adv-meta-box">
                      <span>Jurisdiction City</span>
                      <strong>{activeCase.city}</strong>
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        margin: '0 0 14px',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--color-navy-800)',
                      }}
                    >
                      Stage-Wise Milestone Progress
                    </h4>
                    <div className="milestone-timeline">
                      {activeCase.milestones.map((m, i) => (
                        <div key={i} className={`milestone-node ${m.status}`}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 8,
                              flexWrap: 'wrap',
                            }}
                          >
                            <h4>{m.title}</h4>
                            <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--color-slate-500)' }}>
                              {m.date}
                            </span>
                          </div>
                          <p>{m.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeCase.documents?.length > 0 && (
                    <div
                      style={{
                        paddingTop: 14,
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 10px',
                          fontSize: '0.82rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Verified Case Dossier ({activeCase.documents.length})
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {activeCase.documents.map((doc) => (
                          <span key={doc} className="badge">
                            <FileText size={13} /> {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: CONFIDENTIAL CASE SUBMISSION */}
            <aside className="card" style={{ padding: 26 }}>
              <span className="eyebrow">
                <Lock size={13} /> Anonymous / Confidential Case Posting
              </span>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.6rem' }}>
                Submit Case for Evaluation
              </h2>
              <p style={{ margin: '0 0 18px', fontSize: '0.88rem', color: 'var(--color-slate-600)' }}>
                Receive a conflict check, assigned partner recommendation, and stage-wise legal fee
                estimate—with an instant tracking ID.
              </p>

              {createdBanner && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-emerald-100)',
                    color: 'var(--color-emerald-700)',
                    fontSize: '0.85rem',
                    marginBottom: 16,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{createdBanner}</span>
                </div>
              )}

              <form
                onSubmit={handleCasePost}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div className="form-group">
                  <label className="form-label">Practice Area</label>
                  <select
                    className="form-control"
                    value={caseForm.practiceArea}
                    onChange={(e) => setCaseForm((p) => ({ ...p, practiceArea: e.target.value }))}
                  >
                    {PRACTICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">City / Jurisdiction</label>
                    <select
                      className="form-control"
                      value={caseForm.city}
                      onChange={(e) => setCaseForm((p) => ({ ...p, city: e.target.value }))}
                    >
                      {['New Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Chandigarh', 'Chennai'].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency</label>
                    <select
                      className="form-control"
                      value={caseForm.urgency}
                      onChange={(e) => setCaseForm((p) => ({ ...p, urgency: e.target.value }))}
                    >
                      <option>Urgent (Same Day / Bail)</option>
                      <option>Standard (Within 48 hrs)</option>
                      <option>Advisory / Planning</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Court / Tribunal (if already filed)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Delhi High Court, RERA, Family Court..."
                    value={caseForm.court}
                    onChange={(e) => setCaseForm((p) => ({ ...p, court: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Matter Summary *</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Outline key dates, dispute value, opposing party type, and relief sought..."
                    value={caseForm.summary}
                    onChange={(e) => setCaseForm((p) => ({ ...p, summary: e.target.value }))}
                    required
                  />
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={caseForm.anonymous}
                    onChange={(e) => setCaseForm((p) => ({ ...p, anonymous: e.target.checked }))}
                  />
                  <span>
                    <ShieldCheck size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                    Keep my identity masked in public/initial docket
                  </span>
                </label>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">
                      {caseForm.anonymous ? 'Alias / Name (Optional)' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={caseForm.anonymous ? 'Optional' : 'Your Name'}
                      value={caseForm.clientName}
                      onChange={(e) => setCaseForm((p) => ({ ...p, clientName: e.target.value }))}
                      required={!caseForm.anonymous}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confidential Callback No. *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98XXXXXXXX"
                      value={caseForm.phone}
                      onChange={(e) => setCaseForm((p) => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-brass" disabled={submitting}>
                  {submitting ? 'Generating Case ID...' : 'Submit Confidential Case Brief'}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
