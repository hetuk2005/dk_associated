# NyayaSetu · DK Associated

A responsive legal-services frontend for **DK Associated — Advocates & Solicitors**, built with React and Vite. The application brings advocate discovery, service packages, consultation requests, legal resources, and case milestones into a consistent navy-and-brass interface.

> **Project status:** Frontend demonstration with seeded data and browser-local persistence. No Express server or MongoDB database is included. Demo bookings do not reserve real appointments, send emails, or create video calls.

## Features

| Area | Capabilities |
| --- | --- |
| Home | Practice-area discovery, advocate finder, featured packages, and legal-resource previews |
| Advocate directory | Keyword, city, practice-area, and court filters; rating, experience, and fee sorting; detailed profiles |
| Practice & fees | Category filters, fixed-fee packages, deliverables, and milestone payment breakdowns |
| Legal hub | Legal Q&A, question submission, searchable guides, and a guide reader |
| Case tracker | Reference lookup, milestone timelines, and a case-inquiry form |
| Consultations | Video, telephone, or chamber preferences; scheduling; client details; demo confirmation references |
| Accessibility | Keyboard-friendly dialogs, Escape to close, focus restoration, skip navigation, visible focus, and reduced-motion support |
| Responsive UI | Collapsible navigation, adaptive grids, wrapping card actions, and viewport-aware dialogs |

## Technology

- **React 18** — component-based interface and state management
- **React Router 6** — client-side routing
- **Vite 5** — development server and production bundling
- **Lucide React** — interface icons
- **CSS** — shared design tokens, component styles, and responsive layouts
- **localStorage** — demo questions, cases, and consultation records

## Getting started

Use **Node.js 20.19+ or 22.12+** and npm. From the project directory:

```bash
npm ci
npm run dev
```

Open the local URL shown by Vite, normally **http://localhost:5173**. No environment file or backend is required for demo mode.

### Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the dependency versions recorded in the lockfile |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production site in `dist/` |
| `npm run preview` | Serve the production build locally for review |

## Routes

| URL | Page |
| --- | --- |
| `/` | Home and advocate finder |
| `/advocates` | Advocate directory |
| `/services` | Practice areas and packages |
| `/legal-hub` | Legal questions and guides |
| `/track-case` | Case tracking and inquiry submission |
| Other paths | Page-not-found screen |

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Routing, shared layout, and global consultation/profile state |
| `src/components/` | Navigation, footer, advocate cards, and dialogs |
| `src/pages/` | Route components and page styles |
| `src/hooks/useDialog.js` | Dialog focus management, Escape handling, and background scroll locking |
| `src/styles/tokens.css` | Colors, typography, spacing-related tokens, and visual primitives |
| `src/styles/global.css` | Shared layouts, controls, accessibility, and responsive foundations |
| `src/data/mockDatabase.js` | Seeded advocates, packages, questions, guides, and cases |
| `src/services/apiClient.js` | Mock/live API switch and HTTP request handling |
| `src/services/lawFirmService.js` | Domain services, filtering, and demo persistence |
| `docs/MERN_INTEGRATION.md` | Backend endpoint contract and proposed data models |

## Configuration and backend integration

Copy `.env.example` to `.env` if you need to change the defaults:

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:5000/api
```

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_USE_MOCK` | `true` | Only the literal value `false` enables live HTTP requests |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL used by the API client |

To connect a backend, implement the contract in [MERN Integration Guide](docs/MERN_INTEGRATION.md), set `VITE_USE_MOCK=false`, and provide the API URL. Restart Vite after changing environment variables; production values are embedded at build time. Variables prefixed with `VITE_` are public browser configuration and must not contain secrets.

The development server also proxies `/api` to `http://localhost:5000`. Set `VITE_API_BASE_URL=/api` to use that proxy. A production deployment needs its own API or reverse-proxy configuration.

## Demo data

Try either seeded case reference on the case-tracking page:

- `DK-2026-8412`
- `DK-2026-7904`

Demo data is stored under `dk_associated_mock_db_v1` in the current browser and origin. To reset the demonstration, remove that key in browser developer tools and reload the page. Records do not sync across browsers or devices. If browser storage is blocked or full, changes may not survive a reload.

## Responsive design

Layouts adapt to the available width using shared grids, component-specific breakpoints, and flexible content sizing. Navigation collapses at 1180px to give the brand and links sufficient room. Cards allow actions and metadata to wrap; forms shrink within grid columns; small-screen dialogs use the dynamic viewport height and scroll internally.

When changing content, review all five routes at small phone, tablet, and desktop sizes. Include long names, long categories, filtered empty states, the mobile menu, profile dialogs, guide dialogs, and both consultation steps.

## Production deployment

```bash
npm ci
npm run build
npm run preview
```

Deploy the contents of `dist/` to your static host. Because the app uses `BrowserRouter`, configure the host to serve `index.html` for client-side routes such as `/advocates` and `/track-case`; otherwise direct visits and refreshes can return a server 404. Serve the site over HTTPS and configure the backend's allowed origins when using a separate API domain.

## Validation

`npm run build` checks that the application compiles and bundles successfully. The repository currently has no configured automated test or lint commands. A production review should also cover successful and failed submissions, filter combinations, keyboard navigation, storage restrictions, and direct route refreshes on the deployment host.

## Scope and production readiness

The advocate identities, ratings, verification badges, prices, statistics, testimonials, and legal guidance are demo content. The language selector does not translate the interface. Appointment availability, authentication, authorization, payments, email delivery, video calling, document uploads, and secure case storage require backend implementation and verification before real use. Browser-local case records are not a confidential client portal; use fictional information when demonstrating forms.

Review firm details and legal content before publishing. No license has been included in this repository; add the appropriate license before distributing the code.
