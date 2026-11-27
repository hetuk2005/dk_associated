# DK Associated — MERN-Ready Law Firm Web Application

A full-featured, frontend-only React + Vite web application for **DK Associated** (Advocates, Solicitors & Digital Legal Counsel), combining the core capabilities of modern Indian legal platforms (verified advocate discovery, fixed-fee legal packages, tele-consultation booking, free legal Q&A, bare act guides, and stage-wise milestone case tracking).

## Quick Start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Key Features Implemented

1. **Home & Instant Counsel Finder (`/`)**
   - Judicial navy & brass editorial layout with Bar Council compliance disclaimer.
   - Quick triage search bar routing directly to filtered Advocates by practice area, city, and keyword.
   - Stage-wise milestone transparency preview and fixed-fee services showcase.
2. **Verified Advocates Directory (`/advocates`)**
   - Filter by city, practice area, court level, keyword, and sort by rating, experience, or consultation fee.
   - Interactive Advocate Profile Modal with Bar ID, notable matters, education, languages, and direct booking.
3. **Practice Areas & Fixed-Fee Packages (`/services`)**
   - Standardized deliverables (Sec. 138 Legal Notice, Property Title Search, Mutual Consent Divorce, Startup Kit, Trademark Filing, Registered Will) with stage-wise payment splits.
4. **Free Legal Q&A & Bare Acts Library (`/legal-hub`)**
   - Searchable citizen Q&A forum with live anonymous/named question submission persisted to `localStorage`.
   - Interactive Bare Acts & Legal Guides reader (BNS/BNSS 2023, Sec. 138 NI Act, Property Due Diligence, Sec. 13B Divorce).
5. **Live Case Tracker & Confidential Case Posting (`/track-case`)**
   - Track sample cases (`DK-2026-8412`, `DK-2026-7904`) or submit a new confidential case brief to receive a live tracking ID with stage-wise milestones.
6. **Multi-Mode Tele-Consultation Booking Modal**
   - Video Call, Phone Call, or Chamber Visit booking with date/time slots and instant confirmation reference ID (`CONS-2026-XXXX`).

## Connecting a MERN (Express + MongoDB) Backend Later

All data requests pass through `src/services/apiClient.js` and `src/services/lawFirmService.js`.
- Currently `VITE_USE_MOCK` defaults to `true` (backed by `src/data/mockDatabase.js` + `localStorage`).
- When your Express + MongoDB server is ready, copy `.env.example` to `.env`, set `VITE_USE_MOCK=false`, and point `VITE_API_BASE_URL` to your API server. See `docs/MERN_INTEGRATION.md` for the exact REST endpoints and Mongoose document shapes.
