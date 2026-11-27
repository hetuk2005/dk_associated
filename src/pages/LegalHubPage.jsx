import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquareText,
  BookOpen,
  CheckCircle2,
  Search,
  Send,
  X,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchLegalGuides,
  fetchQuestions,
  submitQuestion,
} from '../services/lawFirmService';
import './Pages.css';

const QA_CATEGORIES = [
  'All',
  'Cheque Bounce & Recovery',
  'Family & Matrimonial Law',
  'Property & Real Estate',
  'Labour & Employment',
  'Criminal Defence & Bail',
  'Corporate & Startup Counsel',
];

export default function LegalHubPage({ onOpenBooking }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'guides' ? 'guides' : 'qa';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [qaCategory, setQaCategory] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [guideSearch, setGuideSearch] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);

  const [qForm, setQForm] = useState({
    title: '',
    category: 'Property & Real Estate',
    city: 'New Delhi',
    name: '',
    anonymous: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchQuestions(qaCategory).then((res) => setQuestions(res.data || []));
  }, [qaCategory]);

  useEffect(() => {
    fetchLegalGuides(guideSearch).then((res) => setGuides(res.data || []));
  }, [guideSearch]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'guides' ? { tab: 'guides' } : {});
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!qForm.title.trim()) return;
    setSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await submitQuestion(qForm);
      setQuestions((prev) => [res.data, ...prev]);
      setQForm((prev) => ({ ...prev, title: '' }));
      setSubmitMessage('Your legal question has been submitted to our Advocate Panel.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--color-brass-500)' }}>
            Public Legal Literacy & Pro Bono Advisory
          </span>
          <h1>Free Legal Q&A & Bare Acts Library</h1>
          <p>
            Ask an anonymous legal question answered by practicing advocates, or explore simplified
            Indian statutory guides covering BNS 2023, RERA, Sec. 138 NI Act, and Family Law.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-tabs" style={{ marginBottom: 30 }}>
            <button
              type="button"
              className={`tab-pill ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('qa')}
            >
              <MessageSquareText size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
              Free Legal Q&A Forum
            </button>
            <button
              type="button"
              className={`tab-pill ${activeTab === 'guides' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('guides')}
            >
              <BookOpen size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
              Bare Acts & Legal Guides
            </button>
          </div>

          {activeTab === 'qa' ? (
            <div className="hub-layout">
              <div>
                <div className="category-tabs" style={{ marginBottom: 18 }}>
                  {QA_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`tab-pill ${qaCategory === cat ? 'active' : ''}`}
                      onClick={() => setQaCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {questions.map((q) => (
                    <article key={q._id} className="card qa-card">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span className="badge badge-brass">{q.category}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)' }}>
                            {q.city} • {q.createdAt}
                          </span>
                        </div>
                        <span
                          className={`badge ${
                            q.status === 'Answered' ? 'badge-verified' : ''
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>

                      <h3>{q.title}</h3>

                      <div className="qa-answer-box">
                        {q.answeredBy && (
                          <div
                            style={{
                              fontWeight: 700,
                              color: 'var(--color-navy-900)',
                              marginBottom: 4,
                              fontSize: '0.82rem',
                            }}
                          >
                            {q.answeredBy} responded:
                          </div>
                        )}
                        <p style={{ margin: 0 }}>{q.answer}</p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                          color: 'var(--color-slate-500)',
                        }}
                      >
                        <span>Asked by: {q.askedBy}</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => onOpenBooking({ practiceArea: q.category })}
                        >
                          Book Follow-up Consult
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="card sticky-form-card">
                <span className="eyebrow">Confidential Citizen Desk</span>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>
                  Ask a Free Legal Question
                </h3>
                <p style={{ margin: '0 0 18px', fontSize: '0.86rem', color: 'var(--color-slate-600)' }}>
                  Get preliminary clarity from our practicing advocates before deciding on formal
                  legal action.
                </p>

                {submitMessage && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-emerald-100)',
                      color: 'var(--color-emerald-700)',
                      fontSize: '0.84rem',
                      marginBottom: 14,
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitMessage}</span>
                  </div>
                )}

                <form
                  onSubmit={handleQuestionSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <div className="form-group">
                    <label className="form-label">Legal Category</label>
                    <select
                      className="form-control"
                      value={qForm.category}
                      onChange={(e) => setQForm((p) => ({ ...p, category: e.target.value }))}
                    >
                      {QA_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={qForm.city}
                      onChange={(e) => setQForm((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Legal Question *</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Explain your factual situation clearly without sharing sensitive bank or Aadhaar numbers..."
                      value={qForm.title}
                      onChange={(e) => setQForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={qForm.anonymous}
                      onChange={(e) => setQForm((p) => ({ ...p, anonymous: e.target.checked }))}
                    />
                    <span>
                      <ShieldCheck size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                      Post Anonymously
                    </span>
                  </label>

                  {!qForm.anonymous && (
                    <div className="form-group">
                      <label className="form-label">Display Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        value={qForm.name}
                        onChange={(e) => setQForm((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <Send size={15} />
                    {submitting ? 'Submitting...' : 'Submit Free Question'}
                  </button>
                </form>
              </aside>
            </div>
          ) : (
            <div>
              <div style={{ maxWidth: 460, marginBottom: 24, position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-slate-400)',
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search guides (e.g., BNS, Sec 138, RERA, Divorce)..."
                  value={guideSearch}
                  onChange={(e) => setGuideSearch(e.target.value)}
                />
              </div>

              <div className="grid-2">
                {guides.map((g) => (
                  <article
                    key={g._id}
                    className="card card-hover"
                    style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono badge badge-brass">{g.statuteTag}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
                        {g.readTime}
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.45rem' }}>{g.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-slate-600)' }}>
                      {g.summary}
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedGuide(g)}
                      >
                        Read Full Briefing
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedGuide && (
        <div className="modal-backdrop" onClick={() => setSelectedGuide(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-kicker">
                  {selectedGuide.statuteTag} • {selectedGuide.readTime}
                </span>
                <h2 className="modal-title">{selectedGuide.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedGuide(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-navy-900)' }}>
                {selectedGuide.summary}
              </p>
              <div className="guide-reader-sections">
                {selectedGuide.sections.map((sec) => (
                  <div
                    key={sec.heading}
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-ivory-50)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <h4>{sec.heading}</h4>
                    <p>{sec.body}</p>
                  </div>
                ))}
              </div>
              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedGuide(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-brass"
                  onClick={() => {
                    const cat = selectedGuide.category;
                    setSelectedGuide(null);
                    onOpenBooking({ practiceArea: cat });
                  }}
                >
                  Consult Specialist on This Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
