import React from 'react';
import {
  BadgeCheck,
  MapPin,
  Landmark,
  Star,
  Languages,
  CalendarCheck,
  ArrowUpRight,
} from 'lucide-react';
import './AdvocateCard.css';

export default function AdvocateCard({ advocate, onViewProfile, onBook }) {
  return (
    <article className="card card-hover adv-card">
      <div className="adv-card-top">
        <div className="adv-avatar">{advocate.initials}</div>
        <div className="adv-card-identity">
          <div className="adv-name-row">
            <h3 className="adv-name">{advocate.name}</h3>
            {advocate.verified && (
              <span className="adv-verified-icon" title="Bar Council Verified">
                <BadgeCheck size={16} />
              </span>
            )}
          </div>
          <p className="adv-designation">{advocate.designation}</p>
          <div className="adv-bar-row">
            <span className="mono adv-bar-id">Bar ID: {advocate.barId}</span>
            <span className="adv-rating">
              <Star size={13} fill="#c8963e" color="#c8963e" />
              {advocate.rating} ({advocate.reviewsCount})
            </span>
          </div>
        </div>
      </div>

      <div className="adv-tags">
        {advocate.practiceAreas.slice(0, 3).map((area) => (
          <span key={area} className="badge">
            {area}
          </span>
        ))}
      </div>

      <div className="adv-facts">
        <div>
          <MapPin size={14} />
          <span>{advocate.city} • {advocate.experienceYears} yrs exp.</span>
        </div>
        <div>
          <Landmark size={14} />
          <span>{advocate.courts.join(', ')}</span>
        </div>
        <div>
          <Languages size={14} />
          <span>{advocate.languages.join(', ')}</span>
        </div>
      </div>

      <div className="adv-card-footer">
        <div>
          <span className="adv-fee-label">Consultation</span>
          <div className="adv-fee-val">₹{advocate.consultationFee.toLocaleString('en-IN')}</div>
        </div>
        <div className="adv-card-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onViewProfile(advocate)}
          >
            Profile <ArrowUpRight size={14} />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onBook(advocate)}
          >
            <CalendarCheck size={14} />
            Book
          </button>
        </div>
      </div>
    </article>
  );
}
