import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
import { fetchAdvocates, fetchPracticeAreas } from '../services/lawFirmService';
import AdvocateCard from '../components/AdvocateCard';
import './Pages.css';

const CITIES = ['All', 'New Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Chandigarh', 'Chennai'];
const COURTS = ['All', 'Supreme Court', 'High Court', 'NCLT', 'RERA', 'Family Court', 'District'];

export default function AdvocatesPage({ onOpenBooking, onSelectAdvocate }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || 'All',
    practiceArea: searchParams.get('practiceArea') || 'All',
    court: 'All',
    sortBy: 'rating',
  });

  useEffect(() => {
    fetchPracticeAreas().then((res) => setPracticeAreas(res.data || []));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAdvocates(filters).then((res) => {
      if (active) {
        setAdvocates(res.data || []);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      city: 'All',
      practiceArea: 'All',
      court: 'All',
      sortBy: 'rating',
    });
    setSearchParams({});
  };

  return (
    <div>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--color-brass-500)' }}>
            Bar Council Verified Counsel
          </span>
          <h1>Partners & Specialist Advocates</h1>
          <p>
            Search by practice area, city chamber, or court jurisdiction. Book an immediate video,
            phone, or in-chamber consultation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-toolbar">
            <div className="form-group">
              <label className="form-label">Search Name, Court, or Expertise</label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-slate-400)',
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 34 }}
                  placeholder="e.g., Bail, Supreme Court, Menon, RERA..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Practice Area</label>
              <select
                className="form-control"
                value={filters.practiceArea}
                onChange={(e) => updateFilter('practiceArea', e.target.value)}
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
              <label className="form-label">City Chamber</label>
              <select
                className="form-control"
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cities' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Court Level</label>
              <select
                className="form-control"
                value={filters.court}
                onChange={(e) => updateFilter('court', e.target.value)}
              >
                {COURTS.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Courts' : c}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-outline" onClick={resetFilters}>
              <RotateCcw size={15} /> Reset
            </button>
          </div>

          <div className="results-meta">
            <span>
              Showing <strong>{advocates.length}</strong> verified advocate
              {advocates.length === 1 ? '' : 's'}
            </span>
            <div className="sort-control">
              <label htmlFor="sort-adv" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Sort by:
              </label>
              <select
                id="sort-adv"
                className="form-control"
                style={{ width: 'auto', padding: '7px 12px' }}
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee_asc">Consultation Fee: Low to High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              Loading verified advocates directory...
            </div>
          ) : advocates.length === 0 ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <h3 style={{ marginTop: 0 }}>No Advocates Matched Your Filter</h3>
              <p style={{ color: 'var(--color-slate-600)' }}>
                Try broadening your city or court filter, or let our Chambers Desk assign a
                specialist directly.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={resetFilters}>
                  Clear Filters
                </button>
                <button type="button" className="btn btn-brass" onClick={() => onOpenBooking()}>
                  Request Partner Assignment
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
}
