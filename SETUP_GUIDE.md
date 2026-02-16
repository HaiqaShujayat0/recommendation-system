# GLYERAL UI — Setup Guide & Architecture

This is a **fresh React frontend** for the GLYERAL physician decision-support mockup. It reuses **UI ideas and flows** from the original monolithic file but is built with a clean structure, dummy data, and room for a real backend later.

---

## How to run locally

### 1. Create and enter the project (if not already done)

```bash
cd c:\Users\my\Downloads\recommendation_system\glyeral-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Then open the URL shown (e.g. `http://localhost:5173`) in your browser.

### 4. Build for production (optional)

```bash
npm run build
npm run preview
```

---

## Project structure (folders & files)

```
glyeral-ui/
├── index.html                 # Single HTML entry; loads /src/main.jsx
├── package.json               # Dependencies (React, Vite, Tailwind, lucide-react)
├── vite.config.js             # Vite config (React plugin)
├── tailwind.config.js         # Tailwind theme (fonts, primary colors)
├── postcss.config.js          # PostCSS for Tailwind
├── SETUP_GUIDE.md             # This file
│
└── src/
    ├── main.jsx               # React root; mounts <App /> and global CSS
    ├── App.jsx                # Root component: dashboard vs patient flow, sidebar, screen routing
    ├── index.css               # Tailwind directives + small global styles
    │
    ├── data/
    │   └── dummyData.js        # All mock data: patients, stats, recommendations, audit logs, nav, empty form state
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx      # Top bar: logo, title, patient name (when selected), menu toggle
    │   │   └── Sidebar.jsx     # Left nav when patient selected; key metrics box
    │   │
    │   ├── dashboard/
    │   │   ├── PatientCard.jsx      # One row in the patient list (avatar, name, MR#, HbA1c)
    │   │   ├── PatientSearch.jsx   # Search input, “New Patient”, stats, list of PatientCards
    │   │   └── StatsCards.jsx      # KPI cards (e.g. Patients Today, Pending Reviews)
    │   │
    │   ├── patient/
    │   │   └── PatientDetailPlaceholder.jsx   # Placeholder for Demographics / Conditions / Labs / Glucose / Meds
    │   │
    │   ├── recommendations/
    │   │   ├── MedicationCard.jsx     # Single recommendation card (dose, confidence, accept/modify/reject)
    │   │   └── RecommendationList.jsx # “Generate” button, loading, list by category, Modify modal
    │   │
    │   └── audit/
    │       └── AuditTable.jsx   # Audit trail table with filters and export button
    │
    └── (no hooks/ or pages/ yet — can add when you add routing or more logic)
```

---

## What each part does

### Entry & global

- **index.html**  
  Loads `main.jsx`. Title and Google Fonts (DM Sans, Outfit) are set here.

- **main.jsx**  
  Renders `<App />` into `#root` and imports `index.css` (Tailwind + base styles).

- **App.jsx**  
  - Holds global state: `selectedPatient`, `currentScreen`, `sidebarOpen`, `patientData`.
  - If no patient is selected → shows **PatientSearch** (dashboard).
  - If a patient is selected → shows **Header** (with patient name), **Sidebar** (nav + key metrics), and main content based on `currentScreen`: demographics → conditions → labs → glucose → medications → recommendations → audit.
  - “Back to Search” clears patient and returns to dashboard.

### Data (dummy only)

- **src/data/dummyData.js**  
  Single place for all mock data:
  - **PATIENTS** — list for dashboard search.
  - **DASHBOARD_STATS** — KPI values for StatsCards.
  - **SAMPLE_RECOMMENDATIONS** — recommendations shown after “Generate”.
  - **AUDIT_LOGS** — rows for AuditTable.
  - **NAV_ITEMS** — sidebar links (id, iconId, label).
  - **EMPTY_PATIENT_DATA** — initial form state for “New Patient”.

When you add a backend, replace reads from this file with API calls (e.g. `fetch` or a client like axios); keep the same shapes so components need minimal changes.

### Layout

- **Header.jsx**  
  Logo “GLYERAL”, subtitle, and (when a patient is selected) patient name/MR# and a menu button that toggles the sidebar on small screens.

- **Sidebar.jsx**  
  Renders only when a patient is selected and `open` is true. Shows “Back to Search”, nav buttons (Demographics, Health Issues, Lab Values, etc.), and a “Key Metrics” block (HbA1c, eGFR, BMI from `patientData`). Uses `NAV_ITEMS` and an icon map.

### Dashboard

- **PatientSearch.jsx**  
  Search input (filters by name or MR number), “New Patient” button, **StatsCards**, and a list of **PatientCard**s. Uses **PATIENTS** from dummy data. Clicking a patient or “New Patient” calls `onSelectPatient` / `onNewPatient` so App switches to patient flow.

- **PatientCard.jsx**  
  One clickable row: avatar, name, MR# • age • gender, HbA1c (colored by value). Calls `onSelect(patient)` when clicked.

- **StatsCards.jsx**  
  Renders **DASHBOARD_STATS** as three KPI cards with labels and value styling.

### Patient flow (placeholders + recommendations + audit)

- **PatientDetailPlaceholder.jsx**  
  Used for Demographics, Conditions, Labs, Glucose, Medications. Shows a title, short description, and “Next” (or “Get AI Recommendations”) so the flow is navigable. You can replace each usage with real form components later; `patientData` is already in App state.

- **RecommendationList.jsx**  
  - “Generate Recommendations” loads **SAMPLE_RECOMMENDATIONS** after a short delay (loading state).
  - Shows a patient summary bar (HbA1c, eGFR, BMI from `patientData`).
  - Groups recommendations by category and renders each with **MedicationCard**.
  - Tracks accept / modify / reject per recommendation; “Modify” opens a simple modal that saves modified dose and notes and marks status as modified.
  - Shows a “Decision Summary” and “Submit All Decisions” when any action is taken (submit is UI-only for now).

- **MedicationCard.jsx**  
  One recommendation: medication name, dose, confidence bar, status (approved / warning / modified / blocked), guidelines/warnings snippet, and Accept / Modify / Reject buttons. Can show an “action badge” (Accepted / Modified / Rejected) when the user has acted.

- **AuditTable.jsx**  
  Table of **AUDIT_LOGS** with columns: ID, Time, Status, Medications, Confidence, Action. Includes From/To date inputs and a Status filter (All / Approved / Modified / Rejected) and an “Export” button (no real export yet).

---

## Design & UX choices

- **Tailwind** for layout and styling; **primary** color palette in `tailwind.config.js` for a consistent blue theme.
- **Lucide React** for icons (Brain, User, Pill, etc.).
- **DM Sans** for body, **Outfit** for headings (`font-display`) for a clean, modern look.
- **Responsive**: sidebar can be toggled on small screens via the header menu; main content is scrollable and uses responsive grids where needed (e.g. stats, cards).

---

## What to do next

1. **Run the app** with `npm run dev` and click through: search → select patient → move through Demographics → … → Recommendations → Generate → Accept/Modify/Reject → Audit.
2. **Edit dummy data** in `src/data/dummyData.js` to add patients, change recommendations, or add audit rows.
3. **Replace placeholders** with real Demographics, Conditions, Labs, Glucose, and Medications forms; keep using `patientData` and `setPatientData` in App so the sidebar metrics and recommendation summary stay in sync.
4. **Plug in a backend**: add API functions (e.g. in `src/api/`), call them from App or from the new form components, and replace imports from `dummyData.js` with data from the server.

If you want, the next step can be: design the real form components (e.g. DemographicsForm, LabsForm) and where they read/write `patientData`, or sketch the API shape for patients and recommendations.
