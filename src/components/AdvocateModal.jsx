import useDialog from '../hooks/useDialog';
import React from 'react';
import {
  X,
  BadgeCheck,
  MapPin,
  Landmark,
  Star,
  GraduationCap,
  Languages,
  CalendarCheck,
} from 'lucide-react';
import './Modals.css';

export default function AdvocateModal({ advocate, onClose, onBook }) {
  const dialogRef = useDialog(Boolean(advocate), onClose);
  if (!advocate) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Advocate profile" tabIndex={-1} className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="adv-avatar-lg">{advocate.initials}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 className="modal-title" style={{ margin: 0 }}>
                  {advocate.name}
                </h2>
                {advocate.verified && (
                  <span className="badge badge-verified">
                    <BadgeCheck size={13} /> Bar Verified
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', marginTop: 2 }}>
                {advocate.designation}
              </div>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="adv-meta-grid">
            <div className="adv-meta-box">
              <span>Bar Enrollment ID</span>
              <strong className="mono">{advocate.barId}</strong>
            </div>
            <div className="adv-meta-box">
              <span>Practice Tenure</span>
              <strong>{advocate.experienceYears} Years</strong>
            </div>
            <div className="adv-meta-box">
              <span>Client Rating</span>
              <strong>
                <Star size={14} fill="#c8963e" color="#c8963e" style={{ verticalAlign: 'text-bottom' }} />{' '}
                {advocate.rating} ({advocate.reviewsCount} reviews)
              </strong>
            </div>
            <div className="adv-meta-box">
              <span>Consult Fee</span>
              <strong>₹{advocate.consultationFee.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="adv-detail-section">
            <h4>Biography & Chamber Focus</h4>
            <p>{advocate.bio}</p>
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="adv-detail-section">
              <h4>
                <Landmark size={15} /> Courts of Appearance
              </h4>
              <ul className="adv-bullet-list">
                {advocate.courts.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="adv-detail-section">
              <h4>
                <GraduationCap size={15} /> Education & Languages
              </h4>
              <p style={{ marginBottom: 6 }}>{advocate.education}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Languages size={14} color="var(--color-brass-700)" />
                {advocate.languages.map((lang) => (
                  <span key={lang} className="badge">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="adv-detail-section">
            <h4>Notable Representative Matters</h4>
            <ul className="adv-bullet-list">
              {advocate.notableMatters.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="adv-detail-section">
            <h4>
              <MapPin size={15} /> Primary Chamber & Consultation Modes
            </h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-brass">{advocate.city} Chambers</span>
              {advocate.modes.map((mode) => (
                <span key={mode} className="badge">
                  {mode}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Close Profile
            </button>
            <button
              type="button"
              className="btn btn-brass"
              onClick={() => {
                onClose();
                onBook(advocate);
              }}
            >
              <CalendarCheck size={16} />
              Book Consultation with {advocate.name.split(' ').slice(-1)[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
