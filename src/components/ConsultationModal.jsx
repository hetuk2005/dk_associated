import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Phone,
  Building,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
} from 'lucide-react';
import { bookConsultation } from '../services/lawFirmService';
import './Modals.css';

const MODES = [
  { id: 'Video Call', label: 'Video Tele-Consult', icon: Video, sub: 'Encrypted HD Chamber Link' },
  { id: 'Phone Call', label: 'Direct Phone Call', icon: Phone, sub: 'Callback within slot window' },
  { id: 'Chamber Visit', label: 'In-Chamber Visit', icon: Building, sub: 'New Delhi / Mumbai / Blr' },
];

const PRACTICE_OPTIONS = [
  'Family & Matrimonial Law',
  'Property & Real Estate',
  'Criminal Defence & Bail',
  'Corporate & Startup Counsel',
  'Cheque Bounce & Recovery',
  'Intellectual Property (IPR)',
  'Labour & Employment',
  'Consumer & Appellate Writs',
];

const TIME_SLOTS = ['10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM', '06:00 PM'];

export default function ConsultationModal({ isOpen, onClose, prefill = {} }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const [form, setForm] = useState({
    mode: 'Video Call',
    practiceArea: prefill.practiceArea || PRACTICE_OPTIONS[0],
    advocateName: prefill.advocate?.name || 'Auto-Assign Specialist Partner',
    advocateId: prefill.advocate?._id || '',
    packageTitle: prefill.pkg?.title || '',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: prefill.advocate?.slots?.[0] || TIME_SLOTS[0],
    city: prefill.advocate?.city || 'New Delhi',
    language: 'English',
    clientName: '',
    phone: '',
    email: '',
    brief: '',
    confidential: true,
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setConfirmation(null);
      setForm((prev) => ({
        ...prev,
        practiceArea:
          prefill.practiceArea ||
          prefill.advocate?.practiceAreas?.[0] ||
          prefill.pkg?.category ||
          prev.practiceArea,
        advocateName: prefill.advocate?.name || 'Auto-Assign Specialist Partner',
        advocateId: prefill.advocate?._id || '',
        packageTitle: prefill.pkg?.title || '',
        city: prefill.advocate?.city || prev.city,
        timeSlot: prefill.advocate?.slots?.[0] || prev.timeSlot,
      }));
    }
  }, [isOpen, prefill]);

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.phone.trim()) {
      setError('Please enter your name and mobile number to confirm the slot.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await bookConsultation(form);
      setConfirmation(res.data);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Unable to book consultation right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const slots = prefill.advocate?.slots?.length ? prefill.advocate.slots : TIME_SLOTS;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-kicker">Privileged & Confidential Consultation</span>
            <h2 className="modal-title">
              {step === 3 ? 'Consultation Confirmed' : 'Book Legal Consultation'}
            </h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {step !== 3 && (
            <div className="stepper">
              <div className={`stepper-item ${step >= 1 ? 'active' : ''}`}>
                <span>1</span> Mode & Schedule
              </div>
              <div className="stepper-line" />
              <div className={`stepper-item ${step >= 2 ? 'active' : ''}`}>
                <span>2</span> Client Details
              </div>
            </div>
          )}

          {prefill.pkg && step !== 3 && (
            <div className="prefill-banner">
              <strong>Selected Package:</strong> {prefill.pkg.title} (₹
              {prefill.pkg.price.toLocaleString('en-IN')})
            </div>
          )}

          {prefill.advocate && step !== 3 && (
            <div className="prefill-banner">
              <strong>Counsel:</strong> {prefill.advocate.name} • {prefill.advocate.city} (₹
              {prefill.advocate.consultationFee.toLocaleString('en-IN')}/session)
            </div>
          )}

          {step === 1 && (
            <div className="modal-step-content">
              <div className="form-group">
                <label className="form-label">Select Consultation Mode</label>
                <div className="mode-grid">
                  {MODES.map((m) => {
                    const Icon = m.icon;
                    const active = form.mode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={`mode-card ${active ? 'active' : ''}`}
                        onClick={() => updateField('mode', m.id)}
                      >
                        <Icon size={18} />
                        <div className="mode-label">{m.label}</div>
                        <div className="mode-sub">{m.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Practice Area</label>
                  <select
                    className="form-control"
                    value={form.practiceArea}
                    onChange={(e) => updateField('practiceArea', e.target.value)}
                  >
                    {PRACTICE_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City / Jurisdiction</label>
                  <select
                    className="form-control"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  >
                    {['New Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Chandigarh', 'Chennai', 'Pan-India'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => updateField('date', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Language</label>
                  <select
                    className="form-control"
                    value={form.language}
                    onChange={(e) => updateField('language', e.target.value)}
                  >
                    {['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Punjabi', 'Kannada'].map(
                      (l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Select Time Slot (IST)
                </label>
                <div className="slot-row">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-pill ${form.timeSlot === slot ? 'active' : ''}`}
                      onClick={() => updateField('timeSlot', slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  Continue to Client Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="modal-step-content">
              {error && <div className="form-error">{error}</div>}

              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Siddharth Mehta"
                    value={form.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for calendar & brief link)</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brief Matter Summary (Optional)</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Briefly describe your legal issue, court stage, or urgency..."
                  value={form.brief}
                  onChange={(e) => updateField('brief', e.target.value)}
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.confidential}
                  onChange={(e) => updateField('confidential', e.target.checked)}
                />
                <span>
                  <ShieldCheck size={15} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                  Protect my details under Advocate-Client Privilege (Section 132 BSA / 126 Evidence Act)
                </span>
              </label>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-brass" disabled={submitting}>
                  {submitting ? 'Confirming Slot...' : 'Confirm Consultation'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && confirmation && (
            <div className="confirmation-box">
              <div className="confirm-icon">
                <CheckCircle2 size={42} />
              </div>
              <h3>Your Consultation Slot is Reserved</h3>
              <p>
                Our Chambers Desk has logged your consultation request. You will receive the
                encrypted meeting details prior to your scheduled window.
              </p>

              <div className="confirm-summary">
                <div>
                  <span>Reference ID</span>
                  <strong className="mono">{confirmation.referenceId}</strong>
                </div>
                <div>
                  <span>Consultation Mode</span>
                  <strong>{confirmation.mode}</strong>
                </div>
                <div>
                  <span>Assigned Counsel</span>
                  <strong>{confirmation.advocateName}</strong>
                </div>
                <div>
                  <span>Date & Time</span>
                  <strong>
                    {confirmation.date} at {confirmation.timeSlot} IST
                  </strong>
                </div>
                <div>
                  <span>Practice Area</span>
                  <strong>{confirmation.practiceArea}</strong>
                </div>
              </div>

              <button type="button" className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
