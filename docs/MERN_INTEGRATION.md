# MERN Backend Integration Guide

This frontend is structured so an **Express + MongoDB (Mongoose)** backend can replace the mock layer without editing any React pages or UI components.

## 1. Environment Switch

Create `.env` from `.env.example`:

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:5000/api
```

`vite.config.js` already proxies `/api` to `http://localhost:5000` during local development.

## 2. Expected REST API Endpoints

All endpoints return JSON in the shape:
```json
{
  "success": true,
  "data": {},
  "message": "Optional status message"
}
```

| Service Function (`src/services/lawFirmService.js`) | HTTP Method & Path | Purpose |
| :--- | :--- | :--- |
| `fetchPracticeAreas()` | `GET /api/practice-areas` | List all practice area documents |
| `fetchAdvocates(filters)` | `GET /api/advocates?city=&practiceArea=&court=&search=` | Filter & sort verified advocates |
| `fetchLegalPackages(category)` | `GET /api/packages?category=` | List fixed-fee legal packages |
| `fetchQuestions(category)` | `GET /api/questions` | Fetch public Q&A feed |
| `submitQuestion(payload)` | `POST /api/questions` | Create a new legal question |
| `fetchLegalGuides(search)` | `GET /api/guides` | Fetch bare-act & law guides |
| `bookConsultation(payload)` | `POST /api/consultations` | Reserve video/phone/chamber slot |
| `submitCaseInquiry(payload)` | `POST /api/cases` | Post confidential case & generate `caseId` |
| `trackCaseById(caseId)` | `GET /api/cases/:caseId` | Fetch live case milestones by `caseId` |

## 3. Recommended Mongoose Schemas

Every record in `src/data/mockDatabase.js` already uses MongoDB-style `_id` fields and clean JSON types:
- `Advocate`: `{ name, designation, barId, city, courts: [String], practiceAreas: [String], experienceYears, rating, reviewsCount, languages: [String], consultationFee, modes: [String], verified, education, bio, notableMatters: [String], slots: [String] }`
- `Consultation`: `{ referenceId, mode, practiceArea, advocateId, advocateName, packageTitle, date, timeSlot, city, language, clientName, phone, email, brief, confidential, status }`
- `Case`: `{ caseId, title, clientName, practiceArea, city, court, assignedAdvocate, nextHearingDate, currentStageIndex, milestones: [{ title, status, date, note }], documents: [String] }`
- `Question`: `{ title, category, city, askedBy, status, answeredBy, answer }`
