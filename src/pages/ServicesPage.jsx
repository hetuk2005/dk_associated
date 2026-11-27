import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { fetchLegalPackages, fetchPracticeAreas } from '../services/lawFirmService';
import './Pages.css';

export default function ServicesPage({ onOpenBooking }) {
  const [packages, setPackages] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPracticeAreas().then((res) => setPracticeAreas(res.data || []));
  }, []);

  useEffect(() => {
    fetchLegalPackages(selectedCategory).then((res) => setPackages(res.data || []));
  }, [selectedCategory]);

  const categories = [
    'All',
    'Cheque Bounce & Recovery',
    'Property, Revenue & RERA',
    'Criminal Defence & Bail',
    'Family & Matrimonial Law',
    'Corporate & Commercial Counsel',
    'Intellectual Property & Documentation',
  ];

  return (
    <div>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--color-brass-500)' }}>
            Transparent Stage-Wise Pricing
          </span>
          <h1>Practice Areas & Fixed-Fee Legal Services</h1>
          <p>
            Engage specialist advocates for standardized drafting, title due diligence, notices,
            and petitions with zero hidden costs and clear milestone schedules.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 22 }}>
            <div>
              <span className="eyebrow">Fixed-Fee Packages</span>
              <h2 className="section-title">Standardized Legal Deliverables</h2>
            </div>
          </div>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tab-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Packages' : cat}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {packages.map((pkg) => (
              <article
                key={pkg._id}
                className={`card card-hover pkg-card ${pkg.popular ? 'popular' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-brass">{pkg.category}</span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--color-slate-500)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Clock size={12} /> {pkg.turnaround}
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{pkg.title}</h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-slate-600)' }}>
                  {pkg.summary}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                    fontSize: '0.84rem',
                  }}
                >
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={15} color="var(--color-emerald-700)" style={{ flexShrink: 0 }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="pkg-milestones">
                  <span className="pkg-milestones-title">Stage-Wise Payment Split</span>
                  {pkg.milestones.map((m) => (
                    <div key={m.stage} className="pkg-milestone-row">
                      <span>{m.stage}</span>
                      <strong className="mono">{m.pct}</strong>
                    </div>
                  ))}
                </div>

                <div className="pkg-card-footer">
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        color: 'var(--color-slate-500)',
                      }}
                    >
                      Professional Fee
                    </span>
                    <strong style={{ fontSize: '1.28rem', color: 'var(--color-navy-900)' }}>
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenBooking({ pkg })}
                  >
                    Request Package
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Full-Service Litigation & Advisory</span>
              <h2 className="section-title">All Chambers Practice Areas</h2>
              <p className="section-subtitle">
                For custom litigation, High Court writs, or enterprise retainers, our partners
                prepare a stage-wise fee charter after your initial conflict check.
              </p>
            </div>
          </div>

          <div className="grid-2">
            {practiceAreas.map((pa) => (
              <div key={pa._id} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: '1.35rem' }}>{pa.title}</h3>
                  <span className="badge badge-verified">
                    <ShieldCheck size={13} /> {pa.avgTimeline}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-slate-600)' }}>
                  {pa.shortDesc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {pa.statutes.map((s) => (
                    <span key={s} className="mono badge">
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => onOpenBooking({ practiceArea: pa.title })}
                  >
                    Consult on {pa.title.split('&')[0].trim()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
