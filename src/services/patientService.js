/**
 * Patient API — list, get by id, update.
 * Currently uses dummy data; replace with authFetch when backend is ready.
 */

// TODO: Real API — use base URL from env, e.g. import { authFetch } from './apiClient';
import { PATIENTS, EMPTY_PATIENT_DATA } from '../data/dummyData';

/** Simulated network delay (remove when using real API) */
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch all patients (e.g. for dashboard list).
 * TODO: Real API — return authFetch(`${API_BASE}/patients`).then(r => r.json());
 */
export async function fetchPatients() {
  await delay(400);
  return PATIENTS;
}

/**
 * Fetch a single patient's full data by id.
 * TODO: Real API — return authFetch(`${API_BASE}/patients/${id}`).then(r => r.json());
 */
export async function fetchPatientById(patientId) {
  await delay(300);
  if (patientId === 'new' || !patientId) {
    return EMPTY_PATIENT_DATA;
  }
  const id = Number(patientId);
  const summary = PATIENTS.find((p) => p.id === id);
  if (!summary) return null;
  // Dummy: return empty form structure; real API would return full patient record
  return { ...EMPTY_PATIENT_DATA, _summary: summary };
}

/**
 * Create or update patient data.
 * TODO: Real API — PATCH/PUT authFetch(`${API_BASE}/patients/${patientId}`, { method: 'PATCH', body: JSON.stringify(patientData) });
 */
export async function updatePatient(patientId, patientData) {
  await delay(400);
  if (patientId === 'new' || !patientId) {
    return { id: 0, ...patientData };
  }
  // Dummy: no-op; real API would persist and return updated record
  return { id: Number(patientId), ...patientData };
}
