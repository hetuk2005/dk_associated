import { request } from './apiClient';
import {
  INITIAL_ADVOCATES,
  INITIAL_CASES,
  INITIAL_GUIDES,
  INITIAL_PACKAGES,
  INITIAL_PRACTICE_AREAS,
  INITIAL_QUESTIONS,
} from '../data/mockDatabase';

const STORAGE_KEY = 'dk_associated_mock_db_v2';

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (['practiceAreas', 'advocates', 'packages', 'questions', 'guides', 'cases', 'consultations']
        .every((key) => Array.isArray(parsed?.[key]))) return parsed;
    }
  } catch {
    // Fallback to initial seeded state if storage is unavailable
  }

  const seeded = {
    practiceAreas: INITIAL_PRACTICE_AREAS,
    advocates: INITIAL_ADVOCATES,
    packages: INITIAL_PACKAGES,
    questions: INITIAL_QUESTIONS,
    guides: INITIAL_GUIDES,
    cases: INITIAL_CASES,
    consultations: [],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // Ignore quota errors
  }

  return seeded;
}

function saveDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage write errors
  }
}

export async function fetchPracticeAreas() {
  return request('/practice-areas', { method: 'GET' }, () => {
    const db = loadDb();
    return { success: true, data: db.practiceAreas };
  });
}

export async function fetchAdvocates(filters = {}) {
  const params = new URLSearchParams();
  if (filters.city && filters.city !== 'All') params.set('city', filters.city);
  if (filters.practiceArea && filters.practiceArea !== 'All')
    params.set('practiceArea', filters.practiceArea);
  if (filters.court && filters.court !== 'All') params.set('court', filters.court);
  if (filters.search) params.set('search', filters.search);
  if (filters.language && filters.language !== 'All') params.set('language', filters.language);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);

  const query = params.toString() ? `?${params.toString()}` : '';

  return request(`/advocates${query}`, { method: 'GET' }, () => {
    const db = loadDb();
    let list = [...db.advocates];

    if (filters.city && filters.city !== 'All') {
      list = list.filter((a) => a.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.practiceArea && filters.practiceArea !== 'All') {
      list = list.filter((a) =>
        a.practiceAreas.some((p) =>
          p.toLowerCase().includes(filters.practiceArea.toLowerCase())
        )
      );
    }
    if (filters.court && filters.court !== 'All') {
      list = list.filter((a) =>
        a.courts.some((c) => c.toLowerCase().includes(filters.court.toLowerCase()))
      );
    }
    if (filters.language && filters.language !== 'All') {
      list = list.filter((a) =>
        a.languages.some((l) => l.toLowerCase() === filters.language.toLowerCase())
      );
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.designation.toLowerCase().includes(q) ||
          a.practiceAreas.some((p) => p.toLowerCase().includes(q)) ||
          a.courts.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy === 'experience') {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (filters.sortBy === 'fee_asc') {
      list.sort((a, b) => a.consultationFee - b.consultationFee);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return { success: true, data: list };
  });
}

export async function fetchLegalPackages(category = 'All') {
  const query = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/packages${query}`, { method: 'GET' }, () => {
    const db = loadDb();
    const list =
      category && category !== 'All'
        ? db.packages.filter((p) => p.category === category)
        : db.packages;
    return { success: true, data: list };
  });
}

export async function fetchQuestions(category = 'All') {
  return request(`/questions${category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`, { method: 'GET' }, () => {
    const db = loadDb();
    const list =
      category && category !== 'All'
        ? db.questions.filter((q) => q.category === category)
        : db.questions;
    return { success: true, data: list };
  });
}

export async function submitQuestion(payload) {
  return request(
    '/questions',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    () => {
      const db = loadDb();
      const newQuestion = {
        _id: `q-${Date.now()}`,
        title: payload.title,
        category: payload.category,
        city: payload.city || 'Pan-India',
        askedBy: payload.anonymous ? 'Anonymous Client' : payload.name || 'Client',
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'Pending Advocate Review',
        answeredBy: null,
        answer:
          'Your query has been queued for our specialist panel. Initial preliminary guidance will be posted and emailed within 12 working hours.',
      };
      db.questions = [newQuestion, ...db.questions];
      saveDb(db);
      return {
        success: true,
        data: newQuestion,
        message: 'Question submitted successfully.',
      };
    }
  );
}

export async function fetchLegalGuides(search = '') {
  return request(`/guides${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`, { method: 'GET' }, () => {
    const db = loadDb();
    const q = search.trim().toLowerCase();
    const list = q
      ? db.guides.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            g.statuteTag.toLowerCase().includes(q)
        )
      : db.guides;
    return { success: true, data: list };
  });
}

export async function bookConsultation(payload) {
  return request(
    '/consultations',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    () => {
      const db = loadDb();
      const referenceId = `CONS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const record = {
        _id: `cons-${Date.now()}`,
        referenceId,
        ...payload,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      db.consultations = [record, ...db.consultations];
      saveDb(db);
      return {
        success: true,
        data: record,
        message: 'Consultation slot confirmed.',
      };
    }
  );
}

export async function submitCaseInquiry(payload) {
  return request(
    '/cases',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    () => {
      const db = loadDb();
      const caseId = `DK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toISOString().slice(0, 10);
      const newCase = {
        _id: `case-${Date.now()}`,
        caseId,
        title: `${payload.anonymous ? 'Confidential Matter' : payload.clientName} — ${payload.practiceArea}`,
        clientName: payload.anonymous ? 'Confidential Identity' : payload.clientName,
        practiceArea: payload.practiceArea,
        city: payload.city,
        court: payload.court || 'Jurisdiction Under Review',
        assignedAdvocate: 'Senior Intake Desk (Assigning Partner)',
        nextHearingDate: 'Assessment Call Within 24 Hrs',
        createdAt: today,
        currentStageIndex: 0,
        milestones: [
          {
            title: 'Confidential Case Intake Received',
            status: 'completed',
            date: today,
            note: `Urgency: ${payload.urgency}. Summary logged securely.`,
          },
          {
            title: 'Conflict Check & Partner Assignment',
            status: 'active',
            date: 'In Progress',
            note: 'Matching specialist advocate in your city and court jurisdiction.',
          },
          {
            title: 'Legal Strategy & Stage-Wise Fee Quote',
            status: 'pending',
            date: 'Upcoming',
            note: 'Transparent milestone proposal before formal engagement.',
          },
          {
            title: 'Drafting, Notice or Filing Execution',
            status: 'pending',
            date: 'Upcoming',
            note: 'Initiated upon client approval.',
          },
        ],
        documents: payload.hasDocuments ? ['Client_Attached_Brief_Summary.pdf'] : [],
      };
      db.cases = [newCase, ...db.cases];
      saveDb(db);
      return {
        success: true,
        data: newCase,
        message: 'Confidential case registered.',
      };
    }
  );
}

export async function trackCaseById(caseId) {
  const normalized = (caseId || '').trim().toUpperCase();
  return request(`/cases/${encodeURIComponent(normalized)}`, { method: 'GET' }, () => {
    const db = loadDb();
    const found = db.cases.find((c) => c.caseId.toUpperCase() === normalized);
    if (!found) {
      throw new Error(`No case found with Reference ID "${normalized}". Try DK-2026-8412 or DK-2026-7904.`);
    }
    return { success: true, data: found };
  });
}

export async function fetchAllDemoCaseIds() {
  return request('/cases/recent-ids', { method: 'GET' }, () => {
    const db = loadDb();
    return {
      success: true,
      data: db.cases.slice(0, 4).map((c) => ({ caseId: c.caseId, title: c.title })),
    };
  });
}
