/**
 * Patient API — list, get by id, create, update.
 * All requests attach the auth token via authFetch.
 */
import { authFetch } from './apiClient';

const PATIENTS_BASE =
  import.meta.env.VITE_PATIENTS_BASE_URL || 'http://localhost:8002';

/**
 * Fetch patients list (dashboard).
 * Supports query, org_id, is_active, limit, offset filters.
 */
export async function fetchPatients({ query, org_id, is_active, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (query)              params.set('query', query);
  if (org_id)             params.set('org_id', org_id);
  if (is_active !== undefined) params.set('is_active', is_active);
  params.set('limit', limit);
  params.set('offset', offset);



  const res = await authFetch(`${PATIENTS_BASE}/patients?${params}`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  const json = await res.json();
  // API returns { data: { items, total, limit, offset } }
  return json.data?.items ?? json;
}

/**
 * Fetch a single patient's full data by UUID.
 */
export async function fetchPatientById(patientId) {
  if (!patientId || patientId === 'new') return null;
  const res = await authFetch(`${PATIENTS_BASE}/patients/${patientId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch patient');
  return res.json();
}

/**
 * Create a new patient.
 * Returns the full patient object (including the real UUID from the backend).
 */
export async function createPatient(data) {
  const res = await authFetch(`${PATIENTS_BASE}/patients`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.status === 409) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'A patient with this email or MRN already exists.');
  }
  if (!res.ok) throw new Error('Failed to create patient');
  return res.json();
}


/**
 * Update an existing patient (partial update — send only changed fields).
 */
export async function updatePatient(patientId, data) {
  const res = await authFetch(`${PATIENTS_BASE}/patients/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
}
