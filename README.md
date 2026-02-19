# GLYERAL — AI-Powered Diabetes Medication Recommendation System

A physician decision support web application that leverages AI to generate evidence-based medication recommendations for diabetes management. GLYERAL assists clinicians in making informed treatment decisions by analyzing patient profiles, lab values, and clinical guidelines.

---

## Features

- **Physician Authentication** — Secure sign-up/login with JWT-based session management
- **Patient Management** — Create, search, and manage patient records with full clinical profiles
- **Multi-Step Clinical Intake** — Guided 7-step wizard covering demographics, conditions, labs, glucose readings, and medications
- **AI Recommendation Engine** — Generates personalized medication suggestions with confidence scores, dosages, and guideline citations (ADA 2025, KDIGO 2024, AHA)
- **AI Chat Assistant** — Contextual clinical copilot for querying drug interactions, side effects, and recommendation rationale
- **Accept / Reject / Modify Workflow** — Physicians can review and act on each recommendation
- **Audit Trail** — Compliance log tracking all physician actions with timestamps and rationale
- **Settings** — User profile and password management

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| Forms | React Hook Form |
| Icons | Lucide React |
| Build Tool | Vite |
| API | REST with JWT Bearer authentication |
| Backend Services | Two microservices — Auth (`8001`) and Patients (`8002`) |

---

## Project Structure

```
recommendation_system/
├── src/
│   ├── components/
│   │   ├── auth/              # LoginForm, SignUpForm, AuthLayout
│   │   ├── dashboard/         # PatientSearch, PatientCard, StatsCards
│   │   ├── layout/            # Header, Sidebar
│   │   ├── patient/           # DemographicsForm, ConditionsForm, LabsForm,
│   │   │                      # GlucoseForm, MedicationsForm
│   │   ├── recommendations/   # RecommendationList, MedicationCard, AIChatPanel
│   │   ├── audit/             # AuditTable
│   │   ├── settings/          # SettingsModal
│   │   └── ui/                # Input, Button, FormCard (reusable elements)
│   ├── hooks/                 # useAuth, usePatients, useLabs, useMeds
│   ├── services/              # apiClient, authService, patientService,
│   │                          # labsService, medsService, recommendationService
│   ├── context/               # PatientContext
│   ├── providers/             # QueryProvider (React Query setup)
│   ├── router/                # AppRouter, ProtectedRoute
│   ├── data/                  # Static/mock data
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running on ports `8001` (auth) and `8002` (patients)





# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
VITE_AUTH_BASE_URL=http://localhost:8001
VITE_PATIENTS_BASE_URL=http://localhost:8002
```

### Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Application Routes

| Route | Description |
|---|---|
| `/login` | Physician login and sign-up |
| `/dashboard` | Patient list with search and stats |
| `/patient/:id/demographics` | Patient demographics form |
| `/patient/:id/conditions` | Health conditions checklist |
| `/patient/:id/labs` | Lab values (HbA1c, eGFR, lipids, etc.) |
| `/patient/:id/glucose` | Blood sugar readings |
| `/patient/:id/medications` | Current medications list |
| `/patient/:id/recommendations` | AI-generated medication recommendations + chat |
| `/patient/:id/audit` | Compliance audit trail |

All patient routes are protected — unauthenticated users are redirected to `/login`.

---

## Clinical Workflow

1. **Login** as a physician
2. **Search or create** a patient from the dashboard
3. **Complete the intake wizard** — demographics, conditions, labs, glucose, medications
4. **Generate AI recommendations** on the recommendations page
5. **Review** each medication suggestion with confidence score and guideline citations
6. **Accept, Reject, or Modify** recommendations; use the AI chat for clarifications
7. **View the audit trail** for a compliance record of all actions taken

---

## API Services

### Authentication Service (`VITE_AUTH_BASE_URL`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new physician |
| POST | `/login` | Authenticate and receive JWT |
| POST | `/logout` | Invalidate session |
| GET | `/user_profile` | Fetch logged-in user profile |
| POST | `/user_profile` | Update profile (name, email, org) |
| POST | `/updatepassword` | Change password |

### Patient Service (`VITE_PATIENTS_BASE_URL`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients` | List patients (supports `?query=` search) |
| POST | `/patients` | Create a new patient |
| GET | `/patients/:id` | Fetch full patient profile |
| PUT | `/patients/:id` | Update patient record |
| GET | `/patients/:id/labs` | Fetch lab records |
| POST | `/patients/:id/labs` | Create lab entry |
| GET | `/patients/:id/meds` | List current medications |
| POST | `/patients/:id/meds` | Add a medication |
| PUT | `/patients/:id/meds/:medId` | Update a medication |
| DELETE | `/patients/:id/meds/:medId` | Remove a medication |

---

## Key Design Decisions

- **React Query** manages all server state with 5-minute stale time and automatic retry, keeping data fresh without manual cache management.
- **PatientLayout prefetches** all patient data once when navigating to a patient, avoiding redundant requests across sub-routes.
- **JWT stored in `sessionStorage`** — tokens expire with the browser session. A 401 response anywhere auto-redirects to login.
- **Two microservices** separate authentication concerns from clinical data for independent scalability.
- **Tailwind custom theme** uses a deep teal-blue primary palette chosen for clinical trust and readability.

---

## Recommendation Engine

AI-generated recommendations include:

- **Medication name, dose, and route**
- **Confidence score** (0–100%) based on guideline alignment and patient-specific factors
- **Supporting guideline citations** (ADA 2025, KDIGO 2024, AHA/ACC)
- **Warnings and cautions** relevant to the patient's conditions (e.g., CKD, CAD)
- **Category grouping** — Oral agents, Injectable agents, Insulin

Physicians can **Accept**, **Reject**, or **Modify** each recommendation, or ask the AI chat assistant follow-up clinical questions.

---

## License

This project is intended for clinical research and internal use. Consult your institution's compliance team before deploying in a production clinical environment.
