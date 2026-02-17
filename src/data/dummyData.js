/**
 * Dummy data for GLYERAL UI — frontend-only mock.
 * Replace with API calls when backend is ready.
 */

// ——— PATIENTS (dashboard list + search) ———
export const PATIENTS = [
  {
    id: 1,
    mrNumber: 'MR-2024-001',
    name: 'John Smith',
    age: 58,
    gender: 'Male',
    lastVisit: '2024-12-15',
    hba1c: '8.2',
  },
  {
    id: 2,
    mrNumber: 'MR-2024-002',
    name: 'Maria Garcia',
    age: 62,
    gender: 'Female',
    lastVisit: '2024-12-18',
    hba1c: '7.5',
  },
  {
    id: 3,
    mrNumber: 'MR-2024-003',
    name: 'Robert Johnson',
    age: 45,
    gender: 'Male',
    lastVisit: '2024-12-19',
    hba1c: '9.1',
  },
  {
    id: 4,
    mrNumber: 'MR-2024-004',
    name: 'Sarah Chen',
    age: 51,
    gender: 'Female',
    lastVisit: '2024-12-10',
    hba1c: '6.8',
  },
  {
    id: 5,
    mrNumber: 'MR-2024-005',
    name: 'James Wilson',
    age: 67,
    gender: 'Male',
    lastVisit: '2024-12-12',
    hba1c: '7.9',
  },
];

// ——— DASHBOARD STATS (KPIs) ———
export const DASHBOARD_STATS = [
  { value: '12', label: 'Patients Today', color: 'primary' },
  { value: '3', label: 'Pending Reviews', color: 'amber' },
  { value: '89%', label: 'Acceptance Rate', color: 'green' },
];

// ——— SAMPLE RECOMMENDATIONS (for one patient profile) ———
export const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    med: 'Metformin',
    dose: '1000mg twice daily',
    originalDosage: '1000mg',
    confidence: 95,
    status: 'approved',
    guidelines: ['ADA 2025 First-line therapy'],
    warnings: [],
    category: 'Oral',
  },
  {
    id: 2,
    med: 'Farxiga',
    dose: '10mg once daily',
    originalDosage: '10mg',
    confidence: 88,
    status: 'approved',
    guidelines: ['KDIGO 2024: CKD benefit', 'AHA: Heart failure protection'],
    warnings: [],
    category: 'Oral',
  },
  {
    id: 3,
    med: 'Semaglutide',
    dose: '0.5mg weekly → titrate to 1mg',
    originalDosage: '0.5mg',
    confidence: 88,
    status: 'approved',
    guidelines: ['ADA: Weight loss benefit', 'AHA: CV risk reduction'],
    warnings: ['Start low, titrate slowly for GI tolerance'],
    category: 'Injectable',
  },
  {
    id: 4,
    med: 'Glargine (Before Dinner)',
    dose: '10 units before dinner',
    originalDosage: '10 units',
    confidence: 78,
    status: 'approved',
    guidelines: ['ADA: Basal insulin when HbA1c > 9%'],
    warnings: [],
    category: 'Insulin',
  },
  {
    id: 5,
    med: 'Glimepiride',
    dose: '2mg once daily before breakfast',
    originalDosage: '2mg',
    confidence: 55,
    status: 'warning',
    guidelines: ['Second-line if Metformin intolerant'],
    warnings: ['Hypoglycemia risk', 'Weight gain potential'],
    category: 'Oral',
  },
];

// ——— AUDIT TRAIL (compliance log) ———
export const AUDIT_LOGS = [
  {
    id: 'REQ-001',
    time: '2024-12-19 14:32',
    status: 'Approved',
    meds: 'Metformin 1000mg, Semaglutide 0.5mg',
    confidence: 91,
    action: 'Accepted - Dr. Smith',
  },
  {
    id: 'REQ-002',
    time: '2024-12-18 09:15',
    status: 'Modified',
    meds: 'Glargine 15u → 10u',
    confidence: 85,
    action: 'Reduced - patient preference',
  },
  {
    id: 'REQ-003',
    time: '2024-12-17 16:45',
    status: 'Rejected',
    meds: 'Glimepiride 4mg',
    confidence: 52,
    action: 'Hypoglycemia history',
  },
  {
    id: 'REQ-004',
    time: '2024-12-16 11:20',
    status: 'Approved',
    meds: 'Farxiga 10mg, Tradjenta 5mg',
    confidence: 87,
    action: 'Accepted - Dr. Lee',
  },
];

// ——— NAV ITEMS (sidebar when patient selected) ———
export const NAV_ITEMS = [
  { id: 'demographics', iconId: 'User', label: 'Demographics' },
  { id: 'conditions', iconId: 'Activity', label: 'Health Issues' },
  { id: 'labs', iconId: 'FlaskConical', label: 'Lab Values' },
  { id: 'glucose', iconId: 'Droplets', label: 'Blood Sugar' },
  { id: 'medications', iconId: 'Pill', label: 'Medications' },
  { id: 'recommendations', iconId: 'Brain', label: 'AI Recommendations' },
  { id: 'audit', iconId: 'FileText', label: 'Audit Trail' },
];

// ——— EMPTY PATIENT FORM STATE (for "New Patient") ———
export const EMPTY_PATIENT_DATA = {
  demographics: {
    mrNumber: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    age: 0,
    weight: '',
    height: '',
    bmi: 0,
  },
  healthIssues: {
    dm: true,
    ckd: false,
    cad: false,
    hypertension: false,
    pregnancy: false,
    neuropathy: false,
    retinopathy: false,
    obesity: false,
  },
  labs: {
    hba1c: '',
    egfr: '',
    creatinine: '',
    lipidPanel: '',
    urineAlbumin: '',
  },
  bloodSugar: {
    beforeBreakfast: '',
    beforeLunch: '',
    beforeDinner: '',
    beforeBed: '',
    average: 0,
  },
  medications: {
    metformin: 0,
    glimepiride: 0,
    tradjenta: false,
    farxiga: 0,
    semaglutide: 0,
    glargine: 0,
  },
};
